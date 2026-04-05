import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const LinkedInPublications: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language];

    const POSTS = [
        {
            id: 1,
            title: t.pubMockTopic1,
            excerpt: t.pubMockDesc1,
            date: "Feb 2024",
            readTime: "5",
            tags: ["AI", "SME", "Digital Transformation"],
            url: "https://www.linkedin.com/in/eliezer-perez-expert-ia/",
            likes: 42,
            comments: 12
        },
        {
            id: 2,
            title: t.pubMockTopic2,
            excerpt: t.pubMockDesc2,
            date: "Jan 2024",
            readTime: "4",
            tags: ["n8n", "Automation", "Productivity"],
            url: "https://www.linkedin.com/in/eliezer-perez-expert-ia/",
            likes: 56,
            comments: 8
        },
        {
            id: 3,
            title: t.pubMockTopic3,
            excerpt: t.pubMockDesc3,
            date: "Dec 2023",
            readTime: "6",
            tags: ["Low-code", "Development", "Future"],
            url: "https://www.linkedin.com/in/eliezer-perez-expert-ia/",
            likes: 38,
            comments: 15
        }
    ];

    return (
        <section className="mt-48 relative z-10 max-w-6xl mx-auto px-6" aria-labelledby="linkedin-title">
            <div className="text-center mb-16 animate-fade-in">
                <p className="text-[9px] font-black uppercase tracking-[0.6em] text-primary mb-6">{t.pubSubtitle}</p>
                <h2 id="linkedin-title" className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">
                    {t.pubTitle}
                </h2>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {POSTS.map((post, idx) => (
                    <div
                        key={post.id}
                        className="group relative bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 hover:border-primary/40 transition-all duration-500 animate-fade-in flex flex-col md:flex-row gap-8 items-start md:items-center"
                        style={{ animationDelay: `${idx * 150}ms` }}
                    >
                        {/* Forum Topic Icon/Avy */}
                        <div className="size-16 shrink-0 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-3xl">forum</span>
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                                    {post.date}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    {post.readTime} {t.pubReadTime}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors uppercase tracking-tight">
                                    {post.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Forum Stats / Interactions */}
                        <div className="flex md:flex-col items-center gap-6 md:gap-4 self-stretch md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 pt-6 md:pt-0 md:pl-10">
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                <span className="material-symbols-outlined text-xl">favorite</span>
                                <span className="text-xs font-black">{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                <span className="material-symbols-outlined text-xl">comment</span>
                                <span className="text-xs font-black">{post.comments}</span>
                            </div>
                            <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="size-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:bg-primary transition-colors group/btn shadow-xl ml-auto md:ml-0"
                            >
                                <span className="material-symbols-outlined text-xl group-hover/btn:translate-x-0.5 transition-transform">open_in_new</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
                <a
                    href="https://www.linkedin.com/in/eliezer-perez-expert-ia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-slate-500 hover:text-primary font-black text-[10px] uppercase tracking-[0.3em] transition-all group"
                >
                    {t.pubViewPost} LinkedIn
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">trending_flat</span>
                </a>
            </div>
        </section>
    );
};

export default LinkedInPublications;
