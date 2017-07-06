import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class QualiUtilsService {
  constructor(private http: Http) {
  }

  listFamilies() {
    return this.http.get('/api/v1/resource/family/')
  }

  findModels(criteria: any[]) {
    console.log('QualiUtilsService.findModels() called');
    return this.http.post('/api/v1/resource/model/', criteria)
  }

  listModels() {
    console.log('QualiUtilsService.listModels() called');
    return this.http.get('/api/v1/resource/model/')
  }
}
