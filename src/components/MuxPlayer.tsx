import React from 'react';
import MuxPlayerReact from '@mux/mux-player-react';

interface MuxPlayerProps {
  playbackId: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  aspectRatio?: '16:9' | '9:16';
}

export function MuxPlayer({
  playbackId,
  title,
  className,
  autoPlay = false,
  aspectRatio = '16:9',
}: MuxPlayerProps) {
  const cssAspectRatio = aspectRatio === '9:16' ? '9 / 16' : '16 / 9';

  if (!playbackId || playbackId.startsWith('REPLACE_')) {
    return (
      <div
        className={className}
        style={{
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '1rem',
          minHeight: '280px',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))',
          color: 'white',
          padding: '1.25rem',
          textAlign: 'center',
          aspectRatio: cssAspectRatio,
        }}
      >
        <div>
          <p style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{title}</p>
          <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>
            Add a valid Mux playback ID in the portfolio content entry to render this video.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MuxPlayerReact
      className={className}
      playbackId={playbackId}
      streamType="on-demand"
      controls
      autoPlay={autoPlay}
      metadata={{ video_title: title }}
      style={{
        width: '100%',
        aspectRatio: cssAspectRatio,
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    />
  );
}
