import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-16 pb-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center pt-16 pb-12">
          <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground mb-6 text-balance">
            Open Source OSINT
            <br />
            Tool Arsenal
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground mb-10 text-pretty">
            Access powerful intelligence gathering tools curated by
            cybersecurity experts. Free, open source, and built for the
            community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8"
              asChild
            >
              <Link href="#tools">Explore Tools</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-foreground/20 hover:bg-foreground/5 px-8 bg-transparent"
              asChild
            >
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16">
            <div className="text-center">
              <div className="font-mono text-3xl sm:text-4xl text-foreground">
                36+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                OSINT Tools
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-3xl sm:text-4xl text-foreground">
                11
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Categories
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-3xl sm:text-4xl text-foreground">
                Free
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                & Open Source
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
