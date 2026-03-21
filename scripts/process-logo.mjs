import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('public/icons', { recursive: true });

const input = 'public/images/dld-logo.png';

// Favicon sizes
await sharp(input)
  .resize(32, 32, {
    fit: 'contain',
    background: { r:0,g:0,b:0,alpha:0 }
  })
  .png()
  .toFile('public/icons/favicon-32.png');

await sharp(input)
  .resize(16, 16, {
    fit: 'contain',
    background: { r:0,g:0,b:0,alpha:0 }
  })
  .png()
  .toFile('public/icons/favicon-16.png');

// Apple touch icon
await sharp(input)
  .resize(180, 180, {
    fit: 'contain',
    background: { r:0,g:0,b:0,alpha:0 }
  })
  .png()
  .toFile('public/icons/apple-touch-icon.png');

// Nav logo (small)
await sharp(input)
  .resize(40, 40, {
    fit: 'contain',
    background: { r:0,g:0,b:0,alpha:0 }
  })
  .png()
  .toFile('public/icons/logo-40.png');

// About avatar (medium)
await sharp(input)
  .resize(96, 96, {
    fit: 'contain',
    background: { r:0,g:0,b:0,alpha:0 }
  })
  .png()
  .toFile('public/icons/logo-96.png');

console.log('✅ All logo sizes generated');
