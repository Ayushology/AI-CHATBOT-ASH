import { useState, useEffect, useRef } from "react";
import "../styles/ChatScreen.css";

/**
 * ChatScreen Component
 *
 * A production-grade, stateful chatbot interface implementing:
 * - Real-time message state management with structured message schema
 * - Auto-scroll behavior on new messages
 * - Simulated asynchronous AI response with configurable delay
 * - Input validation (empty/whitespace prevention)
 * - Modern glassmorphism dark mode aesthetics
 *
 * Message Schema: { id: string, role: 'user' | 'model', text: string, timestamp: string }
 */
function ChatScreen() {
  // ============================================================
  // STATE MANAGEMENT
  // ============================================================

  /** Full conversation timeline with strict schema adherence */
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "model",
      text: "Hey there! 👋 I'm ASH, your AI Assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);

  /** Controlled input field state */
  const [inputValue, setInputValue] = useState("");

  /** Loading state for UI feedback during async operations */
  const [isLoading, setIsLoading] = useState(false);

  /** Reference to the messages container for auto-scroll */
  const messagesEndRef = useRef(null);

  // ============================================================
  // EFFECTS
  // ============================================================

  /**
   * useEffect: Auto-scroll to bottom on new messages
   * Ensures the latest message is always visible in the viewport
   * Runs whenever messages array changes
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  /**
   * handleSendMessage
   *
   * Core message handling logic:
   * 1. Validates input (prevents empty/whitespace-only submissions)
   * 2. Creates user message object with unique ID and timestamp
   * 3. Appends user message to state instantly for UX responsiveness
   * 4. Resets input field
   * 5. Sets loading state
   * 6. Simulates async backend/AI delay (2 seconds)
   * 7. Generates structured model response
   * 8. Appends model message to state
   * 9. Clears loading state
   */
  const handleSendMessage = async () => {
    // Input validation
    if (!inputValue.trim()) return;

    // Create user message with strict schema
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      text: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    // Append user message instantly for optimal UX
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Reset input field
    setInputValue("");
    setIsLoading(true);

    // Simulate asynchronous backend/AI processing delay
    setTimeout(() => {
      // Generate contextual model response
      const modelResponse = generateAIResponse(userMessage.text);

      // Create model message with strict schema
      const modelMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: modelResponse,
        timestamp: new Date().toISOString(),
      };

      // Append model message to conversation timeline
      setMessages((prevMessages) => [...prevMessages, modelMessage]);
      setIsLoading(false);
    }, 2000); // 2-second simulated delay
  };

  /**
   * generateAIResponse
   *
   * Mockup function for AI response generation
   * In production, this would call your backend API
   */
  const generateAIResponse = (userText) => {
    // Simple pattern matching for demo purposes
    const lowerText = userText.toLowerCase();

    const responses = {
      greeting: [
        "Hello! I'm here to help. What would you like to know?",
        "Hi there! Great to chat with you. What can I assist with?",
      ],
      question: [
        "That's a great question! Based on what you're asking, I think the best approach would be to consider multiple perspectives.",
        "Interesting point! Let me provide you with some insights on that topic.",
      ],
      goodbye: [
        "Thanks for chatting with me! Feel free to reach out anytime. Have a great day! 👋",
        "It was a pleasure talking with you! Don't hesitate to come back if you need anything.",
      ],
      default: [
        "I understand what you're saying. Could you provide a bit more detail so I can give you a better response?",
        "That's noted! Let me think about that and provide you with a comprehensive answer.",
      ],
    };

    // Simple routing logic
    if (/hello|hi|hey|greetings|hey there|how are you/.test(lowerText)) {
      return responses.greeting[
        Math.floor(Math.random() * responses.greeting.length)
      ];
    } else if (/goodbye|bye|see you|farewell|talk later/.test(lowerText)) {
      return responses.goodbye[
        Math.floor(Math.random() * responses.goodbye.length)
      ];
    } else if (/\?/.test(lowerText)) {
      return responses.question[
        Math.floor(Math.random() * responses.question.length)
      ];
    }

    return responses.default[
      Math.floor(Math.random() * responses.default.length)
    ];
  };

  /**
   * handleKeyPress
   * Sends message on Enter key (Shift+Enter for new line)
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="chat-screen-wrapper">
      {/* Background decoration elements */}
      <div className="chat-bg-gradient"></div>

      {/* Main chat container */}
      <div className="chat-container">
        {/* Header section */}
        <div className="chat-header">
          <div className="chat-header-content">
            <h1 className="chat-title">ASH</h1>
            <p className="chat-subtitle">Your AI Assistant</p>
          </div>
          <div className="chat-status-indicator"></div>
        </div>

        {/* Messages container - scrollable area */}
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper message-${message.role}`}
            >
              <div className={`message-bubble message-${message.role}`}>
                <p className="message-text">{message.text}</p>
                <span className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="message-wrapper message-model">
              <div className="message-bubble message-model">
                <div className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          )}

          {/* Invisible element for scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input section - fixed bottom */}
        <div className="input-section">
          <div className="input-wrapper">
            <textarea
              className="message-input"
              placeholder="Type your message here... (Shift+Enter for new line)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              rows="1"
            />
            <button
              className={`send-button ${inputValue.trim() ? "active" : ""}`}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
              title="Send message (Enter)"
            >
              <svg
                className="send-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
