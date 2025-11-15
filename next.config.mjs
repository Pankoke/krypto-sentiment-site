import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = createNextIntlPlugin({
  requestConfig: './next-intl.config.js',
})({
  reactStrictMode: true,
  async redirects() {
    const locales = ['de', 'en'];
    const detailRedirects = locales.flatMap((locale) => [
      {
        source: `/${locale}/reports/:path*`,
        destination: `/${locale}/news`,
        permanent: true,
      },
      {
        source: `/${locale}/daily/:path*`,
        destination: `/${locale}/news`,
        permanent: true,
      },
      {
        source: `/${locale}/reports`,
        destination: `/${locale}/news`,
        permanent: true,
      },
      {
        source: `/${locale}/daily`,
        destination: `/${locale}/news`,
        permanent: true,
      },
    ]);

    return [
      ...detailRedirects,
      {
        source: '/reports/:path*',
        destination: '/de/news',
        permanent: true,
      },
      {
        source: '/daily/:path*',
        destination: '/de/news',
        permanent: true,
      },
      {
        source: '/reports',
        destination: '/de/news',
        permanent: true,
      },
      {
        source: '/daily',
        destination: '/de/news',
        permanent: true,
      },
    ];
  },
});

export default nextConfig;
