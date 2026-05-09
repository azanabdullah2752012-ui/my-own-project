/**
 * Empire Cloud Sync — No-Database Edition
 * Uses JSONBlob (free, no-signup) to sync data across devices.
 * Password is hashed → unique key. Same password = same data on any device.
 */

const BASE = 'https://jsonblob.com/api/jsonBlob';

// Generate a stable 32-char hex ID from the user's password
const getSyncId = async (password) => {
  const msgUint8 = new TextEncoder().encode(`empire_os_v2_${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 24);
};

// We store the blob ID in localStorage so we don't create duplicates
const getBlobIdKey = (syncId) => `empire_blob_${syncId}`;

export const syncEmpireCloud = async (password, localData) => {
  const syncId = await getSyncId(password);
  const blobIdKey = getBlobIdKey(syncId);
  const existingBlobId = localStorage.getItem(blobIdKey);

  try {
    if (existingBlobId) {
      // Try to fetch existing blob
      const res = await fetch(`${BASE}/${existingBlobId}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const remoteData = await res.json();
        // Merge: remote wins for non-local fields, local wins for dashboard state
        return {
          ...remoteData,
          dashboard: localData.dashboard,
          system: { ...remoteData.system, ...localData.system }
        };
      }
    }

    // No blob yet → create one with local data
    const createRes = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(localData)
    });

    if (!createRes.ok) throw new Error('Failed to create cloud profile');
    const blobId = createRes.headers.get('X-jsonblob-id') || createRes.url.split('/').pop();
    localStorage.setItem(blobIdKey, blobId);
    console.log('Cloud Sync: New profile created:', blobId);
    return localData;

  } catch (err) {
    console.error('Sync Error:', err);
    throw new Error('Cloud unreachable. Check your connection.');
  }
};

export const pushToCloud = async (password, data) => {
  const syncId = await getSyncId(password);
  const blobIdKey = getBlobIdKey(syncId);
  const existingBlobId = localStorage.getItem(blobIdKey);

  try {
    if (existingBlobId) {
      await fetch(`${BASE}/${existingBlobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log('Cloud Sync: Data pushed.');
    } else {
      // Create new blob
      const createRes = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      if (createRes.ok) {
        const blobId = createRes.headers.get('X-jsonblob-id') || createRes.url.split('/').pop();
        localStorage.setItem(blobIdKey, blobId);
        console.log('Cloud Sync: New profile created:', blobId);
      }
    }
  } catch (err) {
    console.error('Push Error:', err);
    throw new Error('Failed to push to cloud.');
  }
};
