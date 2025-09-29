
import React, { useState, useEffect, useRef } from 'react';
import MainAppWindow from './components/MainAppWindow';
import CompactWidget from './components/CompactWidget';
import TrayMenu from './components/TrayMenu';
import { WandIcon } from './components/icons';

const App: React.FC = () => {
    const [viewMode, setViewMode] = useState<'main' | 'compact' | 'minimized'>('main');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleShowMain = () => {
        setViewMode('main');
        setIsMenuOpen(false);
    };

    const handleShowCompact = () => {
        setViewMode('compact');
        setIsMenuOpen(false);
    };

    return (
        <>
            {viewMode === 'main' && <MainAppWindow />}
            {viewMode === 'compact' && <CompactWidget onClose={() => setViewMode('minimized')} />}
            
            <div ref={menuRef} className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-30">
                 {isMenuOpen && <TrayMenu onShowMain={handleShowMain} onShowCompact={handleShowCompact} />}
                <button 
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all transform"
                    aria-label="Open App Menu"
                >
                   <WandIcon className="w-7 h-7" />
                </button>
            </div>
        </>
    );
};

export default App;
