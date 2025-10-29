
import React from 'react';

interface DisplayPanelProps {
  generatedImage: string | null;
  originalImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const EmptyState = () => (
    <div className="text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-300">Image Output</h3>
        <p className="mt-1 text-sm">Your generated image will appear here.</p>
        <p className="mt-1 text-sm">Fill out the form and click "Generate".</p>
    </div>
);

const LoadingState = () => (
    <div className="text-center text-gray-400">
        <svg className="animate-spin mx-auto h-12 w-12 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg">Generating your image...</p>
        <p className="text-sm">This may take a moment.</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg border border-red-700">
        <h3 className="font-semibold">Generation Failed</h3>
        <p className="text-sm mt-1">{message}</p>
    </div>
);

export const DisplayPanel: React.FC<DisplayPanelProps> = ({ generatedImage, originalImage, isLoading, error }) => {
    
  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (generatedImage && originalImage) {
      return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-center font-semibold text-gray-400">Original</h3>
              <img src={originalImage} alt="Original" className="w-full h-auto object-contain rounded-lg bg-black" />
            </div>
            <div className="space-y-2">
              <h3 className="text-center font-semibold text-gray-400">Generated</h3>
              <img src={generatedImage} alt="Generated" className="w-full h-auto object-contain rounded-lg bg-black" />
            </div>
          </div>
      );
    }
    return <EmptyState />;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center w-full h-full min-h-[400px] lg:min-h-0">
      {renderContent()}
    </div>
  );
};
