import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-header-listing',
  templateUrl: './header-listing.component.html',
  styleUrls: ['./header-listing.component.css']
})
export class HeaderListingComponent implements OnInit {

  constructor(public router: Router,) { }

  ngOnInit(): void {
  }
  goToAddListingPage(){
    this.router.navigate(['/add-listing', {}]);
  }
}
