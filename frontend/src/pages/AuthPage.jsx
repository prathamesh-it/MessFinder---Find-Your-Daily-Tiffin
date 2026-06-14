import { useState } from "react";
import { AnimatedBackground, TiffinLogo, IconEye, IconEyeOff, IconArrowLeft } from "../components/Shared";
import { authApi } from "../services/api";

export default function AuthPage({ type, onNavigate, onLogin }) {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    password: "",
    role:"STUDENT" 
  });
  const isLogin = type === "login";
const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate role selected on signup
    if (!isLogin && !form.role) {
      setError("Please select Student or Mess Owner");
      return;
    }

    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await authApi.login({
          email: form.email,
          password: form.password,
        });
      } else {
        data = await authApi.signup({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,   // ← send role to backend
        });
      }

      // Save to localStorage
      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.role)  localStorage.setItem("role",  data.role);
      if (data?.name)  localStorage.setItem("name",  data.name);

      if (onLogin) onLogin(data);

      // Redirect based on role
      const role = data?.role?.toUpperCase();
      if (role === "SUPER_ADMIN") onNavigate("admin");
      else if (role === "MESS_OWNER") onNavigate("owner");
      else onNavigate("home");

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AnimatedBackground>
      <div className="auth-wrap">
        <div className="auth-inner">

          {/* Logo */}
          <div className="auth-logo">
            <TiffinLogo size={44} />
            <span className="auth-logo-text jakarta">
              Mess<span className="amber">Finder</span>
            </span>
          </div>

          <div className="auth-card">
            <h2 className="auth-title jakarta">
              {isLogin ? "Welcome back!" : "Create account"}
            </h2>
            <p className="auth-sub">
              {isLogin ? "Login to find your daily tiffin" : "Join 10,000+ tiffin lovers today"}
            </p>

            {/* Error */}
            {error && (
              <div className="auth-error" style={{ marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>

              {/* Name - signup only */}
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Ramesh Kumar"
                    value={form.name}
                    onChange={set("name")}
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="ramesh@example.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password</label>
                <div className="pass-wrap">
                  <input
                    className="form-input has-eye"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot password - login only */}
              {isLogin && (
                <div className="forgot-row">
                  <button type="button" className="forgot-btn">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Role Selection - signup only */}
              {!isLogin && (
                <div className="form-group">
                  <label>I am a... *</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "STUDENT" })}
                      style={{
                        padding: "12px",
                        border: `2px solid ${form.role === "STUDENT" ? "var(--orange-500)" : "var(--orange-200)"}`,
                        background: form.role === "STUDENT" ? "var(--orange-50)" : "white",
                        color: form.role === "STUDENT" ? "var(--orange-600)" : "var(--stone-500)",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s"
                      }}
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "MESS_OWNER" })}
                      style={{
                        padding: "12px",
                        border: `2px solid ${form.role === "MESS_OWNER" ? "var(--orange-500)" : "var(--orange-200)"}`,
                        background: form.role === "MESS_OWNER" ? "var(--orange-50)" : "white",
                        color: form.role === "MESS_OWNER" ? "var(--orange-600)" : "var(--stone-500)",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s"
                      }}
                    >
                      🍱 Mess Owner
                    </button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button className="btn-auth" type="submit" disabled={loading}>
                {loading
                  ? "Please wait…"
                  : isLogin ? "Login to MessFinder" : "Create My Account"
                }
              </button>
            </form>

            {/* Switch login/signup */}
            <p className="auth-switch">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => onNavigate(isLogin ? "signup" : "login")}>
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>

          {/* Back to home */}
          <button className="auth-back" onClick={() => onNavigate("landing")}>
            <IconArrowLeft size={14} /> Back to home
          </button>

        </div>
      </div>
    </AnimatedBackground>
  );
}