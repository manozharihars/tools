const fs = require('fs');

const files = [
  'src/app/ai/workspace/page.tsx',
  'src/app/converters/workspace/page.tsx',
  'src/app/image/workspace/page.tsx',
  'src/app/pdf/workspace/page.tsx'
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf-8');
  let name = '';
  if (content.includes('export default function AiWorkspace()')) name = 'AiWorkspace';
  else if (content.includes('export default function ConvertersWorkspace()')) name = 'ConvertersWorkspace';
  else if (content.includes('export default function ImageWorkspace()')) name = 'ImageWorkspace';
  else if (content.includes('export default function PdfWorkspace()')) name = 'PdfWorkspace';
  
  if (name) {
    content = content.replace(`export default function ${name}()`, `function ${name}Content()`);
    // Check if React is imported
    if (!content.includes('import React')) {
        content = `import React from 'react';\n` + content;
    }
    content += `\n\nexport default function ${name}() {\n  return (\n    <React.Suspense fallback={<div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-8">Loading workspace...</div>}>\n      <${name}Content />\n    </React.Suspense>\n  );\n}\n`;
    fs.writeFileSync(f, content, 'utf-8');
    console.log(`Updated ${f}`);
  }
}
