import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  startDelay?: number;
  speed?: number;
  isActive: boolean;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  startDelay = 0, 
  speed = 30, 
  isActive,
  className = "" 
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!isActive) {
      setDisplayedText('');
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
        timeoutId = setTimeout(typeChar, speed);
      }
    };

    const startTimeout = setTimeout(() => {
      typeChar();
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, isActive, startDelay, speed]);

  return <p className={className}>{displayedText}</p>;
};