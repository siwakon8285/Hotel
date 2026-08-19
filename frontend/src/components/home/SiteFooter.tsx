import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-heading text-xl font-bold text-white tracking-widest uppercase">
              Aurora
            </h3>
            <p className="text-sm font-light leading-relaxed max-w-xs">
              A refined destination designed for modern luxury and timeless hospitality.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-sm font-medium text-white tracking-widest uppercase mb-6">Explore</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
              <li><Link href="/rooms" className="hover:text-amber-500 transition-colors">Rooms & Suites</Link></li>
              <li><Link href="/dining" className="hover:text-amber-500 transition-colors">Dining</Link></li>
              <li><Link href="/spa" className="hover:text-amber-500 transition-colors">Wellness & Spa</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-sm font-medium text-white tracking-widest uppercase mb-6">Contact</h4>
            <ul className="space-y-3 text-sm font-light">
              <li>123 Horizon Drive</li>
              <li>Coastal City, 90210</li>
              <li className="pt-2"><a href="mailto:info@auroragrand.com" className="hover:text-amber-500 transition-colors">info@auroragrand.com</a></li>
              <li><a href="tel:+1234567890" className="hover:text-amber-500 transition-colors">+1 (234) 567-890</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-sm font-medium text-white tracking-widest uppercase mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-all text-xs">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-all text-xs">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-all text-xs">
                X
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs font-light text-zinc-600">
          <p>© {new Date().getFullYear()} Aurora Grand Hotel. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-zinc-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
