import React, { useState, useCallback } from 'react';
import { AppState } from '../types';

interface InputFormProps {
  appState: AppState;
  onSubmit: (topic: string, subject: string, grade: string, text: string, images: File[]) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ appState, onSubmit }) => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [contextText, setContextText] = useState('');
  const [contextImages, setContextImages] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !subject || !grade) return;
    onSubmit(topic, subject, grade, contextText, contextImages);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setContextImages(Array.from(e.target.files));
    }
  };

  const isProcessing = appState === AppState.ANALYZING || appState === AppState.GENERATING;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          Project Details
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Topic Name (Tên mục)</label>
              <input
                type="text"
                placeholder="e.g., Tính chất hóa học của amine"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject (Môn học)</label>
              <input
                type="text"
                placeholder="e.g., Hóa học"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Grade (Lớp)</label>
              <input
                type="text"
                placeholder="e.g., Lớp 12"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Source</h3>
            
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'text' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('image')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'image' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Upload Images
              </button>
            </div>

            {activeTab === 'text' ? (
              <textarea
                placeholder="Paste the educational content, summary, or key points here..."
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                disabled={isProcessing}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 resize-y"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  disabled={isProcessing}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP (Max 3 files)</p>
                  {contextImages.length > 0 && (
                     <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {contextImages.map((f, i) => (
                           <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                              {f.name}
                           </span>
                        ))}
                     </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isProcessing || (!contextText && contextImages.length === 0)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {appState === AppState.ANALYZING ? 'Analyzing Content...' : 'Generating Infographics...'}
              </>
            ) : (
              <>
                <span>Generate Infographics</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};