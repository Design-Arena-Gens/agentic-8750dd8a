"use client";

import { useEffect, useMemo, useState } from 'react';
import { CaseSummary, ChatMessage, EvaluationResult } from '@/lib/types';

export default function SessionPage() {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [currentCase, setCurrentCase] = useState<CaseSummary | null>(null);
  const [loadingCase, setLoadingCase] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const [diffs, setDiffs] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [meds, setMeds] = useState<string>("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    async function loadTopics() {
      const res = await fetch('/api/cases/topics');
      const data = await res.json();
      setTopics(data.topics);
      if (data.topics.length) setSelectedTopic(data.topics[0]);
    }
    loadTopics();
  }, []);

  const startCase = async () => {
    setLoadingCase(true);
    try {
      const res = await fetch(`/api/cases/random?topic=${encodeURIComponent(selectedTopic)}`);
      const data = await res.json();
      setCurrentCase(data.case);
      setMessages([{ role: 'ai', content: `New case from "${data.case.topicFa}" is ready. Start by asking for history or exam.` }]);
    } finally {
      setLoadingCase(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentCase) return;
    const newMessages = [...messages, { role: 'user', content: input.trim() } as ChatMessage];
    setMessages(newMessages);
    setInput("");
    setSubmitting(true);
    try {
      const res = await fetch('/api/ai/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: currentCase.id, messages: newMessages })
      });
      const data = await res.json();
      setMessages([...newMessages, data.message]);
    } finally {
      setSubmitting(false);
    }
  };

  const orderLab = async (test: string) => {
    if (!currentCase) return;
    const res = await fetch('/api/ai/order-lab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId: currentCase.id, test })
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: 'user', content: `Order lab: ${test}` }, data.message]);
  };

  const orderImaging = async (modality: string) => {
    if (!currentCase) return;
    const res = await fetch('/api/ai/order-imaging', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId: currentCase.id, modality })
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: 'user', content: `Order imaging: ${modality}` }, data.message]);
  };

  const submitEvaluation = async () => {
    if (!currentCase) return;
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId: currentCase.id, differentials: diffs, plan, meds })
    });
    const data = await res.json();
    setEvaluation(data.result as EvaluationResult);
    setEvaluationOpen(false);
    setMessages(prev => [...prev, { role: 'ai', content: 'Final evaluation is ready. See results below.' }]);
  };

  const labOptions = useMemo(() => currentCase?.labOptions ?? [], [currentCase]);
  const imagingOptions = useMemo(() => currentCase?.imagingOptions ?? [], [currentCase]);

  return (
    <main>
      <section className="card p-6 mb-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <label className="label">Topic</label>
            <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="input">
              {topics.map(t => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <button onClick={startCase} className="btn btn-primary min-w-32" disabled={loadingCase}>
            {loadingCase ? 'Preparing?' : 'Start Case'}
          </button>
        </div>
      </section>

      {currentCase && (
        <section className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 card p-4 flex flex-col h-[70vh]">
            <div className="flex-1 overflow-auto space-y-3 pr-2">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'ai' ? 'text-white' : 'text-primary'}>
                  <div className="text-xs opacity-70 mb-1">{m.role === 'ai' ? 'Assistant' : 'You'}</div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 whitespace-pre-wrap leading-7">{m.content}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                className="input flex-1"
                placeholder="Type your message (e.g., please share history)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              />
              <button className="btn btn-primary" onClick={sendMessage} disabled={submitting}>Send</button>
            </div>
          </div>

          <aside className="card p-4 space-y-3 h-[70vh] overflow-auto">
            <div>
              <div className="font-bold mb-2">Case info</div>
              <div className="text-sm text-white/80">{currentCase.title}</div>
              <div className="text-xs text-white/60">Level: {currentCase.level}</div>
            </div>

            <div>
              <div className="font-bold mb-2">Order labs</div>
              <div className="flex flex-wrap gap-2">
                {labOptions.map(t => (
                  <button key={t} className="btn btn-secondary text-xs" onClick={() => orderLab(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="font-bold mb-2">Imaging</div>
              <div className="flex flex-wrap gap-2">
                {imagingOptions.map(m => (
                  <button key={m} className="btn btn-secondary text-xs" onClick={() => orderImaging(m)}>{m}</button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="font-bold mb-2">Final evaluation</div>
              <button className="btn btn-primary w-full" onClick={() => setEvaluationOpen(true)}>Submit Dx and plan</button>
            </div>

            {evaluationOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                <div className="card p-4 w-full max-w-xl">
                  <div className="font-bold mb-2">Submit answers</div>
                  <label className="label">Differential diagnoses (comma separated)</label>
                  <textarea className="input h-24" value={diffs} onChange={e => setDiffs(e.target.value)} />
                  <label className="label mt-3">Management plan</label>
                  <textarea className="input h-24" value={plan} onChange={e => setPlan(e.target.value)} />
                  <label className="label mt-3">Medications</label>
                  <textarea className="input h-20" value={meds} onChange={e => setMeds(e.target.value)} />
                  <div className="flex justify-end gap-2 mt-3">
                    <button className="btn btn-secondary" onClick={() => setEvaluationOpen(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={submitEvaluation}>Send for evaluation</button>
                  </div>
                </div>
              </div>
            )}

            {evaluation && (
              <div className="mt-2">
                <div className="font-bold mb-2">Evaluation result</div>
                <div className="text-sm leading-7 whitespace-pre-wrap">
                  Diagnosis accuracy: {Math.round(evaluation.diagnosisScore * 100)}%
                  {"\n"}Workup adequacy: {Math.round(evaluation.workupScore * 100)}%
                  {"\n"}Strengths: {evaluation.correctPoints.join(', ')}
                  {"\n"}Mistakes: {evaluation.mistakes.join(', ')}
                </div>
                <div className="mt-3">
                  <div className="font-bold mb-1">Teaching note</div>
                  <div className="text-sm text-white/80 whitespace-pre-wrap">{evaluation.teachingNote}</div>
                </div>
              </div>
            )}
          </aside>
        </section>
      )}
    </main>
  );
}
