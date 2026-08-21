import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  BrainCircuit,
  Zap,
  ShieldCheck,
  Loader2
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://multi-modal-ai-backend.onrender.com";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed. Please check your credentials.");
      }

      localStorage.setItem("access_token", data.access_token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google/login`;
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    leftPanel: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: "linear-gradient(135deg, #1a0533 0%, #0f0c29 100%)",
      color: "white",
      padding: "3rem",
      position: "relative",
      overflow: "hidden",
    },
    orb1: {
      position: "absolute",
      top: "-10%",
      left: "-10%",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(0,0,0,0) 70%)",
      filter: "blur(40px)",
      animation: "float1 10s ease-in-out infinite alternate",
    },
    orb2: {
      position: "absolute",
      bottom: "-15%",
      right: "-10%",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(0,0,0,0) 70%)",
      filter: "blur(50px)",
      animation: "float2 12s ease-in-out infinite alternate",
    },
    orb3: {
      position: "absolute",
      top: "40%",
      right: "20%",
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(0,0,0,0) 70%)",
      filter: "blur(30px)",
      animation: "float3 8s ease-in-out infinite alternate",
    },
    branding: {
      position: "relative",
      zIndex: 10,
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "3rem",
    },
    logoMark: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
      borderRadius: "10px",
      fontWeight: "bold",
      fontSize: "20px",
      color: "white",
      boxShadow: "0 4px 14px rgba(139, 92, 246, 0.3)",
    },
    logoText: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    heroContent: {
      position: "relative",
      zIndex: 10,
      maxWidth: "480px",
    },
    tagline: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.1,
      marginBottom: "2rem",
      background: "linear-gradient(to right, #fff, #a78bfa)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    featureList: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      marginTop: "3rem",
    },
    featureItem: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    featureIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "48px",
      height: "48px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      color: "#a78bfa",
    },
    featureText: {
      display: "flex",
      flexDirection: "column",
    },
    featureTitle: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "white",
    },
    featureDesc: {
      fontSize: "0.875rem",
      color: "rgba(255,255,255,0.6)",
    },
    testimonial: {
      position: "relative",
      zIndex: 10,
      marginTop: "auto",
      padding: "1.5rem",
      backgroundColor: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: "16px",
      backdropFilter: "blur(10px)",
      maxWidth: "480px",
    },
    testimonialText: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "rgba(255,255,255,0.8)",
      fontStyle: "italic",
      marginBottom: "1rem",
    },
    testimonialAuthor: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    authorAvatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      backgroundColor: "#8b5cf6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: "bold",
    },
    authorInfo: {
      display: "flex",
      flexDirection: "column",
    },
    authorName: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "white",
    },
    authorRole: {
      fontSize: "0.75rem",
      color: "rgba(255,255,255,0.5)",
    },
    rightPanel: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      backgroundColor: "#ffffff",
    },
    formContainer: {
      width: "100%",
      maxWidth: "400px",
      opacity: isMounted ? 1 : 0,
      transform: isMounted ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    formHeader: {
      marginBottom: "2rem",
    },
    formTitle: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#111827",
      marginBottom: "0.5rem",
    },
    formSubtitle: {
      fontSize: "1rem",
      color: "#6b7280",
    },
    alertBox: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "1rem",
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: "8px",
      color: "#dc2626",
      marginBottom: "1.5rem",
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.375rem",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#374151",
    },
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    inputIcon: {
      position: "absolute",
      left: "12px",
      color: "#9ca3af",
      pointerEvents: "none",
    },
    input: {
      width: "100%",
      padding: "0.625rem 1rem 0.625rem 2.5rem",
      fontSize: "0.875rem",
      color: "#111827",
      backgroundColor: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      outline: "none",
      transition: "all 0.2s",
      boxSizing: "border-box",
    },
    eyeToggle: {
      position: "absolute",
      right: "12px",
      color: "#9ca3af",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    forgotPassword: {
      fontSize: "0.875rem",
      color: "#6366f1",
      textDecoration: "none",
      fontWeight: 500,
      alignSelf: "flex-end",
      cursor: "pointer",
    },
    submitButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      width: "100%",
      padding: "0.75rem",
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "white",
      background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
      border: "none",
      borderRadius: "8px",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.8 : 1,
      transition: "all 0.2s",
      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
      marginTop: "0.5rem",
    },
    dividerContainer: {
      display: "flex",
      alignItems: "center",
      margin: "1.5rem 0",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      backgroundColor: "#e5e7eb",
    },
    dividerText: {
      padding: "0 1rem",
      fontSize: "0.875rem",
      color: "#6b7280",
    },
    googleButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      width: "100%",
      padding: "0.75rem",
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#374151",
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "background-color 0.2s",
    },
    footer: {
      marginTop: "2rem",
      textAlign: "center",
      fontSize: "0.875rem",
      color: "#6b7280",
    },
    footerLink: {
      color: "#6366f1",
      fontWeight: 600,
      cursor: "pointer",
      textDecoration: "none",
    },
    // Media query handling will be done via style injection for real responsiveness,
    // but React inline styles don't support media queries directly well. 
    // We will use a standard <style> block to handle the breakpoint for the left panel.
  };

  return (
    <>
      <style>{`
        @keyframes float1 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 50px); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-40px, -30px); }
        }
        @keyframes float3 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, -40px); }
        }
        .login-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
        }
        .google-btn:hover:not(:disabled) {
          background-color: #f9fafb !important;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3) !important;
        }
        @media (max-width: 768px) {
          .left-panel {
            display: none !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* Left Panel - Branding */}
        <div style={styles.leftPanel} className="left-panel">
          <div style={styles.orb1} />
          <div style={styles.orb2} />
          <div style={styles.orb3} />

          <div style={styles.branding}>
            <div style={styles.logoContainer}>
              <div style={styles.logoMark}>M</div>
              <span style={styles.logoText}>Multimodal AI</span>
            </div>

            <div style={styles.heroContent}>
              <h1 style={styles.tagline}>Experience the future of AI-powered intelligence</h1>
              
              <div style={styles.featureList}>
                <div style={styles.featureItem}>
                  <div style={styles.featureIcon}><BrainCircuit size={24} /></div>
                  <div style={styles.featureText}>
                    <span style={styles.featureTitle}>Multi-modal Understanding</span>
                    <span style={styles.featureDesc}>Process text, images, and audio seamlessly.</span>
                  </div>
                </div>
                <div style={styles.featureItem}>
                  <div style={styles.featureIcon}><Zap size={24} /></div>
                  <div style={styles.featureText}>
                    <span style={styles.featureTitle}>Real-time Analysis</span>
                    <span style={styles.featureDesc}>Get instant insights with ultra-low latency.</span>
                  </div>
                </div>
                <div style={styles.featureItem}>
                  <div style={styles.featureIcon}><ShieldCheck size={24} /></div>
                  <div style={styles.featureText}>
                    <span style={styles.featureTitle}>Secure & Private</span>
                    <span style={styles.featureDesc}>Enterprise-grade security for your data.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.testimonial}>
            <p style={styles.testimonialText}>
              "This platform completely transformed how our team interacts with data. The multi-modal capabilities are simply unmatched in the industry."
            </p>
            <div style={styles.testimonialAuthor}>
              <div style={styles.authorAvatar}>S</div>
              <div style={styles.authorInfo}>
                <span style={styles.authorName}>Sarah Jenkins</span>
                <span style={styles.authorRole}>VP of Engineering, TechFlow</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={styles.rightPanel}>
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome back</h2>
              <p style={styles.formSubtitle}>Sign in to continue to Multimodal AI</p>
            </div>

            {error && (
              <div style={styles.alertBox}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} style={styles.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    className="login-input"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="login-input"
                    style={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    style={styles.eyeToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <span style={styles.forgotPassword}>Forgot password?</span>

              <button 
                type="submit" 
                style={styles.submitButton} 
                className="submit-btn"
                disabled={loading}
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </form>

            <div style={styles.dividerContainer}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or continue with</span>
              <div style={styles.dividerLine} />
            </div>

            <button
              onClick={handleGoogleLogin}
              style={styles.googleButton}
              className="google-btn"
              disabled={loading}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>

            <p style={styles.footer}>
              Don't have an account?{" "}
              <span 
                style={styles.footerLink} 
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;