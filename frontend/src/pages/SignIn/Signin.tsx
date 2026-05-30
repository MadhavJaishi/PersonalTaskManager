import React, { useState } from 'react';
import { setUser } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useAuth } from '../../auth';
const backendURL = import.meta.env.VITE_BACKEND_URL;

const SignIn = () => {
    const { isLoggedIn, login, logout } = useAuth();
    const [step, setStep] = useState("request");
    const [formData, setFormData] = useState({
        email: "",
        otptoken: "",
    })
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const requestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendURL}/auth/send-otp`, { email: formData.email });
            if (response.status === 200) {
                setStep("verify");
            }
        } catch (err: any) {
            const msg = err?.response?.data?.error || err?.message;
            alert(msg);
            setError("Authentication failed");
        }
    };

    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${backendURL}/auth/verify-otp`,
                { email: formData.email, otptoken: formData.otptoken },
                { withCredentials: true });
            const response = await axios.get(`${backendURL}/auth/me`, { withCredentials: true })
            // Store user data to redux
            dispatch(
                setUser(response.data.user)
            );
            login();
            navigate("/dashboard");
        } catch (err) {
            setError("Authentication failed");
        }
    }

    if (isLoggedIn) {
        navigate('/dashboard');
    }

    return (
        <main className='bg-gray-800 min-h-screen flex items-center justify-center'>
            <div className="max-w-4/5 w-2/7 p-4 bg-gray-900 rounded-md shadow-md text-gray-100">
                <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                <form onSubmit={(e) => { step === "request" ? requestOtp(e) : verifyOtp(e) }} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        required
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="bg-gray-800 border border-gray-700 p-2 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {step === "verify" && <input
                        type="otp"
                        placeholder="Otp"
                        value={formData.otptoken}
                        required
                        onChange={(e) => handleChange("otptoken", e.target.value)}
                        className="bg-gray-800 border border-gray-700 p-2 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />}
                    { }
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                        {step === "email" ? 'Sign In' : 'Get Otp'}
                    </button>
                </form>
            </div></main>
    );
};

export default SignIn;
