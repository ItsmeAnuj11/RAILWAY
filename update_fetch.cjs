const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('import.meta.env.VITE_API_URL')) return; // Already done

  const injectPoint = "fetch('/api/searches'";
  const codeToInject = "fetch((import.meta.env.VITE_API_URL || '') + '/api/searches'";
      
  if (content.includes(injectPoint)) {
    content = content.replace(injectPoint, codeToInject);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Injected VITE_API_URL in', filePath);
  }
}

const dir = 'frontend/src/components';
processFile(path.join(dir, 'SmartJourneyScreen.tsx'));
processFile(path.join(dir, 'StationConciergeScreen.tsx'));
processFile(path.join(dir, 'SafetyGuardScreen.tsx'));
processFile(path.join(dir, 'RefundAdvisorScreen.tsx'));
processFile(path.join(dir, 'BudgetPlannerScreen.tsx'));
processFile(path.join(dir, 'StationNavigatorScreen.tsx'));
processFile(path.join(dir, 'ChatbotScreen.tsx'));
processFile(path.join(dir, 'BhashaBotScreen.tsx'));

const appFile = 'frontend/src/App.tsx';
if (fs.existsSync(appFile)) {
  let content = fs.readFileSync(appFile, 'utf8');
  content = content.replace(/fetch\('\/api\/users'/g, "fetch((import.meta.env.VITE_API_URL || '') + '/api/users'");
  content = content.replace(/fetch\('\/api\/login'/g, "fetch((import.meta.env.VITE_API_URL || '') + '/api/login'");
  fs.writeFileSync(appFile, content, 'utf8');
  console.log('Injected VITE_API_URL in App.tsx');
}
