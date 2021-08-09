import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { environment } from '../../environments/environment';
import { CommonService } from '../services/common-services';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';
import { Subscription } from 'src/entities/subscription';
import { Route } from '@angular/compiler/src/core';
declare var Stripe: any;
var elementClasses = {
  focus: 'focus',
  empty: 'empty',
  invalid: 'invalid',
};
var style = {
  base: {
    iconColor: "#fff",
    color: "#fff",
    fontWeight: 400,
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: "16px",
    fontSmoothing: "antialiased",

    "::placeholder": {
      color: "#BFAEF6"
    },
    ":-webkit-autofill": {
      color: "#fce883"
    }
  },
  invalid: {
    iconColor: "#FFC7EE",
    color: "#FFC7EE"
  }
};
const stripe = Stripe('pk_test_51IJaTjGXe5R5tBGRIpux6kKz2PS6Bund59S9AX9E0HtERL5pzPsgOghmYzA3PmcesXJr8XJ1bqTGoEXlH81BlK0j00UwJN0Nke');
const elements = stripe.elements({ fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css?family=Quicksand',
    },
  ],
  locale: 'auto'});
const card = elements.create('card',{hidePostalCode: true, iconStyle: "solid",  style:style , classes: elementClasses,});
@Component({
  providers: [PaymentService, SubscriptionService],
  selector: 'app-add-more-subscription',
  templateUrl: './add-more-subscription.component.html',
  styleUrls: ['./add-more-subscription.component.css']
})
export class AddMoreSubscriptionComponent implements OnInit {

  @ViewChild('cardForm') cardForm: ElementRef;
  handler: any;
  loading: any = true;
  public paymentStatus: any = '';
  public selectedPlan: any;
  public additionalList: any = [];
  chargeAmount: any;
  packageTitle: any;
  stripeError: any = ''
  public additionalData: any = {
    name:'',
    address_line1: '',
    address_city: '',
    address_state: '',
    address_zip: '',
  };
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public commonService: CommonService,
    public pmt: PaymentService,
    public firestore: AngularFirestore,
    public subscriptonService: SubscriptionService
  ) {


  }
  ngAfterViewInit(): void {
    this.configHandler();
    this.getPrice()
    console.log('ngOnInit Loads')
    this.commonService.pageTitle.next({ pageTitle: environment.home, pageHeading: environment.homeHeading, pageSubHeading: environment.homeSubHeading });
   



  }
  ngOnInit(): void {
  }
  configHandler() {
    card.mount(this.cardForm.nativeElement)
  }
  showAndRedirect(){
    this.paymentStatus = 'active';
    if(this.paymentStatus=='active'){
      setTimeout(() => {
        this.router.navigate(['/manage-subscription'], {});
      }, 3000);
    }
  }
  getPrice() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.firestore.collection('packages').doc(params.plan_id).get().subscribe((data: any) => {
        if (data) {
          this.selectedPlan = data.data();
          if (this.selectedPlan.user_type == 'real_estate_office') {
            this.chargeAmount = (params.plan_period_monthly == "true" ? this.selectedPlan.monthly_price : this.selectedPlan.yearly_price);
          }
          if (this.selectedPlan.user_type == 'property_owner' || this.selectedPlan.user_type == 'agent') {
            if (this.selectedPlan.package_type == 'unlimited') {
              this.chargeAmount = (params.plan_period_monthly == "true" ? this.selectedPlan.monthly_price : this.selectedPlan.yearly_price);
            } else if (this.selectedPlan.package_type == 'selectable') {
              const addtionalListCount = Number(params.number_of_listng);
              this.chargeAmount = Number(this.selectedPlan.additional_listing_price * addtionalListCount);
            }
          }
        }
      });
    })
  }
  AddTempSubscription(token){
     
    this.additionalList = []
    this.activatedRoute.queryParams.subscribe(params => {
     
      this.firestore.collection('packages').doc(params.plan_id).get().subscribe((data: any) => {
        if (data) {
          this.selectedPlan = data.data();
          console.log(this.selectedPlan, 'selectedPlans')


          let PostData: any;
          let timeNow =  new Date().getTime();
          let planIds = [];

          if (this.selectedPlan.user_type == 'real_estate_office') {
            this.chargeAmount = (params.plan_period_monthly == "true" ? this.selectedPlan.monthly_price : this.selectedPlan.yearly_price);
            this.packageTitle = this.selectedPlan.title;
            planIds.push({
              price: (params.plan_period_monthly == "true" ? this.selectedPlan.monthly_plan_id : this.selectedPlan.yearly_plan_id),
            })
            PostData = {
              number_of_listng: 'unlimited',
              number_of_agents: params.number_of_agents,
              price: this.chargeAmount,
              title: this.selectedPlan.title,
              user_type: this.selectedPlan.user_type,
              period_type: (params.plan_period_monthly == "true" ? 'Monthly' : 'Yearly'),
              uid: params.uid,
              plan_id: params.plan_id,
              stripe_plan_id: planIds,
              status: 'pending',
              time: timeNow,
              token: token
            };
            this.subscriptonService.addItem(PostData);
            this.showAndRedirect()
           }
           if (this.selectedPlan.user_type == 'property_owner' || this.selectedPlan.user_type == 'agent') {
            if (this.selectedPlan.package_type == 'unlimited') {
              planIds.push({
                price: (params.plan_period_monthly == "true" ? this.selectedPlan.monthly_plan_id : this.selectedPlan.yearly_plan_id),
              })
              this.chargeAmount = (params.plan_period_monthly == "true" ? this.selectedPlan.monthly_price : this.selectedPlan.yearly_price);
              this.packageTitle = this.selectedPlan.title;
              PostData = {
                number_of_listng: 'unlimited',
                // number_of_agents: params.number_of_agents,
                price: this.chargeAmount,
                title: this.selectedPlan.title,
                user_type: this.selectedPlan.user_type,
                period_type: (params.plan_period_monthly == "true" ? 'Monthly' : 'Yearly'),
                uid: params.uid,
                plan_id: params.plan_id,
                stripe_plan_id: planIds,
                status: 'pending',
                time: timeNow,
                token: token
              };

              this.subscriptonService.addItem(PostData);
              this.showAndRedirect()
             } else if (this.selectedPlan.package_type == 'selectable') {
              console.log('in property_owner 2' )
              const addtionalListCount = params.number_of_listng;
              this.chargeAmount =  Number(this.selectedPlan.additional_listing_price * addtionalListCount);
              this.packageTitle = this.selectedPlan.title;
              // planIds.push({
              //   price:  this.selectedPlan.additional_montly_plan_id,
              // })

              this.additionalList.push(this.selectedPlan.additional_montly_plan_id)

              // for (let index = 1; index <= addtionalListCount; index++) {
              //    planIds.push({
              //     price:  this.selectedPlan.additional_montly_plan_id,
              //   })
              // }
              // if (Number(params.number_of_listng) > 1) {
                // for (let index = 1; index <= addtionalListCount; index++) {
                planIds.push({
                  id: '',
                  price: this.selectedPlan.additional_montly_plan_id,
                  quantity: addtionalListCount,
                })
                // }
              // }

              PostData = {
                number_of_listng: params.number_of_listng,
                // number_of_agents: params.number_of_agents,
                additional_listing: addtionalListCount,
                additional_listing_price: this.selectedPlan.additional_listing_price,
                additional_montly_plan_id: this.selectedPlan.additional_montly_plan_id,
                price: this.chargeAmount,
                title: this.selectedPlan.title,
                user_type: this.selectedPlan.user_type,
                period_type: 'Monthly',
                uid: params.uid,
                plan_id: params.plan_id,
                stripe_plan_id: planIds,
                status: 'pending',
                time: timeNow,
                token: token
              };
              this.subscriptonService.addItem(PostData);
              this.showAndRedirect()
             }

          }


        }

      });

    })
  }
  async handleForm(){
    if(confirm("Are you sure that you want to proceed with the payment ?") === true) {
      this.stripeError = '';
      stripe.createToken(card, this.additionalData).then(resp => {
        if(resp.token){
          // this.pmt.processPayment(resp.token)
          this.AddTempSubscription(resp.token.id);
        }
      }).catch((err) => {
        this.stripeError =  'Something is wrong:'+ err;
      });
    }
  }
 
}
