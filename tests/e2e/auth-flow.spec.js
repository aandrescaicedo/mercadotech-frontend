/**
 * Test E2E: Flujo de Autenticación
 * 
 * Propósito:
 * Verificar el flujo completo de registro, login y logout del usuario
 * 
 * Dependencias:
 * - Playwright: Framework de testing E2E
 * - Frontend corriendo en localhost:5173
 * - Backend corriendo en localhost:5000 o Vercel
 * 
 * Flujo probado:
 * 1. Registro de nuevo usuario
 * 2. Verificar redirección a catálogo
 * 3. Logout
 * 4. Login con las mismas credenciales
 * 5. Verificar sesión activa
 */

import { test, expect } from '@playwright/test';

test.describe('Flujo de Autenticación Completo', () => {
    const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'test Password123'
    role: 'CLIENT'
    };

    test('debe completar ciclo: registro → login → logout', async ({ page }) => {
        // 1. REGISTRO -Navegar a página de registro
        await page.goto('/register');
        await expect(page).toHaveTitle(/MercadoTech/i);

        // Llenar formulario de registro
        await page.fill('input[type="email"]', testUser.email);
        await page.fill('input[type="password"]', testUser.password);
        await page.select('select#role', testUser.role);

        // Enviar formulario
        await page.click('button[type="submit"]');

        // Verificar redirección a catálogo
        await expect(page).toHaveURL('/catalog');
        await expect(page.locator('text=Catálogo')).toBeVisible();

        // 2. LOGOUT
        await page.click('button:has-text("Salir")');

        // Confirmar alerta de logout
        page.on('dialog', dialog => dialog.accept());
        await page.click('button:has-text("Salir")');

        // Verificar redirección a landing page
        await expect(page).toHaveURL('/');

        // 3. LOGIN
        await page.click('a:has-text("Iniciar Sesión")');
        await expect(page).toHaveURL('/login');

        // Llenar formulario de login
        await page.fill('input[type="email"]', testUser.email);
        await page.fill('input[type="password"]', testUser.password);
        await page.click('button[type="submit"]');

        // Verificar sesión activa
        await expect(page).toHaveURL('/catalog');
        await expect(page.locator(`text=Hola, ${testUser.email.split('@')[0]}`)).toBeVisible();
    });

    test('debe mostrar error con credenciales inválidas', async ({ page }) => {
        // Navegar a login
        await page.goto('/login');

        // Intentar login con credenciales incorrectas
        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongPassword');
        await page.click('button[type="submit"]');

        // Verificar mensaje de error
        await expect(page.locator('text=/error|inválid/i')).toBeVisible();
    });
});
