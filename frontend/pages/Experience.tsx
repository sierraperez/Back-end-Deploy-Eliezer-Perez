
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

interface ExperienceProps {
    onOpenMenu?: () => void;
}

interface ExperienceItem {
    id: string;
    title: string;
    company: string;
    type: 'Freelance' | 'Salarié' | 'Formation';
    location: string;
    description: string;
    tags: string[];
    date: string;
    current?: boolean;
}

// Les listes sont maintenant générées dynamiquement dans le composant

const Experience: React.FC<ExperienceProps> = ({ onOpenMenu }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const [activeTab, setActiveTab] = useState<'Pro' | 'Form'>('Pro');

    const EXPERIENCES: ExperienceItem[] = [
        {
            id: '1',
            title: t.expTitle1,
            company: 'Freelance',
            type: 'Freelance',
            location: 'Paris, France',
            description: "Expertise senior en automatisation de processus complexes. J'ai conçu des solutions ayant généré +30% d'efficacité opérationnelle pour des clients internationaux, en intégrant des agents IA conversationnels haute performance.",
            tags: ['n8n', 'OpenAI', 'Agents IA', 'Python', 'React'],
            date: language === 'fr' ? 'Mars 2023 - Présent' : language === 'pt' ? 'Março 2023 - Presente' : language === 'es' ? 'Marzo 2023 - Presente' : 'March 2023 - Present',
            current: true
        },
        {
            id: '2',
            title: t.expTitle2,
            company: 'XBIN Informatique',
            type: 'Salarié',
            location: 'Portugal',
            description: t.expDesc2,
            tags: ['Linux', 'Virtualisation', 'Support IT', 'Windows Server'],
            date: '2021 - 2022'
        },
        {
            id: '3',
            title: t.expTitle3,
            company: 'Lidl & Cie',
            type: 'Salarié',
            location: 'Portugal',
            description: t.expDesc3,
            tags: ['Retail', 'SAP', 'Power BI', 'Management', 'KPI'],
            date: '2016 - 2021'
        }
    ];

    const FORMATIONS: ExperienceItem[] = [
        {
            id: 'f0',
            title: t.eduTitle0,
            company: 'IBM edX e-learning',
            type: 'Formation',
            location: t.eduLocation2,
            description: t.eduDesc0,
            tags: ['Cloud Computing', 'Express', 'Node.js', 'Python', 'Django'],
            date: t.eduDate0
        },
        {
            id: 'f1',
            title: t.eduTitle1,
            company: 'OpenClassrooms',
            type: 'Formation',
            location: t.eduLocation1,
            description: t.eduDesc1,
            tags: ['PHP', 'JavaScript', 'SCSS', 'SQL'],
            date: t.eduDate1
        },
        {
            id: 'f2',
            title: t.eduTitle2,
            company: 'Harvard University (edX)',
            type: 'Formation',
            location: t.eduLocation2,
            description: t.eduDesc2,
            tags: ['Computer Science', 'Algorithms', 'SQL'],
            date: t.eduDate2
        },
        {
            id: 'f3',
            title: t.eduTitle3,
            company: t.eduLocation3,
            type: 'Formation',
            location: t.eduLocation3,
            description: t.eduDesc3,
            tags: ['Gestion', 'Économie', 'Management', 'Finance'],
            date: t.eduDate3
        }
    ];

    const list = activeTab === 'Pro' ? EXPERIENCES : FORMATIONS;

    return (
        <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-500 overflow-y-auto no-scrollbar">
            <SEO
                title="Expérience & Formations - Expert Automation"
                description="Parcours professionnel de Eliezer Pérez : Expert en automatisation n8n, développement Full-Stack et intégration d'IA. Certification IBM et formation CS50."
                keywords="expérience développeur n8n, cv automation paris, expert fullstack freelance, ibm certified developer"
                breadcrumbs={[
                    { name: 'Accueil', item: '/' },
                    { name: 'Expérience', item: '/experience' }
                ]}
            />
            <Header
                showBack={true}
                showProfile={false}
                title={t.expTitle}
                titleTag="h1"
                onMenuToggle={onOpenMenu}
                rightAction={
                    <button className="flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20">
                        {t.cvButton}
                    </button>
                }
            />

            {/* Tabs */}
            <div className="px-6 mt-8">
                <div className="flex p-1.5 bg-slate-200/50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                    <button
                        onClick={() => setActiveTab('Pro')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Pro' ? 'bg-white dark:bg-slate-800 text-primary shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        {t.tabExp}
                    </button>
                    <button
                        onClick={() => setActiveTab('Form')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Form' ? 'bg-white dark:bg-slate-800 text-primary shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        {t.tabEdu}
                    </button>
                </div>
            </div>

            <main className="flex-1 px-6 pt-10 pb-20">
                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute left-[23px] top-4 bottom-0 w-[2px] bg-slate-200 dark:bg-white/5"></div>

                    {list.map((item) => (
                        <div key={item.id} className="relative pl-16 mb-12 animate-fade-in">
                            {/* Dot / Icon */}
                            <div className={`absolute left-0 top-1.5 z-10 size-12 rounded-2xl flex items-center justify-center border-4 border-background-light dark:border-background-dark shadow-xl transition-all ${item.current ? 'bg-primary text-white scale-110 shadow-glow' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-white/5'
                                }`}>
                                <span className="material-symbols-outlined text-[22px]">
                                    {item.type === 'Formation' ? 'school' : item.current ? 'rocket_launch' : 'work'}
                                </span>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-3xl p-7 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.date}</span>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1.5 leading-tight uppercase tracking-tight">{item.title}</h3>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">{item.company} • {item.location}</p>

                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium text-[15px]">
                                    {item.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Experience;
