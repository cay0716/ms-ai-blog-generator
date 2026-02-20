'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import GenerateForm from '@/components/generateForm/GenerateForm';
import { type GeneratedContent, GenerateFormState} from '@/types/generate';
import ResultViewer from '@/components/ResultViewer';
import Header from '@/components/layout/Header';


export default function Page() {
  const [form, setForm] = useState<GenerateFormState>({
    style: 'tutorial',
    tone: 'kind',
    topic: '',
    keywords: '',
  })


  const [result, setResult] = useState<GeneratedContent | null>(null); // 결과
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 방어 로직: 주제가 없으면 API를 호출하지 않음
    if (!form.topic.trim()) {
      alert("주제를 입력해주세요!");
      return;
    }
    
    setResult(null);
    setLoading(true);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: form.topic,
        keywords: form.keywords.split(',').map(k => k.trim()),
        style: form.style,
        tone: form.tone,
      }),
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center">
        <div className="w-full px-8 max-w-3xl">
          <Hero />
          <GenerateForm form={form} setForm={setForm} loading={loading} onSubmit={handleSubmit} />
          {result && <ResultViewer key={`${result.title}-${form.style}-${form.tone}`} result={result} />}
        </div>
      </main>
    </>
  );
}
