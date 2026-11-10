export type WeeklyDay = { day: string; title: string; tasks: string[] };

export const weeklyTask = {
  slug: "todo-app",
  name: "Todo App",
  description: "Build a full Todo App over one week — one focused task each day.",
  days: [
    { day: "Monday", title: "Project setup & data model", tasks: ["Create the project and folder structure", "Define the Todo type: id, title, done, createdAt", "Render a static list of three todos"] },
    { day: "Tuesday", title: "Add and delete todos", tasks: ["Add an input with an Add button", "Validate empty titles", "Delete a todo from the list"] },
    { day: "Wednesday", title: "Complete and edit", tasks: ["Toggle a todo as done", "Edit a title inline", "Show a count of remaining todos"] },
    { day: "Thursday", title: "Filters & persistence", tasks: ["Add All / Active / Completed filters", "Persist todos in local storage", "Add a Clear completed action"] },
    { day: "Friday", title: "REST API", tasks: ["Build GET/POST/PATCH/DELETE /todos", "Connect the UI to the API", "Handle loading and error states"] },
    { day: "Saturday", title: "Testing", tasks: ["Write unit tests for todo logic", "Test the API endpoints", "Fix any failing cases"] },
    { day: "Sunday", title: "Polish & ship", tasks: ["Make the layout work on mobile", "Write a README", "Deploy and share the link"] },
  ] as WeeklyDay[],
};

/** Monday = 0 … Sunday = 6 */
export function todayIndex(d = new Date()) {
  return (d.getDay() + 6) % 7;
}

const KEY = "yuvro:weekly:todo-app";
export function getDone(): number[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function setDone(v: number[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
}
