#!/usr/bin/env python3
"""
Real-time Window Visualizer - Backend
A Python backend for detecting and broadcasting window information.
"""

import asyncio
import json
import time
import websockets
import pygetwindow as gw
from typing import List, Optional, Set


def is_browser_window(title: str) -> bool:
    """
    Determine if a window title indicates a browser window.
    
    Args:
        title (str): Window title to check
        
    Returns:
        bool: True if this appears to be a browser window
    """
    browser_indicators = [
        'Microsoft Edge', 'Google Chrome', 'Mozilla Firefox', 
        'Safari', 'Opera', 'Brave', 'Vivaldi', 'Internet Explorer'
    ]
    
    # Check if any browser name appears in the title
    title_lower = title.lower()
    for browser in browser_indicators:
        if browser.lower() in title_lower:
            return True
    
    # Common browser patterns (e.g., "- Google Chrome", "- Mozilla Firefox")
    if ' - ' in title and any(browser.lower() in title_lower for browser in browser_indicators):
        return True
        
    return False


def extract_browser_info(title: str) -> dict:
    """
    Extract browser name and tab title from a browser window title.
    
    Args:
        title (str): Browser window title
        
    Returns:
        dict: Browser information with 'browser_name' and 'tab_title'
    """
    browser_patterns = {
        'Microsoft Edge': ['Microsoft Edge', 'Edge'],
        'Google Chrome': ['Google Chrome', 'Chrome'],
        'Mozilla Firefox': ['Mozilla Firefox', 'Firefox'],
        'Safari': ['Safari'],
        'Opera': ['Opera'],
        'Brave': ['Brave'],
        'Vivaldi': ['Vivaldi'],
        'Internet Explorer': ['Internet Explorer', 'IE']
    }
    
    detected_browser = 'Unknown Browser'
    tab_title = title
    
    # Try to detect browser and extract tab title
    for browser_name, patterns in browser_patterns.items():
        for pattern in patterns:
            if pattern in title:
                detected_browser = browser_name
                # Try to extract tab title (usually everything before " - BrowserName")
                if f' - {pattern}' in title:
                    tab_title = title.split(f' - {pattern}')[0].strip()
                elif f' — {pattern}' in title:  # Some browsers use em dash
                    tab_title = title.split(f' — {pattern}')[0].strip()
                break
        if detected_browser != 'Unknown Browser':
            break
    
    return {
        'browser_name': detected_browser,
        'tab_title': tab_title if tab_title != title else title
    }


def get_all_visible_windows() -> List[dict]:
    """
    Get a list of all visible windows with their titles, browser detection, and basic info.
    
    Returns:
        List[dict]: List of window information dictionaries
    """
    windows = []
    try:
        all_windows = gw.getAllWindows()
        for window in all_windows:
            # Filter out windows with empty titles or minimized windows
            if window.title.strip() and window.visible and not window.isMinimized:
                window_info = {
                    'title': window.title,
                    'visible': window.visible,
                    'minimized': window.isMinimized,
                    'active': False,  # Will be set by active window detection
                    'is_browser': False,
                    'window_type': 'application'
                }
                
                # Check if this is a browser window
                if is_browser_window(window.title):
                    browser_info = extract_browser_info(window.title)
                    window_info.update({
                        'is_browser': True,
                        'window_type': 'browser',
                        'browser_name': browser_info['browser_name'],
                        'tab_title': browser_info['tab_title']
                    })
                
                windows.append(window_info)
                
    except Exception as e:
        print(f"Error getting visible windows: {e}")
    
    return windows


def get_active_window_title() -> Optional[str]:
    """
    Get the title of the currently active window.
    
    Returns:
        Optional[str]: Active window title or None if not found
    """
    try:
        active_window = gw.getActiveWindow()
        if active_window and active_window.title.strip():
            return active_window.title
    except Exception as e:
        print(f"Error getting active window: {e}")
    
    return None


# Global set to track connected WebSocket clients
connected_clients: Set[websockets.WebSocketServerProtocol] = set()


async def register_client(websocket: websockets.WebSocketServerProtocol):
    """Register a new WebSocket client."""
    connected_clients.add(websocket)
    print(f"Client connected. Total clients: {len(connected_clients)}")


async def unregister_client(websocket: websockets.WebSocketServerProtocol):
    """Unregister a WebSocket client."""
    connected_clients.discard(websocket)
    print(f"Client disconnected. Total clients: {len(connected_clients)}")


async def broadcast_message(message: dict):
    """Broadcast a message to all connected clients."""
    if connected_clients:
        json_message = json.dumps(message)
        # Create a copy of the set to avoid issues if clients disconnect during broadcast
        clients_copy = connected_clients.copy()
        
        for client in clients_copy:
            try:
                await client.send(json_message)
            except websockets.exceptions.ConnectionClosed:
                # Client disconnected, remove from set
                connected_clients.discard(client)


async def handle_client(websocket: websockets.WebSocketServerProtocol):
    """Handle individual WebSocket client connections."""
    await register_client(websocket)
    try:
        # Send initial complete window data
        initial_data = get_window_data_with_active()
        await websocket.send(json.dumps(initial_data))
        
        # Keep connection alive and handle incoming messages
        async for message in websocket:
            # For now, we just acknowledge received messages
            print(f"Received from client: {message}")
            
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        await unregister_client(websocket)


def get_window_data_with_active() -> dict:
    """
    Get complete window data including full list and active window identification.
    
    Returns:
        dict: Complete window data structure
    """
    all_windows = get_all_visible_windows()
    current_active_title = get_active_window_title()
    
    # Mark the active window in the list
    for window in all_windows:
        window['active'] = (window['title'] == current_active_title)
    
    return {
        'active_window_title': current_active_title,
        'window_count': len(all_windows),
        'windows': all_windows,
        'timestamp': time.time()
    }


async def monitor_windows_async():
    """
    Asynchronously monitor windows and broadcast changes to WebSocket clients.
    """
    print("Starting async window monitoring...")
    last_window_state = None
    
    while True:
        try:
            current_window_data = get_window_data_with_active()
            current_active = current_window_data['active_window_title']
            
            # Create a simple state signature to detect changes
            # (we compare active window + window count for efficiency)
            current_state = (current_active, current_window_data['window_count'])
            
            # Only broadcast when window state changes
            if current_state != last_window_state:
                await broadcast_message(current_window_data)
                
                if current_active:
                    safe_title = current_active.encode('ascii', 'replace').decode('ascii')
                    print(f"Broadcasting window update - Active: {safe_title}, Total: {current_window_data['window_count']} windows")
                else:
                    print(f"Broadcasting window update - No active window, Total: {current_window_data['window_count']} windows")
                    
                last_window_state = current_state
            
            # Wait 2-3 seconds before next check
            await asyncio.sleep(2.5)
            
        except Exception as e:
            print(f"Error in window monitoring: {e}")
            await asyncio.sleep(1)


async def start_websocket_server():
    """Start the WebSocket server."""
    print("Starting WebSocket server on localhost:8765")
    
    # Start the window monitoring task
    monitor_task = asyncio.create_task(monitor_windows_async())
    
    # Start the WebSocket server
    server = await websockets.serve(handle_client, "localhost", 8765)
    
    print("WebSocket server ready for connections")
    print("Window monitoring active - broadcasting changes to connected clients")
    
    # Keep the server running
    await asyncio.gather(server.wait_closed(), monitor_task)


async def main_async():
    """Async main entry point for the WebSocket server."""
    print("Real-time Window Visualizer Backend")
    print("Status: WebSocket server with window detection")
    
    # Test window detection
    print("\n--- Testing Window Detection ---")
    visible_windows = get_all_visible_windows()
    print(f"Found {len(visible_windows)} visible windows:")
    
    for i, window in enumerate(visible_windows[:3], 1):  # Show first 3 windows
        # Handle potential Unicode issues in window titles
        title = window['title'].encode('ascii', 'replace').decode('ascii')
        print(f"  {i}. {title}")
    
    if len(visible_windows) > 3:
        print(f"  ... and {len(visible_windows) - 3} more windows")
    
    current_active = get_active_window_title()
    if current_active:
        safe_active = current_active.encode('ascii', 'replace').decode('ascii')
        print(f"\nCurrent active window: {safe_active}")
    
    print("\n--- Starting WebSocket Server ---")
    await start_websocket_server()


def main():
    """Main entry point for the backend application."""
    try:
        asyncio.run(main_async())
    except KeyboardInterrupt:
        print("\nServer stopped.")


if __name__ == "__main__":
    main()