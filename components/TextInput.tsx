
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    isTextArea?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ isTextArea, ...props }) => {
  const commonClasses = "block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-200 placeholder-gray-500 transition-colors";
  
  if (isTextArea) {
    return <textarea {...props} rows={3} className={`${commonClasses} p-2`} />;
  }
  
  return <input type="text" {...props} className={`${commonClasses} px-3 py-2`} />;
};
