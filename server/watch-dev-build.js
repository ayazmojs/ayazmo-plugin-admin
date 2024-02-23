import chokidar from 'chokidar'
import path from 'node:path'
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';

// Define the allowed directories for synchronization
const allowedDirectories = [
  'components',
  'app',
  // Add any other directories you want to allow
];

function isValidPath(filePath) {
  // Check if the filePath contains any of the allowed directories after 'src/admin/'
  return allowedDirectories.some(dir =>
    filePath.includes(path.join('src', 'admin', dir))
  );
}

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const sourcePath = path.join(process.cwd(), 'src', 'plugins', '*', 'src', 'admin', '**')

const watcher = chokidar.watch(sourcePath, {
  ignored: [
    /(^|[\/\\])\../, // ignore dotfiles
    path.join('src', 'admin', 'config'), // ignore the specific config directory
  ],
  persistent: true,
});

watcher
  .on('add', filePath => mirrorFile(filePath, 'add'))
  .on('change', filePath => mirrorFile(filePath, 'change'))
  .on('unlink', filePath => mirrorFile(filePath, 'unlink'))
  .on('addDir', dirPath => mirrorFile(dirPath, 'addDir'))
  .on('unlinkDir', dirPath => mirrorFile(dirPath, 'unlinkDir'));

function mirrorFile(filePath, event) {

  if (!isValidPath(filePath)) {
    console.error(`The file path is not allowed for synchronization: ${filePath}`);
    return;
  }

  const pluginNameMatch = filePath.match(/src\/plugins\/(.*?)\/src\/admin/);
  const pluginName = pluginNameMatch ? pluginNameMatch[1] : null;

  if (!pluginName) {
    console.error(`Unable to determine the plugin name from the file path: ${filePath}`);
    return;
  }

  // Extract the part of the path after 'src/admin' to get the relative path within the plugin
  const relativePathWithinPlugin = filePath.split(path.sep).slice(filePath.split(path.sep).indexOf('admin') + 1).join(path.sep);
  const targetPath = path.join(__dirname, '..', relativePathWithinPlugin);

  switch (event) {
    case 'add':
    case 'change':
      fs.copy(filePath, targetPath)
        .then(() => console.log(`File ${filePath} was copied to ${targetPath}`))
        .catch(err => console.error(`Error copying file ${filePath} to ${targetPath}`, err));
      break;
    case 'unlink':
      fs.remove(targetPath)
        .then(() => console.log(`File ${targetPath} was removed`))
        .catch(err => console.error(`Error removing file ${targetPath}`, err));
      break;
    case 'addDir':
      fs.ensureDir(targetPath)
        .then(() => console.log(`Directory ${targetPath} was added`))
        .catch(err => console.error(`Error adding directory ${targetPath}`, err));
      break;
    case 'unlinkDir':
      fs.remove(targetPath)
        .then(() => console.log(`Directory ${targetPath} was removed`))
        .catch(err => console.error(`Error removing directory ${targetPath}`, err));
      break;
  }
}