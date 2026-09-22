import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: "Open Roles — Yuvro Labs" },
      {
        name: "description",
        content: "Join Yuvro Labs. We are hiring a Software Engineer Intern.",
      },
    ],
  }),
  component: CareersIndex,
});

function CareersIndex() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#0A0A0A] sm:text-5xl">Open Roles</h1>
        <p className="mt-4 text-lg text-[#6B6B6B]">
          Join us in building the future of engineering evaluation.
        </p>
      </div>

      <div className="space-y-6">
        <Link
          to="/careers/software-engineer-intern"
          className="block rounded-xl border border-[#E8E6E1] bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#0A0A0A]">Software Engineer Intern</h2>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#6B6B6B]">
                <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 font-medium text-neutral-600">
                  Internship
                </span>
                <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 font-medium text-neutral-600">
                  Remote
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-[#6B6B6B] max-w-2xl">
                We are looking for a passionate Software Engineer Intern to join our team. You will
                be working closely with our core engineering team to build, scale, and maintain our
                evaluation platform. This role involves working with modern web technologies
                including React, Next.js, Node.js, and more.
              </p>
            </div>
            <div
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#0A0A0A] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-95"
            >
              Apply Now
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
