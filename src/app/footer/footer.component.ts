import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from 'src/environments/environment';
import {CommonService} from '../services/common-services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  goUp($event){
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }
  environment = environment;
  currentUrl = '';
  hideFooter: boolean = false;
  url: string = "";
  pageTitle: string = "";

  pageHeading: string | '';
  pageSubHeading: string | '';

  constructor(private router: Router, private readonly route: ActivatedRoute, private CommonService: CommonService) {
    this.currentUrl = this.router.url.split('?')[0];
    this.changeHeader();
    this.route.params.subscribe(activeUrl => {
      this.currentUrl = window.location.pathname;


    });


    this.CommonService.pageTitle.subscribe(
      (data: any) => {
        console.log('title changed');
        this.currentUrl = this.router.url.split('?')[0];

        this.pageSubHeading = data.pageSubHeading;
        this.pageHeading = data.pageHeading;
        this.changeHeader();

      }
    );
  }

  changeHeader() {
    console.log(this.currentUrl);
    if (this.currentUrl == '') {
      this.url = "home";
      this.pageTitle = 'Home';
    }
    if (this.currentUrl == '/about') {
      this.url = "about";
      this.pageTitle = 'About';
    }
    if (this.currentUrl == '/contact') {
      this.url = "contact";
      this.pageTitle = 'Contact';
    }
    if (this.currentUrl == '/signin') {
      this.url = "signin";
      this.pageTitle = 'Sign in';
      this.hideFooter = true
    }
    if (this.currentUrl == '/signup') {
      this.url = "signup";
      this.pageTitle = 'Sign up';
      this.hideFooter = true
    }
    if (this.currentUrl == '/register') {
      this.url = "register";
      this.pageTitle = 'Register';
      this.hideFooter = true
    }
    if (this.currentUrl == '/verification') {
      this.url = "verification";
      this.pageTitle = 'Verification';
      this.hideFooter = true
    }
    if (this.currentUrl == '/not-found' || this.currentUrl == '/add-listing') {
      this.url = "not-found";
      this.pageTitle = 'Not found';
      this.hideFooter = true
    }


    if (this.currentUrl == '/login' || this.currentUrl == '/register') {
      /* this.compare_mortage_page = true; */
      this.hideFooter = true;

      this.pageTitle = '';


    }

    //console.log(currentUrl);
    if (this.currentUrl == '/') {
      //this.page_load = false;
    }
  }



  ngOnInit() {
  }
}
