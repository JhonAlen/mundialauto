import { Routes } from '@angular/router';
import { CollectionIndexComponent } from '@app/administration/collection/collection-index/collection-index.component';
import { FleetContractBrokerDetailComponent } from '@app/subscription/fleet-contract-broker/fleet-contract-broker-detail/fleet-contract-broker-detail.component'

export const AdminLayoutRoutes: Routes = [
   
    { path: 'subscription/fleet-contract-broker-detail',  component: FleetContractBrokerDetailComponent },
    { path: 'administration/collection-index', component: CollectionIndexComponent},

];
