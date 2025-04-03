// App.js

import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PropertyList from './components/PropertyList';
import PropertyForm from './components/PropertyForm';
import PropertyDetail from './components/PropertyDetail';
import PropertyEdit from './components/PropertyEdit';
import AgentList from './components/AgentList';
import AgentForm from './components/AgentForm';
import ClientBriefDashboard from './components/ClientBriefDashboard';
import ClientBriefForm from './components/ClientBriefForm';
import ClientBriefMatches from './components/ClientBriefMatches';
import BuyersAgentDashboard from './components/BuyersAgentDashboard';
import CashFlowCalculator from './components/CashFlowCalculator';
import EmailTemplateManagement from './components/EmailTemplateManagement';
import EmailReplies from './components/EmailReplies';
import SignupForm from './components/SignupForm';
import UserManagement from './components/UserManagement';
import LoginForm from './components/Loginform';
import ProtectedRoute from './components/ProtectedRoute';
import SharedPropertyPage from './components/SharedPropertyPage';
import { jwtDecode } from 'jwt-decode';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import SavedPropertiesPage from './components/SavedPropertiesPage';
import axiosInstance, { attachSpinnerInterceptor } from './axiosInstance';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import LandingPage from './components/LandingPage';
import { AuthContext } from './components/AuthContext';
import AISearchQueryViewer from './components/AISearchQueryViewer'
import { BrowserRouter } from 'react-router-dom';


// App.js or index.js
import { ToastContainer, toast } from 'react-toastify';
import CommunityBoard from './components/CommunityBoard';


// Inside your App JSX
<ToastContainer position="top-right" autoClose={3000} />

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });




function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [checkStatusCooldown, setCheckStatusCooldown] = useState(false);


  console.log("current user", currentUser)

  useEffect(() => {
    attachSpinnerInterceptor(() => {
      // Spinner via NProgress only
      NProgress.start();
      return () => NProgress.done();
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log("token in app js", token)
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        console.log('Decoded User on App Load:', decodedUser);

        if (decodedUser.exp * 1000 < Date.now()) {
          console.warn('Token expired. Redirecting to login...');
          handleLogout();
        } else {
          setCurrentUser(decodedUser);
          console.log("decodedUser", decodedUser)
        }
      } catch (error) {
        console.error('Invalid token. Logging out...', error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.setItem('currentUser', null);
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };




  const handleSendVerificationEmail = async () => {
    try {
      setResendCooldown(true);
      await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/send-email/verify-sender`);
      toast.success('Verification email sent. Please check your inbox.');

      setTimeout(() => setResendCooldown(false), 60000); // Optional cooldown
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast.error('Failed to send verification email.');
      setResendCooldown(false);
    }
  };

  const handleCheckVerificationStatus = async () => {
    try {
      setCheckStatusCooldown(true);
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/send-email/email-verification-status`);
      const { isEmailVerified } = response.data;

      if (isEmailVerified) {
        toast.success('✅ Your email is now verified!');
        // Optionally reload or set updated user state
        const token = localStorage.getItem('authToken');
        const decodedUser = jwtDecode(token);
        setCurrentUser(decodedUser); // refresh UI immediately
      } else {
        toast.info('Your email is still not verified.');
      }

      setTimeout(() => setCheckStatusCooldown(false), 30000); // Optional cooldown
    } catch (error) {
      console.error('Error checking verification status:', error);
      toast.error('Failed to check verification status.');
      setCheckStatusCooldown(false);
    }
  };



  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header currentUser={currentUser} onLogout={handleLogout} />

        <main className="flex-grow pt-20">
          <ToastContainer position="top-right" autoClose={3000} />
          <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            
              <Routes>


                <Route path="/landing" element={<LandingPage />} />

                <Route path="/login" element={<LoginForm setCurrentUser={setCurrentUser} />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/public" element={<CommunityBoard />} />
                <Route path="/" element={<ProtectedRoute><PropertyList /></ProtectedRoute>} />
                <Route path="/add-property" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />
                <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
                <Route path="/edit-property/:id" element={<ProtectedRoute><PropertyEdit /></ProtectedRoute>} />
                <Route path="/add-agent" element={<ProtectedRoute><AgentForm /></ProtectedRoute>} />
                <Route path="/agents/:id" element={<ProtectedRoute><AgentList /></ProtectedRoute>} />
                <Route path="/edit-agent/:id" element={<ProtectedRoute><AgentForm /></ProtectedRoute>} />
                <Route path="/client-briefs" element={<ProtectedRoute><ClientBriefDashboard /></ProtectedRoute>} />
                <Route path="/client-briefs/add" element={<ProtectedRoute><ClientBriefForm /></ProtectedRoute>} />
                <Route path="/client-briefs/edit/:id" element={<ProtectedRoute><ClientBriefForm /></ProtectedRoute>} />
                <Route path="/client-briefs/:briefId/matches" element={<ProtectedRoute><ClientBriefMatches /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><BuyersAgentDashboard /></ProtectedRoute>} />
                <Route path="/cashflow-calculator" element={<ProtectedRoute><CashFlowCalculator /></ProtectedRoute>} />
                <Route path="/template-management" element={<ProtectedRoute><EmailTemplateManagement /></ProtectedRoute>} />
                <Route path="/email-replies" element={<ProtectedRoute><EmailReplies /></ProtectedRoute>} />
                <Route path="/shared/:shareToken" element={<SharedPropertyPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/user-management" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
                <Route path="/agents" element={<ProtectedRoute requiredRole="admin"><AgentList /></ProtectedRoute>} />
                <Route path="/ai-search-queries" element={<ProtectedRoute requiredRole="admin"><AISearchQueryViewer /></ProtectedRoute>} />

                <Route path="/saved-properties" element={<ProtectedRoute><SavedPropertiesPage /></ProtectedRoute>} />

              </Routes>
            
          </AuthContext.Provider>
        </main>

        <Footer />
      </div>
      </BrowserRouter>
  );
}

export default App;
