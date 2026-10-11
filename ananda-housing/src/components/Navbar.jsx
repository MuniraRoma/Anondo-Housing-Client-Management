import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="/logo.jpeg" alt="Anondo Housing Society" />
        <h2>Anondo Housing</h2>
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/upload">Client Upload</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  )
}

export default Navbar