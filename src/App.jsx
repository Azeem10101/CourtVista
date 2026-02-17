import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import LawyerProfile from './pages/LawyerProfile';
import Compare from './pages/Compare';
import BookConsultation from './pages/BookConsultation';
import QnA from './pages/QnA';
import './App.css';

function ScrollToTop() {
  // Scroll to top on route change
  const { pathname } = window.location;
  useState(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [compareIds, setCompareIds] = useState([]);

  const handleCompareToggle = useCallback((id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((cid) => cid !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 lawyers at a time.');
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const handleCompareRemove = useCallback((id) => {
    setCompareIds((prev) => prev.filter((cid) => cid !== id));
  }, []);

  return (
    <Router>
      <div id="app">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/search"
              element={
                <Search
                  compareIds={compareIds}
                  onCompareToggle={handleCompareToggle}
                />
              }
            />
            <Route path="/lawyer/:id" element={<LawyerProfile />} />
            <Route
              path="/compare"
              element={
                <Compare
                  compareIds={compareIds}
                  onRemove={handleCompareRemove}
                />
              }
            />
            <Route path="/book/:id" element={<BookConsultation />} />
            <Route path="/qna" element={<QnA />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
