import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertComponent } from './alert/alert.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { GeneralComponent } from './general/general.component';
import { OrdersComponent } from './order/orders/orders.component';
import { OrderEditComponent } from './order/order-edit/order-edit.component';
import { OrderNewComponent } from './order/order-new/order-new.component';
import { CustomersComponent } from './customer/customers/customers.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CustomerNewComponent } from './customer/customer-new/customer-new.component';
import { ProductsComponent } from './product/products/products.component';
import { ProductEditComponent } from './product/product-edit/product-edit.component';
import { ProductNewComponent } from './product/product-new/product-new.component';
import { ContentsComponent } from './content/contents/contents.component';
import { ContentEditComponent } from './content/content-edit/content-edit.component';
import { ContentNewComponent } from './content/content-new/content-new.component';
import { SettingsComponent } from './setting/settings/settings.component';
import { SettingPasswordComponent } from './setting/setting-password/setting-password.component';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: 'alert',
    component: AlertComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'menu',
    component: MenuComponent,
  },
  {
    path: 'general',
    component: GeneralComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'order-edit/:id',
    component: OrderEditComponent,
  },
  {
    path: 'order-new',
    component: OrderNewComponent,
  },
  {
    path: 'customers',
    component: CustomersComponent,
  },
  {
    path: 'customer-edit/:id',
    component: CustomerEditComponent,
  },
  {
    path: 'customer-new',
    component: CustomerNewComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'product-edit/:id',
    component: ProductEditComponent,
  },
  {
    path: 'product-new',
    component: ProductNewComponent,
  },
  {
    path: 'contents',
    component: ContentsComponent,
  },
  {
    path: 'content-edit/:id',
    component: ContentEditComponent,
  },
  {
    path: 'content-new',
    component: ContentNewComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'change-pwd',
    component: SettingPasswordComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const RoutingComponents = [
  AppComponent,
  AlertComponent,
  LoginComponent,
  MenuComponent,
  GeneralComponent,
  OrdersComponent,
  OrderEditComponent,
  OrderNewComponent,
  CustomersComponent,
  CustomerEditComponent,
  CustomerNewComponent,
  ProductsComponent,
  ProductEditComponent,
  ProductNewComponent,
  ContentsComponent,
  ContentEditComponent,
  ContentNewComponent,
  SettingsComponent,
  SettingPasswordComponent,
  SignUpComponent,
];
