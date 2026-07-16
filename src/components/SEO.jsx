import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, path = "", jsonLd }) {
  const fullTitle = title ? `${title} — adsgear.net` : "adsgear.net — Free tools for performance marketers";
  const url = `https://adsgear.net${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="https://adsgear.net/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      <link rel="alternate" hrefLang="en-US" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
