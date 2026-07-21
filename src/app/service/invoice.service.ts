import { Injectable } from '@angular/core';
//import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly refreshList = new Subject<void>();

  refresh$ = this.refreshList.asObservable();
  private readonly baseUrl = `${environment.apiUrl}`;

  constructor(private readonly http: HttpClient) { }

  getInvoiceList(page: number) {
     return this.http.get<any>(`${this.baseUrl}/invoices?page=${page}`);
  }

  getInvoiceById(id: number){
     console.log('1');
    return this.http.get<any>(
      `${this.baseUrl}/invoices/${id}`
    );
  }

  getInvoiceDetail(id: number) {
    return this.http.get(`${this.baseUrl}/invoice-details/${id}`);
  }

  createInvoice(invoice: any){
       return this.http.post(`${this.baseUrl}/invoices`, invoice);
  }

  updateInvoice(invoiceId: number, invoiceData: any){
    return this.http.put(`${this.baseUrl}/invoices/${invoiceId}`, invoiceData);
  }

  //soft delete is_deleted=1
  softDeleteInvoice(invoiceId: number){
    return this.http.delete(`${this.baseUrl}/invoices/${invoiceId}`);
  }

  triggerRefresh(){
   this.refreshList.next();
}

}
