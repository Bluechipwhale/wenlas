import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/wenlas',workers:1,timeout:120000,
  use:{baseURL:'http://127.0.0.1:3200',channel:process.env.CI?undefined:'chrome',headless:true,trace:'retain-on-failure'},reporter:'list',
  webServer:{command:'npm run dev -- --port 3200',url:'http://127.0.0.1:3200',reuseExistingServer:false,timeout:120000,env:{
    WENLAS_CATALOGUE_MODE:'true',WENLAS_LOCAL_INVENTORY:'true',WENLAS_DB_NAME:'',WENLAS_DATABASE_URL:'',WENLAS_INVENTORY_SQLITE_PATH:'.data/wenlas-live-e2e-'+process.pid+'-'+Date.now()+'.sqlite',WENLAS_SETUP_TOKEN:'test-only-wenlas-setup-code-123456789012345678',WENLAS_OWNER_EMAIL:'owner@example.test',NEXT_PUBLIC_SITE_URL:'http://127.0.0.1:3200',NEXT_PUBLIC_SUPABASE_URL:'',NEXT_PUBLIC_SUPABASE_ANON_KEY:'',SUPABASE_SERVICE_ROLE_KEY:'',PAYSTACK_SECRET_KEY:'',LOCAL_DEMO:'true',LOCAL_DATABASE_PATH:'.data/wenlas-e2e-'+process.pid+'-'+Date.now()+'.sqlite',NEXT_DIST_DIR:'.next-e2e',
  }},
});
