'use client'

import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'

import ResultBtns from "@/components/ResultBtns";
import { GeneratedContent } from "@/types/generate";
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from "react";
import type { Editor as ToastEditor } from '@toast-ui/react-editor';
import { Check, Pencil, X } from 'lucide-react'

type ToastCodeNode = {
  type: string
  info?: string
  literal?: string
}

const Editor = dynamic(
  () => import('@toast-ui/react-editor').then(m => m.Editor),
  { ssr: false }
);

const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then(m => m.Viewer),
  { ssr: false }
);

export default function ResultViewer({ result }: { result: GeneratedContent }) {
  const editorRef = useRef<ToastEditor | null>(null);

  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark")
  );

  const [isEditing, setIsEditing] = useState(false);
  const [markdown, setMarkdown] = useState(result.content);

  useEffect(() => {
    if (!isEditing) {
      requestAnimationFrame(() => {
        Prism.highlightAll();
      });
    }
  }, [markdown, isEditing]);

  // 저장
  const handleSave = () => {
    const instance = editorRef.current?.getInstance();
    const updatedMarkdown = instance?.getMarkdown();
    if (updatedMarkdown) {
      setMarkdown(updatedMarkdown);
    }
    setIsEditing(false);
  };

  // 다크모드 감지
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="my-8 space-y-4">
      <div className='flex justify-between'>
        <h2 className="text-xl font-bold">{result.title}</h2>
        {isEditing ? (
          <div className="flex gap-2.5">
            <button onClick={handleSave}>
              <Check size={17}/>
            </button>
            <button onClick={() => setIsEditing(false)}>
              <X size={17} />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)}>
            <Pencil size={16} />
          </button>
        )}
      </div>
      <hr />

      {isEditing ? (
          <Editor
            key={`${result.title}-${isDark}`}
            theme={isDark ? "dark" : "light"}
            ref={editorRef}
            initialValue={markdown}
            previewStyle="vertical"
            height="70vh"
            initialEditType="markdown"
          />
      ) : (
          <Viewer
            key={`viewer-${isDark}`} 
            initialValue={markdown}
            theme={isDark ? 'dark' : 'light'}
            customHTMLRenderer={{
              codeBlock(node: ToastCodeNode) {

                const language = node.info || 'javascript'
                const code = node.literal || ''

                const grammar =
                  Prism.languages[language] ?? Prism.languages.javascript

                const html = Prism.highlight(code, grammar, language)

                return [
                  { type: 'openTag', tagName: 'pre', outerNewLine: true },
                  {
                    type: 'openTag',
                    tagName: 'code',
                    attributes: { class: `language-${language}` },
                  },
                  { type: 'html', content: html },
                  { type: 'closeTag', tagName: 'code' },
                  { type: 'closeTag', tagName: 'pre', outerNewLine: true },
                ]
              },
            }}
          />
      )}

      <hr />
      <ResultBtns result={result} markdown={markdown} />

      <div>
        <strong>해시태그:</strong> {result.hashtags?.join(', ')}
      </div>
      <div>
        <strong>메타 설명:</strong> {result.metaDescription}
      </div>
    </div>
  );
}