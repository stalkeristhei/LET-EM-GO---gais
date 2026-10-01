import React, { useState } from 'react';
import { SuggestionItem } from '../types';

interface SuggestScreenProps {
  suggestions: SuggestionItem[];
  onAddSuggestion: (suggestion: SuggestionItem) => void;
  onUpvoteSuggestion: (id: string) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onAddPoints: (points: number) => void;
}

export const SuggestScreen: React.FC<SuggestScreenProps> = ({
  suggestions,
  onAddSuggestion,
  onUpvoteSuggestion,
  onShowToast,
  onAddPoints,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Travel');
  const [description, setDescription] = useState<string>('');
  const [isDictating, setIsDictating] = useState<boolean>(false);

  const categories = [
    { id: 'Travel', icon: '🗺️', label: 'Travel' },
    { id: 'Stores', icon: '🏪', label: 'Stores' },
    { id: 'Restaurants', icon: '🍽️', label: 'Restaurants' },
    { id: 'Parks', icon: '🌳', label: 'Parks' },
    { id: 'Transit', icon: '🚆', label: 'Transit' },
    { id: 'Healthcare', icon: '🏥', label: 'Healthcare' },
    { id: 'Platform', icon: '💡', label: 'Platform' },
  ];

  const helperTags = ['Slope grade %', 'Restroom clearance', 'Acoustic level', 'Tactile paving'];

  const handleDictate = () => {
    setIsDictating(true);
    onShowToast('Listening for your suggestion...', 'mic');
    setTimeout(() => {
      const simulatedText = 'Add clear turnstile clearance widths and sensor heights for power chairs.';
      setDescription((prev) => (prev ? `${prev} ${simulatedText}` : simulatedText));
      setIsDictating(false);
      onShowToast('Voice dictation captured!', 'record_voice_over');
    }, 2200);
  };

  const handleAppendHelper = (tag: string) => {
    setDescription((prev) => (prev ? `${prev} [${tag}]` : `[${tag}] `));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      onShowToast('Please enter your suggestion details', 'warning');
      return;
    }

    const newSuggestion: SuggestionItem = {
      id: `sugg-${Date.now()}`,
      title: description.length > 50 ? `${description.slice(0, 48)}...` : description,
      description: description,
      category: selectedCategory,
      stage: 'review',
      stageLabel: 'Community Review',
      votes: 1,
      commentsCount: 0,
      userVoted: true,
      progressPercent: 20,
      author: 'Elena R. (You)',
      timestamp: 'Just now',
    };

    onAddSuggestion(newSuggestion);
    onAddPoints(25);
    setDescription('');
    onShowToast('Suggestion Submitted! 🚀 +25 Access Points earned.', 'verified');
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-20 px-4 max-w-xl mx-auto space-y-4">
      {/* 1. Intro / Purpose Banner */}
      <section className="bg-[#f0f3ff] rounded-2xl p-4 shadow-sm relative overflow-hidden border border-[#cfdaf2]">
        <div className="relative z-10 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#006194] text-white">
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            </span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#006194]">
              Community-Led Mapping
            </span>
          </div>
          <h2 className="text-[22px] font-bold text-[#111c2d] leading-tight">
            What should we improve?
          </h2>
          <p className="text-[14px] text-[#3f4850] leading-snug">
            You know your accessibility needs better than anyone. Tell us what would make your everyday life easier.
          </p>
        </div>

        {/* Gamification Perk Ribbon */}
        <div className="mt-3.5 bg-[#85f8c4]/50 rounded-xl p-3 flex items-center justify-between gap-2 border border-[#82f5c1]">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="material-symbols-outlined text-[#002114] text-[22px] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <p className="text-[12px] font-bold text-[#002114] truncate">
              Earn <span className="underline">+25 AP</span> per verified suggestion!
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white text-[#006c4a] font-bold text-[11px] shrink-0 shadow-xs">
            Rank #4
          </span>
        </div>
      </section>

      {/* 2. Suggestion Form Card */}
      <section className="bg-white rounded-2xl p-4 shadow-md border border-[#cfdaf2] flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006194] text-[24px]">add_task</span>
            <h3 className="text-[17px] font-bold text-[#111c2d]">Suggest an Update</h3>
          </div>
          <span className="text-[12px] text-[#707881] font-semibold">Step 1 of 2</span>
        </div>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-[#111c2d]">Select Category</label>
          <div
            role="radiogroup"
            aria-label="Suggestion category"
            className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-2 px-2"
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-checked={isSelected}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-full font-bold text-[13px] flex items-center gap-1.5 shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-[#006194] text-white border-[#006194] shadow-xs'
                      : 'bg-[#f0f3ff] text-[#3f4850] border-[#cfdaf2] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accessible Textarea & Dictate */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="suggestion-text" className="text-[13px] font-bold text-[#111c2d]">
              Description & Context
            </label>
            <span
              className={`text-[12px] font-semibold ${
                description.length > 280 ? 'text-[#ba1a1a]' : 'text-[#707881]'
              }`}
            >
              {description.length} / 300
            </span>
          </div>

          <div className="relative">
            <textarea
              id="suggestion-text"
              rows={4}
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about a barrier, missing feature, or idea (e.g. 'Show accessible parking distance from entrance')."
              className="w-full bg-[#f0f3ff] text-[#111c2d] placeholder:text-[#707881] rounded-xl p-3.5 text-[14px] leading-relaxed outline-none border border-[#cfdaf2] focus:bg-white focus:border-[#006194] transition-all resize-none min-h-[110px]"
            />

            {/* Dictate Trigger */}
            <button
              type="button"
              onClick={handleDictate}
              aria-label="Voice-to-text dictate suggestion"
              className={`min-h-[40px] px-3 rounded-full absolute right-2.5 bottom-2.5 font-bold text-[12px] flex items-center gap-1 shadow-sm transition-all ${
                isDictating
                  ? 'bg-[#ba1a1a] text-white animate-pulse'
                  : 'bg-white text-[#006194] border border-[#cfdaf2] hover:bg-[#e7eeff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDictating ? 'record_voice_over' : 'mic'}
              </span>
              <span>{isDictating ? 'Listening...' : 'Dictate'}</span>
            </button>
          </div>

          {/* Quick Helper Prompts */}
          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
            <span className="text-[11px] font-bold text-[#707881]">Try mentioning:</span>
            {helperTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAppendHelper(tag)}
                className="px-2.5 py-0.5 rounded-full bg-[#e7eeff] hover:bg-[#cce5ff] text-[#111c2d] text-[11px] font-semibold transition-colors border border-[#cfdaf2]"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[50px] px-4 rounded-xl bg-[#006194] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md hover:bg-[#007bb9] active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span>Submit Suggestion</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] tracking-wide font-bold">
                +25 AP
              </span>
            </button>
          </div>
        </form>
      </section>

      {/* 3. Community Co-Creation Pipeline Tracker */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006c4a] text-[24px]">
              published_with_changes
            </span>
            <h3 className="text-[17px] font-bold text-[#111c2d]">Community Co-Creation</h3>
          </div>
          <span className="text-[12px] text-[#006194] font-bold uppercase tracking-wider">
            Data Loop
          </span>
        </div>
        <p className="text-[13px] text-[#3f4850] -mt-1.5 leading-snug">
          Every community vote moves proposals closer to being rendered onto everyone’s accessible navigation map.
        </p>

        {/* Proposals List */}
        <div className="space-y-3">
          {suggestions.map((item) => {
            const isInDev = item.stage === 'in_dev';
            const isReview = item.stage === 'review';

            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2] flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      isInDev
                        ? 'bg-[#cce5ff] text-[#001d31]'
                        : isReview
                        ? 'bg-[#ffdcc3] text-[#2f1500]'
                        : 'bg-[#dee8ff] text-[#006194]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isInDev ? 'rocket_launch' : isReview ? 'how_to_vote' : 'search'}
                    </span>
                    <span className="tracking-wide uppercase">{item.stageLabel}</span>
                  </div>
                  <span className="text-[11px] text-[#707881] font-semibold">
                    Category: {item.category}
                  </span>
                </div>

                <h4 className="text-[16px] font-bold text-[#111c2d] leading-snug">
                  {item.title}
                </h4>
                <p className="text-[13px] text-[#3f4850] leading-snug">
                  {item.description}
                </p>

                {/* Impact Callout if present */}
                {item.impactNote && (
                  <div className="rounded-xl p-2.5 bg-[#85f8c4]/30 border border-[#82f5c1] flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[#006c4a] text-[20px] shrink-0"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span className="text-[12px] text-[#00714e] font-semibold">
                      {item.impactNote}
                    </span>
                  </div>
                )}

                {/* Support Stats & Interactive Upvoting */}
                <div className="flex items-center justify-between pt-1 border-t border-[#cfdaf2]/50">
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-[#111c2d]">
                      {item.votes} votes
                    </span>
                    {item.commentsCount > 0 && (
                      <span className="text-[11px] text-[#707881]">
                        {item.commentsCount} comments
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-pressed={item.userVoted}
                    onClick={() => {
                      onUpvoteSuggestion(item.id);
                      if (!item.userVoted) {
                        onAddPoints(5);
                        onShowToast('Upvote Confirmed! 👍 +5 AP earned.', 'thumb_up');
                      }
                    }}
                    className={`min-h-[44px] px-4 py-1.5 rounded-full font-bold text-[13px] flex items-center gap-1.5 transition-all active:scale-95 shadow-xs border ${
                      item.userVoted
                        ? 'bg-[#006194] text-white border-[#006194]'
                        : 'bg-[#cce5ff] text-[#001d31] border-[#cfdaf2] hover:bg-[#93ccff]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={item.userVoted ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {item.userVoted ? 'check' : 'thumb_up'}
                    </span>
                    <span>{item.userVoted ? 'Upvoted' : 'Upvote (+5 AP)'}</span>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#e7eeff] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isInDev ? 'bg-[#006194]' : isReview ? 'bg-[#8d4b00]' : 'bg-[#707881]'
                    }`}
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
