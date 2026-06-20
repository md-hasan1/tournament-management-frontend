import waterMarkTop from "@/assets/wartermark-hit-top.png";
import { campFaqItems } from "@/components/proving-camp/data";
import SectionHeading from "@/components/proving-camp/sections/SectionHeading";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function FaqSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="pointer-events-none absolute top-40 right-0 h-100 w-90 opacity-70 sm:h-80 sm:w-64 md:h-110 md:w-100">
        <Image
          src={waterMarkTop}
          alt="Watermark"
          className="w-full h-full object-cover scale-x-[-1]"
        />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Frequently Asked Questions" />

        <div className="mx-auto max-w-6xl space-y-2.5">
          {campFaqItems.map((item) => (
            <details
              key={item.q}
              className="group overflow-hidden rounded-lg border border-white/10 bg-[#161616] transition open:border-cyan-300/50"
            >
              <summary className="flex list-none cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left marker:content-none sm:px-5">
                <span className="text-sm font-medium text-gray-100 sm:text-base">
                  {item.q}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-cyan-300 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="border-t border-white/8 px-4 py-4 sm:px-5">
                <p className="text-sm leading-7 text-gray-300">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
