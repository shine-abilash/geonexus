
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="topbar">
      <nav>
        <h1>SatQueryAI</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/analysis">Analysis</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/report/:analysisId">Report</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;