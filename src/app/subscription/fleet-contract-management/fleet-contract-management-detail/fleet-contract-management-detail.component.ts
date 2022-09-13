import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FleetContractManagementWorkerComponent } from '@app/pop-up/fleet-contract-management-worker/fleet-contract-management-worker.component';
import { FleetContractManagementOwnerComponent } from '@app/pop-up/fleet-contract-management-owner/fleet-contract-management-owner.component';
import { FleetContractManagementVehicleComponent } from '@app/pop-up/fleet-contract-management-vehicle/fleet-contract-management-vehicle.component';
import { FleetContractManagementAccesoryComponent } from '@app/pop-up/fleet-contract-management-accesory/fleet-contract-management-accesory.component';
import { FleetContractManagementInspectionComponent } from '@app/pop-up/fleet-contract-management-inspection/fleet-contract-management-inspection.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
/*
pdfMake.fonts = {
  // All 4 components must be defined
  TimesNewRoman: {
      normal: 'Times-New-Roman-Regular.ttf',
      bold: 'Times-New-Roman-Bold.ttf',
      italics: 'Times-New-Roman-Italic.ttf',
      bolditalics: 'Times-New-Roman-BoldItalic.ttf'
  }
};*/

@Component({
  selector: 'app-fleet-contract-management-detail',
  templateUrl: './fleet-contract-management-detail.component.html',
  styleUrls: ['./fleet-contract-management-detail.component.css']
})
export class FleetContractManagementDetailComponent implements OnInit {

  private extraCoverageGridApi;
  private accesoryGridApi;
  private inspectionGridApi;
  private coverageGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  upload_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  clientList: any[] = [];
  associateList: any[] = [];
  grouperList: any[] = [];
  accesoryList: any[] = [];
  inspectionList: any[] = [];
  extraCoverageList: any[] = [];
  generalStatusList: any[] = [];
  planTypeList: any[] = [];
  planList: any[] = [];
  paymentMethodologyList: any[] = [];
  receiptTypeList: any[] = [];
  serviceList: any[] = [];
  coverageList: any[] = [];
  realCoverageList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  ccontratoflota: number;
  ccarga: number;
  mprimatotal: number;
  mprimaprorratatotal: number;
  xpoliza: string;
  xrecibo: string;
  fdesde_rec: Date;
  fhasta_rec: Date;
  fdesde_pol: Date;
  fhasta_pol: Date;
  femision: Date;
  fnacimientopropietario2: string;
  xnombrecliente: string;
  xdocidentidadcliente: string;
  xdireccionfiscalcliente: string;
  xtelefonocliente: string;
  xemailcliente: string;
  xrepresentantecliente: string;
  xciudadcliente: string;
  xestadocliente: string;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  accesoryDeletedRowList: any[] = [];
  inspectionDeletedRowList: any[] = [];
  planCoberturas: string;
  planServicios: string;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { 
                if (this.router.getCurrentNavigation().extras.state == null) {
                  this.router.navigate([`subscription/fleet-contract-management-index`]);
                } else {
                  this.xrecibo    = this.router.getCurrentNavigation().extras.state.xrecibo;
                  this.fdesde_rec = this.router.getCurrentNavigation().extras.state.fdesde_rec;
                  this.fhasta_rec = this.router.getCurrentNavigation().extras.state.fhasta_rec;
                  this.fdesde_pol = this.router.getCurrentNavigation().extras.state.fdesde_pol;
                  this.fhasta_pol = this.router.getCurrentNavigation().extras.state.fhasta_pol;
                  this.femision   = this.router.getCurrentNavigation().extras.state.femision;
                }
              }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      ccliente: ['', Validators.required],
      casociado: ['', Validators.required],
      cagrupador: ['', Validators.required],
      xcertificadogestion: [{ value: '', disabled: true }],
      xcertificadoasociado: ['', Validators.required],
      fdesde_pol: ['', Validators.required],
      fhasta_pol: ['', Validators.required],
      fhasta_rec: ['', Validators.required],
      fdesde_rec: ['', Validators.required],
      femision: ['', Validators.required],
      xsucursalemision: ['', Validators.required],
      xsucursalsuscriptora: ['', Validators.required],
      cestatusgeneral: ['', Validators.required],
      ccorredor: ['', Validators.required],
      xnombrecorredor: [{ value: '', disabled: true }],
      ctrabajador: ['', Validators.required],
      xnombretrabajador: [{ value: '', disabled: true }],
      xtipodocidentidadtrabajador: [{ value: '', disabled: true }],
      xdocidentidadtrabajador: [{ value: '', disabled: true }],
      xdirecciontrabajador: [{ value: '', disabled: true }],
      xtelefonocelulartrabajador: [{ value: '', disabled: true }],
      xemailtrabajador: [{ value: '', disabled: true }],
      cpropietario: ['', Validators.required],
      xnombrepropietario: [{ value: '', disabled: true }],
      xtipodocidentidadpropietario: [{ value: '', disabled: true }],
      xdocidentidadpropietario: [{ value: '', disabled: true }],
      xdireccionpropietario: [{ value: '', disabled: true }],
      xtelefonocelularpropietario: [{ value: '', disabled: true }],
      xemailpropietario: [{ value: '', disabled: true }],
      xapellidopropietario: [{ value: '', disabled: true }],
      fnacimientopropietario: [{ value: '', disabled: true }],
      xocupacionpropietario: [{ value: '', disabled: true }],
      xciudadpropietario: [{ value: '', disabled: true }],
      xestadocivilpropietario: [{ value: '', disabled: true }],
      xestadopropietario: [{ value: '', disabled: true }],
      xsexopropietario: [{ value: '', disabled: true }],
      xnacionalidadpropietario: [{ value: '', disabled: true }],
      cvehiculopropietario: ['', Validators.required],
      xmarca: [{ value: '', disabled: true }],
      xmoneda: [{ value: '', disabled: true }],
      xmodelo: [{ value: '', disabled: true }],
      xversion: [{ value: '', disabled: true }],
      xplaca: [{ value: '', disabled: true }],
      fano: [{ value: '', disabled: true }],
      xcolor: [{ value: '', disabled: true }],
      xserialcarroceria: [{ value: '', disabled: true }],
      xserialmotor: [{ value: '', disabled: true }],
      ctipovehiculo: ['', Validators.required],
      mpreciovehiculo: ['', Validators.required],
      xuso: [{ value: '', disabled: true }],
      xtipovehiculo: [{ value: '', disabled: true }],
      xtipomodelovehiculo: [{ value: '', disabled: true }],
      ncapacidadcargavehiculo: [{ value: '', disabled: true }],
      ncapacidadpasajerosvehiculo: [{ value: '', disabled: true }],
      ptasaaseguradora: [{ value: '', disabled: true }],
      ptasagestion: [{ value: '', disabled: true }],
      mgestionvial: [{ value: '', disabled: true }],
      maporte: [{ value: '', disabled: true }],
      mprima: [{ value: '', disabled: true }],
      mmaximoadministrado: [{ value: '', disabled: true }],
      cregistrotasa: ['', Validators.required],
      cconfiguraciongestionvial: ['', Validators.required],
      ccotizadorflota: ['', Validators.required],
      ctipoplan: ['', Validators.required],
      cplan: ['', Validators.required],
      xplan: [{ value: '', disabled: true }],
      //cmoneda: [{ value: '', disabled: true }],
      cmetodologiapago: ['', Validators.required],
      ctiporecibo: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 71
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
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cmodulo: 71
    };
    this.http.post(`${environment.apiUrl}/api/valrep/client`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.clientList.push({ id: response.data.list[i].ccliente, value: response.data.list[i].xcliente });
        }
        this.clientList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CLIENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/module/general-status`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.generalStatusList.push({ id: response.data.list[i].cestatusgeneral, value: response.data.list[i].xestatusgeneral });
        }
        this.generalStatusList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.GENERALSTATUSNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/plan-type`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.planTypeList.push({ id: response.data.list[i].ctipoplan, value: response.data.list[i].xtipoplan });
        }
        this.planTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
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
    this.http.post(`${environment.apiUrl}/api/valrep/receipt-type`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.receiptTypeList.push({ id: response.data.list[i].ctiporecibo, value: response.data.list[i].xtiporecibo, days: response.data.list[i].ncantidaddias });
        }
        this.receiptTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.RECEIPTTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getFleetContractData();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.editStatus = true;
        this.showSaveButton = true;
        this.detail_form.get('cestatusgeneral').disable();
      }
    });
  }

  getFleetContractData(){ 
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccontratoflota: this.code
    };
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/detail`, params, options).subscribe((response: any) => {
      this.xnombrecliente = response.data.xnombrecliente;
      this.xdocidentidadcliente = response.data.xdocidentidadcliente;
      this.xdireccionfiscalcliente = response.data.xdireccionfiscalcliente;
      if (response.data.xtelefonocliente) {
        this.xtelefonocliente = response.data.xtelefonocliente;
      } else {
        this.xtelefonocliente = ' ';
      }
      if (response.data.xemailcliente) {
        this.xemailcliente = response.data.xemailcliente;
      } else {
        this.xemailcliente = ' ';
      }
      if (response.data.xrepresentantecliente) {
        this.xrepresentantecliente = response.data.xrepresentantecliente;
      } else {
        this.xrepresentantecliente = ' ';
      }
      this.serviceList = response.data.services;
      this.coverageList = response.data.realCoverages;
      this.mprimatotal = response.data.mprimatotal;
      this.mprimaprorratatotal = response.data.mprimaprorratatotal;
      if (response.data.xpoliza){
        this.xpoliza = response.data.xpoliza;
      } else {
        this.xpoliza = ''
      }
      if(response.data.status){
        this.ccontratoflota = response.data.ccontratoflota;
        this.ccarga = response.data.ccarga;
        this.detail_form.get('ccliente').setValue(response.data.ccliente);
        this.detail_form.get('ccliente').disable();
        this.xciudadcliente = response.data.xciudadcliente;
        this.xestadocliente = response.data.xestadocliente;
        this.searchDropdownDataRequest();
        /*this.detail_form.get('casociado').setValue(response.data.casociado);
        this.detail_form.get('casociado').disable();
        this.detail_form.get('cagrupador').setValue(response.data.cagrupador);
        this.detail_form.get('cagrupador').disable();*/
        if(this.fdesde_pol){
          //let dateFormat = new Date(response.data.finicio).toISOString().substring(0, 10);
          this.detail_form.get('fdesde_pol').setValue(this.fdesde_pol);
          this.detail_form.get('fdesde_pol').disable();
        }
        if(this.fhasta_pol){
          //let dateFormat = new Date(response.data.fhasta).toISOString().substring(0, 10);
          this.detail_form.get('fhasta_pol').setValue(this.fhasta_pol);
          this.detail_form.get('fhasta_pol').disable();
        }
        if(response.data.fnacimientopropietario){
          let dateFormat = new Date(response.data.fnacimientopropietario);
          let dd = dateFormat.getDay();
          let mm = dateFormat.getMonth();
          let yyyy = dateFormat.getFullYear();
          this.fnacimientopropietario2 = dd + '-' + mm + '-' + yyyy;
          this.detail_form.get('fnacimientopropietario').setValue(this.fnacimientopropietario2);
          this.detail_form.get('fnacimientopropietario').disable();
        } else {
          this.fnacimientopropietario2 = ' '
        }
        if(this.fhasta_rec){
          //let dateFormat = new Date(response.data.fhastarecibo).toISOString().substring(0, 10);
          this.detail_form.get('fhasta_rec').setValue(this.fhasta_rec);
          this.detail_form.get('fhasta_rec').disable();
        }
        if(this.fdesde_rec){
          //let dateFormat = new Date(response.data.fdesderecibo).toISOString().substring(0, 10);
          this.detail_form.get('fdesde_rec').setValue(this.fdesde_rec);
          this.detail_form.get('fdesde_rec').disable();
        }
        if(this.femision){
          //let dateFormat = new Date(response.data.femision).toISOString().substring(0, 10);
          this.detail_form.get('femision').setValue(this.femision);
          this.detail_form.get('femision').disable();
        }
        this.detail_form.get('cestatusgeneral').setValue(response.data.cestatusgeneral);
        this.detail_form.get('cestatusgeneral').disable();
        this.detail_form.get('ccorredor').setValue(response.data.ccorredor);
        this.detail_form.get('ccorredor').disable();
        this.detail_form.get('xnombrecorredor').setValue(response.data.xcorredor);
        this.detail_form.get('xnombrecorredor').disable();
        this.detail_form.get('xcertificadogestion').setValue(response.data.xcertificadogestion);
        this.detail_form.get('xcertificadoasociado').setValue(response.data.xcertificadoasociado);
        this.detail_form.get('xcertificadoasociado').disable();
        this.detail_form.get('xsucursalemision').setValue(response.data.xsucursalemision);
        this.detail_form.get('xsucursalemision').disable();
        this.detail_form.get('xsucursalsuscriptora').setValue(response.data.xsucursalsuscriptora);
        this.detail_form.get('xsucursalsuscriptora').disable();
        this.detail_form.get('ctrabajador').setValue(response.data.ctrabajador);
        this.detail_form.get('ctrabajador').disable();
        this.detail_form.get('xnombretrabajador').setValue(response.data.xnombretrabajador);
        this.detail_form.get('xtipodocidentidadtrabajador').setValue(response.data.xtipodocidentidadtrabajador);
        this.detail_form.get('xdocidentidadtrabajador').setValue(response.data.xdocidentidadtrabajador);
        this.detail_form.get('xdirecciontrabajador').setValue(response.data.xdirecciontrabajador);
        this.detail_form.get('xtelefonocelulartrabajador').setValue(response.data.xtelefonocelulartrabajador);
        this.detail_form.get('xemailtrabajador').setValue(response.data.xemailtrabajador);
        this.detail_form.get('cpropietario').setValue(response.data.cpropietario);
        this.detail_form.get('cpropietario').disable();
        this.detail_form.get('xnombrepropietario').setValue(response.data.xnombrepropietario);
        this.detail_form.get('xtipodocidentidadpropietario').setValue(response.data.xtipodocidentidadpropietario);
        this.detail_form.get('xdocidentidadpropietario').setValue(response.data.xdocidentidadpropietario);
        this.detail_form.get('xdireccionpropietario').setValue(response.data.xdireccionpropietario);
        this.detail_form.get('xemailpropietario').setValue(response.data.xemailpropietario);
        if (response.data.xtelefonocelularpropietario) {
          this.detail_form.get('xtelefonocelularpropietario').setValue(response.data.xtelefonocelularpropietario);
        } else {
          this.detail_form.get('xtelefonocelularpropietario').setValue(' ');
        }
        if (response.data.xapellidopropietario){
          this.detail_form.get('xapellidopropietario').setValue(response.data.xapellidopropietario);
          this.detail_form.get('xapellidopropietario').disable();
        } else {
          this.detail_form.get('xapellidopropietario').setValue(' ');
          this.detail_form.get('xapellidopropietario').disable();
        }
        if (response.data.xocupacionpropietario) {
          this.detail_form.get('xocupacionpropietario').setValue(response.data.xocupacionpropietario);
          this.detail_form.get('xocupacionpropietario').disable();
        } else {
          this.detail_form.get('xocupacionpropietario').setValue(' ');
          this.detail_form.get('xocupacionpropietario').disable();
        }
        if (response.data.xciudadpropietario) {
          this.detail_form.get('xciudadpropietario').setValue(response.data.xciudadpropietario);
          this.detail_form.get('xciudadpropietario').disable();
        } else {
          this.detail_form.get('xciudadpropietario').setValue(' ');
          this.detail_form.get('xciudadpropietario').disable();
        }
        if (response.data.xestadocivilpropietario) {
          this.detail_form.get('xestadocivilpropietario').setValue(response.data.xestadocivilpropietario);
          this.detail_form.get('xestadocivilpropietario').disable();
        } else {
          this.detail_form.get('xestadocivilpropietario').setValue(' ');
          this.detail_form.get('xestadocivilpropietario').disable();
        }
        this.detail_form.get('xestadopropietario').setValue(response.data.xestadopropietario);
        this.detail_form.get('xestadopropietario').disable();
        if (response.data.xsexopropietario) {
          this.detail_form.get('xsexopropietario').setValue(response.data.xsexopropietario);
          this.detail_form.get('xsexopropietario').disable();
        } else {
          this.detail_form.get('xsexopropietario').setValue(' ');
          this.detail_form.get('xsexopropietario').disable();
        }
        this.detail_form.get('mprima').setValue(response.data.mprimatotal);
        this.detail_form.get('mprima').disable();
        if (response.data.xnacionalidadpropietario) {
          this.detail_form.get('xnacionalidadpropietario').setValue(response.data.xnacionalidadpropietario);
          this.detail_form.get('xnacionalidadpropietario').disable();
        } else {
          this.detail_form.get('xnacionalidadpropietario').setValue(' ');
          this.detail_form.get('xnacionalidadpropietario').disable();
        }
        this.detail_form.get('cvehiculopropietario').setValue(response.data.cvehiculopropietario);
        this.detail_form.get('cvehiculopropietario').disable();
        this.detail_form.get('xmarca').setValue(response.data.xmarca);
        this.detail_form.get('xmoneda').setValue(response.data.xmoneda);
        this.detail_form.get('xmodelo').setValue(response.data.xmodelo);
        this.detail_form.get('xversion').setValue(response.data.xversion);
        this.detail_form.get('xplaca').setValue(response.data.xplaca);
        this.detail_form.get('fano').setValue(response.data.fano);
        this.detail_form.get('xcolor').setValue(response.data.xcolor);
        this.detail_form.get('xserialcarroceria').setValue(response.data.xserialcarroceria);
        this.detail_form.get('xserialmotor').setValue(response.data.xserialmotor);
        this.detail_form.get('mpreciovehiculo').setValue(response.data.mpreciovehiculo);
        this.detail_form.get('mpreciovehiculo').disable();
        this.detail_form.get('ctipovehiculo').setValue(response.data.ctipovehiculo);
        this.detail_form.get('ctipovehiculo').disable();
        this.detail_form.get('xuso').setValue(response.data.xuso);
        this.detail_form.get('xtipovehiculo').setValue(response.data.xtipovehiculo);
        this.detail_form.get('xtipomodelovehiculo').setValue(response.data.xtipomodelovehiculo);
        this.detail_form.get('xtipomodelovehiculo').disable();
        if (response.data.ncapacidadcargavehiculo) {
          this.detail_form.get('ncapacidadcargavehiculo').setValue(response.data.ncapacidadcargavehiculo);
          this.detail_form.get('ncapacidadcargavehiculo').disable();
        } else {
          this.detail_form.get('ncapacidadcargavehiculo').setValue(' ');
          this.detail_form.get('ncapacidadcargavehiculo').disable();
        }
        this.detail_form.get('ncapacidadpasajerosvehiculo').setValue(response.data.ncapacidadpasajerosvehiculo);
        this.detail_form.get('ncapacidadpasajerosvehiculo').disable();
        this.detail_form.get('ctipoplan').setValue(response.data.ctipoplan);
        this.detail_form.get('ctipoplan').disable();
        //this.planDropdownDataRequest();
        this.detail_form.get('xplan').setValue(response.data.xplancoberturas);
        this.detail_form.get('xplan').disable();
        this.planCoberturas = response.data.xplancoberturas;
        this.planServicios = response.data.xplanservicios;
        this.paymentMethodologyDropdownDataRequest();
        this.detail_form.get('cmetodologiapago').setValue(response.data.cmetodologiapago);
        this.detail_form.get('cmetodologiapago').disable();
        this.detail_form.get('ctiporecibo').setValue(response.data.ctiporecibo);
        this.detail_form.get('ctiporecibo').disable();
        this.searchTotalAmountDataRequest();
        this.realCoverageList = [];
        if(response.data.realCoverages) {
          for(let i =0; i < response.data.realCoverages.length; i++){
            if (response.data.realCoverages[i].ititulo == 'C') {
              if (response.data.realCoverages[i].mprima) {
                this.realCoverageList.push({
                  xcobertura: response.data.realCoverages[i].xcobertura,
                  xprimacobertura: `${response.data.realCoverages[i].mprima} ${response.data.realCoverages[i].xmoneda}`
                })
              } else {
                this.realCoverageList.push({
                  xcobertura: response.data.realCoverages[i].xcobertura,
                  xprimacobertura: `0 ${response.data.realCoverages[i].xmoneda}`
                })
                }
            }
          }
        }
        this.extraCoverageList = [];
        if(response.data.extraCoverages){
          for(let i =0; i < response.data.extraCoverages.length; i++){
            this.extraCoverageList.push({
              cgrid: i,
              create: false,
              ccoberturaextra: response.data.extraCoverages[i].ccoberturaextra,
              xdescripcion: response.data.extraCoverages[i].xdescripcion,
              mcoberturaextra: response.data.extraCoverages[i].mcoberturaextra
            });
          }
        }
        this.accesoryList = [];
        if(response.data.accesories){
          for(let i =0; i < response.data.accesories.length; i++){
            this.accesoryList.push({
              cgrid: i,
              create: false,
              caccesorio: response.data.accesories[i].caccesorio,
              xaccesorio: response.data.accesories[i].xaccesorio,
              maccesoriocontratoflota: response.data.accesories[i].maccesoriocontratoflota
            });
          }
        }
        this.inspectionList = [];
        if(response.data.inspections){
          for(let i =0; i < response.data.inspections.length; i++){
            let images = [];
            for(let j =0; j < response.data.inspections[i].images.length; j++){
              images.push({
                create: false,
                cimageninspeccion: response.data.inspections[i].images[j].cimageninspeccion,
                xrutaimagen: response.data.inspections[i].images[j].xrutaimagen
              });
            }
            this.inspectionList.push({
              cgrid: i,
              create: false,
              cinspeccioncontratoflota: response.data.inspections[i].cinspeccioncontratoflota,
              cperito: response.data.inspections[i].cperito,
              xperito: response.data.inspections[i].xperito,
              ctipoinspeccion: response.data.inspections[i].ctipoinspeccion,
              xtipoinspeccion: response.data.inspections[i].xtipoinspeccion,
              finspeccion: new Date(response.data.inspections[i].finspeccion).toISOString().substring(0, 10),
              xobservacion: response.data.inspections[i].xobservacion,
              images: images
            });
          }
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.FLEETCONTRACTSMANAGEMENT.FLEETCONTRACTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  searchDropdownDataRequest(){
    if(this.detail_form.get('ccliente').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: this.detail_form.get('ccliente').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/client/associate`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.associateList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.associateList.push({ id: response.data.list[i].casociado, value: response.data.list[i].xasociado });
          }
          this.associateList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.ASSOCIATENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/client/grouper`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.grouperList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.grouperList.push({ id: response.data.list[i].cagrupador, value: response.data.list[i].xagrupador });
          }
          this.grouperList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.ASSOCIATENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/client/grouper`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.grouperList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.grouperList.push({ id: response.data.list[i].cagrupador, value: response.data.list[i].xagrupador });
          }
          this.grouperList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.ASSOCIATENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  changeDateFormat(date) {
    let dateArray = date.split("-");
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
  }

  searchTotalAmountDataRequest(){
    let mpreciovehiculo = 0;
    if(this.detail_form.get('mpreciovehiculo').value){
      mpreciovehiculo = this.detail_form.get('mpreciovehiculo').value;
    }
    if(this.detail_form.get('ccliente').value && this.detail_form.get('casociado').value && this.detail_form.get('ctipovehiculo').value && this.detail_form.get('fano').value){ 
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: this.detail_form.get('ccliente').value,
        casociado: this.detail_form.get('casociado').value,
        ctipovehiculo: this.detail_form.get('ctipovehiculo').value,
        fano: this.detail_form.get('fano').value
      }
      this.http.post(`${environment.apiUrl}/api/fleet-contract-management/search/vehicle-type/fee`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.detail_form.get('cregistrotasa').setValue(response.data.cregistrotasa);
          this.detail_form.get('ptasaaseguradora').setValue(response.data.ptasaaseguradora);
          this.detail_form.get('ptasagestion').setValue(response.data.ptasagestion);
          this.detail_form.get('mmaximoadministrado').setValue(response.data.mmaximoadministrado);
          let prime = (response.data.ptasaaseguradora * mpreciovehiculo) / 100
          this.detail_form.get('mprima').setValue(prime);
          let contribution = (response.data.ptasagestion * mpreciovehiculo) / 100
          this.detail_form.get('maporte').setValue(contribution);
          this.detail_form.get('cmoneda').setValue(response.data.cmoneda);
          this.detail_form.get('xmoneda').setValue(response.data.xmoneda);
        }
      },
      (err) => {
        console.log(err);
        console.log(err.error.data);
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){
          let condition = err.error.data.condition;
          if(condition == "fees-register-not-found"){
            message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.FEESREGISTERNOTFOUND";
          }else if(condition == "vehicle-type-not-found"){
            message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.VEHICLETYPENOTFOUND";
          }else if(condition == "range-date-not-found"){
            message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.RANGEDATENOTFOUND";
          }
         }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/fleet-contract-management/search/vehicle-type/road-management`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.detail_form.get('cconfiguraciongestionvial').setValue(response.data.cconfiguraciongestionvial);
          this.detail_form.get('mgestionvial').setValue(response.data.mgestionvial);
        }
      },
      (err) => {
        console.log(err);
        console.log(err.error.data);
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){
          let condition = err.error.data.condition;
          if(condition == "road-management-not-found"){
            message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.ROADMANAGEMENTNOTFOUND";
          }else if(condition == "vehicle-type-not-found"){
            message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.VEHICLETYPENOTFOUND";
          }
        }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/fleet-contract-management/search/vehicle-type/extra-coverage`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.detail_form.get('ccotizadorflota').setValue(response.data.ccotizadorflota);
          this.extraCoverageList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.extraCoverageList.push({ 
              ccoberturaextra: response.data.list[i].ccoberturaextra,
              xdescripcion: response.data.list[i].xdescripcion,
              mcoberturaextra: response.data.list[i].mcoberturaextra
            });
          }
          this.extraCoverageGridApi.setRowData(this.extraCoverageList);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){
          let condition = err.error.data.condition;
          if(condition == "quote-by-fleet-not-found"){
            message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.QUOTEBYFLEETNOTFOUND";
          }
         }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  searchWorker(){
    if(this.detail_form.get('ccliente').value){
      let worker = { ccliente: this.detail_form.get('ccliente').value };
      const modalRef = this.modalService.open(FleetContractManagementWorkerComponent, { size: 'xl' });
      modalRef.componentInstance.worker = worker;
      modalRef.result.then((result: any) => { 
        if(result){
          this.detail_form.get('ctrabajador').setValue(result.ctrabajador);
          this.detail_form.get('xnombretrabajador').setValue(result.xnombre);
          this.detail_form.get('xtipodocidentidadtrabajador').setValue(result.xtipodocidentidad);
          this.detail_form.get('xdocidentidadtrabajador').setValue(result.xdocidentidad);
          this.detail_form.get('xdirecciontrabajador').setValue(result.xdireccion);
          this.detail_form.get('xtelefonocelulartrabajador').setValue(result.xtelefonocelular);
          this.detail_form.get('xemailtrabajador').setValue(result.xemail);
        }
      });
    }else{
      this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.REQUIREDCLIENT";
      this.alert.type = 'warning';
      this.alert.show = true;
    }
  }

  searchOwner(){
    let owner = { };
    const modalRef = this.modalService.open(FleetContractManagementOwnerComponent, { size: 'xl' });
    modalRef.componentInstance.owner = owner;
    modalRef.result.then((result: any) => { 
      if(result){
        this.detail_form.get('cpropietario').setValue(result.cpropietario);
        this.detail_form.get('xnombrepropietario').setValue(result.xnombre);
        this.detail_form.get('xtipodocidentidadpropietario').setValue(result.xtipodocidentidad);
        this.detail_form.get('xdocidentidadpropietario').setValue(result.xdocidentidad);
        this.detail_form.get('xdireccionpropietario').setValue(result.xdireccion);
        this.detail_form.get('xtelefonocelularpropietario').setValue(result.xtelefonocelular);
        this.detail_form.get('xemailpropietario').setValue(result.xemail);
      }
    });
  }

  searchVehicle(){
    if(this.detail_form.get('cpropietario').value && this.detail_form.get('ccliente').value){
      let vehicle = { 
        cpropietario: this.detail_form.get('cpropietario').value,
        ccliente: this.detail_form.get('ccliente').value
      };
      const modalRef = this.modalService.open(FleetContractManagementVehicleComponent, { size: 'xl' });
      modalRef.componentInstance.vehicle = vehicle;
      modalRef.result.then((result: any) => { 
        if(result){
          this.detail_form.get('cvehiculopropietario').setValue(result.cvehiculopropietario);
          this.detail_form.get('xmarca').setValue(result.xmarca);
          this.detail_form.get('xmodelo').setValue(result.xmodelo);
          this.detail_form.get('xversion').setValue(result.xversion);
          this.detail_form.get('xplaca').setValue(result.xplaca);
          this.detail_form.get('fano').setValue(result.fano);
          this.detail_form.get('xcolor').setValue(result.xcolor);
          this.detail_form.get('xserialcarroceria').setValue(result.xserialcarroceria);
          this.detail_form.get('xserialmotor').setValue(result.xserialmotor);
          this.detail_form.get('ctipovehiculo').setValue(result.ctipovehiculo);
          this.detail_form.get('xmoneda').setValue(result.xmoneda);
          this.detail_form.get('mpreciovehiculo').setValue(result.mpreciovehiculo);
          this.searchTotalAmountDataRequest();
        }
      });
    }else{
      if(!this.detail_form.get('cpropietario').value){
        this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.REQUIREDOWNER";
        this.alert.type = 'warning';
        this.alert.show = true;
      }else if(!this.detail_form.get('ccliente').value){
        this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.REQUIREDCLIENT";
        this.alert.type = 'warning';
        this.alert.show = true;
      }
    }
  }

  editFleetContract(){
    this.detail_form.get('ccliente').enable();
    this.detail_form.get('casociado').enable();
    this.detail_form.get('cagrupador').enable();
    this.detail_form.get('cestatusgeneral').enable();
    this.detail_form.get('finicio').enable();
    this.detail_form.get('fhasta').enable();
    this.detail_form.get('fhastarecibo').enable();
    this.detail_form.get('xcertificadoasociado').enable();
    this.detail_form.get('xsucursalemision').enable();
    this.detail_form.get('xsucursalsuscriptora').enable();
    this.detail_form.get('ctrabajador').enable();
    this.detail_form.get('cpropietario').enable();
    this.detail_form.get('cvehiculopropietario').enable();
    this.detail_form.get('mpreciovehiculo').enable();
    this.detail_form.get('ctipovehiculo').enable();
    this.detail_form.get('ctipoplan').enable();
    this.detail_form.get('cplan').enable();
    this.detail_form.get('cmetodologiapago').enable();
    this.detail_form.get('ctiporecibo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.editStatus = false;
      this.showEditButton = true;
      this.getFleetContractData();
    }else{
      this.router.navigate([`/subscription/fleet-contract-management-index`]);
    }
  }

  addAccesory(){
    let accesory = { type: 3 };
    const modalRef = this.modalService.open(FleetContractManagementAccesoryComponent);
    modalRef.componentInstance.accesory = accesory;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.accesoryList.push({
            cgrid: this.accesoryList.length,
            create: true,
            caccesorio: result.caccesorio,
            xaccesorio: result.xaccesorio,
            maccesoriocontratoflota: result.maccesoriocontratoflota
          });
          this.accesoryGridApi.setRowData(this.accesoryList);
        }
      }
    });
  }

  addInspection(){
    let inspection = { type: 3 };
    const modalRef = this.modalService.open(FleetContractManagementInspectionComponent, {size: 'xl'});
    modalRef.componentInstance.inspection = inspection;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.inspectionList.push({
            cgrid: this.inspectionList.length,
            create: true,
            cperito: result.cperito,
            xperito: result.xperito,
            ctipoinspeccion: result.ctipoinspeccion,
            xtipoinspeccion: result.xtipoinspeccion,
            finspeccion: result.finspeccion,
            xobservacion: result.xobservacion,
            images: result.images
          });
          this.inspectionGridApi.setRowData(this.inspectionList);
        }
      }
    });
  }

  accesoryRowClicked(event: any){
    let accesory = {};
    if(this.editStatus){ 
      accesory = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        caccesorio: event.data.caccesorio,
        maccesoriocontratoflota: event.data.maccesoriocontratoflota,
        delete: false
      };
    }else{ 
      accesory = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        caccesorio: event.data.caccesorio,
        maccesoriocontratoflota: event.data.maccesoriocontratoflota,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(FleetContractManagementAccesoryComponent);
    modalRef.componentInstance.accesory = accesory;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.accesoryList.length; i++){
            if(this.accesoryList[i].cgrid == result.cgrid){
              this.accesoryList[i].caccesorio = result.caccesorio;
              this.accesoryList[i].xaccesorio = result.xaccesorio;
              this.accesoryList[i].maccesoriocontratoflota = result.maccesoriocontratoflota;
              this.accesoryGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.accesoryDeletedRowList.push({ caccesorio: result.caccesorio });
          }
          this.accesoryList = this.accesoryList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.accesoryList.length; i++){
            this.accesoryList[i].cgrid = i;
          }
          this.accesoryGridApi.setRowData(this.accesoryList);
        }
      }
    });
  }

  inspectionRowClicked(event: any){
    let inspection = {};
    if(this.editStatus){ 
      inspection = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cinspeccioncontratoflota: event.data.cinspeccioncontratoflota,
        cperito: event.data.cperito,
        ctipoinspeccion: event.data.ctipoinspeccion,
        finspeccion: event.data.finspeccion,
        xobservacion: event.data.xobservacion,
        images: event.data.images,
        delete: false
      };
    }else{ 
      inspection = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cinspeccioncontratoflota: event.data.cinspeccioncontratoflota,
        cperito: event.data.cperito,
        ctipoinspeccion: event.data.ctipoinspeccion,
        finspeccion: event.data.finspeccion,
        xobservacion: event.data.xobservacion,
        images: event.data.images,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(FleetContractManagementInspectionComponent, {size: 'xl'});
    modalRef.componentInstance.inspection = inspection;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.inspectionList.length; i++){
            if(this.inspectionList[i].cgrid == result.cgrid){
              this.inspectionList[i].cperito = result.cperito;
              this.inspectionList[i].xperito = result.xperito;
              this.inspectionList[i].ctipoinspeccion = result.ctipoinspeccion;
              this.inspectionList[i].xtipoinspeccion = result.xtipoinspeccion;
              this.inspectionList[i].finspeccion = result.finspeccion;
              this.inspectionList[i].xobservacion = result.xobservacion;
              this.inspectionList[i].images = result.images;
              this.inspectionList[i].imagesResult = result.imagesResult;
              this.inspectionGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.inspectionDeletedRowList.push({ cinspeccioncontratoflota: result.cinspeccioncontratoflota });
          }
          this.inspectionList = this.inspectionList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.inspectionList.length; i++){
            this.inspectionList[i].cgrid = i;
          }
          this.inspectionGridApi.setRowData(this.inspectionList);
        }
      }
    });
  }

  planDropdownDataRequest(){
    if(this.detail_form.get('ctipoplan').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ctipoplan: this.detail_form.get('ctipoplan').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/plan`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.planList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.planList.push({ id: response.data.list[i].cplan, value: response.data.list[i].xplan });
          }
          this.planList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.PLANNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  paymentMethodologyDropdownDataRequest(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/v2/valrep/production/search/plan/payment-methodology`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.paymentMethodologyList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.paymentMethodologyList.push({ id: response.data.list[i].cmetodologiapago, value: response.data.list[i].xmetodologiapago });
        }
        this.paymentMethodologyList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.PAYMENTMETHODOLOGYNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }
  
/*
  receiptTypeChange(){
    if(this.detail_form.get('ctiporecibo').value){
      if (this.detail_form.get('finicio').value){
        let ncantidaddias = this.receiptTypeList.find(element => element.id === parseInt(this.detail_form.get('ctiporecibo').value))
        let dateformat = new Date(this.detail_form.get('finicio').value);
        dateformat.setDate(dateformat.getDate() + ncantidaddias.days);
        let fhastarecibo = new Date(dateformat).toISOString().substring(0, 10);
        this.detail_form.get('fhastarecibo').setValue(fhastarecibo);
        //this.detail_form.get('fhastarecibo').disable();
      }
    }
  }
*/
  onExtraCoveragesGridReady(event){
    this.extraCoverageGridApi = event.api;
  }

  onAccesoriesGridReady(event){
    this.accesoryGridApi = event.api;
  }

  onInspectionsGridReady(event){
    this.inspectionGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      if(!this.detail_form.get('ctrabajador').value){
        this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.REQUIREDWORKER";
        this.alert.type = 'danger';
        this.alert.show = true;
      }else if(!this.detail_form.get('cpropietario').value){
        this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.REQUIREDOWNER";
        this.alert.type = 'danger';
        this.alert.show = true;
      }else if(!this.detail_form.get('cvehiculopropietario').value){
        this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.REQUIREDVEHICLE";
        this.alert.type = 'danger';
        this.alert.show = true;
      }else if(!this.detail_form.get('cregistrotasa').value){
        this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.ASSOCIATEFEESREGISTERNOTFOUND";
        this.alert.type = 'danger';
        this.alert.show = true;
      }else if(!this.detail_form.get('cconfiguraciongestionvial').value){
        this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.ASSOCIATEROADMANAGEMENTCONFIGURATIONNOTFOUND";
        this.alert.type = 'danger';
        this.alert.show = true;
      }else if(!this.detail_form.get('ccotizadorflota').value){
        this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.ASSOCIATEQUOTEBYFLEETNOTFOUND";
        this.alert.type = 'danger';
        this.alert.show = true;
      }
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    let url;
    if(this.code){
      let updateAccesoryList = this.accesoryList.filter((row) => { return !row.create; });
      let createAccesoryList = this.accesoryList.filter((row) => { return row.create; });
      let updateInspectionList = this.inspectionList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateInspectionList.length; i++){
        updateInspectionList[i].finspeccion = new Date(updateInspectionList[i].finspeccion).toUTCString();
      }
      let createInspectionList = this.inspectionList.filter((row) => { return row.create; });
      for(let i = 0; i < createInspectionList.length; i++){
        createInspectionList[i].finspeccion = new Date(createInspectionList[i].finspeccion).toUTCString();
      }
      params = {
        ccontratoflota: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: form.ccliente,
        casociado: form.casociado,
        cagrupador: form.cagrupador,
        cestatusgeneral: form.cestatusgeneral,
        finicio: new Date(form.finicio).toUTCString(),
        fhasta: new Date(form.fhasta).toUTCString(),
        xcertificadoasociado: form.xcertificadoasociado,
        xsucursalemision: form.xsucursalemision,
        xsucursalsuscriptora: form.xsucursalsuscriptora,
        ctrabajador: form.ctrabajador,
        cpropietario: form.cpropietario,
        cvehiculopropietario: form.cvehiculopropietario,
        cusuariomodificacion: this.currentUser.data.cusuario,
        ctipoplan: parseInt(form.ctipoplan),
        cplan: parseInt(form.cplan),
        cmetodologiapago: parseInt(form.cmetodologiapago),
        ctiporecibo: parseInt(form.ctiporecibo),
        fhastarecibo: new Date(form.fhastarecibo).toUTCString(),
        accesories: {
          create: createAccesoryList,
          update: updateAccesoryList,
          delete: this.accesoryDeletedRowList
        },
        inspection: {
          create: createInspectionList,
          update: updateInspectionList,
          delete: this.inspectionDeletedRowList
        }
      };
      url = `${environment.apiUrl}/api/fleet-contract-management/update`;
    }else{
      params = {
        ccontratoflota: this.ccontratoflota,
        cmodulo: 71,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: form.ccliente,
        casociado: form.casociado,
        cagrupador: form.cagrupador,
        cestatusgeneral: form.cestatusgeneral,
        finicio: new Date(form.finicio).toUTCString(),
        fhasta: new Date(form.fhasta).toUTCString(),
        xcertificadoasociado: form.xcertificadoasociado,
        xsucursalemision: form.xsucursalemision,
        xsucursalsuscriptora: form.xsucursalsuscriptora,
        ctrabajador: form.ctrabajador,
        cpropietario: form.cpropietario,
        cvehiculopropietario: form.cvehiculopropietario,
        cusuariocreacion: this.currentUser.data.cusuario,
        ctipoplan: parseInt(form.ctipoplan),
        cplan: parseInt(form.cplan),
        cmetodologiapago: parseInt(form.cmetodologiapago),
        ctiporecibo: parseInt(form.ctiporecibo),
        fhastarecibo: new Date(form.fhastarecibo).toUTCString(),
        accesories: this.accesoryList,
        inspections: this.inspectionList
      };
      url = `${environment.apiUrl}/api/fleet-contract-management/create`;
    }
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/subscription/fleet-contract-management-detail/${response.data.ccontratoflota}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "vehicle-contract-already-exist"){
          this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.VEHICLEALREADYHAVECONTRACT";
          this.alert.type = 'danger';
          this.alert.show = true;
        }else if(condition == "not-have-default-general-estatus"){
          this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.MODULENOTHAVEDEFAULTGENERALSTATUS";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.FLEETCONTRACTSMANAGEMENT.FLEETCONTRACTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  getPlanType(ctipoplan) {
    let xtipoplan = this.planTypeList.find(element => element.id === ctipoplan);
    return xtipoplan.value
  }

  getPlan(cplan) {
    let xplan = this.planList.find(element => element.id === cplan);
    return xplan.value
  }

  getPaymentMethodology(cmetodologiapago) {
    let xmetodologiapago = this.paymentMethodologyList.find(element => element.id === parseInt(cmetodologiapago, 10));
    return xmetodologiapago.value
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  getMonthAsString(month) {
    month = month + 1;
    if (month == 1) {
      return 'Enero'
    }
    if (month == 2) {
      return 'Febrero'
    }
    if (month == 3) {
      return 'Marzo'
    }
    if (month == 4) {
      return 'Abril'
    }
    if (month == 5) {
      return 'Mayo'
    }
    if (month == 6) {
      return 'Junio'
    }
    if (month == 7) {
      return 'Julio'
    }
    if (month == 8) {
      return 'Agosto'
    }
    if (month == 9) {
      return 'Septiembre'
    }
    if (month == 10) {
      return 'Octubre'
    }
    if (month == 11) {
      return 'Noviembre'
    }
    if (month == 12) {
      return 'Diciembre'
    }
  }

  buildCoverageBody() {
    let body = [];
    this.coverageList.forEach(function(row) {
      if (row.ititulo == 'C') {
        let dataRow = [];
        dataRow.push({text: row.xcobertura, margin: [10, 0, 0, 0], border:[true, false, true, false]});
        dataRow.push({text: ` `, border:[false, false, false, false]});
        dataRow.push({text: ` `, border:[false, false, false, false]});
        dataRow.push({text: ` `, border:[false, false, false, false]});
        dataRow.push({text: ` `, border:[false, false, false, false]});
        //Se utiliza el formato DE (alemania) ya que es el que coloca '.' para representar miles, y ',' para los decimales fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
        dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.msumaasegurada)} ${row.xmoneda}`, alignment: 'center', border:[true, false, false, false]});
        if(row.mprima){
          dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.mprima)} ${row.xmoneda}`, alignment: 'center', border:[true, false, true, false]});
        } else {
          dataRow.push({text: ` `, alignment: 'right', border:[true, false, true, false]});
        }
        if (row.mprimaprorrata) {
          dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.mprimaprorrata)} ${row.xmoneda}`, alignment: 'center', border:[true, false, true, false]});
        } else {
          dataRow.push({text: ` `, alignment: 'right', border:[true, false, true, false]});
        }
        body.push(dataRow);
      }
      if (row.ititulo == 'T') {
        let dataRow = [];
        dataRow.push({text: row.xcobertura, decoration: 'underline', margin: [2, 0, 0, 0], border:[true, false, true, false]});
        dataRow.push({text: ` `, border:[false, false, false, false]});
        dataRow.push({text: ` `, border:[false, false, false, false]});
        dataRow.push({text: ` `, border:[false, false, false, false]});
        dataRow.push({text: ` `, border:[false, false, false, false]});
        dataRow.push({text: ` `, border:[true, false, false, false]});
        dataRow.push({text: ` `, border:[true, false, true, false]});
        dataRow.push({text: ` `, border:[true, false, true, false]});
        body.push(dataRow);
      }
      /*if (row.services){
        row.services.forEach(function(row){
          let dataRow = [];
          dataRow.push([{text: row.xservicio, alignment: 'right', border:[true, false, true, false]}])
          dataRow.push([{text: `${finiciopoliza}            ${ffinpoliza}`, border:[false, false, false, false]}]);
          dataRow.push([{text: ' ', border:[false, false, false, false]}]);
          dataRow.push([{text: ' ', border:[false, false, false, false]}]);
          dataRow.push([{text: ' ', border:[false, false, true, false]}]);
          body.push(dataRow);
        })
      }*/
    });
    //Si la lista tiene menos de 15 coberturas, se rellena la tabla con espacios en blanco, al menos deben de haber 15 registros en la tabla
    /*let coverageListLength = 15 - this.coverageList.length;
    if (coverageListLength > 0) {
      for (let i = 0; i < coverageListLength; i++) {
        let dataRow = [];
        
        dataRow.push({text: ' ', border:[true, false, true, false]});
        dataRow.push({text: ' ', border:[false, false, false, false]});
        dataRow.push({text: ' ', border:[false, false, false, false]});
        dataRow.push({text: ' ', border:[true, false, true, false]});
        body.push(dataRow);
      }
    }*/
    return body;
  }

  createPDF(){
    const pdfDefinition: any = {
      content: [
        {
          columns: [
              {
                width: 140,
                height: 60,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQsAAAB1CAYAAABZCsRXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAADI8SURBVHhe7Z2Hf1TF++/vP3DL73fv72tDQKT3DtIRRVERRUBArKgUAbGhKGD72RVFRRH7VzqhQ+glgVBDD6GEQEIIhF5DD8+d9+yesDmZs9lNNsnucj68nldIds6csjOf87R55n+ICxcuXAQAlyxcuHAREFyycOHCRUBwycKFCxcBwSULFy5cBASXLFy4cBEQXLKIAuTk5Mjly5flwoULcu7cOTl9+rScPHFCjh87JkePHJGsrCzJOnxYDh86JIdsclj9/Yj6/OjRo7r9yZMn9fH0Q3/0e+3aNe+ZXNzMcMkiAnH+/HlJ2bNH4uPiZHpMjIz+4UcZNnSoDOjXX57u+ZQ8+vAj0rZVa2nSoKHUqlZDqtxdUSqWLy/l7igjd956m5Yy/Lztdrm7XHmpVqmy1KlZU7e/t3UbdfzD0qt7D+nfp6+8M2SIfPPVVzL+n3GycMEC2ZiYKJmZmXL16lXv1bi4WeCSRQTg1KlTsmD+fPnx++/l1QED5ckuXeSB++6Xpg0bSc1q1aRqxUqKDO7SwuQPlVh9Vq5wt1SvXEXq164jrZu30GTS88nu8vabb8kvP4+RJYsXy4njJ7xX6yJa4ZJFmOHSxYvaDNiyeYv8NnasvNy7tyKG+6Rx/QZ6wlYoW07uurOs/omYJnlxinV+hN9rVK2qSat9u3by3DPPyA+jRsnK+Hg5psyaC9nZrgkTRXDJIgxw5swZSU7eIfNjY2XYu+9Jp46Pyj2NGkvNqtX0pCxf5s5cgrBP3tKWXPIo4yEQCK2xMmcebN9eBiqz6N9//SXr162TjIwMuZbjEkckwyWLUsSePXtk6uQpMnjQq3Jv69ZSt2YtrfKbJmWoxNJI7KInvI/4fmbqJxCpdFcFTXhoHk926S' +
                'pffPa5LFm0WA4fOux9Ai4iCS5ZlCBQyc+dPSsrli+XTz7+WB5+sIN+E1uT0zThChLfCY1/oVKFCtqhiR8Dx2WNKlWlVrXqmogaKVOmedOm0qZFS2nXuo3c3/Zeua9NW23mPNKhgzymNJrHO3WSRx96WB5q/4Dci5NUTXSOpR/6o29IwH5uf0Ib7pH/4/fAeYq5snbNGu2sveY6SyMCLlmUAC5euiS7du7y+CBe6K39D0xsohOBTjY94ZQ5wjH8raqatLWr11BvbSIYraVr5yekX5++Oiry5eef6wgJJsD0mGnKvJkvy5YulZVx8bJu7VrZmLhRtm7ZItu3bZNtW7fJjqQk2bVrl+xLTZX9+/ZJyp4U2ZmcLJs3bZaEVatk6ZKlMmPaNPn91990ZOSdt4ZIrx49NeE0qtdAalSumns/BREfn2NWVb77bmnepKmOuPz6y1hJ3pEsFy9c8D4xF+EIlyyKERcvXtT2+ohhw+XB+9trLYJJFShBWBOLN3ntGjWlVfMWepKOeG+Y/Dz6J5kza5asTlitJ316WpqOmlxSxHTlyhUd2kSTIQfj+vXreSQYWMfQD/3R98ULF3WORtL2JO3MnDBunHz0wYfSo9uT0rRRY01kgWhLfM7zqKaeywPt7pOhQ96WuBUrJPt8tvfsLsIJLlmEGEwsohkr4+Lkjddel5b3NJOyt98R0MThJ8SAyo+Ds9PDj6g+XpOfRo/W4Uk0AJKrIIRwA+QEgZCHQU4GYVVMmYZ162nTxX6/duH+eU7kevTr00c7e0kUg6RchAdcsgghjh07JguUyt/v5T7a1sdsQDMwTQ6Ez1Dd8S9AKl0e76zfrv/+979l08aNknEgQ0dKgtUGwgFnz56VtP37tabw+aefSa+ePaWFukfIkPt2Ik80EkgDkkFTmTBuvDaNIvEZRBtcsggBsrOzZfHChfLCs89pJ6A/U4O/a9NCtWnbspW8+PwL8uMPP8j69ev1BCPPItpyE0gZ5xnh0MSf0q3zE1JHmVX+SMP6O0' +
                'SKI/iP336TA+np3h5dlAZcsigCsN83qEk+9O23tartpEUw8CEQwqK8XV/q3Vt+HPW9JG7YIDmFJgb1pr2uzJHryr6/HlnkQsJWzNSp8urAQTojtKBwcQWv76bL44/LxAkT9FoXV9MoebhkUUgQOfhgxAhp3vQeuf1ft+R7Q/K7RRL1atWWZ57qJX/+/ocmF8KFRcblHWrWvSaS9azIqW9Erh33fhA5wM+BuUU0pNMjHaWK0iKs5+b7LC3BPOHnU917yNQpU7Qm5qLk4JJFkECl/vvPP3XYj4FrGtj8Ddu8SYMG8t8ffaTDktmKIEL2Nsw5JXLoUcVY/1fJ/xPZf6cijK+UhnHF2yCygBMTAp07Z47O9ahYzn/EiM8wT7o+3llHm1CyXBQ/XLIIEJBE0vbt0qtHDylXJn9+BL8j2OIdOzyktIjf5fRpNamLA9nLRNKreIhi3788cqijh0QiHBAquSFEUkgm80caOEMrla8gX372hWualABcsggABw4ckJFffy2N6tXP55dgMLPUu2mjRvLG4NdkQWysrgVRfMgROT1KaRNlFEn81w2yONhOmSLRs/ITTWNaTIw8+/TT+hlbyWh24TO+kw73t9f+DBypLooHLlkUAOL9jyvVGLXXPlCxoatXqapNjc2bNmmSKPa32/XLIsffuUESlmS2Vzxy0tsoOpBzLUcX75kze7Y80elxueOWW/N9B76CJtL3pZd1spiL0MMlCweQDfnJRx/rtQyou9aA5E2G07JBnbo67ZmIxqWLJZgkdf2iyLGBiiB8TBBNFg9GHVn44mBGhoz5+WdpqLQ7oidO5gl/J/2dUOvZM64DNJRwycIGNIOlS5ZItye65BmU/EQVJsPwtYGDZM3qNXL+XAiiGsECsjja/6YjC0ComizW94cP1yahP9OE1a4kx23ZvNn1ZYQILln4gDRtFkqRPeg7+LCJyaPo37evXgtxRrUrNVy/IHLkpfxkoR2cpXhdJQj8EnEr4uT5Z5/VhOGkZaABkhmLlhGOKf' +
                'KRBpcsFHjz7Nm9R6+AtGsT+Co6d3pMpx2HJD+iqLiuroHcCjtZHH5CkcUZb6ObA6TXk/1KGBtisJOF9R2iZbytTMbU1FTvkS4Kg5ueLKilMG/uXF3DgYGVK3eW1UVvR6vBSDQk53qYLGiCEA73sJHFLYpAnlKf3Xw2Oolda5VJ+HLvFx2zaK3vtFPHjjJ71iy5esWtn1EY3NRkgTpL2jWVrX0HFqs+eRNt3bI1/FY9kktxuIsiCJ+wKWRxpI/6LAw0n1ICDukxP42Wxg0a5HFI2wWH9Zeff6G3PHARHG5asiCJ5+233spdlwBJoMpSNZv4ftjauKR145/IQxa3Kp38dY8/4yYG5iSrXB9/tJP+LvlO7WSh/6Y+e+mF3pKUlOQ6P4PATUkWVIDq3rWbHjgIqmvdGjXl3Xfekb0pKd5WYYprR0UyO9jI4jaR4++r2RKtTjw1oUll1wvnFCHmnPOIw/0eOJAuH454X1cSc9IySKRr3+4+vcYEx7aLgnHTkUV8XLxeGm4NGhKr2Fhn2tQYXdkq7HHtsMjBB21kcbvIyS/U5LnsbRQhYLLjg7mq7unKXpHLSSIX14lcWKFsxIUi56aKnPlD5PSP6v6+FDnxkZLhSot607OI7sSHqs1kdXyat8MboJrXxPETpFWz5o4hVgQ/x6sDBmi/1fp16yV5xw5JS0vTzlPM1Os5ruZh4aYhC9Z2zJ45SxettZxgVStV1vUkiN1HDK4eVGRxX16y2K/I4vTP6sNwWKrO5MLPo64F8rquNICrGSKXNisSWCpyfrbI2b885HZ8iMjRviKHn1Takrqn9HrqXu4SSf0PJf9Lyf/2yv/xCn9H/tMr/F/9/WB71fcqfXY7Vq9O0EWInaIlCOOB7FAW/7Vu1kKbMZQRoNrX1198qUmHOqbUHMHZTaYujlVdsvAmWsV2U5AFKz6pJl1dkQMDA9W0dvXqMvKbbyJvmTNv0YNtbGRxh5qA49SHpTRwqadBXY0rqWrSLvdcC5rA0QGKCHqKHHpYJK' +
                'OpSFplda23eiZ46v9UYhGBlwB0hMdXYwpQIJaDbY0aBjiYcVAGDxqktQh/zk9MUj5HE0HjxFSBRPg/xxKiJYzOC4YUf0gkMTFRj6Gbofxf1JMFm/vyxfLWsAYEIdFlS5ZGpnMLdf1gKzVJfMmijHpjz/I2KGZcv6pEmQ9MzOxFSqP5QeTIC+qaminNoKoihArqeu5U13Wb9xotArDEZ5KHTFS/nPfcJO9F5geawLfq5cALQzs5bUQRiFg+LggFTYUCzGyTgBn77tvvyOKFi+TE8eNRG5qNarIgnDZ0yBC581bPBsB8wbwZkpOTvS0iEFdS1MRs4Zkg1mRhcmYv8TYIJZTGQFboNWX6XN6iJuMUpS28qs7fUk1OZS7oa4AMqKtRWCLguKKKOn96ffVmWOa9bmegDbDpkTX5fcmgsEI/lsbapGFDeWPwYFm2dJmOuEWEHyxARC1ZULpt0CsD9BeIVKlYUYa88aZkHlQDP5JxWRFdxj3eSeKdcJDFxZXeBkVEjjInqMJ1fq5i25FKa3hOna+5Okd5da5bvOcNlhwUoWgfg2V+KLNjf1k1wauLHGiiyOdeTzj4cDd1vqeVvOjJGznS1ysvK1HXkdVDtXvM49/IUJoMx2a09vg8tFYRmM9mzerVMmjAALm/XTu9IBATQ5sc/7old3d5TBEIIFhCYaxxDH2yvcHHH3yotVheXJGOqCQLKmL3eemlXKdWjarVZMxPP4dHunZRcWmTZ5L4Tta0u9XfN3gbFAJkfhJ9OPmZmpBqsmLmoNYTZSGHQ5+nsOSgJK2S6vMBNeH7qXN8qr6g39T55nmckjg+L+9WdsIBdR3HlJzx+D9YMJcr3nAp9TquZirtao86bpv3WEWeuo5HcM5dvb/sjh16rQ/7r/z1558y6tvv5IMR78srfftJ186d9c5tmBqQh0UgkIGdIPwJeTwQEnU5/v7zr4jWNKKOLI4rmxGiwCkFw9eqXl0mKNWTaEhU4GKCIgulcudOXvXzQB01abZ7GxSEHM8EJF' +
                'x5fpp6YG+pN/VDnre8NinsE9+fcA3e6yAis7+ch7gyFTGQJHZ6tIeELiWqCb7PQwRhHj24dvWa1gKoJL5z505Zt26dxM6bp5fHjxg2TJ7q0UPq1a6ja2dYNU4C0T5oU7NqVenetatMi5mmt7GMNEQVWRw5ckTHzPlyUCHZq3P5smVRlKWn7uPCYjWxa/tMWDXB8WHg+PQHUsHxd+B3OIbfQan+RCf0ZIckLPLxJ7RRJgjaAr+nVVVmgDo361JOfqz6VuRzaaPH+YkmEEVhRcYQeReZmZmSlLRdFi1cKN9/N0pHRhhnLBFA+2Dc2YnCEggDzQSnKC+0hIQE7XiNFEQNWZCF99qgV6WSUvv4wh7p8JAOa0VXOq+6F6Ie6dV8JrCa6Jlq4qPGm0COA/4Hkpiw8zVBWKZFoIJZ8R/qZxnVhzKBsnoqcvjEEw0hXJpzVAnl7KLpWfsH4+rypcs6+kFB5onjx8vA/gOktTJdLFIwEUaulC8vzRo3kc8//VRrw5GAqCALiGLoW0P0F4Sws9eOpB3eT6MJyoQ486ea8PgTfCZzWkVvJIB8hyuq2SmP6n/qO6VB3O/TPlAzw8e0SFPElKn6ODrIkz9xZbfqH79CZFYSLy5AHvjEdibvlG9HjpTOjz2ml8YbicIrkAp+tWd7PSPbtm3z9hS+iHiyOH/unPY4W3Uonu31tOzerQZ0VEKRwamv1SS+wza5leCU1OnQSrKe8fgxmOwBmxiYF//p6ftAQ4+jk2hItjJ70Fr0OozoTzwKBTAt2JN2yuRJ8vKLL0rNatWlvEPKuaWFsNnSjOnTvT2EJyKeLEb/+KN2NmF6sPnM3pQCbPeIhiILIhY64ck04fk7YoU4TW18RbXRmZOKKHCaUq7v7HiRi+sVL7CEmwjDzWNahBpoG8ePHZfYubF6bEIKkIMTaVBf9K8//vAeHX6IaLKImTJV79NBSKtr5ydkT9RqFBbUm/30L56og3HyFyQQCHKr6qOslyAGiJybqMyWLap7t8BtcQHnO+' +
                'F7/BQmskAgE/bK/Xn0T2HJ0RFLFtQtoHhuudvLSJfHHte24k2Bi2s9JoaRDExiaQ9KcG4ebO0Ja56f6fU/uARRUmDD661btkjv51/Qyw9MWgaEwfYSv44dG3bO+Ygki32p+3S0g4d9b5s2uoLzTQNCoGQ1WuFLo6A9EMHAB1HBk/HIsm5WfFI8hzwL17woNWCasF6p6t0VHc0SwqtLFi32HhEeiDiyILmK3HsecuP6DWTJ4vB6oCWCq+kiWc95TAkdBrXkNo+DMr2WyKFH1Kh8RxHEDA9BuAg7YJZACk4aRrMmTWX//v3e1qWPiCMLUmbJu69bq5b2Wdy0IDx6broihOEexyQLvE584glvYqpQJMdF2OOfv/+WerVrGwkDX1yv7j3k4sXwKJcYUWSRujdV72mJvffdyJF605mbHrrcnLWWwq1aHWm4ojRl9jXx3YLCV/g7m2yHAyKGLHD2fPHZZ/qBPturly575sJFNIC8jJFff+NYzevhBx6Ug2GwWjpiyCI9LV2Hndq3ayfJOyK4HoULFwawCvaN114zEgYvyMkTJ3pblh4ihiwojTbs3Xdl08ZN3r+4cBFd2JmcrM1sO1mUu/0OnZl84gRL8UsPEUMW1DgkTu3CRbQCU3vq5Mn5yAJhReuG9eu9LUsHEeXgdOEi2nEk64j06NZNR0J8yYLCwRTnuXK59Jz6Llm4cBFGQLv47Zdf5bb/+lcesmDtU/cuXXW5yNKCSxYuXIQZSDSknJ9vKJX/N6pXX/bvK70krbAki3DLiXfhoiSxds1aHfmz512wyGzTptJz8IcdWRw9ekwyMg66hBFloDAMe8xGUhm50sK6tYosmjQ1ksXaNWu8rUoeYUUWDKS4+FUSvypBclyyiCokqO+0Y4eHorgwUeiwYvlyqV2jZn6yqFxZtmzZ4m1V8ggrssg4eFCmTpsp8xcudlO5owgs/hvy5pt6cdQ/f//b1RoLABshlbnltjxEAXHUr1NH9u4tveJOYUMWDKi4uFUyfuIUmTZjth' +
                'w4kOH9xEWkg42nG9Stq8kiHJKLwhns/v7e0Hf1Zke+ZMGzu69NWzl06JC3ZckjbMgiLe2A1iomTo6RCZOmyrr1id5PXEQyeAl88dnneo8N3o78XBkX5/3UhR1kcbZs1kyTgy9ZkHfxdM+ecrwU10SFBVlcunRJ+yogCmT8xKmycNGSqNon8mZFamqqPHj//bn2N2/M1wcPdr9bA8hSpgQDG2T5EgVCBudHH3yoN/ouLYQFWezbnyYx02flkgXC7/zdRWTjp9Gj8yyOgjT4fVPiRm8LFxbYBe3hBzvkIQlLSNKaNWOmt2XpoNTJAq1i2Yp4bXr4kgW/b0h0F41FMthFvFPHjvlSl8lGHPr221GvXeDIxQwzCePe14nP/8eO+UUnY/k+KwSC5e87dpTuXjilThZ7UlJl8tTpeYjCkoWLl8q5aNjM+CbF72N/zTU/7NKkYSNJTo7GjaBugFqbv//2m3w38lsZ9W1e+fyTT3Wlt+zz7OQmknHggA4tm7Y/xCx5ufeLN/eq03PnzsnCRUvzaRWW4PDMOlJ6ufAuCo9DhzKl86Od8jnqLKEC1DdffRXVK4mpu3Jv6za6DKRdINGeT3aXI0r7AntTUqRd27bG51WuTBmZMG68bleaKDWyQEXbvSdFpsTMMBIFMmnKNNm6LcmNy0cY+L6mTJqcu8u4SZgUj3V8NKornpGAxqbJpvvHNHvmqV650Y3UvXvl/nvbGcmiQ/sHJC2t9P13pUYW57OztVZhIglfWbBwiVvHIsLAZsEvPv+8VCyfd9DbBe1i3D/jvEdFH4pKFmgfaCF///lnWLwwS40sdiTvdPRV+AptTpxgKz0XkYKV8fFSu3qNPJPDJNjiTJhTJ095j4wuBEMWmCH3tb03lywgCgpTvz98uHaIhgNKhSyysy/IvPkLHX0VvkKbLVvDf4dpFx7ghxr0yiv5IiD+pLRDgsWFYMgiRZnk7Vq30Z+xYKzFPc1k9A8/yOVL4UEUoFTIYtPmrTLJQAwmgSxmzYnVCSsuwh' +
                '+JGzZIzarVHKMgduFN2vell+X06dPeHqIHwZAF9//n73/obNe/lNlBJme4md8lThYnTp6UOXNjjVqFk6aBo/PwYY/X2EX4AnV50ICBxvAf5OGkbdSvXUdWJyR4e4keBEMWAHK4dvWqXMsJTx9diZJFTs512bxlm5EQiIosXRantQgTaSRu3OTuzhnmYM/ZBnXr5ZsYaA+tm7eQt954Qzs17Z/ztxHDhkfdSuNgySLcUaJkcfbsWZk1e14+IoAcli6Pk1OnTkvcygS98tTeJnbBYnc9QRiDif7xhx8a9724S2kaX3z6md4o5/629+b7HK2jVbPmpVoyrjiwa+cuv2TxdM+n5NixyMkjKlGyIH3bTgIIEY9du/foNokbNxs1C5atZ2YWbf9O1Lzjx0/oRK+jPpJ15IicPHkqj1+E/587f063P0K7Y8eVXXkmX6UnFvZkHMxUE0FJ5qE8gukUispQ9HHo0GHPeWznOJBxULKyjjjatxcvXpJTyh6mAhnXk3nokL7/Y8ePK/I+p/oOjcq7N2WvtG93Xz5fBb83adDIY4Or+2DvFxOhVL7rbr0lZTQh6/Bhue/e/OSIQBaEl0P5AsS5nJ6eLklJSbJp40bZmLhRtm3dKil79qgxfESuF9HvV2JkcebMWW1qmIggdsEivSMTSEs/oInB3mbipBjZvn1HkRydaC6zvWYOfhCPTFe/x2jNhnx97G5qaUBs5IHoBW6q3RRFaHPmLZCENetkf1p67pdMWDdmxiwZr/qkX1+BBCnoUxQQX9+jJiLXau8f+Wf8JGXabc0Th+ceIIZt6nmtiFulTTuuxTqG5xkzfabOYVm7boPsTd2nCaUoz/aXMWOkgiGhCGIYPHBg7mrJZUuXah+FnVTKq8nDbnNZhfRNnVPEt3zZMpkfGysLFyzII/Nj52uTINj7S09LkzmzZ+frb9HChbrPkyc9IX2Ievv27brtIm+bxarNhHHj5J7GTfLcZ+79Km2r40MPy8zpM2TxokX6mAXz50vs3FjZvW' +
                'uX7rcg8J2fUd9bfHy8jPnpJxn4ygDp9HBHadqwkdSpUVM7mhsqs5CQ7DO9esnHH3wo02Ji9LMojPO0xMiCQWsNVLsk7diZO9h52xFWtbfh2BVxK4vExJnq7QwRma4D84e393J1jqmK1DCFfCcXwv/HTZisJy73AwHy0H2X1/sK7VevXluoL8YC55gzb77xmrnGJUtX5E7E69dz5HBWlqxKWKPvc5z63LoP+7H8DeFz7mdu7ELZuGmLngDBJgBlZGTo/ThNDsx6tWrrSWz1CSH36tHT6ATFdzHmp591u2DBIqtmTZpItYqV9STxFUKRnyszKNh8hV9/GatMqLL5+kOaNGioC+uC7Oxseev11/X11/J+Xqt6DalRpapRi7KEPArdtlp1/ZP2lVQfTOqCgBYxa+YMvWakYd36+tmzjJ2f+IggY4T/86zJaeFzrpGM0M8++USZSTfmXSAoEbJgkprSuhmsCxYuVjd+Y7EYtm/C6nX52iL0cUyZA4UFb1DeqKa+Z8yaq8X0mUnmzJ0vJ7zJRKnK1p46zZy2zjVjvhQG19W/NWvXG304yHRFCIe8b2LMiaTknfmW+gcjkMZs3mx79gZFcIT6TDUYGKzPP/OsnLQl1U2aOFFPYLt2we/dnuiiVeZgQTWuRvXr5yY12fv9748+DposIK7b/3VLvv6QxvUbyJqE1bodZDF40Kv57idY4XiuH2evP2DSDejXX5OMdZy9L39Ce0isTctWun7GpQBfwMVOFkx+pzcvsnOXx1dhAaZL2ZuqB669LSr3zl27g37zWdi2bYex32CFPpiYVlFhyGC2Ig9TWyb6juRdhbpmqpw7ZblyDRs2btaq9bVrOUo7Sw7JvUHg9ANJBTK5cFo+9kjHfJOUAVmtchWlZk/3trwBtItHlQpu0i7q1qolM2fMCPp5sWjrnkaNjWSB8CYtjGbhRBZoFlThBtkXsuXN1143tiuMQGwm8F3HrVihfUMmLS5YsUgDx/TRADYvKnaywCnnpFXgE6BEvB34Aa' +
                'wSe76i1e5lN9TuYMEEsPdpFz1ZJk/Tavz0mXP025trIYnMUtsXqOv2XToPIfrrG19HsNd8QbE91cI4p70//jY3doGc9vp5KBLk5A+yxPpsaszMXP+FvQ3C3/Hj4MsoaHIxodmbk/UL9oHIpKUM3CmvXW/H77/+5rjQbED//kE/L8wQbPVIJwsm8H9/+JHu1455c+boezSRrF3oxxLT55ZYnw8eOEhvnegPxUoWfDnxDqFQBnfyLvMbFw8+2oiT+k10ojBYYSiy4yt8NldNbByDODkzMjIlXf1M3Zem/Srxq1ZrAklJyV9hGVMER6mpXyYn/QQDNCgnTYHJjJMVnD+fret+OD0rhPPjY0H74Dp37UnRNU5NvpCpykxj3U4gzsBzZ89KjyefzDcAkSqKCDA3nHAo85C0bdUq33EMXpxyK+NXelsGhlIlC2WGvP7qYGO7wsgHw0fofn2xIDZW6tfxFD02HYPkEkQ5pdUpM6+G0uzQHO4qe8OHYToO4TPS9ElvcEKxkgWRDUwH38FoCW9bnHdOYPk6zkT7cQzurWoyXwvSs33lylVZtHiZTLD15ytoLf6uiQlEKPWyYXNaojmx8xc5ktGqhLVaAwkEXAOkZeqLv61WWowVkt2jnpO9ja9AbhCPyQdBBGTT5i0yQ7Wx2uKvCBTLlixVZkNt4+Dr2vkJv28qJi7qNk4++7EM3OHvvudtGRhKmyxwcOoJWqWqVFeif3onq+l4hHunjXUM/6ePj97/QPdrgehImxYt/U52tLQO7dvL0LffUdf9i8yYPkOvuaEOBjkuvZ97XhoosvF3PTg/f/z+B0d/VbGRBWokbzzTgIcEtO8hx9kuJS9gSoxzBS3eqMHg7DmiLM6TGZ9DUZyngCxTE8EhOETJ5SgIENKGxM3O/Sht4Li3YhJa2foNGx3vCc0EDaIg+x/fCFEgHMDB+ArIEzCpxAz4n378sUDtZM3q1cYwKhO+aaPGsjEx8ArvpUkWTC7yGqjhMWvmTD1J586eLb/8PEa3Mx' +
                '3Pc2NyTxg/XpsXHIevhtBm0vbtul/ANQ8eNMiRKOgHEmCHdUjFKZeCKBd7qJI1ynFO/TVu0EDdi7mcZbGQBQMOJ6XJOcfAJq/irJ83OMhWZLM8Lt6oXvMmhEyCAUlVVo6FvT+EZLCiJihhapj8M8ikqdNkVwDOWcK3Tk7NiVNi8pgIaCqrVq91vCd8Lbt3pxR4Tj7H6RiI6WEhPi5OD1L75GQQsr9FILkCF7IvyCt9+xkjKbx1meCBamOlSRZO2L9vX+5KUrvgoCRSdPqU/wV0CatWGbUvBKIg4W3RwkVq7Ab2nFiwNmzou8b+EL6/555+xts6L4qFLJjoC5XKbxrATH5MjECQlJRsJAsmEz6EYAY3GZaQjMkMIdyYlVX0tFtyQMh7ME1e7gO/gb/Bj69m8RLzc6PPpapvlvdbwBxauWq1I1noiEnipqDCoIEAchnY/xWjVoF9/N47QwP+bmbPmqUng/1Nx+/t2rQJeAeucCSLPYGsDTnu/NK7fPmS9Oj2pPE5I/h2YufN87YOHORoQNJOJiAhWUjKjmIhC+xepwgIWYOYBIFAJ1EZ8gboB7U5mC9/n86FyB9h0de0aImu3FVUMIk2bdma7xye83hIiXRrJ5Cp6aSNkR9i5VRYyLmWo6MwTmSBzJw1V1JDvKXC+nXrpLlh414mKlvsBbMfJ0Von+reXScM+faF1KhaVf7648+AiCccyWK30iSLspBs86ZNjkThCXl+pDXCwgCzqU1LZz/IK/36eVveQMjJgknH29E0gHnTbVfaQkFqsQXCk+x7au+HvnGQstw9UCTv3OU4EQkTBqruFgTWrxjT1ZWgXWDumO7fc6/mUCnCal3TpEHD8kcWCCSVqDQMU5g6WOBY/eyTT7UzzD7A+Bv1GILF/PnzdXqyvT+EJK1AwqhhSRZFWHXKc/76q6/kbsNkZoK3vKdZUD4dO9CCPxgxwkgW/O2+tm0lU2njvgg5WZCA5BRCtPINGPREMwoUpT7jwDP1hUAAgYJUZlMfyM4Ac/' +
                'EDAaaEieAQJrVnHUx+fw1RCadJ79HGzBP91Okz+rkWRBh8Tho9Pg/eRoESth1pSkNr6zABSMJ6560hShv4Q8b+8kvBMmaMzrf45OOPtUpt749BC4mw3qMgRBtZEGFhX1jTsfh4yIvILiL5k4bf0MHvRIaq3RQJKVmQychkcBq4RByYFEzcQIS2i5cuN/bFWzouPkEuB6ARQE5OSVMsECNxLFTIuZ6jK5I7PQO0G5y/vpOVRV+8/U3HYM6RG+EPe1V/3EdBhMEz4/yQGdGoQM1BXzDJnRxuqMbVK1f2hAArVtbhvIKEyEn1SlX8OvGYVAWtmIw2siDl3bScH4EsWDhWVOgd0B540GjqsFYlZupUb0sPQkYWTMjtSTuMqr4lmCGFEVNfTAzs8UCiIgwSiMXUB7kFR0NcgIRcDPu5fAWnpGVrXlLXphfZGdoxuVnlWpCDknRv0uadCMckPFeIPTV1nzLBAltGzw5jOB2dJmRxCG85HG4L5y/wXoUZ0UYWRFKo8WE/judBXsbMENQtJZxKTQ2naNSvY8d6W3oQMrIg9ZjBZxqYxSVMDB0VKUClxlZfZIgycDyrLQsKXwULJh8aEZPdfk6EBWtWTgeOVydnMEvLWYUbCFh0lqbeFIuWLHUkWLtYxLJq9ZqAckB+U4OnktIeGLD2wVWcAgHgvffnzIs2sqAGBX4J+3EV7iynMzlZ1l5UkK3Z9+WXpazBuYyvhAQtX4SMLFC9Ax2koZQV8asK9AiTqYhdbz+WybJ4yfKQOP7swHRwyl7lORE+vnTpspHEEDQ0kqSCBY5S0rrxT5DbYRGCP6EN7Yk+OeGw+uyRBzuUOFFYwuQkCuOEAsni00+jgiy4P/JbQkIWZ85K/759jZEovucfRn3vbelBSMji+ImTMnuOueZCccvM2fPkSAGmCAvTps80RyhWJtwwCUIJNIIZs+Y4PhNIguxKUzgXiV+VoAZ34SI0+EPwH+HMhAQm6wI/BX83M2crs84weDExJ06YkLsk2jSwQimmcy' +
                'Bfff6FXHUwmaKNLPbv3y+tmrfIdxzPp2aVajJr5ixvy8KDBK3nnnnG0QzBAe2LIpMFA8mpFB7CWxQ1u6ji5AshJdwqyecEysiZJiUrSYm2hDppCRD6WrN2g99J6vQZZkphF8vZwZoVfElz583360+yhCJA9jAytu1T3XvkG1BIxfIVdB2JVs1a6L0uCi1N79FFfVlmXqlCfmcnJNC6RUvZl2pO0kpO9r9EnXUowb4U2NXckSwaFi9ZsKnyA/fd73gs6z+KikOZmfKYYZd7BL/I5EmTvC09KDJZMBGdisawOhJnHs63HTt2Fl6Sd8na9RsczRwqQ/nLk2CFpulY/rZ12408/FBj//60gCaor+hr2p7k7SE0QNOgpGDipi16yb3pvJZAqvY1MnNnzzHmQfCWa3HPPTJ/3jzZrp4j1b0LK5s3bdZ9LF+2XB683zxJytx6m96V3OShIlsSwnEiixHDhgW17J2X4A+jRskdt9xq7K9po0ayceNGb2szikIWXGvv556Tu8vmPxazYcibb+pciaIAsjMRLN8roWxqZ/iiSGTBG3nt2vXGiYhzj3oMsDmDlYdfFMEZ4+R3mDVnni5AawLnTt65O99xCBrLniBWWQYLnL6mEoFOMn6ix4fiG1YNJegXX4q/qAnf5a7dN9LxGZB9XnzJ+PYhVDrkjTeDVu/9gTE18uuvjaFUQnxoH4cP5/etpO5N1bUmTWFABn//Pn2UjR54xTIraQmCsveHNGvSVHYojc0fikIWaKajvvvOaJYxuUma2qnMzMKCl+u3X39jJFfO2bZlK12D1BdFIgvCloQvTYOOOpaBrgEJBNxcwuq1xnMxwMk1MAGioaCtKTTJWzQt7YC3ZejBPilO12wSwrj2lO5AwAQLhmAIx/ojC5zVFmLnztO+CtOgrVuzliSszL+GoKhYs3qNduKZzol9jf/Efr8HMw5Kl8cedyQLFreZSMYJqOhdHu9sJEmEyYRfwR+KQhZg27ZtjkvKIdMfv//er0btDykpKfLQAw' +
                '8YnzHy4vMveFveQJHIYpVDrUyE2hCBJEwFA6eUbbQYTBHTG46JpCeH7RiEtOxMNSiKE7zJ0WDs5zYJi74gt2CAxoXPKM1bDCcQbE9iU2rnyNWO5N26HQuOBvR/xegAY1LqVZOnQ7/t4IVsT01LJy/944920n4UX3Adg14Z4GiGcL1U0A4UmEOmCmCWPNmlqzLXnCc6KCpZMJ67d+1mJECknSLATZvMy8n9AYL58P33jSn7PF8SsuYo09OOQpPFgYxMbf+a3lC8sfftD3zwBorDWUe0x95+Tn4nKmJaK4I6t2TpciNZcEyoE7LswAyjloXTmxzhM8wV/ArBYH96ui6vRx/4jSivVxAgTxbhOV0PJorlMGYZOjF9+4BCmMgLFyzU7YoDrKakQrbpzYdGQ9l8u3Yx6ttvHd/ETDgchqdPFZxPclyZtC8897yxH0uGvftegSH3opIFiFu+3JEskE4PP6J3YA8G1BqpoQjB1B/bOXTu9Ji3ZV4UiiyYgHjNTQOOvy1RrOy7lDpU4LxscWg6L+ozqzbtyjgsSsVq0zEs3CIHo7ixfn1ivnPbJdCcCiYIzxaHr13LIuWb6A6D2KSh8PxIYqOd73G+Mm3mbB2K5q02/L1hRt9BOaVp8GYtTBXuQOFZG9HLaAYweVgbYVfBFy9erLcesLfPFUU8/fr00TkjrD2yg2d7+uQpHTkxvXV9Zfq0ad6jnBEKssB38lLvF40LyhA0Kap0U7UMp6iTOcp3fyQrS94fNkxrTE7mB5XPKJJjQqHIgl2wps0wl5xnAJNCXFxgvYjpvEiCsnXtuQkX1ZvdyQxYtjxOD8riBms/TEvtEUgsQZlQfJmBgPwJsk6tY/P05f3JGhxME0ygTO/OZZQNIK3cn0nE8Wy2xCTcl5qqowumQVWhbFmZNDFvWC3UYNCP/2ecXmeS//zltIORCIov8EmQvmxvb5eOHR6Sn0aP1gup1q9bLxvWr5e4FXF6AVy3J57Q2onTZGKSo6GkB2D2hYIsAMvJWdjldE' +
                '0QRs1q1bQj+p+//5YVShtZv3adbNiwQVatXClzZs2SLz77TFcFp71TP/ydqJFTiDlostBahUNpf3wHy9VnofZV+IIsQ5KdTOenbqV9cRS2raktokOuhUx8CgY4DJ1CqJhCJLUFCiYyi+zGTXAu0IugaXFOTELE6fx5RJEP5MJEHfn1N8ZBxd86PfKI3liouMHep+3vbWe8jjtvvU1vHOQLrntB7HypXiU/wdiFt2vtGjWlWeMm0lyRIhqJPx8FwnVAJNNsC6ycECqyAJMnTvRrjiBcG4WSCXMTEuW+GtStqwm3IE0Jv1SPbt38bgkQNFngraecvGmwYe+mpxdfdAGgXpP9aDIrmBSp+/JqNWhBTms01m1I1DZ8cYJyfmSPOplO5HkE69S8qq6ZCuQBEUCAwvVBQjwPnL6tmjc3OgsZdN9+M7LYnxtArWb5ummgc23keCTvyBu+hExJU2Zim0jGLoG201K2vLw/fETAyV2hJAvw29hfpVqlSiG/L9pRN8QeKrUjKLLgLczyZgYWNSsssQbcylXqTR2gOl0UMKhvDHJfmaprUvpOPiIoTsVvN281F5QJFbD7l62IN55b56EsXlpoMwibm0Vo7C7v+T7yk1EgMmEiVbhmabOFPtEcv1QqKwuWmJDWoEP4nWSkgvILQgkKvJBN6HsdljDhvvnyq3wmXHb2eRk18lsd8i3obRyI0AdL6YcOeVtX9goUoSYL7hMzAxPMFKEKVrgvfFL9+/YrMAwMgiILsil5m8WoNzhl3izBYUYxXGzjkgD7eZKIhSaR5zqUPc7ksUwRVmKy/sKjWRAq9AhvdCYXmaVODqGign7JM3F6+3OtqPxFBYlfkKe1B4gWw/l8hTY8E7ZcJMRN2NUqVpy6d68uO4+3HHXWEiYeIbXh772Xz7FYnMBZ+9qgV7UqXbt6jXzX9ICyw011OtFKJk2YqDdbJrEKcjFNGH/CMUwoNjf+efRPQS84ZC9RnI+mviGLXj16yLEgC0/zclsZF6/T7yuqfkzaX0' +
                'HCfUE2lEb8duTIfNtLOiEosqDoLSnM+5W6on96/5+yd5+uLXktp/hVU4AKTMEaHHi516J+8jt7lViRGCYs1bLJ4CQcaAmFX/ibtaNXcYAoywxDmNcSHLWhJCoWy21LShY2j54Xu1DnkEBIEDmExRoayJUkOjQa9h7heVHZywLXw3aEM6ZPk6mTp8j0mJhciZkyRabFTNOflzQo0jJx/IQ814NMi5mqr/Oon6gMa0befWeoru5FsR0rumNpJ5pEfP+vPqMNpg8Lud4YPFgS16/39hYcdiqyoP6HLvCjiwJZ4in207N79wJzNZyAb4GkrE6PdNT905/lmDWJdV/4ZZo3bSpvvPa631W8JgTts3BRMK4pdXFFfIKj+YMpd8bPzk9FAcveyTeB2Mm72JOSqkPKhGbTDxzQkRk0L6dtD4pL0ypN4GMgosAq0rfeeEO6dX5CWjZrLo3q1Zd6tevocGGDuvX0m5aEL3YXG/3DD7Ju7boiRcvI6aDa1D9//1vG//OPj4zTKzop4R/opsROoEgOGa2U9+/5ZHe92I77ql+7ttSrVUev8bDuCw2N+1q7Zk2h7sslixAD02en0l5MJIHwtmcSl8Sk5By+crMDjRTzJEOR5ubNm2XVqlWyfPlyWbZ0qayMj5fEDRu07U4GaaCh7IKA2UAVdv3TR7gWfoYC9IN/7LDS7lmUR7iU8OlydV/8PzExUfYpUoEginJfLlmEGFScclqFi0nCWpGSiCS4cBFquGQRQqDar15jLgwMUZAHciqAdGMXLsIRLlmEEOyuTqTFRBY4GfEduHARqXDJIkTA/GBRl1P0g1qhJRlydOEi1HDJIgTAacSuZk5EQcgyK6v4Fl25cFEScMkiBDhwIMPPloVTZdv2pJB5vl24KB2I/H/0r/5P3IjTlgAAAABJRU5ErkJggg==',
                alignment: 'right',
                //height: 100
              }
          ]
        },
        {
          style: 'title',
          text: 'CERTIFICADO DE AUTOMÓVIL FLOTA'
        },
        {
          style: 'title',
          text: ' '
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text:[{text: 'Tipo de Movimiento: ', bold: true}, {text: 'EMISIÓN', alignment: 'center'}]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            fontSize: 7.5,
            widths: [70, 70, 70, 70, '*', '*'], //El total del width no debe pasar de 487px
            body: [
              [{text: [{text: 'Póliza\n', bold: true}, {text: this.xpoliza}], alignment: 'center', border:[true, false, true, true]}, {text: [{text: 'Recibo\n', bold: true}, {text: this.xrecibo}], alignment: 'center', border:[true, false, true, true]}, {text: [{text: 'Certificado\n', bold: true}, {text: this.ccontratoflota}], alignment: 'center', border:[true, false, true, true]}, {text: [{text: 'Referencia\n', bold: true}, {text: this.ccarga}], alignment: 'center', border:[true, false, true, true]}, {text: [{text: 'Fecha Emisión Recibo\n', bold: true}, {text: this.changeDateFormat(this.femision)}], border:[false, false, true, true]}, {text: [{text: 'Sucursal de Emisión\n', bold: true}, {text: this.detail_form.get('xsucursalemision').value}], border:[false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 70, '*', '*', '*'],
            body: [
              [{text: [{text: 'Moneda\n', bold: true}, {text: `${this.detail_form.get('xmoneda').value}`}], border:[true, false, true, false]}, {text: [{text: 'Frecuencia de Pago\n', bold: true}, {text: this.getPaymentMethodology(this.detail_form.get('cmetodologiapago').value)}], border:[false, false, true, false]}, {text: [{text: 'Vigencia de la Poliza\nDesde: ', bold: true}, {text: this.changeDateFormat(this.fdesde_pol)}, { text: '\nHasta:  ', bold: true}, {text: this.changeDateFormat(this.fhasta_pol)}], border:[false, false, true, false]}, {text: [{text: 'Vigencia del Recibo\nDesde: ', bold: true}, {text: this.changeDateFormat(this.fdesde_rec)}, {text: '\nHasta:  ', bold: true}, {text: this.changeDateFormat(this.fhasta_rec)}], border:[false, false, true, false]}, {text: [{text: 'Sucursal Suscriptora\n', bold: true}, {text: `${this.detail_form.get('xsucursalsuscriptora').value}`}], border:[false, false, true, false]}]
            ]
          }
        },
        { 
          style: 'title',
          table: {
            widths: ['*'],
            body: [
              [{text: 'TOMADOR', fillColor: '#D4D3D3' }]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [230, 180, 77],
            body: [
              [{text: [{text: 'Nombre(s) y Apellido(s) / Razón Social:\n', bold: true}, {text: `${this.xnombrecliente} `}], border:[true, false, true, true]}, {text: [{text:'C.I. / R.I.F.:\n', bold: true}, {text: `${this.xdocidentidadcliente}`}], border:[false, false, true, true]}, {text: [{text: 'Ocupación:\n', bold: true}, {text: ` `}], border:[false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [230, 71, 100, 77],
            body: [
              [{text: [{text: 'Nacionalidad: ', bold: true}, {text: ` `}], border:[true, false, true, true]}, {text: [{text: 'Edad: ', bold: true}, {text: ` `}], border:[false, false, true, true]}, {text: [{text: 'Estado Civil: ', bold: true}, {text: ` `}], border:[false, false, true, true]}, {text: [{text: 'Sexo: ', bold: true}, {text: ` `}], border:[false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [230, 71, 100, 77],
            body: [
              [{text: [{text: 'Dirección de Cobro:\n', bold: true}, {text: `${this.xdireccionfiscalcliente}`}], border:[true, false, true, false]}, {text: [{text: 'Ciudad:\n', bold: true}, {text: this.xciudadcliente}], border:[false, false, true, false]}, {text: [{text: 'Estado:\n', bold: true}, {text: this.xestadocliente}], border:[false, false, true, false]}, {text: [{text: 'Teléfono:\n', bold: true}, {text: `${this.xtelefonocliente}`}], border:[false, false, true, false]}]
            ]
          }
        },
        { 
          style: 'title',
          table: {
            widths: ['*'],
            body: [
              [{text: 'BENEFICIARIO', fillColor: '#D4D3D3' }]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [230, 180, 77],
            body: [
              [{text: [{text: 'Nombre(s) y Apellido(s) / Razón Social:\n', bold: true}, {text: `${this.detail_form.get('xnombrepropietario').value} `}, {text: `${this.detail_form.get('xapellidopropietario').value}`}], border:[true, false, true, true]}, {text: [{text:'C.I. / R.I.F.:\n', bold: true}, {text: `${this.detail_form.get('xdocidentidadpropietario').value}`}], border:[false, false, true, true]}, {text: [{text: 'Ocupación:\n', bold: true}, {text: `${this.detail_form.get('xocupacionpropietario').value}`}], border:[false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [230, 71, 100, 77],
            body: [
              [{text: [{text: 'Nacionalidad: ', bold: true}, {text: `${this.detail_form.get('xnacionalidadpropietario').value}`}], border:[true, false, true, true]}, {text: [{text: 'Edad: ', bold: true}, {text: `${this.fnacimientopropietario2}`}], border:[false, false, true, true]}, {text: [{text: 'Estado Civil: ', bold: true}, {text: `${this.detail_form.get('xestadocivilpropietario').value}`}], border:[false, false, true, true]}, {text: [{text: 'Sexo: ', bold: true}, {text: `${this.detail_form.get('xsexopropietario').value}`}], border:[true, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [230, 71, 100, 77],
            body: [
              [{text: [{text: 'Dirección de Cobro:\n', bold: true}, {text: `${this.detail_form.get('xdireccionpropietario').value}`}], border:[true, false, true, false]}, {text: [{text: 'Ciudad:\n', bold: true}, {text: `${this.detail_form.get('xciudadpropietario').value}`}], border:[false, false, true, false]}, {text: [{text: 'Estado:\n', bold: true}, {text: `${this.detail_form.get('xestadopropietario').value}`}], border:[false, false, true, false]}, {text: [{text: 'Teléfono:\n', bold: true}, {text: `${this.detail_form.get('xtelefonocelularpropietario').value}`}], border:[false, false, true, false]}]
            ]
          }
        },
        { 
          style: 'title',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS PARTICULARES AUTOMÓVIL', fillColor: '#D4D3D3' }]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*', '*', '*'],
            body: [
              [{text: [{text: 'Placa: ', bold: true}, {text: this.detail_form.get('xplaca').value}], border:[true, false, false, false]},                                         {text: [{text: 'Marca: ', bold: true}, {text: `${this.detail_form.get('xmarca').value}`}], border:[false, false, false, false]},                                 {text: [{text: 'Modelo: ', bold: true}, {text: `${this.detail_form.get('xmodelo').value}`}], border:[false, false, true, false]}],
              [{text: [{text: 'Versión: ', bold: true}, {text: this.detail_form.get('xversion').value}], border:[true, false, false, false]},                                     {text: [{text: 'Año: ', bold: true}, {text: this.detail_form.get('fano').value}], border:[false, false, false, false]},                                          {text: [{text: 'Tipo De Vehículo: ', bold: true}, {text: `${this.detail_form.get('xtipovehiculo').value}`}], border:[false, false, true, false]}],
              [{text: [{text: 'Uso: ', bold: true}, {text: `${this.detail_form.get('xuso').value}`}], border:[true, false, false, false]},                                        {text: [{text: 'Serial Carrocería: ', bold: true}, {text: `${this.detail_form.get('xserialcarroceria').value}`}], border:[false, false, false, false]},          {text: [{text: 'Serial Motor: ', bold: true}, {text: `${this.detail_form.get('xserialmotor').value}`}], border:[false, false, true, false]}],
              [{text: [{text: 'Peso: ', bold: true}, {text: ` `}], border:[true, false, false, false]},                                                                           {text: [{text: 'Carga Tonelaje: ', bold: true}, {text: `${this.detail_form.get('ncapacidadcargavehiculo').value}`}], border:[false, false, false, false]},       {text: [{text: 'Color: ', bold: true}, {text: `${this.detail_form.get('xcolor').value}`}], border:[false, false, true, false]}],
              [{text: [{text: 'Número de puestos: ', bold: true}, {text: `${this.detail_form.get('ncapacidadpasajerosvehiculo').value}`}], border:[true, false, false, false]},   {text: [{text: 'Plan Asegurado: ', bold: true}, {text: `${this.detail_form.get('xplan').value}`}], border:[false, false, false, false]},                         {text: [{text: 'Plan Combo: ', bold: true}, {text: `${this.detail_form.get('xplan').value}`}], border:[false, false, true, false]}]
            ]
          }
        },
        { 
          style: 'title',
          table: {
            widths: ['*'],
            body: [
              [{text: 'COBERTURAS', fillColor: '#D4D3D3' }]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [159.5, 22, 23, 22, 22, 70, 70, 54],
            body: [
              [{text: 'TIPO DE COBERTURAS', bold: true, rowSpan: 2, margin: [10, 0, 0, 0], border:[true, false, true, true]}, {text: 'DEDUCIBLE', bold: true, colSpan: 4, alignment: 'center', fontSize: 7.5, border:[false, false, true, true]}, {}, {}, {}, {text: 'Sumas\nAseguradas', bold: true, alignment: 'center', rowSpan: 2, border:[false, false, true, true]}, {text: 'Prima Anual\n', bold: true, alignment: 'center', rowSpan: 2, border:[false, false, true, true]}, {text: 'Prima\nProrrata', bold: true, alignment: 'center', rowSpan: 2, border:[false, false, true, true]}],
              [{}, {text: '%', bold: true, alignment: 'center', fontSize: 6.5}, {text: 'Mínimo', bold: true, alignment: 'center', fontSize: 6.5}, {text: 'Monto', bold: true, alignment: 'center', fontSize: 6.5}, {text: 'Días', bold: true, alignment: 'center', fontSize: 6.5}, {}, {}, {}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [159.5, 22, 23, 22, 22, 70, 70, 54],
            body: this.buildCoverageBody()
          }
        },
        {
          style: 'data',
          table: {
            widths: [159.5, 22, 23, 22, 22, 70, 70, 54],
            body: [
              [{text: 'TOTAL PRIMA A PAGAR', colSpan: 6, bold: true, border: [true, true, false, true]}, {}, {}, {}, {}, {}, {text: `${this.detail_form.get('xmoneda').value}. ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal)}`, alignment: 'center', bold: true, border: [true, true, true, true]}, {text: `${this.detail_form.get('xmoneda').value}. ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimaprorratatotal)}`, alignment: 'center', bold: true, border: [false, true, true, true]}]
            ]
          }
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
              {
                width: 140,
                height: 60,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQsAAAB1CAYAAABZCsRXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAADI8SURBVHhe7Z2Hf1TF++/vP3DL73fv72tDQKT3DtIRRVERRUBArKgUAbGhKGD72RVFRRH7VzqhQ+glgVBDD6GEQEIIhF5DD8+d9+yesDmZs9lNNsnucj68nldIds6csjOf87R55n+ICxcuXAQAlyxcuHAREFyycOHCRUBwycKFCxcBwSULFy5cBASXLFy4cBEQXLKIAuTk5Mjly5flwoULcu7cOTl9+rScPHFCjh87JkePHJGsrCzJOnxYDh86JIdsclj9/Yj6/OjRo7r9yZMn9fH0Q3/0e+3aNe+ZXNzMcMkiAnH+/HlJ2bNH4uPiZHpMjIz+4UcZNnSoDOjXX57u+ZQ8+vAj0rZVa2nSoKHUqlZDqtxdUSqWLy/l7igjd956m5Yy/Lztdrm7XHmpVqmy1KlZU7e/t3UbdfzD0qt7D+nfp6+8M2SIfPPVVzL+n3GycMEC2ZiYKJmZmXL16lXv1bi4WeCSRQTg1KlTsmD+fPnx++/l1QED5ckuXeSB++6Xpg0bSc1q1aRqxUqKDO7SwuQPlVh9Vq5wt1SvXEXq164jrZu30GTS88nu8vabb8kvP4+RJYsXy4njJ7xX6yJa4ZJFmOHSxYvaDNiyeYv8NnasvNy7tyKG+6Rx/QZ6wlYoW07uurOs/omYJnlxinV+hN9rVK2qSat9u3by3DPPyA+jRsnK+Hg5psyaC9nZrgkTRXDJIgxw5swZSU7eIfNjY2XYu+9Jp46Pyj2NGkvNqtX0pCxf5s5cgrBP3tKWXPIo4yEQCK2xMmcebN9eBiqz6N9//SXr162TjIwMuZbjEkckwyWLUsSePXtk6uQpMnjQq3Jv69ZSt2YtrfKbJmWoxNJI7KInvI/4fmbqJxCpdFcFTXhoHk926S' +
                'pffPa5LFm0WA4fOux9Ai4iCS5ZlCBQyc+dPSsrli+XTz7+WB5+sIN+E1uT0zThChLfCY1/oVKFCtqhiR8Dx2WNKlWlVrXqmogaKVOmedOm0qZFS2nXuo3c3/Zeua9NW23mPNKhgzymNJrHO3WSRx96WB5q/4Dci5NUTXSOpR/6o29IwH5uf0Ib7pH/4/fAeYq5snbNGu2sveY6SyMCLlmUAC5euiS7du7y+CBe6K39D0xsohOBTjY94ZQ5wjH8raqatLWr11BvbSIYraVr5yekX5++Oiry5eef6wgJJsD0mGnKvJkvy5YulZVx8bJu7VrZmLhRtm7ZItu3bZNtW7fJjqQk2bVrl+xLTZX9+/ZJyp4U2ZmcLJs3bZaEVatk6ZKlMmPaNPn91990ZOSdt4ZIrx49NeE0qtdAalSumns/BREfn2NWVb77bmnepKmOuPz6y1hJ3pEsFy9c8D4xF+EIlyyKERcvXtT2+ohhw+XB+9trLYJJFShBWBOLN3ntGjWlVfMWepKOeG+Y/Dz6J5kza5asTlitJ316WpqOmlxSxHTlyhUd2kSTIQfj+vXreSQYWMfQD/3R98ULF3WORtL2JO3MnDBunHz0wYfSo9uT0rRRY01kgWhLfM7zqKaeywPt7pOhQ96WuBUrJPt8tvfsLsIJLlmEGEwsohkr4+Lkjddel5b3NJOyt98R0MThJ8SAyo+Ds9PDj6g+XpOfRo/W4Uk0AJKrIIRwA+QEgZCHQU4GYVVMmYZ162nTxX6/duH+eU7kevTr00c7e0kUg6RchAdcsgghjh07JguUyt/v5T7a1sdsQDMwTQ6Ez1Dd8S9AKl0e76zfrv/+979l08aNknEgQ0dKgtUGwgFnz56VtP37tabw+aefSa+ePaWFukfIkPt2Ik80EkgDkkFTmTBuvDaNIvEZRBtcsggBsrOzZfHChfLCs89pJ6A/U4O/a9NCtWnbspW8+PwL8uMPP8j69ev1BCPPItpyE0gZ5xnh0MSf0q3zE1JHmVX+SMP6O0' +
                'SKI/iP336TA+np3h5dlAZcsigCsN83qEk+9O23tartpEUw8CEQwqK8XV/q3Vt+HPW9JG7YIDmFJgb1pr2uzJHryr6/HlnkQsJWzNSp8urAQTojtKBwcQWv76bL44/LxAkT9FoXV9MoebhkUUgQOfhgxAhp3vQeuf1ft+R7Q/K7RRL1atWWZ57qJX/+/ocmF8KFRcblHWrWvSaS9azIqW9Erh33fhA5wM+BuUU0pNMjHaWK0iKs5+b7LC3BPOHnU917yNQpU7Qm5qLk4JJFkECl/vvPP3XYj4FrGtj8Ddu8SYMG8t8ffaTDktmKIEL2Nsw5JXLoUcVY/1fJ/xPZf6cijK+UhnHF2yCygBMTAp07Z47O9ahYzn/EiM8wT7o+3llHm1CyXBQ/XLIIEJBE0vbt0qtHDylXJn9+BL8j2OIdOzyktIjf5fRpNamLA9nLRNKreIhi3788cqijh0QiHBAquSFEUkgm80caOEMrla8gX372hWualABcsggABw4ckJFffy2N6tXP55dgMLPUu2mjRvLG4NdkQWysrgVRfMgROT1KaRNlFEn81w2yONhOmSLRs/ITTWNaTIw8+/TT+hlbyWh24TO+kw73t9f+DBypLooHLlkUAOL9jyvVGLXXPlCxoatXqapNjc2bNmmSKPa32/XLIsffuUESlmS2Vzxy0tsoOpBzLUcX75kze7Y80elxueOWW/N9B76CJtL3pZd1spiL0MMlCweQDfnJRx/rtQyou9aA5E2G07JBnbo67ZmIxqWLJZgkdf2iyLGBiiB8TBBNFg9GHVn44mBGhoz5+WdpqLQ7oidO5gl/J/2dUOvZM64DNJRwycIGNIOlS5ZItye65BmU/EQVJsPwtYGDZM3qNXL+XAiiGsECsjja/6YjC0ComizW94cP1yahP9OE1a4kx23ZvNn1ZYQILln4gDRtFkqRPeg7+LCJyaPo37evXgtxRrUrNVy/IHLkpfxkoR2cpXhdJQj8EnEr4uT5Z5/VhOGkZaABkhmLlhGOKf' +
                'KRBpcsFHjz7Nm9R6+AtGsT+Co6d3pMpx2HJD+iqLiuroHcCjtZHH5CkcUZb6ObA6TXk/1KGBtisJOF9R2iZbytTMbU1FTvkS4Kg5ueLKilMG/uXF3DgYGVK3eW1UVvR6vBSDQk53qYLGiCEA73sJHFLYpAnlKf3Xw2Oolda5VJ+HLvFx2zaK3vtFPHjjJ71iy5esWtn1EY3NRkgTpL2jWVrX0HFqs+eRNt3bI1/FY9kktxuIsiCJ+wKWRxpI/6LAw0n1ICDukxP42Wxg0a5HFI2wWH9Zeff6G3PHARHG5asiCJ5+233spdlwBJoMpSNZv4ftjauKR145/IQxa3Kp38dY8/4yYG5iSrXB9/tJP+LvlO7WSh/6Y+e+mF3pKUlOQ6P4PATUkWVIDq3rWbHjgIqmvdGjXl3Xfekb0pKd5WYYprR0UyO9jI4jaR4++r2RKtTjw1oUll1wvnFCHmnPOIw/0eOJAuH454X1cSc9IySKRr3+4+vcYEx7aLgnHTkUV8XLxeGm4NGhKr2Fhn2tQYXdkq7HHtsMjBB21kcbvIyS/U5LnsbRQhYLLjg7mq7unKXpHLSSIX14lcWKFsxIUi56aKnPlD5PSP6v6+FDnxkZLhSot607OI7sSHqs1kdXyat8MboJrXxPETpFWz5o4hVgQ/x6sDBmi/1fp16yV5xw5JS0vTzlPM1Os5ruZh4aYhC9Z2zJ45SxettZxgVStV1vUkiN1HDK4eVGRxX16y2K/I4vTP6sNwWKrO5MLPo64F8rquNICrGSKXNisSWCpyfrbI2b885HZ8iMjRviKHn1Takrqn9HrqXu4SSf0PJf9Lyf/2yv/xCn9H/tMr/F/9/WB71fcqfXY7Vq9O0EWInaIlCOOB7FAW/7Vu1kKbMZQRoNrX1198qUmHOqbUHMHZTaYujlVdsvAmWsV2U5AFKz6pJl1dkQMDA9W0dvXqMvKbbyJvmTNv0YNtbGRxh5qA49SHpTRwqadBXY0rqWrSLvdcC5rA0QGKCHqKHHpYJK' +
                'OpSFplda23eiZ46v9UYhGBlwB0hMdXYwpQIJaDbY0aBjiYcVAGDxqktQh/zk9MUj5HE0HjxFSBRPg/xxKiJYzOC4YUf0gkMTFRj6Gbofxf1JMFm/vyxfLWsAYEIdFlS5ZGpnMLdf1gKzVJfMmijHpjz/I2KGZcv6pEmQ9MzOxFSqP5QeTIC+qaminNoKoihArqeu5U13Wb9xotArDEZ5KHTFS/nPfcJO9F5geawLfq5cALQzs5bUQRiFg+LggFTYUCzGyTgBn77tvvyOKFi+TE8eNRG5qNarIgnDZ0yBC581bPBsB8wbwZkpOTvS0iEFdS1MRs4Zkg1mRhcmYv8TYIJZTGQFboNWX6XN6iJuMUpS28qs7fUk1OZS7oa4AMqKtRWCLguKKKOn96ffVmWOa9bmegDbDpkTX5fcmgsEI/lsbapGFDeWPwYFm2dJmOuEWEHyxARC1ZULpt0CsD9BeIVKlYUYa88aZkHlQDP5JxWRFdxj3eSeKdcJDFxZXeBkVEjjInqMJ1fq5i25FKa3hOna+5Okd5da5bvOcNlhwUoWgfg2V+KLNjf1k1wauLHGiiyOdeTzj4cDd1vqeVvOjJGznS1ysvK1HXkdVDtXvM49/IUJoMx2a09vg8tFYRmM9mzerVMmjAALm/XTu9IBATQ5sc/7old3d5TBEIIFhCYaxxDH2yvcHHH3yotVheXJGOqCQLKmL3eemlXKdWjarVZMxPP4dHunZRcWmTZ5L4Tta0u9XfN3gbFAJkfhJ9OPmZmpBqsmLmoNYTZSGHQ5+nsOSgJK2S6vMBNeH7qXN8qr6g39T55nmckjg+L+9WdsIBdR3HlJzx+D9YMJcr3nAp9TquZirtao86bpv3WEWeuo5HcM5dvb/sjh16rQ/7r/z1558y6tvv5IMR78srfftJ186d9c5tmBqQh0UgkIGdIPwJeTwQEnU5/v7zr4jWNKKOLI4rmxGiwCkFw9eqXl0mKNWTaEhU4GKCIgulcudOXvXzQB01abZ7GxSEHM8EJF' +
                'x5fpp6YG+pN/VDnre8NinsE9+fcA3e6yAis7+ch7gyFTGQJHZ6tIeELiWqCb7PQwRhHj24dvWa1gKoJL5z505Zt26dxM6bp5fHjxg2TJ7q0UPq1a6ja2dYNU4C0T5oU7NqVenetatMi5mmt7GMNEQVWRw5ckTHzPlyUCHZq3P5smVRlKWn7uPCYjWxa/tMWDXB8WHg+PQHUsHxd+B3OIbfQan+RCf0ZIckLPLxJ7RRJgjaAr+nVVVmgDo361JOfqz6VuRzaaPH+YkmEEVhRcYQeReZmZmSlLRdFi1cKN9/N0pHRhhnLBFA+2Dc2YnCEggDzQSnKC+0hIQE7XiNFEQNWZCF99qgV6WSUvv4wh7p8JAOa0VXOq+6F6Ie6dV8JrCa6Jlq4qPGm0COA/4Hkpiw8zVBWKZFoIJZ8R/qZxnVhzKBsnoqcvjEEw0hXJpzVAnl7KLpWfsH4+rypcs6+kFB5onjx8vA/gOktTJdLFIwEUaulC8vzRo3kc8//VRrw5GAqCALiGLoW0P0F4Sws9eOpB3eT6MJyoQ486ea8PgTfCZzWkVvJIB8hyuq2SmP6n/qO6VB3O/TPlAzw8e0SFPElKn6ODrIkz9xZbfqH79CZFYSLy5AHvjEdibvlG9HjpTOjz2ml8YbicIrkAp+tWd7PSPbtm3z9hS+iHiyOH/unPY4W3Uonu31tOzerQZ0VEKRwamv1SS+wza5leCU1OnQSrKe8fgxmOwBmxiYF//p6ftAQ4+jk2hItjJ70Fr0OozoTzwKBTAt2JN2yuRJ8vKLL0rNatWlvEPKuaWFsNnSjOnTvT2EJyKeLEb/+KN2NmF6sPnM3pQCbPeIhiILIhY64ck04fk7YoU4TW18RbXRmZOKKHCaUq7v7HiRi+sVL7CEmwjDzWNahBpoG8ePHZfYubF6bEIKkIMTaVBf9K8//vAeHX6IaLKImTJV79NBSKtr5ydkT9RqFBbUm/30L56og3HyFyQQCHKr6qOslyAGiJybqMyWLap7t8BtcQHnO+' +
                'F7/BQmskAgE/bK/Xn0T2HJ0RFLFtQtoHhuudvLSJfHHte24k2Bi2s9JoaRDExiaQ9KcG4ebO0Ja56f6fU/uARRUmDD661btkjv51/Qyw9MWgaEwfYSv44dG3bO+Ygki32p+3S0g4d9b5s2uoLzTQNCoGQ1WuFLo6A9EMHAB1HBk/HIsm5WfFI8hzwL17woNWCasF6p6t0VHc0SwqtLFi32HhEeiDiyILmK3HsecuP6DWTJ4vB6oCWCq+kiWc95TAkdBrXkNo+DMr2WyKFH1Kh8RxHEDA9BuAg7YJZACk4aRrMmTWX//v3e1qWPiCMLUmbJu69bq5b2Wdy0IDx6broihOEexyQLvE584glvYqpQJMdF2OOfv/+WerVrGwkDX1yv7j3k4sXwKJcYUWSRujdV72mJvffdyJF605mbHrrcnLWWwq1aHWm4ojRl9jXx3YLCV/g7m2yHAyKGLHD2fPHZZ/qBPturly575sJFNIC8jJFff+NYzevhBx6Ug2GwWjpiyCI9LV2Hndq3ayfJOyK4HoULFwawCvaN114zEgYvyMkTJ3pblh4ihiwojTbs3Xdl08ZN3r+4cBFd2JmcrM1sO1mUu/0OnZl84gRL8UsPEUMW1DgkTu3CRbQCU3vq5Mn5yAJhReuG9eu9LUsHEeXgdOEi2nEk64j06NZNR0J8yYLCwRTnuXK59Jz6Llm4cBFGQLv47Zdf5bb/+lcesmDtU/cuXXW5yNKCSxYuXIQZSDSknJ9vKJX/N6pXX/bvK70krbAki3DLiXfhoiSxds1aHfmz512wyGzTptJz8IcdWRw9ekwyMg66hBFloDAMe8xGUhm50sK6tYosmjQ1ksXaNWu8rUoeYUUWDKS4+FUSvypBclyyiCokqO+0Y4eHorgwUeiwYvlyqV2jZn6yqFxZtmzZ4m1V8ggrssg4eFCmTpsp8xcudlO5owgs/hvy5pt6cdQ/f//b1RoLABshlbnltjxEAXHUr1NH9u4tveJOYUMWDKi4uFUyfuIUmTZjth' +
                'w4kOH9xEWkg42nG9Stq8kiHJKLwhns/v7e0Hf1Zke+ZMGzu69NWzl06JC3ZckjbMgiLe2A1iomTo6RCZOmyrr1id5PXEQyeAl88dnneo8N3o78XBkX5/3UhR1kcbZs1kyTgy9ZkHfxdM+ecrwU10SFBVlcunRJ+yogCmT8xKmycNGSqNon8mZFamqqPHj//bn2N2/M1wcPdr9bA8hSpgQDG2T5EgVCBudHH3yoN/ouLYQFWezbnyYx02flkgXC7/zdRWTjp9Gj8yyOgjT4fVPiRm8LFxbYBe3hBzvkIQlLSNKaNWOmt2XpoNTJAq1i2Yp4bXr4kgW/b0h0F41FMthFvFPHjvlSl8lGHPr221GvXeDIxQwzCePe14nP/8eO+UUnY/k+KwSC5e87dpTuXjilThZ7UlJl8tTpeYjCkoWLl8q5aNjM+CbF72N/zTU/7NKkYSNJTo7GjaBugFqbv//2m3w38lsZ9W1e+fyTT3Wlt+zz7OQmknHggA4tm7Y/xCx5ufeLN/eq03PnzsnCRUvzaRWW4PDMOlJ6ufAuCo9DhzKl86Od8jnqLKEC1DdffRXVK4mpu3Jv6za6DKRdINGeT3aXI0r7AntTUqRd27bG51WuTBmZMG68bleaKDWyQEXbvSdFpsTMMBIFMmnKNNm6LcmNy0cY+L6mTJqcu8u4SZgUj3V8NKornpGAxqbJpvvHNHvmqV650Y3UvXvl/nvbGcmiQ/sHJC2t9P13pUYW57OztVZhIglfWbBwiVvHIsLAZsEvPv+8VCyfd9DbBe1i3D/jvEdFH4pKFmgfaCF///lnWLwwS40sdiTvdPRV+AptTpxgKz0XkYKV8fFSu3qNPJPDJNjiTJhTJ095j4wuBEMWmCH3tb03lywgCgpTvz98uHaIhgNKhSyysy/IvPkLHX0VvkKbLVvDf4dpFx7ghxr0yiv5IiD+pLRDgsWFYMgiRZnk7Vq30Z+xYKzFPc1k9A8/yOVL4UEUoFTIYtPmrTLJQAwmgSxmzYnVCSsuwh' +
                '+JGzZIzarVHKMgduFN2vell+X06dPeHqIHwZAF9//n73/obNe/lNlBJme4md8lThYnTp6UOXNjjVqFk6aBo/PwYY/X2EX4AnV50ICBxvAf5OGkbdSvXUdWJyR4e4keBEMWAHK4dvWqXMsJTx9diZJFTs512bxlm5EQiIosXRantQgTaSRu3OTuzhnmYM/ZBnXr5ZsYaA+tm7eQt954Qzs17Z/ztxHDhkfdSuNgySLcUaJkcfbsWZk1e14+IoAcli6Pk1OnTkvcygS98tTeJnbBYnc9QRiDif7xhx8a9724S2kaX3z6md4o5/629+b7HK2jVbPmpVoyrjiwa+cuv2TxdM+n5NixyMkjKlGyIH3bTgIIEY9du/foNokbNxs1C5atZ2YWbf9O1Lzjx0/oRK+jPpJ15IicPHkqj1+E/587f063P0K7Y8eVXXkmX6UnFvZkHMxUE0FJ5qE8gukUispQ9HHo0GHPeWznOJBxULKyjjjatxcvXpJTyh6mAhnXk3nokL7/Y8ePK/I+p/oOjcq7N2WvtG93Xz5fBb83adDIY4Or+2DvFxOhVL7rbr0lZTQh6/Bhue/e/OSIQBaEl0P5AsS5nJ6eLklJSbJp40bZmLhRtm3dKil79qgxfESuF9HvV2JkcebMWW1qmIggdsEivSMTSEs/oInB3mbipBjZvn1HkRydaC6zvWYOfhCPTFe/x2jNhnx97G5qaUBs5IHoBW6q3RRFaHPmLZCENetkf1p67pdMWDdmxiwZr/qkX1+BBCnoUxQQX9+jJiLXau8f+Wf8JGXabc0Th+ceIIZt6nmtiFulTTuuxTqG5xkzfabOYVm7boPsTd2nCaUoz/aXMWOkgiGhCGIYPHBg7mrJZUuXah+FnVTKq8nDbnNZhfRNnVPEt3zZMpkfGysLFyzII/Nj52uTINj7S09LkzmzZ+frb9HChbrPkyc9IX2Ievv27brtIm+bxarNhHHj5J7GTfLcZ+79Km2r40MPy8zpM2TxokX6mAXz50vs3FjZvW' +
                'uX7rcg8J2fUd9bfHy8jPnpJxn4ygDp9HBHadqwkdSpUVM7mhsqs5CQ7DO9esnHH3wo02Ji9LMojPO0xMiCQWsNVLsk7diZO9h52xFWtbfh2BVxK4vExJnq7QwRma4D84e393J1jqmK1DCFfCcXwv/HTZisJy73AwHy0H2X1/sK7VevXluoL8YC55gzb77xmrnGJUtX5E7E69dz5HBWlqxKWKPvc5z63LoP+7H8DeFz7mdu7ELZuGmLngDBJgBlZGTo/ThNDsx6tWrrSWz1CSH36tHT6ATFdzHmp591u2DBIqtmTZpItYqV9STxFUKRnyszKNh8hV9/GatMqLL5+kOaNGioC+uC7Oxseev11/X11/J+Xqt6DalRpapRi7KEPArdtlp1/ZP2lVQfTOqCgBYxa+YMvWakYd36+tmzjJ2f+IggY4T/86zJaeFzrpGM0M8++USZSTfmXSAoEbJgkprSuhmsCxYuVjd+Y7EYtm/C6nX52iL0cUyZA4UFb1DeqKa+Z8yaq8X0mUnmzJ0vJ7zJRKnK1p46zZy2zjVjvhQG19W/NWvXG304yHRFCIe8b2LMiaTknfmW+gcjkMZs3mx79gZFcIT6TDUYGKzPP/OsnLQl1U2aOFFPYLt2we/dnuiiVeZgQTWuRvXr5yY12fv9748+DposIK7b/3VLvv6QxvUbyJqE1bodZDF40Kv57idY4XiuH2evP2DSDejXX5OMdZy9L39Ce0isTctWun7GpQBfwMVOFkx+pzcvsnOXx1dhAaZL2ZuqB669LSr3zl27g37zWdi2bYex32CFPpiYVlFhyGC2Ig9TWyb6juRdhbpmqpw7ZblyDRs2btaq9bVrOUo7Sw7JvUHg9ANJBTK5cFo+9kjHfJOUAVmtchWlZk/3trwBtItHlQpu0i7q1qolM2fMCPp5sWjrnkaNjWSB8CYtjGbhRBZoFlThBtkXsuXN1143tiuMQGwm8F3HrVihfUMmLS5YsUgDx/TRADYvKnaywCnnpFXgE6BEvB34Aa' +
                'wSe76i1e5lN9TuYMEEsPdpFz1ZJk/Tavz0mXP025trIYnMUtsXqOv2XToPIfrrG19HsNd8QbE91cI4p70//jY3doGc9vp5KBLk5A+yxPpsaszMXP+FvQ3C3/Hj4MsoaHIxodmbk/UL9oHIpKUM3CmvXW/H77/+5rjQbED//kE/L8wQbPVIJwsm8H9/+JHu1455c+boezSRrF3oxxLT55ZYnw8eOEhvnegPxUoWfDnxDqFQBnfyLvMbFw8+2oiT+k10ojBYYSiy4yt8NldNbByDODkzMjIlXf1M3Zem/Srxq1ZrAklJyV9hGVMER6mpXyYn/QQDNCgnTYHJjJMVnD+fret+OD0rhPPjY0H74Dp37UnRNU5NvpCpykxj3U4gzsBzZ89KjyefzDcAkSqKCDA3nHAo85C0bdUq33EMXpxyK+NXelsGhlIlC2WGvP7qYGO7wsgHw0fofn2xIDZW6tfxFD02HYPkEkQ5pdUpM6+G0uzQHO4qe8OHYToO4TPS9ElvcEKxkgWRDUwH38FoCW9bnHdOYPk6zkT7cQzurWoyXwvSs33lylVZtHiZTLD15ytoLf6uiQlEKPWyYXNaojmx8xc5ktGqhLVaAwkEXAOkZeqLv61WWowVkt2jnpO9ja9AbhCPyQdBBGTT5i0yQ7Wx2uKvCBTLlixVZkNt4+Dr2vkJv28qJi7qNk4++7EM3OHvvudtGRhKmyxwcOoJWqWqVFeif3onq+l4hHunjXUM/6ePj97/QPdrgehImxYt/U52tLQO7dvL0LffUdf9i8yYPkOvuaEOBjkuvZ97XhoosvF3PTg/f/z+B0d/VbGRBWokbzzTgIcEtO8hx9kuJS9gSoxzBS3eqMHg7DmiLM6TGZ9DUZyngCxTE8EhOETJ5SgIENKGxM3O/Sht4Li3YhJa2foNGx3vCc0EDaIg+x/fCFEgHMDB+ArIEzCpxAz4n378sUDtZM3q1cYwKhO+aaPGsjEx8ArvpUkWTC7yGqjhMWvmTD1J586eLb/8PEa3Mx' +
                '3Pc2NyTxg/XpsXHIevhtBm0vbtul/ANQ8eNMiRKOgHEmCHdUjFKZeCKBd7qJI1ynFO/TVu0EDdi7mcZbGQBQMOJ6XJOcfAJq/irJ83OMhWZLM8Lt6oXvMmhEyCAUlVVo6FvT+EZLCiJihhapj8M8ikqdNkVwDOWcK3Tk7NiVNi8pgIaCqrVq91vCd8Lbt3pxR4Tj7H6RiI6WEhPi5OD1L75GQQsr9FILkCF7IvyCt9+xkjKbx1meCBamOlSRZO2L9vX+5KUrvgoCRSdPqU/wV0CatWGbUvBKIg4W3RwkVq7Ab2nFiwNmzou8b+EL6/555+xts6L4qFLJjoC5XKbxrATH5MjECQlJRsJAsmEz6EYAY3GZaQjMkMIdyYlVX0tFtyQMh7ME1e7gO/gb/Bj69m8RLzc6PPpapvlvdbwBxauWq1I1noiEnipqDCoIEAchnY/xWjVoF9/N47QwP+bmbPmqUng/1Nx+/t2rQJeAeucCSLPYGsDTnu/NK7fPmS9Oj2pPE5I/h2YufN87YOHORoQNJOJiAhWUjKjmIhC+xepwgIWYOYBIFAJ1EZ8gboB7U5mC9/n86FyB9h0de0aImu3FVUMIk2bdma7xye83hIiXRrJ5Cp6aSNkR9i5VRYyLmWo6MwTmSBzJw1V1JDvKXC+nXrpLlh414mKlvsBbMfJ0Von+reXScM+faF1KhaVf7648+AiCccyWK30iSLspBs86ZNjkThCXl+pDXCwgCzqU1LZz/IK/36eVveQMjJgknH29E0gHnTbVfaQkFqsQXCk+x7au+HvnGQstw9UCTv3OU4EQkTBqruFgTWrxjT1ZWgXWDumO7fc6/mUCnCal3TpEHD8kcWCCSVqDQMU5g6WOBY/eyTT7UzzD7A+Bv1GILF/PnzdXqyvT+EJK1AwqhhSRZFWHXKc/76q6/kbsNkZoK3vKdZUD4dO9CCPxgxwkgW/O2+tm0lU2njvgg5WZCA5BRCtPINGPREMwoUpT7jwDP1hUAAgYJUZlMfyM4Ac/' +
                'EDAaaEieAQJrVnHUx+fw1RCadJ79HGzBP91Okz+rkWRBh8Tho9Pg/eRoESth1pSkNr6zABSMJ6560hShv4Q8b+8kvBMmaMzrf45OOPtUpt749BC4mw3qMgRBtZEGFhX1jTsfh4yIvILiL5k4bf0MHvRIaq3RQJKVmQychkcBq4RByYFEzcQIS2i5cuN/bFWzouPkEuB6ARQE5OSVMsECNxLFTIuZ6jK5I7PQO0G5y/vpOVRV+8/U3HYM6RG+EPe1V/3EdBhMEz4/yQGdGoQM1BXzDJnRxuqMbVK1f2hAArVtbhvIKEyEn1SlX8OvGYVAWtmIw2siDl3bScH4EsWDhWVOgd0B540GjqsFYlZupUb0sPQkYWTMjtSTuMqr4lmCGFEVNfTAzs8UCiIgwSiMXUB7kFR0NcgIRcDPu5fAWnpGVrXlLXphfZGdoxuVnlWpCDknRv0uadCMckPFeIPTV1nzLBAltGzw5jOB2dJmRxCG85HG4L5y/wXoUZ0UYWRFKo8WE/judBXsbMENQtJZxKTQ2naNSvY8d6W3oQMrIg9ZjBZxqYxSVMDB0VKUClxlZfZIgycDyrLQsKXwULJh8aEZPdfk6EBWtWTgeOVydnMEvLWYUbCFh0lqbeFIuWLHUkWLtYxLJq9ZqAckB+U4OnktIeGLD2wVWcAgHgvffnzIs2sqAGBX4J+3EV7iynMzlZ1l5UkK3Z9+WXpazBuYyvhAQtX4SMLFC9Ax2koZQV8asK9AiTqYhdbz+WybJ4yfKQOP7swHRwyl7lORE+vnTpspHEEDQ0kqSCBY5S0rrxT5DbYRGCP6EN7Yk+OeGw+uyRBzuUOFFYwuQkCuOEAsni00+jgiy4P/JbQkIWZ85K/759jZEovucfRn3vbelBSMji+ImTMnuOueZCccvM2fPkSAGmCAvTps80RyhWJtwwCUIJNIIZs+Y4PhNIguxKUzgXiV+VoAZ34SI0+EPwH+HMhAQm6wI/BX83M2crs84weDExJ06YkLsk2jSwQimmcy' +
                'Bfff6FXHUwmaKNLPbv3y+tmrfIdxzPp2aVajJr5ixvy8KDBK3nnnnG0QzBAe2LIpMFA8mpFB7CWxQ1u6ji5AshJdwqyecEysiZJiUrSYm2hDppCRD6WrN2g99J6vQZZkphF8vZwZoVfElz583360+yhCJA9jAytu1T3XvkG1BIxfIVdB2JVs1a6L0uCi1N79FFfVlmXqlCfmcnJNC6RUvZl2pO0kpO9r9EnXUowb4U2NXckSwaFi9ZsKnyA/fd73gs6z+KikOZmfKYYZd7BL/I5EmTvC09KDJZMBGdisawOhJnHs63HTt2Fl6Sd8na9RsczRwqQ/nLk2CFpulY/rZ12408/FBj//60gCaor+hr2p7k7SE0QNOgpGDipi16yb3pvJZAqvY1MnNnzzHmQfCWa3HPPTJ/3jzZrp4j1b0LK5s3bdZ9LF+2XB683zxJytx6m96V3OShIlsSwnEiixHDhgW17J2X4A+jRskdt9xq7K9po0ayceNGb2szikIWXGvv556Tu8vmPxazYcibb+pciaIAsjMRLN8roWxqZ/iiSGTBG3nt2vXGiYhzj3oMsDmDlYdfFMEZ4+R3mDVnni5AawLnTt65O99xCBrLniBWWQYLnL6mEoFOMn6ix4fiG1YNJegXX4q/qAnf5a7dN9LxGZB9XnzJ+PYhVDrkjTeDVu/9gTE18uuvjaFUQnxoH4cP5/etpO5N1bUmTWFABn//Pn2UjR54xTIraQmCsveHNGvSVHYojc0fikIWaKajvvvOaJYxuUma2qnMzMKCl+u3X39jJFfO2bZlK12D1BdFIgvCloQvTYOOOpaBrgEJBNxcwuq1xnMxwMk1MAGioaCtKTTJWzQt7YC3ZejBPilO12wSwrj2lO5AwAQLhmAIx/ojC5zVFmLnztO+CtOgrVuzliSszL+GoKhYs3qNduKZzol9jf/Efr8HMw5Kl8cedyQLFreZSMYJqOhdHu9sJEmEyYRfwR+KQhZg27ZtjkvKIdMfv//er0btDykpKfLQAw' +
                '8YnzHy4vMveFveQJHIYpVDrUyE2hCBJEwFA6eUbbQYTBHTG46JpCeH7RiEtOxMNSiKE7zJ0WDs5zYJi74gt2CAxoXPKM1bDCcQbE9iU2rnyNWO5N26HQuOBvR/xegAY1LqVZOnQ7/t4IVsT01LJy/944920n4UX3Adg14Z4GiGcL1U0A4UmEOmCmCWPNmlqzLXnCc6KCpZMJ67d+1mJECknSLATZvMy8n9AYL58P33jSn7PF8SsuYo09OOQpPFgYxMbf+a3lC8sfftD3zwBorDWUe0x95+Tn4nKmJaK4I6t2TpciNZcEyoE7LswAyjloXTmxzhM8wV/ArBYH96ui6vRx/4jSivVxAgTxbhOV0PJorlMGYZOjF9+4BCmMgLFyzU7YoDrKakQrbpzYdGQ9l8u3Yx6ttvHd/ETDgchqdPFZxPclyZtC8897yxH0uGvftegSH3opIFiFu+3JEskE4PP6J3YA8G1BqpoQjB1B/bOXTu9Ji3ZV4UiiyYgHjNTQOOvy1RrOy7lDpU4LxscWg6L+ozqzbtyjgsSsVq0zEs3CIHo7ixfn1ivnPbJdCcCiYIzxaHr13LIuWb6A6D2KSh8PxIYqOd73G+Mm3mbB2K5q02/L1hRt9BOaVp8GYtTBXuQOFZG9HLaAYweVgbYVfBFy9erLcesLfPFUU8/fr00TkjrD2yg2d7+uQpHTkxvXV9Zfq0ad6jnBEKssB38lLvF40LyhA0Kap0U7UMp6iTOcp3fyQrS94fNkxrTE7mB5XPKJJjQqHIgl2wps0wl5xnAJNCXFxgvYjpvEiCsnXtuQkX1ZvdyQxYtjxOD8riBms/TEvtEUgsQZlQfJmBgPwJsk6tY/P05f3JGhxME0ygTO/OZZQNIK3cn0nE8Wy2xCTcl5qqowumQVWhbFmZNDFvWC3UYNCP/2ecXmeS//zltIORCIov8EmQvmxvb5eOHR6Sn0aP1gup1q9bLxvWr5e4FXF6AVy3J57Q2onTZGKSo6GkB2D2hYIsAMvJWdjldE' +
                '0QRs1q1bQj+p+//5YVShtZv3adbNiwQVatXClzZs2SLz77TFcFp71TP/ydqJFTiDlostBahUNpf3wHy9VnofZV+IIsQ5KdTOenbqV9cRS2raktokOuhUx8CgY4DJ1CqJhCJLUFCiYyi+zGTXAu0IugaXFOTELE6fx5RJEP5MJEHfn1N8ZBxd86PfKI3liouMHep+3vbWe8jjtvvU1vHOQLrntB7HypXiU/wdiFt2vtGjWlWeMm0lyRIhqJPx8FwnVAJNNsC6ycECqyAJMnTvRrjiBcG4WSCXMTEuW+GtStqwm3IE0Jv1SPbt38bgkQNFngraecvGmwYe+mpxdfdAGgXpP9aDIrmBSp+/JqNWhBTms01m1I1DZ8cYJyfmSPOplO5HkE69S8qq6ZCuQBEUCAwvVBQjwPnL6tmjc3OgsZdN9+M7LYnxtArWb5ummgc23keCTvyBu+hExJU2Zim0jGLoG201K2vLw/fETAyV2hJAvw29hfpVqlSiG/L9pRN8QeKrUjKLLgLczyZgYWNSsssQbcylXqTR2gOl0UMKhvDHJfmaprUvpOPiIoTsVvN281F5QJFbD7l62IN55b56EsXlpoMwibm0Vo7C7v+T7yk1EgMmEiVbhmabOFPtEcv1QqKwuWmJDWoEP4nWSkgvILQgkKvJBN6HsdljDhvvnyq3wmXHb2eRk18lsd8i3obRyI0AdL6YcOeVtX9goUoSYL7hMzAxPMFKEKVrgvfFL9+/YrMAwMgiILsil5m8WoNzhl3izBYUYxXGzjkgD7eZKIhSaR5zqUPc7ksUwRVmKy/sKjWRAq9AhvdCYXmaVODqGign7JM3F6+3OtqPxFBYlfkKe1B4gWw/l8hTY8E7ZcJMRN2NUqVpy6d68uO4+3HHXWEiYeIbXh772Xz7FYnMBZ+9qgV7UqXbt6jXzX9ICyw011OtFKJk2YqDdbJrEKcjFNGH/CMUwoNjf+efRPQS84ZC9RnI+mviGLXj16yLEgC0/zclsZF6/T7yuqfkzaX0' +
                'HCfUE2lEb8duTIfNtLOiEosqDoLSnM+5W6on96/5+yd5+uLXktp/hVU4AKTMEaHHi516J+8jt7lViRGCYs1bLJ4CQcaAmFX/ibtaNXcYAoywxDmNcSHLWhJCoWy21LShY2j54Xu1DnkEBIEDmExRoayJUkOjQa9h7heVHZywLXw3aEM6ZPk6mTp8j0mJhciZkyRabFTNOflzQo0jJx/IQ814NMi5mqr/Oon6gMa0befWeoru5FsR0rumNpJ5pEfP+vPqMNpg8Lud4YPFgS16/39hYcdiqyoP6HLvCjiwJZ4in207N79wJzNZyAb4GkrE6PdNT905/lmDWJdV/4ZZo3bSpvvPa631W8JgTts3BRMK4pdXFFfIKj+YMpd8bPzk9FAcveyTeB2Mm72JOSqkPKhGbTDxzQkRk0L6dtD4pL0ypN4GMgosAq0rfeeEO6dX5CWjZrLo3q1Zd6tevocGGDuvX0m5aEL3YXG/3DD7Ju7boiRcvI6aDa1D9//1vG//OPj4zTKzop4R/opsROoEgOGa2U9+/5ZHe92I77ql+7ttSrVUev8bDuCw2N+1q7Zk2h7sslixAD02en0l5MJIHwtmcSl8Sk5By+crMDjRTzJEOR5ubNm2XVqlWyfPlyWbZ0qayMj5fEDRu07U4GaaCh7IKA2UAVdv3TR7gWfoYC9IN/7LDS7lmUR7iU8OlydV/8PzExUfYpUoEginJfLlmEGFScclqFi0nCWpGSiCS4cBFquGQRQqDar15jLgwMUZAHciqAdGMXLsIRLlmEEOyuTqTFRBY4GfEduHARqXDJIkTA/GBRl1P0g1qhJRlydOEi1HDJIgTAacSuZk5EQcgyK6v4Fl25cFEScMkiBDhwIMPPloVTZdv2pJB5vl24KB2I/H/0r/5P3IjTlgAAAABJRU5ErkJggg==',
                alignment: 'left',
              }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          style: 'title',
          text: 'CERTIFICADO DE AUTOMÓVIL FLOTA'
        },
        {
          style: 'title',
          text: ' '
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'Anexos Adheridos:', bold: true, border: [true, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'Condiciones Generales de Arys Auto - Condiciones Particulares - ANEXO DE ASISTENCIA VIAL - COBERTURA', alignment: 'justify', margin: [10, 0, 0, 0],border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'AMPLIA - ANEXO DE ASISTENCIA VIAL PERDIDA TOTAL - ANEXO DE ASISTENCIA VIAL RCV - ANEXO DE DEFENSA PENAL Y', alignment: 'justify', margin: [10, 0, 0, 0], border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'ASISTENCIA LEGAL COBERTURA AMPLIA - ANEXO DE DEFENSA PENAL Y ASISTENCIA LEGAL PERDIDA TOTAL - ANEXO DE', alignment: 'justify', margin: [10, 0, 0, 0], border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'INDEMNIZACION DIARIA POR ROBO COBERTURA AMPLIA - ANEXO DE INDEMNIZACION DIARIA POR ROBO PERDIDA TOTAL - ANEXO', alignment: 'justify', margin: [10, 0, 0, 0], border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DE RIESGOS CATASTROFICOS COBERTURA AMPLIA - ANEXO DE RIESGOS CATASTROFICOS PERDIDA TOTAL - ANEXO EXCESO DE', alignment: 'justify', margin: [10, 0, 0, 0], border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'LIMITE RCV - ANEXO EXCESO DE LIMITE RCV COBERTURA AMPLIA. - ANEXO EXCESO DE LIMITE RCV PERDIDA TOTAL', alignment: 'justify', margin: [10, 0, 0, 0], border: [true, false, true, false]}]
            ]
          }
        },
        { 
          style: 'title',
          table: {
            widths: ['*'],
            body: [
              [{text: 'PRODUCTORES', fillColor: '#D4D3D3' }]
            ]
          }
        },
        { 
          style: 'data',
          table: {
            widths: ['*', '*', '*'],
            body: [
              [{text: [{text: 'Nombres y apellidos\n', bold: true}, {text: this.detail_form.get('xnombrecorredor').value}], border: [true, false, false, false]}, {text: [{text: 'Código Nro.\n', bold: true}, {text: this.detail_form.get('ccorredor').value}], alignment: 'center', border: [false, false, false, false]}, {text: [{text: '% de Participación\n', bold: true}, {text: '100%'}], alignment: 'center', border: [false, false, true, false]}]
            ]
          }
        },
        { 
          style: 'title',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DECLARACIONES', fillColor: '#D4D3D3' }]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'El TOMADOR y el BENEFICIARIO declaran que han recibido en este acto las Condiciones Generales y Particulares de la Póliza, el CUADRO', alignment: 'justify', border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'RECIBO DE LA PÓLIZA, así como los Anexos emitidos hasta este momento debidamente firmados por las partes.', alignment: 'justify', border: [true, false, true, false]}]
            ]
          }
        },
        { 
          style: 'title',
          table: {
            widths: ['*'],
            body: [
              [{text: 'AUTORIZACIÓN Y COMPROMISO', fillColor: '#D4D3D3' }]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'Autorizo a las Compañías o Instituciones, para suministrar a Arys Auto , todos los datos que posean antes o después del siniestro,', alignment: 'justify', border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'asimismo autorizo a Arys Auto ,a rechazar cualquier información relacionada con el riesgo y verificar los datos de este CUADRO', alignment: 'justify', border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'RECIBO DE LA PÓLIZA', alignment: 'justify', border: [true, false, true, true]}]
            ]
          }
        },
        {
          fontSize: 8.5,
          table: {
            widths: [120, '*', 190],
            body: [
              [{text: [{text: 'Para constancia se firma en:\n\nLugar y Fecha:\n\n'}, {text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [true, false, false, false]}, {text: [{text: `EL TOMADOR\n\nNombre / Razón Social: ${this.xnombrecliente}\n\nC.I./R.I.F. No.: ${this.xdocidentidadcliente}`}], border: [true, false, false, false]}, {text: [{text: `ASEGURADO\n\nNombre / Razón Social: ${this.detail_form.get('xnombrepropietario').value} ${this.detail_form.get('xapellidopropietario').value}\n\nC.I./R.I.F. No.: ${this.detail_form.get('xdocidentidadpropietario').value}`}], border: [true, false, true, false]} ],
              [{text: [{text: ' '}], border:[true, false, true, true]}, {text: [{text: 'Firma: '}, {text: '____________________________________', bold: true}], margin: [0, 20, 10, 5], border:[false, false, true, true]} ,  {text: [{text: 'Firma: '}, {text: '____________________________________', bold: true}], margin: [0, 20, 10, 5], border:[false, false, true, true]} ]
            ]
          }
        },
        {
          fontSize: 8.5,
          table: {
            widths: [120, '*', 120],
            body: [
              [{text: ' ', margin: [0, 20, 0, 0], border:[true, false, false, false]}, {text: [{text: `Por Arys Auto. Representante\n\nNombre y Apellido: Pedro F. Villasmil\n\n`}], margin: [0, 20, 0, 0], border:[false, false, false, false]}, {text: ' ', margin: [0, 20, 0, 0], border:[false, false, true, false]}],
              [{text: ' ', border:[true, false, false, false]}, 
              { //La imagen está en formato base 64, y se dividio de esta forma para evitar errores por la longitud del string, en el futuro se buscará obtener la imagen desde el backend
                width: 140,
                height: 60,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQsAAAB1CAYAAABZCsRXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAADI8SURBVHhe7Z2Hf1TF++/vP3DL73fv72tDQKT3DtIRRVERRUBArKgUAbGhKGD72RVFRRH7VzqhQ+glgVBDD6GEQEIIhF5DD8+d9+yesDmZs9lNNsnucj68nldIds6csjOf87R55n+ICxcuXAQAlyxcuHAREFyycOHCRUBwycKFCxcBwSULFy5cBASXLFy4cBEQXLKIAuTk5Mjly5flwoULcu7cOTl9+rScPHFCjh87JkePHJGsrCzJOnxYDh86JIdsclj9/Yj6/OjRo7r9yZMn9fH0Q3/0e+3aNe+ZXNzMcMkiAnH+/HlJ2bNH4uPiZHpMjIz+4UcZNnSoDOjXX57u+ZQ8+vAj0rZVa2nSoKHUqlZDqtxdUSqWLy/l7igjd956m5Yy/Lztdrm7XHmpVqmy1KlZU7e/t3UbdfzD0qt7D+nfp6+8M2SIfPPVVzL+n3GycMEC2ZiYKJmZmXL16lXv1bi4WeCSRQTg1KlTsmD+fPnx++/l1QED5ckuXeSB++6Xpg0bSc1q1aRqxUqKDO7SwuQPlVh9Vq5wt1SvXEXq164jrZu30GTS88nu8vabb8kvP4+RJYsXy4njJ7xX6yJa4ZJFmOHSxYvaDNiyeYv8NnasvNy7tyKG+6Rx/QZ6wlYoW07uurOs/omYJnlxinV+hN9rVK2qSat9u3by3DPPyA+jRsnK+Hg5psyaC9nZrgkTRXDJIgxw5swZSU7eIfNjY2XYu+9Jp46Pyj2NGkvNqtX0pCxf5s5cgrBP3tKWXPIo4yEQCK2xMmcebN9eBiqz6N9//SXr162TjIwMuZbjEkckwyWLUsSePXtk6uQpMnjQq3Jv69ZSt2YtrfKbJmWoxNJI7KInvI/4fmbqJxCpdFcFTXhoHk926S' +
                'pffPa5LFm0WA4fOux9Ai4iCS5ZlCBQyc+dPSsrli+XTz7+WB5+sIN+E1uT0zThChLfCY1/oVKFCtqhiR8Dx2WNKlWlVrXqmogaKVOmedOm0qZFS2nXuo3c3/Zeua9NW23mPNKhgzymNJrHO3WSRx96WB5q/4Dci5NUTXSOpR/6o29IwH5uf0Ib7pH/4/fAeYq5snbNGu2sveY6SyMCLlmUAC5euiS7du7y+CBe6K39D0xsohOBTjY94ZQ5wjH8raqatLWr11BvbSIYraVr5yekX5++Oiry5eef6wgJJsD0mGnKvJkvy5YulZVx8bJu7VrZmLhRtm7ZItu3bZNtW7fJjqQk2bVrl+xLTZX9+/ZJyp4U2ZmcLJs3bZaEVatk6ZKlMmPaNPn91990ZOSdt4ZIrx49NeE0qtdAalSumns/BREfn2NWVb77bmnepKmOuPz6y1hJ3pEsFy9c8D4xF+EIlyyKERcvXtT2+ohhw+XB+9trLYJJFShBWBOLN3ntGjWlVfMWepKOeG+Y/Dz6J5kza5asTlitJ316WpqOmlxSxHTlyhUd2kSTIQfj+vXreSQYWMfQD/3R98ULF3WORtL2JO3MnDBunHz0wYfSo9uT0rRRY01kgWhLfM7zqKaeywPt7pOhQ96WuBUrJPt8tvfsLsIJLlmEGEwsohkr4+Lkjddel5b3NJOyt98R0MThJ8SAyo+Ds9PDj6g+XpOfRo/W4Uk0AJKrIIRwA+QEgZCHQU4GYVVMmYZ162nTxX6/duH+eU7kevTr00c7e0kUg6RchAdcsgghjh07JguUyt/v5T7a1sdsQDMwTQ6Ez1Dd8S9AKl0e76zfrv/+979l08aNknEgQ0dKgtUGwgFnz56VtP37tabw+aefSa+ePaWFukfIkPt2Ik80EkgDkkFTmTBuvDaNIvEZRBtcsggBsrOzZfHChfLCs89pJ6A/U4O/a9NCtWnbspW8+PwL8uMPP8j69ev1BCPPItpyE0gZ5xnh0MSf0q3zE1JHmVX+SMP6O0' +
                'SKI/iP336TA+np3h5dlAZcsigCsN83qEk+9O23tartpEUw8CEQwqK8XV/q3Vt+HPW9JG7YIDmFJgb1pr2uzJHryr6/HlnkQsJWzNSp8urAQTojtKBwcQWv76bL44/LxAkT9FoXV9MoebhkUUgQOfhgxAhp3vQeuf1ft+R7Q/K7RRL1atWWZ57qJX/+/ocmF8KFRcblHWrWvSaS9azIqW9Erh33fhA5wM+BuUU0pNMjHaWK0iKs5+b7LC3BPOHnU917yNQpU7Qm5qLk4JJFkECl/vvPP3XYj4FrGtj8Ddu8SYMG8t8ffaTDktmKIEL2Nsw5JXLoUcVY/1fJ/xPZf6cijK+UhnHF2yCygBMTAp07Z47O9ahYzn/EiM8wT7o+3llHm1CyXBQ/XLIIEJBE0vbt0qtHDylXJn9+BL8j2OIdOzyktIjf5fRpNamLA9nLRNKreIhi3788cqijh0QiHBAquSFEUkgm80caOEMrla8gX372hWualABcsggABw4ckJFffy2N6tXP55dgMLPUu2mjRvLG4NdkQWysrgVRfMgROT1KaRNlFEn81w2yONhOmSLRs/ITTWNaTIw8+/TT+hlbyWh24TO+kw73t9f+DBypLooHLlkUAOL9jyvVGLXXPlCxoatXqapNjc2bNmmSKPa32/XLIsffuUESlmS2Vzxy0tsoOpBzLUcX75kze7Y80elxueOWW/N9B76CJtL3pZd1spiL0MMlCweQDfnJRx/rtQyou9aA5E2G07JBnbo67ZmIxqWLJZgkdf2iyLGBiiB8TBBNFg9GHVn44mBGhoz5+WdpqLQ7oidO5gl/J/2dUOvZM64DNJRwycIGNIOlS5ZItye65BmU/EQVJsPwtYGDZM3qNXL+XAiiGsECsjja/6YjC0ComizW94cP1yahP9OE1a4kx23ZvNn1ZYQILln4gDRtFkqRPeg7+LCJyaPo37evXgtxRrUrNVy/IHLkpfxkoR2cpXhdJQj8EnEr4uT5Z5/VhOGkZaABkhmLlhGOKf' +
                'KRBpcsFHjz7Nm9R6+AtGsT+Co6d3pMpx2HJD+iqLiuroHcCjtZHH5CkcUZb6ObA6TXk/1KGBtisJOF9R2iZbytTMbU1FTvkS4Kg5ueLKilMG/uXF3DgYGVK3eW1UVvR6vBSDQk53qYLGiCEA73sJHFLYpAnlKf3Xw2Oolda5VJ+HLvFx2zaK3vtFPHjjJ71iy5esWtn1EY3NRkgTpL2jWVrX0HFqs+eRNt3bI1/FY9kktxuIsiCJ+wKWRxpI/6LAw0n1ICDukxP42Wxg0a5HFI2wWH9Zeff6G3PHARHG5asiCJ5+233spdlwBJoMpSNZv4ftjauKR145/IQxa3Kp38dY8/4yYG5iSrXB9/tJP+LvlO7WSh/6Y+e+mF3pKUlOQ6P4PATUkWVIDq3rWbHjgIqmvdGjXl3Xfekb0pKd5WYYprR0UyO9jI4jaR4++r2RKtTjw1oUll1wvnFCHmnPOIw/0eOJAuH454X1cSc9IySKRr3+4+vcYEx7aLgnHTkUV8XLxeGm4NGhKr2Fhn2tQYXdkq7HHtsMjBB21kcbvIyS/U5LnsbRQhYLLjg7mq7unKXpHLSSIX14lcWKFsxIUi56aKnPlD5PSP6v6+FDnxkZLhSot607OI7sSHqs1kdXyat8MboJrXxPETpFWz5o4hVgQ/x6sDBmi/1fp16yV5xw5JS0vTzlPM1Os5ruZh4aYhC9Z2zJ45SxettZxgVStV1vUkiN1HDK4eVGRxX16y2K/I4vTP6sNwWKrO5MLPo64F8rquNICrGSKXNisSWCpyfrbI2b885HZ8iMjRviKHn1Takrqn9HrqXu4SSf0PJf9Lyf/2yv/xCn9H/tMr/F/9/WB71fcqfXY7Vq9O0EWInaIlCOOB7FAW/7Vu1kKbMZQRoNrX1198qUmHOqbUHMHZTaYujlVdsvAmWsV2U5AFKz6pJl1dkQMDA9W0dvXqMvKbbyJvmTNv0YNtbGRxh5qA49SHpTRwqadBXY0rqWrSLvdcC5rA0QGKCHqKHHpYJK' +
                'OpSFplda23eiZ46v9UYhGBlwB0hMdXYwpQIJaDbY0aBjiYcVAGDxqktQh/zk9MUj5HE0HjxFSBRPg/xxKiJYzOC4YUf0gkMTFRj6Gbofxf1JMFm/vyxfLWsAYEIdFlS5ZGpnMLdf1gKzVJfMmijHpjz/I2KGZcv6pEmQ9MzOxFSqP5QeTIC+qaminNoKoihArqeu5U13Wb9xotArDEZ5KHTFS/nPfcJO9F5geawLfq5cALQzs5bUQRiFg+LggFTYUCzGyTgBn77tvvyOKFi+TE8eNRG5qNarIgnDZ0yBC581bPBsB8wbwZkpOTvS0iEFdS1MRs4Zkg1mRhcmYv8TYIJZTGQFboNWX6XN6iJuMUpS28qs7fUk1OZS7oa4AMqKtRWCLguKKKOn96ffVmWOa9bmegDbDpkTX5fcmgsEI/lsbapGFDeWPwYFm2dJmOuEWEHyxARC1ZULpt0CsD9BeIVKlYUYa88aZkHlQDP5JxWRFdxj3eSeKdcJDFxZXeBkVEjjInqMJ1fq5i25FKa3hOna+5Okd5da5bvOcNlhwUoWgfg2V+KLNjf1k1wauLHGiiyOdeTzj4cDd1vqeVvOjJGznS1ysvK1HXkdVDtXvM49/IUJoMx2a09vg8tFYRmM9mzerVMmjAALm/XTu9IBATQ5sc/7old3d5TBEIIFhCYaxxDH2yvcHHH3yotVheXJGOqCQLKmL3eemlXKdWjarVZMxPP4dHunZRcWmTZ5L4Tta0u9XfN3gbFAJkfhJ9OPmZmpBqsmLmoNYTZSGHQ5+nsOSgJK2S6vMBNeH7qXN8qr6g39T55nmckjg+L+9WdsIBdR3HlJzx+D9YMJcr3nAp9TquZirtao86bpv3WEWeuo5HcM5dvb/sjh16rQ/7r/z1558y6tvv5IMR78srfftJ186d9c5tmBqQh0UgkIGdIPwJeTwQEnU5/v7zr4jWNKKOLI4rmxGiwCkFw9eqXl0mKNWTaEhU4GKCIgulcudOXvXzQB01abZ7GxSEHM8EJF' +
                'x5fpp6YG+pN/VDnre8NinsE9+fcA3e6yAis7+ch7gyFTGQJHZ6tIeELiWqCb7PQwRhHj24dvWa1gKoJL5z505Zt26dxM6bp5fHjxg2TJ7q0UPq1a6ja2dYNU4C0T5oU7NqVenetatMi5mmt7GMNEQVWRw5ckTHzPlyUCHZq3P5smVRlKWn7uPCYjWxa/tMWDXB8WHg+PQHUsHxd+B3OIbfQan+RCf0ZIckLPLxJ7RRJgjaAr+nVVVmgDo361JOfqz6VuRzaaPH+YkmEEVhRcYQeReZmZmSlLRdFi1cKN9/N0pHRhhnLBFA+2Dc2YnCEggDzQSnKC+0hIQE7XiNFEQNWZCF99qgV6WSUvv4wh7p8JAOa0VXOq+6F6Ie6dV8JrCa6Jlq4qPGm0COA/4Hkpiw8zVBWKZFoIJZ8R/qZxnVhzKBsnoqcvjEEw0hXJpzVAnl7KLpWfsH4+rypcs6+kFB5onjx8vA/gOktTJdLFIwEUaulC8vzRo3kc8//VRrw5GAqCALiGLoW0P0F4Sws9eOpB3eT6MJyoQ486ea8PgTfCZzWkVvJIB8hyuq2SmP6n/qO6VB3O/TPlAzw8e0SFPElKn6ODrIkz9xZbfqH79CZFYSLy5AHvjEdibvlG9HjpTOjz2ml8YbicIrkAp+tWd7PSPbtm3z9hS+iHiyOH/unPY4W3Uonu31tOzerQZ0VEKRwamv1SS+wza5leCU1OnQSrKe8fgxmOwBmxiYF//p6ftAQ4+jk2hItjJ70Fr0OozoTzwKBTAt2JN2yuRJ8vKLL0rNatWlvEPKuaWFsNnSjOnTvT2EJyKeLEb/+KN2NmF6sPnM3pQCbPeIhiILIhY64ck04fk7YoU4TW18RbXRmZOKKHCaUq7v7HiRi+sVL7CEmwjDzWNahBpoG8ePHZfYubF6bEIKkIMTaVBf9K8//vAeHX6IaLKImTJV79NBSKtr5ydkT9RqFBbUm/30L56og3HyFyQQCHKr6qOslyAGiJybqMyWLap7t8BtcQHnO+' +
                'F7/BQmskAgE/bK/Xn0T2HJ0RFLFtQtoHhuudvLSJfHHte24k2Bi2s9JoaRDExiaQ9KcG4ebO0Ja56f6fU/uARRUmDD661btkjv51/Qyw9MWgaEwfYSv44dG3bO+Ygki32p+3S0g4d9b5s2uoLzTQNCoGQ1WuFLo6A9EMHAB1HBk/HIsm5WfFI8hzwL17woNWCasF6p6t0VHc0SwqtLFi32HhEeiDiyILmK3HsecuP6DWTJ4vB6oCWCq+kiWc95TAkdBrXkNo+DMr2WyKFH1Kh8RxHEDA9BuAg7YJZACk4aRrMmTWX//v3e1qWPiCMLUmbJu69bq5b2Wdy0IDx6broihOEexyQLvE584glvYqpQJMdF2OOfv/+WerVrGwkDX1yv7j3k4sXwKJcYUWSRujdV72mJvffdyJF605mbHrrcnLWWwq1aHWm4ojRl9jXx3YLCV/g7m2yHAyKGLHD2fPHZZ/qBPturly575sJFNIC8jJFff+NYzevhBx6Ug2GwWjpiyCI9LV2Hndq3ayfJOyK4HoULFwawCvaN114zEgYvyMkTJ3pblh4ihiwojTbs3Xdl08ZN3r+4cBFd2JmcrM1sO1mUu/0OnZl84gRL8UsPEUMW1DgkTu3CRbQCU3vq5Mn5yAJhReuG9eu9LUsHEeXgdOEi2nEk64j06NZNR0J8yYLCwRTnuXK59Jz6Llm4cBFGQLv47Zdf5bb/+lcesmDtU/cuXXW5yNKCSxYuXIQZSDSknJ9vKJX/N6pXX/bvK70krbAki3DLiXfhoiSxds1aHfmz512wyGzTptJz8IcdWRw9ekwyMg66hBFloDAMe8xGUhm50sK6tYosmjQ1ksXaNWu8rUoeYUUWDKS4+FUSvypBclyyiCokqO+0Y4eHorgwUeiwYvlyqV2jZn6yqFxZtmzZ4m1V8ggrssg4eFCmTpsp8xcudlO5owgs/hvy5pt6cdQ/f//b1RoLABshlbnltjxEAXHUr1NH9u4tveJOYUMWDKi4uFUyfuIUmTZjth' +
                'w4kOH9xEWkg42nG9Stq8kiHJKLwhns/v7e0Hf1Zke+ZMGzu69NWzl06JC3ZckjbMgiLe2A1iomTo6RCZOmyrr1id5PXEQyeAl88dnneo8N3o78XBkX5/3UhR1kcbZs1kyTgy9ZkHfxdM+ecrwU10SFBVlcunRJ+yogCmT8xKmycNGSqNon8mZFamqqPHj//bn2N2/M1wcPdr9bA8hSpgQDG2T5EgVCBudHH3yoN/ouLYQFWezbnyYx02flkgXC7/zdRWTjp9Gj8yyOgjT4fVPiRm8LFxbYBe3hBzvkIQlLSNKaNWOmt2XpoNTJAq1i2Yp4bXr4kgW/b0h0F41FMthFvFPHjvlSl8lGHPr221GvXeDIxQwzCePe14nP/8eO+UUnY/k+KwSC5e87dpTuXjilThZ7UlJl8tTpeYjCkoWLl8q5aNjM+CbF72N/zTU/7NKkYSNJTo7GjaBugFqbv//2m3w38lsZ9W1e+fyTT3Wlt+zz7OQmknHggA4tm7Y/xCx5ufeLN/eq03PnzsnCRUvzaRWW4PDMOlJ6ufAuCo9DhzKl86Od8jnqLKEC1DdffRXVK4mpu3Jv6za6DKRdINGeT3aXI0r7AntTUqRd27bG51WuTBmZMG68bleaKDWyQEXbvSdFpsTMMBIFMmnKNNm6LcmNy0cY+L6mTJqcu8u4SZgUj3V8NKornpGAxqbJpvvHNHvmqV650Y3UvXvl/nvbGcmiQ/sHJC2t9P13pUYW57OztVZhIglfWbBwiVvHIsLAZsEvPv+8VCyfd9DbBe1i3D/jvEdFH4pKFmgfaCF///lnWLwwS40sdiTvdPRV+AptTpxgKz0XkYKV8fFSu3qNPJPDJNjiTJhTJ095j4wuBEMWmCH3tb03lywgCgpTvz98uHaIhgNKhSyysy/IvPkLHX0VvkKbLVvDf4dpFx7ghxr0yiv5IiD+pLRDgsWFYMgiRZnk7Vq30Z+xYKzFPc1k9A8/yOVL4UEUoFTIYtPmrTLJQAwmgSxmzYnVCSsuwh' +
                '+JGzZIzarVHKMgduFN2vell+X06dPeHqIHwZAF9//n73/obNe/lNlBJme4md8lThYnTp6UOXNjjVqFk6aBo/PwYY/X2EX4AnV50ICBxvAf5OGkbdSvXUdWJyR4e4keBEMWAHK4dvWqXMsJTx9diZJFTs512bxlm5EQiIosXRantQgTaSRu3OTuzhnmYM/ZBnXr5ZsYaA+tm7eQt954Qzs17Z/ztxHDhkfdSuNgySLcUaJkcfbsWZk1e14+IoAcli6Pk1OnTkvcygS98tTeJnbBYnc9QRiDif7xhx8a9724S2kaX3z6md4o5/629+b7HK2jVbPmpVoyrjiwa+cuv2TxdM+n5NixyMkjKlGyIH3bTgIIEY9du/foNokbNxs1C5atZ2YWbf9O1Lzjx0/oRK+jPpJ15IicPHkqj1+E/587f063P0K7Y8eVXXkmX6UnFvZkHMxUE0FJ5qE8gukUispQ9HHo0GHPeWznOJBxULKyjjjatxcvXpJTyh6mAhnXk3nokL7/Y8ePK/I+p/oOjcq7N2WvtG93Xz5fBb83adDIY4Or+2DvFxOhVL7rbr0lZTQh6/Bhue/e/OSIQBaEl0P5AsS5nJ6eLklJSbJp40bZmLhRtm3dKil79qgxfESuF9HvV2JkcebMWW1qmIggdsEivSMTSEs/oInB3mbipBjZvn1HkRydaC6zvWYOfhCPTFe/x2jNhnx97G5qaUBs5IHoBW6q3RRFaHPmLZCENetkf1p67pdMWDdmxiwZr/qkX1+BBCnoUxQQX9+jJiLXau8f+Wf8JGXabc0Th+ceIIZt6nmtiFulTTuuxTqG5xkzfabOYVm7boPsTd2nCaUoz/aXMWOkgiGhCGIYPHBg7mrJZUuXah+FnVTKq8nDbnNZhfRNnVPEt3zZMpkfGysLFyzII/Nj52uTINj7S09LkzmzZ+frb9HChbrPkyc9IX2Ievv27brtIm+bxarNhHHj5J7GTfLcZ+79Km2r40MPy8zpM2TxokX6mAXz50vs3FjZvW' +
                'uX7rcg8J2fUd9bfHy8jPnpJxn4ygDp9HBHadqwkdSpUVM7mhsqs5CQ7DO9esnHH3wo02Ji9LMojPO0xMiCQWsNVLsk7diZO9h52xFWtbfh2BVxK4vExJnq7QwRma4D84e393J1jqmK1DCFfCcXwv/HTZisJy73AwHy0H2X1/sK7VevXluoL8YC55gzb77xmrnGJUtX5E7E69dz5HBWlqxKWKPvc5z63LoP+7H8DeFz7mdu7ELZuGmLngDBJgBlZGTo/ThNDsx6tWrrSWz1CSH36tHT6ATFdzHmp591u2DBIqtmTZpItYqV9STxFUKRnyszKNh8hV9/GatMqLL5+kOaNGioC+uC7Oxseev11/X11/J+Xqt6DalRpapRi7KEPArdtlp1/ZP2lVQfTOqCgBYxa+YMvWakYd36+tmzjJ2f+IggY4T/86zJaeFzrpGM0M8++USZSTfmXSAoEbJgkprSuhmsCxYuVjd+Y7EYtm/C6nX52iL0cUyZA4UFb1DeqKa+Z8yaq8X0mUnmzJ0vJ7zJRKnK1p46zZy2zjVjvhQG19W/NWvXG304yHRFCIe8b2LMiaTknfmW+gcjkMZs3mx79gZFcIT6TDUYGKzPP/OsnLQl1U2aOFFPYLt2we/dnuiiVeZgQTWuRvXr5yY12fv9748+DposIK7b/3VLvv6QxvUbyJqE1bodZDF40Kv57idY4XiuH2evP2DSDejXX5OMdZy9L39Ce0isTctWun7GpQBfwMVOFkx+pzcvsnOXx1dhAaZL2ZuqB669LSr3zl27g37zWdi2bYex32CFPpiYVlFhyGC2Ig9TWyb6juRdhbpmqpw7ZblyDRs2btaq9bVrOUo7Sw7JvUHg9ANJBTK5cFo+9kjHfJOUAVmtchWlZk/3trwBtItHlQpu0i7q1qolM2fMCPp5sWjrnkaNjWSB8CYtjGbhRBZoFlThBtkXsuXN1143tiuMQGwm8F3HrVihfUMmLS5YsUgDx/TRADYvKnaywCnnpFXgE6BEvB34Aa' +
                'wSe76i1e5lN9TuYMEEsPdpFz1ZJk/Tavz0mXP025trIYnMUtsXqOv2XToPIfrrG19HsNd8QbE91cI4p70//jY3doGc9vp5KBLk5A+yxPpsaszMXP+FvQ3C3/Hj4MsoaHIxodmbk/UL9oHIpKUM3CmvXW/H77/+5rjQbED//kE/L8wQbPVIJwsm8H9/+JHu1455c+boezSRrF3oxxLT55ZYnw8eOEhvnegPxUoWfDnxDqFQBnfyLvMbFw8+2oiT+k10ojBYYSiy4yt8NldNbByDODkzMjIlXf1M3Zem/Srxq1ZrAklJyV9hGVMER6mpXyYn/QQDNCgnTYHJjJMVnD+fret+OD0rhPPjY0H74Dp37UnRNU5NvpCpykxj3U4gzsBzZ89KjyefzDcAkSqKCDA3nHAo85C0bdUq33EMXpxyK+NXelsGhlIlC2WGvP7qYGO7wsgHw0fofn2xIDZW6tfxFD02HYPkEkQ5pdUpM6+G0uzQHO4qe8OHYToO4TPS9ElvcEKxkgWRDUwH38FoCW9bnHdOYPk6zkT7cQzurWoyXwvSs33lylVZtHiZTLD15ytoLf6uiQlEKPWyYXNaojmx8xc5ktGqhLVaAwkEXAOkZeqLv61WWowVkt2jnpO9ja9AbhCPyQdBBGTT5i0yQ7Wx2uKvCBTLlixVZkNt4+Dr2vkJv28qJi7qNk4++7EM3OHvvudtGRhKmyxwcOoJWqWqVFeif3onq+l4hHunjXUM/6ePj97/QPdrgehImxYt/U52tLQO7dvL0LffUdf9i8yYPkOvuaEOBjkuvZ97XhoosvF3PTg/f/z+B0d/VbGRBWokbzzTgIcEtO8hx9kuJS9gSoxzBS3eqMHg7DmiLM6TGZ9DUZyngCxTE8EhOETJ5SgIENKGxM3O/Sht4Li3YhJa2foNGx3vCc0EDaIg+x/fCFEgHMDB+ArIEzCpxAz4n378sUDtZM3q1cYwKhO+aaPGsjEx8ArvpUkWTC7yGqjhMWvmTD1J586eLb/8PEa3Mx' +
                '3Pc2NyTxg/XpsXHIevhtBm0vbtul/ANQ8eNMiRKOgHEmCHdUjFKZeCKBd7qJI1ynFO/TVu0EDdi7mcZbGQBQMOJ6XJOcfAJq/irJ83OMhWZLM8Lt6oXvMmhEyCAUlVVo6FvT+EZLCiJihhapj8M8ikqdNkVwDOWcK3Tk7NiVNi8pgIaCqrVq91vCd8Lbt3pxR4Tj7H6RiI6WEhPi5OD1L75GQQsr9FILkCF7IvyCt9+xkjKbx1meCBamOlSRZO2L9vX+5KUrvgoCRSdPqU/wV0CatWGbUvBKIg4W3RwkVq7Ab2nFiwNmzou8b+EL6/555+xts6L4qFLJjoC5XKbxrATH5MjECQlJRsJAsmEz6EYAY3GZaQjMkMIdyYlVX0tFtyQMh7ME1e7gO/gb/Bj69m8RLzc6PPpapvlvdbwBxauWq1I1noiEnipqDCoIEAchnY/xWjVoF9/N47QwP+bmbPmqUng/1Nx+/t2rQJeAeucCSLPYGsDTnu/NK7fPmS9Oj2pPE5I/h2YufN87YOHORoQNJOJiAhWUjKjmIhC+xepwgIWYOYBIFAJ1EZ8gboB7U5mC9/n86FyB9h0de0aImu3FVUMIk2bdma7xye83hIiXRrJ5Cp6aSNkR9i5VRYyLmWo6MwTmSBzJw1V1JDvKXC+nXrpLlh414mKlvsBbMfJ0Von+reXScM+faF1KhaVf7648+AiCccyWK30iSLspBs86ZNjkThCXl+pDXCwgCzqU1LZz/IK/36eVveQMjJgknH29E0gHnTbVfaQkFqsQXCk+x7au+HvnGQstw9UCTv3OU4EQkTBqruFgTWrxjT1ZWgXWDumO7fc6/mUCnCal3TpEHD8kcWCCSVqDQMU5g6WOBY/eyTT7UzzD7A+Bv1GILF/PnzdXqyvT+EJK1AwqhhSRZFWHXKc/76q6/kbsNkZoK3vKdZUD4dO9CCPxgxwkgW/O2+tm0lU2njvgg5WZCA5BRCtPINGPREMwoUpT7jwDP1hUAAgYJUZlMfyM4Ac/' +
                'EDAaaEieAQJrVnHUx+fw1RCadJ79HGzBP91Okz+rkWRBh8Tho9Pg/eRoESth1pSkNr6zABSMJ6560hShv4Q8b+8kvBMmaMzrf45OOPtUpt749BC4mw3qMgRBtZEGFhX1jTsfh4yIvILiL5k4bf0MHvRIaq3RQJKVmQychkcBq4RByYFEzcQIS2i5cuN/bFWzouPkEuB6ARQE5OSVMsECNxLFTIuZ6jK5I7PQO0G5y/vpOVRV+8/U3HYM6RG+EPe1V/3EdBhMEz4/yQGdGoQM1BXzDJnRxuqMbVK1f2hAArVtbhvIKEyEn1SlX8OvGYVAWtmIw2siDl3bScH4EsWDhWVOgd0B540GjqsFYlZupUb0sPQkYWTMjtSTuMqr4lmCGFEVNfTAzs8UCiIgwSiMXUB7kFR0NcgIRcDPu5fAWnpGVrXlLXphfZGdoxuVnlWpCDknRv0uadCMckPFeIPTV1nzLBAltGzw5jOB2dJmRxCG85HG4L5y/wXoUZ0UYWRFKo8WE/judBXsbMENQtJZxKTQ2naNSvY8d6W3oQMrIg9ZjBZxqYxSVMDB0VKUClxlZfZIgycDyrLQsKXwULJh8aEZPdfk6EBWtWTgeOVydnMEvLWYUbCFh0lqbeFIuWLHUkWLtYxLJq9ZqAckB+U4OnktIeGLD2wVWcAgHgvffnzIs2sqAGBX4J+3EV7iynMzlZ1l5UkK3Z9+WXpazBuYyvhAQtX4SMLFC9Ax2koZQV8asK9AiTqYhdbz+WybJ4yfKQOP7swHRwyl7lORE+vnTpspHEEDQ0kqSCBY5S0rrxT5DbYRGCP6EN7Yk+OeGw+uyRBzuUOFFYwuQkCuOEAsni00+jgiy4P/JbQkIWZ85K/759jZEovucfRn3vbelBSMji+ImTMnuOueZCccvM2fPkSAGmCAvTps80RyhWJtwwCUIJNIIZs+Y4PhNIguxKUzgXiV+VoAZ34SI0+EPwH+HMhAQm6wI/BX83M2crs84weDExJ06YkLsk2jSwQimmcy' +
                'Bfff6FXHUwmaKNLPbv3y+tmrfIdxzPp2aVajJr5ixvy8KDBK3nnnnG0QzBAe2LIpMFA8mpFB7CWxQ1u6ji5AshJdwqyecEysiZJiUrSYm2hDppCRD6WrN2g99J6vQZZkphF8vZwZoVfElz583360+yhCJA9jAytu1T3XvkG1BIxfIVdB2JVs1a6L0uCi1N79FFfVlmXqlCfmcnJNC6RUvZl2pO0kpO9r9EnXUowb4U2NXckSwaFi9ZsKnyA/fd73gs6z+KikOZmfKYYZd7BL/I5EmTvC09KDJZMBGdisawOhJnHs63HTt2Fl6Sd8na9RsczRwqQ/nLk2CFpulY/rZ12408/FBj//60gCaor+hr2p7k7SE0QNOgpGDipi16yb3pvJZAqvY1MnNnzzHmQfCWa3HPPTJ/3jzZrp4j1b0LK5s3bdZ9LF+2XB683zxJytx6m96V3OShIlsSwnEiixHDhgW17J2X4A+jRskdt9xq7K9po0ayceNGb2szikIWXGvv556Tu8vmPxazYcibb+pciaIAsjMRLN8roWxqZ/iiSGTBG3nt2vXGiYhzj3oMsDmDlYdfFMEZ4+R3mDVnni5AawLnTt65O99xCBrLniBWWQYLnL6mEoFOMn6ix4fiG1YNJegXX4q/qAnf5a7dN9LxGZB9XnzJ+PYhVDrkjTeDVu/9gTE18uuvjaFUQnxoH4cP5/etpO5N1bUmTWFABn//Pn2UjR54xTIraQmCsveHNGvSVHYojc0fikIWaKajvvvOaJYxuUma2qnMzMKCl+u3X39jJFfO2bZlK12D1BdFIgvCloQvTYOOOpaBrgEJBNxcwuq1xnMxwMk1MAGioaCtKTTJWzQt7YC3ZejBPilO12wSwrj2lO5AwAQLhmAIx/ojC5zVFmLnztO+CtOgrVuzliSszL+GoKhYs3qNduKZzol9jf/Efr8HMw5Kl8cedyQLFreZSMYJqOhdHu9sJEmEyYRfwR+KQhZg27ZtjkvKIdMfv//er0btDykpKfLQAw' +
                '8YnzHy4vMveFveQJHIYpVDrUyE2hCBJEwFA6eUbbQYTBHTG46JpCeH7RiEtOxMNSiKE7zJ0WDs5zYJi74gt2CAxoXPKM1bDCcQbE9iU2rnyNWO5N26HQuOBvR/xegAY1LqVZOnQ7/t4IVsT01LJy/944920n4UX3Adg14Z4GiGcL1U0A4UmEOmCmCWPNmlqzLXnCc6KCpZMJ67d+1mJECknSLATZvMy8n9AYL58P33jSn7PF8SsuYo09OOQpPFgYxMbf+a3lC8sfftD3zwBorDWUe0x95+Tn4nKmJaK4I6t2TpciNZcEyoE7LswAyjloXTmxzhM8wV/ArBYH96ui6vRx/4jSivVxAgTxbhOV0PJorlMGYZOjF9+4BCmMgLFyzU7YoDrKakQrbpzYdGQ9l8u3Yx6ttvHd/ETDgchqdPFZxPclyZtC8897yxH0uGvftegSH3opIFiFu+3JEskE4PP6J3YA8G1BqpoQjB1B/bOXTu9Ji3ZV4UiiyYgHjNTQOOvy1RrOy7lDpU4LxscWg6L+ozqzbtyjgsSsVq0zEs3CIHo7ixfn1ivnPbJdCcCiYIzxaHr13LIuWb6A6D2KSh8PxIYqOd73G+Mm3mbB2K5q02/L1hRt9BOaVp8GYtTBXuQOFZG9HLaAYweVgbYVfBFy9erLcesLfPFUU8/fr00TkjrD2yg2d7+uQpHTkxvXV9Zfq0ad6jnBEKssB38lLvF40LyhA0Kap0U7UMp6iTOcp3fyQrS94fNkxrTE7mB5XPKJJjQqHIgl2wps0wl5xnAJNCXFxgvYjpvEiCsnXtuQkX1ZvdyQxYtjxOD8riBms/TEvtEUgsQZlQfJmBgPwJsk6tY/P05f3JGhxME0ygTO/OZZQNIK3cn0nE8Wy2xCTcl5qqowumQVWhbFmZNDFvWC3UYNCP/2ecXmeS//zltIORCIov8EmQvmxvb5eOHR6Sn0aP1gup1q9bLxvWr5e4FXF6AVy3J57Q2onTZGKSo6GkB2D2hYIsAMvJWdjldE' +
                '0QRs1q1bQj+p+//5YVShtZv3adbNiwQVatXClzZs2SLz77TFcFp71TP/ydqJFTiDlostBahUNpf3wHy9VnofZV+IIsQ5KdTOenbqV9cRS2raktokOuhUx8CgY4DJ1CqJhCJLUFCiYyi+zGTXAu0IugaXFOTELE6fx5RJEP5MJEHfn1N8ZBxd86PfKI3liouMHep+3vbWe8jjtvvU1vHOQLrntB7HypXiU/wdiFt2vtGjWlWeMm0lyRIhqJPx8FwnVAJNNsC6ycECqyAJMnTvRrjiBcG4WSCXMTEuW+GtStqwm3IE0Jv1SPbt38bgkQNFngraecvGmwYe+mpxdfdAGgXpP9aDIrmBSp+/JqNWhBTms01m1I1DZ8cYJyfmSPOplO5HkE69S8qq6ZCuQBEUCAwvVBQjwPnL6tmjc3OgsZdN9+M7LYnxtArWb5ummgc23keCTvyBu+hExJU2Zim0jGLoG201K2vLw/fETAyV2hJAvw29hfpVqlSiG/L9pRN8QeKrUjKLLgLczyZgYWNSsssQbcylXqTR2gOl0UMKhvDHJfmaprUvpOPiIoTsVvN281F5QJFbD7l62IN55b56EsXlpoMwibm0Vo7C7v+T7yk1EgMmEiVbhmabOFPtEcv1QqKwuWmJDWoEP4nWSkgvILQgkKvJBN6HsdljDhvvnyq3wmXHb2eRk18lsd8i3obRyI0AdL6YcOeVtX9goUoSYL7hMzAxPMFKEKVrgvfFL9+/YrMAwMgiILsil5m8WoNzhl3izBYUYxXGzjkgD7eZKIhSaR5zqUPc7ksUwRVmKy/sKjWRAq9AhvdCYXmaVODqGign7JM3F6+3OtqPxFBYlfkKe1B4gWw/l8hTY8E7ZcJMRN2NUqVpy6d68uO4+3HHXWEiYeIbXh772Xz7FYnMBZ+9qgV7UqXbt6jXzX9ICyw011OtFKJk2YqDdbJrEKcjFNGH/CMUwoNjf+efRPQS84ZC9RnI+mviGLXj16yLEgC0/zclsZF6/T7yuqfkzaX0' +
                'HCfUE2lEb8duTIfNtLOiEosqDoLSnM+5W6on96/5+yd5+uLXktp/hVU4AKTMEaHHi516J+8jt7lViRGCYs1bLJ4CQcaAmFX/ibtaNXcYAoywxDmNcSHLWhJCoWy21LShY2j54Xu1DnkEBIEDmExRoayJUkOjQa9h7heVHZywLXw3aEM6ZPk6mTp8j0mJhciZkyRabFTNOflzQo0jJx/IQ814NMi5mqr/Oon6gMa0befWeoru5FsR0rumNpJ5pEfP+vPqMNpg8Lud4YPFgS16/39hYcdiqyoP6HLvCjiwJZ4in207N79wJzNZyAb4GkrE6PdNT905/lmDWJdV/4ZZo3bSpvvPa631W8JgTts3BRMK4pdXFFfIKj+YMpd8bPzk9FAcveyTeB2Mm72JOSqkPKhGbTDxzQkRk0L6dtD4pL0ypN4GMgosAq0rfeeEO6dX5CWjZrLo3q1Zd6tevocGGDuvX0m5aEL3YXG/3DD7Ju7boiRcvI6aDa1D9//1vG//OPj4zTKzop4R/opsROoEgOGa2U9+/5ZHe92I77ql+7ttSrVUev8bDuCw2N+1q7Zk2h7sslixAD02en0l5MJIHwtmcSl8Sk5By+crMDjRTzJEOR5ubNm2XVqlWyfPlyWbZ0qayMj5fEDRu07U4GaaCh7IKA2UAVdv3TR7gWfoYC9IN/7LDS7lmUR7iU8OlydV/8PzExUfYpUoEginJfLlmEGFScclqFi0nCWpGSiCS4cBFquGQRQqDar15jLgwMUZAHciqAdGMXLsIRLlmEEOyuTqTFRBY4GfEduHARqXDJIkTA/GBRl1P0g1qhJRlydOEi1HDJIgTAacSuZk5EQcgyK6v4Fl25cFEScMkiBDhwIMPPloVTZdv2pJB5vl24KB2I/H/0r/5P3IjTlgAAAABJRU5ErkJggg==',
                 margin: [40, 0, 0, 0], border:[false, false, false, false]}, {text: ' ', border:[false, false, true, false]}],
              [{text: ' ', border:[true, false, false, false]}, {text: 'Firma: ____________________________________', border:[false, false, false, false]}, {text: ' ', border:[false, false, true, false]}],
              [{text: ' ', border:[true, false, false, false]}, {text: ' ', border:[false, false, false, false]}, {text: ' ', border:[false, false, true, false]}],
            ]
          }
        },
        {
          fontSize: 8.5,
          table: {
            widths: ['*'],
            body: [
              [{text: 'Según Providencia Administrativa SNAT/2022/000013 publicada en la G.O. N° 42.339 del 17/03/2022, este pago aplica una alícuota adicional del 3% del Impuesto a las Grandes Transacciones Financieras (IGTF), condición aplicable siempre que la prima sea pagada en una moneda distinta a la del curso legal en Venezuela.', alignment: 'justify', border:[true, true, true, false]}]
            ]
          }
        },
        {
          fontSize: 8.5,
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', alignment: 'center', margin: [10, 10, 0, 10], border:[true, true, true, true]}]
            ]
          }
        }
      ],
      styles: {
        title: {
          fontSize: 9.5,
          bold: true,
          alignment: 'center'
        },
        header: {
          fontSize: 7.5,
          color: 'gray'
        },
        data: {
          fontSize: 7.5
        }
      }
      /*,
      defaultStyle: {
        font: 'TimesNewRoman'
      }*/
    }
    pdfMake.createPdf(pdfDefinition).open();
    //const pdf = pdfMake.createPdf(pdfDefinition);
    //pdf.open();
  }

}
