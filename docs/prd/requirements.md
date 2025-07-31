# **Requirements**

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