# **User Interface Design Goals**

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