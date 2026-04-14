import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Shield, Target, Users, Code, Award, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Brahmastra OSINT and our mission to provide comprehensive intelligence gathering tools for cybersecurity professionals.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
            <Shield className="h-4 w-4 text-foreground/70" />
            <span className="text-xs font-medium text-foreground/70">
              About Brahmastra
            </span>
          </div>
          <h1 className="font-mono text-4xl sm:text-5xl text-foreground mb-6 tracking-tight">
            Open Source Intelligence
            <br />
            <span className="text-foreground/60"></span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Professional-grade OSINT toolkit curated for security researchers
            and investigators worldwide.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-foreground/70" />
            <h2 className="font-mono text-2xl text-foreground">Our Mission</h2>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              Brahmastra is a comprehensive Open Source Intelligence (OSINT)
              platform designed to empower cybersecurity professionals,
              researchers, and investigators with cutting-edge tools for
              intelligence gathering and analysis.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our mission is to democratize access to professional OSINT tools,
              making them freely available to the security community. We curate
              and organize the best intelligence gathering resources across
              multiple disciplines, saving investigators valuable time and
              improving their operational efficiency.
            </p>
          </div>
        </section>

        {/* Categories Explained */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-foreground/70" />
            <h2 className="font-mono text-2xl text-foreground">
              Intelligence Disciplines
            </h2>
          </div>
          <div className="grid gap-6">
            {[
              {
                name: "GEOINT",
                title: "Geospatial Intelligence",
                description:
                  "Maps, satellite imagery, flight tracking, and location-based intelligence tools.",
              },
              {
                name: "IMINT",
                title: "Imagery Intelligence",
                description:
                  "Reverse image search, photo forensics, facial recognition, and visual analysis.",
              },
              {
                name: "SOCMINT",
                title: "Social Media Intelligence",
                description:
                  "Profile investigation, username enumeration, and social network analysis.",
              },
              {
                name: "WEBINT",
                title: "Web Intelligence",
                description:
                  "Search engines, web archives, AI assistants, domain/DNS recon, and internet reconnaissance.",
              },
              {
                name: "SIGINT",
                title: "Signals Intelligence",
                description:
                  "IoT device search, network reconnaissance, and signal monitoring.",
              },
              {
                name: "PHONE_EMAIL",
                title: "Phone & Email Intelligence",
                description:
                  "Contact verification, breach checking, and communication intelligence.",
              },
              {
                name: "DARKWEB",
                title: "Dark Web Intelligence",
                description:
                  "Tor network tools, .onion search engines, dark web monitoring, and hidden service analysis.",
              },
              {
                name: "MALWARE",
                title: "Malware Intelligence",
                description:
                  "Threat hunting, file analysis, and security research tools.",
              },
            ].map((category) => (
              <div
                key={category.name}
                className="p-4 rounded-lg border border-border bg-card hover:border-foreground/20 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded bg-foreground/5 text-foreground/70 border border-foreground/10 mt-0.5">
                    {category.name}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Who We Serve */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-foreground/70" />
            <h2 className="font-mono text-2xl text-foreground">Who We Serve</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "Security Researchers",
                description:
                  "Threat intelligence analysts and vulnerability researchers.",
              },
              {
                title: "Law Enforcement",
                description:
                  "Digital investigators and cybercrime units.",
              },
              {
                title: "Journalists",
                description:
                  "Investigative reporters and fact-checkers.",
              },
              {
                title: "Corporate Security",
                description:
                  "Brand protection and fraud investigation teams.",
              },
            ].map((user) => (
              <div
                key={user.title}
                className="p-5 rounded-lg border border-border bg-card"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {user.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Developed By */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Award className="h-6 w-6 text-foreground/70" />
            <h2 className="font-mono text-2xl text-foreground">Developed By</h2>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg text-foreground mb-2">
              AstraQ Cyber Defence PVT. LTD
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A leading cybersecurity company specializing in threat
              intelligence, security research, and defensive cyber operations.
            </p>
            <a
              href="https://astraqcyberdefence.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground hover:text-foreground/70 transition-colors font-medium"
            >
              Visit AstraQ
              <span>→</span>
            </a>
          </div>
        </section>

        {/* Contribution */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code className="h-6 w-6 text-foreground/70" />
            <h2 className="font-mono text-2xl text-foreground">
              Contribution Guide
            </h2>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              Brahmastra is an open-source project. We welcome contributions
              from the security community to help expand and improve our tool
              collection.
            </p>
            <div className="mt-6 p-6 rounded-xl border border-border bg-secondary/20">
              <h3 className="font-semibold text-foreground mb-3">
                How to Contribute
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Submit new OSINT tools via GitHub pull requests</li>
                <li>• Report broken or outdated tool links</li>
                <li>• Suggest new intelligence categories</li>
                <li>• Improve tool descriptions and metadata</li>
                <li>• Share feedback and feature requests</li>
              </ul>
              <a
                href="https://github.com/astraqcd/brahmastra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/10 transition-all text-sm font-medium"
              >
                View on GitHub
                <span>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <div className="p-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
            <h3 className="font-semibold text-foreground mb-2">
              Legal Disclaimer
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These tools are provided for legitimate security research,
              investigation, and educational purposes only. Users are
              responsible for ensuring their activities comply with applicable
              laws and regulations. Always obtain proper authorization before
              conducting any investigation or security assessment.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
