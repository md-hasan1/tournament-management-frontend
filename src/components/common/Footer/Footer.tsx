import logo from "@/assets/logo (2).png";
import { Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  explore: [
    { name: "Tournaments", href: "/tournaments" },
    { name: "Standings", href: "/standings" },
    { name: "Crown series", href: "/crown-series" },
    { name: "Royal cup", href: "/royal-cup" },
  ],
  information: [
    { name: "How it works", href: "/how-it-works" },
    { name: "Rules", href: "/rules" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
  ],
  legal: [
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Terms and Conditions", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ],
  contact: [
    {
      name: "info@crownandpitch.com",
      href: "mailto:info@crownandpitch.com",
      icon: Mail,
    },
    { name: "(214) 945-8471", href: "tel:2149458471", icon: Phone },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Instagram", href: "#", icon: Instagram },
];

const isInternalHref = (href: string) => href.startsWith("/");

export const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#333] w-full">
      <div className="mx-auto container px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-10">
          {/* Logo and description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 font-['Oswald']">
            <Link
              href="/"
              className="flex items-center gap-1 text-2xl font-bold mb-4"
            >
              <Image
                src={logo}
                alt="Crown and Pitch Logo"
                className="h-auto w-36 sm:w-44 lg:w-50"
                priority
              />
            </Link>
            <p className="mb-6 max-w-sm text-sm text-gray-400">
              Building the future of players through small-sided soccer with
              street mastery and merit-based competition.
            </p>
            {/* Social Links */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-[#35BACB] transition"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div className="min-w-0">
            <h3 className="font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#35BACB] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Links */}
          <div className="min-w-0">
            <h3 className="font-semibold text-white mb-4">Information</h3>
            <ul className="space-y-3">
              {footerLinks.information.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#35BACB] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="min-w-0">
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#35BACB] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              {footerLinks.contact.map((link) => (
                <li key={link.name}>
                  {isInternalHref(link.href) ? (
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 break-all text-sm text-gray-400 transition-colors hover:text-[#35BACB]"
                    >
                      <link.icon className="h-4 w-4 text-[#35BACB]" />
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="flex items-center gap-2 break-all text-sm text-gray-400 transition-colors hover:text-[#35BACB]"
                    >
                      <link.icon className="h-4 w-4 text-[#35BACB]" />
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-[#333] pt-6 sm:mt-12">
          <p className="text-center text-xs text-gray-500 sm:text-sm">
            © {new Date().getFullYear()} Crown & Pitch, LLC. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
