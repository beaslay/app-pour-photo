
import React, { useState } from 'react';
import { type FormDataState, type StylistEditImageRequest, type TextEditImageRequest, type ImageFile } from '../types';
import { ImageUploader } from './ImageUploader';
import { TextInput } from './TextInput';
import { runImageStylist, runImageEditor } from '../services/geminiService';

interface ControlPanelProps {
  onGenerate: (generateFn: () => Promise<string | null>, originalImageBase64: string) => void;
  isLoading: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">{title}</h3>
        {children}
    </div>
);

const TabButton: React.FC<{ title: string; active: boolean; onClick: () => void }> = ({ title, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
            active
                ? 'bg-gray-800 border-gray-700 border-b-2 border-indigo-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
        }`}
    >
        {title}
    </button>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isLoading }) => {
  const [mode, setMode] = useState<'stylist' | 'editor'>('stylist');
  const [referenceImage, setReferenceImage] = useState<ImageFile | null>(null);
  
  // State for stylist mode
  const [maskImage, setMaskImage] = useState<ImageFile | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    clothingStyle: 'costume de nuit bleu, chemise blanche',
    materials: 'laine super 110, mate',
    accessories: 'aucun',
    colors: '#0A1633, #FFFFFF',
    background: 'studio gris neutre, léger dégradé',
    lighting: 'lumière principale venant de la gauche',
    quality: '4K, photoréaliste',
    negativePrompt: 'visage déformé, doigts ajoutés, peau plastique, flou excessif, distorsion, artefacts, texte parasite, bandes de couleur',
  });

  // State for editor mode
  const [prompt, setPrompt] = useState<string>('');


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceImage) {
      alert("Veuillez téléverser une image source.");
      return;
    }

    if (mode === 'stylist') {
      const request: StylistEditImageRequest = { referenceImage, maskImage, formData };
      onGenerate(() => runImageStylist(request), referenceImage.base64);
    } else { // editor mode
      if (!prompt.trim()) {
        alert("Veuillez saisir une instruction de modification.");
        return;
      }
      const request: TextEditImageRequest = { referenceImage, prompt };
      onGenerate(() => runImageEditor(request), referenceImage.base64);
    }
  };
  
  const FormField: React.FC<{ label: string; name: keyof FormDataState; placeholder: string, isTextArea?: boolean }> = ({ label, name, placeholder, isTextArea=false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <TextInput id={name} name={name} value={formData[name]} onChange={handleFormChange} placeholder={placeholder} isTextArea={isTextArea}/>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6 h-full">
      <div className="flex border-b border-gray-700">
        <TabButton title="Styliste" active={mode === 'stylist'} onClick={() => setMode('stylist')} />
        <TabButton title="Éditeur" active={mode === 'editor'} onClick={() => setMode('editor')} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Images d'Entrée">
            <div className={`grid grid-cols-1 ${mode === 'stylist' ? 'md:grid-cols-2' : ''} gap-4`}>
                <ImageUploader label="Image Source (Requise)" onImageUpload={setReferenceImage} />
                {mode === 'stylist' &&
                  <ImageUploader label="Masque d'Édition (Optionnel)" onImageUpload={setMaskImage} />
                }
            </div>
        </Section>

        {mode === 'stylist' ? (
          <>
            <Section title="Détails du Style">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Style Vestimentaire" name="clothingStyle" placeholder="ex: sweat à capuche noir ample" />
                  <FormField label="Détails des Matériaux" name="materials" placeholder="ex: coton épais, cordons visibles" />
                  <FormField label="Accessoires" name="accessories" placeholder="ex: chaîne fine en argent" />
                  <FormField label="Palette de Couleurs" name="colors" placeholder="ex: #111111, #6B8E23" />
                </div>
            </Section>
            
            <Section title="Scène & Qualité">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Arrière-plan" name="background" placeholder="ex: ruelle nocturne, néons en bokeh" />
                    <FormField label="Éclairage" name="lighting" placeholder="ex: reflets froids sur tissus sombres" />
                </div>
                 <FormField label="Qualité de Sortie" name="quality" placeholder="ex: 4K, réaliste, sans artefact" />
            </Section>

            <Section title="Prompts Négatifs (À Éviter)">
                <FormField label="Éléments à éviter dans la génération" name="negativePrompt" placeholder="ex: visage déformé, doigts en plus" isTextArea={true} />
            </Section>
          </>
        ) : (
          <Section title="Instruction de Modification">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-1">Décrivez votre modification</label>
            <TextInput 
              id="prompt"
              name="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="ex: Ajouter un filtre rétro, mettre en noir et blanc"
              isTextArea={true}
            />
          </Section>
        )}

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
              Génération en cours...
            </>
          ) : "Générer l'Image"}
        </button>
      </form>
    </div>
  );
};