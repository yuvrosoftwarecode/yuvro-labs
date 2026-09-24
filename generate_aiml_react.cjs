const fs = require('fs');

const fields = JSON.parse(fs.readFileSync('fields_aiml.json', 'utf8'));

fields.forEach(f => {
    f.label = f.label.replace(/\+' /g, '-> ');
    f.label = f.label.replace(/\?T/g, "'");
    if(f.options) {
        f.options = f.options.map(o => o.replace(/\?T/g, "'").replace(/\+' /g, '-> '));
    }
});

let fileContent = `import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ArrowLeft, User, GraduationCap, Code, MessageSquare, Check } from "lucide-react";

export const Route = createFileRoute("/careers/apply-aiml")({
  head: () => ({
    meta: [
      { title: "Apply — AI/ML Engineer Intern" },
    ],
  }),
  component: ApplyPage,
});

const STEPS = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Profiles & Resume", icon: User },
  { id: 3, title: "Academics", icon: GraduationCap },
  { id: 4, title: "Skills", icon: Code },
];

function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const GOOGLE_FORM_ACTION_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSff50BIHKBEgjYKFBpYhDLpD_7G-RkVzPLfae8k6XLnSjZMYw/formResponse";

  const handleNext = () => {
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll('input:not([type="hidden"]), select, textarea');
      let allValid = true;
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i] as HTMLInputElement;
        if (input.offsetParent !== null && !input.checkValidity()) {
          input.reportValidity();
          allValid = false;
          break;
        }
      }
      if (allValid) {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
          <Check className="h-8 w-8" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">Application Submitted</h1>
        <p className="mt-4 text-[15px] text-[#6B6B6B]">
          Thank you for applying to Yuvro Labs.
        </p>
        <Link to="/careers" className="mt-8 inline-flex items-center text-sm font-medium text-[#0A0A0A] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to open roles
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:py-16">
      <Link to="/careers" className="inline-flex items-center text-sm font-medium text-[#6B6B6B] hover:text-[#0A0A0A] mb-8 transition group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to open roles
      </Link>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl mb-3">Join Our Team</h1>
        <p className="text-[15px] text-[#6B6B6B]">
          Complete the application below for <span className="font-medium text-[#0A0A0A]">AI/ML Engineer Intern</span>
        </p>
      </div>

      <div className="mb-12">
        <div className="relative flex justify-between max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-[#E8E6E1]" aria-hidden="true" />
          <div className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-[#0A0A0A] transition-all duration-500 ease-in-out" style={{ width: \`\${((currentStep - 1) / (STEPS.length - 1)) * 100}%\` }} aria-hidden="true" />
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={\`flex h-12 w-12 items-center justify-center rounded-xl border-2 bg-white transition-all duration-300 shadow-sm \${isActive ? "border-[#0A0A0A] text-[#0A0A0A] scale-110" : isCompleted ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#E8E6E1] text-[#A3A3A3]"}\`}>
                  {isCompleted ? <Check className="h-5 w-5" strokeWidth={2.5} /> : <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />}
                </div>
                <div className={\`absolute -bottom-8 w-28 text-center text-[13px] font-medium transition-colors duration-300 \${isActive || isCompleted ? "text-[#0A0A0A]" : "text-[#A3A3A3]"}\`}>
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-20 rounded-2xl border border-[#E8E6E1] bg-white p-6 sm:p-10 shadow-sm overflow-hidden">
        <form ref={formRef} onSubmit={handleSubmit}>
`;

const renderFields = (fieldsSubset, step) => {
    let out = `<div className={currentStep === ${step} ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>\n<div className="space-y-6">`;
    fieldsSubset.forEach(f => {
        out += `<Field label={\`${f.label} *\`}>\n`;
        if (f.type === 'textarea') {
            out += `<textarea required={currentStep === ${step}} name="${f.id}" rows={4} className="input-field resize-y" placeholder="Your answer"></textarea>\n`;
        } else if (f.type === 'select') {
            out += `<select required={currentStep === ${step}} name="${f.id}" className="input-field bg-white cursor-pointer">\n`;
            out += `<option value="">Select an option</option>\n`;
            f.options.forEach(opt => {
                out += `<option value="${opt}">${opt}</option>\n`;
            });
            out += `</select>\n`;
        } else if (f.type === 'radio') {
            out += `<div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-2">\n`;
            f.options.forEach(opt => {
                out += `<label className="flex cursor-pointer select-none items-center justify-center rounded-lg border border-[#E8E6E1] bg-white px-5 py-2.5 text-[14px] font-medium text-[#4A4A4A] transition-all hover:bg-neutral-50 has-[:checked]:border-[#0A0A0A] has-[:checked]:bg-[#0A0A0A] has-[:checked]:text-white">\n`;
                out += `<input required={currentStep === ${step}} type="radio" name="${f.id}" value="${opt}" className="sr-only" /> <span>${opt}</span>\n`;
                out += `</label>\n`;
            });
            out += `</div>\n`;
        } else if (f.type === 'checkbox') {
            out += `<div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-2">\n`;
            f.options.forEach(opt => {
                out += `<label className="flex cursor-pointer select-none items-center justify-center rounded-lg border border-[#E8E6E1] bg-white px-5 py-2.5 text-[14px] font-medium text-[#4A4A4A] transition-all hover:bg-neutral-50 has-[:checked]:border-[#0A0A0A] has-[:checked]:bg-[#0A0A0A] has-[:checked]:text-white">\n`;
                out += `<input type="checkbox" name="${f.id}" value="${opt}" className="sr-only" />\n`;
                out += `<span>${opt}</span>\n`;
                out += `</label>\n`;
            });
            out += `</div>\n`;
        } else {
            out += `<input required={currentStep === ${step}} type="${f.type}" name="${f.id}" className="input-field" placeholder="Your answer" />\n`;
        }
        out += `</Field>\n`;
    });
    out += `</div></div>\n`;
    return out;
};

fileContent += renderFields(fields.slice(0, 6), 1);
fileContent += renderFields(fields.slice(6, 9), 2);
fileContent += renderFields(fields.slice(9, 12), 3);
fileContent += renderFields(fields.slice(12), 4);

fileContent += `
          <div className="pt-8 mt-8 flex items-center justify-between border-t border-[#E8E6E1]">
            <button type="button" onClick={handleBack} disabled={currentStep === 1 || isSubmitting} className={\`inline-flex items-center px-4 py-2.5 text-sm font-medium text-[#6B6B6B] transition hover:text-[#0A0A0A] \${currentStep === 1 ? "opacity-0 pointer-events-none" : ""}\`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </button>
            {currentStep < STEPS.length ? (
              <button type="button" onClick={handleNext} className="inline-flex items-center rounded-md bg-[#0A0A0A] px-8 py-2.5 text-sm font-medium text-white transition hover:brightness-95 shadow-sm">
                Next Step
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center rounded-md bg-[#0A0A0A] px-8 py-2.5 text-sm font-medium text-white transition hover:brightness-95 disabled:opacity-70 shadow-sm">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </div>
      <style>{\`
        .input-field { width: 100%; border-radius: 0.5rem; border: 1px solid #E8E6E1; background-color: #fff; padding: 0.75rem 1rem; font-size: 0.9375rem; line-height: 1.5rem; color: #0A0A0A; outline: none; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02); transition: all 0.15s ease-in-out; }
        .input-field:focus { border-color: #0A0A0A; box-shadow: 0 0 0 1px #0A0A0A, 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .input-field::placeholder { color: #A3A3A3; }
        .input-field:disabled { background-color: #FAFAF8; color: #A3A3A3; }
      \`}</style>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string; }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-semibold text-[#0A0A0A]">{label}</label>
      {children}
    </div>
  );
}
`;

fs.writeFileSync('src/routes/careers.apply-aiml.tsx', fileContent);
