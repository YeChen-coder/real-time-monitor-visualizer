# **Frontend Architecture**

This section defines the specific patterns and structure for the React frontend application.

### **Component Architecture**

  * **Component Organization:** Components will be organized by feature and function within the `src` directory.
    ```text
    apps/web/src/
    ├── components/
    │   ├── visualization/
    │   │   ├── VisualizationCanvas.tsx
    │   │   └── WindowCard.tsx
    │   └── common/
    │       └── StatusIndicator.tsx
    ├── hooks/
    │   └── useWindowActivity.ts
    └── App.tsx
    ```
  * **Component Template (`WindowCard.tsx`):** All visual components will be typed functional components.
    ```typescript
    import React from 'react';
    import { WindowInfo } from '../../../packages/shared/src/types'; // Path assuming shared types

    interface WindowCardProps {
      windowInfo: WindowInfo;
      // Additional style props for animation will be added here
    }

    const WindowCard: React.FC<WindowCardProps> = ({ windowInfo }) => {
      const cardClasses = windowInfo.isActive ? 'active-card' : 'inactive-card';
      
      return (
        <div className={`window-card ${cardClasses}`}>
          <p>{windowInfo.title}</p>
        </div>
      );
    };

    export default WindowCard;
    ```

### **State Management Architecture**

  * **State Structure:** A custom hook, `useWindowActivity`, will manage the application's state.
    ```typescript
    // Inside useWindowActivity.ts
    const [activity, setActivity] = useState<WindowActivityPayload>({ windows: [] });
    ```
  * **State Management Patterns:** We will use standard React Hooks. The `useEffect` hook will manage the WebSocket connection's lifecycle (connecting, disconnecting), and the `useState` hook will hold the latest `WindowActivityPayload` received from the backend.

### **Routing Architecture**

  * **Route Organization:** Not applicable. This is a single-page application with no client-side routing.

### **Frontend Services Layer**

  * **API Client Setup:** All WebSocket logic will be encapsulated in the `useWindowActivity.ts` custom hook. This hook will be the single point of interaction with the backend for the entire UI.
    ```typescript
    // Skeleton for useWindowActivity.ts
    import { useState, useEffect } from 'react';
    import { WindowActivityPayload } from '../../../packages/shared/src/types';

    const WEBSOCKET_URL = 'ws://localhost:8765';

    export const useWindowActivity = () => {
      const [activity, setActivity] = useState<WindowActivityPayload>({ windows: [] });

      useEffect(() => {
        const ws = new WebSocket(WEBSOCKET_URL);

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setActivity(data);
        };

        // Cleanup on component unmount
        return () => {
          ws.close();
        };
      }, []); // Empty dependency array means this runs once on mount

      return activity;
    };
    ```

-----
