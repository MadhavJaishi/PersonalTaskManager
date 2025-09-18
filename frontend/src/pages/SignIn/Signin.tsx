import React, { useState } from 'react';
import { useAuth } from '../../auth'; // assuming your context file is AuthProvider.tsx
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const { isLoggedIn, login, logout } = useAuth();
    const [isSignup, setIsSignup] = useState(false); // toggle between signup and signin
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // TODO: replace with real API call for signup/signin
            if (isSignup) {
                // call signup API
                console.log('Signing up with', email, password);
                // simulate success
            } else {
                // call signin API
                console.log('Signing in with', email, password);
                // simulate success
            }
            login(); // update auth state & store token
        } catch (err) {
            setError('Authentication failed');
        }
    };

    if (isLoggedIn) {
        navigate('/dashboard');
    }

    return (
        <main className='bg-gray-800 min-h-screen flex items-center justify-center'>
            <div className="max-w-4/5 w-2/7 p-4 bg-gray-900 rounded-md shadow-md text-gray-100">
                <h2 className="text-2xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Sign In'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={e => setEmail(e.target.value)}
                        className="bg-gray-800 border border-gray-700 p-2 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={e => setPassword(e.target.value)}
                        className="bg-gray-800 border border-gray-700 p-2 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-400">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => {
                            setError(null);
                            setIsSignup(!isSignup);
                        }}
                    >
                        {isSignup ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div></main>
    );
};

export default SignIn;
