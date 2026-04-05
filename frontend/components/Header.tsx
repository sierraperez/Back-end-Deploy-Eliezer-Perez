import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { useTheme } from '../context/ThemeContext';
import profileImage from '../assets/Eliezerperezphoto.webp';

interface HeaderProps {
    title?: string;
    titleTag?: 'h1' | 'h2' | 'div';
    showBack?: boolean;
    showProfile?: boolean;
    rightAction?: React.ReactNode;
    onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, titleTag = 'div', showBack = true, showProfile = false, onMenuToggle }) => {
    const navigate = useNavigate();
    const TitleElement = titleTag;
    const { language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const t = translations[language];
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'fr', label: 'French', flag: '🇫🇷' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'pt', label: 'Português', flag: '🇵🇹' },
        { code: 'es', label: 'Español', flag: '🇪🇸' }
    ] as const;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleHomeNavigation = () => {
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.03] h-20 shrink-0 transition-all duration-700 ease-in-out">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-5 h-full w-full">

                <div className="flex items-center gap-3 overflow-hidden h-full">
                    {showBack ? (
                        <button
                            onClick={handleHomeNavigation}
                            className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-all py-2 pr-4 focus-visible:ring-2 focus-visible:ring-primary rounded-xl outline-none"
                            aria-label={t.back}
                        >
                            <div className="flex items-center justify-center size-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:bg-primary group-hover:border-primary/50 transition-all text-slate-600 dark:text-white shrink-0">
                                <span className="material-symbols-outlined text-xl" aria-hidden="true">arrow_back</span>
                            </div>
                            <TitleElement className="text-slate-900 dark:text-white text-base font-black tracking-tight group-hover:text-primary transition-colors truncate uppercase">
                                {title}
                            </TitleElement>
                        </button>
                    ) : showProfile ? (
                        <button
                            onClick={handleHomeNavigation}
                            className="flex items-center cursor-pointer group active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-primary rounded-xl outline-none"
                        >
                            <div className="relative size-16 shrink-0">
                                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img
                                    src="/logo.webp"
                                    alt="Eliezer Pérez Logo"
                                    className="relative size-full object-contain transition-all group-hover:scale-105"
                                />
                            </div>

                        </button>
                    ) : null}
                </div>

                <div className="flex items-center shrink-0 gap-3">
                    {/* Language Dropdown */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className={`size-11 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-white hover:text-primary dark:hover:text-primary active:scale-90 transition-all outline-none font-black text-[10px] ${isLangOpen ? 'border-primary ring-2 ring-primary/20 bg-white dark:bg-white/10' : ''}`}
                            aria-label={t.changeLang}
                        >
                            {language.toUpperCase()}
                        </button>

                        {isLangOpen && (
                            <div className="absolute top-full right-0 mt-3 w-40 py-2 bg-white dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl animate-fade-in-up origin-top-right overflow-hidden">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code as any);
                                            setIsLangOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 ${language === lang.code ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}
                                    >
                                        <span className="text-base leading-none">{lang.flag}</span>
                                        <span className="text-[11px] font-black uppercase tracking-widest">{lang.label}</span>
                                        {language === lang.code && (
                                            <span className="ml-auto material-symbols-outlined text-sm">check</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="size-11 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-white hover:text-primary dark:hover:text-primary active:scale-90 transition-all outline-none"
                        aria-label="Alternar tema"
                    >
                        <span className="material-symbols-outlined text-[22px]">
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    <div className="lg:hidden flex items-center">
                        {onMenuToggle && (
                            <button
                                onClick={onMenuToggle}
                                className="size-11 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] active:scale-95 transition-all outline-none"
                                aria-label="Menu"
                            >
                                <span className="material-symbols-outlined text-[24px]">menu</span>
                            </button>
                        )}
                    </div>

                    <div className="hidden lg:flex items-center ml-2">
                        <button
                            onClick={() => navigate('/contact')}
                            className="h-11 px-7 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-glow hover:scale-105 active:scale-95 transition-all outline-none border border-primary-hover"
                        >
                            {t.startProject}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
