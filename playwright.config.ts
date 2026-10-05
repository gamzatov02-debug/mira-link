import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/e2e',fullyParallel:false,workers:1,timeout:45000,use:{baseURL:'http://localhost:5173',headless:true,channel:'chromium',trace:'retain-on-failure'},webServer:{command:'npm run dev -- --port 5173',url:'http://localhost:5173/demo',reuseExistingServer:true,timeout:60000},reporter:'list'});
