import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../services/file-uplaod.service';
import { UserService } from '../services/user.service';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { AngularFireModule } from "@angular/fire";
import { CommonService } from '../services/common-services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  providers: [UserService],
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  myUid: any = localStorage.getItem('spotlead_auth_token');
  spotlead_user: any = JSON.parse(localStorage.getItem('spotlead_user'));
  name = '';
  phone = '';
  address = '';
  email = '';
  profileURL = 'https://bootdey.com/img/Content/avatar/avatar7.png'
  errorMsg = ''
  successMsg = ''
  userFetch: any;
  uploadingImgStatus: any = '';
  oldEmail: any = ''
  current_password: any = ''
  new_password: any = ''
  confirm_password: any = ''
  passwordErrorMsg: any = ''
  passwordSuccessMsg = ''
  password = ''
  
  constructor(
    public router: Router,
    public commonService: CommonService,
    public uploadFile: FileUploadService,
    public userService: UserService,
  ) { 
    this.commonService.pageTitle.next({pageTitle: 'My Profile', pageHeading: 'My Profile', pageSubHeading:'My Profile'});
    let  currentUser = firebase.auth().currentUser;
    console.log(currentUser)
  }
  goToDashbaord(){

    this.router.navigate(['/dashboard']);
}
  changePassowrd() {
    if (confirm("Are you sure ?") === true) {

    this.passwordErrorMsg = '';
    this.passwordSuccessMsg = '';

    if (this.current_password == '') {
      this.passwordErrorMsg = 'Current password is required'
      return false;

    } else if (this.new_password == '') {
      this.passwordErrorMsg = 'New password is required'
      return false;

    } else if (this.confirm_password == '') {
      this.passwordErrorMsg = 'Confirm password is required'
      return false;

    }
    else if (this.new_password.length <= 6) {
      this.passwordErrorMsg = 'New password must be 6 characters long or more.'
      return false;

    }
    else if (this.current_password != this.password) {
      this.passwordErrorMsg = 'Current password is invalid'
      return false;

    }
    else if (this.confirm_password != this.new_password) {
      this.passwordErrorMsg = 'Confirm password and current password not matched..'
      return false;

    } else {
      let user = this.spotlead_user;
      user.password = this.password;
      //check if email changed 
      if (this.userFetch.password != '') {
        firebase.auth()
          .signInWithEmailAndPassword(this.email, this.userFetch.password)
          .then((userCredential: any) => {
            userCredential.user.updatePassword(this.new_password).then(() => {
              user.id = this.userFetch.id;
              localStorage.setItem('spotlead_user', JSON.stringify(user))
              this.userService.updateItem(user).then(() => {
                this.passwordSuccessMsg = "Password updated successfully"
                setTimeout(() => {
                  this.passwordSuccessMsg = ""
                  this.new_password = ''
                  this.current_password = ''
                  this.confirm_password = ''
                }, 1000);
              })
            })
          })
      }
    }
  }
  }
  onFileSelected(event) {
    this.uploadingImgStatus = '1';
    this.uploadFile.onFileSelected(event).then((resp) => {
      this.profileURL = resp
      this.uploadingImgStatus = '';
    });
  }
  bindInputs() {
    this.name = this.spotlead_user.name;
    this.address = this.spotlead_user.address;
    this.phone = this.spotlead_user.phone;
    this.email = this.spotlead_user.email;
    this.profileURL = this.spotlead_user.profileURL;
    this.oldEmail = this.spotlead_user.email;
    this.password = this.spotlead_user.password;
  }

  ngOnInit(): void {
    this.bindInputs()
    this.userService.searchWithId(this.myUid).subscribe(data => {
      this.userFetch = data[0]
    })
  }

  update_profile() {
    this.errorMsg = '';
    this.successMsg = '';
    if (confirm("Are you sure ?") === true) {

    if (this.name == '') {
      this.errorMsg = 'Name is required'
      return false;
    } else if (this.phone == '') {
      this.errorMsg = 'Phone is required'
      return false;
    } else if (this.email == '') {
      this.errorMsg = 'Email is required'
      return false;
    } else if (this.address == '') {
      this.errorMsg = 'Address is required'
      return false;
    } else {
      let user = this.spotlead_user;
      user.name = this.name;
      user.fullName = this.name;
      user.phone = this.phone;
      user.email = this.email;
      user.address = this.address;
      //check if email changed 
      if (this.oldEmail != this.email && this.userFetch.password != '') {
        firebase.auth()
          .signInWithEmailAndPassword(this.oldEmail, this.userFetch.password)
          .then((userCredential: any) => {
            userCredential.user.updateEmail(this.email)
          })
      }

      if (this.profileURL != 'https://bootdey.com/img/Content/avatar/avatar7.png') {
        user.profileURL = this.profileURL;
      }
      user.id = this.userFetch.id;
      localStorage.setItem('spotlead_user', JSON.stringify(user))
      this.userService.updateItem(user).then(() => {
       let  currentUser = firebase.auth().currentUser;
       currentUser.updateProfile({
        photoURL:  this.profileURL
      })
        this.successMsg = "Profile updated successfully"
        setTimeout(() => {
          this.successMsg = ""
        }, 1000);
      })
    }
    }
  }
}
