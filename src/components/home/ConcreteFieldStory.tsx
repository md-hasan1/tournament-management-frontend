"use client";

import player1 from "@/assets/p1.png";
import player2 from "@/assets/p2.png";
import player3 from "@/assets/p3.png";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

const playerImages = [player1, player2, player3];

const features = [
  {
    id: "raw-talent",
    title: "Raw Talent",
    description: "Developing individual brilliance in tight spaces.",
  },
  {
    id: "street-grit",
    title: "Street Grit",
    description: "The resilience found only on the concrete courts.",
  },
];

const ConcreteFieldStory = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = useMemo(() => playerImages.length, []);
  const canNavigate = totalImages > 1;

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
  }, [totalImages]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1,
    );
  }, [totalImages]);
  return (
    <section className="w-full relative py-16 md:py-24 overflow-hidden min-h-150">
      {/* Background with soccer field pattern */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-90"
        style={{
          backgroundImage: "url('/images/hexagon.png')",
        }}
      />
      {/* Hexagon pattern overlay */}
      {/* <div
        className="absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle, transparent 30%, rgba(0,0,0,0.3) 31%), 
                           radial-gradient(circle, transparent 30%, rgba(0,0,0,0.3) 31%)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      /> */}
      {/* Greenish gradient overlay for that soccer field look */}
      {/* <div className="absolute inset-0 bg-linear-to-br from-[#2d3d1f]/30 via-[#1a2810]/25 to-[#2d3d1f]/35 z-0" /> */}

      <div className="max-w-[90%] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Right - Player Card (appears first on mobile) */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div
              className="bg-gray-100 rounded-lg overflow-hidden shadow-2xl max-w-md w-full relative"
              style={{ aspectRatio: "9/11" }}
            >
              {/* Decorative dots */}
              {/* <div className="absolute top-4 right-4 flex gap-1 z-10">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              </div> */}

              {/* Player Image Carousel */}
              <div className="absolute inset-0 w-full overflow-hidden bg-gray-300">
                {/* Images with smooth transition */}
                {playerImages.map((image, index) => (
                  <div
                    key={image.src}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Soccer player ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 90vw, 32rem"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-contain"
                    />
                  </div>
                ))}

                {/* Previous Button */}
                <button
                  type="button"
                  onClick={prevImage}
                  disabled={!canNavigate}
                  className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-black/65 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35BACB] touch-manipulation disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Previous image, current ${currentImageIndex + 1} of ${totalImages}`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={nextImage}
                  disabled={!canNavigate}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-black/65 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35BACB] touch-manipulation disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Next image, current ${currentImageIndex + 1} of ${totalImages}`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                  {playerImages.map((image, index) => (
                    <button
                      type="button"
                      key={image.src}
                      onClick={() => {
                        setCurrentImageIndex(index);
                      }}
                      data-active={index === currentImageIndex}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentImageIndex
                          ? "bg-[#35BACB]"
                          : "bg-white/50"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Left Content (appears second on mobile) */}
          <div className="order-2 lg:order-1">
            <h2
              className={`font-oswald mb-4 text-[72px] leading-[1.2] font-bold`}
            >
              The concrete field story
            </h2>
            <p
              className="text-[16px] mb-8"
              style={{
                color: "var(--Text-2nd, #E3E3E3)",
                fontFamily: "Open Sans",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              Our street soccer philosophy focuses on technical mastery, grit,
              and the raw energy of the asphalt. Born on the streets, perfected
              on the pitch. Every touch matters when space is a luxury.
            </p>

            {/* Feature Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-transparent backdrop-blur-sm border-l-4 border-[#35BACB] border p-5 rounded"
                >
                  <h3 className="text-white text-xl font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConcreteFieldStory;
