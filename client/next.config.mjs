/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/admin/dashboard",
        destination: "/admin/dashboard/overview",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
