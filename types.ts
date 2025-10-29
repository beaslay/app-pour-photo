
export interface FormDataState {
  clothingStyle: string;
  materials: string;
  accessories: string;
  colors: string;
  background: string;
  lighting: string;
  quality: string;
  negativePrompt: string;
}

export interface ImageFile {
  file: File;
  base64: string;
}

export interface EditImageRequest {
  referenceImage: ImageFile;
  maskImage: ImageFile | null;
  formData: FormDataState;
}
