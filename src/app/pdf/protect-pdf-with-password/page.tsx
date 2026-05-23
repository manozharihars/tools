'use client';

import React, { useState } from 'react';
import SeoMeta from '@/components/SeoMeta';

export default function ProtectPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [userPassword, setUserPassword] = useState<string>('');
  const [ownerPassword, setOwnerPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadBlobUrl(null);
    }
  };

  const handleProtect = async () => {
    if (!file || !userPassword) return;
    setLoading(true);
    setDownloadBlobUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_password', userPassword);
      formData.append('owner_password', ownerPassword);

      const response = await fetch('http://127.0.0.1:8000/pdf/protect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Encryption failed');
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
      setDownloadName(`${baseName}_protected.pdf`);
      setDownloadBlobUrl(url);
    } catch (err: any) {
      console.error(err);
      alert(`Could not encrypt PDF: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Select a PDF document from your filesystem.',
    'Enter a User Password (required to open the PDF) and an Owner Password (optional).',
    'Click encrypt to process the file locally in-memory.',
    'Download the locked PDF file instantly.'
  ];

  const faqs = [
    {
      question: 'Do my PDFs get uploaded to any servers to lock them?',
      answer: 'No. All PDF operations in this workspace happen on your machine using pdf-lib WebAssembly modules. Your PDF data and passwords stay private and never cross network pipelines.'
    },
    {
      question: 'What is the difference between User and Owner passwords?',
      answer: 'The User Password is required to open and view the PDF document. The Owner Password controls restriction rules, such as preventing copying, printing, or form alterations.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SeoMeta
        toolName="PDF Password Protection Tool"
        description="Add solid password encryption layers to your PDF documents instantly. All file structures are encrypted locally using pdf-lib to maintain 100% data security."
        url="https://multitoolplatform.example.com/pdf/protect-pdf-with-password"
        steps={steps}
        faqs={faqs}
      />

      <section className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-white">Protect PDF with Password</h1>
        <p className="text-slate-400">
          Encrypt your PDF layout and prevent unauthorized access or copying. Fully compiled inside your browser window.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input & Form configurations */}
        <div className="glass-panel rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Upload & Set Security</h2>
          
          <div className="border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-xl p-8 text-center cursor-pointer transition relative bg-slate-900/30">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-violet-400">✓ Document Selected</p>
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
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">User Password (Required to Open)</label>
                <input
                  type="password"
                  placeholder="Set User Password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Owner Password (Optional, restricts editing/printing)</label>
                <input
                  type="password"
                  placeholder="Set Owner Password"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <button
                onClick={handleProtect}
                disabled={loading || !userPassword}
                className="w-full py-3 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white transition disabled:opacity-50"
              >
                {loading ? 'Securing Document...' : 'Encrypt PDF'}
              </button>
            </div>
          )}
        </div>

        {/* Output Download Box */}
        <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-white mb-4">Export Result</h2>
          
          <div className="flex-grow flex items-center justify-center border border-white/5 bg-slate-950/40 rounded-xl min-h-[220px] p-4 text-center">
            {downloadBlobUrl ? (
              <div className="space-y-3">
                <p className="text-5xl">🔒</p>
                <p className="text-sm font-semibold text-emerald-400">PDF Successfully Locked!</p>
                <p className="text-xs text-slate-400 max-w-[200px] truncate mx-auto">{downloadName}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Your encrypted PDF file will be available here once processing completes.
              </p>
            )}
          </div>

          {downloadBlobUrl && (
            <a
              href={downloadBlobUrl}
              download={downloadName}
              className="mt-6 block w-full text-center py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-500/25"
            >
              📥 Download Protected PDF
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
