import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Asset Streaming Route Handler for Next.js
 * Serves 3D FBX files and textures directly from the workspace Assets folder
 * without duplicating, moving, or modifying the original files.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const rawPath = params.path ? params.path.join('/') : '';
    const decodedPath = decodeURIComponent(rawPath);
    const filePath = path.join(process.cwd(), 'Assets', decodedPath);

    // Prevent directory traversal
    if (!filePath.startsWith(path.join(process.cwd(), 'Assets'))) {
      return new NextResponse('Access denied', { status: 403 });
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return new NextResponse('Asset not found', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);

    // Set appropriate content type
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.png')) contentType = 'image/png';
    else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (filePath.endsWith('.glb')) contentType = 'model/gltf-binary';
    else if (filePath.endsWith('.gltf')) contentType = 'model/gltf+json';

    return new NextResponse(fileStream as unknown as ReadableStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('[Asset Streamer] Error streaming asset:', error);
    return new NextResponse('Internal server error streaming asset', { status: 500 });
  }
}

