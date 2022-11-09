import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-payment-record-index',
  templateUrl: './payment-record-index.component.html',
  styleUrls: ['./payment-record-index.component.css']
})
export class PaymentRecordIndexComponent implements OnInit {

  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  serviceOrderList: any[] = [];
  danosList: any[] = [];
  settlementList: any[] = [];
  settlements: any[] = [];
  paymentInfo;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      corden: [''],
      cfiniquito: [''],
      xdanos: [''],
      
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 110
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
          }else{
            this.initializeDropdownDataRequest();
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDropdownDataRequest(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/service-order`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.danosList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.danosList.push({ 
            corden: response.data.list[i].corden,
            xdanos: `${response.data.list[i].xdanos} - ${response.data.list[i].xcliente}`
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontró información con los parámetros ingresados."; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });

    //Busca valor de finiquitos
    this.http.post(`${environment.apiUrl}/api/valrep/settlement`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.settlements = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.settlements.push({ 
            id: response.data.list[i].cfiniquito,
            value: `Por ${response.data.list[i].xcausafiniquito} - ${response.data.list[i].xnombre} - ${response.data.list[i].xapellido}`
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontró información con los parámetros ingresados."; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      corden: this.search_form.get('corden').value,
      cfiniquito: this.search_form.get('cfiniquito').value,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/administration/search`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.serviceOrderList = [];
        for(let i = 0; i < response.data.list.length; i++){
          let xservicio;
          let xmoneda;
          let mmontototal;
          let mtotal;
          if(response.data.list[i].xservicio){
            xservicio = response.data.list[i].xservicio
          }else{
            xservicio = response.data.list[i].xservicioadicional
          }
          if(response.data.list[i].xmoneda){
            xmoneda = response.data.list[i].xmoneda
          }else{
            xmoneda = response.data.list[i].xmonedacotizacion
          }
          if(response.data.list[i].mmontototal){
            mmontototal = response.data.list[i].mmontototal
          }else{
            mmontototal = 0
          }
          if(response.data.list[i].mtotal){
            mtotal = response.data.list[i].mtotal
          }else{
            mtotal = 0
          }
          this.serviceOrderList.push({ 
            corden: response.data.list[i].corden,
            xservicio: xservicio,
            xmoneda: xmoneda,
            xdanos: response.data.list[i].xdanos,
            xobservacion: response.data.list[i].xobservacion,
            mmontototal: mmontototal,
            mtotal: mtotal
          });
        }
      }
      if(response.data.settlementList){
        this.settlementList = [];
        for(let i = 0; i < response.data.settlementList.length; i++){
          let mmontofiniquito;
          if(response.data.settlementList[i].mmontofiniquito){
            mmontofiniquito = response.data.settlementList[i].mmontofiniquito
          }else{
            mmontofiniquito = 0
          }
          this.settlementList.push({ 
            cfiniquito: response.data.settlementList[i].cfiniquito,
            xmoneda: response.data.settlementList[i].xmoneda,
            xdanos: response.data.settlementList[i].xdanos,
            xobservacion: response.data.settlementList[i].xobservacion,
            mmontofiniquito: mmontofiniquito,
            xcausafiniquito: response.data.settlementList[i].xcausafiniquito
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontró información con los parámetros ingresados."; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    let corden = event.data.corden;
    let cfiniquito = event.data.cfiniquito;
    this.paymentInfo = {
      corden: corden,
      cfiniquito: cfiniquito
    }
    this.router.navigate([`administration/payment-record-detail`], { state: this.paymentInfo});
  }

}
