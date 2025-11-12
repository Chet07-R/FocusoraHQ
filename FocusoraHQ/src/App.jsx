import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Blog from "./pages/Blog";
import Blog1 from "./pages/Blog1";
import Blog2 from "./pages/Blog2";
import Leaderboard from "./pages/Leaderboard";
import JoinSpace from "./pages/JoinSpace";
import CreateSpace from "./pages/CreateSpace";
import StudyRoom from "./pages/StudyRoom";
import ScrollToTop from "./components/ScrollToTop";
import StudyRoom1 from "./pages/StudyRoom-1";

function Home() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          FocusoraHQ Landing Page
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          If you see the Navbar above, it's working ✅
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog1" element={<Blog1 />} />
        <Route path="/blog2" element={<Blog2 />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/join-space" element={<JoinSpace />} />
        <Route path="/study-room-1" element={<StudyRoom1 />} />
        <Route path="/study-room" element={<StudyRoom />} />
        <Route path="/create-space" element={<CreateSpace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;