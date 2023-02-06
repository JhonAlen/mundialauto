import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ColDef} from 'ag-grid-community';
import { utils, writeFileXLSX } from 'xlsx';

@Component({
  selector: 'app-subscription-report',
  templateUrl: './subscription-report.component.html',
  styleUrls: ['./subscription-report.component.css']
})
export class SubscriptionReportComponent implements OnInit {

  currentUser;
  fhasta;
  search_form : UntypedFormGroup;
  searchStatus: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  excelLoading: boolean = false;
  excelStatus: boolean = false;
  subscriptionList: any[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'Cert.', field: 'ccontratoflota', width: 105, resizable: true },
    { headerName: 'Propietario', field: 'xnombrepropietario', width: 135, resizable: true },
    { headerName: 'Marca', field: 'xmarca', width: 170, resizable: true },
    { headerName: 'Modelo', field: 'xmodelo', width: 150, resizable: true },
    { headerName: 'Versión', field: 'xversion', width: 105, resizable: true },
    { headerName: 'Año', field: 'fano', width: 170, resizable: true },
    { headerName: 'Tipo', field: 'xtipo', width: 140, resizable: true },
    { headerName: 'Puestos', field: 'ncantidadpuestos', width: 140, resizable: true },
    { headerName: 'Placa', field: 'xplaca', width: 140, resizable: true },
    { headerName: 'Color', field: 'xcolor', width: 140, resizable: true },
    { headerName: 'Serial Carrocería', field: 'xserialcarroceria', width: 140, resizable: true },
    { headerName: 'Serial Motor', field: 'xserialmotor', width: 140, resizable: true },
    { headerName: 'Valor Asegurado Vehículo', field: 'mvaloraseguradovehiculo', width: 140, resizable: true },
    { headerName: 'Valor Asegurado Accesorios', field: 'mvaloraseguradoaccesorios', width: 140, resizable: true },
    { headerName: 'Tasa Aseg.', field: 'ptasaaseg', width: 140, resizable: true },
    { headerName: 'Prima Casco', field: 'mprimacasco', width: 140, resizable: true },
    { headerName: 'Prima Por Gstos. Catastróficos', field: 'mprimagastoscatastroficos', width: 140, resizable: true },
    { headerName: 'Prima Gastos de Recuperación', field: 'mprimagastosrecuperacion', width: 140, resizable: true },
    { headerName: 'Básica RCV', field: 'mprimabasicarcv', width: 140, resizable: true },
    { headerName: 'Exceso de Límite', field: 'mprimaexcesolimite', width: 140, resizable: true },
    { headerName: 'Defensa Penal', field: 'mprimadefensapenal', width: 140, resizable: true },
    { headerName: 'APOV', field: 'mprimaapov', width: 140, resizable: true },
    { headerName: 'Prima Motín', field: 'mprimamotin', width: 140, resizable: true },
    { headerName: 'Prima Indemnización Diaria Por Robo', field: 'mprimaindemnizacion', width: 140, resizable: true },
    { headerName: 'Total Prima R.C.V.', field: 'mprimatotalrcv', width: 140, resizable: true },
    { headerName: 'Grúas', field: 'mprimagruas', width: 140, resizable: true },
    { headerName: 'Total Prima Cía. Seguros', field: 'mprimatotal', width: 140, resizable: true }
  ];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      fhasta: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 120
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message: string;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      });
    }
  }

  onSearch(form) {
    this.loading = true;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      fhasta: form.fhasta
    };
    this.fhasta = null;
    this.http.post(`${environment.apiUrl}/api/subscription-report/search`, params, options).subscribe((response : any) => {
      if (response.data.status){
        this.subscriptionList = [];
        for (let i = 0; i < response.data.subscriptions.length; i++) {
          this.subscriptionList.push({
            ccontratoflota: response.data.subscriptions[i].ccontratoflota,
            xnombrepropietario: response.data.subscriptions[i].xnombrepropietario,
            xmarca: response.data.subscriptions[i].xmarca,
            xmodelo: response.data.subscriptions[i].xmodelo,
            xversion: response.data.subscriptions[i].xversion,
            fano: response.data.subscriptions[i].fano,
            xtipo: response.data.subscriptions[i].xtipovehiculo,
            ncantidadpuestos: response.data.subscriptions[i].npasajero,
            xplaca: response.data.subscriptions[i].xplaca,
            xcolor: response.data.subscriptions[i].xcolor,
            xserialcarroceria: response.data.subscriptions[i].xserialcarroceria,
            xserialmotor: response.data.subscriptions[i].xserialmotor,
            mvaloraseguradovehiculo: response.data.subscriptions[i].mvalor
          })
        }
        if (this.subscriptionList.length > 0){
          this.excelStatus = true;
        }
        this.fhasta = form.fhasta;
        this.loading = false;
      }
    },
    (err) => {
      this.loading = false;
      let code = err.error.data.code;
      let message: string;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 401){
        let condition = err.error.data.condition;
        if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
      }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
    });
  }

  downloadFile() {
    this.excelLoading = true;
    let nuevoFormato = this.fhasta.split('-');
    let fhasta = nuevoFormato[2] + '-' + nuevoFormato[1] + '-' + nuevoFormato[0];

    let wb = utils.book_new();
    //Width de cada columna del archivo
    let wsWidths = [
      { width: 6 },
      { width: 45 },
      { width: 15 },
      { width: 20 },
      { width: 40 },
      { width: 5 },
      { width: 20 },
      { width: 10 },
      { width: 11 },
      { width: 20 },
      { width: 25 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 8 },
      { width: 15 },
      { width: 20 },
      { width: 18 },
      { width: 9 },
      { width: 13 },
      { width: 10 },
      { width: 10 },
      { width: 9 },
      { width: 15 },
      { width: 15 },
      { width: 13 },
      { width: 15 }
    ]
    let headers = [["Cert.", "Propietario", "Marca", "Modelo", "Sucursal", "Versión", "Año", "Tipo", "Puestos", "Placa", "Color", "Serial Carrocería", "Serial Motor", "Valor Asegurado Vehículo", "Valor Asegurado Accesorios", "Tasa Aseg", "Prima Casco", "Prima Por Gtos. Catastróficos", "Prima Gastos de Recuperación", "Básica RCV", "Exceso de Límite", "Defensa Penal", "APOV", "Prima Motín", "Prima Indemnización Diaria por Robo o Hurto", "Total Prima R.C.V", "Grúas", "Total Cía. Seguros"]];
    let ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headers);
    utils.sheet_add_json(ws, this.subscriptionList, { origin: 'A2', skipHeader: true });
    ws["!cols"] = wsWidths;

    utils.book_append_sheet(wb, ws, "Primas Pendientes");
    writeFileXLSX(wb, `Primas Pendientes ${fhasta}.xlsx`);
    this.excelLoading = false;
  }

  onChangeDateUntil() {
    let fhasta = this.search_form.get('fhasta').value
    if (fhasta) {
      this.searchStatus = true;
    }
    else {
      this.searchStatus = false;
    }
  }

}
