import React, { useState, useEffect, useRef, useCallback } from 'react';
import PromptEngineUI from './PromptEngineUI';
import { usePromptEngine } from '../hooks/usePromptEngine';
import { WandIcon, CloseIcon } from './icons';

interface CompactWidgetProps {
    onClose: () => void;
}

const CompactWidget: React.FC<CompactWidgetProps> = ({ onClose }) => {
    const promptEngineProps = usePromptEngine();
    const [position, setPosition] = useState({ x: window.innerWidth - 530, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const widgetRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target instanceof HTMLElement && (e.target.tagName === 'BUTTON' || e.target.closest('button'))) return;
        setIsDragging(true);
        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        e.preventDefault();
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        setPosition({
            x: e.clientX - dragStartPos.current.x,
            y: e.clientY - dragStartPos.current.y,
        });
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={widgetRef}
            className="fixed w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in"
            style={{ top: position.y, left: position.x, zIndex: 100 }}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="flex items-center justify-between p-3 bg-gray-100 rounded-t-2xl border-b border-gray-200 cursor-move"
                onMouseDown={handleMouseDown}
            >
                <h3 className="font-bold text-purple-600 flex items-center select-none">
                    <WandIcon className="w-5 h-5 mr-2" />
                    PromptCraft AI - Compact
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 z-10"
                    aria-label="Close Compact Mode"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
            <PromptEngineUI {...promptEngineProps} containerClassName="w-full p-6" />
        </div>
    );
};

export default CompactWidget;
