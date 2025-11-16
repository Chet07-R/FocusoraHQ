import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Blog from "./pages/Blog";
import Blog1 from "./pages/Blog1";
import Blog2 from "./pages/Blog2";
import Leaderboard from "./pages/Leaderboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import JoinSpace from "./pages/JoinSpace";
import CreateSpace from "./pages/CreateSpace";
import StudyRoom from "./pages/StudyRoom";
import MySpace from "./pages/MySpace";
import Community from "./pages/Community";
import ScrollToTop from "./components/ScrollToTop";
import StudyRoom1 from "./pages/StudyRoom-1";
import Home from "./pages/Home";
import Terms from "./pages/Terms";

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
        <Route path="/my-space" element={<MySpace />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/join-space" element={<JoinSpace />} />
        <Route path="/study-room-1" element={<StudyRoom1 />} />
        <Route path="/study-room" element={<StudyRoom />} />
        <Route path="/create-space" element={<CreateSpace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;