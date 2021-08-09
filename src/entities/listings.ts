export class Listings { 
    id:string;
    uid: string;
    fullname: string;
    about: string;
    address: any = {
        city: '',
        state: '',
        street: '',
        unit: '',
        zip: ''
    };
    amenities: [] = [];
    bathrooms: number = 1;
    bedrooms: number = 1;
    broker: any = {
        about: ''
    };
    clientIds:[] = [];
    commercial: boolean = false;
    completed: string = '';
    location: [] = [];
    images: [] = [];
    price: number;
    propertyType: string = 'Renting';
    renter: boolean = true;
    size: number;
    startingDate: any;
}