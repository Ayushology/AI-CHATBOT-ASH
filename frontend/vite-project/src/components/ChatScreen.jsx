import { useState, useEffect, useRef } from "react";
import "../styles/ChatScreen.css";
import { io } from "socket.io-client";

export default function ChatScreen() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "model",
      text: "Hello! I am ash, your AI assistant. How can I assist you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    // Listen for AI responses from the server
    socketInstance.on("ai-message-response", (message) => {
      // Safely handle whether the backend sends a plain string or an object {response: "..."}
      const responseText = typeof message === "object" ? message.response : message;

      const modelMessage = {
        id: Date.now().toString(),
        role: "model", 
        text: responseText || "I've received your message, but the response was empty.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, modelMessage]);
      setIsLoading(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const messageText = inputValue.trim();
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    // Update UI with user message
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Emit the message to the backend via Socket.io
    if (socket) {
      // MATCHES BACKEND: socket.on("ai-message", ...)
      socket.emit("ai-message", messageText); 
    } else {
      console.error("Socket is not connected");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <header className="top-bar">
        <div className="top-bar-content">
          <div className="brand">
            <div className="status-dot"></div>
            <h1>Ash</h1>
          </div>
          <div className="header-actions">
            <span className="badge">AI Powered</span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="chat-area">
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-row ${msg.role === "user" ? "user-row" : "model-row"}`}
            >
              {msg.role === "model" && (
                <div className="avatar model-avatar">A</div>
              )}
              <div
                className={`message-content ${msg.role === "user" ? "user-content" : "model-content"}`}
              >
                <p>{msg.text}</p>
                <span className="time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {msg.role === "user" && (
                <div className="avatar user-avatar">U</div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="message-row model-row">
              <div className="avatar model-avatar">A</div>
              <div className="message-content model-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Input Area */}
      <footer className="input-area">
        <div className="input-container">
          <textarea
            placeholder="Message ash... (Shift+Enter for new line)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={inputValue.trim() ? "active" : ""}
          >
            <svg
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
        <div className="disclaimer">
          Ash can make mistakes. Consider verifying important information.
        </div>
      </footer>
    </div>
  );
}