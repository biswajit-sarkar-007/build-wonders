import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface Props {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export default function ImageUploadZone({ onImageSelect, selectedImage, onClear }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return;
    onImageSelect(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClear = () => {
    onClear();
    setPreview(null);
  };

  if (selectedImage && preview) {
    return (
      <div className="relative group rounded-xl overflow-hidden border border-border shadow-card bg-card">
        <img src={preview} alt="Uploaded" className="w-full max-h-80 object-contain bg-muted/30" />
        <button
          onClick={handleClear}
          className="absolute top-3 right-3 p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border 
            text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-card to-transparent">
          <p className="text-sm text-muted-foreground truncate">{selectedImage.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
        ${isDragging
          ? "border-accent bg-accent/5 scale-[1.02]"
          : "border-border hover:border-muted-foreground bg-card/50"
        }`}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleFile(file);
        };
        input.click();
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className={`p-4 rounded-2xl transition-colors ${isDragging ? "bg-accent/10" : "bg-muted"}`}>
          {isDragging ? (
            <ImageIcon className="w-8 h-8 text-accent" />
          ) : (
            <Upload className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">
            {isDragging ? "Drop your image here" : "Drop an image or click to upload"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            JPG, PNG, WEBP, SVG • Max 10MB
          </p>
        </div>
      </div>
    </div>
  );
}
