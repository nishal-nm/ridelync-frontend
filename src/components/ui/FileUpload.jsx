import { Upload, XCircle } from 'lucide-react';
import React, { useRef, useState } from 'react';

const FileUpload = ({ label, updateFilesCb }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      updateFilesCb(files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      updateFilesCb(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Prevent triggering handleClick
    setFile(null);
    updateFilesCb(null);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium mb-1 px-1">{label}</label>
      )}
      <div
        className={`
          w-full 
          border-2 
          ${isDragging ? 'border-blue-400 bg-blue-50' : ''}
          ${file ? 'border-green-500' : 'border-dashed border-gray-300'} 
          rounded-lg 
          p-4 sm:p-6 
          text-center 
          transition-colors 
          duration-200
          ${!file && 'hover:border-gray-400 cursor-pointer'}
          touch-none
        `}
        onClick={file ? null : handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
      >
        {file ? (
          <div className="flex items-center justify-between gap-2 break-all">
            <span className="text-sm text-gray-900 flex-1 text-left">
              {file.name}
            </span>
            <button
              onClick={handleRemoveFile}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Remove file"
            >
              <XCircle className="w-5 h-5 text-red-500" />
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              className="hidden"
              accept="image/png,image/jpeg"
            />
            <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            {label && (
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                <span className="hidden sm:inline">
                  Click to upload or drag and drop
                </span>
                <span className="sm:hidden">Tap to upload a file</span>
              </p>
            )}

            <p className={'mt-1 text-xs text-gray-500'}>PNG, JPG up to 5MB</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
