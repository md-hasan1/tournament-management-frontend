type SectionHeadingProps = {
  title: string;
  subtitle?: string;
};

export default function SectionHeading({
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className="mb-8 text-center md:mb-10">
      <h2 className="font-['Oswald'] text-[clamp(2rem,7vw,3.5rem)] leading-tight text-white">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#14d6ea]" />
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-5xl px-2 text-sm leading-7 text-gray-300 md:px-4 md:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
