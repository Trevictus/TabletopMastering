import { test, expect } from '@playwright/test';

const STEP_DELAY = 700;
const EMAIL = process.env.EMAIL || 'test@example.com';
const PASSWORD = process.env.PASSWORD || 'TestPassword123';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test.describe('Navegación Autenticada - TabletopMastering', () => {

  test('should navigate through all private pages after login', async ({ page }) => {
    // === PASO 1: Iniciar sesión ===
    await page.goto('/');
    await delay(STEP_DELAY);

    await page.click('text=Iniciar Sesión');
    await delay(STEP_DELAY);

    await expect(page.locator('#identifier')).toBeVisible({ timeout: 10000 });
    await page.fill('#identifier', EMAIL);
    await delay(STEP_DELAY);

    await page.fill('#password', PASSWORD);
    await delay(STEP_DELAY);

    await page.click('button:has-text("Iniciar Sesión")');
    await delay(STEP_DELAY);

    // Verificar login exitoso
    await expect(page.getByRole('heading', { name: /Bienvenido/i })).toBeVisible({ timeout: 15000 });
    await delay(STEP_DELAY);
    console.log('✅ Login exitoso (Inicio)');

    // === PASO 2: Navegar a Grupos ===
    await page.click('text=Grupos');
    await delay(STEP_DELAY);

    await expect(page.url()).toContain('/groups');
    await expect(page.locator('body')).toBeVisible();
    await delay(STEP_DELAY);
    console.log('✅ Página de Grupos cargada');

    // === PASO 3: Navegar a Calendario ===
    await page.click('text=Calendario');
    await delay(STEP_DELAY);

    await expect(page.url()).toContain('/calendar');
    await expect(page.locator('body')).toBeVisible();
    await delay(STEP_DELAY);
    console.log('✅ Página de Calendario cargada');

    // === PASO 4: Navegar a Juegos ===
    await page.click('text=Juegos');
    await delay(STEP_DELAY);

    await expect(page.url()).toContain('/games');
    await expect(page.locator('body')).toBeVisible();
    await delay(STEP_DELAY);
    console.log('✅ Página de Juegos cargada');

    // === PASO 5: Navegar a Rankings ===
    await page.click('text=Rankings');
    await delay(STEP_DELAY);

    await expect(page.url()).toContain('/rankings');
    await expect(page.locator('body')).toBeVisible();
    await delay(STEP_DELAY);
    console.log('✅ Página de Rankings cargada');

    // === PASO 6: Navegar a Historial ===
    await page.click('text=Historial');
    await delay(STEP_DELAY);

    await expect(page.url()).toContain('/history');
    await expect(page.locator('body')).toBeVisible();
    await delay(STEP_DELAY);
    console.log('✅ Página de Historial cargada');

    // === PASO 7: Navegar a Perfil (el enlace muestra el nombre del usuario) ===
    await page.click('a[href="/profile"]');
    await delay(STEP_DELAY);

    await expect(page.url()).toContain('/profile');
    await expect(page.locator('body')).toBeVisible();
    await delay(STEP_DELAY);
    console.log('✅ Página de Perfil cargada');

    // === PASO 8: Cerrar sesión ===
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    await delay(STEP_DELAY);

    // Verificar que se ha cerrado la sesión (vuelve a mostrar el link "Iniciar Sesión" en el navbar)
    await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).toBeVisible({ timeout: 10000 });
    await delay(STEP_DELAY);
    console.log('✅ Sesión cerrada correctamente');

    console.log('🎉 Navegación completa por todas las pestañas exitosa');
  });

});
