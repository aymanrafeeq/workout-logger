import React, { useState } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Hey! I'm interested in joining your Personal Training classes. 💪");

  // YOUR PHONE NUMBER (No + symbol)
  const phoneNumber = "916284072456"; 

  const handleSend = (e) => {
    e.preventDefault();
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
      
      {/* 1. THE CHAT BOX (Visible only when Open) */}
      {isOpen && (
        <div className="bg-zinc-900 border border-zinc-800 w-72 rounded-2xl shadow-2xl overflow-hidden animate-fade-in origin-bottom-left">
          
          {/* Header */}
          <div className="bg-[#075E54] p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Trainer Avatar (Placeholder) */}
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                PT
              </div>
              <div>
                <p className="text-white font-bold text-sm">Personal Trainer</p>
                <p className="text-green-100 text-xs">Typically replies instantly</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-black/50 backdrop-blur-sm h-64 flex flex-col">
            {/* Incoming Message Bubble */}
            <div className="bg-zinc-800 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl text-zinc-200 text-sm mb-4 self-start max-w-[90%] shadow-sm">
              Hello! 👋 Ready to transform your body? Type your message below to start your training application.
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="mt-auto">
              <textarea 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white text-sm focus:border-[#25D366] outline-none resize-none h-20"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full mt-2 bg-[#25D366] hover:bg-[#1DA851] text-black font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Send size={16} /> Start Chat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. THE FLOATING BUTTON (Stands Straight Now) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center"
      >
        {/* Pulse Effect (Only when closed) */}
        {!isOpen && (
          <>
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-20 animate-ping"></span>
            <span className="absolute inline-flex h-[110%] w-[110%] rounded-full bg-green-500 opacity-10 animate-ping delay-75"></span>
          </>
        )}

        {/* Main Icon Circle */}
        <div className={`
          relative p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300 transform hover:scale-105
          ${isOpen ? 'bg-zinc-800 text-white rotate-0' : 'bg-[#25D366] text-white'}
        `}>
          {isOpen ? <X size={28} /> : (
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          )}
        </div>

        {/* Text Label (Only shows on hover when CLOSED) */}
        {!isOpen && (
          <div className="absolute left-16 bg-white text-black px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat with Trainer
          </div>
        )}
      </button>
    </div>
  );
}