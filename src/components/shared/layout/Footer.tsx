'use client';
import { FaFacebookF, FaLinkedinIn, FaXTwitter, FaInstagram, FaYoutube, FaSnapchat } from 'react-icons/fa6';
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from 'react-icons/fa';
//import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Footer({ lang }: { lang: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //const pathname = usePathname();
  
  // روابط السوشيال ميديا
  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/company/yourcompany', icon: <FaFacebookF/> },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/yourcompany', icon: <FaLinkedinIn/> },
    { name: 'Twitter', href: 'https://x.com/yourhandle', icon: <FaXTwitter/> },
    { name: 'Instagram', href: 'https://instagram.com/yourhandle', icon: <FaInstagram/> },
    { name: 'YouTube', href: 'https://youtube.com/@yourchannel', icon: <FaYoutube/> },
    { name: 'Snapchat', href: '#', icon: <FaSnapchat/> },
  ];
  
  
  return (
    <footer className="bg-[#1d4378] text-gray-400 h-50 py-12">
      
      {/* سوشيال ميديا (الجوال) */}
      <div className="flex items-start translate-y-[10px] translate-x-[100px] gap-4">
        
        {/* سوشيال ميديا - مخفي على الجوال الصغير */}
        <div className="hidden sm:flex items-start gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-amber-400 text-lg"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
      
      
      <div className="container mx-auto px-4 text-center">
        <div className="font-bold text-xl text-white mb-4">إرتقاء</div>
        <p className="mb-6">منصة عربية للتعليم والتطوير المهني والشخصي.</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="hover:text-white">الشروط</a>
              <a href="#" className="hover:text-white">الخصوصية</a>
              <a href="#" className="hover:text-white">اتصل بنا</a>
            </div>
        <p>© 2025 منصة إرتقاء. جميع الحقوق محفوظة.</p>
      </div>

      {/* زر الهامبرغر للجوال */}
        <button
          className="md:hidden text-gray-200 mt-3"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* القائمة المنسدلة للجوال */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700">
            <div className="flex flex-col gap-4 py-4">


              {/* معلومات الاتصال في الجوال */}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">

                {/* سوشيال ميديا في الجوال */}
                <div className="flex gap-3 pt-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-amber-400 text-lg"
                      aria-label={link.name}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* نهاية جزء عرض قائمة جهة الاتصال على الموبايل */}

    </footer>
  );
}