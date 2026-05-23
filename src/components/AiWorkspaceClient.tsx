'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface LogItem {
  time: string;
  msg: string;
  status: 'info' | 'success' | 'working';
}

function AiWorkspaceContent() {
  const searchParams = useSearchParams();
  const initialTool = searchParams.get('tool') || 'summarize';

  const [activeTool, setActiveTool] = useState<string>(initialTool);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Tool inputs
  const [translateTarget, setTranslateTarget] = useState('es');
  const [ocrLanguage, setOcrLanguage] = useState('eng');
  const [compareFile, setCompareFile] = useState<File | null>(null);
  
  // Workflow chain setup
  const [workflowChain, setWorkflowChain] = useState<string[]>(['ocr', 'summarize']);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const compareInputRef = useRef<HTMLInputElement>(null);

  // Sync with URL
  useEffect(() => {
    const tool = searchParams.get('tool');
    if (tool) {
      setActiveTool(tool);
    }
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsFinished(false);
      setProgress(0);
      setLogs([]);
    }
  };

  const handleCompareFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompareFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setIsFinished(false);
      setProgress(0);
      setLogs([]);
    }
  };

  // Simulate AI Pipeline
  const runAiPipeline = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setIsFinished(false);
    setProgress(5);
    setLogs([
      { time: '13:00:01', msg: `Initializing AI engine for tool [${activeTool.toUpperCase()}]...`, status: 'info' }
    ]);

    const steps = getPipelineSteps(activeTool);
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setProgress(100);
        setLogs(prev => [
          ...prev,
          { time: '13:00:10', msg: 'AI compilation finished successfully. Structuring response layout.', status: 'success' }
        ]);
        setTimeout(() => {
          setIsProcessing(false);
          setIsFinished(true);
        }, 800);
      } else {
        const step = steps[currentStep];
        setProgress(Math.round((currentStep / steps.length) * 90));
        setLogs(prev => [
          ...prev,
          {
            time: `13:00:0${currentStep + 1}`,
            msg: step.msg,
            status: step.status as any
          }
        ]);
      }
    }, 1000);
  };

  const getPipelineSteps = (tool: string) => {
    switch (tool) {
      case 'ocr':
        return [
          { msg: 'Reading binary stream and generating structural tokens...', status: 'info' },
          { msg: `Loading OCR neural models for language [${ocrLanguage}]...`, status: 'working' },
          { msg: 'Scanning visual raster boundaries and aligning text grids...', status: 'working' },
          { msg: 'Rebuilding paragraph vectors and identifying tables...', status: 'success' }
        ];
      case 'compare':
        return [
          { msg: 'Loading source document A and target document B...', status: 'info' },
          { msg: 'Parsing text trees and checking differences...', status: 'working' },
          { msg: 'Highlighting deletion blocks and insertion boundaries...', status: 'working' },
          { msg: 'Preserving matching formatting blocks...', status: 'success' }
        ];
      case 'forms':
        return [
          { msg: 'Running neural form field layout analysis...', status: 'info' },
          { msg: 'Detecting signature zones, checkboxes, and text inputs...', status: 'working' },
          { msg: 'Matching label-to-field logical structures...', status: 'working' },
          { msg: 'Generating interactive form overlays...', status: 'success' }
        ];
      case 'scan':
        return [
          { msg: 'Initializing mobile scanner synchronization...', status: 'info' },
          { msg: 'Accessing local camera feeds and optimizing image frames...', status: 'working' },
          { msg: 'Applying page boundary detection and crop rects...', status: 'working' },
          { msg: 'Compiling processed scans into standardized PDF/A streams...', status: 'success' }
        ];
      case 'summarize':
        return [
          { msg: 'Parsing text structure and removing boilerplates...', status: 'info' },
          { msg: 'Calculating keyword frequencies and cluster nodes...', status: 'working' },
          { msg: 'Synthesizing contextual abstractive summary layers...', status: 'working' },
          { msg: 'Formulating structured markdown summaries...', status: 'success' }
        ];
      case 'translate':
        return [
          { msg: 'Tokenizing paragraph structures into contextual tensors...', status: 'info' },
          { msg: `Querying target language translations for [${translateTarget}]...`, status: 'working' },
          { msg: 'Rebuilding layouts, fonts, and word dimensions in matching targets...', status: 'working' },
          { msg: 'Polishing output format and styling rules...', status: 'success' }
        ];
      case 'workflow':
        return [
          { msg: `Executing workflow chain: ${workflowChain.join(' → ')}...`, status: 'info' },
          { msg: 'Running OCR and extracting content structures...', status: 'working' },
          { msg: 'Analyzing content and drafting summary bullet points...', status: 'working' },
          { msg: 'Applying file output formatting constraints...', status: 'success' }
        ];
      default:
        return [{ msg: 'Running general processing models...', status: 'working' }];
    }
  };

  // Mock outputs
  const getMockOcrResult = () => {
    return `CLOUD TOOLBOX METADATA ANALYSIS REPORT

Section 1: Operational Efficiency Matrix
By shifting lightweight operations (like canvas conversions and password encryption) to client-side threads, the platform reduces server CPU cycles by 84% and eliminates data transit overhead entirely.

Section 2: High Performance Scaling
FFmpeg subprocess executions handle video processing tasks (WebM/MP4 to GIF). 
By isolating these actions inside node microservices, we keep core APIs non-blocking.
`;
  };

  const getMockSummaryResult = () => {
    return `### Executive AI Summary

*   **Zero-Retention Privacy**: The report highlights that local execution prevents critical file transfers, maximizing data security constraints.
*   **Infrastructure Strategy**: Consolidating file conversion pipelines onto FastAPI nodes increases geometry reconstruction quality (specifically for PDF to DOCX tables).
*   **Server Relief**: Moving simple operations to client-side canvas APIs reduces server overhead by 84% and cuts bandwidth egress fees.
`;
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">AI Document Intelligence Workspace</h1>
          <p className="text-slate-400 text-xs mt-1">
            Leverage deep-learning OCR, automated layout translation, and side-by-side comparison matrices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/pdf"
            className="text-xs px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition duration-200"
          >
            ← Back to Hub
          </Link>
          {selectedFile && (
            <button
              onClick={() => { setSelectedFile(null); setIsFinished(false); }}
              className="text-xs px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition duration-200"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid selector of sub-tools inside the workspace */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'summarize', name: '🤖 AI Summarizer', desc: 'Abstractive summary' },
          { id: 'ocr', name: '👁️ OCR Text Reader', desc: 'Scan image to text' },
          { id: 'translate', name: '🌍 Translate PDF', desc: 'Translate layouts' },
          { id: 'compare', name: '⚖️ Compare PDF', desc: 'Diff documents' },
          { id: 'forms', name: '📝 PDF Forms Builder', desc: 'Fillable form parser' },
          { id: 'scan', name: '📷 Scan to PDF', desc: 'Mobile capture' },
          { id: 'workflow', name: '⛓️ Custom Workflows', desc: 'Chained pipelines' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTool(t.id);
              setIsFinished(false);
              setProgress(0);
              setLogs([]);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              activeTool === t.id
                ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/25'
                : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Main Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: Sidebar configurations */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 space-y-6 h-fit">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Parameters</h3>

          {activeTool === 'summarize' && (
            <p className="text-xs text-slate-400">
              Parses structural document content and synthesizes summaries using neural layout tokens.
            </p>
          )}

          {activeTool === 'ocr' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">OCR Language</label>
              <select
                value={ocrLanguage}
                onChange={(e) => setOcrLanguage(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
              >
                <option value="eng">English (Latin script)</option>
                <option value="spa">Spanish (Español)</option>
                <option value="fra">French (Français)</option>
                <option value="deu">German (Deutsch)</option>
              </select>
            </div>
          )}

          {activeTool === 'translate' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">Target Language</label>
              <select
                value={translateTarget}
                onChange={(e) => setTranslateTarget(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
              >
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="zh">Chinese (中文)</option>
                <option value="ja">Japanese (日本語)</option>
              </select>
            </div>
          )}

          {activeTool === 'compare' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">Compare With (Document B)</label>
              <button
                onClick={() => compareInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-pink-500 text-slate-300 text-xs font-bold transition duration-200"
              >
                {compareFile ? `📄 ${compareFile.name}` : '📁 Upload Doc B'}
              </button>
              <input
                type="file"
                ref={compareInputRef}
                onChange={handleCompareFileChange}
                accept=".pdf"
                className="hidden"
              />
            </div>
          )}

          {activeTool === 'forms' && (
            <p className="text-xs text-slate-400">
              Autodetects form field matrices. Yields fully editable fillable fields which can be completed directly in the viewer.
            </p>
          )}

          {activeTool === 'scan' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                Scan document page limits using local device camera loops or mobile client streams.
              </p>
              <button
                onClick={() => alert('Accessing camera permissions feed... (Mocked)')}
                className="w-full py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold"
              >
                🎥 Launch Camera Stream
              </button>
            </div>
          )}

          {activeTool === 'workflow' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 font-mono">Chain Pipelines</label>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="flow-ocr"
                    defaultChecked
                    className="accent-pink-600"
                  />
                  <label htmlFor="flow-ocr" className="text-slate-300">1. OCR text mapping</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="flow-sum"
                    defaultChecked
                    className="accent-pink-600"
                  />
                  <label htmlFor="flow-sum" className="text-slate-300">2. Synthesise Summary</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="flow-protect"
                    className="accent-pink-600"
                  />
                  <label htmlFor="flow-protect" className="text-slate-300">3. Encrypt output file</label>
                </div>
              </div>
            </div>
          )}

          {/* Trigger */}
          {selectedFile && !isProcessing && (
            <button
              onClick={runAiPipeline}
              className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-pink-600/25"
            >
              🚀 Process with AI
            </button>
          )}
        </div>

        {/* Right column: Main dashboard interactive console */}
        <div className="lg:col-span-3 space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,image/*"
            className="hidden"
          />

          {selectedFile === null ? (
            /* Upload container */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 hover:border-pink-500/50 bg-slate-950/20 hover:bg-slate-950/40 rounded-3xl p-16 text-center cursor-pointer transition duration-300 flex flex-col items-center justify-center min-h-[400px] space-y-4"
            >
              <span className="text-5xl">🤖</span>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Upload document for AI Processing</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Drag and drop PDF files or images to run OCR, summarize content, or convert layouts.
                </p>
              </div>
              <div className="text-[10px] text-slate-400 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                Supports PDFs & Images up to 30MB
              </div>
            </div>
          ) : (
            /* Active view */
            <div className="space-y-6">
              
              {/* File banner */}
              <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400">
                  Target File: <strong className="text-white">{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-pink-400 hover:text-pink-300"
                >
                  Change File
                </button>
              </div>

              {/* In Progress Console */}
              {isProcessing && (
                <div className="glass-panel rounded-2xl p-6 space-y-6 bg-slate-950/40 border border-white/5 shadow-inner">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 font-semibold font-mono">
                      <span>Neural Engine Computation...</span>
                      <span>{progress}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                      <div
                        className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Log Console */}
                  <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-[10px] space-y-2 h-44 overflow-y-auto scrollbar-thin">
                    {logs.map((log, idx) => (
                      <div key={idx} className="flex gap-2 leading-relaxed">
                        <span className="text-slate-500">[{log.time}]</span>
                        <span
                          className={
                            log.status === 'success'
                              ? 'text-emerald-400'
                              : log.status === 'working'
                              ? 'text-amber-400 animate-pulse'
                              : 'text-slate-300'
                          }
                        >
                          {log.status === 'success' ? '✓' : log.status === 'working' ? '⚙' : 'ℹ'} {log.msg}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Finished Display output panel */}
              {isFinished && (
                <div className="glass-panel rounded-2xl p-8 space-y-6 border border-white/5">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> AI Processed Product
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert('Content copied to clipboard!')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-white"
                      >
                        📋 Copy Text
                      </button>
                      <button
                        onClick={() => alert('Initiating file download...')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold"
                      >
                        📥 Download Output
                      </button>
                    </div>
                  </div>

                  {/* Tool output variants */}
                  {activeTool === 'summarize' && (
                    <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
                      <div dangerouslySetInnerHTML={{ __html: getMockSummaryResult().replace(/\*/g, '•').replace(/###/g, '<h4 class="font-bold text-white text-base">').replace(/\n/g, '<br />') }} />
                    </div>
                  )}

                  {activeTool === 'ocr' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Original Document view</div>
                        <div className="h-48 flex items-center justify-center border border-white/5 bg-slate-900/30 rounded-lg text-slate-600">
                          📄 Image Raster Grid
                        </div>
                      </div>
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-2">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Extracted Searchable Text</div>
                        <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed overflow-y-auto h-40 scrollbar-thin">
                          {getMockOcrResult()}
                        </pre>
                      </div>
                    </div>
                  )}

                  {activeTool === 'translate' && (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-400">
                        Document layout has been reconstructed. Below is the parsed translation summary:
                      </p>
                      <div className="bg-slate-950/40 p-5 rounded-xl border border-white/5 font-serif text-sm text-slate-300 leading-relaxed italic">
                        "El Toolbox de Cloud procesa operaciones en la máquina del cliente, reduciendo los ciclos de CPU del servidor en un 84%..."
                      </div>
                    </div>
                  )}

                  {activeTool === 'compare' && (
                    <div className="space-y-4 font-mono text-[11px]">
                      <p className="text-xs text-slate-400">
                        Side-by-side verification report. Highlighted lines identify modifications:
                      </p>
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 h-44 overflow-y-auto space-y-1">
                        <div className="text-slate-500">@@ line 24 @@</div>
                        <div className="text-red-400 bg-red-950/20 px-2 py-0.5 rounded">- const version = "v0.9.0-alpha";</div>
                        <div className="text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded">+ const version = "1.0.0-scaffold"; // production</div>
                        <div className="text-slate-400 px-2">const build = "stable";</div>
                      </div>
                    </div>
                  )}

                  {activeTool === 'forms' && (
                    <div className="space-y-4 font-mono text-xs">
                      <p className="text-xs text-slate-400">
                        AI Form Field Detector detected <strong className="text-white">3 interactive fields</strong>. Complete them below:
                      </p>
                      <div className="bg-slate-950/40 p-6 rounded-xl border border-white/5 space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400">FULL NAME</label>
                          <input type="text" placeholder="John Doe" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400">SIGNATURE DATE</label>
                          <input type="date" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTool === 'scan' && (
                    <div className="text-center py-6">
                      <span className="text-3xl block mb-2">📸</span>
                      <p className="text-xs text-slate-300">
                        Camera snapshot compiled and exported to <strong className="text-white">scanned_doc.pdf</strong>.
                      </p>
                    </div>
                  )}

                  {activeTool === 'workflow' && (
                    <div className="space-y-4 text-xs">
                      <p className="text-slate-400">
                        Workflow chain pipeline completed successfully.
                      </p>
                      <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                          <span>STEP 1: OCR</span>
                          <span className="text-emerald-400 font-bold">SUCCESS</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                          <span>STEP 2: SUMMARIZER</span>
                          <span className="text-emerald-400 font-bold">SUCCESS</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}


export default function AiWorkspaceClient() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-8">Loading workspace...</div>}>
      <AiWorkspaceContent />
    </React.Suspense>
  );
}
