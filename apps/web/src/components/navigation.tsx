"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Arrow, Mark } from "./icons";
export function Navigation() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="brand"
          aria-label="Forum home"
          onClick={() => setOpen(false)}
        >
          <Mark />
          forum<span className="brand-dot">.</span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}{" "}
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        <nav
          id="primary-navigation"
          className={open ? "navigation is-open" : "navigation"}
          aria-label="Main navigation"
        >
          {[
            ["/", "Home"],
            ["/speakers", "Speakers"],
            ["/programs", "Programs"],
            ["/#about", "About"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                path === href || (href !== "/" && path.startsWith(href))
                  ? "page"
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="button button-small"
            onClick={() => setOpen(false)}
          >
            Let’s talk <Arrow diagonal />
          </Link>
        </nav>
      </div>
    </header>
  );
}
