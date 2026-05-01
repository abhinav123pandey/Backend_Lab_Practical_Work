const http = require('http');
const fs = require('fs');
const os = require('os');

const PORT = 3000;
const LOG_FILE = 'visitors.log';
const BACKUP_FILE = 'backup.log';
let i = 1;

const server = http.createServer((req, res) => {

    // GET /updateUser
    if (req.method === 'GET' && req.url === '/updateUser') {
        const timestamp = new Date().toISOString() + '\n';

        fs.appendFile(LOG_FILE, "User "+i+ ": "+timestamp, (err) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error writing to file');
            }
            res.end('User visit logged');
            i++;
        });
    }

    // GET /saveLog
    else if (req.method === 'GET' && req.url === '/saveLog') {
        fs.readFile(LOG_FILE, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error reading file');
            }
            res.end(data);
        });
    }

    // POST /backup
    else if (req.method === 'POST' && req.url === '/backup') {
        fs.copyFile(LOG_FILE, BACKUP_FILE, (err) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error creating backup');
            }
            res.end('Backup created successfully');
        });
    }

    // GET /clearLog
    else if (req.method === 'GET' && req.url === '/clearLog') {
        fs.writeFile(LOG_FILE, '', (err) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error clearing log');
            }
            res.end('Log cleared');
             i = 1;
        });
    }

    // GET /serverInfo
    else if (req.method === 'GET' && req.url === '/serverInfo') {
        const info = {
            platform: os.platform(),
            cpuCores: os.cpus().length,
            freeMemory: os.freemem(),
            totalMemory: os.totalmem(),
            uptime: os.uptime()
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(info));
    }

    else if(req.url === '/'){
        res.end("Backend is Connected!")
    }
    
    else {
        res.writeHead(404);
        res.end('Route not found');
    }
});

server.listen(PORT, () => {
    console.log("Server is running on port 3000!");
});