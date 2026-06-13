export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Status = "Not Started" | "In Progress" | "Completed";

export interface Ticket {
  id: string;
  title: string;
  difficulty: Difficulty;
  estMin: number;
  xp: number;
  tag: string;
  status: Status;
  progress?: number;
  score?: number;
  description: string;
}

export interface Lab {
  slug: string;
  name: string;
  icon: string;
  color: "java" | "python" | "ui" | "sql" | "mongo" | "prog" | "ds";
  difficulty: Difficulty;
  completed: number;
  total: number;
  hoursLeft: number;
  description: string;
  skills: { name: string; pct: number }[];
}

export const labs: Lab[] = [
  { slug: "java", name: "Java Lab", icon: "☕", color: "java", difficulty: "Intermediate", completed: 8, total: 25, hoursLeft: 14, description: "Master Java fundamentals to advanced OOP.", skills: [
    { name: "Core Syntax", pct: 85 }, { name: "OOP Concepts", pct: 65 }, { name: "Exception Handling", pct: 45 }, { name: "Collections", pct: 30 }
  ]},
  { slug: "python", name: "Python Lab", icon: "🐍", color: "python", difficulty: "Beginner", completed: 12, total: 30, hoursLeft: 10, description: "From scripting to data structures and APIs.", skills: [
    { name: "Syntax", pct: 90 }, { name: "Functions", pct: 72 }, { name: "Modules", pct: 55 }, { name: "Async I/O", pct: 25 }
  ]},
  { slug: "ui", name: "UI Lab", icon: "🎨", color: "ui", difficulty: "Intermediate", completed: 5, total: 20, hoursLeft: 18, description: "Build pixel-perfect interfaces with HTML, CSS, React.", skills: [
    { name: "HTML/CSS", pct: 80 }, { name: "Flex/Grid", pct: 70 }, { name: "React", pct: 50 }, { name: "Accessibility", pct: 35 }
  ]},
  { slug: "sql", name: "SQL Lab", icon: "🗄️", color: "sql", difficulty: "Advanced", completed: 3, total: 18, hoursLeft: 22, description: "Queries, joins, window functions, optimization.", skills: [
    { name: "SELECT", pct: 95 }, { name: "JOINs", pct: 60 }, { name: "Windows", pct: 30 }, { name: "Tuning", pct: 15 }
  ]},
  { slug: "mongo", name: "MongoDB Lab", icon: "🍃", color: "mongo", difficulty: "Intermediate", completed: 0, total: 12, hoursLeft: 16, description: "Document modeling, CRUD, aggregation and indexes.", skills: [
    { name: "CRUD", pct: 40 }, { name: "Query Operators", pct: 25 }, { name: "Aggregation", pct: 15 }, { name: "Indexes", pct: 10 }
  ]},
  { slug: "programming", name: "Programming Lab", icon: "💻", color: "prog", difficulty: "Beginner", completed: 0, total: 30, hoursLeft: 20, description: "Programming fundamentals across syntax, logic, functions and OOP.", skills: [
    { name: "Syntax", pct: 30 }, { name: "Control Flow", pct: 20 }, { name: "Functions", pct: 15 }, { name: "OOP", pct: 10 }
  ]},
  { slug: "datastructures", name: "Data Structures Lab", icon: "🧩", color: "ds", difficulty: "Intermediate", completed: 0, total: 30, hoursLeft: 28, description: "Core data structures: arrays, lists, trees, graphs, heaps and more.", skills: [
    { name: "Arrays/Lists", pct: 30 }, { name: "Trees", pct: 15 }, { name: "Graphs", pct: 10 }, { name: "Hashing", pct: 20 }
  ]},
];

const mk = (i: number, title: string, diff: Difficulty, st: Status, tag: string, mins = 45, xp = 150, progress?: number, score?: number): Ticket => ({
  id: `JAVA-${100 + i}`, title, difficulty: diff, estMin: mins, xp, tag, status: st, progress, score,
  description: `Implement and test ${title.toLowerCase()}. Focus on clean idiomatic code and edge cases.`,
});

export const tickets: Ticket[] = [
  mk(1, "Variables & Types", "Beginner", "Completed", "Fundamentals", 30, 100, undefined, 95),
  mk(2, "Control Flow", "Beginner", "Completed", "Fundamentals", 35, 120, undefined, 88),
  mk(3, "Arrays & Loops", "Beginner", "Completed", "Fundamentals", 40, 130, undefined, 92),
  mk(4, "Methods & Scope", "Beginner", "Completed", "Fundamentals", 40, 130, undefined, 80),
  mk(5, "Strings Deep Dive", "Beginner", "Completed", "Fundamentals", 45, 150, undefined, 76),
  mk(6, "Classes & Objects", "Intermediate", "Completed", "OOP", 60, 200, undefined, 84),
  mk(7, "Inheritance", "Intermediate", "Completed", "OOP", 55, 200, undefined, 70),
  mk(8, "Interfaces", "Intermediate", "Completed", "OOP", 60, 220, undefined, 65),
  mk(9, "Generics 101", "Intermediate", "In Progress", "Generics", 70, 250, 60),
  mk(10, "Exception Handling", "Intermediate", "In Progress", "Errors", 50, 200, 30),
  mk(11, "File I/O Basics", "Intermediate", "In Progress", "I/O", 60, 220, 10),
  mk(12, "Collections: List", "Intermediate", "Not Started", "Collections", 50, 200),
  mk(13, "Collections: Map", "Intermediate", "Not Started", "Collections", 55, 220),
  mk(14, "Streams API", "Advanced", "Not Started", "Streams", 80, 300),
  mk(15, "Lambdas", "Advanced", "Not Started", "FP", 70, 280),
  mk(16, "Concurrency Intro", "Advanced", "Not Started", "Threads", 90, 350),
  mk(17, "Executors", "Advanced", "Not Started", "Threads", 90, 350),
  mk(18, "JDBC Basics", "Advanced", "Not Started", "DB", 80, 320),
  mk(19, "JUnit Testing", "Intermediate", "Not Started", "Testing", 60, 220),
  mk(20, "Design Patterns I", "Advanced", "Not Started", "Patterns", 100, 400),
  // ---- Python · Django Todo App sprint ----
  { id: "PYDJ-201", title: "Bootstrap Django project & app", difficulty: "Beginner", estMin: 40, xp: 150, tag: "Django Todo", status: "Completed", score: 90,
    description: "Create a Django project `todoproject` and a `todos` app. Register the app in INSTALLED_APPS and wire urls.py." },
  { id: "PYDJ-202", title: "Todo model & migrations", difficulty: "Beginner", estMin: 45, xp: 180, tag: "Django Todo", status: "In Progress", progress: 55,
    description: "Define a `Todo` model with title, description, completed and created_at. Generate and apply migrations." },
  { id: "PYDJ-203", title: "List & create todos (views + templates)", difficulty: "Intermediate", estMin: 60, xp: 240, tag: "Django Todo", status: "In Progress", progress: 20,
    description: "Implement list and create views using class-based or function views. Render with Django HTML templates." },
  { id: "PYDJ-204", title: "Toggle complete & delete", difficulty: "Intermediate", estMin: 50, xp: 220, tag: "Django Todo", status: "Not Started",
    description: "Add POST endpoints to mark a todo complete and delete it. Use Django forms and CSRF tokens." },
  { id: "PYDJ-205", title: "Style with template inheritance", difficulty: "Intermediate", estMin: 55, xp: 220, tag: "Django Todo", status: "Not Started",
    description: "Create base.html with blocks and extend it from todos templates. Add minimal CSS for a clean look." },

  // ---- Python · Core Foundations ----
  { id: "PY-101", title: "Variables, Types & f-strings", difficulty: "Beginner", estMin: 25, xp: 100, tag: "Py Fundamentals", status: "Completed", score: 95,
    description: "Practice int/float/str/bool, type casting, and f-string formatting with width and precision." },
  { id: "PY-102", title: "Lists, Tuples & Dicts", difficulty: "Beginner", estMin: 35, xp: 130, tag: "Py Fundamentals", status: "Completed", score: 88,
    description: "Build and mutate collections. Use slicing, unpacking and dict comprehensions." },
  { id: "PY-103", title: "Control Flow & Loops", difficulty: "Beginner", estMin: 30, xp: 120, tag: "Py Fundamentals", status: "In Progress", progress: 60,
    description: "Use if/elif/else, for/while, break/continue. Implement FizzBuzz and a number guessing game." },
  { id: "PY-104", title: "Functions & *args/**kwargs", difficulty: "Beginner", estMin: 40, xp: 150, tag: "Py Fundamentals", status: "Not Started",
    description: "Write pure functions with default args, *args and **kwargs. Add type hints." },
  { id: "PY-105", title: "List Comprehensions", difficulty: "Intermediate", estMin: 35, xp: 160, tag: "Py Fundamentals", status: "Not Started",
    description: "Refactor for-loops into idiomatic comprehensions including nested and conditional forms." },

  // ---- Python · Data & APIs ----
  { id: "PY-201", title: "File I/O & CSV parsing", difficulty: "Intermediate", estMin: 50, xp: 200, tag: "Py Data", status: "Not Started",
    description: "Read/write text and CSV. Aggregate a sales.csv into totals per category." },
  { id: "PY-202", title: "JSON & requests", difficulty: "Intermediate", estMin: 55, xp: 220, tag: "Py Data", status: "Not Started",
    description: "Fetch JSON from a public API with `requests`, handle status codes and serialize results." },
  { id: "PY-203", title: "Pandas DataFrame basics", difficulty: "Advanced", estMin: 70, xp: 300, tag: "Py Data", status: "Not Started",
    description: "Load a CSV into a DataFrame, filter, group-by and plot a quick chart." },

  // ---- UI Lab · HTML & CSS ----
  { id: "UI-101", title: "Semantic HTML landing page", difficulty: "Beginner", estMin: 35, xp: 120, tag: "HTML/CSS", status: "Completed", score: 91,
    description: "Build a landing page using header, nav, main, section, article and footer with proper headings." },
  { id: "UI-102", title: "CSS Box Model & Specificity", difficulty: "Beginner", estMin: 40, xp: 140, tag: "HTML/CSS", status: "Completed", score: 84,
    description: "Demonstrate margin/padding/border. Resolve a specificity conflict without !important." },
  { id: "UI-103", title: "Flexbox navbar", difficulty: "Intermediate", estMin: 45, xp: 180, tag: "HTML/CSS", status: "In Progress", progress: 40,
    description: "Build a responsive nav with logo left, links center, CTA right using flex utilities." },
  { id: "UI-104", title: "CSS Grid dashboard", difficulty: "Intermediate", estMin: 55, xp: 220, tag: "Layout", status: "In Progress", progress: 15,
    description: "Compose a 12-col grid dashboard with sidebar, header and main content using grid-template-areas." },
  { id: "UI-105", title: "Mobile-first media queries", difficulty: "Intermediate", estMin: 40, xp: 180, tag: "Layout", status: "Not Started",
    description: "Convert a desktop layout to mobile-first with breakpoints at 640/768/1024px." },

  // ---- UI Lab · React ----
  { id: "UI-201", title: "React: Todo with useState", difficulty: "Intermediate", estMin: 60, xp: 240, tag: "React", status: "Not Started",
    description: "Build a todo app with add, toggle, delete and filter All/Active/Done using useState." },
  { id: "UI-202", title: "useEffect & data fetching", difficulty: "Intermediate", estMin: 55, xp: 240, tag: "React", status: "Not Started",
    description: "Fetch posts from an API on mount. Handle loading, error and empty states cleanly." },
  { id: "UI-203", title: "Custom hook: useLocalStorage", difficulty: "Advanced", estMin: 50, xp: 260, tag: "React", status: "Not Started",
    description: "Write a reusable hook that syncs a state value to localStorage with SSR safety." },

  // ---- UI Lab · Accessibility ----
  { id: "UI-301", title: "Keyboard-accessible modal", difficulty: "Advanced", estMin: 60, xp: 280, tag: "Accessibility", status: "Not Started",
    description: "Build a modal with focus trap, ESC to close, and proper aria-* attributes." },
  { id: "UI-302", title: "Color contrast audit", difficulty: "Beginner", estMin: 25, xp: 110, tag: "Accessibility", status: "Not Started",
    description: "Audit a page against WCAG AA contrast. Fix failing pairs without breaking the palette." },

  // ---- SQL Lab · Querying ----
  { id: "SQL-101", title: "SELECT, WHERE & ORDER BY", difficulty: "Beginner", estMin: 25, xp: 100, tag: "Querying", status: "Completed", score: 97,
    description: "Query the `customers` table. Filter by country and sort by signup date desc." },
  { id: "SQL-102", title: "Aggregates & GROUP BY", difficulty: "Beginner", estMin: 35, xp: 140, tag: "Querying", status: "In Progress", progress: 50,
    description: "Compute total revenue per month using SUM, COUNT and GROUP BY with HAVING." },
  { id: "SQL-103", title: "INNER vs LEFT JOIN", difficulty: "Intermediate", estMin: 50, xp: 200, tag: "Joins", status: "In Progress", progress: 20,
    description: "Join `orders` and `customers`. Find customers with no orders using LEFT JOIN." },
  { id: "SQL-104", title: "Multi-table JOIN", difficulty: "Intermediate", estMin: 55, xp: 220, tag: "Joins", status: "Not Started",
    description: "Join orders → order_items → products to produce a line-item revenue report." },
  { id: "SQL-105", title: "Subqueries & CTEs", difficulty: "Intermediate", estMin: 60, xp: 240, tag: "Querying", status: "Not Started",
    description: "Rewrite a correlated subquery as a WITH cte for readability and performance." },

  // ---- SQL Lab · Window functions ----
  { id: "SQL-201", title: "ROW_NUMBER & RANK", difficulty: "Advanced", estMin: 65, xp: 280, tag: "Windows", status: "Not Started",
    description: "Rank top 3 products per category using a window function partitioned by category." },
  { id: "SQL-202", title: "LAG, LEAD & running totals", difficulty: "Advanced", estMin: 70, xp: 300, tag: "Windows", status: "Not Started",
    description: "Compute month-over-month growth and a running revenue total per region." },

  // ---- SQL Lab · Performance ----
  { id: "SQL-301", title: "EXPLAIN & indexes", difficulty: "Advanced", estMin: 70, xp: 320, tag: "Tuning", status: "Not Started",
    description: "Read an EXPLAIN plan. Add a covering index to remove a sequential scan." },
  { id: "SQL-302", title: "Normalize & denormalize", difficulty: "Advanced", estMin: 60, xp: 280, tag: "Tuning", status: "Not Started",
    description: "Take a flat reporting table to 3NF, then design a denormalized read model for a dashboard." },

  // ---- MongoDB Lab · CRUD ----
  { id: "MDB-101", title: "Insert & find documents", difficulty: "Beginner", estMin: 30, xp: 120, tag: "Mongo CRUD", status: "In Progress", progress: 40,
    description: "Insert a few users with insertOne / insertMany, then read them back with find() and findOne()." },
  { id: "MDB-102", title: "Update operators ($set, $inc, $push)", difficulty: "Beginner", estMin: 40, xp: 160, tag: "Mongo CRUD", status: "Not Started",
    description: "Use updateOne / updateMany with $set, $inc, $push to evolve a user profile." },
  { id: "MDB-103", title: "Delete with filters", difficulty: "Beginner", estMin: 25, xp: 110, tag: "Mongo CRUD", status: "Not Started",
    description: "Remove documents using deleteMany with comparison operators." },

  // ---- MongoDB Lab · Query Operators ----
  { id: "MDB-201", title: "Comparison & logical operators", difficulty: "Intermediate", estMin: 45, xp: 200, tag: "Mongo Query", status: "Not Started",
    description: "Build queries with $gt, $in, $and, $or against an orders collection." },
  { id: "MDB-202", title: "Array & nested fields", difficulty: "Intermediate", estMin: 50, xp: 220, tag: "Mongo Query", status: "Not Started",
    description: "Query nested documents and arrays with dot-notation and $elemMatch." },

  // ---- MongoDB Lab · Aggregation ----
  { id: "MDB-301", title: "Aggregation: $match + $group", difficulty: "Advanced", estMin: 60, xp: 260, tag: "Aggregation", status: "Not Started",
    description: "Build a pipeline that totals revenue per category using $match and $group." },
  { id: "MDB-302", title: "Aggregation: $lookup join", difficulty: "Advanced", estMin: 70, xp: 300, tag: "Aggregation", status: "Not Started",
    description: "Use $lookup to join orders with users and project a clean shape." },

  // ---- MongoDB Lab · Indexes ----
  { id: "MDB-401", title: "Single & compound indexes", difficulty: "Advanced", estMin: 55, xp: 260, tag: "Mongo Indexes", status: "Not Started",
    description: "Create indexes and use explain() to confirm an IXSCAN over COLLSCAN." },

  // ---- Programming Lab (topic per sprint) ----
  { id: "PROG-101", title: "Hello, World!", difficulty: "Beginner", estMin: 15, xp: 60, tag: "Prog Intro", status: "Not Started", description: "Write your first program that prints a greeting to the console." },
  { id: "PROG-102", title: "Comments & Style", difficulty: "Beginner", estMin: 15, xp: 60, tag: "Prog Intro", status: "Not Started", description: "Add single-line and block comments. Follow consistent formatting." },
  { id: "PROG-103", title: "Reading input", difficulty: "Beginner", estMin: 20, xp: 80, tag: "Prog Intro", status: "Not Started", description: "Read a name from stdin and greet the user." },

  { id: "PROG-201", title: "Numeric types & casting", difficulty: "Beginner", estMin: 25, xp: 100, tag: "Prog Variables", status: "Not Started", description: "Use int, float, and explicit casting between numeric types." },
  { id: "PROG-202", title: "Arithmetic operators", difficulty: "Beginner", estMin: 25, xp: 100, tag: "Prog Variables", status: "Not Started", description: "Compute area, perimeter and modulo using arithmetic operators." },
  { id: "PROG-203", title: "Boolean & comparison", difficulty: "Beginner", estMin: 25, xp: 110, tag: "Prog Variables", status: "Not Started", description: "Combine boolean and comparison operators in expressions." },

  { id: "PROG-301", title: "if / elif / else", difficulty: "Beginner", estMin: 30, xp: 120, tag: "Prog Control Flow", status: "Not Started", description: "Classify a number as positive, negative or zero using branches." },
  { id: "PROG-302", title: "Nested conditionals", difficulty: "Beginner", estMin: 30, xp: 130, tag: "Prog Control Flow", status: "Not Started", description: "Decide ticket pricing based on age and membership status." },
  { id: "PROG-303", title: "Switch / match", difficulty: "Intermediate", estMin: 35, xp: 150, tag: "Prog Control Flow", status: "Not Started", description: "Use match/case (or switch) to map HTTP codes to messages." },

  { id: "PROG-401", title: "for & while loops", difficulty: "Beginner", estMin: 30, xp: 120, tag: "Prog Loops", status: "Not Started", description: "Iterate from 1 to N and accumulate a sum." },
  { id: "PROG-402", title: "break, continue, else", difficulty: "Beginner", estMin: 30, xp: 130, tag: "Prog Loops", status: "Not Started", description: "Find the first prime above 1000 using break." },
  { id: "PROG-403", title: "Nested loops & patterns", difficulty: "Intermediate", estMin: 40, xp: 160, tag: "Prog Loops", status: "Not Started", description: "Print a multiplication table and a pyramid pattern." },

  { id: "PROG-501", title: "Define & call functions", difficulty: "Beginner", estMin: 30, xp: 130, tag: "Prog Functions", status: "Not Started", description: "Write `add`, `max3`, `is_even` with type hints." },
  { id: "PROG-502", title: "Default & keyword args", difficulty: "Intermediate", estMin: 35, xp: 150, tag: "Prog Functions", status: "Not Started", description: "Use default and keyword arguments to build a greeter." },
  { id: "PROG-503", title: "Recursion: factorial & fib", difficulty: "Intermediate", estMin: 45, xp: 180, tag: "Prog Functions", status: "Not Started", description: "Implement factorial and Fibonacci recursively." },

  { id: "PROG-601", title: "String slicing & methods", difficulty: "Beginner", estMin: 30, xp: 130, tag: "Prog Strings", status: "Not Started", description: "Reverse, capitalize and count vowels in a string." },
  { id: "PROG-602", title: "Palindrome check", difficulty: "Intermediate", estMin: 30, xp: 140, tag: "Prog Strings", status: "Not Started", description: "Check if a sentence is a palindrome ignoring case and spaces." },

  { id: "PROG-701", title: "Read & write a text file", difficulty: "Intermediate", estMin: 40, xp: 160, tag: "Prog File I/O", status: "Not Started", description: "Read a file line by line and write transformed output." },
  { id: "PROG-702", title: "Word count", difficulty: "Intermediate", estMin: 40, xp: 170, tag: "Prog File I/O", status: "Not Started", description: "Count occurrences of each word in a text file." },

  { id: "PROG-801", title: "try / except basics", difficulty: "Intermediate", estMin: 35, xp: 150, tag: "Prog Errors", status: "Not Started", description: "Handle ValueError when parsing user input as int." },
  { id: "PROG-802", title: "Custom exceptions", difficulty: "Intermediate", estMin: 40, xp: 170, tag: "Prog Errors", status: "Not Started", description: "Define and raise a custom exception class for invalid input." },

  { id: "PROG-901", title: "Classes & instances", difficulty: "Intermediate", estMin: 45, xp: 190, tag: "Prog OOP", status: "Not Started", description: "Define a `Point` class with x, y and a distance method." },
  { id: "PROG-902", title: "Inheritance", difficulty: "Intermediate", estMin: 50, xp: 200, tag: "Prog OOP", status: "Not Started", description: "Model `Animal` → `Dog`/`Cat` with overridden `speak`." },
  { id: "PROG-903", title: "Dunder methods", difficulty: "Advanced", estMin: 55, xp: 230, tag: "Prog OOP", status: "Not Started", description: "Implement __str__, __eq__ and __lt__ on a Money class." },

  // ---- Data Structures Lab (topic per sprint) ----
  { id: "DS-101", title: "Array traversal & sum", difficulty: "Beginner", estMin: 25, xp: 110, tag: "DS Arrays", status: "Not Started", description: "Sum elements and find min/max in a single pass." },
  { id: "DS-102", title: "Two-pointer: reverse in place", difficulty: "Intermediate", estMin: 35, xp: 150, tag: "DS Arrays", status: "Not Started", description: "Reverse an array in O(n) using two pointers." },
  { id: "DS-103", title: "Sliding window maximum sum", difficulty: "Intermediate", estMin: 45, xp: 180, tag: "DS Arrays", status: "Not Started", description: "Find the max sum of any contiguous window of size k." },

  { id: "DS-201", title: "Singly linked list", difficulty: "Intermediate", estMin: 50, xp: 200, tag: "DS Linked Lists", status: "Not Started", description: "Implement insert, delete and search on a singly linked list." },
  { id: "DS-202", title: "Reverse a linked list", difficulty: "Intermediate", estMin: 40, xp: 180, tag: "DS Linked Lists", status: "Not Started", description: "Reverse a singly linked list iteratively and recursively." },
  { id: "DS-203", title: "Detect cycle (Floyd's)", difficulty: "Advanced", estMin: 55, xp: 240, tag: "DS Linked Lists", status: "Not Started", description: "Detect a cycle using slow/fast pointers." },

  { id: "DS-301", title: "Stack with array", difficulty: "Beginner", estMin: 30, xp: 120, tag: "DS Stacks", status: "Not Started", description: "Implement push/pop/peek with a dynamic array." },
  { id: "DS-302", title: "Balanced parentheses", difficulty: "Intermediate", estMin: 35, xp: 160, tag: "DS Stacks", status: "Not Started", description: "Validate balanced (), [], {} using a stack." },
  { id: "DS-303", title: "Min stack in O(1)", difficulty: "Advanced", estMin: 45, xp: 200, tag: "DS Stacks", status: "Not Started", description: "Support getMin() in O(1) using an auxiliary stack." },

  { id: "DS-401", title: "Queue with two stacks", difficulty: "Intermediate", estMin: 40, xp: 170, tag: "DS Queues", status: "Not Started", description: "Implement an FIFO queue using two LIFO stacks." },
  { id: "DS-402", title: "Circular queue", difficulty: "Intermediate", estMin: 45, xp: 190, tag: "DS Queues", status: "Not Started", description: "Fixed-capacity circular queue with O(1) enqueue/dequeue." },
  { id: "DS-403", title: "Deque sliding window max", difficulty: "Advanced", estMin: 55, xp: 240, tag: "DS Queues", status: "Not Started", description: "Find sliding window maxima in O(n) using a deque." },

  { id: "DS-501", title: "Hash map from scratch", difficulty: "Intermediate", estMin: 55, xp: 220, tag: "DS Hashing", status: "Not Started", description: "Implement put/get/remove with chaining." },
  { id: "DS-502", title: "Two-sum with hashing", difficulty: "Beginner", estMin: 25, xp: 120, tag: "DS Hashing", status: "Not Started", description: "Find two indices that add up to a target in O(n)." },
  { id: "DS-503", title: "Group anagrams", difficulty: "Intermediate", estMin: 40, xp: 180, tag: "DS Hashing", status: "Not Started", description: "Group strings that are anagrams using a hash map." },

  { id: "DS-601", title: "Binary tree traversals", difficulty: "Intermediate", estMin: 45, xp: 190, tag: "DS Trees", status: "Not Started", description: "Implement in-order, pre-order and post-order traversals." },
  { id: "DS-602", title: "BST insert & search", difficulty: "Intermediate", estMin: 45, xp: 200, tag: "DS Trees", status: "Not Started", description: "Insert and search in a binary search tree." },
  { id: "DS-603", title: "Lowest common ancestor", difficulty: "Advanced", estMin: 60, xp: 260, tag: "DS Trees", status: "Not Started", description: "Find the LCA of two nodes in a binary tree." },

  { id: "DS-701", title: "Heapify an array", difficulty: "Intermediate", estMin: 45, xp: 200, tag: "DS Heaps", status: "Not Started", description: "Build a min-heap from an unsorted array in O(n)." },
  { id: "DS-702", title: "Top K frequent elements", difficulty: "Advanced", estMin: 55, xp: 240, tag: "DS Heaps", status: "Not Started", description: "Return the K most frequent elements using a heap." },

  { id: "DS-801", title: "Graph BFS", difficulty: "Intermediate", estMin: 50, xp: 220, tag: "DS Graphs", status: "Not Started", description: "Implement breadth-first search on an adjacency list." },
  { id: "DS-802", title: "Graph DFS", difficulty: "Intermediate", estMin: 50, xp: 220, tag: "DS Graphs", status: "Not Started", description: "Implement depth-first search iteratively and recursively." },
  { id: "DS-803", title: "Dijkstra's shortest path", difficulty: "Advanced", estMin: 75, xp: 320, tag: "DS Graphs", status: "Not Started", description: "Find shortest paths from a source using a priority queue." },

  { id: "DS-901", title: "Bubble & insertion sort", difficulty: "Beginner", estMin: 35, xp: 140, tag: "DS Sorting", status: "Not Started", description: "Implement two classic O(n²) sorts and compare." },
  { id: "DS-902", title: "Merge sort", difficulty: "Intermediate", estMin: 55, xp: 230, tag: "DS Sorting", status: "Not Started", description: "Implement merge sort in O(n log n)." },
  { id: "DS-903", title: "Quick sort with partition", difficulty: "Advanced", estMin: 60, xp: 260, tag: "DS Sorting", status: "Not Started", description: "Implement quick sort with Lomuto partition." },

  { id: "DS-1001", title: "Binary search", difficulty: "Beginner", estMin: 30, xp: 130, tag: "DS Searching", status: "Not Started", description: "Implement iterative and recursive binary search." },
  { id: "DS-1002", title: "Search in rotated array", difficulty: "Advanced", estMin: 55, xp: 240, tag: "DS Searching", status: "Not Started", description: "Search a target in a rotated sorted array in O(log n)." },
];

export const leaderboard = [
  { rank: 1, name: "Aarav S.", xp: 12480, streak: 42, avatar: "AS" },
  { rank: 2, name: "Priya M.", xp: 11820, streak: 30, avatar: "PM" },
  { rank: 3, name: "Liam K.", xp: 10990, streak: 21, avatar: "LK" },
  { rank: 4, name: "Sofia R.", xp: 9870, streak: 14, avatar: "SR" },
  { rank: 5, name: "Noah T.", xp: 9410, streak: 9, avatar: "NT" },
  { rank: 15, name: "You", xp: 4250, streak: 7, avatar: "YO", isYou: true },
];

export const me = {
  name: "Alex Chen",
  handle: "@alexc",
  level: 12,
  xp: 4250,
  nextLevelXp: 5000,
  streak: 7,
  rank: 15,
  totalSolved: 28,
  avatar: "AC",
};

export const forumThreads = [
  { id: 1, title: "Best way to handle null in JAVA-110?", author: "Priya M.", replies: 12, tag: "Java", time: "2h" },
  { id: 2, title: "Python list comprehension vs loop perf", author: "Liam K.", replies: 7, tag: "Python", time: "5h" },
  { id: 3, title: "When should I use INNER vs LEFT join?", author: "Sofia R.", replies: 23, tag: "SQL", time: "1d" },
  { id: 4, title: "Tailwind grid gotchas with auto-fit", author: "Noah T.", replies: 4, tag: "UI", time: "1d" },
];

export const certificates = [
  { id: 1, title: "Java Fundamentals", date: "May 2026", score: 92, color: "java" as const },
  { id: 2, title: "Python Essentials", date: "Apr 2026", score: 88, color: "python" as const },
  { id: 3, title: "SQL Basics", date: "Mar 2026", score: 95, color: "sql" as const },
];
