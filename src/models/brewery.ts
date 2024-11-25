export enum BreweryType {
    REGIONAL = 'regional',
    LARGE = 'large',
    MICRO = 'micro',
    PUB = 'brewpub',
    CLOSED = 'closed',
}

export interface BreweryModel {
    id: string;
    name: string;
    brewery_type: BreweryType;
    address_1: string;
    address_2: string;
    address_3: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
    longitude: string;
    latitude: string;
    phone: string;
    website_url: string;
    state: string;
    street: string;
}