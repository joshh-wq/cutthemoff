import React, { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function DefundShareGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedSize, setSelectedSize] = useState('square');
  const [messageType, setMessageType] = useState('standard');
  const [customReason, setCustomReason] = useState('');
  const [customAction, setCustomAction] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const canvasRef = useRef(null);

  const sizes = [
    { id: 'square', name: 'Square', width: 1080, height: 1080, desc: 'Instagram/\nFacebook' },
    { id: 'story', name: 'Story', width: 1080, height: 1920, desc: 'Instagram\nstory' },
    { id: 'twitter', name: 'Wide', width: 1200, height: 675, desc: 'Twitter/\nX post' }
  ];

  const platforms = [
    { id: 'amazon', name: 'Amazon Prime', billionaire: 'Bezos', verb: 'CANCELLED', action: 'cancel' },
    { id: 'chatgpt', name: 'ChatGPT', billionaire: 'Altman', verb: 'CANCELLED', action: 'cancel' },
    { id: 'facebook', name: 'Facebook', billionaire: 'Zuckerberg', verb: 'LEFT', action: 'leave' },
    { id: 'meta', name: 'Instagram', billionaire: 'Zuckerberg', verb: 'LEFT', action: 'leave' },
    { id: 'threads', name: 'Threads', billionaire: 'Zuckerberg', verb: 'LEFT', action: 'leave' },
    { id: 'tiktok', name: 'TikTok', billionaire: 'Ellison', verb: 'LEFT', action: 'leave' },
    { id: 'whatsapp', name: 'WhatsApp', billionaire: 'Zuckerberg', verb: 'LEFT', action: 'leave' },
    { id: 'x', name: 'X', billionaire: 'Musk', verb: 'LEFT', action: 'leave' }
  ];

  useEffect(() => {
    if (selectedPlatform) {
      generateImage();
    }
  }, [selectedPlatform, selectedSize, messageType, customReason, customAction]);

  const generateImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const platform = platforms.find(p => p.id === selectedPlatform);
    const size = sizes.find(s => s.id === selectedSize);
    
    canvas.width = size.width;
    canvas.height = size.height;
    
    // Solid dark navy background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const baseFontSize = Math.min(canvas.width, canvas.height) / 10;
    const centerY = canvas.height / 2;

    // Main text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${baseFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`I ${platform.verb}`, canvas.width / 2, centerY - baseFontSize * 1.6);

    // Platform name - bold magenta accent from main site
    ctx.fillStyle = '#c2185b';
    const platformFontSize = baseFontSize * 1.2;
    ctx.font = `900 ${platformFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;

    let platformText = platform.name.toUpperCase();
    let textWidth = ctx.measureText(platformText).width;
    const maxWidth = canvas.width * 0.85;

    if (textWidth > maxWidth) {
      const scale = maxWidth / textWidth;
      ctx.font = `900 ${platformFontSize * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
    }

    ctx.fillText(platformText, canvas.width / 2, centerY - baseFontSize * 0.1);

    // Divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.25, centerY + baseFontSize * 0.6);
    ctx.lineTo(canvas.width * 0.75, centerY + baseFontSize * 0.6);
    ctx.stroke();

    // Reason text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = `${baseFontSize * 0.55}px Georgia, serif`;

    if (messageType === 'custom' && (customReason || customAction)) {
      const reasonRaw = customReason || `${platform.billionaire} chose fascism.`;
      const actionRaw = customAction || `I chose to ${platform.action}.`;
      const reason = reasonRaw.endsWith('.') ? reasonRaw : reasonRaw + '.';
      const action = actionRaw.endsWith('.') ? actionRaw : actionRaw + '.';
      ctx.fillText(reason, canvas.width / 2, centerY + baseFontSize * 1.4);
      ctx.fillText(action, canvas.width / 2, centerY + baseFontSize * 2.15);
    } else {
      ctx.fillText(`${platform.billionaire} chose fascism.`, canvas.width / 2, centerY + baseFontSize * 1.4);
      ctx.fillText(`I chose to ${platform.action}.`, canvas.width / 2, centerY + baseFontSize * 2.15);
    }

    // Website
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = `600 ${baseFontSize * 0.45}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
    ctx.fillText('defundbillionaires.org', canvas.width / 2, centerY + baseFontSize * 3.3);
    
    setGeneratedImage(canvas.toDataURL('image/png'));
  };

  const downloadImage = () => {
    if (generatedImage) {
      const platform = platforms.find(p => p.id === selectedPlatform);
      const link = document.createElement('a');
      link.download = `defunded-${platform.id}-${selectedSize}.png`;
      link.href = generatedImage;
      link.click();
    }
  };

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden', maxWidth: '100vw', width: '100%' }}>
      <div style={{ background: '#0f172a', padding: '2rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem', opacity: 0.8, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </a>
          <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', fontWeight: 900, color: 'white', marginBottom: 0, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: '-0.04em', lineHeight: 0.9, WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
            Defund Billionaires
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.75rem', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            Show the world what you're cancelling.
          </p>
        </div>
      </div>

      <div style={{ background: 'white', padding: '1.5rem' }}>
        <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1f2937', marginBottom: '1rem', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
              What are you cancelling?
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', width: '100%' }}>
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    border: selectedPlatform === platform.id ? '2px solid #0f172a' : '2px solid #d1d5db',
                    cursor: 'pointer',
                    background: selectedPlatform === platform.id ? '#0f172a' : 'white',
                    color: selectedPlatform === platform.id ? 'white' : '#0f172a',
                    outline: 'none',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                  }}
                >
                  {platform.name}
                </button>
              ))}
            </div>

            {selectedPlatform && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1f2937', marginBottom: '0.5rem', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                    Message style
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setMessageType('standard')}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        border: messageType === 'standard' ? '2px solid #0f172a' : '2px solid #d1d5db',
                        cursor: 'pointer',
                        background: messageType === 'standard' ? '#0f172a' : 'white',
                        color: messageType === 'standard' ? 'white' : '#0f172a',
                        outline: 'none',
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                      }}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setMessageType('custom')}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        border: messageType === 'custom' ? '2px solid #0f172a' : '2px solid #d1d5db',
                        cursor: 'pointer',
                        background: messageType === 'custom' ? '#0f172a' : 'white',
                        color: messageType === 'custom' ? 'white' : '#0f172a',
                        outline: 'none',
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                      }}
                    >
                      Custom
                    </button>
                  </div>

                  {messageType === 'custom' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div>
                        <input
                          type="text"
                          value={customReason}
                          onChange={(e) => setCustomReason(e.target.value)}
                          placeholder="They chose... (e.g. Bezos chose profits over people)"
                          maxLength={50}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            border: '2px solid #9ca3af',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: customReason.length >= 45 ? '#c2185b' : '#9ca3af', marginTop: '0.25rem', fontFamily: "'Inter', sans-serif" }}>
                          {customReason.length}/50
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={customAction}
                          onChange={(e) => setCustomAction(e.target.value)}
                          placeholder="I chose... (e.g. I chose my local bookstore)"
                          maxLength={50}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            border: '2px solid #9ca3af',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: customAction.length >= 45 ? '#c2185b' : '#9ca3af', marginTop: '0.25rem', fontFamily: "'Inter', sans-serif" }}>
                          {customAction.length}/50
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1f2937', marginBottom: '0.5rem', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                    Choose image size
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    {sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        style={{
                          padding: '0.75rem 0.5rem',
                          borderRadius: '0.5rem',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          border: selectedSize === size.id ? '2px solid #0f172a' : '2px solid #d1d5db',
                          cursor: 'pointer',
                          background: selectedSize === size.id ? '#0f172a' : 'white',
                          color: selectedSize === size.id ? 'white' : '#0f172a',
                          outline: 'none',
                          textAlign: 'center',
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                        }}
                      >
                        <div>{size.name}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.75, whiteSpace: 'pre-line' }}>{size.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {generatedImage && (
                  <div style={{ background: '#f9fafb', borderRadius: '0.75rem', padding: '1rem' }}>
                    <img
                      src={generatedImage}
                      alt="Generated share graphic"
                      style={{ width: '100%', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                )}

                <button
                  onClick={downloadImage}
                  style={{
                    width: '100%',
                    background: '#c2185b',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '1rem 1.5rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: '1rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#a11548'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#c2185b'}
                >
                  <Download size={20} />
                  Download image
                </button>

              </div>
            )}
          </div>

        </main>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <footer style={{ marginTop: '2rem', textAlign: 'center', paddingBottom: '1rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Built to defund billionaires.
          </p>
        </footer>
      </div>
    </div>
  );
}