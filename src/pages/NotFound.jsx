import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" description="This page doesn't exist." path="/404" />
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="font-mono text-brand-600 text-sm mb-3">404</p>
        <h1 className="text-2xl font-bold text-slate-900">This page doesn't exist</h1>
        <p className="text-slate-500 mt-2">The link might be broken, or the page may have moved.</p>
        <Link
          to="/"
          className="inline-block mt-6 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Back to homepage
        </Link>
      </div>
    </>
  );
}
