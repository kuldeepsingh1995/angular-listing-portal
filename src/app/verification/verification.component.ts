import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common-services';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  constructor(private CommonService:CommonService) { }

  ngOnInit() {
    this.CommonService.pageTitle.next({pageTitle:environment.home,pageHeading:environment.homeHeading,pageSubHeading:environment.homeSubHeading});
  }

}
