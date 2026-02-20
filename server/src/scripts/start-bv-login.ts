
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    try {
        // Define paths matching orchestrator.ts
        const COOKIES_DIR = path.join(__dirname, '../../cookies');
        const BV_PROFILE_DIR = path.join(COOKIES_DIR, 'bv_chrome_profile');

        // Ensure directories exist
        if (!fs.existsSync(COOKIES_DIR)) {
            fs.mkdirSync(COOKIES_DIR, { recursive: true });
        }
        if (!fs.existsSync(BV_PROFILE_DIR)) {
            fs.mkdirSync(BV_PROFILE_DIR, { recursive: true });
        }

        console.log('[Manual Login] Launching Chrome with persistent profile for BV...');
        console.log(`[Manual Login] Profile path: ${BV_PROFILE_DIR}`);

        const userDataDir = BV_PROFILE_DIR;
        const context = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            channel: 'chrome',
            args: [
                '--start-maximized',
                '--disable-blink-features=AutomationControlled',
                '--disable-infobars',
            ],
            viewport: null,
            locale: 'pt-BR',
            timezoneId: 'America/Sao_Paulo',
        });


        const pages = context.pages();
        const page = pages.length > 0 ? pages[0] : await context.newPage();

        console.log('[Manual Login] Navigating to BV login page...');
        await page.goto('https://parceiro.bv.com.br/ng-gpar-base-login/');

        console.log('\n==================================================');
        console.log('  MANUAL LOGIN REQUIRED');
        console.log('==================================================');
        console.log('1. The browser window should be open now.');
        console.log('2. Please log in to BV manually.');
        console.log('3. Complete any CAPTHCA or 2FA if requested.');
        console.log('4. Once you see the dashboard, your session is saved.');
        console.log('5. You can then close the browser window or press Ctrl+C here.');
        console.log('==================================================\n');

        // Keep the script running
        await new Promise(() => { });
    } catch (error) {
        console.error('Error in manual login script:', error);
    }
})();
