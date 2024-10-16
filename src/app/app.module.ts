import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from './core/material.module';
import { AppRoutingModule } from './core/app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './core/auth-guard.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AdminComponent } from './admin/admin.component';
import { AuthInterceptorService } from './core/auth-interceptor.service';
import { AlertComponent } from './alert/alert.component';
import { ShopComponent } from './shop/shop.component';

import { ShopService } from './shop/shop.service';
import { HomeService } from './home/home.service';

import { register } from 'swiper/element/bundle';
import { SwiperDirective } from './directives/swiper.directive';
import { MatButtonModule } from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import { WindowRefService } from './window-ref.service';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
import { TicketsComponent } from './tickets/tickets.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TicketsService } from './tickets/tickets.service';
import { MatDialogModule } from '@angular/material/dialog';
import { TicketDetailsPopUp } from './tickets/ticket.details.popup/ticket.details.popup';
import { SafePipe } from './core/safe.pipe';
import { QrScannerComponent } from './tickets/qrscanner-popup/qrscanner.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { UtcToLocalTime } from './pipes/utcToLocalTime.pipe';


register();
// #QRCode Scanner: Necessary to solve the problem of losing internet connection
LOAD_WASM().subscribe()

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    ErrorPageComponent,
    AdminComponent,
    ShopComponent,
    TicketsComponent,
    TicketDetailsPopUp,
    SafePipe,
    QrScannerComponent,
    UtcToLocalTime
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CustomMaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
    QRCodeModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    NgxScannerQrcodeModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule, MatSelectModule, MatButtonModule, MatSnackBarModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    ShopService,
    HomeService,
    WindowRefService,
    TicketsService  
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
