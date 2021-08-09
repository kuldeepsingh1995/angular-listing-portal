import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../environments/environment";
import { CommonService } from '../services/common-services';
import { PackagesService } from '../services/packages.service';
import { UserService } from '../services/user.service';

@Component({
  providers: [PackagesService, UserService],
  selector: 'app-add-more-packages',
  templateUrl: './add-more-packages.component.html',
  styleUrls: ['./add-more-packages.component.css']
})
export class AddMorePackagesComponent implements OnInit {
  searchParams: any = {
    sort: 'asc',
    where: []
  };
  page = 1;
  totalCount = 0;
  PER_PAGE = 2;
  packages: any = []
  plan_period_monthly: any = false
  number_of_listng: any = 1
  user_type = '';
  public uid = localStorage.getItem('spotlead_auth_token');
  public showInput: any = false;
  public TempVarForPlan: any;
  constructor(
    public userService: UserService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public packagesService: PackagesService,
    private CommonService: CommonService
  ) { }

  submitSelectablePackage(){
    let plan   = this.TempVarForPlan;
    this.userService.searchWithId(this.uid).subscribe(resp => {
      if (resp.length > 0) {
        let currentUser = resp[0];
        this.router.navigate(['/add-more-subscription'], { queryParams: { plan_period_monthly: this.plan_period_monthly, plan_id: plan.id, uid: currentUser.uid, user_type: currentUser.user_type, number_of_agents: currentUser.number_of_agents, number_of_listng: this.number_of_listng } });
      }
    })
  }
  ngOnInit() {

    this.CommonService.pageTitle.next({ pageTitle: environment.home, pageHeading: environment.homeHeading, pageSubHeading: environment.homeSubHeading });
    this.search();

  }
  InputNoOfListing(plan) {
    this.TempVarForPlan = plan;
    this.showInput = true;
    // this.userService.searchWithId(this.uid).subscribe(resp => {
    //   if (resp.length > 0) {
    //     let currentUser = resp[0];
    //     this.router.navigate(['/subscription-payment'], { queryParams: { plan_period_monthly: this.plan_period_monthly, plan_id: plan.id, uid: currentUser.uid, user_type: currentUser.user_type, number_of_agents: currentUser.number_of_agents, number_of_listng: currentUser.number_of_listng } });
    //   }
    // })
  }
  selectPlan(plan, period=false){
  this.plan_period_monthly = period;
    this.userService.searchWithId(this.uid).subscribe(resp => {
      if (resp.length > 0) {
        let currentUser = resp[0];
        this.router.navigate(['/add-more-subscription'], { queryParams: { plan_period_monthly: this.plan_period_monthly, plan_id: plan.id, uid: currentUser.uid, user_type: currentUser.user_type, number_of_agents: currentUser.number_of_agents, number_of_listng: currentUser.number_of_listng } });
      }
    })
  }

  search() {
    this.packages = [];
    this.totalCount = 0;
    // this.activatedRoute.queryParams.subscribe(params => {
    // if (params.onlyMy) {

    this.userService.searchWithId(this.uid).subscribe(resp => {
     if (resp.length > 0) {
        let currentUser = resp[0];
        this.addWhere('user_type', currentUser.user_type);
        this.user_type = currentUser.user_type
        this.packagesService.search(this.searchParams).subscribe((data: any) => {
          console.log(data, 'packages live data');
          data.forEach((obj: any) => {
            if(this.user_type == 'real_estate_office'){
              if (Number(currentUser.number_of_agents) <= Number(obj.max_agent) && Number(currentUser.number_of_agents) >= Number(obj.min_agent)){
                this.packages.push(obj)    
              } else if('++' == obj.max_agent && Number(currentUser.number_of_agents) >= Number(obj.min_agent)){
                this.packages.push(obj)    
              }
            } else if(this.user_type == 'agent' || this.user_type == 'property_owner'){
              this.packages.push(obj)
            }
          })
          this.totalCount = this.packages.length;
        });  
      }

    })

    // }
    // });
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

}