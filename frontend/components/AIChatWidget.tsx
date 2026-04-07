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
                    body: JSON.stringify(fullPayload),
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

    // Lock scroll on mobile when chat is open
    useEffect(() => {
        if (isOpen && window.innerWidth < 640) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px'; 
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-8 sm:w-[440px] 
                    h-[100dvh] sm:h-[min(720px,calc(100vh-140px))] flex flex-col overflow-hidden shadow-2xl 
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
                    animate-in slide-in-from-bottom sm:slide-in-from-bottom-12 fade-in 
                    z-[10000] rounded-none sm:rounded-[32px] border-none sm:border
                    ${theme === 'dark'
                            ? 'bg-[#05080a]/95 backdrop-blur-3xl border-white/10 text-white'
                            : 'bg-white/95 backdrop-blur-3xl border-slate-200 text-slate-900'
                        }`}
                    style={{ overscrollBehavior: 'contain' }}
                >
                    {/* Header */}
                    <div className="p-5 sm:p-6 border-b border-white/5 dark:border-white/5 bg-gradient-to-r from-primary/10 to-transparent flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="size-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white shadow-glow animate-pulse-slow">
                                    <span className="material-symbols-outlined text-[24px] fill-icon">smart_toy</span>
                                </div>
                                <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-green-500 border-2 border-white dark:border-[#05080a]"></span>
                            </div>
                            <div>
                                <h3 className="text-base font-black uppercase tracking-tighter leading-none mb-1">
                                    AI Consultant
                                </h3>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-80">
                                    Expert System • Online
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="size-11 rounded-2xl hover:bg-white/10 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all active:scale-90"
                            aria-label="Close Chat"
                        >
                            <span className="material-symbols-outlined text-[24px]">close</span>
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar bg-transparent overscroll-contain">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'
                                    } animate-in fade-in slide-in-from-bottom-3 duration-500`}
                            >
                                <div
                                    className={`max-w-[85%] p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all hover:shadow-md ${m.role === 'user'
                                            ? 'bg-primary text-white font-medium rounded-tr-none shadow-primary/20'
                                            : theme === 'dark'
                                                ? 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none font-medium'
                                                : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-200 font-medium'
                                        }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div
                                    className={`px-4 py-2 rounded-2xl rounded-tl-none text-[9px] font-black uppercase tracking-[0.2em] animate-pulse flex items-center gap-2 ${theme === 'dark'
                                            ? 'bg-white/5 text-primary'
                                            : 'bg-slate-100 text-primary'
                                        }`}
                                >
                                    <span className="size-1.5 rounded-full bg-primary animate-bounce"></span>
                                    {t.chatStatus}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input Area */}
                    <div className="p-4 sm:p-5 border-t border-white/5 bg-white/5 backdrop-blur-md shrink-0">
                        <div className="relative flex items-center gap-3">
                            <input
                                type="text"
                                placeholder={t.chatPlaceholder}
                                className={`w-full bg-white/10 dark:bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-2xl px-5 py-4 pr-16 text-base sm:text-sm outline-none transition-all shadow-inner ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
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
                                className="absolute right-2 size-11 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all hover:bg-primary-hover active:scale-95 shadow-glow"
                            >
                                <span className="material-symbols-outlined text-[24px] fill-icon">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`size-16 rounded-[28px] flex items-center justify-center text-white shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 group relative overflow-hidden ${isOpen
                            ? 'opacity-0 scale-0 pointer-events-none'
                            : 'bg-primary shadow-primary/40'
                        } ${isOpen ? 'sm:scale-0' : 'scale-100'}`}
                    aria-label="Toggle AI Chat"
                >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span
                        className={`material-symbols-outlined text-[30px] transition-all duration-500 ${isOpen ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'
                            }`}
                    >
                        chat
                    </span>
                    <span
                        className={`material-symbols-outlined text-[30px] absolute transition-all duration-500 ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
                            }`}
                    >
                        close
                    </span>
                </button>
            </div>
        </>
    );
};

export default AIChatWidget;