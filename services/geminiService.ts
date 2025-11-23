import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WeeklyPlan, UserPreferences, Meal } from "../types";

const apiKey = process.env.API_KEY;

// Check for API key, but don't throw immediately to allow UI to handle it if needed
const ai = new GoogleGenAI({ apiKey: apiKey || "dummy-key" });

const shoppingListSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fruitsAndVeg: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Fruits et légumes" },
    dairyAndEggs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Produits laitiers et œufs" },
    meatAndFish: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Viandes et poissons" },
    pantryAndGrains: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Épicerie et céréales" },
    frozen: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Surgelés" },
    other: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Autres" },
  }
};

const mealSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Nom du plat (amusant pour les enfants)" },
    description: { type: Type.STRING, description: "Brève description appétissante mettant en avant les produits de saison" },
    prepTimeMinutes: { type: Type.INTEGER, description: "Temps de préparation en minutes" },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Ingrédients principaux" }
  },
  required: ["name", "description", "prepTimeMinutes", "ingredients"]
};

const dayPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    day: { type: Type.STRING, enum: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] },
    lunch: mealSchema,
    dinner: mealSchema
  },
  required: ["day", "lunch", "dinner"]
};

const weeklyPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    week: { type: Type.ARRAY, items: dayPlanSchema },
    shoppingList: shoppingListSchema,
    pantryStaples: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Les indispensables à toujours avoir dans le placard (sel, poivre, huile, etc.)" }
  },
  required: ["week", "shoppingList", "pantryStaples"]
};

const getCommonPrompt = (prefs: UserPreferences, currentMonth: string, context: string) => `
    Nous sommes en ${currentMonth}.
    ${context}

    Contraintes IMPÉRATIVES:
    1. SAISONNALITÉ: Utilise UNIQUEMENT des fruits et légumes de saison pour le mois de ${currentMonth} en France.
    2. SPORTIFS: Repas riches en nutriments (protéines, bons glucides) pour l'énergie.
    3. RAPIDITÉ: Max 30 min de préparation.
    4. ENFANTS: Visuel, coloré, noms de plats ludiques.
    5. RESTRICTIONS: Respecter: ${prefs.dietaryRestrictions || "Aucune"}.
`;

const getImagePart = (imageBase64?: string) => {
    if (!imageBase64) return null;
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    return {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg"
      }
    };
};

export const generateWeeklyMenu = async (
  prefs: UserPreferences, 
  imageBase64?: string
): Promise<WeeklyPlan> => {
  const date = new Date();
  const currentMonth = date.toLocaleString('fr-FR', { month: 'long' });
  const imagePart = getImagePart(imageBase64);

  let promptContext = `
    Préférences utilisateur:
    - Aime: ${prefs.likes || "Tout"}.
    - N'aime pas: ${prefs.dislikes || "Rien"}.
  `;

  if (imagePart) {
    promptContext += `
    CONTEXTE IMAGE: L'utilisateur a fourni une photo de son frigo/placard.
    TACHE: Identifie les ingrédients et utilise-les EN PRIORITÉ pour composer les menus de la semaine.
    `;
  }

  const prompt = `
    Génère un plan de repas hebdomadaire (Lundi à Dimanche, midi et soir) pour une famille de ${prefs.familyMembers} personnes.
    ${getCommonPrompt(prefs, currentMonth, promptContext)}
    Fournis également une liste de courses catégorisée précise.
  `;

  const contents = [];
  if (imagePart) contents.push(imagePart);
  contents.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents.length > 1 ? { parts: contents } : contents[0].text,
      config: {
        responseMimeType: "application/json",
        responseSchema: weeklyPlanSchema,
        systemInstruction: "Tu es un chef cuisinier et nutritionniste sportif expert.",
      }
    });

    if (!response.text) throw new Error("No data returned");
    return JSON.parse(response.text) as WeeklyPlan;
  } catch (error) {
    console.error("Error generating weekly plan:", error);
    throw error;
  }
};

export const generateSurpriseMeal = async (
    prefs: UserPreferences,
    imageBase64?: string
): Promise<Meal> => {
    const date = new Date();
    const currentMonth = date.toLocaleString('fr-FR', { month: 'long' });
    const imagePart = getImagePart(imageBase64);

    let promptContext = `
        MODE IMPROVISATION: Ignore les préférences "Aime/N'aime pas" spécifiques, sois créatif !
        L'utilisateur veut une idée de repas MAINTENANT.
    `;

    if (imagePart) {
        promptContext += `
        CONTEXTE IMAGE: L'utilisateur a scanné son frigo/placard.
        TACHE: Trouve la MEILLEURE recette possible à faire IMMÉDIATEMENT avec ces ingrédients visibles.
        `;
    } else {
        promptContext += `
        TACHE: Propose une recette originale, un "Sauve-qui-peut" délicieux et équilibré.
        `;
    }

    const prompt = `
        Génère UN SEUL repas (Midi ou Soir) pour ${prefs.familyMembers} personnes.
        ${getCommonPrompt(prefs, currentMonth, promptContext)}
    `;

    const contents = [];
    if (imagePart) contents.push(imagePart);
    contents.push({ text: prompt });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents.length > 1 ? { parts: contents } : contents[0].text,
            config: {
                responseMimeType: "application/json",
                responseSchema: mealSchema, // Use the mealSchema defined internally
                systemInstruction: "Tu es un chef créatif spécialisé dans la cuisine express et saine.",
                temperature: 0.8
            }
        });

        if (!response.text) throw new Error("No data returned");
        return JSON.parse(response.text) as Meal;
    } catch (error) {
        console.error("Error generating surprise meal:", error);
        throw error;
    }
}

export const generateMealImage = async (mealName: string, description: string): Promise<string | null> => {
  const prompt = `Photo professionnelle de cuisine culinaire de ce plat: ${mealName}. ${description}. 
  Style: Lumineux, coloré, appétissant, présentation amusante pour enfants, haute résolution, photoréaliste, sur une jolie table. Mise en valeur des ingrédients frais.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image for " + mealName, error);
    return null;
  }
};