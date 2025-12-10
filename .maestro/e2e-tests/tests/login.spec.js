import { test, expect } from '@playwright/test';

const EMAIL = process.env.EMAIL || 'test@example.com';
const PASSWORD = process.env.PASSWORD || 'TestPassword123';
const STEP_DELAY = 500;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test.describe('Login Flow - TabletopMastering', () => {
  
  test('should login successfully with valid credentials', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('/');
    await delay(STEP_DELAY);
    
    // Verificar que la Home cargó correctamente
    await expect(page.locator('text=Iniciar Sesión')).toBeVisible({ timeout: 15000 });
    await delay(STEP_DELAY);
    
    // Click en "Iniciar Sesión" del Navbar
    await page.click('text=Iniciar Sesión');
    await delay(STEP_DELAY);
    
    // Esperar a que el formulario de login esté visible
    await expect(page.locator('#identifier')).toBeVisible({ timeout: 10000 });
    await delay(STEP_DELAY);
    
    // Introducir credenciales
    await page.fill('#identifier', EMAIL);
    await delay(STEP_DELAY);
    
    await page.fill('#password', PASSWORD);
    await delay(STEP_DELAY);
    
    // Click en el botón de submit
    await page.click('button:has-text("Iniciar Sesión")');
    await delay(STEP_DELAY);
    
    // Verificar login exitoso - redirige a /home con texto de bienvenida
    await expect(page.getByRole('heading', { name: /Bienvenido/i })).toBeVisible({ timeout: 15000 });
    await delay(STEP_DELAY);
    
    console.log('✅ Login exitoso - Usuario autenticado correctamente');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/');
    await delay(STEP_DELAY);
    
    await page.click('text=Iniciar Sesión');
    await delay(STEP_DELAY);
    
    await expect(page.locator('#identifier')).toBeVisible({ timeout: 10000 });
    await delay(STEP_DELAY);
    
    // Usar credenciales inválidas
    await page.fill('#identifier', 'invalid@email.com');
    await delay(STEP_DELAY);
    
    await page.fill('#password', 'wrongpassword');
    await delay(STEP_DELAY);
    
    await page.click('button:has-text("Iniciar Sesión")');
    await delay(STEP_DELAY);
    
    // Debería mostrar un mensaje de error
    await expect(page.getByText(/error|inválido|incorrecta/i)).toBeVisible({ timeout: 10000 });
    await delay(STEP_DELAY);
  });

});
