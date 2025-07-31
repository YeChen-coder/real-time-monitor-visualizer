# **Technical Assumptions**

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