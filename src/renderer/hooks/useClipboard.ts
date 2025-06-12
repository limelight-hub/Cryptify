import { useState, useCallback } from 'react';

interface UseClipboardReturn {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<boolean>;
}

export const useClipboard = (resetDelay: number = 2000): UseClipboardReturn => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, [resetDelay]);

  return { copied, copyToClipboard };
};
