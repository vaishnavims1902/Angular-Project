import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserdataComponent } from './userdata/userdata.component';

export const routes: Routes = [
    {
        path:'',
        component:HomeComponent
    },
    {
        path:'userShow',
        component:UserdataComponent
    }
];
