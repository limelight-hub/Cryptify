import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Menu, Shield, RotateCcw, FolderOpen, Maximize2, Minimize2, X, Info, Sun, Moon
} from 'lucide-react';

import PlayfairCipher from '../lib/playfair';
import RSACipher from '../lib/rsa';
import { useTheme } from '../context/ThemeContext';
import { useClipboard } from '../hooks/useClipboard';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useNotification } from '../hooks/useNotification';

import Sidebar from './Sidebar';
import TextPanel from './TextPanel';
import ProcessButton from './ProcessButton';
import NotificationContainer from './NotificationContainer';
import AboutCard from './AboutCard';

const EncryptionApp = () => {
  // Core state
  const [method, setMethod] = useState<'playfair' | 'rsa'>('playfair');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [isProcessing, setIsProcessing] = useState(false);

  // Playfair state
  const [playfairKey, setPlayfairKey] = useState('');
  const [playfairMatrix, setPlayfairMatrix] = useState<string[][]>([]);

  // RSA state
  const [rsaP, setRsaP] = useState('17');
  const [rsaQ, setRsaQ] = useState('11');

  // UI state
  const [showKey, setShowKey] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Custom hooks
  const { theme, toggleTheme, themeClasses } = useTheme();
  const { copied, copyToClipboard } = useClipboard();
  const { notifications, addNotification, removeNotification } = useNotification();

  // Memoized validation
  const isValidInput = useMemo(() => {
    if (!inputText.trim()) return false;
    if (method === 'playfair' && !playfairKey.trim()) return false;
    return true;
  }, [inputText, method, playfairKey]);

  // Update Playfair matrix when key changes
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

  // Encryption/Decryption handler
  const handleEncryptDecrypt = useCallback(async () => {
    if (!isValidInput) return;

    setIsProcessing(true);

    // Add some visual feedback delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      let result: string;

      if (method === 'playfair') {
        const cipher = new PlayfairCipher(playfairKey);
        result = mode === 'encrypt'
          ? cipher.encrypt(inputText)
          : cipher.decrypt(inputText);
      } else {
        const p = parseInt(rsaP);
        const q = parseInt(rsaQ);
        const cipher = new RSACipher(p, q);

        if (mode === 'encrypt') {
          const encrypted = cipher.encrypt(inputText);
          result = JSON.stringify(encrypted);
        } else {
          try {
            const parsedInput = JSON.parse(inputText);
            result = cipher.decrypt(parsedInput);
          } catch {
            throw new Error('Invalid JSON format for RSA decryption');
          }
        }
      }

      setOutputText(result);
      addNotification({
        type: 'success',
        title: `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} successful!`,
        message: `Processed ${inputText.length} characters using ${method.toUpperCase()}`,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Operation failed';
      addNotification({
        type: 'error',
        title: `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} failed`,
        message: errorMessage,
      });
      setOutputText('');
    } finally {
      setIsProcessing(false);
    }
  }, [method, mode, inputText, playfairKey, rsaP, rsaQ, isValidInput, addNotification]);

  // Other handlers
  const handleCopyToClipboard = useCallback(async () => {
    if (outputText) {
      const success = await copyToClipboard(outputText);
      if (success) {
        addNotification({
          type: 'success',
          title: 'Copied to clipboard!',
          duration: 2000,
        });
      }
    }
  }, [outputText, copyToClipboard, addNotification]);

  const clearAll = useCallback(() => {
    setInputText('');
    setOutputText('');
    setPlayfairMatrix([]);
    addNotification({
      type: 'info',
      title: 'Cleared all text',
      duration: 2000,
    });
  }, [addNotification]);

  const swapInputOutput = useCallback(() => {
    if (outputText) {
      setInputText(outputText);
      setOutputText(inputText);
      setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
      addNotification({
        type: 'info',
        title: 'Swapped input and output',
        duration: 2000,
      });
    }
  }, [inputText, outputText, mode, addNotification]);

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

            addNotification({
              type: 'success',
              title: 'File loaded successfully',
            });
          } catch {
            setInputText(e.target?.result as string);
            addNotification({
              type: 'info',
              title: 'Text file loaded',
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [addNotification]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+Enter': handleEncryptDecrypt,
    'Ctrl+Shift+C': handleCopyToClipboard,
    'Ctrl+R': clearAll,
    'Ctrl+T': toggleTheme,
    'Ctrl+1': () => setMethod('playfair'),
    'Ctrl+2': () => setMethod('rsa'),
  });

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
              onClick={loadFromFile}
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
        <Sidebar
          isOpen={sidebarOpen}
          method={method}
          mode={mode}
          playfairKey={playfairKey}
          rsaP={rsaP}
          rsaQ={rsaQ}
          showKey={showKey}
          playfairMatrix={playfairMatrix}
          onMethodChange={setMethod}
          onModeChange={setMode}
          onPlayfairKeyChange={setPlayfairKey}
          onRsaPChange={setRsaP}
          onRsaQChange={setRsaQ}
          onToggleShowKey={() => setShowKey(!showKey)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className={`h-12 ${themeClasses[theme].surface} border-b ${themeClasses[theme].border} flex items-center justify-between px-4`}>
            <div></div>
            <div className="flex items-center gap-2">
              <button
                onClick={swapInputOutput}
                disabled={!outputText}
                className={`p-2 rounded ${themeClasses[theme].surfaceHover} flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
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
            <TextPanel
              type="input"
              value={inputText}
              onChange={setInputText}
              mode={mode}
            />
            <TextPanel
              type="output"
              value={outputText}
              readOnly
              copied={copied}
              onCopy={handleCopyToClipboard}
              mode={mode}
            />
          </div>

          {/* Action Bar */}
          <div className={`h-16 ${themeClasses[theme].surface} border-t ${themeClasses[theme].border} flex items-center justify-center px-4`}>
            <ProcessButton
              mode={mode}
              isProcessing={isProcessing}
              disabled={!isValidInput}
              onClick={handleEncryptDecrypt}
            />
          </div>
        </div>
      </div>

      {/* About Dialog */}
      {aboutOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <AboutCard />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setAboutOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default EncryptionApp;
