
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

interface ServicesProps {
    onOpenMenu?: () => void;
}

const Services: React.FC<ServicesProps> = ({ onOpenMenu }) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];

    const SERVICE_CARDS = [
        {
            title: t.service1Title,
            desc: t.service1Desc,
            price: t.service1Price,
            stack: t.service1Stack,
            stackWhy: t.service1StackWhy,
            icon: 'web',
            color: 'blue'
        },
        {
            title: t.service2Title,
            desc: t.service2Desc,
            price: t.service2Price,
            stack: t.service2Stack,
            stackWhy: t.service2StackWhy,
            icon: 'terminal',
            color: 'primary'
        },
        {
            title: t.service3Title,
            desc: t.service3Desc,
            price: t.service3Price,
            stack: t.service3Stack,
            stackWhy: t.service3StackWhy,
            icon: 'smart_toy',
            color: 'purple'
        },
        {
            title: t.service4Title,
            desc: t.service4Desc,
            price: t.service4Price,
            stack: t.service4Stack,
            stackWhy: t.service4StackWhy,
            icon: 'settings_suggest',
            color: 'orange'
        },
        {
            title: t.service5Title,
            desc: t.service5Desc,
            price: t.service5Price,
            stack: t.service5Stack,
            stackWhy: t.service5StackWhy,
            icon: 'query_stats',
            color: 'emerald'
        },
        {
            title: t.service6Title,
            desc: t.service6Desc,
            price: t.service6Price,
            stack: t.service6Stack,
            stackWhy: t.service6StackWhy,
            icon: 'dns',
            color: 'rose'
        }
    ];

    return (
        <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-500 overflow-y-auto no-scrollbar">
            <SEO
                title="Solutions d'Automatisation & IA France"
                description="Services de développement Full-Stack, n8n et IA basés em France. Solutions sur-mesure pour startups et entreprises : MVP, Intégrations API et maintenance IA."
                keywords="automatisation n8n france, agence workflow ia paris, développeur fullstack france, mvp startup ia"
                breadcrumbs={[
                    { name: 'Accueil', item: '/' },
                    { name: 'Services', item: '/services' }
                ]}
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "serviceType": "Développement Web & Automatisation",
                    "provider": {
                        "@type": "Person",
                        "name": "Eliezer Pérez"
                    },
                    "areaServed": "FR",
                    "offers": {
                        "@type": "AggregateOffer",
                        "priceCurrency": "EUR",
                        "lowPrice": "800"
                    }
                }}
            />
            <Header title={t.navServices} showBack={true} titleTag="div" onMenuToggle={onOpenMenu} />

            <main className="max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex-1 flex flex-col items-center">
                <section className="text-center mb-16 md:mb-24 animate-fade-in max-w-3xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary mb-6">{t.servicesSubtitle}</p>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-8 leading-tight">
                        {t.servicesHero}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
                        {t.servicesDesc}
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full animate-fade-in" style={{ animationDelay: '200ms' }}>
                    {SERVICE_CARDS.map((service, idx) => (
                        <div
                            key={idx}
                            className="group relative p-8 md:p-10 rounded-[3rem] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 backdrop-blur-md flex flex-col h-full transition-all duration-500 hover:border-primary/40 hover:shadow-2xl shadow-sm"
                        >
                            <div className="size-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white mb-8 border border-slate-200 dark:border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500">
                                <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight uppercase group-hover:text-primary transition-colors">
                                {service.title}
                            </h2>

                            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                {service.desc}
                            </p>

                            {/* Stack Info */}
                            <div className="mb-8 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">layers</span>
                                    {t.stackLabel || "Stack"}
                                </p>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 font-mono">
                                    {service.stack}
                                </p>
                                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 italic border-l-2 border-primary/30 pl-3">
                                    "{service.stackWhy}"
                                </p>
                            </div>

                            <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{t.investment}</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-8">{service.price}</p>

                                <button
                                    onClick={() => navigate('/contact')}
                                    className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all active:scale-[0.98] shadow-lg"
                                >
                                    {t.requestQuote}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <section className="mt-32 p-10 md:p-16 rounded-[4rem] bg-gradient-to-br from-primary/10 via-white dark:via-primary/5 to-white dark:to-transparent border border-primary/20 w-full animate-fade-in text-center relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 size-64 bg-primary/5 dark:bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" aria-hidden="true"></div>

                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight uppercase relative z-10">{t.hybridNeedTitle}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto mb-10 font-medium relative z-10">
                        {t.hybridNeedDesc}
                    </p>

                    <button
                        onClick={() => navigate('/contact')}
                        className="relative z-10 bg-primary text-white font-black py-5 px-12 rounded-2xl shadow-glow hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest border border-primary-hover"
                    >
                        {t.bookCall}
                    </button>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Services;
