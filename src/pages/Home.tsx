import { useRef, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { HOME_DATA, STATIC_PRODUCTS, ABOUT_DATA, TESTIMONIALS, SOCIAL_LINKS } from "../data/constants";
import TeamsSection from "../components/organisms/TeamsSection";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleImages, setVisibleImages] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleImages((prev) => {
          const newState = { ...prev };
          let changed = false;
          entries.forEach((entry) => {
            const id = entry.target.id;
            if (newState[id] !== entry.isIntersecting) {
              newState[id] = entry.isIntersecting;
              changed = true;
            }
          });
          return changed ? newState : prev;
        });
      },
      { threshold: 0.5 }
    );
    const elements = document.querySelectorAll(".scroll-color-target");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isMobile]);

  const handleMouseEnter = () => {
    setIsVisible(true);
    setIsFadingOut(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setIsFadingOut(false);
    timeoutRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, 1000);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const remaining =
        videoRef.current.duration - videoRef.current.currentTime;
      if (remaining <= 1.5 && !isFadingOut) {
        setIsFadingOut(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>Home | HMNS</title>
        <meta name="description" content={HOME_DATA.heroSubtitle} />
      </Helmet>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative group w-full min-h-[calc(100vh-4rem)] flex flex-col md:flex-row items-center overflow-hidden bg-zinc-950 cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Full-screen Video Overlay */}
        {!isMobile && (
          <video
            ref={videoRef}
            src="/video/sprayer.mp4"
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsVisible(false)}
            className={`absolute inset-0 z-30 w-full h-full object-cover mix-blend-screen transition-opacity pointer-events-none scale-x-[-1] ${
              isVisible && !isFadingOut
                ? "opacity-100 duration-500"
                : "opacity-0 duration-1000"
            }`}
          />
        )}

        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-4rem)] relative">
          <img
            id="hero-img"
            src={HOME_DATA.image}
            alt="HMNS Perfume Hero"
            className={`w-full h-full object-cover object-center md:grayscale md:group-hover:grayscale-0 transition-all duration-1000 scroll-color-target ${
              isMobile && !visibleImages["hero-img"] ? "grayscale" : ""
            }`}
          />
        </div>
        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-8 md:p-16 lg:p-24 space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
            {HOME_DATA.heroTitle}
          </h1>
          <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
            {HOME_DATA.heroSubtitle}
          </p>
          <a
            href="#products"
            className="mt-4 inline-flex h-14 items-center justify-center rounded-none border border-white bg-white px-10 text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-transparent hover:text-white"
          >
            Explore Collection
          </a>
        </div>
      </section>

      {/* About Section on Landing Page */}
      <section
        id="about"
        className="w-full py-24 md:py-32 bg-zinc-950 border-b border-white/10"
      >
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                {ABOUT_DATA.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {ABOUT_DATA.content}
              </p>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-sm bg-muted/50">
              <img
                id="about-img"
                src={ABOUT_DATA.image}
                alt="HMNS Perfume Crafting"
                className={`object-cover w-full h-full md:grayscale md:hover:grayscale-0 transition-all duration-700 scroll-color-target ${
                  isMobile && !visibleImages["about-img"] ? "grayscale" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section (Limited to 3) */}
      <section
        id="products"
        className="w-full py-24 bg-background border-b border-white/10"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
              Latest Creations
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Mahakarya terbaru dari HMNS untuk menemani setiap langkah Anda.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {STATIC_PRODUCTS.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden bg-card text-card-foreground transition-all"
              >
                <div className="aspect-[4/5] overflow-hidden bg-zinc-900">
                  <img
                    id={`product-img-${product.id}`}
                    src={product.image}
                    alt={`HMNS Product: ${product.name}`}
                    className={`object-cover w-full h-full md:grayscale md:opacity-90 transition-all duration-500 group-hover:scale-105 md:group-hover:grayscale-0 md:group-hover:opacity-100 scroll-color-target ${
                      isMobile && !visibleImages[`product-img-${product.id}`] ? "grayscale" : ""
                    }`}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold tracking-wide">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <p className="mt-4 font-medium text-white">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-24 bg-zinc-950 border-b border-white/10 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
              What They Say
            </h2>
            <p className="max-w-[700px] text-gray-400 md:text-xl/relaxed">
              Stories from our beloved community of fragrance enthusiasts.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex flex-col justify-between p-8 bg-zinc-900 border border-white/5 rounded-xl hover:border-white/20 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center space-x-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? "text-yellow-500"
                            : "text-zinc-700"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <TeamsSection />

      {/* Social Media Section */}
      <section className="w-full py-16 bg-zinc-950 border-t border-white/10 text-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tighter md:text-4xl mb-8">
            Connect With Us
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {SOCIAL_LINKS.map((social) => {
              let Icon;
              switch (social.name.toLowerCase()) {
                case "instagram":
                  Icon = (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  );
                  break;
                case "twitter":
                  Icon = (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  );
                  break;
                case "youtube":
                  Icon = (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  );
                  break;
                case "linkedin":
                  Icon = (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  );
                  break;
                case "tiktok":
                  Icon = (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  );
                  break;
                default:
                  Icon = null;
              }

              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-zinc-900 border border-white/10 hover:border-white/50 hover:bg-zinc-800 transition-all duration-300"
                  aria-label={social.name}
                >
                  {Icon}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
