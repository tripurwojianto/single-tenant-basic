import React, { useState } from 'react';

export const OFFICIAL_KASMASJID_LOGO = 'https://ik.imagekit.io/kulinaweb/logo-kasmasjid.png';

interface KasMasjidLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  alt?: string;
}

export default function KasMasjidLogo({ 
  className = '', 
  size = 'md',
  alt = 'Logo KasMasjid' 
}: KasMasjidLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg',
    custom: '',
  };

  const appliedSizeClass = size === 'custom' ? className : `${sizeClasses[size]} ${className}`;

  if (imageError) {
    return (
      <div 
        className={`bg-emerald-600 text-white font-black flex items-center justify-center rounded-xl shadow-xs shrink-0 select-none ${appliedSizeClass}`}
        title={alt}
      >
        <span>K</span>
      </div>
    );
  }

  return (
    <img
      src={OFFICIAL_KASMASJID_LOGO}
      alt={alt}
      onError={() => setImageError(true)}
      className={`object-contain shrink-0 ${appliedSizeClass}`}
    />
  );
}
