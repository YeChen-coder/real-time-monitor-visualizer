import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import StackLayout from './StackLayout';

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
  onReconnect: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, error, onReconnect }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'connecting':
        return <span className="status connecting">🔄 Connecting...</span>;
      case 'connected':
        return <span className="status connected">✅ Connected</span>;
      case 'disconnected':
        return (
          <div className="status disconnected">
            <span>⚠️ Disconnected</span>
            <button onClick={onReconnect} className="reconnect-btn">
              Reconnect
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="status error">
            <span>❌ Error</span>
            <button onClick={onReconnect} className="reconnect-btn">
              Retry
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="connection-status">
      {getStatusDisplay()}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

// Legacy WindowListItem component - replaced by WindowCard
// Kept for reference but no longer used

const WindowDisplay: React.FC = () => {
  const { activeWindow, allWindows, windowCount, connectionStatus, error, reconnect } = useWebSocket();

  return (
    <div className="window-display">
      <h1>Real-Time Window Visualizer</h1>
      
      <ConnectionStatus 
        status={connectionStatus}
        error={error}
        onReconnect={reconnect}
      />

      <div className="active-window-section">
        <h2>Current Active Window</h2>
        <div className="window-title-container">
          {activeWindow ? (
            <p className="window-title">{activeWindow}</p>
          ) : (
            <p className="no-window">
              {connectionStatus === 'connected' 
                ? 'No active window detected' 
                : 'Waiting for connection...'}
            </p>
          )}
        </div>
      </div>

      <div className="all-windows-section">
        <h2>Window Stack Visualizer ({windowCount})</h2>
        {connectionStatus === 'connected' ? (
          <StackLayout windows={allWindows} />
        ) : (
          <div className="no-windows">
            <p>
              {connectionStatus === 'connecting' 
                ? 'Connecting to backend...' 
                : connectionStatus === 'error'
                ? 'Connection error - check backend'
                : 'Waiting for window data...'}
            </p>
          </div>
        )}
      </div>

      <div className="instructions">
        <h3>Instructions</h3>
        <ol>
          <li>Make sure the Python backend is running: <code>npm run dev:backend</code></li>
          <li>The backend will detect your active window changes and all open windows</li>
          <li>Switch between different applications to see real-time updates</li>
          <li>Browser windows show tab titles and browser names</li>
        </ol>
      </div>
    </div>
  );
};

export default WindowDisplay;