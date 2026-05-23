import { Metadata } from 'next';
import AiWorkspaceClient from '@/components/AiWorkspaceClient';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const tool = searchParams.tool as string | undefined;
  const toolName = tool ? tool.replace(/-/g, ' ').toUpperCase() : 'Ai Tool';
  return {
    title: `${toolName} - CloudToolbox Workspace`,
    description: `Interactive ${toolName} processing workspace. High performance, secure, local-first.`,
  };
}

export default function AiWorkspacePage() {
  return <AiWorkspaceClient />;
}
