import React, { useState, useEffect, useCallback } from 'react';
import {
  Menu, Lock, Unlock, Key, Shield, Eye, EyeOff, FileText, Copy, Check,
  RotateCcw, FolderOpen, Maximize2, Minimize2, X, Info, Sun, Moon
} from 'lucide-react';
import PlayfairCipher from '../lib/playfair';
import RSACipher from '../lib/rsa';
import { useTheme } from '../context/ThemeContext';

const EncryptionApp = () => {
  const [method, setMethod] = useState('playfair');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [playfairKey, setPlayfairKey] = useState('');
  const [rsaP, setRsaP] = useState('17');
  const [rsaQ, setRsaQ] = useState('11');
  const [mode, setMode] = useState('encrypt');
  const [playfairMatrix, setPlayfairMatrix] = useState<string[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { theme, toggleTheme, themeClasses } = useTheme();

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handleEncryptDecrypt();
            break;
          case 'c':
            if (e.shiftKey) {
              e.preventDefault();
              copyToClipboard();
            }
            break;
          case 'r':
            e.preventDefault();
            clearAll();
            break;
          case 't':
            e.preventDefault();
            toggleTheme();
            break;
          case '1':
            e.preventDefault();
            setMethod('playfair');
            break;
          case '2':
            e.preventDefault();
            setMethod('rsa');
            break;
        }
      }
    };
    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [inputText, outputText, toggleTheme]);

  useEffect(() => {
    if (method === 'playfair' && playfairKey.trim()) {
      try {
        const cipher = new PlayfairCipher(playfairKey);
        setPlayfairMatrix(cipher.getMatrix());
      } catch (err) {
        console.error('Invalid Playfair Key:', err);
        setPlayfairMatrix([]);
      }
    } else {
      setPlayfairMatrix([]);
    }
  }, [playfairKey, method]);

  const handleEncryptDecrypt = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      if (method === 'playfair') {
        const cipher = new PlayfairCipher(playfairKey);
        setOutputText(mode === 'encrypt' ? cipher.encrypt(inputText) : cipher.decrypt(inputText));
      } else {
        const p = parseInt(rsaP);
        const q = parseInt(rsaQ);
        const cipher = new RSACipher(p, q);
        if (mode === 'encrypt') {
          const encrypted = cipher.encrypt(inputText);
          setOutputText(JSON.stringify(encrypted));
        } else {
          const decrypted = cipher.decrypt(JSON.parse(inputText));
          setOutputText(decrypted);
        }
      }
    } catch (error: any) {
      alert(error.message || 'Encryption/Decryption failed.');
    }
    setIsProcessing(false);
  };

  const copyToClipboard = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setPlayfairMatrix([]);
  };

  const swapInputOutput = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  const loadFromFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const result = e.target?.result as string;
            const data = JSON.parse(result);
            if (data.method) setMethod(data.method);
            if (data.mode) setMode(data.mode);
            if (data.input) setInputText(data.input);
            if (data.output) setOutputText(data.output);
            if (data.key) setPlayfairKey(data.key);
            if (data.p) setRsaP(data.p.toString());
            if (data.q) setRsaQ(data.q.toString());
          } catch {
            setInputText(e.target?.result as string);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

    return (
      <div className={`h-screen ${themeClasses[theme].background} ${themeClasses[theme].text} flex flex-col overflow-hidden`}>
        {/* Title Bar */}
            <div className={`h-8 ${themeClasses[theme].surface} flex items-center justify-between px-4 border-b ${themeClasses[theme].border} select-none`}>
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Cryptify Desktop</span>
                </div>
                <div className="flex items-center gap-1">
                    <button className={`w-6 h-6 rounded ${themeClasses[theme].surfaceHover} flex items-center justify-center`}>
                        <Minimize2 className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => setIsMaximized(!isMaximized)}
                        className={`w-6 h-6 rounded ${themeClasses[theme].surfaceHover} flex items-center justify-center`}
                    >
                        <Maximize2 className="w-3 h-3" />
                    </button>
                    <button className="w-6 h-6 rounded hover:bg-red-600 flex items-center justify-center">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>


            {/* Menu Bar */}
            <div className={`h-10 ${themeClasses[theme].surface} flex items-center justify-between px-4 border-b ${themeClasses[theme].border} text-sm`}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`p-2 rounded ${themeClasses[theme].surfaceHover}`}
                    title="Toggle Sidebar"
                  >
                 <Menu className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => loadFromFile()}
                    className={`px-3 py-1 rounded ${themeClasses[theme].surfaceHover} flex items-center gap-2`}
                  >
                    <FolderOpen className="w-4 h-4" />
                    File
                  </button>
                  <button
                    onClick={() => setAboutOpen(true)}
                    className={`px-3 py-1 rounded ${themeClasses[theme].surfaceHover} flex items-center gap-2`}
                  >
                    <Info className="w-4 h-4" />
                    About
                  </button>
                </div>
                <div className={themeClasses[theme].textMuted + " text-xs"}>
                  Ctrl+Enter: Process | Ctrl+Shift+C: Copy | Ctrl+R: Clear | Ctrl+T: Toggle Theme
                </div>
              </div>
              <button
                    onClick={toggleTheme}
                    className={`p-2 rounded ${themeClasses[theme].surfaceHover} flex items-center gap-2`}
                    title="Toggle Theme (Ctrl+T)"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
            </div>
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'w-80' : 'w-0'} ${themeClasses[theme].surface} border-r ${themeClasses[theme].border} transition-all duration-300 overflow-hidden flex flex-col`}>
                    <div className={`p-4 border-b ${themeClasses[theme].border}`}>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Configuration
                        </h3>

                        {/* Method Selection */}
                        <div className="space-y-3 mb-6">
                            <label className={`text-sm ${themeClasses[theme].textSecondary}`}>Encryption Method</label>
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => setMethod('playfair')}
                                    className={`p-3 rounded-lg text-left transition-all duration-200 border ${method === 'playfair'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : `${themeClasses[theme].input} ${themeClasses[theme].textSecondary} ${themeClasses[theme].surfaceHover}`
                                    }`}
                                >
                                    <div className="font-medium">Playfair Cipher</div>
                                    <div className="text-xs opacity-75">Classical polyalphabetic</div>
                                </button>
                                <button
                                    onClick={() => setMethod('rsa')}
                                    className={`p-3 rounded-lg text-left transition-all duration-200 border ${method === 'rsa'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : `${themeClasses[theme].input} ${themeClasses[theme].textSecondary} ${themeClasses[theme].surfaceHover}`
                                    }`}
                                >
                                    <div className="font-medium">RSA Encryption</div>
                                    <div className="text-xs opacity-75">Public-key cryptography</div>
                                </button>
                            </div>
                        </div>

                        {/* Operation Mode */}
                        <div className="space-y-3 mb-6">
                            <label className={`text-sm ${themeClasses[theme].textSecondary}`}>Operation Mode</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setMode('encrypt')}
                                    className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${mode === 'encrypt'
                                        ? 'bg-green-600 text-white'
                                        : `${themeClasses[theme].input} ${themeClasses[theme].textSecondary} ${themeClasses[theme].surfaceHover}`
                                    }`}
                                >
                                    <Lock className="w-4 h-4" />
                                    Encrypt
                                </button>
                                <button
                                    onClick={() => setMode('decrypt')}
                                    className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${mode === 'decrypt'
                                        ? 'bg-orange-600 text-white'
                                        : `${themeClasses[theme].input} ${themeClasses[theme].textSecondary} ${themeClasses[theme].surfaceHover}`
                                    }`}
                                >
                                    <Unlock className="w-4 h-4" />
                                    Decrypt
                                </button>
                            </div>
                        </div>


                        {/* Key Configuration */}
                        {method === 'playfair' ? (
                            <div className="space-y-3">
                                <label className={`text-sm ${themeClasses[theme].textSecondary}`}>Playfair Key</label>
                                <div className="relative">
                                    <input
                                        type={showKey ? "text" : "password"}
                                        value={playfairKey}
                                        onChange={(e) => setPlayfairKey(e.target.value)}
                                        placeholder="Enter secret key..."
                                        className={`w-full px-3 py-2 ${themeClasses[theme].input} rounded-lg ${themeClasses[theme].text} placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10`}
                                    />
                                    <button
                                        onClick={() => setShowKey(!showKey)}
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses[theme].textMuted} hover:${themeClasses[theme].text}`}
                                    >
                                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                          <div className="space-y-4">
                          <div className="space-y-2">
                              <label className={`text-sm ${themeClasses[theme].textSecondary}`}>RSA Prime P</label>
                              <input
                                  type="number"
                                  value={rsaP}
                                  onChange={(e) => setRsaP(e.target.value)}
                                  className={`w-full px-3 py-2 ${themeClasses[theme].input} rounded-lg ${themeClasses[theme].text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              />
                          </div>
                          <div className="space-y-2">
                              <label className={`text-sm ${themeClasses[theme].textSecondary}`}>RSA Prime Q</label>
                              <input
                                  type="number"
                                  value={rsaQ}
                                  onChange={(e) => setRsaQ(e.target.value)}
                                  className={`w-full px-3 py-2 ${themeClasses[theme].input} rounded-lg ${themeClasses[theme].text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              />
                          </div>
                      </div>
                        )}
                    </div>

                    {/* Playfair Matrix */}
                    {method === "playfair" && playfairMatrix.length > 0 && (
                        <div className="p-4 flex-1 overflow-auto">
                            <h4 className={`text-sm font-medium ${themeClasses[theme].textSecondary} mb-3`}>Playfair Matrix</h4>
                            <div className="grid grid-cols-5 gap-1">
                                {playfairMatrix.map((row, i) =>
                                    row.map((cell, j) => (
                                        <div
                                            key={`${i}-${j}`}
                                            className={`w-10 h-10 ${themeClasses[theme].input} rounded flex items-center justify-center text-sm font-mono text-blue-500`}
                                        >
                                            {cell}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Toolbar */}
                    <div className={`h-12 ${themeClasses[theme].surface} border-b ${themeClasses[theme].border} flex items-center justify-between px-4`}>
                        <div></div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={swapInputOutput}
                                className={`p-2 rounded ${themeClasses[theme].surfaceHover} flex items-center gap-1 text-sm`}
                                title="Swap Input/Output"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Swap
                            </button>
                            <button
                                onClick={clearAll}
                                className={`p-2 rounded ${themeClasses[theme].surfaceHover} text-sm`}
                                title="Clear All (Ctrl+R)"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Content Areas */}
                    <div className={`flex-1 grid grid-cols-2 gap-4 p-4 ${themeClasses[theme].background}`}>
                        {/* Input Panel */}
                        <div className={`flex flex-col ${themeClasses[theme].cardBg} rounded-lg border ${themeClasses[theme].border}`}>
                            <div className={`p-3 border-b ${themeClasses[theme].border} flex items-center gap-2`}>
                                <FileText className="w-4 h-4 text-blue-400" />
                                <span className="font-medium">Input Text</span>
                                <div className={`ml-auto text-xs ${themeClasses[theme].textMuted}`}>
                                    {inputText.length} characters
                                </div>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Enter text to decrypt..."}
                                className={`flex-1 p-4 bg-transparent ${themeClasses[theme].text} placeholder-gray-400 resize-none focus:outline-none font-mono`}
                                style={{ minHeight: '300px' }}
                            />
                        </div>

                     {/* Output Panel */}
                     <div className={`flex flex-col ${themeClasses[theme].cardBg} rounded-lg border ${themeClasses[theme].border}`}>
                            <div className={`p-3 border-b ${themeClasses[theme].border} flex items-center gap-2`}>
                                <Lock className="w-4 h-4 text-green-400" />
                                <span className="font-medium">Output Result</span>
                                <div className="ml-auto flex items-center gap-2">
                                    <span className={`text-xs ${themeClasses[theme].textMuted}`}>
                                        {outputText.length} characters
                                    </span>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`p-1 rounded ${themeClasses[theme].surfaceHover} ${themeClasses[theme].textMuted}`}
                                        title="Copy to Clipboard (Ctrl+Shift+C)"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={outputText}
                                readOnly
                                className="flex-1 p-4 bg-transparent text-green-500 resize-none focus:outline-none font-mono"
                                style={{ minHeight: '300px' }}
                            />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className={`h-16 ${themeClasses[theme].surface} border-t ${themeClasses[theme].border} flex items-center justify-center px-4`}>
                        <button
                            onClick={handleEncryptDecrypt}
                            disabled={isProcessing || !inputText.trim() || (method === 'playfair' && !playfairKey.trim())}
                            className={`px-8 py-3 ${!isProcessing && !(!inputText.trim() || (method === 'playfair' && !playfairKey.trim()))
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-600'}
                                text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-3 disabled:cursor-not-allowed min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                            aria-busy={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                        role="status" aria-label="Loading" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {mode === 'encrypt' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                    {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
                                    <span className="text-xs opacity-75 ml-1">(Ctrl+Enter)</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {aboutOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className={`${themeClasses[theme].surface} rounded-lg shadow-lg w-full max-w-md mx-4`}>
                        <div className={`p-4 border-b ${themeClasses[theme].border} flex justify-between items-center`}>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-400" />
                                About Cryptify
                            </h3>
                            <button
                                onClick={() => setAboutOpen(false)}
                                className={`p-1 rounded-md ${themeClasses[theme].surfaceHover}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-center mb-4">
                                <div className="h-20 w-20 rounded-full flex items-center justify-center">
                                    <Shield className="w-12 h-12 text-blue-400" />
                                    </div>
                            </div>

                            <h4 className="text-center text-xl font-bold mb-2">Cryptify</h4>
                            <p className="text-center text-gray-400 mb-4">v1.0.0</p>

                            <div className="rounded-md p-4 mb-4">
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    Cryptify is a desktop application that allows you to encrypt and decrypt
                                    messages using various cryptographic algorithms including Playfair cipher
                                    and RSA encryption.
                                </p>
                            </div>

                            <div className="space-y-3 text-sm text-gray-400">
                                <div className="flex justify-between">
                                    <span>Developer</span>
                                    <span className="text-gray-300">Truc Lam, Vu Binh, Chanh Phuc @ UIT</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Framework</span>
                                    <span className="text-gray-300">Electron + React</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>License</span>
                                    <span className="text-gray-300">MIT</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-700 flex justify-end">
                            <button
                                onClick={() => setAboutOpen(false)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default EncryptionApp;
