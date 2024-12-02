import type { BreweryModel } from '@/models/brewery';
import { BaseAPI } from './_base';

const baseUrl = '/v1/breweries/';

export class BreweryAPI extends BaseAPI<BreweryModel> {}

const breweryAPI = new BreweryAPI(baseUrl);

export default breweryAPI;