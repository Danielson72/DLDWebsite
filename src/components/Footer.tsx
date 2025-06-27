import React from 'react';

export function Footer() {
  const socialLinks = [
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@danielinthelionsden?si=Gbj-5bbBTDHS3mRD',
      icon: 'fa-brands fa-youtube',
      color: 'hover:text-red-500'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/Daniel72144?mibextid=kFxxJD',
      icon: 'fa-brands fa-facebook',
      color: 'hover:text-blue-500'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/daniel_in_the_lions_den144?igsh=MTU0OTJ4YTlzcnE0dw%3D%3D&utm_source=qr',
      icon: 'fa-brands fa-instagram',
      color: 'hover:text-pink-500'
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/dld14472?s=21',
      icon: 'fa-brands fa-x-twitter',
      color: 'hover:text-gray-300'
    }
  ];

  return (
    <footer className="relative bg-black border-t border-green-500/30 py-8 sm:py-12 overflow-x-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Message */}
          <p className="text-amber-500 text-base sm:text-lg font-medium mb-6 sm:mb-8">
            Follow Daniel in the Lion's Den for music, ministry, and updates.
          </p>
          
          {/* Social Media Icons */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center transition-all duration-300 hover:scale-110"
              >
                {/* Icon */}
                <div className={`text-white text-2xl sm:text-3xl mb-1 sm:mb-2 transition-all duration-300 ${social.color} group-hover:drop-shadow-[0_0_8px_currentColor]`}>
                  <i className={social.icon}></i>
                </div>
                
                {/* Platform Name */}
                <span className="text-white text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
          
          {/* Copyright */}
          <div className="pt-4 sm:pt-6 border-t border-green-500/20">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {new Date().getFullYear()} Daniel in the Lion's Den. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}