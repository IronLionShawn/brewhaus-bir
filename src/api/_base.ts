import * as API from "@/api/client";
import { APIFilters } from "@/types/api.types";
import type { AxiosResponse } from "axios";

export class BaseAPI<M = any> {
    protected _id?: string;

    protected _baseUrl: string = '';
    
    protected _path: string = '';

    protected _defaultFilters: APIFilters = {
        per_page: 10,
        page: 1,
    };

    protected _filters!: APIFilters;
    
    constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
        this._filters = this._defaultFilters;
    }

    get url(): string {
        const params = { ...this._filters?.columns, page: this._filters?.page, per_page: this._filters?.per_page };
        return `${this._baseUrl}${ (this._id) ? this._id + '/' : '' }${ (this._path) ? this._path : ''  }${ (params) ? `?${new URLSearchParams(params as any)}` : '' }`;
    }

    protected callAPI<R=M>(id?: string, filters?: APIFilters): Promise<AxiosResponse<R>> {
        if(id) { this._id = id; }
        if(filters) {this._filters = filters;}

        return API.apiClient.get(this.url);
    }

    public reset() {
        this._filters = this._defaultFilters;
        this._path = '';
        this._id = '';
    }

    public browse<R=M[]>(filters?: APIFilters): Promise<AxiosResponse<R>> {
        return this.callAPI<R>(undefined,filters);
    }

    public search<R=M[]>(path: string = '', filters?: APIFilters): Promise<AxiosResponse<R>> {
        this._path = path;
        return this.callAPI<R>(undefined, filters);
    }

    public read<R=M>(id: string, filters?: APIFilters): Promise<AxiosResponse<R>> {
        return this.callAPI<R>(id,filters);
    }
}