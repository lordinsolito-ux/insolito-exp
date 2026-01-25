
import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/98 backdrop-blur-md animate-fade-in shadow-2xl">
            <div className="bg-[#0A0A0C] border border-white/10 rounded-sm w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                    <h2 className="text-xl font-display text-gold-400 tracking-wide normal-case">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto text-gray-300 text-sm leading-relaxed space-y-4 custom-scrollbar bg-noise-opacity">
                    <div
                        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
                        className="
                            text-xs text-gray-400 font-sans font-light leading-relaxed normal-case
                            whitespace-pre-wrap
                            [&>h3]:text-[10px] [&>h3]:font-bold [&>h3]:text-gold-500 [&>h3]:tracking-[0.2em] [&>h3]:mb-3 [&>h3]:mt-8 [&>h3:first-child]:mt-0
                            [&>p]:mb-4 [&>p]:leading-[1.8]
                            [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-4 [&>ul]:space-y-2
                            [&>li]:pl-1
                            [&>strong]:text-gray-200 [&>strong]:font-medium
                        "
                    />
                </div>


                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-black/40 text-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded transition-all"
                    >
                        Chiudi
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LegalModal;
