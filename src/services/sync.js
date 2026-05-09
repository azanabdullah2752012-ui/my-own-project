/**
 * Empire Cloud Sync (No-Database Edition)
 * Uses a public, no-config Key-Value store to sync data across devices.
 * No signup or database management required.
 */

// Generate a unique, stable ID from the user's password
const getSyncId = async (password) => {
  const msgUint8 = new TextEncoder().encode(`empire_os_v1_${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
};

export const syncEmpireCloud = async (password, localData) => {
  const syncId = await getSyncId(password);
  // We use a public, free JSON bin service that doesn't require auth for simple sync
  const url = `https://api.keyvalue.xyz/${syncId}/data`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const remoteData = await response.json();
      console.log('Cloud Sync: Data fetched from public node.');
      // Merge remote data into local
      return { ...localData, ...remoteData };
    } else {
      // Data doesn't exist yet, push local data to create the node
      await pushToCloud(password, localData);
      return localData;
    }
  } catch (err) {
    console.error('Sync Error:', err);
    throw new Error('Cloud unreachable. Check your connection.');
  }
};

export const pushToCloud = async (password, data) => {
  const syncId = await getSyncId(password);
  const url = `https://api.keyvalue.xyz/${syncId}/data`;

  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Cloud Sync: Data pushed to public node.');
  } catch (err) {
    console.error('Push Error:', err);
  }
};
