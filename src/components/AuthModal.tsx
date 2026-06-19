/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';
import { X, LogIn, UserPlus, Eye, EyeOff, Shield, Users, Briefcase, User, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isAr: boolean;
  onLoginSuccess: (user: UserAccount) => void;
  triggerToast: (msg: string) => void;
}

export default function AuthModal({ isOpen, onClose, isAr, onLoginSuccess, triggerToast }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Client');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Pre-configured mock quick login credentials
  const quickLogins = [
    { role: 'Admin', email: 'admin@yafta.com', pass: 'admin123', nameAr: 'المشرف العام', nameEn: 'Super Admin' },
    { role: 'Employee', email: 'employee@yafta.com', pass: 'employee123', nameAr: 'مهندس التشغيل', nameEn: 'Production Engineer' },
    { role: 'Client', email: 'client@yafta.com', pass: 'client123', nameAr: 'أحمد محمود (عميل)', nameEn: 'Ahmed Mahmoud (Client)' }
  ];

  const handleQuickLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setError('');
    
    // Auto submit or just pre-fill
    setTimeout(() => {
      performLogin(email, pass);
    }, 150);
  };

  const performLogin = (emailStr: string, passwordStr: string) => {
    if (!emailStr || !passwordStr) {
      setError(isAr ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }

    // Get list of users from localStorage or default
    const existingUsersRaw = localStorage.getItem('yafta_users_list');
    let usersList: UserAccount[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

    // If empty list, check if we should add the default mock ones
    if (usersList.length === 0) {
      usersList = [
        { id: '1', name: 'Super Admin', email: 'admin@yafta.com', role: 'Admin', password: 'admin123', registeredDate: '2026-01-01', phone: '+201011223344' },
        { id: '2', name: 'Production Engineer', email: 'employee@yafta.com', role: 'Employee', password: 'employee123', registeredDate: '2026-02-15', phone: '+201055667788' },
        { id: '3', name: 'Ahmed Mahmoud', email: 'client@yafta.com', role: 'Client', password: 'client123', registeredDate: '2026-03-20', phone: '+201199001122' }
      ];
      localStorage.setItem('yafta_users_list', JSON.stringify(usersList));
    }

    // Find user
    const matchedUser = usersList.find(u => u.email.toLowerCase() === emailStr.toLowerCase().trim());
    
    if (!matchedUser) {
      setError(isAr ? 'حساب المستخدم هذا غير مسجل لدينا' : 'No user account found with this email');
      return;
    }

    if (matchedUser.password !== passwordStr) {
      setError(isAr ? 'كلمة المرور غير صحيحة، يرجى المحاولة ثانية' : 'Incorrect password, please try again');
      return;
    }

    if (matchedUser.status === 'suspended') {
      setError(isAr ? 'هذا الحساب معطل حالياً من قبل الإدارة' : 'This account has been suspended by management');
      return;
    }

    // Success login!
    onLoginSuccess(matchedUser);
    triggerToast(isAr ? `تم تسجيل الدخول بنجاح! أهلاً بك، ${matchedUser.name}` : `Welcome back, ${matchedUser.name}!`);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    performLogin(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regName || !regEmail || !regPassword) {
      setError(isAr ? 'يرجى ملىء الحقول الإلزامية الاسم، البريد، والرمز' : 'Please fill out required fields Name, Email, Password');
      return;
    }

    const existingUsersRaw = localStorage.getItem('yafta_users_list');
    let usersList: any[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [
      { id: '1', name: 'Super Admin', email: 'admin@yafta.com', role: 'Admin', password: 'admin123', registeredDate: '2026-01-01', phone: '+201011223344' },
      { id: '2', name: 'Production Engineer', email: 'employee@yafta.com', role: 'Employee', password: 'employee123', registeredDate: '2026-02-15', phone: '+201055667788' },
      { id: '3', name: 'Ahmed Mahmoud', email: 'client@yafta.com', role: 'Client', password: 'client123', registeredDate: '2026-03-20', phone: '+201199001122' }
    ];

    const emailExists = usersList.some(u => u.email.toLowerCase() === regEmail.toLowerCase().trim());
    if (emailExists) {
      setError(isAr ? 'هذا البريد الإلكتروني مسجل بالفعل' : 'This email is already registered');
      return;
    }

    // Create user
    const newUser: UserAccount = {
      id: `${Date.now()}`,
      name: regName.trim(),
      email: regEmail.toLowerCase().trim(),
      role: regRole,
      password: regPassword,
      phone: regPhone.trim() || undefined,
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    usersList.push(newUser);
    localStorage.setItem('yafta_users_list', JSON.stringify(usersList));

    // Log user in automatically after registration
    onLoginSuccess(newUser);
    triggerToast(isAr ? `تم إنشاء الحساب والدخول التلقائي: ${newUser.name}` : `Account created! Welcome, ${newUser.name}`);
    onClose();

    // Reset inputs
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegPhone('');
    setRegRole('Client');
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-neutral-950 border border-gold-505/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col font-sans">
        
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-gold-600 via-gold-505 to-gold-300"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full border border-neutral-800 hover:border-gold-505/20 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 space-y-6">
          
          {/* Header Visual Emblem */}
          <div className="text-center space-y-2 mt-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-950 border border-gold-505 rounded-2xl shadow-lg ring-4 ring-gold-500/5 animate-pulse">
              <Shield className="w-6 h-6 text-gold-505" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                {isAr ? 'بوابة العبور الآمنة | يافطة' : 'Security Identity Portal | YAFTA'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {isAr ? 'لوحة تسجيل الدخول وصلاحيات التشغيل المتعددة' : 'Decentralized role access control system & identity desk'}
              </p>
            </div>
          </div>

          {/* Bilingual Tab Selector */}
          <div className="grid grid-cols-2 bg-neutral-900/60 border border-neutral-800 p-1 rounded-xl">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`py-2 px-3 text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'login'
                  ? 'bg-gold-505 text-neutral-950 shadow font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`py-2 px-3 text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'register'
                  ? 'bg-gold-505 text-neutral-950 shadow font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{isAr ? 'إنشاء حساب جديد' : 'Register Account'}</span>
            </button>
          </div>

          {/* Error visual state */}
          {error && (
            <div className="bg-rose-950/20 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 animate-bounce" />
              <div className="grow text-right">{error}</div>
            </div>
          )}

          {/* TAB 1: LOGIN PANEL */}
          {tab === 'login' && (
            <div className="space-y-5 animate-fade-in">
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">
                    {isAr ? 'البريد الإلكتروني:' : 'Email Address:'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-gold-505 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gold-505 flex items-center gap-1 hover:underline text-[11px]"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'إظهار الرمز' : 'Show Password')}</span>
                    </button>
                    <label className="text-zinc-300 font-bold">
                      {isAr ? 'كلمة المرور:' : 'Password:'}
                    </label>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-gold-505 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-gold-300 via-gold-505 to-gold-400 text-neutral-950 font-black text-xs rounded-xl shadow-lg shadow-gold-500/15 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-2 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isAr ? 'ولوج الحساب الآمن' : 'Establish Secure Connection'}</span>
                </button>
              </form>

              {/* Quick Simulator Credentials Panel */}
              <div className="pt-4 border-t border-neutral-900">
                <span className="text-[10px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded uppercase tracking-wider font-bold mb-2 inline-block">
                  {isAr ? 'محاكي تبديل الأدوار وصلاحيات التشغيل السريع' : 'Role-based quick testing credentials'}
                </span>
                <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                  {isAr 
                    ? 'اضغط على أي من أدوار العرض أدناه لتسجيل الدخول الفوري ومراجعة حالات التقيد والأمن لكل قطاع بالتمام والكمال:' 
                    : 'Click any sandbox account below to immediately simulate that level of structural access.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {quickLogins.map((ql) => (
                    <button
                      key={ql.role}
                      type="button"
                      onClick={() => handleQuickLogin(ql.email, ql.pass)}
                      className="p-2.5 bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 hover:border-gold-505/40 rounded-xl text-right transition-all flex flex-col justify-between group cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-1 border-b border-neutral-800/60 pb-1.5 justify-between w-full">
                        {ql.role === 'Admin' && <Shield className="w-3.5 h-3.5 text-rose-450 text-red-400 group-hover:scale-110 transition-transform" />}
                        {ql.role === 'Employee' && <Briefcase className="w-3.5 h-3.5 text-blue-450 text-blue-400 group-hover:scale-110 transition-transform" />}
                        {ql.role === 'Client' && <User className="w-3.5 h-3.5 text-gold-505 group-hover:scale-110 transition-transform" />}
                        <strong className="text-white text-[11px] font-sans font-black">
                          {isAr ? (ql.role === 'Admin' ? 'مدير كامل' : ql.role === 'Employee' ? 'موظف' : 'عميل مسجل') : ql.role}
                        </strong>
                      </div>
                      <div className="text-[9px] text-neutral-400 font-mono mt-1.5 truncate text-left w-full">
                        {ql.email}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER PANEL */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-right animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">
                    {isAr ? 'الاسم الكامل:' : 'Full Name:'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'مثال: محمد علي' : 'e.g. John Doe'}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-gold-505 rounded-xl p-2.5 text-xs text-white focus:outline-none placeholder:text-zinc-650"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">
                    {isAr ? 'رقم الهاتف:' : 'Phone Number:'}
                  </label>
                  <input
                    type="tel"
                    placeholder="+201012345678"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-gold-505 rounded-xl p-2.5 text-xs text-white focus:outline-none placeholder:text-zinc-650 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 font-bold block">
                  {isAr ? 'البريد الإلكتروني:' : 'Email Address:'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-gold-505 rounded-xl p-2.5 text-xs text-white focus:outline-none placeholder:text-zinc-650 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">
                    {isAr ? 'رمز المرور:' : 'Password:'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-gold-505 rounded-xl p-2.5 text-xs text-white focus:outline-none placeholder:text-zinc-650 font-mono"
                  />
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs text-neutral-300 font-bold block">
                    {isAr ? 'الدور الممنوح (Role Simulation):' : 'Desired Security Role:'}
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-gold-505 rounded-xl p-2.5 text-xs text-white focus:outline-none font-bold"
                  >
                    <option value="Client">{isAr ? 'عميل (Client Dashboard)' : 'Client (Quotation + Invoices)'}</option>
                    <option value="Employee">{isAr ? 'موظف تشغيل (Employee Desk)' : 'Employee (Tasks + Projects)'}</option>
                    <option value="Admin">{isAr ? 'مطور مشرف (Director / Admin)' : 'Director / Admin (Full Access)'}</option>
                    <option value="Visitor">{isAr ? 'زائر عام (Visitor)' : 'Visitor (Public Pages Only)'}</option>
                  </select>
                </div>
              </div>

              <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80 text-[11px] text-zinc-400 text-right leading-relaxed font-sans flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-gold-505 shrink-0 mt-0.5" />
                <span>
                  {isAr 
                    ? 'ملاحظة: يمكنك اختيار صلاحية "مطور مشرف" أو "موظف" مباشرة لترى كيف يتم تقييد الصفحات والخدمات ونوافذ الإدارة تلقائياً وبأمان.' 
                    : 'Note: Select any sandbox role level to experience dynamic locking of admin structures across pages, rails and buttons.'}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-gold-300 via-gold-505 to-gold-400 text-neutral-950 font-black text-xs rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isAr ? 'إنشاء حسابك وتأمين الواجهة' : 'Establish Brand Identity Account'}</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
