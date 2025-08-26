'use client';

import React from 'react';
import { Textarea } from './textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing...",
  className = "" 
}: RichTextEditorProps) {
  return (
    <div className={className}>
      {/* Simple Textarea */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] resize-none"
      />
    </div>
  );
}
