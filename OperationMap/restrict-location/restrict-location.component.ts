import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, of, from, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {  } from '@wlp/account-manager';
import {  } from '@wlp/oauth-bo';
import {  } from '@wlp/account-manager';
import {  } from '@wlp/restrict-location-edit-modal';

@Component({
  selector: 'kt-restrict-location',
  templateUrl: './restrict-location.component.html',
  styleUrls: ['./restrict-location.component.scss']
})
export class RestrictLocationComponent implements OnInit, OnDestroy {
  dataUser: any;
  data: any;
  userInfo: any;
  registrationsCompleted: any;
  restrictedByHousehold: any;
  restrictedByLocation: any;
  selectedRegion: string;
  value: string;
  dialogRef: any;
  appliedOn: string;
  dateUpdate: string;
  country: string;
  dataWl: any;
  dataWlInit: any;
  selectedPartnerOn: string;
  hideOperationSelectCard = true;
  initWhitelabel = '';
  partner: string;
  restrictPrintMap: string;
  restrictPrintMapDateHour: any;

  onSubmitReason = new EventEmitter();
  filteredWhitelabelNames$: Observable<any[]>;
  filterCtrl = new FormControl();
  @Output() searchByWhitelabel = new EventEmitter();
  @Input() whitelabelNames: any[];

  whitelabelValueExist = '';
  users$: Observable<UserByStatusInterface[]>;
  fromDate: NgbDateStruct;

  private dialogRefSubscription: Subscription;
  private destroy$ = new Subject<null>();

  constructor(
    private router: Router,
    private restrictMap: AccountApprovedService,
    public loadWhitelabel: ManualRescueService,
    protected userInfoService: UserInfoService,
    private dialog: MatDialog,
    protected calendar: NgbCalendar,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const initWhitelabelPromise = this.loadUserInfo();

    initWhitelabelPromise.then(() => {
      this.hideOperationSelectCard = this.isPermissionAction('bo-admin') && this.partner === 'LOGBANK';
      this.partnerOn();
      this.loadUserInfoAndScanMapRestrict().subscribe(data => {
        this.registrationsCompleted = data.registrationsCompleted;
        this.restrictedByHousehold = data.restrictedByHousehold;
        this.restrictedByLocation = data.restrictedByLocation;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRefSubscription) {
      this.dialogRefSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  isPermissionAction(role: string): boolean {
    return this.userInfoService.isUserInRole(role);
  }

  private loadUserInfo(): Promise<void> {
    return this.userInfoService.getInfoProfile().then(res => {
      this.userInfo = res;
      this.partner = this.userInfo.nameFirst;
      this.selectedPartnerOn = this.userInfo.uuidWhiteLabel;
    });
  }

  printMapRestrict(): void {
    this.clearMapRestriction();
    const colorMapping = {
      'zipcode': '#92A8D1',
      'geolocation': '#9BB58E',
      'geolocationAndZipcode': '#D7A8B4',
      'geolocationOrZipcode': '#D4C49A'
    };

    const applyColor = (data: any, color: string) => {
      const stateElement = document.querySelector(`#svg-map [id="${data.stateName}"]`);

      if (stateElement) {
        const pathElement = stateElement.querySelector('path');
        if (pathElement) {
          pathElement.style.fill = color;
        }
      }
    };

    const mappedData = this.dataWlInit.map(obj => ({ appliedOn: obj.appliedOn, stateName: obj.stateName }));

    mappedData.forEach(data => {
      const color = colorMapping[data.appliedOn];
      if (color) {
        applyColor(data, color);
      }
    });
  }

  clearMapRestriction(): void {
    const svgMapElements = document.querySelectorAll('#svg-map a, #svg-map .circle');

    svgMapElements.forEach((svgMapElement: Element) => {
      const pathElement = svgMapElement.querySelector('path');

      if (pathElement) {
        pathElement.style.fill = '#D3D3D3';
      }
    });
  }

  filterByWhitelabel(event: any): void {
    this.searchByWhitelabel.emit(event);
  }

  onRegionSelect(region: string): void {
    this.selectedRegion = region;
    let conditionMet = false;

    this.restrictMap.getRestrictMapWL(this.selectedPartnerOn).subscribe(res => {
      this.data = res;

      for (const regionData of this.data) {
        if (region === regionData.stateName) {
          this.restrictPrintMap = this.getRestrictPrintMap(regionData.appliedOn);
          this.formatAndSetDate(regionData.dateRegister);
          conditionMet = true;
          break;
        }
      }

      if (!conditionMet) {
        this.restrictPrintMap = 'Estado sem restrições';
        this.restrictPrintMapDateHour = '';
      }
    });
  }

  private getRestrictPrintMap(appliedOn: string): string {
    const mapLabels = {
      'zipcode': 'Endereço a domicílio',
      'geolocation': 'Geolocalização',
      'geolocationAndZipcode': 'Geolocalização e endereço de domicílio',
      'geolocationOrZipcode': 'Geolocalização ou endereço de domicílio'
    };
    return mapLabels[appliedOn] || '';
  }

  private formatAndSetDate(dateString: string): void {
    const dataOriginal = new Date(dateString);
    const dia = String(dataOriginal.getDate()).padStart(2, '0');
    const mes = String(dataOriginal.getMonth() + 1).padStart(2, '0');
    const ano = dataOriginal.getFullYear();

    this.restrictPrintMapDateHour = `Data de criação: ${dia}/${mes}/${ano}`;
  }

  private loadUserInfoAndScanMapRestrict(): Observable<any> {
    return from(this.userInfoService.getInfoProfile()).pipe(
      switchMap(userInfo => {
        this.userInfo = userInfo;
        this.dataUser = this.userInfo;
        this.selectedPartnerOn = this.userInfo.uuidWhiteLabel;
        return this.restrictMap.getRestrictMapAll(this.selectedPartnerOn);
      }),
      map(res => {
        this.data = res;
        return {
          registrationsCompleted: this.data[this.selectedRegion].registrationsCompleted,
          restrictedByHousehold: this.data[this.selectedRegion].restrictedByHousehold,
          restrictedByLocation: this.data[this.selectedRegion].restrictedByLocation
        };
      }),
      catchError(error => {
        console.error('Erro ao carregar dados:', error);
        return of(null);
      })
    );
  }

  private loadUserInfoAndScanMapWL(whitelabel: any): Observable<any[]> {
    return this.restrictMap.getRestrictMapWL(whitelabel);
  }

  async editRestriction(location: string, value: string): Promise<void> {
    try {
      const dataWl = await this.loadUserInfoAndScanMapWL(this.selectedPartnerOn).toPromise();
      this.country = location;
      this.value = value;

      const modalData = dataWl.map(objeto => ({
        appliedOn: objeto.appliedOn,
        dateUpdate: objeto.dateUpdate,
        stateName: objeto.stateName,
        uuidWhiteLabel: objeto.uuidWhiteLabel,
        countryName: objeto.countryName,
        uuid: objeto.uuid
      }));

      this.dialogRef = this.dialog.open(UiCRestrictLocationEditModalComponent, {
        data: {
          accData: this.userInfoService.getInfoProfile,
          location,
          value: this.value,
          modalData,
        },
      });
      this.dialogRefSubscription = this.dialogRef.afterClosed().subscribe(() => {
        this.partnerOn();
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  getWhitelabels(): void {
    this.loadWhitelabel.getAllWhitelabelsFront().pipe(
      tap(res => {
        this.dataWl = res;
      }),
      catchError(error => {
        console.error('Erro ao carregar dados:', error);
        return of(null);
      })
    ).subscribe();
  }

  async partnerOn(): Promise<void> {
    this.initWhitelabel = this.selectedPartnerOn;
    try {
      const dataWlInit = await this.loadUserInfoAndScanMapWL(this.initWhitelabel).toPromise();
      this.dataWlInit = dataWlInit;
      this.printMapRestrict();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }
}
