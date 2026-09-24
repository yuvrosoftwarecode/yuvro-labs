import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, MapPin, Clock, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/careers/forward-deployed-engineer-intern")({
  head: () => ({
    meta: [
      { title: "Founder's Office Intern — Forward Deployed Engineer" },
      { name: "description", content: "Apply for the Founder's Office Intern — Forward Deployed Engineer position at Yuvro." },
    ],
  }),
  component: JDPage,
});

function JDPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      <Link
        to="/careers"
        className="inline-flex items-center text-sm font-medium text-[#6B6B6B] hover:text-[#0A0A0A] mb-8 transition group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
        to open roles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content (JD) */}
        <div className="lg:col-span-2 space-y-10 text-[#2A2A28]">
          
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#0A0A0A] sm:text-5xl">Founder's Office Intern — Forward Deployed Engineer</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#6B6B6B]">
              <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 font-medium text-neutral-600">
                Internship
              </span>
              <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 font-medium text-neutral-600">
                Remote
              </span>
            </div>
          </div>

          <div className="max-w-none text-[15px] leading-relaxed">
            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">About the Role</h3>
            <p>
              We're looking for a Founder's Office Intern to work directly on Forward Deployed Engineering sitting at the intersection of engineering, customer problems, and company strategy. This isn't a typical internship. You'll operate with the mindset of a founder: high ownership, high ambiguity, and high impact from day one.
            </p>
            <p className="mt-4">
              As a Forward Deployed Engineer, you'll work closely with customers to understand their real-world problems, then build and ship solutions fast. You'll bounce between writing code, debugging live issues, and thinking through product and business tradeoffs, sometimes all in the same day.
            </p>

            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">What You'll Do</h3>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Work directly with customers to scope, build, and deploy technical solutions to their problems</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Rapidly prototype and ship features, integrations, and fixes with a bias for speed</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Use AI-assisted dev tools (Claude Code, Lovable, etc.) to build and iterate faster than traditional workflows allow</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Build functional frontends and backend logic to bring prototypes to life quickly</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Debug complex, ambiguous problems under real-world constraints and tight timelines</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Work closely with the founders on strategic and technical decisions</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Wear multiple hats engineering, support, product thinking as the situation demands</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">What We're Looking For</h3>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Strong foundation in DSA comfortable solving hard problems efficiently and writing clean, correct code under pressure</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Working knowledge of Python and frontend development (React/JS or similar)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Hands-on experience with LLM-powered dev tools like Claude Code, Lovable, Cursor, or similar comfortable using AI to accelerate building, not just chat with it</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> A genuine founder mindset - ownership, urgency, resourcefulness, and comfort with ambiguity</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Strong problem-solving ability and a fast learning curve</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Willingness to go deep with customers, not just write code in isolation</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Prior projects, competitive programming, or hackathon experience is a big plus</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Currently pursuing or recently completed a degree in CS/Engineering (or equivalent self-taught skill)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">Why Join</h3>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Direct mentorship from the founding team</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Real ownership from week one - no busywork</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Strong performers get a clear path to a full-time offer</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Front-row seat to how a startup actually operates, end to end</li>
            </ul>
          </div>
        </div>

        {/* Sidebar Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[#E8E6E1] bg-white text-[#0A0A0A] p-6 shadow-sm">
            <h3 className="text-xl font-bold tracking-tight mb-6 pb-4 border-b border-[#E8E6E1]">Position Overview</h3>

            <div className="flex flex-col">
              <div className="flex gap-4 pb-4 border-b border-[#E8E6E1] mb-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-[#FAFAF8] text-[#4A4A4A]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6B6B6B]">Role</p>
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">Forward Deployed Engineer</p>
                </div>
              </div>

              <div className="flex gap-4 pb-4 border-b border-[#E8E6E1] mb-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-[#FAFAF8] text-[#4A4A4A]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6B6B6B]">Location / Mode</p>
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">Remote</p>
                </div>
              </div>

              <div className="flex gap-4 pb-4 border-b border-[#E8E6E1] mb-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-[#FAFAF8] text-[#4A4A4A]">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6B6B6B]">Type</p>
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">Full-time Internship</p>
                </div>
              </div>

              <div className="flex gap-4 pb-4 border-b border-[#E8E6E1]">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-[#FAFAF8] text-[#4A4A4A]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6B6B6B]">Duration</p>
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">3 Months</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E8E6E1]">
              <Link
                to="/careers/apply-fde"
                className="flex w-full items-center justify-center rounded-lg bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
