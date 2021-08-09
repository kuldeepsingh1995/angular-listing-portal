import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

import { Packages} from '../../entities/packages';
@Injectable()
export class PackagesService {
  headers_object;
  listingRef: AngularFireList<Packages>;

  constructor(private firestore: AngularFirestore) {
    // this.timesheetRef = db.list('timesheet');

  }
  init_(){
    const data = [
      {
        max_agent: 25,
        min_agent: 11,
        monthly_price: 450,
        title: "Plan 2",
        user_type: "real_estate_office",
        yearly_price: 3900,
        monthly_plan_id: '',
        yearly_plan_id: '',
        additional_montly_plan_id: ''
      },
      {
        max_agent: 10,
        min_agent: 1,
        monthly_price: 300,
        title: "Plan 1",
        user_type: "real_estate_office",
        yearly_price: 2100,
        monthly_plan_id: '',
        yearly_plan_id: '',
        additional_montly_plan_id: ''
      },
      {
        max_agent: 74,
        min_agent: 51,
        monthly_price: 750,
        package_type: "unlimited",
        title: "Plan 4",
        user_type: "real_estate_office",
        yearly_price: 6500,
        monthly_plan_id: '',
        yearly_plan_id: '',
        additional_montly_plan_id: ''
      },
      {
        max_agent: 50,
        min_agent: 26,
        monthly_price: 600,
        title: "Plan 3",
        user_type: "real_estate_office",
        yearly_price: 5700,
        monthly_plan_id: '',
        yearly_plan_id: '',
        additional_montly_plan_id: ''
      },
      {
        max_agent: "++",
        min_agent: 75,
        monthly_price: 900,
        title: "Plan 5",
        user_type: "real_estate_office",
        yearly_price: 9300,
        monthly_plan_id: '',
        yearly_plan_id: '',
        additional_montly_plan_id: ''
      },

      
     
      {
        max_agent: "++",
        min_agent: "++",
        monthly_price: 25,
        package_type: "unlimited",
        title: "Plan 2",
        user_type: "agent",
        yearly_price: 199,
        monthly_plan_id: 'price_1IOz8JGXe5R5tBGRljpLlbwn',
        yearly_plan_id: 'price_1IOz8JGXe5R5tBGRtWsmJZby',
        additional_montly_plan_id: ''
      },
      
      {
        additional_listing_price: 2.99,
        max_agent: "++",
        min_agent: 1,
        monthly_price: 15,
        package_type: "selectable",
        title: "Plan 1",
        user_type: "agent",
        monthly_plan_id: 'price_1IOz3yGXe5R5tBGRBTtpNbOh',
        yearly_plan_id: '',
        additional_montly_plan_id: 'price_1IOz3zGXe5R5tBGRpVzQpOpZ'
      },
      {
        additional_listing_price: 2.99,
        max_agent: "++",
        min_agent: 1,
        monthly_price: 15,
        package_type: "selectable",
        title: "Plan 1",
        user_type: "property_owner",
        monthly_plan_id: 'price_1IOytBGXe5R5tBGRJ0Lxicrq',
        yearly_plan_id: '',
        additional_montly_plan_id: 'price_1IOytBGXe5R5tBGR9AdhV2Oc'
      },
      {
        max_agent: "++",
        min_agent: "++",
        monthly_price: 25,
        package_type: "unlimited",
        title: "Plan 2",
        user_type: "property_owner",
        yearly_price: 199,
        monthly_plan_id: 'price_1IOyxcGXe5R5tBGRWhByI2eP',
        yearly_plan_id: 'price_1IOyxcGXe5R5tBGRGsurJXiF',
        additional_montly_plan_id: ''
      },
     
    ];
    data.forEach((doc: any) => {
      this.addItem(doc);
    });
  }
  getItem(id){
     let Item = this.firestore.collection('packages').doc(id).valueChanges();
      return Item;
  }
  addItem(data: Packages) {
    return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection("packages")
          .add(data)
          .then(res => {
            resolve(res);
          }, err => reject(err));
    });
  }
  updateItem(data) {
    return this.firestore
        .collection("packages")
        .doc(data.id)
        .set(data);
 }
 deleteItem(id){
   console.log(id, 'id')
  this.firestore.collection("packages").doc(id).delete().then(() => {
     return true;
  }).catch((error) => {
    return false;
  });
 }
  search(searchParams) {

    let ItemCollection  = this.firestore.collection('packages', (ref: any) => {

      let query = ref;

      if (searchParams.where && searchParams.where.length > 0) {
        searchParams.where.forEach((ob) => {
          console.log(ob, 'ob')
         query = query.where(ob.key,'==',ob.value);
        })
      } else if (searchParams.sort) {
        query = query.orderBy('startingDate', searchParams.sort);
      }

      return query;
    });
    let items = ItemCollection.snapshotChanges().pipe(
      map(changes =>
        changes.map((c: any) =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    );
    return items;
      
  }
}
