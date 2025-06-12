import React, { memo } from 'react';
import { Key, Lock, Unlock, Eye, EyeOff } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  method: 'playfair' | 'rsa';
  mode: 'encrypt' | 'decrypt';
  playfairKey: string;
  rsaP: string;
  rsaQ: string;
  showKey: boolean;
  playfairMatrix: string[][];
  onMethodChange: (method: 'playfair' | 'rsa') => void;
  onModeChange: (mode: 'encrypt' | 'decrypt') => void;
  onPlayfairKeyChange: (key: string) => void;
  onRsaPChange: (p: string) => void;
  onRsaQChange: (q: string) => void;
  onToggleShowKey: () => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({
  isOpen,
  method,
  mode,
  playfairKey,
  rsaP,
  rsaQ,
  showKey,
  playfairMatrix,
  onMethodChange,
  onModeChange,
  onPlayfairKeyChange,
  onRsaPChange,
  onRsaQChange,
  onToggleShowKey,
}) => {
  const { theme, themeClasses } = useTheme();

  if (!isOpen) return null;

  return (
    <div className={`w-80 ${themeClasses[theme].surface} border-r ${themeClasses[theme].border} transition-all duration-300 overflow-hidden flex flex-col`}>
      <div className={`p-4 border-b ${themeClasses[theme].border}`}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Key className="w-4 h-4" />
          Configuration
        </h3>

        {/* Method Selection */}
        <div className="space-y-3 mb-6">
          <label className={`text-sm ${themeClasses[theme].textSecondary}`}>
            Encryption Method
          </label>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => onMethodChange('playfair')}
              className={`p-3 rounded-lg text-left transition-all duration-200 border ${
                method === 'playfair'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : `${themeClasses[theme].input} ${themeClasses[theme].textSecondary} ${themeClasses[theme].surfaceHover}`
              }`}
            >
              <div className="font-medium">Playfair Cipher</div>
              <div className="text-xs opacity-75">Classical polyalphabetic</div>
            </button>
            <button
              onClick={() => onMethodChange('rsa')}
              className={`p-3 rounded-lg text-left transition-all duration-200 border ${
                method === 'rsa'
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
          <label className={`text-sm ${themeClasses[theme].textSecondary}`}>
            Operation Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onModeChange('encrypt')}
              className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                mode === 'encrypt'
                  ? 'bg-green-600 text-white'
                  : `${themeClasses[theme].input} ${themeClasses[theme].textSecondary} ${themeClasses[theme].surfaceHover}`
              }`}
            >
              <Lock className="w-4 h-4" />
              Encrypt
            </button>
            <button
              onClick={() => onModeChange('decrypt')}
              className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                mode === 'decrypt'
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
            <label className={`text-sm ${themeClasses[theme].textSecondary}`}>
              Playfair Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={playfairKey}
                onChange={(e) => onPlayfairKeyChange(e.target.value)}
                placeholder="Enter secret key..."
                className={`w-full px-3 py-2 ${themeClasses[theme].input} rounded-lg ${themeClasses[theme].text} placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10`}
              />
              <button
                onClick={onToggleShowKey}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses[theme].textMuted} hover:${themeClasses[theme].text}`}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={`text-sm ${themeClasses[theme].textSecondary}`}>
                RSA Prime P
              </label>
              <input
                type="number"
                value={rsaP}
                onChange={(e) => onRsaPChange(e.target.value)}
                className={`w-full px-3 py-2 ${themeClasses[theme].input} rounded-lg ${themeClasses[theme].text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${themeClasses[theme].textSecondary}`}>
                RSA Prime Q
              </label>
              <input
                type="number"
                value={rsaQ}
                onChange={(e) => onRsaQChange(e.target.value)}
                className={`w-full px-3 py-2 ${themeClasses[theme].input} rounded-lg ${themeClasses[theme].text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Playfair Matrix */}
      {method === 'playfair' && playfairMatrix.length > 0 && (
        <div className="p-4 flex-1 overflow-auto">
          <h4 className={`text-sm font-medium ${themeClasses[theme].textSecondary} mb-3`}>
            Playfair Matrix
          </h4>
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
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
