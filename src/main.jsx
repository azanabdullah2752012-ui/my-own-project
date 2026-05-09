import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import './index.css';

// Global error boundary to prevent blank screens
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Empire OS crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', background: '#0a0a0f', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 16, fontFamily: 'system-ui'
        }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Empire OS encountered an error</div>
          <div style={{ fontSize: 13, color: '#888', maxWidth: 400, textAlign: 'center' }}>
            {this.state.error?.message}
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ 
              marginTop: 8, padding: '12px 24px', background: '#4D7CFE', 
              border: 'none', borderRadius: 10, color: '#fff', 
              fontSize: 14, fontWeight: 700, cursor: 'pointer' 
            }}>
            Reset & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <AppProvider>
      <App />
    </AppProvider>
  </ErrorBoundary>
);
