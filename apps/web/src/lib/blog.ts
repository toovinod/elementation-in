export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export const posts: BlogPost[] = [
  {
    slug: "introducing-elementation",
    title: "Introducing Elementation",
    date: "June 30, 2026",
    excerpt: "Turn any UI element and a line of feedback into a precise, AI-ready coding prompt.",
  },
];
