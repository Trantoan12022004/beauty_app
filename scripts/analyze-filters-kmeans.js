const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function euclidean(a, b) {
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
}

function avgArray(arr) {
  const sum = arr.reduce((s, v) => [s[0]+v[0], s[1]+v[1], s[2]+v[2]], [0,0,0]);
  return [Math.round(sum[0]/arr.length), Math.round(sum[1]/arr.length), Math.round(sum[2]/arr.length)];
}

function toHex(rgb) {
  const [r,g,b] = rgb.map(v => Math.max(0, Math.min(255, Math.round(v))));
  return ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1);
}

async function extractPixels(filePath, maxSize=64) {
  const img = sharp(filePath);
  const { data, info } = await img.resize({ width: maxSize, height: maxSize, fit: 'inside' }).raw().toBuffer({ resolveWithObject: true });
  const pixels = [];
  const ch = info.channels;
  for (let i=0;i<data.length;i+=ch) {
    pixels.push([data[i], data[i+1], data[i+2]]);
  }
  return { pixels, info };
}

function kmeans(pixels, k=4, maxIter=40) {
  if (pixels.length === 0) return [];
  // init: pick k random distinct pixels
  const centroids = [];
  const used = new Set();
  while (centroids.length < k && centroids.length < pixels.length) {
    const idx = Math.floor(Math.random()*pixels.length);
    if (!used.has(idx)) { used.add(idx); centroids.push(pixels[idx].slice()); }
  }
  let labels = new Array(pixels.length).fill(-1);
  for (let iter=0; iter<maxIter; iter++) {
    let changed = false;
    // assign
    for (let i=0;i<pixels.length;i++) {
      let best = -1, bestDist = Infinity;
      for (let c=0;c<centroids.length;c++) {
        const d = euclidean(pixels[i], centroids[c]);
        if (d < bestDist) { bestDist = d; best = c; }
      }
      if (labels[i] !== best) { labels[i] = best; changed = true; }
    }
    // recompute
    const groups = Array.from({length: centroids.length}, () => []);
    for (let i=0;i<pixels.length;i++) groups[labels[i]].push(pixels[i]);
    for (let c=0;c<centroids.length;c++) {
      if (groups[c].length > 0) centroids[c] = avgArray(groups[c]);
    }
    if (!changed) break;
  }
  // compute counts
  const counts = Array(centroids.length).fill(0);
  for (let l of labels) counts[l]++;
  const result = centroids.map((centroid, idx) => ({
    rgb: centroid,
    hex: toHex(centroid),
    count: counts[idx],
  }));
  // sort by count desc
  result.sort((a,b) => b.count - a.count);
  return result;
}

(async () => {
  try {
    const dir = path.join(__dirname, '..', 'assets', 'filter');
    const files = fs.readdirSync(dir).filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));
    const out = {};
    for (const file of files) {
      const filePath = path.join(dir, file);
      const { pixels, info } = await extractPixels(filePath, 64);
      const avg = [0,0,0];
      for (const p of pixels) { avg[0]+=p[0]; avg[1]+=p[1]; avg[2]+=p[2]; }
      const pxCount = pixels.length || 1;
      const avgRgb = [Math.round(avg[0]/pxCount), Math.round(avg[1]/pxCount), Math.round(avg[2]/pxCount)];
      const clusters = kmeans(pixels, 4, 60);
      const top = clusters.map(c => ({ r: c.rgb[0], g: c.rgb[1], b: c.rgb[2], hex: c.hex, count: c.count, percent: +(c.count/pxCount).toFixed(4) }));
      out[file] = { file, width: info.width, height: info.height, avg: { r: avgRgb[0], g: avgRgb[1], b: avgRgb[2] }, topColors: top };
    }
    const outPath = path.join(__dirname, '..', 'assets', 'filter', 'filters-analysis-kmeans.json');
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
    console.log('Wrote', outPath);
    console.log(Object.keys(out));
  } catch (err) { console.error(err); process.exit(1); }
})();
