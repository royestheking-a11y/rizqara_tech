import { CoreFallback, CoreBoundary } from "./CoreFallback";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import {
  Box,
  BrainCircuit,
  Code2,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
const TechCore = lazy(() => import("./TechCore"));

export function PremiumExperience() {
  const { pathname } = useLocation();
  const { loading, secondaryLoading } = useData();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".rq-premium");
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-rq-tilt]")];
    cards
      .filter((card) => card.classList.contains("rq-service-card"))
      .forEach((card, index) => {
        card.dataset.rqIndex = String(index + 1).padStart(2, "0");
      });
    const sections = [
      ...root.querySelectorAll<HTMLElement>("[data-rq-reveal]"),
    ];
    if (reduced || !("IntersectionObserver" in window)) {
      sections.forEach((element) => element.classList.add("rq-is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("rq-is-visible");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.04, rootMargin: "0px 0px -25px 0px" },
    );
    sections.forEach((element, index) => {
      element.style.setProperty(
        "--rq-delay",
        `${Math.min(index % 3, 2) * 65}ms`,
      );
      observer.observe(element);
    });
    root.classList.add("rq-motion-ready");
    let frame = 0;
    let active: HTMLElement | null = null;
    const move = (event: PointerEvent) => {
      if (
        event.pointerType !== "mouse" ||
        !matchMedia("(hover: hover) and (pointer: fine)").matches
      )
        return;
      const target = (event.target as Element).closest<HTMLElement>(
        "[data-rq-tilt]",
      );
      if (!target || !root.contains(target)) return;
      if (active && active !== target) reset(active);
      active = target;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = target.getBoundingClientRect();
        const x = Math.max(
          0,
          Math.min(1, (event.clientX - box.left) / box.width),
        );
        const y = Math.max(
          0,
          Math.min(1, (event.clientY - box.top) / box.height),
        );
        target.style.setProperty("--rq-rx", `${(0.5 - y) * 6}deg`);
        target.style.setProperty("--rq-ry", `${(x - 0.5) * 7}deg`);
        target.style.setProperty("--rq-x", `${x * 100}%`);
        target.style.setProperty("--rq-y", `${y * 100}%`);
        target.classList.add("rq-pointer-active");
      });
    };
    function reset(target: HTMLElement) {
      target.style.setProperty("--rq-rx", "0deg");
      target.style.setProperty("--rq-ry", "0deg");
      target.classList.remove("rq-pointer-active");
    }
    const leave = (event: PointerEvent) => {
      if (
        active &&
        (!event.relatedTarget || !active.contains(event.relatedTarget as Node))
      ) {
        reset(active);
        active = null;
        cancelAnimationFrame(frame);
      }
    };
    root.addEventListener("pointermove", move, { passive: true });
    cards.forEach((card) => card.addEventListener("pointerleave", leave));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", move);
      cards.forEach((card) => card.removeEventListener("pointerleave", leave));
      if (active) reset(active);
    };
  }, [pathname, loading, secondaryLoading, reduced]);
  return (
    <>
      <motion.div
        className="rq-reading-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <div className="rq-ambient-grid" aria-hidden="true" />
      <div className="rq-ambient-orb rq-ambient-orb-one" aria-hidden="true" />
      <div className="rq-ambient-orb rq-ambient-orb-two" aria-hidden="true" />
    </>
  );
}
export function EngineeringExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [mode, setMode] = useState(0);
  const [paused, setPaused] = useState(false);
  const [revision, setRevision] = useState(0);
  const { language } = useData();
  const bn = language === "bn";
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const modes = [
    {
      name: bn ? "আর্কিটেকচার" : "Architecture",
      icon: Box,
      title: bn ? "প্রতিটি স্তরে নির্ভুলতা।" : "Precision. In every dimension.",
      detail: bn
        ? "ভাবনা থেকে বাস্তবতা—ডিজাইন, কোড ও সিস্টেমের সমন্বয়।"
        : "Design, code, and systems. Working as one.",
    },
    {
      name: bn ? "ইন্টেলিজেন্স" : "Intelligence",
      icon: BrainCircuit,
      title: bn
        ? "বুদ্ধিদীপ্ত সমন্বয়।"
        : "Intelligence. Beautifully connected.",
      detail: bn
        ? "সংযুক্ত সমাধান, সহজতর কাজ।"
        : "Connected thinking. Simpler experiences.",
    },
    {
      name: bn ? "ইঞ্জিনিয়ারিং" : "Engineering",
      icon: Code2,
      title: bn ? "ভবিষ্যতের জন্য নির্মিত।" : "Engineered for what’s next.",
      detail: bn
        ? "স্কেলযোগ্য সিস্টেমের মজবুত ভিত্তি।"
        : "A strong foundation for the next chapter.",
    },
  ];
  return (
    <div className="rq-engineering" ref={ref} data-rq-reveal>
      <div className="rq-engineering-grid" aria-hidden="true" />
      <div className="rq-engineering-copy">
        <span className="rq-micro-label">
          <i /> RIZQARA / ENGINEERING LAB
        </span>
        <h3 key={mode}>{modes[mode].title}</h3>
        <p>{modes[mode].detail}</p>
        <div
          className="rq-core-modes"
          aria-label={bn ? "থ্রিডি মডেল নির্বাচন" : "Choose a 3D model"}
        >
          {modes.map((item, index) => (
            <button
              type="button"
              key={index}
              aria-pressed={mode === index}
              onClick={() => setMode(index)}
            >
              <item.icon size={15} />
              {item.name}
            </button>
          ))}
        </div>
        <span className="rq-core-instruction">
          <MousePointer2 size={13} />
          {bn ? "মডেল ঘোরাতে ড্র্যাগ করুন" : "Drag to explore the 3D model"}
        </span>
      </div>
      <div className="rq-core-stage">
        <div className="rq-core-cross rq-core-cross-tl" aria-hidden="true" />
        <div className="rq-core-cross rq-core-cross-br" aria-hidden="true" />
        <div className="rq-core-label rq-core-label-top">
          {bn
            ? "ভাবনা / সংযোগ / সম্ভাবনা"
            : "IDEAS / CONNECTIONS / POSSIBILITIES"}
        </div>
        <div className="rq-core-canvas">
          {near ? (
            <CoreBoundary key={revision}>
              <Suspense fallback={<CoreFallback />}>
                <TechCore mode={mode} paused={paused} />
              </Suspense>
            </CoreBoundary>
          ) : (
            <CoreFallback />
          )}
        </div>
        <div className="rq-core-label rq-core-label-bottom">
          <span>
            <i />
            {bn ? "ইন্টার‌্যাক্টিভ ৩ডি" : "INTERACTIVE 3D"}
          </span>
          <span>RQ_0{mode + 1}</span>
        </div>
        <div className="rq-core-controls">
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Play 3D animation" : "Pause 3D animation"}
            aria-pressed={paused}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button
            type="button"
            onClick={() => setRevision((value) => value + 1)}
            aria-label="Reset 3D model orientation"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
