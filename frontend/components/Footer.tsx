
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];
    const currentYear = new Date().getFullYear();

    const socials = [
        { icon: 'work', label: 'LinkedIn', url: 'https://www.linkedin.com/in/sierraperezeliezer/', color: 'hover:bg-[#0A66C2] hover:text-white' },
        { icon: 'code', label: 'GitHub', url: 'https://github.com/sierraperez', color: 'hover:bg-white hover:text-slate-900' },
        { icon: 'photo_camera', label: 'Instagram', url: 'https://www.instagram.com/eliezerperez.dev/', color: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:text-white' },
        { icon: 'verified', label: 'Malt', url: 'https://www.malt.fr/profile/eliezersierraperez', color: 'hover:bg-[#FC5C63] hover:text-white' },
    ];

    return (
        <footer className="w-full px-6 pt-16 pb-12 mt-auto border-t border-white/5 bg-slate-900 transition-colors duration-700 ease-in-out">
            <div className="max-w-7xl mx-auto flex flex-col items-center">

                <div className="mb-10 opacity-80 hover:opacity-100 transition-opacity duration-500">
                    <img
                        src="/logo.webp"
                        alt="Eliezer Pérez Logo"
                        className="h-16 w-auto object-contain"
                    />

                </div>

                <div className="flex items-center justify-center gap-4 mb-12">
                    {socials.map((social) => (
                        <a
                            key={social.label}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 transition-all duration-300 hover:scale-110 hover:shadow-2xl group ${social.color}`}
                            title={social.label}
                            aria-label={social.label}
                        >
                            <span className="material-symbols-outlined text-[22px] group-hover:fill-icon transition-all" aria-hidden="true">
                                {social.icon}
                            </span>
                        </a>
                    ))}
                </div>

                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10" aria-label={t.footerAria}>
                    {[
                        { label: t.navProjects, path: '/projects' },
                        { label: t.navServices, path: '/services' },
                        { label: t.navExp, path: '/experience' },
                        { label: t.navMethod, path: '/method' },
                        { label: t.navAbout, path: '/about' },
                        { label: t.navContact, path: '/contact' }
                    ].map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="text-center space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        © {currentYear} • Handcrafted with passion by Eliezer Pérez
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/legal')}
                            className="text-[9px] text-slate-500 hover:text-white transition-colors uppercase tracking-tighter"
                        >
                            {t.legal}
                        </button>
                        <span className="text-[8px] text-slate-800" aria-hidden="true">•</span>
                        <button
                            onClick={() => navigate('/privacy')}
                            className="text-[9px] text-slate-500 hover:text-white transition-colors uppercase tracking-tighter"
                        >
                            {t.privacy}
                        </button>
                    </div>

                    <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-black">
                        Paris • Remote • Worldwide
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
