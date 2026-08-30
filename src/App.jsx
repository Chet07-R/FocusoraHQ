import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EmailVerificationBanner from "./components/EmailVerificationBanner";
import ChatWidget from "./components/ChatWidget";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy-loaded pages for bundle size optimization
const Home = lazy(() => import("./pages/Home"));
const Blog = lazy(() => import("./pages/Blog"));
const Blog1 = lazy(() => import("./pages/Blog1"));
const Blog2 = lazy(() => import("./pages/Blog2"));
const BlogCustom = lazy(() => import("./pages/BlogCustom"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const JoinSpace = lazy(() => import("./pages/JoinSpace"));
const CreateSpace = lazy(() => import("./pages/CreateSpace"));
const StudyRoom = lazy(() => import("./pages/StudyRoom"));
const MySpace = lazy(() => import("./pages/MySpace"));
const Community = lazy(() => import("./pages/Community"));
const StudyRoom1 = lazy(() => import("./pages/StudyRoom-1"));
const Terms = lazy(() => import("./pages/Terms"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Careers = lazy(() => import("./pages/Careers"));
const Press = lazy(() => import("./pages/Press"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Fallback Loader Component
const PageLoader = () => (
  <div style={{
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    color: "#3b82f6"
  }}>
    <div style={{
      width: "50px",
      height: "50px",
      border: "4px solid #1e293b",
      borderTop: "4px solid #3b82f6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <BackToTop />
      <Navbar />
      <EmailVerificationBanner />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog1" element={<Blog1 />} />
          <Route path="/blog2" element={<Blog2 />} />
          <Route path="/blog/community/:blogId" element={<BlogCustom />} />
          <Route path="/community" element={<Community />} />
          <Route path="/my-space" element={<MySpace />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/join-space" element={<JoinSpace />} />
          <Route path="/study-room-1" element={<StudyRoom1 />} />
          <Route path="/study-room" element={<StudyRoom />} />
          <Route path="/create-space" element={<CreateSpace />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <ChatWidget />
    </ErrorBoundary>
  );
}

export default App;

