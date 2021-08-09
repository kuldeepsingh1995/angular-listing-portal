import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import { CommonService } from '../services/common-services';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private CommonService:CommonService) { }

  ngOnInit() {
    this.CommonService.pageTitle.next({pageTitle:environment.home,pageHeading:environment.homeHeading,pageSubHeading:environment.homeSubHeading});
  }

}
