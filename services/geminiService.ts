
import { GoogleGenAI, Modality } from "@google/genai";
import { type StylistEditImageRequest, type TextEditImageRequest, type FormDataState } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createMasterPrompt = (formData: FormDataState): string => {
  const {
    clothingStyle,
    materials,
    accessories,
    colors,
    background,
    lighting,
    quality,
    negativePrompt
  } = formData;

  return `
    OBJECTIVE: Modify the clothing and background of the provided photo. Strictly preserve the subject's face, morphology, pose, and the original lighting setup.

    STRONG CONSTRAINTS:
    - Do not alter age, gender, or facial features.
    - Preserve the original hairstyle and body proportions.
    - Strictly respect the original perspective and lighting direction.
    - Maintain natural textures; avoid over-smoothing or plastic-like skin.

    INSTRUCTIONS:
    1. Do not touch the face, hair, or skin.
    2. Edit only the areas indicated by the provided mask. If no mask is given, automatically detect the clothing and background for editing.
    3. Generate realistic clothing, paying close attention to texture, drape, and seams as described.
    4. Replace the background with a scene that has a coherent perspective and depth of field.
    5. Harmonize all shadows and highlights with the original source light.
    6. Ensure the final output is clean, with no halos or broken contours.

    SPECIFICATIONS:
    - Clothing Style: ${clothingStyle || 'As per user image, but improved.'}
    - Material Details: ${materials || 'High quality and realistic.'}
    - Accessories: ${accessories || 'None.'}
    - Color Palette: ${colors || 'Harmonious with the overall scene.'}
    - Background: ${background || 'A clean, neutral studio background.'}
    - Light Coherence: ${lighting || 'Match original key light direction and intensity.'}
    - Output Quality: ${quality || '4K, photorealistic, zero artifacts.'}

    NEGATIVE PROMPTS (AVOID THESE):
    ${negativePrompt || 'deformed face, extra fingers, plastic skin, excessive blur, distortion, artifacts, parasitic text, color banding'}
  `.trim();
};

export const runImageStylist = async (request: StylistEditImageRequest): Promise<string | null> => {
  const { referenceImage, maskImage, formData } = request;

  const textPrompt = createMasterPrompt(formData);
  
  const parts: any[] = [
    {
      inlineData: {
        data: referenceImage.base64,
        mimeType: referenceImage.file.type,
      },
    },
  ];

  if (maskImage) {
     parts.push({
      inlineData: {
        data: maskImage.base64,
        mimeType: maskImage.file.type,
      },
    });
  }

  parts.push({ text: textPrompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API. Please check the console for details.");
  }
};

export const runImageEditor = async (request: TextEditImageRequest): Promise<string | null> => {
  const { referenceImage, prompt } = request;

  const parts: any[] = [
    {
      inlineData: {
        data: referenceImage.base64,
        mimeType: referenceImage.file.type,
      },
    },
    { text: prompt },
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API. Please check the console for details.");
  }
};
