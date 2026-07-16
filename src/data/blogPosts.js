// Blog post metadata + content. Content kept as plain paragraphs for SEO body text.

export const blogPosts = [
  {
    slug: "what-is-utm-tracking",
    title: "What is UTM tracking and why it matters",
    description:
      "UTM parameters are the tags that tell your analytics platform exactly where a visitor came from. Here's what each one does and why consistent tagging matters.",
    date: "2026-01-12",
    readTime: "5 min read",
    content: [
      "UTM tracking is a way of adding a small set of tags to the end of a URL so that when someone clicks it, your analytics tool knows exactly which campaign, channel, and ad sent them. Without UTMs, most traffic gets lumped into vague buckets like 'direct' or 'referral,' which makes it almost impossible to tell which ads are actually working.",
      "There are five standard UTM parameters: utm_source identifies the platform (google, facebook, a newsletter name), utm_medium identifies the channel type (cpc, email, social), utm_campaign identifies the specific campaign, and the optional utm_content and utm_term let you distinguish between ad variations or keywords within the same campaign.",
      "The reason UTMs matter so much for performance marketers is attribution. If you're running the same offer across Google Search, Meta, and an email newsletter, UTMs are what let you split conversions between those channels in Google Analytics or your CRM. Without them, you're guessing.",
      "The most common mistake is inconsistency — one campaign tagged 'Facebook' and another tagged 'facebook_ads' will show up as two different sources in your reports, fragmenting the data you're trying to unify. A simple naming convention (always lowercase, always hyphens instead of spaces, a fixed list of medium values) solves this before it starts.",
      "A UTM builder that offers preset chips for common sources and mediums, plus a history of what you've already tagged, removes most of the manual error that creeps in when URLs are built by hand in a spreadsheet.",
    ],
  },
  {
    slug: "how-to-calculate-roas",
    title: "How to calculate ROAS — complete guide",
    description:
      "Return on ad spend is the single most-watched metric in performance marketing. Here's the formula, how break-even ROAS works, and what counts as a good number by platform.",
    date: "2026-01-19",
    readTime: "6 min read",
    content: [
      "Return on ad spend, or ROAS, measures how much revenue you generate for every dollar spent on advertising. The formula is simple: ROAS equals revenue divided by ad spend. A ROAS of 4x means every $1 spent generated $4 in revenue.",
      "Raw ROAS on its own doesn't tell you if a campaign is actually profitable, because it doesn't account for your margins. That's where break-even ROAS comes in — the minimum ROAS you need just to cover your costs. It's calculated as 1 divided by your gross margin as a decimal. A business with a 25% margin needs at least a 4x ROAS just to break even; anything below that is losing money even though revenue looks healthy.",
      "This is why two campaigns with the same ROAS can have completely different outcomes. A 3x ROAS is excellent for a business with thin 15% margins pushed past its break-even, but it's a loss for a business with 40% margins that needed 2.5x just to break even and expected real profit above that.",
      "'Good' ROAS also varies enormously by platform and intent. Search campaigns capturing existing demand on Google typically run 6 to 8x, because the user is already looking to buy. Meta and other social platforms, which interrupt rather than capture intent, typically run 3 to 5x. Top-of-funnel channels like display or TikTok often run 1 to 4x and are judged more on assisted conversions than direct ROAS.",
      "The practical takeaway: always calculate your break-even ROAS first, based on your actual margin, before judging whether a campaign's ROAS is good. A calculator that shows both numbers side by side — and a clear profitable, borderline, or unprofitable verdict — removes the guesswork.",
    ],
  },
  {
    slug: "meta-ads-specs-2026",
    title: "Meta ads specs 2026 — complete reference",
    description:
      "Every Meta ad format, resolution, aspect ratio, and file size limit in one place, so you stop hunting through scattered help center pages before every upload.",
    date: "2026-01-26",
    readTime: "4 min read",
    content: [
      "Meta's creative specs change often enough, and are spread across enough different help pages, that most media buyers end up bookmarking a screenshot instead of the source. The core formats worth knowing for 2026 are feed image, Stories, and video feed.",
      "For feed image placements, Meta recommends a 1080x1080px square image, a maximum file size around 30 MB, and JPG or PNG file types. Text overlay on the image itself should stay under roughly 20% of the frame to avoid reduced delivery.",
      "Stories and other full-screen vertical placements need a 1080x1920px, 9:16 image or video, with a safe zone of about 14% top and bottom kept clear of text or logos, since Meta's own UI — profile name, captions, call-to-action button — sits in those areas.",
      "Video feed placements support both 16:9 landscape and 1:1 square, with file sizes up to 4 GB and a technical maximum length of 241 minutes, though in practice feed video performs best well under a minute. MP4 and MOV are both accepted.",
      "Because Meta periodically adjusts safe zones, file size caps, and supported ratios, treat any specific numbers as a snapshot rather than gospel — always sanity check against Meta's own ads guide before a high-stakes launch, and use a spec checker as the first pass rather than the final word.",
    ],
  },
  {
    slug: "google-ads-utm-parameters-best-practices",
    title: "Google Ads UTM parameters — best practices",
    description:
      "Google Ads has its own auto-tagging system that can conflict with manual UTMs if you're not careful. Here's how to avoid double-counting and broken reports.",
    date: "2026-02-02",
    readTime: "5 min read",
    content: [
      "Google Ads has a built-in auto-tagging feature that appends a gclid parameter to your URLs automatically, which Google Analytics uses to pull in rich campaign data without any manual UTM tagging at all. This creates a common conflict: marketers add their own UTM parameters on top of auto-tagging, and end up with duplicate or contradictory source data.",
      "The general best practice is to pick one system and stick to it. If auto-tagging is enabled and working correctly with your analytics setup, manual UTMs on Google Ads links are usually unnecessary and can actually cause GA4 to split what should be one campaign into two differently-labeled entries.",
      "Manual UTMs on Google Ads become useful in a few specific situations: when you need consistent utm_campaign naming that matches non-Google channels for cross-platform reporting, when you're sending traffic to a platform other than GA4 that doesn't understand gclid, or when you're tracking at a more granular level than Google Ads' own reporting supports.",
      "If you do add manual UTMs to Google Ads URLs, use Google Ads' own valuetrack parameters — things like {campaignid} or {device} — inside your utm_content or utm_term fields so the values populate automatically per click rather than being hardcoded per ad.",
      "The safest approach for most accounts: let auto-tagging handle Google Ads, and reserve manual UTM tagging for every other channel — email, social, affiliate, and organic posts — where there's no equivalent auto-tagging system.",
    ],
  },
  {
    slug: "what-is-a-good-ctr",
    title: "What is a good CTR for digital ads",
    description: "Click-through rate benchmarks vary widely by platform and placement — here's what counts as competitive.",
    date: "2026-02-09",
    readTime: "4 min read",
    content: [
      "Click-through rate, or CTR, is the percentage of people who see your ad and click it — calculated as clicks divided by impressions, multiplied by 100. It's one of the fastest signals of whether your creative and targeting are resonating, but 'good' depends heavily on context.",
      "Search ads tend to have the highest CTRs because they're shown to people already searching for something related — a well-targeted Google Search campaign often sees 3 to 5% CTR or higher. Social feed ads, which interrupt rather than respond to intent, typically run lower, often in the 0.5 to 2% range on Meta.",
      "Display and programmatic placements, shown across a wide network of unrelated sites, usually see the lowest CTRs of all — frequently under 0.5% — simply because the ad wasn't what the visitor came to the page for.",
      "CTR should never be judged in isolation from conversion rate. A high CTR with a low conversion rate often means the ad is over-promising or attracting the wrong audience, while a lower CTR with strong conversions can still be the more profitable campaign.",
    ],
  },
  {
    slug: "cpm-vs-cpc-vs-cpa",
    title: "CPM vs CPC vs CPA — which to optimise",
    description: "Each pricing model optimizes for a different stage of the funnel. Picking the wrong one for your goal wastes budget.",
    date: "2026-02-16",
    readTime: "5 min read",
    content: [
      "CPM, CPC, and CPA are three different ways of paying for and optimizing an ad campaign, and each one tells the platform's algorithm to prioritize a different outcome. Choosing the wrong one for your actual goal is one of the most common budget-wasting mistakes in performance marketing.",
      "CPM, cost per thousand impressions, is the right choice when the goal is reach or awareness rather than an immediate action — building a retargeting pool, launching a new brand, or maximizing frequency to a defined audience. Optimizing for CPM alone says nothing about whether anyone engaged.",
      "CPC, cost per click, shifts the algorithm's priority toward getting people to actually click through to your site or landing page. It's a reasonable middle-funnel choice when the destination page itself is strong and the real goal is qualified traffic rather than raw impressions.",
      "CPA, cost per acquisition, is the most bottom-funnel model — you're telling the platform to optimize toward an actual conversion event, whether that's a purchase, signup, or lead. This requires enough conversion volume for the algorithm to learn from; too little data and CPA bidding tends to underperform or restrict delivery.",
      "As a rule of thumb: use CPM for pure awareness plays, CPC when you're still validating a landing page or offer, and CPA once you have enough conversion volume (generally 30-50 conversions per week per ad set) for the algorithm to optimize reliably.",
    ],
  },
  {
    slug: "utm-naming-convention-for-teams",
    title: "How to build a UTM naming convention for your team",
    description: "Inconsistent UTMs fragment your reporting. A short, enforced naming convention fixes it permanently.",
    date: "2026-02-23",
    readTime: "4 min read",
    content: [
      "The single biggest cause of broken campaign reporting isn't missing UTMs — it's inconsistent ones. 'Facebook,' 'facebook,' and 'FB' all describe the same source but will appear as three separate rows in your analytics unless a convention is enforced.",
      "A working naming convention needs just a few fixed rules: always lowercase, always hyphens instead of spaces or underscores, and a closed list of allowed values for utm_source and utm_medium that every team member uses rather than typing freely.",
      "utm_campaign benefits from a predictable pattern rather than a closed list, since campaigns change often — something like launch-date_campaign-name_region works well and sorts cleanly in spreadsheets and reports.",
      "The convention only works if it's easy to follow in the moment a link is built. A UTM builder with preset chips for the approved source and medium values does more to enforce consistency than a shared document nobody reads before tagging a link at 5pm on a Friday.",
    ],
  },
  {
    slug: "break-even-roas-explained",
    title: "Break-even ROAS explained with examples",
    description: "Your break-even ROAS is the line between a campaign that looks good and one that's actually profitable.",
    date: "2026-03-02",
    readTime: "4 min read",
    content: [
      "Break-even ROAS is the minimum return on ad spend needed to cover your costs, before any profit is made. It's calculated as 1 divided by your gross margin, expressed as a decimal. A 20% margin means a break-even ROAS of 5x; a 50% margin means a break-even ROAS of 2x.",
      "Consider two businesses both running a campaign at 4x ROAS. One sells a product with 50% margin — their break-even is 2x, so 4x is comfortably profitable, roughly doubling their money after costs. The other sells a product with 15% margin — their break-even is 6.7x, so that same 4x ROAS is actually a loss.",
      "This is why ROAS targets should never be copied from another business or a generic benchmark without adjusting for margin. A 'good' ROAS for a software subscription with 80% margins looks nothing like a 'good' ROAS for a low-margin physical product.",
      "In practice, most teams set a target ROAS at some multiple above break-even — often 1.2x to 1.5x the break-even number — to build in a profit margin rather than merely covering costs, and to leave room for returns, discounts, or a soft month.",
    ],
  },
];

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug);
}
