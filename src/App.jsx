import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import UtmBuilder from "./pages/UtmBuilder";
import UtmDecoder from "./pages/UtmDecoder";
import SpecChecker from "./pages/SpecChecker";
import RoasCalculator from "./pages/RoasCalculator";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import { trackPageview } from "./utils/analytics";

function ScrollAndTrack() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageview(location.pathname);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <Layout>
      <ScrollAndTrack />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/utm-builder" element={<UtmBuilder />} />
        <Route path="/utm-decoder" element={<UtmDecoder />} />
        <Route path="/ad-spec-checker" element={<SpecChecker />} />
        <Route path="/roas-calculator" element={<RoasCalculator />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
