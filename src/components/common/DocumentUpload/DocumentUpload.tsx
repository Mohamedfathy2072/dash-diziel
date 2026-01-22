import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { BasicButton } from "../../../mui/buttons/BasicButton";
import DeleteIcon from "../../../icons/DeleteIcon";
import UploadIcon from "../../../icons/UploadIcon";
import type { DocumentUploadProps } from "../../../types/components";

const DocumentUpload = ({
  type,
  label,
  onChange,
  value,
  accept = "application/pdf,image/jpeg,image/jpg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
}: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync value prop with internal state
  useEffect(() => {
    if (!isUpdatingRef.current) {
      setFile(value || null);
    }
    // Reset isUpdatingRef when value changes from outside (e.g., form reset)
    if (value === null || value === undefined) {
      isUpdatingRef.current = false;
    }
  }, [value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) {
      return;
    }
    
    const selectedFile = files[0];
    
    // Validate file size
    if (selectedFile.size > maxSize) {
      setError(`File size must be less than ${(maxSize / (1024 * 1024)).toFixed(0)}MB`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    
    // Prevent double upload - check if we're already processing
    if (isUpdatingRef.current) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    
    setError(null);
    isUpdatingRef.current = true;
    
    // Update state and call onChange immediately
    setFile(selectedFile);
    if (onChange) {
      onChange(selectedFile, type);
    }
    
    // Reset input value AFTER a delay to prevent immediate re-trigger
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Reset isUpdatingRef after everything is done
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }, 300);
  };

  const handleRemove = () => {
    isUpdatingRef.current = true;
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onChange) {
      onChange(null, type);
    }
    // Reset isUpdatingRef after removal
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't open if we're already processing
    if (isUpdatingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Trigger file input click programmatically
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box className={`grid gap-3 ${className || ""}`}>
      <Box className="flex items-center justify-between">
        <Typography variant="subtitle2" className="!text-gray-700 !font-[600]">
          {label}
        </Typography>
        {file && (
          <BasicButton
            type="button"
            onClick={handleRemove}
            className="!text-xs !bg-red-50 !text-red-600 hover:!bg-red-100 !border-red-200 !border !px-3 !py-1"
          >
            <DeleteIcon className="w-3 h-3 mr-1" />
            Remove
          </BasicButton>
        )}
      </Box>
      
      <Box
        onClick={handleClick}
        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-3 bg-gray-50 hover:border-[#003366] hover:bg-gray-100 transition-all group"
      >
        {file ? (
          <Box className="flex flex-col items-center gap-2">
            <UploadIcon className="text-[#003366] w-8 h-8" />
            <Typography variant="body2" className="!font-[600] !text-[#003366]">
              {file.name}
            </Typography>
            <Typography variant="caption" className="!text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        ) : (
          <Box className="flex flex-col items-center gap-2">
            <UploadIcon className="text-gray-400 w-10 h-10 group-hover:text-[#003366] transition-colors" />
            <Typography variant="body2" className="!text-gray-600 group-hover:!text-[#003366] transition-colors">
              Click to upload {label}
            </Typography>
            <Typography variant="caption" className="!text-gray-500">
              PDF, JPG, PNG, DOC, DOCX (max {(maxSize / (1024 * 1024)).toFixed(0)}MB)
            </Typography>
          </Box>
        )}
        <input
          ref={fileInputRef}
          id={`document-upload-${type}`}
          name={`document-upload-${type}`}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </Box>
      {error && (
        <Typography variant="caption" className="!text-red-600">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default DocumentUpload;

