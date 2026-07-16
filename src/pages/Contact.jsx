import { useState } from "react";
import SEO from "../components/SEO";

// Replace with the real Formspree endpoint before launch:
// https://formspree.io/f/YOUR_FORM_ID  (grab this from the Formspree dashboard)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgqgpap";

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const form = e.target;
    const data = new FormData(form);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with The AdsGear Team — feedback, bug reports, and feature requests for adsgear.net."
        path="/contact"
      />
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">Contact us</h1>
        <p className="text-slate-600 mt-2 mb-8">
          Found a bug, missing a preset, or want a tool we don't have yet? Tell us.
        </p>

        {status === "sent" ? (
          <div className="card bg-green-50 border-green-200 text-green-700 text-sm">
            Thanks — your message is in. We read every one.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <label className="block">
              <span className="label-sm block mb-1.5">Name</span>
              <input
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
              />
            </label>
            <label className="block">
              <span className="label-sm block mb-1.5">Email</span>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
              />
            </label>
            <label className="block">
              <span className="label-sm block mb-1.5">Message</span>
              <textarea
                name="message"
                rows={5}
                required
                className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none resize-none"
              />
            </label>
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-500">Something went wrong — try again in a moment.</p>
            )}
          </form>
        )}
      </div>
    </>
  );
}
