
interface Props {
  topic: string;
  keywords: string;
  onTopicChange: (v: string) => void;
  onKeywordChange: (v: string) => void;
}

export default function ContentFieldset({topic, keywords, onTopicChange, onKeywordChange}: Props) {
  return(
    <fieldset>
      <legend className='sr-only'>내용 입력</legend>
      {/* 3. 주제 */}
      <div className="mt-2">
        <label className="font-semibold">주제</label>
        <input
          className="w-full border p-2 text-sm rounded-md"
          value={topic}
          onChange={e => onTopicChange(e.target.value)}
          placeholder="예: Next.js App Router에서 API Route 만들기"
        />
      </div>
      {/* 4. 키워드 */}
      <div className="mt-2">
        <label className="font-semibold">
          키워드
        </label>
        <input
          className="w-full border p-2 text-sm rounded-md"
          value={keywords}
          onChange={e => onKeywordChange(e.target.value)}
          placeholder="예: Next.js, API Route, OpenAI"
        />
        <p className="text-sm py-0.5 text-gray-300">쉼표로 구분하여 입력해주세요.</p>
      </div>
    </fieldset>
  )
}