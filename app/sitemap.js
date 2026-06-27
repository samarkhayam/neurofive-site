export default function sitemap() {
  const baseUrl = 'https://neurofivesolutions.com'
  const routes = ['', '/about', '/tracks', '/apply', '/faq', '/contact', '/get-certificate']

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}
