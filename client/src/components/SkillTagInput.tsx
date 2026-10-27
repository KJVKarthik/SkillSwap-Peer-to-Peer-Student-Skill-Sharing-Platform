import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';

interface SkillTagInputProps {
  label: string;
  sublabel?: string;
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  accentColor?: 'amber' | 'indigo' | 'emerald';
}

export const SkillTagInput: React.FC<SkillTagInputProps> = ({
  label,
  sublabel,
  skills,
  onChange,
  placeholder = 'Type skill & press Enter (e.g. Python, UI/UX, Guitar)',
  suggestions = [
    'Python',
    'React & Next.js',
    'UI/UX & Figma',
    'Java',
    'Data Analytics',
    'Video Editing',
    'Guitar',
    'Calculus',
    'Public Speaking',
    'Canva'
  ],
  accentColor = 'amber'
}) => {
  const [inputVal, setInputVal] = useState('');

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    
    // Support comma-separated skills in one go
    const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
    const newSkills = [...skills];

    for (const part of parts) {
      if (!newSkills.some(s => s.toLowerCase() === part.toLowerCase())) {
        newSkills.push(part);
      }
    }

    onChange(newSkills);
    setInputVal('');
  };

  const removeSkill = (indexToRemove: number) => {
    onChange(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputVal);
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      addSkill(inputVal);
    }
  };

  const badgeColorClass =
    accentColor === 'amber'
      ? 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80'
      : accentColor === 'emerald'
      ? 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80'
      : 'bg-indigo-100 text-indigo-900 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/80';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          {skills.length} {skills.length === 1 ? 'skill' : 'skills'} added
        </span>
      </div>

      {sublabel && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-1">
          {sublabel}
        </p>
      )}

      {/* Active Skills Chips */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 min-h-[42px] items-center">
          {skills.map((skill, idx) => (
            <span
              key={`${skill}-${idx}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-2xs animate-in zoom-in-95 duration-150 ${badgeColorClass}`}
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                title={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input + Add button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 shadow-2xs"
        />
        <button
          type="button"
          onClick={() => addSkill(inputVal)}
          disabled={!inputVal.trim()}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {/* Quick suggestions */}
      {suggestions.length > 0 && (
        <div className="pt-1">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mb-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            <span>Quick add common skills:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestions
              .filter((s) => !skills.some((existing) => existing.toLowerCase() === s.toLowerCase()))
              .slice(0, 7)
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-slate-700 dark:hover:text-amber-300 transition-colors"
                >
                  + {s}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
