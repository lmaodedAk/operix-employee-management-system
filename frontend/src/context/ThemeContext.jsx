import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    const [accentColor, setAccentColor] = useState('blue'); // blue, violet, emerald, orange

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = () => {
            root.classList.remove('light', 'dark');
            if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
            } else {
                root.classList.add(theme);
            }
        };

        applyTheme();

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme();
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        const variables = {
            blue: '221.2 83.2% 53.3%',
            violet: '262.1 83.3% 57.8%',
            emerald: '142.1 76.2% 36.3%',
            orange: '24.6 95% 53.1%',
        };

        root.style.setProperty('--primary', variables[accentColor]);
    }, [accentColor]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme || (prev => prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
