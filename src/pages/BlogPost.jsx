import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";
import { getPostBySlug } from "../data/blogPosts";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/404" replace />;

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: { "@type": "Organization", name: "The Ad-Toolkit Team" },
        }}
      />
      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link to="/blog" className="text-sm text-slate-500 hover:text-brand-600 inline-flex items-center gap-1.5 mb-6">
          <ArrowLeft size={14} /> Back to blog
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </time>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <div className="mt-8 space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed">
          {post.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </>
  );
}
