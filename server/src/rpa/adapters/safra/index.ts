import { Page } from 'playwright';
import { BankAdapter, Credential, SimulationInput, SimulationResult, SimulationOffer } from '../../types';

export class SafraAdapter implements BankAdapter {
    id = 'safra';
    name = 'Banco Safra';
    private baseUrl = 'https://financeira.safra.com.br/portal-veiculos/login';

    // =============================
    // LOGIN
    // =============================
    async login(page: Page, credentials: Credential): Promise<boolean> {
        console.log(`[SafraAdapter] Logging in as ${credentials.login}...`);
        try {
            await page.goto(this.baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await page.waitForTimeout(3000);

            if (!page.url().includes('/login')) {
                console.log('[SafraAdapter] ✅ Session already active!');
                return true;
            }

            const usernameField = page.locator('input#usuario');
            const passwordField = page.locator('input[type="password"]');

            await usernameField.waitFor({ state: 'visible', timeout: 15000 });
            await passwordField.waitFor({ state: 'visible', timeout: 5000 });

            // Fill with keyboard (Angular-friendly)
            await usernameField.click();
            await usernameField.fill('');
            await page.keyboard.type(credentials.login, { delay: 30 });

            await passwordField.click();
            await passwordField.fill('');
            // credentials.password is expected
            await page.keyboard.type(credentials.password || '', { delay: 30 });
            await page.waitForTimeout(500);

            // Click Entrar
            const loginBtn = page.locator('button.entrar');
            await loginBtn.waitFor({ state: 'visible' });

            // the button might be disabled until angular validates
            await page.waitForTimeout(1000);

            // Wait for it to become enabled (if your credentials format is valid)
            try {
                // Not throwing an error because it might not exist if it redirects fast or just fails
                await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
                // We press Enter instead of clicking directly, Angular forms usually react better to keypress
                await page.keyboard.press('Enter');
                // Alternative fallback
                await page.evaluate(() => {
                    const btn = document.querySelector('button.entrar') as HTMLButtonElement | null;
                    if (btn && !btn.disabled) btn.click();
                });
            } catch (e) {
                console.log('[SafraAdapter] Button wait timeout, continuing...');
            }

            // Wait for redirect away from /login
            try {
                await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 20000 });
                console.log(`[SafraAdapter] ✅ Login OK → ${page.url()}`);
                return true;
            } catch {
                if (!page.url().includes('/login')) return true;
                console.error('[SafraAdapter] ❌ Login failed.');
                return false;
            }
        } catch (error: any) {
            console.error('[SafraAdapter] Login exception:', error.message);
            return false;
        }
    }

    // =============================
    // SIMULATE
    // =============================
    async simulate(page: Page, input: SimulationInput): Promise<SimulationResult> {
        console.log(`[SafraAdapter] Simulation for CPF: ${input.client.cpf}`);
        const result: SimulationResult = { bankId: this.id, status: 'ERROR', offers: [] };

        // This is a placeholder for the Safra simulation flow.
        // As we don't have valid credentials yet to map the internal portal,
        // we will log the success of the login and return an empty result.
        console.log('[SafraAdapter] Logged in successfully. Simulation script pending internal portal mapping.');
        result.status = 'SUCCESS';
        result.message = 'Mocked simulation inside Safra for now.';

        return result;
    }
}
