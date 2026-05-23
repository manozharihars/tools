'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ImageWorkspaceContent() {
  const searchParams = useSearchParams();
  const initialTool = searchParams.get('tool') || 'compress';

  const [activeTool, setActiveTool] = useState<string>(initialTool);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  // Configurations
  const [compressQuality, setCompressQuality] = useState(0.8);
  
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);

  const [rotateAngle, setRotateAngle] = useState(0); // 0, 90, 180, 270

  const [convertFormat, setConvertFormat] = useState('image/jpeg');

  const [memeTopText, setMemeTopText] = useState('TOP TEXT');
  const [memeBottomText, setMemeBottomText] = useState('BOTTOM TEXT');
  const [memeFontSize, setMemeFontSize] = useState(40);
  const [memeColor, setMemeColor] = useState('#ffffff');

  const [watermarkText, setWatermarkText] = useState('© CloudToolbox');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [watermarkSize, setWatermarkSize] = useState(30);

  const [blurRadius, setBlurRadius] = useState(20);
  const [blurredAreas, setBlurredAreas] = useState<{ x: number; y: number; r: number }[]>([]);

  const [cropLeft, setCropLeft] = useState(10);
  const [cropRight, setCropRight] = useState(10);
  const [cropTop, setCropTop] = useState(10);
  const [cropBottom, setCropBottom] = useState(10);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if URL search query changes
  useEffect(() => {
    const tool = searchParams.get('tool');
    if (tool) {
      setActiveTool(tool);
    }
  }, [searchParams]);

  // Load selected image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadImage(e.target.files[0]);
    }
  };

  const loadImage = (file: File) => {
    setSelectedFile(file);
    setBlurredAreas([]);
    setRotateAngle(0);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setResizeWidth(img.width);
        setResizeHeight(img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Drag over / drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadImage(e.dataTransfer.files[0]);
    }
  };

  // Dimensions adjustment helper
  const handleWidthChange = (val: number) => {
    setResizeWidth(val);
    if (aspectRatioLocked && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setResizeHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setResizeHeight(val);
    if (aspectRatioLocked && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setResizeWidth(Math.round(val * ratio));
    }
  };

  // Canvas drawing & update cycle
  useEffect(() => {
    if (!imageSrc) return;
    drawCanvas();
  }, [
    imageSrc,
    activeTool,
    compressQuality,
    resizeWidth,
    resizeHeight,
    rotateAngle,
    convertFormat,
    memeTopText,
    memeBottomText,
    memeFontSize,
    memeColor,
    watermarkText,
    watermarkOpacity,
    watermarkSize,
    blurredAreas,
    cropLeft,
    cropRight,
    cropTop,
    cropBottom
  ]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Determine base canvas dimensions
      let baseW = img.width;
      let baseH = img.height;

      // Handle Resize Tool overrides
      if (activeTool === 'resize') {
        baseW = resizeWidth || img.width;
        baseH = resizeHeight || img.height;
      }

      // Handle Crop Tool overrides
      if (activeTool === 'crop') {
        const leftPixels = Math.round(img.width * (cropLeft / 100));
        const rightPixels = Math.round(img.width * (cropRight / 100));
        const topPixels = Math.round(img.height * (cropTop / 100));
        const bottomPixels = Math.round(img.height * (cropBottom / 100));
        baseW = Math.max(10, img.width - leftPixels - rightPixels);
        baseH = Math.max(10, img.height - topPixels - bottomPixels);
      }

      // Set rotated viewport bounds
      const isRotated90or270 = rotateAngle === 90 || rotateAngle === 270;
      canvas.width = isRotated90or270 ? baseH : baseW;
      canvas.height = isRotated90or270 ? baseW : baseH;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context state for rotations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotateAngle * Math.PI) / 180);

      // Draw base image (with crop adjustment if applicable)
      if (activeTool === 'crop') {
        const leftPixels = Math.round(img.width * (cropLeft / 100));
        const topPixels = Math.round(img.height * (cropTop / 100));
        ctx.drawImage(
          img,
          leftPixels,
          topPixels,
          img.width - leftPixels - Math.round(img.width * (cropRight / 100)),
          img.height - topPixels - Math.round(img.height * (cropBottom / 100)),
          -baseW / 2,
          -baseH / 2,
          baseW,
          baseH
        );
      } else {
        ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH);
      }

      ctx.restore();

      // Apply blur zones
      if (blurredAreas.length > 0) {
        blurredAreas.forEach(area => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(area.x, area.y, area.r, 0, Math.PI * 2);
          ctx.clip();
          
          // Draw blurred image overlay
          ctx.filter = `blur(15px)`;
          ctx.drawImage(canvas, 0, 0);
          ctx.restore();
        });
      }

      // Draw Watermark Overlay
      if (activeTool === 'watermark' && watermarkText) {
        ctx.save();
        ctx.font = `bold ${watermarkSize}px Outfit, sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity})`;
        ctx.strokeStyle = `rgba(0, 0, 0, ${watermarkOpacity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);
        ctx.strokeText(watermarkText, canvas.width / 2, canvas.height / 2);
        ctx.restore();
      }

      // Draw Meme text overlays
      if (activeTool === 'meme') {
        ctx.save();
        ctx.font = `bold ${memeFontSize}px Impact, sans-serif`;
        ctx.fillStyle = memeColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(2, memeFontSize / 8);
        ctx.textAlign = 'center';

        // Top Text
        if (memeTopText) {
          ctx.textBaseline = 'top';
          ctx.fillText(memeTopText.toUpperCase(), canvas.width / 2, 20);
          ctx.strokeText(memeTopText.toUpperCase(), canvas.width / 2, 20);
        }

        // Bottom Text
        if (memeBottomText) {
          ctx.textBaseline = 'bottom';
          ctx.fillText(memeBottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
          ctx.strokeText(memeBottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
        }
        ctx.restore();
      }
    };
    img.src = imageSrc;
  };

  // Blur clicking handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'blur') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    setBlurredAreas(prev => [...prev, { x: clickX, y: clickY, r: blurRadius }]);
  };

  // Export processed image
  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedFile) return;

    setIsProcessing(true);

    try {
      const mime = activeTool === 'convert' ? convertFormat : 'image/png';
      const quality = activeTool === 'compress' ? compressQuality : 0.9;
      
      const dataUrl = canvas.toDataURL(mime, quality);
      
      const ext = mime.split('/')[1];
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
      const downloadName = `${baseName}_edited.${ext === 'jpeg' ? 'jpg' : ext}`;
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = downloadName;
      link.click();
    } catch (err: any) {
      console.error(err);
      alert('Error exporting image: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Interactive Image Workspace</h1>
          <p className="text-slate-400 text-xs mt-1">
            Apply transformations instantly using browser-native Canvas graphics. Zero files are uploaded to our servers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/image"
            className="text-xs px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition duration-200"
          >
            ← Back to Hub
          </Link>
          {selectedFile && (
            <button
              onClick={() => { setSelectedFile(null); setImageSrc(''); }}
              className="text-xs px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition duration-200"
            >
              Reset File
            </button>
          )}
        </div>
      </div>

      {/* Grid selector of sub-tools inside the workspace */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'compress', name: '🗜️ Compress', desc: 'Reduce filesize' },
          { id: 'resize', name: '📐 Resize', desc: 'Scale image pixels' },
          { id: 'crop', name: '✂️ Crop Image', desc: 'Trim border margins' },
          { id: 'convert', name: '🔄 Convert Format', desc: 'Convert file type' },
          { id: 'rotate', name: '↩️ Rotate', desc: 'Orientate rotations' },
          { id: 'meme', name: '🎨 Meme Maker', desc: 'Impact top/bottom texts' },
          { id: 'watermark', name: '💦 Watermark', desc: 'Apply copyright label' },
          { id: 'blur', name: '📇 Blur Face', desc: 'Mask private nodes' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              activeTool === t.id
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Main Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: Sidebar configuration */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 space-y-6 h-fit">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Parameters</h3>
          
          {/* Tool specific configurations */}
          {activeTool === 'compress' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Quality Ratio ({Math.round(compressQuality * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={compressQuality}
                  onChange={(e) => setCompressQuality(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Lower quality reduces output file size aggressively. High-density formats (JPG/WebP) compress efficiently with quality set around 70-80%.
              </p>
            </div>
          )}

          {activeTool === 'resize' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Width (pixels)</label>
                <input
                  type="number"
                  value={resizeWidth}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Height (pixels)</label>
                <input
                  type="number"
                  value={resizeHeight}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="lock-aspect"
                  checked={aspectRatioLocked}
                  onChange={(e) => setAspectRatioLocked(e.target.checked)}
                  className="accent-blue-600 rounded"
                />
                <label htmlFor="lock-aspect" className="text-xs text-slate-300 select-none">Lock Aspect Ratio</label>
              </div>
            </div>
          )}

          {activeTool === 'crop' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Adjust the sliding boundaries to crop percentages from the borders.
              </p>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Left Trim ({cropLeft}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    value={cropLeft}
                    onChange={(e) => setCropLeft(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Right Trim ({cropRight}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    value={cropRight}
                    onChange={(e) => setCropRight(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Top Trim ({cropTop}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    value={cropTop}
                    onChange={(e) => setCropTop(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bottom Trim ({cropBottom}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    value={cropBottom}
                    onChange={(e) => setCropBottom(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTool === 'convert' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Format</label>
                <select
                  value={convertFormat}
                  onChange={(e) => setConvertFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                >
                  <option value="image/jpeg">JPG (Joint Photographic)</option>
                  <option value="image/png">PNG (Portable Network Graphics)</option>
                  <option value="image/webp">WebP (Google Image Format)</option>
                </select>
              </div>
            </div>
          )}

          {activeTool === 'rotate' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-300">Rotate Viewport</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRotateAngle(prev => (prev + 270) % 360)}
                  className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs border border-white/5 text-slate-300"
                >
                  ↩️ Counter-Clockwise
                </button>
                <button
                  onClick={() => setRotateAngle(prev => (prev + 90) % 360)}
                  className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs border border-white/5 text-slate-300"
                >
                  ↪️ Clockwise
                </button>
              </div>
              <div className="text-center font-mono text-[10px] text-slate-500">
                Current angle: {rotateAngle}°
              </div>
            </div>
          )}

          {activeTool === 'meme' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Top Text</label>
                <input
                  type="text"
                  value={memeTopText}
                  onChange={(e) => setMemeTopText(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Bottom Text</label>
                <input
                  type="text"
                  value={memeBottomText}
                  onChange={(e) => setMemeBottomText(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Font size ({memeFontSize}px)</label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={memeFontSize}
                  onChange={(e) => setMemeFontSize(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Text Color</label>
                <input
                  type="color"
                  value={memeColor}
                  onChange={(e) => setMemeColor(e.target.value)}
                  className="w-full h-8 bg-slate-900 border border-white/10 rounded-xl cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTool === 'watermark' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Opacity ({Math.round(watermarkOpacity * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Font Size ({watermarkSize}px)</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={watermarkSize}
                  onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          )}

          {activeTool === 'blur' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Click anywhere on the image preview canvas to stamp a circular blur zone over face nodes.
              </p>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Blur Radius ({blurRadius}px)</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={blurRadius}
                  onChange={(e) => setBlurRadius(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              {blurredAreas.length > 0 && (
                <button
                  onClick={() => setBlurredAreas([])}
                  className="w-full py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] hover:bg-red-500/20"
                >
                  Clear Blur Zones
                </button>
              )}
            </div>
          )}

          {/* Export button */}
          {selectedFile && (
            <button
              onClick={saveImage}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-blue-600/25"
            >
              📥 Export Processed Image
            </button>
          )}
        </div>

        {/* Right column: Interactive canvas layout */}
        <div className="lg:col-span-3 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {selectedFile === null ? (
            /* Upload box */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-slate-950/20 hover:bg-slate-950/40 rounded-3xl p-16 text-center cursor-pointer transition duration-300 flex flex-col items-center justify-center min-h-[400px] space-y-4"
            >
              <span className="text-5xl">🖼️</span>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Drag & drop your picture</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Or click to browse files. Supports PNG, JPG, WebP, SVG, and static GIFs.
                </p>
              </div>
              <div className="text-[10px] text-slate-400 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                Processed locally in browser
              </div>
            </div>
          ) : (
            /* loaded image state */
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400">
                  File: <strong className="text-white">{selectedFile.name}</strong> ({originalDimensions.width}x{originalDimensions.height}px)
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  Upload Different Image
                </button>
              </div>

              {/* Live Canvas renderer */}
              <div className="w-full flex items-center justify-center p-6 bg-slate-950/25 border border-white/5 rounded-3xl overflow-auto max-h-[550px] shadow-inner">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className={`max-w-full rounded-lg shadow-xl ${
                    activeTool === 'blur' ? 'cursor-crosshair border-2 border-blue-500/20' : ''
                  }`}
                  style={{
                    maxHeight: '480px',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {activeTool === 'blur' && (
                <div className="text-center text-[10px] text-slate-500">
                  💡 Tap/Click anywhere on the preview canvas to overlay circular blur masks on faces.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function ImageWorkspaceClient() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-8">Loading workspace...</div>}>
      <ImageWorkspaceContent />
    </React.Suspense>
  );
}
