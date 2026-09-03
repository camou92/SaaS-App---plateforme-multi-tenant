import { Routes } from '@angular/router';
import {authGuard} from './core/guards/auth/auth-guard';
import {platformAdminGuard} from './core/guards/platform-admin/platform-admin-guard';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import('./features/public/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/public/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/public/register/register').then((m) => m.Register),
  },
  {
    path: 'administration',
    canActivate: [authGuard, platformAdminGuard],
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/tenant-list/tenant-list').then((m) => m.TenantList),
      }
    ]
  },
  {
    path: 'app',
    loadComponent: () => import('./features/tenant/dashboard/dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: 'categories',
        loadComponent: () => import('./features/tenant/category-list/category-list').then((m) => m.CategoryList),
      },
      {
        path: 'manage-category',
        loadComponent: () => import('./features/tenant/category-list/manage-category/manage-category').then((m) => m.ManageCategory),
      },
      {
        path: 'manage-category/:categoryId',
        loadComponent: () => import('./features/tenant/category-list/manage-category/manage-category').then((m) => m.ManageCategory),
      },
      {
        path: 'products',
        loadComponent: () => import('./features/tenant/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: 'manage-product',
        loadComponent: () => import('./features/tenant/product-list/manage-product/manage-product').then((m) => m.ManageProduct),
      },
      {
        path: 'manage-product/:productId',
        loadComponent: () => import('./features/tenant/product-list/manage-product/manage-product').then((m) => m.ManageProduct),
      },
      {
        path: 'stock-mvts',
        loadComponent: () => import('./features/tenant/stock-mvt/stock-mvt').then((m) => m.StockMvt),
      },
      {
        path: 'manage-stock-mvt',
        loadComponent: () => import('./features/tenant/stock-mvt/manage-stock-mvt/manage-stock-mvt').then((m) => m.ManageStockMvt),
      },
      {
        path: 'manage-stock-mvt/:stockMvtId',
        loadComponent: () => import('./features/tenant/stock-mvt/manage-stock-mvt/manage-stock-mvt').then((m) => m.ManageStockMvt),
      },
      {
        path: 'users-list',
        loadComponent: () => import('./features/tenant/user-list/user-list').then((m) => m.UserList),
      },
      {
        path: 'manage-user',
        loadComponent: () => import('./features/tenant/user-list/manage-user/manage-user').then((m) => m.ManageUser),
      },
      {
        path: 'manage-user/:userId',
        loadComponent: () => import('./features/tenant/user-list/manage-user/manage-user').then((m) => m.ManageUser),
      }
    ]
  }

];
