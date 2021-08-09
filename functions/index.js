// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const express = require("express");
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const app = express();
const nodemailer = require("nodemailer");
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51IJaTjGXe5R5tBGRIpux6kKz2PS6Bund59S9AX9E0HtERL5pzPsgOghmYzA3PmcesXJr8XJ1bqTGoEXlH81BlK0j00UwJN0Nke";
const db = admin.firestore();
const db2 = admin.firestore();
app.use(cors);
app.use(cookieParser);
const stripe = require("stripe")(
  "sk_test_51IJaTjGXe5R5tBGR0rzA4diy2yOYSewva8QCGvfDSzEd6x2G8YjzXcxDii76otKvi5GfwRboWad6hsQzFyDj0452004dotCDh4"
);

 

exports.createStripeCustomer = functions.auth.user().onCreate((event) => {
  const user = event;

  return stripe.customers
    .create({
      email: user.email,
    })
    .then((customer) => {
      const updates = {};
      // updates[`/customers/${customer.id}`] = user.uid
      // updates[`/webUsers/${user.uid}/customerId`] = customer.id
      // console.log(updates, 'updates')

      // return admin.database().ref().update(updates)

      const userDb = db.collection("users").doc(user.uid);
      userDb.update({
        customerId: customer.id,
      });
      const CustomersDb = db.collection("customers");
      return CustomersDb.doc(customer.id).set({
        u_id: user.uid,
      });
    });
});

// exports.createSubscription6 = functions.firestore
//   .document("/webUsers/{documentId}/pro-membership-token/{tokenId}")
//   .onUpdate((event, context) => {
//     const tokenObj = event.after.data();

//     const tokenId = tokenObj.token;
//     const userId = context.params.documentId;
//     if(tokenId!=''){
//       if (!tokenId) throw new Error("token missing");
//       const userRef = db.collection("webUsers").doc(userId);
//       return userRef.get().then((user_resp) => {
//         let user = user_resp.data();
//         if (!user_resp.exists) {
//           console.log("No such document!");
//         } else {
//           return stripe.customers.createSource(
//             user.customerId,
//             {
//               source: tokenId,
//             },
//             function (err, source) {
//               // asynchronously called
  
//               const SubscriptionRef = db2
//                 .collection("subscriptions")
//                 .where("uid", "==", userId)
//                 .orderBy("time")
//                 .limit(1);
//               return SubscriptionRef.get().then((subscription_resp) => {
//                 let subscription_data = subscription_resp;
  
//                 subscription_data.forEach((doc) => {
//                   let SubscriptionId = doc.id;
//                   let subscriptionDtl = doc.data();
  
//                   // if(subscriptionDtl.user_type=='agent' ||)
//                   return stripe.subscriptions
//                     .create({
//                       customer: user.customerId,
//                       // source: tokenId,
//                       items: subscriptionDtl.stripe_plan_id,
//                     })
//                     .then((sub) => {
                      
//                       const userDb = db
//                         .collection("webUsers")
//                         .doc(userId)
//                         .collection("pro-membership-status")
//                         .doc(userId);

//                       userDb.update({
//                         status: "active",
//                       });

//                       let number_of_listingUpdate = subscriptionDtl.number_of_listng;
//                       if (number_of_listingUpdate=='unlimited') {
                        
//                       } else {
//                         number_of_listingUpdate = Number(user.listingUploads) + subscriptionDtl.number_of_listng;
//                       }
//                       const userDb2 = db
//                       .collection("webUsers")
//                       .doc(userId);
//                       userDb2.update({
//                         listingUploads: number_of_listingUpdate,
//                       });

//                       // console.log(SubscriptionId, "SubscriptionId");
//                       db.collection("subscriptions")
//                         .doc(SubscriptionId)
//                         .update({
//                               status: "active",
//                               stripeSubscriptionId: sub.id,
//                               listingUploads: subscriptionDtl.number_of_listng,
//                               totalListings: subscriptionDtl.number_of_listng, 
//                             });
//                         // .get()
//                         // .then((subscriptionDb) => {
//                         //   if (!subscriptionDb.exists) {
//                         //     console.log("No such subscriptionData document!");
//                         //   } else {
//                         //     let subscriptionData = subscriptionDb.data();
  
//                         //     console.log(subscriptionData, "subscriptionData");
//                         //   }
//                         //   // subscriptionDb.update({
//                         //   //   status: "active",
//                         //   // });
//                         //   // console.log(subscriptionDb);
//                         // });
//                     })
//                     .catch((err) => {
//                       console.log("error", err);
//                     });
//                 });
//               });
//             }
//           );
//         }
//       });
  
//       // return db.collection('webUsers').doc(userId).get().then((user) => {
//       //     console.log(user);
  
//       //   });
//     }
    
//   });


  exports.addMoreSubscription = functions.firestore
  .document("/subscriptions/{documentId}")
  .onCreate((event, context) => {
    const tokenObj = event.data();
    const tokenId = tokenObj.token;
    const NewsubscriptionId = context.params.documentId;
    const userId = tokenObj.uid;
    if(tokenId!=''){
      if (!tokenId) throw new Error("token missing");
      const userRef = db.collection("users").doc(userId);
      return userRef.get().then((user_resp) => {
        let user = user_resp.data();
        if (!user_resp.exists) {
          console.log("No such document!");
        } else {

          return stripe.customers.createSource(
            user.customerId,
            {
              source: tokenId,
            },
            function (err, source) {
              // asynchronously called
  
              const SubscriptionRef = db2
                .collection("subscriptions")
                .where("uid", "==", userId);
              
              return SubscriptionRef.get().then((subscription_resp) => {

                let subscriptionDtl = tokenObj;
                let MainSubsc;
                console.log('here')

                console.log(subscription_resp.size, 'subscription_resp.length')
                if (Number(subscription_resp.size) > 1 ) {
                  
                  //update subscription here
                  let number_of_listingUpdate = subscriptionDtl.number_of_listng;
                  if (number_of_listingUpdate=='unlimited') {

                    return stripe.subscriptions
                    .create({
                      customer: user.customerId,
                       items: subscriptionDtl.stripe_plan_id,
                    })
                    .then((sub) => {
                  
                      let number_of_listingUpdate = subscriptionDtl.number_of_listng;
                      if (number_of_listingUpdate=='unlimited') {
                        
                      } else {
                        number_of_listingUpdate = Number(user.listingUploads) + subscriptionDtl.number_of_listng;
                      }
                  

                       db.collection("subscriptions")
                        .doc(NewsubscriptionId)
                        .update({
                              main: 1,
                              status: "active",
                              stripeSubscriptionId: sub.id,
                              listingUploads: subscriptionDtl.number_of_listng,
                              totalListings: subscriptionDtl.number_of_listng, 
                            });
                      
                    })
                    .catch((err) => {
                      console.log("error", err);
                    });


                  
                  }else{
                    subscription_resp.forEach((subscr, index) => {
                      let subscription_list = subscr.data();
    
                          if(subscription_list.main==1){
                            MainSubsc = subscription_list;
                          }
                      })
                      return stripe.subscriptions.retrieve(MainSubsc.stripeSubscriptionId).then(ReteriveData => {
                        console.log('start update function')
                        // console.log(, 'items')
                        // return false;
                        // console.log(ReteriveData.items.length, 'items')
                        // console.log(ReteriveData.items.data, 'items')
                        // console.log(subscriptionDtl, 'subscriptionDtl')
                        subscriptionDtl.stripe_plan_id[0].id = ReteriveData.items.data[1].id;
                        subscriptionDtl.stripe_plan_id[0].quantity = (Number(MainSubsc.totalListings) -1 ) + Number(subscriptionDtl.stripe_plan_id[0].quantity)
    
                       
                        return stripe.subscriptions.update(MainSubsc.stripeSubscriptionId, {
                          cancel_at_period_end: false,
                          proration_behavior: 'create_prorations',
                          items: subscriptionDtl.stripe_plan_id
                        }).then((sub) => {
                      
                          let number_of_listingUpdate = subscriptionDtl.number_of_listng;
                          if (number_of_listingUpdate=='unlimited') {
                            
                          } else {
                            number_of_listingUpdate = Number(user.listingUploads) + subscriptionDtl.number_of_listng;
                          }
                      
      
                           db.collection("subscriptions")
                            .doc(NewsubscriptionId)
                            .update({
                                  main: 0,
                                  status: "active",
                                  stripeSubscriptionId: sub.id,
                                  listingUploads: subscriptionDtl.number_of_listng,
                                  totalListings: subscriptionDtl.number_of_listng, 
                                });
                          
                        })
                        .catch((err) => {
                          console.log("error", err);
                        });
                      });
                  }
                  

  //  stripe.subscriptions
  //                 .create({
  //                   customer: user.customerId,
  //                    items: subscriptionDtl.stripe_plan_id,
  //                 })
                  // if(MainSubsc.stripe_plan_id.length > 1){
                  //   UpdateItems = {
                  //     price: 'price_CBb6IXqvTLXp3f',
                  //   };
                  // }else{

                  // }
                 

                } else {

                  //create subscription here

  
                   return stripe.subscriptions
                    .create({
                      customer: user.customerId,
                       items: subscriptionDtl.stripe_plan_id,
                    })
                    .then((sub) => {
                  
                      let number_of_listingUpdate = subscriptionDtl.number_of_listng;
                      if (number_of_listingUpdate=='unlimited') {
                        
                      } else {
                        number_of_listingUpdate = Number(user.listingUploads) + subscriptionDtl.number_of_listng;
                      }
                  

                       db.collection("subscriptions")
                        .doc(NewsubscriptionId)
                        .update({
                              main: 1,
                              status: "active",
                              stripeSubscriptionId: sub.id,
                              listingUploads: subscriptionDtl.number_of_listng,
                              totalListings: subscriptionDtl.number_of_listng, 
                            });
                      
                    })
                    .catch((err) => {
                      console.log("error", err);
                    });
                }
                
              });
            }
          );
        }
      });
  
      // return db.collection('webUsers').doc(userId).get().then((user) => {
      //     console.log(user);
  
      //   });
    }
    
  });

exports.recurrinPayment = functions.https.onRequest((req, res) => {
  const hook = req.body.type;
  const data = req.body.data.object

  if(!data) throw new Error('Missing token');
  const subscriptionId = data.lines.data[0].subscription;
  // console.log(data.customer, 'data.customer')

console.log(subscriptionId, 'subscription ID')
  const SubscriptionRef = db2
      .collection("subscriptions")
      .where("stripeSubscriptionId", "==", subscriptionId)
      .limit(1);
    return SubscriptionRef.get().then((subscription_resp) => {
      let subscription_data = subscription_resp;
      // console.log(subscription_data, 'subscription_data')
      let SubscDetal = subscription_data.data();
      let uid = SubscDetal.uid;
      console.log(uid, 'uid')
      subscription_data.forEach((doc) => {
        let SubscriptionId = doc.id;
        
       
        console.log(SubscriptionId, 'SubscriptionId')
        let updateQuery = db.collection("subscriptions").doc(SubscriptionId);

      if(hook === 'invoice.payment_succeeded'){

        const userDb = db.collection("users").doc(uid);
        return userDb.update({
          isPaid: true,
        }).then(()=> {
          return updateQuery.update({
            status: 'active'
          })
        });

         
        }


        //Handle failed payment Hook
        if(hook === 'invoice.payment_failed'){
          const userDb = db.collection("users").doc(uid);
          return userDb.update({
            isPaid: false,
          }).then(()=> {
            return updateQuery.update({
              status: 'pastDue'
            })
          })
        }

      })
    })
    .then(() => res.status(200).send(`successfully handled ${hook}`))
      .catch(err => res.status(400))
  // const customerRef = db.collection("customers").doc(data.customer);
  //     return customerRef.get().then((user_resp) => {
  //       let doc = user_resp.data();
  //       let UserId = doc.uid;


  //       //Handle successfull payment Hook
  //     let updateQuery = db.collection("webUsers").doc(UserId).collection('pro-membership-status').doc(UserId);
  //     if(hook === 'invoice.payment_succeeded'){
  //       return updateQuery.update({
  //         status: 'active'
  //       })
  //     }


  //     //Handle failed payment Hook
  //     if(hook === 'invoice.payment_failed'){
  //       return updateQuery.update({
  //         status: 'pastDue'
  //       })
  //     }

      

  //     throw new Error('not a matching Webhook')

  //   })
  //   .then(() => res.status(200).send(`successfully handled ${hook}`))
  //   .catch(err => res.status(400))
  // })

})





exports.cancelSubcription = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

  const bodyParams = req.query;
  console.log(bodyParams, 'bodyParams')
  const subsc_id =bodyParams.subscriptionId; 
  const docId = bodyParams.id; 
    stripe.subscriptions.del(
      subsc_id
      ).then(resp => {
        db.collection("subscriptions")
                        .doc(docId)
                        .update({
                              status: "cancel",
                            }).then(() => {
                              return res.status(200).send(resp);
                            }).catch(() => console.log('Subscription cancel failed!'));
        
   });
});
  
})


app.get("/cancel-subscription2", (req, res) => {
  res.send('ok');
})

app.get("/", (req, res) => {
  var smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "himanshukumar077@gmail.com",
      pass: "hvxglwmpwapxilgi",
    },
  });

  var mail = {
    from: "Job costing Web App <himanshukumar077@gmail.com>",
    to: req.query.to,
    subject: req.query.subject,
    text: req.query.mess,
    //html:req.params.mess,
  };

  smtpTransport.sendMail(mail, function (error, response) {
    res.send(req.query);
  });
});



// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);
