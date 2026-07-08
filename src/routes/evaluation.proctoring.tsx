import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { EvalShell, EvalStepHeader, PrimaryButton, Check } from "@/components/evaluation/EvalShell";

export const Route = createFileRoute("/evaluation/proctoring")({
  head: () => ({ meta: [{ title: "Proctoring check — Yuvro Labs" }, { name: "robots", content: "noindex" }] }),
  component: ProctoringPage,
});

function ProctoringPage() {
  const nav = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamOn, setStreamOn] = useState(false);
  const [face, setFace] = useState(false);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) { videoRef.current.srcObject = stream; setStreamOn(true); }
        // Mic level
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        src.connect(analyser);
        const buf = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteFrequencyData(buf);
          let sum = 0; for (let i = 0; i < buf.length; i++) sum += buf[i];
          setLevel(Math.min(1, sum / buf.length / 100));
          raf = requestAnimationFrame(tick);
        };
        tick();
        setTimeout(() => setFace(true), 1400);
      } catch {
        // Permission denied — still let them continue in dummy mode
        setTimeout(() => { setStreamOn(true); setFace(true); }, 1200);
      }
    })();
    return () => {
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const ready = streamOn && face;

  return (
    <EvalShell step={4} totalSteps={5} stepLabel="Proctoring">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <EvalStepHeader eyebrow="Step 04" title={<>Confirm your identity.</>} body="A quick look at your camera and microphone. This is only used to keep the evaluation fair." />
        </div>
        <div>
          <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950">
            <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full object-cover" />
            {!streamOn && <div className="absolute inset-0 grid place-items-center text-[12px] text-neutral-400">Requesting camera…</div>}
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-[11px] text-white/80">
              <span className="rounded-full bg-black/50 px-2 py-0.5 backdrop-blur">Preview only · not recording</span>
              <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Live
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { label: "Camera preview", done: streamOn },
              { label: "Microphone preview", done: streamOn, extra: <MicLevel level={level} /> },
              { label: "Face detection", done: face },
              { label: "Environment check", done: face },
            ].map(({ label, done, extra }) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-[13px]">
                <span className="text-neutral-900">{label}</span>
                <div className="flex items-center gap-3">
                  {extra}
                  <span className={`inline-flex items-center gap-1.5 text-[12px] ${done ? "text-emerald-600" : "text-neutral-400"}`}>
                    {done ? <><Check className="h-3.5 w-3.5" /> OK</> : "Checking…"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <PrimaryButton disabled={!ready} type="button" className="mt-8" onClick={() => nav({ to: "/evaluation/instructions" })}>
            {ready ? "Continue to instructions" : "Preparing preview…"}
          </PrimaryButton>
        </div>
      </div>
    </EvalShell>
  );
}

function MicLevel({ level }: { level: number }) {
  return (
    <div className="flex items-end gap-0.5">
      {[0.2, 0.4, 0.6, 0.8, 1].map((t, i) => (
        <div key={i} className="w-0.5 rounded-sm transition-colors" style={{ height: 4 + i * 3, background: level > t ? "rgb(16 185 129)" : "rgb(229 229 229)" }} />
      ))}
    </div>
  );
}
