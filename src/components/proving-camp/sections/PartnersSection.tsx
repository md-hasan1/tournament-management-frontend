import Image from "next/image";

import { campPartnerLogos } from "@/components/proving-camp/data";

export default function PartnersSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h3 className="text-center font-['Oswald'] text-[clamp(1.8rem,6vw,3rem)] leading-tight text-white">
        Proud partners of the Crown & Pitch Proving Camp
      </h3>

      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4">
        {campPartnerLogos.map((partner, index) => (
          <div
            key={partner.name}
            className="relative h-20 overflow-hidden rounded-md border border-white/15 bg-white sm:h-28 md:h-36"
          >
            <Image
              src={partner.image}
              alt={partner.name}
              fill
              className={
                index === 3
                  ? "object-cover"
                  : index === 2
                    ? "object-contain p-0.5"
                    : "object-contain p-2"
              }
              sizes="(max-width: 800px) 50vw, (max-width: 1024px) 25vw, 220px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
