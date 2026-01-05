
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ADMIN_WHATSAPP } from '../src/constants/constants.base';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getString } from '../src/constants/i18n';

interface AuthPageProps {
  appLogo: string;
  onLogin: (u: string, p: string) => void;
  onCreateUser: (u: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ appLogo, onLogin, onCreateUser }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.JOB_SEEKER);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhone] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !password) {
      alert("Please complete all required fields.");
      return;
    }

    const newUser: User = {
      id: "usr-" + Date.now(),
      role,
      firstName,
      lastName,
      username,
      password,
      phoneNumber,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=8b5cf6&color=ffffff`
    };

    const existing = JSON.parse(localStorage.getItem("ej_users") || "[]");
    existing.push(newUser);
    localStorage.setItem("ej_users", JSON.stringify(existing));
    localStorage.setItem('ej_logged_in_user', JSON.stringify(newUser));

    onCreateUser(newUser);

    const text = `*Pendaftaran Akaun ${role === UserRole.EMPLOYER ? getString('role_employer') : getString('role_student')} Cafe's Little Helper*
First Name: ${firstName}
Last Name: ${lastName}
Username: ${username}
Terima kasih.`;

    window.open(`https://wa.me/${ADMIN_WHATSAPP.replace('+','')}?text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-purple-200">
      
      {/* 1. Visual Section (Landscape/Tablet+ - Left side) */}
      <div className="hidden md:flex w-1/2 lilac-gradient flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden border-r border-purple-100/50">
        {/* Dreamy Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-purple-300/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/30 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-lg w-full space-y-8 lg:space-y-12">
          <div className="bg-white/40 backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] lg:rounded-[4rem] border border-white/60 shadow-2xl shadow-purple-500/5 transition-all hover:scale-[1.01] duration-500">
            <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white rounded-2xl lg:rounded-[2.5rem] flex items-center justify-center mb-6 lg:mb-10 shadow-xl">
               <img src={appLogo} alt="Logo" className="w-10 h-10 lg:w-14 lg:h-14 object-contain" 
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=U&background=ffffff&color=8b5cf6"; }}
               />
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-4 lg:mb-8">
              Empowering Cafe Helpers <br/> <span className="text-purple-600 italic">with Purpose</span>
            </h2>
            <p className="text-slate-600 font-semibold text-base lg:text-xl leading-relaxed opacity-90">
              The most efficient way to connect university departments with talented students for campus-based opportunities.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 lg:gap-4 justify-start">
             {['Fast Hiring', 'Direct Contact', 'Verified'].map(f => (
               <span key={f} className="px-4 py-2 lg:px-6 lg:py-3 bg-white/60 backdrop-blur-md rounded-full border border-white/60 shadow-sm text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-purple-700">
                 ✓ {f}
               </span>
             ))}
          </div>
        </div>
      </div>

      {/* 2. Form Section (Full width on Mobile, 50% on Tablet/Landscape) */}
      <div className="w-full md:w-1/2 flex flex-col relative bg-white overflow-y-auto no-scrollbar">
        
        {/* Floating Top Nav (Logo & Switcher) */}
        <div className="p-8 md:p-12 flex justify-between items-center w-full">
           <div className="flex items-center gap-3 md:hidden">
             <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-purple-200">
                <img src={appLogo} alt="Logo" className="w-full h-full brightness-0 invert" 
                   onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=U&background=ffffff&color=8b5cf6"; }}
                />
             </div>
              <span className="text-xl font-black tracking-tighter text-slate-900">Cafe's <span className="text-purple-600 italic">Little Helper</span></span>
           </div>
            <div className="hidden md:block">
               <span className="text-sm font-black tracking-widest text-slate-300 uppercase">Cafe Job Portal</span>
            </div>
           <LanguageSwitcher />
        </div>

        {/* Content Container */}
        <div className="flex-grow flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 max-w-2xl mx-auto w-full">
          
          {/* Segmented Mode Switcher (Dribbble Glass Style) - Refined centering and aesthetic */}
          <div className="bg-slate-100/50 p-1.5 rounded-full border border-slate-200 flex mb-12 shadow-inner relative">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 flex items-center justify-center py-4 rounded-full text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 z-10 ${mode === 'login' ? 'bg-white text-purple-600 shadow-md transform -translate-y-[1px]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {getString('login')}
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 flex items-center justify-center py-4 rounded-full text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 z-10 ${mode === 'signup' ? 'bg-white text-purple-600 shadow-md transform -translate-y-[1px]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {getString('signup')}
            </button>
          </div>

          <div className="mb-10 text-left">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-3 animate-in fade-in slide-in-from-bottom duration-500">
              {mode === 'login' ? getString('login') : getString('signup')}
            </h1>
            <p className="text-slate-400 font-bold tracking-tight text-[11px] uppercase tracking-[0.3em]">
              {mode === 'login' ? getString('welcome_back') : getString('start_journey')}
            </p>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-7 animate-in fade-in slide-in-from-right duration-500">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('username')}</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-5 bg-slate-100/60 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all font-bold placeholder:text-slate-300 text-sm"
                  placeholder="e.g. s12345"
                  required
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{getString('password')}</label>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-5 bg-slate-100/60 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all font-bold placeholder:text-slate-300 text-sm pr-12"
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
              <button type="submit" className="w-full bg-[#111827] hover:bg-purple-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-900/10 transition-all transform active:scale-[0.98] text-xs uppercase tracking-[0.2em] mt-2">
                {getString('login')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('account_role')}</label>
                <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
                  <button type="button" onClick={() => setRole(UserRole.JOB_SEEKER)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === UserRole.JOB_SEEKER ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    {getString('role_student')}
                  </button>
                  <button type="button" onClick={() => setRole(UserRole.EMPLOYER)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === UserRole.EMPLOYER ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    {getString('role_employer')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('first_name')}</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full p-4 bg-slate-100/60 rounded-2xl focus:bg-white outline-none font-bold text-sm" placeholder="Ali" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('last_name')}</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full p-4 bg-slate-100/60 rounded-2xl focus:bg-white outline-none font-bold text-sm" placeholder="Abu" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('username')}</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-4 bg-slate-100/60 rounded-2xl focus:bg-white outline-none font-bold text-sm" placeholder="Username" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('password')}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full p-4 bg-slate-100/60 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none font-bold text-sm pr-12" 
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
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('whatsapp_no')}</label>
                <input type="text" value={phoneNumber} onChange={e => setPhone(e.target.value)} className="w-full p-4 bg-slate-100/60 rounded-2xl focus:bg-white outline-none font-bold text-sm" placeholder="601..." required />
              </div>

              <button type="submit" className="w-full bg-[#111827] hover:bg-purple-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform active:scale-[0.98] text-xs uppercase tracking-[0.2em] mt-2">
                {getString('join_community')}
              </button>
            </form>
          )}

          <div className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] text-center pt-8 border-t border-slate-50">
            © Cafe's Little Helper v2.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
