// FIX: Import React to provide types like React.Dispatch
import React, { useState, useCallback, useEffect } from 'react';
import { PromptDetail } from '../types';
import * as geminiService from '../services/geminiService';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

export const usePromptEngine = () => {
    const [userInput, setUserInput] = useState('');
    const [synthesizedPrompt, setSynthesizedPrompt] = useState('');
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [promptDetail, setPromptDetail] = useState<PromptDetail>('medium');
    
    const [finalAnswer, setFinalAnswer] = useState('');
    const [answerTitle, setAnswerTitle] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingAction, setProcessingAction] = useState('');
    const [answerError, setAnswerError] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Effect to cancel speech synthesis on component unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis?.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const handleSynthesize = useCallback(async () => {
        if (!userInput) {
            setError('Please enter an idea to synthesize.');
            return;
        }
        setIsSynthesizing(true);
        setError('');
        setSynthesizedPrompt('');
        setFinalAnswer('');
        setAnswerTitle('');
        setAnswerError('');

        try {
            const result = await geminiService.synthesizePrompt(userInput, promptDetail);
            setSynthesizedPrompt(result);
        } catch (e) {
            console.error(e);
            setError('Failed to synthesize prompt. Please check the console for details.');
        } finally {
            setIsSynthesizing(false);
        }
    }, [userInput, promptDetail]);

    const runModel = useCallback(async (prompt: string, action: string, title: string) => {
        setIsProcessing(true);
        setProcessingAction(action);
        setAnswerError('');
        try {
            const result = await geminiService.generateContent(prompt);
            setFinalAnswer(result);
            setAnswerTitle(title);
        } catch(e) {
            console.error(e);
            setAnswerError(`Failed to ${action}. Please check the console.`);
        } finally {
            setIsProcessing(false);
            setProcessingAction('');
        }
    }, []);

    const handleGetAnswer = useCallback(() => {
        if (!synthesizedPrompt) return;
        runModel(synthesizedPrompt, 'get answer', 'AI Answer');
    }, [synthesizedPrompt, runModel]);

    const handleBrainstorm = useCallback(() => {
        if (!synthesizedPrompt) return;
        const brainstormPrompt = `Based on the following detailed prompt, brainstorm 5 creative and unique ideas or different angles for the final response. Present the ideas as a numbered list. Synthesized prompt: "${synthesizedPrompt}"`;
        runModel(brainstormPrompt, 'brainstorm', 'Brainstormed Ideas');
    }, [synthesizedPrompt, runModel]);

    const handleSummarize = useCallback(() => {
        if (!finalAnswer) return;
        const summarizePrompt = `Summarize the following text concisely. Text: "${finalAnswer}"`;
        runModel(summarizePrompt, 'summarize', 'Summary');
    }, [finalAnswer, runModel]);
    
    const handleRephrase = useCallback(() => {
        if (!finalAnswer) return;
        const rephrasePrompt = `Rephrase the following text to offer a different perspective or tone, while maintaining the core meaning. Text: "${finalAnswer}"`;
        runModel(rephrasePrompt, 'rephrase', 'Rephrased Answer');
    }, [finalAnswer, runModel]);

    const handleReadAloud = useCallback(() => {
        if (!finalAnswer) return;

        const synth = window.speechSynthesis;
        if (!synth) {
            setAnswerError("Speech synthesis is not supported in your browser.");
            return;
        }

        if (isSpeaking) {
            synth.cancel();
            return;
        }
        
        setAnswerError('');
        const utterance = new SpeechSynthesisUtterance(finalAnswer);

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsProcessing(true);
            setProcessingAction('read aloud');
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsProcessing(false);
            setProcessingAction('');
        };
        
        utterance.onerror = (event) => {
            console.error("SpeechSynthesis Error", event);
            setAnswerError("An error occurred during speech synthesis.");
            setIsSpeaking(false);
            setIsProcessing(false);
            setProcessingAction('');
        };

        synth.speak(utterance);
    }, [finalAnswer, isSpeaking]);

    const handleListen = useCallback((setter: React.Dispatch<React.SetStateAction<string>>) => {
        if (!SpeechRecognition) {
            setError("Speech recognition is not supported in your browser.");
            return;
        }
        if (isListening) {
            recognition.stop();
            setIsListening(false);
            return;
        }
        recognition.start();
        setIsListening(true);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setter(prevText => (prevText ? prevText + ' ' : '') + transcript);
            setIsListening(false);
        };
        recognition.onerror = (event: any) => {
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
        };
        recognition.onend = () => {
            setIsListening(false);
        };
    }, [isListening]);

    const handleCopyToClipboard = useCallback((textToCopy: string) => {
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, []);

    return {
        userInput, setUserInput,
        synthesizedPrompt,
        isSynthesizing,
        error,
        copied,
        finalAnswer,
        answerTitle,
        isProcessing,
        processingAction,
        answerError,
        isListening,
        isSpeaking,
        handleSynthesize,
        handleGetAnswer,
        handleBrainstorm,
        handleSummarize,
        handleRephrase,
        handleReadAloud,
        handleListen,
        handleCopyToClipboard,
        promptDetail, setPromptDetail,
    };
};
