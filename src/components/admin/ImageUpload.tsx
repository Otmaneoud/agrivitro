import { ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const MAX_BYTES = 8 * 1024 * 1024;

export async function uploadContentImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed");
  if (file.size > MAX_BYTES) throw new Error("Image must be smaller than 8 MB");
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("content").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  return `/api/public/media/${path}`;
}

export function ImageUpload({
  value,
  onChange,
  label = "Cover image",
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadContentImage(file));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-sm font-medium text-ink">{label}</p>
      {value ? (
        <div className="relative mt-2 overflow-hidden rounded-2xl border border-border">
          <img src={value} alt="" className="h-44 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove image"
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/90 text-ink"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label className="mt-2 flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <ImagePlus className="size-6" />
          {busy ? "Uploading…" : "Click to upload an image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}
      <div className="mt-2 flex gap-2">
        <Input
          value={value ?? ""}
          placeholder="or paste an image URL / path"
          onChange={(e) => onChange(e.target.value || null)}
        />
        {value ? (
          <Button type="button" variant="outline" onClick={() => onChange(null)}>
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
