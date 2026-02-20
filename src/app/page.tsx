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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    setResult(null);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: form.topic,
          keywords: form.keywords.split(',').map(k => k.trim()),
          style: form.style,
          tone: form.tone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '글 생성에 실패했습니다.');
      }

      const data = await response.json();
      setResult(data);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.topic.trim()) {
      alert("주제를 입력해주세요!");
      return;
    }

    generateContent();
  };

  const handleRetry = () => {
    generateContent();
  };
 
  return (
    <>
      <Header />
      <main className="flex flex-col items-center">
        <div className="w-full px-8 max-w-3xl">
          <Hero />
          <GenerateForm form={form} setForm={setForm} error={error} loading={loading} onSubmit={handleSubmit} onRetry={handleRetry} />
          {result && <ResultViewer key={`${result.title}-${form.style}-${form.tone}`} result={result} />}
        </div>
      </main>
    </>
  );
}
