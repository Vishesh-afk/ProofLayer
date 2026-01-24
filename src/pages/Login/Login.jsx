import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);

            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email');
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (err.code === 'auth/user-disabled') {
                setError('This account has been disabled');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later');
            } else {
                setError('Failed to login. Please try again');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            const result = await signInWithGoogle();

            if (result.isNewUser) {
                navigate('/onboarding', {
                    state: {
                        uid: result.user.uid,
                        email: result.user.email
                    }
                });
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Google sign-in failed:', err);

            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup blocked. Please allow popups for this site');
            } else {
                setError('Failed to sign in with Google. Please try again');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8 md:p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-12 md:p-8 w-full max-w-md animate-[slideUp_0.4s_ease-out]">
                <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-[var(--primary-color)] mb-4">◆ ProofLayer</div>
                    <h1 className="text-3xl md:text-2xl font-bold text-[var(--text-primary-color)] mb-2">Welcome Back</h1>
                    <p className="text-[var(--text-secondary-color)] text-base">Sign in to your account to continue</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3.5 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <span className="text-xl">⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-[var(--text-primary-color)]">
                            Email Address
                        </label>
                        <div className="relative flex items-center">
                            <FaEnvelope className="absolute left-4 text-[var(--text-secondary-color)] text-base pointer-events-none" />
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                autoComplete="email"
                                className="w-full py-3.5 px-4 pl-11 border-[1.5px] border-[var(--border-color)] rounded-lg text-base transition-all duration-200 bg-white text-[var(--text-primary-color)] focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(108,92,231,0.1)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-semibold text-[var(--text-primary-color)]">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <FaLock className="absolute left-4 text-[var(--text-secondary-color)] text-base pointer-events-none" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                autoComplete="current-password"
                                className="w-full py-3.5 px-4 pl-11 pr-12 border-[1.5px] border-[var(--border-color)] rounded-lg text-base transition-all duration-200 bg-white text-[var(--text-primary-color)] focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(108,92,231,0.1)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                                className="absolute right-4 bg-transparent border-none text-[var(--text-secondary-color)] cursor-pointer p-2 flex items-center transition-colors duration-200 hover:text-[var(--primary-color)]"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end -mt-2">
                        <Link to="/forgot-password" className="text-[var(--primary-color)] text-sm font-medium transition-colors duration-200 hover:text-[#5a4bc7] hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[var(--primary-color)] text-white border-none py-3.5 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 mt-2 flex items-center justify-center gap-2 hover:bg-[#5a4bc7] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(108,92,231,0.3)] active:translate-y-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="flex items-center text-center my-6 text-[var(--text-secondary-color)] text-sm">
                    <div className="flex-1 border-b border-[var(--border-color)]"></div>
                    <span className="px-4 font-medium">OR</span>
                    <div className="flex-1 border-b border-[var(--border-color)]"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-white text-gray-700 border-[1.5px] border-[var(--border-color)] py-3.5 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 mb-4 hover:bg-gray-50 hover:border-[#4285f4] hover:shadow-[0_2px_8px_rgba(66,133,244,0.2)] active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-[var(--border-color)]"
                >
                    <FaGoogle className="text-xl text-[#4285f4]" />
                    Sign in with Google
                </button>

                <div className="text-center mt-8 pt-8 border-t border-[var(--border-color)]">
                    <p className="text-[var(--text-secondary-color)] text-base m-0">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[var(--primary-color)] font-semibold transition-colors duration-200 hover:text-[#5a4bc7] hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
