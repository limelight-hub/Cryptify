import React, { memo } from 'react';
import { FileText, Lock, Copy, Check } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

interface TextPanelProps {
  type: 'input' | 'output';
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  copied?: boolean;
  onCopy?: () => void;
  mode?: 'encrypt' | 'decrypt';
}

const TextPanel: React.FC<TextPanelProps> = memo(({
  type,
  value,
  onChange,
  placeholder,
  readOnly = false,
  copied = false,
  onCopy,
  mode = 'encrypt',
}) => {
  const { theme, themeClasses } = useTheme();

  const icon = type === 'input' ? <FileText className="w-4 h-4 text-blue-400" /> : <Lock className="w-4 h-4 text-green-400" />;
  const title = type === 'input' ? 'Input Text' : 'Output Result';
  const defaultPlaceholder = type === 'input'
    ? (mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...')
    : 'Result will appear here...';

  return (
    <div className={`flex flex-col ${themeClasses[theme].cardBg} rounded-lg border ${themeClasses[theme].border}`}>
      <div className={`p-3 border-b ${themeClasses[theme].border} flex items-center gap-2`}>
        {icon}
        <span className="font-medium">{title}</span>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-xs ${themeClasses[theme].textMuted}`}>
            {value.length} characters
          </span>
          {type === 'output' && onCopy && (
            <button
              onClick={onCopy}
              disabled={!value}
              className={`p-1 rounded transition-colors ${
                value
                  ? `${themeClasses[theme].surfaceHover} ${themeClasses[theme].textMuted} hover:${themeClasses[theme].text}`
                  : 'opacity-50 cursor-not-allowed'
              }`}
              title="Copy to clipboard (Ctrl+Shift+C)"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
      <textarea
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder || defaultPlaceholder}
        readOnly={readOnly}
        className={`
          flex-1 p-4 bg-transparent resize-none focus:outline-none font-mono text-sm
          ${themeClasses[theme].text} placeholder-gray-400
          ${readOnly ? 'cursor-default' : ''}
        `}
        style={{ minHeight: '300px' }}
      />
    </div>
  );
});

TextPanel.displayName = 'TextPanel';

export default TextPanel;
