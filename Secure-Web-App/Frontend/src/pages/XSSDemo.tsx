import React, { useState } from 'react';
import xss from 'xss';

const XSSDemo = () => {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'vulnerable' | 'secure'>('vulnerable');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">XSS Demonstration Page</h1>
                    <p className="mt-4 text-lg text-gray-500">
                        See how Cross-Site Scripting (XSS) works and how to prevent it.
                    </p>
                </div>

                <div className="bg-white shadow sm:rounded-lg p-6">
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={() => setMode('vulnerable')}
                            className={`px-4 py-2 rounded-md font-bold text-sm ${mode === 'vulnerable' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Vulnerable Mode
                        </button>
                        <button
                            onClick={() => setMode('secure')}
                            className={`px-4 py-2 rounded-md font-bold text-sm ${mode === 'secure' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Secure Mode
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter some text (try HTML or script tags!):
                        </label>
                        <textarea
                            rows={4}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
                            placeholder="<img src=x onerror=alert('XSS')>"
                            value={input}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                            Output Rendered ({mode === 'vulnerable' ? 'Dangerously' : 'Safely'}):
                        </h3>
                        <div className={`p-4 border rounded-md min-h-[100px] ${mode === 'vulnerable' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            {mode === 'vulnerable' ? (
                                // 🔴 VULNERABLE: Uses dangerouslySetInnerHTML directly without sanitization
                                <div dangerouslySetInnerHTML={{ __html: input }} />
                            ) : (
                                // ✅ SECURE: Uses the xss library to sanitize input before rendering
                                <div dangerouslySetInnerHTML={{ __html: xss(input) }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default XSSDemo;
