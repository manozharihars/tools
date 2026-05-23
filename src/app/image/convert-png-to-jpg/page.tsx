'use client';

import React, { useState } from 'react';
import SeoMeta from '@/components/SeoMeta';

export default function PngToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.9);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
    }
  };

  const convertImage = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const converted = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error("Canvas context is unavailable"));
            
            // Draw white background (removes PNG transparency black shadow)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          };
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      setDownloadUrl(converted);
    } catch (err) {
      console.error(err);
      alert("Error processing image.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Choose or drag-and-drop a PNG file.',
    'Adjust the slider to configure image rendering quality.',
    'Click the convert button to transform the image locally.',
    'Download the resulting JPG file.'
  ];

  const faqs = [
    {
      question: 'Is my PNG image secure when converting here?',
      answer: 'Yes. Our converter uses the HTML5 Canvas API to process your file directly in your browser. No files are uploaded to any server.'
    },
    {
      question: 'How does the quality slider affect my final JPG image?',
      answer: 'Higher values (e.g. 0.95) retain image details but produce larger file sizes, while lower values (e.g. 0.70) compress details to reduce file sizes.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SeoMeta
        toolName="PNG to JPG Converter"
        description="Convert PNG images to high-quality JPG format instantly. All transformations run client-side inside browser canvas environments for maximum speed and privacy."
        url="https://multitoolplatform.example.com/image/convert-png-to-jpg"
        steps={steps}
        faqs={faqs}
      />

      <section className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-white">Convert PNG to JPG</h1>
        <p className="text-slate-400">
          Super-fast client-side conversion. Transparent PNG elements will automatically get a clean white background.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload and Control Card */}
        <div className="glass-panel rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Upload & Configure</h2>
          
          <div className="border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-xl p-8 text-center cursor-pointer transition relative bg-slate-900/30">
            <input
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-violet-400">✓ File Selected</p>
                <p className="text-xs text-slate-300 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-400">
                <div className="text-4xl">📤</div>
                <p className="text-sm font-medium text-white">Drag & drop your PNG file here</p>
                <p className="text-xs">or click to browse from folder</p>
              </div>
            )}
          </div>

          {file && (
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>Output Quality</span>
                <span className="text-violet-400">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              
              <button
                onClick={convertImage}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white transition disabled:opacity-50"
              >
                {loading ? 'Converting...' : 'Convert File'}
              </button>
            </div>
          )}
        </div>

        {/* Output and Preview Card */}
        <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-white mb-4">Export Result</h2>
          
          <div className="flex-grow flex items-center justify-center border border-white/5 bg-slate-950/40 rounded-xl min-h-[220px] p-4 text-center">
            {downloadUrl ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-emerald-400">✓ Conversion Complete!</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={downloadUrl}
                  alt="Converted Result Preview"
                  className="max-h-40 mx-auto rounded border border-white/10 object-contain shadow-lg"
                />
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Your processed file preview will show up here after conversion.
              </p>
            )}
          </div>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`${file?.name.replace(/\.[^/.]+$/, "") || 'converted'}.jpg`}
              className="mt-6 block w-full text-center py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-500/25"
            >
              📥 Download JPG
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
