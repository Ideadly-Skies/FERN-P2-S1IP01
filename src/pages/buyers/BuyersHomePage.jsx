import React from 'react';

function BuyersHomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '80vh', 
      background: '#f5f7fa' 
    }}>
      <h1 style={{ color: '#2d3748', marginBottom: '0.5em' }}>Welcome to Buyers Home Page</h1>
      <p style={{ color: '#4a5568', fontSize: '1.2em' }}>
        Explore the best deals and find your perfect purchase!
      </p>
    </div>
  );
}

export default BuyersHomePage;