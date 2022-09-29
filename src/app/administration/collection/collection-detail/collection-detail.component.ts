import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdministrationPaymentComponent } from '@app/pop-up/administration-payment/administration-payment.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { RoadManagementConfigurationIndexComponent } from '@app/quotation/road-management-configuration/road-management-configuration-index/road-management-configuration-index.component';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css']
})
export class CollectionDetailComponent implements OnInit {
  private paymentGridApi;
  showSaveButton: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  guardado: boolean = false;
  botonRegresar: boolean = false;
  code;
  sub;
  currentUser;
  detail_form: FormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  paymentList: any[] = [];
  closeResult = '';

  constructor(private formBuilder: FormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      xnombrepropietario: [''],
      xapellidopropietario: [''],
      fdesde_pol: [''],
      fhasta_pol: [''],
      xdocidentidad: [''],
      xvehiculo: [''],
      xplaca: [''],
      crecibo: [''],
      xmoneda: [''],
      xestatusgeneral: [''],
      mprima: [''],
      ctipopago: [''],
      xtipopago: [''],
      xreferencia: [''],
      fcobro: [''],
      cbanco: [''],
      mprima_pagada: [''],
      cmoneda_pago: ['']
    })
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 103
      };
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.initializeDetailModule();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){ 
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
      }
    });

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      crecibo: this.code
    };
    this.http.post(`${environment.apiUrl}/api/administration-collection/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('xnombrepropietario').setValue(response.data.xnombrepropietario);
        this.detail_form.get('xnombrepropietario').disable();
        this.detail_form.get('xapellidopropietario').setValue(response.data.xapellidopropietario);
        this.detail_form.get('xapellidopropietario').disable();
        this.detail_form.get('fdesde_pol').setValue(new Date(response.data.fdesde_pol).toISOString().substring(0, 10));
        this.detail_form.get('fdesde_pol').disable();
        this.detail_form.get('fhasta_pol').setValue(new Date(response.data.fhasta_pol).toISOString().substring(0, 10));
        this.detail_form.get('fhasta_pol').disable();
        this.detail_form.get('xdocidentidad').setValue(response.data.xdocidentidad);
        this.detail_form.get('xdocidentidad').disable();
        this.detail_form.get('xvehiculo').setValue(response.data.xvehiculo);
        this.detail_form.get('xvehiculo').disable();
        this.detail_form.get('xplaca').setValue(response.data.xplaca);
        this.detail_form.get('xplaca').disable();
        this.detail_form.get('xmoneda').setValue(response.data.xmoneda);
        this.detail_form.get('xmoneda').disable();
        this.detail_form.get('xestatusgeneral').setValue(response.data.xestatusgeneral);
        this.detail_form.get('xestatusgeneral').disable();
        this.detail_form.get('mprima').setValue(response.data.mprima);
        this.detail_form.get('mprima').disable();
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  addPayment(){
    let payment = { crecibo: this.code };
    const modalRef = this.modalService.open(AdministrationPaymentComponent);
    modalRef.componentInstance.payment = payment;
    modalRef.result.then((result: any) => { 
      if(result){
          this.paymentList.push({
            cgrid: this.paymentList.length,
            edit: true,
            ctipopago: result.ctipopago,
            xtipopago: result.xtipopago,
            xreferencia: result.xreferencia,
            fcobro: result.fcobro,
            cbanco: result.cbanco,
            xbanco: result.xbanco,
            mprima_pagada: result.mprima_pagada,
            cmoneda_pago: result.cmoneda_pago
          });
          this.paymentGridApi.setRowData(this.paymentList);

          if(this.paymentList){
            this.showSaveButton= true;
          }
      }
    });
  }

  onPaymentGridReady(event){
    this.paymentGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    let url;
    let dateFormat = new Date(form.fcreacion).toUTCString();
    let fajusteDateFormat = new Date(form.fajuste).toUTCString();

    if(this.code){
      params = {
        ccompania: this.currentUser.data.ccompania,
        cpais: this.currentUser.data.cpais,
        crecibo: this.code,
        pago: this.paymentList
      };
      url = `${environment.apiUrl}/api/administration-collection/update`;
    } 
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          //this.returnIndex();
          this.router.navigate([`/administration/collection-index`]);
        }else{
          this.router.navigate([`/administration/collection-detail/${response.data.crecibo}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "service-order-already-exist"){
          this.alert.message = "EVENTS.SERVICEORDER.NAMEREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = 1;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.THIRDPARTIES.ASSOCIATENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }
 
/*  open() {
      this.modalService.open({ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed`;
      });
  }

  returnIndex(){
    this.guardado = true;
    if(this.guardado){
      this.open();
    }

  }

  returnTrue(){
    this.botonRegresar = true;
    if(this.botonRegresar){
      this.router.navigate([`/administration/collection-index`]);
    }
  }*/
}