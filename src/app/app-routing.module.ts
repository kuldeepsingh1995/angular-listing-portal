import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { RegisterComponent } from './register/register.component';
import { VerificationComponent } from './verification/verification.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AddListingComponent } from './add-listing/add-listing.component';
import { ListingComponent } from './listing/listing.component';
import { RealEstateClientComponent } from './real-estate-client/real-estate-client.component';
import { RealEstateAgentsComponent } from './real-estate-agents/real-estate-agents.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListDetailComponent } from './list-detail/list-detail.component';
import { HeaderPricingComponent } from './sub-header/header-pricing/header-pricing.component';
import { PricingComponent } from './pricing/pricing.component';
import { PaymentComponent } from './payment/payment.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { SubscriptionPaymentComponent } from './subscription-payment/subscription-payment.component';
import { ManageSubscriptionComponent } from './manage-subscription/manage-subscription.component';
import { AddMorePackagesComponent} from './add-more-packages/add-more-packages.component'
import { AddMoreSubscriptionComponent } from './add-more-subscription/add-more-subscription.component'
const routes: Routes = [
  // {
  // 	path: '',
  // 	redirectTo: '',
  // 	pathMatch: 'full'
  // },
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: HomeComponent
      },{
        path: 'about',
        component: AboutComponent
      },{
        path: 'contact',
        component: ContactComponent

      },{
        path: 'signin',
        component: SigninComponent

      },{
        path: 'signup',
        component: SignupComponent

      },{
        path: 'register',
        component: RegisterComponent

      },
      {
        path: 'verification',
        component: VerificationComponent

      }
      ,{
        path: 'add-listing',
        component: AddListingComponent

      }
      ,{
        path: 'unsubscribe',
        component: UnsubscribeComponent

      },
      {
        path: 'user-profile',
        component: UserProfileComponent

      },
      {
        path: 'list-detail',
        component: ListDetailComponent

      },
      {
        path: 'listing',
        component: ListingComponent

      }
      ,{
        path: 'for-real-estate-clients',
        component: RealEstateClientComponent

      },{
        path: 'for-real-estate-agents',
        component: RealEstateAgentsComponent

      },
      {
        path: 'dashboard',
        component: DashboardComponent

      },
      {
        path: 'payment',
        component: PaymentComponent

      },
      {
        path: 'pricing',
        component: PricingComponent

      },
      {
        path: 'subscription-payment',
        component: SubscriptionPaymentComponent

      },
      {
        path: 'manage-subscription',
        component: ManageSubscriptionComponent
      },
      {
        path: 'add-more-packages',
        component: AddMorePackagesComponent
      },
      {
        path: 'add-more-subscription',
        component: AddMoreSubscriptionComponent
      },
      {
        path: 'not-found',
        component: NotFoundComponent
      },
    ]
  },
  /*{
    path: 'not-found',
    component: NotFoundComponent,
    data: {message: 'Sorry, an error has occured, Requested page not found!'}
  },*/
  {path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
