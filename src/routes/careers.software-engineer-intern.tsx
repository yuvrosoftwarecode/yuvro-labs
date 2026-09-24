import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, MapPin, Clock, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/careers/software-engineer-intern")({
  head: () => ({
    meta: [
      { title: "Software Engineer Intern — Yuvro" },
      { name: "description", content: "Apply for the Software Engineer Intern position at Yuvro." },
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
            <h1 className="text-4xl font-bold tracking-tight text-[#0A0A0A] sm:text-5xl">Software Engineer Intern</h1>
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
            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">About Yuvro</h3>
            <p>
              Yuvro is an Engineering Capability Verification Platform. We evaluate engineers through real work — simulations, assessments, and interviews that adapt, with evidence behind every hiring decision. We work with modern technologies to build scalable software solutions. We are looking for passionate and self-driven students who are eager to gain practical industry experience by contributing to live projects and collaborating with experienced engineers.
            </p>

            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">Eligibility Criteria</h3>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Pursuing B.Tech/B.E in Computer Science Engineering (CSE) or a related field.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Eligible Batches: 2027 & 2028 Graduates (Current 2nd & 3rd Years).</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Strong understanding of programming fundamentals, data structures, and web development concepts.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Passion for learning, problem-solving, and building software products.</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">Required Technical Skills</h3>
            
            <div className="grid sm:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-semibold text-[#0A0A0A] mb-2">Backend</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Node.js / Express or Django</li>
                  <li>REST API Development</li>
                  <li>JWT Authentication</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#0A0A0A] mb-2">Frontend</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>React.js / Next.js</li>
                  <li>Tailwind CSS</li>
                  <li>TypeScript / JavaScript (ES6+)</li>
                  <li>HTML5 & CSS3</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#0A0A0A] mb-2">Database</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>PostgreSQL</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#0A0A0A] mb-2">DevOps & Tools</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Docker</li>
                  <li>Git & GitHub (Version Control)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">Additional Expectations</h3>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Understanding of software development lifecycle.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Familiarity with debugging and testing practices.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Ability to work in a collaborative development environment.</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">Preferred Qualifications</h3>
            
            <h4 className="font-semibold text-[#0A0A0A] mt-4 mb-2">Project Experience</h4>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Built and deployed full-stack web applications.</li>
              <li>Developed REST APIs using Node.js or Django REST Framework.</li>
              <li>Worked on React-based frontend applications.</li>
              <li>Integrated PostgreSQL databases in projects.</li>
              <li>Experience with Dockerized applications.</li>
              <li>Active GitHub profile showcasing personal, academic, or freelance projects.</li>
            </ul>

            <h4 className="font-semibold text-[#0A0A0A] mt-4 mb-2">Prior Experience</h4>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Previous internship experience in software development.</li>
              <li>Contributions to open-source projects.</li>
              <li>Participation in hackathons, coding competitions, or technical communities.</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">Bonus Skills</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>AWS or Azure Cloud Fundamentals.</li>
              <li>CI/CD concepts and deployment workflows.</li>
              <li>Linux basics.</li>
              <li>Tailwind CSS, ShadCN UI, or similar frontend frameworks.</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">Why join Yuvro?</h3>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Work on Real Client & Product Development Projects</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Gain Hands-On Experience with Modern Technologies</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Learn Industry Best Practices & Development Workflows</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Collaborate with Experienced Engineers</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Build a Strong Professional Portfolio</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Flexible Remote Work Environment</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Internship Completion Certificate</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A0A0A] mt-0.5" /> Opportunity for Pre-Placement Offer (PPO) Based on Performance</li>
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
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">Software Engineer Intern (Full Stack)</p>
                </div>
              </div>

              <div className="flex gap-4 pb-4 border-b border-[#E8E6E1] mb-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-[#FAFAF8] text-[#4A4A4A]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6B6B6B]">Location / Mode</p>
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">Remote (Hyderabad Preference)</p>
                </div>
              </div>

              <div className="flex gap-4 pb-4 border-b border-[#E8E6E1] mb-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-[#FAFAF8] text-[#4A4A4A]">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6B6B6B]">Joining</p>
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">Immediate Joiners Preferred</p>
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
                to="/careers/apply"
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
