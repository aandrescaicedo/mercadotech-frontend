/**
 * Test E2E: Flujo de Compra Completo
 * 
 * Propósito:
 * Verificar el flujo end-to-end de un cliente comprando productos
 * 
 * Dependencias:
 * - Playwright
 * - Frontend y Backend corriendo
 * - Productos existentes en el catálogo
 * 
 * Flujo probado:
 * 1. Login como cliente
 * 2. Navegar al catálogo
 * 3. Filtrar productos
 * 4. Agregar productos al carrito
 * 5. Ir al checkout
 * 6. Confirmar pedido
 * 7. Verificar pedido en "Mis Pedidos"
 */

import { test, expect } from '@playwright/test';

test.describe('Flujo de Compra Completo', () => {
    const clientUser = {
        email: `shopper${Date.now()}@example.com`,
        password: 'shopperPass123',
        role: 'CLIENT'
    };

    test.beforeEach(async ({ page }) => {
        // Registrar y loguear usuario cliente
        await page.goto('/register');
        await page.fill('input[type="email"]', clientUser.email);
        await page.fill('input[type="password"]', clientUser.password);
        await page.selectOption('select#role', clientUser.role);
        await page.click('button[type="submit"]');

        // Esperar redirección a catálogo
        await page.waitForURL('/catalog');
    });

    test('debe completar compra: browse → carrito → checkout → orden', async ({ page }) => {
        // 1. FILTRAR PRODUCTOS EN CATÁLOGO
        await expect(page.locator('h1:has-text("Catálogo")')).toBeVisible();

        // Buscar por nombre
        await page.fill('input[placeholder*="Nombre"]', 'Laptop');
        await page.click('button:has-text("Filtrar")');

        // Esperar resultados
        await page.waitForTimeout(1000);

        // 2. AGREGAR 2 PRODUCTOS AL CARRITO
        const products = page.locator('[data-testid="product-card"]');
        const productCount = await products.count();

        if (productCount >= 2) {
            // Agregar primer producto
            await products.nth(0).click();
            await page.fill('input[type="number"]', '2'); // Cantidad 2
            await page.click('button:has-text("Confirmar")');

            // Esperar confirmación
            await page.waitForTimeout(500);

            // Agregar segundo producto
            await products.nth(1).click();
            await page.fill('input[type="number"]', '1'); // Cantidad 1
            await page.click('button:has-text("Confirmar")');
        }

        // 3. IR AL CARRITO
        await page.click('a[href="/cart"]');
        await page.waitForURL('/cart');

        // Verificar productos en carrito
        await expect(page.locator('text=Carrito de Compras')).toBeVisible();
        await expect(page.locator('text=Total:')).toBeVisible();

        // 4. PROCEDER AL CHECKOUT
        await page.click('a[href="/checkout"]');
        await page.waitForURL('/checkout');

        // 5. CONFIRMAR PEDIDO
        await page.click('button:has-text("Confirmar Pedido")');

        // Esperar redirección a catálogo
        await page.waitForURL('/catalog');

        // 6. VERIFICAR EN "MIS PEDIDOS"
        await page.click('a[href="/my-orders"]');
        await page.waitForURL('/my-orders');

        // Verificar que existe al menos un pedido
        await expect(page.locator('text=Mis Pedidos')).toBeVisible();
        await expect(page.locator('[data-testid="order-item"]').first()).toBeVisible();
    });

    test('debe mostrar carrito vacío inicialmente', async ({ page }) => {
        // Ir al carrito
        await page.goto('/cart');

        // Verificar mensaje de carrito vacío
        await expect(page.locator('text=Tu carrito está vacío')).toBeVisible();
        await expect(page.locator('a:has-text("Continuar Comprando")')).toBeVisible();
    });

    test('debe permitir limpiar filtros en catálogo', async ({ page }) => {
        await page.goto('/catalog');

        // Aplicar filtros
        await page.fill('input[placeholder*="Nombre"]', 'Test Product');
        await page.click('button:has-text("Filtrar")');

        // Hacer clic en Limpiar
        await page.click('button:has-text("Limpiar")');

        // Verificar que los campos se vacíen
        await expect(page.locator('input[placeholder*="Nombre"]')).toHaveValue('');
    });
});
