import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Clock, Building, Briefcase, Calendar } from "lucide-react";

export const Route = createFileRoute("/careers/ai-ml-engineer-intern")({
  head: () => ({
    meta: [
      { title: "AI/ML Engineer Intern — Yuvro Labs" },
      {
        name: "description",
        content: "We're looking for an AI/ML Engineer Intern to work directly on core ML systems.",
      },
    ],
  }),
  component: AIMLEngineerInternPage,
});

function AIMLEngineerInternPage() {
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
            <h1 className="text-4xl font-bold tracking-tight text-[#0A0A0A] sm:text-5xl mb-4">
              AI/ML Engineer Intern
            </h1>
            <div className="flex flex-wrap gap-2 text-sm text-[#6B6B6B]">
              <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 font-medium text-neutral-600">
                Internship
              </span>
              <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 font-medium text-neutral-600">
                Remote
              </span>
            </div>
          </div>

          <div className="max-w-none text-[15px] leading-relaxed">
            <h3 className="text-xl font-semibold text-[#0A0A0A] mb-4">About the Role</h3>
            <p className="mb-4">
              We're looking for an exceptionally strong AI/ML Engineer Intern to work on core ML systems — not toy projects. This role is for someone who genuinely understands how modern AI systems work under the hood: transformers, embeddings, retrieval, and the infrastructure that ties it all together in production.
            </p>
            <p className="mb-4">
              This is a high-bar role, both technically and in mindset. We're not looking for someone who has "used" ML libraries — we're looking for someone who can reason about model behavior, debug retrieval quality issues, make real architectural tradeoffs, and operate like a founder: high ownership, high urgency, zero hand-holding.
            </p>

            <h3 className="text-xl font-semibold text-[#0A0A0A] mt-8 mb-4">What You'll Do</h3>
            <ul className="list-disc pl-5 space-y-2">
            <li>Design, build, and optimize retrieval pipelines using vector databases (Pinecone, Weaviate, Qdrant, Milvus, etc.)</li>
            <li>Work hands-on with transformer architectures — fine-tuning, embeddings, attention mechanisms, and inference optimization</li>
            <li>Build and evaluate RAG pipelines, chunking strategies, and re-ranking systems</li>
            <li>Benchmark and improve embedding quality, retrieval accuracy, and latency</li>
            <li>Work with LLM APIs and open-source models, and know when to use which</li>
            <li>Own experiments end-to-end — from hypothesis to evaluation to production-readiness</li>
            <li>Collaborate directly with founders on core AI/ML architecture and product decisions, not just execute tickets</li>
          </ul>

          <h2 className="text-xl font-bold text-[#0A0A0A] mt-8 mb-4">What We're Looking For</h2>
          <p className="mb-4">This role demands genuine depth, not surface-level familiarity:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Very strong understanding of transformers — attention mechanisms, positional encoding, fine-tuning vs. prompting, when and why models behave the way they do</li>
            <li>Hands-on experience with vector databases — indexing strategies (HNSW, IVF, etc.), similarity metrics, and tradeoffs between different vector DB solutions</li>
            <li>Strong Python skills — comfortable with PyTorch/TensorFlow, Hugging Face ecosystem, and building production-grade ML code (not just notebooks)</li>
            <li>Solid grasp of embeddings and RAG systems - chunking, re-ranking, hybrid search, evaluation metrics</li>
            <li>Strong DSA and CS fundamentals — you should be able to reason about complexity and efficiency, not just call library functions</li>
            <li>A genuine founder mindset - you take ownership beyond your assigned task, move fast, make decisions with incomplete information, and think about the "why" behind what you're building, not just the "how"</li>
            <li>Proven projects, research, Kaggle competitions, or published work that demonstrate real depth (not just tutorials followed)</li>
            <li>Comfort reading and implementing ideas from ML papers</li>
            <li>Comfort operating in ambiguity — you'll often be defining the problem, not just solving one handed to you</li>
          </ul>

          <h2 className="text-xl font-bold text-[#0A0A0A] mt-8 mb-4">Bonus points for</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Experience fine-tuning or deploying LLMs</li>
            <li>Contributions to open-source ML/AI projects</li>
            <li>Experience with model quantization, distillation, or inference optimization</li>
          </ul>

          <h2 className="text-xl font-bold text-[#0A0A0A] mt-8 mb-4">Why Join</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Work on real, production AI systems from day one</li>
            <li>Direct mentorship from the founding team</li>
            <li>Strong performers get a clear path to a full-time offer</li>
            <li>Front-row seat to how AI-native products are actually built, with real ownership over what you ship</li>
          </ul>
          </div>
        </div>

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
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">AI/ML Engineer Intern</p>
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
                to="/careers/apply-aiml"
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
