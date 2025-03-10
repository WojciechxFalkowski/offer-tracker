import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.otomoto.pl/osobowe/audi/a4--a5/od-2019?search%5Bfilter_enum_damaged%5D=0&search%5Bfilter_enum_gearbox%5D=automatic&search%5Bfilter_enum_has_registration%5D=1&search%5Bfilter_enum_has_vin%5D=1&search%5Bfilter_enum_no_accident%5D=1&search%5Bfilter_enum_original_owner%5D=1&search%5Bfilter_enum_registered%5D=1&search%5Bfilter_enum_service_record%5D=1&search%5Bfilter_enum_transmission%5D%5B0%5D=all-wheel-auto&search%5Bfilter_enum_transmission%5D%5B1%5D=all-wheel-lock&search%5Bfilter_enum_transmission%5D%5B2%5D=all-wheel-permanent&search%5Bfilter_enum_transmission%5D%5B3%5D=rear-wheel&search%5Bfilter_float_engine_capacity%3Afrom%5D=1500&search%5Bfilter_float_engine_power%3Afrom%5D=150&search%5Badvanced_search_expanded%5D=true');
  // await page.locator('[data-testid="search-results"] div article h2 a')
  await page.locator('[data-testid="search-results"] > div > article > section > div > div > h2 > a')
});