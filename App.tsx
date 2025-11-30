import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ResultsGallery } from './components/ResultsGallery';
import { analyzeContext, generateInfographics } from './services/geminiService';
import { AppState, GeneratedImage } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (
    topic: string,
    subject: string,
    grade: string,
    text: string,
    files: File[]
  ) => {
    try {
      setErrorMsg(null);
      setAppState(AppState.ANALYZING);

      // Step 1: Analyze Context
      const summary = await analyzeContext(topic, subject, grade, text, files);

      setAppState(AppState.GENERATING);
      
      // Step 2: Generate Images
      const generatedImages = await generateInfographics(topic, subject, grade, summary);
      
      if (generatedImages.length === 0) {
        throw new Error("Failed to generate images. Please try again.");
      }

      setImages(generatedImages);
      setAppState(AppState.COMPLETE);

    } catch (error: any) {
      console.error("Generation failed:", error);
      setErrorMsg(error.message || "An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setImages([]);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              Infographic<span className="text-gray-900">GenAI</span>
            </h1>
          </div>
          <div className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            Powered by Gemini 3 Pro
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
         {appState === AppState.ERROR && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h3 className="font-bold">Error</h3>
                <p>{errorMsg}</p>
                <button onClick={() => setAppState(AppState.IDLE)} className="mt-2 text-sm font-semibold underline hover:text-red-800">Try Again</button>
              </div>
            </div>
         )}

         {appState === AppState.COMPLETE ? (
           <ResultsGallery images={images} onReset={handleReset} />
         ) : (
           <div className="max-w-3xl mx-auto">
             <div className="mb-10 text-center">
               <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Create Educational Infographics Instantly</h2>
               <p className="text-lg text-gray-600">Provide the topic and source material. We'll generate professional layouts for slides, posters, and handouts.</p>
             </div>
             <InputForm appState={appState} onSubmit={handleGenerate} />
           </div>
         )}
      </main>
    </div>
  );
}

export default App;
