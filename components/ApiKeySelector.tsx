import React, { useState, useEffect } from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkKey = async () => {
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio && aistudio.hasSelectedApiKey) {
        const selected = await aistudio.hasSelectedApiKey();
        setHasKey(selected);
        if (selected) {
          onKeySelected();
        }
      }
    } catch (e) {
      console.error("Error checking API key:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio && aistudio.openSelectKey) {
        await aistudio.openSelectKey();
        // Assume success after dialog closes/promise resolves, per guidelines
        setHasKey(true);
        onKeySelected();
      }
    } catch (e) {
      console.error("Failed to select key:", e);
      // Reset state on error to allow retry
      setHasKey(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-sm">Checking API access...</div>;
  }

  if (hasKey) {
    return null; // Don't render anything if key is present
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-200">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 19l-1 1-1-1-1 1-1-1-1 1-1-1a2 2 0 01-2-2 4 4 0 014-4h.001M19 13v.01" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">API Key Required</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          To use the high-quality <strong>Gemini 3 Pro</strong> image model, you need to connect a valid Google Cloud API key from a paid project.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleSelectKey}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Select API Key
          </button>
          
          <div className="text-xs text-gray-500">
            Need help? Check the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">billing documentation</a>.
          </div>
        </div>
      </div>
    </div>
  );
};