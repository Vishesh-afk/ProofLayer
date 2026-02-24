import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { signInWithGoogle } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.email) {
            setError('Please enter your email');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setError('');
            setLoading(true);

            // Trim email to prevent accidentally creating accounts with spaces
            const cleanEmail = formData.email.trim();
            console.log('Attempting signup for:', cleanEmail);

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                cleanEmail,
                formData.password
            );

            navigate('/onboarding', {
                state: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email
                }
            });

        } catch (err) {
            console.error('Signup failed:', err);

            if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Use at least 6 characters');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('Email/password accounts are not enabled');
            } else {
                setError('Failed to create account. Please try again');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setError('');
            setLoading(true);
            const result = await signInWithGoogle();

            navigate('/onboarding', {
                state: {
                    uid: result.user.uid,
                    email: result.user.email
                }
            });
        } catch (err) {
            console.error('Google sign-up failed:', err);

            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-up cancelled');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup blocked. Please allow popups for this site');
            } else {
                setError('Failed to sign up with Google. Please try again');
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
                    <h1 className="text-3xl md:text-2xl font-bold text-[var(--text-primary-color)] mb-2">Create Account</h1>
                    <p className="text-[var(--text-secondary-color)] text-base">Sign up to start managing your testimonials</p>
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
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="new-password"
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
                        <small className="text-xs text-[var(--text-secondary-color)] mt-1">Minimum 6 characters</small>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="text-sm font-semibold text-[var(--text-primary-color)]">
                            Confirm Password
                        </label>
                        <div className="relative flex items-center">
                            <FaLock className="absolute left-4 text-[var(--text-secondary-color)] text-base pointer-events-none" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="new-password"
                                className="w-full py-3.5 px-4 pl-11 pr-12 border-[1.5px] border-[var(--border-color)] rounded-lg text-base transition-all duration-200 bg-white text-[var(--text-primary-color)] focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(108,92,231,0.1)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex="-1"
                                className="absolute right-4 bg-transparent border-none text-[var(--text-secondary-color)] cursor-pointer p-2 flex items-center transition-colors duration-200 hover:text-[var(--primary-color)]"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[var(--primary-color)] text-white border-none py-3.5 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 mt-2 flex items-center justify-center gap-2 hover:bg-[#5a4bc7] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(108,92,231,0.3)] active:translate-y-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Creating Account...
                            </>
                        ) : (
                            'Continue'
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
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    className="w-full bg-white text-gray-700 border-[1.5px] border-[var(--border-color)] py-3.5 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 mb-4 hover:bg-gray-50 hover:border-[#4285f4] hover:shadow-[0_2px_8px_rgba(66,133,244,0.2)] active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-[var(--border-color)]"
                >
                    <FaGoogle className="text-xl text-[#4285f4]" />
                    Sign up with Google
                </button>

                <div className="text-center mt-8 pt-8 border-t border-[var(--border-color)]">
                    <p className="text-[var(--text-secondary-color)] text-base m-0">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[var(--primary-color)] font-semibold transition-colors duration-200 hover:text-[#5a4bc7] hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
