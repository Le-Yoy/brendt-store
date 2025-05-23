// Script to check the directory structure
const fs = require('fs');
const path = require('path');

// Define project root path
const projectRoot = path.resolve(process.cwd());
console.log('Project root path:', projectRoot);

// Check the base image directory
const baseImageDir = path.join(projectRoot, 'public', 'assets', 'images', 'products');
console.log(`Checking if base image directory exists: ${baseImageDir}`);

if (fs.existsSync(baseImageDir)) {
  console.log('Base image directory exists!');
  
  // List contents of the base image directory
  console.log('Contents of base image directory:');
  fs.readdirSync(baseImageDir).forEach(item => {
    const itemPath = path.join(baseImageDir, item);
    const stats = fs.statSync(itemPath);
    console.log(`- ${item} (${stats.isDirectory() ? 'directory' : 'file'})`);
    
    // If it's a directory, list its contents too
    if (stats.isDirectory()) {
      console.log(`  Contents of ${item}:`);
      try {
        fs.readdirSync(itemPath).forEach(subItem => {
          const subItemPath = path.join(itemPath, subItem);
          const subStats = fs.statSync(subItemPath);
          console.log(`  - ${subItem} (${subStats.isDirectory() ? 'directory' : 'file'})`);
          
          // If it's a directory, list its contents too
          if (subStats.isDirectory()) {
            console.log(`    Contents of ${subItem}:`);
            try {
              fs.readdirSync(subItemPath).forEach(subSubItem => {
                const subSubItemPath = path.join(subItemPath, subSubItem);
                const subSubStats = fs.statSync(subSubItemPath);
                console.log(`    - ${subSubItem} (${subSubStats.isDirectory() ? 'directory' : 'file'})`);
              });
            } catch (e) {
              console.log(`    Error reading directory: ${e.message}`);
            }
          }
        });
      } catch (e) {
        console.log(`  Error reading directory: ${e.message}`);
      }
    }
  });
} else {
  console.log('Base image directory does not exist!');
}