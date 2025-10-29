
import React, { useState, useRef } from 'react';
import { type ImageFile } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

interface ImageUploaderProps {
  label: string;
  onImageUpload: (image: ImageFile | null) => void;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPreview(URL.createObjectURL(file));
        onImageUpload({ file, base64 });
      } catch (error) {
        console.error('Error converting file to base64:', error);
        onImageUpload(null);
      }
    }
  };

  const handleClear = () => {
    setPreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div 
        className="relative group w-full h-48 bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors"
        onClick={handleClick}
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-md p-1" />
            <button
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              className="absolute top-2 right-2 p-1.5 bg-gray-900/70 text-gray-300 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/80 hover:text-white transition-all"
              title="Remove image"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <UploadIcon className="mx-auto h-10 w-10" />
            <p className="mt-2 text-sm">Click to upload an image</p>
          </div>
        )}
      </div>
    </div>
  );
};
