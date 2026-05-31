import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleAuthButton({ onError }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="mt-2 text-center text-xs text-amber-600 dark:text-amber-400">
        Google sign-in: add VITE_GOOGLE_CLIENT_ID to frontend/.env
      </p>
    );
  }

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Google sign-in failed';
      onError?.(msg);
      console.error('Google sign-in:', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mt-8 w-full flex justify-center ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError?.('Google sign-in was cancelled or failed')}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
}
