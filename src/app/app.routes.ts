import { Routes } from '@angular/router';
import { InvoiceListComponent } from './component/invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './component/invoice-form/invoice-form.component';

export const routes: Routes = [

    {
        path:'invoice-list',
        component:InvoiceListComponent
    },
    {
        path:'',
        redirectTo:'invoice-list',
        pathMatch:'full'
    },
    {
        path:'invoice-form',
        component:InvoiceFormComponent
    },
    {
        path:'invoice-form/:id',
        component:InvoiceFormComponent
    }
];
