export interface InvoiceDetail {
    id: number;
    invoice_id: number;
    invoice_no: string;
    product_id: number;
    quantity:number;
    unit_price:string;
    subtotal:string;
    is_deleted: number;
}
