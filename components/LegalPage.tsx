import PageHero from "@/components/PageHero";
import { legalBody, type LegalDoc } from "@/lib/legal";

/**
 * Shell for the standard legal pages (privacy policy, notice of privacy
 * practices, SMS terms, terms of service): the hero and prose column the privacy policy has
 * always used. The body is template HTML, so it takes the site's HTML prose
 * styles (.blog-html) for its headings, lists and links.
 */
export default function LegalPage({
  doc,
  path,
  title,
  subtitle,
}: {
  doc: LegalDoc;
  path: string;
  title: string;
  subtitle?: string;
}) {
  const html = legalBody(doc);
  return (
    <>
      <PageHero
        path={path}
        eyebrow="Legal"
        title={title}
        subtitle={subtitle}
        image="/images/20230113-03-31305ceanothusdr-lagunabeach-ca-021-Small.jpg"
        crumbs={[{ label: title }]}
      />
      <section className="section bg-white">
        <div className="container-x max-w-prose">
          {/* SAFETY: first-party template from the repo (content/legal/) with
              escaped merge fields; no user input reaches it.
              suppressHydrationWarning: call tracking rewrites the phone link. */}
          <div
            className="blog-html"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>
    </>
  );
}
