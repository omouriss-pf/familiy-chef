import React, { useState } from 'react';
import { ShoppingList, WeeklyPlan } from '../types';
import { CheckCircle2, Circle, ShoppingBasket, Carrot, Milk, Beef, Wheat, Snowflake, HelpCircle, PackageOpen } from 'lucide-react';

interface ShoppingListViewProps {
  shoppingList: ShoppingList;
  pantryStaples: string[];
}

const CategoryIcon = ({ type }: { type: keyof ShoppingList }) => {
  switch (type) {
    case 'fruitsAndVeg': return <Carrot className="w-5 h-5 text-brand-green" />;
    case 'dairyAndEggs': return <Milk className="w-5 h-5 text-blue-400" />;
    case 'meatAndFish': return <Beef className="w-5 h-5 text-red-400" />;
    case 'pantryAndGrains': return <Wheat className="w-5 h-5 text-yellow-600" />;
    case 'frozen': return <Snowflake className="w-5 h-5 text-cyan-400" />;
    case 'other': return <HelpCircle className="w-5 h-5 text-gray-400" />;
    default: return <ShoppingBasket className="w-5 h-5" />;
  }
};

const CATEGORY_LABELS: Record<keyof ShoppingList, string> = {
  fruitsAndVeg: 'Fruits & Légumes',
  dairyAndEggs: 'Crèmerie',
  meatAndFish: 'Boucherie & Poissonnerie',
  pantryAndGrains: 'Épicerie & Céréales',
  frozen: 'Surgelés',
  other: 'Divers'
};

const ShoppingListView: React.FC<ShoppingListViewProps> = ({ shoppingList, pantryStaples }) => {
  // State to track checked items
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const renderCategory = (key: keyof ShoppingList) => {
    const items = shoppingList[key];
    if (!items || items.length === 0) return null;

    return (
      <div key={key} className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-display font-bold text-lg text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
          <CategoryIcon type={key} />
          {CATEGORY_LABELS[key]}
        </h3>
        <ul className="space-y-2">
          {items.map((item, idx) => {
            const isChecked = !!checkedItems[`${key}-${idx}`];
            return (
              <li 
                key={idx} 
                onClick={() => toggleItem(`${key}-${idx}`)}
                className={`flex items-center gap-3 cursor-pointer group transition-all ${isChecked ? 'opacity-50' : ''}`}
              >
                <div className={`transition-colors ${isChecked ? 'text-brand-green' : 'text-gray-300 group-hover:text-brand-green'}`}>
                  {isChecked ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>
                <span className={`font-body text-gray-700 ${isChecked ? 'line-through' : ''}`}>{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 pb-20">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingBasket className="w-7 h-7 text-brand-orange" />
          Liste de Courses
        </h2>
        <div className="space-y-4">
          {(Object.keys(shoppingList) as Array<keyof ShoppingList>).map(key => renderCategory(key))}
        </div>
      </div>

      <div>
         <h2 className="text-2xl font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
          <PackageOpen className="w-7 h-7 text-brand-blue" />
          Les Indispensables
          <span className="text-sm font-body font-normal text-gray-500 ml-2">(À vérifier)</span>
        </h2>
        <div className="bg-cream p-5 rounded-2xl shadow-sm border-2 border-brand-blue/20">
          <ul className="space-y-2">
            {pantryStaples.map((item, idx) => {
               const isChecked = !!checkedItems[`staple-${idx}`];
               return (
                <li 
                  key={idx} 
                  onClick={() => toggleItem(`staple-${idx}`)}
                  className={`flex items-center gap-3 cursor-pointer group ${isChecked ? 'opacity-40' : ''}`}
                >
                   <div className={`transition-colors ${isChecked ? 'text-brand-blue' : 'text-gray-300 group-hover:text-brand-blue'}`}>
                    {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <span className={`font-body text-gray-700 font-medium ${isChecked ? 'line-through' : ''}`}>{item}</span>
                </li>
               )
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListView;
