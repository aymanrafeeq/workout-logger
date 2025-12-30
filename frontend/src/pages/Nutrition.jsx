import { useState } from 'react';
import { Utensils, Flame, Ban, CheckCircle, ChevronRight, Zap } from 'lucide-react';

// --- NUTRITION DATA PRESETS ---
const GUIDES = {
  bulking: {
    title: "Muscle Building (Bulking)",
    desc: "Eat big to get big. Focus on a caloric surplus (+300-500 cals) with high protein and complex carbs to fuel heavy lifting.",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
    macros: { protein: "2g per kg", carbs: "High", fats: "Moderate" },
    goodFoods: [
      { name: "Red Meat / Steak", sub: "High protein + Creatine source" },
      { name: "Whole Eggs", sub: "Healthy fats + Protein" },
      { name: "Rice & Potatoes", sub: "Easy to digest carbs for energy" },
      { name: "Oats & Peanut Butter", sub: "Calorie dense fuel" },
      { name: "Avocado / Olive Oil", sub: "Healthy fats for hormones" }
    ],
    badFoods: [
      { name: "Sugary Sodas", sub: "Empty calories, kills hunger for real food" },
      { name: "Deep Fried Fast Food", sub: "Bad trans fats, sluggish digestion" },
      { name: "Cheap Processed Snacks", sub: "Spikes insulin too hard" }
    ]
  },
  cutting: {
    title: "Fat Loss (Cutting)",
    desc: "Get shredded. Maintain a caloric deficit (-300-500 cals) while keeping protein high to spare muscle mass during weight loss.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    macros: { protein: "2.2g - 2.5g per kg", carbs: "Low/Timed", fats: "Low" },
    goodFoods: [
      { name: "Chicken Breast", sub: "The gold standard for lean protein" },
      { name: "White Fish / Tuna", sub: "Very low calorie protein source" },
      { name: "Egg Whites", sub: "Volume eating without the extra fat" },
      { name: "Green Vegetables", sub: "Broccoli, Spinach (Fill your stomach)" },
      { name: "Berries", sub: "Low calorie sweetness for cravings" }
    ],
    badFoods: [
      { name: "Cooking Oils", sub: "Hidden calories (1 tbsp = 120 cals!)" },
      { name: "Liquid Calories", sub: "Juice, Alcohol, Sugary Coffee" },
      { name: "High Fat Dairy", sub: "Cheese/Cream adds up too fast" }
    ]
  },
  maintenance: {
    title: "Body Recomp (Maintenance)",
    desc: "Stay lean while slowly building strength. Eat at maintenance calories with a perfect balance of macros for performance.",
    // FIXED IMAGE: Reliable Healthy Bowl Image
    image: "https://images.unsplash.com/photo-1543353071-087f985150fb?auto=format&fit=crop&w=800&q=80",
    macros: { protein: "2g per kg", carbs: "Moderate", fats: "Moderate" },
    goodFoods: [
      { name: "Lean Turkey/Beef", sub: "Good balance of fats/protein" },
      { name: "Greek Yogurt", sub: "High protein, gut healthy snack" },
      { name: "Sweet Potato", sub: "Sustained energy release" },
      { name: "Nuts (Measured)", sub: "Good fats, strictly portioned" },
      { name: "Quinoa / Brown Rice", sub: "Fiber rich complex carbs" }
    ],
    badFoods: [
      { name: "Excessive Sugar", sub: "Keep it for post-workout only" },
      { name: "Binge Eating", sub: "Consistency is key for maintenance" }
    ]
  }
};

export default function Nutrition() {
  const [activeTab, setActiveTab] = useState('bulking');
  const data = GUIDES[activeTab];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-fade-in">
      
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">Nutrition Guide</h1>
        <p className="text-zinc-400">Fuel your body for the goal you want</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
        {['bulking', 'cutting', 'maintenance'].map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveTab(mode)}
            className={`flex-1 py-3 px-6 rounded-lg font-black uppercase tracking-wide transition-all ${
              activeTab === mode 
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Overview Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl group">
            <div className="h-56 overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent z-10 opacity-60"></div>
              {/* IMAGE WITH SAFETY FALLBACK */}
              <img 
                src={data.image} 
                alt={data.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80"; // Fallback image
                }}
              />
              <div className="absolute bottom-4 left-4 z-20">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                  Current Goal
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-black italic text-white mb-2">{data.title}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">{data.desc}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-black rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 text-xs font-bold uppercase">Protein</span>
                  <span className="text-white font-bold">{data.macros.protein}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 text-xs font-bold uppercase">Carbs</span>
                  <span className="text-white font-bold">{data.macros.carbs}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 text-xs font-bold uppercase">Fats</span>
                  <span className="text-white font-bold">{data.macros.fats}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Foods List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* GOOD FOODS */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-green-500" />
              <h3 className="text-xl font-bold text-white">Eat These (Fuel)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.goodFoods.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-black/40 rounded-xl border border-zinc-800 hover:border-green-500/50 transition">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BAD FOODS */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Ban className="text-red-500" />
              <h3 className="text-xl font-bold text-white">Avoid / Limit (Trash)</h3>
            </div>
            <div className="space-y-3">
              {data.badFoods.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-zinc-800 hover:border-red-500/50 transition opacity-80 hover:opacity-100">
                  <div className="flex items-center gap-3">
                     <span className="text-red-500 font-bold">×</span>
                     <span className="text-zinc-300 font-medium">{item.name}</span>
                  </div>
                  <span className="text-xs text-zinc-500 italic">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}