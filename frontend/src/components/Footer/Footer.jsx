import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import Logo from '../Common/Logo';
import { ROUTES } from '../../constants/routes';
import { CONTACT_EMAIL, CONTACT_PHONE, SOCIAL_LINKS } from '../../constants/config';

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Browse Numbers', to: ROUTES.NUMBERS },
      { label: 'Categories', to: `${ROUTES.HOME}#categories` },
      { label: 'How it Works', to: `${ROUTES.HOME}#how-it-works` },
      { label: 'Coverage', to: `${ROUTES.HOME}#coverage` },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: ROUTES.ABOUT },
      { label: 'Contact', to: ROUTES.CONTACT },
      { label: 'FAQs', to: ROUTES.FAQ },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Centre', to: ROUTES.FAQ },
      { label: 'Track Order', to: ROUTES.ACCOUNT_ORDERS },
      { label: 'Refund Policy', to: ROUTES.REFUND },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: ROUTES.TERMS },
      { label: 'Privacy Policy', to: ROUTES.PRIVACY },
    ],
  },
];

const socialIcons = [
  { icon: FiInstagram, href: SOCIAL_LINKS.instagram },
  { icon: FiFacebook, href: SOCIAL_LINKS.facebook },
  { icon: FiTwitter, href: SOCIAL_LINKS.twitter },
  { icon: FiLinkedin, href: SOCIAL_LINKS.linkedin },
];

const Footer = () => (
  <footer className="bg-black border-t border-white/5 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-12">
        <div className="col-span-2">
          <Logo size="md" />
          <p className="mt-4 text-sm text-cream/50 max-w-xs leading-relaxed">
            India's most trusted marketplace for exclusive VIP, fancy and premium mobile numbers.
            Verified sellers, secure payments, doorstep delivery.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 flex items-center gap-2 text-sm text-gold-400/90 hover:text-gold-300">
            <FiMail size={14} /> {CONTACT_EMAIL}
          </a>
          <p className="mt-1.5 text-sm text-cream/50">{CONTACT_PHONE}</p>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs tracking-[0.2em] text-gold-500/70 uppercase mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-cream/50 hover:text-gold-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-cream/40">© {new Date().getFullYear()} Millionaire Numbers. All rights reserved. Made in India.</p>

        <div className="flex items-center gap-3 text-[11px] text-cream/40 tracking-wide">
          <span className="px-2.5 py-1 rounded-md border border-white/10">UPI</span>
          <span className="px-2.5 py-1 rounded-md border border-white/10">Visa</span>
          <span className="px-2.5 py-1 rounded-md border border-white/10">Mastercard</span>
          <span className="px-2.5 py-1 rounded-md border border-white/10">Razorpay</span>
        </div>

        <div className="flex items-center gap-3">
          {socialIcons.map(({ icon: Icon, href }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-cream/50 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
