'use client';

import React, { useState } from 'react';
import SeoMeta from '@/components/SeoMeta';

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadBlobUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Call high-performance FastAPI backend microservice
      const response = await fetch('http://localhost:8000/convert/pdf-to-docx', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion server returned an error.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      let baseName = file.name;
      const lastDotIndex = baseName.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        const ext = baseName.substring(lastDotIndex).toLowerCase();
        if (ext === '.pdf') {
          baseName = baseName.substring(0, lastDotIndex);
        }
      }
      setDownloadName(`${baseName}.docx`);
      setDownloadBlobUrl(url);
    } catch (err) {
      console.error(err);
      alert("Error converting file. Ensure the FastAPI service is running locally on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Upload a standard PDF document.',
    'Click convert to send the file to our layout extraction parser.',
    'Wait while the Python pdf2docx library reconstructs paragraphs and tables.',
    'Download the resulting Microsoft Word .docx file.'
  ];

  const faqs = [
    {
      question: 'How accurate is the PDF to Word conversion?',
      answer: 'We leverage a Python-based parser (pdf2docx) which analyzes layout shapes, font matrices, and spacing. This provides superior structural accuracy for complex grids and paragraph structures compared to standard conversions.'
    },
    {
      question: 'What happens to my PDF files on your servers?',
      answer: 'We maintain a strict zero-retention security policy. Files are processed in secure temporary folders, converted in-memory, and immediately purged from backend servers once downloaded.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SeoMeta
        toolName="PDF to Word Converter"
        description="Convert PDF files to editable Microsoft Word (DOCX) documents. The layout, fonts, and graphics are reconstructed using advanced pdf2docx algorithms."
        url="https://multitoolplatform.example.com/pdf/convert-pdf-to-word"
        steps={steps}
        faqs={faqs}
      />

      <section className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-white">Convert PDF to Word (DOCX)</h1>
        <p className="text-slate-400">
          Reconstruct your PDF document into an editable Microsoft Word document with matching text alignments and tables.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload box */}
        <div className="glass-panel rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Upload Document</h2>
          
          <div className="border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-xl p-8 text-center cursor-pointer transition relative bg-slate-900/30">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-violet-400">✓ File Uploaded</p>
                <p className="text-xs text-slate-300 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-400">
                <div className="text-4xl">📄</div>
                <p className="text-sm font-medium text-white">Drag & drop your PDF file here</p>
                <p className="text-xs">or click to browse from folder</p>
              </div>
            )}
          </div>

          {file && (
            <button
              onClick={handleConvert}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white transition disabled:opacity-50"
            >
              {loading ? 'Reconstructing Layout...' : 'Convert to Word'}
            </button>
          )}
        </div>

        {/* Output box */}
        <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-white mb-4">Export Result</h2>
          
          <div className="flex-grow flex items-center justify-center border border-white/5 bg-slate-950/40 rounded-xl min-h-[220px] p-4 text-center">
            {downloadBlobUrl ? (
              <div className="space-y-3">
                <p className="text-5xl">📝</p>
                <p className="text-sm font-semibold text-emerald-400">Word Document Ready!</p>
                <p className="text-xs text-slate-400 max-w-[200px] truncate mx-auto">{downloadName}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Your converted Word document will be available for download here.
              </p>
            )}
          </div>

          {downloadBlobUrl && (
            <a
              href={downloadBlobUrl}
              download={downloadName}
              className="mt-6 block w-full text-center py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-500/25"
            >
              📥 Download DOCX
            </a>
          )}
        </div>
      </div>

      {/* Helpful FAQ section for SEO optimization */}
      <section className="glass-panel rounded-2xl p-8 space-y-6">
        <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="space-y-2 border-b border-white/5 pb-4 last:border-0 last:pb-0">
              <h4 className="font-semibold text-violet-400">{faq.question}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
