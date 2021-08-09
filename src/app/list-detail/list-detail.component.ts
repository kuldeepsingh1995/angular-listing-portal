import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ListingsService } from 'src/app/services/listings.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  providers: [ListingsService, UserService],
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit {
  searchParams: any = {
    sort: 'asc',
    where: []
  }; 
  listData: any = false;
  listtingAgent: any = false;
  constructor(public userService: UserService, public listingService: ListingsService ,public activatedRoute: ActivatedRoute) { 

    this.activatedRoute.queryParams.subscribe(params => {
      if(params.view) {
        this.listingService.getItem(params.view).subscribe((data: any) => {
          this.listData = data;
          console.log(this.listData, 'this.listData')
          this.userService.getItem(data.uid).subscribe((data: any) => {
            console.log(data, 'data')
          });
         });
      }
    });
  }

 
  ngOnInit(): void {
  }
 
}
