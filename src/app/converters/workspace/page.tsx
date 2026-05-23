import { Metadata } from 'next';
import ConvertersWorkspaceClient from '@/components/ConvertersWorkspaceClient';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const tool = searchParams.tool as string | undefined;
  const toolName = tool ? tool.replace(/-/g, ' ').toUpperCase() : 'Converters Tool';
  return {
    title: `${toolName} - CloudToolbox Workspace`,
    description: `Interactive ${toolName} processing workspace. High performance, secure, local-first.`,
  };
}

export default function ConvertersWorkspacePage() {
  return <ConvertersWorkspaceClient />;
}
