import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoiceService } from '../../service/invoice.service';
import { ActivatedRoute, Router } from '@angular/router'
import { Customer } from '../../model/customer';
import { CommonModule } from '@angular/common';
import { DataLoadService } from '../../service/data-load.service';
import { Products } from '../../model/products';
import {InvoiceDetail}  from '../../model/invoice-detail';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css',
})
export class InvoiceFormComponent implements OnInit {

    invoiceForm!: FormGroup;
    invoiceId!: number | null;
    isEditMode: boolean = false;
    statusList: any[] = [];
    customerList: Customer[] = [];
    productList: Products[] = [];
    invoiceData: InvoiceDetail[] = [];
    successMessage ='';
    errorMessage = '';
    totalAmount = 0;



  constructor(
    private readonly fb: FormBuilder, 
    public invoiceSvc: InvoiceService, 
    public dataLoadSvc: DataLoadService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCustomerList();
    this.getStatusList();
    this.getProductList();
    this.addItemProduct();

    this.route.paramMap.subscribe(params => {
      let invoiceId = params.get('id');
      
      if (invoiceId) {
        this.invoiceId = +invoiceId;
        this.isEditMode = true;
        this.loadInvoiceData(this.invoiceId);
      }
    });
  }

  createForm() {
    this.invoiceForm = this.fb.group({
      customerId: ['', Validators.required],
      invoiceNo:['INV', Validators.required],
      invoiceDate: ['', Validators.required],
      statusId: [1, Validators.required],
      itemDetails: this.fb.array([])
    });
  }

  loadInvoiceData(id: number) {
    this.invoiceSvc.getInvoiceById(id)
    .subscribe({
      next: (a) => {
        this.invoiceForm.patchValue({
          customerId: a.customer_id,
          invoiceDate: a.invoice_date,
          statusId: a.status_id,
          invoiceNo: a.no
        });

        //details invoice
        this.itemDetails.clear();

        a.inv_details.forEach((i:any) => {
          this.addExistingItem(i);
        });

        //calculate total amount
        this.calTotalAmount();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  submit() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      console.error('Form is invalid');
      return;
    }

    const invoiceData = {
      ...this.invoiceForm.value,
      totalAmount: this.totalAmount
    };

    if (this.isEditMode && this.invoiceId) {
      this.updateInvoice(invoiceData);
    } else {
      this.createInvoice(invoiceData);
    }
  }

  updateInvoice(invData: any) {
    this.invoiceSvc.updateInvoice(this.invoiceId!,invData)
      .subscribe({

        next: (res) => {
          console.log('updated', res);
          this.showSuccess('Successfully Updated.');
           this.loadInvoiceList();
        },
        error: (err) => {
          this.showError('Failed to update.');
        }
      });
  }

  createInvoice(invData:any) {
    this.invoiceSvc.createInvoice(invData)
      .subscribe({

        next: (res) => {
          this.showSuccess('Succesfully created.');
        this.loadInvoiceList();
        },
        error: (err) => {
          this.showError('Failed created invoice.');
        }
      });
  } 

  /* Function:Product Row Table */

  get itemDetails(): FormArray{
    return this.invoiceForm.get('itemDetails') as FormArray;
  }

  createItemDetailRow(){
    return this.fb.group({
        id:[null],
        productId:['', Validators.required],
        quantity:[0, Validators.required],
        unitPrice:[''],
        subTotal:['']
    });
  }

  addItemProduct(){
    this.itemDetails.push(
      this.createItemDetailRow()
    );
  }

  addExistingItem(item: any) {
    const row = this.createItemDetailRow();
      row.patchValue({
        id:item.id,
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subTotal: item.subtotal
      });
    this.itemDetails.push(row);
  }

  removeItem(indx: number){
    this.itemDetails.removeAt(indx);
  }

  onItemChange(event:any, indx:number){
    const itemId = Number(event.target.value);

    const selectedItem = this.productList.find(
      p => p.id === itemId
    );

    if(selectedItem){
      const row = this.itemDetails.at(indx);

      row.patchValue({
        unitPrice: selectedItem.unit_price,
        subtotal:Number(selectedItem.unit_price) * Number(row.get('quantity')?.value)
      });

      this.calTotalAmount();
    }
  }

  calSubTotal(i:number){
    const row = this.itemDetails.at(i);

    const quantity = Number(
      row.get('quantity')?.value || 0
    );

    const unitPrice = Number(
      row.get('unitPrice')?.value || 0
    );

    row.patchValue({
      subTotal: quantity * unitPrice
    });

    this.calTotalAmount();
  }

  calTotalAmount(){
    this.totalAmount = this.itemDetails.controls
    .reduce((total, item)=>{

        return total + Number(
            item.get('subTotal')?.value || 0
        );
    },0);
    console.log(this.totalAmount);
  }

  loadCustomerList() {
    this.dataLoadSvc.getCustomerList()
    .subscribe({
      next: (res) => {
        console.log('test', res)
        this.customerList = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getStatusList() {
    this.dataLoadSvc.getStatusList()
    .subscribe({
      next: (b:any) => {
        this.statusList = b;
      },
      error: (err:any) => {
        alert(err);
      }
    });
  } 

  getProductList() {
    this.dataLoadSvc.getProductList()
    .subscribe({
      next: (a:any) => {
        this.productList = a;
      },
      error(err) {
        alert(err);
      },
    });
  }

  showSuccess(message: string) {
   this.successMessage = message;
  }

  showError(message: string) {
    this.errorMessage = message;
  }

  loadInvoiceList(){
    this.router.navigate(['/invoice-list'])
    .then(() => {
      window.location.reload();
    });
  }
}
