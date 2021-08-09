import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-verification',
  templateUrl: './header-verification.component.html',
  styleUrls: ['./header-verification.component.css']
})
export class HeaderVerificationComponent implements OnInit {
  nextinput=function($event){
    if($event.target.value.trim().length){
      if($event.target.nextElementSibling){
        $event.target.nextElementSibling.focus()
      }
    }
  }
  constructor() {

  }

  ngOnInit(): void {
  }

}
