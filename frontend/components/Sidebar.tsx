import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useLanguage();
    const t = translations[language];

    const MENU_ITEMS = [
        { path: '/', label: t.navHome, icon: 'home' },
        { path: '/services', label: t.navServices, icon: 'receipt_long' },
        { path: '/projects', label: t.navProjects, icon: 'rocket_launch' },
        { path: '/experience', label: t.navExp, icon: 'work' },
        { path: '/method', label: t.navMethod, icon: 'precision_manufacturing' },
        { path: '/about', label: t.navAbout, icon: 'person' },
        { path: '/contact', label: t.navContact, icon: 'mail' },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-24 h-screen sticky top-0 z-50 bg-white dark:bg-[#0b0d11] border-r border-slate-200 dark:border-white/5 py-8 items-center justify-between shrink-0 transition-all duration-700 ease-in-out">
            <div className="h-8 w-full" />

            <nav className="flex flex-col gap-6">
                {MENU_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`relative group flex items-center justify-center size-14 rounded-2xl transition-all duration-500 ${isActive
                                ? 'bg-primary text-white shadow-xl shadow-primary/20'
                                : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[26px] ${isActive ? 'fill-icon' : ''}`}>
                                {item.icon}
                            </span>

                            {/* Tooltip corrigido com z-index alto e posicionamento relativo à sidebar z-50 */}
                            <div className="absolute left-20 px-4 py-2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-2xl border border-white/5">
                                {item.label}
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 size-2 bg-slate-800 rotate-45 border-l border-b border-white/5"></div>
                            </div>

                            {isActive && (
                                <div className="absolute -left-3 w-1 h-8 bg-primary rounded-r-full shadow-glow" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="h-12 w-full" />
        </aside>
    );
};

export default Sidebar;
