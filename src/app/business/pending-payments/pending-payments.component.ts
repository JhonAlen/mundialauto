import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ColDef} from 'ag-grid-community';
import { utils, writeFileXLSX } from 'xlsx';


@Component({
  selector: 'app-pending-payments',
  templateUrl: './pending-payments.component.html',
  styleUrls: ['./pending-payments.component.css']
})
export class PendingPaymentsComponent implements OnInit {

  currentUser;
  fhasta;
  search_form : UntypedFormGroup;
  searchStatus: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  excelLoading: boolean = false;
  excelStatus: boolean = false;
  receiptList: any[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'Póliza N°', field: 'xpoliza', width: 105, resizable: true },
    { headerName: 'Certificado N°', field: 'ccontratoflota', width: 135, resizable: true },
    { headerName: 'Nombre Asegurado', field: 'xnombrepropietario', width: 170, resizable: true },
    { headerName: 'Sucursal', field: 'xsucursalemision', width: 150, resizable: true },
    { headerName: 'Cód. Inter.', field: 'ccorredor', width: 105, resizable: true },
    { headerName: 'Nombre Intermediario', field: 'xcorredor', width: 170, resizable: true },
    { headerName: 'Recibo N°', field: 'nrecibo', width: 140, resizable: true },
    { headerName: 'Moneda', field: 'xmoneda', width: 140, resizable: true },
    { headerName: 'Fec. Emisión', field: 'femision', width: 140, resizable: true },
    { headerName: 'Días', field: 'ndias', width: 140, resizable: true }
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
        cmodulo: 118
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
    this.http.post(`${environment.apiUrl}/api/pending-payments/search`, params, options).subscribe((response : any) => {
      if (response.data.status){
        this.receiptList = [];
        for (let i = 0; i < response.data.receipts.length; i++) {
          this.receiptList.push({
            xpoliza: response.data.receipts[i].xpoliza,
            ccontratoflota: response.data.receipts[i].ccontratoflota,
            xnombrepropietario: response.data.receipts[i].xnombre,
            xsucursalemision: response.data.receipts[i].xsucursalemision,
            ccorredor: response.data.receipts[i].ccorredor,
            xcorredor: response.data.receipts[i].xcorredor,
            nrecibo: response.data.receipts[i].nrecibo,
            xmoneda: response.data.receipts[i].xmoneda,
            femision: response.data.receipts[i].femision,
            ndias: 15
            /*fdesde_rec: response.data.receipts[i].fdesde_rec,
            fhasta_rec: response.data.receipts[i].fhasta_rec*/
          })
        }
        if (this.receiptList.length > 0){
          this.excelStatus = true;
        }
        this.fhasta = form.fhasta;
        this.loading = false;
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

  downloadFile(){
    this.excelLoading = true;
    let nuevoFormato = this.fhasta.split('-');
    let fhasta = nuevoFormato[2] + '-' + nuevoFormato[1] + '-' + nuevoFormato[0];
    let ws = utils.json_to_sheet(this.receiptList);
    let wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Primas Pendientes");
    writeFileXLSX(wb, `Primas Pendientes ${fhasta}.xlsx`);
    this.excelLoading = false;
  }

  onChangeDateUntil() {
    let fhasta = this.search_form.get('fhasta').value;
    if (fhasta) {
        this.searchStatus = true;
    }   
    else {
      this.searchStatus = false;
    }
  }

}
