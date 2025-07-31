#!/usr/bin/env python3
"""
Simple WebSocket client to test the backend server.
"""

import asyncio
import json
import websockets

async def test_client():
    """Test WebSocket client that connects to the backend server."""
    try:
        print("Connecting to WebSocket server at ws://localhost:8765")
        
        async with websockets.connect("ws://localhost:8765") as websocket:
            print("Connected! Listening for messages...")
            
            # Listen for messages for 15 seconds
            timeout_task = asyncio.create_task(asyncio.sleep(15))
            
            try:
                while not timeout_task.done():
                    # Wait for message with timeout
                    try:
                        message = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                        data = json.loads(message)
                        print(f"Received: {data}")
                    except asyncio.TimeoutError:
                        # No message received, continue listening
                        continue
                        
            except websockets.exceptions.ConnectionClosed:
                print("Connection closed by server")
                
    except ConnectionRefusedError:
        print("Error: Could not connect to WebSocket server")
        print("Make sure the backend server is running (python apps/backend/main.py)")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("WebSocket Test Client")
    print("This will connect to the backend and listen for active window updates")
    asyncio.run(test_client())
    print("Test completed")