/** @type {import('next').NextConfig} */
const nextConfig = {
  /** LAN / device testing — allow dev server when opened via this host */
  allowedDevOrigins: ["192.168.1.204"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
