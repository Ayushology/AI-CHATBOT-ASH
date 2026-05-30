# AI Chatbot Interface Component - Documentation

## Overview

A production-grade, modern AI chatbot interface component built with React and vanilla CSS, featuring a glassmorphism dark mode aesthetic with emerald/mint green accent colors. The component implements full state management, real-time message handling, and auto-scroll functionality.

---

## Component Architecture

### **ChatScreen.jsx** (`src/components/ChatScreen.jsx`)

The main component implementing a complete stateful chatbot conversation experience.

#### State Management

```jsx
const [messages, setMessages] = useState([...])        // Message timeline
const [inputValue, setInputValue] = useState('')       // Input field value
const [isLoading, setIsLoading] = useState(false)      // Async operation state
const messagesEndRef = useRef(null)                    // Auto-scroll anchor
```

#### Message Schema

Each message object follows this strict structure:

```javascript
{
  id: string,                    // Unique identifier (timestamp-based)
  role: 'user' | 'model',       // Message sender type
  text: string,                  // Message content
  timestamp: string              // ISO 8601 timestamp
}
```

#### Core Functions

**`handleSendMessage()`**

- Validates input (prevents empty/whitespace-only submissions)
- Instantly appends user message to state for responsive UX
- Resets input field and sets loading state
- Simulates 2-second backend delay using setTimeout
- Generates contextual AI response
- Appends model message to state
- Clears loading state

**`generateAIResponse(userText)`**

- Mockup function for simulating AI responses
- Pattern matching on keywords (greeting, goodbye, question, etc.)
- Returns contextual responses from predefined bank
- Ready to be replaced with actual API calls

**`handleKeyPress(e)`**

- Sends message on Enter key (Shift+Enter for new line)
- Provides standard textarea multi-line support

#### Effects

**`useEffect` - Auto-scroll**

- Triggers whenever messages array changes
- Scrolls to bottom with smooth behavior
- Ensures latest message always visible in viewport

---

## Styling & Design System

### **ChatScreen.css** (`src/styles/ChatScreen.css`)

Production-grade CSS with modern glassmorphism design patterns.

#### Color Palette

| Token                      | Value                       | Usage                    |
| -------------------------- | --------------------------- | ------------------------ |
| `--color-bg-primary`       | `#0f0f15`                   | Main background          |
| `--color-accent-primary`   | `#00d4aa`                   | Primary accent (emerald) |
| `--color-accent-secondary` | `#00f5c2`                   | Secondary accent (mint)  |
| `--color-user-bubble`      | `rgba(0, 212, 170, 0.15)`   | User message background  |
| `--color-model-bubble`     | `rgba(255, 255, 255, 0.05)` | Model message background |

#### Layout Structure

```
.chat-screen-wrapper (flex, full-screen container)
├── .chat-bg-gradient (animated background decoration)
└── .chat-container (main window, max-width: 900px, max-height: 700px)
    ├── .chat-header (title, subtitle, status indicator)
    ├── .messages-container (scrollable area, flex: 1)
    │   ├── .message-wrapper (flex container for alignment)
    │   │   └── .message-bubble (message display with rounded corners)
    │   └── .loading-dots (animated three-dot indicator)
    └── .input-section (fixed bottom, max-height: 120px textarea)
        └── .input-wrapper (flex container)
            ├── .message-input (textarea field)
            └── .send-button (icon button, conditional active state)
```

#### Key Design Features

- **Glassmorphism**: `backdrop-filter: blur(10px)` with semi-transparent surfaces
- **Shadows**: Multi-layered shadows for depth (glow effect around container)
- **Animations**:
  - Slide-up entrance (`slideUp` 0.6s)
  - Message bubble slide-in (`messageSlide` 0.4s)
  - Status pulse (`pulse` 2s infinite)
  - Loading dots blink (`blink` 1.4s infinite)
  - Floating background (`float` 20s infinite)
- **Responsive**:
  - Desktop: Full-featured layout
  - Tablet (≤768px): Adjusted padding and sizes
  - Mobile (≤480px): Compact layout, reduced font sizes
- **Accessibility**:
  - High contrast mode support
  - Reduced motion support (`prefers-reduced-motion`)
  - Light mode support (`prefers-color-scheme: light`)
  - ARIA labels on interactive elements

#### Custom Scrollbar

The messages container features a custom scrollbar:

- Width: 6px
- Color: Emerald with transparency
- Hover effect: Increased opacity
- Smooth transitions

---

## Usage

### Basic Import

```jsx
import ChatScreen from "./components/ChatScreen";

function App() {
  return <ChatScreen />;
}
```

### Integration with Backend

To connect to your actual backend API, replace the `generateAIResponse()` function in `ChatScreen.jsx`:

```jsx
const handleSendMessage = async () => {
  // ... existing validation and user message code ...

  setIsLoading(true);

  try {
    // Replace this with your actual API call
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.text }),
    });

    const data = await response.json();

    const modelMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: data.response, // From your backend
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, modelMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

### Customization

**Change accent colors:**

```css
/* In ChatScreen.css */
:root {
  --color-accent-primary: #your-color;
  --color-accent-secondary: #your-color;
}
```

**Adjust container dimensions:**

```css
.chat-container {
  max-width: 1000px; /* Default: 900px */
  max-height: 800px; /* Default: 700px */
}
```

**Modify simulated delay:**

```jsx
setTimeout(() => {
  // ... AI response code ...
}, 3000); // Change from 2000 to your desired milliseconds
```

---

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Features Used**:
  - CSS Grid & Flexbox
  - Backdrop-filter (blur)
  - CSS Custom Properties
  - CSS Animations & Transitions
  - Media Queries (prefers-color-scheme, prefers-reduced-motion, prefers-contrast)

---

## Performance Considerations

1. **Message Rendering**: Uses efficient React rendering with stable keys (message IDs)
2. **Auto-scroll**: Smooth scroll behavior without janky jumps
3. **Animation Performance**: GPU-accelerated transform animations
4. **Memory**: Messages array grows with conversation (consider pagination for long sessions)
5. **Textarea Resize**: `resize: none` prevents layout shift, `max-height` limits height

---

## Accessibility Features

| Feature                 | Implementation                                                |
| ----------------------- | ------------------------------------------------------------- |
| **Keyboard Navigation** | Full support (Tab, Enter, Shift+Enter)                        |
| **ARIA Labels**         | Send button has `aria-label`                                  |
| **Color Contrast**      | WCAG AA compliant in dark mode                                |
| **High Contrast Mode**  | Increased border widths, font weights                         |
| **Reduced Motion**      | All animations disabled when `prefers-reduced-motion: reduce` |
| **Light Mode**          | Full support with inverted color scheme                       |
| **Screen Readers**      | Semantic HTML with proper heading hierarchy                   |

---

## File Structure

```
src/
├── App.jsx                          # Main app entry (renders ChatScreen)
├── index.css                        # Global base styles
├── components/
│   └── ChatScreen.jsx              # Main chatbot component
└── styles/
    └── ChatScreen.css              # Component-specific styling
```

---

## Future Enhancements

- Message pagination/virtualization for very long conversations
- Message search functionality
- Typing indicators for real backend responses
- Message reactions/feedback buttons
- Image/file upload support
- Markdown rendering in messages
- Message editing and deletion
- Conversation history management
- Dark/light mode toggle
- Theme customization panel

---

## License & Credits

Built with modern React hooks, vanilla CSS (no external styling libraries), and semantic HTML. Production-ready component suitable for integration into larger applications.
