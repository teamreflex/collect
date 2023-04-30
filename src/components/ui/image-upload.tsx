'use client'

import { useState, type ChangeEvent } from "react";
import { Input } from "./input";
import { api } from "~/lib/api/client";
import { v4 } from "uuid"
import { useToast } from "~/hooks/use-toast";
import { CheckCircle2, CircleEllipsis, Loader2 } from "lucide-react";

type ImageUploadProps = {
  folder: string;
  onImageUploaded: (event: string) => void;
}

export default function ImageUpload({ folder, onImageUploaded }: ImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const rootUrl = process.env.NEXT_PUBLIC_R2_URL as string;
  let file: File | null | undefined;

  const { mutate: getSignedUrl } = api.files.getSignedUrl.useMutation({
    onSuccess(url, newData) {
      uploadImage(url).then((success) => {
        if (success) {
          setUploaded(true);
          onImageUploaded(`${rootUrl}/${newData.filename}`)
          toast({
            description: 'Image uploaded',
          });
        }
        setUploading(false);
      }).catch(() => {
        setUploading(false);
        toast({
          variant: 'destructive',
          description: 'Failed to upload image',
        });
      })
    },
  });

  function startUpload(event: ChangeEvent<HTMLInputElement>) {
    setUploading(true);

    const files = event.currentTarget.files;
    file = files?.item(0);
    if (files === null || files.length === 0 || !file) return;

    const originalFilename = file.name
    if (!originalFilename) return;

    const extension = originalFilename.split('.').pop() ?? 'jpg';
    const uuid = v4();
    getSignedUrl({ filename: `${folder}/${uuid}.${extension}` })
  }

  async function uploadImage(signedUrl: string) {
    if (!file) return;

    const res = await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    })

    return res.ok;
  }

  return (
    <div className="flex flex-row gap-2">
      <Input type="file" id="upload" placeholder="Upload an image..." onChange={startUpload} disabled={uploading} />
      <div className="flex items-center">
        {(!uploaded && !uploading) && <CircleEllipsis />}
        {uploading && <Loader2 className="animate-spin" />}
        {uploaded && <CheckCircle2 />}
      </div>

      <Input className="hidden" type="text" id="image" placeholder="Upload an image..." />
    </div>
  )
}