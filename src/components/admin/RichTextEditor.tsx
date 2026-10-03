import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { uploadContentImage } from "./ImageUpload";

type Command = { icon: typeof Bold; label: string; run: () => void };

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (command: string, argument?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, argument);
    onChange(ref.current?.innerHTML ?? "");
  };

  const insertImage = async (file: File | undefined) => {
    if (!file) return;
    try {
      const url = await uploadContentImage(file);
      exec("insertHTML", `<figure><img src="${url}" alt="" /></figure>`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const commands: Command[] = [
    { icon: Bold, label: "Bold", run: () => exec("bold") },
    { icon: Italic, label: "Italic", run: () => exec("italic") },
    { icon: Heading2, label: "Heading 2", run: () => exec("formatBlock", "<h2>") },
    { icon: Heading3, label: "Heading 3", run: () => exec("formatBlock", "<h3>") },
    { icon: List, label: "Bulleted list", run: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered list", run: () => exec("insertOrderedList") },
    { icon: Quote, label: "Quote", run: () => exec("formatBlock", "<blockquote>") },
    {
      icon: Link2,
      label: "Link",
      run: () => {
        const url = window.prompt("Link URL");
        if (url && /^https?:\/\//i.test(url)) exec("createLink", url);
      },
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted px-2 py-2">
        {commands.map((command) => (
          <button
            key={command.label}
            type="button"
            title={command.label}
            aria-label={command.label}
            onClick={command.run}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-primary-dark"
          >
            <command.icon className="size-4" />
          </button>
        ))}
        <label
          title="Insert image"
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-primary-dark"
        >
          <ImagePlus className="size-4" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => insertImage(e.target.files?.[0])}
          />
        </label>
      </div>
      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Article content"
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="prose-article min-h-[24rem] max-w-none px-5 py-4 focus:outline-none"
      />
    </div>
  );
}
