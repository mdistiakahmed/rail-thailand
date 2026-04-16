import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://railthailand.com/sitemap.xml',
    host: 'railthailand.com',
  }
}
