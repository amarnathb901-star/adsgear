import SEO from "../components/SEO";

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="AdsGear is built by The Ad-Toolkit Team — free, fast tools for the routine tasks performance marketers run every day."
        path="/about"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <div className="card mt-8 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
          <p>
            AdsGear is built by <strong className="text-slate-800">The Ad-Toolkit Team</strong>, a small
            group of people who spend most of their week doing the same job you do: building tracking URLs,
            checking creative specs, and doing back-of-napkin ROAS math before a campaign goes live.
          </p>
          <p>
            Every tool that exists for those tasks today is either a bare-bones form with no memory of what
            you did yesterday, or a paid SaaS platform charging monthly for something that's really just
            arithmetic and string formatting. We built AdsGear to sit in between: fast, free, and built
            for people who open these tools ten times a week, not once a quarter.
          </p>
          <p>
            Everything runs in your browser. Nothing you enter is sent to a server, and nothing requires an
            account. If that ever changes for a specific feature, we'll say so clearly on that page.
          </p>
        </div>
      </div>
    </>
  );
}
