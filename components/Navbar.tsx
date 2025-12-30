"use client";

import Image from "next/image"
import Link from "next/link"
import posthog from "posthog-js"

const Navbar = () => {
  const handleLogoClick = () => {
    posthog.capture("navbar_logo_clicked", {
      destination: "/",
    });
  };

  const handleNavLinkClick = (linkName: string) => {
    posthog.capture("navbar_link_clicked", {
      link_name: linkName,
      destination: "/",
    });
  };

  return (
    <header>
      <nav>
        <Link href='/' className="logo" onClick={handleLogoClick}>
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

          <p>Bacenet</p>
        </Link>

        <ul>
          <Link href='/' onClick={() => handleNavLinkClick("Inicio")}>Inicio</Link>
          <Link href='/' onClick={() => handleNavLinkClick("Nosotros")}>Nosotros</Link>
          <Link href='/' onClick={() => handleNavLinkClick("Contactenos")}>Contactenos</Link>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar