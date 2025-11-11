import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Leaderboard from "./pages/Leaderboard";

function Home() {
  return (
    <main className="pt-16 text-center text-gray-700 dark:text-gray-200 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mt-20">FocusoraHQ Landing Page</h1>
      <p className="mt-4 text-lg">If you see the Navbar above, it’s working ✅</p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;