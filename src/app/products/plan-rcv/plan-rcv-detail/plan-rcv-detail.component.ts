import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanRcvRatesComponent } from '@app/pop-up/plan-rcv-rates/plan-rcv-rates.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-rcv-detail',
  templateUrl: './plan-rcv-detail.component.html',
  styleUrls: ['./plan-rcv-detail.component.css']
})
export class PlanRcvDetailComponent implements OnInit {

  private ratesGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  planTypeList: any[] = [];
  paymentMethodologyList: any[] = [];
  insurerList: any[] = [];
  serviceList: any[] = [];
  serviceInsurerList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  paymentMethodologyDeletedRowList: any[] = [];
  insurerDeletedRowList: any[] = [];
  serviceDeletedRowList: any[] = [];
  ctarifa;
  bocultar: boolean = false;
  ratesList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { 
              }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      cplan_rc: [''],
      xplan_rc: [''],
      ctarifa: [''],
      xclase: [''],
      xtipo: [''],
      xgrupo: [''],
      msuma_cosas_rc: [''],
      msuma_personas_rc: [''],
      mprima_rc: [''],
      msuma_defensa_per: [''],
      mprima_defensa_per: [''],
      msuma_limite_ind: [''],
      mprima_limite_ind: [''],
      msuma_apov_mu: [''],
      mapov_mu: [''],
      msuma_apov_in: [''],
      mapov_in: [''],
      msuma_apov_ga: [''],
      mapov_ga: [''],
      msuma_apov_fu: [''],
      mapov_fu: [''],
      msuma_dc: [''],
      msuma_personas: [''],
      msuma_exceso: [''],
      msuma_dp: [''],
      msuma_muerte: [''],
      msuma_invalidez: [''],
      msuma_gm: [''],
      msuma_gf: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 108
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
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
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
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
        this.getPlanData();
        this.bocultar = true;
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        this.bocultar = false;
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.editStatus = true;
        this.showSaveButton = true;
      }
    });
  }  

  getPlanData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cplan_rc: this.code,
    };
    this.http.post(`${environment.apiUrl}/api/plan-rcv/detail`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.detail_form.get('xplan_rc').setValue(response.data.xplan_rc);
        this.detail_form.get('xplan_rc').disable();
        this.detail_form.get('msuma_dc').setValue(response.data.msuma_dc);
        this.detail_form.get('msuma_dc').disable();
        this.detail_form.get('msuma_personas').setValue(response.data.msuma_personas);
        this.detail_form.get('msuma_personas').disable();
        this.detail_form.get('msuma_exceso').setValue(response.data.msuma_exceso);
        this.detail_form.get('msuma_exceso').disable();
        this.detail_form.get('msuma_dp').setValue(response.data.msuma_dp);
        this.detail_form.get('msuma_dp').disable();
        this.detail_form.get('msuma_muerte').setValue(response.data.msuma_muerte);
        this.detail_form.get('msuma_muerte').disable();
        this.detail_form.get('msuma_invalidez').setValue(response.data.msuma_invalidez);
        this.detail_form.get('msuma_invalidez').disable();
        this.detail_form.get('msuma_gm').setValue(response.data.msuma_gm);
        this.detail_form.get('msuma_gm').disable();
        this.detail_form.get('msuma_gf').setValue(response.data.msuma_gf);
        this.detail_form.get('msuma_gf').disable();
        this.ratesList = [];
        if(response.data.rates){
          for(let i = 0; i < response.data.rates.length; i++){
            this.ratesList.push({
              ctarifa: i + 1,
              xclase: response.data.rates[i].xclase,
              xtipo: response.data.rates[i].xtipo,
              xgrupo: response.data.rates[i].xgrupo,
              mgrua: response.data.rates[i].mgrua,
              mut_cosas_rc: response.data.rates[i].mut_cosas_rc,
              msuma_cosas_rc: response.data.rates[i].msuma_cosas_rc,
              mut_personas_rc: response.data.rates[i].mut_personas_rc,
              msuma_personas_rc: response.data.rates[i].msuma_personas_rc,
              mut_prima_rc: response.data.rates[i].mut_prima_rc,
              mprima_rc: response.data.rates[i].mprima_rc,
              mexceso_limite: response.data.rates[i].mexceso_limite,
              mgastos_cat: response.data.rates[i].mgastos_cat,
              mrecuperacion: response.data.rates[i].mrecuperacion,
              msuma_defensa_per: response.data.rates[i].msuma_defensa_per,
              mprima_defensa_per: response.data.rates[i].mprima_defensa_per,
              msuma_limite_ind: response.data.rates[i].msuma_limite_ind,
              mprima_limite_ind: response.data.rates[i].mprima_limite_ind,
              msuma_apov_ga: response.data.rates[i].msuma_apov_ga,
              msuma_apov_mu: response.data.rates[i].msuma_apov_mu,
              mapov_mu: response.data.rates[i].mapov_mu,
              msuma_apov_in: response.data.rates[i].msuma_apov_in,
              mapov_in: response.data.rates[i].mapov_in,
              mapov_ga: response.data.rates[i].mapov_ga,
              msuma_apov_fu: response.data.rates[i].msuma_apov_fu,
              mapov_fu: response.data.rates[i].mapov_fu
            })
          }
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.PLANTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editPlan(){
    this.detail_form.get('xplan_rc').enable();
    this.detail_form.get('msuma_dc').enable();
    this.detail_form.get('msuma_personas').enable();
    this.detail_form.get('msuma_exceso').enable();
    this.detail_form.get('msuma_dp').enable();
    this.detail_form.get('msuma_muerte').enable();
    this.detail_form.get('msuma_invalidez').enable();
    this.detail_form.get('msuma_gm').enable();
    this.detail_form.get('msuma_gf').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.editStatus = false;
      this.getPlanData();
    }else{
      this.router.navigate([`/products/plan-rcv-index`]);
    }
  }

  addRates(){
    let rates = { type: 3 };
    const modalRef = this.modalService.open(PlanRcvRatesComponent, {size: 'xl'});
    modalRef.componentInstance.rates = rates;
    modalRef.result.then((result: any) => { 
      if(result){
        for(let i = 0; i < result.length; i++){
            this.ratesList.push({
              create: true,
              ctarifa: this.ratesList.length + 1,
              xclase: result[i].xclase,
              xtipo: result[i].xtipo,
              xgrupo: result[i].xgrupo,
              mgrua: result[i].mgrua,
              mut_cosas_rc: result[i].mut_cosas_rc,
              msuma_cosas_rc: result[i].msuma_cosas_rc,
              mut_personas_rc: result[i].mut_personas_rc,
              msuma_personas_rc: result[i].msuma_personas_rc,
              mut_prima_rc: result[i].mut_prima_rc,
              mprima_rc: result[i].mprima_rc,
              mexceso_limite: result[i].mprima_rc,
              mgastos_cat: result[i].mgastos_cat,
              mrecuperacion: result[i].mrecuperacion,
              msuma_defensa_per: result[i].msuma_defensa_per,
              mprima_defensa_per: result[i].mprima_defensa_per,
              msuma_limite_ind: result[i].msuma_limite_ind,
              mprima_limite_ind: result[i].mprima_limite_ind,
              msuma_apov_mu: result[i].msuma_apov_mu,
              mapov_mu: result[i].mapov_mu,
              msuma_apov_in: result[i].msuma_apov_in,
              mapov_in: result[i].mapov_in,
              msuma_apov_ga: result[i].msuma_apov_ga,
              mapov_ga: result[i].mapov_ga,
              msuma_apov_fu: result[i].msuma_apov_fu,
              mapov_fu: result[i].mapov_fu
            })
          this.ratesGridApi.setRowData(this.ratesList);
        }
      }
    });
  }

  ratesRowClicked(event: any){
    let rates = {}
    if(this.editStatus){
      rates = {
        type: 1,
        create: false,
        cgrid: event.data.cgrid,
        ctarifa: event.data.ctarifa,
        xclase: event.data.xclase,
        xtipo: event.data.xtipo,
        xgrupo: event.data.xgrupo,
        mgrua: event.data.mgrua,
        mut_cosas_rc: event.data.mut_cosas_rc,
        msuma_cosas_rc: event.data.msuma_cosas_rc,
        mut_personas_rc: event.data.mut_personas_rc,
        msuma_personas_rc: event.data.msuma_personas_rc,
        mut_prima_rc: event.data.mut_prima_rc,
        mprima_rc: event.data.mprima_rc,
        mexceso_limite: event.data.mprima_rc,
        mgastos_cat: event.data.mgastos_cat,
        mrecuperacion: event.data.mrecuperacion,
        msuma_defensa_per: event.data.msuma_defensa_per,
        mprima_defensa_per: event.data.mprima_defensa_per,
        msuma_limite_ind: event.data.msuma_limite_ind,
        mprima_limite_ind: event.data.mprima_limite_ind,
        msuma_apov_mu: event.data.msuma_apov_mu,
        mapov_mu: event.data.mapov_mu,
        msuma_apov_in: event.data.msuma_apov_in,
        mapov_in: event.data.mapov_in,
        msuma_apov_ga: event.data.msuma_apov_ga,
        mapov_ga: event.data.mapov_ga,
        msuma_apov_fu: event.data.msuma_apov_fu,
        mapov_fu: event.data.mapov_fu
      }
    }else{
      rates = {
        type: 2,
        create: false, 
        cgrid: event.data.cgrid,
        ctarifa: event.data.ctarifa,
        xclase: event.data.xclase,
        xtipo: event.data.xtipo,
        xgrupo: event.data.xgrupo,
        mgrua: event.data.mgrua,
        mut_cosas_rc: event.data.mut_cosas_rc,
        msuma_cosas_rc: event.data.msuma_cosas_rc,
        mut_personas_rc: event.data.mut_personas_rc,
        msuma_personas_rc: event.data.msuma_personas_rc,
        mut_prima_rc: event.data.mut_prima_rc,
        mprima_rc: event.data.mprima_rc,
        mexceso_limite: event.data.mprima_rc,
        mgastos_cat: event.data.mgastos_cat,
        mrecuperacion: event.data.mrecuperacion,
        msuma_defensa_per: event.data.msuma_defensa_per,
        mprima_defensa_per: event.data.mprima_defensa_per,
        msuma_limite_ind: event.data.msuma_limite_ind,
        mprima_limite_ind: event.data.mprima_limite_ind,
        msuma_apov_mu: event.data.msuma_apov_mu,
        mapov_mu: event.data.mapov_mu,
        msuma_apov_in: event.data.msuma_apov_in,
        mapov_in: event.data.mapov_in,
        msuma_apov_ga: event.data.msuma_apov_ga,
        mapov_ga: event.data.mapov_ga,
        msuma_apov_fu: event.data.msuma_apov_fu,
        mapov_fu: event.data.mapov_fu
      }
    }
    const modalRef = this.modalService.open(PlanRcvRatesComponent, {size: 'xl'});
    modalRef.componentInstance.rates = rates;
    modalRef.result.then((result: any) => {
      if(result){
        for(let i = 0; i < result.length; i++){
          let index = this.ratesList.findIndex(el=> el.ctarifa == result[i].ctarifa);
          console.log(index)
          this.ratesList[index].xclase = result[i].xclase;
          this.ratesList[index].xtipo = result[i].xtipo;
          this.ratesList[index].xgrupo = result[i].xgrupo;
          this.ratesList[index].mgrua = result[i].mgrua;
          this.ratesList[index].mut_cosas_rc = result[i].mut_cosas_rc;
          this.ratesList[index].msuma_cosas_rc = result[i].msuma_cosas_rc;
          this.ratesList[index].mut_personas_rc = result[i].mut_personas_rc;
          this.ratesList[index].msuma_personas_rc = result[i].msuma_personas_rc;
          this.ratesList[index].mut_prima_rc = result[i].mut_prima_rc;
          this.ratesList[index].mprima_rc = result[i].mprima_rc;
          this.ratesList[index].mexceso_limite = result[i].mexceso_limite;
          this.ratesList[index].mgastos_cat = result[i].mgastos_cat;
          this.ratesList[index].mrecuperacion = result[i].mrecuperacion;
          this.ratesList[index].msuma_defensa_per = result[i].msuma_defensa_per;
          this.ratesList[index].mprima_defensa_per = result[i].mprima_defensa_per;
          this.ratesList[index].msuma_limite_ind = result[i].msuma_limite_ind;
          this.ratesList[index].mprima_limite_ind = result[i].mprima_limite_ind;
          this.ratesList[index].msuma_apov_mu = result[i].msuma_apov_mu;
          this.ratesList[index].mapov_mu = result[i].mapov_mu;
          this.ratesList[index].msuma_apov_in = result[i].msuma_apov_in;
          this.ratesList[index].mapov_in = result[i].mapov_in;
          this.ratesList[index].msuma_apov_ga = result[i].msuma_apov_ga;
          this.ratesList[index].mapov_ga = result[i].mapov_ga;
          this.ratesList[index].msuma_apov_fu = result[i].msuma_apov_fu;
          this.ratesList[index].mapov_fu = result[i].mapov_fu;
          this.ratesGridApi.refreshCells();
        }
      }
    });
  }

  onRatesGridReady(event){
    this.ratesGridApi = event.api;
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

    let createRatesList = this.ratesList.filter((row) => { return row.create; });
    let updateRatesList = this.ratesList.filter((row) => { return !row.create; });

    if(this.code){
      params = {
        cusuario: this.currentUser.data.cusuario,
        cplan_rc: this.code,
        xplan_rc: form.xplan_rc,
        msuma_dc: form.msuma_dc,
        msuma_personas: form.msuma_personas,
        msuma_exceso: form.msuma_exceso,
        msuma_muerte: form.msuma_muerte,
        msuma_invalidez: form.msuma_invalidez,
        msuma_gm: form.msuma_gm,
        msuma_gf: form.msuma_gf,
        rates: {
          create: createRatesList,
          update: updateRatesList
        }
      };
      url = `${environment.apiUrl}/api/plan-rcv/update`;
    }else{
      params = {
        cusuario: this.currentUser.data.cusuario,
        xplan_rc: form.xplan_rc,
        msuma_dc: form.msuma_dc,
        msuma_personas: form.msuma_personas,
        msuma_exceso: form.msuma_exceso,
        msuma_muerte: form.msuma_muerte,
        msuma_invalidez: form.msuma_invalidez,
        msuma_gm: form.msuma_gm,
        msuma_gf: form.msuma_gf,
        rates: this.ratesList
      };
      url = `${environment.apiUrl}/api/plan-rcv/create`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/products/plan-rcv-detail/${response.data.cplan_rc}`]);
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
}
