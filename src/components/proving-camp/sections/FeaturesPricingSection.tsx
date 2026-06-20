import { campFeatures } from "@/components/proving-camp/data";

export default function FeaturesPricingSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
      <h2 className="text-center font-['Oswald'] text-[clamp(2rem,7vw,3.5rem)] leading-tight text-white">
        Everything your Player Needs. <br /> Nothing they don&lsquo;t.
        Everything they Deserve.
      </h2>
      <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#14d6ea]" />

      <div className="mx-auto mt-6 max-w-4xl rounded-xl border border-white/10 bg-[#121212] p-5 md:p-7">
        <ul className="space-y-3 text-base text-gray-200 sm:text-lg">
          {campFeatures.map((feature) => (
            <li
              key={feature}
              className="grid grid-cols-[auto_1fr] items-start gap-3 leading-relaxed"
            >
              <span className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
              <span className="leading-7 sm:leading-8">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-6 max-w-2xl rounded-md bg-[#33cde0] px-4 py-6 text-center text-black sm:px-6">
        <p className="font-['Oswald'] text-2xl font-semibold sm:text-3xl">
          $225 per player per 3-day session
        </p>
        <p className="mt-2 text-sm leading-6 font-semibold sm:text-base">
          Includes camp ball, branded t-shirt, and a written player evaluation
          delivered at the end of the week. No club membership required.
        </p>
      </div>
    </section>
  );
}
