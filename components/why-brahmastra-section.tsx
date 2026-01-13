import { Code2, Users, Zap, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react"

const reasons = [
  {
    icon: Code2,
    title: "100% Open Source",
    description: "Full transparency. Audit the code, contribute features, or fork for your own use. MIT licensed.",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Optimized for speed with async operations, parallel processing, and intelligent caching.",
  },
  {
    icon: ShieldCheck,
    title: "Security First",
    description: "No telemetry, no cloud dependencies. Your investigations stay completely private and local.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by security researchers, for security researchers. Active community and regular updates.",
  },
  {
    icon: HeartHandshake,
    title: "Free Forever",
    description: "No premium tiers, no paywalls, no hidden costs. Professional tools for everyone.",
  },
  {
    icon: Sparkles,
    title: "Modern Architecture",
    description: "Built with Python 3.11+, modern APIs, and extensible plugin architecture.",
  },
]

export function WhyBrahmastraSection() {
  return (
    <section className="py-24 bg-secondary/20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Brahmastra?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with the philosophy that powerful security tools should be accessible to everyone.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 rounded-xl border border-border/50 bg-card/20 hover:bg-card/40 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <reason.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{reason.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-20 p-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card/50 to-accent/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-1">50+</div>
              <div className="text-sm text-muted-foreground">Built-in Modules</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-1">200+</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-1">15+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Community Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
