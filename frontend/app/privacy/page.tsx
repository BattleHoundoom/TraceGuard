import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — TraceGuard",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background grid-pattern">
      <nav className="fixed top-0 z-50 flex items-center w-full px-6 py-3 bg-[#191c22]">
        <Link href="/">
          <span className="text-xl font-bold text-[#ffb000] tracking-tighter font-headline uppercase cursor-pointer">
            TraceGuard
          </span>
        </Link>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-widest mb-2">
            Privacy Policy
          </h1>
          <p className="text-[10px] font-label text-outline uppercase tracking-widest">
            Effective date: April 12, 2025
          </p>
        </div>

        <div className="space-y-10 text-sm text-on-surface/80 leading-relaxed">

          <section>
            <h2 className="text-[11px] font-headline font-bold text-[#ffb000] uppercase tracking-widest mb-3">
              1. Introduction
            </h2>
            <p>
              TraceGuard is an AI-powered IP infringement detection platform. We help rights holders
              scan the internet for potential copyright, trademark, and product violations across
              e-commerce, social media, and other platforms. This Privacy Policy explains what
              information we collect, how we use it, and your rights regarding that information.
            </p>
            <p className="mt-3">
              By using TraceGuard, you agree to the practices described in this policy. If you do
              not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] font-headline font-bold text-[#ffb000] uppercase tracking-widest mb-3">
              2. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-on-surface mb-1">Account information</p>
                <p>We collect only your email address, used for passwordless authentication (OTP login) and transactional notifications.</p>
              </div>
              <div>
                <p className="font-medium text-on-surface mb-1">Asset submissions</p>
                <p>When you submit an asset for scanning, we collect the asset name, type, URL, and any optional reference files (such as PDFs) you upload.</p>
              </div>
              <div>
                <p className="font-medium text-on-surface mb-1">Scan results and generated documents</p>
                <p>We store the results of infringement scans and any cease-and-desist drafts generated on your behalf, associated with your account.</p>
              </div>
              <div>
                <p className="font-medium text-on-surface mb-1">Usage logs</p>
                <p>
                  Our servers generate minimal access logs recording only the HTTP method and path of
                  each request (e.g., <span className="font-mono text-[12px] text-outline">GET /dashboard</span> or{" "}
                  <span className="font-mono text-[12px] text-outline">POST /api/scan</span>). These logs are not
                  linked to your identity and are automatically purged after one hour.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-headline font-bold text-[#ffb000] uppercase tracking-widest mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="space-y-2 list-none">
              {[
                "Authenticate you via one-time password (OTP) sent to your email",
                "Run infringement scans on your behalf across third-party platforms",
                "Generate cease-and-desist drafts based on scan findings",
                "Send transactional emails, including OTP codes and notifications you opt into",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[#ffb000] mt-0.5 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-[11px] font-headline font-bold text-[#ffb000] uppercase tracking-widest mb-3">
              4. Third-Party Services
            </h2>
            <p className="mb-4">
              TraceGuard relies on the following third-party services to operate. Your data may be
              processed by these providers as part of normal operation:
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-on-surface mb-1">OpenAI (GPT-4o)</p>
                <p>
                  Asset names, URLs, and content scraped during scans are sent to OpenAI for
                  AI-powered infringement analysis. OpenAI processes this data subject to their own{" "}
                  <a
                    href="https://openai.com/policies/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ffb000] underline hover:text-[#ffd597] transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
              <div>
                <p className="font-medium text-on-surface mb-1">Vercel</p>
                <p>TraceGuard is hosted on Vercel's infrastructure in the US East region (Washington, DC). Vercel handles request routing and edge delivery.</p>
              </div>
              <div>
                <p className="font-medium text-on-surface mb-1">Neon / Amazon Web Services</p>
                <p>Your account data, asset submissions, and scan results are stored in a Neon serverless PostgreSQL database hosted on AWS US East 1 (N. Virginia).</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-headline font-bold text-[#ffb000] uppercase tracking-widest mb-3">
              5. Web Scraping
            </h2>
            <p>
              When you initiate a scan, TraceGuard programmatically accesses third-party websites on
              your behalf to search for potential infringements. Scraped content is processed solely
              to generate your scan results and is not sold, shared, or used for any other purpose.
              You are responsible for ensuring that your use of TraceGuard's scanning features
              complies with applicable laws and the terms of service of the sites being scanned.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] font-headline font-bold text-[#ffb000] uppercase tracking-widest mb-3">
              6. Data Retention
            </h2>
            <div className="space-y-3">
              <p>
                <span className="font-medium text-on-surface">Account data and scan results</span> are
                retained indefinitely while your account remains active.
              </p>
              <p>
                <span className="font-medium text-on-surface">Deleted accounts</span>: if you request
                account deletion, your data is retained in an inactive state and will not be actively
                used. We will contact you for explicit permission before using it for any purpose.
              </p>
              <p>
                <span className="font-medium text-on-surface">Server logs</span> are automatically and
                permanently purged after one hour and contain no personally identifiable information.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-headline font-bold text-[#ffb000] uppercase tracking-widest mb-3">
              7. Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-2 list-none">
              {[
                "Access the personal data we hold about you",
                "Request correction of inaccurate data",
                "Request deletion of your account and associated data",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[#ffb000] mt-0.5 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact us at the address in Section 10. We do not
              sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] font-headline font-bold text-[#ffb000] uppercase tracking-widest mb-3">
              8. Children's Privacy
            </h2>
            <p>
              TraceGuard is not directed at children under the age of 13. We do not knowingly
              collect personal information from anyone under 13. If you believe a child has provided
              us with personal information, please contact us and we will promptly delete it.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] font-headline font-bold text-[#ffb000] uppercase tracking-widest mb-3">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the
              effective date at the top of this page. Continued use of TraceGuard after any changes
              constitutes your acceptance of the updated policy. We encourage you to review this
              page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] font-headline font-bold text-[#ffb000] uppercase tracking-widest mb-3">
              10. Contact
            </h2>
            <p>
              For privacy-related questions, requests, or concerns, contact us at:{" "}
              <span className="text-[#ffb000]">[your-email@example.com]</span>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
