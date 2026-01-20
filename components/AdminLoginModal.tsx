
import React, { useState } from 'react';
import { X, Lock, ChevronRight, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Simulate network delay for security feel
    setTimeout(() => {
      if (password === 'INSOLITO-ADMIN') {
        setPassword('');
        onLoginSuccess();
        onClose();
      } else {
        setError(true);
      }
      setIsLoading(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity animate-fade-in" 
        onClick={onClose}
      />

      {/* Login Card */}
      <div className="relative bg-black border border-gold-900/50 w-full max-w-md p-8 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.1)] animate-zoom-out z-10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gold-900/20 rounded-full flex items-center justify-center border border-gold-500/30 mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Lock className="w-8 h-8 text-gold-400" />
          </div>
          <h2 className="text-2xl font-display text-gold-100 tracking-widest uppercase">Admin Access</h2>
          <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                }}
                placeholder="Enter Access Code"
                className="w-full bg-gray-900/50 border border-white/10 focus:border-gold-500 rounded-lg px-4 py-4 text-center text-white placeholder-gray-600 focus:ring-0 transition-all font-mono tracking-widest text-lg"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center justify-center gap-2 text-red-500 text-xs animate-pulse">
                 <AlertCircle className="w-3 h-3" /> Access Denied
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-4 rounded-lg uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-gold-500/20"
          >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                Dashboard Login <ChevronRight className="w-4 h-4" />
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
