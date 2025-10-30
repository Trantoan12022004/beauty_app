const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'assets', 'filter');
const filtersPath = path.join(basePath, 'filters.json');
const analysisPath = path.join(basePath, 'filters-analysis-kmeans.json');
const outPath = path.join(basePath, 'filters.auto.json');

function computeColorShiftFromAvg(avg, scale = 0.08) {
  // avg: {r,g,b}
  const r = (avg.r / 255 - 0.5) * scale;
  const g = (avg.g / 255 - 0.5) * scale;
  const b = (avg.b / 255 - 0.5) * scale;
  return [Number(r.toFixed(3)), Number(g.toFixed(3)), Number(b.toFixed(3))];
}

function fileForId(id) {
  // map id like 'black-white' to 'img_filter_black_white.webp'
  return `img_filter_${id.replace(/-/g, '_')}.webp`;
}

(function main(){
  if (!fs.existsSync(filtersPath)) return console.error('filters.json not found');
  if (!fs.existsSync(analysisPath)) return console.error('analysis file not found');
  const filters = JSON.parse(fs.readFileSync(filtersPath,'utf8'));
  const analysis = JSON.parse(fs.readFileSync(analysisPath,'utf8'));

  const autoColorMap = {
    tint: { scale: 0.08 },
    temperature: { scale: 0.06 },
    'cross-process': { scale: 0.05 },
    'due-tone': { scale: 0.06 },
  };

  const out = filters.map(f => {
    const copy = JSON.parse(JSON.stringify(f));
    // if filter id is in autoColorMap, compute colorShift from analysis
    if (autoColorMap[f.id]) {
      const imgFile = fileForId(f.id);
      const analysisEntry = analysis[imgFile];
      if (analysisEntry && analysisEntry.avg) {
        const shift = computeColorShiftFromAvg(analysisEntry.avg, autoColorMap[f.id].scale);
        // replace or append colorShift op
        const ops = copy.ops || [];
        const idx = ops.findIndex(op => op[0] === 'colorShift');
        if (idx >= 0) ops[idx] = ['colorShift', ...shift];
        else ops.push(['colorShift', ...shift]);
        copy.ops = ops;
      }
    }
    // add overlays for grain and vignette
    if (f.id === 'grain') {
      copy.overlay = { file: 'img_filter_grain.webp', opacity: 0.12 };
    }
    if (f.id === 'vignette') {
      copy.overlay = { file: 'img_filter_vignette.webp', opacity: 0.24 };
    }
    return copy;
  });

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', outPath);
})();
