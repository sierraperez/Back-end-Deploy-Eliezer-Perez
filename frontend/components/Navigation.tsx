
import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { useTheme } from '../context/ThemeContext';

interface NavigationProps {
    isOpen: boolean;
    onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const t = translations[language];

    const toggleLanguage = () => {
        if (language === 'fr') setLanguage('en');
        else if (language === 'en') setLanguage('pt');
        else if (language === 'pt') setLanguage('es');
        else setLanguage('fr');
    };

    // Empêcher le défilement du corps quand le menu est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const MENU_ITEMS = [
        { path: '/', label: t.navHome, icon: 'home' },
        { path: '/services', label: t.navServices, icon: 'receipt_long' },
        { path: '/projects', label: t.navProjects, icon: 'rocket_launch' },
        { path: '/experience', label: t.navExp, icon: 'work' },
        { path: '/method', label: t.navMethod, icon: 'precision_manufacturing' },
        { path: '/about', label: t.navAbout, icon: 'person' },
        { path: '/contact', label: t.navContact, icon: 'mail' },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex flex-col bg-white dark:bg-[#05080a] backdrop-blur-[50px] overflow-hidden animate-fade-in transition-colors duration-700 ease-in-out text-slate-900 dark:text-white">
            {/* Elementos de fundo dinâmicos que reagem ao tema */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute -top-[10%] -left-[10%] size-[400px] blur-[120px] rounded-full animate-blob transition-all duration-1000 ${theme === 'dark' ? 'bg-primary/10' : 'bg-primary/5'}`} />
                <div className={`absolute top-[40%] -right-[10%] size-[300px] blur-[100px] rounded-full animate-blob transition-all duration-1000 ${theme === 'dark' ? 'bg-blue-600/5' : 'bg-blue-400/5'}`} style={{ animationDelay: '3s' }} />
                <div className={`absolute inset-0 opacity-[0.03] dark:opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:32px_32px]`} />
            </div>

            {/* Header do Menu */}
            <header className="relative z-30 w-full h-24 flex items-center justify-between px-8 shrink-0 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center">
                    <img
                        src="/logo.webp"
                        alt="Eliezer Pérez Logo"
                        className="h-12 w-auto object-contain"
                    />
                </div>

                <button
                    onClick={onClose}
                    className="size-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 active:scale-90 transition-all group"
                >
                    <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform duration-300">close</span>
                </button>
            </header>

            {/* Links de Navegação */}
            <div className="relative z-20 flex-1 flex flex-col overflow-y-auto no-scrollbar px-6 py-4">
                <nav className="flex flex-col gap-1.5 mt-4" role="menu">
                    {MENU_ITEMS.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`group relative flex items-center justify-between py-4 px-6 rounded-[1.25rem] transition-all duration-300 border ${isActive
                                    ? 'bg-primary/5 dark:bg-white/5 border-primary/20'
                                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                                    } animate-fade-in`}
                                style={{ animationDelay: `${100 + index * 40}ms`, animationFillMode: 'both' }}
                            >
                                <div className="flex items-center gap-5">
                                    <span className={`text-xl font-black uppercase tracking-tighter transition-all duration-300 ${isActive ? 'text-slate-900 dark:text-white translate-x-1' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1'
                                        }`}>
                                        {item.label}
                                    </span>
                                </div>
                                <div className={`size-9 flex items-center justify-center rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-glow' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-700'
                                    }`}>
                                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                </div>
                            </Link>
                        );
                    })}

                    {/* Bloco de Alternância de Tema - Agora com cores dinâmicas */}
                    <div className="mt-8 px-2 animate-fade-in" style={{ animationDelay: '450ms', animationFillMode: 'both' }}>
                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] mb-4 pl-4">Interface Preference</p>
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-primary/20 active:scale-[0.98] transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-500'}`}>
                                    <span className="material-symbols-outlined text-[20px]">
                                        {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                                    </span>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                        Thème : {theme === 'dark' ? 'Sombre' : 'Clair'}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                                        Inverser l'ambiance
                                    </span>
                                </div>
                            </div>
                            <div className="size-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">sync</span>
                            </div>
                        </button>
                    </div>

                    {/* Bloc de sélection de langue */}
                    <div className="mt-6 px-2 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] mb-4 pl-4">{t.changeLang}</p>
                        <div className="grid grid-cols-4 gap-2">
                            {(['fr', 'en', 'pt', 'es'] as const).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`py-4 rounded-2xl border font-black text-xs uppercase tracking-tighter transition-all ${language === lang
                                        ? 'bg-primary border-primary text-white shadow-glow'
                                        : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:border-primary/20'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Footer do Menu */}
            <footer className="relative z-30 w-full px-8 pb-8 pt-6 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#05080a] shrink-0 animate-fade-in transition-colors duration-700" style={{ animationDelay: '550ms', animationFillMode: 'both' }}>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1 text-left">
                            <span className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">Localisation</span>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xs">location_on</span>
                                <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">Paris, FR</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">Disponibilité</span>
                            <div className="flex items-center justify-end gap-2">
                                <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">24/7 Remote</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100 dark:border-white/5">
                        <a href="https://www.linkedin.com/in/sierraperezeliezer/" target="_blank" rel="noreferrer" className="text-[8px] font-black text-slate-400 dark:text-slate-500 hover:text-primary transition-colors uppercase tracking-[0.2em]">LinkedIn</a>
                        <a href="https://github.com/sierraperez" target="_blank" rel="noreferrer" className="text-[8px] font-black text-slate-400 dark:text-slate-500 hover:text-primary transition-colors uppercase tracking-[0.2em]">GitHub</a>
                        <a href="https://www.malt.fr/profile/eliezersierraperez" target="_blank" rel="noreferrer" className="text-[8px] font-black text-slate-400 dark:text-slate-500 hover:text-primary transition-colors uppercase tracking-[0.2em]">Malt</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Navigation;
