// fix-imports.js
import fs from 'fs'
import path from 'path'

function fixImports(dir) {
    const files = fs.readdirSync(dir);
  
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.lstatSync(fullPath);
  
      if (stat.isDirectory()) {
        fixImports(fullPath);
      } else if (fullPath.endsWith('.js')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(/(from\s+['"])([^'"]+)(['"])/g, (match, p1, p2, p3) => {
          // Check if the import path is relative
          if ((p2.startsWith('./') || p2.startsWith('../')) && !p2.endsWith('.js')) {
            return `${p1}${p2}.js${p3}`;
          }
          return match;
        });
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    });
  }
  

// Adjust the directory to the output directory of your TypeScript compilation
fixImports('./dist');
