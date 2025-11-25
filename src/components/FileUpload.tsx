import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  onSelected: (file: File | null) => void;
};

export const FileUpload = ({ label, onSelected }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("Nenhum arquivo selecionado");

  const handleSelect = (file: File | null) => {
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("Nenhum arquivo selecionado");
    }
    onSelected(file);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="pio-label mb-1">{label}</label>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="default"
          onClick={() => inputRef.current?.click()}
        >
          Selecionar arquivo
        </Button>

        <span className="text-sm text-muted-foreground truncate max-w-[250px]">
          {fileName}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          handleSelect(file);
        }}
      />
    </div>
  );
};
