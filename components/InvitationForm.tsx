import React, { useState } from 'react';
import { InvitationFormData } from '../types';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface InvitationFormProps {
  onSubmit: (data: InvitationFormData) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export const InvitationForm: React.FC<InvitationFormProps> = ({ onSubmit, onClose, isLoading }) => {
  const [formData, setFormData] = useState<InvitationFormData>({
    hostName: '',
    eventName: '',
    date: '',
    time: '',
    location: '',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#fdfbf7] w-full max-w-md rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-[#f7f5f0]">
          <h2 className="text-lg font-serif font-bold text-stone-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            나만의 초대장 만들기
          </h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-4">
          <p className="text-sm text-stone-500 mb-4">
            정보를 입력하면 제밀리(Gemini)가 당신만을 위한 근사한 초대 문구를 작성해줍니다.
          </p>
          
          <form id="invitation-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">초대하는 사람</label>
              <input
                type="text"
                name="hostName"
                value={formData.hostName}
                onChange={handleChange}
                placeholder="예: 지원"
                className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-500 font-serif"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">행사 이름</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="예: 연말 파티, 집들이"
                className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-500 font-serif"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">날짜</label>
                    <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="예: 12월 25일"
                        className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-500 font-serif"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">시간</label>
                    <input
                        type="text"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        placeholder="예: 저녁 7시"
                        className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-500 font-serif"
                        required
                    />
                </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">장소</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="예: 우리집, 강남역 00식당"
                className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-500 font-serif"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">하고 싶은 말 / 분위기</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="예: 드레스코드는 레드입니다. 가벼운 마음으로 오세요."
                rows={3}
                className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-500 font-serif resize-none"
                required
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-stone-200 bg-[#f7f5f0]">
          <button
            type="submit"
            form="invitation-form"
            disabled={isLoading}
            className="w-full bg-stone-800 text-[#fdfbf7] py-3 rounded text-sm uppercase tracking-widest font-bold hover:bg-stone-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                작성 중...
              </>
            ) : (
              '초대장 생성하기'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};