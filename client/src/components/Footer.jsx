import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white py-8 text-[10px] md:text-[11px] text-gray-500 border-t border-gray-200">
            <div className="max-w-[1440px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
                <p className="text-gray-500 font-medium text-xs md:text-sm text-center md:text-left order-2 md:order-none">
                    Copyright &copy; {new Date().getFullYear()} Smart Auction Global. All Rights Reserved.
                </p>    <div className="flex gap-6 font-bold uppercase tracking-widest text-[9px] sm:pr-20">
                    <Link to="/terms" className="hover:text-[#D4AF37] transition-all">T&C</Link>
                    <Link to="/privacy" className="hover:text-[#D4AF37] transition-all">Privacy Policy</Link>
                    <Link to="/cookies" className="hover:text-[#D4AF37] transition-all">Cookie Config</Link>
                </div>
            </div>
        </footer>
    );
}
