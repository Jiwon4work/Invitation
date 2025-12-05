import React, { useEffect, useState } from 'react';
import Envelope from './components/Envelope';
import { generateInvitation } from './services/geminiService';
import { InvitationContent, InvitationFormData } from './types';
import { ChevronDown, Share2, PenLine, Link as LinkIcon, Check } from 'lucide-react';
import { InvitationForm } from './components/InvitationForm';

const INITIAL_CONTENT: InvitationContent = {
  headline: "You're Invited!",
  body: "제밀리 집들이 겸 연말 파티에\n당신을 초대합니다.\n\n마니또를 위한 선물과\n유머와 체력을 챙겨 오세요\n\n일시: 2025년 12월 6일 토요일 16:00\n장소: 새절역 인근 & 옹이네 House",
  signature: "사랑을 담아,"
};

export default function App() {
  const [content, setContent] = useState<InvitationContent | null>(INITIAL_CONTENT);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // UI States
  const [showForm, setShowForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Derived Animation States
  const showPhoto = scrollProgress > 0.15;
  const showNote = scrollProgress > 0.35;
  const showEnvelope = scrollProgress > 0.60;
  const openEnvelope = scrollProgress > 0.85;

  useEffect(() => {
    // 1. Scroll Handler
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);

    // 2. Check URL params for personalized guest name
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get('to');
    
    if (guestName) {
      setContent(prev => prev ? {
        ...prev,
        body: `To. ${guestName}\n\n` + prev.body
      } : null);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCreateInvitation = async (formData: InvitationFormData) => {
    setIsGenerating(true);
    try {
      const newContent = await generateInvitation(formData);
      setContent(newContent);
      setShowForm(false);
      // Reset scroll to show envelope animation again
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (error) {
      alert("초대장 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative h-[400vh] w-full bg-[#b5aead]">
      
      {/* --- Sticky Stage Container --- */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Background Layers */}
        <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-40 mix-blend-overlay grayscale"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')`
            }}
        />
        <div className="absolute inset-0 texture-overlay z-0 pointer-events-none"></div>

        {/* --- Main Scene --- */}
        <div className="relative z-10 w-full max-w-4xl h-[600px] flex items-center justify-center">
            
            {/* 1. The Photo */}
            <div 
                className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform origin-center
                    ${showPhoto 
                        ? 'translate-y-0 opacity-100 rotate-[-6deg] scale-100 blur-0' 
                        : 'translate-y-[100px] opacity-0 rotate-[-15deg] scale-110 blur-sm'}
                `}
                style={{ zIndex: 10 }}
            >
                <div className="w-[280px] h-[340px] bg-white p-3 shadow-xl flex flex-col items-center rotate-[-2deg]">
                     <div className="w-full h-[260px] bg-stone-200 overflow-hidden relative opacity-90">
                         <img 
                            src="https://drive.google.com/thumbnail?id=1N2E_OJbD3eM8mcKFfw4l63mHQ2nDxiHN&sz=w1000"
                            alt="Our Memories" 
                            className="object-cover w-full h-full"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              console.warn("Failed to load Google Drive image, falling back.");
                              e.currentTarget.src = "https://images.unsplash.com/photo-1513279922550-250c2129b7b0?q=80&w=1974&auto=format&fit=crop";
                            }}
                         />
                     </div>
                     <div className="mt-4 font-serif text-stone-500 text-lg italic">Our Memories</div>
                </div>
            </div>

            {/* 2. The Note */}
            <div 
                className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform origin-center
                    ${showNote 
                        ? 'translate-y-0 opacity-100 rotate-[4deg] translate-x-16 scale-100 blur-0' 
                        : 'translate-y-[120px] opacity-0 rotate-[10deg] translate-x-20 scale-110 blur-sm'}
                `}
                style={{ zIndex: 20 }}
            >
                <div className="w-[240px] h-[180px] bg-[#fdfbf7] p-6 shadow-md shadow-stone-800/10 flex flex-col justify-center items-center text-center transform rotate-1 border border-stone-100">
                     <p className="font-serif text-stone-600 text-xl italic leading-relaxed">
                        "Let's make this night unforgettable."
                     </p>
                     <div className="mt-2 text-xs text-stone-400 uppercase tracking-widest">Dec 06</div>
                </div>
            </div>

            {/* 3. The Envelope */}
            <div 
                className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform
                    ${showEnvelope 
                        ? 'scale-100 opacity-100 translate-y-0 blur-0' 
                        : 'scale-110 opacity-0 translate-y-[150px] blur-md'}
                `}
                style={{ zIndex: 50 }}
            >
                <Envelope 
                    content={content} 
                    forceOpen={openEnvelope}
                />
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-12 flex flex-col items-center gap-2 text-stone-700 transition-opacity duration-500 ${scrollProgress > 0.05 ? 'opacity-0' : 'opacity-80'}`}>
            <span className="text-sm tracking-[0.2em] uppercase font-serif">Scroll Down</span>
            <ChevronDown className="animate-bounce w-5 h-5" />
        </div>

        {/* Action Buttons (Fixed at bottom right) */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-[100]">
           <button 
             onClick={handleShare}
             className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all text-stone-700 hover:scale-105 group relative"
             title="링크 공유하기"
           >
             {copied ? <Check className="w-5 h-5 text-green-600" /> : <LinkIcon className="w-5 h-5" />}
             {copied && <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-xs bg-stone-800 text-white px-2 py-1 rounded whitespace-nowrap">복사됨!</span>}
           </button>
           
           <button 
             onClick={() => setShowForm(true)}
             className="bg-stone-800 p-3 rounded-full shadow-lg hover:bg-stone-700 transition-all text-white hover:scale-105 group relative"
             title="나도 만들기"
           >
             <PenLine className="w-5 h-5" />
             <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-xs bg-stone-800 text-white px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">나도 만들기</span>
           </button>
        </div>

      </div>

      {/* Creation Modal */}
      {showForm && (
        <InvitationForm 
          onSubmit={handleCreateInvitation} 
          onClose={() => setShowForm(false)}
          isLoading={isGenerating}
        />
      )}
    </div>
  );
}