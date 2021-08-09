import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common-services';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private CommonService:CommonService) { }

  ngOnInit() {
    this.CommonService.pageTitle.next({pageTitle:environment.home,pageHeading:environment.homeHeading,pageSubHeading:environment.homeSubHeading});
  }


}
