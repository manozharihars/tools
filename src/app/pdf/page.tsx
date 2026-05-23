import Link from 'next/link';
import SeoMeta from '@/components/SeoMeta';

export const metadata = {
  title: 'Secure PDF Utilities - Compress, Convert & Protect PDFs Online',
  description: 'Manage your PDF documents securely. Encrypt files client-side, convert PDFs to editable Word DOCX documents, and modify pages without server leaks.',
  openGraph: {
    title: 'Secure PDF Utilities - Compress, Convert & Protect PDFs Online',
    description: 'Manage your PDF documents securely. Encrypt files client-side, convert PDFs to editable Word DOCX documents, and modify pages without server leaks.',
    url: 'https://multitoolplatform.example.com/pdf',
  }
};

interface PdfTool {
  name: string;
  desc: string;
  isImplemented: boolean;
  href: string;
  isLocal: boolean;
  badge: string;
}

interface PdfGroup {
  title: string;
  icon: string;
  tools: PdfTool[];
}

export default function PdfHubPage() {
  const groups: PdfGroup[] = [
    {
      title: 'PDF Conversion Utilities',
      icon: '🔄',
      tools: [
        { name: 'PDF to Word', desc: 'Converts PDF files into editable DOC and DOCX documents.', isImplemented: true, href: '/pdf/convert-pdf-to-word', isLocal: false, badge: 'Cloud' },
        { name: 'PDF to PowerPoint', desc: 'Turns PDF files into editable PPT and PPTX slideshow presentations.', isImplemented: true, href: '/pdf/workspace?tool=pdf-to-ppt', isLocal: false, badge: 'Cloud' },
        { name: 'PDF to Excel', desc: 'Pulls tables and data straight from PDFs into Excel spreadsheets.', isImplemented: true, href: '/pdf/workspace?tool=pdf-to-excel', isLocal: false, badge: 'Cloud' },
        { name: 'Word to PDF', desc: 'Converts Microsoft Word files (DOC/DOCX) into PDF format.', isImplemented: true, href: '/pdf/workspace?tool=word-to-pdf', isLocal: false, badge: 'Cloud' },
        { name: 'PowerPoint to PDF', desc: 'Converts PowerPoint presentations (PPT/PPTX) into PDF format.', isImplemented: true, href: '/pdf/workspace?tool=ppt-to-pdf', isLocal: false, badge: 'Cloud' },
        { name: 'Excel to PDF', desc: 'Converts Excel spreadsheets into readable PDFs.', isImplemented: true, href: '/pdf/workspace?tool=excel-to-pdf', isLocal: false, badge: 'Cloud' },
        { name: 'PDF to JPG', desc: 'Converts each page of a PDF into a JPG image or extracts embedded images.', isImplemented: true, href: '/pdf/workspace?tool=pdf-to-jpg', isLocal: true, badge: 'Local' },
        { name: 'JPG to PDF / Image to PDF', desc: 'Converts JPG and other image formats to PDF with margin controls.', isImplemented: true, href: '/pdf/workspace?tool=jpg-to-pdf', isLocal: true, badge: 'Local' },
        { name: 'HTML to PDF', desc: 'Converts webpages into PDF files by copying and pasting URL.', isImplemented: true, href: '/pdf/workspace?tool=html-to-pdf', isLocal: false, badge: 'Cloud' },
        { name: 'PDF to PDF/A', desc: 'Transforms standard PDFs into ISO-standardized PDF/A format.', isImplemented: true, href: '/pdf/workspace?tool=pdf-to-pdfa', isLocal: false, badge: 'Cloud' }
      ]
    },
    {
      title: 'Document Org & Editing',
      icon: '📂',
      tools: [
        { name: 'Merge PDF', desc: 'Combines multiple PDF files into a single document in any order.', isImplemented: true, href: '/pdf/workspace?tool=merge', isLocal: true, badge: 'Local' },
        { name: 'Split PDF', desc: 'Separates specific pages or ranges from a document into independent PDFs.', isImplemented: true, href: '/pdf/workspace?tool=split', isLocal: true, badge: 'Local' },
        { name: 'Organize PDF', desc: 'Sort, delete, or insert new pages into an existing PDF file.', isImplemented: true, href: '/pdf/workspace?tool=organize', isLocal: true, badge: 'Local' },
        { name: 'Rotate PDF', desc: 'Rotates single or multiple PDF pages simultaneously.', isImplemented: true, href: '/pdf/workspace?tool=rotate', isLocal: true, badge: 'Local' },
        { name: 'Crop PDF', desc: 'Trims document margins or isolates specific regions.', isImplemented: true, href: '/pdf/workspace?tool=crop', isLocal: true, badge: 'Local' },
        { name: 'Edit PDF', desc: 'Inserts text, images, shapes, or annotations directly into a PDF.', isImplemented: true, href: '/pdf/workspace?tool=edit', isLocal: true, badge: 'Local' },
        { name: 'Page numbers', desc: 'Adds page numbers into a PDF with custom placement and font.', isImplemented: true, href: '/pdf/workspace?tool=page-numbers', isLocal: true, badge: 'Local' },
        { name: 'Watermark', desc: 'Stamps text or image watermark over a PDF with opacity control.', isImplemented: true, href: '/pdf/workspace?tool=watermark', isLocal: true, badge: 'Local' }
      ]
    },
    {
      title: 'Document Optimization & Security',
      icon: '🛡️',
      tools: [
        { name: 'Compress PDF', desc: 'Shrinks file size of a document while preserving highest visual quality.', isImplemented: true, href: '/pdf/workspace?tool=compress', isLocal: true, badge: 'Local' },
        { name: 'Repair PDF', desc: 'Analyzes and repairs corrupted or damaged PDF files.', isImplemented: true, href: '/pdf/workspace?tool=repair', isLocal: false, badge: 'Cloud' },
        { name: 'Sign PDF', desc: 'Electronically sign documents or send secure eSignature requests.', isImplemented: true, href: '/pdf/workspace?tool=sign', isLocal: true, badge: 'Local' },
        { name: 'Unlock PDF', desc: 'Removes password-based security restrictions from a PDF.', isImplemented: true, href: '/pdf/workspace?tool=unlock', isLocal: true, badge: 'Local' },
        { name: 'Protect PDF', desc: 'Encrypts and secures PDF files by adding a custom password.', isImplemented: true, href: '/pdf/protect-pdf-with-password', isLocal: true, badge: 'Local' },
        { name: 'Redact PDF', desc: 'Permanently blacks out and deletes sensitive text or graphics.', isImplemented: true, href: '/pdf/workspace?tool=redact', isLocal: true, badge: 'Local' }
      ]
    },
    {
      title: 'Advanced & AI-Powered Intelligence',
      icon: '🤖',
      tools: [
        { name: 'OCR PDF', desc: 'Performs Optical Character Recognition to convert scans to searchable text.', isImplemented: true, href: '/ai/workspace?tool=ocr', isLocal: false, badge: 'Cloud' },
        { name: 'Compare PDF', desc: 'Generates a side-by-side comparison of two document versions.', isImplemented: true, href: '/ai/workspace?tool=compare', isLocal: false, badge: 'Cloud' },
        { name: 'PDF Forms', desc: 'Detects form fields and creates interactive fillable PDFs.', isImplemented: true, href: '/ai/workspace?tool=forms', isLocal: true, badge: 'Local' },
        { name: 'Scan to PDF', desc: 'Capture paper documents via mobile camera scan and sync directly.', isImplemented: true, href: '/ai/workspace?tool=scan', isLocal: true, badge: 'Local' },
        { name: 'AI Summarizer', desc: 'Extracts key points and generates summaries from documents.', isImplemented: true, href: '/ai/workspace?tool=summarize', isLocal: false, badge: 'Cloud' },
        { name: 'Translate PDF', desc: 'Translates entire PDF documents while keeping layouts intact.', isImplemented: true, href: '/ai/workspace?tool=translate', isLocal: false, badge: 'Cloud' },
        { name: 'Create a Workflow', desc: 'Combines several tools into custom, automated reusable sequences.', isImplemented: true, href: '/ai/workspace?tool=workflow', isLocal: true, badge: 'Local' }
      ]
    }
  ];

  const steps = [
    'Select the specific PDF tool you require from the dashboard.',
    'Upload your document via drag-and-drop or file selector.',
    'Configure tool settings, such as passwords or conversion parameters.',
    'Click process to compute and trigger the local file download.'
  ];

  const faqs = [
    {
      question: 'Is it safe to password protect my PDF files on this website?',
      answer: 'Yes. Our PDF protection tool encrypts your files directly in your web browser using client-side JavaScript. The PDF file and your passwords are never uploaded to any server.'
    },
    {
      question: 'How does the PDF to Word converter work?',
      answer: 'Our PDF to Word converter transfers the document securely to a high-speed Python conversion microservice. This service uses pdf2docx to extract text, tables, and layouts, saving them in editable Microsoft OpenXML structures before sending them back.'
    }
  ];

  return (
    <div className="space-y-12">
      <SeoMeta
        toolName="PDF Utilities Hub"
        description={metadata.description}
        url="https://multitoolplatform.example.com/pdf"
        steps={steps}
        faqs={faqs}
      />

      <section className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-white">PDF Workspace Hub</h1>
        <p className="text-slate-400">
          Process your PDF documents safely. For security-related operations, like adding encryption passwords, your files are processed client-side. Document conversions are processed via secure microservices that delete files immediately after download.
        </p>
      </section>

      {/* Main categories container */}
      <div className="space-y-12">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
              <span className="text-2xl">{group.icon}</span>
              <h2 className="text-xl font-bold text-white tracking-wide">{group.title}</h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-mono">
                {group.tools.length} Tools
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.tools.map((tool, tIdx) => (
                <div
                  key={tIdx}
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
                        className="block w-full text-center py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition duration-200 shadow-md"
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
        ))}
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
