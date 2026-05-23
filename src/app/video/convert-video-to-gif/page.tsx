'use client';

import React, { useState } from 'react';
import SeoMeta from '@/components/SeoMeta';

export default function VideoToGifPage() {
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
      formData.append('video', file);

      // Call Express server microservice
      const response = await fetch('http://localhost:5000/api/video-to-gif', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Video conversion server returned an error.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setDownloadName(file.name.replace(/\.[^/.]+$/, "") + '.gif');
      setDownloadBlobUrl(url);
    } catch (err) {
      console.error(err);
      alert("Error converting video. Ensure the Node.js Express service is running locally on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Upload your source video (MP4/WebM).',
    'Click convert to initiate processing in our backend service.',
    'Wait while FFmpeg rescales the video frames and compiles a optimized color palette.',
    'Download the looping GIF animation.'
  ];

  const faqs = [
    {
      question: 'What video file formats are supported?',
      answer: 'Our Express backend uses FFmpeg, which supports a wide array of formats including MP4, WebM, AVI, and MOV.'
    },
    {
      question: 'How does the converter keep GIF file sizes low?',
      answer: 'We run specialized command filters (-vf scale=480:-1,fps=15) to downscale resolution and throttle the framerate. We also use palettegen/paletteuse filters to output high color fidelity without bloated sizes.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SeoMeta
        toolName="Video to GIF Converter"
        description="Convert video files into lightweight, looping GIF animations. Powered by high-speed backend FFmpeg processing frameworks."
        url="https://multitoolplatform.example.com/video/convert-video-to-gif"
        steps={steps}
        faqs={faqs}
      />

      <section className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-white">Convert Video to GIF</h1>
        <p className="text-slate-400">
          Transform MP4 or WebM recordings into smooth, looping animated GIFs using high-speed FFmpeg streams.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload box */}
        <div className="glass-panel rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Upload Video</h2>
          
          <div className="border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-xl p-8 text-center cursor-pointer transition relative bg-slate-900/30">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-violet-400">✓ Video Selected</p>
                <p className="text-xs text-slate-300 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-400">
                <div className="text-4xl">🎬</div>
                <p className="text-sm font-medium text-white">Drag & drop your video file here</p>
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
              {loading ? 'Compiling GIF Frames...' : 'Convert to GIF'}
            </button>
          )}
        </div>

        {/* Output box */}
        <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-white mb-4">Export Result</h2>
          
          <div className="flex-grow flex items-center justify-center border border-white/5 bg-slate-950/40 rounded-xl min-h-[220px] p-4 text-center">
            {downloadBlobUrl ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-emerald-400">✓ Conversion Complete!</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={downloadBlobUrl}
                  alt="Converted GIF Animation Preview"
                  className="max-h-40 mx-auto rounded border border-white/10 object-contain shadow-lg"
                />
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Your looping GIF animation preview will be available here.
              </p>
            )}
          </div>

          {downloadBlobUrl && (
            <a
              href={downloadBlobUrl}
              download={downloadName}
              className="mt-6 block w-full text-center py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-500/25"
            >
              📥 Download GIF
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
