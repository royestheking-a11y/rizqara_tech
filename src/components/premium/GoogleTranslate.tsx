import { useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

export const GoogleTranslate = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Inject CSS once globally
        if (!document.getElementById('google-translate-css')) {
            const style = document.createElement('style');
            style.id = 'google-translate-css';
            style.innerHTML = `
                .goog-te-banner-frame { display: none !important; visibility: hidden !important; }
                .skiptranslate > iframe.goog-te-banner-frame { display: none !important; }
                iframe.skiptranslate { display: none !important; }
                body { top: 0px !important; position: static !important; margin-top: 0px !important; }
                html { height: auto !important; }
                .goog-translate-custom-container select {
                    background-color: transparent;
                    color: #500000;
                    border: none;
                    font-weight: 700;
                    font-size: 14px;
                    padding: 4px 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    outline: none;
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                }
                .goog-translate-custom-container select option { color: #000; }
                .goog-logo-link { display: none !important; }
                .goog-te-gadget { color: transparent !important; display: flex; align-items: center; font-size: 0px !important; margin-top: -2px; }
                .goog-te-gadget span { display: none !important; }
                #goog-gt-tt { display: none !important; }
                .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
            `;
            document.head.appendChild(style);
        }

        // Generate unique ID for this instance
        const id = `google_translate_element_${Math.random().toString(36).substring(7)}`;
        if (containerRef.current) {
            containerRef.current.id = id;
        }

        const initWidget = () => {
            if ((window as any).google && (window as any).google.translate && (window as any).google.translate.TranslateElement) {
                new (window as any).google.translate.TranslateElement(
                    { pageLanguage: 'en', autoDisplay: false },
                    id
                );
            }
        };

        // Poll for the google object to be ready
        const intervalId = setInterval(() => {
            if ((window as any).google && (window as any).google.translate) {
                clearInterval(intervalId);
                initWidget();
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="flex items-center gap-1 bg-red-50 hover:bg-red-100 transition-colors px-3 py-1.5 rounded-full border border-red-100 cursor-pointer overflow-hidden max-w-[140px] goog-translate-custom-container">
            <Globe size={16} className="text-[#500000] shrink-0" />
            <div ref={containerRef} className="translate-y-[2px]"></div>
        </div>
    );
};
