# **Epic 1: Foundational Setup & Core Logic**

**Goal:** This epic focuses on creating the foundational structure of the application and implementing the core data pipeline. By the end of this epic, we will have a functional system that correctly identifies open windows and their active state, and transmits this information from a Python backend to a React frontend for basic display. This proves the technical viability of the core concept before any visual polish is applied.

### **Story 1.1: Monorepo & Project Scaffolding**

**As a** developer,
**I want** a monorepo containing a placeholder Python backend and a placeholder React frontend,
**so that** I have a clean, organized structure for concurrent development.

#### Acceptance Criteria

1.  A new project directory is created and initialized as a Git repository.
2.  A monorepo structure is set up with an `apps` directory containing two packages: `frontend` and `backend`.
3.  The `frontend` package contains a default React application created using Vite.
4.  The `backend` package contains a basic `main.py` file.
5.  A root-level script is configured to run both the backend and frontend development servers concurrently with a single command.

### **Story 1.2: Python Backend - Window Detection**

**As a** system,
**I want** to detect all open, visible windows and identify the title of the currently active window,
**so that** I have the raw data needed for the visualizer.

#### Acceptance Criteria

1.  The Python script uses an appropriate library (e.g., `pygetwindow`) to get a list of all visible windows.
2.  The script can identify and retrieve the title of the currently active window.
3.  The script runs in a continuous loop, checking for the active window every 2-3 seconds.
4.  The script prints the active window's title to the console whenever a change in the active window is detected.

### **Story 1.3: Backend WebSocket Server**

**As the** backend,
**I want** to broadcast the current active window title over a WebSocket connection,
**so that** the frontend can receive the data in real-time.

#### Acceptance Criteria

1.  A WebSocket server is implemented in the Python script.
2.  The server starts on a designated local port (e.g., 8765).
3.  When a new frontend client connects, the server begins the window detection loop.
4.  Whenever the active window changes, the new title is sent as a JSON message (e.g., `{"active_window_title": "New Title"}`) to all connected clients.

### **Story 1.4: Frontend WebSocket Client & Basic Display**

**As a** user viewing the web page,
**I want** to see the title of my currently active window displayed,
**so that** I can confirm the data pipeline is working.

#### Acceptance Criteria

1.  The React frontend establishes and maintains a WebSocket connection to the Python backend.
2.  The frontend listens for messages and updates its state with the received active window title.
3.  The current active window title is displayed on the page as plain text.
4.  The text on the web page updates automatically whenever the backend broadcasts a new active window title.

### **Story 1.5: Differentiate Browsers and Transmit Full Window List**

**As the** system,
**I want** to process the full list of open windows, differentiate between app names and browser tab titles, and transmit this complete, structured list to the frontend,
**so that** the UI has all the data needed for the future stacked display.

#### Acceptance Criteria

1.  The Python backend identifies the list of all visible windows, not just the active one.
2.  The backend logic distinguishes browser windows from other applications.
3.  A structured JSON message is constructed, containing a list of all open windows (differentiating browser tab titles from app names) and identifying which window is currently active.
4.  This complete, structured list is broadcast over the WebSocket whenever the set of open windows or the active window changes.
5.  The frontend receives the list and, for verification purposes, renders all window titles in a simple, unstyled list.

---