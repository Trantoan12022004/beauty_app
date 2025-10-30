const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    const dir = path.join(__dirname, '..', 'assets', 'filter');
    const files = fs.readdirSync(dir).filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));
    const out = {};

    for (const file of files) {
      const filePath = path.join(dir, file);
      const img = sharp(filePath);
      const meta = await img.metadata();
      // resize to a small size to speed up and reduce noise
      const target = 64;
      const { data, info } = await img.resize(target, target, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true });
      const channels = info.channels; // usually 3 or 4
      const pxCount = info.width * info.height;

      let rSum = 0, gSum = 0, bSum = 0;
      const buckets = new Map();

      for (let i = 0; i < data.length; i += channels) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        rSum += r; gSum += g; bSum += b;

        // quantize into 8 levels per channel (512 buckets)
        const rb = Math.floor(r / 32);
        const gb = Math.floor(g / 32);
        const bb = Math.floor(b / 32);
        const key = (rb << 16) | (gb << 8) | bb;
        buckets.set(key, (buckets.get(key) || 0) + 1);
      }

      const avg = {
        r: Math.round(rSum / pxCount),
        g: Math.round(gSum / pxCount),
        b: Math.round(bSum / pxCount),
      };

      // find top 4 buckets
      const sorted = Array.from(buckets.entries()).sort((a,b) => b[1] - a[1]);
      const top = sorted.slice(0, 4).map(([key, count]) => {
        const rb = (key >> 16) & 0xff;
        const gb = (key >> 8) & 0xff;
        const bb = key & 0xff;
        // convert bucket index back to approx color center
        const r = Math.min(255, rb * 32 + 16);
        const g = Math.min(255, gb * 32 + 16);
        const b = Math.min(255, bb * 32 + 16);
        const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return { r, g, b, hex, count, percent: +(count / pxCount).toFixed(4) };
      });

      out[file] = {
        file,
        width: info.width,
        height: info.height,
        avg,
        topColors: top,
        meta
      };
    }

    const outPath = path.join(__dirname, '..', 'assets', 'filter', 'filters-analysis.json');
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
    console.log('Analysis written to', outPath);
    console.log(JSON.stringify(out, null, 2));
  } catch (err) {
    console.error('Error analyzing filters:', err);
    process.exit(1);
  }
})();
