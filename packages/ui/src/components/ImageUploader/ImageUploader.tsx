/**
 * ImageUploader — drop zone with image preview and type/size validation.
 */
import React, { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import styles from './ImageUploader.module.css';

export interface ImageUploaderProps {
  value?: string; // image preview URL
  onChange: (file: File | null) => void;
  maxSizeBytes?: number;
  accept?: string;
  label?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  maxSizeBytes = 5 * 1024 * 1024,
  accept = 'image/jpeg,image/png,image/webp',
  label = 'Upload banner image',
  className = '',
}) => {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeBytes) {
      setError(`File is too large (max ${Math.round(maxSizeBytes / (1024 * 1024))}MB)`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onChange(file);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(undefined);
    setError(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <div
        className={[styles.dropZone, preview ? styles.hasPreview : ''].filter(Boolean).join(' ')}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className={styles.fileInput}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
            <button type="button" className={styles.removeBtn} onClick={clear} aria-label="Remove image">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <UploadCloud size={32} className={styles.uploadIcon} />
            <span className={styles.label}>{label}</span>
            <span className={styles.hint}>JPG, PNG, or WebP up to 5MB</span>
          </div>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

