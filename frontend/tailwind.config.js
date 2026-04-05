import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
        "./index.tsx"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#137fec",
                "primary-hover": "#0f6bd0",
                "background-light": "#f6f7f8",
                "background-dark": "#101922",
                "surface-dark": "#1c252e",
                "surface-light": "#ffffff",
                "text-secondary-dark": "#94a3b8",
                "text-secondary-light": "#64748b",
                "border-dark": "#2d3748",
                "border-light": "#e2e8f0",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            animation: {
                "blob": "blob 15s infinite ease-in-out",
                "fade-in": "fade-in 0.8s ease-out forwards",
                "float": "float 6s infinite ease-in-out",
            },
            keyframes: {
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-15px)" },
                },
                "fade-in": {
                    "from": { opacity: "0", transform: "translateY(15px)" },
                    "to": { opacity: "1", transform: "translateY(0)" },
                }
            }
        },
    },
    plugins: [
        forms,
        containerQueries,
        typography,
    ],
}
