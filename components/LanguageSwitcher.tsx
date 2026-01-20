import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    const currentLanguage = i18n.language.split('-')[0];

    const languages = [
        { code: 'en', flag: 'https://flagcdn.com/w40/gb.png', alt: 'English' },
        { code: 'it', flag: 'https://flagcdn.com/w40/it.png', alt: 'Italiano' },
        { code: 'es', flag: 'https://flagcdn.com/w40/es.png', alt: 'Español' }
    ];

    const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];
    const otherLanguages = languages.filter(l => l.code !== currentLanguage);

    return (
        <div className="flex flex-col items-end gap-2">
            {/* Other flags (only visible when expanded) */}
            {isOpen && otherLanguages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="hover:scale-110 transition-transform duration-200 animate-fade-in bg-black/20 rounded-full p-2 backdrop-blur-md border border-white/5 hover:border-gold-500/50"
                    aria-label={`Switch to ${lang.alt}`}
                >
                    <img
                        src={lang.flag}
                        alt={lang.alt}
                        className="w-6 h-6 object-cover rounded-full"
                    />
                </button>
            ))}

            {/* Current language flag (always visible) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="hover:scale-110 transition-transform duration-200 cursor-pointer bg-black/20 rounded-full p-2.5 backdrop-blur-md border border-white/5 hover:border-gold-500/50"
                aria-label="Change language"
            >
                <img
                    src={currentLang.flag}
                    alt={currentLang.alt}
                    className="w-7 h-7 object-cover rounded-full"
                />
            </button>
        </div>
    );
};

export default LanguageSwitcher;
