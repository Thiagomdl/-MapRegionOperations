import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RestrictLocationComponent } from './restrict-location.component';
import { UiCSubheaderModule } from '@wlp/ui-c-subheader';
import { RestrictLocationTooltipComponent } from './restrict-location-tooltip/restrict-location-tooltip/restrict-location-tooltip.component';
import { RestrictLocationTooltipDirective } from './restrict-location-tooltip/restrict-location-tooltip/restrict-location-tooltip.directive';

import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { UiCRestrictLocationEditModalComponent, UiCRestrictLocationEditModalModule } from '@wlp/ui-c-restrict-location-edit-modal';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [RestrictLocationComponent, RestrictLocationTooltipComponent, RestrictLocationTooltipDirective],
  imports: [
    UiCSubheaderModule, 
    FormsModule, 
    OverlayModule,
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    UiCRestrictLocationEditModalModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    NgbDropdownModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: RestrictLocationComponent,
      },
    ]),
  ],
  entryComponents: [ RestrictLocationTooltipComponent,  UiCRestrictLocationEditModalComponent],
  bootstrap:    [ RestrictLocationComponent ],
  exports: [ ],
})
export class RestrictLocationModule { }
