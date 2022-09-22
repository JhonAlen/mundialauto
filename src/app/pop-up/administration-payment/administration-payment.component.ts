import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-administration-payment',
  templateUrl: './administration-payment.component.html',
  styleUrls: ['./administration-payment.component.css']
})
export class AdministrationPaymentComponent implements OnInit {

  @Input() public payment;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  canSave: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canDelete: boolean = false;
  showSaveButton: boolean = false;
  code;
  bankList: any[] = [];
  typeOfPayList: any[] = [];
  coinList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctipopago: [''],
      xtipopago: [''],
      cmoneda_pago: [''],
      xreferencia: [''],
      fcobro: [''],
      cbanco: [''],
      xbanco: [''],
      mprima_pagada: [''],
      cmoneda: [''],
      xmoneda: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 103
      }
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
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };

    //Buscar listas de bancos.

    this.http.post(`${environment.apiUrl}/api/valrep/bank`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.bankList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.bankList.push({ id: response.data.list[i].cbanco, value: response.data.list[i].xbanco});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    //Buscar lista de tipo de pagos

    this.http.post(`${environment.apiUrl}/api/valrep/payment-type`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.typeOfPayList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.typeOfPayList.push({ id: response.data.list[i].ctipopago, value: response.data.list[i].xtipopago});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    // Buscar lista de Moneda

    this.http.post(`${environment.apiUrl}/api/valrep/coin`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.coinList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.coinList.push({ id: response.data.list[i].cmoneda, value: response.data.list[i].xmoneda});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    this.canSave = true;
    this.showSaveButton = true;
  }

  onSubmit(form){
    console.log('hola')
    this.submitted = true;
    this.loading = true;

   let bankFilter = this.bankList.filter((option) => { return option.id == this.popup_form.get('cbanco').value; });
   let typeOfPayFilter = this.typeOfPayList.filter((option) => { return option.id == this.popup_form.get('ctipopago').value; });
   let coinFilter = this.coinList.filter((option) => { return option.id == this.popup_form.get('cmoneda').value; });

   this.payment.cbanco = this.popup_form.get('cbanco').value;
   this.payment.xbanco = bankFilter[0].value;
   this.payment.ctipopago = this.popup_form.get('ctipopago').value;
   this.payment.xtipopago = typeOfPayFilter[0].value;
   this.payment.cmoneda_pago = this.popup_form.get('cmoneda').value;
   this.payment.xreferencia = form.xreferencia;
   this.payment.fcobro = form.fcobro;
   this.payment.mprima_pagada = form.mprima_pagada;

   this.activeModal.close(this.payment);
  }

}
