import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-services';
import { ListingsService } from 'src/app/services/listings.service';
import { Listings } from 'src/entities/listings';
import { FileUploadService } from 'src/app/services/file-uplaod.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { SubscriptionService } from '../services/subscription.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Location } from '@angular/common'

@Component({
  providers: [ListingsService, Listings, FileUploadService, UserService, SubscriptionService],
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css']
})
export class AddListingComponent implements OnInit {
  successMessage: any = '';
  uploadedFiles: any = [];
  uploadingImgStatus: any = '';
  editMode: boolean = false;
  EditData: any = [];
  public listingUploads: any = 0;
  searchParams: any = {
    sort: 'asc',
    where: []
  };
  subscSearchParams: any = {
    sort: 'asc',
    where: []
  };
  allowToAddNewList: any = true;
  allowedSubscripton: any;
  selectedItems = [];
  dropdownList = [
    'Dog Friendly',
    'Cat Friendly',
    'Pet Friendly',
    'Washer / Dryer',
    'Laundary in Building',
    'Balcony',
    'Outdoor space',
    'Dishwasher',
    'Doorman',
    'Gym',
    'Rooftop',
    'Elevator',
    
];
  dropdownSettings = {};
  constructor(
    public location: Location,
    public subscriptionService: SubscriptionService,
    public firestore: AngularFirestore,
    public userService: UserService,
    public router: Router, public route: ActivatedRoute, public uploadFile: FileUploadService, public listingService: ListingsService, public listingModel: Listings, public commonService: CommonService,) {

     
               
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.route.queryParams.subscribe(params => {
      if (params.edit) {
        this.commonService.pageTitle.next({pageTitle:'Edit listing',pageHeading: 'Edit Listing',pageSubHeading:'Edit Listing'});
        this.editMode = true;
        this.EditData = JSON.parse(localStorage.getItem('editList'));
        this.listingModel = this.EditData;
        this.uploadedFiles = this.EditData.images;
      }else{
        this.commonService.pageTitle.next({pageTitle:'Upload new listing',pageHeading: 'Add Listing',pageSubHeading:'Add Listing'});
        if(localStorage.getItem('add_list_temp_data')){
          this.listingModel = JSON.parse(localStorage.getItem('add_list_temp_data'));
          this.uploadedFiles = this.listingModel.images;
        }
        
      }
    });
    let uid = localStorage.getItem('spotlead_auth_token');
    this.userService.getItem(uid).subscribe((data: any) => {
      this.listingUploads = data.listingUploads;
    })
    this.addWhere2('uid', uid);
    setTimeout(() => {
      this.subscriptionService.search(this.subscSearchParams).subscribe((data: any) => {
        if (data && data.length > 0) {

          for (let index = 0; index <= data.length; index++) {
            const subsc = data[index];
            if (subsc.status == 'active' && subsc.listingUploads > 0) {
              this.allowToAddNewList = true;
              this.allowedSubscripton = subsc;
              break;
            } else if (subsc.status == 'active' && subsc.listingUploads == 'unlimited') {
              this.allowToAddNewList = true;
              this.allowedSubscripton = subsc;
              break;
            } else {
              this.allowToAddNewList = false;
            }

          }
          console.log(this.allowedSubscripton, 'subsc')
        }

      })
    }, 500);




  }

  saveTempData(){
    if (this.editMode !== true) {
    localStorage.setItem('add_list_temp_data', JSON.stringify(this.listingModel));
    }
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
  }

  removeWhere(key) {
    let findIndex = this.searchParams.where.findIndex(e => e.key == key);
    let condition: any = {};
    if (findIndex !== -1) {

      this.searchParams.where.splice(findIndex, 1);

    }
  }
  onFileSelected(event) {
    this.uploadingImgStatus = '1';
    this.uploadFile.onFileSelected(event).then((resp) => {
      this.uploadedFiles.push(resp);
      this.listingModel.images = this.uploadedFiles;
      this.saveTempData();
      this.uploadingImgStatus = '';
    });
  }
  submitForm(myForm) {
    if (confirm("Are you sure ?") === true) {
      if (this.allowToAddNewList == false) {
        return false;
      }
      let today = new Date();
      let nowTime = today.getTime();
      this.listingModel.startingDate = nowTime;
      this.listingModel.images = this.uploadedFiles;
      let uid = localStorage.getItem('spotlead_auth_token');
      this.listingModel.uid = uid;

      const SaveObject: any = { ...this.listingModel };
      if(this.allowedSubscripton){
        SaveObject.subscriptionId = this.allowedSubscripton.id;
      }
      this.listingService.addItem(SaveObject).then(() => {
        if (this.editMode !== true) {
          localStorage.removeItem('add_list_temp_data');
        }
        myForm.reset();
        this.uploadedFiles = [];
        setTimeout(() => {
          this.successMessage = 'Listing Added Successfully';
          if (this.allowedSubscripton.listingUploads == 'unlimited') {
            if(!this.listingUploads){
              this.listingUploads = 0;
            }
            this.firestore.collection('users').doc(uid).update({
              listingUploads: (Number(this.listingUploads) + 1)
            })
            setTimeout(() => {
              this.router.navigate(['/listing'], { queryParams: { onlyMy: 1 } });
            
            }, 1500);
            // setTimeout(() => {
            //   this.router.navigate(['/listing']);
            // }, 500);
          } else {
            // this.searchParams.where('uid', uid);

            this.firestore.collection('subscriptions').doc(this.allowedSubscripton.id).update({
              listingUploads: (Number(this.allowedSubscripton.listingUploads) - 1)
            })
          
           
            setTimeout(() => {
              this.router.navigate(['/listing'], { queryParams: { onlyMy: 1 } });
            
            }, 1500);

           
            return false;
            // this.listingService.search(this.searchParams).subscribe((data: any) => {
            //   if (data && data.length > 0) {
            //     data.forEach((subsc, index) => {
            //       if (subsc.status == 'active' && subsc.listingUploads > 0) {
            //         let subscriptionId = subsc.id;
            //         this.firestore.collection('subscriptions').doc(subscriptionId).update({
            //           listingUploads: (Number(this.listingUploads) - 1)
            //         })
            //         this.successMessage = 'Listing Added Successfully';
            //         setTimeout(() => {
            //           this.router.navigate(['/listing']);
            //         }, 500);
            //         return false;
            //       }
            //     });
            //   }
            // })



          }



        }, 500);
      });
    }

  }
  goToDashbaord(){
    this.location.back()
        this.router.navigate(['/dashboard']);
  }

  submiteditForm(myForm) {
    if (confirm("Are you sure ?") === true) {

    let today = new Date();
    this.listingModel.images = this.uploadedFiles;
    const SaveObject = { ...this.listingModel };
    this.listingService.updateItem(SaveObject).then(() => {
      myForm.reset();
      this.uploadedFiles = [];
      this.successMessage = 'Listing updated Successfully';

      setTimeout(() => {
        this.router.navigate(['/listing'], { queryParams: { onlyMy: 1 } });
      }, 500);
    });
  }
  }

  setCommerical(propertyType) {
    if (propertyType === 'Residential') {
      this.listingModel.commercial = false;
    } else if (propertyType === 'Commercial') {
      this.listingModel.commercial = true;
    }
    this.saveTempData()
  }

  setRenter(value) {
    if (value === 'Renting') {
      this.listingModel.renter = true;
    } else if (value === 'Buying') {
      this.listingModel.renter = false;
    }
    this.saveTempData()
  }

  setNumberofBedrooms(no_of) {
    this.listingModel.bedrooms = no_of;
    this.saveTempData()
  }
  setNumberofBathrooms(no_of) {
    this.listingModel.bathrooms = no_of;
    this.saveTempData()
  }

  ngOnInit(): void {
    if (this.editMode === true) {
      this.commonService.pageTitle.next({ pageTitle: 'Update Listing', pageHeading: 'Update Listing', pageSubHeading: 'Update Listing' });
    } else {
      this.commonService.pageTitle.next({ pageTitle: 'Add Listing', pageHeading: 'Add Listing', pageSubHeading: 'Add Listing' });
    }
  }

}
