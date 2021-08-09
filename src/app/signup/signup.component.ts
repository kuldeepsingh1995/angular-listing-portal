import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private CommonService:CommonService) { 
  }

  ngOnInit() {

    this.CommonService.pageTitle.next({pageTitle:environment.home,pageHeading:environment.homeHeading,pageSubHeading:environment.homeSubHeading});
  }
  
}
