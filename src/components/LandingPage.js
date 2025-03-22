import React from "react";

const LandingPage = () => {
  const features = [
    "Digital Client Briefs",
    "AI-Powered Property Matching",
    "Smart Email Templates & Conversations",
    "Follow-Up Task Manager",
    "Community Board to Share & Pursue Properties",
    "Cash Flow & Yield Calculators",
    "Private & Secure Client Data"
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0/mo",
      features: ["1 Agent", "3 Client Briefs", "Community Access"]
    },
    {
      name: "Pro",
      price: "$49/mo",
      features: ["Unlimited Briefs", "Property Matching", "Email Templates"]
    },
    {
      name: "Team",
      price: "$129/mo",
      features: ["Team Dashboard", "Internal Sharing", "Agent Collaboration"]
    }
  ];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#ffffff', color: '#1f2937' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(to right, #2563eb, #7c3aed)', color: '#ffffff', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
          The CRM & Deal Flow Platform Built for Buyer’s Agents
        </h1>
        <p style={{ fontSize: '18px', maxWidth: '700px', margin: '0 auto 30px' }}>
          Manage client briefs, source properties, and communicate with agents—all from one powerful platform.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button style={{ padding: '12px 28px', backgroundColor: '#ffffff', color: '#1e3a8a', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Start Free</button>
          <button style={{ padding: '12px 28px', backgroundColor: '#1e3a8a', color: '#ffffff', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Book a Demo</button>
        </div>
      </section>

      {/* Pain Points */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f9fafb', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '24px' }}>Why Most Buyer’s Agents Struggle</h2>
        <ul style={{ listStyle: 'none', padding: 0, maxWidth: '700px', margin: '0 auto', fontSize: '16px', lineHeight: '1.75' }}>
          <li>❌ Scattered client briefs in spreadsheets</li>
          <li>❌ Manual property-client matching</li>
          <li>❌ No central place to communicate or track follow-ups</li>
          <li>❌ Lack of workflow designed specifically for buyer’s agents</li>
        </ul>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '32px' }}>Powerful Features Designed for Performance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          {features.map((item, index) => (
            <div key={index} style={{ backgroundColor: '#f3f4f6', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', fontSize: '16px', fontWeight: '500' }}>{item}</div>
          ))}
        </div>
      </section>

      {/* Founder Message */}
      <section style={{ padding: '60px 20px', backgroundColor: '#eef2ff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '600', marginBottom: '16px' }}>Built by a Buyer’s Agent, for Buyer’s Agents</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '17px', lineHeight: '1.75' }}>
          We understand your pain because we live it too. Buyers AgentOS was born out of real frustration with inefficient workflows—and it’s here to streamline your business from day one.
        </p>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f9fafb', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '32px' }}>Transparent Pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          {pricingPlans.map((plan, index) => (
            <div key={index} style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'left' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>{plan.name}</h3>
              <p style={{ color: '#2563eb', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>{plan.price}</p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '15px', lineHeight: '1.6' }}>
                {plan.features.map((feat, i) => (
                  <li key={i}>✅ {feat}</li>
                ))}
              </ul>
              <button style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Choose Plan</button>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(to right, #7c3aed, #9333ea)', textAlign: 'center', color: '#ffffff' }}>
        <h2 style={{ fontSize: '30px', fontWeight: '700', marginBottom: '16px' }}>Ready to Close More Deals?</h2>
        <p style={{ fontSize: '18px', marginBottom: '32px' }}>Start using Buyers AgentOS today—free to get started, powerful when you grow.</p>
        <button style={{ padding: '14px 32px', backgroundColor: '#ffffff', color: '#6d28d9', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Start Free</button>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: '#ffffff', fontSize: '14px', textAlign: 'center', padding: '16px' }}>
        © {new Date().getFullYear()} Buyers AgentOS. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;