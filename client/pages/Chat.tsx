import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Bot, Loader2, Trash2, Volume2, VolumeX, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatMessage, ChatResponse } from "@shared/api";

export default function Chat() {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(true);
  const [voiceStart, setVoiceStart] = useState<number | null>(null);
  const [voiceElapsed, setVoiceElapsed] = useState(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<string>("");
  const pendingSendRef = useRef<boolean>(false);
  const keepAliveRef = useRef<boolean>(false);
  const isRecognizingRef = useRef<boolean>(false);
  const voiceStartRef = useRef<number | null>(null);
  const sessionTranscriptRef = useRef<string>("");
  const hasAudioDetectedRef = useRef<boolean>(false);

  const recognition = useMemo(() => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    // We'll set r.lang dynamically before starting
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;
    return r as SpeechRecognition;
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I’m your Krishak Setu assistant. Ask me about soil analysis, pH, NPK, crop recommendations, or how to use the app.",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    if (!recognition) return;
    const onResult = (e: any) => {
      // Mark that we detected audio as soon as we get any result
      if (e.results && e.results.length > 0) {
        hasAudioDetectedRef.current = true;
      }

      // Accumulate only final results; show interim appended to finals
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const txt = (res[0]?.transcript || "").trim();
        if (!txt) continue;
        if (res.isFinal) {
          sessionTranscriptRef.current += (sessionTranscriptRef.current ? " " : "") + txt;
          hasAudioDetectedRef.current = true;
        } else {
          interim = txt; // keep last interim chunk
          if (txt) hasAudioDetectedRef.current = true;
        }
      }
      const display = sessionTranscriptRef.current + (interim ? (sessionTranscriptRef.current ? " " : "") + interim : "");
      setInput(display);
    };
    const onStart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      if (voiceStartRef.current == null) voiceStartRef.current = Date.now();
      setVoiceStart((prev) => prev ?? voiceStartRef.current);
      if (!timerRef.current) {
        timerRef.current = window.setInterval(() => {
          setVoiceElapsed(() => {
            if (voiceStartRef.current == null) return 0;
            return Math.max(0, Math.floor((Date.now() - voiceStartRef.current) / 1000));
          });
        }, 500);
      }
    };
    const onEnd = () => {
      isRecognizingRef.current = false;
      const hadPending = pendingSendRef.current;
      const finalText = (sessionTranscriptRef.current || inputRef.current).trim();

      // Only restart if keepAlive is on and we're not trying to send
      if (keepAliveRef.current && !hadPending) {
        try {
          if (!isRecognizingRef.current) {
            hasAudioDetectedRef.current = false;
            recognition.start();
            return;
          }
        } catch {
          // fall through to cleanup
        }
      }

      setListening(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      pendingSendRef.current = false;
      setVoiceStart(null);
      voiceStartRef.current = null;
      setVoiceElapsed(0);

      if (hadPending) {
        // If we have text (either from transcript or user input), always send it
        if (finalText) {
          sendMessage(finalText);
        } else {
          // Only show "no audio" error if we truly didn't detect any audio
          // and the user explicitly tried to send (hadPending was true)
          toast({
            title: "No audio detected",
            description: "Please speak into the microphone and try again."
          });
        }
      }
      hasAudioDetectedRef.current = false;
    };
    const onError = (e: any) => {
      isRecognizingRef.current = false;
      const err = e?.error || e?.name;
      if (err === "not-allowed" || err === "service-not-allowed") {
        keepAliveRef.current = false;
        pendingSendRef.current = false;
        setListening(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        toast({ title: "Microphone blocked", description: "Please allow microphone access in your browser settings." });
        return;
      }
      if (err === "no-speech") {
        if (keepAliveRef.current) {
          try {
            setTimeout(() => {
              if (!isRecognizingRef.current) {
                hasAudioDetectedRef.current = false;
                recognition.start();
              }
            }, 300);
          } catch {}
        }
        return;
      }
      if (keepAliveRef.current) {
        try {
          setTimeout(() => {
            if (!isRecognizingRef.current) {
              hasAudioDetectedRef.current = false;
              recognition.start();
            }
          }, 300);
        } catch {}
      }
    };
    recognition.addEventListener("result", onResult);
    recognition.addEventListener("start", onStart);
    recognition.addEventListener("end", onEnd);
    recognition.addEventListener("error", onError);
    return () => {
      recognition.removeEventListener("result", onResult);
      recognition.removeEventListener("start", onStart);
      recognition.removeEventListener("end", onEnd);
      recognition.removeEventListener("error", onError);
    };
  }, [recognition, voiceStart]);

  function isHindiText(t: string) {
    return /[\u0900-\u097F]/.test(t) || /(kya|kyu|kyon|hai|nahi|kaise|kr|krna|aap|mera|tum|samay|mitti|kheti)/i.test(t);
  }

  function currentVoiceLang(preview?: string) {
    const lang = i18n?.language || "en";
    if (preview && isHindiText(preview)) return "hi-IN";
    if (lang?.startsWith("hi")) return "hi-IN";
    return "en-IN";
  }

  function speak(text: string) {
    if (!speaking) return;
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = currentVoiceLang(text);
    u.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  async function sendMessage(fromSuggestion?: string) {
    const content = (fromSuggestion ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const next: ChatMessage = { role: "user", content };
    const thread = [...messages, next];
    setMessages(thread);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: thread }),
      });
      const data = (await res.json()) as ChatResponse;
      const reply: ChatMessage = { role: "assistant", content: data.reply || "" };
      setMessages((m) => [...m, reply]);
      speak(reply.content);
    } catch (e) {
      toast({ title: "Error", description: "Failed to get reply. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  function startListening() {
    if (!recognition) {
      toast({ title: "Voice not supported", description: "Your browser doesn't support speech recognition." });
      return;
    }
    if (isRecognizingRef.current) return;
    try {
      window.speechSynthesis?.cancel();
      keepAliveRef.current = true;
      voiceStartRef.current = Date.now();
      sessionTranscriptRef.current = "";
      hasAudioDetectedRef.current = false;
      setInput("");
      // Set recognition language dynamically (Hindi if UI is Hindi)
      recognition.lang = currentVoiceLang();
      recognition.start();
      isRecognizingRef.current = true;
    } catch (err) {
      isRecognizingRef.current = false;
      setListening(false);
    }
  }

  function stopListening() {
    if (!recognition) return;
    try {
      keepAliveRef.current = false;
      pendingSendRef.current = true;
      recognition.stop();
    } finally {
      // actual send happens in onEnd to capture final transcript
    }
  }

  function toggleListening() {
    if (!recognition) {
      toast({ title: "Voice not supported", description: "Your browser doesn't support speech recognition." });
      return;
    }
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function formatTime(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function clearChat() {
    window.speechSynthesis?.cancel();
    setMessages([
      {
        role: "assistant",
        content:
          "Cleared the conversation. How can I help you now? You can ask about soil testing, pH, NPK, or crop planning.",
      },
    ]);
  }

  const suggestions = [
    "How do I upload a soil report?",
    "Best crops for acidic soil?",
    "What does soil pH mean?",
    "Suggest a fertilizer plan for low Nitrogen",
  ];

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-gradient-to-b from-emerald-50/20 via-background to-background dark:from-emerald-950/10 dark:via-background dark:to-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-background/80 backdrop-blur-sm p-4">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight">Krishak Assistant</h1>
                  <p className="text-xs text-muted-foreground">AI-powered farming guidance</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={speaking ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSpeaking((s) => !s)}
                  aria-pressed={speaking}
                  className="gap-2"
                >
                  {speaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span className="hidden sm:inline">{speaking ? "TTS On" : "TTS Off"}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={clearChat} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {messages.length <= 1 && (
          <div className="container mx-auto max-w-3xl px-4 py-6">
            <Card className="border-2 border-emerald-200/50 dark:border-emerald-800/30 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  <p className="font-medium text-foreground">Try asking about:</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left p-3 rounded-lg bg-white dark:bg-background border border-emerald-200/50 dark:border-emerald-800/30 hover:border-emerald-500/50 hover:shadow-md transition-all text-sm font-medium text-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-3xl px-4 py-6">
            <ul className="space-y-4">
              {messages.map((m, i) => (
                <li key={i} className="flex items-end gap-3 animate-in fade-in slide-in-from-bottom-2">
                  {m.role === "assistant" ? (
                    <>
                      <Avatar className="h-9 w-9 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600">
                        <AvatarFallback className="text-white text-xs font-bold">AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 max-w-xl lg:max-w-2xl">
                        <div className="rounded-2xl rounded-tl-sm bg-muted px-5 py-3 text-sm leading-relaxed shadow-sm">
                          {m.content}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 max-w-xl lg:max-w-2xl flex justify-end">
                        <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-emerald-600 to-teal-600 text-primary-foreground px-5 py-3 text-sm leading-relaxed shadow-md">
                          {m.content}
                        </div>
                      </div>
                      <Avatar className="h-9 w-9 flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-600">
                        <AvatarFallback className="text-white text-xs font-bold">You</AvatarFallback>
                      </Avatar>
                    </>
                  )}
                </li>
              ))}

              {loading && (
                <li className="flex items-end gap-3">
                  <Avatar className="h-9 w-9 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600">
                    <AvatarFallback className="text-white text-xs font-bold">AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl rounded-tl-sm bg-muted px-5 py-3 flex items-center gap-2 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </li>
              )}

              {listening && (
                <li className="flex items-end gap-3">
                  <Avatar className="h-9 w-9 flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-600">
                    <AvatarFallback className="text-white text-xs font-bold">You</AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl rounded-tr-sm bg-secondary px-5 py-3 flex items-center gap-2 shadow-sm">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
                    </span>
                    <span className="text-sm text-foreground">Listening...</span>
                  </div>
                </li>
              )}
            </ul>
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      <div className="border-t bg-background/80 backdrop-blur-sm p-4 shrink-0">
        <div className="container mx-auto max-w-3xl">
          <div className="flex flex-col gap-3">
            {listening && (
              <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                  <span className="relative inline-flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                  </span>
                  Recording — {formatTime(voiceElapsed)}
                </span>
              </div>
            )}
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? "Recording..." : "Type your message or use the mic..."}
                className="min-h-12 max-h-32 flex-1 resize-none rounded-lg border-2 border-emerald-200/50 dark:border-emerald-800/30 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                disabled={listening}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !listening) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                type="button"
                size="icon"
                className={`h-12 w-12 rounded-lg flex-shrink-0 transition-all ${listening ? "bg-red-600 hover:bg-red-700 text-white shadow-lg" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"}`}
                aria-label={listening ? `Stop recording (${formatTime(voiceElapsed)})` : "Start voice input"}
                aria-pressed={listening}
                onClick={toggleListening}
                title={listening ? `Stop recording (${formatTime(voiceElapsed)})` : "Start voice input"}
              >
                <Mic className={`h-5 w-5 ${listening ? "animate-pulse" : ""}`} />
              </Button>
              <Button
                onClick={() => sendMessage()}
                aria-label="Send message"
                disabled={loading || listening || !input.trim()}
                className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex-shrink-0 shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span className="hidden sm:inline ml-2">Send</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
