import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
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

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import {
  provideRemoteConfig,
  getRemoteConfig,
} from '@angular/fire/remote-config';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    NgxPaginationModule,
    ModalModule.forRoot(),
    AngularEditorModule,
    HttpClientModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
