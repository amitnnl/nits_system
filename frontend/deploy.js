import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const srcDir = path.join(__dirname, 'dist');
const deployDir = path.join(rootDir, 'deploy_build');

// Helper to recursively copy directories
function copyRecursiveSync(src, dest, exclude = []) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (exclude.includes(path.basename(src))) return;

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        exclude
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Building safe deployment folder...');
try {
  // 1. Create fresh deploy_build directory
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
  fs.mkdirSync(deployDir, { recursive: true });

  // 2. Copy frontend built files
  if (fs.existsSync(srcDir)) {
    const items = fs.readdirSync(srcDir);
    items.forEach(item => {
      copyRecursiveSync(path.join(srcDir, item), path.join(deployDir, item));
    });
    console.log('Frontend assets copied.');
  } else {
    console.error('Build directory not found! Run npm run build first.');
  }

  // 3. Copy API files (excluding config.php)
  const apiSrc = path.join(rootDir, 'api');
  if (fs.existsSync(apiSrc)) {
    copyRecursiveSync(apiSrc, path.join(deployDir, 'api'), ['config.php']);
    console.log('API backend copied (excluding config.php).');
  }

  // 4. Copy .htaccess
  const htaccessSrc = path.join(rootDir, '.htaccess');
  if (fs.existsSync(htaccessSrc)) {
    fs.copyFileSync(htaccessSrc, path.join(deployDir, '.htaccess'));
    console.log('.htaccess copied.');
  }

  console.log('Safe deployment folder built successfully!');
} catch (error) {
  console.error('Deployment build failed:', error);
}
