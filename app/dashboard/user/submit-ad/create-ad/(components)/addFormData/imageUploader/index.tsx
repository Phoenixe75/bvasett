import React, { useEffect, useState } from 'react';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ToastContainer, toast } from 'react-toastify';
import { uploadImage } from '../../../(services)/submitAd.service';

type ImagePreview = {
  file: File;
  preview: string;
  progress?: number;
  id: number | string;
};

interface Props {
  onChange?: (data:number[]) => void;
}

const MAX_FILES = 6;
const MAX_FILE_SIZE = 800 * 1024; // 2MB
type Progress = {
  done?: boolean;
  progress?: number;
  uploadedId?: number;
}
export default function ImageUploader({ onChange }: Props) {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [prgresses, setProgresses] = useState<Record<any, Progress>>({})
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, number>>({})
  const [generateKeys, setGenerateKeys] = useState("start");
  useEffect(()=>{
    onChange?.(Object.values(uploadedFiles))
  },[uploadedFiles])
  const updateProgress = (progress: number, id:number|string) => {
    if (progress < 100){
      setProgresses((prev)=>{
        return {...prev,
          [id]: {
            ...prev?.[id],
            progress
          }
        }
      })
    }
  }
  const uploadValidFiles = (files: {file:File, id: number |string}[]) => {
    files.forEach(async(file)=>{
      try {
        const formData = new FormData();
        formData.append("file",file.file)
        const result = await uploadImage(formData, (progress) => {
          updateProgress(progress,file.id)
        })
        if(result.id) {
          setProgresses((prev)=>{
            return {...prev,
              [file.id]: {
                ...prev?.[file.id],
                done: true,
                uploadedId:result.id
              }
            }
          })
          setUploadedFiles(pre=>({...pre,[file.id]:result.id}))
        }
      } catch (error) {
        console.log(error)
      }
    })
  }
  const handleSelect = (event: FileUploadSelectEvent) => {
    let filesToArray = Array.from(event.files as File[]);
    const selectedFiles = filesToArray.map(file=> ({
      file,
      id: crypto.randomUUID()
    }))
    // Check total file limit
    if (images.length + selectedFiles.length > MAX_FILES) {
      toast.warn(`حداکثر تعداد عکس قابل آپلود ${MAX_FILES} است.`);
      return;
    }

    const validFiles = selectedFiles.filter(item => {
      if (item.file.size > MAX_FILE_SIZE) {
        setGenerateKeys(crypto.randomUUID())
        toast.error(`${item.file.name} بزرگتر از ۸۰۰ کیلوبایت است`);
        return false;
      }
      return true;
    });
    uploadValidFiles(validFiles)
    Promise.all(
      validFiles.map(item => {
        return new Promise<ImagePreview>(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ file:item.file,id:item.id, preview: reader.result as string, progress: 0 });
          reader.readAsDataURL(item.file);
        });
      })
    ).then(newPreviews => {
      const updatedImages = [...images, ...newPreviews];
      setGenerateKeys(crypto.randomUUID())
      setImages(updatedImages);
    });

    // reset file input to allow re-upload of the same file
    const input = event.originalEvent?.target as HTMLInputElement | null;
    if (input) {
      input.value = '';
    }
  };

  const handleRemove = (index: number, id:number | string) => {
    const updated = images.filter((_, i) => i !== index);
    setGenerateKeys(crypto.randomUUID())
    setImages(updated);
    const updatedUploadedImages = {...uploadedFiles}
    delete updatedUploadedImages[id]
    setUploadedFiles(updatedUploadedImages)
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card title="بارگذاری عکس">
        <FileUpload
        // @ts-ignore
          key={generateKeys}
          name="images"
          mode="basic"
          customUpload
          chooseLabel="عکس خود را انتخاب نمایید. حداکثر ۶ عکس"
          accept="image/*"
          multiple
          onSelect={handleSelect}
        />
        <div className="flex flex-wrap gap-3 mt-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative border-1 border-round surface-border overflow-hidden"
              style={{ width: '8rem', height: '8rem' }}
            > 
              <Image
                src={img.preview}
                alt={`Preview ${idx}`}
                imageStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {prgresses[img.id]?.done ?<Button
                icon="pi pi-times"
                className="absolute top-0 right-0 m-1 p-button-sm p-button-rounded p-button-danger"
                onClick={() => handleRemove(idx, img.id)}
                tooltip="حذف"
              />: null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
