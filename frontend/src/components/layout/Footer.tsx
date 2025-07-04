import Link from 'next/link'
import { Calendar, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-2xl font-bold">ComeBookUs</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              The all-in-one appointment management platform for solo entrepreneurs. 
              Accept bookings, process payments, and delight your clients.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/comebookus" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://twitter.com/comebookus" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://linkedin.com/company/comebookus" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://instagram.com/comebookus" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.036.388a6.5 6.5 0 00-2.357 1.533A6.5 6.5 0 00.388 5.036c-.184.484-.306 1.058-.34 2.005C.013 7.989 0 8.396 0 12.017s.013 4.028.048 4.976c.034.947.156 1.521.34 2.005a6.5 6.5 0 001.533 2.357 6.5 6.5 0 002.357 1.533c.484.184 1.058.306 2.005.34.948.035 1.355.048 4.976.048s4.028-.013 4.976-.048c.947-.034 1.521-.156 2.005-.34a6.5 6.5 0 002.357-1.533 6.5 6.5 0 001.533-2.357c.184-.484.306-1.058.34-2.005.035-.948.048-1.355.048-4.976s-.013-4.028-.048-4.976c-.034-.947-.156-1.521-.34-2.005a6.5 6.5 0 00-1.533-2.357A6.5 6.5 0 0019.981.388c-.484-.184-1.058-.306-2.005-.34C17.028.013 16.621 0 12.017 0zm0 2.17c3.573 0 3.995.014 5.402.078.902.033 1.383.142 1.706.236.428.167.73.364 1.05.684.32.32.517.622.684 1.05.094.323.203.804.236 1.706.064 1.407.078 1.829.078 5.402s-.014 3.995-.078 5.402c-.033.902-.142 1.383-.236 1.706-.167.428-.364.73-.684 1.05-.32.32-.622.517-1.05.684-.323.094-.804.203-1.706.236-1.407.064-1.829.078-5.402.078s-3.995-.014-5.402-.078c-.902-.033-1.383-.142-1.706-.236a2.828 2.828 0 01-1.05-.684 2.828 2.828 0 01-.684-1.05c-.094-.323-.203-.804-.236-1.706-.064-1.407-.078-1.829-.078-5.402s.014-3.995.078-5.402c.033-.902.142-1.383.236-1.706.167-.428.364-.73.684-1.05.32-.32.622-.517 1.05-.684.323-.094.804-.203 1.706-.236 1.407-.064 1.829-.078 5.402-.078z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.017 15.33a3.313 3.313 0 100-6.626 3.313 3.313 0 000 6.626zm0-8.468a5.155 5.155 0 110 10.31 5.155 5.155 0 010-10.31z" clipRule="evenodd" />
                  <circle cx="17.338" cy="6.662" r="1.2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-300 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-gray-300 hover:text-white">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-300 hover:text-white">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 ComeBookUs. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-1" />
                support@comebookus.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
