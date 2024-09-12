import * as fs from "fs";
import * as path from "path";
import { FastifyReply, FastifyRequest } from "fastify";

export async function GetStaticData(request: FastifyRequest<{ Params: { '*': string } }>, reply: FastifyReply) {
    
    let paramPath = request.params['*'] || '';

    // Ensure the requested path is within the base path
    if (paramPath.startsWith('/')) {
        reply.status(403).send('Access denied: Outside of allowed directory');
        return;
    }
    
    const fullPath = path.resolve(process.cwd(), 'data', request.params['*']);
        try {
            const stats = await fs.promises.stat(fullPath);
            if (stats.isDirectory()) {
                // If it's a directory return a list of files
                const files = await fs.promises.readdir(fullPath);
                reply.status(200).send({
                    msg: "ok",
                    type: "folder",
                    data: files,
                    snapshotTime: stats.mtime,
                });
            } else {

                const ext = path.extname(fullPath).toLowerCase();
                if (ext !== '.json' && ext !== '.txt') {
                    reply.status(403).send('Access denied: Only .json and .txt files are allowed');
                    return;
                }

                // If it's a file read and send its contents
                const data = await fs.promises.readFile(fullPath, 'utf8');
                if (path.extname(fullPath) === '.json') {
                    const jsonData = JSON.parse(data);
                    reply.status(200).send({
                        msg: "ok",
                        type: "file",
                        data: jsonData,
                        snapshotTime: stats.mtime,
                    });
                } else {
                    reply.status(200).send({
                        msg: "ok",
                        type: "file",
                        data: data,
                        snapshotTime: stats.mtime,
                    });
                }
            }

        } catch (err) {
            if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
                reply.status(404).send('File or directory not found');
            } else if (err instanceof SyntaxError) {
                reply.status(500).send('Error parsing JSON');
            } else {
                reply.status(500).send('Server error');
        }
    }
}