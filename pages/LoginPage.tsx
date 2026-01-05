
import React, { useState } from 'react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getString } from '../src/constants/i18n';

interface LoginPageProps {
  appLogo: string;
  onLogin: (u: string, p: string) => void;
  onGoToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ appLogo, onLogin, onGoToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-purple-200">
      {/* Language Switcher Fixed Top */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Left Column: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative animate-in fade-in slide-in-from-left duration-700">
        <div className="max-w-md w-full mx-auto">
          {/* Brand Logo Mobile only or subtle */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-purple-200">
              <img src={appLogo} alt="Logo" className="w-full h-full object-contain brightness-0 invert" 
                onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=U&background=ffffff&color=8b5cf6"; }}
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">Cafe's <span className="text-purple-600">Little Helper</span></span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">{getString('login')}</h1>
            <p className="text-slate-500 font-medium">{getString('welcome')}. Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('username')}</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-200 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300 text-sm"
                placeholder="e.g. s12345"
                required
              />
            </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{getString('password')}</label>
                  <button type="button" className="text-[10px] font-bold text-purple-600 hover:text-purple-800 transition-colors uppercase tracking-tight">Forgot password?</button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-200 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300 text-sm pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            
            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
              <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer">Remember for 30 days</label>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-100 transition-all transform active:scale-[0.98] text-sm uppercase tracking-widest"
            >
              {getString('login')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-slate-500">
              Don't have an account?{' '}
              <button 
                onClick={onGoToSignup}
                className="text-purple-600 font-black hover:underline underline-offset-4 decoration-2"
              >
                {getString('signup')}
              </button>
            </p>
          </div>
        </div>
        
          {/* Footer info subtle */}
        <div className="mt-auto pt-10 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] text-center">
          © Cafe's Little Helper — v2.0
        </div>
      </div>

      {/* Right Column: Visual Section (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 lilac-gradient p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[100px]" />
        
        <div className="relative z-10 text-center space-y-8 max-w-lg">
          <div className="bg-white/40 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/40 shadow-2xl shadow-purple-500/10">
            <div className="w-30 h-30 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
               <img src={appLogo} alt="App" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
              Connecting Cafe Helpers <br/> <span className="text-purple-600">with Purpose</span>.
            </h2>
            <p className="text-slate-600 font-medium text-lg leading-relaxed">
              Find the perfect part-time role that fits your academic schedule and helps you grow.
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <div className="px-6 py-3 bg-white/60 backdrop-blur-md rounded-full border border-white/60 shadow-sm text-[10px] font-black uppercase tracking-widest text-purple-600">
              ✓ Fast Application
            </div>
            <div className="px-6 py-3 bg-white/60 backdrop-blur-md rounded-full border border-white/60 shadow-sm text-[10px] font-black uppercase tracking-widest text-purple-600">
              ✓ Direct WhatsApp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
