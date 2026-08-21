import { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {
  Menu, Plus, Search, Paperclip, Image, Mic, Camera, Send,
  Settings, LogOut, User, Bot, X
} from "lucide-react";
import "./index.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const API_BASE = import.meta.env.VITE_API_URL || "https://multi-modal-ai-backend.onrender.com";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // Check auth status on load
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        // Check if token returned from Google OAuth redirect in URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");
        if (urlToken) {
          localStorage.setItem("access_token", urlToken);
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        const token = localStorage.getItem("access_token");
        if (token) {
          const response = await fetch(`${API_BASE}/auth/me`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem("access_token");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    // Redirect to login
    window.location.href = "/login";
  };

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const sendToBackend = async () => {
    const text = message.trim();
    if (!text || loading) return;

    addMessage("user", text);
    setMessage("");
    setLoading(true);

    try {
      const endpoint = pdfUploaded ? "/pdf/chat" : "/chat";

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Backend request failed");
      }

      addMessage("assistant", data.response);
    } catch (error) {
      addMessage(
        "assistant",
        `Backend error: ${error.message}. Make sure FastAPI is running on ${API_BASE}.`
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadPDF = async (file) => {
    if (!file) return;

    addMessage("user", `📄 Uploading PDF: ${file.name}`);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/pdf/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "PDF upload failed");
      }

      setPdfUploaded(true);
      addMessage(
        "assistant",
        `PDF indexed successfully. I stored ${data.chunks} chunks. You can now ask questions about it.`
      );
    } catch (error) {
      addMessage("assistant", `PDF error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async (file) => {
    if (!file) return;

    const question =
      message.trim() || "Describe this image and explain the important details.";

    addMessage("user", `🖼️ Image: ${file.name}\n${question}`);
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", question);

      const response = await fetch(`${API_BASE}/image/analyze`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Image analysis failed");
      }

      addMessage("assistant", data.response);
    } catch (error) {
      addMessage("assistant", `Image error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const transcribeAudio = async (file) => {
    if (!file) return;

    addMessage("user", `🎤 Audio: ${file.name}`);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/voice/transcribe`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Voice transcription failed");
      }

      setMessage(data.text);
      addMessage("assistant", `Transcription: ${data.text}`);
    } catch (error) {
      addMessage("assistant", `Voice error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    const prompt = message.trim();
    if (!prompt || loading) return;

    addMessage("user", `🎨 Generate image: ${prompt}`);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/image/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Image generation failed");
      }

      addMessage(
        "assistant",
        <div>
          <p>Image generated successfully.</p>
          <img
            src={`${API_BASE}${data.url}`}
            alt="Generated"
            style={{ maxWidth: "100%", borderRadius: "12px", marginTop: "10px" }}
          />
        </div>
      );
    } catch (error) {
      addMessage("assistant", `Image generation error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendToBackend();
    }
  };

  const newChat = () => {
    setMessages([]);
    setPdfUploaded(false);
  };

  // If auth is still loading, show loading state
  if (authLoading) {
    return (
      <div className="app">
        <div className="welcome">
          <div className="welcome-logo"><Bot size={34} /></div>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth pages
  if (!user) {
    return (
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  // Authenticated user sees the main app
  return (
    <Router>
      <div className="app">
        {sidebarOpen && (
          <div className="overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-header">
            <div className="brand">
              <div className="brand-logo">M</div>
              <span>Multimodal AI</span>
            </div>

            <button
              className="icon-button mobile-close"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="sidebar-user-info">
            <div className="avatar">{user.name?.[0] || "U"}</div>
            <div>
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>

          <button className="new-chat" onClick={newChat}>
            <Plus size={19} />
            New Chat
          </button>

          <div className="search-box">
            <Search size={17} />
            <input placeholder="Search chats..." />
          </div>

          <div className="chat-section">
            <p className="section-title">Recent</p>
            <button className="chat-item">Explain RAG architecture</button>
            <button className="chat-item">Analyze my PDF</button>
            <button className="chat-item">Multimodal AI project</button>
            <button className="chat-item">PostgreSQL learning</button>
          </div>

          <div className="sidebar-bottom">
            <button className="sidebar-option"><User size={18} />Profile</button>
            <button className="sidebar-option"><Settings size={18} />Settings</button>
            <button className="sidebar-option logout" onClick={handleLogout}>
              <LogOut size={18} />Logout
            </button>
          </div>
        </aside>

        <main className="main">
          <header className="header">
            <button
              className="icon-button menu-button"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div className="mobile-brand">
              <div className="brand-logo">M</div>
              <span>Multimodal AI</span>
            </div>

            <div className="header-right">
              <button className="profile-button">
                <div className="avatar">{user.name?.[0] || "U"}</div>
                <span>Account</span>
              </button>
            </div>
          </header>

          <section className="chat-area">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-logo"><Bot size={34} /></div>
                <h1>How can I help you?</h1>
                <p>
                  Ask questions, analyze documents, understand images,
                  use voice, or generate images with your multimodal AI.
                </p>

                <div className="suggestions">
                  <button onClick={() => setMessage("Explain RAG in simple terms")}>
                    Explain RAG
                  </button>
                  <button onClick={() => fileInputRef.current?.click()}>
                    Analyze a PDF
                  </button>
                  <button onClick={() => imageInputRef.current?.click()}>
                    Analyze an image
                  </button>
                  <button onClick={() => setMessage("Explain PostgreSQL")}>
                    Help with PostgreSQL
                  </button>
                </div>
              </div>
            ) : (
              <div className="messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message-row ${
                      msg.role === "user" ? "user-row" : "assistant-row"
                    }`}
                  >
                    <div className="message-avatar">
                      {msg.role === "user" ? (
                        <div className="avatar">{user.name?.[0] || "U"}</div>
                      ) : (
                        <Bot size={18} />
                      )}
                    </div>
                    <div className="message-content">
                      {typeof msg.content === "string"
                        ? msg.content
                        : msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message-row assistant-row">
                    <div className="message-avatar"><Bot size={18} /></div>
                    <div className="message-content">Thinking...</div>
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="input-container">
            <div className="input-box">
              <div className="input-actions">
                <label className="input-action" title="Upload PDF">
                  <Paperclip size={19} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    hidden
                    onChange={(e) => uploadPDF(e.target.files?.[0])}
                  />
                </label>

                <label className="input-action" title="Analyze image">
                  <Image size={19} />
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => analyzeImage(e.target.files?.[0])}
                  />
                </label>

                <button
                  className="input-action"
                  title="Camera"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Camera size={19} />
                </button>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={pdfUploaded ? "Ask about your PDF..." : "Message Multimodal AI..."}
                rows="1"
              />

              <div className="input-actions">
                <label className="input-action" title="Upload audio">
                  <Mic size={19} />
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    hidden
                    onChange={(e) => transcribeAudio(e.target.files?.[0])}
                  />
                </label>

                <button
                  className="send-button"
                  onClick={sendToBackend}
                  disabled={!message.trim() || loading}
                  title="Send"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            <p className="input-disclaimer">
              Multimodal AI can make mistakes. Check important information.
            </p>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;