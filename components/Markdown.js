'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Markdown({ children }) {
  return (
    <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
      {children}
    </ReactMarkdown>
  );
}
