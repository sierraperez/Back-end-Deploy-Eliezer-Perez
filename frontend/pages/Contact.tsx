
import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { z } from 'zod';

// Types strictos pour le formulaire
interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    hp: string;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error' | 'validation_error';

const contactSchema = z.object({
    name: z.string().min(2, "Le nom est trop court").max(60).trim(),
    email: z.string().email("Email invalide").toLowerCase().trim(),
    subject: z.string().min(3, "L'objet est trop court").max(120).trim(),
    message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(3000).trim(),
    hp: z.string().max(0)
});

// Note: les messages d'erreur de Zod sont complexes à internationaliser sans hook, 
// je vais garder les messages par défaut mais traduire le feedback UI global.

const Contact: React.FC<{ onOpenMenu?: () => void }> = ({ onOpenMenu }) => {
    const { language } = useLanguage();
    const t = translations[language];

    // État initial typé
    const initialFormState: ContactFormData = {
        name: '',
        email: '',
        subject: '',
        message: '',
        hp: ''
    };

    const [formData, setFormData] = useState<ContactFormData>(initialFormState);
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    // Fonction de nettoyage des entrées (Sanitization sécurisée mais équilibrée)
    const sanitize = (str: string): string => {
        return str
            .replace(/<[^>]*>/g, '')  // Remove all HTML tags
            .replace(/on\w+\s*=\s*["']?[^"']*["']?/gi, '')  // Remove event handlers
            .replace(/javascript:/gi, '')  // Remove javascript:
            .replace(/[<>]/g, '')  // Strict removal of < >
            .trim();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(t.copyEmail);
    };

    /**
     * Action de soumission du formulaire
     * Gère la validation, l'appel API sécurisé et le feedback UI
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Sécurité contre les bots (Honeypot frontend)
        if (formData.hp) return;

        try {
            // Pre-sanitize inputs before validation
            const sanitizedData = {
                name: sanitize(formData.name),
                email: formData.email.trim().toLowerCase(),
                subject: sanitize(formData.subject),
                message: sanitize(formData.message), // On garde les sauts de ligne ici
                hp: formData.hp
            };

            // 1. Validation de types avec Zod (Frontend)
            const validated = contactSchema.parse(sanitizedData);

            setStatus('sending');
            setErrorMsg(null);

            // 2. Appel à l'API backend sécurisée
            // No Vite, /api é proxied para o backend local (3001) automaticamente.
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            const apiBase = isLocal ? "" : "https://api.eliezerperez.com";

            const response = await fetch(`${apiBase}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(validated),
            });

            // Tenta ler JSON, mas não quebra se vier HTML/texto
            let data: any = null;
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                data = { error: text || "Unexpected response format" };
            }

            if (!response.ok) {
                const message = data?.details
                    ? `${data.error}: ${Array.isArray(data.details) ? data.details.join(", ") : String(data.details)}`
                    : (data?.error || t.formGenericError);

                throw new Error(message);
            }


            // 3. Succès : Feedback visuel et reset
            setStatus('success');
            setFormData(initialFormState); // Nettoyage du formulaire

            // Gestion du focus pour l'accessibilité
            setTimeout(() => statusRef.current?.focus(), 100);

            // Retour à l'état initial après 5 secondes de succès
            setTimeout(() => setStatus('idle'), 5000);

        } catch (error: any) {
            console.error("Échec de l'envoi:", error);

            if (error instanceof z.ZodError) {
                setStatus('validation_error');
                setErrorMsg((error as z.ZodError).issues[0]?.message || t.formValidationMsg);
            } else {
                setStatus('error');
                setErrorMsg(error.message || t.formGenericError);
            }

            setTimeout(() => statusRef.current?.focus(), 100);
            setTimeout(() => setStatus('idle'), 8000);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-500 overflow-y-auto no-scrollbar">
            <SEO
                title="Contact - Démarrez Votre Projet d'Automatisation"
                description="Contactez-moi pour discuter de votre projet d'automatisation n8n, développement web ou IA. Réponse rapide garantie. Formulaire sécurisé et confidentiel."
                keywords="contact développeur freelance, devis automatisation n8n, demande projet ia"
                breadcrumbs={[
                    { name: 'Accueil', item: '/' },
                    { name: 'Contact', item: '/contact' }
                ]}
                jsonLd={[
                    {
                        "@context": "https://schema.org",
                        "@type": "ContactPage",
                        "url": "https://eliezerperez.com/contact",
                        "name": "Expert n8n Paris - Contact",
                        "description": "Prenez contact avec Eliezer Pérez, expert en automatisation n8n et IA à Paris. Audit et diagnostic de workflow gratuit."
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": "Eliezer Pérez - Automatisation & IA",
                        "image": "https://eliezerperez.com/assets/Eliezerperezphoto.webp",
                        "@id": "https://eliezerperez.com",
                        "url": "https://eliezerperez.com",
                        "telephone": "",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "",
                            "addressLocality": "Paris",
                            "postalCode": "75000",
                            "addressCountry": "FR"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 48.8566,
                            "longitude": 2.3522
                        },
                        "openingHoursSpecification": {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": [
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday"
                            ],
                            "opens": "09:00",
                            "closes": "18:00"
                        }
                    }
                ]}
            />
            <Header title={t.navContact} showBack={true} titleTag="div" onMenuToggle={onOpenMenu} />

            <main className="max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex-1 flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-20">
                <section className="animate-fade-in" aria-labelledby="contact-heading">
                    <div className="flex flex-wrap items-center gap-8 mb-6">
                        <span className="flex items-center gap-2.5 text-[9px] font-black tracking-[0.3em] uppercase text-green-700 dark:text-green-400">
                            <span className="size-1.5 rounded-full bg-green-600 dark:bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)] animate-pulse" aria-hidden="true"></span>
                            {t.availableContact}
                        </span>
                    </div>

                    <h1 id="contact-heading" className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 uppercase">{t.contactHero}</h1>
                    <p className="text-slate-700 dark:text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-md font-medium">
                        {t.contactDesc}
                    </p>

                    <div className="space-y-4 max-w-md">
                        <button
                            onClick={() => copyToClipboard('contact@eliezerperez.com')}
                            className="w-full text-left group flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:border-primary transition-all outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                            aria-label={`${t.copyMailLabel}: contact@eliezerperez.com`}
                        >
                            <div className="flex items-center justify-center rounded-2xl bg-primary/10 size-14 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-3xl" aria-hidden="true">mail</span>
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <p className="text-slate-900 dark:text-white font-black text-lg truncate">contact@eliezerperez.com</p>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest">{t.contactEmailLabel}</p>
                            </div>
                        </button>

                        <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 flex items-center gap-4" role="status">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400" aria-hidden="true">verified_user</span>
                            <p className="text-[10px] text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider leading-tight">{t.secureChannel}</p>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="form-heading">
                    <h2 id="form-heading" className="sr-only">{t.formHeading}</h2>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6 bg-white dark:bg-surface-dark p-8 md:p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden"
                        noValidate
                    >
                        <div className="absolute opacity-0 pointer-events-none -z-10" aria-hidden="true">
                            <input type="text" tabIndex={-1} value={formData.hp} onChange={(e) => setFormData({ ...formData, hp: e.target.value })} />
                        </div>

                        {/* Zone de message de statut Aria-Live */}
                        <div
                            ref={statusRef}
                            tabIndex={-1}
                            className="outline-none"
                            aria-live="assertive"
                            role="status"
                        >
                            {status === 'success' && (
                                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-4 animate-fade-in mb-4">
                                    <span className="material-symbols-outlined text-2xl" aria-hidden="true">done_all</span>
                                    <div>
                                        <p className="font-black uppercase text-xs tracking-widest">{t.formSuccessTitle}</p>
                                        <p className="text-[11px] font-medium opacity-90">{t.formSuccessMsg}</p>
                                    </div>
                                </div>
                            )}
                            {(status === 'error' || status === 'validation_error') && (
                                <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center gap-4 animate-fade-in mb-4">
                                    <span className="material-symbols-outlined text-2xl" aria-hidden="true">error</span>
                                    <div>
                                        <p className="font-black uppercase text-xs tracking-widest">{t.formErrorTitle}</p>
                                        <p className="text-[11px] font-medium opacity-90">{errorMsg}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="contact-name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                        {t.formName} <span className="text-primary" aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="contact-name"
                                        required
                                        aria-required="true"
                                        type="text"
                                        placeholder={t.placeholderName}
                                        className={`w-full rounded-2xl border ${status === 'validation_error' && !formData.name ? 'border-rose-500' : 'border-slate-200 dark:border-white/10'} bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white text-sm px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all`}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={status === 'sending'}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="contact-email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                        {t.formEmail} <span className="text-primary" aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="contact-email"
                                        required
                                        aria-required="true"
                                        type="email"
                                        placeholder={t.placeholderEmail}
                                        className={`w-full rounded-2xl border ${status === 'validation_error' && !formData.email ? 'border-rose-500' : 'border-slate-200 dark:border-white/10'} bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white text-sm px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all`}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={status === 'sending'}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="contact-subject" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                    {t.formSubject}
                                </label>
                                <input
                                    id="contact-subject"
                                    type="text"
                                    placeholder={t.placeholderSubject}
                                    className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white text-sm px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    disabled={status === 'sending'}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="contact-message" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                    {t.formMessage} <span className="text-primary" aria-hidden="true">*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    required
                                    aria-required="true"
                                    rows={5}
                                    placeholder={t.placeholderMessage}
                                    className={`w-full rounded-2xl border ${status === 'validation_error' && !formData.message ? 'border-rose-500' : 'border-slate-200 dark:border-white/10'} bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white text-sm px-6 py-4 focus:ring-2 focus:ring-primary outline-none resize-none transition-all`}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    disabled={status === 'sending'}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">
                            <span className="material-symbols-outlined text-sm" aria-hidden="true">lock</span>
                            <p>{t.contactSecurity}</p>
                        </div>

                        {/* Bouton de soumission dynamique */}
                        <button
                            type="submit"
                            disabled={status === 'sending' || status === 'success'}
                            className={`w-full py-5 text-white font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 focus-visible:ring-4 focus-visible:ring-primary/30 
                                ${status === 'sending' ? 'bg-slate-400 cursor-not-allowed opacity-70' :
                                    status === 'success' ? 'bg-emerald-600 shadow-emerald-500/20' :
                                        'bg-primary hover:bg-primary-hover shadow-primary/20 hover:-translate-y-0.5'}`}
                        >
                            <span className="text-[10px] tracking-widest uppercase">
                                {status === 'sending' ? t.formSending :
                                    status === 'success' ? t.formSuccess :
                                        t.formButton}
                            </span>
                            <span className="material-symbols-outlined animate-in fade-in duration-300" aria-hidden="true">
                                {status === 'sending' ? 'hourglass_empty' :
                                    status === 'success' ? 'check_circle' :
                                        'send'}
                            </span>
                        </button>
                    </form>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
