const fs = require('fs');
const page = fs.readFileSync('d:/Apex v1.0/frontend/src/pages/EvaluationPage.jsx', 'utf8').split('\n');

const imports = [];
let i = 0;
for (; i < page.length; i++) {
    if (page[i].includes('const SidebarLink') || page[i].includes('const EvaluationPage = () => {')) break;
    // Adjust asset paths
    let line = page[i].replace('../assets', '../../assets');
    line = line.replace('../components/Navbar', '');
    line = line.replace('../components/ConfirmModal', '../ConfirmModal');
    line = line.replace('../components/LoadingScreen', '../LoadingScreen');
    if (line.trim()) imports.push(line);
}

const componentStart = page.findIndex(line => line.includes('const EvaluationPage = () => {'));
let endState = page.findIndex(line => line.includes('return ('));

const stateLogic = page.slice(componentStart + 1, endState);

const mainStart = page.findIndex(line => line.includes('className="max-w-6xl mx-auto"'));
const mainEndLine = page.findIndex(line => line.includes('</main>'));
const mainContent = page.slice(mainStart - 1, mainEndLine - 1); // get the <motion.div...

const modalStart = page.findIndex(line => line.includes('{/* Modal for detailed view */}'));
const modalEnd = page.findIndex(line => line.includes('export default EvaluationPage'));

const modalContent = page.slice(modalStart, modalEnd - 2);

const result = [
    ...imports,
    '',
    'const EvaluationTab = () => {',
    ...stateLogic,
    '    return (',
    '        <div className="w-full">',
    ...mainContent,
    '',
    ...modalContent,
    '    );',
    '};',
    '',
    'export default EvaluationTab;',
    ''
].join('\n');

fs.writeFileSync('d:/Apex v1.0/frontend/src/components/admin/EvaluationTab.jsx', result);
console.log('Done extraction!');
