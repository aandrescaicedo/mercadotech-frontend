/**
 * Test E2E: Flujo de Gestión de Tienda

 * 
 * Propósito:
 * Verificar el flujo completo de un vendedor gestionando su tienda
 * 
 * Dependencias:
 * - Playwright
 * - Frontend y Backend corriendo
 * - Usuario STORE registrado
 * 
 * Flujo probado:
 * 1. Login como vendedor (STORE)
 * 2. Navegar al dashboard de tienda
 * 3. Crear nuevo producto
 * 4. Verificar producto en lista
 * 5. Editar producto
 * 6. Verificar cambios
 */

import { test, expect } from '@playwright/test';

test.describe('Flujo de Gestión de Tienda', () => {
    const storeUser = {
        email: `store${Date.now()}@example.com`,
        password: 'storePass123',
        role: 'STORE'
    };

    test.beforeEach(async ({ page }) => {
        // Registrar usuario vendedor
        await page.goto('/register');
        await page.fill('input[type="email"]', storeUser.email);
        await page.fill('input[type="password"]', storeUser.password);
        await page.selectOption('select#role', storeUser.role);
        await page.click('button[type="submit"]');

        await page.waitForURL('/catalog');
    });

    test('debe completar gestión: crear tienda → agregar producto → editar', async ({ page }) => {
        // 1. CREAR TIENDA (si no existe)
        await page.click('a:has-text("Mi Tienda")');

        // Verificar si ya tiene tienda o necesita crear
        const hasStore = await page.locator('text=Dashboard de Tienda').isVisible().catch(() => false);

        if (!hasStore) {
            // Llenar formulario de crear tienda
            await page.fill('input[name="name"]', 'Tienda de Prueba E2E');
            await page.fill('textarea[name="description"]', 'Descripción de prueba');
            await page.click('button[type="submit"]');

            await page.waitForTimeout(1000);
        }

        // 2. NAVEGAR AL DASHBOARD
        await page.goto('/store-dashboard');
        await expect(page.locator('text=Dashboard de Tienda')).toBeVisible();

        // 3. CREAR NUEVO PRODUCTO
        await page.click('button:has-text("Agregar Producto")');

        const testProduct = {
            name: `Producto Test ${Date.now()}`,
            description: 'Descripción de prueba E2E',
            price: '99.99',
            stock: '20'
        };

        await page.fill('input[name="name"]', testProduct.name);
        await page.fill('textarea[name="description"]', testProduct.description);
        await page.fill('input[name="price"]', testProduct.price);
        await page.fill('input[name="stock"]', testProduct.stock);

        // Seleccionar categoría (primera disponible)
        await page.selectOption('select[name="category"]', { index: 1 });

        await page.click('button[type="submit"]');

        // 4. VERIFICAR PRODUCTO EN LISTA
        await page.waitForTimeout(1000);
        await expect(page.locator(`text=${testProduct.name}`)).toBeVisible();

        // 5. EDITAR PRODUCTO
        const editButton = page.locator(`text=${testProduct.name}`).locator('..').locator('button:has-text("Editar")');
        await editButton.click();

        const updatedPrice = '129.99';
        await page.fill('input[name="price"]', updatedPrice);
        await page.click('button:has-text("Guardar Cambios")');

        // 6. VERIFICAR CAMBIOS
        await page.waitForTimeout(1000);
        await expect(page.locator(`text=$${updatedPrice}`)).toBeVisible();
    });

    test('debe mostrar lista de productos de la tienda', async ({ page }) => {
        await page.goto('/store-dashboard');

        // Verificar elementos del dashboard
        await expect(page.locator('text=Mis Productos')).toBeVisible();
        await expect(page.locator('button:has-text("Agregar Producto")')).toBeVisible();
    });

    test('debe validar campos requeridos al crear producto', async ({ page }) => {
        await page.goto('/store-dashboard');
        await page.click('button:has-text("Agregar Producto")');

        // Intentar enviar formulario vacío
        await page.click('button[type="submit"]');

        // Verificar validación HTML5 o mensajes de error
        const nameInput = page.locator('input[name="name"]');
        await expect(nameInput).toHaveAttribute('required', '');
    });
});
