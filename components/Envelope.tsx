import React from 'react';
import { InvitationContent } from '../types';
import { TypewriterText } from './TypewriterText';

interface EnvelopeProps {
  content: InvitationContent | null;
  forceOpen: boolean;
}

const Envelope: React.FC<EnvelopeProps> = ({ content, forceOpen }) => {
  const isOpen = forceOpen;

  // Reference Colors (Sage Green / Khaki Paper)
  const colors = {
    back: '#c0c6b6',      // Darker inside/back
    front: '#d3d8c8',     // Main envelope color
    frontShadow: '#c8cdc0', // Slightly darker for side flaps
    highlight: '#e6e9e1'  // Lightest edge
  };

  return (
    // Container
    <div className="relative w-[340px] h-[240px] sm:w-[400px] sm:h-[280px] perspective-1000 z-50 transition-transform duration-700">
      
      {/* Wrapper to center everything */}
      <div className={`relative w-full h-full transition-transform duration-700 ease-in-out ${isOpen ? 'translate-y-[100px]' : 'translate-y-0'}`}>
        
        {/* --- Envelope Back (Inside/Background) --- */}
        <div 
          className="absolute inset-0 rounded-sm shadow-2xl z-0 border border-[#b0b6a6]"
          style={{ backgroundColor: colors.back }}
        ></div>

        {/* --- The Letter Card --- */}
        {/* z-10: Behind front flaps (z-20) but we want it in front of Top Flap (z-0) when open */}
        <div 
          className={`absolute left-4 right-4 bg-[#fdfbf7] shadow-md rounded-sm z-10 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col items-center p-6 text-center border border-stone-200
            ${isOpen ? '-translate-y-[110%] h-[460px] opacity-100' : 'translate-y-[10%] h-[90%] opacity-0'}
          `}
          style={{
            top: '5%',
            backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
            transitionDelay: isOpen ? '200ms' : '0ms'
          }}
        >
          {content && (
            <div className="flex flex-col h-full w-full justify-start pt-6 gap-3">
              <TypewriterText 
                text={content.headline} 
                isActive={isOpen} 
                speed={30}
                startDelay={800}
                className="font-serif text-3xl text-stone-800 italic leading-tight mt-2" 
              />
              <div className="w-8 h-[1px] bg-stone-300 mx-auto shrink-0 my-3" />
              <TypewriterText 
                text={content.body} 
                isActive={isOpen} 
                startDelay={1500} 
                speed={20}
                className="text-sm text-stone-600 leading-loose font-light whitespace-pre-wrap" 
              />
              <div className="flex-grow"></div>
              <TypewriterText 
                text={content.signature} 
                isActive={isOpen} 
                startDelay={4000} 
                speed={50}
                className="text-xs text-stone-400 uppercase tracking-widest font-sans pb-8" 
              />
            </div>
          )}
        </div>

        {/* --- Envelope Front (Pocket) --- */}
        {/* Z-Index 20: Covers the bottom part of the letter. Must be opaque to hide letter. */}
        
        {/* Left Flap */}
        <div 
            className="absolute left-0 bottom-0 w-full h-full z-20 pointer-events-none"
            style={{
                backgroundColor: colors.frontShadow,
                clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
                filter: 'brightness(0.95)' // Slightly darker for depth
            }}
        />
         {/* Right Flap */}
         <div 
            className="absolute right-0 bottom-0 w-full h-full z-20 pointer-events-none"
            style={{
                backgroundColor: colors.frontShadow,
                clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
                filter: 'brightness(0.92)' // Slightly darker than left for 3D effect
            }}
        />
        {/* Bottom Flap (Main visible front triangle) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-full z-20 pointer-events-none flex flex-col items-center justify-end pb-4"
          style={{
             backgroundColor: colors.front,
             clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)', // Standard envelope bottom flap
             boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
          }}
        >
             {/* Branding on Bottom Flap */}
             <div 
                className={`text-[#a3a99c] text-[10px] font-sans uppercase tracking-[0.25em] font-bold opacity-80`}
                style={{ textShadow: '0px 1px 0px rgba(255,255,255,0.4)' }}
            >
                JIWON MADE
            </div>
        </div>

        {/* --- Envelope Top Flap (The animation part) --- */}
        {/* 
            Z-Index Logic: 
            - When CLOSED (!isOpen): z-30 (Above everything)
            - When OPEN (isOpen): z-0 (Behind letter) 
            We use a delay on z-index transition so it swaps ONLY after it has rotated partially.
        */}
        <div 
          className={`absolute top-0 left-0 w-full h-1/2 origin-top preserve-3d
            ${isOpen ? 'rotate-x-180' : 'rotate-x-0'}
          `}
          style={{
            zIndex: isOpen ? 0 : 30,
            transition: 'transform 0.7s ease-in-out, z-index 0s linear 0.3s', // Delay z-index swap
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front of Flap (Visible when closed) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
                backgroundColor: colors.front, 
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)', // Triangle pointing DOWN
                filter: 'brightness(1.02)' // Slightly lighter so it pops
            }}
          ></div>

          {/* Back of Flap (Visible when open) */}
          <div 
            className="absolute inset-0 w-full h-full rotate-x-180 backface-hidden"
            style={{
                backgroundColor: colors.back, // Matches inside
                // Inverted Triangle shape (Tip UP in DOM space).
                // Combined with rotate-x-180 (Child) -> Becomes Tip DOWN.
                // Combined with rotate-x-180 (Parent) -> Becomes Tip UP visually.
                clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                filter: 'brightness(0.95)'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Envelope;