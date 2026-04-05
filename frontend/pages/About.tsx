import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import profileImage from '../assets/Eliezerperezphoto.webp';

interface AboutProps {
    onOpenMenu?: () => void;
}

const TECH_STACK = ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind', 'N8N', 'OpenAI', 'PostgreSQL'];

const About: React.FC<AboutProps> = ({ onOpenMenu }) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];

    const SOCIAL_LINKS = [
        { icon: 'work', label: 'LinkedIn', url: 'https://www.linkedin.com/in/sierraperezeliezer/' },
        { icon: 'code', label: 'GitHub', url: 'https://github.com/sierraperez' },
        { icon: 'photo_camera', label: 'Instagram', url: 'https://www.instagram.com/eliezerperez.dev/' },
        { icon: 'alternate_email', label: 'Email', url: 'mailto:contact@eliezerperez.com' }
    ];

    return (
        <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-500 overflow-y-auto no-scrollbar">
            <SEO
                title="À propos - Développeur Full-Stack Expert en n8n & IA"
                description="Découvrez Eliezer Pérez, développeur Full-Stack avec 3+ ans d'expérience en automatisation n8n, React, Node.js et IA. Spécialisé dans la création de solutions sur-mesure pour startups et PME."
                keywords="développeur full stack paris, expert n8n freelance, automatisation ia, react nodejs specialist"
                type="profile"
                breadcrumbs={[
                    { name: 'Accueil', item: '/' },
                    { name: 'À propos', item: '/about' }
                ]}
            />
            <Header title={t.navAbout} showBack={true} titleTag="div" onMenuToggle={onOpenMenu} />

            <main className="max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex-1">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">

                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start animate-fade-in mb-16 lg:mb-0">
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-all duration-1000" aria-hidden="true"></div>

                            <div className="relative size-56 md:size-72 rounded-[40px] p-1.5 bg-gradient-to-tr from-primary to-blue-400 shadow-xl rotate-2 transition-transform group-hover:rotate-6 duration-500">
                                <div className="relative size-full rounded-[34px] bg-slate-100 dark:bg-slate-800 -rotate-2 transition-transform group-hover:-rotate-6 duration-500 shadow-inner overflow-hidden border-4 border-white dark:border-slate-900">
                                    {/* OTIMIZAÇÃO: Fetchpriority high para imagem de herói/perfil */}
                                    <img
                                        src={profileImage}
                                        alt={t.aboutImgAlt}
                                        fetchPriority="high"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">Eliezer Pérez</h1>
                            <p className="text-primary font-bold text-sm uppercase tracking-[0.25em] mb-6">{t.aboutRole}</p>

                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-8 max-w-lg mx-auto lg:mx-0 font-medium">
                                {t.aboutBio.split(' ').map((word, i) =>
                                    ['IA', 'Generative', 'React', 'Node.js', 'n8n'].includes(word.replace(/[.,]/g, ''))
                                        ? <strong key={i} className="text-slate-900 dark:text-white">{word} </strong>
                                        : word + ' '
                                )}
                            </p>

                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm mb-8 max-w-lg mx-auto lg:mx-0 font-medium italic border-l-2 border-primary/30 pl-4">
                                {t.aboutExpertise}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6 mb-12">
                                <div className="flex items-center gap-4">
                                    {SOCIAL_LINKS.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="size-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:border-primary transition-all duration-300 group shadow-sm"
                                            aria-label={social.label}
                                        >
                                            <span className="material-symbols-outlined text-[22px] group-hover:fill-icon transition-all">{social.icon}</span>
                                        </a>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate('/contact')}
                                    className="px-6 py-4 rounded-2xl bg-primary/5 border border-primary/20 hover:border-primary/40 text-primary transition-all duration-300 flex items-center gap-4 group/cta shadow-sm hover:shadow-md"
                                >
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Projets & Services</span>
                                        <span className="text-sm font-bold leading-tight text-left">
                                            {t.aboutInternalLink}
                                        </span>
                                    </div>
                                    <span className="material-symbols-outlined text-xl group-hover/cta:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <section className="lg:col-span-7 space-y-8" aria-labelledby="expertise-heading">
                        <h3 id="expertise-heading" className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4">{t.helpsTitle}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between min-h-[180px] group hover:border-primary/40 transition-all shadow-sm backdrop-blur-sm">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    <span className="material-symbols-outlined fill-icon">bolt</span>
                                </div>
                                <div>
                                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-1 uppercase tracking-tight">{t.startupTitle}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">{t.startupDesc}</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between min-h-[180px] group hover:border-blue-400/40 transition-all shadow-sm backdrop-blur-sm">
                                <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mb-4">
                                    <span className="material-symbols-outlined fill-icon">sync_alt</span>
                                </div>
                                <div>
                                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-1 uppercase tracking-tight">{t.pmeTitle}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">{t.pmeDesc}</p>
                                </div>
                            </div>

                            <div className="md:col-span-2 bg-slate-900 dark:bg-white rounded-[2rem] p-8 flex flex-col justify-center min-h-[160px] shadow-2xl relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 size-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                                <span className="text-6xl md:text-7xl font-black text-white dark:text-slate-900 tracking-tighter relative z-10">3+</span>
                                <span className="text-xs md:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2 relative z-10">{t.expYears}</span>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-end min-h-[160px] group hover:border-primary/30 transition-all shadow-sm backdrop-blur-sm">
                                <span className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase">{t.customTitle}</span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{t.customDesc}</p>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-end min-h-[160px] relative overflow-hidden group hover:border-blue-400/30 transition-all shadow-sm backdrop-blur-sm">
                                <span className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase">{t.businessTitle}</span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{t.businessDesc}</p>
                            </div>
                        </div>

                        <div className="pt-8">
                            <h5 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6">{t.stackTitle}</h5>
                            <div className="flex flex-wrap gap-3">
                                {TECH_STACK.map((tech) => (
                                    <div
                                        key={tech}
                                        className="px-5 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm font-bold hover:border-primary hover:text-primary transition-all cursor-default shadow-sm"
                                    >
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mini-FAQ SEO Section */}
                        <div className="pt-16 mt-16 border-t border-slate-100 dark:border-white/5 animate-fade-in" style={{ animationDelay: '400ms' }}>
                            <h3 className="text-slate-900 dark:text-white font-black text-lg mb-8 uppercase tracking-tight">{t.aboutFaqTitle}</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    { q: t.aboutFaqQ1, a: t.aboutFaqA1 },
                                    { q: t.aboutFaqQ2, a: t.aboutFaqA2 }
                                ].map((faq, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h4 className="text-xs font-black text-primary uppercase tracking-widest">{faq.q}</h4>
                                        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default About;
