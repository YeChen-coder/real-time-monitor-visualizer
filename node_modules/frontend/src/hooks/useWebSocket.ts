import { useState, useEffect, useRef, useCallback } from 'react';

interface WindowInfo {
  title: string;
  visible: boolean;
  minimized: boolean;
  active: boolean;
  is_browser: boolean;
  window_type: 'application' | 'browser';
  browser_name?: string;
  tab_title?: string;
}

interface WindowData {
  active_window_title: string | null;
  window_count: number;
  windows: WindowInfo[];
  timestamp: number;
}

interface UseWebSocketReturn {
  activeWindow: string | null;
  allWindows: WindowInfo[];
  windowCount: number;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
  reconnect: () => void;
}

const WEBSOCKET_URL = 'ws://localhost:8765';
const RECONNECT_DELAY = 3000; // 3 seconds

export const useWebSocket = (): UseWebSocketReturn => {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [allWindows, setAllWindows] = useState<WindowInfo[]>([]);
  const [windowCount, setWindowCount] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [shouldReconnect, setShouldReconnect] = useState(true);
  
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current || websocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      setConnectionStatus('connecting');
      setError(null);
      
      const ws = new WebSocket(WEBSOCKET_URL);
      websocketRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        setError(null);
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        
        try {
          const data: WindowData = JSON.parse(event.data);
          console.log('Received window data:', data);
          
          setActiveWindow(data.active_window_title);
          setAllWindows(data.windows || []);
          setWindowCount(data.window_count || 0);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
          setError('Failed to parse message from server');
        }
      };

      ws.onclose = (event) => {
        if (!mountedRef.current) return;
        
        console.log('WebSocket closed:', event.code, event.reason);
        setConnectionStatus('disconnected');
        websocketRef.current = null;

        // Attempt to reconnect if not closed intentionally
        if (shouldReconnect && event.code !== 1000) {
          console.log(`Reconnecting in ${RECONNECT_DELAY}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current && shouldReconnect) {
              connect();
            }
          }, RECONNECT_DELAY);
        }
      };

      ws.onerror = (event) => {
        if (!mountedRef.current) return;
        
        console.error('WebSocket error:', event);
        setConnectionStatus('error');
        setError('Connection error - make sure the backend server is running');
      };

    } catch (err) {
      if (!mountedRef.current) return;
      
      console.error('Failed to create WebSocket connection:', err);
      setConnectionStatus('error');
      setError('Failed to connect to server');
    }
  }, [shouldReconnect]);

  const reconnect = useCallback(() => {
    setShouldReconnect(true);
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    connect();
  }, [connect]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      setShouldReconnect(false);
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (websocketRef.current) {
        websocketRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [connect]);

  return {
    activeWindow,
    allWindows,
    windowCount,
    connectionStatus,
    error,
    reconnect,
  };
};