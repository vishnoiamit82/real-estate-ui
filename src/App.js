// App.js
import React, { useState, useEffect } from 'react';
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
import  SharedPropertyPage from './components/SharedPropertyPage'
import {jwtDecode} from 'jwt-decode';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


function App() {

    const [currentUser, setCurrentUser] = useState(null);

    
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                console.log('Decoded User on App Load:', decodedUser);

                // Check if the token is expired
                if (decodedUser.exp * 1000 < Date.now()) {
                    console.warn('Token expired. Redirecting to login...');
                    handleLogout();
                } else {
                    setCurrentUser(decodedUser);
                }
            } catch (error) {
                console.error('Invalid token. Logging out...', error);
                handleLogout();
            }
        }
    }, []);


    // Handle user logout
    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.setItem('currentUser', null);
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    };

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header currentUser={currentUser} onLogout={handleLogout} />
                <main className="flex-grow">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginForm setCurrentUser={setCurrentUser} />} />
                        <Route path="/signup" element={<SignupForm />} />
                        
                        {/* Protected Routes for Authenticated Users */}
                        <Route path="/" element={<ProtectedRoute><PropertyList /></ProtectedRoute>} />
                        <Route path="/add-property" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />
                        <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
                        <Route path="/edit-property/:id" element={<ProtectedRoute><PropertyEdit /></ProtectedRoute>} />
                        
                        <Route path="/add-agent" element={<ProtectedRoute><AgentForm /></ProtectedRoute>} />
                        <Route path="/edit-agent/:id" element={<ProtectedRoute><AgentForm /></ProtectedRoute>} />
                        <Route path="/client-briefs" element={<ProtectedRoute><ClientBriefDashboard /></ProtectedRoute>} />
                        <Route path="/client-briefs/add" element={<ProtectedRoute><ClientBriefForm /></ProtectedRoute>} />
                        <Route path="/client-briefs/edit/:id" element={<ProtectedRoute><ClientBriefForm /></ProtectedRoute>} />
                        <Route path="/client-briefs/:briefId/matches" element={<ProtectedRoute><ClientBriefMatches /></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><BuyersAgentDashboard /></ProtectedRoute>} />
                        <Route path="/cashflow-calculator" element={<ProtectedRoute><CashFlowCalculator /></ProtectedRoute>} />
                        <Route path="/template-management" element={<ProtectedRoute><EmailTemplateManagement /></ProtectedRoute>} />
                        <Route path="/email-replies" element={<ProtectedRoute><EmailReplies /></ProtectedRoute>} />
                        

                        // In your React Router configuration
                        <Route path="/shared/:shareToken" element={<SharedPropertyPage />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />


                        {/* Admin-Only Protected Route */}
                        <Route path="/user-management" element={
                            <ProtectedRoute requiredRole="admin">
                                <UserManagement />
                                
                            </ProtectedRoute>
                        } />
                         <Route path="/agents" element={
                            <ProtectedRoute requiredRole="admin">
                                <AgentList />
                                
                            </ProtectedRoute>
                        } />
                        
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
