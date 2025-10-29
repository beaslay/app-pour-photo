
import React, { useState } from 'react';
import { type FormDataState, type EditImageRequest, type ImageFile } from '../types';
import { ImageUploader } from './ImageUploader';
import { TextInput } from './TextInput';

interface ControlPanelProps {
  onGenerate: (request: EditImageRequest) => void;
  isLoading: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">{title}</h3>
        {children}
    </div>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isLoading }) => {
  const [referenceImage, setReferenceImage] = useState<ImageFile | null>(null);
  const [maskImage, setMaskImage] = useState<ImageFile | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    clothingStyle: 'blue night suit, white shirt',
    materials: 'super 110 wool, matte',
    accessories: 'none',
    colors: '#0A1633, #FFFFFF',
    background: 'neutral gray studio, light gradient',
    lighting: 'key light from the left',
    quality: '4K',
    negativePrompt: 'deformed face, added fingers, plastic skin, excessive blur, distortion, artifacts, parasitic text, color banding',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceImage) {
      alert('Please upload a reference image.');
      return;
    }
    onGenerate({ referenceImage, maskImage, formData });
  };
  
  const FormField: React.FC<{ label: string; name: keyof FormDataState; placeholder: string, isTextArea?: boolean }> = ({ label, name, placeholder, isTextArea=false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <TextInput id={name} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} isTextArea={isTextArea}/>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-8 h-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Image Inputs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploader label="Reference Image (Required)" onImageUpload={setReferenceImage} />
                <ImageUploader label="Edit Mask (Optional)" onImageUpload={setMaskImage} />
            </div>
        </Section>

        <Section title="Styling Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Clothing Style" name="clothingStyle" placeholder="e.g., oversized black hoodie" />
              <FormField label="Material Details" name="materials" placeholder="e.g., thick cotton, visible cords" />
              <FormField label="Accessories" name="accessories" placeholder="e.g., fine silver chain" />
              <FormField label="Color Palette" name="colors" placeholder="e.g., #111111, #6B8E23" />
            </div>
        </Section>
        
        <Section title="Scene & Quality">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Background" name="background" placeholder="e.g., nocturnal alley, bokeh neons" />
                <FormField label="Lighting" name="lighting" placeholder="e.g., cold reflections on dark fabrics" />
            </div>
             <FormField label="Output Quality" name="quality" placeholder="e.g., 4K, realistic, zero artifact" />
        </Section>

        <Section title="Negative Prompts (To Ban)">
            <FormField label="Items to avoid in the generation" name="negativePrompt" placeholder="e.g., deformed face, extra fingers" isTextArea={true} />
        </Section>

        <button 
          type="submit" 
          disabled={isLoading || !referenceImage}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
           {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate Image'}
        </button>
      </form>
    </div>
  );
};
