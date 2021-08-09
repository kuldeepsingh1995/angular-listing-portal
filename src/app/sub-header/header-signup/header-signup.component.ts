import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { WindowService } from 'src/app/services/window.service';
import { AngularFireAuth } from "@angular/fire/auth";
// import * as firebase from 'firebase';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { AngularFireModule } from "@angular/fire";
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { CountryCodeService } from 'src/app/services/countryCode.service';
import { VERSION, ViewChild } from '@angular/core';
// import { Result } from '@zxing/library';
import {QrScannerComponent} from 'angular2-qrscanner';
import { Router } from '@angular/router';

@Component({
  providers: [WindowService, UserService, CountryCodeService],
  selector: 'app-header-signup',
  templateUrl: './header-signup.component.html',
  styleUrls: ['./header-signup.component.css'],
  encapsulation: ViewEncapsulation.None,

})
 

export class HeaderSignupComponent implements OnInit  {
  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;

  email: any = '';
  windowRef: any;
  phoneNumber: any;
  phoneNumberFull: any;
  verificationCode: string;
  user: any;
  countryCode: any = '+1';
  currentProcess: any = 'captachVerifcation';
  countryCodeList: any = [];
  userType: any = 'client';
  serverErrorMessage: any = '';
  brokerage_name: any = '';
  number_of_agents: any = '';
  number_of_listng: any = '';
  name: any = '';
  password: any = '';
  isCaptchaVerified: any = false;
  ErrorMsgBrokerForm: any = '';
  ErrorMsgNonAgentForm: any = '';
  ErrorMsgAgentForm: any = '';
  ErrorMsgAgentUnderOfficeForm: any = '';
  mobNumberPattern = "^[0-9]";  

  appLink: any = 'https://www.apple.com/in/app-store/';


 
  scanner: any;

  hasDevices: boolean;
  hasPermission: boolean;
  // qrResultString: string;
  // qrResult: Result;

  NotSupportedHTML: string;
  DeviceDefaultPrefix: string;
  StopCameraText: string;
  OpenButtonText: string;
  results: any = '';
  labels: any = [];
  user_type: any = 'I am here looking for a property'
  name_real_estate_office: any = ''
  constructor(
    public router: Router,
    public countryCodeListService: CountryCodeService,
    public userService: UserService,
    private angularFireAuth: AngularFireAuth, private win: WindowService) { 
    // firebase.initializeApp(environment.firebase);
      this.countryCodeList = this.countryCodeListService.getList();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.captchaInit();
    }, 500);
  }

  scanner_init(){
    this.qrScannerComponent.getMediaDevices().then(devices => {
      console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
              videoDevices.push(device);
          }
      }
      setTimeout(() => {
        if (videoDevices.length > 0){
          let choosenDev;
          for (const dev of videoDevices){

              if (dev.label.includes('back')){
                  choosenDev = dev;
                  break;
              }
          }
          if (choosenDev) {
              this.qrScannerComponent.chooseCamera.next(choosenDev);
          } else {
              this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
          }
        }
      }, 200);
  });
  this.results = 'something may start';
  this.qrScannerComponent.capturedQr.subscribe(result => {

    this.results = result;
  });

  }
  onScanSuccess(qrMessage) {
    //handle the scanned code as you like
    alert(`QR matched = ${qrMessage}`);
}
 onScanFailure(error) {
  // handle scan failure, usually better to ignore and keep scanning
  alert(`QR error = ${error}`);
}
  capturedQr(result: string) {
    this.results = result;
  }
  
  change_tab(tabName){
    this.userType = tabName;
    const $this = this;
    if (tabName === 'client') {
      setTimeout(function(){
        $this.captchaInit();
      }, 500);
    } else if(tabName === 'agents_under_office') {
      setTimeout(function(){
        $this.scanner_init();
      }, 500);
    }
  }
  typeOfUser(){
    if(this.user_type=='I am here looking for a property'){
      this.userType = 'client';
      setTimeout(() => {
        this.captchaInit();
      }, 500);
    } else {
      this.userType = 'agent';
    }
  }
  assign_code(countryCode){
    this.countryCode = countryCode.code;
  }

  captchaInit(){
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
    this.windowRef.recaptchaVerifier.verify().then((resp) => {
      this.isCaptchaVerified = resp;
    });
  }

  ngAfterViewInit(): void {

  }

  saveAgentUnderOffice() {
    this.ErrorMsgAgentUnderOfficeForm = '';
    if (this.name === '') {
      this.ErrorMsgAgentUnderOfficeForm = 'Name is required';
    } 
    else if (this.email === '') {
      this.ErrorMsgAgentUnderOfficeForm = 'Email is required';
    }
    else if (this.password === '') {
      this.ErrorMsgAgentUnderOfficeForm = 'Password is required';
    }
    else{
      // save form submission
      this.angularFireAuth
            .createUserWithEmailAndPassword(this.email, this.password)
            .then((res: any) => {
              const uid = res.user.uid;
              if (res.additionalUserInfo.isNewUser) {

                const PostData = {
                  user_type : this.userType,
                  uid: uid,
                  auth_type: 'email_password',
                  phone: '',
                  email: this.email,
                  password: this.password,
                  brokerage_name: this.brokerage_name,
                  number_of_agents: '',
                  name: this.name,
                  listingUploads: 0,
                };
                this.userService.addItem(PostData).then(() =>{
                  this.email = '';
                  this.password = '';
                  this.name = '';
                  this.brokerage_name = '';
                  this.currentProcess = 'verificationDone';
                  // this.router.navigate(['/pricing'], {queryParams: {uid: uid, user_type: this.userType, number_of_agents: this.number_of_agents, number_of_listng: this.number_of_listng}});

                });
              }
            })
            .catch(error => {
            this.ErrorMsgAgentUnderOfficeForm = error.message;
            });
    }
  }
  saveRealEstateOffice() {
    this.ErrorMsgBrokerForm = '';
    if (this.name === '') {
      this.ErrorMsgBrokerForm = 'Name is required';
    } 
    else if (this.email === '') {
      this.ErrorMsgBrokerForm = 'Email is required';
    }
    else if (this.password === '') {
      this.ErrorMsgBrokerForm = 'Password is required';
    }
    else if (this.name_real_estate_office === '') {
      this.ErrorMsgBrokerForm = 'Name of Real Estate office is required';
    }
    else if (this.number_of_agents === '') {
      this.ErrorMsgBrokerForm = 'Enter number of agents';
    }
    else{
      // save form submission
      this.angularFireAuth
            .createUserWithEmailAndPassword(this.email, this.password)
            .then((res: any) => {
              const uid = res.user.uid;
              if (res.additionalUserInfo.isNewUser) {

                const PostData = {
                  user_type : this.userType,
                  uid: uid,
                  auth_type: 'email_password',
                  phone: '',
                  email: this.email,
                  password: this.password,
                  brokerage_name: '',
                  name_real_estate_office: this.name_real_estate_office,
                  number_of_agents: this.number_of_agents,
                  name: this.name,
                  listingUploads: 0
                };
                this.userService.addItemWithDoc(uid, PostData).then((data) =>{
                  this.email = '';
                  this.password = '';
                  // this.brokerage_name = '';
                  this.name_real_estate_office = ''
                  // this.number_of_agents = '';
                  this.name = '';
                  // this.currentProcess = 'verificationDone';
                  this.router.navigate(['/pricing'], {queryParams: {uid: uid, user_type: this.userType, number_of_agents: this.number_of_agents, number_of_listng: this.number_of_listng}});

                });
              }
            })
            .catch(error => {
            console.log('Something is wrong:', error.message);
            this.ErrorMsgBrokerForm = error.message;
            });
    }
  }
  saveAgent() {
    this.ErrorMsgAgentForm = '';
    if (this.name === '') {
      this.ErrorMsgAgentForm = 'Name is required';
    }
    else if (this.brokerage_name === '') {
      this.ErrorMsgAgentForm = 'Brokerage is required';
    }
    else if (this.email === '') {
      this.ErrorMsgAgentForm = 'Email is required';
    }
    else if (this.password === '') {
      this.ErrorMsgAgentForm = 'Password is required';
    }
    else if (this.number_of_listng === '') {
      this.ErrorMsgAgentForm = 'Number of list is required';
    }
    // else if (!  isNaN(this.number_of_listng)) {
    //    this.ErrorMsgAgentForm = 'Number of listing should in numeric';
    // }
    else{
      // save form submission
      let timeNow = new Date();


      this.angularFireAuth
            .createUserWithEmailAndPassword(this.email, this.password)
            .then((res: any) => {
              const uid = res.user.uid;

              res.user.updateProfile({
                displayName: this.name
              })
              console.log(res, 'res')
              if (res.additionalUserInfo.isNewUser){
                const PostData = {
                  user_type : this.userType,
                  uid: uid,
                  auth_type: 'email_password',
                  phone: '',
                  email: this.email,
                  password: this.password,
                  brokerage_name: this.brokerage_name,
                  brokerage: this.brokerage_name,
                  number_of_agents: '',
                  number_of_listng: this.number_of_listng,
                  name: this.name,
                  listingUploads: 0,
                  fullName: this.name,
                  profileURL: '',
                  myListings: [],
                  isClient: false,
                  fcmToken : "",
                  commercial : false,
                  bedrooms : 0,
                  bathrooms : 0,
                  renter : true,
                  propertyType : "Apartment",
                  startingDate : timeNow.getTime(),
                  price : 0,
                  location : [],
                  size: 0,
                  amenities: [],
                 // Broker
                  isPaid: false,
                  rating:  0,
                  about: "",
                };
                this.userService.addItemWithDoc(uid, PostData).then(() =>{
                  this.email = '';
                  this.password = '';
                  this.name = '';
                  this.brokerage_name = ''
                  // this.number_of_listng = ''
                  // this.currentProcess = 'verificationDone';
                  this.router.navigate(['/pricing'], {queryParams: {uid: uid, user_type: this.userType, number_of_agents: this.number_of_agents, number_of_listng: this.number_of_listng}});

                });
              }
            })
            .catch(error => {
            console.log('Something is wrong:', error.message);
            this.ErrorMsgAgentForm = error.message;
            });
    }
  }
  saveNonAgent() {
    this.ErrorMsgNonAgentForm = '';

    if (this.name === '') {
      this.ErrorMsgNonAgentForm = 'Name is required';
    }

    else if (this.email === '') {
      this.ErrorMsgNonAgentForm = 'Email is required';
    }

    else if (this.password === '') {
      this.ErrorMsgNonAgentForm = 'Password is required';
    }
    
    else if (this.number_of_listng === '') {
      this.ErrorMsgNonAgentForm = 'Enter number of listing';
    }

    else{
      // save form submission

      const PostData = {
        user_type: this.userType,
        email: this.email,
        password: this.password,
        number_of_listng: this. number_of_listng,
        name: this.name
      };
      let timeNow = new Date();

      this.angularFireAuth
            .createUserWithEmailAndPassword(this.email, this.password)
            .then((res: any) => {
              const uid = res.user.uid;
              res.user.updateProfile({
                displayName: this.name
              })
              if (res.additionalUserInfo.isNewUser){
                const PostData = {
                  user_type : this.userType,
                  uid: uid,
                  auth_type: 'email_password',
                  phone: '',
                  email: this.email,
                  password: this.password,
                  brokerage_name: '',
                  number_of_agents: '',
                  number_of_listng: this.number_of_listng,
                  name: this.name,
                  listingUploads: 0,
                  fullName: this.name,
                  profileURL: '',
                  myListings: [],
                  isClient: false,
                  fcmToken : "",
                  commercial : false,
                  bedrooms : 0,
                  bathrooms : 0,
                  renter : true,
                  propertyType : "Apartment",
                  startingDate : timeNow.getTime(),
                  price : 0,
                  location : [],
                  size: 0,
                  amenities: [],
                  isPaid: false,
                 // Broker
                  brokerage: this.name,
                  rating:  0,
                  about: "",
                };
                this.userService.addItemWithDoc(uid, PostData).then(() =>{
                  
                  // this.currentProcess = 'verificationDone';
                  this.router.navigate(['/pricing'], {queryParams: {uid: uid, user_type: this.userType, number_of_agents: this.number_of_agents, number_of_listng: this.number_of_listng}});
                  // this.number_of_listng = '';
                  this.email = '';
                  this.password = '';

                  this.name = '';
                });
              }
            })
            .catch(error => {
            console.log('Something is wrong:', error.message);
            this.ErrorMsgNonAgentForm = error.message;
            });
    }
  }
  

  sendLoginCode() {
    this.serverErrorMessage  = '';
    if (this.isCaptchaVerified === false) {
      this.serverErrorMessage = 'Please verify captcha';
      return false;
    }
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.countryCode + this.phoneNumber;
    this.phoneNumberFull = num;
    this.angularFireAuth.signInWithPhoneNumber(num, appVerifier)
        .then(result => {
            this.windowRef.confirmationResult = result;
            this.currentProcess = 'CodeVerification';
        })
        .catch( error => {
          if (error.message == 'TOO_SHORT'){
              this.serverErrorMessage = 'Invalid Number';
          } else if (error.code == 'auth/too-many-requests'){
            this.serverErrorMessage = error.message;
          }
        });
  }

  verifyLoginCode() {
    let timeNow = new Date();
    
    this.windowRef.confirmationResult.confirm(this.verificationCode).then( result => {
      this.user = result.user;
      if (this.user) {
        const uid = this.user.uid;
        const PostData = {
          user_type : this.userType,
          uid: uid,
          auth_type: 'phone',
          phone: this.phoneNumberFull,
          fullName: this.name,
          profileURL: '',
          myListings: {},
          isClient: true,
          fcmToken : "",
          commercial : false,
          bedrooms : 0,
          bathrooms : 0,
          renter : true,
          propertyType : "Apartment",
          startingDate : timeNow.getTime(),
          price : 0,
          location : [],
          size: 0,
          amenities: [],
          // Broker
          brokerage: "",
          rating:  0,
          about: "",
        };
        this.userService.addItemWithDoc(uid, PostData).then(() =>{
          this.currentProcess = 'verificationDone';
        });
      }
    })
    .catch( error => {
      this.serverErrorMessage = "Incorrect code entered ?";
    });
  }
}
