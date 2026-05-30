# Technical Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ChatScreen Component                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              State Management (React Hooks)          │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • messages: Message[]  (conversation timeline)       │   │
│  │ • inputValue: string   (controlled input field)      │   │
│  │ • isLoading: boolean   (async operation feedback)    │   │
│  │ • messagesEndRef: useRef (scroll anchor)             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Effects (useEffect Hooks)                │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • Auto-scroll effect: Triggered on messages change   │   │
│  │   └─ scrollIntoView({ behavior: 'smooth' })         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Event Handlers (Functions)                  │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • handleSendMessage()                                │   │
│  │   ├─ Input validation                                │   │
│  │   ├─ Create user message                             │   │
│  │   ├─ Add to state (instant)                          │   │
│  │   ├─ Clear input                                     │   │
│  │   ├─ 2-second delay (setTimeout)                     │   │
│  │   ├─ Generate AI response                            │   │
│  │   └─ Add to state                                    │   │
│  │                                                       │   │
│  │ • generateAIResponse()                               │   │
│  │   └─ Mockup function with pattern matching           │   │
│  │                                                       │   │
│  │ • handleKeyPress()                                   │   │
│  │   └─ Enter to send, Shift+Enter for new line        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Render Structure (JSX)                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Layout Hierarchy

```
.chat-screen-wrapper (Full viewport container)
│   ├─ display: flex
│   ├─ align-items: center
│   ├─ justify-content: center
│   ├─ padding: 1rem
│   └─ background: gradient
│
├─ .chat-bg-gradient (Animated decoration)
│   ├─ position: absolute
│   ├─ animation: float 20s infinite
│   └─ pointer-events: none
│
└─ .chat-container (Main window)
    ├─ max-width: 900px
    ├─ max-height: 700px
    ├─ display: flex
    ├─ flex-direction: column
    ├─ background: glassmorphism
    ├─ border: emerald accent
    └─ box-shadow: glow effect
    │
    ├─ .chat-header (Top section)
    │   ├─ padding: 1.5rem
    │   ├─ border-bottom: accent
    │   ├─ background: gradient
    │   │
    │   ├─ .chat-header-content
    │   │   ├─ .chat-title (Gradient text)
    │   │   └─ .chat-subtitle (Muted text)
    │   │
    │   └─ .chat-status-indicator (Pulsing dot)
    │
    ├─ .messages-container (Scrollable area)
    │   ├─ flex: 1
    │   ├─ overflow-y: auto
    │   ├─ padding: 2rem 1.5rem
    │   ├─ gap: 1rem
    │   ├─ scroll-behavior: smooth
    │   │
    │   ├─ (For each message)
    │   │   └─ .message-wrapper (Flex alignment)
    │   │       ├─ justify-content: flex-end (user)
    │   │       ├─ justify-content: flex-start (model)
    │   │       └─ animation: slideIn 0.4s
    │   │           │
    │   │           └─ .message-bubble
    │   │               ├─ max-width: 65%
    │   │               ├─ padding: 1rem 1.25rem
    │   │               ├─ border-radius: 16px
    │   │               ├─ border-radius: 4px (angled tip)
    │   │               ├─ color: user/model specific
    │   │               ├─ box-shadow: glow
    │   │               ├─ animation: bubble glow 2s infinite
    │   │               │
    │   │               ├─ .message-text
    │   │               └─ .message-timestamp
    │   │
    │   ├─ (Loading indicator)
    │   │   └─ .loading-dots
    │   │       ├─ .dot (animation: blink)
    │   │       ├─ .dot (animation: blink 0.2s delay)
    │   │       └─ .dot (animation: blink 0.4s delay)
    │   │
    │   └─ (Scroll anchor)
    │       └─ messagesEndRef.current
    │
    └─ .input-section (Bottom section)
        ├─ padding: 1.5rem
        ├─ border-top: accent
        ├─ background: gradient with transparency
        │
        └─ .input-wrapper
            ├─ display: flex
            ├─ align-items: flex-end
            ├─ background: dark with transparency
            ├─ border: 1px accent
            ├─ border-radius: 12px
            ├─ padding: 0.5rem
            ├─ transition: all 300ms
            │
            ├─ .message-input (textarea)
            │   ├─ flex: 1
            │   ├─ background: transparent
            │   ├─ border: none
            │   ├─ outline: none
            │   ├─ max-height: 120px
            │   ├─ resize: none
            │   └─ color: white
            │
            └─ .send-button (Icon button)
                ├─ width: 40px
                ├─ height: 40px
                ├─ border: none
                ├─ background: transparent
                ├─ color: accent (conditional)
                ├─ cursor: pointer
                ├─ transition: all 300ms
                │
                └─ .send-icon (SVG)
                    └─ Animation on hover: translate
```

---

## Data Flow Diagram

```
User Types Message
        │
        ▼
+─────────────────────────────┐
│ handleSendMessage() Triggered│
│ (Input field loses focus)   │
└─────────────────────────────┘
        │
        ▼
+─────────────────────────────┐
│ Input Validation             │
│ !inputValue.trim()           │
└─────────────────────────────┘
        │
        ├─ FALSE ─▶ Return (no action)
        │
        ▼ TRUE
+─────────────────────────────┐
│ Create User Message Object  │
│ {                            │
│   id: timestamp,             │
│   role: 'user',              │
│   text: trimmed input,       │
│   timestamp: ISO string      │
│ }                            │
└─────────────────────────────┘
        │
        ▼
+─────────────────────────────┐
│ Add User Message to State    │
│ messages.push(userMessage)   │
│ (Instantly, for UX response) │
└─────────────────────────────┘
        │
        ▼
+─────────────────────────────┐
│ Reset UI State              │
│ • inputValue = ''           │
│ • isLoading = true          │
└─────────────────────────────┘
        │
        ▼
+─────────────────────────────┐
│ Trigger useEffect           │
│ (messages array changed)    │
│        │                    │
│        ▼                    │
│ Auto-scroll to bottom       │
│ scrollIntoView({ smooth })  │
└─────────────────────────────┘
        │
        ▼
+─────────────────────────────┐
│ setTimeout 2 seconds        │
│ (Simulate backend delay)    │
└─────────────────────────────┘
        │
        ▼
+─────────────────────────────┐
│ generateAIResponse()         │
│ (Pattern matching)          │
│ Returns: response text      │
└─────────────────────────────┘
        │
        ▼
+─────────────────────────────┐
│ Create Model Message Object │
│ {                            │
│   id: timestamp+1,           │
│   role: 'model',             │
│   text: AI response,         │
│   timestamp: ISO string      │
│ }                            │
└─────────────────────────────┘
        │
        ▼
+─────────────────────────────┐
│ Add Model Message to State  │
│ messages.push(modelMessage) │
└─────────────────────────────┘
        │
        ▼
+─────────────────────────────┐
│ Trigger useEffect Again     │
│ (messages array changed)    │
│        │                    │
│        ▼                    │
│ Auto-scroll to bottom       │
│ (Reveals new AI message)    │
└─────────────────────────────┘
        │
        ▼
+─────────────────────────────┐
│ Clear Loading State         │
│ isLoading = false           │
│ (Remove three dots)         │
└─────────────────────────────┘
        │
        ▼
   ✨ DONE ✨
(Ready for next message)
```

---

## State Flow Diagram

```
              ┌─────────────────────────────────────────┐
              │     React Component Render Cycle        │
              └─────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
            ┌──────────────┐          ┌──────────────┐
            │   messages   │          │  inputValue  │
            │   (Array)    │          │  (String)    │
            └──────────────┘          └──────────────┘
                    │                         │
                    ├─────────────────────────┤
                    │                         │
                    ▼                         ▼
            ┌────────────────────────────────────────┐
            │     Re-render Components               │
            ├────────────────────────────────────────┤
            │ • Render each message bubble           │
            │ • Update input field value             │
            │ • Show/hide loading indicator          │
            │ • Update send button state             │
            └────────────────────────────────────────┘
                    │
                    ▼
            ┌────────────────────────────────────────┐
            │  useEffect Dependency Array: [messages]│
            ├────────────────────────────────────────┤
            │ Condition: messages length changed?    │
            │ Action: Auto-scroll to bottom          │
            └────────────────────────────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │  Component Display Updated │
         │  (Full lifecycle complete) │
         └────────────────────────────┘
```

---

## CSS Cascade Hierarchy

```
Global Styles (index.css)
├─ Root variables
├─ HTML/Body setup
└─ Base element styles
    │
    └─ Component Styles (ChatScreen.css)
        │
        ├─ Root Variables (--color-*, --shadow-*, --transition-*)
        │
        ├─ .chat-screen-wrapper (Container)
        │   ├─ Layout properties
        │   ├─ Background decoration
        │   └─ Responsive adjustments
        │
        ├─ .chat-container (Main window)
        │   ├─ Glassmorphism effect
        │   ├─ Shadow and border
        │   └─ Animation: slideUp
        │
        ├─ .chat-header (Title section)
        │   ├─ .chat-title (Gradient text)
        │   ├─ .chat-subtitle (Secondary text)
        │   └─ .chat-status-indicator (Pulsing animation)
        │
        ├─ .messages-container (Scrollable area)
        │   ├─ Scroll behavior and styling
        │   ├─ ::-webkit-scrollbar (Custom scrollbar)
        │   │
        │   ├─ .message-wrapper (Message alignment)
        │   │   ├─ .message-user (Right-aligned)
        │   │   └─ .message-model (Left-aligned)
        │   │
        │   ├─ .message-bubble (Message styling)
        │   │   ├─ .message-bubble.message-user
        │   │   │   ├─ Color: emerald tint
        │   │   │   ├─ Border-radius: 16px 16px 4px 16px
        │   │   │   └─ Box-shadow: glow
        │   │   │
        │   │   ├─ .message-bubble.message-model
        │   │   │   ├─ Color: subtle white
        │   │   │   ├─ Border-radius: 16px 16px 16px 4px
        │   │   │   └─ Box-shadow: subtle
        │   │   │
        │   │   ├─ .message-text
        │   │   └─ .message-timestamp
        │   │
        │   └─ .loading-dots (Three-dot animation)
        │       ├─ .dot (animation: blink)
        │       ├─ .dot (delay: 0.2s)
        │       └─ .dot (delay: 0.4s)
        │
        ├─ .input-section (Bottom section)
        │   │
        │   └─ .input-wrapper (Input container)
        │       ├─ .message-input (Textarea)
        │       │   ├─ Flex: 1
        │       │   ├─ Resizable: false
        │       │   ├─ Max-height: 120px
        │       │   └─ Placeholder styling
        │       │
        │       └─ .send-button (Send icon)
        │           ├─ Width: 40px
        │           ├─ :hover state
        │           ├─ :active state
        │           ├─ :disabled state
        │           └─ .send-icon (SVG transform)
        │
        ├─ Animations (@keyframes)
        │   ├─ slideUp (entrance)
        │   ├─ messageSlide (message appearance)
        │   ├─ bubbleGlow (message glow)
        │   ├─ pulse (status indicator)
        │   ├─ blink (loading dots)
        │   ├─ float (background decoration)
        │   └─ [hover animations]
        │
        └─ Media Queries
            ├─ @media (max-width: 768px) [Tablet]
            │   ├─ Reduced padding
            │   ├─ Adjusted font sizes
            │   └─ Container tweaks
            │
            ├─ @media (max-width: 480px) [Mobile]
            │   ├─ Compact layout
            │   ├─ Hidden elements
            │   └─ Optimized spacing
            │
            ├─ @media (prefers-reduced-motion: reduce)
            │   └─ Disable all animations
            │
            ├─ @media (prefers-color-scheme: light)
            │   └─ Light mode colors
            │
            └─ @media (prefers-contrast: more)
                └─ Increased contrast
```

---

## Component Lifecycle

```
┌──────────────────────────────────────────┐
│  1. Initial Render                       │
├──────────────────────────────────────────┤
│  • Component mounts                      │
│  • Initial state set:                    │
│    - messages: [welcome message]         │
│    - inputValue: ''                      │
│    - isLoading: false                    │
│  • messagesEndRef created                │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│  2. First Render Output                  │
├──────────────────────────────────────────┤
│  • Chat container rendered               │
│  • Welcome message displayed             │
│  • Input field ready for user            │
│  • useEffect runs (auto-scroll)          │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│  3. User Interaction                     │
├──────────────────────────────────────────┤
│  • User types in input field             │
│  • inputValue state updates              │
│  • Component re-renders (input change)   │
│  • Send button becomes active            │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│  4. Message Sent                         │
├──────────────────────────────────────────┤
│  • handleSendMessage() called            │
│  • User message added to messages array  │
│  • State updates trigger re-render       │
│  • useEffect detects messages change     │
│  • Auto-scroll executes                  │
│  • Loading state activated               │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│  5. Async Delay (2 seconds)              │
├──────────────────────────────────────────┤
│  • setTimeout running                    │
│  • Loading indicator visible             │
│  • Input field disabled                  │
│  • User cannot send new message          │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│  6. AI Response Generated                │
├──────────────────────────────────────────┤
│  • generateAIResponse() executes         │
│  • Model message created                 │
│  • Model message added to state          │
│  • Component re-renders                  │
│  • useEffect detects messages change     │
│  • Auto-scroll to new message            │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│  7. Ready for Next Message               │
├──────────────────────────────────────────┤
│  • isLoading set to false                │
│  • Loading indicator disappears          │
│  • Input field enabled                   │
│  • Ready for user interaction            │
│  • (Cycle repeats at step 3)             │
└──────────────────────────────────────────┘
```

---

## Performance Optimizations

```
React Rendering
├─ Efficient state updates
│   └─ Only affected components re-render
│
├─ Memoization opportunities
│   ├─ Message component could use React.memo()
│   └─ Event handlers already stable
│
└─ No unnecessary re-renders
    └─ ref doesn't trigger re-render

CSS Performance
├─ GPU-accelerated animations
│   ├─ transform property (scale, translate)
│   └─ opacity changes
│
├─ Optimized selectors
│   └─ No complex nested selectors
│
└─ CSS variables for theming
    └─ No style recalculations on change

JavaScript Performance
├─ Minimal DOM manipulation
│   └─ React handles virtual DOM
│
├─ Event delegation ready
│   └─ Can scale message count
│
└─ Async operations properly handled
    └─ setTimeout for simulated delay
```

---

## Browser API Usage

```
React Hooks
├─ useState() - State management
├─ useEffect() - Side effects (auto-scroll)
└─ useRef() - DOM references (scroll anchor)

DOM APIs
├─ Element.scrollIntoView() - Auto-scroll
└─ textarea - Native multi-line input

CSS Features
├─ backdrop-filter: blur - Glassmorphism
├─ CSS custom properties - Theming
├─ CSS Grid/Flexbox - Layout
├─ @keyframes - Animations
├─ @media queries - Responsive
└─ ::-webkit-scrollbar - Custom scrollbar

JavaScript APIs
├─ Date - Message timestamps
├─ Array methods - Message management
└─ String methods - Input validation
```

---

This architectural documentation provides a comprehensive view of the component's structure, data flow, and performance characteristics.
