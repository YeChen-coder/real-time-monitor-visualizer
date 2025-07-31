Of course. Here is the complete Product Requirements Document, including the final validation report and the official handoff prompts for the next agents in our workflow.

This document now represents the complete and approved plan for the MVP.

***

# **Real-time Window Activity Visualizer for Body Doubling Product Requirements Document (PRD)**

## **Goals and Background Context**

### **Goals**

* The application must visually represent open application windows on a local web page.
* The visualization must not expose sensitive window content, ensuring user privacy.
* The web page must be streamable as a source in OBS.
* The application should display the application's name for most windows and the specific tab title for web browsers.
* The display should update in near real-time (allowing for a minor delay of up to 5 seconds).
* The visual style must implement a "frosted glass" (morphism) aesthetic.
* The display must feature a dynamic, overlapping stack layout where the active window is always prominent.

### **Background Context**

Traditional screen sharing is too invasive for body doubling streams, as it risks exposing private or sensitive information like messages, work documents, or personal files. Existing window management tools are not designed for this specific use case, lacking the privacy-preserving visual output needed for OBS integration. This project aims to solve that problem by creating a local web-based visualizer. It will offer an engaging and aesthetic way for streamers to convey their activity and maintain a connection with their audience, without sacrificing privacy. The solution focuses on a "frosted glass" look and a dynamic stacked layout to make the activity feed visually interesting and clear.

### **Change Log**

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| July 30, 2025 | 1.0 | Initial PRD creation | John, Product Manager |

---
## **Requirements**

### **Functional**

1.  **FR1:** The system must run as a local web page, accessible via a local server, to be used as an OBS browser source.
2.  **FR2:** The application must read and display a list of all currently open application windows on the host machine.
3.  **FR3:** For general applications (e.g., Notion, OneNote), the visual representation must display only the application's name.
4.  **FR4:** For web browser applications, the visual representation must display the title of the currently active tab.
5.  **FR5:** The display must arrange the window representations in a dynamic, overlapping stack.
6.  **FR6:** The representation of the currently active window must always be displayed at the top of the stack.
7.  **FR7:** The representations of inactive windows should be layered behind the active one in a visually receding order.

### **Non-Functional**

1.  **NFR1:** The user interface must feature a "frosted glass" (morphism) visual aesthetic.
2.  **NFR2:** The application must be lightweight and not consume excessive system resources.
3.  **NFR3:** The delay between a window state change (e.g., switching active window) and the visual update on the web page must be no more than 5 seconds.
4.  **NFR4:** The component responsible for interacting with the operating system to get window information must be written in Python.
5.  **NFR5:** The frontend web page must communicate with the Python backend via a simple local server connection.
6.  **NFR6:** The application must operate exclusively on the Windows operating system.

---
## **User Interface Design Goals**

### **Overall UX Vision**

The user experience should be entirely passive and visual. The goal is to create an aesthetically pleasing, "glanceable" interface that provides a sense of activity without demanding interaction. The vision is for a clean, modern, and almost artistic representation of workflow, using the "frosted glass" effect and dynamic motion to create an engaging visual for a stream audience. It's a piece of data art, not a functional tool to be clicked on.

### **Key Interaction Paradigms**

* **Passive Information Radiator:** The UI's primary role is to automatically display information without user input. It passively reflects the user's windowing activity on their operating system.
* **Dynamic Layering:** The core interaction model is the automatic management of a visual stack. The active window is always brought to the front with prominence, while inactive windows recede, creating a sense of depth and history.
* **Fluid Motion:** Transitions between active windows (shuffling the stack) should be smooth and fluid, reinforcing the real-time, dynamic nature of the display.

### **Core Screens and Views**

* **Main Visualization Canvas:** For the MVP, there is only one view: the canvas where the window representations are displayed. There are no settings, menus, or other interactive pages.

### **Accessibility: None**

* **Assumption:** For the initial MVP, formal accessibility compliance (like WCAG) is not a primary requirement, as this is a visual tool for a stream overlay. However, the design should still strive for basic readability (e.g., sufficient text contrast against the "frosted glass" background) as part of good visual design.

### **Branding**

* **Core Aesthetic:** The central branding element is the "frosted glass" / morphism style. This involves blurred backgrounds, semi-transparent surfaces, and soft shadows to create a sense of depth and texture.
* **Assumption:** No specific brand color palette or typography has been provided. The initial design will use a neutral palette (whites, grays, soft blues) and a clean, legible sans-serif font (like Inter or Poppins) that complements the modern, minimalist aesthetic. This is a placeholder and can be easily changed.

### **Target Device and Platforms: Desktop Only**

* This application is designed to be a web page rendered on a desktop and captured via OBS. It is not intended to be responsive for mobile or tablet viewing. Its layout will be optimized for a standard desktop aspect ratio.

---
## **Technical Assumptions**

I have reviewed the `technical-preferences.md` file and found no pre-existing preferences, so I am making the following recommendations based on the project goals.

### **Repository Structure: Monorepo**

* **Recommendation:** A single "monorepo" will contain both the Python backend and the frontend web application.
* **Rationale:** For a small project with two tightly coupled parts, a monorepo simplifies development. It allows for easier management of both the server and the UI from one place and streamlines the process of running them together locally.

### **Service Architecture**

* **Recommendation:** A local client-server architecture.
* **Rationale:** This is the simplest and most direct approach. A Python script will act as the local server, responsible for gathering window information from the OS. The web-based UI will act as the client, connecting to the local Python server to receive and display the data. This aligns with the brief's request for a "simple local server for communication".

### **Testing Requirements**

* **Recommendation:** Unit tests only for the MVP.
* **Rationale:** To keep the scope focused, we will prioritize unit tests for the core Python logic (e.g., correctly parsing window titles, differentiating browsers from other apps). This ensures the most critical part of the application is reliable without the overhead of a full testing pyramid for this personal tool.

### **Additional Technical Assumptions and Requests**

* **Frontend Framework:** I recommend **React** (using the **Vite** tool for a fast development environment).
    * **Rationale:** React is excellent for creating dynamic user interfaces like the one described. Vite provides a very simple and fast setup, which is ideal for this project's scale. Since you had no strong preference, this is a modern, popular, and well-supported choice.
* **Real-time Communication:** I recommend using **WebSockets** for communication between the Python backend and the React frontend.
    * **Rationale:** WebSockets will allow the Python server to instantly "push" updates to the web page whenever the active window changes. This is more efficient and provides a better real-time feel than having the webpage constantly ask the server for updates.
* **Python Backend Libraries:** The Python application will need specific libraries to function. I assume the use of:
    * `pygetwindow` or a similar library to get active window titles on Windows.
    * `websockets` to implement the WebSocket server for real-time communication with the frontend.

---
## **Epic List**

1.  **Epic 1: Foundational Setup & Core Logic**
    * **Goal:** Establish the complete data pipeline from the operating system to the web browser, proving that window titles can be captured and displayed in near real-time. This epic delivers a functional, but visually basic, version of the application.

2.  **Epic 2: Dynamic UI & Visual Polish**
    * **Goal:** Transform the basic display from Epic 1 into the final, aesthetically pleasing product by implementing the "frosted glass" UI, dynamic stacked layout, and fluid animations.

---
## **Epic 1: Foundational Setup & Core Logic**

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
## **Epic 2: Dynamic UI & Visual Polish**

**Goal:** This epic will take the functional but basic application from Epic 1 and implement the final visual design. The focus is purely on the frontend, transforming the plain text display into an engaging and aesthetically pleasing interface with the "frosted glass" effect, dynamic stacking, and fluid animations.

### **Story 2.1: Frosted Glass Window Component**

**As a** user,
**I want** each window to be represented by a "frosted glass" style component,
**so that** the visualizer has a modern and clean aesthetic.

#### Acceptance Criteria

1.  A reusable React component (`WindowCard`) is created to display the information for a single window.
2.  The `WindowCard` component uses CSS to create a "frosted glass" or morphism effect (e.g., using `backdrop-filter: blur()`).
3.  The component displays the window's title with a clean, legible font that contrasts well with the background.
4.  The simple list of window titles from Epic 1 is replaced by a set of these new `WindowCard` components.

### **Story 2.2: Dynamic Stack Layout**

**As a** user,
**I want** to see the window representations arranged in a dynamic, overlapping stack,
**so that** there is a clear sense of visual hierarchy and depth.

#### Acceptance Criteria

1.  The `WindowCard` components are positioned on the screen using CSS absolute positioning.
2.  The component corresponding to the *active* window is given the highest `z-index` to ensure it always appears on top.
3.  Inactive windows are layered behind the active window.
4.  The active window's `WindowCard` is visually prominent (e.g., centered and larger), while inactive cards are offset and smaller.

### **Story 2.3: Fluid Animation for Active Window Changes**

**As a** user,
**I want** the stack of windows to animate smoothly when the active window changes,
**so that** the experience feels fluid and engaging.

#### Acceptance Criteria

1.  When the active window changes, the `WindowCard` components smoothly transition to their new positions and sizes.
2.  The new active `WindowCard` animates to the prominent, front position.
3.  The previously active `WindowCard` animates to its new position in the background stack.
4.  The animation is quick and non-disruptive (completes within approximately 500ms).

### **Story 2.4: Receding History Effect**

**As a** user,
**I want** previously used windows to recede into the background,
**so that** I get a sense of my recent activity history.

#### Acceptance Criteria

1.  Inactive `WindowCard` components are styled based on their recency.
2.  Windows further back in the stack are progressively smaller and/or more transparent.
3.  To avoid clutter, the display is limited to a maximum number of recent windows (e.g., the 5 most recent).
4.  The order of the inactive windows correctly reflects the order in which they were last active.

---
## **Checklist Results Report**

The PRD has been validated against the `pm-checklist`. The document is comprehensive, well-structured, and appropriately scoped for MVP development. All sections are considered complete and ready for the next phase of the BMad workflow.

| Category | Status | Critical Issues |
| :--- | :--- | :--- |
| 1. Problem Definition & Context | ✅ PASS | None |
| 2. MVP Scope Definition | ✅ PASS | None |
| 3. User Experience Requirements | ✅ PASS | None |
| 4. Functional Requirements | ✅ PASS | None |
| 5. Non-Functional Requirements | ✅ PASS | None |
| 6. Epic & Story Structure | ✅ PASS | None |
| 7. Technical Guidance | ✅ PASS | None |
| 8. Cross-Functional Requirements | ✅ PASS | None |
| 9. Clarity & Communication | ✅ PASS | None |

**Final Decision:** ✅ **READY FOR ARCHITECT**

---
## **Next Steps**

This PRD is now complete. The following prompts are to be used to hand off the project to the next specialists in the workflow.

### **UX Expert Prompt**

"Please review this completed PRD and create the **UI/UX Specification** (`front-end-spec.md`). Your focus should be on detailing the visual and interaction design based on the 'frosted glass' aesthetic, dynamic stacking, and fluid animations specified in the PRD. Define the information architecture (which is simple for this project), user flows, and specific component states required to bring the vision to life."

### **Architect Prompt**

"Please review this completed PRD and the forthcoming UI/UX Specification to create the **Fullstack Architecture Document** (`fullstack-architecture.md`). The key technical constraints and decisions have been made: a Python backend using WebSockets, a React (Vite) frontend, and a monorepo structure. Your task is to create the detailed technical blueprint, including the specific data models to be passed between back and front, the monorepo source tree structure, component interface designs, and the API contract for the WebSocket communication."