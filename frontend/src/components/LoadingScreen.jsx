import React from 'react';
import logo from '../assets/logo_transparent.png';

const LoadingScreen = ({ fullScreen = true, dark = true }) => {
    // Determine the container layout based on fullScreen and theme options
    const containerStyle = fullScreen
        ? {
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: dark ? '#0f0f1a' : '#f8fafc', // dark theme or light slate theme
            zIndex: 9999,
            fontFamily: 'Inter, system-ui, sans-serif',
          }
        : {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0',
            width: '100%',
            fontFamily: 'Inter, system-ui, sans-serif',
          };

    return (
        <div style={containerStyle}>
            {/* Buffering animation around the logo */}
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <style>
                    {`
                        @keyframes spin-pulse {
                            0% { transform: rotate(0deg) scale(1); opacity: 0.8; }
                            50% { transform: rotate(180deg) scale(1.1); opacity: 0.4; }
                            100% { transform: rotate(360deg) scale(1); opacity: 0.8; }
                        }
                        @keyframes pulse-glow {
                            0% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
                            50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
                            100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
                        }
                    `}
                </style>
                {/* Outer rotating/pulsing ring */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '3px solid transparent',
                    borderTopColor: '#3b82f6', // blue-500
                    borderRightColor: '#60a5fa', // blue-400
                    animation: 'spin-pulse 1.5s linear infinite',
                }} />
                {/* Inner static glow ring */}
                <div style={{
                    position: 'absolute',
                    inset: '4px',
                    borderRadius: '50%',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                    animation: 'pulse-glow 2s ease-in-out infinite',
                }} />
                {/* The Logo */}
                <img 
                    src={logo} 
                    alt="APEX Logo" 
                    style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'contain',
                        zIndex: 10
                    }}
                />
            </div>
        </div>
    );
};

export default LoadingScreen;
