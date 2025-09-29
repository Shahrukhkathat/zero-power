
import React from 'react';
import { WindowIcon, ArrowTopRightOnSquareIcon } from './icons';

interface TrayMenuProps {
    onShowMain: () => void;
    onShowCompact: () => void;
}

const TrayMenu: React.FC<TrayMenuProps> = ({ onShowMain, onShowCompact }) => (
    <div className="absolute bottom-full right-0 mb-3 w-60 bg-white rounded-lg shadow-2xl border border-gray-200 p-2 animate-fade-in-up z-20">
        <div className="font-bold text-sm text-gray-800 px-3 py-1.5">PromptCraft AI</div>
        <div className="my-1 h-px bg-gray-200"></div>
        <button onClick={onShowMain} className="w-full text-left flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <WindowIcon className="w-5 h-5 mr-3" /> Show Application
        </button>
        <button onClick={onShowCompact} className="w-full text-left flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-3" /> Open Compact Mode
        </button>
    </div>
);

export default TrayMenu;
