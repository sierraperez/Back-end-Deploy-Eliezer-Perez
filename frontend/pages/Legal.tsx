import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Legal: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col bg-background-dark overflow-y-auto no-scrollbar">
            <SEO
                title="Mentions Légales"
                description="Informations légales du site eliezerperez.com - SIREN 993 669 209. Entrepreneur individuel en programmation informatique basé à Ozoir-la-Ferrière, France."
            />
            <Header title="Mentions Légales" showBack={true} />

            <main className="max-w-4xl mx-auto w-full px-6 py-12 md:py-20 flex-1 animate-fade-in">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">Mentions Légales</h1>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </div>

                <div className="grid gap-8">
                    {/* Éditeur du site */}
                    <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-sm">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Éditeur du site</h2>
                        <div className="space-y-4 text-slate-300">
                            <p className="flex flex-col"><span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Nom</span> <span className="text-white font-bold">Eliezer Perez</span></p>
                            <p className="flex flex-col"><span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Statut</span> <span>Entrepreneur individuel</span></p>
                            <p className="flex flex-col"><span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">SIREN</span> <span>993 669 209</span></p>
                            <p className="flex flex-col"><span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Activité</span> <span>Programmation informatique, création et développement de sites web</span></p>
                            <p className="flex flex-col"><span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Localisation</span> <span>Ozoir-la-Ferrière, France</span></p>
                            <p className="flex flex-col"><span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Email</span> <a href="mailto:contact@eliezerperez.com" className="text-primary hover:underline">contact@eliezerperez.com</a></p>
                        </div>
                    </section>

                    {/* Hébergement */}
                    <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-sm">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Hébergement</h2>
                        <div className="space-y-4 text-slate-300">
                            <p className="font-bold text-white mb-2">Le site est hébergé par :</p>
                            <div className="space-y-1">
                                <p>Hostinger</p>
                                <p>HOSTINGER operations, UAB</p>
                                <p>Švitrigailos g. 34</p>
                                <p>03230 Vilnius</p>
                                <p>Lituanie</p>
                                <p>Téléphone : —</p>
                                <p className="text-sm italic">(Support client disponible via chat et tickets en ligne)</p>
                                <p>Site web : <a href="https://www.hostinger.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">hostinger.com</a></p>
                            </div>
                        </div>
                    </section>

                    {/* Responsabilité */}
                    <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-sm">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Responsabilité</h2>
                        <p className="text-slate-300 leading-relaxed">
                            L’éditeur du site s’efforce de fournir des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes ou des carences dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires.
                        </p>
                    </section>

                    {/* Propriété intellectuelle */}
                    <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-sm">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Propriété intellectuelle</h2>
                        <p className="text-slate-300 leading-relaxed">
                            L’ensemble du contenu du site (textes, images, graphismes, logo, structure) est la propriété exclusive d’Eliezer Perez, sauf mention contraire. Toute reproduction, représentation, modification ou adaptation, totale ou partielle, est interdite sans autorisation écrite préalable.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Legal;