import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Moon, Sun, Menu, Home, Trophy, LayoutTemplate, Plus, User, FolderClosed, Globe, LogOut, ChevronRight, Check, X } from 'lucide-react';
import logoImage from '@/assets/logo.png';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: number;
  title: string;
  icon: string;
  time: string;
  unread: boolean;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, setLanguage, language } = useLanguage();
  const { isLogged, logout } = useAuth();

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const effectivelyLogged = isLogged && !isAuthPage;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "New feature: You can now upload images to quiz questions!", icon: "🎉", time: "11 days ago", unread: true },
    { id: 2, title: "Weekly ranking is out! BrainStorm takes #1 with 5240 pts.", icon: "🏆", time: "12 days ago", unread: true },
    { id: 3, title: "Platform maintenance scheduled for March 28th.", icon: "🔧", time: "13 days ago", unread: true },
    { id: 4, title: "QuizWhiz climbed to #2 this week — can you beat them?", icon: "🥈", time: "14 days ago", unread: false }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileNotificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleMarkRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
        setIsSubmenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        if (!mobileNotificationsRef.current || !mobileNotificationsRef.current.contains(target)) {
          setIsNotificationsOpen(false);
        }
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target) && !(event.target as HTMLElement).closest('.burger-trigger')) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const NotificationPanel = ({ className }: { className?: string }) => (
    <div
      className={cn("bg-surface-dark border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-300", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 flex items-center justify-between border-b border-border bg-surface-dark/50">
        <span className="font-bold text-text-white text-base">{t('notifications')}</span>
        <button
          onClick={handleMarkAllRead}
          className="text-[12px] font-bold text-primary-light flex items-center gap-1.5 hover:brightness-125 transition-all focus:outline-none"
        >
          <Check size={14} strokeWidth={3} />
          {t('markAllRead')}
        </button>
      </div>
      <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleMarkRead(n.id)}
            className="p-5 border-b border-border last:border-0 hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="flex gap-4">
              <div className="mt-1.5 shrink-0">
                {n.unread ? <div className="w-2.5 h-2.5 bg-primary-base rounded-full shadow-[0_0_8px_rgba(147,51,234,0.6)]" /> : <div className="w-2.5 h-2.5" />}
              </div>
              <div className="space-y-2">
                <p className={cn("text-[14px] leading-[1.4] transition-colors", n.unread ? "text-text-white font-bold" : "text-text-white/40 font-medium")}>
                  <span className="mr-2 inline-block transform group-hover:scale-110 transition-transform">{n.icon}</span>{n.title}
                </p>
                <p className="text-[12px] text-text-white/30 font-bold uppercase tracking-wide">{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="p-4 text-[13px] font-bold text-primary-light hover:bg-white/5 transition-all border-t border-border">
        {t('viewAllNotifications')}
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-dark/85 backdrop-blur-xl shadow-lg transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 relative">
        <Link to="/" className="flex items-center shrink-0 group">
          <div className="w-9 h-9 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
            <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-primary group-hover:opacity-80 transition-all tracking-tight">
            Gabarink
          </span>
        </Link>

        {effectivelyLogged && !isAuthPage && (
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-semibold">
            <NavLink to="/" className={({ isActive }) => cn("relative flex items-center gap-1.5 transition-all hover:text-primary-light", isActive ? "text-primary-light after:content-[''] after:absolute after:-bottom-[22px] after:left-0 after:w-full after:h-[2px] after:bg-primary-base after:rounded-full after:shadow-[0_0_8px_rgba(147,51,234,0.4)]" : "text-text-white/70")}>
              <Home size={18} strokeWidth={2.5} />
              {t('home')}
            </NavLink>
            <NavLink to="/ranking" className={({ isActive }) => cn("relative flex items-center gap-1.5 transition-all hover:text-primary-light", isActive ? "text-primary-light after:content-[''] after:absolute after:-bottom-[22px] after:left-0 after:w-full after:h-[2px] after:bg-primary-base after:rounded-full after:shadow-[0_0_8px_rgba(147,51,234,0.4)]" : "text-text-white/70")}>
              <Trophy size={18} strokeWidth={2.5} />
              {t('ranking')}
            </NavLink>
            <NavLink to="/templates" className={({ isActive }) => cn("relative flex items-center gap-1.5 transition-all hover:text-primary-light", isActive ? "text-primary-light after:content-[''] after:absolute after:-bottom-[22px] after:left-0 after:w-full after:h-[2px] after:bg-primary-base after:rounded-full after:shadow-[0_0_8px_rgba(147,51,234,0.4)]" : "text-text-white/70")}>
              <LayoutTemplate size={18} strokeWidth={2.5} />
              {t('templates')}
            </NavLink>
          </nav>
        )}

        <div className="hidden md:flex items-center gap-4">
          {/* Always show Create Quiz button, actions gate it */}
          {effectivelyLogged && (
            <Link to="/create" className="flex items-center gap-1.5 bg-gradient-primary text-white px-5 py-1.5 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-[1.05] transition-all active:scale-95">
              <Plus size={18} strokeWidth={3} />
              {t('create')}
            </Link>
          )}

          {effectivelyLogged ? (
            <>
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-text-white/60 hover:text-primary-light transition-colors cursor-pointer focus:outline-none"
                >
                  <Bell size={20} strokeWidth={2} />
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-canvas" />
                </button>

                {isNotificationsOpen && (
                  <div className="absolute top-full right-0 pt-2 z-[100]">
                    <NotificationPanel className="w-[380px] origin-top-right" />
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                title={t('theme')}
                className="p-2 text-text-white/60 hover:text-primary-light transition-colors cursor-pointer focus:outline-none"
              >
                {isDark ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="block h-9 w-9 rounded-full overflow-hidden border-2 border-border hover:border-primary-base transition-all focus:outline-none cursor-pointer transform hover:scale-105"
                >
                  <img src="https://i.pravatar.cc/150?u=me" alt="Avatar" className="h-full w-full object-cover" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 pt-2 z-[100]">
                    <div className="w-52 bg-surface-dark border border-border rounded-2xl shadow-2xl py-2 flex flex-col text-left animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-[13px] text-text-white/90 transition-colors font-semibold group">
                        <User size={16} className="text-text-white/40 group-hover:text-primary-light transition-colors" />
                        {t('profile')}
                      </Link>
                      <Link to="/my-quizzes" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-[13px] text-text-white/90 transition-colors font-semibold group">
                        <FolderClosed size={16} className="text-text-white/40 group-hover:text-primary-light transition-colors" />
                        {t('myQuizzes')}
                      </Link>

                      <div className="my-1 border-t border-border" />

                      <div
                        className="relative flex items-center justify-between px-4 py-2 hover:bg-white/5 text-[13px] text-text-white/90 transition-colors cursor-pointer font-semibold group"
                        onMouseEnter={() => setIsSubmenuOpen(true)}
                        onMouseLeave={() => setIsSubmenuOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <Globe size={16} className="text-text-white/40 group-hover:text-primary-light transition-colors" />
                          {t('language')}
                        </div>
                        <ChevronRight size={14} className="text-text-white/40 group-hover:text-primary-light transition-colors" />

                        {isSubmenuOpen && (
                          <div className="absolute top-0 right-full pr-2 z-[100]">
                            <div className="w-44 bg-surface-dark border border-border rounded-xl shadow-2xl py-2 flex flex-col overflow-hidden">
                              <button onClick={() => setLanguage('pt')} className={cn("flex items-center gap-3 px-4 py-2 text-[13px] text-left transition-colors", language === 'pt' ? "bg-primary-base/10 text-primary-light font-bold" : "hover:bg-white/5 text-text-white/60")}>🇧🇷 Português</button>
                              <button onClick={() => setLanguage('en')} className={cn("flex items-center gap-3 px-4 py-2 text-[13px] text-left transition-colors", language === 'en' ? "bg-primary-base/10 text-primary-light font-bold" : "hover:bg-white/5 text-text-white/60")}>🇺🇸 English</button>
                              <button onClick={() => setLanguage('es')} className={cn("flex items-center gap-3 px-4 py-2 text-[13px] text-left transition-colors", language === 'es' ? "bg-primary-base/10 text-primary-light font-bold" : "hover:bg-white/5 text-text-white/60")}>🇪🇸 Español</button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="my-1 border-t border-border" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 text-[13px] text-red-500 transition-colors text-left font-bold cursor-pointer w-full"
                      >
                        <LogOut size={16} />
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative group/lang">
                <button className="p-2 text-text-white/60 hover:text-primary-light transition-colors cursor-pointer focus:outline-none">
                  <Globe size={20} strokeWidth={2} />
                </button>
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                  <div className="w-44 bg-surface-dark border border-border rounded-xl shadow-2xl py-2 flex flex-col overflow-hidden">
                    <button onClick={() => setLanguage('pt')} className={cn("px-4 py-2 text-[13px] text-left transition-colors", language === 'pt' ? "bg-primary-base/10 text-primary-light font-bold" : "hover:bg-white/5 text-text-white/60")}>🇧🇷 Português</button>
                    <button onClick={() => setLanguage('en')} className={cn("px-4 py-2 text-[13px] text-left transition-colors", language === 'en' ? "bg-primary-base/10 text-primary-light font-bold" : "hover:bg-white/5 text-text-white/60")}>🇺🇸 English</button>
                    <button onClick={() => setLanguage('es')} className={cn("px-4 py-2 text-[13px] text-left transition-colors", language === 'es' ? "bg-primary-base/10 text-primary-light font-bold" : "hover:bg-white/5 text-text-white/60")}>🇪🇸 Español</button>
                  </div>
                </div>
              </div>
              <button onClick={toggleTheme} className="p-2 text-text-white/60 hover:text-primary-light transition-colors cursor-pointer focus:outline-none">
                {isDark ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
              </button>
              <nav className="flex items-center gap-4 ml-2">
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-text-white/70 hover:text-white transition-all rounded-xl hover:bg-white/5 active:scale-95">{t('login')}</Link>
                <Link to="/register" className="bg-primary-base text-white px-6 py-2 rounded-xl text-sm font-black shadow-lg shadow-primary-base/25 hover:brightness-110 hover:scale-[1.05] transition-all active:scale-95 hover:shadow-primary-base/40">
                  {t('register')}
                </Link>
              </nav>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          {effectivelyLogged ? (
            <div className="relative" ref={mobileNotificationsRef}>
              <button
                onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsMobileMenuOpen(false); }}
                className="p-2 text-text-white/60 hover:text-primary-light transition-colors focus:outline-none relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-base rounded-full border-2 border-canvas shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
                )}
              </button>
              {isNotificationsOpen && (
                <div className="fixed inset-x-0 top-[47px] z-[200] px-3 py-2 animate-in slide-in-from-top-10 duration-500 ease-out">
                  <NotificationPanel className="w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                </div>
              )}
            </div>
          ) : (
            <div className="relative group/lang-guest">
              <button className="p-2 text-text-white/60 hover:text-primary-light transition-colors focus:outline-none">
                <Globe size={20} strokeWidth={2} />
              </button>
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                <div className="w-44 bg-surface-dark border border-border rounded-xl shadow-2xl py-2 flex flex-col overflow-hidden">
                  <button onClick={() => setLanguage('pt')} className={cn("px-4 py-2 text-[13px] text-left transition-colors", language === 'pt' ? "bg-primary-base/10 text-primary-light font-bold" : "hover:bg-white/5 text-text-white/60")}>🇧🇷 Português</button>
                  <button onClick={() => setLanguage('en')} className={cn("px-4 py-2 text-[13px] text-left transition-colors", language === 'en' ? "bg-primary-base/10 text-primary-light font-bold" : "hover:bg-white/5 text-text-white/60")}>🇺🇸 English</button>
                  <button onClick={() => setLanguage('es')} className={cn("px-4 py-2 text-[13px] text-left transition-colors", language === 'es' ? "bg-primary-base/10 text-primary-light font-bold" : "hover:bg-white/5 text-text-white/60")}>🇪🇸 Español</button>
                </div>
              </div>
            </div>
          )}

          <button onClick={toggleTheme} className="p-2 text-text-white/60 hover:text-primary-light transition-colors focus:outline-none">
            {isDark ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
          </button>

          <button
            className="burger-trigger relative p-2 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none z-[110]"
            onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsNotificationsOpen(false); }}
          >
            <div className={cn("w-6 h-0.5 bg-text-white/80 rounded transition-all duration-300", isMobileMenuOpen && "rotate-45 translate-y-2")} />
            <div className={cn("w-6 h-0.5 bg-text-white/80 rounded transition-all duration-300", isMobileMenuOpen && "opacity-0 scale-x-0")} />
            <div className={cn("w-6 h-0.5 bg-text-white/80 rounded transition-all duration-300", isMobileMenuOpen && "-rotate-45 -translate-y-2")} />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-full left-0 w-full bg-surface-dark border-b border-white/5 z-[100] animate-in slide-in-from-top-4 duration-300 shadow-2xl flex flex-col px-6 py-8"
          >
            <nav className="flex flex-col gap-1.5 max-h-[75vh] overflow-y-auto">
              {effectivelyLogged && (
                <>
                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => cn("flex items-center gap-4 px-5 py-3.5 text-[15px] font-bold transition-all rounded-2xl", isActive ? "bg-primary-base/15 text-primary-light" : "text-text-white/60 active:bg-white/5")}>
                    <Home size={20} /> {t('home')}
                  </NavLink>
                  <NavLink to="/ranking" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => cn("flex items-center gap-4 px-5 py-3.5 text-[15px] font-bold transition-all rounded-2xl", isActive ? "bg-primary-base/15 text-primary-light" : "text-text-white/60 active:bg-white/5")}>
                    <Trophy size={20} /> {t('ranking')}
                  </NavLink>
                  <NavLink to="/templates" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => cn("flex items-center gap-4 px-5 py-3.5 text-[15px] font-bold transition-all rounded-2xl", isActive ? "bg-primary-base/15 text-primary-light" : "text-text-white/60 active:bg-white/5")}>
                    <LayoutTemplate size={20} /> {t('templates')}
                  </NavLink>

                  <div className="h-px bg-white/5 my-2" />

                  <Link to="/create" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 w-full bg-primary-base text-white px-5 py-4 rounded-[20px] text-[15px] font-bold shadow-lg shadow-primary-base/20 active:scale-[0.98] transition-all hover:brightness-110 mb-2">
                    <Plus size={22} strokeWidth={3} className="shrink-0" /> {t('create')}
                  </Link>

                  <div className="h-px bg-white/5 my-2" />
                </>
              )}

              {effectivelyLogged ? (
                <>
                  <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => cn("flex items-center gap-4 px-5 py-3.5 text-[15px] font-bold transition-all rounded-2xl", isActive ? "bg-primary-base/15 text-primary-light" : "text-text-white/60 active:bg-white/5")}>
                    <User size={20} /> {t('profile')}
                  </NavLink>
                  <NavLink to="/my-quizzes" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => cn("flex items-center gap-4 px-5 py-3.5 text-[15px] font-bold transition-all rounded-2xl", isActive ? "bg-primary-base/15 text-primary-light" : "text-text-white/60 active:bg-white/5")}>
                    <FolderClosed size={20} /> {t('myQuizzes')}
                  </NavLink>

                  <div className="flex flex-col">
                    <button onClick={() => setIsMobileLangOpen(!isMobileLangOpen)} className="flex items-center justify-between w-full px-5 py-3.5 text-[15px] font-bold text-text-white/60 active:bg-white/5 rounded-2xl focus:outline-none transition-all">
                      <div className="flex items-center gap-4"><Globe size={20} /> {t('language')}</div>
                      <ChevronRight size={18} className={cn("transition-transform duration-300", isMobileLangOpen && "rotate-90")} />
                    </button>
                    {isMobileLangOpen && (
                      <div className="bg-white/5 px-2 flex flex-col animate-in slide-in-from-top-2 duration-300 rounded-2xl mt-1 py-1">
                        <button onClick={() => { setLanguage('pt'); setIsMobileMenuOpen(false); }} className={cn("py-4 px-6 text-[14px] transition-all text-left rounded-xl", language === 'pt' ? "bg-primary-base/15 text-primary-light font-bold" : "text-text-white/60 active:bg-white/5")}>🇧🇷 Português</button>
                        <button onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} className={cn("py-4 px-6 text-[14px] transition-all text-left rounded-xl", language === 'en' ? "bg-primary-base/15 text-primary-light font-bold" : "text-text-white/60 active:bg-white/5")}>🇺🇸 English</button>
                        <button onClick={() => { setLanguage('es'); setIsMobileMenuOpen(false); }} className={cn("py-4 px-6 text-[14px] transition-all text-left rounded-xl", language === 'es' ? "bg-primary-base/15 text-primary-light font-bold" : "text-text-white/60 active:bg-white/5")}>🇪🇸 Español</button>
                      </div>
                    )}
                  </div>

                  <button onClick={handleLogout} className="flex items-center gap-4 px-5 py-3.5 text-[15px] font-bold text-red-500 active:bg-red-500/10 rounded-2xl transition-all mt-2 w-full text-left">
                    <LogOut size={20} /> {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-5 py-3.5 text-[16px] font-bold text-text-white/60 active:bg-white/5 rounded-2xl transition-all">
                    {t('login')}
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-5 py-3.5 text-[16px] font-bold text-text-white/60 active:bg-white/5 rounded-2xl transition-all">
                    {t('register')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
