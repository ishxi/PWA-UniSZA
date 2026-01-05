
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ADMIN_WHATSAPP, APP_LOGO } from '../src/constants/constants.base';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getString } from '../src/constants/i18n';

interface SignupPageProps {
  onBack: () => void;
  onCreateUser: (u: User) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBack, onCreateUser }) => {
  const [role, setRole] = useState<UserRole>(UserRole.JOB_SEEKER);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhone]   = useState('');

  const handleSubmit = (e: React.FormEvent) => {
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

    const text = `*Pendaftaran Akaun ${role === UserRole.EMPLOYER ? 'Employer' : 'Job Seeker'} Cafe's Little Helper*
First Name: ${firstName}
Last Name: ${lastName}
Username: ${username}
Terima kasih.`;

    window.open(
      `https://wa.me/${ADMIN_WHATSAPP.replace('+','')}?text=${encodeURIComponent(text)}`
    );
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-purple-200">
      {/* Language Switcher Fixed Top */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Left Column: Visual Section (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 lilac-gradient p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-300/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-200/30 rounded-full blur-[120px]" />
        
        <div className="relative z-10 text-center space-y-8 max-w-lg">
          <div className="bg-white/40 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/40 shadow-2xl shadow-purple-500/10">
            <div className="w-20 h-20 bg-purple-600 rounded-[1.8rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-purple-300/40">
               <img src={APP_LOGO} alt="App" className="w-12 h-12 object-contain brightness-0 invert" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
              Join the Cafe's <br/> <span className="text-purple-600">Community</span>
            </h2>
            <p className="text-slate-600 font-medium text-lg leading-relaxed">
              Create an account and start discovering exclusive campus opportunities today.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm text-left">
              <span className="text-2xl mb-2 block">🎓</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">For Students</p>
              <p className="text-xs font-bold text-slate-700">Find part-time jobs that match your skills.</p>
            </div>
            <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm text-left">
              <span className="text-2xl mb-2 block">🏢</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">For Employers</p>
              <p className="text-xs font-bold text-slate-700">Post jobs and reach thousands of students.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative animate-in fade-in slide-in-from-right duration-700 overflow-y-auto custom-scrollbar">
        <div className="max-w-md w-full mx-auto py-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-purple-200">
              <img src={APP_LOGO} alt="Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">Cafe's <span className="text-purple-600">Little Helper</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{getString('signup')}</h1>
            <p className="text-slate-500 font-medium">Create your account to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">User Type</label>
              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                <button 
                  type="button"
                  onClick={() => setRole(UserRole.JOB_SEEKER)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === UserRole.JOB_SEEKER ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {getString('role_student')}
                </button>
                <button 
                  type="button"
                  onClick={() => setRole(UserRole.EMPLOYER)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === UserRole.EMPLOYER ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {getString('role_employer')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-200 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300 text-sm"
                  placeholder="Ali"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-200 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300 text-sm"
                  placeholder="Abu"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('username')}</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-200 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300 text-sm"
                placeholder="Pick a unique name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('password')}</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-200 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300 text-sm pr-12"
                  placeholder="Min. 8 characters"
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

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp No.</label>
              <input 
                type="text" 
                value={phoneNumber}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-200 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300 text-sm"
                placeholder="60123456789"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-100 transition-all transform active:scale-[0.98] text-sm uppercase tracking-widest"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-slate-500">
              Already have an account?{' '}
              <button 
                onClick={onBack}
                className="text-purple-600 font-black hover:underline underline-offset-4 decoration-2"
              >
                {getString('login')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
