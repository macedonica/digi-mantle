import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Upload, File, CheckCircle, AlertCircle, Cloud, Archive } from 'lucide-react';

const SIZE_THRESHOLD = 50 * 1024 * 1024; // 50MB in bytes
const ARCHIVE_ENDPOINT = 'https://bibliothecamacedonica.com/upload_handler.php';
const ARCHIVE_API_KEY = 'yba33y5NYiI72ZLV';

interface SmartFileUploaderProps {
  onUploadComplete?: (url: string, fileName: string, fileSize: number) => void;
  acceptedTypes?: string;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
type UploadDestination = 'cloud' | 'archive' | null;

export const SmartFileUploader = ({ 
  onUploadComplete,
  acceptedTypes = '.pdf,.doc,.docx,.epub'
}: SmartFileUploaderProps) => {
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadDestination, setUploadDestination] = useState<UploadDestination>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const isLargeFile = (file: File): boolean => file.size >= SIZE_THRESHOLD;

  const uploadToSupabase = async (file: File): Promise<string> => {
    const path = `${crypto.randomUUID()}-${file.name}`;
    
    const { error } = await supabase.storage
      .from('library-pdfs')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from('library-pdfs')
      .getPublicUrl(path);

    return data.publicUrl;
  };

  const uploadToArchive = (file: File, onProgress: (percent: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.url) {
              resolve(response.url);
            } else {
              reject(new Error(response.error || 'Upload failed - no URL returned'));
            }
          } catch {
            reject(new Error('Invalid server response'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.ontimeout = () => reject(new Error('Upload timed out'));

      xhr.open('POST', ARCHIVE_ENDPOINT);
      xhr.setRequestHeader('X-API-KEY', ARCHIVE_API_KEY);
      xhr.timeout = 600000; // 10 minutes for large files
      xhr.send(formData);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    const isLarge = isLargeFile(selectedFile);
    setUploadDestination(isLarge ? 'archive' : 'cloud');

    try {
      let publicUrl: string;

      if (isLarge) {
        // Large file → PHP archive server
        publicUrl = await uploadToArchive(selectedFile, setUploadProgress);
      } else {
        // Small file → Supabase storage
        // Simulate progress for Supabase (doesn't have native progress)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        publicUrl = await uploadToSupabase(selectedFile);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
      }

      setUploadStatus('success');
      
      toast({
        title: t('Успешно качување!', 'Upload Successful!'),
        description: t(
          `Датотеката е качена на ${isLarge ? 'архивата' : 'облакот'}.`,
          `File uploaded to ${isLarge ? 'cold storage' : 'cloud'}.`
        ),
      });

      onUploadComplete?.(publicUrl, selectedFile.name, selectedFile.size);

      // Reset after short delay
      setTimeout(() => {
        setSelectedFile(null);
        setUploadStatus('idle');
        setUploadProgress(0);
        setUploadDestination(null);
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      
      toast({
        title: t('Грешка при качување', 'Upload Error'),
        description: error instanceof Error ? error.message : t('Непозната грешка', 'Unknown error'),
        variant: 'destructive',
      });
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const getStatusBadge = () => {
    if (uploadStatus !== 'uploading' || !uploadDestination) return null;

    if (uploadDestination === 'archive') {
      return (
        <Badge className="bg-amber-500 text-white animate-pulse">
          <Archive className="mr-1 h-3 w-3" />
          {t('Архивирање во ладно складиште (Голема датотека)...', 'Archiving to Cold Storage (Large File)...')}
        </Badge>
      );
    }

    return (
      <Badge className="bg-blue-500 text-white animate-pulse">
        <Cloud className="mr-1 h-3 w-3" />
        {t('Качување во облак...', 'Uploading to Cloud...')}
      </Badge>
    );
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-12 w-12 text-destructive" />;
      default:
        return <Upload className="h-12 w-12 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
          }
          ${uploadStatus === 'success' ? 'border-green-500 bg-green-50' : ''}
          ${uploadStatus === 'error' ? 'border-destructive bg-destructive/5' : ''}
        `}
      >
        <input
          type="file"
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploadStatus === 'uploading'}
        />
        
        <div className="flex flex-col items-center gap-3">
          {getStatusIcon()}
          
          {!selectedFile ? (
            <>
              <p className="text-lg font-medium">
                {t('Повлечете и пуштете датотека овде', 'Drag and drop a file here')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('или кликнете за да изберете', 'or click to browse')}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {t(
                  'Датотеки под 50MB → Облак | Датотеки над 50MB → Ладно складиште',
                  'Files under 50MB → Cloud | Files over 50MB → Cold Storage'
                )}
              </p>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-primary" />
                <span className="font-medium">{selectedFile.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
                {isLargeFile(selectedFile) && (
                  <span className="ml-2 text-amber-600 font-medium">
                    ({t('Голема датотека', 'Large file')})
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Badge */}
      {getStatusBadge() && (
        <div className="flex justify-center">
          {getStatusBadge()}
        </div>
      )}

      {/* Progress Bar */}
      {uploadStatus === 'uploading' && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-center text-muted-foreground">
            {uploadProgress}%
          </p>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && uploadStatus === 'idle' && (
        <Button 
          onClick={handleUpload} 
          variant="hero" 
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isLargeFile(selectedFile) 
            ? t('Архивирај во ладно складиште', 'Archive to Cold Storage')
            : t('Качи во облак', 'Upload to Cloud')
          }
        </Button>
      )}

      {/* Reset Button after error */}
      {uploadStatus === 'error' && (
        <Button 
          onClick={() => {
            setSelectedFile(null);
            setUploadStatus('idle');
            setUploadProgress(0);
          }} 
          variant="outline" 
          className="w-full"
        >
          {t('Обиди се повторно', 'Try Again')}
        </Button>
      )}
    </div>
  );
};
