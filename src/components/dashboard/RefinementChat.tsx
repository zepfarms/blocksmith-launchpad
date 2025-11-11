import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: string;
  content: string;
}

interface RefinementChatProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: Message[];
  onSendFeedback: (feedback: string) => void;
  isGenerating: boolean;
}

export function RefinementChat({
  isOpen,
  onToggle,
  messages,
  onSendFeedback,
  isGenerating
}: RefinementChatProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !isGenerating) {
      onSendFeedback(input.trim());
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass-card border border-white/20 rounded-t-3xl overflow-hidden">
          {/* Collapsed Header */}
          <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-xl">💬</span>
              <span className="font-medium">
                Don't like these? Tell AI what to change
              </span>
            </div>
            {isOpen ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {/* Expanded Chat */}
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden",
              isOpen ? "max-h-[400px]" : "max-h-0"
            )}
          >
            <div className="border-t border-white/10 p-6 space-y-4">
              {/* Messages */}
              <div className="space-y-3 max-h-[240px] overflow-y-auto">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-3",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] px-4 py-3 rounded-2xl",
                        msg.role === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/10 text-foreground"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex gap-3">
                    <div className="bg-white/10 px-4 py-3 rounded-2xl flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <p className="text-sm text-foreground">Generating new logos...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="What would you like to change?"
                  disabled={isGenerating}
                  className="flex-1 bg-background/50 border-white/20"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isGenerating}
                  size="icon"
                  className="rounded-full"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}