import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common-services';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private CommonService:CommonService) { }

  ngOnInit() {
    this.CommonService.pageTitle.next({pageTitle:environment.home,pageHeading:environment.homeHeading,pageSubHeading:environment.homeSubHeading});
  }

}
