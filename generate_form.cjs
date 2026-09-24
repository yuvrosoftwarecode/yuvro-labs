const fs = require('fs');

const fields = [
{ label: "Full Name", id: "entry.1007251287", type: "text" },
{ label: "Email Address", id: "entry.274967390", type: "email" },
{ label: "Phone Number", id: "entry.1964362068", type: "tel" },
{ label: "Current Location", id: "entry.1699569585", type: "text" },
{ label: "LinkedIn", id: "entry.1652516225", type: "url" },
{ label: "GitHub", id: "entry.1878594595", type: "url" },
{ label: "College / University", id: "entry.1562677127", type: "text" },
{ label: "Degree & Branch", id: "entry.1420694636", type: "text" },
{ label: "Graduation Year", id: "entry.1591168102", type: "text" },
{ label: "Are you currently pursuing your degree or recently graduated?", id: "entry.1001765035", type: "text" },
{ label: "Are you available for a full-time 3-month internship?", id: "entry.640913839", type: "text" },
{ label: "Earliest date you can start", id: "entry.1805708590", type: "text" },
{ label: "Are you comfortable working in a fast-paced startup environment with changing priorities?", id: "entry.1435188419", type: "text" },
{ label: "Are you comfortable working directly with customers when required?", id: "entry.1832108603", type: "text" },
{ label: "Would you be open to converting to a full-time role based on performance?", id: "entry.2009552878", type: "text" },
{ label: "Rate your proficiency in Python", id: "entry.997354510", type: "text" },
{ label: "Rate your proficiency in React / JavaScript / TypeScript", id: "entry.632135875", type: "text" },
{ label: "Which backend technologies have you worked with?", id: "entry.1714571055", type: "text" },
{ label: "Which databases have you worked with?", id: "entry.449343809", type: "text" },
{ label: "Which of these have you worked with?", id: "entry.472964336", type: "text" },
{ label: "How would you rate your DSA/problem-solving ability?", id: "entry.417631743", type: "text" },
{ label: "Share your LeetCode / CodeChef / Codeforces / HackerRank profile, if available.", id: "entry.147671505", type: "text" },
{ label: "Which AI coding/development tools have you used?", id: "entry.99776933", type: "text" },
{ label: "How do you currently use AI tools while developing software?", id: "entry.1033724240", type: "textarea" },
{ label: "Tell us about something you built significantly faster using AI-assisted development. What did you use AI for, and what did you personally handle?", id: "entry.386740412", type: "textarea" },
{ label: "Suppose you are given a new API requirement that you don't fully understand. How would you use AI tools to go from requirement → implementation → testing → deployment?", id: "entry.1867515301", type: "textarea" },
{ label: "You receive this message from a customer: 'The feature was working yesterday, but today it's completely broken.' There are no useful logs. What would you do first?", id: "entry.1403231366", type: "textarea" },
{ label: "You have 4 hours to build a working prototype for a customer demo. The requirements are incomplete. How would you approach it?", id: "entry.2078384873", type: "textarea" },
{ label: "Tell us about a time you took ownership of a problem without being explicitly asked to do so.", id: "entry.2108645556", type: "textarea" },
{ label: "Tell us about a project where something went wrong. What did you do?", id: "entry.339326422", type: "textarea" },
{ label: "When you're stuck on a technical problem, what is your usual approach?", id: "entry.2072915839", type: "textarea" },
{ label: "Tell us about your most technically challenging project.", id: "entry.978046765", type: "textarea" },
{ label: "What exactly did you build in that project?", id: "entry.1407488203", type: "textarea" },
{ label: "Imagine a customer asks for a feature that will take 2 weeks to build, but they need something tomorrow. What would you do?", id: "entry.988343896", type: "textarea" },
{ label: "A customer explains a problem, but their proposed solution doesn't seem technically appropriate. How would you handle the conversation?", id: "entry.1066717407", type: "textarea" },
{ label: "What do you think is the difference between 'building a feature' and 'solving a customer's problem'?", id: "entry.352585669", type: "textarea" },
{ label: "Why are you interested in a Founder's Office / Forward Deployed Engineering role rather than a traditional software engineering internship?", id: "entry.342369420", type: "textarea" },
{ label: "What is one thing you've built that you're genuinely proud of? Why?", id: "entry.1988071024", type: "textarea" },
{ label: "Anything else you'd like us to know?", id: "entry.2000414504", type: "textarea" }
];

let fileContent = `import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ArrowLeft, User, GraduationCap, Code, MessageSquare, Check } from "lucide-react";

export const Route = createFileRoute("/careers/apply-fde")({
  head: () => ({
    meta: [
      { title: "Apply — Forward Deployed Engineer" },
    ],
  }),
  component: ApplyPage,
});

const STEPS = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Academics", icon: GraduationCap },
  { id: 3, title: "Skills", icon: Code },
  { id: 4, title: "Situational", icon: MessageSquare },
];

function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const GOOGLE_FORM_ACTION_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSe8_xV4rH01_fTUdAs2XyypsHXX1mohdxmsq_1xs_P3JcTZhg/formResponse";

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
          Complete the application below for <span className="font-medium text-[#0A0A0A]">Forward Deployed Engineer</span>
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
        if (f.type === 'textarea') {
            out += `<Field label="${f.label} *"><textarea required={currentStep === ${step}} name="${f.id}" rows={4} className="input-field resize-y" placeholder="Your answer"></textarea></Field>\n`;
        } else {
            out += `<Field label="${f.label} *"><input required={currentStep === ${step}} type="${f.type}" name="${f.id}" className="input-field" placeholder="Your answer" /></Field>\n`;
        }
    });
    out += `</div></div>\n`;
    return out;
};

fileContent += renderFields(fields.slice(0, 6), 1);
fileContent += renderFields(fields.slice(6, 15), 2);
fileContent += renderFields(fields.slice(15, 23), 3);
fileContent += renderFields(fields.slice(23), 4);

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

fs.writeFileSync('src/routes/careers.apply-fde.tsx', fileContent);
