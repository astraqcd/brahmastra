import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Github } from "lucide-react"
import Link from "next/link"

export function GetStartedSection() {
  return (
    <section id="docs" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Uncover the Truth?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of security researchers using Brahmastra for professional OSINT investigations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Download className="h-5 w-5" />
              Download Latest Release
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-border hover:bg-secondary bg-transparent"
              asChild
            >
              <Link href="https://github.com" target="_blank">
                <Github className="h-5 w-5" />
                Star on GitHub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              href="#"
              className="group p-6 rounded-xl border border-border bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Documentation →
              </h3>
              <p className="text-sm text-muted-foreground">Comprehensive guides and API references.</p>
            </Link>
            <Link
              href="#"
              className="group p-6 rounded-xl border border-border bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Examples →
              </h3>
              <p className="text-sm text-muted-foreground">Real-world use cases and tutorials.</p>
            </Link>
            <Link
              href="#"
              className="group p-6 rounded-xl border border-border bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Community →
              </h3>
              <p className="text-sm text-muted-foreground">Join our Discord for support and discussions.</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
