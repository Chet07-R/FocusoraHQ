const http = require('http');
const app = require('./src/app');
const { env } = require('./src/config/env');
const { connectDB } = require('./src/config/db');
const { initSocketServer } = require('./src/sockets');

const startServer = async () => {
    await connectDB();

    const server = http.createServer(app);
    initSocketServer(server);

    server.listen(env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on port ${env.port}`);
    });
};

startServer().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start backend:', error);
    process.exit(1);
});