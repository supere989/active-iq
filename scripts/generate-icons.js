#!/usr/bin/env node
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import iconGen from 'icon-gen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const avatarPath = path.join(projectRoot, 'avatar', 'MUGSHOT.jpg');
const outputDir = path.join(projectRoot, 'build', 'icons');

const linuxPngSizes = [512, 256, 128, 64, 48, 32, 24, 16];

async function generateIcons() {
  // Reset the output directory to avoid stale assets
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const basePngPath = path.join(outputDir, 'icon.png');

  // Create a square 1024x1024 base image suitable for icon generation
  await sharp(avatarPath)
    .resize(1024, 1024, { fit: 'cover' })
    .png()
    .toFile(basePngPath);

  // Generate ICO and ICNS assets for Windows and macOS
  await iconGen(basePngPath, outputDir, {
    report: false,
    modes: ['ico', 'icns'],
  });

  // Generate additional PNG sizes for Linux desktop environments
  await Promise.all(
    linuxPngSizes.map(async (size) => {
      const fileName = `icon-${size}.png`;
      const destination = path.join(outputDir, fileName);
      await sharp(basePngPath)
        .resize(size, size, { fit: 'cover' })
        .png()
        .toFile(destination);
    })
  );

  // Provide a 512px alias expected by some packagers
  const aliasTarget = path.join(outputDir, 'icon-512.png');
  await sharp(basePngPath)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(aliasTarget);

  console.log(`Icons generated in ${outputDir}`);
}

try {
  await generateIcons();
} catch (error) {
  console.error('Failed to generate icons:', error);
  process.exitCode = 1;
}
