import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {environment} from "../../environments/environment";
import { CommonService } from '../services/common-services';
import { PackagesService } from '../services/packages.service';

@Component({
  providers: [PackagesService],
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
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

  constructor(
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    public packagesService: PackagesService,
    private CommonService:CommonService
    ) { }

  initPricing(){
    const packages = [
      {
        max_agent:  25,
        min_agent: 11, 
        monthly_price: 450,
        title: "Plan 2",
        user_type: "real_estate_office",
        yearly_price: 3900
      },
      {
        additional_listing_price:  2.99,
        max_agent: '++',
        min_agent: 1, 
        monthly_price: 15,
        title: "Plan 2",
        user_type: "real_estate_office",
        package_type: 'selectable'
      },
      {
        max_agent:  25,
        min_agent: 11, 
        monthly_price: 450,
        title: "Plan 2",
        user_type: "real_estate_office",
        yearly_price: 3900
      },
    ]
  }


  ngOnInit() {
    this.CommonService.pageTitle.next({pageTitle:environment.home,pageHeading:environment.homeHeading,pageSubHeading:environment.homeSubHeading});
    this.search();

  }
  
  selectPlan(plan, period=false){
    this.plan_period_monthly = period;
    this.activatedRoute.queryParams.subscribe(params => {
      this.router.navigate(['/subscription-payment'], {queryParams: {plan_period_monthly: this.plan_period_monthly, plan_id: plan.id, uid: params.uid, user_type: params.user_type, number_of_agents: params.number_of_agents, number_of_listng: params.number_of_listng}});
    })
  }

  search(){
    this.packages = [];
    let packages = [];
    this.totalCount = 0;
    this.activatedRoute.queryParams.subscribe(params => {
      // if (params.onlyMy) {
        this.addWhere('user_type', params.user_type);
        this.user_type = params.user_type
        this.packagesService.search(this.searchParams).subscribe((data: any) => {
          data.forEach((obj: any) => {
            if(this.user_type == 'real_estate_office'){
              if (Number(params.number_of_agents) <= Number(obj.max_agent) && Number(params.number_of_agents) >= Number(obj.min_agent)){
                packages.push(obj)    
              } else if('++' == obj.max_agent && Number(params.number_of_agents) >= Number(obj.min_agent)){
                packages.push(obj)    
              }
            } else if(this.user_type == 'agent' || this.user_type == 'property_owner'){
              packages.push(obj)
            }
          })
          this.totalCount = packages.length;
          this.packages = packages;
        });        
      // }
    });
    console.log(this.packages, 'packages')
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
