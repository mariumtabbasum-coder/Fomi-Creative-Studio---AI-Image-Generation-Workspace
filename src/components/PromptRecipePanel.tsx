import React, { useState } from 'react';
import {
  Wand2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Plus,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { PromptRecipe, RecipeState, VisualStyle } from '../types';
import { EXAMPLE_RECIPES, RECIPE_SUGGESTIONS, buildPromptFromRecipe } from '../data/recipes';

interface PromptRecipePanelProps {
  onInsertPrompt: (promptText: string, recipeName: string, style?: VisualStyle) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const PromptRecipePanel: React.FC<PromptRecipePanelProps> = ({
  onInsertPrompt,
  isOpen,
  onToggleOpen,
}) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  const [recipeState, setRecipeState] = useState<RecipeState>({
    subject: '',
    environment: '',
    lighting: '',
    composition: '',
    style: '',
  });

  const [activeTab, setActiveTab] = useState<'custom' | 'examples'>('examples');

  const synthesizedPrompt = buildPromptFromRecipe(recipeState);

  // Handle selecting an example recipe
  const handleSelectExample = (recipe: PromptRecipe) => {
    setSelectedRecipeId(recipe.id);
    setRecipeState({
      subject: recipe.subject,
      environment: recipe.environment,
      lighting: recipe.lighting,
      composition: recipe.composition,
      style: recipe.style,
    });
  };

  // Handle applying a suggestion pill to a specific field
  const handleApplySuggestion = (field: keyof RecipeState, suggestion: string) => {
    setRecipeState((prev) => ({
      ...prev,
      [field]: suggestion,
    }));
  };

  const handleClearRecipe = () => {
    setSelectedRecipeId('');
    setRecipeState({
      subject: '',
      environment: '',
      lighting: '',
      composition: '',
      style: '',
    });
  };

  const handleApplyToComposer = () => {
    const textToInsert = synthesizedPrompt.trim();
    if (!textToInsert) return;

    const matchedRecipe = EXAMPLE_RECIPES.find((r) => r.id === selectedRecipeId);
    const recipeName = matchedRecipe ? matchedRecipe.name : 'Custom Recipe';
    const chosenStyle = (recipeState.style as VisualStyle) || undefined;

    onInsertPrompt(textToInsert, recipeName, chosenStyle);
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#15171C] overflow-hidden transition-all shadow-sm">
      {/* Header bar */}
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FAF0ED] dark:bg-[#2B1B18] text-[#D95338] flex items-center justify-center">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Prompt Recipe Studio
              </h2>
              <span className="text-[11px] font-medium text-[#D95338] bg-[#FAF0ED] dark:bg-[#2B1B18] px-2 py-0.5 rounded-full">
                Original Feature
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Deconstruct your concept into Subject, Environment, Lighting, and Composition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleOpen}
            className="flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
            aria-expanded={isOpen}
          >
            <span className="hidden sm:inline">{isOpen ? 'Collapse Recipe' : 'Open Recipe Builder'}</span>
            <span className="sm:hidden">{isOpen ? 'Collapse' : 'Recipe'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Sub Navigation: Curated Examples vs Custom Ingredients */}
          <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'examples'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>4 Curated Recipes</span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ingredient Matrix</span>
            </button>
          </div>

          {/* Tab 1: 4 Curated Examples Cards */}
          {activeTab === 'examples' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {EXAMPLE_RECIPES.map((recipe) => {
                const isSelected = selectedRecipeId === recipe.id;
                return (
                  <div
                    key={recipe.id}
                    onClick={() => handleSelectExample(recipe)}
                    className={`group text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#D95338] bg-[#FAF0ED]/40 dark:bg-[#2B1B18]/30 shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/40 dark:bg-neutral-900/40'
                    }`}
                  >
                    <div>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-2.5 relative">
                        <img
                          src={recipe.sampleImageUrl}
                          alt={recipe.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 text-[10px] font-mono bg-black/60 text-white backdrop-blur-sm rounded">
                          {recipe.suggestedRatio}
                        </span>
                      </div>
                      <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                        {recipe.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                        {recipe.tagline}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500 font-mono text-[10px]">{recipe.style}</span>
                      <span
                        className={`font-medium ${
                          isSelected ? 'text-[#D95338]' : 'text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {isSelected ? 'Loaded' : 'Load Recipe'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Custom Ingredient Matrix with Editable Inputs & Selectable Suggestions */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RECIPE_SUGGESTIONS.map((item) => {
                  const currentValue = recipeState[item.field];

                  return (
                    <div
                      key={item.field}
                      className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30"
                    >
                      <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        {item.label}
                      </label>
                      <input
                        type="text"
                        value={currentValue}
                        onChange={(e) =>
                          setRecipeState((prev) => ({
                            ...prev,
                            [item.field]: e.target.value,
                          }))
                        }
                        placeholder={`Enter custom ${item.label.toLowerCase()}...`}
                        className="w-full text-xs px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181A1F] text-neutral-900 dark:text-neutral-100 focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] outline-none"
                      />

                      {/* Suggestions list */}
                      <div className="mt-2.5">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                          Suggestions
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.suggestions.slice(0, 3).map((sugg, idx) => {
                            const isChosen = currentValue === sugg;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleApplySuggestion(item.field, sugg)}
                                className={`text-[11px] text-left px-2 py-0.5 rounded border transition-colors ${
                                  isChosen
                                    ? 'bg-[#FAF0ED] dark:bg-[#2B1B18] border-[#D95338] text-[#D95338] font-medium'
                                    : 'bg-white dark:bg-[#1B1E24] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                                }`}
                              >
                                {sugg}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recipe Live Synthesis Preview & Action Bar */}
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#FAF7F2] dark:bg-[#181A1F]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-[#D95338]" />
                Assembled Prompt Preview:
              </span>
              <div className="flex items-center gap-2">
                {synthesizedPrompt && (
                  <button
                    onClick={handleClearRecipe}
                    className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Ingredients
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 font-serif italic bg-white dark:bg-[#111317] p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800/80 min-h-[44px]">
              {synthesizedPrompt || (
                <span className="text-neutral-400 font-sans not-italic">
                  Select ingredients above or choose an example recipe to construct a professional prompt.
                </span>
              )}
            </p>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={handleApplyToComposer}
                disabled={!synthesizedPrompt.trim()}
                className="px-4 py-2 text-xs font-medium rounded-lg text-white bg-[#D95338] hover:bg-[#C2432B] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
              >
                <span>Insert into Composer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
