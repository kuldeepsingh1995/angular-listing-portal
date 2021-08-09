import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
// import * as firebase from 'firebase';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { AngularFireModule } from "@angular/fire";
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CountryCodeService } from 'src/app/services/countryCode.service';
import { WindowService } from 'src/app/services/window.service';
import { CommonService } from 'src/app/services/common-services';
import { SubscriptionService } from 'src/app/services/subscription.service';
@Component({
  providers: [WindowService, UserService, CountryCodeService, SubscriptionService],
  selector: 'app-header-signin',
  templateUrl: './header-signin.component.html',
  styleUrls: ['./header-signin.component.css']
})
export class HeaderSigninComponent implements OnInit {
  user_type: any = 'I have a property'
  email: any = '';
  password: any = '';
  phone: any = '';
  emailFormErrors: any = '';
  emailFormSuccessMsg: any = '';
  phoneFormErrors: any = '';
  windowRef: any;
  isCaptchaVerified: any = false;
  currentProcess: any = 'captachVerifcation';
  countryCode: any = '+1';
  countryCodeList: any = [];
  phoneNumberFull: any = '';
  verificationCode: string;
  user: any = '' ;
  phoneFormSuccessMsg: any = '';
  loginDisable: any = false;
  constructor(
    public subscriptionSevice: SubscriptionService,
    public commonService: CommonService,
    public userService: UserService,
    public router: Router,
    public countryCodeListService: CountryCodeService,
    private angularFireAuth: AngularFireAuth, private win: WindowService
    ) {
      this.countryCodeList = this.countryCodeListService.getList();
    }

  ngOnInit(): void {
   setTimeout(() => {
     this.captchaInit();
   }, 1000);

  }
  assign_code(countryCode){
    this.countryCode = countryCode.code;
  }
  typeOfUser(){
    console.log(this.user_type)
    if(this.user_type=='I am here looking for a property'){
      setTimeout(() => {
        this.captchaInit();
      }, 500);
    }
  }
  captchaInit(){
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    console.log(this.windowRef.recaptchaVerifier)
    this.windowRef.recaptchaVerifier.render();
    this.windowRef.recaptchaVerifier.verify().then((resp) => {
      this.isCaptchaVerified = resp;
    });
  }
  signWithEmail() {
    this.emailFormErrors = '';
    if (this.email === '') {
      this.emailFormErrors = 'Email is required';
    }else if (this.password === '') {
      this.emailFormErrors = 'Email is required';
    } else{
      this.angularFireAuth
          .signInWithEmailAndPassword(this.email, this.password)
          .then((res: any) => {
            console.log(res, 'You are Successfully logged in!');
            // const uid = res.users[0].localId;
            const uid = res.user.uid;
            localStorage.setItem('spotlead_auth_token', uid);
            this.subscriptionSevice.searchSubscription(uid).subscribe((subscriptionResponse: any) => {
              
              console.log(subscriptionResponse, 'subscriptionResponse');
              if(subscriptionResponse.length > 0){
                this.userService.searchUser(uid)
                .subscribe((userResp: any) => {
                  this.emailFormSuccessMsg = 'You are Successfully logged in!';
                  this.changeSignStatus();
                  console.log(userResp);
                  
                  localStorage.setItem('spotlead_user', JSON.stringify(userResp[0]));
                  setTimeout( () => {
    
                    console.log('start moving to dashboard')
                    this.router.navigate(['/dashboard', {  }]);
    
                  }, 1000);
                });
              }else{
                this.loginDisable  = true;
              }
             
            })
           
          })
          .catch(err => {
          // console.log('Something is wrong:',err.message);
            this.emailFormErrors = err.message;
          });
    }
  }
   
  sendLoginCode() {
    this.phoneFormErrors  = '';
     if (this.isCaptchaVerified === false) {
      this.phoneFormErrors = 'Please verify captcha';
      return false;
    }
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.countryCode + this.phone;
    this.phoneNumberFull = num;
    this.angularFireAuth.signInWithPhoneNumber(num, appVerifier)
        .then(result => {
            this.windowRef.confirmationResult = result;
            this.currentProcess = 'CodeVerification';
        })
        .catch( error => {
          if (error.message == 'TOO_SHORT'){
              this.phoneFormErrors = 'Invalid Number';
          } else if (error.code == 'auth/too-many-requests'){
            this.phoneFormErrors = error.message;
          }
        });
  }
  verifyLoginCode() {
    this.windowRef.confirmationResult.confirm(this.verificationCode).then( result => {
      this.user = result.user;
      if (this.user) {
        const uid = this.user.uid;
        localStorage.setItem('spotlead_auth_token', uid);
        this.currentProcess = 'verificationDone';

        this.userService.searchUser(uid)
        .subscribe((userResp: any) => {
          this.phoneFormSuccessMsg = 'You are Successfully logged in!';
          this.changeSignStatus();
          localStorage.setItem('spotlead_user', JSON.stringify(userResp[0]));
          setTimeout(function() {
            this.router.navigate(['/dashboard']);

          }, 1000);
        });
       }
    })
    .catch( error => {
      this.phoneFormErrors = "Incorrect code entered ?";
    });
  }
  changeSignStatus(){
    this.commonService.isLoggedIn.next({status:'1'});
  }
}
