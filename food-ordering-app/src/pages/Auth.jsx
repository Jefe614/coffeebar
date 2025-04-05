// src/pages/Auth.js

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Google, Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const Auth = () => {
  const [mode, setMode] = useState("login"); // login, signup, resetPassword
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract redirect URL from query params (if any)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const redirectMessage = queryParams.get('redirect');
    
    if (redirectMessage) {
      setMessage("Please sign in to continue");
    }
  }, [location]);

  const getRedirectUrl = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('redirect') || "/";
  };

  // Map Firebase error codes to user-friendly messages
  const getFriendlyErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered. Please try signing in instead.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-not-found': 'No account found with this email. Please check your email or sign up.',
      'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
      'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
      'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later or reset your password.',
      'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/popup-closed-by-user': 'Google sign-in was cancelled. Please try again.'
    };

    // Extract error code from the full error message
    const codeMatch = errorCode.match(/\(([^)]+)\)/);
    const code = codeMatch ? codeMatch[1] : errorCode;
    
    return errorMessages[code] || `Authentication error: ${errorCode}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
        navigate(getRedirectUrl());
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        await signUp(email, password);
        setMessage("Account created successfully! You can now log in.");
        setMode("login");
      } else if (mode === "resetPassword") {
        await resetPassword(email);
        setMessage("Password reset email sent! Check your inbox.");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(getFriendlyErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      navigate(getRedirectUrl());
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(getFriendlyErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            {mode === "login" ? "Sign in to your account" : 
             mode === "signup" ? "Create a new account" : "Reset your password"}
          </h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            {error.includes("already registered") && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="font-medium underline"
                >
                  Go to sign in
                </button>
              </div>
            )}
          </div>
        )}

        {message && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Email className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {mode !== "resetPassword" && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? <VisibilityOff className="h-5 w-5" /> : <Visibility className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {mode === "signup" && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70"
            >
              {loading ? "Processing..." : 
               mode === "login" ? "Sign in" : 
               mode === "signup" ? "Sign up" : "Reset Password"}
            </button>
          </div>
        </form>

        {mode !== "resetPassword" && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70"
              >
                <Google className="h-5 w-5 text-red-500 mr-2" />
                Google
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          {mode === "login" ? (
            <>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className="font-medium text-orange-500 hover:text-orange-400"
                >
                  Sign up
                </button>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => {
                    setMode("resetPassword");
                    setError("");
                  }}
                  className="font-medium text-orange-500 hover:text-orange-400"
                >
                  Forgot your password?
                </button>
              </p>
            </>
          ) : mode === "signup" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="font-medium text-orange-500 hover:text-orange-400"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="font-medium text-orange-500 hover:text-orange-400"
              >
                Back to sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;