import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ArrowLeft, User, GraduationCap, Code, MessageSquare, Check } from "lucide-react";

export const Route = createFileRoute("/careers/apply")({
  head: () => ({
    meta: [
      { title: "Apply — Software Engineer Intern" },
      {
        name: "description",
        content: "Apply for the Software Engineer Intern position at Yuvro Labs.",
      },
    ],
  }),
  component: ApplyPage,
});

const STEPS = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Academics", icon: GraduationCap },
  { id: 3, title: "Skills & Exp", icon: Code },
  { id: 4, title: "Final Details", icon: MessageSquare },
];

function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const GOOGLE_FORM_ACTION_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSd_PAiM837L6r0iDKIifGGazCAtFKh7_AlqXJtDVOxY3W1BdA/formResponse";

  const ENTRY_IDS = {
    fullName: "entry.1288130616",
    email: "entry.384970253",
    mobileNumber: "entry.193872294",
    whatsappNumber: "entry.23574781",
    city: "entry.2060196329",
    state: "entry.1255244254",
    linkedin: "entry.1871068519",
    github: "entry.648382259",
    resumeLink: "entry.289886417",
    college: "entry.1059618250",
    degree: "entry.1527570730",
    branch: "entry.1304688299",
    currentYear: "entry.546266401",
    graduationYear: "entry.25560551",
    cgpa: "entry.1687757519",
    activeBacklogs: "entry.875964398",
    technologies: "entry.776075942",
    projectDescription: "entry.1816525158",
    projectLink: "entry.816073794",
    previousExperience: "entry.890106548",
    hoursAvailable: "entry.214239097",
    availableDuration: "entry.740120623",
    whyYuvro: "entry.815923749",
    careerGoals: "entry.521165091",
  };

  const handleNext = () => {
    // Validate current step fields before moving
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll(
        'input:not([type="hidden"]), select, textarea',
      );
      let allValid = true;
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i] as HTMLInputElement;
        // Check if the input is within a currently visible container (offsetParent !== null)
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
    if (!GOOGLE_FORM_ACTION_URL) {
      alert("Please configure the Google Form Action URL in the code.");
      return;
    }

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
          Thank you for applying to Yuvro Labs. We will review your application and get back to you
          soon.
        </p>
        <Link
          to="/careers"
          className="mt-8 inline-flex items-center text-sm font-medium text-[#0A0A0A] hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to open roles
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:py-16">
      <Link
        to="/careers"
        className="inline-flex items-center text-sm font-medium text-[#6B6B6B] hover:text-[#0A0A0A] mb-8 transition group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
        to open roles
      </Link>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl mb-3">
          Join Our Team
        </h1>
        <p className="text-[15px] text-[#6B6B6B]">
          Complete the application below for{" "}
          <span className="font-medium text-[#0A0A0A]">Software Engineer Intern</span>
        </p>
      </div>

      {/* Stepper Header */}
      <div className="mb-12">
        <div className="relative flex justify-between max-w-3xl mx-auto">
          <div
            className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-[#E8E6E1]"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-[#0A0A0A] transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            aria-hidden="true"
          />

          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 bg-white transition-all duration-300 shadow-sm
                    ${
                      isActive
                        ? "border-[#0A0A0A] text-[#0A0A0A] scale-110"
                        : isCompleted
                          ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                          : "border-[#E8E6E1] text-[#A3A3A3]"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  ) : (
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  )}
                </div>
                <div
                  className={`absolute -bottom-8 w-28 text-center text-[13px] font-medium transition-colors duration-300
                  ${isActive ? "text-[#0A0A0A]" : isCompleted ? "text-[#0A0A0A]" : "text-[#A3A3A3]"}`}
                >
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="mt-20 rounded-2xl border border-[#E8E6E1] bg-white p-6 sm:p-10 shadow-sm overflow-hidden">
        <form ref={formRef} onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          <div
            className={
              currentStep === 1
                ? "block animate-in fade-in slide-in-from-right-4 duration-300"
                : "hidden"
            }
          >
            <div className="mb-8 border-b border-[#E8E6E1] pb-6">
              <h2 className="text-xl font-bold text-[#0A0A0A]">1. Basic Information</h2>
              <p className="mt-1 text-sm text-[#6B6B6B]">
                Basic details to identify and contact you.
              </p>
            </div>

            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Full Name *">
                  <input
                    required={currentStep === 1}
                    type="text"
                    name={ENTRY_IDS.fullName}
                    className="input-field"
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Email Address *">
                  <input
                    required={currentStep === 1}
                    type="email"
                    name={ENTRY_IDS.email}
                    className="input-field"
                    placeholder="jane@example.com"
                  />
                </Field>
                <Field label="Mobile Number *">
                  <input
                    required={currentStep === 1}
                    type="tel"
                    name={ENTRY_IDS.mobileNumber}
                    className="input-field"
                    placeholder="+91 9876543210"
                  />
                </Field>
                <Field label="WhatsApp Number *">
                  <input
                    required={currentStep === 1}
                    type="tel"
                    name={ENTRY_IDS.whatsappNumber}
                    className="input-field"
                    placeholder="+91 9876543210"
                  />
                </Field>
                <Field label="City *">
                  <input
                    required={currentStep === 1}
                    type="text"
                    name={ENTRY_IDS.city}
                    className="input-field"
                    placeholder="Mumbai"
                  />
                </Field>
                <Field label="State *">
                  <input
                    required={currentStep === 1}
                    type="text"
                    name={ENTRY_IDS.state}
                    className="input-field"
                    placeholder="Maharashtra"
                  />
                </Field>
                <Field label="LinkedIn Profile *">
                  <input
                    required={currentStep === 1}
                    type="url"
                    name={ENTRY_IDS.linkedin}
                    className="input-field"
                    placeholder="https://linkedin.com/in/..."
                  />
                </Field>
                <Field label="GitHub Profile *">
                  <input
                    required={currentStep === 1}
                    type="url"
                    name={ENTRY_IDS.github}
                    className="input-field"
                    placeholder="https://github.com/..."
                  />
                </Field>
                <Field label="Resume Link *" className="sm:col-span-2">
                  <input
                    required={currentStep === 1}
                    type="url"
                    name={ENTRY_IDS.resumeLink}
                    className="input-field"
                    placeholder="Google Drive or Dropbox link (make sure it's public)"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Step 2: Academics */}
          <div
            className={
              currentStep === 2
                ? "block animate-in fade-in slide-in-from-right-4 duration-300"
                : "hidden"
            }
          >
            <div className="mb-8 border-b border-[#E8E6E1] pb-6">
              <h2 className="text-xl font-bold text-[#0A0A0A]">2. Academics</h2>
              <p className="mt-1 text-sm text-[#6B6B6B]">
                Tell us about your educational background.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="College / University *" className="sm:col-span-2">
                <input
                  required={currentStep === 2}
                  type="text"
                  name={ENTRY_IDS.college}
                  className="input-field"
                  placeholder="University Name"
                />
              </Field>
              <Field label="Degree *">
                <input
                  required={currentStep === 2}
                  type="text"
                  name={ENTRY_IDS.degree}
                  className="input-field"
                  placeholder="B.Tech, B.Sc, etc."
                />
              </Field>
              <Field label="Branch / Specialization *">
                <input
                  required={currentStep === 2}
                  type="text"
                  name={ENTRY_IDS.branch}
                  className="input-field"
                  placeholder="Computer Science, etc."
                />
              </Field>
              <Field label="Current Year *">
                <select
                  required={currentStep === 2}
                  name={ENTRY_IDS.currentYear}
                  className="input-field bg-white cursor-pointer"
                >
                  <option value="">Select...</option>
                  <option value="1st Yr">1st Year</option>
                  <option value="2nd Yr">2nd Year</option>
                  <option value="3rd Yr">3rd Year</option>
                  <option value="4th Yr">4th Year</option>
                </select>
              </Field>
              <Field label="Graduation Year *">
                <input
                  required={currentStep === 2}
                  type="text"
                  name={ENTRY_IDS.graduationYear}
                  className="input-field"
                  placeholder="e.g., 2026"
                />
              </Field>
              <Field label="Current CGPA / Percentage *">
                <input
                  required={currentStep === 2}
                  type="text"
                  name={ENTRY_IDS.cgpa}
                  className="input-field"
                  placeholder="e.g., 8.5 or 85%"
                />
              </Field>
              <Field label="Active Backlogs *">
                <div className="flex gap-4 mt-1">
                  <label className="flex flex-1 cursor-pointer items-center justify-center rounded-md border border-[#E8E6E1] bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-neutral-50 has-[:checked]:border-[#0A0A0A] has-[:checked]:ring-1 has-[:checked]:ring-[#0A0A0A]">
                    <input
                      required={currentStep === 2}
                      type="radio"
                      name={ENTRY_IDS.activeBacklogs}
                      value="Yes"
                      className="sr-only"
                    />{" "}
                    Yes
                  </label>
                  <label className="flex flex-1 cursor-pointer items-center justify-center rounded-md border border-[#E8E6E1] bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-neutral-50 has-[:checked]:border-[#0A0A0A] has-[:checked]:ring-1 has-[:checked]:ring-[#0A0A0A]">
                    <input
                      required={currentStep === 2}
                      type="radio"
                      name={ENTRY_IDS.activeBacklogs}
                      value="No"
                      className="sr-only"
                    />{" "}
                    No
                  </label>
                </div>
              </Field>
            </div>
          </div>

          {/* Step 3: Skills & Exp */}
          <div
            className={
              currentStep === 3
                ? "block animate-in fade-in slide-in-from-right-4 duration-300"
                : "hidden"
            }
          >
            <div className="mb-8 border-b border-[#E8E6E1] pb-6">
              <h2 className="text-xl font-bold text-[#0A0A0A]">3. Skills & Experience</h2>
              <p className="mt-1 text-sm text-[#6B6B6B]">
                What are you best at, and what have you built?
              </p>
            </div>

            <div className="space-y-8">
              <Field label="Strongest Technologies (Select all that apply)">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                  {[
                    "React",
                    "Next.js",
                    "DJango",
                    "Node.js",
                    "Python",
                    "TypeScript",
                    "PostgreSQL",
                    "Docker",
                    "AWS",
                    "Git",
                  ].map((tech) => (
                    <label
                      key={tech}
                      className="flex cursor-pointer select-none items-center gap-3 rounded-md border border-[#E8E6E1] bg-white p-3 text-sm transition hover:bg-neutral-50 has-[:checked]:border-[#0A0A0A] has-[:checked]:bg-[#FAFAF8]"
                    >
                      <input
                        type="checkbox"
                        name={ENTRY_IDS.technologies}
                        value={tech}
                        className="h-4 w-4 rounded border-neutral-300 text-[#0A0A0A] focus:ring-[#0A0A0A]"
                      />
                      <span className="font-medium text-[#0A0A0A]">{tech}</span>
                    </label>
                  ))}
                </div>
              </Field>

              <div className="grid gap-6">
                <Field label="Project GitHub/Live Link *">
                  <input
                    required={currentStep === 3}
                    type="url"
                    name={ENTRY_IDS.projectLink}
                    className="input-field"
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Best Technical Project Description *">
                  <textarea
                    required={currentStep === 3}
                    name={ENTRY_IDS.projectDescription}
                    rows={4}
                    className="input-field resize-y"
                    placeholder="Describe your best project, your role, and what technologies you used..."
                  ></textarea>
                </Field>
              </div>

              <div className="pt-6 border-t border-[#E8E6E1] space-y-6">
                <Field label="Previous Internship Experience *">
                  <div className="grid sm:grid-cols-2 gap-3 mt-1">
                    {["None / First time", "Yes, I have previous experience"].map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-[#E8E6E1] bg-white px-4 py-3 text-sm font-medium transition hover:bg-neutral-50 has-[:checked]:border-[#0A0A0A] has-[:checked]:ring-1 has-[:checked]:ring-[#0A0A0A]"
                      >
                        <input
                          required={currentStep === 3}
                          type="radio"
                          name={ENTRY_IDS.previousExperience}
                          value={opt}
                          className="sr-only"
                        />{" "}
                        {opt}
                      </label>
                    ))}
                  </div>
                </Field>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Hours available per week *">
                    <div className="flex flex-col gap-3 mt-1">
                      {["10 - 20 Hours", "20 - 30 Hours", "40+ Hours (Full-Time)"].map((opt) => (
                        <label
                          key={opt}
                          className="flex cursor-pointer items-center justify-center rounded-md border border-[#E8E6E1] bg-white px-4 py-3 text-sm font-medium transition hover:bg-neutral-50 has-[:checked]:border-[#0A0A0A] has-[:checked]:ring-1 has-[:checked]:ring-[#0A0A0A]"
                        >
                          <input
                            required={currentStep === 3}
                            type="radio"
                            name={ENTRY_IDS.hoursAvailable}
                            value={opt}
                            className="sr-only"
                          />{" "}
                          {opt}
                        </label>
                      ))}
                    </div>
                  </Field>
                  <Field label="Available Duration *">
                    <div className="flex flex-col gap-3 mt-1">
                      {["3 Months", "6 Months"].map((opt) => (
                        <label
                          key={opt}
                          className="flex cursor-pointer items-center justify-center rounded-md border border-[#E8E6E1] bg-white px-4 py-3 text-sm font-medium transition hover:bg-neutral-50 has-[:checked]:border-[#0A0A0A] has-[:checked]:ring-1 has-[:checked]:ring-[#0A0A0A]"
                        >
                          <input
                            required={currentStep === 3}
                            type="radio"
                            name={ENTRY_IDS.availableDuration}
                            value={opt}
                            className="sr-only"
                          />{" "}
                          {opt}
                        </label>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Final Details */}
          <div
            className={
              currentStep === 4
                ? "block animate-in fade-in slide-in-from-right-4 duration-300"
                : "hidden"
            }
          >
            <div className="mb-8 border-b border-[#E8E6E1] pb-6">
              <h2 className="text-xl font-bold text-[#0A0A0A]">4. Final Details</h2>
              <p className="mt-1 text-sm text-[#6B6B6B]">We want to know what drives you.</p>
            </div>

            <div className="grid gap-6">
              <Field label="Why do you want to intern at Yuvro? *">
                <textarea
                  required={currentStep === 4}
                  name={ENTRY_IDS.whyYuvro}
                  rows={4}
                  className="input-field resize-y"
                  placeholder="Tell us why you're interested..."
                ></textarea>
              </Field>
              <Field label="What are your career goals? *">
                <textarea
                  required={currentStep === 4}
                  name={ENTRY_IDS.careerGoals}
                  rows={4}
                  className="input-field resize-y"
                  placeholder="Where do you see yourself in the future?"
                ></textarea>
              </Field>
            </div>
          </div>

          {/* Hidden field for Role Applying For */}
          <input type="hidden" name="entry.715205043" value="Software Engineer Intern" />

          {/* Form Controls */}
          <div className="pt-8 mt-8 flex items-center justify-between border-t border-[#E8E6E1]">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              className={`inline-flex items-center px-4 py-2.5 text-sm font-medium text-[#6B6B6B] transition hover:text-[#0A0A0A] ${currentStep === 1 ? "opacity-0 pointer-events-none" : ""}`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center rounded-md bg-[#0A0A0A] px-8 py-2.5 text-sm font-medium text-white transition hover:brightness-95 shadow-sm"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-md bg-[#0A0A0A] px-8 py-2.5 text-sm font-medium text-white transition hover:brightness-95 disabled:opacity-70 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Global styles for input fields in this component */}
      <style>{`
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #E8E6E1;
          background-color: #fff;
          padding: 0.75rem 1rem;
          font-size: 0.9375rem;
          line-height: 1.5rem;
          color: #0A0A0A;
          outline: none;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
          transition: all 0.15s ease-in-out;
        }
        .input-field:focus {
          border-color: #0A0A0A;
          box-shadow: 0 0 0 1px #0A0A0A, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .input-field::placeholder {
          color: #A3A3A3;
        }
        .input-field:disabled {
          background-color: #FAFAF8;
          color: #A3A3A3;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-semibold text-[#0A0A0A]">{label}</label>
      {children}
    </div>
  );
}
