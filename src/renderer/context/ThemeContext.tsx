import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';

// Theme class definitions
export const themeClasses = {
    dark: {
        background: 'bg-gray-900',
        surface: 'bg-gray-800',
        surfaceHover: 'hover:bg-gray-700',
        text: 'text-white',
        textMuted: 'text-gray-400',
        textSecondary: 'text-gray-300',
        border: 'border-gray-700',
        input: 'bg-gray-700 border-gray-600',
        cardBg: 'bg-gray-800',
        accent: 'text-blue-400',
        accentBg: 'bg-blue-600',
        accentHover: 'hover:bg-blue-700',
    },
    light: {
        background: 'bg-gray-50',
        surface: 'bg-white',
        surfaceHover: 'hover:bg-gray-100',
        text: 'text-gray-900',
        textMuted: 'text-gray-500',
        textSecondary: 'text-gray-600',
        border: 'border-gray-200',
        input: 'bg-white border-gray-300',
        cardBg: 'bg-white',
        accent: 'text-blue-600',
        accentBg: 'bg-blue-500',
        accentHover: 'hover:bg-blue-600',
    }
} as const;

// Define context type
interface ThemeContextType {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    themeClasses: typeof themeClasses;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize theme from localStorage or default to 'dark'
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        try {
            const savedTheme = localStorage.getItem('cryptify-theme');
            return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
        } catch (error) {
            console.warn('Failed to read theme from localStorage:', error);
            return 'dark';
        }
    });

    // Save theme to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('cryptify-theme', theme);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        theme,
        toggleTheme,
        themeClasses,
    }), [theme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
