import { useState, useRef, useEffect } from 'react';
import { ImagePlus, X } from 'lucide-react';

export default function ImageUploader({
  label = 'Upload Image',
  value=null,
  onFileSelect,
  required = false,
  defaultPreview = null,
  error = null,
}) {
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; //2MB

    if (!allowedTypes.includes(file.type)) {
      onFileSelect(null, 'Only JPG,PNG,WEBP allowed');
      return;
    }
    if (file.size > maxSize) {
      onFileSelect(null, 'Max size 2MB');
      return;
    }
    onFileSelect(file,null);
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null, required ? 'Image is required!' : null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };



  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-5
                   flex flex-col items-center justify-center cursor-pointer
                   bg-white hover:bg-gray-50 transition relative"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-md shadow"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              onClick={handleRemove}
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <ImagePlus className="w-10 h-10 text-gray-500" />
            <p className="text-sm mt-1">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-500">JPG, PNG, WEBP</p>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
}
