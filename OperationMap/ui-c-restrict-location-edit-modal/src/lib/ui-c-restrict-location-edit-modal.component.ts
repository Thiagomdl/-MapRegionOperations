import { Component, EventEmitter, Inject, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'ui-c-restrict-location-edit-modal',
  templateUrl: 'ui-c-restrict-location-edit-modal.component.html',
  styleUrls: ['ui-c-restrict-location-edit-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UiCRestrictLocationEditModalComponent implements OnInit {

  accData: any;
  location: any;
  selectedOption: string;
  modalOperations: string;
  uuidWhiteLabel: any;
  countryName: any;
  uuidoperations: any;

  reasonList: any[] = [];
  typeList: any[] = [];
  stateNames: string[] = [];
  appliedOns: string[] = [];
  onSubmitReason = new EventEmitter<any>();

  constructor(
    public restrictMap: AccountApprovedService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<UiCRestrictLocationEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.accData = this.data;
    this.location = this.data.location;
    this.initializeModalData(this.data.modalData);
  }

  private initializeModalData(modalData: any[]): void {
    const foundItem = modalData.find(item => item.stateName === this.location);
    if (foundItem) {
      this.uuidWhiteLabel = foundItem.uuidWhiteLabel;
      this.countryName = foundItem.countryName;
      this.selectedOption = foundItem.appliedOn;
      this.modalOperations = this.selectedOption;
      this.uuidoperations = foundItem.uuid;
      console.log(foundItem);
    } else {
      this.selectedOption = 'semrestricao';
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  handleType(value: string, value2: string): void {
    this.onSubmitReason.emit({ value, value2 });
  }

  notification(type: string, title: string, message: string): void {
    swal.fire({
      icon: type,
      title,
      text: message,
    });
  }

  submitModal(): void {
    const body = {
      uuidWhiteLabel: this.uuidWhiteLabel,
      stateName: this.location,
      countryName: this.countryName,
      appliedOn: this.selectedOption,
      uuid: this.uuidoperations
    };

    if (this.modalOperations === 'semrestricao') {
      this.saveRestriction(body);
    } else {
      if (this.selectedOption === 'semrestricao') {
        this.deleteRestriction();
      } else {
        this.updateRestriction(body);
      }
    }
  }

  private saveRestriction(body: any): void {
    this.restrictMap.addRestrictMapWL(body).pipe(
      tap((res) => {
        this.handleSuccessResponse();
      }),
      catchError((_) => {
        this.handleError();
        return of(null);
      })
    ).subscribe();
  }

  private deleteRestriction(): void {
    this.restrictMap.deleteRestrictMapWL(this.uuidoperations).pipe(
      tap((res) => {
        this.handleSuccessResponse();
      }),
      catchError((_) => {
        this.handleError();
        return of(null);
      })
    ).subscribe();
  }

  private updateRestriction(body: any): void {
    this.restrictMap.updateRestrictMapWL(this.uuidoperations, body).pipe(
      tap((res) => {
        this.handleSuccessResponse();
      }),
      catchError((_) => {
        this.handleError();
        return of(null);
      })
    ).subscribe();
  }

  private handleSuccessResponse(): void {
    this.closeModal();
    this.notification('success', 'Atenção', 'Restrição Salva com Sucesso');
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  private handleError(): void {
    this.closeModal();
    this.notification('error', 'Atenção!', 'Erro ao salvar Restrição!');
  }

}
