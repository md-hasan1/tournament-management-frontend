import waterMarkTop from "@/assets/wartermark-hit-top.png";
import Image from "next/image";

export default function ReadyToProveSection() {
  return (
    <section className="relative py-14 md:py-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={waterMarkTop}
          alt="Watermark"
          className="h-64 w-40 opacity-60 sm:h-80 sm:w-52 md:h-96 md:w-60"
        />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h3 className="font-['Oswald'] text-[clamp(1.9rem,6vw,3rem)] leading-tight text-white">
          Ready to Prove It?
        </h3>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-300 md:text-base">
          Spots fill up fast. Register your player below. Before completing
          payment you will be asked to acknowledge our refund and cancellation
          policy — please read it carefully.
        </p>
        <p className="mx-auto mt-5 max-w-4xl rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-5 text-left text-sm leading-7 sm:px-6 sm:text-base md:px-8">
          <span className="font-semibold text-[#35BACB]">Session Details:</span>{" "}
          Our single session runs from 9:00 AM to 12:00 PM (drop-off 8:45 AM)
          and welcomes players ages 8–14. Players aged 8–10 focus on building
          strong technical fundamentals, confidence, and enjoyment through
          engaging, game-based sessions. Players aged 11–14 are placed in more
          challenging settings emphasizing technical refinement, tactical
          understanding, and competitive play. All players benefit from
          differentiated coaching tailored to their age and skill level. Our
          staff and camp director will assess players on day 1 and may adjust
          group placements to ensure each player is in the appropriate skill
          level for the rest of camp.
        </p>
      </div>
    </section>
  );
}
