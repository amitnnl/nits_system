import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'dist');
const destDir = path.join(__dirname, '..');

// Helper to recursively copy directories
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Deploying React application build to XAMPP loginsystem folder...');
try {
  if (fs.existsSync(srcDir)) {
    // Copy index.html
    fs.copyFileSync(path.join(srcDir, 'index.html'), path.join(destDir, 'index.html'));
    
    // Copy assets folder
    copyRecursiveSync(path.join(srcDir, 'assets'), path.join(destDir, 'assets'));
    
    console.log('React application successfully deployed to parent folder.');
  } else {
    console.error('Build directory not found! Run npm run build first.');
  }
} catch (error) {
  console.error('Deployment failed:', error);
}
