"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
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
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-foreground leading-none">
                Brahmastra
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                by Team AstraQ
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#tools"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Tools
            </Link>
            <Link
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Button
              size="sm"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-5"
              asChild
            >
              <Link
                href="https://astraqcyberdefence.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                AstraQ
              </Link>
            </Button>
          </nav>
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-4">
            <Link
              href="#tools"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Tools
            </Link>
            <Link
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Button
              size="sm"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 w-fit px-5"
              asChild
            >
              <Link
                href="https://astraqcyberdefence.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                AstraQ
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
