import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  Mic,
  Paperclip,
  SendHorizonal,
  Smile,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function MessageComposer({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: (e?: React.FormEvent) => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <form onSubmit={onSend} className="flex items-end gap-2 p-3">
      <TooltipProvider>
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="shrink-0">
                <Paperclip className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="shrink-0">
                <ImageIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Photo</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        className="max-h-36 min-h-10 w-full resize-none rounded-lg bg-muted/40 px-3 py-2 text-sm shadow-sm focus-visible:ring-0"
      />

      <div className="flex items-center gap-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="shrink-0">
                <Smile className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Emoji</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="shrink-0">
                <Mic className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button type="submit" size="icon" disabled={!value.trim()} className="shrink-0">
          <SendHorizonal className="size-4" />
        </Button>
      </div>
    </form>
  );
}
