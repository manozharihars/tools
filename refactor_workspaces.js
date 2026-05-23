const fs = require('fs');

const workspaces = [
  { dir: 'pdf', name: 'PdfWorkspace' },
  { dir: 'image', name: 'ImageWorkspace' },
  { dir: 'converters', name: 'ConvertersWorkspace' },
  { dir: 'ai', name: 'AiWorkspace' }
];

for (const w of workspaces) {
  const pagePath = `src/app/${w.dir}/workspace/page.tsx`;
  const clientPath = `src/components/${w.name}Client.tsx`;

  // 1. Copy page.tsx to client component
  let content = fs.readFileSync(pagePath, 'utf-8');
  
  // Replace the export added by the suspense script
  content = content.replace(new RegExp(`export default function ${w.name}\\(\\) \\{`, 'g'), `export default function ${w.name}Client() {`);
  
  fs.writeFileSync(clientPath, content, 'utf-8');

  // 2. Create new page.tsx Server Component
  const newPageContent = `import { Metadata } from 'next';
import ${w.name}Client from '@/components/${w.name}Client';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const tool = searchParams.tool as string | undefined;
  const toolName = tool ? tool.replace(/-/g, ' ').toUpperCase() : '${w.name.replace('Workspace', '')} Tool';
  return {
    title: \`\${toolName} - CloudToolbox Workspace\`,
    description: \`Interactive \${toolName} processing workspace. High performance, secure, local-first.\`,
  };
}

export default function ${w.name}Page() {
  return <${w.name}Client />;
}
`;
  fs.writeFileSync(pagePath, newPageContent, 'utf-8');
  console.log(`Refactored ${w.name}`);
}
