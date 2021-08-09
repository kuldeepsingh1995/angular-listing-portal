import {Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common-services';
import { Title ,Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  environment=environment;
  currentUrl = '';
  blackHeadder: string = "";
  url: string = "";
  pageTitle: string = "";

  pageHeading: string | '';
  pageSubHeading: string | '';
  isUserLogin: boolean =  false;
  public newPageTitle: any = ''
  constructor(public commonService: CommonService, private meta: Meta,private titleService: Title , private router: Router, private readonly route: ActivatedRoute,private CommonService: CommonService) {
    this.currentUrl = this.router.url.split('?')[0];
    this.changeHeader();
    this.route.params.subscribe(activeUrl => {
      this.currentUrl = window.location.pathname;


    });

    this.checkLogin()

    this.CommonService.isLoggedIn.subscribe((data: any) => {
      if (data.status === "1") {
        this.isUserLogin = true;
      }
    });
    this.CommonService.pageTitle.subscribe(
      (data: any) => {
        console.log('title changed', data);
        this.currentUrl = this.router.url.split('?')[0];
        this.newPageTitle = data.pageTitle;
        this.pageSubHeading = data.pageSubHeading;
        this.pageHeading = data.pageHeading;
        this.changeHeader();

      }
    );
  }
  checkLogin() {
    let FoundToken = localStorage.getItem('spotlead_auth_token');
    if(FoundToken && FoundToken!=''){
      this.isUserLogin = true;
    }
  }
  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
  public setMeta( desc: string) {
    this.meta.updateTag({ name: 'description', content: desc })
  }
  changeHeader() {
     if (this.currentUrl == '') {
      this.url = "home";
      this.pageTitle = 'Home';
      this.setTitle("SpotLeads Home")
      this.setMeta("Simplify your real estate search: SpotLeads is the platform where serious real estate clients meet real estate agents that are ready to help them find the property they’re looking for.")

    }
    if (this.currentUrl === '/') {
      this.url = "home";
      this.pageTitle = 'Home';
      this.setTitle("SpotLeads Home")
      this.setMeta("Simplify your real estate search: SpotLeads is the platform where serious real estate clients meet real estate agents that are ready to help them find the property they’re looking for.")
    }
    if (this.currentUrl === '/about') {
      this.url = "about";
      this.pageTitle = 'About';
      this.setTitle("About SpotLeads")
      this.setMeta("SpotLeads is bringing the “real” back to real estate. Whether you’re renting an apartment or looking for leads, our app is your connecting spot. ")
    }
    if (this.currentUrl === '/contact') {
      this.url = "contact";
      this.pageTitle = 'Contact';
    }
    if (this.currentUrl === '/add-more-packages') {
      this.url = "add-more-packages";    
      this.pageTitle = 'Add More Packages';
    }
    if (this.currentUrl === '/listing') {
      this.url = "listing";    
      this.pageTitle = 'Listing';
    }
    if (this.currentUrl === '/dashboard') {
      this.url = "dashboard";    
      this.pageTitle = 'Dashboard';
    }
    if (this.currentUrl === '/payment') {
      this.url = "payment";    
      this.pageTitle = 'Payment';
    }
    if (this.currentUrl === '/add-listing') {
      this.url = "add-listing";    
      this.pageTitle = this.newPageTitle;
    }
    if (this.currentUrl === '/user-profile') {
      this.url = "user-profile";    
      this.pageTitle = 'User Profile';
    }
    if (this.currentUrl === '/manage-subscription') {
      this.url = "manage-subscription";    
      this.pageTitle = 'Manage Subscription';
    }
    if (this.currentUrl === '/signin') {
      this.url = "signin";
      this.pageTitle = 'Sign in';
    }
    if (this.currentUrl === '/for-real-estate-clients') {
      this.url = "for-real-estate-clients";
      this.pageTitle = ' SpotLeads for Real Estate Buyers and Renters';
      this.setTitle(" SpotLeads for Real Estate Buyers and Renters")
      this.setMeta("The listings-free home rental and buying experience. Tell us what you want and we’ll take care of the rest.")

    }
    if (this.currentUrl === '/for-real-estate-agents') {
      this.url = "for-real-estate-agents";
      this.pageTitle = ' SpotLeads for Real Estate Agents';
      this.setTitle(" SpotLeads for Real Estate Agents")
      this.setMeta("SpotLeads helps real estate agents shift their focus from listings to leads.")

    }
    if (this.currentUrl == '/signup') {
      this.url = "signup";
      this.pageTitle = 'Sign up';
    }
    if (this.currentUrl == '/pricing') {
      this.url = "pricing";
      this.pageTitle = 'Pricing';
    }
    if (this.currentUrl == '/payment') {
      this.url = "payment";
      this.pageTitle = 'Payment';
    }
    if (this.currentUrl == '/user-profile') {
      this.url = "user-profile";
      this.pageTitle = 'User Profile';
    }
    if (this.currentUrl == '/unsubscribe') {
      this.url = "unsubscribe";
      this.pageTitle = 'Unsubscribe';
    }
    if (this.currentUrl == '/register') {
      this.url = "register";
      this.pageTitle = 'Register';
    }
    if (this.currentUrl == '/verification') {
      this.url = "verification";
      this.pageTitle = 'Verification';
    }
    if (this.currentUrl == '/listing') {
      this.url = "listing";
      this.pageTitle = 'My Listing';
    }

    if (this.currentUrl == '/list-detail') {
      this.url = "list-detail";
      this.pageTitle = 'list Detail';
    }

    if (this.currentUrl == '/add-listing') {
      this.url = "add-listing";
      // this.pageTitle = 'Add Listing';
      this.pageTitle = this.newPageTitle;
    }

    if (this.currentUrl == '/dashboard') {
      this.url = "dashboard";
      this.pageTitle = 'dashboard';
    }
    if (this.currentUrl == '/subscription-payment') {
      this.url = "subscription-payment";
      this.pageTitle = 'subscription-payment';
    }

    if (this.currentUrl == '/manage-subscription') {
      this.url = "manage-subscription";
      this.pageTitle = 'Manage subscription';
    }
    if (this.currentUrl == '/add-more-packages') {
      this.url = "add-more-packages";
      this.pageTitle = 'Add more packages';
    }
    if (this.currentUrl == '/add-more-subscription') {
      this.url = "add-more-subscription";
      this.pageTitle = 'Add more subscription';
    }     

    if (this.currentUrl == '/not-found') {
      this.url = "not-found";
      this.pageTitle = 'Not Found';
    }




  }


  signout() {
    localStorage.removeItem('spotlead_auth_token');
    localStorage.removeItem('spotlead_user');
    this.commonService.isLoggedIn.next({status:'0'});
    this.isUserLogin  =  false;
    this.router.navigate(['/signin']);
  }
  ngOnInit(): void {
  }

}
