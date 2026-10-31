import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { TopNav } from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { me } from "@/lib/dummy";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({ component: Profile });
const PROFILE_KEY = "yuvro-profile-overrides";
const GITHUB_KEY = "yuvro-github-connected";
const tabs = ["Personal info", "Education", "Employment", "Resume", "Connections", "Security"] as const;
type Tab = typeof tabs[number];
type Personal = { name: string; handle: string; email: string; phone: string; loc: string; web: string; about: string };
type Entry = { id: number; [key: string]: string | number };
const blank: Personal = { name: "", handle: "", email: "", phone: "", loc: "", web: "", about: "" };
const configs = {
  Education: { subtitle: "Add your college, school or any course you have completed.", add: "Add education", empty: "No education added yet.", fields: [["school", "School or college", "e.g. JNTU Hyderabad", true], ["degree", "Degree", "e.g. B.Tech", false], ["field", "Field of study", "e.g. Computer Science", false], ["start", "Start year", "2022", false], ["end", "End year (or expected)", "2026", false]] },
  Employment: { subtitle: "Internships and jobs, if you have any. Freshers can skip this.", add: "Add experience", empty: "No experience added. That’s completely fine.", fields: [["company", "Company", "e.g. Acme Labs", true], ["role", "Role", "e.g. Backend Intern", true], ["start", "From", "Jun 2025", false], ["end", "To", "Present", false]] },
} as const;

function Profile() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("Personal info");
  const [personal, setPersonal] = useState<Personal>(blank);
  const [saved, setSaved] = useState<Personal>(blank);
  const [photo, setPhoto] = useState<string>();
  const photoInput = useRef<HTMLInputElement>(null);
  const resumeInput = useRef<HTMLInputElement>(null);
  const [resume, setResume] = useState<File>();
  const [dragging, setDragging] = useState(false);
  const [education, setEducation] = useState<Entry[]>([]);
  const [employment, setEmployment] = useState<Entry[]>([]);
  const [adding, setAdding] = useState(false);
  const [entry, setEntry] = useState<Record<string, string>>({});
  const [connections, setConnections] = useState({ github: "", linkedin: "" });
  const [connecting, setConnecting] = useState<"github" | "linkedin" | null>(null);
  const [username, setUsername] = useState("");
  const [notice, setNotice] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    let overrides: Partial<Personal> = {};
    try { overrides = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); } catch { /* Use account defaults. */ }
    const next = { ...blank, name: user?.name ?? me.name, handle: me.handle, email: user?.email ?? "", ...overrides };
    setPersonal(next); setSaved(next);
    try {
      const github = JSON.parse(localStorage.getItem(GITHUB_KEY) || "{}");
      if (github.connected) setConnections(c => ({ ...c, github: github.handle || "" }));
    } catch { /* No linked profile. */ }
  }, [user]);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(""), 4000); return () => window.clearTimeout(timer); }, [notice]);
  useEffect(() => { if (!photo) return; return () => URL.revokeObjectURL(photo); }, [photo]);

  function uploadResume(file?: File) {
    if (!file) return;
    if (!/\.(pdf|docx?)$/i.test(file.name)) { setNotice("Choose a PDF, DOC or DOCX file."); return; }
    if (file.size > 5 * 1024 * 1024) { setNotice("Choose a file under 5 MB."); return; }
    setResume(file); setNotice("Resume selected for this visit.");
  }
  const isList = tab === "Education" || tab === "Employment";
  const config = isList ? configs[tab] : null;
  const entries = tab === "Education" ? education : employment;
  const setEntries = tab === "Education" ? setEducation : setEmployment;
  const inputClass = "h-10 border-0 bg-muted shadow-none text-sm";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="mx-auto w-full max-w-[1040px] px-5 py-8 sm:px-8 sm:py-10">
        <header className="flex items-center gap-5 rounded-lg bg-accent/60 px-6 py-7 sm:gap-7 sm:px-8">
          <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-3xl font-medium text-primary-foreground sm:size-24">
            {photo ? <img src={photo} alt="Profile photo" className="size-full object-cover" /> : (personal.name.trim()[0] || "?").toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-medium">{personal.name || "Your name"}</h1>
            <Button variant="link" className="mt-1 h-auto p-0 text-sm" onClick={() => photoInput.current?.click()}>Change photo</Button>
            <input ref={photoInput} type="file" accept="image/*" aria-label="Choose profile photo" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) setNotice("Choose an image under 2 MB.");
                else { setPhoto(URL.createObjectURL(file)); setNotice("Photo preview updated for this visit."); }
              }
              e.target.value = "";
            }} />
          </div>
        </header>
        <div className="mt-8 grid items-start gap-7 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10">
          <nav aria-label="Profile sections" className="flex gap-1 overflow-x-auto md:flex-col">
            {tabs.map(item => <Button key={item} variant="ghost" aria-current={tab === item ? "page" : undefined} className={`h-10 justify-start px-4 text-sm ${tab === item ? "bg-accent text-primary" : "text-muted-foreground"}`} onClick={() => { setTab(item); setAdding(false); setEntry({}); setConnecting(null); }}>{item}</Button>)}
          </nav>
          <section className="min-w-0 rounded-lg bg-card p-6 sm:p-8" aria-label={tab}>
            {tab === "Personal info" && <>
              <Heading title="Personal information" subtitle="Fields marked * are required." />
              <form onSubmit={e => {
                e.preventDefault();
                try { localStorage.setItem(PROFILE_KEY, JSON.stringify(personal)); setSaved({ ...personal }); setNotice("Profile changes saved in this browser."); }
                catch { setNotice("Changes could not be saved in this browser."); }
              }}>
                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  {([
                    ["name", "Full name", "Your full name", "text", true], ["handle", "Handle", "handle", "text", false],
                    ["email", "Email", "you@college.edu", "email", true], ["phone", "Phone", "+91 98765 43210", "tel", true],
                    ["loc", "Location", "City, Country", "text", false], ["web", "Website", "yourname.dev", "text", false],
                  ] as const).map(([key, label, placeholder, type, required]) => <Field key={key} label={label} required={required}>
                    <Input className={inputClass} type={type} required={required} placeholder={placeholder} value={personal[key]} onChange={e => setPersonal(p => ({ ...p, [key]: e.target.value }))} />
                  </Field>)}
                  <Field label="About you" className="sm:col-span-2"><Textarea className="min-h-28 border-0 bg-muted shadow-none text-sm" placeholder="A line or two about what you are learning and building." value={personal.about} onChange={e => setPersonal(p => ({ ...p, about: e.target.value }))} /></Field>
                </div>
                <div className="mt-6 flex justify-end"><Button type="submit" disabled={JSON.stringify(saved) === JSON.stringify(personal)}>Save changes</Button></div>
              </form>
            </>}
            {config && <>
              <Heading title={tab} subtitle={config.subtitle} optional={tab === "Employment"} />
              {entries.length ? <div className="mb-5 divide-y divide-border">{entries.map(item => <div key={item.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0"><h3 className="break-words text-sm font-medium">{tab === "Education" ? item.school : item.role}</h3><p className="mt-1 text-xs text-muted-foreground">{[tab === "Education" ? [item.degree, item.field].filter(Boolean).join(", ") : item.company, [item.start, item.end].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}</p></div>
                <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground" onClick={() => setEntries(items => items.filter(x => x.id !== item.id))}>Remove</Button>
              </div>)}</div> : <p className="mb-5 text-sm text-muted-foreground">{config.empty}</p>}
              {adding ? <form onSubmit={e => { e.preventDefault(); setEntries(items => [...items, { ...entry, id: Date.now() }]); setAdding(false); setEntry({}); setNotice("Entry added for this visit."); }} className="border-t border-border pt-5">
                <div className="grid gap-5 sm:grid-cols-2">{config.fields.map(([key, label, placeholder, required]) => <Field key={key} label={label} required={required} className={key === "school" ? "sm:col-span-2" : ""}><Input required={required} className={inputClass} placeholder={placeholder} value={entry[key] || ""} onChange={e => setEntry(v => ({ ...v, [key]: e.target.value }))} /></Field>)}</div>
                <div className="mt-5 flex gap-5"><Button variant="link" type="submit" className="h-auto p-0">Add</Button><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={() => setAdding(false)}>Cancel</Button></div>
              </form> : <Button variant="link" className="h-auto p-0" onClick={() => setAdding(true)}>+ {config.add}</Button>}
            </>}
            {tab === "Resume" && <>
              <Heading title="Resume" subtitle="Upload a PDF or Word file. You can replace it any time." />
              <input ref={resumeInput} type="file" accept=".pdf,.doc,.docx" aria-label="Choose resume" className="hidden" onChange={e => { uploadResume(e.target.files?.[0]); e.target.value = ""; }} />
              {resume ? <div className="flex flex-wrap items-center gap-4 rounded-lg bg-muted p-5"><div className="min-w-0 flex-1"><p className="break-words text-sm font-medium">{resume.name}</p><p className="mt-1 text-xs text-muted-foreground">{Math.max(1, Math.round(resume.size / 1024))} KB · {resume.name.split(".").pop()?.toUpperCase()}</p></div><Button variant="link" className="h-auto p-0" onClick={() => resumeInput.current?.click()}>Replace</Button><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={() => setResume(undefined)}>Remove</Button></div> :
                <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); uploadResume(e.dataTransfer.files[0]); }} className={`flex flex-col items-center gap-2 rounded-lg border border-dashed px-5 py-10 text-center ${dragging ? "border-primary bg-accent" : "border-border bg-muted/60"}`}>
                  <h3 className="text-sm font-medium">No resume yet</h3><p className="text-xs text-muted-foreground">Drag a file here, or pick one from your device.</p><Button variant="link" className="mt-1 h-auto p-0" onClick={() => resumeInput.current?.click()}>Upload resume</Button>
                </div>}
            </>}
            {tab === "Connections" && <>
              <Heading title="Connections" subtitle="Add your account links so your work shows up on your profile." />
              <div className="divide-y divide-border">{(["github", "linkedin"] as const).map(key => {
                const title = key === "github" ? "GitHub" : "LinkedIn";
                const base = key === "github" ? "github.com/" : "linkedin.com/in/";
                return <div key={key} className="flex flex-wrap items-start justify-between gap-4 py-5"><div className="min-w-0 flex-1"><h3 className="text-sm font-medium">{title}</h3><p className="mt-1 break-all text-xs text-muted-foreground">{connections[key] ? <a className="text-primary hover:underline" href={`https://${base}${encodeURIComponent(connections[key])}`} target="_blank" rel="noopener noreferrer">{base}{connections[key]}</a> : key === "github" ? "Show your repositories and commits." : "Add your professional profile."}</p>
                  {connecting === key && <form className="mt-4 flex flex-wrap gap-3" onSubmit={e => { e.preventDefault(); const value = username.trim().replace(/^@/, ""); if (!value) return; setConnections(c => ({ ...c, [key]: value })); if (key === "github") { try { localStorage.setItem(GITHUB_KEY, JSON.stringify({ connected: true, handle: value })); } catch { /* Browser storage unavailable. */ } } setConnecting(null); setNotice(`${title} profile link added; account verification is not connected.`); }}><Input className={`${inputClass} min-w-0 flex-1`} aria-label={`${title} username`} required value={username} onChange={e => setUsername(e.target.value)} placeholder={`Your ${title} username`} /><Button variant="link" className="px-0" type="submit">Link</Button><Button variant="link" className="px-0 text-muted-foreground" onClick={() => setConnecting(null)}>Cancel</Button></form>}
                </div>{connections[key] ? <Button variant="link" className="h-auto p-0 text-destructive" onClick={() => { setConnections(c => ({ ...c, [key]: "" })); if (key === "github") localStorage.removeItem(GITHUB_KEY); }}>Disconnect</Button> : connecting !== key && <Button variant="link" className="h-auto p-0" onClick={() => { setConnecting(key); setUsername(""); }}>Connect</Button>}</div>;
              })}</div>
            </>}
            {tab === "Security" && <>
              <Heading title="Security" subtitle="Keep your account safe." />
              <div className="flex items-start justify-between gap-4 py-3"><div><h3 className="text-sm font-medium">Password</h3><p className="mt-1 text-xs text-muted-foreground">Use a strong password you don’t reuse elsewhere.</p></div><Button variant="link" className="h-auto whitespace-normal p-0 text-right" onClick={() => setPasswordOpen(v => !v)}>{passwordOpen ? "Cancel" : "Change password"}</Button></div>
              {passwordOpen && <div className="mt-4 border-t border-border pt-5"><div className="grid gap-5 sm:grid-cols-2"><Field label="Current password" className="sm:col-span-2"><Input className={inputClass} type="password" autoComplete="current-password" /></Field><Field label="New password"><Input className={inputClass} type="password" autoComplete="new-password" /></Field><Field label="Confirm new password"><Input className={inputClass} type="password" autoComplete="new-password" /></Field></div><p className="mt-4 text-xs text-muted-foreground">Password updates aren’t available for the current demo account.</p><Button className="mt-4" disabled>Update password</Button></div>}
              <div className="mt-7 border-t border-border pt-6"><h3 className="text-sm font-medium">Where you’re logged in</h3><p className="mt-2 text-xs text-muted-foreground">Device sessions aren’t available for the current demo account.</p></div>
              <div className="mt-7 flex items-start justify-between gap-4 border-t border-border pt-6"><div><h3 className="text-sm font-medium">Delete account</h3><p className="mt-1 text-xs text-muted-foreground">Account deletion isn’t available for the current demo account.</p></div><Button variant="link" className="h-auto p-0 text-destructive" disabled>Delete account</Button></div>
            </>}
          </section>
        </div>
      </main>
      {notice && <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 z-50 w-max max-w-[90vw] -translate-x-1/2 rounded-lg border border-border bg-card px-5 py-3 text-center text-sm text-foreground shadow-lg">{notice}</div>}
    </div>
  );
}
function Heading({ title, subtitle, optional }: { title: string; subtitle: string; optional?: boolean }) {
  return <div className="mb-6"><h2 className="flex items-center gap-3 text-xl font-medium">{title}{optional && <span className="text-xs font-normal text-muted-foreground">Optional</span>}</h2><p className="mt-2 text-sm text-muted-foreground">{subtitle}</p></div>;
}
function Field({ label, required, children, className = "" }: { label: string; required?: boolean; children: ReactNode; className?: string }) {
  return <label className={`block min-w-0 ${className}`}><span className="mb-2 block text-xs font-medium text-muted-foreground">{label}{required && <span className="text-destructive"> *</span>}</span>{children}</label>;
}
