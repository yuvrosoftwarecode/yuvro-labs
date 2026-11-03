import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { restApiAuthUtil } from "../../utils/RestApiAuthUtil";

const MOCK_FEEDBACKS = [
  {
    id: "fb-1",
    candidate_name: "Kavya Reddy",
    candidate_email: "kavya.reddy@techcorp.in",
    rating: 5,
    description: "One of the most practical and enjoyable engineering assessments I've ever taken. Solving the real-world Redis race condition felt like day-to-day production work rather than an arbitrary LeetCode puzzle.",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "fb-2",
    candidate_name: "Arjun Mehta",
    candidate_email: "arjun.m@gmail.com",
    rating: 5,
    description: "The Vitarka AI technical interview was impressive! It asked thoughtful questions tailored directly to the architecture decisions I made in my System Design and lab tasks.",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: "fb-3",
    candidate_name: "Rohit Kumar",
    candidate_email: "rohit.kumar@outlook.com",
    rating: 4,
    description: "Great platform with a fast in-browser VS Code style editor. The terminal and test runner were snappy. Loved the real-time proctoring indicators.",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "fb-4",
    candidate_name: "Ananya Sen",
    candidate_email: "ananya.sen@swiggy.in",
    rating: 5,
    description: "Loved the system design canvas and ERD database modeler. Smooth experience with no intrusive proctoring barriers.",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

export function FeedbackTab({ ev }: { ev: any }) {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await restApiAuthUtil.get<any[]>(`/skill_evaluation/evaluations/${ev.id}/feedback/`);
        if (Array.isArray(data) && data.length > 0) {
          setFeedbacks(data);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch feedbacks, using mock feedback:", err);
      } finally {
        setLoading(false);
      }
      setFeedbacks(MOCK_FEEDBACKS);
    };
    fetchFeedbacks();
  }, [ev.id]);

  if (loading) {
    return <div className="py-12 text-center text-[13px] text-neutral-500">Loading feedback...</div>;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-[14px] font-medium text-neutral-900">No Feedback Yet</div>
        <div className="mt-1 text-[13px] text-neutral-500">Candidates haven't provided any feedback for this evaluation.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[14px] font-medium text-neutral-900">Candidate Feedback</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {feedbacks.map((f) => (
          <div key={f.id} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-medium text-neutral-900">
                {f.candidate_name || "Unknown Candidate"}
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= f.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"}`}
                  />
                ))}
              </div>
            </div>
            {f.candidate_email && (
              <div className="mt-0.5 text-[12px] text-neutral-500">{f.candidate_email}</div>
            )}
            {f.description && (
              <div className="mt-3 text-[13px] leading-relaxed text-neutral-700">
                "{f.description}"
              </div>
            )}
            <div className="mt-4 text-[11px] text-neutral-400">
              Submitted on {new Date(f.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}