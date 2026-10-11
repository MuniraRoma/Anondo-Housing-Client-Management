import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home-hero">
      <h1>Anondo Housing Client Management</h1>
      <p>Client information সহজে সংরক্ষণ, পরিচালনা ও পর্যবেক্ষণ করুন।</p>
      <Link to="/upload" className="btn">Client Upload</Link>
      <Link to="/admin" className="btn">Admin Login</Link>
    </div>
  )
}

export default Home