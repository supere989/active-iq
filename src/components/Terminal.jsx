import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const Terminal = ({ onComplete }) => {
    const [lines, setLines] = useState([
        "Initializing Active-IQ Systems...",
        "Loading Security Architecture...",
        "Connecting to VectorGuard Network...",
        "System Online."
    ]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        // Blinking cursor effect
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    useEffect(() => {
        // Line typing simulation
        if (currentLineIndex < lines.length) {
            const timeout = setTimeout(() => {
                setCurrentLineIndex(prev => prev + 1);
            }, 800); // Delay between lines
            return () => clearTimeout(timeout);
        } else {
            // All lines done, wait a bit then trigger completion
            const completionTimeout = setTimeout(() => {
                onComplete && onComplete();
            }, 1000);
            return () => clearTimeout(completionTimeout);
        }
    }, [currentLineIndex, lines.length, onComplete]);

    return (
        <div className="w-full max-w-4xl mx-auto bg-terminal-bg rounded-lg shadow-2xl overflow-hidden border border-primary-500/30 font-mono text-sm md:text-base">
            <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-gray-400 text-xs">active-iq-terminal -- bash</span>
            </div>
            <div className="p-6 h-64 md:h-80 overflow-y-auto text-terminal-text bg-black/95">
                {lines.slice(0, currentLineIndex + 1).map((line, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-2 flex items-center gap-2"
                    >
                        <ChevronRightIcon className="h-4 w-4 text-primary-500" />
                        <span>{line}</span>
                    </motion.div>
                ))}
                <div className="mt-2 flex items-center gap-2">
                    <ChevronRightIcon className="h-4 w-4 text-primary-500" />
                    <span className={showCursor ? "opacity-100" : "opacity-0"}>_</span>
                </div>
            </div>
        </div>
    );
};

export default Terminal;
