import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { tap, map, switchMap } from 'rxjs/operators';

@Injectable()
export class PaymentService {
    userId: string;
    membership: any;
    constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
        this.membership = this.afAuth.authState.pipe(tap(user => this.userId))
            .subscribe((user: any) => {
                return user.uid;
                // let CheckData = this.db.collection('webUsers').doc(user.uid).collection('pro-membership-token').doc(this.userId);
                // CheckData.valueChanges().subscribe(data => {
                //     if(!data){
                //         this.db.collection('webUsers').doc(user.uid).collection('pro-membership-status').doc(this.userId).set({ status: '' });
                //     }
                // })
                // return this.db.collection('webUsers').doc(user.uid).collection('pro-membership-token').doc(this.userId).valueChanges().subscribe(data => {
                //     if(!data){
                //        return this.db.collection('webUsers').doc(user.uid).collection('pro-membership-token').doc(this.userId).set({ token: '' });
                //     }
                // })
                // return this.db.collection('webUsers').doc(user.uid).collection('pro-membership-token').doc(this.userId).set({ token: '' });
            }
        )
    }
    processPayment(token: any) {
        // return this.db.collection('webUsers').doc(this.userId).collection('pro-membership-token').doc(this.userId).update({ token: token.id });
        return true;
    }
}
