import SEO from "../components/SEO";

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="adsgear.net privacy policy — what data we collect, what we don't, and how our free tools work entirely in your browser."
        path="/privacy"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mt-2">Last updated: January 2026</p>

        <div className="card mt-8 space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-2">What this site does</h2>
            <p>
              adsgear.net provides free browser-based tools for marketers: a UTM builder, UTM decoder, ad
              spec checker, and campaign metrics calculator. All calculations happen locally in your browser.
              We do not require an account and do not store the URLs, campaign names, or numbers you enter
              on any server.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-2">Local storage</h2>
            <p>
              The UTM Builder saves your last 20 generated URLs and current form values in your browser's
              localStorage so they're there when you come back. This data never leaves your device and can
              be cleared at any time using the "Clear history" control or by clearing your browser storage.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-2">Analytics</h2>
            <p>
              We use Google Analytics (GA4) to understand aggregate traffic — which pages are visited and
              roughly how much traffic we get. This does not include the contents of any tool you use.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-2">Advertising</h2>
            <p>
              This site may display ads served through Google AdSense. Google and its partners may use
              cookies to serve ads based on your visits to this and other sites. You can opt out of
              personalized advertising through Google's Ads Settings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-2">Contact forms</h2>
            <p>
              Messages sent through our Contact page are processed by Formspree and delivered to us by
              email. We use the information you provide only to respond to your message.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-2">Changes to this policy</h2>
            <p>
              We'll update this page if what we collect or how we use it changes. Continued use of the site
              after an update means you accept the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-2">Contact</h2>
            <p>Questions about this policy can be sent through our Contact page.</p>
          </section>
        </div>
      </div>
    </>
  );
}
