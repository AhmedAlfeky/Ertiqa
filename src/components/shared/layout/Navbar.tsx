'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar({ lang }: { lang: string }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'الرئيسية', href: '/ar/home' },
    { name: 'من نحن', href: '/ar/about us' },
    { name: 'المحاضرون', href: '/ar/instructors' },
    { name: 'الدورات', href: '/ar/courses' },
    { name: 'البودكاست', href: '/ar/podcast' },
    { name: 'الفعاليات', href: '/ar/events' },
    { name: 'المدونة', href: '/ar/blog' },
    { name: 'الكتب', href: '/ar/books' },
  ];

  return (
    <nav className="sticky top-0 z-50 h-10 bg-[#1d4378] justify-center shadow-xl">
      <div className="w-full mx-auto h-10 flex items-center justify-center gap-10 py-4 px-4 shadow-xl">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            //className="nav-item text-l"
            //className={`nav-item hover:text-amber-400 transition ${ pathname === item.href ? 'text-amber-500 font-semibold' : 'text-gray-200' }`}
            className={`nav-item transform hover:scale-105 hover:-translate-y-1 transition duration-200 ease-in-out hover:text-shadow-amber-600 ${ pathname === item.href ? 'text-amber-500 font-semibold' : 'text-gray-200' }`}
          >
            {item.name}
          </Link>
        ))}

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
      
      {/*  القائمة المنسدلة للجوال مؤجل*/}
        {/* {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700">
            <div className="flex flex-col gap-4 py-4"> */}


              {/* معلومات الاتصال في الجوال */}
              {/* <div className="flex flex-col gap-3 pt-4 border-t border-gray-700"> */}

                {/* سوشيال ميديا في الجوال */}
                {/* <div className="flex gap-3 pt-2">
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
        )} */}
      </div>
      {/* <div className="w-full mx-auto bg-amber-500 h-0.5 flex items-center justify-center py-4 px-4"></div> */}
    </nav>
  );
}