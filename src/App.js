import React from 'react';
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

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<PropertyList />} />
                        <Route path="/add-property" element={<PropertyForm />} />
                        <Route path="/properties/:id" element={<PropertyDetail />} />
                        <Route path="/edit-property/:id" element={<PropertyEdit />} />
                        <Route path="/agents" element={<AgentList />} />
                        <Route path="/agents/:id" element={<AgentForm/>} />
                        <Route path="/add-agent" element={<AgentForm />} />
                        <Route path="/edit-agent/:id" element={<AgentForm />} />
                        <Route path="/client-briefs" element={<ClientBriefDashboard />} />
                        <Route path="/client-briefs/add" element={<ClientBriefForm />} />
                        <Route path="/client-briefs/edit/:id" element={<ClientBriefForm />} />
                        <Route path="/client-briefs/:briefId/matches" element={<ClientBriefMatches />} />
                        <Route path="/dashboard" element={<BuyersAgentDashboard />} />
                        <Route path="/cashflow-calculator" element={<CashFlowCalculator />} />
                        <Route path="/template-management" element={<EmailTemplateManagement />} />
                        

                    </Routes>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;
