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
  fdesde;
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
    { headerName: 'Tasa Aseg.', field: 'ptasaasegurada', width: 140, resizable: true },
    { headerName: 'Prima Casco', field: 'mprimacasco', width: 140, resizable: true },
    { headerName: 'Prima Por Gstos. Catastróficos', field: 'mriesgocatastrofico', width: 140, resizable: true },
    { headerName: 'Básica RCV', field: 'mbasicarcv', width: 140, resizable: true },
    { headerName: 'Exceso de Límite', field: 'mexcesodelimite', width: 140, resizable: true },
    { headerName: 'Defensa Penal', field: 'mdefensapenal', width: 140, resizable: true },
    { headerName: 'APOV', field: 'mapov', width: 140, resizable: true },
    { headerName: 'Prima Motín', field: 'mmotin', width: 140, resizable: true },
    { headerName: 'Total Prima R.C.V.', field: 'mtotalprimarcv', width: 140, resizable: true },
    { headerName: 'Grúas', field: 'mserviciogrua', width: 140, resizable: true },
    { headerName: 'Total Prima Cía. Seguros', field: 'mprimatotal', width: 140, resizable: true }
  ];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      fdesde: [''],
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
      fdesde: form.fdesde,
      fhasta: form.fhasta
    };
    this.fhasta = null;
    this.fdesde = null;
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
            mvaloraseguradovehiculo: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mvalor),
            mvaloraseguradoaccesorios: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mvaloraccesorios),
            ptasaasegurada: response.data.subscriptions[i].ptasaasegurada,
            mprimacasco: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mprimacasco),
            mriesgocatastrofico: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mriesgocatastrofico),
            mbasicarcv: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mbasicarcv),
            mexcesodelimite: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mexcesodelimite),
            mdefensapenal: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mdefensapenal),
            mapov: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mapov),
            mmotin: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mmotin),
            mtotalprimarcv: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mtotalprimarcv),
            mserviciogrua: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mserviciogrua),
            mprimatotal: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.subscriptions[i].mprimatotal)
          })
        }
        console.log(this.subscriptionList);
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
      { width: 20 },//valor aseg
      { width: 20 },
      { width: 8 },
      { width: 15 },
      { width: 20 },
      { width: 9 },
      { width: 13 },
      { width: 10 },
      { width: 10 },
      { width: 9 },
      { width: 15 },
      { width: 13 },
      { width: 15 }
    ]
    let headers = [["Cert.",
                    "Propietario", 
                    "Marca", 
                    "Modelo", 
                    "Versión", 
                    "Año", 
                    "Tipo", 
                    "Puestos", 
                    "Placa", 
                    "Color", 
                    "Serial Carrocería", 
                    "Serial Motor", 
                    "Valor Asegurado Vehículo", 
                    "Valor Asegurado Accesorios", 
                    "Tasa Aseg", 
                    "Prima Casco", 
                    "Prima Por Gtos. Catastróficos", 
                    "Básica RCV", 
                    "Exceso de Límite", 
                    "Defensa Penal", 
                    "APOV", 
                    "Prima Motín", 
                    "Total Prima R.C.V", 
                    "Grúas", 
                    "Total Cía. Seguros"]];
    let ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headers);
    utils.sheet_add_json(ws, this.subscriptionList, { origin: 'A2', skipHeader: true });
    ws["!cols"] = wsWidths;

    utils.book_append_sheet(wb, ws, "Primas Pendientes");
    writeFileXLSX(wb, `Primas Pendientes ${fhasta}.xlsx`);
    this.excelLoading = false;
  }

  onChangeDateFrom() {
    let fdesde = this.search_form.get('fdesde').value;
    let fhasta = this.search_form.get('fhasta').value;
    console.log(fdesde);
    console.log(fhasta);
    if (fdesde) {
      if (fhasta) {
        if (fdesde > fhasta) {
          alert('La fecha desde debe de ser menor que la fecha hasta');
          this.searchStatus = false;
        }
        else {
          this.searchStatus = true;
        }
      }
      else {
        this.searchStatus = false;
      }
    }
    else {
      this.searchStatus = false;
    }
  }

  onChangeDateUntil() {
    let fhasta = this.search_form.get('fhasta').value;
    let fdesde = this.search_form.get('fdesde').value;
    console.log(fdesde);
    console.log(fhasta);
    if (fhasta) {
      if (fdesde) {
        if (fhasta < fdesde) {
          alert('La fecha hasta debe de ser mayor que la fecha desde');
          this.searchStatus = false;
        }
        else {
          this.searchStatus = true;
        }
      }
      else {
        this.searchStatus = false;
      }
    }
    else {
      this.searchStatus = false;
    }
  }

}
