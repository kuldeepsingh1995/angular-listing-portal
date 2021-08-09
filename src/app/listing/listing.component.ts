import { Component, OnInit } from '@angular/core';
import { ListingsService } from 'src/app/services/listings.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common-services';
import { UserService } from '../services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  providers: [ListingsService, UserService],
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  listData: any = [];
  selectedIds: any = []
  hideEdit: any = false;
  hideRenew: any = false;
  customCheck: any = []
  subcStatus: any = []
  searchParams: any = {
    sort: 'asc',
    where: []
  };
  page = 1;
  totalCount = 0;
  PER_PAGE = 6;
  displayOnlyMylisting: boolean = false;
  myUid: any = localStorage.getItem('spotlead_auth_token');
  mainError: any = ''
  mainSuccess: any = ''
  constructor(
    public firestore: AngularFirestore,
    public userService: UserService,
    public activatedRoute: ActivatedRoute, public commonService: CommonService, public router: Router, public listingService: ListingsService) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.onlyMy) {
        this.displayOnlyMylisting = true;
      }
    });
  }

  ngOnInit(): void {
    
    if (this.displayOnlyMylisting === true) {
      this.addWhere('uid', this.myUid);
      this.commonService.pageTitle.next({ pageTitle: 'Listing', pageHeading: 'Listing', pageSubHeading: 'Listing' });
    }else{
      this.commonService.pageTitle.next({ pageTitle: 'My Listing', pageHeading: 'My Listing', pageSubHeading: 'My Listing' });
    }
    this.search();
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
    if (confirm("Are you sure ?") === true) {

    if (this.selectedIds.length >= 1) {
      this.selectedIds.forEach((SId, index) => {
        let list = this.listData.find(({ id }) => id == SId);
        list.completed = 1;
        this.listingService.updateItem(list);
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
  }
  editListing() {
    this.mainError = ''
    if (this.selectedIds.length == 1) {
      let s_id = this.selectedIds[0]
      let list = this.listData.find(({ id }) => id == s_id);
      localStorage.setItem('editList', JSON.stringify(list));
      this.router.navigate(['/add-listing'], { queryParams: { 'edit': 1 } });
    } else if (this.selectedIds.length <= 0) {
      this.mainError = 'Select any listing'
    } else if (this.selectedIds.length > 1) {
      this.mainError = ''
    }
  }

  change_list(event) {
    this.searchParams.sort = event.target.value;
    this.search();
  }
  deleteListing() {
    if (confirm("Are you sure!") == true) {
      this.selectedIds.forEach((id, index) => {
        console.log(id, index)
        this.listingService.deleteItem(id)
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
    this.search();
  }

  removeWhere(key) {
    let findIndex = this.searchParams.where.findIndex(e => e.key == key);
    let condition: any = {};
    if (findIndex !== -1) {

      this.searchParams.where.splice(findIndex, 1);

    }
    this.search();
  }
  change_propertyType(event) {
    const FilterVal = event.target.value;
    if (FilterVal != "") {
      this.addWhere('propertyType', FilterVal);
    } else {
      this.removeWhere('propertyType')
    }
  }

  goToAddListingPage() {
    this.router.navigate(['/add-listing', {}]);
  }
  search() {
    this.listingService.search(this.searchParams).subscribe((data: any) => {
      let listData = data;
      console.log(listData, 'obj')

      listData.forEach((obj, index) => {
        this.customCheck[index] = false;
        if (typeof obj.subscriptionId !== 'undefined') {
          console.log(obj.subscriptionId, 'obj.subscriptionId')
          let dataSubc: any = this.firestore.collection('subscriptions').doc(obj.subscriptionId).valueChanges();
          dataSubc.subscribe(respSubc => {

            if (respSubc && respSubc.status == 'active') {
            } else {
              listData.splice(index, 1);
            }
          })
        } else {
          listData.splice(index, 1);
        }
      })

      setTimeout(() => {
        this.listData = listData;
        this.totalCount = listData.length;
        console.log(this.listData)
      }, 1000);
    });
  }
  viewListing(list: any) {
    this.router.navigate(['/list-detail'], { queryParams: { 'view': list.id } });
  }
  pageChanged($event) {
    this.page = $event;
  }
}
