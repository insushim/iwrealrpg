import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve, normalize } from 'node:path';

import type Connection from './connection';
import type SocketHandler from './sockethandler';
import type { HttpRequest, HttpResponse } from 'uws';

let mimeTypes: { [key: string]: string } = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.wav': 'audio/wav',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
    '.map': 'application/json',
    '.wasm': 'application/wasm',
    '.br': 'application/octet-stream',
    '.gz': 'application/gzip'
};

export default abstract class WebSocket {
    public addCallback?: (connection: Connection) => void;
    public initializedCallback?: () => void;

    private clientDist: string;

    protected constructor(
        protected host: string,
        protected port: number,
        protected socketHandler: SocketHandler
    ) {
        this.clientDist = resolve(process.cwd(), '..', 'client', 'dist');
    }

    /**
     * Serves static client files or returns a fallback response.
     */

    public httpResponse(response: HttpResponse, request: HttpRequest): void {
        let url = request.getUrl();

        if (url === '/' || url === '') url = '/index.html';

        try {
            url = decodeURIComponent(url);
        } catch {
            response.writeStatus('400 Bad Request').end('Bad Request');
            return;
        }

        let filePath = normalize(join(this.clientDist, url));

        // Prevent path traversal
        if (!filePath.startsWith(this.clientDist)) {
            response.writeStatus('403 Forbidden').end('Forbidden');
            return;
        }

        try {
            if (existsSync(filePath) && statSync(filePath).isFile()) {
                let content = readFileSync(filePath),
                    ext = extname(filePath).toLowerCase(),
                    mime = mimeTypes[ext] || 'application/octet-stream';

                response.writeHeader('Content-Type', mime);
                response.writeHeader(
                    'Cache-Control',
                    ext === '.html' ? 'no-cache' : 'public, max-age=86400'
                );
                response.end(content);
                return;
            }
        } catch {
            // Fall through to SPA fallback
        }

        // SPA fallback
        let indexPath = join(this.clientDist, 'index.html');

        try {
            if (existsSync(indexPath)) {
                let content = readFileSync(indexPath);

                response.writeHeader('Content-Type', 'text/html; charset=utf-8');
                response.end(content);
                return;
            }
        } catch {
            // No client dist
        }

        response.end('WordQuest Online Server');
    }

    /**
     * Callback for when a connection is added.
     * @param callback Contains the connection that was just added.
     */

    public onAdd(callback: (connection: Connection) => void): void {
        this.addCallback = callback;
    }

    /**
     * Callback for when the web socket has finished initializing.
     */

    public onInitialize(callback: () => void): void {
        this.initializedCallback = callback;
    }
}
