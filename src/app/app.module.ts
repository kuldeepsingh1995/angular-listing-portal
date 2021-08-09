import { BrowserModule,Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { RegisterComponent } from './register/register.component';
import { VerificationComponent } from './verification/verification.component';
import { HeaderHomeComponent } from './sub-header/header-home/header-home.component';
import { HeaderAboutComponent } from './sub-header/header-about/header-about.component';
import { HeaderContactComponent } from './sub-header/header-contact/header-contact.component';
import { HeaderSigninComponent } from './sub-header/header-signin/header-signin.component';
import { HeaderSignupComponent } from './sub-header/header-signup/header-signup.component';
import { HeaderRegisterComponent } from './sub-header/header-register/header-register.component';
import { HeaderVerificationComponent } from './sub-header/header-verification/header-verification.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AddListingComponent } from './add-listing/add-listing.component';
import { ListingComponent } from './listing/listing.component';
import { HeaderListingComponent } from './sub-header/header-listing/header-listing.component';
import { RealEstateClientComponent } from './real-estate-client/real-estate-client.component';
import { HeaderRealEstateClientComponent } from './sub-header/header-real-estate-client/header-real-estate-client.component';
import { HeaderRealEstateAgentsComponent } from './sub-header/header-real-estate-agents/header-real-estate-agents.component';
import { RealEstateAgentsComponent } from './real-estate-agents/real-estate-agents.component';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from '../environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgQrScannerModule } from 'angular2-qrscanner';
import {NgxPaginationModule} from 'ngx-pagination';
import { ListDetailComponent } from './list-detail/list-detail.component';
import { HeaderPricingComponent } from './sub-header/header-pricing/header-pricing.component';
import { PricingComponent } from './pricing/pricing.component';
import { PaymentComponent } from './payment/payment.component';
import { HeaderPaymentComponent } from './sub-header/header-payment/header-payment.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HeaderUserProfileComponent } from './sub-header/header-user-profile/header-user-profile.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { HeaderUnsubscribeComponent } from './sub-header/header-unsubscribe/header-unsubscribe.component';
import { SubscriptionPaymentComponent } from './subscription-payment/subscription-payment.component';
import { ManageSubscriptionComponent } from './manage-subscription/manage-subscription.component';
import { AddMorePackagesComponent } from './add-more-packages/add-more-packages.component';
import { AddMoreSubscriptionComponent } from './add-more-subscription/add-more-subscription.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

 @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    AboutComponent,
    ContactComponent,
    SigninComponent,
    SignupComponent,
    RegisterComponent,
    VerificationComponent,
    HomeComponent,
    HeaderHomeComponent,
    HeaderAboutComponent,
    HeaderContactComponent,
    HeaderSigninComponent,
    HeaderSignupComponent,
    HeaderRegisterComponent,
    HeaderVerificationComponent,
    NotFoundComponent,
    AddListingComponent,
    ListingComponent,
    HeaderListingComponent,
    RealEstateClientComponent,
    HeaderRealEstateClientComponent,
    HeaderRealEstateAgentsComponent,
    RealEstateAgentsComponent,
    DashboardComponent,
    ListDetailComponent,
    HeaderPricingComponent,
    PricingComponent,
    HeaderPaymentComponent,
    PaymentComponent,
    UserProfileComponent,
    HeaderUserProfileComponent,
    UnsubscribeComponent,
    HeaderUnsubscribeComponent,
    SubscriptionPaymentComponent,
    ManageSubscriptionComponent,
    AddMorePackagesComponent,
    AddMoreSubscriptionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    HttpClientModule,
    NgQrScannerModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot()

  ],
  providers: [ Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
