import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'All Tools - CloudToolbox',
  description: 'Explore the complete suite of CloudToolbox file processing tools including PDF Converters, Image Optimizers, and Video utilities.',
  openGraph: {
    title: 'All Tools - CloudToolbox',
    description: 'Explore the complete suite of CloudToolbox file processing tools including PDF Converters, Image Optimizers, and Video utilities.',
    url: 'https://multitoolplatform.example.com/',
  }
};

export default function HomePage() {
  return <HomeClient />;
}
