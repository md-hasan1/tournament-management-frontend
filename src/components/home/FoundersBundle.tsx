"use client";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const FoundersBundle = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const handleBundleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    // Check if user is COACH or MANAGER
    if (user.role !== "COACH" && user.role !== "MANAGER") {
      router.push("/auth/signin");
      return;
    }

    // User is authenticated and has correct role
    router.push("/founder-bundle");
  };

  return (
    <section className="w-full  py-16 md:py-24 relative overflow-hidden min-h-125 flex items-center justify-center">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/founderbandle.png"
          alt="Founders bundle background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 " />
      </div>

      <div className="max-w-[90%] mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Section Header */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-['Oswald']">
          Founders bundle
        </h2>

        <p
          className="text-gray-200 text-lg mb-8 leading-relaxed max-w-2xl mx-auto"
          style={{ fontFamily: "Open Sans" }}
        >
          Pricing for youth will be 4 tournaments for $1,300 and for adults will
          be $2200. The teams will be able to use it at any point in the year.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleBundleClick}
          className="bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold py-3 px-8 rounded-lg shadow-lg transition mb-6"
        >
          Buy Founders Bundle
        </button>

        {/* Contact Link */}
        <p className="text-gray-400 text-sm">
          Have questions?{" "}
          <Link href="/faq/#contact" className="text-[#35BACB] hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
};

export default FoundersBundle;
