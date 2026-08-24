import HomePage from './HomePage.jsx'
import Navbar from './Navbar.jsx'
import Analysis_page from './Analysis_page.jsx'
import About from './About.jsx'
import Contact from './Contact.jsx'
import Report from './Report.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Navbar />
      <div className="content-offset">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis" element={<Analysis_page />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/report/:analysisId" element={<Report />} />
        </Routes>
      </div>
    </Router>
  )

}





export default App