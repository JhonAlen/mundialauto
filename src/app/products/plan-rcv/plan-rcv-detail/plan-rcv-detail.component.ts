import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  ctarifa: number;
  tarifaList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { 
                if (this.router.getCurrentNavigation().extras.state == null) {
                  this.router.navigate([`products/plan-rcv-index`]);
                } else {
                  this.ctarifa = this.router.getCurrentNavigation().extras.state.ctarifa; 
                }
              }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      cplan_rc: [''],
      xplan_rc: [''],
      ctarifa: [''],
      xclase: [''],
      xtipo: [''],
      xgrupo: [''],
      mut_cosas_rc: [''],
      msuma_cosas_rc: [''],
      mut_personas_rc: [''],
      msuma_personas_rc: [''],
      mut_prima_rc: [''],
      mprima_rc: [''],
      mexceso_limite: [''],
      mgastos_cat: [''],
      mrecuperacion: [''],
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
        if(this.canEdit){ this.showEditButton = true; }
      }else{
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
        ctarifa: this.ctarifa
      };
      console.log(params)
      this.http.post(`${environment.apiUrl}/api/plan-rcv/detail`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.detail_form.get('xplan_rc').setValue(response.data.xplan_rc);
          this.detail_form.get('xplan_rc').disable();
          this.detail_form.get('ctarifa').setValue(response.data.ctarifa);
          this.detail_form.get('ctarifa').disable();
          this.detail_form.get('xclase').setValue(response.data.xclase);
          this.detail_form.get('xclase').disable();
          this.detail_form.get('xtipo').setValue(response.data.xtipo);
          this.detail_form.get('xtipo').disable();
          this.detail_form.get('xgrupo').setValue(response.data.xgrupo);
          this.detail_form.get('xgrupo').disable();
          this.detail_form.get('mut_cosas_rc').setValue(response.data.mut_cosas_rc);
          this.detail_form.get('mut_cosas_rc').disable();
          this.detail_form.get('msuma_cosas_rc').setValue(response.data.msuma_cosas_rc);
          this.detail_form.get('msuma_cosas_rc').disable();
          this.detail_form.get('mut_personas_rc').setValue(response.data.mut_personas_rc);
          this.detail_form.get('mut_personas_rc').disable();
          this.detail_form.get('msuma_personas_rc').setValue(response.data.msuma_personas_rc);
          this.detail_form.get('msuma_personas_rc').disable();
          this.detail_form.get('mut_prima_rc').setValue(response.data.mut_prima_rc);
          this.detail_form.get('mut_prima_rc').disable();
          this.detail_form.get('mprima_rc').setValue(response.data.mprima_rc);
          this.detail_form.get('mprima_rc').disable();
          this.detail_form.get('mexceso_limite').setValue(response.data.mexceso_limite);
          this.detail_form.get('mexceso_limite').disable();
          this.detail_form.get('mgastos_cat').setValue(response.data.mgastos_cat);
          this.detail_form.get('mgastos_cat').disable();
          this.detail_form.get('mrecuperacion').setValue(response.data.mrecuperacion);
          this.detail_form.get('mrecuperacion').disable();
          this.detail_form.get('msuma_defensa_per').setValue(response.data.msuma_defensa_per);
          this.detail_form.get('msuma_defensa_per').disable();
          this.detail_form.get('mprima_defensa_per').setValue(response.data.mprima_defensa_per);
          this.detail_form.get('mprima_defensa_per').disable();
          this.detail_form.get('msuma_limite_ind').setValue(response.data.msuma_limite_ind);
          this.detail_form.get('msuma_limite_ind').disable();
          this.detail_form.get('mprima_limite_ind').setValue(response.data.mprima_limite_ind);
          this.detail_form.get('mprima_limite_ind').disable();
          this.detail_form.get('msuma_apov_mu').setValue(response.data.msuma_apov_mu);
          this.detail_form.get('msuma_apov_mu').disable();
          this.detail_form.get('mapov_mu').setValue(response.data.mapov_mu);
          this.detail_form.get('mapov_mu').disable();
          this.detail_form.get('msuma_apov_in').setValue(response.data.msuma_apov_in);
          this.detail_form.get('msuma_apov_in').disable();
          this.detail_form.get('mapov_in').setValue(response.data.mapov_in);
          this.detail_form.get('mapov_in').disable();
          this.detail_form.get('msuma_apov_ga').setValue(response.data.msuma_apov_ga);
          this.detail_form.get('msuma_apov_ga').disable();
          this.detail_form.get('mapov_ga').setValue(response.data.mapov_ga);
          this.detail_form.get('mapov_ga').disable();
          this.detail_form.get('msuma_apov_fu').setValue(response.data.msuma_apov_fu);
          this.detail_form.get('msuma_apov_fu').disable();
          this.detail_form.get('mapov_fu').setValue(response.data.mapov_fu);
          this.detail_form.get('mapov_fu').disable();
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

    onSubmit(form){
      console.log('hola')
    }
}
