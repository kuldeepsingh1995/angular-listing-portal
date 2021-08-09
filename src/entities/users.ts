export class Users  {
    uid: string;
    fullName: string = "";
    profileURL: string = "LINK_PROFILE";
    myListings: [];
    isClient: boolean = true;
   // Prefrences
    phone: string = "";
    fcmToken: string = "";
    commercial:boolean = false;
    bedrooms:number = 0;
    bathrooms:number = 0;
    renter:boolean = true;
    propertyType:string = "Apartment";
    startingDate:any = Date();
    price:number = 0;
    location: any = [];
    size: number = 0;
    amenities: any = [];
   // Broker
    brokerage: string = "";
    rating: any = 0;
    listingUploads: number = 1;
    about:string = "";
    user_type : string = "";
    auth_type : string = "";
    isPaid: boolean = false;
    id = 0;
}