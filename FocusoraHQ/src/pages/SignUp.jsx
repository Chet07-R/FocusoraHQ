// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     agreeTerms: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

//   const handleSignUp = (e) => {
//     e.preventDefault();
//     console.log('Sign Up:', formData);
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-8">
//         <div className="max-w-md w-full bg-[#1e293b] rounded-2xl shadow-2xl p-8 border border-gray-700 mt-12">
//           {/* Logo Icon */}
//           <div className="flex justify-center mb-6">
//             <img src="../images/transparent.png" alt="Logo" className="w-20 h-20" />
//           </div>

//           {/* Heading */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-white mb-2">
//               Create Account
//             </h2>
//             <p className="text-gray-400 text-sm">
//               Join FocusoraHQ and Boost your Productivity
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSignUp} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 placeholder="Enter your Full Name"
//                 className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your Email"
//                 className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your Password"
//                 className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Re-enter your Password"
//                 className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
//                 required
//               />
//             </div>

//             {/* Terms Checkbox */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="agreeTerms"
//                 checked={formData.agreeTerms}
//                 onChange={handleChange}
//                 className="w-4 h-4 bg-[#0f172a] border-gray-600 rounded text-cyan-500 focus:ring-0 focus:ring-offset-0"
//                 required
//               />
//               <label className="ml-2 text-sm text-gray-300">
//                 I agree to the{' '}
//                 <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">
//                   Terms & Conditions
//                 </Link>
//               </label>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-[#0f172a] border border-gray-600 text-white font-medium py-3 rounded-lg hover:bg-[#1e293b] hover:border-cyan-500 transition-all duration-200"
//             >
//               Sign Up
//             </button>
//           </form>

//           {/* Sign In Link */}
//           <p className="text-center text-gray-400 text-sm mt-6">
//             Already have an account?{' '}
//             <Link to="/signin" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignUp;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { mapAuthError } from '../utils/authErrors';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setSubmitting(true);
      await signUp({
        displayName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/');
    } catch (err) {
      const friendly = mapAuthError(err?.code);
      setError(friendly || err?.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      const friendly = mapAuthError(err?.code);
      setError(friendly || err?.message || 'Google sign-up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
        <div className="relative max-w-md w-full bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-blue-500/30 mt-12 hover:border-purple-400/50 transition-all duration-300">
          {/* Logo with cool glow effect */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src="../images/transparent.png" alt="Logo" className="w-20 h-20 hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-md opacity-50 animate-pulse"></div>
            </div>
          </div>

          {/* Heading with FocusoraHQ gradient */}
          <div className="text-center mb-8">
            <h2 
              className="text-4xl font-extrabold mb-2"
              style={{
                background: 'linear-gradient(90deg, #22d3ee 0%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Join the Squad!
            </h2>
            <p className="text-gray-300 text-sm">
              Start your productivity journey today!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="w-full bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="What should we call you?"
                className="w-full bg-slate-900/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email (your.email@example.com)"
                className="w-full bg-slate-900/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Make it strong!"
                className="w-full bg-slate-900/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Type it again"
                className="w-full bg-slate-900/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-1 rounded border-2 border-blue-500 text-purple-500 focus:ring-0 focus:ring-offset-0"
                required
              />
              <label className="ml-2 text-sm text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-purple-400 hover:text-purple-300 hover:underline font-semibold">
                  Terms & Conditions
                </Link>
                {' '}(we promise they're not boring)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif', 
                background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.5), 0 0 50px rgba(139, 92, 246, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              className="w-full text-white font-bold py-3.5 rounded-xl hover:brightness-110 transform hover:scale-[1.03] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed tracking-wide"
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.boxShadow = '0 0 35px rgba(6, 182, 212, 0.7), 0 0 70px rgba(139, 92, 246, 0.6), 0 8px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)')}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.5), 0 0 50px rgba(139, 92, 246, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}
            >
              {submitting ? 'Creating Account…' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={submitting}
              className="w-full mt-3 bg-slate-700/60 border-2 border-blue-500/30 text-white font-semibold py-3 rounded-xl hover:bg-slate-700 hover:border-purple-400 transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continue with Google
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-300 text-sm mt-6">
            Already a member? {' '}
            <Link to="/signin" className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-colors">
              Sign In Here!
            </Link>
          </p>
        </div>
      </div>

      {/* Custom styles for autofill */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgb(15 23 42 / 0.5) inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </>
  );
};

export default SignUp;
