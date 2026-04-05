import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Privacy: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col bg-background-dark overflow-y-auto no-scrollbar">
            <SEO
                title="Politique de Confidentialité RGPD"
                description="Politique de confidentialité conforme au RGPD. Protection des données personnelles, droits utilisateurs, durée de conservation et cookies. Transparence totale sur vos données."
            />
            <Header title="Politique de confidentialité" showBack={true} />

            <main className="max-w-4xl mx-auto w-full px-6 py-12 md:py-20 flex-1 animate-fade-in">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">Politique de confidentialité (RGPD)</h1>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </div>

                <div className="grid gap-6">
                    <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Collecte des données personnelles</h2>
                        <p className="text-slate-300 leading-relaxed mb-6">
                            Les données personnelles pouvant être collectées sur ce site sont exclusivement celles transmises volontairement via le formulaire de contact :
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['Nom', 'Adresse email', 'Message'].map(item => (
                                <li key={item} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 text-sm font-bold text-white uppercase tracking-tight">
                                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-slate-400 text-sm font-medium italic">Aucune autre donnée personnelle n’est collectée sans votre consentement.</p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-6">
                        <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Finalité du traitement</h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Les données sont collectées uniquement pour :<br />
                                • Répondre aux demandes du formulaire<br />
                                • Échanger dans un cadre professionnel<br /><br />
                                <strong className="text-white">Elles ne sont ni vendues, ni cédées, ni partagées avec des tiers.</strong>
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Base légale</h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Le traitement des données repose sur le <span className="text-white font-bold uppercase tracking-tight">consentement de l’utilisateur</span>, conformément au Règlement Général sur la Protection des Données (RGPD).
                            </p>
                        </section>
                    </div>

                    <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Droits de l’utilisateur</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {['Droit d’accès', 'Droit de rectification', 'Droit de suppression', 'Droit d’opposition'].map(droit => (
                                <div key={droit} className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-tight">{droit}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-slate-300 text-sm mb-6">Pour exercer ces droits, vous pouvez contacter :</p>
                        <a href="mailto:contact@eliezerperez.com" className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined text-lg">mail</span>
                            contact@eliezerperez.com
                        </a>
                    </section>

                    <div className="grid md:grid-cols-2 gap-6">
                        <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Durée de conservation</h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Les données sont conservées pour une durée maximale de <span className="text-white font-bold">12 mois</span>, sauf obligation légale contraire ou demande explicite de suppression.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Cookies</h2>
                            <div className="text-slate-300 text-sm space-y-2">
                                <p>• Cookies techniques nécessaires</p>
                                <p>• Google Fonts (polices)</p>
                                <p className="text-white font-bold mt-4 uppercase text-[10px] tracking-widest">Aucun cookie publicitaire ou de suivi marketing n’est utilisé.</p>
                            </div>
                        </section>
                    </div>

                    <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Sécurité</h2>
                        <div className="flex items-start gap-5">
                            <div className="size-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                <span className="material-symbols-outlined text-2xl">shield_check</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Toutes les mesures raisonnables sont mises en œuvre pour protéger les données personnelles contre la perte, l’accès non autorisé ou la divulgation.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Privacy;