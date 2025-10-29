
import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { DisplayPanel } from './components/DisplayPanel';
import { Header } from './components/Header';
import { type EditImageRequest } from './types';
import { editImageWithPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const handleGenerate = useCallback(async (request: EditImageRequest) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setOriginalImage(request.referenceImage.base64);

    try {
      const result = await editImageWithPrompt(request);
      if (result) {
        setGeneratedImage(`data:image/png;base64,${result}`);
      } else {
        setError('Failed to generate image. The result was empty.');
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
        <div className="lg:overflow-y-auto lg:pr-4">
           <ControlPanel onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
        <div className="lg:pl-4">
           <DisplayPanel 
            generatedImage={generatedImage} 
            originalImage={originalImage}
            isLoading={isLoading} 
            error={error} 
           />
        </div>
      </main>
    </div>
  );
};

export default App;
