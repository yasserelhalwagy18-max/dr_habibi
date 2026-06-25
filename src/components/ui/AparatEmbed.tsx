import React from 'react';

interface AparatEmbedProps {
  videoId: string;
  className?: string;
  title?: string;
}

export const AparatEmbed: React.FC<AparatEmbedProps> = ({ videoId, className = '', title = 'Aparat Video' }) => {
  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 ${className}`} style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.aparat.com/video/video/embed/videohash/${videoId}/vt/frame`}
        title={title}
        allowFullScreen
        referrerPolicy="no-referrer"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};
