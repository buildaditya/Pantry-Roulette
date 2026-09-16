const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Standard CRC32 implementation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function generatePng(width, height, drawPixel) {
  // 1 byte filter (0 = None) per scanline + width * 4 bytes
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA (6)
  ihdrData[10] = 0; // Compression method
  ihdrData[11] = 0; // Filter method
  ihdrData[12] = 0; // Interlace method

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw brand icon: Forest green (#2D5A43: 45, 90, 67) rounded rect with cream skillet and terracotta accent
function drawBrandIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background
  const forestR = 45, forestG = 90, forestB = 67;
  const forestDarkR = 30, forestDarkG = 63, forestDarkB = 46;
  const tY = y / h;
  const bgR = Math.round(forestR * (1 - tY * 0.3) + forestDarkR * (tY * 0.3));
  const bgG = Math.round(forestG * (1 - tY * 0.3) + forestDarkG * (tY * 0.3));
  const bgB = Math.round(forestB * (1 - tY * 0.3) + forestDarkB * (tY * 0.3));

  if (!isMaskable) {
    // Rounded squircle / rounded rect corner check
    const r = w * 0.22;
    const clampedX = Math.max(r, Math.min(w - r, x));
    const clampedY = Math.max(r, Math.min(h - r, y));
    const cdx = x - clampedX;
    const cdy = y - clampedY;
    if (cdx * cdx + cdy * cdy > r * r) {
      return [0, 0, 0, 0]; // Transparent outside rounded corner
    }
  }

  // Inner Skillet / Pan
  const scale = isMaskable ? 0.72 : 0.82;
  const skilletRadius = (w * 0.32) * scale;
  const skilletInnerRadius = (w * 0.28) * scale;

  // Handle (angled down-right)
  const handleAngle = Math.PI * 0.23;
  const handleDistMin = skilletRadius * 0.9;
  const handleDistMax = skilletRadius * 1.65;
  const angle = Math.atan2(dy, dx);
  const angleDiff = Math.abs(angle - handleAngle);
  if (dist >= handleDistMin && dist <= handleDistMax && angleDiff < 0.12) {
    // Terracotta handle (#D96B43: 217, 107, 67)
    return [217, 107, 67, 255];
  }

  // Skillet Outer Rim
  if (dist <= skilletRadius && dist >= skilletInnerRadius) {
    return [232, 226, 217, 255]; // Sand border #E8E2D9
  }

  // Skillet Cooking Surface
  if (dist < skilletInnerRadius) {
    // Inside pan: warm cream #FAF7F2 (250, 247, 242)
    // Leaf / Sprout center check
    const leafDy = dy + (skilletInnerRadius * 0.15);
    const leafDist = Math.sqrt(dx * dx + leafDy * leafDy);
    if (leafDist < skilletInnerRadius * 0.42 && Math.abs(dx) < (skilletInnerRadius * 0.28 - Math.abs(leafDy) * 0.4)) {
      // Botanical sprout green
      return [45, 90, 67, 255];
    }
    // Chef Sparkle (Terracotta)
    if (Math.abs(dx + skilletInnerRadius * 0.35) + Math.abs(dy - skilletInnerRadius * 0.2) < skilletInnerRadius * 0.18) {
      return [217, 107, 67, 255];
    }
    return [250, 247, 242, 255];
  }

  // Dotted Ring Accent around skillet
  const ringDist = skilletRadius * 1.25;
  if (Math.abs(dist - ringDist) < (w * 0.008)) {
    const dotMod = Math.sin(angle * 12);
    if (dotMod > 0.3) {
      return [163, 184, 153, 200]; // Sage #A3B899
    }
  }

  return [bgR, bgG, bgB, 255];
}

const outDir = path.resolve(__dirname, '../public');

console.log('Generating PNG icons in:', outDir);
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), generatePng(192, 192, (x, y, w, h) => drawBrandIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), generatePng(512, 512, (x, y, w, h) => drawBrandIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, (x, y, w, h) => drawBrandIcon(x, y, w, h, true)));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), generatePng(180, 180, (x, y, w, h) => drawBrandIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(outDir, 'favicon.ico'), generatePng(32, 32, (x, y, w, h) => drawBrandIcon(x, y, w, h, false)));

console.log('All PWA PNG icons generated successfully!');
