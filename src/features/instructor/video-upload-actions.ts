'use server';

import type { ActionResult } from './types';

interface BunnyVideoUploadResult {
  videoId: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

/**
 * Upload video to Bunny.net Stream
 * Requires environment variables:
 * - BUNNY_NET_API_KEY
 * - BUNNY_NET_LIBRARY_ID
 */
export async function uploadVideoToBunny(
  file: File,
  title?: string
): Promise<ActionResult<BunnyVideoUploadResult>> {
  const apiKey = process.env.BUNNY_NET_API_KEY;
  const libraryId = process.env.BUNNY_NET_LIBRARY_ID;

  if (!apiKey || !libraryId) {
    return {
      success: false,
      error: 'Bunny.net API credentials not configured',
    };
  }

  try {
    // Step 1: Create video in Bunny.net library
    const createResponse = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      {
        method: 'POST',
        headers: {
          AccessKey: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || `Video ${Date.now()}`,
        }),
      }
    );

    if (!createResponse.ok) {
      const error = await createResponse.text();
      return {
        success: false,
        error: `Failed to create video: ${error}`,
      };
    }

    const videoData = await createResponse.json();
    const videoId = videoData.guid || videoData.videoId;

    if (!videoId) {
      return {
        success: false,
        error: 'Failed to get video ID from Bunny.net',
      };
    }

    // Step 2: Upload video file
    const uploadResponse = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      {
        method: 'PUT',
        headers: {
          AccessKey: apiKey,
        },
        body: file,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      // Try to delete the created video
      await fetch(
        `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
        {
          method: 'DELETE',
          headers: {
            AccessKey: apiKey,
          },
        }
      );
      return {
        success: false,
        error: `Failed to upload video: ${error}`,
      };
    }

    // Step 3: Get video URL (wait a bit for processing)
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hostname =
      process.env.BUNNY_STREAM_HOSTNAME || 'vz-6e836a43-a1c.b-cdn.net';
    const videoUrl = `https://${hostname}/${videoId}/play_720p.mp4`;
    return {
      success: true,
      data: {
        videoId,
        videoUrl,
      },
    };
  } catch (error: any) {
    console.error('Bunny.net upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload video',
    };
  }
}

/**
 * Get upload URL for direct client-side upload (alternative approach)
 */
export async function getBunnyUploadUrl(
  fileName: string,
  fileSize: number
): Promise<ActionResult<{ uploadUrl: string; videoId: string }>> {
  const apiKey = process.env.BUNNY_NET_API_KEY;
  const libraryId = process.env.BUNNY_NET_LIBRARY_ID;

  if (!apiKey || !libraryId) {
    return {
      success: false,
      error: 'Bunny.net API credentials not configured',
    };
  }

  try {
    // Create video first
    const createResponse = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      {
        method: 'POST',
        headers: {
          AccessKey: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: fileName,
        }),
      }
    );

    if (!createResponse.ok) {
      const error = await createResponse.text();
      return {
        success: false,
        error: `Failed to create video: ${error}`,
      };
    }

    const videoData = await createResponse.json();
    const videoId = videoData.guid || videoData.videoId;

    // Return upload URL
    const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;

    return {
      success: true,
      data: {
        uploadUrl,
        videoId,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get upload URL',
    };
  }
}
