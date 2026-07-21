import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Invoice } from '../../model/invoice';
import { InvoiceService } from '../../service/invoice.service';
import { NavigationEnd, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { filter } from 'rxjs';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css',
})
export class InvoiceListComponent implements OnInit {

  invoiceLists: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalItems = 0;

  constructor( private readonly invoiceSvc: InvoiceService, private readonly router: Router, private readonly cdr: ChangeDetectorRef) {}


  ngOnInit():void {
    console.log('load x')
    this.loadInvoicesList();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
    .subscribe(() => {
      if(this.router.url === '/invoice-list'){
          console.log('reload invoice list');
          this.loadInvoicesList();
      }
    });
  }

  loadInvoicesList(page:number = 1){

    this.invoiceSvc.getInvoiceList(page)
      .subscribe({
        next:(res:any)=>{
          const data = res.data ?? res;
          this.invoiceLists = [...data];
          this.totalItems = this.invoiceLists.length;
          console.log('AFTER SET:', this.invoiceLists);
          this.cdr.markForCheck();
        },

        error:(err)=>{
          console.error(err);
        }
    });
  }

  editInv(id: number): void {
    console.log('Edit invoice with ID:', id);
    this.router.navigate(['/invoice-form', id]);
  }
  

  deleteInv(id: number) {
    const confirmDelete = confirm(
        'Are you sure you want to delete this invoice?'
    );

    if(confirmDelete){
        this.invoiceSvc.softDeleteInvoice(id)
        .subscribe({
            next:(res)=>{
                console.log(res);
                alert('Invoice deleted successfully');
                this.loadInvoicesList(1);
            },
            error:(err)=>{
                console.error(err);
                alert('Failed to delete invoice');
            }
        });
    }

  }

  addInvoice(){
    this.router.navigate(['/invoice-form']);
  }

}
