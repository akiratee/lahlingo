/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose environment variables to the client
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  },
};

export default nextConfig;
