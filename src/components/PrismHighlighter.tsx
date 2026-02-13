'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';

import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';


export default function PrismHighlighter({
  content,
}: {
  content: string;
}) {
  useEffect(() => {
    const preview = document.querySelector('.toastui-editor-contents');
    if (preview) {
      Prism.highlightAllUnder(preview);
    }
  }, [content]);

  return null;
}
