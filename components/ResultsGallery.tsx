import React from 'react';
import { GeneratedImage } from '../types';

interface ResultsGalleryProps {
  images: GeneratedImage[];
  onReset: () => void;
}

export const ResultsGallery: React.FC<ResultsGalleryProps> = ({ images, onReset }) => {
  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Generated Infographics</h2>
        <button 
          onClick={onReset}
          className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Create New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-xl transition-shadow">
            <div className={`relative ${img.type === 'horizontal' ? 'aspect-video' : 'aspect-[3/4]'} bg-gray-100 overflow-hidden`}>
              <img 
                src={img.url} 
                alt={img.description} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-800">{img.description}</h3>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    {img.type === 'horizontal' ? '16:9 Landscape' : 'A4 Portrait'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => handleDownload(img.url, `infographic-${img.type}.png`)}
                className="w-full mt-3 py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PNG
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};