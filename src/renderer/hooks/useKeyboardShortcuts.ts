import { useEffect } from 'react';

interface KeyboardShortcuts {
  'Ctrl+Enter': () => void;
  'Ctrl+Shift+C': () => void;
  'Ctrl+R': () => void;
  'Ctrl+T': () => void;
  'Ctrl+1': () => void;
  'Ctrl+2': () => void;
}

export const useKeyboardShortcuts = (shortcuts: Partial<KeyboardShortcuts>) => {
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const key = `${e.ctrlKey ? 'Ctrl+' : 'Cmd+'}${e.shiftKey ? 'Shift+' : ''}${e.key}`;
        const handler = shortcuts[key as keyof KeyboardShortcuts];

        if (handler) {
          e.preventDefault();
          handler();
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [shortcuts]);
};
