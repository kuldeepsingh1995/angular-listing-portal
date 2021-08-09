import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common-services';
import { UserService } from '../services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { isNumber } from 'util';

@Component({
  providers: [SubscriptionService, UserService],
  selector: 'app-manage-subscription',
  templateUrl: './manage-subscription.component.html',
  styleUrls: ['./manage-subscription.component.css']
})
export class ManageSubscriptionComponent implements OnInit {
  public user: any = JSON.parse(localStorage.getItem('spotlead_user'));

  isLoad: any = false;
  hasUnlimtedPlan: any = false;

  listData: any = [];
  selectedIds: any = []
  hideEdit: any = false;
  hideRenew: any = false;
  customCheck: any = []
  userStatus: any = []
  searchParams: any = {
    sort: 'asc',
    where: []
  };
  page = 1;
  totalCount = 0;
  PER_PAGE = 10;
  displayOnlyMylisting: boolean = false;
  myUid: any = localStorage.getItem('spotlead_auth_token');
  mainError: any = ''
  mainSuccess: any = ''
  subscSearchParams: any = {
    sort: 'asc',
    where: []
  };
  isDisplayCancelNotice: any = false;
  constructor(
    public firestore: AngularFirestore,
    public userService: UserService,
    public activatedRoute: ActivatedRoute, public commonService: CommonService, public router: Router, public subscriptionService: SubscriptionService) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.onlyMy) {
        // this.displayOnlyMylisting = true;
      }
    });
    
  }
   checkListingBalance() {
   console.log('uid', this.user.uid)
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
  timeStampToDate() {
    const currentDate       = new Date();
    const currentDayOfMonth = currentDate.getDate();
    const currentMonth      = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear       = currentDate.getFullYear();
    var monthNames          = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const dateString = currentDayOfMonth + " " + monthNames[currentMonth] + ", " + currentYear;
    return dateString;
  }
  ngOnInit(): void {
    this.commonService.pageTitle.next({ pageTitle: 'Subscriptions', pageHeading: 'Subscriptions', pageSubHeading: 'Subscriptions' });
    this.addWhere('uid', this.myUid);
    setTimeout(() => {
      this.search();
    }, 500);
    this.checkListingBalance()
  }
  selectSingle(event, list) {
    if (event.target.checked === true) {
      this.selectedIds.push(list.id)
    } else {
      let findIndex = this.selectedIds.findIndex((element) => element == list.id)
      this.selectedIds.splice(findIndex, 1)
    }
    if (this.selectedIds.length > 1) {
      this.hideEdit = true;
      this.hideRenew = true;
    } else {
      this.hideEdit = false;
      this.hideRenew = false;
    }
  }
  selectAll() {
    if (this.customCheck.every(val => val == true)) {
      this.customCheck.forEach((val, index) => {
        this.customCheck[index] = false;
      });
      this.hideEdit = false;
      this.hideRenew = false;
      this.selectedIds = [];
    } else {
      this.customCheck.forEach((val, index) => {
        this.customCheck[index] = true;
        this.selectedIds.push(this.listData[index].id)
      });
      this.hideEdit = true;
      this.hideRenew = true;

    }
  }
  logout() {
    localStorage.removeItem('spotlead_auth_token');
    localStorage.removeItem('spotlead_user');
    this.commonService.isLoggedIn.next({ status: '0' });
    this.router.navigate(['/signin']);
  }
  markAsCompleted() {
    this.mainError = ''
    this.mainSuccess = ''
    if (this.selectedIds.length >= 1) {
      this.selectedIds.forEach((SId, index) => {
        let list = this.listData.find(({ id }) => id == SId);
        list.completed = 1;
        this.subscriptionService.updateItem(list);
        this.selectedIds.splice(index, 1)
      })
      // setTimeout(() => {
      this.mainSuccess = 'Listing marked as completed successfully'
      setTimeout(() => {
        this.mainSuccess = ''
        // }, 500);
      }, 1500);
    } else if (this.selectedIds.length <= 0) {
      this.mainError = 'Select any listing'
    }
  }


  change_list(event) {
    this.searchParams.sort = event.target.value;
    setTimeout(() => {
      this.search();
    }, 500);
  }
  deleteListing() {
    if (confirm("Are you sure!") == true) {
      this.selectedIds.forEach((id, index) => {
        console.log(id, index)
        this.subscriptionService.deleteItem(id)
        this.selectedIds.splice(index, 1);
      })
    }
  }
  addWhere(key, value) {
    let findIndex = this.searchParams.where.findIndex(e => e.key == key);
    let condition: any = {};
    if (findIndex !== -1) {

      this.searchParams.where[findIndex].value = value;

    } else {

      condition = {
        key: key,
        value: value
      };
      this.searchParams.where.push(condition);

    }
    // this.search();
  }

  removeWhere(key) {
    let findIndex = this.searchParams.where.findIndex(e => e.key == key);
    let condition: any = {};
    if (findIndex !== -1) {

      this.searchParams.where.splice(findIndex, 1);

    }
  }
  change_propertyType(event) {
    const FilterVal = event.target.value;
    if (FilterVal != "") {
      this.addWhere('propertyType', FilterVal);
    } else {
      this.removeWhere('propertyType')
    }
    setTimeout(() => {
      this.search();
    }, 500);
  }

  goToAddListingPage() {
    this.router.navigate(['/add-listing', {}]);
  }
  search() {

    let dataArr = [];
    this.subscriptionService.search(this.searchParams).subscribe((data: any) => {
      dataArr = data;
      dataArr.forEach((obj, index) => {
        this.customCheck[index] = false;
        if (obj.status == 'pending') {
          dataArr.splice(index, 1);
        }
      })
      setTimeout(() => {
        this.totalCount = dataArr.length;
        this.listData = dataArr;        
        console.log(dataArr, 'dataArr')
      }, 1000);
      
    });
  }
  viewListing(list: any) {
    this.router.navigate(['/list-detail'], { queryParams: { 'view': list.id } });
  }
  pageChanged($event) {
    this.page = $event;
  }
  round2digit(numberInput) {
    var numb = numberInput;
    if(this.isInt(numb)){
      return numb;
    }
    else if(this.isFloat(numb)){
      return this.round2digit(numb);
    }
    else{
      return numb;
    }
  }
  isFloat(n){
      // return Number(n) === n && n % 1 !== 0;
      return n;
  }
  isInt(n) {
    return n;
    // return n % 1 === 0;
  }
  cancelSubscription(subscription) {
    if (confirm("Are you sure!") == true) {
      // call API here
      if (subscription.stripeSubscriptionId) {
        console.log(subscription)
        this.isDisplayCancelNotice  =true;
       this.subscriptionService.cancelSubscription(subscription).subscribe((resp: any) =>{
        console.log(resp);
       });
      } else{
        alert('Please try with new subscription, because stripe subscription id is not available');
      }

    } else {

    }
  }
  addMoreListing() {
    this.router.navigate(['/add-more-packages'], {});
  }
}