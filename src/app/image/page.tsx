import Link from 'next/link';
import SeoMeta from '@/components/SeoMeta';

export const metadata = {
  title: 'Client-Side Image Utilities - Convert PNG to JPG or WebP',
  description: 'Convert PNG images to JPG/WebP formats or apply watermark overlays safely in-browser. Fast processing using the HTML5 Canvas API.',
  openGraph: {
    title: 'Client-Side Image Utilities - Convert PNG to JPG or WebP',
    description: 'Convert PNG images to JPG/WebP formats or apply watermark overlays safely in-browser. Fast processing using the HTML5 Canvas API.',
    url: 'https://multitoolplatform.example.com/image',
  }
};

interface ImageTool {
  name: string;
  desc: string;
  isImplemented: boolean;
  href: string;
  isLocal: boolean;
  badge: string;
}

export default function ImageHubPage() {
  const tools: ImageTool[] = [
    { name: 'Compress IMAGE', desc: 'Compresses JPG, PNG, SVG, and GIFs to reduce file size and save storage space.', isImplemented: true, href: '/image/workspace?tool=compress', isLocal: true, badge: 'Local' },
    { name: 'Resize IMAGE', desc: 'Allows users to define custom dimensions (by percentage or specific pixels) to resize images.', isImplemented: true, href: '/image/workspace?tool=resize', isLocal: true, badge: 'Local' },
    { name: 'Crop IMAGE', desc: 'Trims JPG, PNG, or GIFs using a visual canvas editor.', isImplemented: true, href: '/image/workspace?tool=crop', isLocal: true, badge: 'Local' },
    { name: 'Convert PNG to JPG', desc: 'Enables high fidelity client-side conversion using HTML5 Canvas API.', isImplemented: true, href: '/image/convert-png-to-jpg', isLocal: true, badge: 'Local' },
    { name: 'Convert from JPG', desc: 'Turns JPG files into PNG, SVG, or animated GIF formats.', isImplemented: true, href: '/image/workspace?tool=convert', isLocal: true, badge: 'Local' },
    { name: 'HTML to IMAGE', desc: 'Converts entire HTML webpages into JPG or SVG files by processing URL.', isImplemented: true, href: '/image/workspace?tool=html-to-image', isLocal: false, badge: 'Cloud' },
    { name: 'Photo editor', desc: 'Simplified tools to add text, custom effects, borders, frames, or stickers directly to pictures.', isImplemented: true, href: '/image/workspace?tool=edit', isLocal: true, badge: 'Local' },
    { name: 'Meme generator', desc: 'Design custom memes by adding captioned text to popular templates.', isImplemented: true, href: '/image/workspace?tool=meme', isLocal: true, badge: 'Local' },
    { name: 'Rotate IMAGE', desc: 'Rotates multiple JPG, PNG, or GIF images simultaneously.', isImplemented: true, href: '/image/workspace?tool=rotate', isLocal: true, badge: 'Local' },
    { name: 'Upscale Image', desc: 'Uses AI to enlarge JPG and PNG files to a higher resolution, boosting clarity.', isImplemented: true, href: '/image/workspace?tool=upscale', isLocal: false, badge: 'AI Cloud' },
    { name: 'Remove background', desc: 'Instantly detects primary subjects and cleanly cuts out image backgrounds.', isImplemented: true, href: '/image/workspace?tool=remove-bg', isLocal: false, badge: 'AI Cloud' },
    { name: 'Watermark IMAGE', desc: 'Stamps a text or image watermark over your pictures with opacity controls.', isImplemented: true, href: '/image/workspace?tool=watermark', isLocal: true, badge: 'Local' },
    { name: 'Blur face', desc: 'Blurs faces, license plates, and sensitive items in photos.', isImplemented: true, href: '/image/workspace?tool=blur', isLocal: true, badge: 'Local' }
  ];

  const steps = [
    'Open the PNG to JPG conversion tool.',
    'Drop or upload your PNG files.',
    'Select desired output format and rendering quality settings.',
    'Click convert to download the formatted image instantly.'
  ];

  const faqs = [
    {
      question: 'Why are images converted client-side using the Canvas API?',
      answer: 'Canvas API allows image manipulation inside the client browser. By doing this locally, conversion is instantaneous, works offline, and requires no servers.'
    },
    {
      question: 'Will transparent PNG backgrounds turn black when converting to JPG?',
      answer: 'No. Our converter automatically fills transparent areas with a solid white background color before exporting to JPG format.'
    }
  ];

  return (
    <div className="space-y-12">
      <SeoMeta
        toolName="Image Utilities Hub"
        description={metadata.description}
        url="https://multitoolplatform.example.com/image"
        steps={steps}
        faqs={faqs}
      />

      <section className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-white">Image Workspace Hub</h1>
        <p className="text-slate-400">
          Transform image files securely inside your browser. All tools in this hub run locally on your system using the HTML5 Canvas API. No image files are sent to our servers.
        </p>
      </section>

      {/* Grid of tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className={`glass-panel rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-white/10 transition-all duration-300 ${
              tool.isImplemented ? 'ring-1 ring-blue-500/10' : 'opacity-80'
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
                  {tool.badge}
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
                  className="block w-full text-center py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition duration-200 shadow-md shadow-blue-500/10"
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

      <section className="glass-panel rounded-2xl p-8 space-y-6">
        <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="space-y-2 border-b border-white/5 pb-4 last:border-0 last:pb-0">
              <h4 className="font-semibold text-blue-400">{faq.question}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
