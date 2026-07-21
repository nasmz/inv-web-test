import { Customer } from "./customer";
import { StatusName } from "./status-name";


export interface Invoice {
    id: number;
    no: string;
    customer_id: number;
    invoice_date: Date;
    total_amount: number;
    status_id: number;
    is_deleted: number;    
    customer: Customer;
    status: StatusName;
}
