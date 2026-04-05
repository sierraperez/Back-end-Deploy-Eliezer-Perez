
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SEO from '../components/SEO';
import LinkedInPublications from '../components/LinkedInPublications';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

interface HomeProps {
    onOpenMenu?: () => void;
}

const Home: React.FC<HomeProps> = ({ onOpenMenu }) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            setMousePos({ x, y });
        };

        const handleScroll = () => {
            // Show only after scrolling 50% of the page
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            setShowScrollTop(scrollPercent > 50);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const VALUE_PROPOSITIONS = [
        {
            problem: t.problem1,
            solution: t.solution1,
            desc: t.desc1,
            icon: "history_toggle_off"
        },
        {
            problem: t.problem2,
            solution: t.solution2,
            desc: t.desc2,
            icon: "insights"
        },
        {
            problem: t.problem3,
            solution: t.solution3,
            desc: t.desc3,
            icon: "smart_toy"
        }
    ];

    const FAQ_ITEMS = [
        { q: t.q1, a: t.a1 },
        { q: t.q2, a: t.a2 },
        { q: t.q3, a: t.a3 },
        { q: t.q4, a: t.a4 },
    ];

    return (
        <div className="relative flex-1 flex flex-col overflow-y-auto no-scrollbar bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-500">
            <SEO
                title={t.metaTitle}
                description={t.metaDesc}
                keywords={t.metaKeywords}
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": FAQ_ITEMS.map(item => ({
                        "@type": "Question",
                        "name": item.q,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": item.a
                        }
                    }))
                }}
            />

            {/* --- Sistema de Fundo Dinâmico --- */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-blue-400/10 dark:bg-blue-600/5 blur-[160px] animate-blob" style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`, animationDuration: '25s' }} />
                <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-400/10 dark:bg-indigo-500/8 blur-[140px] animate-blob" style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)`, animationDelay: '2s', animationDuration: '18s' }} />
                <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-pink-400/10 dark:bg-pink-500/5 blur-[110px] animate-blob" style={{ transform: `translate(${mousePos.x * 60}px, ${mousePos.y * 30}px)`, animationDelay: '5s', animationDuration: '22s' }} />

                <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-light/40 dark:to-background-dark/60"></div>
            </div>

            <Header showBack={false} showProfile={true} titleTag="div" onMenuToggle={onOpenMenu} />

            <div className="p-6 md:p-12 lg:p-20 relative z-10">

                <div className="relative z-10 lg:grid lg:grid-cols-[1.3fr_0.7fr] lg:gap-20 lg:items-center">
                    <section className="flex flex-col animate-fade-in">
                        <div className="flex flex-wrap items-center gap-8 mb-10">
                            <span className="flex items-center gap-2.5 text-[9px] font-black tracking-[0.3em] uppercase text-green-600 dark:text-green-400">
                                <span className="size-1.5 rounded-full bg-green-500 dark:bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse"></span>
                                {t.availableContact}
                            </span>
                        </div>

                        <SEO
                            title="Expert n8n & IA à Paris | Développeur Full-Stack Senior"
                            description="Expert en automatisation n8n et intelligence artificielle à Paris. Automatisez vos processus métiers, gagnez 15h par semaine et boostez votre rentabilité."
                            keywords="expert n8n paris, freelance n8n france, automatisation ia paris, développeur fullstack freelance france"
                            jsonLd={{
                                "@context": "https://schema.org",
                                "@type": "ProfessionalService",
                                "name": "Eliezer Pérez - Expert Web Full-Stack, n8n & IA",
                                "url": "https://eliezerperez.com",
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": "Paris",
                                    "addressCountry": "FR"
                                },
                                "serviceType": ["Développement Web Full-Stack", "Automatisation n8n", "Intégration IA", "Architecture SaaS"],
                                "description": "Expert en développement Web Full-Stack, automatisation de workflows (n8n) et solutions d'IA sur-mesure pour PME."
                            }}
                        />
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[88px] font-black leading-[0.95] mb-12 tracking-tighter text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-2xl uppercase max-w-5xl">
                            {t.heroTitle.split(' ').map((word, i) => {
                                const cleanWord = word.toLowerCase().replace(/[.,!?;]/g, '');
                                const highlightWords = [
                                    'automatisation', 'web', 'intelligent', 'n8n', 'automation', 'automação', 'automatización', 'intelligente',
                                    'jusqu\'à', 'up', 'até', 'hasta'
                                ];
                                return highlightWords.includes(cleanWord)
                                    ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-500 to-indigo-600 block sm:inline">{word} </span>
                                    : word + ' ';
                            })}
                        </h1>
                        <h2 className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-bold opacity-80 uppercase tracking-widest italic border-l-2 border-primary/30 pl-4">
                            {t.heroSubtitle}
                        </h2>
                        <p className="text-primary font-bold text-sm mb-14 flex items-center gap-2">
                            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                            {t.heroReassurance}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 mb-16 lg:mb-0">
                            <button
                                onClick={() => navigate('/projects')}
                                className="w-full sm:w-auto py-5 px-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black shadow-2xl hover:bg-slate-800 dark:hover:bg-slate-100 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                            >
                                <span className="text-[10px] uppercase tracking-[0.2em]">{t.caseStudies}</span>
                                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">east</span>
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="w-full sm:w-auto py-5 px-10 rounded-2xl bg-transparent border border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white font-black hover:bg-slate-900/5 dark:hover:bg-white/[0.05] transition-all flex items-center justify-center gap-3"
                            >
                                <span className="material-symbols-outlined text-xl">rocket_launch</span>
                                <span className="text-[10px] uppercase tracking-[0.2em]">{t.launchProject}</span>
                            </button>
                        </div>
                    </section>

                    {/* Stats Aside */}
                    <aside className="flex flex-col gap-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="grid grid-cols-2 gap-5 md:gap-6 w-full max-w-sm mx-auto lg:mx-0">
                            <div className="relative overflow-hidden p-7 rounded-[2.5rem] bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center group transition-all duration-500 hover:border-primary/50 hover:shadow-xl dark:hover:bg-white/[0.08] hover:-translate-y-1">
                                <p className="text-5xl lg:text-4xl font-black text-primary mb-3 tracking-tighter">70%</p>
                                <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] leading-tight max-w-[80px]">{t.gainTime}</p>
                            </div>
                            <div className="relative overflow-hidden p-7 rounded-[2.5rem] bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center group transition-all duration-500 hover:border-primary/50 hover:shadow-xl dark:hover:bg-white/[0.08] hover:-translate-y-1">
                                <p className="text-5xl lg:text-4xl font-black text-primary mb-3 tracking-tighter">2+</p>
                                <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] leading-tight max-w-[80px]">{t.saasDeployed}</p>
                            </div>
                        </div>

                        <div className="space-y-6 lg:pl-2">
                            {[
                                { text: t.stat1, icon: 'hub' },
                                { text: t.stat2, icon: 'auto_awesome' },
                                { text: t.stat3, icon: 'verified_user' }
                            ].map((item) => (
                                <div key={item.text} className="flex items-center gap-5 text-[12px] lg:text-[13px] font-bold text-slate-600 dark:text-slate-300 group cursor-default transition-all hover:translate-x-2">
                                    <div className="size-6 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/5 group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:text-primary transition-all duration-300">
                                        <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                                    </div>
                                    <span className="tracking-wide group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                <section className="mt-48 relative z-10" aria-labelledby="expertise-title">
                    <div className="text-center mb-24 animate-fade-in">
                        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-primary mb-6">{t.expertiseTitle}</p>
                        <h2 id="expertise-title" className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            {['fr', 'pt', 'es'].includes(language) ? t.growthLever : ''} <span className="text-primary">{t.growth}</span>
                        </h2>
                    </div>
                    <div className="space-y-6 max-w-5xl mx-auto">
                        {VALUE_PROPOSITIONS.map((item, idx) => (
                            <div key={idx} className="relative grid md:grid-cols-[1fr_1fr] gap-12 p-12 rounded-[3.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-sm transition-all duration-700 hover:border-primary/30 hover:shadow-xl dark:hover:bg-white/[0.04] group animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                                <div className="space-y-3">
                                    <p className="text-rose-500 dark:text-rose-400 font-black text-[9px] uppercase tracking-[0.3em] opacity-60">{t.frictionPoint}</p>
                                    <h3 className="text-xl font-bold text-slate-400 dark:text-slate-500 line-through decoration-rose-500/40">{item.problem}</h3>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-emerald-600 dark:text-emerald-400 font-black text-[9px] uppercase tracking-[0.3em]">{t.techResult}</p>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{item.solution}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed mt-2">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Methodology Section --- */}
                <section className="mt-48 relative z-10 max-w-5xl mx-auto" aria-labelledby="method-title">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 id="method-title" className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">
                            {t.navMethod}
                        </h2>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
                        {[
                            { step: t.methodAnalyse, desc: t.methodAnalyseDesc, icon: "search" },
                            { step: t.methodSetup, desc: t.methodSetupDesc, icon: "construction" },
                            { step: t.methodProd, desc: t.methodProdDesc, icon: "rocket_launch" },
                            { step: t.methodOpti, desc: t.methodOptiDesc, icon: "query_stats" }
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-center animate-fade-in flex flex-col items-center group hover:border-primary/30 transition-colors duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3">{item.step}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Use Cases Section --- */}
                <section className="mt-48 relative z-10 max-w-6xl mx-auto" aria-labelledby="cases-title">
                    <div className="text-center mb-20 animate-fade-in">
                        <h2 id="cases-title" className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            {t.casesTitle} <span className="text-primary">{t.casesPme}</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: t.caseSupportTitle, prob: t.caseSupportProb, sol: t.caseSupportSol, bene: t.caseSupportBene, icon: "support_agent" },
                            { title: t.caseCrmTitle, prob: t.caseCrmProb, sol: t.caseCrmSol, bene: t.caseCrmBene, icon: "hub" },
                            { title: t.caseBackTitle, prob: t.caseBackProb, sol: t.caseBackSol, bene: t.caseBackBene, icon: "database" }
                        ].map((item, idx) => (
                            <div key={idx} className="p-10 rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all duration-500 group animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                                <div className="size-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary mb-8">
                                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">{item.title}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Problème</p>
                                        <p className="text-sm font-medium text-slate-500">{item.prob}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Solution</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{item.sol}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Bénéfice</p>
                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{item.bene}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <LinkedInPublications />

                {/* --- Security & Offer Section --- */}
                <div className="mt-48 grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <section className="p-12 rounded-[3.5rem] bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl animate-fade-in" aria-labelledby="sec-title">
                        <h2 id="sec-title" className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-8">
                            {t.secTitle}
                        </h2>
                        <div className="grid gap-6">
                            {[
                                { title: t.secRgpd, desc: t.secRgpdDesc, icon: "verified_user" },
                                { title: t.secEu, desc: t.secEuDesc, icon: "public" },
                                { title: t.secLock, desc: t.secLockDesc, icon: "lock" },
                                { title: t.secConf, desc: t.secConfDesc, icon: "gavel" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="p-12 rounded-[3.5rem] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 backdrop-blur-sm animate-fade-in flex flex-col justify-between" style={{ animationDelay: '200ms' }} aria-labelledby="offer-title">
                        <div>
                            <h2 id="offer-title" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-4">
                                {t.offerTitle}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium mb-8">
                                {t.offerDesc}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold">
                                <span className="material-symbols-outlined">check_circle</span>
                                <span>{t.offerSetup}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-xl">
                                <span className="material-symbols-outlined text-primary">payments</span>
                                <span>{t.offerPrice}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 font-medium italic">
                                <span className="material-symbols-outlined">event_repeat</span>
                                <span>{t.offerDelay} – {t.offerCommit}</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Floating Back to Top Button */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={`fixed bottom-8 right-8 z-[100] p-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl text-slate-400 dark:text-slate-500 hover:border-primary hover:text-primary hover:scale-110 active:scale-95 transition-all duration-500 group shadow-primary/20 ${showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                    aria-label={t.back || 'TOP'}
                >
                    <span className="material-symbols-outlined text-2xl group-hover:-translate-y-1 transition-transform duration-300">arrow_upward</span>
                </button>

                <section className="mt-48 relative z-10 max-w-3xl mx-auto" aria-labelledby="faq-title">
                    <div className="text-center mb-16 animate-fade-in">
                        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-primary mb-6">{t.faqSubtitle}</p>
                        <h2 id="faq-title" className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            {t.faqTitle.split(' ').map(w => ['questions', 'perguntas', 'preguntas'].includes(w.toLowerCase()) ? <span key={w} className="text-primary">{w} </span> : w + ' ')}
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, idx) => (
                            <div
                                key={idx}
                                className={`rounded-3xl border transition-all overflow-hidden animate-fade-in ${openFaq === idx ? 'bg-white dark:bg-white/[0.05] border-primary shadow-xl' : 'bg-white/50 dark:bg-transparent border-slate-200 dark:border-white/5 hover:border-primary/40 cursor-pointer'}`}
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <button className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none">
                                    <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight pr-4">{item.q}</h4>
                                    <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} aria-hidden="true">expand_more</span>
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 md:px-8 pb-8 animate-fade-in">
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{item.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-48 relative z-10 max-w-5xl mx-auto px-6" aria-labelledby="resource-title">
                    <div className="p-10 md:p-14 rounded-[3.5rem] bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 backdrop-blur-sm animate-fade-in flex flex-col md:flex-row items-center gap-10">
                        <div className="size-20 shrink-0 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-primary shadow-sm">
                            <span className="material-symbols-outlined text-4xl">menu_book</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 id="resource-title" className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
                                {t.externalLinkTitle}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                {t.externalLinkDesc}
                            </p>
                            <a
                                href={t.externalLinkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
                            >
                                Consulter le guide <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                        </div>
                    </div>
                </section>

                <section className="mt-48 animate-fade-in mb-20">
                    <div className="p-10 md:p-16 rounded-[4rem] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left shadow-2xl relative group overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight uppercase">{t.ctaTitle}</h4>
                            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg font-medium">{t.ctaSub}</p>
                        </div>
                        <button
                            onClick={() => navigate('/contact')}
                            className="relative z-10 bg-primary text-white font-black py-5 px-12 rounded-2xl shadow-glow hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest border border-primary-hover whitespace-nowrap"
                        >
                            {t.ctaButton}
                        </button>
                    </div>
                </section>
            </div>
            <Footer />
        </div >
    );
};

export default Home;
