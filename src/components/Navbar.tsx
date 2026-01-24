import React, { useState } from 'react';
import { Search } from './Search';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isMobileSearchOpen) setIsMobileSearchOpen(false);
    };

    const toggleMobileSearch = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Services', href: '/services' },
        { name: 'Projects', href: '/projects' },
        { name: 'Build Logs', href: '/buildlogs' },
        { name: 'About', href: '/about' },
    ];

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center gap-2 group">
                            <img
                                src="/favicon.svg"
                                alt="Cody Maughan Logo"
                                className="h-8 w-8 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <span className="text-lg font-bold font-heading text-text tracking-tight group-hover:text-primary transition-colors">
                                Cody Maughan
                            </span>
                        </a>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-text-muted hover:text-primary transition-colors font-mono"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:block w-64 lg:w-80">
                        <Search />
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={toggleMobileSearch}
                            className="text-text-muted hover:text-text p-2 rounded-md"
                            aria-label="Search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="text-text-muted hover:text-text p-2 rounded-md"
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? (
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
            </div>

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {isMobileSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-b border-white/5 bg-background/80 backdrop-blur-xl"
                    >
                        <div className="p-4">
                            <Search className="w-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-b border-white/5 bg-background/95 backdrop-blur-xl overflow-hidden absolute w-full"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-text hover:text-primary hover:bg-white/5 font-mono"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
