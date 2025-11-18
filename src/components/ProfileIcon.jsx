import React from 'react';

const ProfileIcon = ({ imageSrc, size = 'md', showSecondRing = true }) => {
  const sizeClasses = {
    sm: { container: 'w-10 h-10', ring: 'w-12 h-12', decorative: 'w-8 h-8', gap: 'gap-2' },
    md: { container: 'w-12 h-12', ring: 'w-14 h-14', decorative: 'w-10 h-10', gap: 'gap-3' },
    lg: { container: 'w-16 h-16', ring: 'w-[4.5rem] h-[4.5rem]', decorative: 'w-12 h-12', gap: 'gap-4' }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center ${currentSize.gap}`}>
      <div className="relative flex items-center justify-center">
        <div 
          className={`${currentSize.ring} rounded-full absolute`}
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
            padding: '2px',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4), 0 0 30px rgba(139, 92, 246, 0.3), 0 0 45px rgba(236, 72, 153, 0.2)'
          }}
        >
          <div className="w-full h-full rounded-full bg-gray-900"></div>
        </div>

        <div className={`${currentSize.container} rounded-full overflow-hidden relative z-10 border-2 border-gray-800`}>
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {showSecondRing && (
        <div className="relative flex items-center justify-center">
          <div 
            className={`${currentSize.decorative} rounded-full`}
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
              padding: '2px',
              boxShadow: '0 0 12px rgba(6, 182, 212, 0.3), 0 0 24px rgba(139, 92, 246, 0.25), 0 0 36px rgba(236, 72, 153, 0.15)'
            }}
          >
            <div className="w-full h-full rounded-full bg-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;