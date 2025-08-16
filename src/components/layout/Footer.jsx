// src/components/shared/Footer.jsx
import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  HeartHandshake,
  Droplet,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";

// Memoized Footer Logo Component
const FooterLogo = React.memo(() => (
  <Link
    to="/"
    className="flex items-center gap-2 text-[#F59E0B] hover:opacity-90 transition"
    aria-label="LifeFlow Home"
  >
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <Droplet className="h-8 w-8 text-red-500" />
    </motion.div>
    <span className="text-2xl font-bold">LifeFlow</span>
  </Link>
));

// Memoized Social Icon Component
const FooterIcon = React.memo(({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-[#F59E0B] transition-colors"
    aria-label={label}
    whileHover={{ y: -3, scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    {icon}
  </motion.a>
));

// Memoized Footer Column Component
const FooterColumn = React.memo(({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-800 pb-2">
      {title}
    </h3>
    <ul className="space-y-2">{children}</ul>
  </div>
));

// Memoized Footer Link Component
const FooterLink = React.memo(({ to, label }) => (
  <li>
    <motion.div whileHover={{ x: 5 }}>
      <Link
        to={to}
        className="text-gray-400 hover:text-[#F59E0B] transition-colors flex items-center gap-1"
      >
        <span>{label}</span>
      </Link>
    </motion.div>
  </li>
));

// Memoized Footer External Link Component
const FooterExternal = React.memo(({ href, label }) => (
  <li>
    <motion.div whileHover={{ x: 5 }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#F59E0B] transition-colors flex items-center gap-1"
      >
        <span>{label}</span>
        <ExternalLink className="h-3 w-3" />
      </a>
    </motion.div>
  </li>
));

// Memoized Contact Item Component
const ContactItem = React.memo(({ icon, label, link }) => (
  <li className="flex items-start gap-3 text-gray-400">
    <div className="mt-0.5 text-[#F59E0B]">{icon}</div>
    {link ? (
      <motion.a
        href={link}
        className="hover:text-[#F59E0B] transition"
        whileHover={{ x: 3 }}
      >
        {label}
      </motion.a>
    ) : (
      <span>{label}</span>
    )}
  </li>
));

// Memoized Donation Stats Component
const DonationStats = React.memo(() => (
  <div className="bg-gray-800 rounded-lg p-4 mt-4">
    <h4 className="font-medium text-white mb-3">Our Impact</h4>
    <div className="grid grid-cols-3 gap-3 text-center">
      <div>
        <div className="text-2xl font-bold text-red-500">12K+</div>
        <div className="text-xs text-gray-400">Donors</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-red-500">8.5K</div>
        <div className="text-xs text-gray-400">Lives Saved</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-red-500">24/7</div>
        <div className="text-xs text-gray-400">Support</div>
      </div>
    </div>
  </div>
));

// Memoized Newsletter Component
const Newsletter = React.memo(() => {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log("Subscribed with:", email);
    setSubscribed(true);
    setEmail("");

    // Reset subscription status after 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4">
      <h4 className="font-medium text-white mb-3">Stay Updated</h4>
      {subscribed ? (
        <div className="text-green-400 text-sm py-2 text-center">
          Thank you for subscribing!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-gray-700 text-white px-3 py-2 rounded-l-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-r-md text-sm font-medium transition-colors"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Get updates on blood drives and donation opportunities.
          </p>
        </form>
      )}
    </div>
  );
});

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Description */}
          <div className="space-y-4">
            <FooterLogo />
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting blood donors with those in need.
              <br />
              Every donation saves lives.
            </p>
            <div className="flex gap-4 mt-2">
              <FooterIcon
                href="https://facebook.com/codeswithrakib"
                icon={<Facebook className="h-5 w-5" />}
                label="Facebook"
              />
              <FooterIcon
                href="https://twitter.com/codeswithrakib"
                icon={<Twitter className="h-5 w-5" />}
                label="Twitter"
              />
              <FooterIcon
                href="https://instagram.com/codeswithrakib"
                icon={<Instagram className="h-5 w-5" />}
                label="Instagram"
              />
              <FooterIcon
                href="https://linkedin.com/in/codeswithrakib"
                icon={<Linkedin className="h-5 w-5" />}
                label="LinkedIn"
              />
            </div>

            {/* Donation Stats */}
            <DonationStats />

            {/* Newsletter */}
            <Newsletter />
          </div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links">
            <FooterLink to="/donation-requests" label="Donation Requests" />
            <FooterLink to="/search-donors" label="Search Donors" />
            <FooterLink to="/blog" label="Blog" />
            <FooterLink to="/about" label="About Us" />
            <FooterLink to="/events" label="Blood Drives" />
            <FooterLink to="/volunteer" label="Volunteer" />
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
            <FooterLink to="/eligibility" label="Donation Eligibility" />
            <FooterLink to="/blood-types" label="Blood Type Information" />
          </FooterColumn>

          {/* Contact Info */}
          <FooterColumn title="Contact Us">
            <ContactItem
              icon={<MapPin className="h-5 w-5" />}
              label="123 Blood Drive Ave, NY 10001"
            />
            <ContactItem
              icon={<Phone className="h-5 w-5" />}
              label="+1 (123) 456-7890"
              link="tel:+11234567890"
            />
            <ContactItem
              icon={<Mail className="h-5 w-5" />}
              label="support@LifeFlow.com"
              link="mailto:support@LifeFlow.com"
            />

            {/* Emergency Contact */}
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-medium text-sm">
                  Emergency Hotline
                </span>
              </div>
              <ContactItem
                icon={<Phone className="h-5 w-5 text-red-400" />}
                label="+1 (800) 555-BLOOD"
                link="tel:+18005552566"
              />
            </div>

            {/* Donate Button */}
            <motion.div
              className="mt-6"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/donate"
                className="block w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-center py-3 px-4 rounded-md font-medium shadow-lg transition-all"
                aria-label="Donate blood now"
              >
                Donate Blood Now
              </Link>
            </motion.div>
          </FooterColumn>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} LifeFlow. All rights reserved.
            <span className="block sm:inline ml-1">
              Made with <span className="text-red-500">❤</span> to save lives.
            </span>
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-4">
            <Link
              to="/privacy"
              className="hover:text-[#F59E0B] transition flex items-center gap-1"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-[#F59E0B] transition flex items-center gap-1"
            >
              Terms of Service
            </Link>
            <Link
              to="/accessibility"
              className="hover:text-[#F59E0B] transition flex items-center gap-1"
            >
              Accessibility
            </Link>
            <Link
              to="/sitemap"
              className="hover:text-[#F59E0B] transition flex items-center gap-1"
            >
              Sitemap
            </Link>
          </div>

          <div className="mt-4 text-xs">
            <p>
              LifeFlow is a registered 501(c)(3) nonprofit organization. EIN:
              12-3456789
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
