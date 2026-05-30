# API Integration Examples

This guide shows how to connect the ChatScreen component to various backend services and AI APIs.

---

## 1. RESTful Backend API (Node.js/Express)

Replace the `handleSendMessage()` function in `ChatScreen.jsx`:

```jsx
const handleSendMessage = async () => {
  // Input validation
  if (!inputValue.trim()) return;

  // Create user message
  const userMessage = {
    id: Date.now().toString(),
    role: "user",
    text: inputValue.trim(),
    timestamp: new Date().toISOString(),
  };

  // Add user message to state
  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setInputValue("");
  setIsLoading(true);

  try {
    // Make API call to your backend
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // If needed
      },
      body: JSON.stringify({
        message: userMessage.text,
        conversationId: "user-123", // Optional: track conversation
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Create model message from API response
    const modelMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: data.response || data.message || "Error: Empty response",
      timestamp: new Date().toISOString(),
    };

    // Add model message to state
    setMessages((prevMessages) => [...prevMessages, modelMessage]);
  } catch (error) {
    console.error("Chat error:", error);

    // Optional: Add error message to chat
    const errorMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: `Sorry, I encountered an error: ${error.message}`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

### Backend Example (Node.js/Express)

```javascript
// server.js
app.post("/api/chat", async (req, res) => {
  const { message, conversationId } = req.body;

  try {
    // Your AI logic here (OpenAI, custom model, etc.)
    const response = await your_ai_service.chat(message);

    res.json({
      success: true,
      response: response,
      conversationId: conversationId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
```

---

## 2. OpenAI API Integration

```jsx
const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    role: "user",
    text: inputValue.trim(),
    timestamp: new Date().toISOString(),
  };

  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setInputValue("");
  setIsLoading(true);

  try {
    // Call OpenAI API (via your backend for security)
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage.text,
        messages: messages, // Include conversation history
      }),
    });

    const data = await response.json();

    const modelMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: data.choices[0].message.content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, modelMessage]);
  } catch (error) {
    console.error("OpenAI error:", error);
  } finally {
    setIsLoading(false);
  }
};
```

### Backend Proxy (Node.js)

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/openai", async (req, res) => {
  const { message, messages } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant.",
        },
        ...messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.text,
        })),
      ],
      temperature: 0.7,
    });

    res.json({
      choices: [
        {
          message: {
            content: response.choices[0].message.content,
          },
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 3. WebSocket for Real-time Streaming

For streaming responses (tokens as they arrive):

```jsx
useEffect(() => {
  const ws = new WebSocket("ws://localhost:5000/chat");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "token") {
      // Update last message with streaming token
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.role === "model") {
          lastMsg.text += data.token;
        }
        return updated;
      });
    } else if (data.type === "done") {
      setIsLoading(false);
    }
  };

  return () => ws.close();
}, []);

const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    role: "user",
    text: inputValue.trim(),
    timestamp: new Date().toISOString(),
  };

  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setInputValue("");
  setIsLoading(true);

  // Add placeholder model message
  const modelMessage = {
    id: (Date.now() + 1).toString(),
    role: "model",
    text: "",
    timestamp: new Date().toISOString(),
  };
  setMessages((prevMessages) => [...prevMessages, modelMessage]);

  // Send via WebSocket
  ws.send(
    JSON.stringify({
      message: userMessage.text,
      conversationId: "user-123",
    }),
  );
};
```

---

## 4. Google Generative AI (Gemini)

```jsx
const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    role: "user",
    text: inputValue.trim(),
    timestamp: new Date().toISOString(),
  };

  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setInputValue("");
  setIsLoading(true);

  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage.text,
        history: messages.map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        })),
      }),
    });

    const data = await response.json();

    const modelMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: data.text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, modelMessage]);
  } catch (error) {
    console.error("Gemini error:", error);
  } finally {
    setIsLoading(false);
  }
};
```

### Backend Implementation

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post("/api/gemini", async (req, res) => {
  const { message, history } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 5. Custom AI Service with Authentication

```jsx
// Store auth token from login
const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  // Check authentication
  if (!authToken) {
    alert("Please log in first");
    return;
  }

  const userMessage = {
    id: Date.now().toString(),
    role: "user",
    text: inputValue.trim(),
    timestamp: new Date().toISOString(),
  };

  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setInputValue("");
  setIsLoading(true);

  try {
    const response = await fetch("https://api.yourservice.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        "X-User-ID": userId,
        "X-API-Version": "1.0",
      },
      body: JSON.stringify({
        message: userMessage.text,
        context: {
          conversationId: conversationId,
          userId: userId,
          language: "en",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }),
    });

    if (response.status === 401) {
      // Token expired
      localStorage.removeItem("authToken");
      setAuthToken(null);
      alert("Session expired. Please log in again.");
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    const modelMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: data.message.content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, modelMessage]);
  } catch (error) {
    console.error("API error:", error);

    // Show error message in chat
    const errorMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: `⚠️ Error: ${error.message}. Please try again.`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 6. Error Handling Pattern

Best practices for robust error handling:

```jsx
const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    role: "user",
    text: inputValue.trim(),
    timestamp: new Date().toISOString(),
  };

  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setInputValue("");
  setIsLoading(true);

  try {
    // Request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle different HTTP statuses
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    const modelMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: data.response,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, modelMessage]);
  } catch (error) {
    // Different error types
    let errorText = "❌ Something went wrong";

    if (error.name === "AbortError") {
      errorText = "⏱️ Request timed out. Please try again.";
    } else if (error instanceof TypeError) {
      errorText = "🌐 Network error. Check your connection.";
    } else if (error.message) {
      errorText = `⚠️ ${error.message}`;
    }

    const errorMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: errorText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, errorMessage]);
    console.error("Chat error:", error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 7. Conversation Persistence

Save/load from localStorage or backend:

```jsx
// Save conversation
useEffect(() => {
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}, [messages]);

// Load conversation on mount
useEffect(() => {
  const saved = localStorage.getItem("chatMessages");
  if (saved) {
    try {
      setMessages(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load messages:", e);
    }
  }
}, []);

// Clear conversation
const handleClearChat = () => {
  if (window.confirm("Clear all messages?")) {
    setMessages([
      {
        id: "1",
        role: "model",
        text: "Hey there! 👋 Welcome to our AI Chatbot. How can I assist you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    localStorage.removeItem("chatMessages");
  }
};
```

---

## Summary

Choose the integration pattern that best fits your backend:

- **Simple REST API**: Use example #1
- **OpenAI/ChatGPT**: Use example #2
- **Real-time Streaming**: Use example #3
- **Google Gemini**: Use example #4
- **Custom Service**: Use example #5
- **Production Quality**: Apply error handling from example #6
- **Persistent Chat**: Add persistence from example #7

All examples follow the same message schema and state management pattern for easy integration.
