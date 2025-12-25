import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href='/'  className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

          <p>Bacenet</p>
        </Link>

        <ul>
          <Link href='/'>Inicio</Link>
          <Link href='/'>Nosotros</Link>
          <Link href='/'>Contactenos</Link>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar