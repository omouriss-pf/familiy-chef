import React, { useState, useEffect } from 'react';
import { Meal } from '../types';
import { generateMealImage } from '../services/geminiService';
import { Clock, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface MealCardProps {
  type: 'Midi' | 'Soir';
  meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ type, meal }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(meal.imageUrl);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageGenerated, setImageGenerated] = useState(false);

  const handleGenerateImage = async () => {
    if (loadingImage || imageGenerated) return;
    setLoadingImage(true);
    try {
      const url = await generateMealImage(meal.name, meal.description);
      if (url) {
        setImageUrl(url);
        setImageGenerated(true);
      }
    } catch (e) {
      // Fail silently or show retry icon
    } finally {
      setLoadingImage(false);
    }
  };

  // Auto-generate image if it's missing? 
  // Let's make it manual or triggered on visibility to save tokens/time, 
  // OR trigger immediately if it's a "Dinner" (often more important).
  // For this UX, a manual "See the dish" button or automatic is fine. 
  // Let's go with a cute placeholder that invites to generate.

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-40 bg-gray-100 overflow-hidden group">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={meal.name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-brand-blue/5 text-brand-blue/50">
             {loadingImage ? (
               <div className="flex flex-col items-center gap-2 animate-pulse">
                 <RefreshCw className="w-8 h-8 animate-spin" />
                 <span className="text-xs font-bold uppercase tracking-wider">Création de la photo...</span>
               </div>
             ) : (
               <button 
                 onClick={handleGenerateImage}
                 className="flex flex-col items-center gap-2 hover:text-brand-blue transition-colors"
               >
                 <ImageIcon className="w-8 h-8" />
                 <span className="text-xs font-bold uppercase tracking-wider">Voir le plat</span>
               </button>
             )}
          </div>
        )}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wide shadow-sm">
          {type}
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {meal.prepTimeMinutes} min
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-lg text-gray-800 leading-tight mb-1">
          {meal.name}
        </h3>
        <p className="text-sm text-gray-500 font-body line-clamp-2 mb-3 flex-grow">
          {meal.description}
        </p>
        
        <div className="mt-auto pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-bold uppercase mb-1">Ingrédients clés</p>
          <div className="flex flex-wrap gap-1">
            {meal.ingredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="inline-block px-2 py-0.5 bg-brand-yellow/20 text-gray-700 rounded-md text-xs font-medium">
                {ing}
              </span>
            ))}
            {meal.ingredients.length > 3 && (
              <span className="inline-block px-2 py-0.5 text-gray-400 text-xs">
                +{meal.ingredients.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
