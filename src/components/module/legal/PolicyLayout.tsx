import React from "react";

type PolicyLayoutProps = {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
};

export default function PolicyLayout({
  title,
  effectiveDate,
  children,
}: PolicyLayoutProps) {
  return (
    <div className="bg-black min-h-screen text-white">
      <section className="border-b border-[#2a2a2a] bg-[#0b0b0b]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-[#35BACB] text-sm mb-2">Crown & Pitch Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold font-['Oswald'] mb-3">
            {title}
          </h1>
          <p className="text-gray-300 text-sm">Effective Date: {effectiveDate}</p>
          <p className="text-gray-400 mt-3 text-sm">
            Crown & Pitch LLC | Dallas-Fort Worth Metroplex, Texas | www.crownandpitch.com
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-8 text-gray-200 leading-7">{children}</div>
      </section>
    </div>
  );
}
