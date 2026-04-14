"use client";

import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from "react";

type IntroPhase = "typing" | "hold" | "fadeout" | "done";

const IntroPhaseContext = createContext<IntroPhase>("done");

export function useIntroPhase() {
  return useContext(IntroPhaseContext);
}

interface IntroScreenProps {
  children: ReactNode;
}

export function IntroScreen({ children }: IntroScreenProps) {
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "fadeout" | "done">(
    "typing",
  );
  const [ready, setReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [noiseUrl, setNoiseUrl] = useState("");
  const fullText = "SEARCHING FOR 'OSINT TOOLS'";
  const isGrey = (i: number) => i >= 15 && i <= 25;

  useEffect(() => {
    if (sessionStorage.getItem("intro-seen")) {
      setPhase("done");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    const size = 200;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 18;
    }
    ctx.putImageData(imageData, 0, 0);
    setNoiseUrl(c.toDataURL());
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    let frame: number;
    let time = 0;

    const draw = () => {
      time += 0.016;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      const scanY = ((time * 55) % (h + 200)) - 100;
      const grad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      grad.addColorStop(0, "rgba(255, 255, 255, 0)");
      grad.addColorStop(0.4, "rgba(255, 255, 255, 0.03)");
      grad.addColorStop(0.5, "rgba(255, 255, 255, 0.06)");
      grad.addColorStop(0.6, "rgba(255, 255, 255, 0.03)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 50, w, 100);

      const radGrad = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        Math.max(w, h) * 0.5,
      );
      radGrad.addColorStop(0, "rgba(255, 255, 255, 0.02)");
      radGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.005)");
      radGrad.addColorStop(1, "transparent");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [phase]);

  useEffect(() => {
    if (!ready || phase !== "typing") return;
    if (charIndex >= fullText.length) {
      setPhase("hold");
      return;
    }
    const delay = 50 + Math.random() * 50;
    const timer = setTimeout(() => setCharIndex((prev) => prev + 1), delay);
    return () => clearTimeout(timer);
  }, [ready, phase, charIndex, fullText.length]);

  useEffect(() => {
    if (phase !== "hold") return;
    const timer = setTimeout(() => setPhase("fadeout"), 1000);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fadeout") return;
    const timer = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("intro-seen", "1");
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <>
      {phase !== "done" && (
        <div
          className={`fixed inset-0 z-100 transition-opacity duration-1000 ${
            phase === "fadeout" ? "opacity-0" : "opacity-100"
          }`}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />

          {noiseUrl && (
            <div
              className="absolute inset-0 pointer-events-none intro-noise-anim intro-noise-layer"
              ref={(el) => {
                if (el) el.style.backgroundImage = `url(${noiseUrl})`;
              }}
            />
          )}

          <div className="absolute inset-0 pointer-events-none intro-vignette" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-mono text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] sm:tracking-[0.25em] select-none">
              {fullText.split("").map((char, i) => (
                <span
                  key={`${i}`}
                  className={[
                    "intro-char",
                    char === " " ? "intro-char-space" : "",
                    i < charIndex
                      ? isGrey(i)
                        ? "intro-char-grey"
                        : "intro-char-white"
                      : "intro-char-hidden",
                    i === charIndex - 1
                      ? isGrey(i)
                        ? "intro-char-new-grey"
                        : "intro-char-new-white"
                      : "",
                    phase === "hold" && isGrey(i) && i < charIndex
                      ? "intro-glitch"
                      : "",
                  ].join(" ")}
                >
                  {char}
                </span>
              ))}
              <span className="intro-blink-cursor text-white/50 ml-0.5">▌</span>
            </div>
          </div>
        </div>
      )}

      <IntroPhaseContext.Provider value={phase}>
        <div
          className={`transition-all duration-1000 ${
            phase === "fadeout" || phase === "done"
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }`}
        >
          {children}
        </div>
      </IntroPhaseContext.Provider>
    </>
  );
}
