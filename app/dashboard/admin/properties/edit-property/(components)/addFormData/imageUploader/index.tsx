import { Image } from 'primereact/image';
import { Button } from 'primereact/button';

import { Property } from '../../../../(models)/properties.types';


interface Props {
  onChange: (data:Property["images"]) => void;
  images:Property["images"];
}

export default function ImageUploader({ onChange, images }: Props) {
  const handleRemove = (id:number | string) => {
    const newImages= images.filter(image=>image.id !== id)
    onChange(newImages)
  };

  return (
    <div className="p-4">
      
        <div className="flex flex-wrap gap-3 mt-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative border-1 border-round surface-border overflow-hidden"
              style={{ width: '8rem', height: '8rem' }}
            > 
              <Image
                src={img.file}
                alt={img.title ?? `Preview ${img.id}`}
                imageStyle={{ width: '100%', height: '100%', objectFit: 'cover', cursor:'pointer' }}
                onClick={()=>{window.open(img.file, 'no-blank', 'no-refer')}}
              />
              <Button
                icon="pi pi-times"
                className="absolute top-0 right-0 m-1 p-button-sm p-button-rounded p-button-danger"
                onClick={() => handleRemove( img.id)}
                tooltip="حذف"
              />
            </div>
          ))}
        </div>
    </div>
  );
}
