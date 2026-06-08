import React, { useEffect } from 'react';

const CompareModal = ({ properties, onClose, onSelectProperty }) => {
  const [p1, p2] = properties;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const hasBadge = (condition) => condition ? (
    <span style={{
      fontSize: 10, padding: '2px 8px', borderRadius: 20,
      background: '#EAF3DE', color: '#3B6D11', fontWeight: 600,
      marginLeft: 8, whiteSpace: 'nowrap'
    }}>✓ Better</span>
  ) : null;

  const Chip = ({ label, highlight }) => (
    <span style={{
      fontSize: 11, padding: '2px 10px', borderRadius: 20,
      background: highlight ? '#EAF3DE' : '#F1EFE8',
      color: highlight ? '#3B6D11' : '#5F5E5A',
      border: `0.5px solid ${highlight ? '#C0DD97' : '#D3D1C7'}`,
      whiteSpace: 'nowrap'
    }}>{label}</span>
  );

  const ScoreBar = ({ score }) => (
    <div style={{ width: '100%' }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{score}%</span>
      <div style={{ height: 5, borderRadius: 3, background: '#E8E6DF', marginTop: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3, width: score + '%',
          background: score >= 70 ? '#1D9E75' : score >= 40 ? '#BA7517' : '#E24B4A',
          transition: 'width 0.6s ease'
        }} />
      </div>
    </div>
  );

  // Row = label cell + two value cells, all in the parent grid
  // Use a wrapper div with display:contents for each row
  const Row = ({ icon, label, children }) => (
    <div style={{ display: 'contents' }}>
      <div style={{
        padding: '10px 12px', fontSize: 12, color: '#888780',
        borderTop: '0.5px solid #D3D1C7',
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#FAFAF8'
      }}>
        {icon} {label}
      </div>
      {children}
    </div>
  );

  const Val = ({ children, noBorder, style }) => (
    <div style={{
      padding: '10px 14px', fontSize: 13, fontWeight: 500,
      borderTop: '0.5px solid #D3D1C7',
      borderLeft: noBorder ? 'none' : '0.5px solid #D3D1C7',
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
      background: '#FFFFFF', minWidth: 0,
      ...style
    }}>
      {children}
    </div>
  );

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '24px 16px', overflowY: 'auto'
      }}
    >
      {/* Modal card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 780,
          background: '#FFFFFF', borderRadius: 16,
          padding: '20px 20px 24px', boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          margin: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#2C2C2A' }}>Side-by-side comparison</span>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '0.5px solid #B4B2A9', background: 'transparent',
            cursor: 'pointer', fontSize: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#5F5E5A'
          }}>✕</button>
        </div>

        {/* THE GRID — this is the critical part */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 1fr',   /* ← inline style, not Tailwind */
          border: '0.5px solid #D3D1C7',
          borderRadius: 12,
          overflow: 'hidden'
        }}>

          {/* ── PHOTO ROW ── */}
          <div style={{ display: 'contents' }}>
            <div style={{ background: '#F1EFE8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, fontSize: 11, color: '#888780', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Photos
            </div>
            <div style={{ borderLeft: '0.5px solid #D3D1C7' }}>
              <img src={p1.image} alt={p1.title}
                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=160&fit=crop' }}
              />
            </div>
            <div style={{ borderLeft: '0.5px solid #D3D1C7' }}>
              <img src={p2.image} alt={p2.title}
                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=160&fit=crop' }}
              />
            </div>
          </div>

          {/* ── PROPERTY NAME ROW ── */}
          <div style={{ display: 'contents' }}>
            <div style={{ padding: '10px 12px', background: '#F1EFE8', borderTop: '0.5px solid #D3D1C7', fontSize: 11, color: '#888780', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center' }}>Property</div>
            <div style={{ padding: '10px 14px', borderTop: '0.5px solid #D3D1C7', borderLeft: '0.5px solid #D3D1C7', background: '#F7F6F2' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#2C2C2A', lineHeight: 1.3 }}>{p1.title}</div>
              <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{p1.sector}, Gurgaon</div>
            </div>
            <div style={{ padding: '10px 14px', borderTop: '0.5px solid #D3D1C7', borderLeft: '0.5px solid #D3D1C7', background: '#F7F6F2' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#2C2C2A', lineHeight: 1.3 }}>{p2.title}</div>
              <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{p2.sector}, Gurgaon</div>
            </div>
          </div>

          {/* ── PRICE ── */}
          <Row icon="₹" label="Price">
            <Val>{p1.priceLabel}{hasBadge(p1.price < p2.price)}</Val>
            <Val>{p2.priceLabel}{hasBadge(p2.price < p1.price)}</Val>
          </Row>

          {/* ── SIZE ── */}
          <Row icon="⬛" label="Size">
            <Val>{p1.bhk} BHK · {p1.area} sq ft{hasBadge(p1.area > p2.area)}</Val>
            <Val>{p2.bhk} BHK · {p2.area} sq ft{hasBadge(p2.area > p1.area)}</Val>
          </Row>

          {/* ── FLOOR ── */}
          <Row icon="🏢" label="Floor">
            <Val>Floor {p1.floor} of {p1.totalFloors}{hasBadge(p1.floor > p2.floor)}</Val>
            <Val>Floor {p2.floor} of {p2.totalFloors}{hasBadge(p2.floor > p1.floor)}</Val>
          </Row>

          {/* ── FACING ── */}
          <Row icon="🧭" label="Facing">
            <Val><span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: ['East','North','North-East'].includes(p1.facing) ? '#E6F1FB' : '#FAEEDA', color: ['East','North','North-East'].includes(p1.facing) ? '#185FA5' : '#854F0B' }}>{p1.facing}</span></Val>
            <Val><span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: ['East','North','North-East'].includes(p2.facing) ? '#E6F1FB' : '#FAEEDA', color: ['East','North','North-East'].includes(p2.facing) ? '#185FA5' : '#854F0B' }}>{p2.facing}</span></Val>
          </Row>

          {/* ── AMENITIES ── */}
          <Row icon="⭐" label="Amenities">
            <Val>{p1.amenities.map(a => <Chip key={a} label={a} highlight={!p2.amenities.includes(a)} />)}</Val>
            <Val>{p2.amenities.map(a => <Chip key={a} label={a} highlight={!p1.amenities.includes(a)} />)}</Val>
          </Row>

          {/* ── MATCH SCORE ── */}
          <Row icon="🎯" label="Match">
            <Val style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <ScoreBar score={p1.matchScore} />
              {hasBadge(p1.matchScore > p2.matchScore)}
            </Val>
            <Val style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <ScoreBar score={p2.matchScore} />
              {hasBadge(p2.matchScore > p1.matchScore)}
            </Val>
          </Row>

          {/* ── TAGS ── */}
          <Row icon="🏷" label="Tags">
            <Val>{p1.tags.map(t => <Chip key={t} label={t} />)}</Val>
            <Val>{p2.tags.map(t => <Chip key={t} label={t} />)}</Val>
          </Row>

        </div>{/* end grid */}

        {/* Footer buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 8, marginTop: 12 }}>
          <div />
          <button onClick={() => onSelectProperty(p1)} style={{ padding: '9px 0', fontSize: 13, fontWeight: 500, borderRadius: 8, border: '0.5px solid #B4B2A9', background: 'transparent', cursor: 'pointer' }}>View {p1.bhk}BHK details →</button>
          <button onClick={() => onSelectProperty(p2)} style={{ padding: '9px 0', fontSize: 13, fontWeight: 500, borderRadius: 8, border: '0.5px solid #B4B2A9', background: 'transparent', cursor: 'pointer' }}>View {p2.bhk}BHK details →</button>
        </div>

      </div>
    </div>
  );
};

export default CompareModal;
