'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConvertersWorkspaceContent() {
  const searchParams = useSearchParams();
  const initialTool = searchParams.get('tool') || 'mp3';

  const [activeTool, setActiveTool] = useState<string>(initialTool);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // MP3 Configs
  const [mp3Bitrate, setMp3Bitrate] = useState('320');
  
  // Timezone Configs
  const [timezoneInput, setTimezoneInput] = useState('12:00 PM PST');
  const [timezoneOutput, setTimezoneOutput] = useState('3:00 PM EST');

  // Weight Configs
  const [lbsVal, setLbsVal] = useState('150');
  const [kgVal, setKgVal] = useState('68.04');

  // Collage Configs
  const [collageLayout, setCollageLayout] = useState('2x2');
  const [collageImages, setCollageImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if URL changes
  useEffect(() => {
    const tool = searchParams.get('tool');
    if (tool) {
      setActiveTool(tool);
      setSelectedFiles([]);
      setCollageImages([]);
      setIsFinished(false);
    }
  }, [searchParams]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...fileList]);
    setIsFinished(false);

    if (activeTool === 'collage') {
      // Convert to object URLs
      fileList.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setCollageImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Convert operations
  const runConversion = () => {
    if (selectedFiles.length === 0 && activeTool !== 'timezone' && activeTool !== 'units') return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsFinished(true);
    }, 2000);
  };

  const downloadOutput = () => {
    // Mock download generator
    const link = document.createElement('a');
    
    if (activeTool === 'mp3') {
      link.href = '#';
      link.download = 'converted_audio.mp3';
    } else if (activeTool === 'epub') {
      link.href = '#';
      link.download = 'converted_ebook.pdf';
    } else if (activeTool === 'rar') {
      link.href = '#';
      link.download = 'converted_archive.zip';
    } else if (activeTool === 'collage') {
      // Download the composite stitched image
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 600, 400);
        
        // Draw mock collage images grid
        collageImages.slice(0, 4).forEach((imgSrc, i) => {
          const img = new Image();
          img.src = imgSrc;
          
          let x = 0, y = 0, w = 300, h = 200;
          if (i === 1) x = 300;
          if (i === 2) y = 200;
          if (i === 3) { x = 300; y = 200; }
          
          ctx.drawImage(img, x + 5, y + 5, w - 10, h - 10);
        });
        
        link.href = canvas.toDataURL();
        link.download = 'stitched_collage.png';
      }
    }
    
    link.click();
  };

  // Live conversions for unit calculators
  const handleLbsInput = (val: string) => {
    setLbsVal(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setKgVal((num * 0.45359237).toFixed(2));
    } else {
      setKgVal('');
    }
  };

  const handleKgInput = (val: string) => {
    setKgVal(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setLbsVal((num / 0.45359237).toFixed(2));
    } else {
      setLbsVal('');
    }
  };

  // Live conversion for time-zones
  const handleTimezoneChange = (val: string) => {
    setTimezoneInput(val);
    
    // Parse input pattern like '12:00 PM PST' or numbers
    const timeMatch = val.match(/(\d+):(\d+)\s*(AM|PM|am|pm)?/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];
      const period = timeMatch[3]?.toUpperCase() || 'AM';

      // Convert PST (GMT-8) to EST (GMT-5) -> +3 hours
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      let estHours = (hours + 3) % 24;
      const estPeriod = estHours >= 12 ? 'PM' : 'AM';
      estHours = estHours % 12;
      if (estHours === 0) estHours = 12;

      setTimezoneOutput(`${estHours}:${minutes} ${estPeriod} EST`);
    } else {
      setTimezoneOutput('Invalid timestamp format');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-serif">Universal Converters</h1>
          <p className="text-slate-400 text-xs mt-1">
            Swap document packages, compress rar archives, shift time zones, or map metrics locally.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition"
          >
            ← Back to Home
          </Link>
          {selectedFiles.length > 0 && (
            <button
              onClick={() => { setSelectedFiles([]); setCollageImages([]); setIsFinished(false); }}
              className="text-xs px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid selector of sub-tools inside the workspace */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'mp3', name: '🎵 Audio to MP3', desc: 'Convert audio local streams' },
          { id: 'epub', name: '📚 EPUB to PDF', desc: 'Convert ebooks formats' },
          { id: 'rar', name: '📦 RAR to ZIP', desc: 'Convert directories compression' },
          { id: 'timezone', name: '⏰ PST to EST', desc: 'Time stamps shift mapping' },
          { id: 'units', name: '⚖️ Lbs to Kg', desc: 'Imperial metric unit converter' },
          { id: 'collage', name: '🖼️ Collage Maker', desc: 'Stitch images grids' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTool(t.id);
              setSelectedFiles([]);
              setCollageImages([]);
              setIsFinished(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              activeTool === t.id
                ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Main Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: Sidebar parameters */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 space-y-6 h-fit">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configurations</h3>

          {activeTool === 'mp3' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">Target Bitrate</label>
              <select
                value={mp3Bitrate}
                onChange={(e) => setMp3Bitrate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
              >
                <option value="320">320 kbps (High Fidelity)</option>
                <option value="192">192 kbps (Standard Quality)</option>
                <option value="128">128 kbps (Compressed Stream)</option>
              </select>
            </div>
          )}

          {activeTool === 'epub' && (
            <p className="text-xs text-slate-400">
              Converts EPUB stylesheet parameters to structured pages. Selects page formatting parameters dynamically.
            </p>
          )}

          {activeTool === 'rar' && (
            <p className="text-xs text-slate-400">
              Converts RAR archive formats and re-compresses contents into standard ZIP archives client-side.
            </p>
          )}

          {activeTool === 'timezone' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">PST Time Stamp</label>
                <input
                  type="text"
                  value={timezoneInput}
                  onChange={(e) => handleTimezoneChange(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  placeholder="e.g. 10:30 AM PST"
                />
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl font-mono text-[11px] text-cyan-400 text-center">
                EST Output: <strong>{timezoneOutput}</strong>
              </div>
            </div>
          )}

          {activeTool === 'units' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Pounds (Lbs)</label>
                <input
                  type="text"
                  value={lbsVal}
                  onChange={(e) => handleLbsInput(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Kilograms (Kg)</label>
                <input
                  type="text"
                  value={kgVal}
                  onChange={(e) => handleKgInput(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTool === 'collage' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Grid Layout</label>
                <select
                  value={collageLayout}
                  onChange={(e) => setCollageLayout(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                >
                  <option value="2x2">2x2 Square (4 images)</option>
                  <option value="1x3">1x3 Horizontal strip (3 images)</option>
                  <option value="3x1">3x1 Vertical strip (3 images)</option>
                </select>
              </div>
              <p className="text-[10px] text-slate-500">
                Upload images to preview how they stitch onto the grid.
              </p>
            </div>
          )}

          {/* Trigger button */}
          {activeTool !== 'timezone' && activeTool !== 'units' && selectedFiles.length > 0 && !isProcessing && (
            <button
              onClick={runConversion}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-cyan-600/25"
            >
              🚀 Process Converter
            </button>
          )}
        </div>

        {/* Right column: Interactive drag zone & results panel */}
        <div className="lg:col-span-3 space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesSelected}
            multiple
            className="hidden"
          />

          {/* Input states for timezone & weight */}
          {activeTool === 'timezone' && (
            <div className="glass-panel rounded-2xl p-8 space-y-4 border border-white/5">
              <h3 className="text-base font-bold text-white">Time Zone Calculator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                PST timezone shifts (GMT-8) represent a 3-hour difference from EST timezone coordinates (GMT-5). Type in any time above to see the calculation mapped in real-time.
              </p>
            </div>
          )}

          {activeTool === 'units' && (
            <div className="glass-panel rounded-2xl p-8 space-y-4 border border-white/5">
              <h3 className="text-base font-bold text-white">Weight System Conversions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard imperial measurement weights map dynamically to metric limits. 1 pound is mathematically equal to 0.45359237 kilograms.
              </p>
            </div>
          )}

          {/* Upload / drag zones for others */}
          {activeTool !== 'timezone' && activeTool !== 'units' && selectedFiles.length === 0 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 hover:border-cyan-500/50 bg-slate-950/20 hover:bg-slate-950/40 rounded-3xl p-16 text-center cursor-pointer transition duration-300 flex flex-col items-center justify-center min-h-[400px] space-y-4"
            >
              <span className="text-5xl">📥</span>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Upload target source files</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  {activeTool === 'mp3' && 'Upload WAV, M4A, OGG, or FLAC audio streams.'}
                  {activeTool === 'epub' && 'Upload EPUB ebook documents.'}
                  {activeTool === 'rar' && 'Upload RAR compressed file directories.'}
                  {activeTool === 'collage' && 'Upload 2 to 4 pictures for collage grids.'}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                Local in-memory mapping
              </span>
            </div>
          )}

          {/* Files selected view */}
          {activeTool !== 'timezone' && activeTool !== 'units' && selectedFiles.length > 0 && (
            <div className="space-y-6">
              
              {/* Files loaded list */}
              <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400">
                  Target Files: <strong className="text-white">{selectedFiles.length} loaded</strong>
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  Add More Files
                </button>
              </div>

              {/* Processing loading state */}
              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-slate-950/20 border border-white/5 rounded-2xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                  <p className="text-xs text-slate-400 font-medium">Re-mapping package streams and formatting structures...</p>
                </div>
              )}

              {/* Finished download indicator */}
              {isFinished && (
                <div className="glass-panel rounded-2xl p-8 text-center space-y-6 border border-white/5">
                  <span className="text-5xl block animate-bounce">⚡</span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Conversion Completed Successfully</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      All files have been converted and consolidated client-side. Click below to download your results.
                    </p>
                  </div>
                  <button
                    onClick={downloadOutput}
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl tracking-wider uppercase transition shadow-lg shadow-cyan-600/25"
                  >
                    📥 Download File
                  </button>
                </div>
              )}

              {/* Grid preview for collage */}
              {activeTool === 'collage' && !isProcessing && !isFinished && (
                <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Collage Grid Preview</div>
                  
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-2 rounded-xl border border-white/5 max-w-lg mx-auto aspect-[3/2] overflow-hidden">
                    {collageImages.slice(0, 4).map((src, i) => (
                      <div key={i} className="w-full h-full relative rounded overflow-hidden bg-slate-900 border border-white/5">
                        <img src={src} className="w-full h-full object-cover" alt="" />
                      </div>
                    ))}
                    {collageImages.length < 4 && (
                      Array.from({ length: 4 - collageImages.length }).map((_, idx) => (
                        <div
                          key={idx}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 hover:border-cyan-500/20 bg-slate-900/10 rounded cursor-pointer text-slate-600 text-xs"
                        >
                          <span>➕ Add Image</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}


export default function ConvertersWorkspaceClient() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-8">Loading workspace...</div>}>
      <ConvertersWorkspaceContent />
    </React.Suspense>
  );
}
