import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                >
                  <path
                    d="M16 2L4 8v16l12 6 12-6V8L16 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M16 2v28M4 8l12 6 12-6M4 24l12-6 12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Brahmastra
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free, open-source OSINT toolkit for security researchers and
              investigators.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                href="https://github.com"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Tools</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#tools"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Search Engines
                </Link>
              </li>
              <li>
                <Link
                  href="#tools"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Social Media
                </Link>
              </li>
              <li>
                <Link
                  href="#tools"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Domain & IP
                </Link>
              </li>
              <li>
                <Link
                  href="#tools"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Data Breaches
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contributing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Brahmastra. Open source under MIT
            License.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
