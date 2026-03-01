import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  BookOpen,
  Layers,
  ClipboardCheck,
  CreditCard,
  Library,
  FileText,
  BarChart3,
  Bell,
  Shield,
  Zap,
  ArrowRight,
  Star,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── data ─── */
const features = [
  {
    icon: Users,
    title: "Student Management",
    desc: "Complete student profiles, enrollment tracking, and academic records in one place.",
  },
  {
    icon: BookOpen,
    title: "Course Tracking",
    desc: "Manage courses, prerequisites, and curriculum across all departments effortlessly.",
  },
  {
    icon: BarChart3,
    title: "Grade Analytics",
    desc: "Real-time GPA calculations, grade distributions, and performance insights.",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance System",
    desc: "Digital attendance with automated reports, patterns, and early-alert notifications.",
  },
  {
    icon: Library,
    title: "Library System",
    desc: "Book catalog, borrowing management, due-date tracking, and availability search.",
  },
  {
    icon: CreditCard,
    title: "Fee Management",
    desc: "Tuition invoicing, payment processing, installment plans, and receipt generation.",
  },
  {
    icon: FileText,
    title: "Exam Portal",
    desc: "Schedule exams, assign rooms, manage results, and generate transcripts.",
  },
  {
    icon: Bell,
    title: "Announcements",
    desc: "Campus-wide or department-specific notifications delivered instantly.",
  },
  {
    icon: Layers,
    title: "Section Manager",
    desc: "Assign teachers, set schedules, manage room capacity and timetable conflicts.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    desc: "Admin, teacher, and student roles with fine-grained permission controls.",
  },
  {
    icon: Zap,
    title: "Real-Time API",
    desc: "Lightning-fast RESTful backend built on Bun & Elysia for instant data access.",
  },
  {
    icon: GraduationCap,
    title: "Digital ID Card",
    desc: "Generate and verify student identity cards with QR codes digitally.",
  },
];

const stats = [
  { value: 1200, suffix: "+", label: "Active Students" },
  { value: 50, suffix: "+", label: "Courses Managed" },
  { value: 99.9, suffix: "%", label: "Uptime Guarantee" },
  { value: 24, suffix: "/7", label: "Support Available" },
];

const testimonials = [
  {
    name: "Aung Kyaw Moe",
    role: "Computer Science, Year 3",
    quote:
      "AdipatiMon transformed how I track my grades and attendance. The dashboard gives me a clear picture of my academic journey at a glance.",
    avatar: "AK",
  },
  {
    name: "Thida Win",
    role: "Faculty Administrator",
    quote:
      "Managing enrollment for 500+ students used to take days. Now it takes minutes. The fee management module alone saved us countless hours.",
    avatar: "TW",
  },
  {
    name: "Dr. Min Thura",
    role: "Head of Department",
    quote:
      "The analytics dashboard provides insights we never had before. Grade distributions, attendance patterns — it's all there in real time.",
    avatar: "MT",
  },
];

/* ─── component ─── */
export const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Hero entrance ── */
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(".hero-badge", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-title span", {
          y: 60,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
        })
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          ".hero-cta",
          { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 },
          "-=0.3",
        )
        .from(
          ".hero-image",
          {
            y: 60,
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6",
        );

      /* ── Dashboard float ── */
      gsap.to(".hero-image", {
        y: -15,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      /* ── Features stagger ── */
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: "power2.out",
      });

      /* ── Stats counter ── */
      const statEls = gsap.utils.toArray<HTMLElement>(".stat-value");
      statEls.forEach((el) => {
        const target = parseFloat(el.dataset.target || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
          onUpdate() {
            el.textContent =
              target % 1 === 0
                ? Math.round(obj.val).toLocaleString()
                : obj.val.toFixed(1);
          },
        });
      });

      /* ── Stats container ── */
      gsap.from(".stat-item", {
        scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
      });

      /* ── Testimonials ── */
      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
      });

      /* ── CTA ── */
      gsap.from(ctaRef.current, {
        scrollTrigger: { trigger: ctaRef.current, start: "top 85%" },
        y: 40,
        opacity: 0,
        scale: 0.97,
        duration: 0.8,
      });

      /* ── Section titles ── */
      gsap.utils.toArray<HTMLElement>(".section-title").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          y: 30,
          opacity: 0,
          duration: 0.7,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className="landing-page bg-[#060b18] text-white overflow-x-hidden"
    >
      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 backdrop-blur-xl bg-[#060b18]/70">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Adipati<span className="gradient-text">Mon</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
              <button
                onClick={() => scrollTo("features")}
                className="hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollTo("stats")}
                className="hover:text-white transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollTo("testimonials")}
                className="hover:text-white transition-colors"
              >
                Testimonials
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex text-sm text-slate-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-500/40"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-16"
      >
        {/* grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.07)_1px,transparent_1px)] bg-[size:64px_64px]" />
        {/* radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-blue-600/15 via-indigo-600/5 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* text */}
            <div>
              <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
                <Zap className="w-3 h-3" />
                Built with Bun & Elysia — Lightning Fast
              </div>

              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
                <span className="block">The Future of</span>
                <span className="block gradient-text">Student Services</span>
                <span className="block">Starts Here</span>
              </h1>

              <p className="hero-sub mt-6 text-lg text-slate-400 max-w-lg leading-relaxed">
                A comprehensive platform to manage students, courses, grades,
                attendance, fees, and more — all from one beautiful dashboard.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="hero-cta inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scrollTo("features")}
                  className="hero-cta inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:-translate-y-0.5"
                >
                  Explore Features
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* dashboard preview */}
            <div className="hero-image relative lg:ml-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/30 border border-white/10">
                <img
                  src="/dashboard-preview.png"
                  alt="AdipatiMon Dashboard Preview"
                  className="w-full rounded-2xl"
                />
                {/* glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060b18]/60 via-transparent to-transparent pointer-events-none" />
              </div>
              {/* decorative glow behind */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" ref={featuresRef} className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="section-title text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 mb-3">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Everything you need to{" "}
              <span className="gradient-text">run a campus</span>
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              From enrollment to graduation, every tool your institution needs —
              in one unified platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="feature-card group relative p-6 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300"
                >
                  <div className="mb-4 inline-flex p-2.5 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/10 group-hover:border-blue-500/30 transition-colors">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section id="stats" ref={statsRef} className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 p-12 lg:p-16">
            {/* bg glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />

            <div className="section-title text-center mb-12 relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Trusted by <span className="gradient-text">institutions</span>
              </h2>
              <p className="mt-3 text-slate-400">
                Numbers that speak for themselves.
              </p>
            </div>

            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="stat-item text-center">
                  <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    <span className="stat-value" data-target={s.value}>
                      0
                    </span>
                    <span className="gradient-text">{s.suffix}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400 font-medium">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section
        id="testimonials"
        ref={testimonialsRef}
        className="py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="section-title text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 mb-3">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Loved by{" "}
              <span className="gradient-text">educators & students</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="testimonial-card relative p-8 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed text-sm mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div
            ref={ctaRef}
            className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-blue-600 to-indigo-600 p-12 lg:p-20 text-center"
          >
            {/* decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Ready to modernize your campus?
              </h2>
              <p className="mt-4 text-blue-100 text-lg max-w-xl mx-auto">
                Join institutions already transforming their student services
                with AdipatiMon.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl bg-white text-blue-700 hover:bg-blue-50 shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Start For Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scrollTo("features")}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl border border-white/30 hover:bg-white/10 transition-all hover:-translate-y-0.5"
                >
                  View Features
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-white/5 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">
                  Adipati<span className="gradient-text">Mon</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Modern student services platform built for the next generation
                of educational institutions.
              </p>
              <div className="flex gap-3 mt-6">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-2 rounded-lg border border-white/5 bg-white/[0.03] hover:bg-white/10 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* links */}
            {[
              {
                title: "Product",
                links: ["Features", "Dashboard", "API", "Pricing"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Guides", "Changelog", "Support"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">
              © 2026 AdipatiMon. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-slate-600">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
