import { Component, OnInit } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { CommonService } from 'src/app/services/common-services';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../services/user.service';
import { SubscriptionService } from '../services/subscription.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { PackagesService } from '../services/packages.service';

@Component({
  providers: [PackagesService,UserService, SubscriptionService],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public user: any = JSON.parse(localStorage.getItem('spotlead_user'));
  public ifBalance: any = 0;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '';
  hasUnlimtedPlan: any = false;
  subscSearchParams: any = {
    sort: 'asc',
    where: []
  };
  isLoad: any = false;
  listingBalance: any = 0;
  constructor(
    public packageService: PackagesService,
    public Auth: AngularFireAuth,
    public subscriptionService: SubscriptionService,
    public userService: UserService,
    public firestore: AngularFirestore,
    private router: Router, public commonService: CommonService) { }

  ngOnInit(): void {
    this.value = this.user.uid;
    this.commonService.pageTitle.next({ pageTitle: 'Dashboard', pageHeading: 'Dashboard', pageSubHeading: 'Dashboard' });
    this.checkListingBalance();
    this.Auth.authState.subscribe((user: any) => {
        console.log(user, 'user')
    })
    //  this.packageService.init_();
    
  }

  checkListingBalance() {
    this.userService.searchWithId(this.value).subscribe(data => {
      if (data[0]) {
        if (data[0].listingUploads == 'unlimited') {
          this.ifBalance = data[0].listingUploads;
        } else {
          this.ifBalance = Number(data[0].listingUploads);
        }
      }
    })
    this.addWhere2('uid', this.user.uid);
    let listingBalance: any = 0;
    setTimeout(() => {
      this.subscriptionService.search(this.subscSearchParams).subscribe(data => {
        if (data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.totalListings == 'unlimited' && element.status == 'active') {
              this.hasUnlimtedPlan = true;
              listingBalance = 'unlimited';
              break;
            }
            else if (element.totalListings != 'unlimited' && element.status == 'active') {
              listingBalance += Number(element.listingUploads);

            }
          }
        }
        this.isLoad = true;
        this.listingBalance = listingBalance;
      });
    }, 100);


  }
  addWhere2(key, value) {
    let findIndex = this.subscSearchParams.where.findIndex(e => e.key == key);
    let condition: any = {};
    if (findIndex !== -1) {

      this.subscSearchParams.where[findIndex].value = value;

    } else {

      condition = {
        key: key,
        value: value
      };
      this.subscSearchParams.where.push(condition);

    }
  }
  goToAddListingPage() {
    this.router.navigate(['/add-listing', {}]);
  }

  AllListingPage() {
    this.router.navigate(['/listing', {}]);
  }

  MyListingPage() {
    this.router.navigate(['/listing'], { queryParams: { onlyMy: 1 } });
  }
  MyProfilePage() {
    this.router.navigate(['/user-profile'], {});
  }
  ManageSubscription() {
    this.router.navigate(['/manage-subscription'], {});
  }
  addMoreListing() {
    this.router.navigate(['/add-more-packages'], {});
  }
}
