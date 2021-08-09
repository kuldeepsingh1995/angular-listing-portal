import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import { CommonService } from '../services/common-services';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private CommonService:CommonService) { }

  ngOnInit() {
    this.CommonService.pageTitle.next({pageTitle:environment.about,pageHeading:environment.aboutHeading,pageSubHeading:environment.aboutSubHeading});
  }

}
