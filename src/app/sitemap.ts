import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://multitoolplatform.example.com';
  
  const routes = [
    '',
    '/pdf',
    '/pdf/convert-pdf-to-word',
    '/pdf/protect-pdf-with-password',
    '/pdf/workspace',
    '/image',
    '/image/convert-png-to-jpg',
    '/image/workspace',
    '/video/convert-video-to-gif',
    '/ai/workspace',
    '/converters/workspace',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}
