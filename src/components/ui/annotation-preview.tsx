"use client";

import React, { useRef, useEffect } from 'react';
import { Annotation } from './annotation-canvas';

interface AnnotationPreviewProps {
  imageSrc: string;
  annotations: Annotation[];
  className?: string;
}

export function AnnotationPreview({ imageSrc, annotations, className = "" }: AnnotationPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;

    image.onload = () => {
      // Set canvas size to match image aspect ratio but keep it small
      const maxSize = 200;
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      
      if (aspectRatio > 1) {
        canvas.width = maxSize;
        canvas.height = maxSize / aspectRatio;
      } else {
        canvas.height = maxSize;
        canvas.width = maxSize * aspectRatio;
      }
      
      drawPreview();
    };

    image.src = imageSrc;
  }, [imageSrc, annotations]);

  const drawPreview = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;
    
    if (!canvas || !ctx || !image) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Draw annotations (scaled down)
    const scaleX = canvas.width / image.naturalWidth;
    const scaleY = canvas.height / image.naturalHeight;
    
    annotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color;
      ctx.fillStyle = annotation.color;
      ctx.lineWidth = Math.max(1, annotation.strokeWidth * scaleX);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      switch (annotation.type) {
        case 'arrow':
          if (annotation.endX !== undefined && annotation.endY !== undefined) {
            const x1 = annotation.x * scaleX;
            const y1 = annotation.y * scaleY;
            const x2 = annotation.endX * scaleX;
            const y2 = annotation.endY * scaleY;
            
            const headLength = 8;
            const angle = Math.atan2(y2 - y1, x2 - x1);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
          }
          break;
        case 'circle':
          if (annotation.width && annotation.height) {
            ctx.beginPath();
            ctx.ellipse(
              (annotation.x + annotation.width / 2) * scaleX,
              (annotation.y + annotation.height / 2) * scaleY,
              annotation.width * scaleX / 2,
              annotation.height * scaleY / 2,
              0, 0, 2 * Math.PI
            );
            ctx.stroke();
          }
          break;
        case 'square':
          if (annotation.width && annotation.height) {
            ctx.strokeRect(
              annotation.x * scaleX,
              annotation.y * scaleY,
              annotation.width * scaleX,
              annotation.height * scaleY
            );
          }
          break;
        case 'text':
          if (annotation.text) {
            ctx.font = `${Math.max(8, annotation.strokeWidth * 2)}px Arial`;
            ctx.fillText(
              annotation.text,
              annotation.x * scaleX,
              annotation.y * scaleY
            );
          }
          break;
      }
    });
  };

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="w-full h-auto border border-gray-200 rounded"
      />
      <img ref={imageRef} alt="" style={{ display: 'none' }} />
    </div>
  );
}
