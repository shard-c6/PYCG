const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    // Also catch unhandled rejections or errors in the page
    await page.evaluateOnNewDocument(() => {
      window.addEventListener('error', e => {
        console.log('WINDOW ERROR:', e.message, e.filename, e.lineno, e.colno);
      });
      window.addEventListener('unhandledrejection', e => {
        console.log('UNHANDLED REJECTION:', e.reason);
      });
    });

    console.log('Navigating to http://localhost:3001 ...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0', timeout: 15000 });
    
    console.log('Waiting 3 seconds for rendering errors...');
    await new Promise(r => setTimeout(r, 3000));
    
    await browser.close();
    console.log('Done.');
  } catch (err) {
    console.error('Script Error:', err);
  }
})();
