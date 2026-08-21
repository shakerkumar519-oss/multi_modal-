import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  MessageSquare, 
  FileText, 
  Sparkles,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://multi-modal-ai-backend.onrender.com";

  // Calculate password strength
  useEffect(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(Math.min(5, score));
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Signup failed');
      }

      localStorage.setItem('access_token', data.access_token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/auth/google/login`;
  };

  // Get strength color
  const getStrengthColor = () => {
    if (strength <= 1) return '#ef4444'; // Red
    if (strength === 2) return '#f59e0b'; // Orange
    if (strength === 3) return '#eab308'; // Yellow
    if (strength >= 4) return '#22c55e'; // Green
    return '#e5e7eb'; // Gray
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#111827'
    },
    leftPanel: {
      flex: 1,
      backgroundColor: '#1a0533',
      backgroundImage: 'linear-gradient(135deg, #1a0533 0%, #0f0c29 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: '4rem',
      color: 'white',
      justifyContent: 'space-between',
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      position: 'relative',
      zIndex: 1,
      backgroundColor: '#ffffff',
    },
    formContainer: {
      width: '100%',
      maxWidth: '440px',
      animation: 'fadeIn 0.6s ease-out forwards',
    },
    header: {
      marginBottom: '2rem',
      textAlign: 'center'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#111827',
      marginBottom: '0.5rem',
      letterSpacing: '-0.025em'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1rem',
    },
    inputGroup: {
      marginBottom: '1.25rem',
      position: 'relative'
    },
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      pointerEvents: 'none'
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem 0.875rem 3rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.2s',
      backgroundColor: '#f9fafb',
      boxSizing: 'border-box'
    },
    passwordToggle: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#9ca3af',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center'
    },
    strengthBarContainer: {
      display: 'flex',
      gap: '4px',
      marginTop: '0.5rem',
      height: '4px'
    },
    strengthBar: {
      flex: 1,
      borderRadius: '2px',
      transition: 'background-color 0.3s ease'
    },
    strengthText: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginTop: '0.25rem',
      textAlign: 'right'
    },
    button: {
      width: '100%',
      padding: '0.875rem',
      borderRadius: '0.75rem',
      border: 'none',
      background: 'linear-gradient(to right, #8b5cf6, #4f46e5)',
      color: 'white',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'opacity 0.2s',
      marginTop: '0.5rem',
      boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '1.5rem 0',
      color: '#9ca3af',
      fontSize: '0.875rem'
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#e5e7eb'
    },
    dividerText: {
      padding: '0 1rem'
    },
    googleButton: {
      width: '100%',
      padding: '0.875rem',
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb',
      backgroundColor: 'white',
      color: '#374151',
      fontSize: '1rem',
      fontWeight: 500,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'background-color 0.2s',
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#ef4444',
      padding: '1rem',
      borderRadius: '0.75rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      border: '1px solid #fecaca'
    },
    footer: {
      marginTop: '2rem',
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    link: {
      color: '#4f46e5',
      textDecoration: 'none',
      fontWeight: 500
    },
    terms: {
      marginTop: '1.5rem',
      fontSize: '0.75rem',
      color: '#9ca3af',
      textAlign: 'center',
      lineHeight: '1.5'
    },
    // Left panel specific styles
    brandHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 10,
    },
    logoBox: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #a855f7, #6366f1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '1.25rem',
    },
    brandText: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    heroSection: {
      zIndex: 10,
      marginTop: '4rem',
    },
    heroTitle: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.1,
      marginBottom: '1rem',
    },
    heroSubtitle: {
      fontSize: '1.125rem',
      color: '#a78bfa',
      marginBottom: '3rem',
    },
    featureList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      fontSize: '1.125rem',
      color: '#e2e8f0',
    },
    featureIconContainer: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#a855f7'
    },
    trustBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      zIndex: 10,
      color: '#a78bfa',
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    // Orbs
    orb1: {
      position: 'absolute',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(30,27,75,0) 70%)',
      top: '-20%',
      left: '-10%',
      animation: 'float 20s infinite ease-in-out',
    },
    orb2: {
      position: 'absolute',
      width: '500px',
      height: '500px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(30,27,75,0) 70%)',
      bottom: '-10%',
      right: '-10%',
      animation: 'float 15s infinite ease-in-out reverse',
    },
    orb3: {
      position: 'absolute',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(30,27,75,0) 70%)',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      animation: 'pulse 10s infinite ease-in-out',
    }
  };

  // Setup media query for responsiveness using window.matchMedia since we want pure inline styles
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          input:focus {
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
          }
          .google-btn:hover {
            background-color: #f9fafb !important;
          }
        `}
      </style>
      <div style={styles.container}>
        {!isMobile && (
          <div style={styles.leftPanel}>
            <div style={styles.orb1}></div>
            <div style={styles.orb2}></div>
            <div style={styles.orb3}></div>

            <div style={styles.brandHeader}>
              <div style={styles.logoBox}>M</div>
              <span style={styles.brandText}>Multimodal AI</span>
            </div>

            <div style={styles.heroSection}>
              <h1 style={styles.heroTitle}>Start your AI<br/>journey today.</h1>
              <p style={styles.heroSubtitle}>Unlock the power of text, image, and voice in one unified platform.</p>
              
              <div style={styles.featureList}>
                <div style={styles.featureItem}>
                  <div style={styles.featureIconContainer}><MessageSquare size={20} /></div>
                  <span>Intelligent Conversations</span>
                </div>
                <div style={styles.featureItem}>
                  <div style={styles.featureIconContainer}><FileText size={20} /></div>
                  <span>Document Analysis</span>
                </div>
                <div style={styles.featureItem}>
                  <div style={styles.featureIconContainer}><BrainCircuit size={20} /></div>
                  <span>Image & Voice AI</span>
                </div>
              </div>
            </div>

            <div style={styles.trustBadge}>
              <CheckCircle2 size={18} />
              <span>Join 10,000+ users worldwide</span>
            </div>
          </div>
        )}

        <div style={styles.rightPanel}>
          <div style={styles.formContainer}>
            <div style={styles.header}>
              <h2 style={styles.title}>Create Account</h2>
              <p style={styles.subtitle}>Enter your details to get started</p>
            </div>

            {error && (
              <div style={styles.error}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <User size={20} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Full Name"
                  style={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <Mail size={20} style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="Email address"
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <Lock size={20} style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {password.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={styles.strengthBarContainer}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        style={{
                          ...styles.strengthBar,
                          backgroundColor: level <= strength ? getStrengthColor() : '#e5e7eb'
                        }}
                      />
                    ))}
                  </div>
                  <div style={styles.strengthText}>
                    {strength <= 2 ? 'Weak' : strength === 3 ? 'Medium' : 'Strong'}
                  </div>
                </div>
              )}

              <div style={styles.inputGroup}>
                <Lock size={20} style={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  style={styles.input}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
                disabled={loading}
              >
                {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create account'}
              </button>
            </form>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>or continue with</span>
              <div style={styles.dividerLine}></div>
            </div>

            <button
              type="button"
              className="google-btn"
              style={styles.googleButton}
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            <p style={styles.terms}>
              By creating an account, you agree to our<br />
              <Link to="/terms" style={{ color: '#4f46e5', textDecoration: 'none' }}>Terms of Service</Link> & <Link to="/privacy" style={{ color: '#4f46e5', textDecoration: 'none' }}>Privacy Policy</Link>
            </p>

            <div style={styles.footer}>
              Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}