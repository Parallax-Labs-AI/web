(() => {
  const canvas = document.getElementById('space-flight');
  const toggle = document.getElementById('space-flight-toggle');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sprite = document.createElement('canvas');
  sprite.width = 252;
  sprite.height = 84;
  const spriteCtx = sprite.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const flightAngle = -Math.PI / 9;
  const trailSlope = Math.tan(-flightAngle);
  const stars = [
    { count: 45, speed: 30, length: 2, trail: '#1c2948', head: '#576990' },
    { count: 22, speed: 90, length: 8, trail: '#2d4479', head: '#9bb9f8' },
    { count: 12, speed: 200, length: 25, trail: '#344e9a', head: '#deebff' },
  ].flatMap(layer => Array.from({ length: layer.count }, () => ({
    ...layer,
    x: Math.random() * (width + layer.length),
    y: Math.random() * height,
    speed: layer.speed * (0.8 + Math.random() * 0.4),
  })));

  const sky = ctx.createLinearGradient(0, 0, width, height);
  sky.addColorStop(0, '#02040e');
  sky.addColorStop(0.56, '#080f24');
  sky.addColorStop(1, '#03091b');

  // A three-by-five bitmap font keeps the lettering sharp with the sprite.
  const glyphs = {
    P: ['110', '101', '110', '100', '100'],
    A: ['010', '101', '111', '101', '101'],
    R: ['110', '101', '110', '101', '101'],
    L: ['100', '100', '100', '100', '111'],
    X: ['101', '101', '010', '101', '101'],
    2: ['110', '001', '010', '100', '111'],
    '.': ['000', '000', '000', '000', '010'],
    1: ['010', '110', '010', '010', '111'],
  };

  function drawBlocks(color, blocks) {
    spriteCtx.fillStyle = color;
    for (const block of blocks) spriteCtx.fillRect(...block);
  }

  function drawLabel() {
    spriteCtx.fillStyle = '#f1f5ff';
    Array.from('PARALLAX 2.1').forEach((letter, index) => {
      glyphs[letter]?.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          if (row[x] === '1') spriteCtx.fillRect(30 + index * 8 + x * 2, 26 + y * 2, 2, 2);
        }
      });
    });
  }

  function drawThruster(y, time, phase) {
    const length = 63 + Math.round(Math.sin(time * 39 + phase) * 8);
    drawBlocks('#1a357b', [[-length - 8, y - 1, length + 15, 2], [-length, y - 3, length + 10, 6]]);
    drawBlocks('#3f7bff', [[-length + 9, y - 2, length - 2, 4], [-28, y - 5, 37, 10]]);
    drawBlocks('#77d9ff', [[-length + 18, y - 1, length - 11, 3], [-13, y - 3, 21, 6]]);
    drawBlocks('#fff0b3', [[-26, y, 35, 2], [-8, y - 2, 19, 4]]);
    drawBlocks('#badcff', [[-47, y - 1, 2, 3], [-35, y - 2, 2, 5], [-21, y - 2, 2, 5]]);

    spriteCtx.fillStyle = '#91bdff';
    for (let spark = 0; spark < 5; spark++) {
      const distance = (time * 164 + spark * 15 + phase * 7) % 79;
      const drift = Math.round((spark - 2) * distance / 36);
      spriteCtx.fillRect(-Math.round(distance) - 7, y + drift, 2 + spark % 2, 1);
    }
  }

  function drawRocket(time) {
    spriteCtx.clearRect(0, 0, sprite.width, sprite.height);
    spriteCtx.save();
    spriteCtx.translate(96, 10);
    drawThruster(21, time, 0);
    drawThruster(41, time, 2.4);

    // Stepped wings, twin engine housings, and the main fuselage.
    drawBlocks('#192550', [[12, -3, 14, 22], [21, 3, 18, 17], [32, 8, 28, 15], [12, 43, 15, 22], [24, 41, 24, 17], [34, 40, 29, 10]]);
    drawBlocks('#4666bf', [[15, -1, 9, 16], [23, 5, 14, 12], [33, 10, 16, 8], [15, 50, 10, 13], [24, 48, 12, 8], [35, 44, 12, 7]]);
    drawBlocks('#7e9beb', [[16, -1, 7, 2], [24, 5, 11, 2], [35, 10, 11, 2], [16, 59, 8, 2], [25, 54, 9, 2]]);
    drawBlocks('#f3cf7c', [[13, 0, 4, 2], [13, 60, 4, 2], [28, 8, 3, 2], [28, 50, 3, 2]]);
    drawBlocks('#253963', [[5, 15, 23, 12], [5, 35, 23, 12], [11, 12, 18, 38]]);
    drawBlocks('#8eabd9', [[6, 16, 4, 10], [6, 36, 4, 10], [13, 14, 12, 5], [13, 37, 12, 5]]);
    drawBlocks('#b5c7e4', [[7, 17, 2, 8], [7, 37, 2, 8], [13, 20, 9, 2], [13, 42, 9, 2]]);
    drawBlocks('#131f45', [[11, 16, 2, 10], [11, 36, 2, 10], [16, 15, 2, 3], [21, 15, 2, 3], [16, 38, 2, 3], [21, 38, 2, 3]]);
    drawBlocks('#7894ca', [[22, 23, 118, 17], [28, 18, 106, 26], [44, 13, 79, 35], [72, 10, 38, 41], [137, 27, 8, 9], [144, 30, 4, 4]]);
    drawBlocks('#e6effa', [[23, 22, 111, 15], [30, 17, 101, 15], [46, 13, 76, 13], [73, 11, 36, 3], [134, 26, 7, 9]]);
    drawBlocks('#344f97', [[23, 35, 107, 6], [48, 42, 68, 3], [69, 46, 41, 3]]);
    drawBlocks('#20376e', [[26, 24, 102, 14]]);
    // Cockpit glazing, vents, fasteners and service panels.
    drawBlocks('#a4bade', [[42, 18, 17, 4], [63, 16, 12, 5], [81, 15, 7, 7], [91, 14, 26, 9], [56, 39, 27, 3], [89, 41, 15, 3]]);
    drawBlocks('#203665', [[93, 15, 22, 7], [96, 13, 14, 2], [82, 17, 2, 4], [86, 17, 1, 4], [60, 40, 3, 2], [65, 40, 3, 2], [70, 40, 3, 2], [75, 40, 3, 2]]);
    drawBlocks('#6498dc', [[94, 16, 8, 4], [104, 16, 9, 4], [62, 19, 13, 2], [48, 19, 1, 2], [52, 19, 1, 2], [56, 19, 1, 2]]);
    drawBlocks('#cbf3ff', [[95, 16, 5, 1], [105, 16, 6, 1], [101, 17, 1, 2], [112, 17, 1, 2]]);
    drawBlocks('#dce7f7', [[46, 14, 2, 2], [121, 16, 2, 2], [28, 38, 2, 2], [125, 38, 2, 2], [108, 45, 2, 2]]);
    drawBlocks('#f3cf7c', [[130, 22, 3, 16], [136, 26, 3, 10], [143, 29, 3, 5], [73, 11, 16, 2], [45, 43, 16, 2]]);
    drawLabel();
    spriteCtx.restore();

    ctx.save();
    ctx.translate(161 + Math.round(Math.sin(time * 1.7) * 7), 86 + Math.round(Math.cos(time * 2.2) * 5));
    ctx.rotate(flightAngle);
    ctx.drawImage(sprite, -166, -41);
    ctx.restore();
  }

  function draw(time) {
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    for (const star of stars) {
      const span = width + star.length;
      const x = Math.floor((star.x - time * star.speed % span + span) % span);
      const y = Math.floor((star.y + time * star.speed * trailSlope) % height);
      ctx.fillStyle = star.trail;
      for (let step = 0; step < star.length; step += 3) {
        ctx.fillRect(x + step, y - Math.round(step * trailSlope), Math.min(3, star.length - step), 1);
      }
      ctx.fillStyle = star.head;
      ctx.fillRect(x, y, 1, 1);
    }

    // Oversized stars echo the four-point glint in the Parallax logo.
    for (const [startX, startY, speed] of [[198, 39, 38], [54, 124, 52], [258, 130, 61]]) {
      const x = Math.floor((startX - time * speed % width + width) % width);
      const y = Math.floor((startY + time * speed * trailSlope) % height);
      ctx.fillStyle = '#6e8bcc';
      ctx.fillRect(x - 4, y, 9, 1);
      ctx.fillRect(x, y - 5, 1, 11);
      ctx.fillStyle = '#f6eac3';
      ctx.fillRect(x - 1, y, 3, 1);
      ctx.fillRect(x, y - 2, 1, 5);
    }
    drawRocket(time);
  }

  let elapsed = 0;
  let lastFrame = null;
  let frame = 0;
  let playing = false;

  function animate(now) {
    if (lastFrame !== null) elapsed += Math.min(now - lastFrame, 40) / 1000;
    lastFrame = now;
    draw(elapsed);
    frame = requestAnimationFrame(animate);
  }

  function setPlaying(next) {
    if (playing === next) return;
    playing = next;
    toggle.textContent = playing ? 'Pause animation' : 'Play animation';
    lastFrame = null;
    if (playing) frame = requestAnimationFrame(animate);
    else cancelAnimationFrame(frame);
  }

  draw(0);
  toggle.textContent = 'Play animation';
  toggle.hidden = false;
  toggle.addEventListener('click', () => setPlaying(!playing));
  motion.addEventListener('change', event => setPlaying(!event.matches));
  setPlaying(!motion.matches);
})();
