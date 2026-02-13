
import { GeneratedContent } from "@/types/generate";
import type { Editor as ToastEditor } from '@toast-ui/react-editor';
import { RefObject } from 'react';

interface ResultBtnsProps {
  result: GeneratedContent;
  editorRef: RefObject<ToastEditor | null>;
}

export default function ResultBtns({result, editorRef} : ResultBtnsProps) {
  
  const handleCopy = async () => {
    const instance = editorRef.current?.getInstance();
    const markdown = instance?.getMarkdown();
    if (!markdown) return;

    await navigator.clipboard.writeText(markdown);
    alert('복사 완료!');
  };

  const handleDownloadMarkdown = () => {
    const instance = editorRef.current?.getInstance();
    const markdown = instance?.getMarkdown();
    if (!markdown) return;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title}.md`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    const html = editorRef.current?.getInstance().getHTML();

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title}.html`;
    a.click();

    URL.revokeObjectURL(url);
  };


  return(
    <div className="flex gap-2 w-full font-semibold">
      <button onClick={handleCopy} className="bg-white border border-gray-300 w-full px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">
        복사
      </button>
      <button onClick={handleDownloadMarkdown} className="min-w-20 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">
        .md<br />저장
      </button>
      <button onClick={handleDownloadHTML} className="min-w-20 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">
        .html<br />저장
      </button>
  </div>
  )
}