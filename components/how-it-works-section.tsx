import { Download, Terminal, Rocket, Target } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Download,
    title: "Install Brahmastra",
    description: "Clone the repository or download the latest release. Works on Linux, macOS, and Windows.",
  },
  {
    step: "02",
    icon: Target,
    title: "Define Your Target",
    description: "Specify domains, usernames, emails, or IP addresses you want to investigate.",
  },
  {
    step: "03",
    icon: Terminal,
    title: "Run Modules",
    description: "Execute individual modules or run comprehensive scans with a single command.",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Analyze Results",
    description: "Review structured reports, export data, and integrate findings into your workflow.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with Brahmastra in minutes. Simple setup, powerful results.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent z-0" />
              )}

              <div className="relative z-10 text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-2xl bg-gradient-to-br from-card to-secondary border border-border mb-6">
                  <div className="text-center">
                    <step.icon className="h-8 w-8 text-primary mx-auto mb-1" />
                    <span className="text-xs font-mono text-muted-foreground">{step.step}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Code Example */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
              <span className="text-xs text-muted-foreground font-mono">Quick Start</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground select-none">#</span>
                <span className="text-muted-foreground">Clone the repository</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary select-none">$</span>
                <span className="text-foreground">git clone https://github.com/brahmastra-osint/brahmastra.git</span>
              </div>
              <div className="flex items-start gap-2 mt-4">
                <span className="text-muted-foreground select-none">#</span>
                <span className="text-muted-foreground">Install dependencies</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary select-none">$</span>
                <span className="text-foreground">cd brahmastra && pip install -r requirements.txt</span>
              </div>
              <div className="flex items-start gap-2 mt-4">
                <span className="text-muted-foreground select-none">#</span>
                <span className="text-muted-foreground">Run your first scan</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary select-none">$</span>
                <span className="text-foreground">python brahmastra.py --domain example.com --all</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
