import React, { memo } from 'react';
import { Lock, Unlock } from 'lucide-react';

interface ProcessButtonProps {
  mode: 'encrypt' | 'decrypt';
  isProcessing: boolean;
  disabled: boolean;
  onClick: () => void;
}

const ProcessButton: React.FC<ProcessButtonProps> = memo(({
  mode,
  isProcessing,
  disabled,
  onClick,
}) => {
  const isDisabled = isProcessing || disabled;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`px-8 py-3 ${
        !isDisabled
          ? 'bg-blue-600 hover:bg-blue-700'
          : 'bg-gray-600'
      } text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-3 disabled:cursor-not-allowed min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
      aria-busy={isProcessing}
    >
      {isProcessing ? (
        <>
          <div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          />
          Processing...
        </>
      ) : (
        <>
          {mode === 'encrypt' ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Unlock className="w-4 h-4" />
          )}
          {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
          <span className="text-xs opacity-75 ml-1">(Ctrl+Enter)</span>
        </>
      )}
    </button>
  );
});

ProcessButton.displayName = 'ProcessButton';

export default ProcessButton;
