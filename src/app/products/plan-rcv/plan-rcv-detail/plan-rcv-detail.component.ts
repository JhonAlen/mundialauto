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
              xclase: response.data.rates[i].xclase,
              xtipo: response.data.rates[i].xtipo,
              xgrupo: response.data.rates[i].xgrupo,
              msuma_cosas_rc: response.data.rates[i].msuma_cosas_rc,
              msuma_personas_rc: response.data.rates[i].msuma_personas_rc,
              mprima_rc: response.data.rates[i].mprima_rc,
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
        console.log(result)
      }
    });
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

    if(this.code){
      params = {
        cusuario: this.currentUser.data.cusuario,
        cplan_rc: this.code,
        xplan_rc: form.xplan_rc,
        ctarifa: this.ctarifa,
        xclase: form.xclase,
        xtipo: form.xtipo,
        xgrupo: form.xgrupo,
        msuma_cosas_rc: form.msuma_cosas_rc,
        msuma_personas_rc: form.msuma_personas_rc,
        mprima_rc: form.mprima_rc,
        msuma_defensa_per: form.msuma_defensa_per,
        mprima_defensa_per: form.mprima_defensa_per,
        msuma_limite_ind: form.msuma_limite_ind,
        mprima_limite_ind: form.mprima_limite_ind,
        msuma_apov_ga: form.msuma_apov_ga,
        msuma_apov_mu: form.msuma_apov_mu,
        mapov_mu: form.mapov_mu,
        msuma_apov_in: form.msuma_apov_in,
        mapov_in: form.mapov_in,
        mapov_ga: form.mapov_ga,
        msuma_apov_fu: form.msuma_apov_fu,
        mapov_fu: form.mapov_fu
      };
      url = `${environment.apiUrl}/api/plan-rcv/update`;
    }else{
      params = {
        cusuario: this.currentUser.data.cusuario,
        xplan_rc: form.xplan_rc,
        msuma_dc: form.msuma_dc,
        msuma_personas: form.msuma_personas,
        msuma_exceso: form.msuma_exceso,
        msuma_dp: form.msuma_dp,
        msuma_muerte: form.msuma_muerte,
        msuma_invalidez: form.msuma_invalidez,
        msuma_gm: form.msuma_gm,
        msuma_gf: form.msuma_gf,
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
