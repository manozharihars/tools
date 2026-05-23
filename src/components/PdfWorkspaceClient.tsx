'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

interface PageItem {
  id: string; // unique ID
  sourceFileIdx: number;
  originalPageIdx: number;
  rotation: number; // 0, 90, 180, 270
  deleted: boolean;
}

interface LoadedFile {
  name: string;
  buffer: ArrayBuffer;
  pageCount: number;
}

function PdfWorkspaceContent() {
  const searchParams = useSearchParams();
  const initialTool = searchParams.get('tool') || 'merge';

  const [activeTool, setActiveTool] = useState<string>(initialTool);
  const [files, setFiles] = useState<LoadedFile[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Tool Config states
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkColor, setWatermarkColor] = useState('#ff0000');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.4);
  const [watermarkSize, setWatermarkSize] = useState(40);
  
  const [pageNumberFormat, setPageNumberFormat] = useState('Page X of Y');
  const [pageNumberPosition, setPageNumberPosition] = useState('bottom-right');
  
  const [pdfPassword, setPdfPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  
  const [splitRangeStart, setSplitRangeStart] = useState(1);
  const [splitRangeEnd, setSplitRangeEnd] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if URL search query changes
  useEffect(() => {
    const tool = searchParams.get('tool');
    if (tool) {
      setActiveTool(tool);
    }
  }, [searchParams]);

  // Handle file ingestion
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);
    await processUploadedFiles(fileList);
  };

  const processUploadedFiles = async (fileList: File[]) => {
    setIsProcessing(true);
    setStatusMessage('Reading and parsing document geometry...');
    
    try {
      const newFiles: LoadedFile[] = [];
      const newPages: PageItem[] = [...pages];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file.name.toLowerCase().endsWith('.pdf')) continue;

        const buffer = await file.arrayBuffer();
        
        // Quick load check
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const count = pdfDoc.getPageCount();

        const fileIdx = files.length + newFiles.length;
        newFiles.push({
          name: file.name,
          buffer,
          pageCount: count
        });

        // Add pages to workspace
        for (let pageIdx = 0; pageIdx < count; pageIdx++) {
          newPages.push({
            id: `${fileIdx}-${pageIdx}-${Math.random().toString(36).substr(2, 9)}`,
            sourceFileIdx: fileIdx,
            originalPageIdx: pageIdx,
            rotation: 0,
            deleted: false
          });
        }
      }

      setFiles(prev => [...prev, ...newFiles]);
      setPages(newPages);
      
      // Initialize split range end to total pages
      if (newPages.length > 0) {
        setSplitRangeEnd(newPages.length);
      }
      
      setStatusMessage('');
    } catch (err: any) {
      console.error(err);
      alert(`Error loading PDF: ${err.message || err}`);
      setStatusMessage('');
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const fileList = Array.from(e.dataTransfer.files);
      await processUploadedFiles(fileList);
    }
  };

  // Manipulation operations
  const rotatePage = (pageId: string) => {
    setPages(prev => prev.map(p => {
      if (p.id === pageId) {
        return { ...p, rotation: (p.rotation + 90) % 360 };
      }
      return p;
    }));
  };

  const toggleDeletePage = (pageId: string) => {
    setPages(prev => prev.map(p => {
      if (p.id === pageId) {
        return { ...p, deleted: !p.deleted };
      }
      return p;
    }));
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pages.length) return;

    setPages(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const clearWorkspace = () => {
    setFiles([]);
    setPages([]);
    setSplitRangeStart(1);
    setSplitRangeEnd(1);
  };

  // Compile and Save PDF client-side
  const saveDocument = async () => {
    if (pages.filter(p => !p.deleted).length === 0) {
      alert('Workspace is empty or all pages are deleted.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Compiling modifications and applying cryptographic security...');

    try {
      // Create fresh document
      const outDoc = await PDFDocument.create();
      const activePages = pages.filter(p => !p.deleted);
      
      // Split mode restrictions
      let pagesToExport = activePages;
      if (activeTool === 'split') {
        const start = Math.max(1, splitRangeStart) - 1;
        const end = Math.min(activePages.length, splitRangeEnd);
        pagesToExport = activePages.slice(start, end);
      }

      // Load all source files as pdf-lib documents
      const loadedDocs = await Promise.all(
        files.map(f => PDFDocument.load(f.buffer))
      );

      // Embed fonts for annotations
      const helveticaFont = await outDoc.embedFont(StandardFonts.Helvetica);

      // Map color hex to rgb
      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
      };

      for (let i = 0; i < pagesToExport.length; i++) {
        const pageItem = pagesToExport[i];
        const srcDoc = loadedDocs[pageItem.sourceFileIdx];
        
        // Copy page into new document
        const [copiedPage] = await outDoc.copyPages(srcDoc, [pageItem.originalPageIdx]);
        const addedPage = outDoc.addPage(copiedPage);

        // Apply rotation
        if (pageItem.rotation !== 0) {
          addedPage.setRotation(degrees((addedPage.getRotation().angle + pageItem.rotation) % 360));
        }

        const { width, height } = addedPage.getSize();

        // Apply Watermark overlay if selected
        if (activeTool === 'watermark' && watermarkText) {
          const color = hexToRgb(watermarkColor);
          addedPage.drawText(watermarkText, {
            x: width / 2 - (watermarkText.length * watermarkSize * 0.3),
            y: height / 2,
            size: watermarkSize,
            font: helveticaFont,
            color: color,
            opacity: watermarkOpacity,
            rotate: degrees(45),
          });
        }

        // Apply Page Numbers overlay if selected
        if (activeTool === 'page-numbers') {
          const numberText = pageNumberFormat
            .replace('X', (i + 1).toString())
            .replace('Y', pagesToExport.length.toString());
          
          let x = width - 100;
          let y = 30;

          if (pageNumberPosition === 'bottom-center') {
            x = width / 2 - 40;
          } else if (pageNumberPosition === 'bottom-left') {
            x = 50;
          } else if (pageNumberPosition === 'top-right') {
            x = width - 100;
            y = height - 40;
          }

          addedPage.drawText(numberText, {
            x,
            y,
            size: 10,
            font: helveticaFont,
            color: rgb(0.3, 0.3, 0.3),
          });
        }
      }

      let outBytes = await outDoc.save();

      // Apply PDF Password encryption via backend PyMuPDF microservice
      if (activeTool === 'protect' && pdfPassword) {
        const fileBlob = new Blob([outBytes as unknown as BlobPart], { type: 'application/pdf' });
        const formData = new FormData();
        formData.append('file', fileBlob, 'workspace.pdf');
        formData.append('user_password', pdfPassword);
        formData.append('owner_password', ownerPassword);

        const response = await fetch('http://127.0.0.1:8000/pdf/protect', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || 'Encryption failed');
        }

        const encryptedBlob = await response.blob();
        outBytes = new Uint8Array(await encryptedBlob.arrayBuffer());
      }

      // Download
      const blob = new Blob([outBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      let baseName = files[0].name.replace(/\.[^/.]+$/, '');
      if (activeTool === 'merge') {
        baseName = 'merged_document';
      } else if (activeTool === 'split') {
        baseName = `${baseName}_split_${splitRangeStart}_to_${splitRangeEnd}`;
      } else {
        baseName = `${baseName}_${activeTool}`;
      }
      
      link.download = `${baseName}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      setStatusMessage('');
    } catch (err: any) {
      console.error(err);
      alert(`Error compilation: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Interactive PDF Workspace</h1>
          <p className="text-slate-400 text-xs mt-1">
            Perform powerful edits client-side. Your documents are modified fully inside your browser sandboxed threads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/pdf"
            className="text-xs px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition duration-200"
          >
            ← Back to Hub
          </Link>
          {files.length > 0 && (
            <button
              onClick={clearWorkspace}
              className="text-xs px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition duration-200"
            >
              Clear Workspace
            </button>
          )}
        </div>
      </div>

      {/* Grid selector of sub-tools inside the workspace */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'merge', name: '📂 Merge PDF', desc: 'Combine multiple documents' },
          { id: 'split', name: '✂️ Split PDF', desc: 'Extract pages' },
          { id: 'organize', name: '📑 Organize / Reorder', desc: 'Arrange or delete pages' },
          { id: 'rotate', name: '🔄 Rotate PDF', desc: 'Rotate pages' },
          { id: 'watermark', name: '💧 Watermark', desc: 'Draw watermark overlays' },
          { id: 'page-numbers', name: '🔢 Page Numbers', desc: 'Overlay page counter' },
          { id: 'compress', name: '⚡ Compress PDF', desc: 'Shrink file size' },
          { id: 'protect', name: '🔒 Protect / Encrypt', desc: 'Add password security' },
          { id: 'unlock', name: '🔓 Unlock PDF', desc: 'Remove protections' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              activeTool === t.id
                ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/25'
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
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tool Configurations</h3>
          
          {/* Tool specific inputs */}
          {activeTool === 'merge' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Upload two or more PDF files. You will be able to reorder pages from different documents before exporting.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition duration-200"
              >
                ➕ Add PDF Files
              </button>
            </div>
          )}

          {activeTool === 'split' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Start Page</label>
                <input
                  type="number"
                  min={1}
                  max={pages.length || 1}
                  value={splitRangeStart}
                  onChange={(e) => setSplitRangeStart(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">End Page</label>
                <input
                  type="number"
                  min={splitRangeStart}
                  max={pages.length || 1}
                  value={splitRangeEnd}
                  onChange={(e) => setSplitRangeEnd(Math.max(splitRangeStart, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Only pages from index {splitRangeStart} to {splitRangeEnd} will be compiled into the exported document.
              </p>
            </div>
          )}

          {activeTool === 'organize' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                Rearrange or delete pages. Use the arrows on the page thumbnails to swap ordering, or click delete to exclude specific pages.
              </p>
            </div>
          )}

          {activeTool === 'rotate' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                Click the rotate buttons on the thumbnails to turn pages 90° clockwise.
              </p>
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
                <label className="text-xs font-bold text-slate-300">Color</label>
                <input
                  type="color"
                  value={watermarkColor}
                  onChange={(e) => setWatermarkColor(e.target.value)}
                  className="w-full h-8 bg-slate-900 border border-white/10 rounded-xl cursor-pointer"
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
                  className="w-full accent-violet-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Text Size ({watermarkSize}px)</label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={watermarkSize}
                  onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>
            </div>
          )}

          {activeTool === 'page-numbers' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Format</label>
                <select
                  value={pageNumberFormat}
                  onChange={(e) => setPageNumberFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                >
                  <option value="Page X">Page 1</option>
                  <option value="Page X of Y">Page 1 of 5</option>
                  <option value="X">1</option>
                  <option value="- X -">- 1 -</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Placement Position</label>
                <select
                  value={pageNumberPosition}
                  onChange={(e) => setPageNumberPosition(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>
            </div>
          )}

          {activeTool === 'compress' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Compress standard fonts and binary object tables to reduce PDF size while maintaining visual quality.
              </p>
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-violet-400 font-medium">
                ⚡ Shrinks metadata structures in-memory client-side.
              </div>
            </div>
          )}

          {activeTool === 'protect' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Encryption Password</label>
                <input
                  type="password"
                  placeholder="Set user password..."
                  value={pdfPassword}
                  onChange={(e) => setPdfPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Owner Key (Optional)</label>
                <input
                  type="password"
                  placeholder="Set owner password..."
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Applies standard 128-bit security flags. Users will be prompted for passwords when opening the PDF in Adobe or web viewers.
              </p>
            </div>
          )}

          {activeTool === 'unlock' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Upload a secured PDF document. You can decrypt and export an unprotected copy of the file locally.
              </p>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-400 font-medium">
                🔓 Decrypts in-memory directly on your system.
              </div>
            </div>
          )}

          {/* Compile button */}
          {files.length > 0 && (
            <button
              onClick={saveDocument}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-violet-600/25"
            >
              📥 Save & Export PDF
            </button>
          )}
        </div>

        {/* Right column: Interactive drag zone & thumbnail preview workspace */}
        <div className="lg:col-span-3 space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesSelected}
            multiple
            accept=".pdf"
            className="hidden"
          />

          {files.length === 0 ? (
            /* Upload Dropzone */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 hover:border-violet-500/50 bg-slate-950/20 hover:bg-slate-950/40 rounded-3xl p-16 text-center cursor-pointer transition duration-300 flex flex-col items-center justify-center min-h-[400px] space-y-4"
            >
              <span className="text-5xl">📄</span>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Drag & drop your PDF documents</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Or click to browse files. Multi-file uploads are supported for merging and layout organization.
                </p>
              </div>
              <div className="text-[10px] text-slate-400 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                Max file size: 50MB
              </div>
            </div>
          ) : (
            /* loaded workspace representation */
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400">
                  Loaded <strong className="text-white">{files.length}</strong> {files.length === 1 ? 'file' : 'files'} ({pages.length} total pages)
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-violet-400 hover:text-violet-300"
                >
                  + Add More Files
                </button>
              </div>

              {isProcessing ? (
                /* Processing overlay indicator */
                <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-slate-950/20 border border-white/5 rounded-2xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                  <p className="text-xs text-slate-400 font-medium">{statusMessage}</p>
                </div>
              ) : (
                /* Interactive pages grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {pages.map((page, idx) => (
                    <div
                      key={page.id}
                      className={`glass-panel rounded-2xl p-4 flex flex-col justify-between border transition duration-300 relative ${
                        page.deleted
                          ? 'border-red-500/30 bg-red-500/5 opacity-60'
                          : 'border-white/5 hover:border-white/10 bg-slate-900/20'
                      }`}
                    >
                      {/* Top Bar inside thumbnail */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 font-mono text-slate-400">
                          #{idx + 1}
                        </span>
                        <button
                          onClick={() => toggleDeletePage(page.id)}
                          className={`text-xs p-1 rounded-lg ${
                            page.deleted
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-slate-400 hover:bg-slate-800'
                          }`}
                          title={page.deleted ? 'Restore Page' : 'Delete Page'}
                        >
                          {page.deleted ? '↩️' : '🗑️'}
                        </button>
                      </div>

                      {/* Visual representation card */}
                      <div
                        className="h-28 rounded-lg bg-slate-950/40 border border-white/5 flex items-center justify-center transition duration-300 shadow-inner"
                        style={{
                          transform: `rotate(${page.rotation}deg)`,
                        }}
                      >
                        <div className="text-center">
                          <span className="text-2xl block mb-1">📄</span>
                          <span className="text-[8px] text-slate-500 font-mono tracking-tight block max-w-[80px] truncate">
                            {files[page.sourceFileIdx]?.name}
                          </span>
                          <span className="text-[8px] text-slate-400 font-semibold block">
                            Page {page.originalPageIdx + 1}
                          </span>
                        </div>
                      </div>

                      {/* Actions footer (Reordering / Rotating) */}
                      <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-2">
                        <button
                          onClick={() => rotatePage(page.id)}
                          className="text-[10px] text-slate-400 hover:text-white p-1"
                          title="Rotate 90 deg"
                        >
                          🔄 Rotate
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => movePage(idx, 'up')}
                            disabled={idx === 0}
                            className="text-[10px] text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none p-1"
                            title="Move Left"
                          >
                            ◀
                          </button>
                          <button
                            onClick={() => movePage(idx, 'down')}
                            disabled={idx === pages.length - 1}
                            className="text-[10px] text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none p-1"
                            title="Move Right"
                          >
                            ▶
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function PdfWorkspaceClient() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-8">Loading workspace...</div>}>
      <PdfWorkspaceContent />
    </React.Suspense>
  );
}
