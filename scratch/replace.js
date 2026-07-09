const fs = require('fs');
const pagePath = 'src/app/page.tsx';
const storesPath = 'stores.txt';

const pageContent = fs.readFileSync(pagePath, 'utf8');
const storesContent = fs.readFileSync(storesPath, 'utf8');

const regex = /const STORES = \[[\s\S]*?\];/;
const newPageContent = pageContent.replace(regex, storesContent.trim());

fs.writeFileSync(pagePath, newPageContent);
console.log('Stores replaced!');
