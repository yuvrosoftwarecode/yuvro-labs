import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ChevronDown, Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: "Open Roles — Yuvro Labs" },
      {
        name: "description",
        content: "Join Yuvro Labs. We are hiring.",
      },
    ],
  }),
  component: CareersIndex,
});

const JOBS = [
  {
    id: "software-engineer-intern",
    title: "Software Engineer Intern",
    department: "Engineering",
    location: "Remote / Hyderabad",
    type: "Internship",
    experience: "Entry Level",
    link: "/careers/software-engineer-intern",
  },
  {
    id: "forward-deployed-engineer-intern",
    title: "Founder's Office Intern — Forward Deployed Engineer",
    department: "Engineering / Strategy",
    location: "Remote",
    type: "Internship",
    experience: "Entry Level",
    link: "/careers/forward-deployed-engineer-intern",
  },
  {
    id: "ai-ml-engineer-intern",
    title: "AI/ML Engineer Intern",
    department: "Engineering",
    location: "Remote",
    type: "Internship",
    experience: "Entry Level",
    link: "/careers/ai-ml-engineer-intern",
  }
];

function CareersIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [experience, setExperience] = useState("");

  const filteredJobs = useMemo(() => {
    return JOBS.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            job.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = department ? job.department === department : true;
      const matchesLocation = location ? job.location === location : true;
      const matchesType = type ? job.type === type : true;
      const matchesExperience = experience ? job.experience === experience : true;

      return matchesSearch && matchesDepartment && matchesLocation && matchesType && matchesExperience;
    });
  }, [searchQuery, department, location, type, experience]);

  // Unique values for dropdowns
  const departments = [...new Set(JOBS.map(job => job.department))];
  const locations = [...new Set(JOBS.map(job => job.location))];
  const types = [...new Set(JOBS.map(job => job.type))];
  const experiences = [...new Set(JOBS.map(job => job.experience))];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
      <div className="mb-10 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold tracking-tight text-[#0A0A0A] sm:text-5xl">Open Roles</h1>
        <p className="mt-4 text-lg text-[#6B6B6B]">
          Join us in building the future of engineering evaluation.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-3 rounded-xl border border-[#E8E6E1] bg-white p-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B]" />
          <input 
            type="text" 
            placeholder="Search roles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-100/50 rounded-lg pl-9 pr-4 py-2 text-[15px] focus:outline-none focus:ring-1 focus:ring-neutral-200 placeholder:text-neutral-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <div className="relative">
            <select 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="appearance-none inline-flex items-center gap-1.5 rounded-lg border border-[#E8E6E1] bg-white pl-3.5 pr-8 py-2 text-[14px] font-medium text-[#4A4A4A] hover:bg-neutral-50 focus:outline-none cursor-pointer"
            >
              <option value="">Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B] pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="appearance-none inline-flex items-center gap-1.5 rounded-lg border border-[#E8E6E1] bg-white pl-3.5 pr-8 py-2 text-[14px] font-medium text-[#4A4A4A] hover:bg-neutral-50 focus:outline-none cursor-pointer"
            >
              <option value="">Location</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B] pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="appearance-none inline-flex items-center gap-1.5 rounded-lg border border-[#E8E6E1] bg-white pl-3.5 pr-8 py-2 text-[14px] font-medium text-[#4A4A4A] hover:bg-neutral-50 focus:outline-none cursor-pointer"
            >
              <option value="">Type</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B] pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="appearance-none inline-flex items-center gap-1.5 rounded-lg border border-[#E8E6E1] bg-white pl-3.5 pr-8 py-2 text-[14px] font-medium text-[#4A4A4A] hover:bg-neutral-50 focus:outline-none cursor-pointer"
            >
              <option value="">Experience</option>
              {experiences.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B] pointer-events-none" />
          </div>

        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B6B]">
            No roles found matching your criteria.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={job.link}
              className="group block rounded-xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-[19px] font-semibold text-[#0A0A0A]">{job.title}</h2>
                  <div className="mt-2.5 flex flex-wrap gap-2 text-[13px] text-[#6B6B6B]">
                    <span className="inline-flex items-center rounded-md bg-neutral-100/80 px-2.5 py-1 font-medium text-neutral-600 gap-1.5 border border-neutral-200/50">
                      <Briefcase className="h-3.5 w-3.5 text-neutral-500" /> {job.department}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-neutral-100/80 px-2.5 py-1 font-medium text-neutral-600 gap-1.5 border border-neutral-200/50">
                      <MapPin className="h-3.5 w-3.5 text-neutral-500" /> {job.location}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-neutral-100/80 px-2.5 py-1 font-medium text-neutral-600 gap-1.5 border border-neutral-200/50">
                      <Clock className="h-3.5 w-3.5 text-neutral-500" /> {job.type}
                    </span>
                  </div>
                </div>
                <div
                  className="inline-flex shrink-0 items-center font-medium text-[#0A0A0A] group-hover:underline text-[14px]"
                >
                  View Details <ArrowRight className="ml-1 h-4 w-4 text-[#0A0A0A]" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
