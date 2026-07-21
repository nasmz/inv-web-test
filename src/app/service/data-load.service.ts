import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusName } from '../model/status-name';
import { Customer } from '../model/customer';
import { Products } from '../model/products';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataLoadService {

  private readonly baseUrl = `${environment.apiUrl}`;

  constructor(private readonly http: HttpClient) { }

  
  getCustomerList() {
    console.log('sini');
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
  }
  

  getStatusList() {
    return this.http.get<StatusName[]>(`${this.baseUrl}/status`
    );
  }

  getProductList() {
    return this.http.get<Products[]>(`${this.baseUrl}/products`)
  }
}
