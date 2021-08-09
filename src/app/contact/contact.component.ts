import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common-services';
import { environment } from 'src/environments/environment';
import { ContactService } from 'src/app/services/contact.service';
@Component({
  providers: [ContactService],
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  user_type: any = '';
  name: any = '';
  email: any = '';
  error_msg: any = '';
  success_msg: any = '';
  constructor(private CommonService:CommonService, public contactService: ContactService) { }

  ngOnInit() {
    this.CommonService.pageTitle.next({pageTitle:environment.home,pageHeading:environment.homeHeading,pageSubHeading:environment.homeSubHeading});
  }
  contact(){

    if (this.user_type == '') {
      this.error_msg = "Please select user type";
    }

    if (this.name == '') {
      this.error_msg = "Please enter full name";
    }

    if (this.email == '') {
      this.error_msg = "Please enter email";
    }

    if (this.error_msg == '') {
      let Save = {
        user_type: this.user_type,
        name: this.name,
        email: this.email,
      };
      this.contactService.addItem(Save).then((resp:any) => {
        console.log(resp);
        let mess = "Contact Person Name: "+this.name+", User type: "+this.user_type+", Email: "+this.email;
        let emailParams = {to: 'info@spot-leads.com', subject: 'Contact Request', mess: mess};
        this.user_type = '';
        this.name = '';
        this.email = '';
        this.CommonService.sendEmail(emailParams).subscribe((data: any) => {

          }, (err) => {
            console.log(err);
        });

        this.success_msg = 'Contact request submitted succesfully';
      });
      }

  }
}
