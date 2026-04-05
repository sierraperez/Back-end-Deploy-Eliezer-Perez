
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

interface ProjectsProps {
    onOpenMenu?: () => void;
}

interface Project {
    id: string;
    title: string;
    category: 'Web' | 'Mobile' | 'IA' | 'Automation';
    image: string;
    tags: string[];
    detailedStack: string[];
    resultLabelKey: 'performance' | 'gains' | 'growth';
    resultValue: string;
    impactColor: 'purple' | 'emerald' | 'blue';
    impactIcon: string;
    challengeKey: string;
    solutionKey: string;
    roleKey: string;
    detailsKey: string;
}

const Projects: React.FC<ProjectsProps> = ({ onOpenMenu }) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];
    const [filter, setFilter] = useState<'Tous' | 'Web' | 'Mobile' | 'IA' | 'Automation'>('Tous');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const PROJECTS: Project[] = [
        {
            id: '1',
            title: t.project1Title,
            category: 'IA',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
            tags: ['OpenAI', 'LangChain', 'Next.js'],
            detailedStack: ['OpenAI GPT-4', 'LangChain', 'Next.js 14', 'Pinecone', 'TailwindCSS'],
            resultLabelKey: 'performance',
            resultValue: t.project1Result,
            impactColor: 'purple',
            impactIcon: 'smart_toy',
            challengeKey: t.project1Challenge,
            solutionKey: t.project1Solution,
            roleKey: t.project1Role,
            detailsKey: t.project1Details
        },
        {
            id: '2',
            title: t.project2Title,
            category: 'Automation',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
            tags: ['n8n', 'Airtable', 'Stripe'],
            detailedStack: ['n8n', 'Airtable', 'Stripe API', 'Webhooks', 'PostgreSQL'],
            resultLabelKey: 'gains',
            resultValue: t.project2Result,
            impactColor: 'emerald',
            impactIcon: 'sync',
            challengeKey: t.project2Challenge,
            solutionKey: t.project2Solution,
            roleKey: t.project2Role,
            detailsKey: t.project2Details
        },
        {
            id: '3',
            title: t.project3Title,
            category: 'Web',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
            tags: ['React', 'Node.js', 'PostgreSQL'],
            detailedStack: ['React 18', 'Node.js (Express)', 'PostgreSQL', 'Prisma', 'Redux Toolkit'],
            resultLabelKey: 'growth',
            resultValue: t.project3Result,
            impactColor: 'blue',
            impactIcon: 'trending_up',
            challengeKey: t.project3Challenge,
            solutionKey: t.project3Solution,
            roleKey: t.project3Role,
            detailsKey: t.project3Details
        },
        {
            id: '4',
            title: t.project4Title,
            category: 'Web',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
            tags: ['React', 'Framer Motion', 'Tailwind'],
            detailedStack: ['React', 'Framer Motion', 'TailwindCSS', 'Google Calendar API', 'Firebase'],
            resultLabelKey: 'growth',
            resultValue: t.project4Result,
            impactColor: 'emerald',
            impactIcon: 'restaurant',
            challengeKey: t.project4Challenge,
            solutionKey: t.project4Solution,
            roleKey: t.project4Role,
            detailsKey: t.project4Details
        },
        {
            id: '5',
            title: t.project5Title,
            category: 'Web',
            image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800',
            tags: ['React', 'Node.js', 'n8n'],
            detailedStack: ['React', 'Node.js', 'n8n', 'Airtable', 'SendGrid'],
            resultLabelKey: 'gains',
            resultValue: t.project5Result,
            impactColor: 'blue',
            impactIcon: 'cleaning_services',
            challengeKey: t.project5Challenge,
            solutionKey: t.project5Solution,
            roleKey: t.project5Role,
            detailsKey: t.project5Details
        }
    ];

    const CATEGORIES = [
        { id: 'Tous', label: t.filterAll },
        { id: 'Web', label: t.catWeb },
        { id: 'IA', label: t.catIA },
        { id: 'Automation', label: t.catAutomation },
        { id: 'Mobile', label: t.catMobile }
    ] as const;

    const filtered = PROJECTS.filter(p => filter === 'Tous' || p.category === filter);

    return (
        <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar transition-colors duration-500">
            <SEO
                title="Projets - Portfolio d'Automatisation n8n, IA & Web"
                description="Découvrez mes réalisations : agents IA conversationnels, automatisations n8n pour PME, applications web SaaS React/Node.js. Résultats concrets : +90% de productivité, économie de 15h/semaine."
                keywords="portfolio développeur react, projets automatisation n8n, exemples agent ia, réalisations web freelance"
                breadcrumbs={[
                    { name: 'Accueil', item: '/' },
                    { name: 'Projets', item: '/projects' }
                ]}
            />
            <Header title={t.projectsTitle} onMenuToggle={onOpenMenu} titleTag="h1" />

            <div className="sticky top-20 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors duration-500">
                <div className="max-w-7xl mx-auto flex items-center h-16 md:h-20">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 w-full">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`flex h-10 md:h-11 shrink-0 items-center justify-center rounded-full px-6 transition-all duration-300 active:scale-90 snap-start border text-xs md:text-sm font-black uppercase tracking-wider ${filter === cat.id
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-primary/40'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full mb-20 animate-fade-in">
                {filtered.map(proj => (
                    <article key={proj.id} className="flex flex-col rounded-[2.5rem] bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-500 shadow-sm">
                        <div className="relative h-60 md:h-72 w-full overflow-hidden bg-slate-100 dark:bg-white/5">
                            <img
                                src={proj.image}
                                alt={proj.title}
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Eye Overlay */}
                            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-all duration-500 flex items-center justify-center">
                                <button
                                    onClick={() => setSelectedProject(proj)}
                                    className="size-16 rounded-full bg-primary/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 shadow-2xl shadow-primary/40"
                                >
                                    <span className="material-symbols-outlined text-3xl">visibility</span>
                                </button>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none"></div>

                            <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-2 transition-transform duration-500 group-hover:-translate-y-1">
                                <span className="w-fit bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-lg shadow-primary/30">
                                    {proj.category === 'Web' ? t.catWeb :
                                        proj.category === 'IA' ? t.catIA :
                                            proj.category === 'Automation' ? t.catAutomation :
                                                proj.category === 'Mobile' ? t.catMobile : proj.category}
                                </span>
                                <h3 className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-lg">{proj.title}</h3>
                            </div>
                        </div>

                        <div className="flex flex-col p-8 gap-6 flex-1">
                            <div className="flex flex-wrap gap-2">
                                {proj.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/5">{tag}</span>
                                ))}
                            </div>

                            <div className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 ${proj.impactColor === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/20 text-emerald-600 dark:text-emerald-400' : proj.impactColor === 'blue' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/20 text-blue-600 dark:text-blue-400' : 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/20 text-purple-600 dark:text-purple-400'}`}>
                                <div className="flex items-center justify-center size-12 rounded-xl shrink-0 bg-current/10"><span className="material-symbols-outlined text-[28px] fill-icon">{proj.impactIcon}</span></div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">{t[proj.resultLabelKey]}</p>
                                    <p className="text-sm font-black tracking-tight leading-tight">{proj.resultValue}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedProject(proj)}
                                className="h-14 mt-auto flex items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.2em] hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all active:scale-95 shadow-xl"
                            >
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                {t.projectDetails}
                            </button>
                        </div>
                    </article>
                ))}
            </main>

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                    <div
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl transition-opacity"
                        onClick={() => setSelectedProject(null)}
                    ></div>

                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto no-scrollbar animate-scale-in">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-6 right-6 z-10 size-12 flex items-center justify-center rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-slate-900 dark:text-white hover:bg-primary hover:text-white transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="flex flex-col lg:flex-row h-full">
                            {/* Project Image Panel */}
                            <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-full">
                                <img
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10">
                                    <span className="bg-primary text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl">
                                        {selectedProject.category}
                                    </span>
                                </div>
                            </div>

                            {/* Project Info Panel */}
                            <div className="lg:w-1/2 p-8 md:p-12 flex flex-col">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
                                    {selectedProject.title}
                                </h2>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {selectedProject.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="space-y-8">
                                    <section>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-lg">psychology</span>
                                            </div>
                                            <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">{t.challenge}</h4>
                                        </div>
                                        <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                            {selectedProject.challengeKey}
                                        </p>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-emerald-500 text-lg">lightbulb</span>
                                            </div>
                                            <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">{t.solution}</h4>
                                        </div>
                                        <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                            {selectedProject.solutionKey}
                                        </p>
                                    </section>

                                    <section className={`p-6 rounded-2xl border ${selectedProject.impactColor === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/20' : selectedProject.impactColor === 'blue' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/20' : 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/20'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`size-12 rounded-xl flex items-center justify-center bg-white dark:bg-white/10 shadow-sm ${selectedProject.impactColor === 'emerald' ? 'text-emerald-500' : selectedProject.impactColor === 'blue' ? 'text-blue-500' : 'text-purple-500'}`}>
                                                <span className="material-symbols-outlined text-[28px]">{selectedProject.impactIcon}</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">{t[selectedProject.resultLabelKey]}</p>
                                                <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{selectedProject.resultValue}</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <button
                                    onClick={() => navigate('/contact')}
                                    className="h-14 mt-12 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-glow hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {t.startProject}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Projects;
