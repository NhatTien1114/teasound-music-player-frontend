/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'i.pinimg.com',
            port: '',
            pathname: '/**',
        }, {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/**',
        }, {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**',
        }, {
            protocol: 'https',
            hostname: 'utfs.io',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'oq8co41zyz.ufs.sh',
            port: '',
            pathname: '/**',
        }, {
            protocol: 'http',
            hostname: 'localhost',
            port: '8080',
            pathname: '/**',
        }, ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8080/api/:path*',
            },
        ];
    },
};

export default nextConfig;