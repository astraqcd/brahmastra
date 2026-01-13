import { Fingerprint, Globe, Mail, Server, Shield, Users, Zap, Lock } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Domain Intelligence",
    description: "Deep reconnaissance on domains including WHOIS, DNS records, subdomains, and historical data.",
  },
  {
    icon: Mail,
    title: "Email OSINT",
    description: "Discover email patterns, verify addresses, and find associated accounts across platforms.",
  },
  {
    icon: Users,
    title: "Social Media Analysis",
    description: "Track digital footprints across social platforms and correlate user identities.",
  },
  {
    icon: Server,
    title: "Infrastructure Mapping",
    description: "Map network infrastructure, identify technologies, and discover exposed services.",
  },
  {
    icon: Fingerprint,
    title: "Digital Footprinting",
    description: "Aggregate and analyze digital traces left across the internet ecosystem.",
  },
  {
    icon: Shield,
    title: "Threat Intelligence",
    description: "Identify potential threats, leaked credentials, and security vulnerabilities.",
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Parallel processing and optimized queries deliver results in seconds, not minutes.",
  },
  {
    icon: Lock,
    title: "Privacy Focused",
    description: "All data stays local. No cloud dependencies, no data collection, complete privacy.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Comprehensive OSINT Capabilities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for professional intelligence gathering, all in one powerful toolkit.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-border bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
