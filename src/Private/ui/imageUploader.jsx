import { useState, useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

export default function ImageUploader({
  label = 'Upload Image',
  onFileSelect,
  required = false,
  defaultPreview = null,
}) {
  const [previewUrl, setPreviewUrl] = useState(defaultPreview);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const preview = URL.createObjectURL(selectedFile);
    setPreviewUrl(preview);
    onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    setFile(droppedFile);
    const preview = URL.createObjectURL(droppedFile);
    setPreviewUrl(preview);
    onFileSelect(droppedFile);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="font-semibold ">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      )}

      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-5 flex flex-col items-center justify-center text-gray-700 cursor-pointer bg-white hover:bg-gray-50 transition relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-md shadow-md"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <ImagePlus className="h-10 w-10 text-gray-500" />
            <p className="text-sm mt-1">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-500">JPG, PNG, JPEG, WEBP</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
