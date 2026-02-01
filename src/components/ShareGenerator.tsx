import React, { useState, useRef, useEffect } from 'react';
import { Download, Share2 } from 'lucide-react';

export default function DefundShareGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedSize, setSelectedSize] = useState('square');
  const [messageType, setMessageType] = useState('standard');
  const [customReason, setCustomReason] = useState('');
  const [customAction, setCustomAction] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const canvasRef = useRef(null);

  const sizes = [
    { id: 'square', name: 'Square', width: 1080, height: 1080, desc: 'Instagram/Facebook feed' },
    { id: 'story', name: 'Story', width: 1080, height: 1920, desc: 'Instagram/Facebook story' },
    { id: 'twitter', name: 'Wide', width: 1200, height: 675, desc: 'Twitter/X post' }
  ];

  const platforms = [
    { id: 'amazon', name: 'Amazon Prime', billionaire: 'Bezos', verb: 'CANCELLED', action: 'cancel' },
    { id: 'meta', name: 'Instagram', billionaire: 'Zuckerberg', verb: 'LEFT', action: 'leave' },
    { id: 'facebook', name: 'Facebook', billionaire: 'Zuckerberg', verb: 'LEFT', action: 'leave' },
    { id: 'whatsapp', name: 'WhatsApp', billionaire: 'Zuckerberg', verb: 'LEFT', action: 'leave' },
    { id: 'chatgpt', name: 'ChatGPT', billionaire: 'Altman', verb: 'CANCELLED', action: 'cancel' },
    { id: 'tiktok', name: 'TikTok', billionaire: 'Ellison', verb: 'LEFT', action: 'leave' },
    { id: 'twitter', name: 'X', billionaire: 'Musk', verb: 'LEFT', action: 'leave' },
    { id: 'threads', name: 'Threads', billionaire: 'Zuckerberg', verb: 'LEFT', action: 'leave' }
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
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#2f5192');
    gradient.addColorStop(1, '#1a3055');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const baseFontSize = Math.min(canvas.width, canvas.height) / 10;
    const centerY = canvas.height / 2;
    
    // Main text - Sans-serif, bold like platform name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${baseFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`I ${platform.verb}`, canvas.width / 2, centerY - baseFontSize * 1.6);
    
    // Platform name - Sans-serif, larger
    ctx.fillStyle = '#FFB6C1';
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
    ctx.strokeStyle = '#FFB6C1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, centerY + baseFontSize * 0.6);
    ctx.lineTo(canvas.width * 0.8, centerY + baseFontSize * 0.6);
    ctx.stroke();
    
    // Reason text - Serif for elegance
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${baseFontSize * 0.55}px Georgia, serif`;
    
    if (messageType === 'custom' && (customReason || customAction)) {
      const reason = customReason || `${platform.billionaire} chose fascism.`;
      const action = customAction || `I chose to ${platform.action}.`;
      ctx.fillText(reason, canvas.width / 2, centerY + baseFontSize * 1.4);
      ctx.fillText(action, canvas.width / 2, centerY + baseFontSize * 2.15);
    } else {
      ctx.fillText(`${platform.billionaire} chose fascism.`, canvas.width / 2, centerY + baseFontSize * 1.4);
      ctx.fillText(`I chose to ${platform.action}.`, canvas.width / 2, centerY + baseFontSize * 2.15);
    }
    
    // Website - Sans-serif, clean
    ctx.fillStyle = '#E8E8E8';
    ctx.font = `600 ${baseFontSize * 0.5}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
    ctx.fillText('DefundBillionaires.org', canvas.width / 2, centerY + baseFontSize * 3.3);
    
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #2f5192, #1a3055)', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            Defund <span style={{ color: '#FFB6C1' }}>Billionaires</span>
          </h1>
          <p style={{ color: '#b3d4fc', fontSize: '1.125rem' }}>Share how you're striking</p>
        </header>

        <main style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
              What are you cancelling?
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedPlatform === platform.id ? '#2f5192' : '#f3f4f6',
                    color: selectedPlatform === platform.id ? 'white' : '#1f2937',
                    outline: selectedPlatform === platform.id ? '4px solid rgba(47, 81, 146, 0.3)' : 'none'
                  }}
                >
                  {platform.name}
                </button>
              ))}
            </div>

            {selectedPlatform && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                    Message style
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button
                      onClick={() => setMessageType('standard')}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: 'pointer',
                        background: messageType === 'standard' ? '#2f5192' : '#f3f4f6',
                        color: messageType === 'standard' ? 'white' : '#1f2937',
                        outline: messageType === 'standard' ? '2px solid rgba(47, 81, 146, 0.3)' : 'none'
                      }}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setMessageType('custom')}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: 'pointer',
                        background: messageType === 'custom' ? '#2f5192' : '#f3f4f6',
                        color: messageType === 'custom' ? 'white' : '#1f2937',
                        outline: messageType === 'custom' ? '2px solid rgba(47, 81, 146, 0.3)' : 'none'
                      }}
                    >
                      Custom
                    </button>
                  </div>

                  {messageType === 'custom' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                          fontSize: '0.875rem'
                        }}
                      />
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
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
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
                          fontWeight: '600',
                          fontSize: '0.75rem',
                          border: 'none',
                          cursor: 'pointer',
                          background: selectedSize === size.id ? '#2f5192' : '#f3f4f6',
                          color: selectedSize === size.id ? 'white' : '#1f2937',
                          outline: selectedSize === size.id ? '2px solid rgba(47, 81, 146, 0.3)' : 'none',
                          textAlign: 'center'
                        }}
                      >
                        <div>{size.name}</div>
                        <div style={{ fontSize: '0.625rem', opacity: 0.75 }}>{size.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={downloadImage}
                  style={{
                    width: '100%',
                    background: '#d946c6',
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
                  onMouseOver={(e) => e.currentTarget.style.background = '#b81ea3'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#d946c6'}
                >
                  <Download size={20} />
                  Download image
                </button>

                <div style={{ background: '#eff6ff', border: '2px solid #2f5192', borderRadius: '0.5rem', padding: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Next steps:
                  </p>
                  <ol style={{ fontSize: '0.875rem', color: '#6b7280', paddingLeft: '1.5rem', margin: 0 }}>
                    <li>Download your image</li>
                    <li>Post to Instagram, Facebook, X, or Bluesky</li>
                    <li>Tag friends to join the movement</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>Preview</h2>
            
            {!selectedPlatform ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '600px', background: '#f9fafb', borderRadius: '0.75rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <Share2 size={64} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
                  <p style={{ color: '#6b7280' }}>Select a platform to see your shareable image</p>
                </div>
              </div>
            ) : (
              <div style={{ background: '#f9fafb', borderRadius: '0.75rem', padding: '1rem' }}>
                {generatedImage && (
                  <img 
                    src={generatedImage} 
                    alt="Generated share graphic" 
                    style={{ width: '100%', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                )}
              </div>
            )}
          </div>
        </main>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <footer style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#b3d4fc', fontSize: '0.875rem' }}>
            Built to defund billionaires.{' '}
            <a href="/" style={{ textDecoration: 'underline', color: '#b3d4fc' }}>
              Visit DefundBillionaires.org
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}