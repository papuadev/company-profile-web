import { useRef, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { HOME_DATA, STATIC_PRODUCTS, ABOUT_DATA } from "../data/constants";
import TeamsSection from "../components/organisms/TeamsSection";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-4rem)] relative">
          <img
            src="/img/hero.webp"
            alt="HMNS Perfume Hero"
            className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
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
                src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800"
                alt="HMNS Perfume Crafting"
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
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
                    src={product.image}
                    alt={`HMNS Product: ${product.name}`}
                    className="object-cover w-full h-full grayscale opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
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

      {/* Teams Section */}
      <TeamsSection />
    </div>
  );
}
