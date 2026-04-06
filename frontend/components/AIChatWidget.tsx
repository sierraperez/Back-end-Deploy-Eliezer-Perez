import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { useTheme } from '../context/ThemeContext';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const AIChatWidget: React.FC = () => {
    const { language } = useLanguage();
    const { theme } = useTheme();
    const t = translations[language];

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [leadQualified, setLeadQualified] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getApiBase = () => {
        const isLocal =
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';

        return isLocal ? '' : 'https://api.eliezerperez.com';
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ role: 'assistant', content: t.chatWelcome }]);
        }
    }, [isOpen, t.chatWelcome, messages.length]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        const trimmed = inputValue.trim();
        if (!trimmed || isTyping) return;

        const userMessage: Message = {
            role: 'user',
            content: trimmed,
        };

        const updatedConversation: Message[] = [...messages, userMessage];

        setMessages(updatedConversation);
        setInputValue('');
        setIsTyping(true);

        try {
            const apiBase = getApiBase();
            const endpoint = `${apiBase}/api/chat`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversation: updatedConversation,
                    metadata: {
                        page_url: window.location.href,
                        referrer: document.referrer,
                        user_agent: navigator.userAgent,
                    },
                }),
            });

            if (!response.ok) {
                console.error(`Chat API error: ${response.status} ${response.statusText}`);
                throw new Error('Chat failed');
            }

            const data = await response.json();

            const assistantReply: Message = {
                role: 'assistant',
                content: data.reply || 'Ocorreu um erro. Tenta novamente.',
            };

            const finalConversation: Message[] = [...updatedConversation, assistantReply];
            setMessages(finalConversation);

            if (data.leadReady && data.leadData && !leadQualified) {
                setLeadQualified(true);

                console.log('Lead qualificada detectada. A enviar para backend...');

                const fullPayload = {
                    ...data.leadData,
                    source: data.leadData?.source || 'portfolio_ai_agent',
                    page_url: window.location.href,
                    referrer: document.referrer,
                    user_agent: navigator.userAgent,
                    full_conversation: finalConversation,
                    chat_history: finalConversation
                        .map((m) => `${m.role === 'user' ? 'Cliente' : 'IA'}: ${m.content}`)
                        .join('\n'),
                };

                const sendLeadResponse = await fetch(`${apiBase}/api/send-lead`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        leadData: fullPayload,
                    }),
                });

                const sendLeadData = await sendLeadResponse.json();

                if (sendLeadResponse.ok) {
                    console.log('Lead enviada com sucesso para o n8n!', sendLeadData);
                } else {
                    console.error('Erro ao enviar lead para o n8n:', sendLeadData);
                }
            }
        } catch (error) {
            console.error('AIChatWidget Error Details:', error);

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Ocorreu um erro. Por favor tenta novamente. / An error occurred. Please try again.',
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            {isOpen && (
                <div
                    className={`mb-4 w-[350px] md:w-[400px] h-[550px] rounded-[32px] overflow-hidden flex flex-col border shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${theme === 'dark'
                            ? 'bg-[#05080a]/95 backdrop-blur-2xl border-white/10'
                            : 'bg-white/95 backdrop-blur-2xl border-slate-200'
                        }`}
                >
                    <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-primary/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-glow">
                                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none mb-1">
                                    AI Consultant
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                                        Active Now
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 transition-all active:scale-90"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'
                                    } animate-in fade-in slide-in-from-bottom-2 duration-400`}
                            >
                                <div
                                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                                            ? 'bg-primary text-white font-medium rounded-tr-none'
                                            : theme === 'dark'
                                                ? 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none font-medium'
                                                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50 font-medium'
                                        }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div
                                    className={`px-4 py-2 rounded-2xl rounded-tl-none text-[8px] font-black uppercase tracking-[0.2em] animate-pulse ${theme === 'dark'
                                            ? 'bg-white/5 text-slate-500'
                                            : 'bg-slate-100 text-slate-400'
                                        }`}
                                >
                                    {t.chatStatus}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                placeholder={t.chatPlaceholder}
                                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary/40 rounded-2xl px-5 py-4 pr-14 text-sm outline-none transition-all dark:text-white shadow-inner"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />

                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                                className="absolute right-2 size-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all active:scale-95 shadow-glow"
                            >
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`size-16 rounded-[24px] flex items-center justify-center text-white shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 group relative overflow-hidden ${isOpen
                        ? 'bg-slate-900 border border-white/10 shadow-none scale-90'
                        : 'bg-primary shadow-primary/40'
                    }`}
                aria-label="Toggle AI Chat"
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span
                    className={`material-symbols-outlined text-[28px] transition-all duration-500 ${isOpen ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'
                        }`}
                >
                    chat
                </span>
                <span
                    className={`material-symbols-outlined text-[28px] absolute transition-all duration-500 ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
                        }`}
                >
                    close
                </span>
            </button>
        </div>
    );
};

export default AIChatWidget;