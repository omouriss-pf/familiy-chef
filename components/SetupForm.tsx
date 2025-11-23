import React, { useState, useRef } from 'react';
import { UserPreferences } from '../types';
import { ChefHat, Utensils, Heart, XCircle, Users, Camera, Dice5, CheckCircle2, Trash2 } from 'lucide-react';

interface SetupFormProps {
  onGenerateWeek: (prefs: UserPreferences, image?: string) => void;
  onSurpriseMeal: (prefs: UserPreferences, image?: string) => void;
  isLoading: boolean;
}

const SetupForm: React.FC<SetupFormProps> = ({ onGenerateWeek, onSurpriseMeal, isLoading }) => {
  const [prefs, setPrefs] = useState<UserPreferences>({
    familyMembers: 4,
    dietaryRestrictions: '',
    likes: '',
    dislikes: ''
  });
  const [capturedImage, setCapturedImage] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrefs(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (change: number) => {
    setPrefs(prev => ({ ...prev, familyMembers: Math.max(1, prev.familyMembers + change) }));
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCapturedImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-brand-yellow mb-8">
      <div className="bg-brand-yellow p-6 text-center relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-display font-bold text-gray-800 flex items-center justify-center gap-3">
            <ChefHat className="w-10 h-10" />
            Mon Assistant Menu
            </h1>
            <p className="text-gray-800 mt-2 font-body font-medium">Préparez la semaine ou improvisez un repas !</p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-50 transform rotate-12 scale-150 pointer-events-none"></div>
      </div>
      
      <div className="p-8 space-y-8">
        {/* Family Size */}
        <div className="space-y-3">
          <label className="block text-lg font-display font-bold text-gray-700 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-blue" />
            Combien de gourmands ?
          </label>
          <div className="flex items-center gap-4 bg-brand-blue/10 p-4 rounded-2xl w-fit">
            <button 
              onClick={() => handleNumberChange(-1)}
              className="w-10 h-10 rounded-full bg-white text-brand-blue font-bold text-xl shadow hover:bg-brand-blue hover:text-white transition-colors"
            >-</button>
            <span className="text-2xl font-display font-bold text-brand-blue w-8 text-center">{prefs.familyMembers}</span>
            <button 
              onClick={() => handleNumberChange(1)}
              className="w-10 h-10 rounded-full bg-white text-brand-blue font-bold text-xl shadow hover:bg-brand-blue hover:text-white transition-colors"
            >+</button>
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="space-y-3">
          <label className="block text-lg font-display font-bold text-gray-700 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-brand-orange" />
            Régimes ou allergies ?
          </label>
          <input 
            type="text" 
            name="dietaryRestrictions"
            value={prefs.dietaryRestrictions}
            onChange={handleChange}
            placeholder="Ex: Sans gluten, Végétarien, Allergie arachides..."
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-brand-orange focus:ring-0 outline-none transition-all font-body text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Likes & Dislikes */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-lg font-display font-bold text-gray-700 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              On adore...
            </label>
            <input 
              type="text" 
              name="likes"
              value={prefs.likes}
              onChange={handleChange}
              placeholder="Pâtes, Poulet..."
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:ring-0 outline-none transition-all font-body"
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-lg font-display font-bold text-gray-700 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-gray-500" />
              On évite...
            </label>
            <input 
              type="text" 
              name="dislikes"
              value={prefs.dislikes}
              onChange={handleChange}
              placeholder="Choux de bruxelles..."
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-gray-400 focus:ring-0 outline-none transition-all font-body"
            />
          </div>
        </div>

        {/* Image Input Section */}
        <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-300">
             <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
            />
            {!capturedImage ? (
                <button
                    onClick={handleCameraClick}
                    className="w-full py-3 text-gray-500 font-bold font-display hover:text-brand-blue transition-colors flex flex-col items-center gap-2"
                >
                    <Camera className="w-8 h-8 text-brand-blue" />
                    <span>Ajouter une photo du frigo / placard (Optionnel)</span>
                </button>
            ) : (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-green-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                             <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 font-display">Photo ajoutée !</p>
                            <p className="text-xs text-gray-500">Prête pour l'analyse</p>
                        </div>
                    </div>
                    <button 
                        onClick={clearImage}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <button 
                onClick={() => onGenerateWeek(prefs, capturedImage)}
                disabled={isLoading}
                className={`py-4 px-6 rounded-2xl text-lg font-display font-bold text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2
                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-brand-green to-teal-500 hover:shadow-brand-green/30'}
                `}
            >
               {isLoading ? "..." : "Planifier la Semaine"}
            </button>

            <button
                onClick={() => onSurpriseMeal(prefs, capturedImage)}
                disabled={isLoading}
                className={`py-4 px-6 rounded-2xl font-display font-bold text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2
                     ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:shadow-purple-500/30'}
                `}
            >
                <Dice5 className="w-6 h-6" />
                Repas Improvisé
            </button>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;