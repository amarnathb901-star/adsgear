import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { blogPosts } from "../data/blogPosts";

export default function BlogIndex() {
  return (
    <>
      <SEO
        title="Blog"
        description="Guides on UTM tracking, ROAS, ad specs, and campaign metrics for performance marketers."
        path="/blog"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-slate-600 mt-2 mb-8">Guides on tracking, metrics, and specs — for the tasks behind the tools.</p>

        <div className="space-y-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="card block hover:border-brand-200 transition-colors">
              <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
              <p className="text-sm text-slate-500 mt-1.5">{post.description}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
