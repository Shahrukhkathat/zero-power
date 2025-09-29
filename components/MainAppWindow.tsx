
import React from 'react';
import PromptEngineUI from './PromptEngineUI';
import { usePromptEngine } from '../hooks/usePromptEngine';

const MainAppWindow: React.FC = () => {
    const promptEngineProps = usePromptEngine();
    
    return (
        <main className="min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 selection:bg-purple-100 selection:text-purple-800">
            <div className="w-full max-w-2xl mx-auto relative">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-purple-600">
                        PromptCraft AI
                    </h1>
                    <p className="mt-3 text-lg text-gray-600">Your complete prompt engineering and content generation suite.</p>
                </header>
                <PromptEngineUI 
                    {...promptEngineProps} 
                    containerClassName="w-full p-8 sm:p-10 bg-white rounded-2xl shadow-lg border border-gray-200 transition-all duration-300" 
                />
            </div>
        </main>
    );
};

export default MainAppWindow;
