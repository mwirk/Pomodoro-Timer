/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /\.(mp3|wav)$/,
        type: 'asset/resource',
      });
      return config;
    },
  };
  

export default nextConfig;
