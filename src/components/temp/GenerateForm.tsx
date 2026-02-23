import ContentFieldset from '@/components/generateForm/ContentFieldset';
import { StyleFieldset } from '@/components/generateForm/StyleFieldset';
import ResultLoading from '@/components/ui/ResultLoading';
import type { GenerateFormState } from '@/types/generate';


interface Props {
  form: GenerateFormState;
  setForm: React.Dispatch<React.SetStateAction<GenerateFormState>>;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onRetry: () => void;
}

export default function GenerateForm({ form, setForm, loading, error, onSubmit, onRetry, }: Props) {
  return(
    <>
      <form action="" onSubmit={onSubmit} className=''>
        <StyleFieldset style={form.style} tone={form.tone} onStyleChange={v => setForm(p => ({...p, style: v}))} onToneChange={v => setForm(p => ({ ...p, tone: v }))} />
        <ContentFieldset topic={form.topic} keywords={form.keywords} onTopicChange={v => setForm(p => ({ ...p, topic: v }))} onKeywordChange={v => setForm(p => ({ ...p, keywords: v }))} />
        {/* 전송 */}
        <button
          type='submit'
          disabled={loading}
          className="w-full text-center bg-(--brand) py-1.5 mt-2 rounded-md font-semibold
            hover:bg-(--brand-black) hover:text-white focus:bg-(--brand-black) focus:text-white transition-all"
        >
          {/* {loading ? '생성 중...' : '글 생성'} */}
          글 생성
        </button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-600 rounded">
          <p>{error}</p>

          <button
            onClick={onRetry}
            className="mt-2 px-4 py-1 bg-red-500 text-white rounded"
          >
            다시 시도
          </button>
        </div>
      )}
      <div>
        {loading && <ResultLoading />}
      </div>
    </>
  )
}