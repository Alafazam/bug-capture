"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from './button';
import { Input } from './input';
import { 
  ArrowRight, 
  Circle, 
  Square, 
  Type, 
  Undo, 
  Redo, 
  Trash2,
  Save,
  X
} from 'lucide-react';

export type AnnotationType = 'arrow' | 'circle' | 'square' | 'text';

export interface Annotation {
  id: string;
  type: AnnotationType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  endX?: number;
  endY?: number;
  text?: string;
  color: string;
  strokeWidth: number;
}

interface AnnotationCanvasProps {
  imageSrc: string;
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  onSave?: (annotatedImageDataUrl: string) => void;
  onClose?: () => void;
}

const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
const STROKE_WIDTHS = [2, 4, 6, 8];

export function AnnotationCanvas({
  imageSrc,
  annotations,
  onAnnotationsChange,
  onSave,
  onClose
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [selectedTool, setSelectedTool] = useState<AnnotationType>('arrow');
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Partial<Annotation> | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isTextMode, setIsTextMode] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [undoStack, setUndoStack] = useState<Annotation[][]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[][]>([]);

  // Draw arrow
  const drawArrow = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    const headLength = 15;
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
  }, []);

  // Draw a single annotation
  const drawAnnotation = useCallback((ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    ctx.strokeStyle = annotation.color;
    ctx.fillStyle = annotation.color;
    ctx.lineWidth = annotation.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (annotation.type) {
      case 'arrow':
        if (annotation.endX !== undefined && annotation.endY !== undefined) {
          drawArrow(ctx, annotation.x, annotation.y, annotation.endX, annotation.endY);
        }
        break;
      case 'circle':
        if (annotation.width && annotation.height) {
          ctx.beginPath();
          ctx.ellipse(
            annotation.x + annotation.width / 2,
            annotation.y + annotation.height / 2,
            annotation.width / 2,
            annotation.height / 2,
            0, 0, 2 * Math.PI
          );
          ctx.stroke();
        }
        break;
      case 'square':
        if (annotation.width && annotation.height) {
          ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
        }
        break;
      case 'text':
        if (annotation.text) {
          ctx.font = `${annotation.strokeWidth * 4}px Arial`;
          ctx.fillText(annotation.text, annotation.x, annotation.y);
        }
        break;
    }
  }, [drawArrow]);

  // Draw all annotations on canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;
    
    if (!canvas || !ctx || !image) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Draw annotations
    annotations.forEach(annotation => {
      drawAnnotation(ctx, annotation);
    });
  }, [annotations, drawAnnotation]);

  // Load image and set up canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;

    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      drawCanvas();
    };

    image.src = imageSrc;
  }, [imageSrc, drawCanvas]);

  // Get canvas coordinates from mouse event
  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  // Save current state for undo
  const saveState = useCallback(() => {
    setUndoStack(prev => [...prev, [...annotations]]);
    setRedoStack([]);
  }, [annotations]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    
    if (selectedTool === 'text') {
      setTextPosition(coords);
      setIsTextMode(true);
      setTextInput('');
      return;
    }

    setIsDrawing(true);
    saveState();
    
    const newAnnotation: Partial<Annotation> = {
      id: Date.now().toString(),
      type: selectedTool,
      x: coords.x,
      y: coords.y,
      color: selectedColor,
      strokeWidth: selectedStrokeWidth
    };
    
    setCurrentAnnotation(newAnnotation);
  }, [selectedTool, selectedColor, selectedStrokeWidth, getCanvasCoordinates, saveState]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation) return;
    
    const coords = getCanvasCoordinates(e);
    
    if (selectedTool === 'arrow') {
      setCurrentAnnotation(prev => ({ ...prev, endX: coords.x, endY: coords.y }));
    } else if (selectedTool === 'circle' || selectedTool === 'square') {
      const width = coords.x - currentAnnotation.x!;
      const height = coords.y - currentAnnotation.y!;
      setCurrentAnnotation(prev => ({ ...prev, width, height }));
    }
    
    // Redraw canvas with current annotation
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;
    
    if (!canvas || !ctx || !image) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    annotations.forEach(annotation => {
      drawAnnotation(ctx, annotation);
    });
    
    if (currentAnnotation) {
      drawAnnotation(ctx, currentAnnotation as Annotation);
    }
  }, [isDrawing, currentAnnotation, selectedTool, getCanvasCoordinates, annotations, drawAnnotation]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentAnnotation) return;
    
    setIsDrawing(false);
    
    if (currentAnnotation.type === 'arrow' && currentAnnotation.endX !== undefined && currentAnnotation.endY !== undefined) {
      onAnnotationsChange([...annotations, currentAnnotation as Annotation]);
    } else if (currentAnnotation.type === 'circle' || currentAnnotation.type === 'square') {
      if (currentAnnotation.width && currentAnnotation.height) {
        onAnnotationsChange([...annotations, currentAnnotation as Annotation]);
      }
    }
    
    setCurrentAnnotation(null);
  }, [isDrawing, currentAnnotation, annotations, onAnnotationsChange]);

  // Handle text input
  const handleTextSubmit = useCallback(() => {
    if (textInput.trim()) {
      saveState();
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: 'text',
        x: textPosition.x,
        y: textPosition.y,
        text: textInput,
        color: selectedColor,
        strokeWidth: selectedStrokeWidth
      };
      
      onAnnotationsChange([...annotations, newAnnotation]);
      setTextInput('');
      setIsTextMode(false);
    }
  }, [textInput, textPosition, selectedColor, selectedStrokeWidth, annotations, onAnnotationsChange, saveState]);

  // Handle key press for text input
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isTextMode) {
      if (e.key === 'Enter') {
        handleTextSubmit();
      } else if (e.key === 'Escape') {
        setIsTextMode(false);
        setTextInput('');
      }
    }
  }, [isTextMode, handleTextSubmit]);

  // Undo
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      const currentState = [...annotations];
      
      setRedoStack(prev => [...prev, currentState]);
      setUndoStack(prev => prev.slice(0, -1));
      onAnnotationsChange(previousState);
    }
  }, [undoStack, annotations, onAnnotationsChange]);

  // Redo
  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      const currentState = [...annotations];
      
      setUndoStack(prev => [...prev, currentState]);
      setRedoStack(prev => prev.slice(0, -1));
      onAnnotationsChange(nextState);
    }
  }, [redoStack, annotations, onAnnotationsChange]);

  // Clear all annotations
  const handleClear = useCallback(() => {
    saveState();
    onAnnotationsChange([]);
  }, [saveState, onAnnotationsChange]);

  // Save annotated image
  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    onSave?.(dataUrl);
  }, [onSave]);

  // Redraw canvas when annotations change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle text input changes
  useEffect(() => {
    if (isTextMode) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const image = imageRef.current;
      
      if (!canvas || !ctx || !image) return;
      
      // Redraw canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      annotations.forEach(annotation => {
        drawAnnotation(ctx, annotation);
      });
      
      // Draw current text input
      if (textInput) {
        ctx.font = `${selectedStrokeWidth * 4}px Arial`;
        ctx.fillStyle = selectedColor;
        ctx.fillText(textInput, textPosition.x, textPosition.y);
      }
    }
  }, [textInput, isTextMode, textPosition, selectedColor, selectedStrokeWidth, annotations, drawAnnotation]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Annotate Screenshot</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Toolbar */}
          <div className="w-64 p-4 border-r bg-gray-50">
            <div className="space-y-4">
              {/* Tools */}
                             <div>
                 <h3 className="text-sm font-medium mb-2">Tools</h3>
                 <div className="grid grid-cols-2 gap-2">
                   <Button
                     variant={selectedTool === 'arrow' ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => setSelectedTool('arrow')}
                     className={selectedTool === 'arrow' ? 'bg-blue-600 text-white' : ''}
                   >
                     <ArrowRight className="w-4 h-4 mr-1" />
                     Arrow
                   </Button>
                   <Button
                     variant={selectedTool === 'circle' ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => setSelectedTool('circle')}
                     className={selectedTool === 'circle' ? 'bg-blue-600 text-white' : ''}
                   >
                     <Circle className="w-4 h-4 mr-1" />
                     Circle
                   </Button>
                   <Button
                     variant={selectedTool === 'square' ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => setSelectedTool('square')}
                     className={selectedTool === 'square' ? 'bg-blue-600 text-white' : ''}
                   >
                     <Square className="w-4 h-4 mr-1" />
                     Square
                   </Button>
                   <Button
                     variant={selectedTool === 'text' ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => setSelectedTool('text')}
                     className={selectedTool === 'text' ? 'bg-blue-600 text-white' : ''}
                   >
                     <Type className="w-4 h-4 mr-1" />
                     Text
                   </Button>
                 </div>
               </div>

              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 ${
                        selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke Width */}
              <div>
                <h3 className="text-sm font-medium mb-2">Stroke Width</h3>
                <div className="grid grid-cols-2 gap-2">
                  {STROKE_WIDTHS.map(width => (
                    <Button
                      key={width}
                      variant={selectedStrokeWidth === width ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedStrokeWidth(width)}
                    >
                      {width}px
                    </Button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-sm font-medium mb-2">Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className="w-full"
                  >
                    <Undo className="w-4 h-4 mr-2" />
                    Undo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="w-full"
                  >
                    <Redo className="w-4 h-4 mr-2" />
                    Redo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="inline-block border border-gray-300 rounded shadow-sm">
              <canvas
                ref={canvasRef}
                className="cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onKeyDown={handleKeyDown}
                tabIndex={0}
              />
            </div>
            {/* Instructions */}
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Arrow:</strong> Click and drag to draw arrows</li>
                <li><strong>Circle:</strong> Click and drag to create circular highlights</li>
                <li><strong>Square:</strong> Click and drag to create rectangular highlights</li>
                <li><strong>Text:</strong> Click anywhere, type your text, press Enter to add</li>
                <li><strong>Undo/Redo:</strong> Use the buttons in the toolbar to undo/redo actions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hidden image for reference */}
        <img ref={imageRef} alt="" style={{ display: 'none' }} />

        {/* Text input overlay */}
        {isTextMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white border border-gray-300 rounded shadow-lg p-2 pointer-events-auto">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your text..."
                className="outline-none border-none text-sm"
                style={{ 
                  color: selectedColor,
                  fontSize: `${selectedStrokeWidth * 4}px`,
                  fontFamily: 'Arial'
                }}
                autoFocus
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
