import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ToolsSection } from "@/components/tools-section"
import { Footer } from "@/components/footer"
import toolsData from "@/app/data/tools.json"

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      <Header />
      <HeroSection />
      <ToolsSection toolsData={toolsData} />
      <Footer />
    </main>
  )
}
