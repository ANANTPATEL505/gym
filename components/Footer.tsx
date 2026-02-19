import Link from 'next/link'
import { Dumbbell, MapPin, Phone, Mail, Instagram, Twitter, Facebook, Youtube } from 'lucide-react'

const footerLinks = {
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  Programs: [
    { label: 'Strength Training', href: '/classes' },
    { label: 'HIIT & Cardio', href: '/classes' },
    { label: 'Yoga & Flexibility', href: '/classes' },
    { label: 'CrossFit', href: '/classes' },
  ],
  Support: [
    { label: 'FAQ', href: '#' },
    { label: 'Contact Us', href: '/#contact' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-7 h-7 text-[#E8192C]" />
              <span className="font-bebas text-2xl tracking-widest grad-text">IRONPEAK</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Transform your body and mind at the most advanced fitness facility in the city. Elite equipment, world-class trainers.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E8192C] shrink-0" />
                <span>123 Fitness Street, Gym City, GC 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E8192C] shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E8192C] shrink-0" />
                <span>info@ironpeak.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="font-bebas text-lg tracking-wider text-white mb-4">{cat}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-gray-500 hover:text-white text-sm transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} IronPeak Gym. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#E8192C]/20 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}