import type { BreweryModel } from '@/models/brewery';
import { BaseAPI } from './_base';

const baseUrl = '/v1/breweries/';

export class AddressAPI extends BaseAPI<BreweryModel> {}

const breweryAPI = new AddressAPI(baseUrl);

export default breweryAPI;