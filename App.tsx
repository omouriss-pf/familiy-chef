import React, { useState } from 'react';
import { WeeklyPlan, UserPreferences, Meal } from './types';
import { generateWeeklyMenu, generateSurpriseMeal } from './services/geminiService';
import SetupForm from './components/SetupForm';
import MealCard from './components/MealCard';
import ShoppingListView from './components/ShoppingListView';
import { Calendar, ListChecks, ArrowLeft, Sparkles, ChefHat } from 'lucide-react';

function App() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [surpriseMeal, setSurpriseMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'plan' | 'list'>('plan');
  const [loadingMessage, setLoadingMessage] = useState("Nos chefs robots sont aux fourneaux...");

  const handleGenerateWeek = async (prefs: UserPreferences, image?: string) => {
    setLoading(true);
    setLoadingMessage(image ? "Analyse de votre frigo pour la semaine..." : "Création de votre semainier sportif et de saison...");

    try {
      const generatedPlan = await generateWeeklyMenu(prefs, image);
      setPlan(generatedPlan);
      setSurpriseMeal(null);
      setView('plan');
    } catch (error) {
      alert("Oups ! Petit problème lors de la création du menu. Réessayez !");
    } finally {
      setLoading(false);
    }
  };

  const handleSurpriseMeal = async (prefs: UserPreferences, image?: string) => {
    setLoading(true);
    setLoadingMessage(image ? "Analyse express des ingrédients..." : "Recherche d'une idée géniale pour ce soir...");

    try {
      const meal = await generateSurpriseMeal(prefs, image);
      setSurpriseMeal(meal);
      setPlan(null);
    } catch (error) {
        alert("Oups ! L'inspiration manque. Réessayez !");
    } finally {
        setLoading(false);
    }
  };

  const reset = () => {
    setPlan(null);
    setSurpriseMeal(null);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 text-center space-y-6">
         <div className="relative">
           <div className="w-24 h-24 border-8 border-brand-yellow/30 border-t-brand-orange rounded-full animate-spin"></div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <Sparkles className="w-10 h-10 text-brand-yellow animate-pulse" />
           </div>
         </div>
         <h2 className="text-2xl font-display font-bold text-gray-800 animate-pulse">{loadingMessage}</h2>
         <p className="text-gray-600 font-body max-w-md">
           Nous vérifions la saisonnalité et l'équilibre nutritionnel...
         </p>
      </div>
    );
  }

  // Initial Setup View
  if (!plan && !surpriseMeal) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="w-full">
          <SetupForm onGenerateWeek={handleGenerateWeek} onSurpriseMeal={handleSurpriseMeal} isLoading={loading} />
        </div>
      </div>
    );
  }

  // Surprise Meal View (Single Result)
  if (surpriseMeal) {
      return (
          <div className="min-h-screen bg-cream p-4 flex flex-col items-center">
             <div className="w-full max-w-md space-y-6">
                <button 
                    onClick={reset}
                    className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Retour
                </button>
                
                <div className="text-center">
                    <h1 className="text-3xl font-display font-bold text-purple-600 mb-2 flex items-center justify-center gap-2">
                        <Sparkles className="w-8 h-8" />
                        Repas Improvisé !
                    </h1>
                    <p className="text-gray-600">Voici une idée express rien que pour vous.</p>
                </div>

                <div className="transform hover:scale-[1.02] transition-transform duration-300">
                    <MealCard type="Midi" meal={surpriseMeal} />
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-display font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                        <ChefHat className="w-5 h-5 text-brand-orange" />
                        Pourquoi c'est top ?
                    </h3>
                    <ul className="space-y-2 text-gray-600 font-body text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold">✓</span> Rapide à faire (-30 min)
                        </li>
                        <li className="flex items-start gap-2">
                             <span className="text-green-500 font-bold">✓</span> Produits de saison
                        </li>
                        <li className="flex items-start gap-2">
                             <span className="text-green-500 font-bold">✓</span> Adapté aux sportifs
                        </li>
                    </ul>
                </div>
             </div>
          </div>
      )
  }

  // Weekly Plan View
  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={reset}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
              title="Retour à la configuration"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-bold text-gray-800 hidden sm:block">
              Mon Semainier
            </h1>
          </div>

          {/* Toggle View */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setView('plan')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === 'plan' 
                  ? 'bg-white text-brand-blue shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Menu
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === 'list' 
                  ? 'bg-white text-brand-orange shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              Liste
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'plan' ? (
          <div className="space-y-10">
             {plan?.week.map((dayPlan, index) => (
               <div key={dayPlan.day} className="scroll-mt-24" id={dayPlan.day}>
                 <div className="flex items-center gap-4 mb-4">
                   <div className="bg-brand-yellow text-gray-800 font-display font-bold text-xl px-4 py-1 rounded-lg transform -rotate-1 shadow-sm">
                     {dayPlan.day}
                   </div>
                   <div className="h-1 flex-grow bg-gray-200 rounded-full"></div>
                 </div>
                 
                 <div className="grid md:grid-cols-2 gap-6">
                    <MealCard type="Midi" meal={dayPlan.lunch} />
                    <MealCard type="Soir" meal={dayPlan.dinner} />
                 </div>
               </div>
             ))}
          </div>
        ) : (
          <ShoppingListView 
            shoppingList={plan!.shoppingList} 
            pantryStaples={plan!.pantryStaples} 
          />
        )}
      </main>

      {/* Floating Nav for Days (Mobile/Tablet) in Plan View */}
      {view === 'plan' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur shadow-2xl border border-gray-200 rounded-full px-4 py-3 flex gap-2 z-30 overflow-x-auto max-w-[90vw]">
          {plan?.week.map((d) => (
            <a 
              key={d.day} 
              href={`#${d.day}`}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-bold text-xs hover:bg-brand-blue hover:text-white transition-colors flex-shrink-0"
            >
              {d.day.substring(0, 1)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;