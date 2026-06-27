import { PageShell } from "@/components/page-shell";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Receipt,
  ArrowUpRight,
  LineChart,
  Paperclip,
  Mic,
  Square,
  X,
  FileText,
  ImageIcon,
  AudioLines,
} from "lucide-react";


type Attachment = {
  id: string;
  name: string;
  kind: "image" | "audio" | "file";
  size: number;
  url: string;
};

type Msg = {
  id: number;
  who: "you" | "paygpt";
  text: string;
  attachments?: Attachment[];
};

const seed: Msg[] = [
  {
    id: 1,
    who: "paygpt",
    text: "Hi 👋 I'm PayGPT. Ask me to send a payment, draft an invoice, or analyse your spending. You can also attach a file or record a voice note.",
  },
];

const suggestions = [
  { icon: Receipt, text: "Draft an invoice for $2,500 to Mercer & Bell, due in 14 days." },
  { icon: ArrowUpRight, text: "Pay rent of $3,200 to Atlas Properties on the 1st of every month." },
  { icon: LineChart, text: "What were our top 5 expenses last month?" },
  { icon: Sparkles, text: "Summarise this week's incoming payments." },
];

function kindFromMime(type: string): Attachment["kind"] {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("audio/")) return "audio";
  return "file";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ChatPage() {
  useEffect(() => { document.title = 'Assistant — PayGPT'; }, []);
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<Attachment[]>([]);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Attachment[] = Array.from(files).map((f) => ({
      id: `${Date.now()}-${f.name}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      kind: kindFromMime(f.type),
      size: f.size,
      url: URL.createObjectURL(f),
    }));
    setPending((p) => [...p, ...next]);
  };

  const removePending = (id: string) => {
    setPending((p) => {
      const a = p.find((x) => x.id === id);
      if (a) URL.revokeObjectURL(a.url);
      return p.filter((x) => x.id !== id);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setPending((p) => [
          ...p,
          {
            id: `${Date.now()}-rec`,
            name: `Voice note ${new Date().toLocaleTimeString()}.webm`,
            kind: "audio",
            size: blob.size,
            url,
          },
        ]);
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch (err) {
      console.error(err);
      alert("Microphone access is needed to record a voice note.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t && pending.length === 0) return;
    const id = Date.now();
    const atts = pending;
    setMessages((m) => [...m, { id, who: "you", text: t, attachments: atts }]);
    setPending([]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: id + 1,
          who: "paygpt",
          text:
            atts.length > 0
              ? `Received ${atts.length} attachment${atts.length > 1 ? "s" : ""}. (Connect your backend to process them.)`
              : "Got it. (Connect your backend to enable real actions — this is a UI preview.)",
        },
      ]);
    }, 600);
  };

  return (
    <PageShell>
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col px-4 py-6">
        <div className="mb-4">
          <h1 className="text-3xl">Assistant</h1>
          <p className="text-sm text-muted-foreground">Your AI finance operator.</p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-border bg-card p-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.who === "you" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] space-y-2 rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.who === "you" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {m.text && <div>{m.text}</div>}
                {m.attachments && m.attachments.length > 0 && (
                  <div className="space-y-2">
                    {m.attachments.map((a) => (
                      <AttachmentPreview key={a.id} att={a} dark={m.who === "you"} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && pending.length === 0 && (
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {suggestions.map((s) => (
              <button
                key={s.text}
                onClick={() => send(s.text)}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <s.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{s.text}</span>
              </button>
            ))}
          </div>
        )}

        {pending.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-2">
            {pending.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-2 py-1.5 text-xs"
              >
                <KindIcon kind={a.kind} />
                <span className="max-w-[140px] truncate">{a.name}</span>
                <span className="text-muted-foreground">{formatSize(a.size)}</span>
                <button
                  onClick={() => removePending(a.id)}
                  className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
                  aria-label="Remove attachment"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-card p-2"
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,audio/*,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx"
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Attach file"
            title="Attach image, audio or document"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-2 text-sm transition-colors ${
              recording
                ? "bg-destructive/10 text-destructive hover:bg-destructive/15"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            aria-label={recording ? "Stop recording" : "Record voice"}
            title={recording ? "Stop recording" : "Record a voice note"}
          >
            {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {recording && (
              <span className="tabular-nums text-xs">
                {Math.floor(recordSeconds / 60)}:{String(recordSeconds % 60).padStart(2, "0")}
              </span>
            )}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={recording ? "Recording…" : "Ask PayGPT to do something…"}
            disabled={recording}
            className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            disabled={recording || (!input.trim() && pending.length === 0)}
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </div>
    </PageShell>
  );
}

function KindIcon({ kind }: { kind: Attachment["kind"] }) {
  if (kind === "image") return <ImageIcon className="h-3.5 w-3.5 text-primary" />;
  if (kind === "audio") return <AudioLines className="h-3.5 w-3.5 text-primary" />;
  return <FileText className="h-3.5 w-3.5 text-primary" />;
}

function AttachmentPreview({ att, dark }: { att: Attachment; dark: boolean }) {
  if (att.kind === "image") {
    return (
      <img
        src={att.url}
        alt={att.name}
        className="max-h-48 rounded-md border border-border/40 object-cover"
      />
    );
  }
  if (att.kind === "audio") {
    return <audio controls src={att.url} className="w-full max-w-xs" />;
  }
  return (
    <div
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
        dark ? "bg-primary-foreground/10" : "bg-background/60"
      }`}
    >
      <FileText className="h-3.5 w-3.5" />
      <span className="truncate">{att.name}</span>
      <span className="opacity-70">{formatSize(att.size)}</span>
    </div>
  );
}

export default ChatPage;
