'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface ToolItem {
  name: string;
  desc: string;
  isImplemented: boolean;
  href: string;
  isLocal: boolean;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  gradient: string;
  textColor: string;
  tools: ToolItem[];
}

export default function HomeClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: Category[] = useMemo(() => [
    {
      id: 'pdf-conv',
      title: 'PDF Conversion',
      icon: '🔄',
      gradient: 'from-red-500/10 to-orange-500/10 border-red-500/20',
      textColor: 'text-red-400',
      tools: [
        { name: 'PDF to Word', desc: 'Converts PDF files into editable DOC and DOCX documents.', isImplemented: true, href: '/pdf/convert-pdf-to-word', isLocal: false },
        { name: 'PDF to PowerPoint', desc: 'Turns PDF files into editable PPT and PPTX slideshow presentations.', isImplemented: true, href: '/pdf/workspace?tool=pdf-to-ppt', isLocal: false },
        { name: 'PDF to Excel', desc: 'Pulls tables and data straight from PDFs into Excel spreadsheets.', isImplemented: true, href: '/pdf/workspace?tool=pdf-to-excel', isLocal: false },
        { name: 'Word to PDF', desc: 'Converts Microsoft Word files (DOC/DOCX) into PDF format.', isImplemented: true, href: '/pdf/workspace?tool=word-to-pdf', isLocal: false },
        { name: 'PowerPoint to PDF', desc: 'Converts PowerPoint presentations (PPT/PPTX) into PDF format.', isImplemented: true, href: '/pdf/workspace?tool=ppt-to-pdf', isLocal: false },
        { name: 'Excel to PDF', desc: 'Converts Excel spreadsheets into readable PDFs.', isImplemented: true, href: '/pdf/workspace?tool=excel-to-pdf', isLocal: false },
        { name: 'PDF to JPG', desc: 'Converts each page of a PDF into a JPG image or extracts embedded images.', isImplemented: true, href: '/pdf/workspace?tool=pdf-to-jpg', isLocal: true },
        { name: 'JPG to PDF / Image to PDF', desc: 'Converts JPG and other image formats to PDF with margin controls.', isImplemented: true, href: '/pdf/workspace?tool=jpg-to-pdf', isLocal: true },
        { name: 'HTML to PDF', desc: 'Converts webpages into PDF files by copying and pasting URL.', isImplemented: true, href: '/pdf/workspace?tool=html-to-pdf', isLocal: false },
        { name: 'PDF to PDF/A', desc: 'Transforms standard PDFs into ISO-standardized PDF/A format.', isImplemented: true, href: '/pdf/workspace?tool=pdf-to-pdfa', isLocal: false }
      ]
    },
    {
      id: 'pdf-org',
      title: 'Document Org & Edit',
      icon: '📂',
      gradient: 'from-violet-500/10 to-fuchsia-500/10 border-violet-500/20',
      textColor: 'text-violet-400',
      tools: [
        { name: 'Merge PDF', desc: 'Combines multiple PDF files into a single document in any order.', isImplemented: true, href: '/pdf/workspace?tool=merge', isLocal: true },
        { name: 'Split PDF', desc: 'Separates specific pages or ranges from a document into independent PDFs.', isImplemented: true, href: '/pdf/workspace?tool=split', isLocal: true },
        { name: 'Organize PDF', desc: 'Sort, delete, or insert new pages into an existing PDF file.', isImplemented: true, href: '/pdf/workspace?tool=organize', isLocal: true },
        { name: 'Rotate PDF', desc: 'Rotates single or multiple PDF pages simultaneously.', isImplemented: true, href: '/pdf/workspace?tool=rotate', isLocal: true },
        { name: 'Crop PDF', desc: 'Trims document margins or isolates specific regions.', isImplemented: true, href: '/pdf/workspace?tool=crop', isLocal: true },
        { name: 'Edit PDF', desc: 'Inserts text, images, shapes, or annotations directly into a PDF.', isImplemented: true, href: '/pdf/workspace?tool=edit', isLocal: true },
        { name: 'Page numbers', desc: 'Adds page numbers into a PDF with custom placement and font.', isImplemented: true, href: '/pdf/workspace?tool=page-numbers', isLocal: true },
        { name: 'Watermark', desc: 'Stamps text or image watermark over a PDF with opacity control.', isImplemented: true, href: '/pdf/workspace?tool=watermark', isLocal: true }
      ]
    },
    {
      id: 'pdf-opt',
      title: 'Optimization & Repair',
      icon: '⚡',
      gradient: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20',
      textColor: 'text-amber-400',
      tools: [
        { name: 'Compress PDF', desc: 'Shrinks file size of a document while preserving highest visual quality.', isImplemented: true, href: '/pdf/workspace?tool=compress', isLocal: true },
        { name: 'Repair PDF', desc: 'Analyzes and repairs corrupted or damaged PDF files.', isImplemented: true, href: '/pdf/workspace?tool=repair', isLocal: false }
      ]
    },
    {
      id: 'pdf-sec',
      title: 'Security & Signatures',
      icon: '🛡️',
      gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
      textColor: 'text-emerald-400',
      tools: [
        { name: 'Sign PDF', desc: 'Electronically sign documents or send secure eSignature requests.', isImplemented: true, href: '/pdf/workspace?tool=sign', isLocal: true },
        { name: 'Unlock PDF', desc: 'Removes password-based security restrictions from a PDF.', isImplemented: true, href: '/pdf/workspace?tool=unlock', isLocal: true },
        { name: 'Protect PDF', desc: 'Encrypts and secures PDF files by adding a custom password.', isImplemented: true, href: '/pdf/protect-pdf-with-password', isLocal: true },
        { name: 'Redact PDF', desc: 'Permanently blacks out and deletes sensitive text or graphics.', isImplemented: true, href: '/pdf/workspace?tool=redact', isLocal: true }
      ]
    },
    {
      id: 'pdf-ai',
      title: 'AI & Intelligence',
      icon: '🤖',
      gradient: 'from-pink-500/10 to-rose-500/10 border-pink-500/20',
      textColor: 'text-pink-400',
      tools: [
        { name: 'OCR PDF', desc: 'Performs Optical Character Recognition to convert scans to searchable text.', isImplemented: true, href: '/ai/workspace?tool=ocr', isLocal: false },
        { name: 'Compare PDF', desc: 'Generates a side-by-side comparison of two document versions.', isImplemented: true, href: '/ai/workspace?tool=compare', isLocal: false },
        { name: 'PDF Forms', desc: 'Detects form fields and creates interactive fillable PDFs.', isImplemented: true, href: '/ai/workspace?tool=forms', isLocal: true },
        { name: 'Scan to PDF', desc: 'Capture paper documents via mobile camera scan and sync directly.', isImplemented: true, href: '/ai/workspace?tool=scan', isLocal: true },
        { name: 'AI Summarizer', desc: 'Extracts key points and generates summaries from documents.', isImplemented: true, href: '/ai/workspace?tool=summarize', isLocal: false },
        { name: 'Translate PDF', desc: 'Translates entire PDF documents while keeping layouts intact.', isImplemented: true, href: '/ai/workspace?tool=translate', isLocal: false },
        { name: 'Create a Workflow', desc: 'Combines several tools into custom, automated reusable sequences.', isImplemented: true, href: '/ai/workspace?tool=workflow', isLocal: true }
      ]
    },
    {
      id: 'img-edit',
      title: 'Image Processing',
      icon: '🖼️',
      gradient: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
      textColor: 'text-blue-400',
      tools: [
        { name: 'Compress IMAGE', desc: 'Compresses JPG, PNG, SVG, and GIFs to reduce file size.', isImplemented: true, href: '/image/workspace?tool=compress', isLocal: true },
        { name: 'Resize IMAGE', desc: 'Resize images by percentage or specific pixel dimensions.', isImplemented: true, href: '/image/workspace?tool=resize', isLocal: true },
        { name: 'Crop IMAGE', desc: 'Trims JPG, PNG, or GIFs using a visual canvas editor.', isImplemented: true, href: '/image/workspace?tool=crop', isLocal: true },
        { name: 'Convert PNG to JPG', desc: 'Enables high fidelity client-side conversion using Canvas.', isImplemented: true, href: '/image/convert-png-to-jpg', isLocal: true },
        { name: 'Convert from JPG', desc: 'Turns JPG files into PNG, SVG, or animated GIF formats.', isImplemented: true, href: '/image/workspace?tool=convert', isLocal: true },
        { name: 'HTML to IMAGE', desc: 'Converts entire HTML webpages into JPG or SVG files.', isImplemented: true, href: '/image/workspace?tool=html-to-image', isLocal: false },
        { name: 'Photo editor', desc: 'Simplified tools to add text, frames, and stickers to photos.', isImplemented: true, href: '/image/workspace?tool=edit', isLocal: true },
        { name: 'Meme generator', desc: 'Design custom memes by adding captioned text to templates.', isImplemented: true, href: '/image/workspace?tool=meme', isLocal: true },
        { name: 'Rotate IMAGE', desc: 'Rotates multiple JPG, PNG, or GIF images simultaneously.', isImplemented: true, href: '/image/workspace?tool=rotate', isLocal: true },
        { name: 'Upscale Image', desc: 'Enlarge JPG and PNG files to a higher resolution using AI.', isImplemented: true, href: '/image/workspace?tool=upscale', isLocal: false },
        { name: 'Remove background', desc: 'Instantly detects primary subjects and cleanly cuts out background.', isImplemented: true, href: '/image/workspace?tool=remove-bg', isLocal: false },
        { name: 'Watermark IMAGE', desc: 'Stamps a text or image watermark over your pictures.', isImplemented: true, href: '/image/workspace?tool=watermark', isLocal: true },
        { name: 'Blur face', desc: 'Blurs faces, license plates, and sensitive items in photos.', isImplemented: true, href: '/image/workspace?tool=blur', isLocal: true }
      ]
    },
    {
      id: 'multimedia',
      title: 'Multimedia & Converters',
      icon: '📹',
      gradient: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20',
      textColor: 'text-cyan-400',
      tools: [
        { name: 'Video to GIF', desc: 'Convert MP4/WebM to animated GIFs with optimized FFmpeg flags.', isImplemented: true, href: '/video/convert-video-to-gif', isLocal: false },
        { name: 'MP3 Converter', desc: 'Converts audio tracks locally into high quality MP3 streams.', isImplemented: true, href: '/converters/workspace?tool=mp3', isLocal: true },
        { name: 'EPUB to PDF', desc: 'Turns EPUB and ebook structures into readable PDF documents.', isImplemented: true, href: '/converters/workspace?tool=epub', isLocal: false },
        { name: 'RAR to Zip', desc: 'Convert archive files and compress directories locally.', isImplemented: true, href: '/converters/workspace?tool=rar', isLocal: true },
        { name: 'PST to EST', desc: 'Convert PST timestamps to EST zone mappings.', isImplemented: true, href: '/converters/workspace?tool=timezone', isLocal: true },
        { name: 'Lbs to Kg', desc: 'Utility to swap units between imperial and metric systems.', isImplemented: true, href: '/converters/workspace?tool=units', isLocal: true },
        { name: 'Collage Maker', desc: 'Stitch pictures together into modern collage grids.', isImplemented: true, href: '/converters/workspace?tool=collage', isLocal: true }
      ]
    }
  ], []);

  // Filter tools based on search query and category tab selection
  const filteredCategories = useMemo(() => {
    return categories
      .map(cat => {
        // Filter within category
        const matchingTools = cat.tools.filter(tool => {
          const query = searchQuery.toLowerCase();
          return (
            tool.name.toLowerCase().includes(query) ||
            tool.desc.toLowerCase().includes(query)
          );
        });

        return { ...cat, tools: matchingTools };
      })
      .filter(cat => {
        // Filter by category selection
        if (selectedCategory !== 'all' && cat.id !== selectedCategory) {
          return false;
        }
        // Only return if category has tools matching the search query
        return cat.tools.length > 0;
      });
  }, [categories, searchQuery, selectedCategory]);

  return (
    <div className="space-y-12">
      {/* Hero section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Supercharged,{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400">
            Privacy-First Tool Suite
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 font-medium">
          Fast, local-first converters and media pipelines. We process sensitive tasks right inside your browser threads—meaning your files never leave your computer.
        </p>
      </section>

      {/* Control bar: search + category filters */}
      <section className="space-y-6">
        <div className="relative max-w-2xl mx-auto">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search 50+ high-performance tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-base focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 shadow-inner"
          />
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
              selectedCategory === 'all'
                ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            🌟 All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              {cat.icon} {cat.title}
            </button>
          ))}
        </div>
      </section>

      {/* Main Tool Registry Display */}
      <section className="space-y-12">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-xl font-bold text-white tracking-wide">{cat.title}</h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-mono">
                  {cat.tools.length} {cat.tools.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.tools.map((tool, idx) => (
                  <div
                    key={idx}
                    className={`glass-panel rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-white/10 transition-all duration-300 ${
                      tool.isImplemented ? 'ring-1 ring-violet-500/10' : 'opacity-80'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white text-base">{tool.name}</h3>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            tool.isLocal
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {tool.isLocal ? 'Local' : 'Cloud'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {tool.desc}
                      </p>
                    </div>

                    <div className="mt-6">
                      {tool.isImplemented ? (
                        <Link
                          href={tool.href}
                          className="block w-full text-center py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition duration-200 shadow-md shadow-violet-500/10"
                        >
                          🚀 Launch Tool
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed"
                        >
                          ⏳ Coming Soon
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 glass-panel rounded-2xl space-y-3">
            <p className="text-3xl">🔍</p>
            <h3 className="text-lg font-bold text-white">No tools found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any tool matching "{searchQuery}". Try modifying your query or selecting another tab.
            </p>
          </div>
        )}
      </section>

      {/* Universal Workflow banner */}
      <section className="glass-panel rounded-3xl p-10 border border-white/5 bg-slate-950/40 space-y-6">
        <h3 className="text-2xl font-extrabold text-white text-center sm:text-left">
          Universal File Processing Workflow
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-400">Step 1</div>
            <div className="text-sm font-semibold text-white">Analyze & Select</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify your source file type and target format. Choose the matching tool.
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-400">Step 2</div>
            <div className="text-sm font-semibold text-white">Import Asset</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your file, paste an HTML URL, or capture using mobile camera sync.
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-400">Step 3</div>
            <div className="text-sm font-semibold text-white">Adjust Parameters</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure optimization rates, rotate pages, or stamp custom watermark boundaries.
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-400">Step 4</div>
            <div className="text-sm font-semibold text-white">Execute & Save</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Process in-memory locally or stream securely to backend, then download the result.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
