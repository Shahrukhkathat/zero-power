import React from 'react';
import { usePromptEngine } from '../hooks/usePromptEngine';
import {
    MicIcon, WandIcon, CopyIcon, CheckIcon, SparklesIcon,
    LightbulbIcon, DocumentTextIcon, ArrowPathIcon, SpeakerWaveIcon, StopIcon
} from './icons';
import Spinner from './Spinner';

type PromptEngineUIProps = ReturnType<typeof usePromptEngine> & { containerClassName?: string };

const PromptEngineUI: React.FC<PromptEngineUIProps> = ({
    userInput, setUserInput,
    synthesizedPrompt, isSynthesizing, error, copied, finalAnswer,
    answerTitle, isProcessing, processingAction, answerError, isListening,
    isSpeaking, handleSynthesize, handleGetAnswer, handleBrainstorm, handleSummarize,
    handleRephrase, handleReadAloud, handleListen, handleCopyToClipboard, 
    promptDetail, setPromptDetail, containerClassName
}) => {
    
    const secondaryButtonStyles = "flex items-center justify-center py-2.5 px-4 bg-white hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 rounded-lg transition-colors border border-gray-300 text-gray-700 font-medium";

    return (
        <div className={containerClassName}>
            <div className="relative">
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Start with a brief idea, e.g., 'write a blog post about AI ethics'"
                    className={`w-full h-32 bg-gray-50 border-2 rounded-lg p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none resize-none transition-colors disabled:cursor-not-allowed ${isSynthesizing ? 'border-purple-300 animate-border-pulse' : 'border-gray-200'}`}
                    aria-label="Your prompt idea"
                    disabled={isSynthesizing}
                />
                <button
                    onClick={() => handleListen(setUserInput)}
                    className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                    <MicIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="mt-4 flex justify-center space-x-2 rounded-lg bg-gray-100 p-1">
                {(['Small', 'Medium', 'Detailed'] as const).map((level) => (
                    <button
                        key={level}
                        onClick={() => setPromptDetail(level.toLowerCase() as 'small' | 'medium' | 'detailed')}
                        className={`w-full rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            promptDetail === level.toLowerCase()
                                ? 'bg-white text-purple-600 shadow-sm'
                                : 'bg-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            <button
                onClick={handleSynthesize}
                disabled={isSynthesizing || !userInput}
                className="mt-4 w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                {isSynthesizing ? <Spinner /> : <><WandIcon className="w-5 h-5 mr-2" /> Synthesize Prompt</>}
            </button>

            {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            
            {synthesizedPrompt && (
                <div className="mt-8 animate-fade-in">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Synthesized Prompt</h2>
                    <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <button onClick={() => handleCopyToClipboard(synthesizedPrompt)} className="absolute top-2.5 right-2.5 p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-600 transition-colors" aria-label="Copy to clipboard">
                            {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5" />}
                        </button>
                        <pre className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed font-sans">
                            <code>{synthesizedPrompt}</code>
                        </pre>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button onClick={handleGetAnswer} disabled={isProcessing} className={secondaryButtonStyles}>
                            {isProcessing && processingAction === 'get answer' ? <Spinner className="border-gray-700"/> : <SparklesIcon className="w-5 h-5 mr-2"/>} Get AI Answer
                        </button>
                        <button onClick={handleBrainstorm} disabled={isProcessing} className={secondaryButtonStyles}>
                            {isProcessing && processingAction === 'brainstorm' ? <Spinner className="border-gray-700"/> : <LightbulbIcon className="w-5 h-5 mr-2"/>} Brainstorm Ideas
                        </button>
                    </div>
                </div>
            )}
            
            {answerError && <p className="mt-4 text-red-500 text-sm">{answerError}</p>}

            {finalAnswer && (
                <div className="mt-8 animate-fade-in">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{answerTitle}</h2>
                    <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-200">
                         <button onClick={() => handleCopyToClipboard(finalAnswer)} className="absolute top-2.5 right-2.5 p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-600 transition-colors" aria-label="Copy to clipboard">
                            <CopyIcon className="w-5 h-5" />
                        </button>
                         <pre className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed font-sans">
                            <code>{finalAnswer}</code>
                        </pre>
                    </div>
                     <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button onClick={handleSummarize} disabled={isProcessing} className={secondaryButtonStyles}>
                            {isProcessing && processingAction === 'summarize' ? <Spinner className="border-gray-700"/> : <DocumentTextIcon className="w-5 h-5 mr-2"/>} Summarize
                        </button>
                        <button onClick={handleRephrase} disabled={isProcessing} className={secondaryButtonStyles}>
                            {isProcessing && processingAction === 'rephrase' ? <Spinner className="border-gray-700"/> : <ArrowPathIcon className="w-5 h-5 mr-2"/>} Rephrase
                        </button>
                        <button onClick={handleReadAloud} disabled={isProcessing && !isSpeaking} className={secondaryButtonStyles}>
                            {isSpeaking ? (
                                <><StopIcon className="w-5 h-5 mr-2" /> Stop Reading</>
                            ) : (
                                <><SpeakerWaveIcon className="w-5 h-5 mr-2" /> Read Aloud</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptEngineUI;
