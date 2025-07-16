// src/components/shared/Footer.jsx
import { Link } from "react-router";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  HeartHandshake,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Description */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#F59E0B] hover:opacity-90 transition"
            >
              <HeartHandshake className="h-8 w-8" />
              <span className="text-2xl font-bold">Donorly</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting blood donors with those in need.
              <br />
              Every donation saves lives.
            </p>
            <div className="flex gap-4 mt-2">
              <FooterIcon
                href="https://facebook.com/donorly"
                icon={<Facebook />}
              />
              <FooterIcon
                href="https://twitter.com/codeswithrakib"
                icon={<Twitter />}
              />
              <FooterIcon
                href="https://instagram.com/codeswithrakib"
                icon={<Instagram />}
              />
              <FooterIcon
                href="https://linkedin.com/in/codeswithrakib"
                icon={<Linkedin />}
              />
            </div>
          </div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links">
            <FooterLink to="/donation-requests" label="Donation Requests" />
            <FooterLink to="/search-donors" label="Search Donors" />
            <FooterLink to="/blog" label="Blog" />
            <FooterLink to="/about" label="About Us" />
          </FooterColumn>

          {/* Resources */}
          <FooterColumn title="Resources">
            <FooterExternal
              href="https://www.who.int/health-topics/blood-transfusion"
              label="WHO Blood Safety"
            />
            <FooterExternal
              href="https://www.redcross.org/give-blood.html"
              label="Red Cross Donation"
            />
            <FooterExternal
              href="https://www.fda.gov/vaccines-blood-biologics/blood-blood-products"
              label="FDA Blood Guidelines"
            />
            <FooterLink to="/faq" label="FAQ" />
          </FooterColumn>

          {/* Contact Info */}
          <FooterColumn title="Contact Us">
            <ContactItem
              icon={
                <svg
                  className="h-5 w-5 text-gray-400 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
              label="123 Blood Drive Ave, NY 10001"
            />
            <ContactItem
              icon={
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              }
              label="+1 (123) 456-7890"
              link="tel:+11234567890"
            />
            <ContactItem
              icon={
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
              label="support@donorly.com"
              link="mailto:support@donorly.com"
            />
          </FooterColumn>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Donorly. All rights reserved.
            <span className="block sm:inline ml-1">
              Made with <span className="text-[#DC2626]">❤</span> to save lives.
            </span>
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/privacy" className="hover:text-[#F59E0B] transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#F59E0B] transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Reusable Components
const FooterColumn = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
    <ul className="space-y-2">{children}</ul>
  </div>
);

const FooterLink = ({ to, label }) => (
  <li>
    <Link
      to={to}
      className="text-gray-400 hover:text-[#F59E0B] transition-colors"
    >
      {label}
    </Link>
  </li>
);

const FooterExternal = ({ href, label }) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-[#F59E0B] transition-colors"
    >
      {label}
    </a>
  </li>
);

const FooterIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-[#F59E0B] transition-colors"
  >
    {icon}
  </a>
);

const ContactItem = ({ icon, label, link }) => (
  <li className="flex items-start gap-2 text-gray-400">
    {icon}
    {link ? (
      <a href={link} className="hover:text-[#F59E0B] transition">
        {label}
      </a>
    ) : (
      <span>{label}</span>
    )}
  </li>
);

export default Footer;
