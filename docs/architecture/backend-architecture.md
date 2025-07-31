# **Backend Architecture**

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
