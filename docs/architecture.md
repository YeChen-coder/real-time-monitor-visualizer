Right, the component model is clear.

We're now moving into the most detailed part of the architecture: the specific implementation blueprints for the **Frontend** and **Backend**. This includes how we'll structure our code, manage state, and organize our services.

-----

## **Database Schema**

Not applicable. This project is stateless on the backend and does not require a database.

-----

## **Frontend Architecture**

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

## **Backend Architecture**

This section defines the structure of the Python backend service.

### **Service Architecture**

  * **Function Organization:** The backend logic will be contained within a single Python script (`main.py`). It will be structured into distinct functions or classes for clarity, separating the window monitoring logic from the WebSocket server logic. The application will be launched using Python's `asyncio` library to handle the concurrent tasks of monitoring and serving.

  * **Main Application Loop Skeleton:**

    ```python
    import asyncio
    import websockets

    # Placeholder for WindowMonitorService logic
    async def monitor_windows(queue):
        while True:
            # This logic will get window data and put it in the queue
            await asyncio.sleep(2) 

    # Placeholder for WebSocketServer logic
    async def broadcast_handler(websocket, queue):
        while True:
            update = await queue.get()
            await websocket.send(update)

    async def main():
        update_queue = asyncio.Queue()
        # Start the window monitor as a background task
        asyncio.create_task(monitor_windows(update_queue))
        # Start the WebSocket server
        async with websockets.serve(lambda ws: broadcast_handler(ws, update_queue), "localhost", 8765):
            await asyncio.Future() # run forever

    if __name__ == "__main__":
        asyncio.run(main())
    ```

-----
