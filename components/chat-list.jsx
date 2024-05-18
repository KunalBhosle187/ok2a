import { Separator } from "@/components/ui/separator";
import { User2Icon } from "lucide-react";

export function ChatList({ messages }) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index} className="pb-4">
          {message.display}
        </div>
      ))}
    </div>
  );
}
