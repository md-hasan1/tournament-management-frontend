import waterMark from "@/assets/wattermark.png";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-black sm:min-h-[85vh] lg:min-h-screen">
      <Image
        src="/images/Hero.png"
        alt=""
        fill
        priority
        quality={80}
        sizes="100vw"
        className="-z-10 object-cover object-[62%_center] sm:object-center"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/35 sm:from-black/80 sm:via-black/55 sm:to-black/25" />

      {/* Watermark logo behind text */}
      <div className="pointer-events-none absolute inset-0 hidden items-center justify-start overflow-hidden lg:flex">
        <Image
          src={waterMark}
          alt=""
          width={1000}
          height={1000}
          quality={75}
          sizes="50vw"
          className="h-[88%] w-[48%] max-w-none opacity-85"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4 py-14 sm:px-8 sm:py-20 md:px-12 lg:px-20 lg:py-24 xl:px-24">
        <span className="mb-4 inline-flex rounded-full border border-[#35BACB]/45 bg-[#35BACB]/10 px-4 py-2 text-[11px] font-semibold text-[#35BACB] sm:text-sm">
          The Proving Ground
        </span>

        <h1 className="font-oswald mb-5 max-w-4xl text-[30px] leading-[1.18] font-bold tracking-tight text-white sm:text-[48px] sm:leading-[1.2] md:text-[58px] lg:text-[72px] xl:text-[80px]">
          YOUR PATH TO <br className="hidden sm:block" /> THE CROWN STARTS HERE.
        </h1>

        <p
          className="mb-6 max-w-120 text-[14px] leading-[1.7] text-[#E3E3E3] sm:mb-7 sm:max-w-2xl sm:text-base"
          style={{
            fontFamily: "Open Sans",
            textShadow: "1px 1px 6px rgba(0,0,0,0.5)",
          }}
        >
          In Europe they learn on concrete; in Brazil they learn on the sand; in
          DFW, we bring the field to you. Small-sided tournaments. Prove
          yourself. Rise to the Royal Cup.
        </p>

        <div className="mb-2 flex w-full max-w-md flex-col gap-3 sm:mb-4 sm:max-w-none sm:w-auto sm:flex-row sm:gap-4">
          <Link href="/tournament-registration" className="w-full sm:w-auto">
            <button className="w-full rounded-sm bg-[#35BACB] px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:bg-[#A232D6] sm:w-auto sm:text-base">
              Prove Yourself
            </button>
          </Link>
          <button className="w-full rounded-sm border border-[#35BACB] bg-black px-6 py-3 text-sm font-bold text-[#35BACB] shadow-lg transition hover:bg-[#A232D6] hover:text-black sm:w-auto sm:text-base">
            View Schedule
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
