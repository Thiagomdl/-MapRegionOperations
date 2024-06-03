import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {  } from '@wlp/translate-bo';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import {  } from './restrict-location-edit-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {  } from '@wlp/account-manager';


@NgModule({
  declarations: [UiCRestrictLocationEditModalComponent],
  imports: [
    CommonModule,
    UiBsTranslateBoModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
    MatRadioModule,
    MatIconModule,
  ],
  providers: [
    AccountManagementService,
    DatePipe,
      {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '850px',
        
      }
    },

  ],
  exports: [UiCRestrictLocationEditModalComponent]
})
export class UiCRestrictLocationEditModalModule { }
