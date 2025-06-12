import React, { memo } from 'react';
import { Settings, Clock, BarChart3 } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = memo(({ isOpen, onClose }) => {
  const { theme, themeClasses } = useTheme();
  const { getStats, getMethodStats, clearMetrics } = usePerformanceMonitor();

  if (!isOpen) return null;

  const stats = getStats();
  const playfairStats = getMethodStats('playfair');
  const rsaStats = getMethodStats('rsa');

  const formatDuration = (ms: number) => {
    if (ms < 1) return `${ms.toFixed(2)}ms`;
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-2xl w-full max-h-[80vh] overflow-auto ${themeClasses[theme].cardBg} rounded-lg border ${themeClasses[theme].border}`}>
        {/* Header */}
        <div className={`p-4 border-b ${themeClasses[theme].border} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Application Settings</h2>
          </div>
          <button
            onClick={onClose}
            className={`px-3 py-1 rounded ${themeClasses[theme].surfaceHover} text-sm`}
          >
            Close
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Performance Statistics */}
          <section>
            <h3 className="flex items-center gap-2 text-md font-medium mb-4">
              <BarChart3 className="w-4 h-4" />
              Performance Statistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Overall Stats */}
              <div className={`p-4 rounded-lg border ${themeClasses[theme].border} ${themeClasses[theme].input}`}>
                <h4 className="font-medium mb-3">Overall Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={themeClasses[theme].textSecondary}>Total Operations:</span>
                    <span>{stats.totalOperations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={themeClasses[theme].textSecondary}>Successful:</span>
                    <span className="text-green-500">{stats.successfulOperations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={themeClasses[theme].textSecondary}>Average Duration:</span>
                    <span>{formatDuration(stats.averageDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={themeClasses[theme].textSecondary}>Characters Processed:</span>
                    <span>{stats.totalInputChars.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Method-Specific Stats */}
              <div className={`p-4 rounded-lg border ${themeClasses[theme].border} ${themeClasses[theme].input}`}>
                <h4 className="font-medium mb-3">Method Performance</h4>
                <div className="space-y-3 text-sm">
                  {playfairStats && (
                    <div>
                      <div className="font-medium text-blue-400 mb-1">Playfair Cipher</div>
                      <div className="ml-2 space-y-1">
                        <div className="flex justify-between">
                          <span className={themeClasses[theme].textSecondary}>Operations:</span>
                          <span>{playfairStats.operations}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={themeClasses[theme].textSecondary}>Avg Duration:</span>
                          <span>{formatDuration(playfairStats.averageDuration)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {rsaStats && (
                    <div>
                      <div className="font-medium text-purple-400 mb-1">RSA Encryption</div>
                      <div className="ml-2 space-y-1">
                        <div className="flex justify-between">
                          <span className={themeClasses[theme].textSecondary}>Operations:</span>
                          <span>{rsaStats.operations}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={themeClasses[theme].textSecondary}>Avg Duration:</span>
                          <span>{formatDuration(rsaStats.averageDuration)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Last Operation */}
            {stats.lastOperation && (
              <div className={`mt-4 p-4 rounded-lg border ${themeClasses[theme].border} ${themeClasses[theme].input}`}>
                <h4 className="flex items-center gap-2 font-medium mb-3">
                  <Clock className="w-4 h-4" />
                  Last Operation
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={`block ${themeClasses[theme].textSecondary}`}>Method</span>
                    <span className="font-medium">{stats.lastOperation.method.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className={`block ${themeClasses[theme].textSecondary}`}>Operation</span>
                    <span className="font-medium">{stats.lastOperation.operation}</span>
                  </div>
                  <div>
                    <span className={`block ${themeClasses[theme].textSecondary}`}>Duration</span>
                    <span className="font-medium">{formatDuration(stats.lastOperation.duration)}</span>
                  </div>
                  <div>
                    <span className={`block ${themeClasses[theme].textSecondary}`}>Input Length</span>
                    <span className="font-medium">{stats.lastOperation.inputLength} chars</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={clearMetrics}
                className={`px-4 py-2 rounded ${themeClasses[theme].surfaceHover} text-sm border ${themeClasses[theme].border}`}
              >
                Clear Statistics
              </button>
            </div>
          </section>

          {/* Application Info */}
          <section>
            <h3 className="text-md font-medium mb-4">Application Information</h3>
            <div className={`p-4 rounded-lg border ${themeClasses[theme].border} ${themeClasses[theme].input} text-sm`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={`block ${themeClasses[theme].textSecondary}`}>Version</span>
                  <span>1.0.0</span>
                </div>
                <div>
                  <span className={`block ${themeClasses[theme].textSecondary}`}>Platform</span>
                  <span>Electron + React</span>
                </div>
                <div>
                  <span className={`block ${themeClasses[theme].textSecondary}`}>Algorithms</span>
                  <span>Playfair, RSA</span>
                </div>
                <div>
                  <span className={`block ${themeClasses[theme].textSecondary}`}>License</span>
                  <span>MIT</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});

SettingsPanel.displayName = 'SettingsPanel';

export default SettingsPanel;
