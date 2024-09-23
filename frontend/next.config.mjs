const nextConfig = {
    async rewrites() {
        return [
            {
            source: "/api/:path*/",
            destination: `http://localhost:4000/api/:path*/`,
            },
        ];
    },
    
    trailingSlash: true,
};

export default nextConfig;
