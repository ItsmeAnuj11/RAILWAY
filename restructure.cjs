const fs = require('fs');
const path = require('path');

// Read existing package.json to copy dependencies accurately
const oldPkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const frontendDeps = {
  '@google/genai': oldPkg.dependencies['@google/genai'],
  '@tailwindcss/typography': oldPkg.dependencies['@tailwindcss/typography'],
  '@tailwindcss/vite': oldPkg.dependencies['@tailwindcss/vite'],
  '@vitejs/plugin-react': oldPkg.dependencies['@vitejs/plugin-react'],
  'lucide-react': oldPkg.dependencies['lucide-react'],
  'motion': oldPkg.dependencies['motion'],
  'react': oldPkg.dependencies['react'],
  'react-dom': oldPkg.dependencies['react-dom'],
  'react-markdown': oldPkg.dependencies['react-markdown'],
  'vite': oldPkg.dependencies['vite']
};
const backendDeps = {
  'dotenv': oldPkg.dependencies['dotenv'],
  'express': oldPkg.dependencies['express'],
  'mysql2': oldPkg.dependencies['mysql2']
};

fs.mkdirSync('frontend', { recursive: true });
fs.mkdirSync('backend', { recursive: true });

// Move files
const toMoveFrontend = ['src', 'index.html', 'vite.config.ts', 'tsconfig.json'];
toMoveFrontend.forEach(f => {
  if (fs.existsSync(f)) {
    fs.renameSync(f, path.join('frontend', f));
  }
});

const toMoveBackend = ['server.ts'];
toMoveBackend.forEach(f => {
  if (fs.existsSync(f)) {
    fs.renameSync(f, path.join('backend', f));
  }
});

// Create package.json files
const rootPkg = {
  name: 'railcare-monorepo',
  private: true,
  scripts: {
    'install:all': 'npm install && cd frontend && npm install && cd ../backend && npm install',
    'dev': 'concurrently "cd frontend && npm run dev" "cd backend && npm run dev"'
  },
  devDependencies: {
    'concurrently': '^8.0.1'
  }
};
fs.writeFileSync('package.json', JSON.stringify(rootPkg, null, 2));

const frontPkg = {
  name: 'railcare-frontend',
  private: true,
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'tsc -b && vite build',
    preview: 'vite preview'
  },
  dependencies: frontendDeps,
  devDependencies: {
    '@types/node': oldPkg.devDependencies['@types/node'],
    'autoprefixer': oldPkg.devDependencies['autoprefixer'],
    'tailwindcss': oldPkg.devDependencies['tailwindcss'],
    'typescript': oldPkg.devDependencies['typescript'],
    'vite': oldPkg.devDependencies['vite']
  }
};
fs.writeFileSync('frontend/package.json', JSON.stringify(frontPkg, null, 2));

const backPkg = {
  name: 'railcare-backend',
  private: true,
  type: 'module',
  scripts: {
    dev: 'tsx server.ts'
  },
  dependencies: backendDeps,
  devDependencies: {
    '@types/express': oldPkg.devDependencies['@types/express'],
    '@types/node': oldPkg.devDependencies['@types/node'],
    'tsx': oldPkg.devDependencies['tsx']
  }
};
fs.writeFileSync('backend/package.json', JSON.stringify(backPkg, null, 2));

console.log('Restructure complete');
