import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { QuestionData, GameModeType, DifficultyType, ShirtSequenceItem } from '../types/football.ts';
import { X, Plus, Edit3, Trash2, RotateCcw, Check, Sparkles } from 'lucide-react';
import { playClickSound, playCorrectSound } from '../services/sound.ts';
import { ClubCrest } from './GameArena.tsx';
import { IconVARScreen, IconFootball } from './Football3DIcons.tsx';

interface AdminQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminQuestionsModal: React.FC<AdminQuestionsModalProps> = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'two_clubs' | 'shirt_history' | 'nationalities'>('all');
  const [editingQuestion, setEditingQuestion] = useState<Partial<QuestionData> | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form states
  const [mode, setMode] = useState<GameModeType>('two_clubs');
  const [difficulty, setDifficulty] = useState<DifficultyType>('medium');
  const [questionText, setQuestionText] = useState('');
  const [club1, setClub1] = useState('');
  const [club2, setClub2] = useState('');
  const [optionsStr, setOptionsStr] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [acceptedAnswersStr, setAcceptedAnswersStr] = useState('');
  const [explanation, setExplanation] = useState('');
  const [hintNationality, setHintNationality] = useState('');
  const [hintPosition, setHintPosition] = useState('');
  const [hintYears, setHintYears] = useState('');
  const [sequence, setSequence] = useState<ShirtSequenceItem[]>([
    { club: '', number: 10, period: '' },
    { club: '', number: 7, period: '' },
    { club: '', number: 9, period: '' },
  ]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminQuestions();
      setQuestions(res.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadQuestions();
    }
  }, [isOpen]);

  const handleOpenAdd = () => {
    playClickSound();
    setEditingQuestion({});
    setMode('two_clubs');
    setDifficulty('medium');
    setQuestionText('Which player played for both clubs?');
    setClub1('');
    setClub2('');
    setOptionsStr('');
    setCorrectAnswer('');
    setAcceptedAnswersStr('');
    setExplanation('');
    setHintNationality('');
    setHintPosition('');
    setHintYears('');
    setSequence([
      { club: '', number: 10, period: '' },
      { club: '', number: 7, period: '' },
      { club: '', number: 9, period: '' },
    ]);
  };

  const handleOpenEdit = (q: QuestionData) => {
    playClickSound();
    setEditingQuestion(q);
    setMode(q.mode);
    setDifficulty(q.difficulty);
    setQuestionText(q.question);
    setClub1(q.clubs?.[0] || '');
    setClub2(q.clubs?.[1] || '');
    setOptionsStr((q.options || []).join(', '));
    setCorrectAnswer(q.correctAnswer);
    setAcceptedAnswersStr((q.acceptedAnswers || []).join(', '));
    setExplanation(q.explanation || '');
    setHintNationality(q.hints?.nationality || '');
    setHintPosition(q.hints?.position || '');
    setHintYears(q.hints?.careerYears || '');
    setSequence(q.sequence || [
      { club: '', number: 10, period: '' },
      { club: '', number: 7, period: '' },
      { club: '', number: 9, period: '' },
    ]);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    const acceptedList = acceptedAnswersStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!acceptedList.includes(correctAnswer.trim())) {
      acceptedList.unshift(correctAnswer.trim());
    }

    const payload: Partial<QuestionData> = {
      mode,
      difficulty,
      question: questionText.trim(),
      correctAnswer: correctAnswer.trim(),
      acceptedAnswers: acceptedList,
      explanation: explanation.trim(),
      hints: {
        nationality: hintNationality.trim() || undefined,
        position: hintPosition.trim() || undefined,
        careerYears: hintYears.trim() || undefined,
      },
      isActive: true,
    };

    if (mode === 'two_clubs') {
      payload.clubs = [club1.trim(), club2.trim()];
      const opts = optionsStr.split(',').map((s) => s.trim()).filter(Boolean);
      if (!opts.includes(correctAnswer.trim())) {
        opts.unshift(correctAnswer.trim());
      }
      payload.options = opts;
    } else {
      payload.sequence = sequence.filter((item) => item.club.trim().length > 0);
    }

    try {
      if (editingQuestion?.id) {
        await api.updateQuestion(editingQuestion.id, payload);
        setStatusMsg('Question updated successfully!');
      } else {
        await api.createQuestion(payload);
        setStatusMsg('New question added to database!');
      }
      playCorrectSound();
      setEditingQuestion(null);
      loadQuestions();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save question');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    playClickSound();
    try {
      await api.deleteQuestion(id);
      loadQuestions();
      setStatusMsg('Question deleted.');
      setTimeout(() => setStatusMsg(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset questions back to the verified default database pack?')) return;
    playClickSound();
    try {
      const res = await api.seedDefaultQuestions();
      loadQuestions();
      playCorrectSound();
      setStatusMsg(`Questions successfully re-seeded (${res.count} loaded)!`);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const [isIndexingImages, setIsIndexingImages] = useState(false);

  const handleIndexAllImages = async () => {
    setIsIndexingImages(true);
    playClickSound();
    try {
      await api.indexAllImages();
      playCorrectSound();
      setStatusMsg(`Auto-search complete! Verified official club logos and player photos cached.`);
      loadQuestions();
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Image indexing failed');
    } finally {
      setIsIndexingImages(false);
    }
  };

  const filtered = questions.filter((q) => {
    if (activeFilter === 'all') return true;
    return q.mode === activeFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
      <div className="w-full max-w-4xl bg-[#0F3460] border-4 border-black p-6 shadow-[10px_10px_0px_#000000] relative max-h-[92vh] flex flex-col text-white">
        {/* Top brutalist bar */}
        <div className="h-2 bg-[#00B140] border-b-2 border-black -mx-6 -mt-6 mb-5" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-3 border-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFD700] border-3 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center shrink-0">
              <IconVARScreen size={34} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                VAR & Question Control
              </h2>
              <p className="text-xs font-bold text-[#B0BEC5]">Add, edit, verify and manage live football trivia challenges</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 bg-[#16213E] text-white border-2 border-black hover:bg-[#CC0000] hover:text-white transition cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4 font-black" />
          </button>
        </div>

        {statusMsg && (
          <div className="mt-3 p-2.5 bg-[#00B140] border-3 border-black shadow-[3px_3px_0px_#000] text-white text-xs font-black uppercase flex items-center gap-2">
            <Check className="w-4 h-4 font-black" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-4">
          <div className="flex items-center gap-1.5 p-1 bg-[#16213E] border-2 border-black">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-black uppercase transition cursor-pointer ${
                activeFilter === 'all' ? 'bg-[#00B140] text-white border-2 border-black shadow-[2px_2px_0_#000]' : 'text-[#B0BEC5] hover:text-white'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setActiveFilter('two_clubs')}
              className={`px-3 py-1.5 text-xs font-black uppercase transition cursor-pointer ${
                activeFilter === 'two_clubs' ? 'bg-[#00B140] text-white border-2 border-black shadow-[2px_2px_0_#000]' : 'text-[#B0BEC5] hover:text-white'
              }`}
            >
              Two Clubs ({questions.filter((q) => q.mode === 'two_clubs').length})
            </button>
            <button
              onClick={() => setActiveFilter('shirt_history')}
              className={`px-3 py-1.5 text-xs font-black uppercase transition cursor-pointer ${
                activeFilter === 'shirt_history' ? 'bg-[#00B140] text-white border-2 border-black shadow-[2px_2px_0_#000]' : 'text-[#B0BEC5] hover:text-white'
              }`}
            >
              Shirt History ({questions.filter((q) => q.mode === 'shirt_history').length})
            </button>
            <button
              onClick={() => setActiveFilter('nationalities')}
              className={`px-3 py-1.5 text-xs font-black uppercase transition cursor-pointer ${
                activeFilter === 'nationalities' ? 'bg-[#00B140] text-white border-2 border-black shadow-[2px_2px_0_#000]' : 'text-[#B0BEC5] hover:text-white'
              }`}
            >
              Nationalities ({questions.filter((q) => q.mode === 'nationalities').length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleIndexAllImages}
              disabled={isIndexingImages}
              className="px-3 py-2 bg-[#00B140] hover:bg-[#008F32] border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase text-white flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isIndexingImages ? 'animate-spin' : ''}`} />
              <span>{isIndexingImages ? 'Searching...' : 'Auto-Search'}</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-3 py-2 bg-[#16213E] hover:bg-[#1A1A2E] text-white border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#FFD700] hover:bg-[#e6c200] text-black text-xs font-black uppercase border-3 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 font-black" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1 custom-scrollbar">
          {editingQuestion ? (
            /* Question Form Modal */
            <form onSubmit={handleSaveQuestion} className="bg-[#16213E] border-3 border-black p-5 shadow-[4px_4px_0_#000] space-y-4 text-white">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  {editingQuestion.id ? `Edit Question: ${editingQuestion.id}` : 'Create New Football Challenge'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="text-xs font-black uppercase text-[#B0BEC5] hover:text-white hover:underline"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">Game Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as GameModeType)}
                    className="w-full bg-[#0F3460] border-2 border-black px-3 py-2 text-xs font-bold text-white shadow-[2px_2px_0_#000]"
                  >
                    <option value="two_clubs">Mode 1: Guess Player from Two Clubs</option>
                    <option value="shirt_history">Mode 2: Shirt Numbers & Club History</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="w-full bg-[#0F3460] border-2 border-black px-3 py-2 text-xs font-bold text-white shadow-[2px_2px_0_#000]"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">Question Prompt</label>
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. Which player played for both clubs?"
                  className="w-full bg-[#0F3460] border-2 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140] shadow-[2px_2px_0_#000]"
                  required
                />
              </div>

              {/* Mode Specific Inputs */}
              {mode === 'two_clubs' ? (
                <div className="p-3 bg-[#0F3460] border-2 border-black shadow-[2px_2px_0_#000] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">Club 1</label>
                      <input
                        type="text"
                        value={club1}
                        onChange={(e) => setClub1(e.target.value)}
                        placeholder="e.g. Real Madrid"
                        className="w-full bg-[#16213E] border-2 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">Club 2</label>
                      <input
                        type="text"
                        value={club2}
                        onChange={(e) => setClub2(e.target.value)}
                        placeholder="e.g. Juventus"
                        className="w-full bg-[#16213E] border-2 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">
                      Multiple Choice Options (comma-separated, 4 options)
                    </label>
                    <input
                      type="text"
                      value={optionsStr}
                      onChange={(e) => setOptionsStr(e.target.value)}
                      placeholder="Cristiano Ronaldo, Karim Benzema, Luka Modric, Paulo Dybala"
                      className="w-full bg-[#16213E] border-2 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140]"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#0F3460] border-2 border-black shadow-[2px_2px_0_#000] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-white uppercase">
                      Career Sequence (Clubs & Shirt Numbers in Order)
                    </label>
                    <button
                      type="button"
                      onClick={() => setSequence([...sequence, { club: '', number: 10, period: '' }])}
                      className="text-xs font-black uppercase bg-[#FFD700] text-black border border-black px-2 py-0.5"
                    >
                      + Add Step
                    </button>
                  </div>

                  {sequence.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-white w-4">{idx + 1}.</span>
                      <input
                        type="text"
                        value={step.club}
                        onChange={(e) => {
                          const copy = [...sequence];
                          copy[idx].club = e.target.value;
                          setSequence(copy);
                        }}
                        placeholder="Club Name (e.g. Manchester United)"
                        className="flex-1 bg-[#16213E] border border-black px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-[#00B140]"
                        required
                      />
                      <input
                        type="number"
                        value={step.number}
                        onChange={(e) => {
                          const copy = [...sequence];
                          copy[idx].number = parseInt(e.target.value, 10) || 0;
                          setSequence(copy);
                        }}
                        placeholder="Shirt #"
                        className="w-20 bg-[#16213E] border border-black px-2 py-1 text-xs font-bold text-white text-center focus:outline-none focus:border-[#00B140]"
                        required
                      />
                      <input
                        type="text"
                        value={step.period}
                        onChange={(e) => {
                          const copy = [...sequence];
                          copy[idx].period = e.target.value;
                          setSequence(copy);
                        }}
                        placeholder="Period (e.g. 2003-09)"
                        className="w-28 bg-[#16213E] border border-black px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-[#00B140]"
                        required
                      />
                      {sequence.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setSequence(sequence.filter((_, i) => i !== idx))}
                          className="text-[#CC0000] font-black p-1 hover:bg-[#16213E]"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Answers & Aliases */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">
                    Correct Player Name
                  </label>
                  <input
                    type="text"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    placeholder="e.g. Cristiano Ronaldo"
                    className="w-full bg-[#0F3460] border-2 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140] shadow-[2px_2px_0_#000]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">
                    Accepted Spellings & Aliases
                  </label>
                  <input
                    type="text"
                    value={acceptedAnswersStr}
                    onChange={(e) => setAcceptedAnswersStr(e.target.value)}
                    placeholder="Cristiano Ronaldo, Ronaldo, CR7, كريستيانو رونالدو"
                    className="w-full bg-[#0F3460] border-2 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140] shadow-[2px_2px_0_#000]"
                  />
                </div>
              </div>

              {/* Hints */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">Hint: Nationality</label>
                  <input
                    type="text"
                    value={hintNationality}
                    onChange={(e) => setHintNationality(e.target.value)}
                    placeholder="e.g. Portugal"
                    className="w-full bg-[#0F3460] border-2 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140] shadow-[2px_2px_0_#000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">Hint: Position</label>
                  <input
                    type="text"
                    value={hintPosition}
                    onChange={(e) => setHintPosition(e.target.value)}
                    placeholder="e.g. Forward"
                    className="w-full bg-[#0F3460] border-2 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140] shadow-[2px_2px_0_#000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">Hint: Active Years</label>
                  <input
                    type="text"
                    value={hintYears}
                    onChange={(e) => setHintYears(e.target.value)}
                    placeholder="e.g. 2002 - Present"
                    className="w-full bg-[#0F3460] border-2 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140] shadow-[2px_2px_0_#000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#B0BEC5] uppercase mb-1">
                  Explanation / Career Information
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={2}
                  placeholder="e.g. He represented both Real Madrid and Juventus winning multiple league titles."
                  className="w-full bg-[#0F3460] border-2 border-black px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00B140] shadow-[2px_2px_0_#000]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 bg-[#16213E] hover:bg-[#1A1A2E] border-2 border-black text-xs font-black uppercase text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00B140] hover:bg-[#008F32] text-white text-xs font-black uppercase border-3 border-black shadow-[3px_3px_0px_#000] transition cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          ) : (
            /* Questions List */
            filtered.map((q) => (
              <div
                key={q.id}
                className="p-4 bg-[#16213E] border-3 border-black shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-3 text-white"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFD700] text-black border border-black">
                      {q.mode === 'two_clubs' ? 'Two Clubs' : q.mode === 'nationalities' ? 'Nationalities' : 'Shirt History'}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-[#00B140] border border-black">
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#B0BEC5]">#{q.id}</span>
                  </div>

                  <p className="text-xs font-black text-white">{q.question}</p>

                  {q.mode === 'two_clubs' && q.clubs && (
                    <div className="flex items-center gap-3 text-xs font-black py-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#0F3460] border-2 border-black shadow-[2px_2px_0_#000] text-white">
                        <ClubCrest clubName={q.clubs[0]} logoUrl={q.clubLogos?.[q.clubs[0]]} size="sm" />
                        <span>{q.clubs[0]}</span>
                      </div>
                      <span className="text-black font-black bg-[#FFD700] px-1 border border-black">VS</span>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#0F3460] border-2 border-black shadow-[2px_2px_0_#000] text-white">
                        <ClubCrest clubName={q.clubs[1]} logoUrl={q.clubLogos?.[q.clubs[1]]} size="sm" />
                        <span>{q.clubs[1]}</span>
                      </div>
                    </div>
                  )}

                  {q.mode === 'shirt_history' && q.sequence && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {q.sequence.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-[#0F3460] border-2 border-black shadow-[2px_2px_0_#000] text-xs font-bold text-white">
                          <strong className="text-black font-mono font-black bg-[#FFD700] px-1 border border-black">#{step.number}</strong>
                          <ClubCrest clubName={step.club} logoUrl={q.clubLogos?.[step.club]} size="sm" />
                          <span>{step.club}</span>
                          <span className="text-[10px] text-[#B0BEC5] font-mono">({step.period})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-[#B0BEC5] pt-1">
                    {q.playerImage && (
                      <div className="shrink-0">
                        <img
                          src={q.playerImage}
                          alt={q.correctAnswer}
                          className="w-9 h-9 object-cover object-top border-2 border-black shadow-[2px_2px_0_#000]"
                        />
                      </div>
                    )}
                    <div>
                      <strong className="text-white font-black uppercase">Answer:</strong> {q.correctAnswer}
                      {q.playerImage && (
                        <span className="ml-2 text-[10px] font-black uppercase bg-[#00B140] px-1.5 py-0.5 border border-black text-white">
                          ✓ Photo Cached
                        </span>
                      )}
                      {q.acceptedAnswers && q.acceptedAnswers.length > 1 && (
                        <span className="text-[#B0BEC5] ml-2 block sm:inline">
                          (Accepted: {q.acceptedAnswers.join(', ')})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-2 bg-[#FFD700] hover:bg-[#e6c200] border-2 border-black shadow-[2px_2px_0_#000] text-black transition cursor-pointer"
                    title="Edit Question"
                  >
                    <Edit3 className="w-4 h-4 font-black" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 bg-[#CC0000] hover:bg-[#a30000] border-2 border-black shadow-[2px_2px_0_#000] text-white transition cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4 font-black" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
