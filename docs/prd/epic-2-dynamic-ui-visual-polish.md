# **Epic 2: Dynamic UI & Visual Polish**

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