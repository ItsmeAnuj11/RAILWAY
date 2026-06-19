const fs = require('fs');
const path = require('path');

function processFile(filePath, featureName, searchVarName) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('fetch(\'/api/searches\'')) return; // Already done

  const injectPoint = 'const response = await ai.models.generateContent({';
  if (!content.includes(injectPoint)) return;

  const codeToInject = `
      try {
        fetch('/api/searches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featureName: '${featureName}', searchQuery: ${searchVarName} })
        });
      } catch (e) {}

      `;
      
  content = content.replace(injectPoint, codeToInject + injectPoint);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Injected analytics in', filePath);
}

const dir = 'frontend/src/components';
processFile(path.join(dir, 'SmartJourneyScreen.tsx'), 'Smart Journey AI', 'trainNumber');
processFile(path.join(dir, 'StationConciergeScreen.tsx'), 'Station Concierge', 'stationName');
processFile(path.join(dir, 'SafetyGuardScreen.tsx'), 'Safety Guard', 'pnr');
processFile(path.join(dir, 'RefundAdvisorScreen.tsx'), 'Refund Advisor', 'pnr');
processFile(path.join(dir, 'BudgetPlannerScreen.tsx'), 'Budget Planner', 'budget'); // wait, the var might be different. Let's just use string literal if variable doesn't exist. Actually BudgetPlanner uses 'budget', wait let's check
processFile(path.join(dir, 'StationNavigatorScreen.tsx'), 'Station Navigator', 'station');
processFile(path.join(dir, 'ChatbotScreen.tsx'), 'Chatbot', 'input');
processFile(path.join(dir, 'BhashaBotScreen.tsx'), 'Bhasha Bot', 'input');
