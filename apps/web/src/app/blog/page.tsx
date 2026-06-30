import Link from "next/link";
import type { Metadata } from "next";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes and updates from Elementation.",
};

export default function BlogPage() {
  return (
    <>
      <p className="text-sm font-semibold text-[#f36b6d]">Blog</p>
      <h1 className="mt-2 text-5xl font-semibold tracking-[-0.03em] text-slate-950">
        Product notes.
      </h1>
      <p className="mt-3 leading-7 text-slate-600">
        Short updates about visual feedback, prompt quality, and building with AI coding agents.
      </p>
      <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block py-6">
            <div className="text-sm text-slate-400">{post.date}</div>
            <h2 className="mt-1 text-xl font-semibold text-slate-950 transition-colors group-hover:text-[#2f6fed]">
              {post.title}
            </h2>
            <p className="mt-2 leading-7 text-slate-600">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
