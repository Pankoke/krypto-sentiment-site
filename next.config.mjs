import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = createNextIntlPlugin({
  requestConfig: './next-intl.config.js',
})({
  reactStrictMode: true,
});

export default nextConfig;
