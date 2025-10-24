'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from 'react-icons/fa';
//import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function Header({ lang }: { lang: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // روابط الاتصال
  const contact = {
    email: 'info@ertiqa.com',
    whatsapp: '971505217008+',
    whatsappLink: 'https://wa.me/+971505217008',
  };

  return (
    <header className="relative h-22 header-box">
      <div className="w-full" >
        {/* الجزء العلوي: الشعار + معلومات الاتصال */}
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* الشعار */}
          <Link href={`/${lang}`} className="flex items-center translate-x-[-100px] translate-y-1">
            <img src="/images/logo/logo.png" alt="إرتقاء - منصة تعليمية" className="w-20 h-20 object-contain" />
            <div>
              <div className="logo-title text-5xl translate-x-[-20px] translate-y-[12%]">إرتقـاء</div>
              <div className="sub-title font-bold text-s text-amber-600 translate-x-[-33%] translate-y-[10%]">Live the Life</div>
            </div>
          </Link>
          
          {/* معلومات الاتصال (مخفي على الجوال الصغير) */}
          <div className="hidden sm:flex flex-wrap items-center translate-y-[5px] gap-5 text-sm">

            {/* البريد */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-[#1D4378] rounded-full shadow"> {/* أيقونة بريد */}
              <MdEmail className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <a href={`mailto:${contact.email}`} className="font-bold text-[#1D4378] hover:underline"> {contact.email} </a>
                <span className="font-normal text-xs text-[#1D4378] translate-x-[-35px]">Email Us</span>
              </div>
            </div>

            {/* فاصل */}
            <div className="w-px h-8 bg-[#1D4378]"></div>

            {/* واتساب */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-[#01c411] rounded-full shadow">
              <FaWhatsapp className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="font-bold text-[#1D4378] hover:underline"> {contact.whatsapp} </a>
                {/* <a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"> */}
                <span className="font-normal text-xs text-[#1D4378] translate-x-[-8%]">WhatsApp Only</span>
              </div>
              </div>  
          </div>

            {/* سلة المشتريات */}
            {/* <Link href="/cart" className="text-2xl translate-x-[-370px] translate-y-[6px]">
              🛒
            </Link> */}

            <div className="absolute left-[100px] top-2">
                <a href="https://www.google.com/" className="flex items-center gap-3" target="_blank" rel="noopener noreferrer">
                <img src="/images/cart-emp.png" alt="cart" className="cart"/>
                <span className="cart-text text-sm text-[#1D4378]">الاشتراكات</span>
                </a>
            </div>

            {/* أزرار التسجيل */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            
            {/* أزرار التسجيل */}
            <div className="flex gap-2 mt-3 md:mt-0 translate-x-[100px] translate-y-5">
              <Link
                href={`/${lang}/login?mode=signup`}
                className="auth-button2 w-22 h-8 flex bg-amber-100 items-center justify-center text-[12px] rounded-lg font-bold transition duration-300 ease-in-out focus:outline-none" >
                {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
              </Link>
              <Link
                href={`/${lang}/login?mode=login`}
                className="auth-button1 w-22 h-8 flex items-center justify-center text-[12px] rounded-lg font-bold transition duration-200 ease-in-out focus:outline-none" >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Link>
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
          </div>
        </div>






        

        {/* القائمة المنسدلة للجوال */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700">
            <div className="flex flex-col gap-4 py-4">


              {/* معلومات الاتصال في الجوال */}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-gray-200 rounded-full" />
                  <span className="text-sm">{contact.email}</span>
                </div>
                <a
                  href={contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-400"
                >
                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">W</span>
                  {contact.whatsapp}
                </a>

              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}