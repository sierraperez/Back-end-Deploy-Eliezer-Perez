
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const Method: React.FC<{ onOpenMenu?: () => void }> = ({ onOpenMenu }) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];

    const STEPS = [
        { num: '01', title: t.step1Title, icon: 'search', desc: t.step1Desc, active: true },
        { num: '02', title: t.step2Title, icon: 'description', desc: t.step2Desc },
        { num: '03', title: t.step3Title, icon: 'code', desc: t.step3Desc },
        { num: '04', title: t.step4Title, icon: 'rocket_launch', desc: t.step4Desc }
    ];

    return (
        <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-500 overflow-y-auto no-scrollbar">
            <SEO
                title="Méthode - Processus de Développement en 4 Étapes"
                description="Découvrez ma méthode de travail structurée en 4 phases : audit & stratégie, conception, développement agile et déploiement. Processus éprouvé pour garantir des projets réussis."
                keywords="méthode développement web, processus automatisation, workflow projet freelance"
            />
            <Header title={t.methodTitle} onMenuToggle={onOpenMenu} />

            <main className="px-5 md:px-12 pt-10 pb-32 md:pb-20 max-w-6xl mx-auto w-full" aria-labelledby="method-hero-heading">
                <div className="mb-16 md:mb-24 animate-fade-in text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6">Workflow Excellence</p>
                    <h1 id="method-hero-heading" className="text-4xl md:text-7xl font-black leading-tight tracking-tighter text-slate-900 dark:text-white mb-8 uppercase">
                        {t.methodHero}
                    </h1>
                    <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium mx-auto md:mx-0">
                        {t.methodDesc}
                    </p>
                </div>

                <div className="relative flex flex-col gap-8 md:gap-4" role="list">
                    <div className="absolute left-[20px] md:left-[32px] top-10 bottom-10 w-[1px] bg-gradient-to-b from-primary/50 via-primary/10 to-transparent hidden md:block" aria-hidden="true"></div>

                    {STEPS.map((step, idx) => (
                        <div key={step.num} className="relative flex flex-col md:flex-row gap-6 md:gap-12 animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                            <div className="flex items-center md:flex-col gap-4 md:gap-0 shrink-0">
                                <div className={`flex h-12 w-12 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl shadow-xl transition-all duration-500 border relative z-10 ${step.active
                                    ? 'bg-primary text-white border-primary shadow-glow scale-110'
                                    : 'bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/10'
                                    }`} aria-hidden="true">
                                    <span className="material-symbols-outlined text-[24px] md:text-[32px]">{step.icon}</span>
                                    <span className="absolute -top-2 -right-2 md:hidden size-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[8px] font-black flex items-center justify-center rounded-lg border border-slate-200">
                                        {step.num}
                                    </span>
                                </div>

                                <div className="md:hidden flex flex-col">
                                    <h2 className="text-slate-900 dark:text-white font-black text-lg uppercase tracking-tight leading-none">
                                        {step.title.split('. ')[1] || step.title}
                                    </h2>
                                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1.5">Process Stage</span>
                                </div>

                                {idx !== STEPS.length - 1 && (
                                    <div className="hidden md:block h-24 w-[1px] bg-slate-200 dark:bg-white/5 my-4" aria-hidden="true"></div>
                                )}
                            </div>

                            <div className="flex-1">
                                <section className={`group relative h-full flex flex-col gap-5 rounded-[2.5rem] p-8 md:p-12 shadow-sm transition-all duration-500 border backdrop-blur-md overflow-hidden ${step.active
                                    ? 'bg-white dark:bg-primary/5 border-primary/30 ring-1 ring-primary/10 shadow-lg'
                                    : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:border-primary/20'
                                    }`}>
                                    <div className="absolute -top-24 -right-24 size-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>

                                    <div className="hidden md:flex items-center justify-between gap-4 mb-2">
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                                            {step.title}
                                        </h2>
                                        <span className={`text-[10px] font-black px-4 py-2 rounded-xl tracking-widest uppercase transition-all ${step.active ? 'bg-primary text-white shadow-glow' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                                            }`}>
                                            STEP {step.num}
                                        </span>
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-300 text-base md:text-xl leading-relaxed font-medium">
                                        {step.desc}
                                    </p>

                                    <div className="md:hidden mt-4 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                        <div className="flex gap-1.5">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className={`h-1 w-4 rounded-full transition-all ${i < idx + 1 ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`} />
                                            ))}
                                        </div>
                                        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            Phase {idx + 1}/4
                                        </span>
                                    </div>
                                </section>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />

            <div className="fixed bottom-6 left-6 right-6 z-[100] md:hidden">
                <button
                    onClick={() => navigate('/contact')}
                    className="w-full flex items-center justify-between bg-primary text-white px-8 h-16 rounded-[2rem] transition-all shadow-glow active:scale-95 group overflow-hidden"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">Lancer un projet</span>
                    <div className="size-10 rounded-2xl bg-white/10 flex items-center justify-center relative z-10">
                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">east</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
            </div>
        </div>
    );
};

export default Method;
