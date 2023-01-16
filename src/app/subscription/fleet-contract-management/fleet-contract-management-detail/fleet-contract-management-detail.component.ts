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
import { FleetContractManagementRealcoverageComponent } from '@app/pop-up/fleet-contract-management-realcoverage/fleet-contract-management-realcoverage.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Console } from 'console';
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
  annexList: any[] = [];
  accesoriesList: any[] = [];
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
  fsuscripcion: Date;
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
  xtituloreporte: string;
  xobservaciones: string;
  xnombrerepresentantelegal: string;
  xdocidentidadrepresentantelegal: string;
  xanexo: string;
  rowClick: boolean = false;
  cuadro: boolean = false;
  coverage = {};
  xtomador : string;
  xprofesion : string;
  xrif : string;
  xdomicilio : string;
  xzona_postal : string;
  
  xtelefono : string;
  xcorreo : string;
  xestado : string;
  xciudad : string;

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
      xestatusgeneral: [''],
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
      ctiporecibo: ['', Validators.required],
      ccobertura: [''],
      xanexo: [''],
      xobservaciones: [''],
      xtransmision: ['']
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
      // cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccontratoflota: this.code
    };
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/detail`, params, options).subscribe((response: any) => {
      this.cuadro = true;
      if(response.data.status){
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
        this.ccontratoflota = response.data.ccontratoflota;
        this.ccarga = response.data.ccarga;
        this.xtituloreporte = response.data.xtituloreporte;
        this.xanexo = response.data.xanexo;
        this.xobservaciones = response.data.xobservaciones;
        this.xnombrerepresentantelegal = response.data.xnombrerepresentantelegal;
        this.xdocidentidadrepresentantelegal = response.data.xdocidentidadrepresentantelegal;
        this.detail_form.get('ccliente').setValue(response.data.ccliente);
        this.detail_form.get('ccliente').disable();
        this.xciudadcliente = response.data.xciudadcliente;
        this.xestadocliente = response.data.xestadocliente;
        this.searchDropdownDataRequest();
        /*this.detail_form.get('casociado').setValue(response.data.casociado);
        this.detail_form.get('casociado').disable();
        this.detail_form.get('cagrupador').setValue(response.data.cagrupador);
        this.detail_form.get('cagrupador').disable();*/
        this.fsuscripcion = response.data.fsuscripcion;
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
        this.generalStatusList.push({ id: response.data.cestatusgeneral, value: response.data.xestatusgeneral });
        this.detail_form.get('cestatusgeneral').setValue(response.data.cestatusgeneral);
        this.detail_form.get('cestatusgeneral').disable();
        this.detail_form.get('xestatusgeneral').setValue(response.data.xestatusgeneral);
        this.detail_form.get('xestatusgeneral').disable();
        this.detail_form.get('ccorredor').setValue(response.data.ccorredor);
        this.detail_form.get('ccorredor').disable();
        this.detail_form.get('xnombrecorredor').setValue(response.data.xcorredor);
        this.detail_form.get('xnombrecorredor').disable();
        this.detail_form.get('xcertificadogestion').setValue(response.data.xcertificadogestion);
        if(response.data.xcertificadoasociado){
          this.detail_form.get('xcertificadoasociado').setValue(response.data.xcertificadoasociado);
          this.detail_form.get('xcertificadoasociado').disable();
        }else{
          this.detail_form.get('xcertificadoasociado').setValue(' ');
          this.detail_form.get('xcertificadoasociado').disable();
        }
        this.detail_form.get('xsucursalemision').setValue(response.data.xsucursalemision);
        this.detail_form.get('xsucursalemision').disable();
        this.detail_form.get('xsucursalsuscriptora').setValue(response.data.xsucursalsuscriptora);
        this.detail_form.get('xsucursalsuscriptora').disable();
        if(response.data.ctrabajador){
          this.detail_form.get('ctrabajador').setValue(response.data.ctrabajador);
          this.detail_form.get('ctrabajador').disable();
        }else{
          this.detail_form.get('ctrabajador').setValue(' ');
          this.detail_form.get('ctrabajador').disable();
        }

        if(response.data.xnombretrabajador){
          this.detail_form.get('xnombretrabajador').setValue(response.data.xnombretrabajador);
        }else{
          this.detail_form.get('xnombretrabajador').setValue(' ');
        }
        if(response.data.xtipodocidentidadtrabajador){
          this.detail_form.get('xtipodocidentidadtrabajador').setValue(response.data.xtipodocidentidadtrabajador);
        }else{
          this.detail_form.get('xtipodocidentidadtrabajador').setValue(' ');
        }
        if(response.data.xdocidentidadtrabajador){
          this.detail_form.get('xdocidentidadtrabajador').setValue(response.data.xdocidentidadtrabajador);
        }else{
          this.detail_form.get('xdocidentidadtrabajador').setValue(' ');
        }
        if(response.data.xdirecciontrabajador){
          this.detail_form.get('xdirecciontrabajador').setValue(response.data.xdirecciontrabajador);
        }else{
          this.detail_form.get('xdirecciontrabajador').setValue(' ');
        }

        if(response.data.xdirecciontrabajador){
          this.detail_form.get('xdirecciontrabajador').setValue(response.data.xdirecciontrabajador);
        }else{
          this.detail_form.get('xdirecciontrabajador').setValue(' ');
        }
        this.detail_form.get('cpropietario').setValue(response.data.cpropietario);
        this.detail_form.get('cpropietario').disable();
        this.detail_form.get('xanexo').disable();
        this.detail_form.get('xobservaciones').disable();
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
        if(response.data.mpreciovehiculo){
          this.detail_form.get('mpreciovehiculo').setValue(response.data.mpreciovehiculo);
          this.detail_form.get('mpreciovehiculo').disable();
        }else{
          this.detail_form.get('mpreciovehiculo').setValue('0,00');
          this.detail_form.get('mpreciovehiculo').disable();
        }
        if(response.data.ctipovehiculo){
          this.detail_form.get('ctipovehiculo').setValue(response.data.ctipovehiculo);
          this.detail_form.get('ctipovehiculo').disable(); 
        }else{
          this.detail_form.get('ctipovehiculo').setValue(' ');
          this.detail_form.get('ctipovehiculo').disable(); 
        }
        this.detail_form.get('xuso').setValue(response.data.xuso);
        if(response.data.xtipovehiculo){
          this.detail_form.get('xtipovehiculo').setValue(response.data.xtipovehiculo);
          this.detail_form.get('xtipovehiculo').disable(); 
        }else{
          this.detail_form.get('xtipovehiculo').setValue(' ');
          this.detail_form.get('xtipovehiculo').disable(); 
        }
        if(response.data.xtipomodelovehiculo){
          this.detail_form.get('xtipomodelovehiculo').setValue(response.data.xtipomodelovehiculo);
          this.detail_form.get('xtipomodelovehiculo').disable();
        }else{
          this.detail_form.get('xtipomodelovehiculo').setValue(' ');
          this.detail_form.get('xtipomodelovehiculo').disable();
        }
        if (response.data.ncapacidadcargavehiculo) {
          this.detail_form.get('ncapacidadcargavehiculo').setValue(response.data.ncapacidadcargavehiculo);
          this.detail_form.get('ncapacidadcargavehiculo').disable();
        } else {
          this.detail_form.get('ncapacidadcargavehiculo').setValue('0');
          this.detail_form.get('ncapacidadcargavehiculo').disable();
        }
        if (response.data.ncapacidadpasajerosvehiculo) {
          this.detail_form.get('ncapacidadpasajerosvehiculo').setValue(response.data.ncapacidadpasajerosvehiculo);
          this.detail_form.get('ncapacidadpasajerosvehiculo').disable();
        } else {
          this.detail_form.get('ncapacidadpasajerosvehiculo').setValue(0);
          this.detail_form.get('ncapacidadpasajerosvehiculo').disable();
        }

        if(response.data.ctipoplan){
          this.detail_form.get('ctipoplan').setValue(response.data.ctipoplan);
          this.detail_form.get('ctipoplan').disable();
        }else{
          this.detail_form.get('ctipoplan').setValue(' ');
          this.detail_form.get('ctipoplan').disable();
        }
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
        this.detail_form.get('xtransmision').setValue(response.data.xtransmision);
        this.detail_form.get('xtransmision').disable();
        if(response.data.xtomador){
          this.xtomador = response.data.xtomador;
        }else{
          this.xtomador = this.xnombrecliente;
        }
        
        if(response.data.xprofesion){
          this.xprofesion = response.data.xprofesion;
        }else{
          this.xprofesion = ' ';
        }

        if(response.data.xrif){
          this.xrif = response.data.xrif;
        }else{
          this.xrif = this.xdocidentidadcliente;
        }

        if(response.data.xdomicilio){
          this.xdomicilio = response.data.xdomicilio;
        }else{
          this.xdomicilio = this.xdireccionfiscalcliente;
        }

        if(response.data.xzona_postal){
          this.xzona_postal = response.data.xzona_postal;
        }else{
          this.xzona_postal = ' ';
        }

        if(response.data.xtelefono){
          this.xtelefono = response.data.xtelefono;
        }else{
          this.xtelefono = this.xtelefonocliente;
        }

        if(response.data.xcorreo){
          this.xcorreo = response.data.xcorreo;
        }else{
          this.xcorreo = this.xemailcliente;
        }

        if(response.data.xestado){
          this.xestado = response.data.xestado;
        }else{
          this.xestado = this.xestadocliente;
        }
        
        if(response.data.xciudad){
          this.xciudad = response.data.xciudad;
        }else{
          this.xciudad = this.xciudadcliente;
        }
        //this.searchTotalAmountDataRequest();
        this.accesoriesList = [];
        if(response.data.accesories){
          for(let i =0; i < response.data.accesories.length; i++){
            this.accesoriesList.push({
              caccesorio: response.data.accesories[i].caccesorio,
              msuma_accesorio: response.data.accesories[i].msuma_accesorio,
              mprima_accesorio: response.data.accesories[i].mprima_accesorio,
              xaccesorio: response.data.accesories[i].xaccesorio,
            });
          }
        }
        this.annexList = [];
        if(response.data.coverageAnnexes){
          for(let i =0; i < response.data.coverageAnnexes.length; i++){
            this.annexList.push({
              ccobertura: response.data.coverageAnnexes[i].ccobertura,
              canexo: response.data.coverageAnnexes[i].canexo,
              xanexo: response.data.coverageAnnexes[i].xanexo,
            });
          }
        }
        this.realCoverageList = [];
        if(response.data.realCoverages) {
          for(let i =0; i < response.data.realCoverages.length; i++){
            if (response.data.realCoverages[i].ititulo == 'C') {
              if (response.data.realCoverages[i].mprima) {
                this.realCoverageList.push({
                  ccobertura: response.data.realCoverages[i].ccobertura,
                  xcobertura: response.data.realCoverages[i].xcobertura,
                  xprimacobertura: `${response.data.realCoverages[i].mprima} ${response.data.realCoverages[i].xmoneda}`,
                  ititulo: response.data.realCoverages[i].ititulo,
                  ccontratoflota: response.data.realCoverages[i].ccontratoflota,
                  msuma_aseg: response.data.realCoverages[i].msumaasegurada,
                  mprima: response.data.realCoverages[i].mprima
                })
              } else {
                this.realCoverageList.push({
                  ccobertura: response.data.realCoverages[i].ccobertura,
                  xcobertura: response.data.realCoverages[i].xcobertura,
                  xprimacobertura: `0 ${response.data.realCoverages[i].xmoneda}`,
                  ititulo: response.data.realCoverages[i].ititulo,
                  ccontratoflota: response.data.realCoverages[i].ccontratoflota,
                  msuma_aseg: response.data.realCoverages[i].msumaasegurada,
                  mprima: response.data.realCoverages[i].mprima
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
    let dateArray = date.substring(0,10).split("-");
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
  }

  /*searchTotalAmountDataRequest(){
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
  }*/

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
          //this.searchTotalAmountDataRequest();
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
    this.detail_form.get('fdesde_pol').enable();
    this.detail_form.get('fhasta_pol').enable();
    this.detail_form.get('fdesde_rec').enable();
    this.detail_form.get('fhasta_rec').enable();
    this.detail_form.get('xanexo').enable();
    this.detail_form.get('xobservaciones').enable();

    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
    this.cuadro = false;
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

  onCoverageGridReady(event){
    this.coverageGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    // if(this.detail_form.invalid){
    //   if(!this.detail_form.get('ctrabajador').value){
    //     this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.REQUIREDWORKER";
    //     this.alert.type = 'danger';
    //     this.alert.show = true;
    //   }else if(!this.detail_form.get('cpropietario').value){
    //     this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.REQUIREDOWNER";
    //     this.alert.type = 'danger';
    //     this.alert.show = true;
    //   }else if(!this.detail_form.get('cvehiculopropietario').value){
    //     this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.REQUIREDVEHICLE";
    //     this.alert.type = 'danger';
    //     this.alert.show = true;
    //   }else if(!this.detail_form.get('cregistrotasa').value){
    //     this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.ASSOCIATEFEESREGISTERNOTFOUND";
    //     this.alert.type = 'danger';
    //     this.alert.show = true;
    //   }else if(!this.detail_form.get('cconfiguraciongestionvial').value){
    //     this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.ASSOCIATEROADMANAGEMENTCONFIGURATIONNOTFOUND";
    //     this.alert.type = 'danger';
    //     this.alert.show = true;
    //   }else if(!this.detail_form.get('ccotizadorflota').value){
    //     this.alert.message = "SUBSCRIPTION.FLEETCONTRACTSMANAGEMENT.ASSOCIATEQUOTEBYFLEETNOTFOUND";
    //     this.alert.type = 'danger';
    //     this.alert.show = true;
    //   }
    //   this.loading = false;
    //   return;
    // }
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
        },
        coverage: {
          update: this.coverage
        },
        fechas: {
          fdesde_pol: form.fdesde_pol,
          fhasta_pol: form.fhasta_pol,
          fdesde_rec: form.fdesde_rec,
          fhasta_rec: form.fhasta_rec,
          ccarga: this.ccarga,
        },
        extras:{
          xanexo: form.xanexo,
          xobservaciones: form.xobservaciones,
          ccarga: this.ccarga,
        }
      };
      url = `${environment.apiUrl}/api/fleet-contract-management/update-coverage`;
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

  buildAccesoriesBody() {
    let body = [];
    if (this.accesoriesList.length > 0){
      this.accesoriesList.forEach(function(row) {
        let dataRow = [];
        dataRow.push({text: row.xaccesorio, alignment: 'center', border: [true, false, true, false]});
        dataRow.push({text: row.msuma_accesorio, alignment: 'center', border: [false, false, true, false]})
        dataRow.push({text: row.mprima_accesorio, alignment: 'center', border: [false, false, true, false]})
        body.push(dataRow);
      })
    } else {
      let dataRow = [];
      dataRow.push({text: ' ', border: [true, false, true, false]}, {text: ' ', border: [false, false, true, false]}, {text: ' ', border: [false, false, true, false]});
      body.push(dataRow);
    }
    return body;
  }

  buildAnnexesBody() {
    let body = []
    this.annexList.forEach(function(row) {
      let dataRow = [];
      dataRow.push({text: row.xanexo, border: [true, false, true, false]});
      body.push(dataRow);
    })
    return body;
  }

  rowClicked(event: any){
    let recoverage = {};
      if(this.editStatus){ 
        recoverage = { 
          type: 1,
          edit: this.editStatus,
          create: false, 
          cgrid: event.data.cgrid,
          ccobertura: event.data.ccobertura,
          xcobertura: event.data.xcobertura,
          mprima: event.data.mprima,
          ititulo: event.data.ititulo,
          ccontratoflota: event.data.ccontratoflota,
          delete: false
        };
      }else{ 
        recoverage = { 
          type: 2,
          edit: this.editStatus,
          create: false,
          ccobertura: event.data.ccobertura,
          xcobertura: event.data.xcobertura,
          mprima: event.data.mprima,
          ititulo: event.data.ititulo,
          ccontratoflota: event.data.ccontratoflota,
          delete: false
        }; 
      }
      console.log(recoverage)
      const modalRef = this.modalService.open(FleetContractManagementRealcoverageComponent);
      modalRef.componentInstance.recoverage = recoverage;
      modalRef.result.then((result: any) => {
        if(result){
          this.coverage = {
            ccobertura: result.ccobertura,
            ccontratoflota: result.ccontratoflota,
            mprima: result.mprima,
            msuma_aseg: result.msuma_aseg,
            edit: this.editStatus
          }
          return;
        }
      });
    }
    
  buildCoverageBody2() {
    let body = [];
    this.coverageList.forEach(function(row) {
      if (row.ititulo == 'C') {
        let dataRow = [];
        dataRow.push({text: row.xcobertura, margin: [10, 0, 0, 0], border: [true, false, false, true]});
        //Se utiliza el formato DE (alemania) ya que es el que coloca '.' para representar miles, y ',' para los decimales fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
        dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.msumaasegurada)}`, alignment: 'right', border:[true, false, false, true]});
        if (row.mtasa) {
          dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.mtasa)}`, alignment: 'right', border:[true, false, false, true]});
        } else {
          dataRow.push({text: ` `, alignment: 'right', border: [true, false, true, true]});
        }
        if (row.pdescuento) {
          dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pdescuento)} %`, alignment: 'right', border:[true, false, false, true]});
        } else {
          dataRow.push({text: ` `, alignment: 'right', border: [true, false, true, true]});
        }
        if(row.mprima){
          dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.mprima)}`, fillColor: '#f2f2f2', alignment: 'right', border:[true, false, true, true]});
        } else {
          dataRow.push({text: ` `,fillColor: '#f2f2f2', alignment: 'right', border: [true, false, true, true]});
        }
        body.push(dataRow);
      }
      if (row.ititulo == 'T') {
        let dataRow = [];
        dataRow.push({text: row.xcobertura, decoration: 'underline', margin: [2, 0, 0, 0], border: [true, false, false, true]});
        dataRow.push({text: ` `, fillColor: '#d9d9d9', border:[true, false, false, true]});
        dataRow.push({text: ` `, fillColor: '#d9d9d9', border:[true, false, false, true]});
        dataRow.push({text: ` `, fillColor: '#d9d9d9', border:[true, false, false, true]});
        dataRow.push({text: ` `, fillColor: '#f2f2f2', border:[true, false, true, true]});
        body.push(dataRow);
      }
    });
    return body;
  }

  createPDF2(){
    try{
    const pdfDefinition: any = {
      footer: function(currentPage, pageCount) { 
        return {
          table: {
            widths: ['*'],
            body: [
              [{text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', border: [false, false, false, false]}]
            ]
          }
        }
      },
      content: [
        {
          style: 'data',
          table: {
            widths: [165, 216, 35, '*'],
            body: [
              [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjUAAADXCAYAAADiBqA4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEEdSURBVHhe7Z0HeFRV+ocTYv2vru6qa19WBZUqgigI9rL2gm1dK4qigih2RRHrWkEBG6ioWEBUUIqKgBQp0qsU6b1DElpmJnz/8ztzz3Dmzs1kWkLm5vc+z/eEzNw+IefNd75zTo4QQgghhPgASg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqamkFG/dKtunjpfCX/pJ4Y9fS8GAnlLww0dSOOgT2TK0l2z9ra9snzxEgmuXOnsQQgghFRtKTSWgeMcO2TJliqz7sqcsf/YJWfjfy2XBOXVk8YV1ZMkVdWXZtfVk+c31ZGXzk2Vly/qyunUDWd22gax55BRZ+3hDWffcubL5w/tky09dZceMYRLatMo5MiGEEFJxoNT4mI3DRsicO+6WSbVqy5TaNWT6yTXl' +
              'j1NrybymtWThubVl8SV1ZOlVJ8myG+vJitt3Cc2ah5XMPKFk5ulTZf2zkBr19QUVL54WDvXvDZ0ul63DP5Tiwg3O2QghhJDdC6XGZwTzC2Tpux/L+Ebny+gjj5ffjzlBJlY/UabU2iU1f57hSM2ldWXZNXXDWZo7ldC0qr9LaJ5pGJaX/50mG19tJBvfUF/fVF87OaH+veH101Q0lYK+7SWwbIZzBYQQQsjugVLjE7bMXSB/tHlahh9eV379ezUZcUh1+U1Jzbh/nSATlNRMrqmkpp6H1FxbT1bcoqTmLiU0bRrI2kdPCWdoIDSvOCLzdiPZ1LWxbHrvdNn0/umyuZv6t/qqv1ev431Iz+ZPbpftUwfIzuKQc1WEEEJI+UGpyXJ2hkIy/+WuMnj/E2Xw/x0nQ/Y/Tob9TUnNwdVl1OHHy9h/Hi/jjztBSc2JMq1eDZlldz8ZqbnN6Xp6UEnNEw1lfQcnQ6OEZlOXsMDkf6hkpof6+lkTKei5K/I/aSKbP3ZEB4LTqZHkf9pcgusWOldICCGElA+UmnJgc3CnzN5WLBMKQzK+ICQztxTL+sBO593UKZz9p4xtcpX8vM9xkRiy33Ey9K/VZPhB1WTkYdVl9FFKao49QSadeKJMrVNDZp5SQ+Y0qSkLzgnX1KD7SWdqIDVtG8i6J8M1NLrLCRkaZGaUtGiJ6aXim6ZS+K2Kvk3Cof5d0EfFV0pwlPBAfpDB2dj5TNk2rqfs3Jn+fRJCCCGJQKkpI/JDO+VXJTAdVwWkw/KAPLs0IO2XBKTdYhULA/LUgoA8r6L/2pCsLUqu4YcoLHyzm/xyQI0ooUEM/ouSmv2Pi+mC0nU1tWvIjAY1ZXbjmjL/rFqy6KI6srTZSVFSs7bdKbrrCd1JyLxs7t44nJ3p7UhMfyU0A8+XLYMulC0/XqK/6u8HnCUF/c4ICw4yOMjsvNtI8r+8S0IbljhXTgghhJQdlJoMU6yEY1RhSF5aGZDnVuwSmmcgM5bQPP5nQB6bF5BH5wbkkdlB' +
              '+X51SALFpcvNtsXLZdzZ18XITCTQBbXfcTLswGoyXHdBVY/qgjJ1NfPOrCWLLwiPflp+U7imBt1PyNQYqYGU6CzNV+GMDMRFi8zgZrJ16I2ybdjNsvXX28Jfh9wgW3++Iiw53zvZGyU3kKJN750t2yf1ce6AEEIIKRsoNRlki5KSD9cF5fkkhOZhJTQP/RGUtjOD8sLcoKzdUbLYbF20VEZUb+otM1bobM1fq+lszchDw11QGAUV3QUVrqtZclldWX7DSeHRT63DNTW6+8lITQ8lNeh26ndGODvzy7VhkRnRUrb/1ka2jW6rQ/975L36PWwTkZveSmzUMXCsbaO7O3dCCCGEZB5KTYYoDO2Ud9YGUhaaNjOCcv/0oLRT/16zPVZsEhUaHTHZmuNlXNXjZUI1ZGtqyIz6NWV2o11dULqu5raTZdW94dFPKBRGTY3ufkKmRkkNBAVZGp2hgdCMeVi2j28vOyY+Lzsmvahj+4QOsn3cE1pwtg5vruWmcMA54bobZG26NZbtYyk2hBBCygZKTQbIlNDcPzUoracE5fFpQVltiU1SQuOEXVvjztZMq1tDZjUMj4JadH5tWXKl1QWFYuGnndFPbzfStTG6+wlS89NluqsJ0rLj96ekaPL/pGj621I08x0pmvV++Cu+V6/jfZ29UdtjP521QTGxOt6asd10Nx0hhBCSSSg1aZJpobl3UlDumRiUR9X3q7ftTEloTLhra7yyNQvOdkZBXaukpvnJkS4oXVeDId3vh0c+oUgYmRojNcjKFE3rJEV/dJPAvM+laH5vHYE/v5SiOZ/IjhldwtmbsY/JthEtdB0Oiox1d9THp8u00R9QbAghhGQUSk0alJXQtJyg4vegPDK+SL5v+h9PYUkkzLw1ZiSUmWHY1NZ4ZmtahmcVxozCkS4o1NX0aaq7klAQvH1UK931pKVGCUxg4bcSWjJIgsuGhGPxAAks6COB2R/pbbAt6m10rQ1GSTliM3lsD4oNIYSQjEGpSZGyFpq7xwXljrHq' +
              '3/2Wy1fHnuUpLYmEKRo289ZEjYTCsgmnWbU1mIjvdle2plMjXQtjuqAwwgmZF9TO7Jj6hpaa4KJ+Elo+TIJrxkto3WQJrZ0owZWjwnIz73OdtdH1NkqGIEWQI4jNxh5nyNBF0yg2hBBCMgKlJgXKS2juGB2U5r8F5bbeS+WLqmd4SkupYRUNm1mG7XlrZjaoqSfjMyOhsLjlqhZObc0zDfVSCZFsDSbeG3h+uFh4dFvdvYRaGmRlIDUQmuLN86W4YIkUb5oXlpulg3W3lC02dsZmSa8bpN/GLRQbQgghaUOpSZLyFppbRwbllhFB+W/PxfJZ1dRqa+xuKF00bHVD6aJhZz0oM28NJuNbdU94JJQZ3m1qa/TQbhQMO9kadC8hG6O7n9aMl535C2Xnjo1SXJSv5Qaigy4p1NposTFdUabG5qsmMmJoR+mzKUixIYQQkhaUmiRwC037ZbFC8+T8WKF5eFas0Nw3OVZoWkBmXEJz6/Cg3KzixmFBufrDhfLp0U08xaW0iJq7xt0NhQn5SuiG0pPxvaik5q1GeiI9PbxbyQiyLbq2BgXDGPU0v3c4W7N+muzcskKKQzu02EBydLeUkp6iuZ+Fa2yUDOniYYyK6ttE8ns2lY9mTpTeGyg2hBBCUodSkyC7W2j+M1TFL0G5qPN8+SRFsSlpNNSUWruWT9BrQl1qTciHWYadId5Y3FLPW2OKhofeGB7ebXdDrRihxUZ3QW1bK8WFy6R4wwz9OgqKMVoKQ771pH3DbtbdWejWWtzrWnlxcYF8uS4oIYoNIYSQFKDUJEBFEZrrBgflmp+Dcs6rf8onR6UgNqa+Bqt4Y12oI3bV1+iZhnV9jTPT8BVKbJy5azxHQzn1NRATd32NHgGF7MzGWVK8aY6WnNCq0bpw2GRrMI8NJvHT3VDOHDaDh3TRz/SLNRQbQgghyUOpKYWKJjTX/BiSqwcGpdFzc1MSm6SHed/sDPN+5BRZ/2xYbPRClZ84K3Y7hcM6YzPxed0VhRobCIzujlIy' +
              'owOjoxb/EBkNhW2xD/Y12ZrVn18kz84v1DVJn62k2BBCCEkOSk0cKqLQNBsUkisHhOSyH4JycrvZ0iMVsfFYG2r8saUXDhux2fB6eF2oKLFxzV+j56iZ31sP94bgaKFZ0EdnaiIT8415OLycwk+X6QLk/M9Pl69G9o08z0+WU2wIIYQkDqWmBCqy0Fyh4vL+Ibnw26DUfniW9DgyTbE5bJfYTK6hxKZejeiVvJvFio17Yj69gvfgZuFRUWMfC3dHYckE1NDM+STc7YSvWE4B3U/I1BipsWYbntv7Vv08H5kTfp4fLw1RbAghhCQEpcaDbBCaS74PyaX9QnJO76Ac33qmfJyG2MRMzKfERo+IKkVs9Bw2pnjYLHpp1odC1gYT9GHByymvapHRMjP1DS08Zm0oIzV63holR8j+vD1uon6ebdXzfEA9xw8XVW6xCYWKZebsZRmJHTsCzlH9zabNW2T5yg1xY83azc7W5Usi17Y5f6uzNSEkGSg1LrJJaP7dV8W3ITnjs6D8q+UM+fiI5MUGhcNhsakuo7yGettic5VVY4PiYTMqCsO9Mesw1oj6NjwyCqKy9dfb9Jw0ekVvCI4SGS0zGNKN0U8jWkYWvIxIzWdN5Ldv20WEps208Hw+HyyovGKDBi7noJsyEnPmrXCO6m8efKqn5/3bse+Rt5e72BQXF0vNxo95Xo8dTz7fy9mDEJIMlBqLbBSaC78JyXlfh+TU7kE5+o7p8lGKYqOHervFxpWxiVnR+8EGsrbdKXoeG7345Xunh7ujeoUn6UOtjZaboTfqjIyWGCU5+uuIFmGhQZZm0IXhEVC9m+hMzfoPzpCnJqyOCA2eJZ7ju/Mqp9jsVPeMxrCoKCjz5q+Srt0HS9WT2ng2hogDj7lLPvr8V5k1Z5ls21ak98UxTFQGAoGgLFuxXj74ZKiccNojns8JUd7y0HfABM/r+L+jmsvjz30lE6cslLXr8iUYDDl7EEKSgVLjEE9onloUKzSm5sMWGjTCbqG5e3ys0Nw+' +
              'KlZobhwSKzRXD4wVmksgMy6hOa9XSM5RcVLnoBxxc+bFBjU2pnh4wXnh4d5YTkHPY4N1oh5vKOs7nKrrbDa+Hc7aIOMCSdFyg8zNj5fodaP0EgkIyAwyNBCa/k11hgfDuiFFkKPuPw+KEho8x7vUc+wyhzU2YOHiNXLI8fd4NpBDhs9wtiJgxh9LJe+Qmz2f1V+rttDdQeUBhLLh+c94Xkfbdj2drQgh6UCpUfhBaM78IiRNPw9JjVeDcuh/p8uHaXVFRRcPR0ZFNawVmccGE/Qtvf4kPfPwqnvDdTbojtJZGyyrgCLi7o7coN4G0gLBwWzEKCpWoYuD8RreU9tg2/wPT9cjqwZ83THqOUJo8AybjwlK5z8oNqDFA91jGsf9q96psxQkmuMatI15ViZefLOvs1XZ8ouSTa/zI1556wdnK0JIOlR6qfGT0DT9LCSNPg1J1Q4B+ccNmRMbex4bswDmgrNr6yUVUECs62wwSV8bZ3XvDuFaG90lBbnp5oySwtpRXzkZHBOQmc9PjwgNsjTI9kzqdles0PwWfoZYC6vTTCU2xZVbbHp8OSKmcazd5HHnXWJz8tlPxTwrEwdVaylbtmx3tiw7zrnyRc/zI55gDQ0hGaFSS01+cKd0VvLy2soi3wjNqZ+o+DgkRz4ekIOvmS7dD09ebGLmsXEm6DMre8+oX1NmNwqvFYUCYj37MJZVaO5kbVBEjDWjLLmBqOiaG3RNIRvzcbj+Bl/19+p1IzTI9Kx87Wz1DIs8hcY8vzemVW6x+eaH32Max5POfNJ5l9gYqTmiVis5rMZ9Mc+t03uDnC3LhjHj50XO1eDcdlHnRtzd9kNnS0JIOlRaqYHQ/G9+UB5QcvLEjG3y3LIi3whNw49CcnK3oBzcJiAHXT1duqUpNnpJBSU2WFJhghKbyTVr6AJi1Nlg9mHdHXVJHVl2jZKbm+vJqhb1ZXWr8CzEEbl5SckNam6QvXlLRRclMV2dUP/WMtOpkZ7YDyK0/oVTpd2QuSUKzQ3q+V2v' +
              'nt+rUyqv2Hw3YHxM41jvLEqNF8fWf1A/H9S0vNa5f8xzO7JW6zId7n75f9/Q50FW6Ot+42LOf+3tbztbEkLSoVJKjS00GDYMMXlgYqG0X1TkC6Gp3z0k9bqFpM67QTng7oD8/UolNoelKDZYUsFZK2rU4cdHFxDXDXdHYSFMO2uja21ucUZItQ5nbtAthfWj1j0XrruBuGCeGy06KvBvLTPqPUgQ6nPe6d0vrtCYZ/fKxMopNpSaxPn7cXfr53NBs/9JQcE2+duxd8U8u26fDnO2zizTZi6JnOO5176V0b/PjTov4tyrXnK2JoSkQ6WTms0uobFH2LQck+8boTnpg5DUei8kNd4Kyl9uDciBl6UoNs5aUZHVva06m4knhLujpp/sDPtuWkuv8o1aGz30+wYlN7edrDM36JbCEHBkbyA4GAoOycEkfia09CiZQXZn7aOnSN8uL5cqNHh2eG4vTah8YkOpSQyMOqpycHj0k8mIPPvKNzHPDsXEZTGU+sa7uurjY9j2+g0F8sfc5THn5udGSGaoVFITV2iUkNw5JiB3jtrsG6Gp825IanYNyXGvBWWfGwOy/8XT5f0UxMas7m3X2US6o6qFJ+qLZG0a1dRz2mDoN7qkMGFfJHPT/GQ9cZ/ummqjJKdtWHK06CiJ0f9++JTw6+r9X15+JCGhMc/t+d8rl9hQahIDmRnzfDBiDEAu/nL0HVHPDvFFn9H6/Uzx54JVEaHChIBg5aqNMef9Z902+j1CSHpUGqkpTWggJLcrGbllREBuGbrBN0JzYpeQHN85JEe9EJS9rgnJfv+eKe8dmoLYqHDX2US6o451sja1nFobPfQ73CVl5AaZm2XX1tPz2xjBQQYHkoOlF5DJ0aH+jdfQdTW0/f0JC83F/dTz+i4k7cdUHrHJRql5+JnP5ZTzno7EipUbnXfKjqXL10eeD85veKT9F1HPDoHRY5isMFPc9WB42P0e/7hFXwfYvr0o5rz7/fMO/V5pXH9HZ6nR6NGE4u0PfnL2Sox2' +
              'L37teRx3GDEEg36ZKh3fHeQZv0+a72yVGnP/XOl5XHd07rbrPrHPeHXeYSNnSf+fJuv6pU++GiHvfTxEF4Nj6HyHV7+Vp1/6Wp56obeefBEjz/D9869/pyetHDF6tl6qIt2fg42btsiCRWsSinTquXp9Nzbq/xQmeEwVzLDtdX3xorCw7EcOJkOlkJpEhcZ0dVz7c0BuGLReC82DkJkEhAbzp7iF5qZfY4Xm2p9ihebSH2KF5oI+sUJzZs9YoWnwYazQ1HonWmiOe0tFx2I59OmQ5F0ekn0vSENs7O6og6qHh307WRvU2pih3zPqhwuJjdzoYuILldxcVldnbyA46J7C7MSQHHRTRUJ9j4Lj4Y+2SEpoznMk8JlRIQlWArHJRqm595GPo6731bf7O++UHdNnLY2cDw2XARmTvQ+/Lep6EP0GTnS2SA80jHseeqs+5m33ve+8GsbrvJgxujTQ0K5bXyA/DZ0m1U55KOYYV9z0pkyaujChY7lB1xsaNfxcnX/1y1HHhXRBkhYvXafXIjNg7p32//tGGv/7Wcm1tjf7jJ0wz9kyeeYvXK3PCflseslzUcfe54jb5fZW7+ufnw97/ursEZa+C695RRd+29sj8MwhQD17j9Kyg8a/z/fj9PcvdeynPyPcB64b22Nixhvu7CxffTtG8guSX4vr869/k7pnPBFzHXZgZnBcLzJ6qeIeBYm6sVR5o+tAfT1H1b4/6ph2HHrivXLW5S/IJTe8Jpf+53UtgRUJ30tNskIDEcFyBZf0DUizfmt9IzRVVRzxRrEc+LASm0tCsve5M+Wdf6QmNu7uKDtrg1qb8AipaLlBMbGekRjz25wfrrvBBH66sBhdVM2U6FxTNxL4fuS9tyYtNHheZ30VkieH+19ssk1q0NAeXL1l1PXiL/+yXrph1Ng5kfPZf9UDt2QhTj3/mYxcE2YJNsfEkhU2XsPKV63e5LybGJg52t4fxdCZmnhx69YdUuv0XWtUISNTGpi52UicCSzZMWX6YmeL1MHn' +
              'gcyKOS4+03hg+y7df466lgP+1cJ5Nz5YWgSyc9UtHSNdh5AoLGORyuzTi5aslRMbRS/Vsddht+pMUiZodmunqGNDLk1WMFXw/Hr3HRszE/ct975b4Zfw8LXUpCo0NzgCcuYXQbmyzxrfCM1hr6t4tVj2vTckuReFZK+zZkrXVMVGBbqjorI2Tq1NpEvKkhsUE6NbCjU3mJVY190owUEGB5KDLA5ER8vOJeGvQ1s0jwgN1sByCw2emZfQoIuusXpejw/zt9hkm9R8P2hizPUixk3809mibEDjYc71aa+RzqthsNyE1xIKyECkA7IpKAzGsa68+U3n1V24GzmEW3xKAxMG2vujEc4kj3X4Uh8XApao5Jkshx0Q2WTvzQvIAY6HjEsi14Nt7KVEEpUaG3Rl2dkWiKP7ZygR3BNlYoh/JtiwsTBGJBHIPGWCs6+InjCyrP+vZgLfSk1JQmMvLhlPaK5WAgL5qP9+QC7rtcY3QnPgK8Wy3/+KZa/bldhcEJK8M9ITm5iszcFWl1RVD7mpV1NmNHCyN1pwaupRU5AcdFPpOhwlO4iBd7RMSmhMzRGEBs+rYY+QPPyLf8Um26Tmmtve0tdoZzAQ9zz8kbNF2YDuBXMur66lW+99L+p6EJj9Nx2eeblP5FiYeM8Nujns8yFKyz64QTeQvT9GWWUSNN44bjLDzY3U1Gn6eNS1QYywGGs6oO4Ex4IsJgqu3VxDKlIDkP1C15Q5DgI1OImKHoAc2fvb3aDp8O5Hv+jjoZvs8JqtIsdH12Qy11cSDzz5WeSYiHQzQOWBL6UmU0KjG9C+Qan+ekAu/XK1b4Rm/5eKZZ8XQlLlP0pszgvJnumKjQo7axPpknLJDbqlUHODgmJbcGaeEl4w84/TwqOn0FWF+OaO+9MSGvOs2v7sT7HJJqnBX5RIuSONvzl/qy5oNNeMxgYp/7LC7oYY/tsfzqu7wBBrdz0IwktGEgH1F+h2wTHOvOx559VoLr7+1ZjzIZOVDKivsff/792ZlRqzovi/' +
              'r33FeaV0jNRghXS7+wpxdJ37dU1OqkAucJxkpOai63Y951SlBuBZQxzMsRCPPvul827pTJ62KGrfTNWSNbowLMeosTKZNRO/jZvrbJU6KKy3j4k6sYqO76QmGaHByJp4QnNpv3ADekGfoBz1TEAu+Wy1L4Rm3xeLZc8X1NcOIcm7WonNuSHZo6kSm0PSExtkbcyEfV5yY2puUFCM0VKYwM8IDoaEa8mpHxYdxMct26ctNHhO9d4PyQPqc/Cb2GST1GD0Ca7vPy266O+7dh8cdd0oxiwrXnijb+Q8JdV3mCySHZfd+LrzbnKgwTLHKKkWBQJinwuBLopkKGupMd2FqUgNRnihENtdzIy5gFId8ZaK1NjymI7UAEwNYGdDED8OKb3WCLilBrNapwtGeuFYyIKhzsU9/5E9Si1VKDW7mbIQGkgHGs+mnwXlkLYBueDjVb4Qmv97Phx7Pq2k5jIVZ4dkr8YzpUu6YqNCj5BClxTk5m+75AbdUqbmBqOlIoLjZHAgOViCAaKDSf1eeLZXRoTGDG9vrT4LP4lNNkmN6W4ZOHiK/t5kbsx1Y8RFWWH/YkYNjRcTpyyMbGPH1BnJFbki44TRIdgXtRgldQHc92iPmHO9+c5A593EKGup+eHHSfq4qUoNWLJsnZ6Dx75O1BNhlFWy7G6pAV9+MzpyPAQ+a3Ov8SgLqUEXGI710NO7pik47YL2kXNgxf50F2ql1OxGIDQv/5m60KCboyShMY1n/feDcsA9Smy6r/SF0Oz1nBOPh6TKBUpszgpIXqPp6WdsnIjIzV+r7crcoObm0PBoKZO9iQjOsWHJQTcVROeuD2ZmTGjwnKq9HZJ71PH8IjbZIjUYropr+8cJ90aNnLiu+duR60b3D7osygL8xWrOg7lDSsLuqjCBLodkMDUOiHgT+WFOGPs8CLyWDNkgNQCfv3u0FxZehdgmQ0WQGkjqCadFF3ljHpzSyLTU4LP/V70H9LFs8X6/RzgjagL1ZOlAqdlN2EKD4deZEBoz8Z1p' +
              'PJso2WiiGs4TXw/Kfs0Dcv77K30hNHs/q7ZpXyxVHg5K7tkByT1Dic2p06XLwZkRG0RU5saRG4yWMtkbCA4yOFh+QUtO1eNlVPW6ckW/HRkVGjynY94slhZ9i30hNtkiNZjHBNdmZtQ1IGtjX3umRmy4wdII5hz2HCtuRo6ZHXU9CMgW0vyJgEbXNDT4Gm/o6+tdBsScC8PLkyFbpAbMnL1ML+ZpXy+Gzicz/0tFkBpgfp5N4D5KI9NSg7lhcBwUZNtgyDnq1sx5zrv6Zeed1KDU7AbKU2ggGZi995/tg/J/NwXknHdXaqHBsRIRGjTMbqHBEGS30DRSDbRbaOqoRtotNKahtoXmiNdihQYy4xaav3TYJTR57UOyx9Mh2buVEpumSmxOD8geDTMrNgjIjSko1tkbp2sqIjjI4GjJqS69m1xbJkJztBI+PKPbv81+sckGqbH/osQvdhs0+naNQvWGmRmx4cZMJId0fGmccenzkesxccf93Zx34/NZr12jrFAzFA9MGGefA5FsViibpAbg84dY2NeM551oF0lFkRp7gVIExLe0e8i01NzZpps+DuTYjVlrDIFrS6c4m1JTzpQmNHdkSGgaO1kTCA0EA43mIQ8EZK/rA3J21xW+EJp924Vkz6dCkttCiU1jJTaNdkhe/anSNcNio8PIjZO9iRacsOR0vL5DmQnNP9TzOUg9nxv7ZLfYZIPUmOwHRsJ4CQsmNLOvPxMjNtyYkVaYJbU0UPhpXw8CSxygNiQeEAxMJIjtMTcKJq+Lh3sWWESyM8Fmm9QAjChzr7kF6UykLqWiSA2uAz8T5riI0kbKZVJqULcFQcfEgF5F14N/nR51rnSGj1NqypHdKTRoNKt3Dsr+dwRkz6tDcsbby30hNFWeDMleT6ivNxdJ7qk7JLehEpt6U6XLQWUgNk5EsjdKcCIZnAOryUOPfFOmQoPnk6ueyXVfKbEJZafYZIPUmHqWkoawzpm3Iur6MzFiw40ZgQOxKg2IV/1z2kVdE+L+xz91' +
              'tvDG/ixefLOv82rJDB0xM+r4iAbntnPeTYxslBrw66hZUV0kCIw0K21ph4oiNSDZuppMSg1GCuIYJRXXo4sVw+fNuY6t/6D+WUkFSk05sTmQvNBguv1MCE1N1WgerxpN1LL887WQ7P2f8HpKTTst94XQ5D2u/gp5VEUzJTanKLFpsE3y6k4uU7ExYQRn8P7V5ZpuS7XQnNs7VmhQb+QWmpPUc4oRGvV84gkNnkWuuv/r1DGzUWwqutTgL0o0JKUVAdsT0WVixIYbM6tsk4s7OK/ExyuLgka4pBE7ECGTDUKjHq8Y2eBu5BDHnPyg825iZKvUAAx1d8+Ei8LxeHVIFUlqMDmjOS4CBbrxyKTUYM0lHCNeEbAZGWUi1fWZKDXlQKaEBuKRjtAc0yksFQd3UHKgpKbKRSE5veMKXwjNPo+orw8FJPfi7ZJbf5vknqTEpvZk6fr30z1lJNPx7uktykRoDnw5Vmj2fix8v9d9GMw6sanoUoO1Y3BNWIYA2ZKSAo2NfQ/pjtiwgXCYxhONQSJAFryWMcBqzl7Y6X40AomAoeX2sRHJNrrZLDXg2/7jPdcWKimrUJGkBgW45rgIrO4dj0xJDdYHM88MQ+W9/j8h3PPpYPHPVKDUlDEVTWjMKKO/PhqS3AtVnK8E5fXlWS80e2IkFKSmTZHknq3ERklNbp0tkldzsnQpB7G5s/3wchWavdoEZO/WAWn2XiCrxKaiSw1W8HVfXyKRzLT8pYHaFnPcZJYRMEsE2IEskteChmZ9HMhTor/0cRz38RHxMhVusl1qAFayRibPvo+7237oWX9VkaTm9Is6RI6LQJdaPDIlNR3fHRR1nEQDdUyFhclnQCk1ZYiX0GA9pt0tNKY7I6+lkppzVZwdktNeXZb1QlPlwYDk3a++3qfEpvFWLTW5tZTYnFC2GZsvjzl/twhNlXuKJK/FDrmmS/aITUWWmtVrNuu/KLFcAGaWxQKP8eKmlu9E3Uc6IzZsUEhpjpnMkGk0oGbUlh2Yndhm9O9z' +
              'I+8lOkoKQEjcjTkCzyJR3FJjZmvOFFgnC8ctS6kB3T4dFnUfCAz/d4tNRZEaXJd73p3SVu/OlNTg/zf2R3bQ/X/IHe45a5KdsRpQasqIii40EAkIRN6NSmrODOhh0ae9sizrhQaxRyslNaqxz22gpKYGokD2rD6pzDI2j7TosduEZo87dkjeLdulWceirBCbiiw1b73/o76eRBerdBfOPvfat8476WFPHV9S91FJ2BPpmcBcK3bNDwpc8ToEZfbcFc6riWHWh7IDhdOJgsbV3jdTKz8bTEGq1yrjJZGK1IBO78VmINyTEVYUqYFwm2Mi0FVZGpmQmumzlup9E536AJkZe6TZWZe/4LyTOJSaMiBRocEMv5kQGjScqQgNGsy9n1ZScFl4npfc03bIaS8vzX6hua9IN/q5tyixqVMguScUSI6KvGpKbP6WWbH54cC68u8em3er0OTdtF32vH6bNHtlR4UXm4osNWYEUaKLQiLrYI/YQNFsSbUVyYDzm2O+8tYPzquJgYbZ/Rc5Al0AADO5mteuvqWTfi0ZcI/2cRHJLqJpixG6RDIJxBLHvfmed51XSidVqQEYNWbuxYQ9kqyiSE2v78K1YiYS+bnKhNRgAU3s684WxsO9uviCRd7LhJQEpSbDFHoM2y5voUGDmYjQ7PNMSDeauUoScs8OD4fG6KGGLy7RQoPJ+xIRGpzTLTRHq8baLTSmwbaFBo23W2hwXW6h+YuSGbfQ7NU2Vmj2vDcsNFXuLpK97tqhG/vcE5XYVFdRbbPkHTsho2Lz0mXPVgihybtGxdXb5KoXK7bYlIfUYJ4ZZCPizcTrZsYfyf1FaXjqhd5R9+K1onayYJSNOR4W1UwWr5l/j6jVSnbsCOjuHvPauIl/OnskzslnPxV1XMSAnyc77yaGPVkguvvWb0i8+6o0IGo4rpG4REhHasCTz/eK3I8Jc/6KIjXIXJlj4pmjeLc00pUa/P8zxb/JdM26M6CYDTkZKDUZ5uNloZSEBnPG7A6hgTCg4dy7' +
              'VUBPXmdGDp363OKsF5q97ww3/rlXqntSQpNznIpjldhU/V26ZkBsvjmssVzQfWOFEZqcy7dKzqVb5aoO2yus2JS11GBtHmRPSpsd181jHZL/ixKg+8a+l1RHbNjYCxDi38mCFP7fjo3tJsJfzZj8DP9GoXAqoCDafVzMSpwM7kbn4y+GO++kB+4bEoBjljbxoE26UgMJbvPEp1H3hEB9SEWQGqxjZddCtW0XvfRHSaQrNT8Pm6b3S/ZnzZ0BrXpSm6QyoJSaDLIpsFMempEZocFIpEwIjS0TJQmNEYXc25UA1AuPGkKBbUMlNlkvNM13SJXbtkvOv7doocn910YdeUf/Ll0OTE9smj8+tMIJTe6F6j7P2yJXPa3EJljxxKYspQaNC/5SRxdJaZOi2eAvyiNrtdbXkkqxL9bRMfeS6ogNG2RnzPGQtUmFDq+Gu2FKip+GTnO2TI5rbnsr5lioLUkGkxUzgeeXiW67zt1+0sdrmMC6RjbpSg3Az569CCkCImGWltidUgPRNsfDkOpEfz7TlRp0AWK/VIp93dkvZG8SJVNSg98F6f5fTpQKKzXjNxZnrdAYSdiz2XYtNLk1VZxYIA2eXZz9QnOripvVfZ1ZoIUm559KbI7eKHscqcTmgNTE5tXzHwt/Ji6hwXNyCw3qm8pTaHLPUV/PLJSrntxW4cQG83zYv3AQmZIaZGdwvGQzB78Mn6H3SzV7Yc5rIpVf4jamLgSBkUqpgIyVaazdgeedTBebjVm/x45nXu7jvJs47jlTUKSdDvMXro7U6mAEVDJkQmoA5BhD1O37MhmS3SU1/X+aHDnWXofdKsNGxh/GbZOO1BQUbNP3jMC/k8WdAcVcQImSCanBPqixQ5dteVBhpWbchuIoobl7XGaEBsW6mRAaSEM8odnnviLZF3JwgVOHcny4DqVB+8XZLzT/3SZ73KgEoGG+FprcI1UcsVHyjkhebL4+oqmc031zykKD5+MWGiObttCYgudUhCanqYpGBXLVwxVLbMzkdnac' +
              'dGb6UoNRP2hAsKxAMrU0wPxFmeoEeqgJsWeaPfOy5513UsPOhkyautB5NXlMl5o7MEIoVVo91iPmeM1bf+C8mziQEDR45hjoFktWRg3z5q+Smo0f08fBaKpkhc1ITWlrXyUCupuuuqVj5L5M7A6pwSi6g6uHVxlHHU2ysoefPXMdiGSkBmKPfdLpjrUzoPseeXvCq6OnKzX4/YE/cDLVLZoIFVZq/sgvziqhsUcOGaHZs6VqSO9UEnBaoRaaXHTZHLNZ6iuxyXqhUTKQe+1WqVJb3ZMSmtzDN0rOYesl79Cx0uWviYvNzU+O3C1Cg3twC03uxR5C07hAC03OKQVSpUG+XPXg1gojNv/r9H3ULxwERuukmjnAfvYIlGR/cWNuDPzCRKODJRJS5fo7OkfdE+oYUuW4Bm0jx8FEb6mCYtC9D78t6rqwpk4yk+XZ4FmfdkH7qOMh6p7xhLNFcmBpB/ciixj5kkgRK0CXFbp3zBBgNIKJNnwG3JN5RpmqvcBf9xddt0tMEMlIDRYJNfulKjUQkn+ccK8+xl+rttAZ0mSxR+EhXurYz3knPnimjS4MLyNS2gR/8fjgk6FR5+/+2TDnnfigZsjeL5nPFdf+wJOf6SHvqf4/SYUKKzV4IE9O8xaaG4dlRmjQaJal0JhGNPcmJQC187XQ5DhdNic/szirhabKddtkr2bqvq5QIlB9kxaa3ENV/EOJzSFjpGsCYtPh8hezSmhy6qlQEnd92+R+2ZcFaITcs5qawHwsm/O36m3w/yhe4JcN1irq8/24qL+K8YsU7yeD6btPN7vinh8GGY1UcHfPQRjSySC4MyupjKYyeGXZEMiyQA5TATVDmPXYPh6yClinCF1S6ALB8gxYwwqTEs6as0xPfHfDnZ0jWQgElpNIZP0qNxOn7MpGpJPBcoPPDHOsmGMnKjX4+Tf1XWa/ZH6mUUuGeiqTOcRzTKZo2gbLKJjrQCQ6UeIQpzsXn2M6XXpz/1wZdf46TR9PSDTcXYD4mUkEHBuTUWIf' +
              'CHd5UmGlBvy+rjghoTGLSKYrNJCKTAgN5MA0opACNKRVVAOaU82pQTkq3F1T/+nF2S00V6nXrlSvXaxEoOoGLTQ5h6yV3IPWSt5BY6TL/iWLzYsXPZOVQpNTU8WJm6Rrz/TT66mAX8rTZi6RW+99L+qXTaYjmXoBMHDwlMjKyxh6mupf6rg/d1cPusK+6DM6oQYJ26CroEv3n2MaeAQKn9HAYJK7ZAtqUexosiH4yz3ZbBS61tBImS66kgJ1OsgOJJspAcjMoJvCHqGTaKDwFd2GyTT8AI0/sgj2ytWYpBCF7KkKmhvUkpjMVqJS467PQpQ2TQDufcr0xXpBSJPlg6RDQpP9eTHgDwx0C9vXgYxYaXMSQUDtTCPq1VLFjJ6yAyvPx/sZXrp8vf4c7X1qN3lcizCWEfEKdDOhjg3ShO2x0GuyP0/pUqGlBvy4ojjrhQa1GzkQAjT+qEFxumuQ2WjQbnF2C42SgiqXqThficAR67TQ5PxdiY2KvL//psSmse+EBpmpGhfmOz+hZc+osXP0L3J07bi7GMoikLJPBEzkhfWU8AvM3YiaDAHeb/lQ/FmFWz/2iZY0bIu5bezj2IFiQ2xT0orfyDThvF77egWuedGStc7eiWFGv7zc6XvnldJB1gOFpe7zJxL4zBNdXdwGmRiMpEKGw87C2IFrwmeHe0KDmUqjjRqgo2rfL4eeeG+JgQUWS1vFOhHwHCF88aTmvkd76CxIjUaPet4zsi4Y0YVt8DMHwUSmCj+r+NnD84aUI1sFscHoslTpO2CC/r9kZN8d+PnD/SAbYv8c3vVgdz3/kLu7EwE5wvXi2lFLVRLIdqL7EcdGRrckycVnh+5eM4IP3c/Y74qb3tTddV77JBNYzqG8qfBSAwYtLU5YaKLWDUpDaCARmRCavf/rCI3TmFY5ozAiNMhs5B68VuopsYHQ6MY6g0KT4yE0Oa1jhQbX7BYaXLtbaPKu2R4jNCiszbtEfb1oi+Q1VSKATM3flNj8bbXkHLha8g5UYrPf' +
              'LrHxg9DkHKfiXxtl9MTEhzqnA/5ix+Ru5RWr12x2zhwfDNH02t8d4yfNd/bwBt0WXvuVFCV1ISH74rV9vEg2pY9sC/azl0ooDaTi3edNJtJpWA24bsyAjM8C3VAoCC7POodMAbGJ9/M0YfICz2dYWmA/POdEf/YTAdlKr3N5hf3zlOg9xBsijc/Xa5+SwtRezZy9zPP9VAKfU3lnaUBWSA3ov6Q464UGjWmVK5QU1NscERpkNpDVOOnJJVktNHtc4MhBQyUBfw8LTc4BKvZfKXn7j9Ri4yehyam6UXp9n3ofNyGEkMyTNVIDflhYnJTQNMiQ0GCdpEwJje6qQTdUtQ0RoQlnNRbLzT3zs1toIAdnKzmoqxp+R2hy91spOSpOr/26/Ed9Xn4RmpyjKDWEEFLRyCqpAX0XFKcsNGa0UbpCg0ncUhUaiAAa1NxzCyX3iPVhoTlgibR7ZaS+v/t/zHKhgSBgXpfj10eE5l81vtBpyPXbdso138YKDYa3Z5vQ5By5UYaOKp/JpAghhCRG1kkN+O7P4qwWmirnOw1qE9V4HrwsIjSGBwdludAoScg9TUlC1XVy8LEDo2aSXLd1p1ylPrN4QlP1jVih2ffFWKHBZ+IWmpzbw/dS1kJzTMNNu6W/mBBCSMlkpdSAb+YWpyU09l//6QiNLQVJCY2SgL3PK5RvhnrPB9FmYJYLzakFcvrthbJxU+y03hCbK78qH6HJca49SmjOcq7XFpqTExeanMM2yCtvJz9dOSGEkLIla6UGfD2nOKuFpv9v8UfPPDAge4Wm7g2Fsqmg5EwGxObSzyuu0ORUixWa3MM3aKE59+p8qYgLXBJCSGUnq6UGfDWrOG2hyVPikAmhwRwumRIawwP9w9eWTUJT5/pCWbux9Dkv1m7ZKRcqIc0moWl6Wb5sUddNCCGk4pH1UgN6zijWQmPqNNIVGkhCJoTGNKipCo3hwR+KfSc0BojNuR9TaAghhKSPL6QGfDat2JdCY2j9fbEWGlyjW2jQ0LuFRi+m' +
              '6RKaPZUAuIUm94ZYocE9uIUG9+EWmipN0hMawxolCk27U2gIIYSkh2+kBvSYWhwRGnRpZEJobDlIR2j2OTd1oTE80DfkO6ExrCncKQ3fp9CQikswGJSVK1emvAYQIaTs8ZXUgI8mFftSaAytvgv5TmgMq5XYnPgOhYZUHDZv3ixz586VUaNGSb9+/WTAgAHOO7uHUCikr2nTpk3q53KL/p4QsgvfSQ3oNnFnlNDgr/9MCM1eSgh2p9AY2nyjrt1nQmPQYtOJQkN2P8uWLZPvvvsuKkaOjJ5TqrxYu3atjBs3Tr7//vuo68H348ePl1mzZun3Cans+FJqwHvjd5YoNCi6zYTQGBkoT6ExtP465DuhMawuUGLziiU0zn1RaEh5smPHDi0TU6dOjUjEtGnh1YzLC0zwOGPGjMj5IS7Lly+X9evXy+LFi+XXX3+NvPfjjz86exFSefGt1IC3x+3crUIzYHTZCI3h/t7qHnwmNIbV+UpsnitBaK6NFZocMzLLFhp1nRQaki4LFiyIiMOiRYucV8uH2bNnR86N63AD6Zk0aZJ+/5dffnFeJaTy4mupAW+N3RlXaJANyITQ7GFJQHkIjeH+L4O+ExoDxKbm00UZE5rcGh5C808KDYnP5MmTI2KxYcMG59Wyp6CgQPr27avPO3ToUOfVWFBXgyzNsGHDnFcIqbz4XmpAp9/C87z4TWgMrb9Q9+EzoTGs3qzE5jF1b+UgNGdQaIgHw4cPj0gNRkCVFyhQNuf9/fffnVe9+eOPP+S3335zviOk8lIppAa8Naq4VKHJUWKQbUJjuL9nwHdCY4DY1HlA3ReFhpQz6N754YcftFj8/PPPzqvlw5QpUyJS079//3IVKkKylUojNeCt4cVJCQ2EIBuExtD6s4AWmrybYoUGo7TcQqPFwCU0RhCihEZJwu4SGsPqTTulRislaxQaUo5g2LQRi7Fjxzqvlg+o3zHnRiATwyHchMSnUkkNeGtYyJdCY2jdI+A7oTGs3qjE5m51DxQakmEw' +
              '0mnevHm6LmXgwIEyaNAgPbII3T5GKtDFUxLYH++jWBf7o8YFQ63TqcHBMd1DuDFfDl5PFtTnoDYI2SbMtYOvGMm1detWZwtvMPrL3m/w4MF6NBZkz4uioiJZvXq1LnAeM2aMvl4Dsl6YYwdD5fH+hAkT9PPGcHQ3uEdI3ejRo/WzhMytWbNGf4/rWbdunT6ezbZt2+TPP//U3YX4DBD4DBcuXBg3y4XjYBsM1zefHQQS90Gyj0onNeDtIaGkhcaIQEUWGkOrj9R9+UxoDFpsmqt7oNCQDIAGbebMmXpiPQSGTKOxhdTYMoHAUGov0EBjXwgNRigh0DhiH0gJGvJUWbVqVaRY2ASOjdcTATJgxAxCAFGAfOF68RokJRAIOFvvAnICKcE2Q4YM0Y0+7gv3iNcgOMhcofFHETO+nz9/vn7PDoidAWLlfh9hjyjDtUCE7HuGULmzVgjIDTCfoXkd14XvISnmNXTfQdDc4D7Ndrjf6dOn63vB9/g3yT4qpdSAjr+EfCk0htbdA74TGsPqDcVS4xZ1/RQakgZo8CExaMDw1c6A2I26CTTKbpBlwHtoSO1sADI0Zr94I5cSYcmSJZFj2YGam3jdUXgP0oFtITJ2ZgNZKXMczMNjA7GASOA9DBe398NzgSCYfe3ALMcQB1sm5syZ4+wZBsdGlgUyZbaxs1nIttj7IyCYkBwIlZExyCKyTPjMzPbYzi2QmMvHHAe1UYWFhc47YczINvsZIEOD1yByJPuotFIDOv4UTEloIAEVWWgMrT4o8p3QGLTYXK/ug0JDUsRICzIDXus5oQE33T9oTO3GHZj5a9CYesmFEQNEad08pYE1p0wGwQ7cQ0lrUSFLYrZxs3379sgx3JP2mQJlnM8ri2NLBzIi2B5SaK7DzpqUlFEqbUSZW+SMHEFi0MWE9wGyT3jfS1gMdhcisnAGfL7m9aVLlzqvhmUQr0G+SPZRqaUGvDUo6EuhMbR6r8h3QmNYvb5YajYrlNw6SmQoNCQJIAmmQcvPz3de' +
              'jQaNdEnzxKAhNl1MEB782x12F4o7Y5EKEBGTebFj4sSJzha7QNbEvI8G3+v67GOYBtyWHYiKF7YkeImEneEqSebMiLKffvrJeSUaPC9zDK/7A/YyFugCLAlbkGyB27hxY9TryBIByCvuiwuXZieVXmpAxwFBXwqNodU7Smx8JjQGiE2Ny9X1W0KTe0ys0OQeSqEhYdBYmSwKJKEk0JVhGj13w2rPIYMuGnRjxAuveo5UQINrN/gmTObCYMQC2Rav63GHadCRWTHHLKmmBDU2eB9ZLK+GH6KC99FN5QVEx5yjpBFltjh5dfvhOdhi5pVRMkBazXYIiBvAPqY7CwGxYXYm+6HUOHT8IehLoTHc32WH74TGsHpdsZx0ZX5coTmvGYWGhDE1E4h4GRT7L3zUoNhg1A5eR23I7sCWKoTdxYQskskSQbiSwc5gQSzc2KKHbiY3EAXz/ogRI5xXo7HP4TXyCZiCZK9uP2Bnokr7DPA8zLYIdDsZ7JobEyh4JtkLpcaic/+g57BtSMB+FxTKwDHZKTSGF3sWyb7qPryE5uLWW2RjfvY2+oVKWJ7vvF2ObqykxhKaE5tskk7vb1e/2Cg0JAyKZk0Dhi6MkrAXksRwYgMaWfMXPmo6dhfIcpjrQ9bCYHerJNvthXszWSwc086AQA4gKngP0uFVR4SFNs25UWvjhZ1p8hpRFq/bz2DLCGp84oGuJLOt/ZwMkCx38fOKFSucd0m2QalxMWpmSK57brvso6QGQrPfRYVy96vbZdZCf0x6tbFgp3TqVSQ3PbtNbmq/TR7quF1mzvfPhF7FxTtl6qygTJoWlJmzs1tCSdmAYlHTeHktEmkwRagI02UB7AJTdMVkGtSHoEuoNOxMkr3uk50JKUks4oH9TYE0jovh1MhemOwJnktJ3T0YMWTOXdKzNQXMCK+upXjdfgYUC5ttIGHxsGtv7EJhG3SJmW4zBO6VZCeUmhIIhXZKUWCnbiQJIf4Bw3dN4xVPHsxcNahLcWP/ZR+vngMNtFf3' +
              'STzQkKOBLW0/e1g2skoGu4aktOHk6MaxQZYEI4GwH8QGXTu4f1wPnhVqg+Jdl/1sS6pPKa1rCec3x3B3+xnsjBDCawSVwYy0wvlM4TI+M2S0bJDRMQXMCBYKZyeUGkJIpcJuNCEuXlJiN5pe3Rv2KCSvbAIaa2RS0JAmO6uwKZK1u7zc4JpR2Irt3PeAc9uNsz25nQFdR2aiOSMEaNRNETDuyc5OJYo93BsZHxtcF7I3pXUt4brMMUqa1RfCYboAvc5lKGmEFI6L/d2YLJJ7mDvJHig1hJBKBUb62A0i5qlBNwgadzSO9pBkBKQB3Rb4i99gd7MgUGuCBhSZDEgE5ACNN2o/ksWcH+f16p6xJ6jDObzmgrG72BBorLEdrg9FxqgtgdDY2Qq7hgj7Q0DQ+GMfSB62RRbIq5bGgGdpjoEsD2pTkA1CdxG6iYzQIPA88XzsZwSRsruBvIaMG+xiaUiIW8JwbnM+ZJnszIvpurOzSbgvk0VisXD2QqkhhFQ6zMR5XoH1gpCpsF9DVsEeNo2sg12o6w4co6T5b0rDFgPIFwTDLFMAObHneCkpC4RJ6uzJ/9yB49gzKAOvpQhKCgiLV5G111IJCMgF6nvc7+NeIDwQDlyTyT6ZwHPH/SPc0oLPwEwUiECXIMQMxzPPEOfF925MTQ7Oh8wdZBbnwmvIlOHYJDuh1BBCKiX4Sx7ygYYM9SNoVE3NCP6yR6YEjWS8yfkgG2jgTQOKbinITzqNIkZnIQuBUULIANnZDQSyNJCDeLU8ANKCIdPIyGA/CATuMV63FrpozPaJBDI4NrhvXDueHd6HeOGYRkjwPJENwVc8a5M9wfu4tnhhZ1psULeEz8vUOeF54Ryox3GLmwHPBdJnRnMh8LPg1VVHsgtKDSGkUuMlIGhAkxGTdCSmNHBsNPpYGbs0kSmJRK8PggAhQGOP7ipkY9A9hCwRshsQLrtuJt6ij17njFfQmwlS+RywTyr7kYoJpYYQQojODCHL4a4/cQMBMN1EyLgQUpGg' +
              '1BBCSCXHrDaOLpnSshaYp8cUWruHRROyu6HUEEJIJQZZGSMpqIGJl6XBe6YIN9nZigkpDyg1hBBSicFQZnuIO0Z+edXuYPizGaqOzA7rUEhFhFJDCCGVHHsmYIQZDYZCYCyKaeaOwbBn9yzEhFQkKDWEEFLJQdYFi0tiZJOdtcEwcLyG4dGpzrtDSHlCqSGEEBJFvLoaQioylBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQHyDy//O30PvAjFjdAAAAAElFTkSuQmCC', width: 160, height: 50, border:[true, true, false, false]},
              {text: `\n\n${this.xtituloreporte}`, fontSize: 8.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n${this.xrecibo}\n\n`, border:[false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos de la Póliza', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia de la Póliza:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fdesde_pol)}`, border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fhasta_pol)}`, border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, '*'],
            body: [
              [{text: 'Fecha de Suscripción:', rowSpan: 2, bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.fsuscripcion), rowSpan: 2, alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, false]}, {text: `Sucursal ${this.detail_form.get('xsucursalemision').value}`, border: [false, false, true, false]}],
              [{}, {}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.detail_form.get('xsucursalsuscriptora').value}`, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: 'Vigencia del Recibo:', bold: true, border: [false, false, false, false]}, {text: 'Desde:', bold: true, border: [false, false, false, false]}, {text: `${this.changeDateFormat(this.fdesde_rec)}`, border: [false, false, false, false]}, {text: 'Hasta:', bold: true, border: [false, false, false, false]}, {text: `${this.changeDateFormat(this.fhasta_rec)}`, border: [false, false, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 50, 80, '*'],
            body: [
              [{text: 'Fecha de Emisión:', rowSpan: 2, bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), rowSpan: 2, alignment: 'center', border: [false, false, true, true]}, {text: 'Tipo de Movimiento:', bold: true, border: [false, false, false, false]}, {text: 'EMISIÓN', border: [false, false, false, false]}, {text: 'Frecuencia de Pago:', bold: true, border: [false, false, false, false]}, {text: this.getPaymentMethodology(this.detail_form.get('cmetodologiapago').value), border: [false, false, true, false]}],
              [{}, {}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.detail_form.get('xmoneda').value, border: [false, false, false, true]}, {text: 'Prima Total', bold: true, border: [false, false, false, true]}, {text: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal), border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 150, 70, 60, '*', '*'],
            body: [
              [{text: 'TOMADOR:', bold: true, border: [true, false, false, false]}, {text: this.xtomador, border: [false, false, false, false]}, {text: 'Índole o Profesión:', bold: true, border: [false, false, false, false]}, {text: this.xprofesion, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xrif, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, 24, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdomicilio, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestado, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 40, 20, 30, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudad, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: this.xzona_postal, border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefono, border: [false, false, false, true]}, {text: 'E-mail:', bold: true, border: [false, false, false, true]}, {text: this.xcorreo, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [80, 280, 24, '*'],
            body: [
              [{text: 'DIRECCIÓN DE COBRO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 50, 24, 50, 24, '*', '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Zona Cobro:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, '*', '*'],
            body: [
              [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: `${this.detail_form.get('xnombrepropietario').value} ${this.detail_form.get('xapellidopropietario').value}`, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: `${this.detail_form.get('xdocidentidadpropietario').value}`, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, 24, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.detail_form.get('xdireccionpropietario').value, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('xestadopropietario').value, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 40, 20, 30, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, false]}, {text: this.detail_form.get('xciudadpropietario').value, border: [false, false, false, false]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('xtelefonocelularpropietario').value, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('xemailpropietario').value, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL INTERMEDIARIO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, '*', 40, 30, 45, 30],
            body: [
              [{text: 'INTERMEDIARIO:', bold: true, border: [true, false, false, false]}, {text: this.detail_form.get('xnombrecorredor').value, border: [false, false, false, false]}, {text: 'Control:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('ccorredor').value, border: [false, false, false, false]}, {text: 'Participación:', bold: true, border: [false, false, false, false]}, {text: '100%', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL VEHÍCULO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [30, 100, 30, 100, 35, '*'],
            body: [
              [{text: 'MARCA:', bold: true, border: [true, false, false, true]}, {text: this.detail_form.get('xmarca').value, border: [false, false, false, true]}, {text: 'MODELO:', bold: true, border: [false, false, false, true]}, {text: this.detail_form.get('xmodelo').value, border: [false, false, false, true]}, {text: 'VERSIÓN:', bold: true, border: [false, false, false, true]}, {text: this.detail_form.get('xversion').value, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 30, 30, 50, 30, 50, 60, '*'],
            body: [
              [{text: 'N° DE PUESTOS:', bold: true, border: [true, false, false, true]}, {text: this.detail_form.get('ncapacidadpasajerosvehiculo').value, border: [false, false, false, true]}, {text: 'CLASE:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'PLACA:', bold: true, border: [false, false, false, true]}, {text: this.detail_form.get('xplaca').value, border: [false, false, false, true]}, {text: 'TRANSMISIÓN:', bold: true, border: [false, false, false, true]}, {text: this.detail_form.get('xtransmision').value, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [20, 45, 80, 75, 70, 70, 50, '*'],
            body: [
              [{text: 'USO:', bold: true, border: [true, false, false, true]}, {text: this.detail_form.get('xtipovehiculo').value, border: [false, false, false, true]}, {text: 'SERIAL CARROCERIA:', bold: true, border: [false, false, false, true]}, {text: this.detail_form.get('xserialcarroceria').value, border: [false, false, false, true]}, {text: 'SERIAL DEL MOTOR:', bold: true, border: [false, false, false, true]}, {text: this.detail_form.get('xserialmotor').value, border: [false, false, false, true]}, {text: 'KILOMETRAJE:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [20, 45, 30, 50, 50, 140, '*'],
            body: [
              [{text: 'TIPO:', bold: true, border: [true, false, false, false]}, {text: this.detail_form.get('xtipovehiculo').value, border: [false, false, false, false]}, {text: 'AÑO:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('fano').value, border: [false, false, false, false]}, {text: 'COLOR:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('xcolor').value, border: [false, false, false, false]}, {text: ' ', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DESCRIPCIÓN DE LAS COBERTURAS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: [
              [{text: 'COBERTURAS', fillColor: '#d9d9d9', bold: true, border: [true, false, true, true]}, {text: 'SUMA ASEGURADA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'TASAS', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: '% DESC.', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'PRIMA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: this.buildCoverageBody2()
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: [
              [{text: 'Prima Total', colSpan: 4, alignment: 'right', bold: true, border: [true, false, true, false]}, {}, {}, {}, {text: `${this.detail_form.get('xmoneda').value} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal)}`, alignment: 'right', bold: true, border: [false, false, true, false]}],
              [{text: 'Prima a Prorrata:', colSpan: 4, alignment: 'right', bold: true, border: [true, true, true, false]}, {}, {}, {}, {text: ' '/*`${this.detail_form.get('xmoneda').value} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimaprorrata)}`*/, alignment: 'right', bold: true, border: [false, true, true, false]}],
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'BENEFICIARIO PREFERENCIAL', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*', 20, '*'],
            body: [
              [{text: this.xnombrecliente, alignment: 'center', bold: true, border: [true, false, false, false]}, {text: 'C.I.', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadcliente, alignment: 'center', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL RECIBO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [50, 50, 160, 100, '*'],
            body: [
              [{text: 'Recibo N°.:', bold: true, border: [true, false, true, true]}, {text: this.xrecibo, alignment: 'center', border: [false, false, true, true]}, {text: `Vigencia del Recibo:  Desde:  ${this.changeDateFormat(this.fdesde_rec)}  Hasta:  ${this.changeDateFormat(this.fhasta_rec)}`, colSpan: 2, border: [false, false, true, true]}, {}, {text: 'Tipo e Movimiento: EMISIÓN', bold: true, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: [
              [{text: 'Total a Cobrar:', colSpan: 4, alignment: 'right', bold: true, border: [true, false, false, false]}, {}, {}, {}, {text: `${this.detail_form.get('xmoneda').value} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal)}`, alignment: 'center', bold: true, border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DECLARACIÓN', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'En mi carácter de tomador de la póliza contratada con la mundial de seguros, c.a bajo fe de juramento certifico que el dinero utilizado para el pago de la prima, \n' +
                      'proviene de una fuente lícita y por lo tanto, no tiene relación alguna con el dinero, capitales, bienes, haberes, valores o títulos producto de las actividades \n' +
                      'o acciones derivadas de operaciones ilícitas previstas en las normas sobre administración de riesgos de legitimación de capitales, financiamiento al terrorismo y \n' +
                      'financiamiento de la proliferación de armas de destrucción masiva en la actividad aseguradora. El tomador y/o asegurado declara(n) recibir en este acto las \n' +
                      'condiciones generales y particulares de la póliza, así como las cláusulas  y anexos arriba mencionados, copia de la solicitud de seguro y demás documentos que \n' +
                      'formen parte del contrato. El Tomador, Asegurado o Beneficiario de la Póliza, que sienta vulneración de sus derechos, y requieran presentar cualquier denuncia, \n' +
                      'queja, reclamo o solicitud de asesoría; surgida con ocasión de este contrato de seguros; puede acudir a la Oficina de la Defensoría del Asegurado de la\n' +
                      'Superintendencia de la Actividad Aseguradora, o comunicarlo a través de la página web: http://www.sudeaseg.gob.ve/.\n', border: [true, false, true, true]}],
            ]
          }
        },
        {
          pageBreak: 'before',
          style: 'data',
          table: {
            widths: [165, 216, 50, '*'],
            body: [
              [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjUAAADXCAYAAADiBqA4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEEdSURBVHhe7Z0HeFRV+ocTYv2vru6qa19WBZUqgigI9rL2gm1dK4qigih2RRHrWkEBG6ioWEBUUIqKgBQp0qsU6b1DElpmJnz/8ztzz3Dmzs1kWkLm5vc+z/eEzNw+IefNd75zTo4QQgghhPgASg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqamkFG/dKtunjpfCX/pJ4Y9fS8GAnlLww0dSOOgT2TK0l2z9ra9snzxEgmuXOnsQQgghFRtKTSWgeMcO2TJliqz7sqcsf/YJWfjfy2XBOXVk8YV1ZMkVdWXZtfVk+c31ZGXzk2Vly/qyunUDWd22gax55BRZ+3hDWffcubL5w/tky09dZceMYRLatMo5MiGEEFJxoNT4mI3DRsicO+6WSbVqy5TaNWT6yTXl' +
              'j1NrybymtWThubVl8SV1ZOlVJ8myG+vJitt3Cc2ah5XMPKFk5ulTZf2zkBr19QUVL54WDvXvDZ0ul63DP5Tiwg3O2QghhJDdC6XGZwTzC2Tpux/L+Ebny+gjj5ffjzlBJlY/UabU2iU1f57hSM2ldWXZNXXDWZo7ldC0qr9LaJ5pGJaX/50mG19tJBvfUF/fVF87OaH+veH101Q0lYK+7SWwbIZzBYQQQsjugVLjE7bMXSB/tHlahh9eV379ezUZcUh1+U1Jzbh/nSATlNRMrqmkpp6H1FxbT1bcoqTmLiU0bRrI2kdPCWdoIDSvOCLzdiPZ1LWxbHrvdNn0/umyuZv6t/qqv1ev431Iz+ZPbpftUwfIzuKQc1WEEEJI+UGpyXJ2hkIy/+WuMnj/E2Xw/x0nQ/Y/Tob9TUnNwdVl1OHHy9h/Hi/jjztBSc2JMq1eDZlldz8ZqbnN6Xp6UEnNEw1lfQcnQ6OEZlOXsMDkf6hkpof6+lkTKei5K/I/aSKbP3ZEB4LTqZHkf9pcgusWOldICCGElA+UmnJgc3CnzN5WLBMKQzK+ICQztxTL+sBO593UKZz9p4xtcpX8vM9xkRiy33Ey9K/VZPhB1WTkYdVl9FFKao49QSadeKJMrVNDZp5SQ+Y0qSkLzgnX1KD7SWdqIDVtG8i6J8M1NLrLCRkaZGaUtGiJ6aXim6ZS+K2Kvk3Cof5d0EfFV0pwlPBAfpDB2dj5TNk2rqfs3Jn+fRJCCCGJQKkpI/JDO+VXJTAdVwWkw/KAPLs0IO2XBKTdYhULA/LUgoA8r6L/2pCsLUqu4YcoLHyzm/xyQI0ooUEM/ouSmv2Pi+mC0nU1tWvIjAY1ZXbjmjL/rFqy6KI6srTZSVFSs7bdKbrrCd1JyLxs7t44nJ3p7UhMfyU0A8+XLYMulC0/XqK/6u8HnCUF/c4ICw4yOMjsvNtI8r+8S0IbljhXTgghhJQdlJoMU6yEY1RhSF5aGZDnVuwSmmcgM5bQPP5nQB6bF5BH5wbkkdlB' +
              '+X51SALFpcvNtsXLZdzZ18XITCTQBbXfcTLswGoyXHdBVY/qgjJ1NfPOrCWLLwiPflp+U7imBt1PyNQYqYGU6CzNV+GMDMRFi8zgZrJ16I2ybdjNsvXX28Jfh9wgW3++Iiw53zvZGyU3kKJN750t2yf1ce6AEEIIKRsoNRlki5KSD9cF5fkkhOZhJTQP/RGUtjOD8sLcoKzdUbLYbF20VEZUb+otM1bobM1fq+lszchDw11QGAUV3QUVrqtZclldWX7DSeHRT63DNTW6+8lITQ8lNeh26ndGODvzy7VhkRnRUrb/1ka2jW6rQ/975L36PWwTkZveSmzUMXCsbaO7O3dCCCGEZB5KTYYoDO2Ud9YGUhaaNjOCcv/0oLRT/16zPVZsEhUaHTHZmuNlXNXjZUI1ZGtqyIz6NWV2o11dULqu5raTZdW94dFPKBRGTY3ufkKmRkkNBAVZGp2hgdCMeVi2j28vOyY+Lzsmvahj+4QOsn3cE1pwtg5vruWmcMA54bobZG26NZbtYyk2hBBCygZKTQbIlNDcPzUoracE5fFpQVltiU1SQuOEXVvjztZMq1tDZjUMj4JadH5tWXKl1QWFYuGnndFPbzfStTG6+wlS89NluqsJ0rLj96ekaPL/pGj621I08x0pmvV++Cu+V6/jfZ29UdtjP521QTGxOt6asd10Nx0hhBCSSSg1aZJpobl3UlDumRiUR9X3q7ftTEloTLhra7yyNQvOdkZBXaukpvnJkS4oXVeDId3vh0c+oUgYmRojNcjKFE3rJEV/dJPAvM+laH5vHYE/v5SiOZ/IjhldwtmbsY/JthEtdB0Oiox1d9THp8u00R9QbAghhGQUSk0alJXQtJyg4vegPDK+SL5v+h9PYUkkzLw1ZiSUmWHY1NZ4ZmtahmcVxozCkS4o1NX0aaq7klAQvH1UK931pKVGCUxg4bcSWjJIgsuGhGPxAAks6COB2R/pbbAt6m10rQ1GSTliM3lsD4oNIYSQjEGpSZGyFpq7xwXljrHq' +
              '3/2Wy1fHnuUpLYmEKRo289ZEjYTCsgmnWbU1mIjvdle2plMjXQtjuqAwwgmZF9TO7Jj6hpaa4KJ+Elo+TIJrxkto3WQJrZ0owZWjwnIz73OdtdH1NkqGIEWQI4jNxh5nyNBF0yg2hBBCMgKlJgXKS2juGB2U5r8F5bbeS+WLqmd4SkupYRUNm1mG7XlrZjaoqSfjMyOhsLjlqhZObc0zDfVSCZFsDSbeG3h+uFh4dFvdvYRaGmRlIDUQmuLN86W4YIkUb5oXlpulg3W3lC02dsZmSa8bpN/GLRQbQgghaUOpSZLyFppbRwbllhFB+W/PxfJZ1dRqa+xuKF00bHVD6aJhZz0oM28NJuNbdU94JJQZ3m1qa/TQbhQMO9kadC8hG6O7n9aMl535C2Xnjo1SXJSv5Qaigy4p1NposTFdUabG5qsmMmJoR+mzKUixIYQQkhaUmiRwC037ZbFC8+T8WKF5eFas0Nw3OVZoWkBmXEJz6/Cg3KzixmFBufrDhfLp0U08xaW0iJq7xt0NhQn5SuiG0pPxvaik5q1GeiI9PbxbyQiyLbq2BgXDGPU0v3c4W7N+muzcskKKQzu02EBydLeUkp6iuZ+Fa2yUDOniYYyK6ttE8ns2lY9mTpTeGyg2hBBCUodSkyC7W2j+M1TFL0G5qPN8+SRFsSlpNNSUWruWT9BrQl1qTciHWYadId5Y3FLPW2OKhofeGB7ebXdDrRihxUZ3QW1bK8WFy6R4wwz9OgqKMVoKQ771pH3DbtbdWejWWtzrWnlxcYF8uS4oIYoNIYSQFKDUJEBFEZrrBgflmp+Dcs6rf8onR6UgNqa+Bqt4Y12oI3bV1+iZhnV9jTPT8BVKbJy5azxHQzn1NRATd32NHgGF7MzGWVK8aY6WnNCq0bpw2GRrMI8NJvHT3VDOHDaDh3TRz/SLNRQbQgghyUOpKYWKJjTX/BiSqwcGpdFzc1MSm6SHed/sDPN+5BRZ/2xYbPRClZ84K3Y7hcM6YzPxed0VhRobCIzujlIy' +
              'owOjoxb/EBkNhW2xD/Y12ZrVn18kz84v1DVJn62k2BBCCEkOSk0cKqLQNBsUkisHhOSyH4JycrvZ0iMVsfFYG2r8saUXDhux2fB6eF2oKLFxzV+j56iZ31sP94bgaKFZ0EdnaiIT8415OLycwk+X6QLk/M9Pl69G9o08z0+WU2wIIYQkDqWmBCqy0Fyh4vL+Ibnw26DUfniW9DgyTbE5bJfYTK6hxKZejeiVvJvFio17Yj69gvfgZuFRUWMfC3dHYckE1NDM+STc7YSvWE4B3U/I1BipsWYbntv7Vv08H5kTfp4fLw1RbAghhCQEpcaDbBCaS74PyaX9QnJO76Ac33qmfJyG2MRMzKfERo+IKkVs9Bw2pnjYLHpp1odC1gYT9GHByymvapHRMjP1DS08Zm0oIzV63holR8j+vD1uon6ebdXzfEA9xw8XVW6xCYWKZebsZRmJHTsCzlH9zabNW2T5yg1xY83azc7W5Usi17Y5f6uzNSEkGSg1LrJJaP7dV8W3ITnjs6D8q+UM+fiI5MUGhcNhsakuo7yGettic5VVY4PiYTMqCsO9Mesw1oj6NjwyCqKy9dfb9Jw0ekVvCI4SGS0zGNKN0U8jWkYWvIxIzWdN5Ldv20WEps208Hw+HyyovGKDBi7noJsyEnPmrXCO6m8efKqn5/3bse+Rt5e72BQXF0vNxo95Xo8dTz7fy9mDEJIMlBqLbBSaC78JyXlfh+TU7kE5+o7p8lGKYqOHervFxpWxiVnR+8EGsrbdKXoeG7345Xunh7ujeoUn6UOtjZaboTfqjIyWGCU5+uuIFmGhQZZm0IXhEVC9m+hMzfoPzpCnJqyOCA2eJZ7ju/Mqp9jsVPeMxrCoKCjz5q+Srt0HS9WT2ng2hogDj7lLPvr8V5k1Z5ls21ak98UxTFQGAoGgLFuxXj74ZKiccNojns8JUd7y0HfABM/r+L+jmsvjz30lE6cslLXr8iUYDDl7EEKSgVLjEE9onloUKzSm5sMWGjTCbqG5e3ys0Nw+' +
              'KlZobhwSKzRXD4wVmksgMy6hOa9XSM5RcVLnoBxxc+bFBjU2pnh4wXnh4d5YTkHPY4N1oh5vKOs7nKrrbDa+Hc7aIOMCSdFyg8zNj5fodaP0EgkIyAwyNBCa/k11hgfDuiFFkKPuPw+KEho8x7vUc+wyhzU2YOHiNXLI8fd4NpBDhs9wtiJgxh9LJe+Qmz2f1V+rttDdQeUBhLLh+c94Xkfbdj2drQgh6UCpUfhBaM78IiRNPw9JjVeDcuh/p8uHaXVFRRcPR0ZFNawVmccGE/Qtvf4kPfPwqnvDdTbojtJZGyyrgCLi7o7coN4G0gLBwWzEKCpWoYuD8RreU9tg2/wPT9cjqwZ83THqOUJo8AybjwlK5z8oNqDFA91jGsf9q96psxQkmuMatI15ViZefLOvs1XZ8ouSTa/zI1556wdnK0JIOlR6qfGT0DT9LCSNPg1J1Q4B+ccNmRMbex4bswDmgrNr6yUVUECs62wwSV8bZ3XvDuFaG90lBbnp5oySwtpRXzkZHBOQmc9PjwgNsjTI9kzqdles0PwWfoZYC6vTTCU2xZVbbHp8OSKmcazd5HHnXWJz8tlPxTwrEwdVaylbtmx3tiw7zrnyRc/zI55gDQ0hGaFSS01+cKd0VvLy2soi3wjNqZ+o+DgkRz4ekIOvmS7dD09ebGLmsXEm6DMre8+oX1NmNwqvFYUCYj37MJZVaO5kbVBEjDWjLLmBqOiaG3RNIRvzcbj+Bl/19+p1IzTI9Kx87Wz1DIs8hcY8vzemVW6x+eaH32Max5POfNJ5l9gYqTmiVis5rMZ9Mc+t03uDnC3LhjHj50XO1eDcdlHnRtzd9kNnS0JIOlRaqYHQ/G9+UB5QcvLEjG3y3LIi3whNw49CcnK3oBzcJiAHXT1duqUpNnpJBSU2WFJhghKbyTVr6AJi1Nlg9mHdHXVJHVl2jZKbm+vJqhb1ZXWr8CzEEbl5SckNam6QvXlLRRclMV2dUP/WMtOpkZ7YDyK0/oVTpd2QuSUKzQ3q+V2v' +
              'nt+rUyqv2Hw3YHxM41jvLEqNF8fWf1A/H9S0vNa5f8xzO7JW6zId7n75f9/Q50FW6Ot+42LOf+3tbztbEkLSoVJKjS00GDYMMXlgYqG0X1TkC6Gp3z0k9bqFpM67QTng7oD8/UolNoelKDZYUsFZK2rU4cdHFxDXDXdHYSFMO2uja21ucUZItQ5nbtAthfWj1j0XrruBuGCeGy06KvBvLTPqPUgQ6nPe6d0vrtCYZ/fKxMopNpSaxPn7cXfr53NBs/9JQcE2+duxd8U8u26fDnO2zizTZi6JnOO5176V0b/PjTov4tyrXnK2JoSkQ6WTms0uobFH2LQck+8boTnpg5DUei8kNd4Kyl9uDciBl6UoNs5aUZHVva06m4knhLujpp/sDPtuWkuv8o1aGz30+wYlN7edrDM36JbCEHBkbyA4GAoOycEkfia09CiZQXZn7aOnSN8uL5cqNHh2eG4vTah8YkOpSQyMOqpycHj0k8mIPPvKNzHPDsXEZTGU+sa7uurjY9j2+g0F8sfc5THn5udGSGaoVFITV2iUkNw5JiB3jtrsG6Gp825IanYNyXGvBWWfGwOy/8XT5f0UxMas7m3X2US6o6qFJ+qLZG0a1dRz2mDoN7qkMGFfJHPT/GQ9cZ/ummqjJKdtWHK06CiJ0f9++JTw6+r9X15+JCGhMc/t+d8rl9hQahIDmRnzfDBiDEAu/nL0HVHPDvFFn9H6/Uzx54JVEaHChIBg5aqNMef9Z902+j1CSHpUGqkpTWggJLcrGbllREBuGbrBN0JzYpeQHN85JEe9EJS9rgnJfv+eKe8dmoLYqHDX2US6o451sja1nFobPfQ73CVl5AaZm2XX1tPz2xjBQQYHkoOlF5DJ0aH+jdfQdTW0/f0JC83F/dTz+i4k7cdUHrHJRql5+JnP5ZTzno7EipUbnXfKjqXL10eeD85veKT9F1HPDoHRY5isMFPc9WB42P0e/7hFXwfYvr0o5rz7/fMO/V5pXH9HZ6nR6NGE4u0PfnL2Sox2' +
              'L37teRx3GDEEg36ZKh3fHeQZv0+a72yVGnP/XOl5XHd07rbrPrHPeHXeYSNnSf+fJuv6pU++GiHvfTxEF4Nj6HyHV7+Vp1/6Wp56obeefBEjz/D9869/pyetHDF6tl6qIt2fg42btsiCRWsSinTquXp9Nzbq/xQmeEwVzLDtdX3xorCw7EcOJkOlkJpEhcZ0dVz7c0BuGLReC82DkJkEhAbzp7iF5qZfY4Xm2p9ihebSH2KF5oI+sUJzZs9YoWnwYazQ1HonWmiOe0tFx2I59OmQ5F0ekn0vSENs7O6og6qHh307WRvU2pih3zPqhwuJjdzoYuILldxcVldnbyA46J7C7MSQHHRTRUJ9j4Lj4Y+2SEpoznMk8JlRIQlWArHJRqm595GPo6731bf7O++UHdNnLY2cDw2XARmTvQ+/Lep6EP0GTnS2SA80jHseeqs+5m33ve+8GsbrvJgxujTQ0K5bXyA/DZ0m1U55KOYYV9z0pkyaujChY7lB1xsaNfxcnX/1y1HHhXRBkhYvXafXIjNg7p32//tGGv/7Wcm1tjf7jJ0wz9kyeeYvXK3PCflseslzUcfe54jb5fZW7+ufnw97/ursEZa+C695RRd+29sj8MwhQD17j9Kyg8a/z/fj9PcvdeynPyPcB64b22Nixhvu7CxffTtG8guSX4vr869/k7pnPBFzHXZgZnBcLzJ6qeIeBYm6sVR5o+tAfT1H1b4/6ph2HHrivXLW5S/IJTe8Jpf+53UtgRUJ30tNskIDEcFyBZf0DUizfmt9IzRVVRzxRrEc+LASm0tCsve5M+Wdf6QmNu7uKDtrg1qb8AipaLlBMbGekRjz25wfrrvBBH66sBhdVM2U6FxTNxL4fuS9tyYtNHheZ30VkieH+19ssk1q0NAeXL1l1PXiL/+yXrph1Ng5kfPZf9UDt2QhTj3/mYxcE2YJNsfEkhU2XsPKV63e5LybGJg52t4fxdCZmnhx69YdUuv0XWtUISNTGpi52UicCSzZMWX6YmeL1MHn' +
              'gcyKOS4+03hg+y7df466lgP+1cJ5Nz5YWgSyc9UtHSNdh5AoLGORyuzTi5aslRMbRS/Vsddht+pMUiZodmunqGNDLk1WMFXw/Hr3HRszE/ct975b4Zfw8LXUpCo0NzgCcuYXQbmyzxrfCM1hr6t4tVj2vTckuReFZK+zZkrXVMVGBbqjorI2Tq1NpEvKkhsUE6NbCjU3mJVY190owUEGB5KDLA5ER8vOJeGvQ1s0jwgN1sByCw2emZfQoIuusXpejw/zt9hkm9R8P2hizPUixk3809mibEDjYc71aa+RzqthsNyE1xIKyECkA7IpKAzGsa68+U3n1V24GzmEW3xKAxMG2vujEc4kj3X4Uh8XApao5Jkshx0Q2WTvzQvIAY6HjEsi14Nt7KVEEpUaG3Rl2dkWiKP7ZygR3BNlYoh/JtiwsTBGJBHIPGWCs6+InjCyrP+vZgLfSk1JQmMvLhlPaK5WAgL5qP9+QC7rtcY3QnPgK8Wy3/+KZa/bldhcEJK8M9ITm5iszcFWl1RVD7mpV1NmNHCyN1pwaupRU5AcdFPpOhwlO4iBd7RMSmhMzRGEBs+rYY+QPPyLf8Um26Tmmtve0tdoZzAQ9zz8kbNF2YDuBXMur66lW+99L+p6EJj9Nx2eeblP5FiYeM8Nujns8yFKyz64QTeQvT9GWWUSNN44bjLDzY3U1Gn6eNS1QYywGGs6oO4Ex4IsJgqu3VxDKlIDkP1C15Q5DgI1OImKHoAc2fvb3aDp8O5Hv+jjoZvs8JqtIsdH12Qy11cSDzz5WeSYiHQzQOWBL6UmU0KjG9C+Qan+ekAu/XK1b4Rm/5eKZZ8XQlLlP0pszgvJnumKjQo7axPpknLJDbqlUHODgmJbcGaeEl4w84/TwqOn0FWF+OaO+9MSGvOs2v7sT7HJJqnBX5RIuSONvzl/qy5oNNeMxgYp/7LC7oYY/tsfzqu7wBBrdz0IwktGEgH1F+h2wTHOvOx559VoLr7+1ZjzIZOVDKivsff/792ZlRqzovi/' +
              'r33FeaV0jNRghXS7+wpxdJ37dU1OqkAucJxkpOai63Y951SlBuBZQxzMsRCPPvul827pTJ62KGrfTNWSNbowLMeosTKZNRO/jZvrbJU6KKy3j4k6sYqO76QmGaHByJp4QnNpv3ADekGfoBz1TEAu+Wy1L4Rm3xeLZc8X1NcOIcm7WonNuSHZo6kSm0PSExtkbcyEfV5yY2puUFCM0VKYwM8IDoaEa8mpHxYdxMct26ctNHhO9d4PyQPqc/Cb2GST1GD0Ca7vPy266O+7dh8cdd0oxiwrXnijb+Q8JdV3mCySHZfd+LrzbnKgwTLHKKkWBQJinwuBLopkKGupMd2FqUgNRnihENtdzIy5gFId8ZaK1NjymI7UAEwNYGdDED8OKb3WCLilBrNapwtGeuFYyIKhzsU9/5E9Si1VKDW7mbIQGkgHGs+mnwXlkLYBueDjVb4Qmv97Phx7Pq2k5jIVZ4dkr8YzpUu6YqNCj5BClxTk5m+75AbdUqbmBqOlIoLjZHAgOViCAaKDSf1eeLZXRoTGDG9vrT4LP4lNNkmN6W4ZOHiK/t5kbsx1Y8RFWWH/YkYNjRcTpyyMbGPH1BnJFbki44TRIdgXtRgldQHc92iPmHO9+c5A593EKGup+eHHSfq4qUoNWLJsnZ6Dx75O1BNhlFWy7G6pAV9+MzpyPAQ+a3Ov8SgLqUEXGI710NO7pik47YL2kXNgxf50F2ql1OxGIDQv/5m60KCboyShMY1n/feDcsA9Smy6r/SF0Oz1nBOPh6TKBUpszgpIXqPp6WdsnIjIzV+r7crcoObm0PBoKZO9iQjOsWHJQTcVROeuD2ZmTGjwnKq9HZJ71PH8IjbZIjUYropr+8cJ90aNnLiu+duR60b3D7osygL8xWrOg7lDSsLuqjCBLodkMDUOiHgT+WFOGPs8CLyWDNkgNQCfv3u0FxZehdgmQ0WQGkjqCadFF3ljHpzSyLTU4LP/V70H9LFs8X6/RzgjagL1ZOlAqdlN2EKD4deZEBoz8Z1p' +
              'PJso2WiiGs4TXw/Kfs0Dcv77K30hNHs/q7ZpXyxVHg5K7tkByT1Dic2p06XLwZkRG0RU5saRG4yWMtkbCA4yOFh+QUtO1eNlVPW6ckW/HRkVGjynY94slhZ9i30hNtkiNZjHBNdmZtQ1IGtjX3umRmy4wdII5hz2HCtuRo6ZHXU9CMgW0vyJgEbXNDT4Gm/o6+tdBsScC8PLkyFbpAbMnL1ML+ZpXy+Gzicz/0tFkBpgfp5N4D5KI9NSg7lhcBwUZNtgyDnq1sx5zrv6Zeed1KDU7AbKU2ggGZi995/tg/J/NwXknHdXaqHBsRIRGjTMbqHBEGS30DRSDbRbaOqoRtotNKahtoXmiNdihQYy4xaav3TYJTR57UOyx9Mh2buVEpumSmxOD8geDTMrNgjIjSko1tkbp2sqIjjI4GjJqS69m1xbJkJztBI+PKPbv81+sckGqbH/osQvdhs0+naNQvWGmRmx4cZMJId0fGmccenzkesxccf93Zx34/NZr12jrFAzFA9MGGefA5FsViibpAbg84dY2NeM551oF0lFkRp7gVIExLe0e8i01NzZpps+DuTYjVlrDIFrS6c4m1JTzpQmNHdkSGgaO1kTCA0EA43mIQ8EZK/rA3J21xW+EJp924Vkz6dCkttCiU1jJTaNdkhe/anSNcNio8PIjZO9iRacsOR0vL5DmQnNP9TzOUg9nxv7ZLfYZIPUmOwHRsJ4CQsmNLOvPxMjNtyYkVaYJbU0UPhpXw8CSxygNiQeEAxMJIjtMTcKJq+Lh3sWWESyM8Fmm9QAjChzr7kF6UykLqWiSA2uAz8T5riI0kbKZVJqULcFQcfEgF5F14N/nR51rnSGj1NqypHdKTRoNKt3Dsr+dwRkz6tDcsbby30hNFWeDMleT6ivNxdJ7qk7JLehEpt6U6XLQWUgNk5EsjdKcCIZnAOryUOPfFOmQoPnk6ueyXVfKbEJZafYZIPUmHqWkoawzpm3Iur6MzFiw40ZgQOxKg2IV/1z2kVdE+L+xz91' +
              'tvDG/ixefLOv82rJDB0xM+r4iAbntnPeTYxslBrw66hZUV0kCIw0K21ph4oiNSDZuppMSg1GCuIYJRXXo4sVw+fNuY6t/6D+WUkFSk05sTmQvNBguv1MCE1N1WgerxpN1LL887WQ7P2f8HpKTTst94XQ5D2u/gp5VEUzJTanKLFpsE3y6k4uU7ExYQRn8P7V5ZpuS7XQnNs7VmhQb+QWmpPUc4oRGvV84gkNnkWuuv/r1DGzUWwqutTgL0o0JKUVAdsT0WVixIYbM6tsk4s7OK/ExyuLgka4pBE7ECGTDUKjHq8Y2eBu5BDHnPyg825iZKvUAAx1d8+Ei8LxeHVIFUlqMDmjOS4CBbrxyKTUYM0lHCNeEbAZGWUi1fWZKDXlQKaEBuKRjtAc0yksFQd3UHKgpKbKRSE5veMKXwjNPo+orw8FJPfi7ZJbf5vknqTEpvZk6fr30z1lJNPx7uktykRoDnw5Vmj2fix8v9d9GMw6sanoUoO1Y3BNWIYA2ZKSAo2NfQ/pjtiwgXCYxhONQSJAFryWMcBqzl7Y6X40AomAoeX2sRHJNrrZLDXg2/7jPdcWKimrUJGkBgW45rgIrO4dj0xJDdYHM88MQ+W9/j8h3PPpYPHPVKDUlDEVTWjMKKO/PhqS3AtVnK8E5fXlWS80e2IkFKSmTZHknq3ERklNbp0tkldzsnQpB7G5s/3wchWavdoEZO/WAWn2XiCrxKaiSw1W8HVfXyKRzLT8pYHaFnPcZJYRMEsE2IEskteChmZ9HMhTor/0cRz38RHxMhVusl1qAFayRibPvo+7237oWX9VkaTm9Is6RI6LQJdaPDIlNR3fHRR1nEQDdUyFhclnQCk1ZYiX0GA9pt0tNKY7I6+lkppzVZwdktNeXZb1QlPlwYDk3a++3qfEpvFWLTW5tZTYnFC2GZsvjzl/twhNlXuKJK/FDrmmS/aITUWWmtVrNuu/KLFcAGaWxQKP8eKmlu9E3Uc6IzZsUEhpjpnMkGk0oGbUlh2Yndhm9O9z' +
              'I+8lOkoKQEjcjTkCzyJR3FJjZmvOFFgnC8ctS6kB3T4dFnUfCAz/d4tNRZEaXJd73p3SVu/OlNTg/zf2R3bQ/X/IHe45a5KdsRpQasqIii40EAkIRN6NSmrODOhh0ae9sizrhQaxRyslNaqxz22gpKYGokD2rD6pzDI2j7TosduEZo87dkjeLdulWceirBCbiiw1b73/o76eRBerdBfOPvfat8476WFPHV9S91FJ2BPpmcBcK3bNDwpc8ToEZfbcFc6riWHWh7IDhdOJgsbV3jdTKz8bTEGq1yrjJZGK1IBO78VmINyTEVYUqYFwm2Mi0FVZGpmQmumzlup9E536AJkZe6TZWZe/4LyTOJSaMiBRocEMv5kQGjScqQgNGsy9n1ZScFl4npfc03bIaS8vzX6hua9IN/q5tyixqVMguScUSI6KvGpKbP6WWbH54cC68u8em3er0OTdtF32vH6bNHtlR4UXm4osNWYEUaKLQiLrYI/YQNFsSbUVyYDzm2O+8tYPzquJgYbZ/Rc5Al0AADO5mteuvqWTfi0ZcI/2cRHJLqJpixG6RDIJxBLHvfmed51XSidVqQEYNWbuxYQ9kqyiSE2v78K1YiYS+bnKhNRgAU3s684WxsO9uviCRd7LhJQEpSbDFHoM2y5voUGDmYjQ7PNMSDeauUoScs8OD4fG6KGGLy7RQoPJ+xIRGpzTLTRHq8baLTSmwbaFBo23W2hwXW6h+YuSGbfQ7NU2Vmj2vDcsNFXuLpK97tqhG/vcE5XYVFdRbbPkHTsho2Lz0mXPVgihybtGxdXb5KoXK7bYlIfUYJ4ZZCPizcTrZsYfyf1FaXjqhd5R9+K1onayYJSNOR4W1UwWr5l/j6jVSnbsCOjuHvPauIl/OnskzslnPxV1XMSAnyc77yaGPVkguvvWb0i8+6o0IGo4rpG4REhHasCTz/eK3I8Jc/6KIjXIXJlj4pmjeLc00pUa/P8zxb/JdM26M6CYDTkZKDUZ5uNloZSEBnPG7A6hgTCg4dy7' +
              'VUBPXmdGDp363OKsF5q97ww3/rlXqntSQpNznIpjldhU/V26ZkBsvjmssVzQfWOFEZqcy7dKzqVb5aoO2yus2JS11GBtHmRPSpsd181jHZL/ixKg+8a+l1RHbNjYCxDi38mCFP7fjo3tJsJfzZj8DP9GoXAqoCDafVzMSpwM7kbn4y+GO++kB+4bEoBjljbxoE26UgMJbvPEp1H3hEB9SEWQGqxjZddCtW0XvfRHSaQrNT8Pm6b3S/ZnzZ0BrXpSm6QyoJSaDLIpsFMempEZocFIpEwIjS0TJQmNEYXc25UA1AuPGkKBbUMlNlkvNM13SJXbtkvOv7doocn910YdeUf/Ll0OTE9smj8+tMIJTe6F6j7P2yJXPa3EJljxxKYspQaNC/5SRxdJaZOi2eAvyiNrtdbXkkqxL9bRMfeS6ogNG2RnzPGQtUmFDq+Gu2FKip+GTnO2TI5rbnsr5lioLUkGkxUzgeeXiW67zt1+0sdrmMC6RjbpSg3Az569CCkCImGWltidUgPRNsfDkOpEfz7TlRp0AWK/VIp93dkvZG8SJVNSg98F6f5fTpQKKzXjNxZnrdAYSdiz2XYtNLk1VZxYIA2eXZz9QnOripvVfZ1ZoIUm559KbI7eKHscqcTmgNTE5tXzHwt/Ji6hwXNyCw3qm8pTaHLPUV/PLJSrntxW4cQG83zYv3AQmZIaZGdwvGQzB78Mn6H3SzV7Yc5rIpVf4jamLgSBkUqpgIyVaazdgeedTBebjVm/x45nXu7jvJs47jlTUKSdDvMXro7U6mAEVDJkQmoA5BhD1O37MhmS3SU1/X+aHDnWXofdKsNGxh/GbZOO1BQUbNP3jMC/k8WdAcVcQImSCanBPqixQ5dteVBhpWbchuIoobl7XGaEBsW6mRAaSEM8odnnviLZF3JwgVOHcny4DqVB+8XZLzT/3SZ73KgEoGG+FprcI1UcsVHyjkhebL4+oqmc031zykKD5+MWGiObttCYgudUhCanqYpGBXLVwxVLbMzkdnac' +
              'dGb6UoNRP2hAsKxAMrU0wPxFmeoEeqgJsWeaPfOy5513UsPOhkyautB5NXlMl5o7MEIoVVo91iPmeM1bf+C8mziQEDR45hjoFktWRg3z5q+Smo0f08fBaKpkhc1ITWlrXyUCupuuuqVj5L5M7A6pwSi6g6uHVxlHHU2ysoefPXMdiGSkBmKPfdLpjrUzoPseeXvCq6OnKzX4/YE/cDLVLZoIFVZq/sgvziqhsUcOGaHZs6VqSO9UEnBaoRaaXHTZHLNZ6iuxyXqhUTKQe+1WqVJb3ZMSmtzDN0rOYesl79Cx0uWviYvNzU+O3C1Cg3twC03uxR5C07hAC03OKQVSpUG+XPXg1gojNv/r9H3ULxwERuukmjnAfvYIlGR/cWNuDPzCRKODJRJS5fo7OkfdE+oYUuW4Bm0jx8FEb6mCYtC9D78t6rqwpk4yk+XZ4FmfdkH7qOMh6p7xhLNFcmBpB/ciixj5kkgRK0CXFbp3zBBgNIKJNnwG3JN5RpmqvcBf9xddt0tMEMlIDRYJNfulKjUQkn+ccK8+xl+rttAZ0mSxR+EhXurYz3knPnimjS4MLyNS2gR/8fjgk6FR5+/+2TDnnfigZsjeL5nPFdf+wJOf6SHvqf4/SYUKKzV4IE9O8xaaG4dlRmjQaJal0JhGNPcmJQC187XQ5DhdNic/szirhabKddtkr2bqvq5QIlB9kxaa3ENV/EOJzSFjpGsCYtPh8hezSmhy6qlQEnd92+R+2ZcFaITcs5qawHwsm/O36m3w/yhe4JcN1irq8/24qL+K8YsU7yeD6btPN7vinh8GGY1UcHfPQRjSySC4MyupjKYyeGXZEMiyQA5TATVDmPXYPh6yClinCF1S6ALB8gxYwwqTEs6as0xPfHfDnZ0jWQgElpNIZP0qNxOn7MpGpJPBcoPPDHOsmGMnKjX4+Tf1XWa/ZH6mUUuGeiqTOcRzTKZo2gbLKJjrQCQ6UeIQpzsXn2M6XXpz/1wZdf46TR9PSDTcXYD4mUkEHBuTUWIf' +
              'CHd5UmGlBvy+rjghoTGLSKYrNJCKTAgN5MA0opACNKRVVAOaU82pQTkq3F1T/+nF2S00V6nXrlSvXaxEoOoGLTQ5h6yV3IPWSt5BY6TL/iWLzYsXPZOVQpNTU8WJm6Rrz/TT66mAX8rTZi6RW+99L+qXTaYjmXoBMHDwlMjKyxh6mupf6rg/d1cPusK+6DM6oQYJ26CroEv3n2MaeAQKn9HAYJK7ZAtqUexosiH4yz3ZbBS61tBImS66kgJ1OsgOJJspAcjMoJvCHqGTaKDwFd2GyTT8AI0/sgj2ytWYpBCF7KkKmhvUkpjMVqJS467PQpQ2TQDufcr0xXpBSJPlg6RDQpP9eTHgDwx0C9vXgYxYaXMSQUDtTCPq1VLFjJ6yAyvPx/sZXrp8vf4c7X1qN3lcizCWEfEKdDOhjg3ShO2x0GuyP0/pUqGlBvy4ojjrhQa1GzkQAjT+qEFxumuQ2WjQbnF2C42SgiqXqThficAR67TQ5PxdiY2KvL//psSmse+EBpmpGhfmOz+hZc+osXP0L3J07bi7GMoikLJPBEzkhfWU8AvM3YiaDAHeb/lQ/FmFWz/2iZY0bIu5bezj2IFiQ2xT0orfyDThvF77egWuedGStc7eiWFGv7zc6XvnldJB1gOFpe7zJxL4zBNdXdwGmRiMpEKGw87C2IFrwmeHe0KDmUqjjRqgo2rfL4eeeG+JgQUWS1vFOhHwHCF88aTmvkd76CxIjUaPet4zsi4Y0YVt8DMHwUSmCj+r+NnD84aUI1sFscHoslTpO2CC/r9kZN8d+PnD/SAbYv8c3vVgdz3/kLu7EwE5wvXi2lFLVRLIdqL7EcdGRrckycVnh+5eM4IP3c/Y74qb3tTddV77JBNYzqG8qfBSAwYtLU5YaKLWDUpDaCARmRCavf/rCI3TmFY5ozAiNMhs5B68VuopsYHQ6MY6g0KT4yE0Oa1jhQbX7BYaXLtbaPKu2R4jNCiszbtEfb1oi+Q1VSKATM3flNj8bbXkHLha8g5UYrPf' +
              'LrHxg9DkHKfiXxtl9MTEhzqnA/5ix+Ru5RWr12x2zhwfDNH02t8d4yfNd/bwBt0WXvuVFCV1ISH74rV9vEg2pY9sC/azl0ooDaTi3edNJtJpWA24bsyAjM8C3VAoCC7POodMAbGJ9/M0YfICz2dYWmA/POdEf/YTAdlKr3N5hf3zlOg9xBsijc/Xa5+SwtRezZy9zPP9VAKfU3lnaUBWSA3ov6Q464UGjWmVK5QU1NscERpkNpDVOOnJJVktNHtc4MhBQyUBfw8LTc4BKvZfKXn7j9Ri4yehyam6UXp9n3ofNyGEkMyTNVIDflhYnJTQNMiQ0GCdpEwJje6qQTdUtQ0RoQlnNRbLzT3zs1toIAdnKzmoqxp+R2hy91spOSpOr/26/Ed9Xn4RmpyjKDWEEFLRyCqpAX0XFKcsNGa0UbpCg0ncUhUaiAAa1NxzCyX3iPVhoTlgibR7ZaS+v/t/zHKhgSBgXpfj10eE5l81vtBpyPXbdso138YKDYa3Z5vQ5By5UYaOKp/JpAghhCRG1kkN+O7P4qwWmirnOw1qE9V4HrwsIjSGBwdludAoScg9TUlC1XVy8LEDo2aSXLd1p1ylPrN4QlP1jVih2ffFWKHBZ+IWmpzbw/dS1kJzTMNNu6W/mBBCSMlkpdSAb+YWpyU09l//6QiNLQVJCY2SgL3PK5RvhnrPB9FmYJYLzakFcvrthbJxU+y03hCbK78qH6HJca49SmjOcq7XFpqTExeanMM2yCtvJz9dOSGEkLIla6UGfD2nOKuFpv9v8UfPPDAge4Wm7g2Fsqmg5EwGxObSzyuu0ORUixWa3MM3aKE59+p8qYgLXBJCSGUnq6UGfDWrOG2hyVPikAmhwRwumRIawwP9w9eWTUJT5/pCWbux9Dkv1m7ZKRcqIc0moWl6Wb5sUddNCCGk4pH1UgN6zijWQmPqNNIVGkhCJoTGNKipCo3hwR+KfSc0BojNuR9TaAghhKSPL6QGfDat2JdCY2j9fbEWGlyjW2jQ0LuFRi+m' +
              '6RKaPZUAuIUm94ZYocE9uIUG9+EWmipN0hMawxolCk27U2gIIYSkh2+kBvSYWhwRGnRpZEJobDlIR2j2OTd1oTE80DfkO6ExrCncKQ3fp9CQikswGJSVK1emvAYQIaTs8ZXUgI8mFftSaAytvgv5TmgMq5XYnPgOhYZUHDZv3ixz586VUaNGSb9+/WTAgAHOO7uHUCikr2nTpk3q53KL/p4QsgvfSQ3oNnFnlNDgr/9MCM1eSgh2p9AY2nyjrt1nQmPQYtOJQkN2P8uWLZPvvvsuKkaOjJ5TqrxYu3atjBs3Tr7//vuo68H348ePl1mzZun3Cans+FJqwHvjd5YoNCi6zYTQGBkoT6ExtP465DuhMawuUGLziiU0zn1RaEh5smPHDi0TU6dOjUjEtGnh1YzLC0zwOGPGjMj5IS7Lly+X9evXy+LFi+XXX3+NvPfjjz86exFSefGt1IC3x+3crUIzYHTZCI3h/t7qHnwmNIbV+UpsnitBaK6NFZocMzLLFhp1nRQaki4LFiyIiMOiRYucV8uH2bNnR86N63AD6Zk0aZJ+/5dffnFeJaTy4mupAW+N3RlXaJANyITQ7GFJQHkIjeH+L4O+ExoDxKbm00UZE5rcGh5C808KDYnP5MmTI2KxYcMG59Wyp6CgQPr27avPO3ToUOfVWFBXgyzNsGHDnFcIqbz4XmpAp9/C87z4TWgMrb9Q9+EzoTGs3qzE5jF1b+UgNGdQaIgHw4cPj0gNRkCVFyhQNuf9/fffnVe9+eOPP+S3335zviOk8lIppAa8Naq4VKHJUWKQbUJjuL9nwHdCY4DY1HlA3ReFhpQz6N754YcftFj8/PPPzqvlw5QpUyJS079//3IVKkKylUojNeCt4cVJCQ2EIBuExtD6s4AWmrybYoUGo7TcQqPFwCU0RhCihEZJwu4SGsPqTTulRislaxQaUo5g2LQRi7Fjxzqvlg+o3zHnRiATwyHchMSnUkkNeGtYyJdCY2jdI+A7oTGs3qjE5m51DxQakmEw' +
              '0mnevHm6LmXgwIEyaNAgPbII3T5GKtDFUxLYH++jWBf7o8YFQ63TqcHBMd1DuDFfDl5PFtTnoDYI2SbMtYOvGMm1detWZwtvMPrL3m/w4MF6NBZkz4uioiJZvXq1LnAeM2aMvl4Dsl6YYwdD5fH+hAkT9PPGcHQ3uEdI3ejRo/WzhMytWbNGf4/rWbdunT6ezbZt2+TPP//U3YX4DBD4DBcuXBg3y4XjYBsM1zefHQQS90Gyj0onNeDtIaGkhcaIQEUWGkOrj9R9+UxoDFpsmqt7oNCQDIAGbebMmXpiPQSGTKOxhdTYMoHAUGov0EBjXwgNRigh0DhiH0gJGvJUWbVqVaRY2ASOjdcTATJgxAxCAFGAfOF68RokJRAIOFvvAnICKcE2Q4YM0Y0+7gv3iNcgOMhcofFHETO+nz9/vn7PDoidAWLlfh9hjyjDtUCE7HuGULmzVgjIDTCfoXkd14XvISnmNXTfQdDc4D7Ndrjf6dOn63vB9/g3yT4qpdSAjr+EfCk0htbdA74TGsPqDcVS4xZ1/RQakgZo8CExaMDw1c6A2I26CTTKbpBlwHtoSO1sADI0Zr94I5cSYcmSJZFj2YGam3jdUXgP0oFtITJ2ZgNZKXMczMNjA7GASOA9DBe398NzgSCYfe3ALMcQB1sm5syZ4+wZBsdGlgUyZbaxs1nIttj7IyCYkBwIlZExyCKyTPjMzPbYzi2QmMvHHAe1UYWFhc47YczINvsZIEOD1yByJPuotFIDOv4UTEloIAEVWWgMrT4o8p3QGLTYXK/ug0JDUsRICzIDXus5oQE33T9oTO3GHZj5a9CYesmFEQNEad08pYE1p0wGwQ7cQ0lrUSFLYrZxs3379sgx3JP2mQJlnM8ri2NLBzIi2B5SaK7DzpqUlFEqbUSZW+SMHEFi0MWE9wGyT3jfS1gMdhcisnAGfL7m9aVLlzqvhmUQr0G+SPZRqaUGvDUo6EuhMbR6r8h3QmNYvb5YajYrlNw6SmQoNCQJIAmmQcvPz3de' +
              'jQaNdEnzxKAhNl1MEB782x12F4o7Y5EKEBGTebFj4sSJzha7QNbEvI8G3+v67GOYBtyWHYiKF7YkeImEneEqSebMiLKffvrJeSUaPC9zDK/7A/YyFugCLAlbkGyB27hxY9TryBIByCvuiwuXZieVXmpAxwFBXwqNodU7Smx8JjQGiE2Ny9X1W0KTe0ys0OQeSqEhYdBYmSwKJKEk0JVhGj13w2rPIYMuGnRjxAuveo5UQINrN/gmTObCYMQC2Rav63GHadCRWTHHLKmmBDU2eB9ZLK+GH6KC99FN5QVEx5yjpBFltjh5dfvhOdhi5pVRMkBazXYIiBvAPqY7CwGxYXYm+6HUOHT8IehLoTHc32WH74TGsHpdsZx0ZX5coTmvGYWGhDE1E4h4GRT7L3zUoNhg1A5eR23I7sCWKoTdxYQskskSQbiSwc5gQSzc2KKHbiY3EAXz/ogRI5xXo7HP4TXyCZiCZK9uP2Bnokr7DPA8zLYIdDsZ7JobEyh4JtkLpcaic/+g57BtSMB+FxTKwDHZKTSGF3sWyb7qPryE5uLWW2RjfvY2+oVKWJ7vvF2ObqykxhKaE5tskk7vb1e/2Cg0JAyKZk0Dhi6MkrAXksRwYgMaWfMXPmo6dhfIcpjrQ9bCYHerJNvthXszWSwc086AQA4gKngP0uFVR4SFNs25UWvjhZ1p8hpRFq/bz2DLCGp84oGuJLOt/ZwMkCx38fOKFSucd0m2QalxMWpmSK57brvso6QGQrPfRYVy96vbZdZCf0x6tbFgp3TqVSQ3PbtNbmq/TR7quF1mzvfPhF7FxTtl6qygTJoWlJmzs1tCSdmAYlHTeHktEmkwRagI02UB7AJTdMVkGtSHoEuoNOxMkr3uk50JKUks4oH9TYE0jovh1MhemOwJnktJ3T0YMWTOXdKzNQXMCK+upXjdfgYUC5ttIGHxsGtv7EJhG3SJmW4zBO6VZCeUmhIIhXZKUWCnbiQJIf4Bw3dN4xVPHsxcNahLcWP/ZR+vngMNtFf3' +
              'STzQkKOBLW0/e1g2skoGu4aktOHk6MaxQZYEI4GwH8QGXTu4f1wPnhVqg+Jdl/1sS6pPKa1rCec3x3B3+xnsjBDCawSVwYy0wvlM4TI+M2S0bJDRMQXMCBYKZyeUGkJIpcJuNCEuXlJiN5pe3Rv2KCSvbAIaa2RS0JAmO6uwKZK1u7zc4JpR2Irt3PeAc9uNsz25nQFdR2aiOSMEaNRNETDuyc5OJYo93BsZHxtcF7I3pXUt4brMMUqa1RfCYboAvc5lKGmEFI6L/d2YLJJ7mDvJHig1hJBKBUb62A0i5qlBNwgadzSO9pBkBKQB3Rb4i99gd7MgUGuCBhSZDEgE5ACNN2o/ksWcH+f16p6xJ6jDObzmgrG72BBorLEdrg9FxqgtgdDY2Qq7hgj7Q0DQ+GMfSB62RRbIq5bGgGdpjoEsD2pTkA1CdxG6iYzQIPA88XzsZwSRsruBvIaMG+xiaUiIW8JwbnM+ZJnszIvpurOzSbgvk0VisXD2QqkhhFQ6zMR5XoH1gpCpsF9DVsEeNo2sg12o6w4co6T5b0rDFgPIFwTDLFMAObHneCkpC4RJ6uzJ/9yB49gzKAOvpQhKCgiLV5G111IJCMgF6nvc7+NeIDwQDlyTyT6ZwHPH/SPc0oLPwEwUiECXIMQMxzPPEOfF925MTQ7Oh8wdZBbnwmvIlOHYJDuh1BBCKiX4Sx7ygYYM9SNoVE3NCP6yR6YEjWS8yfkgG2jgTQOKbinITzqNIkZnIQuBUULIANnZDQSyNJCDeLU8ANKCIdPIyGA/CATuMV63FrpozPaJBDI4NrhvXDueHd6HeOGYRkjwPJENwVc8a5M9wfu4tnhhZ1psULeEz8vUOeF54Ryox3GLmwHPBdJnRnMh8LPg1VVHsgtKDSGkUuMlIGhAkxGTdCSmNHBsNPpYGbs0kSmJRK8PggAhQGOP7ipkY9A9hCwRshsQLrtuJt6ij17njFfQmwlS+RywTyr7kYoJpYYQQojODCHL4a4/cQMBMN1EyLgQUpGg' +
              '1BBCSCXHrDaOLpnSshaYp8cUWruHRROyu6HUEEJIJQZZGSMpqIGJl6XBe6YIN9nZigkpDyg1hBBSicFQZnuIO0Z+edXuYPizGaqOzA7rUEhFhFJDCCGVHHsmYIQZDYZCYCyKaeaOwbBn9yzEhFQkKDWEEFLJQdYFi0tiZJOdtcEwcLyG4dGpzrtDSHlCqSGEEBJFvLoaQioylBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQHyDy//O30PvAjFjdAAAAAElFTkSuQmCC', width: 160, height: 50, border:[true, true, false, false]},
              {text: `\n\n${this.xtituloreporte}`, fontSize: 9.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n${this.xrecibo}\n\n`, border:[false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos de la Póliza', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia de la Póliza:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fdesde_pol)}`, border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fhasta_pol)}`, border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, '*'],
            body: [
              [{text: 'Fecha de Suscripción:', rowSpan: 2, bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.fsuscripcion), rowSpan: 2, alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, false]}, {text: `Sucursal ${this.detail_form.get('xsucursalemision').value}`, border: [false, false, true, false]}],
              [{}, {}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.detail_form.get('xsucursalsuscriptora').value}`, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: 'Vigencia del Recibo:', bold: true, border: [false, false, false, false]}, {text: 'Desde:', bold: true, border: [false, false, false, false]}, {text: `${this.changeDateFormat(this.fdesde_rec)}`, border: [false, false, false, false]}, {text: 'Hasta:', bold: true, border: [false, false, false, false]}, {text: `${this.changeDateFormat(this.fhasta_rec)}`, border: [false, false, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 50, 80, '*'],
            body: [
              [{text: 'Fecha de Emisión:', rowSpan: 2, bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), rowSpan: 2, alignment: 'center', border: [false, false, true, true]}, {text: 'Tipo de Movimiento:', bold: true, border: [false, false, false, false]}, {text: 'EMISIÓN', border: [false, false, false, false]}, {text: 'Frecuencia de Pago:', bold: true, border: [false, false, false, false]}, {text: this.getPaymentMethodology(this.detail_form.get('cmetodologiapago').value), border: [false, false, true, false]}],
              [{}, {}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.detail_form.get('xmoneda').value, border: [false, false, false, true]}, {text: 'Prima Total', bold: true, border: [false, false, false, true]}, {text: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal), border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, '*', '*'],
            body: [
              [{text: 'TOMADOR:', bold: true, border: [true, false, false, false]}, {text: this.xnombrecliente, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', rowSpan: 2, bold: true, border: [false, false, false, true]}, {text: this.xdocidentidadcliente, rowSpan: 2, border: [false, false, true, true]}],
              [{text: 'Índole o Profesión:', bold: true, border: [true, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {}, {}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, 24, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 40, 20, 30, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, false, true]}, {text: 'E-mail:', bold: true, border: [false, false, false, true]}, {text: this.xemailcliente, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [80, 280, 24, '*'],
            body: [
              [{text: 'DIRECCIÓN DE COBRO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 50, 24, 50, 24, '*', '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Zona Cobro:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, '*', '*'],
            body: [
              [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: `${this.detail_form.get('xnombrepropietario').value} ${this.detail_form.get('xapellidopropietario').value}`, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('xdocidentidadpropietario').value, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, 24, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.detail_form.get('xdireccionpropietario').value, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('xestadopropietario').value, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 40, 20, 30, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, false]}, {text: this.detail_form.get('xciudadpropietario').value, border: [false, false, false, false]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('xtelefonocelularpropietario').value, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('xemailpropietario').value, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL INTERMEDIARIO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, '*', 40, 30, 45, 30],
            body: [
              [{text: 'INTERMEDIARIO:', bold: true, border: [true, false, false, false]}, {text: this.detail_form.get('xnombrecorredor').value, border: [false, false, false, false]}, {text: 'Control:', bold: true, border: [false, false, false, false]}, {text: this.detail_form.get('ccorredor').value, border: [false, false, false, false]}, {text: 'Participación:', bold: true, border: [false, false, false, false]}, {text: '100%', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'CONDICIONADOS Y ANEXOS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: this.buildAnnexesBody()
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'ANEXOS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: this.xanexo, border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'OBSERVACIONES', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: this.xobservaciones, border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'ACCESORIOS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*', '*', '*'],
            body: [
              [{text: 'ACCESORIO', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [true, false, true, true]}, {text: 'SUMA ASEGURADA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'PRIMA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*', '*', '*'],
            body: this.buildAccesoriesBody()
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'EL TOMADOR Y/O ASEGURADO DECLARA(N) RECIBIR EN ESTE ACTO LAS CONDICIONES GENERALES Y PARTICULARES DE LA PÓLIZA, ASÍ COMO LOS ANEXOS', bold: true, alignment: 'center'}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [180, '*', 180],
            body: [
              [{text: 'Para constancia se firma:\nLugar y fecha', colSpan: 3, border: [true, false, true, false]}, {}, {}],
              [{text: ' ', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABNAIgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD97t386UjcKXGKD0rnNDM8WeHI/GHhbU9HnaSOHVLSWzd0O1kEiFMg9iM5B7Guc/Z1n1BvgN4LGq3zanqSaLaR3l2ybGuZkiVHcjnDFlJI9c12bDa+6uX+Fy/YbHVtNZlM2lazexsB91FllN3Eo9hDcxDHbFV0A6mWVYYmdm2qoJJPYVxeieNNaHxFk0vWLHTbWw1SCS90VreZ3uPJiEAkW5BAVZN82QEyoUAZY5I7Ryr/ACnoe3rXl/xl8aaV4F+Mvge/1a9hsLcWWrR75MlpSwtMRooBaR2bbhFBY44BwaI66AeoI24dK4fxN8W5r7W7jw/4OtIte8QwsY7qWVmj0vRD1LXUyg/OOiwRBpWYqGESF5o6cdh4o+MUT/bPt3gnwxM2FtIZzFrmoxdCZZIz/oSvjhYmafYVJeCQtHH23hrw1p/hDQrXTNIsbPTNNs12QWtrEsUMS9eFXgUaLcCv4F0HUPDPhe0stU1q68RahGHa41C4higedmdm4SNVVVXcEUYJCqu5mbLHYzzQaQHNSAvejOce9NU4P16UFgR9KAHYpCMnPNLmigCNl2mgrgU5zgU1vlH0oAO/86KCf8+tFIBydKcTg01OBSnqKYDDz9fSua8Nxrp3xE8V28YIW5NnqTsR1d4Tbnn/AHbRPzrV8XeL9J8A6DNqmuajZ6Xp1uVElzdSiOMFiFVcnqzMQAoyWJAAJOK8k8TxeIvjV4p1aGGPUvCvh3UvD8qRoAYdX1xEdgvGN1nG3mDHP2gq/IgYcXGNwNv4iftN6P4d8VTeFtFuNP1DxNA1sly11M0Gm6Obi4FtCbq4APzvMyxpBGGleR0DCNC0yUdJ+HnkftO6LqOranda94g03w9fTm5mTy7ezSee2jEdrACUhH7l8tzI+cM7AKF4rX/AXh/S9V8F6XY6fa2fh++8PaTZ2Wm6db+XD5yavaXA2hFwoGGc56qkjHhWNe0+B/AV7ovirVtY1TVP7Vv9Qt7axjZYfJSKCDzCpK5P7x3ldnK4U4QADHNyiorQrY6TTNRh1BrgQyrIbaUwSgZ+SRQCV/DI6etWDweB9aUMT/npS5rEkbj/AAp3UUgP60tADQMn8aTnBp/Wo8YfqfegB3VfpThQKDzQA3GT/PNNK5/rQcg/0pAKAFooxkUVOgDgPTuea5H4nfGC1+Hr2+m2dnc+IfFWpJnTtDsmX7TcjODLIzfLBbrg7ppCFGNq75GSNs3xn8SdY8S+IJPDPgWG3m1SElNS1y7iMmmaDjHyEAg3F02flhQhUALSunyJLtfDT4TaX8Mba8ktjPf6xq8guNW1i9Ikv9Xm/wCekzgAYHRI0CxRJhI0RFVRpa24HO+C/gbd6l4wtfGHj68tfEXimyydMtoEK6V4aDAhvskbctMVJVrqT96wJC+UjGOt/wASXjWfxc8Lr0S5stRi3erj7NIo/JXP4V1L1xfxRkaHxn8O5x8sa+IZYZn6ALJpd+qqfrL5I+uKE7sZpeC/hlpvgXUNQubH7R5mpeWmJXBW2gj3+VbxKAAsSGWUqOSPMIyVCgdEibRTYuRnmnn7tS33EKDxXmn7T3xg1T4SeDtH/sSCzk1jxNrcGg2Ut037m1mmSV0kdcEuuYgpA5Actzt2n0uvm3/gotDNf3PwEt4N8kjfF3RpXiSQRtJEkN2zjnAIHHBIBzjvg1HcDj/ip4z/AGpvgt4auPEHibx1+zPofh+xEUU97qrX9lCsjEICXMZALMRtXk5OMmvIIf8Agp98Urf4zW/gD/hZH7MuteJnk2+TpEPiG9icCNpn/wBIgsJLddkKs7kyYRUYtgA4+Bf+CnP7efxE/bK/aSvtD8R6ZqnhjSPCerNp+meEDEVuNOnyq7pwDmS8c8ArwquFjyGLv83eHtY8TfDn4kWi6P8A29ovizR9UENqtoJLfULO+WTyljRVw6zB/l2j5snbis5VknaxSp3V2fvg3iH9t2WzhurDTf2Y9WtZ41lilg1nVCs6lQVZSbdQVbPBz/SqVh8Vf207y2mksfB/7OOtm2leCcWviK8HkyofmjY4++ARlTjHevjX/gjd/wAFedc+H3xG074P/FG81DVtC16/ay0PUZbd5r3RdQllI+yyqo3tbvKXAypMDEA4iBMf6H6H4E+JHhj4c+OvDek6JbaFqPirxFrF5aa9banbltMi1DURsu1iwC80NtLLMykjMkCIGfzC6aQakrk2seczfHL9tC31RbL/AIVP8Fbi68kz+TF4mdZWQHG4I0oON3y56Z7+sMP7R37Z01r51v8AAn4aalHgrm38XQgM4faygm4x8pDA88MpHNdLN4Z8eeN/i/4FvLW40+z+IngPwzZab4ljOpxSF4dRleG7DbSWLBbYX8RwC7WQjynmuRgfs/eEPEt58CtF0DwmusXOn6bpml6Y95pHjKJ4NNutOvpri6jleG6XdLeW8kQWSNW80zL55RRxfISRx/tPftmW3E37Mfhm7YBSWg8a2Eat0yBuuSe55I7e/FqH9qn9r0L837KOlMVODt+IOmAN2yP3p47888963pfhn8ZbN9Pjvh441ae20yWCHUtM8RwW5luhZr9luby2e5SFZElZo5EiWaGV4BKUxKUTaudJ+N2k2Vn5f9sXLR6nqqatGJ7F2vYLiO5itJrVmlBjSCZLWYKdjCKVxsZxsC5Q8v8AM4E/8FFvjD8NPGPhG0+Kn7Ok3gLQ/FniKy8OQ6qPGNrqB+0XcqxxokUCvucZeQh3RfLhkw+/y0cqP9vu81DUfhd+zDa6xaapZ6q3xe8LW9yuo+W1xJMm9ZHYxsy8ncd2eeo4IJKmMVswPsq3iWFdqKqLkthRgZJJJ+pJJPqTTxxSZJbj86UHJH0qShGG76VxPx+dofAdnPHtU2viHQ5ix/gQaraeYf8Av2XH0Nds52iuM/aCsJNT+Bni2KHmb+y55YyByropdWHuCoP1FOO4Lc7KMY4z90kUp5Peo7O6jvYhNEwaOYCRGH8StyD+RqTOWpAOFeL/ALZXw3vviBB8MptOktY7jw38QdG1iVZnVTLbR3CrOqE87hG5k4/hibNe0Csfx14C0n4keHbjStZsxeWdwrKwEjwyR7lKlo5EKyRvtYjejKwycGqjZPUDybXP2cvgV4z/AGmNN+L19p3gu++I2j2/2O21Y38bMCuFSRo9/lvPGuUSVlMiKxVSBxSr+xl8FdS/aph+Na6D4dm+Isdt9nTUkuVKGTGwXJiDeW115f7sTkGTy/lzjFcvf/8ABIj4CapFIs/hbxQyyYDBfHviFNwGcdL4ep+vHoKop/wRr/Z7iVtvhXxV5jujtK3j3XnkITGFy14fl2gLj0A9AQaBr3O+8G/8E/8A4U+C/wBqvW/jZpHhe1h8ea/D5c92kha3ilIKzXUMP3IriZNqySLgttJ4aSVpPY2jaD5mVgsfzE7ScAc18n61/wAETvgDrKTKujeMbXzRLtMfjHU3MJkQqSnmTN0J3KDkAgcY4rnLz/gg/wDBlgwtNY+Jmmq3QQa7FIUGCMBpYHbjJwSSeevAwf1/WganKfATT/h3ZfE7WPH0ei/tILdeHbjVdblGvaLamNbyWO5i2RBIwxuGWWZ4ix83dcKrODI6N418b7b4f2OuDR9Mt/jA0Ph3VWj1GHVvC27TLqyW9nuriKyt4p4WhW5uJYkeMBGUru2wvbM0H0xD/wAER/AEEQW3+JXxttmVAitFrtkGQDv/AMefJ7c5q1p3/BGnwzpFr5dr8Zf2gIQiGOPd4hsZFjHP8LWeOvPqeeeTVc39f0g2/r/gHz9pN98Dba2mjm8V/HbUZmuVggbUPDaEw20ISAWaRpEgWNlsrNo2cfu3FrI5/d3AX7m/YivtFb4NX2l6BqWua7aeHvEer2E+qanb+W+o3BvZbiWSNtzGWENOUSVmZ3EeWZ2yzeUQ/wDBKA2V55lr+0J+0RbqxzIo8QW4MnGOWW3Bzy3PuB2qJv8Aglhr1s7Na/tLftAR/Mx2P4jlEeGLE5WJ4/m5zuGCSMnPORtNB/X9aD/+Cps27x1+y/bKyr53xk0V+VyWCMW2g9umf+A0Ungf/glVNpPxW8J+JPFXxm+JXj618H6tFrVlp2uahcXsf2mE7onBuJ5RGQ4Ulo1Viu9N212BKIySJkfXKjPsKUHcaTG0fjR/FjtWZQY4qh4i0j/hIfDmoaeG2m+tZbYN/dLoy/1rQI4/SmRnaVbrzmgDn/g9qS6z8KfDN0v3ZtKtiM/9clH9K6Lv0+70rL8FeF08EeENM0aOVp49NtktlkK7S4UYBxWpjcxpvcBQeKXPzUCkxg5pAB+7RtBOf1pR0oHFADVHXmk8v/Cn0E8igBoXDZp3SjPNGaAEzhaQvQ/AprjZ09KAAcjG3n+dFC/NRQB//9k=', width: 136, height: 77, border: [false, false, true, false]}],
              [{text: '_________________________________', bold: true, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: '_________________________________', bold: true, alignment: 'center', border: [false, false, true, false]}],
              [{text: 'FIRMA DEL TOMADOR', alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Por La Mundial Seguros, C.A', alignment: 'center', border: [false, false, true, false]}],
              [{text: `Nombre y Apellido: ${this.xnombrecliente}`, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: `Nombre y Apellido: ${this.xnombrerepresentantelegal}`, alignment: 'center', border: [false, false, true, false]}],
              [{text: `C.I: ${this.xdocidentidadcliente}`, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: `C.I: ${this.xdocidentidadrepresentantelegal}`, alignment: 'center', border: [false, false, true, false]},]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'Aprobado por la Superintendencia de la Actividad Aseguradora mediante Providencia Nº FSAA-1-1-0361-2022 de fecha 5/8/2022', alignment: 'center', border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: '\nLa Mundial  de Seguros, C.A, inscrita en la Superintendencia de la Actividad Aseguradora bajo el No. 73' + 
                      '\nDIRECCIÓN: AV. FRANCISCO DE MIRANDA, EDIFICIO CAVENDES, PISO 11, OFICINA 1101- CARACAS', alignment: 'center', border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [true, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'En caso de SINIESTRO o SOLICITUD DE SERVICIO dar aviso a la brevedad posible al número telefónico: 0500-2797288 Atención 24/7', alignment: 'center', bold: true, border: [true, false, true, true]}]
            ]
          }
        },
        {
          pageBreak: 'before',
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'AFILIACIÓN AL CLUB DE MIEMBROS DE ARYSAUTOS\n', alignment: 'center', bold: true, border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, false]}],
              [{text: ' ', border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [100, '*'],
            body: [
              [{text: 'Datos del afiliado', bold: true, border: [true, true, false, true]}, {text: ' ', border: [false, true, true, true]}],
              [{text: 'Nombres y Apellidos', border: [true, false, true, true]}, {text: this.xnombrecliente, border: [false, false, true, true]}],
              [{text: 'Tipo y número de documento de identidad', border: [true, false, true, true]}, {text: this.xdocidentidadcliente, border: [false, false, true, true]}],
              [{text: 'Dirección', border: [true, false, true, true]}, [{text: this.xdireccionfiscalcliente, border: [false, false, true, true]}]],
              [{text: 'Número de Teléfono', border: [true, false, true, true]}, [{text: this.xtelefonocliente, border: [false, false, true, true]}]],
              [{text: 'Datos del vehículo', bold: true, border: [true, false, false, true]}, {text: ' ', border: [false, false, true, true]}],
              [{text: 'Placa', border: [true, false, true, true]}, [{text: this.detail_form.get('xplaca').value, border: [false, false, true, true]}]],
              [{text: 'Marca - Modelo - Versión', border: [true, false, true, true]}, {text: `${this.detail_form.get('xmarca').value} - ${this.detail_form.get('xmodelo').value} - ${this.detail_form.get('xversion').value}`}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, false]}],
              [{text: ' ', border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'Con la compra de la póliza RCV, adquiere una membresía por el vehículo asegurado suscrita por ARYSAUTOS, C.A. sociedad mercantil domiciliada en Valencia,\n' + 
                      'Estado Carabobo e inscrita en el Registro Mercantil Segundo de la circunscripción judicial del Estado Carabobo bajo el número 73 tomo 7-A, por lo que está\n' +
                      'AFILIADO al club de miembros de en el cual tendrá acceso a los siguientes SERVICIOS con disponibilidad a nivel nacional las 24/7, los 365 días del año de\n' +
                      'manera rápida y segura para responder a todas tus requerimientos e inquietudes.', border:[false, false, false, false]
              }]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: '\nLOS SERVICIOS\n', bold: true, border: [false, false, false, false]}],
              [{text: 'Los costos de los servicios serán asumidos o no por el afiliado de acuerdo al plan contratado', border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, false]}],
              [{text: ' ', border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [100, '*', 100],
            body: [
              [{text: ' ', border: [false, false, false, false]}, {text: 'Servicios del Club', fillColor: '#D4D3D3', bold: true}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Mecánica Ligera', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Taller', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Grúa sin cobertura', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia legal telefónica', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Mantenimiento correctivo', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Mantenimiento preventivo', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Casa de repuesto', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Mecánica general', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Centro de atención 24/7', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Red de proveedores certificados', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Acompañamiento', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia en siniestros', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia vial telefónica', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Búsqueda y ubicación de repuestos', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, false]}],
              [{text: ' ', border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          ul: [
            'Debe llamar Venezuela al: 0500-2797288 / 0414-4128237 / 0241-8200184. Si se encuentra en Colombia al celular 3188339485\n',
            'Dar aviso a la brevedad posible, plazo máximo de acuerdo a las condiciones de la Póliza.',
            'Una vez contactado con la central del Call Center se le tomarán los detalles del siniestro (es importante que el mismo conductor realice la llamada) y de acuerdo\n' +
            'al tipo de siniestro o daño se le indicaran los pasos a seguir.',
            'Permanezca en el lugar del accidente y comuníquese inmediatamente con las autoridades de tránsito.',
            'Si intervino una autoridad competente (Tránsito Terrestre, Guardia Nacional Bolivariana, Policía Nacional Bolivariana),es necesario que solicite las experticias y\n' + 
            'a su vez las Actuaciones de Tránsito con el respectivo croquis, verifíquelas antes de firmarlas, ya que se requiere disponer de todos los detalles del accidente,\n' + 
            'los datos de los vehículos y personas involucradas. Sin estos datos, no se podrá culminar la Notificación',
            'No suministre información que puede afectarlo.'
          ]
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
          fontSize: 7
        }
      }
    }
    pdfMake.createPdf(pdfDefinition).open();}
    catch(err){console.log(err.message)}
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
              style: 'header',
              text: [
                {text: 'RIF: '}, {text: 'J000846448', bold: true},
                '\nDirección: Av. Francisco de Miranda, Edif. Cavendes, Piso 11 OF 1101',
                '\nUrb. Los Palos Grandes, 1060 Chacao, Caracas.',
                '\nTelf. +58 212 283-9619 / +58 424 206-1351',
                '\nUrl: www.lamundialdeseguros.com'
              ],
              alignment: 'left'
            },
              {
                width: 140,
                height: 60,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjUAAADXCAYAAADiBqA4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEEdSURBVHhe7Z0HeFRV+ocTYv2vru6qa19WBZUqgigI9rL2gm1dK4qigih2RRHrWkEBG6ioWEBUUIqKgBQp0qsU6b1DElpmJnz/8ztzz3Dmzs1kWkLm5vc+z/eEzNw+IefNd75zTo4QQgghhPgASg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqamkFG/dKtunjpfCX/pJ4Y9fS8GAnlLww0dSOOgT2TK0l2z9ra9snzxEgmuXOnsQQgghFRtKTSWgeMcO2TJliqz7sqcsf/YJWfjfy2XBOXVk8YV1ZMkVdWXZtfVk+c31ZGXzk2Vly/qyunUDWd22gax55BRZ+3hDWffcubL5w/tky09dZceMYRLatMo5MiGEEFJxoNT4mI3DRsicO+6WSbVqy5TaNWT6yTXl' +
                'j1NrybymtWThubVl8SV1ZOlVJ8myG+vJitt3Cc2ah5XMPKFk5ulTZf2zkBr19QUVL54WDvXvDZ0ul63DP5Tiwg3O2QghhJDdC6XGZwTzC2Tpux/L+Ebny+gjj5ffjzlBJlY/UabU2iU1f57hSM2ldWXZNXXDWZo7ldC0qr9LaJ5pGJaX/50mG19tJBvfUF/fVF87OaH+veH101Q0lYK+7SWwbIZzBYQQQsjugVLjE7bMXSB/tHlahh9eV379ezUZcUh1+U1Jzbh/nSATlNRMrqmkpp6H1FxbT1bcoqTmLiU0bRrI2kdPCWdoIDSvOCLzdiPZ1LWxbHrvdNn0/umyuZv6t/qqv1ev431Iz+ZPbpftUwfIzuKQc1WEEEJI+UGpyXJ2hkIy/+WuMnj/E2Xw/x0nQ/Y/Tob9TUnNwdVl1OHHy9h/Hi/jjztBSc2JMq1eDZlldz8ZqbnN6Xp6UEnNEw1lfQcnQ6OEZlOXsMDkf6hkpof6+lkTKei5K/I/aSKbP3ZEB4LTqZHkf9pcgusWOldICCGElA+UmnJgc3CnzN5WLBMKQzK+ICQztxTL+sBO593UKZz9p4xtcpX8vM9xkRiy33Ey9K/VZPhB1WTkYdVl9FFKao49QSadeKJMrVNDZp5SQ+Y0qSkLzgnX1KD7SWdqIDVtG8i6J8M1NLrLCRkaZGaUtGiJ6aXim6ZS+K2Kvk3Cof5d0EfFV0pwlPBAfpDB2dj5TNk2rqfs3Jn+fRJCCCGJQKkpI/JDO+VXJTAdVwWkw/KAPLs0IO2XBKTdYhULA/LUgoA8r6L/2pCsLUqu4YcoLHyzm/xyQI0ooUEM/ouSmv2Pi+mC0nU1tWvIjAY1ZXbjmjL/rFqy6KI6srTZSVFSs7bdKbrrCd1JyLxs7t44nJ3p7UhMfyU0A8+XLYMulC0/XqK/6u8HnCUF/c4ICw4yOMjsvNtI8r+8S0IbljhXTgghhJQdlJoMU6yEY1RhSF5aGZDnVuwSmmcgM5bQPP5nQB6bF5BH5wbkkdlB' +
                '+X51SALFpcvNtsXLZdzZ18XITCTQBbXfcTLswGoyXHdBVY/qgjJ1NfPOrCWLLwiPflp+U7imBt1PyNQYqYGU6CzNV+GMDMRFi8zgZrJ16I2ybdjNsvXX28Jfh9wgW3++Iiw53zvZGyU3kKJN750t2yf1ce6AEEIIKRsoNRlki5KSD9cF5fkkhOZhJTQP/RGUtjOD8sLcoKzdUbLYbF20VEZUb+otM1bobM1fq+lszchDw11QGAUV3QUVrqtZclldWX7DSeHRT63DNTW6+8lITQ8lNeh26ndGODvzy7VhkRnRUrb/1ka2jW6rQ/975L36PWwTkZveSmzUMXCsbaO7O3dCCCGEZB5KTYYoDO2Ud9YGUhaaNjOCcv/0oLRT/16zPVZsEhUaHTHZmuNlXNXjZUI1ZGtqyIz6NWV2o11dULqu5raTZdW94dFPKBRGTY3ufkKmRkkNBAVZGp2hgdCMeVi2j28vOyY+Lzsmvahj+4QOsn3cE1pwtg5vruWmcMA54bobZG26NZbtYyk2hBBCygZKTQbIlNDcPzUoracE5fFpQVltiU1SQuOEXVvjztZMq1tDZjUMj4JadH5tWXKl1QWFYuGnndFPbzfStTG6+wlS89NluqsJ0rLj96ekaPL/pGj621I08x0pmvV++Cu+V6/jfZ29UdtjP521QTGxOt6asd10Nx0hhBCSSSg1aZJpobl3UlDumRiUR9X3q7ftTEloTLhra7yyNQvOdkZBXaukpvnJkS4oXVeDId3vh0c+oUgYmRojNcjKFE3rJEV/dJPAvM+laH5vHYE/v5SiOZ/IjhldwtmbsY/JthEtdB0Oiox1d9THp8u00R9QbAghhGQUSk0alJXQtJyg4vegPDK+SL5v+h9PYUkkzLw1ZiSUmWHY1NZ4ZmtahmcVxozCkS4o1NX0aaq7klAQvH1UK931pKVGCUxg4bcSWjJIgsuGhGPxAAks6COB2R/pbbAt6m10rQ1GSTliM3lsD4oNIYSQjEGpSZGyFpq7xwXljrHq' +
                '3/2Wy1fHnuUpLYmEKRo289ZEjYTCsgmnWbU1mIjvdle2plMjXQtjuqAwwgmZF9TO7Jj6hpaa4KJ+Elo+TIJrxkto3WQJrZ0owZWjwnIz73OdtdH1NkqGIEWQI4jNxh5nyNBF0yg2hBBCMgKlJgXKS2juGB2U5r8F5bbeS+WLqmd4SkupYRUNm1mG7XlrZjaoqSfjMyOhsLjlqhZObc0zDfVSCZFsDSbeG3h+uFh4dFvdvYRaGmRlIDUQmuLN86W4YIkUb5oXlpulg3W3lC02dsZmSa8bpN/GLRQbQgghaUOpSZLyFppbRwbllhFB+W/PxfJZ1dRqa+xuKF00bHVD6aJhZz0oM28NJuNbdU94JJQZ3m1qa/TQbhQMO9kadC8hG6O7n9aMl535C2Xnjo1SXJSv5Qaigy4p1NposTFdUabG5qsmMmJoR+mzKUixIYQQkhaUmiRwC037ZbFC8+T8WKF5eFas0Nw3OVZoWkBmXEJz6/Cg3KzixmFBufrDhfLp0U08xaW0iJq7xt0NhQn5SuiG0pPxvaik5q1GeiI9PbxbyQiyLbq2BgXDGPU0v3c4W7N+muzcskKKQzu02EBydLeUkp6iuZ+Fa2yUDOniYYyK6ttE8ns2lY9mTpTeGyg2hBBCUodSkyC7W2j+M1TFL0G5qPN8+SRFsSlpNNSUWruWT9BrQl1qTciHWYadId5Y3FLPW2OKhofeGB7ebXdDrRihxUZ3QW1bK8WFy6R4wwz9OgqKMVoKQ771pH3DbtbdWejWWtzrWnlxcYF8uS4oIYoNIYSQFKDUJEBFEZrrBgflmp+Dcs6rf8onR6UgNqa+Bqt4Y12oI3bV1+iZhnV9jTPT8BVKbJy5azxHQzn1NRATd32NHgGF7MzGWVK8aY6WnNCq0bpw2GRrMI8NJvHT3VDOHDaDh3TRz/SLNRQbQgghyUOpKYWKJjTX/BiSqwcGpdFzc1MSm6SHed/sDPN+5BRZ/2xYbPRClZ84K3Y7hcM6YzPxed0VhRobCIzujlIy' +
                'owOjoxb/EBkNhW2xD/Y12ZrVn18kz84v1DVJn62k2BBCCEkOSk0cKqLQNBsUkisHhOSyH4JycrvZ0iMVsfFYG2r8saUXDhux2fB6eF2oKLFxzV+j56iZ31sP94bgaKFZ0EdnaiIT8415OLycwk+X6QLk/M9Pl69G9o08z0+WU2wIIYQkDqWmBCqy0Fyh4vL+Ibnw26DUfniW9DgyTbE5bJfYTK6hxKZejeiVvJvFio17Yj69gvfgZuFRUWMfC3dHYckE1NDM+STc7YSvWE4B3U/I1BipsWYbntv7Vv08H5kTfp4fLw1RbAghhCQEpcaDbBCaS74PyaX9QnJO76Ac33qmfJyG2MRMzKfERo+IKkVs9Bw2pnjYLHpp1odC1gYT9GHByymvapHRMjP1DS08Zm0oIzV63holR8j+vD1uon6ebdXzfEA9xw8XVW6xCYWKZebsZRmJHTsCzlH9zabNW2T5yg1xY83azc7W5Usi17Y5f6uzNSEkGSg1LrJJaP7dV8W3ITnjs6D8q+UM+fiI5MUGhcNhsakuo7yGettic5VVY4PiYTMqCsO9Mesw1oj6NjwyCqKy9dfb9Jw0ekVvCI4SGS0zGNKN0U8jWkYWvIxIzWdN5Ldv20WEps208Hw+HyyovGKDBi7noJsyEnPmrXCO6m8efKqn5/3bse+Rt5e72BQXF0vNxo95Xo8dTz7fy9mDEJIMlBqLbBSaC78JyXlfh+TU7kE5+o7p8lGKYqOHervFxpWxiVnR+8EGsrbdKXoeG7345Xunh7ujeoUn6UOtjZaboTfqjIyWGCU5+uuIFmGhQZZm0IXhEVC9m+hMzfoPzpCnJqyOCA2eJZ7ju/Mqp9jsVPeMxrCoKCjz5q+Srt0HS9WT2ng2hogDj7lLPvr8V5k1Z5ls21ak98UxTFQGAoGgLFuxXj74ZKiccNojns8JUd7y0HfABM/r+L+jmsvjz30lE6cslLXr8iUYDDl7EEKSgVLjEE9onloUKzSm5sMWGjTCbqG5e3ys0Nw+' +
                'KlZobhwSKzRXD4wVmksgMy6hOa9XSM5RcVLnoBxxc+bFBjU2pnh4wXnh4d5YTkHPY4N1oh5vKOs7nKrrbDa+Hc7aIOMCSdFyg8zNj5fodaP0EgkIyAwyNBCa/k11hgfDuiFFkKPuPw+KEho8x7vUc+wyhzU2YOHiNXLI8fd4NpBDhs9wtiJgxh9LJe+Qmz2f1V+rttDdQeUBhLLh+c94Xkfbdj2drQgh6UCpUfhBaM78IiRNPw9JjVeDcuh/p8uHaXVFRRcPR0ZFNawVmccGE/Qtvf4kPfPwqnvDdTbojtJZGyyrgCLi7o7coN4G0gLBwWzEKCpWoYuD8RreU9tg2/wPT9cjqwZ83THqOUJo8AybjwlK5z8oNqDFA91jGsf9q96psxQkmuMatI15ViZefLOvs1XZ8ouSTa/zI1556wdnK0JIOlR6qfGT0DT9LCSNPg1J1Q4B+ccNmRMbex4bswDmgrNr6yUVUECs62wwSV8bZ3XvDuFaG90lBbnp5oySwtpRXzkZHBOQmc9PjwgNsjTI9kzqdles0PwWfoZYC6vTTCU2xZVbbHp8OSKmcazd5HHnXWJz8tlPxTwrEwdVaylbtmx3tiw7zrnyRc/zI55gDQ0hGaFSS01+cKd0VvLy2soi3wjNqZ+o+DgkRz4ekIOvmS7dD09ebGLmsXEm6DMre8+oX1NmNwqvFYUCYj37MJZVaO5kbVBEjDWjLLmBqOiaG3RNIRvzcbj+Bl/19+p1IzTI9Kx87Wz1DIs8hcY8vzemVW6x+eaH32Max5POfNJ5l9gYqTmiVis5rMZ9Mc+t03uDnC3LhjHj50XO1eDcdlHnRtzd9kNnS0JIOlRaqYHQ/G9+UB5QcvLEjG3y3LIi3whNw49CcnK3oBzcJiAHXT1duqUpNnpJBSU2WFJhghKbyTVr6AJi1Nlg9mHdHXVJHVl2jZKbm+vJqhb1ZXWr8CzEEbl5SckNam6QvXlLRRclMV2dUP/WMtOpkZ7YDyK0/oVTpd2QuSUKzQ3q+V2v' +
                'nt+rUyqv2Hw3YHxM41jvLEqNF8fWf1A/H9S0vNa5f8xzO7JW6zId7n75f9/Q50FW6Ot+42LOf+3tbztbEkLSoVJKjS00GDYMMXlgYqG0X1TkC6Gp3z0k9bqFpM67QTng7oD8/UolNoelKDZYUsFZK2rU4cdHFxDXDXdHYSFMO2uja21ucUZItQ5nbtAthfWj1j0XrruBuGCeGy06KvBvLTPqPUgQ6nPe6d0vrtCYZ/fKxMopNpSaxPn7cXfr53NBs/9JQcE2+duxd8U8u26fDnO2zizTZi6JnOO5176V0b/PjTov4tyrXnK2JoSkQ6WTms0uobFH2LQck+8boTnpg5DUei8kNd4Kyl9uDciBl6UoNs5aUZHVva06m4knhLujpp/sDPtuWkuv8o1aGz30+wYlN7edrDM36JbCEHBkbyA4GAoOycEkfia09CiZQXZn7aOnSN8uL5cqNHh2eG4vTah8YkOpSQyMOqpycHj0k8mIPPvKNzHPDsXEZTGU+sa7uurjY9j2+g0F8sfc5THn5udGSGaoVFITV2iUkNw5JiB3jtrsG6Gp825IanYNyXGvBWWfGwOy/8XT5f0UxMas7m3X2US6o6qFJ+qLZG0a1dRz2mDoN7qkMGFfJHPT/GQ9cZ/ummqjJKdtWHK06CiJ0f9++JTw6+r9X15+JCGhMc/t+d8rl9hQahIDmRnzfDBiDEAu/nL0HVHPDvFFn9H6/Uzx54JVEaHChIBg5aqNMef9Z902+j1CSHpUGqkpTWggJLcrGbllREBuGbrBN0JzYpeQHN85JEe9EJS9rgnJfv+eKe8dmoLYqHDX2US6o451sja1nFobPfQ73CVl5AaZm2XX1tPz2xjBQQYHkoOlF5DJ0aH+jdfQdTW0/f0JC83F/dTz+i4k7cdUHrHJRql5+JnP5ZTzno7EipUbnXfKjqXL10eeD85veKT9F1HPDoHRY5isMFPc9WB42P0e/7hFXwfYvr0o5rz7/fMO/V5pXH9HZ6nR6NGE4u0PfnL2Sox2' +
                'L37teRx3GDEEg36ZKh3fHeQZv0+a72yVGnP/XOl5XHd07rbrPrHPeHXeYSNnSf+fJuv6pU++GiHvfTxEF4Nj6HyHV7+Vp1/6Wp56obeefBEjz/D9869/pyetHDF6tl6qIt2fg42btsiCRWsSinTquXp9Nzbq/xQmeEwVzLDtdX3xorCw7EcOJkOlkJpEhcZ0dVz7c0BuGLReC82DkJkEhAbzp7iF5qZfY4Xm2p9ihebSH2KF5oI+sUJzZs9YoWnwYazQ1HonWmiOe0tFx2I59OmQ5F0ekn0vSENs7O6og6qHh307WRvU2pih3zPqhwuJjdzoYuILldxcVldnbyA46J7C7MSQHHRTRUJ9j4Lj4Y+2SEpoznMk8JlRIQlWArHJRqm595GPo6731bf7O++UHdNnLY2cDw2XARmTvQ+/Lep6EP0GTnS2SA80jHseeqs+5m33ve+8GsbrvJgxujTQ0K5bXyA/DZ0m1U55KOYYV9z0pkyaujChY7lB1xsaNfxcnX/1y1HHhXRBkhYvXafXIjNg7p32//tGGv/7Wcm1tjf7jJ0wz9kyeeYvXK3PCflseslzUcfe54jb5fZW7+ufnw97/ursEZa+C695RRd+29sj8MwhQD17j9Kyg8a/z/fj9PcvdeynPyPcB64b22Nixhvu7CxffTtG8guSX4vr869/k7pnPBFzHXZgZnBcLzJ6qeIeBYm6sVR5o+tAfT1H1b4/6ph2HHrivXLW5S/IJTe8Jpf+53UtgRUJ30tNskIDEcFyBZf0DUizfmt9IzRVVRzxRrEc+LASm0tCsve5M+Wdf6QmNu7uKDtrg1qb8AipaLlBMbGekRjz25wfrrvBBH66sBhdVM2U6FxTNxL4fuS9tyYtNHheZ30VkieH+19ssk1q0NAeXL1l1PXiL/+yXrph1Ng5kfPZf9UDt2QhTj3/mYxcE2YJNsfEkhU2XsPKV63e5LybGJg52t4fxdCZmnhx69YdUuv0XWtUISNTGpi52UicCSzZMWX6YmeL1MHn' +
                'gcyKOS4+03hg+y7df466lgP+1cJ5Nz5YWgSyc9UtHSNdh5AoLGORyuzTi5aslRMbRS/Vsddht+pMUiZodmunqGNDLk1WMFXw/Hr3HRszE/ct975b4Zfw8LXUpCo0NzgCcuYXQbmyzxrfCM1hr6t4tVj2vTckuReFZK+zZkrXVMVGBbqjorI2Tq1NpEvKkhsUE6NbCjU3mJVY190owUEGB5KDLA5ER8vOJeGvQ1s0jwgN1sByCw2emZfQoIuusXpejw/zt9hkm9R8P2hizPUixk3809mibEDjYc71aa+RzqthsNyE1xIKyECkA7IpKAzGsa68+U3n1V24GzmEW3xKAxMG2vujEc4kj3X4Uh8XApao5Jkshx0Q2WTvzQvIAY6HjEsi14Nt7KVEEpUaG3Rl2dkWiKP7ZygR3BNlYoh/JtiwsTBGJBHIPGWCs6+InjCyrP+vZgLfSk1JQmMvLhlPaK5WAgL5qP9+QC7rtcY3QnPgK8Wy3/+KZa/bldhcEJK8M9ITm5iszcFWl1RVD7mpV1NmNHCyN1pwaupRU5AcdFPpOhwlO4iBd7RMSmhMzRGEBs+rYY+QPPyLf8Um26Tmmtve0tdoZzAQ9zz8kbNF2YDuBXMur66lW+99L+p6EJj9Nx2eeblP5FiYeM8Nujns8yFKyz64QTeQvT9GWWUSNN44bjLDzY3U1Gn6eNS1QYywGGs6oO4Ex4IsJgqu3VxDKlIDkP1C15Q5DgI1OImKHoAc2fvb3aDp8O5Hv+jjoZvs8JqtIsdH12Qy11cSDzz5WeSYiHQzQOWBL6UmU0KjG9C+Qan+ekAu/XK1b4Rm/5eKZZ8XQlLlP0pszgvJnumKjQo7axPpknLJDbqlUHODgmJbcGaeEl4w84/TwqOn0FWF+OaO+9MSGvOs2v7sT7HJJqnBX5RIuSONvzl/qy5oNNeMxgYp/7LC7oYY/tsfzqu7wBBrdz0IwktGEgH1F+h2wTHOvOx559VoLr7+1ZjzIZOVDKivsff/792ZlRqzovi/' +
                'r33FeaV0jNRghXS7+wpxdJ37dU1OqkAucJxkpOai63Y951SlBuBZQxzMsRCPPvul827pTJ62KGrfTNWSNbowLMeosTKZNRO/jZvrbJU6KKy3j4k6sYqO76QmGaHByJp4QnNpv3ADekGfoBz1TEAu+Wy1L4Rm3xeLZc8X1NcOIcm7WonNuSHZo6kSm0PSExtkbcyEfV5yY2puUFCM0VKYwM8IDoaEa8mpHxYdxMct26ctNHhO9d4PyQPqc/Cb2GST1GD0Ca7vPy266O+7dh8cdd0oxiwrXnijb+Q8JdV3mCySHZfd+LrzbnKgwTLHKKkWBQJinwuBLopkKGupMd2FqUgNRnihENtdzIy5gFId8ZaK1NjymI7UAEwNYGdDED8OKb3WCLilBrNapwtGeuFYyIKhzsU9/5E9Si1VKDW7mbIQGkgHGs+mnwXlkLYBueDjVb4Qmv97Phx7Pq2k5jIVZ4dkr8YzpUu6YqNCj5BClxTk5m+75AbdUqbmBqOlIoLjZHAgOViCAaKDSf1eeLZXRoTGDG9vrT4LP4lNNkmN6W4ZOHiK/t5kbsx1Y8RFWWH/YkYNjRcTpyyMbGPH1BnJFbki44TRIdgXtRgldQHc92iPmHO9+c5A593EKGup+eHHSfq4qUoNWLJsnZ6Dx75O1BNhlFWy7G6pAV9+MzpyPAQ+a3Ov8SgLqUEXGI710NO7pik47YL2kXNgxf50F2ql1OxGIDQv/5m60KCboyShMY1n/feDcsA9Smy6r/SF0Oz1nBOPh6TKBUpszgpIXqPp6WdsnIjIzV+r7crcoObm0PBoKZO9iQjOsWHJQTcVROeuD2ZmTGjwnKq9HZJ71PH8IjbZIjUYropr+8cJ90aNnLiu+duR60b3D7osygL8xWrOg7lDSsLuqjCBLodkMDUOiHgT+WFOGPs8CLyWDNkgNQCfv3u0FxZehdgmQ0WQGkjqCadFF3ljHpzSyLTU4LP/V70H9LFs8X6/RzgjagL1ZOlAqdlN2EKD4deZEBoz8Z1p' +
                'PJso2WiiGs4TXw/Kfs0Dcv77K30hNHs/q7ZpXyxVHg5K7tkByT1Dic2p06XLwZkRG0RU5saRG4yWMtkbCA4yOFh+QUtO1eNlVPW6ckW/HRkVGjynY94slhZ9i30hNtkiNZjHBNdmZtQ1IGtjX3umRmy4wdII5hz2HCtuRo6ZHXU9CMgW0vyJgEbXNDT4Gm/o6+tdBsScC8PLkyFbpAbMnL1ML+ZpXy+Gzicz/0tFkBpgfp5N4D5KI9NSg7lhcBwUZNtgyDnq1sx5zrv6Zeed1KDU7AbKU2ggGZi995/tg/J/NwXknHdXaqHBsRIRGjTMbqHBEGS30DRSDbRbaOqoRtotNKahtoXmiNdihQYy4xaav3TYJTR57UOyx9Mh2buVEpumSmxOD8geDTMrNgjIjSko1tkbp2sqIjjI4GjJqS69m1xbJkJztBI+PKPbv81+sckGqbH/osQvdhs0+naNQvWGmRmx4cZMJId0fGmccenzkesxccf93Zx34/NZr12jrFAzFA9MGGefA5FsViibpAbg84dY2NeM551oF0lFkRp7gVIExLe0e8i01NzZpps+DuTYjVlrDIFrS6c4m1JTzpQmNHdkSGgaO1kTCA0EA43mIQ8EZK/rA3J21xW+EJp924Vkz6dCkttCiU1jJTaNdkhe/anSNcNio8PIjZO9iRacsOR0vL5DmQnNP9TzOUg9nxv7ZLfYZIPUmOwHRsJ4CQsmNLOvPxMjNtyYkVaYJbU0UPhpXw8CSxygNiQeEAxMJIjtMTcKJq+Lh3sWWESyM8Fmm9QAjChzr7kF6UykLqWiSA2uAz8T5riI0kbKZVJqULcFQcfEgF5F14N/nR51rnSGj1NqypHdKTRoNKt3Dsr+dwRkz6tDcsbby30hNFWeDMleT6ivNxdJ7qk7JLehEpt6U6XLQWUgNk5EsjdKcCIZnAOryUOPfFOmQoPnk6ueyXVfKbEJZafYZIPUmHqWkoawzpm3Iur6MzFiw40ZgQOxKg2IV/1z2kVdE+L+xz91' +
                'tvDG/ixefLOv82rJDB0xM+r4iAbntnPeTYxslBrw66hZUV0kCIw0K21ph4oiNSDZuppMSg1GCuIYJRXXo4sVw+fNuY6t/6D+WUkFSk05sTmQvNBguv1MCE1N1WgerxpN1LL887WQ7P2f8HpKTTst94XQ5D2u/gp5VEUzJTanKLFpsE3y6k4uU7ExYQRn8P7V5ZpuS7XQnNs7VmhQb+QWmpPUc4oRGvV84gkNnkWuuv/r1DGzUWwqutTgL0o0JKUVAdsT0WVixIYbM6tsk4s7OK/ExyuLgka4pBE7ECGTDUKjHq8Y2eBu5BDHnPyg825iZKvUAAx1d8+Ei8LxeHVIFUlqMDmjOS4CBbrxyKTUYM0lHCNeEbAZGWUi1fWZKDXlQKaEBuKRjtAc0yksFQd3UHKgpKbKRSE5veMKXwjNPo+orw8FJPfi7ZJbf5vknqTEpvZk6fr30z1lJNPx7uktykRoDnw5Vmj2fix8v9d9GMw6sanoUoO1Y3BNWIYA2ZKSAo2NfQ/pjtiwgXCYxhONQSJAFryWMcBqzl7Y6X40AomAoeX2sRHJNrrZLDXg2/7jPdcWKimrUJGkBgW45rgIrO4dj0xJDdYHM88MQ+W9/j8h3PPpYPHPVKDUlDEVTWjMKKO/PhqS3AtVnK8E5fXlWS80e2IkFKSmTZHknq3ERklNbp0tkldzsnQpB7G5s/3wchWavdoEZO/WAWn2XiCrxKaiSw1W8HVfXyKRzLT8pYHaFnPcZJYRMEsE2IEskteChmZ9HMhTor/0cRz38RHxMhVusl1qAFayRibPvo+7237oWX9VkaTm9Is6RI6LQJdaPDIlNR3fHRR1nEQDdUyFhclnQCk1ZYiX0GA9pt0tNKY7I6+lkppzVZwdktNeXZb1QlPlwYDk3a++3qfEpvFWLTW5tZTYnFC2GZsvjzl/twhNlXuKJK/FDrmmS/aITUWWmtVrNuu/KLFcAGaWxQKP8eKmlu9E3Uc6IzZsUEhpjpnMkGk0oGbUlh2Yndhm9O9z' +
                'I+8lOkoKQEjcjTkCzyJR3FJjZmvOFFgnC8ctS6kB3T4dFnUfCAz/d4tNRZEaXJd73p3SVu/OlNTg/zf2R3bQ/X/IHe45a5KdsRpQasqIii40EAkIRN6NSmrODOhh0ae9sizrhQaxRyslNaqxz22gpKYGokD2rD6pzDI2j7TosduEZo87dkjeLdulWceirBCbiiw1b73/o76eRBerdBfOPvfat8476WFPHV9S91FJ2BPpmcBcK3bNDwpc8ToEZfbcFc6riWHWh7IDhdOJgsbV3jdTKz8bTEGq1yrjJZGK1IBO78VmINyTEVYUqYFwm2Mi0FVZGpmQmumzlup9E536AJkZe6TZWZe/4LyTOJSaMiBRocEMv5kQGjScqQgNGsy9n1ZScFl4npfc03bIaS8vzX6hua9IN/q5tyixqVMguScUSI6KvGpKbP6WWbH54cC68u8em3er0OTdtF32vH6bNHtlR4UXm4osNWYEUaKLQiLrYI/YQNFsSbUVyYDzm2O+8tYPzquJgYbZ/Rc5Al0AADO5mteuvqWTfi0ZcI/2cRHJLqJpixG6RDIJxBLHvfmed51XSidVqQEYNWbuxYQ9kqyiSE2v78K1YiYS+bnKhNRgAU3s684WxsO9uviCRd7LhJQEpSbDFHoM2y5voUGDmYjQ7PNMSDeauUoScs8OD4fG6KGGLy7RQoPJ+xIRGpzTLTRHq8baLTSmwbaFBo23W2hwXW6h+YuSGbfQ7NU2Vmj2vDcsNFXuLpK97tqhG/vcE5XYVFdRbbPkHTsho2Lz0mXPVgihybtGxdXb5KoXK7bYlIfUYJ4ZZCPizcTrZsYfyf1FaXjqhd5R9+K1onayYJSNOR4W1UwWr5l/j6jVSnbsCOjuHvPauIl/OnskzslnPxV1XMSAnyc77yaGPVkguvvWb0i8+6o0IGo4rpG4REhHasCTz/eK3I8Jc/6KIjXIXJlj4pmjeLc00pUa/P8zxb/JdM26M6CYDTkZKDUZ5uNloZSEBnPG7A6hgTCg4dy7' +
                'VUBPXmdGDp363OKsF5q97ww3/rlXqntSQpNznIpjldhU/V26ZkBsvjmssVzQfWOFEZqcy7dKzqVb5aoO2yus2JS11GBtHmRPSpsd181jHZL/ixKg+8a+l1RHbNjYCxDi38mCFP7fjo3tJsJfzZj8DP9GoXAqoCDafVzMSpwM7kbn4y+GO++kB+4bEoBjljbxoE26UgMJbvPEp1H3hEB9SEWQGqxjZddCtW0XvfRHSaQrNT8Pm6b3S/ZnzZ0BrXpSm6QyoJSaDLIpsFMempEZocFIpEwIjS0TJQmNEYXc25UA1AuPGkKBbUMlNlkvNM13SJXbtkvOv7doocn910YdeUf/Ll0OTE9smj8+tMIJTe6F6j7P2yJXPa3EJljxxKYspQaNC/5SRxdJaZOi2eAvyiNrtdbXkkqxL9bRMfeS6ogNG2RnzPGQtUmFDq+Gu2FKip+GTnO2TI5rbnsr5lioLUkGkxUzgeeXiW67zt1+0sdrmMC6RjbpSg3Az569CCkCImGWltidUgPRNsfDkOpEfz7TlRp0AWK/VIp93dkvZG8SJVNSg98F6f5fTpQKKzXjNxZnrdAYSdiz2XYtNLk1VZxYIA2eXZz9QnOripvVfZ1ZoIUm559KbI7eKHscqcTmgNTE5tXzHwt/Ji6hwXNyCw3qm8pTaHLPUV/PLJSrntxW4cQG83zYv3AQmZIaZGdwvGQzB78Mn6H3SzV7Yc5rIpVf4jamLgSBkUqpgIyVaazdgeedTBebjVm/x45nXu7jvJs47jlTUKSdDvMXro7U6mAEVDJkQmoA5BhD1O37MhmS3SU1/X+aHDnWXofdKsNGxh/GbZOO1BQUbNP3jMC/k8WdAcVcQImSCanBPqixQ5dteVBhpWbchuIoobl7XGaEBsW6mRAaSEM8odnnviLZF3JwgVOHcny4DqVB+8XZLzT/3SZ73KgEoGG+FprcI1UcsVHyjkhebL4+oqmc031zykKD5+MWGiObttCYgudUhCanqYpGBXLVwxVLbMzkdnac' +
                'dGb6UoNRP2hAsKxAMrU0wPxFmeoEeqgJsWeaPfOy5513UsPOhkyautB5NXlMl5o7MEIoVVo91iPmeM1bf+C8mziQEDR45hjoFktWRg3z5q+Smo0f08fBaKpkhc1ITWlrXyUCupuuuqVj5L5M7A6pwSi6g6uHVxlHHU2ysoefPXMdiGSkBmKPfdLpjrUzoPseeXvCq6OnKzX4/YE/cDLVLZoIFVZq/sgvziqhsUcOGaHZs6VqSO9UEnBaoRaaXHTZHLNZ6iuxyXqhUTKQe+1WqVJb3ZMSmtzDN0rOYesl79Cx0uWviYvNzU+O3C1Cg3twC03uxR5C07hAC03OKQVSpUG+XPXg1gojNv/r9H3ULxwERuukmjnAfvYIlGR/cWNuDPzCRKODJRJS5fo7OkfdE+oYUuW4Bm0jx8FEb6mCYtC9D78t6rqwpk4yk+XZ4FmfdkH7qOMh6p7xhLNFcmBpB/ciixj5kkgRK0CXFbp3zBBgNIKJNnwG3JN5RpmqvcBf9xddt0tMEMlIDRYJNfulKjUQkn+ccK8+xl+rttAZ0mSxR+EhXurYz3knPnimjS4MLyNS2gR/8fjgk6FR5+/+2TDnnfigZsjeL5nPFdf+wJOf6SHvqf4/SYUKKzV4IE9O8xaaG4dlRmjQaJal0JhGNPcmJQC187XQ5DhdNic/szirhabKddtkr2bqvq5QIlB9kxaa3ENV/EOJzSFjpGsCYtPh8hezSmhy6qlQEnd92+R+2ZcFaITcs5qawHwsm/O36m3w/yhe4JcN1irq8/24qL+K8YsU7yeD6btPN7vinh8GGY1UcHfPQRjSySC4MyupjKYyeGXZEMiyQA5TATVDmPXYPh6yClinCF1S6ALB8gxYwwqTEs6as0xPfHfDnZ0jWQgElpNIZP0qNxOn7MpGpJPBcoPPDHOsmGMnKjX4+Tf1XWa/ZH6mUUuGeiqTOcRzTKZo2gbLKJjrQCQ6UeIQpzsXn2M6XXpz/1wZdf46TR9PSDTcXYD4mUkEHBuTUWIf' +
                'CHd5UmGlBvy+rjghoTGLSKYrNJCKTAgN5MA0opACNKRVVAOaU82pQTkq3F1T/+nF2S00V6nXrlSvXaxEoOoGLTQ5h6yV3IPWSt5BY6TL/iWLzYsXPZOVQpNTU8WJm6Rrz/TT66mAX8rTZi6RW+99L+qXTaYjmXoBMHDwlMjKyxh6mupf6rg/d1cPusK+6DM6oQYJ26CroEv3n2MaeAQKn9HAYJK7ZAtqUexosiH4yz3ZbBS61tBImS66kgJ1OsgOJJspAcjMoJvCHqGTaKDwFd2GyTT8AI0/sgj2ytWYpBCF7KkKmhvUkpjMVqJS467PQpQ2TQDufcr0xXpBSJPlg6RDQpP9eTHgDwx0C9vXgYxYaXMSQUDtTCPq1VLFjJ6yAyvPx/sZXrp8vf4c7X1qN3lcizCWEfEKdDOhjg3ShO2x0GuyP0/pUqGlBvy4ojjrhQa1GzkQAjT+qEFxumuQ2WjQbnF2C42SgiqXqThficAR67TQ5PxdiY2KvL//psSmse+EBpmpGhfmOz+hZc+osXP0L3J07bi7GMoikLJPBEzkhfWU8AvM3YiaDAHeb/lQ/FmFWz/2iZY0bIu5bezj2IFiQ2xT0orfyDThvF77egWuedGStc7eiWFGv7zc6XvnldJB1gOFpe7zJxL4zBNdXdwGmRiMpEKGw87C2IFrwmeHe0KDmUqjjRqgo2rfL4eeeG+JgQUWS1vFOhHwHCF88aTmvkd76CxIjUaPet4zsi4Y0YVt8DMHwUSmCj+r+NnD84aUI1sFscHoslTpO2CC/r9kZN8d+PnD/SAbYv8c3vVgdz3/kLu7EwE5wvXi2lFLVRLIdqL7EcdGRrckycVnh+5eM4IP3c/Y74qb3tTddV77JBNYzqG8qfBSAwYtLU5YaKLWDUpDaCARmRCavf/rCI3TmFY5ozAiNMhs5B68VuopsYHQ6MY6g0KT4yE0Oa1jhQbX7BYaXLtbaPKu2R4jNCiszbtEfb1oi+Q1VSKATM3flNj8bbXkHLha8g5UYrPf' +
                'LrHxg9DkHKfiXxtl9MTEhzqnA/5ix+Ru5RWr12x2zhwfDNH02t8d4yfNd/bwBt0WXvuVFCV1ISH74rV9vEg2pY9sC/azl0ooDaTi3edNJtJpWA24bsyAjM8C3VAoCC7POodMAbGJ9/M0YfICz2dYWmA/POdEf/YTAdlKr3N5hf3zlOg9xBsijc/Xa5+SwtRezZy9zPP9VAKfU3lnaUBWSA3ov6Q464UGjWmVK5QU1NscERpkNpDVOOnJJVktNHtc4MhBQyUBfw8LTc4BKvZfKXn7j9Ri4yehyam6UXp9n3ofNyGEkMyTNVIDflhYnJTQNMiQ0GCdpEwJje6qQTdUtQ0RoQlnNRbLzT3zs1toIAdnKzmoqxp+R2hy91spOSpOr/26/Ed9Xn4RmpyjKDWEEFLRyCqpAX0XFKcsNGa0UbpCg0ncUhUaiAAa1NxzCyX3iPVhoTlgibR7ZaS+v/t/zHKhgSBgXpfj10eE5l81vtBpyPXbdso138YKDYa3Z5vQ5By5UYaOKp/JpAghhCRG1kkN+O7P4qwWmirnOw1qE9V4HrwsIjSGBwdludAoScg9TUlC1XVy8LEDo2aSXLd1p1ylPrN4QlP1jVih2ffFWKHBZ+IWmpzbw/dS1kJzTMNNu6W/mBBCSMlkpdSAb+YWpyU09l//6QiNLQVJCY2SgL3PK5RvhnrPB9FmYJYLzakFcvrthbJxU+y03hCbK78qH6HJca49SmjOcq7XFpqTExeanMM2yCtvJz9dOSGEkLIla6UGfD2nOKuFpv9v8UfPPDAge4Wm7g2Fsqmg5EwGxObSzyuu0ORUixWa3MM3aKE59+p8qYgLXBJCSGUnq6UGfDWrOG2hyVPikAmhwRwumRIawwP9w9eWTUJT5/pCWbux9Dkv1m7ZKRcqIc0moWl6Wb5sUddNCCGk4pH1UgN6zijWQmPqNNIVGkhCJoTGNKipCo3hwR+KfSc0BojNuR9TaAghhKSPL6QGfDat2JdCY2j9fbEWGlyjW2jQ0LuFRi+m' +
                '6RKaPZUAuIUm94ZYocE9uIUG9+EWmipN0hMawxolCk27U2gIIYSkh2+kBvSYWhwRGnRpZEJobDlIR2j2OTd1oTE80DfkO6ExrCncKQ3fp9CQikswGJSVK1emvAYQIaTs8ZXUgI8mFftSaAytvgv5TmgMq5XYnPgOhYZUHDZv3ixz586VUaNGSb9+/WTAgAHOO7uHUCikr2nTpk3q53KL/p4QsgvfSQ3oNnFnlNDgr/9MCM1eSgh2p9AY2nyjrt1nQmPQYtOJQkN2P8uWLZPvvvsuKkaOjJ5TqrxYu3atjBs3Tr7//vuo68H348ePl1mzZun3Cans+FJqwHvjd5YoNCi6zYTQGBkoT6ExtP465DuhMawuUGLziiU0zn1RaEh5smPHDi0TU6dOjUjEtGnh1YzLC0zwOGPGjMj5IS7Lly+X9evXy+LFi+XXX3+NvPfjjz86exFSefGt1IC3x+3crUIzYHTZCI3h/t7qHnwmNIbV+UpsnitBaK6NFZocMzLLFhp1nRQaki4LFiyIiMOiRYucV8uH2bNnR86N63AD6Zk0aZJ+/5dffnFeJaTy4mupAW+N3RlXaJANyITQ7GFJQHkIjeH+L4O+ExoDxKbm00UZE5rcGh5C808KDYnP5MmTI2KxYcMG59Wyp6CgQPr27avPO3ToUOfVWFBXgyzNsGHDnFcIqbz4XmpAp9/C87z4TWgMrb9Q9+EzoTGs3qzE5jF1b+UgNGdQaIgHw4cPj0gNRkCVFyhQNuf9/fffnVe9+eOPP+S3335zviOk8lIppAa8Naq4VKHJUWKQbUJjuL9nwHdCY4DY1HlA3ReFhpQz6N754YcftFj8/PPPzqvlw5QpUyJS079//3IVKkKylUojNeCt4cVJCQ2EIBuExtD6s4AWmrybYoUGo7TcQqPFwCU0RhCihEZJwu4SGsPqTTulRislaxQaUo5g2LQRi7Fjxzqvlg+o3zHnRiATwyHchMSnUkkNeGtYyJdCY2jdI+A7oTGs3qjE5m51DxQakmEw' +
                '0mnevHm6LmXgwIEyaNAgPbII3T5GKtDFUxLYH++jWBf7o8YFQ63TqcHBMd1DuDFfDl5PFtTnoDYI2SbMtYOvGMm1detWZwtvMPrL3m/w4MF6NBZkz4uioiJZvXq1LnAeM2aMvl4Dsl6YYwdD5fH+hAkT9PPGcHQ3uEdI3ejRo/WzhMytWbNGf4/rWbdunT6ezbZt2+TPP//U3YX4DBD4DBcuXBg3y4XjYBsM1zefHQQS90Gyj0onNeDtIaGkhcaIQEUWGkOrj9R9+UxoDFpsmqt7oNCQDIAGbebMmXpiPQSGTKOxhdTYMoHAUGov0EBjXwgNRigh0DhiH0gJGvJUWbVqVaRY2ASOjdcTATJgxAxCAFGAfOF68RokJRAIOFvvAnICKcE2Q4YM0Y0+7gv3iNcgOMhcofFHETO+nz9/vn7PDoidAWLlfh9hjyjDtUCE7HuGULmzVgjIDTCfoXkd14XvISnmNXTfQdDc4D7Ndrjf6dOn63vB9/g3yT4qpdSAjr+EfCk0htbdA74TGsPqDcVS4xZ1/RQakgZo8CExaMDw1c6A2I26CTTKbpBlwHtoSO1sADI0Zr94I5cSYcmSJZFj2YGam3jdUXgP0oFtITJ2ZgNZKXMczMNjA7GASOA9DBe398NzgSCYfe3ALMcQB1sm5syZ4+wZBsdGlgUyZbaxs1nIttj7IyCYkBwIlZExyCKyTPjMzPbYzi2QmMvHHAe1UYWFhc47YczINvsZIEOD1yByJPuotFIDOv4UTEloIAEVWWgMrT4o8p3QGLTYXK/ug0JDUsRICzIDXus5oQE33T9oTO3GHZj5a9CYesmFEQNEad08pYE1p0wGwQ7cQ0lrUSFLYrZxs3379sgx3JP2mQJlnM8ri2NLBzIi2B5SaK7DzpqUlFEqbUSZW+SMHEFi0MWE9wGyT3jfS1gMdhcisnAGfL7m9aVLlzqvhmUQr0G+SPZRqaUGvDUo6EuhMbR6r8h3QmNYvb5YajYrlNw6SmQoNCQJIAmmQcvPz3de' +
                'jQaNdEnzxKAhNl1MEB782x12F4o7Y5EKEBGTebFj4sSJzha7QNbEvI8G3+v67GOYBtyWHYiKF7YkeImEneEqSebMiLKffvrJeSUaPC9zDK/7A/YyFugCLAlbkGyB27hxY9TryBIByCvuiwuXZieVXmpAxwFBXwqNodU7Smx8JjQGiE2Ny9X1W0KTe0ys0OQeSqEhYdBYmSwKJKEk0JVhGj13w2rPIYMuGnRjxAuveo5UQINrN/gmTObCYMQC2Rav63GHadCRWTHHLKmmBDU2eB9ZLK+GH6KC99FN5QVEx5yjpBFltjh5dfvhOdhi5pVRMkBazXYIiBvAPqY7CwGxYXYm+6HUOHT8IehLoTHc32WH74TGsHpdsZx0ZX5coTmvGYWGhDE1E4h4GRT7L3zUoNhg1A5eR23I7sCWKoTdxYQskskSQbiSwc5gQSzc2KKHbiY3EAXz/ogRI5xXo7HP4TXyCZiCZK9uP2Bnokr7DPA8zLYIdDsZ7JobEyh4JtkLpcaic/+g57BtSMB+FxTKwDHZKTSGF3sWyb7qPryE5uLWW2RjfvY2+oVKWJ7vvF2ObqykxhKaE5tskk7vb1e/2Cg0JAyKZk0Dhi6MkrAXksRwYgMaWfMXPmo6dhfIcpjrQ9bCYHerJNvthXszWSwc086AQA4gKngP0uFVR4SFNs25UWvjhZ1p8hpRFq/bz2DLCGp84oGuJLOt/ZwMkCx38fOKFSucd0m2QalxMWpmSK57brvso6QGQrPfRYVy96vbZdZCf0x6tbFgp3TqVSQ3PbtNbmq/TR7quF1mzvfPhF7FxTtl6qygTJoWlJmzs1tCSdmAYlHTeHktEmkwRagI02UB7AJTdMVkGtSHoEuoNOxMkr3uk50JKUks4oH9TYE0jovh1MhemOwJnktJ3T0YMWTOXdKzNQXMCK+upXjdfgYUC5ttIGHxsGtv7EJhG3SJmW4zBO6VZCeUmhIIhXZKUWCnbiQJIf4Bw3dN4xVPHsxcNahLcWP/ZR+vngMNtFf3' +
                'STzQkKOBLW0/e1g2skoGu4aktOHk6MaxQZYEI4GwH8QGXTu4f1wPnhVqg+Jdl/1sS6pPKa1rCec3x3B3+xnsjBDCawSVwYy0wvlM4TI+M2S0bJDRMQXMCBYKZyeUGkJIpcJuNCEuXlJiN5pe3Rv2KCSvbAIaa2RS0JAmO6uwKZK1u7zc4JpR2Irt3PeAc9uNsz25nQFdR2aiOSMEaNRNETDuyc5OJYo93BsZHxtcF7I3pXUt4brMMUqa1RfCYboAvc5lKGmEFI6L/d2YLJJ7mDvJHig1hJBKBUb62A0i5qlBNwgadzSO9pBkBKQB3Rb4i99gd7MgUGuCBhSZDEgE5ACNN2o/ksWcH+f16p6xJ6jDObzmgrG72BBorLEdrg9FxqgtgdDY2Qq7hgj7Q0DQ+GMfSB62RRbIq5bGgGdpjoEsD2pTkA1CdxG6iYzQIPA88XzsZwSRsruBvIaMG+xiaUiIW8JwbnM+ZJnszIvpurOzSbgvk0VisXD2QqkhhFQ6zMR5XoH1gpCpsF9DVsEeNo2sg12o6w4co6T5b0rDFgPIFwTDLFMAObHneCkpC4RJ6uzJ/9yB49gzKAOvpQhKCgiLV5G111IJCMgF6nvc7+NeIDwQDlyTyT6ZwHPH/SPc0oLPwEwUiECXIMQMxzPPEOfF925MTQ7Oh8wdZBbnwmvIlOHYJDuh1BBCKiX4Sx7ygYYM9SNoVE3NCP6yR6YEjWS8yfkgG2jgTQOKbinITzqNIkZnIQuBUULIANnZDQSyNJCDeLU8ANKCIdPIyGA/CATuMV63FrpozPaJBDI4NrhvXDueHd6HeOGYRkjwPJENwVc8a5M9wfu4tnhhZ1psULeEz8vUOeF54Ryox3GLmwHPBdJnRnMh8LPg1VVHsgtKDSGkUuMlIGhAkxGTdCSmNHBsNPpYGbs0kSmJRK8PggAhQGOP7ipkY9A9hCwRshsQLrtuJt6ij17njFfQmwlS+RywTyr7kYoJpYYQQojODCHL4a4/cQMBMN1EyLgQUpGg' +
                '1BBCSCXHrDaOLpnSshaYp8cUWruHRROyu6HUEEJIJQZZGSMpqIGJl6XBe6YIN9nZigkpDyg1hBBSicFQZnuIO0Z+edXuYPizGaqOzA7rUEhFhFJDCCGVHHsmYIQZDYZCYCyKaeaOwbBn9yzEhFQkKDWEEFLJQdYFi0tiZJOdtcEwcLyG4dGpzrtDSHlCqSGEEBJFvLoaQioylBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQHyDy//O30PvAjFjdAAAAAElFTkSuQmCC',
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
              pageBreak: 'before',
              style: 'header',
              text: [
                {text: 'RIF: '}, {text: 'J000846448', bold: true},
                '\nDirección: Av. Francisco de Miranda, Edif. Cavendes, Piso 11 OF 1101',
                '\nUrb. Los Palos Grandes, 1060 Chacao, Caracas.',
                '\nTelf. +58 212 283-9619 / +58 424 206-1351',
                '\nUrl: www.lamundialdeseguros.com'
              ],
              alignment: 'left'
            },
              {
                pageBreak: 'before',
                width: 140,
                height: 60,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjUAAADXCAYAAADiBqA4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEEdSURBVHhe7Z0HeFRV+ocTYv2vru6qa19WBZUqgigI9rL2gm1dK4qigih2RRHrWkEBG6ioWEBUUIqKgBQp0qsU6b1DElpmJnz/8ztzz3Dmzs1kWkLm5vc+z/eEzNw+IefNd75zTo4QQgghhPgASg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqamkFG/dKtunjpfCX/pJ4Y9fS8GAnlLww0dSOOgT2TK0l2z9ra9snzxEgmuXOnsQQgghFRtKTSWgeMcO2TJliqz7sqcsf/YJWfjfy2XBOXVk8YV1ZMkVdWXZtfVk+c31ZGXzk2Vly/qyunUDWd22gax55BRZ+3hDWffcubL5w/tky09dZceMYRLatMo5MiGEEFJxoNT4mI3DRsicO+6WSbVqy5TaNWT6yTXl' +
                'j1NrybymtWThubVl8SV1ZOlVJ8myG+vJitt3Cc2ah5XMPKFk5ulTZf2zkBr19QUVL54WDvXvDZ0ul63DP5Tiwg3O2QghhJDdC6XGZwTzC2Tpux/L+Ebny+gjj5ffjzlBJlY/UabU2iU1f57hSM2ldWXZNXXDWZo7ldC0qr9LaJ5pGJaX/50mG19tJBvfUF/fVF87OaH+veH101Q0lYK+7SWwbIZzBYQQQsjugVLjE7bMXSB/tHlahh9eV379ezUZcUh1+U1Jzbh/nSATlNRMrqmkpp6H1FxbT1bcoqTmLiU0bRrI2kdPCWdoIDSvOCLzdiPZ1LWxbHrvdNn0/umyuZv6t/qqv1ev431Iz+ZPbpftUwfIzuKQc1WEEEJI+UGpyXJ2hkIy/+WuMnj/E2Xw/x0nQ/Y/Tob9TUnNwdVl1OHHy9h/Hi/jjztBSc2JMq1eDZlldz8ZqbnN6Xp6UEnNEw1lfQcnQ6OEZlOXsMDkf6hkpof6+lkTKei5K/I/aSKbP3ZEB4LTqZHkf9pcgusWOldICCGElA+UmnJgc3CnzN5WLBMKQzK+ICQztxTL+sBO593UKZz9p4xtcpX8vM9xkRiy33Ey9K/VZPhB1WTkYdVl9FFKao49QSadeKJMrVNDZp5SQ+Y0qSkLzgnX1KD7SWdqIDVtG8i6J8M1NLrLCRkaZGaUtGiJ6aXim6ZS+K2Kvk3Cof5d0EfFV0pwlPBAfpDB2dj5TNk2rqfs3Jn+fRJCCCGJQKkpI/JDO+VXJTAdVwWkw/KAPLs0IO2XBKTdYhULA/LUgoA8r6L/2pCsLUqu4YcoLHyzm/xyQI0ooUEM/ouSmv2Pi+mC0nU1tWvIjAY1ZXbjmjL/rFqy6KI6srTZSVFSs7bdKbrrCd1JyLxs7t44nJ3p7UhMfyU0A8+XLYMulC0/XqK/6u8HnCUF/c4ICw4yOMjsvNtI8r+8S0IbljhXTgghhJQdlJoMU6yEY1RhSF5aGZDnVuwSmmcgM5bQPP5nQB6bF5BH5wbkkdlB' +
                '+X51SALFpcvNtsXLZdzZ18XITCTQBbXfcTLswGoyXHdBVY/qgjJ1NfPOrCWLLwiPflp+U7imBt1PyNQYqYGU6CzNV+GMDMRFi8zgZrJ16I2ybdjNsvXX28Jfh9wgW3++Iiw53zvZGyU3kKJN750t2yf1ce6AEEIIKRsoNRlki5KSD9cF5fkkhOZhJTQP/RGUtjOD8sLcoKzdUbLYbF20VEZUb+otM1bobM1fq+lszchDw11QGAUV3QUVrqtZclldWX7DSeHRT63DNTW6+8lITQ8lNeh26ndGODvzy7VhkRnRUrb/1ka2jW6rQ/975L36PWwTkZveSmzUMXCsbaO7O3dCCCGEZB5KTYYoDO2Ud9YGUhaaNjOCcv/0oLRT/16zPVZsEhUaHTHZmuNlXNXjZUI1ZGtqyIz6NWV2o11dULqu5raTZdW94dFPKBRGTY3ufkKmRkkNBAVZGp2hgdCMeVi2j28vOyY+Lzsmvahj+4QOsn3cE1pwtg5vruWmcMA54bobZG26NZbtYyk2hBBCygZKTQbIlNDcPzUoracE5fFpQVltiU1SQuOEXVvjztZMq1tDZjUMj4JadH5tWXKl1QWFYuGnndFPbzfStTG6+wlS89NluqsJ0rLj96ekaPL/pGj621I08x0pmvV++Cu+V6/jfZ29UdtjP521QTGxOt6asd10Nx0hhBCSSSg1aZJpobl3UlDumRiUR9X3q7ftTEloTLhra7yyNQvOdkZBXaukpvnJkS4oXVeDId3vh0c+oUgYmRojNcjKFE3rJEV/dJPAvM+laH5vHYE/v5SiOZ/IjhldwtmbsY/JthEtdB0Oiox1d9THp8u00R9QbAghhGQUSk0alJXQtJyg4vegPDK+SL5v+h9PYUkkzLw1ZiSUmWHY1NZ4ZmtahmcVxozCkS4o1NX0aaq7klAQvH1UK931pKVGCUxg4bcSWjJIgsuGhGPxAAks6COB2R/pbbAt6m10rQ1GSTliM3lsD4oNIYSQjEGpSZGyFpq7xwXljrHq' +
                '3/2Wy1fHnuUpLYmEKRo289ZEjYTCsgmnWbU1mIjvdle2plMjXQtjuqAwwgmZF9TO7Jj6hpaa4KJ+Elo+TIJrxkto3WQJrZ0owZWjwnIz73OdtdH1NkqGIEWQI4jNxh5nyNBF0yg2hBBCMgKlJgXKS2juGB2U5r8F5bbeS+WLqmd4SkupYRUNm1mG7XlrZjaoqSfjMyOhsLjlqhZObc0zDfVSCZFsDSbeG3h+uFh4dFvdvYRaGmRlIDUQmuLN86W4YIkUb5oXlpulg3W3lC02dsZmSa8bpN/GLRQbQgghaUOpSZLyFppbRwbllhFB+W/PxfJZ1dRqa+xuKF00bHVD6aJhZz0oM28NJuNbdU94JJQZ3m1qa/TQbhQMO9kadC8hG6O7n9aMl535C2Xnjo1SXJSv5Qaigy4p1NposTFdUabG5qsmMmJoR+mzKUixIYQQkhaUmiRwC037ZbFC8+T8WKF5eFas0Nw3OVZoWkBmXEJz6/Cg3KzixmFBufrDhfLp0U08xaW0iJq7xt0NhQn5SuiG0pPxvaik5q1GeiI9PbxbyQiyLbq2BgXDGPU0v3c4W7N+muzcskKKQzu02EBydLeUkp6iuZ+Fa2yUDOniYYyK6ttE8ns2lY9mTpTeGyg2hBBCUodSkyC7W2j+M1TFL0G5qPN8+SRFsSlpNNSUWruWT9BrQl1qTciHWYadId5Y3FLPW2OKhofeGB7ebXdDrRihxUZ3QW1bK8WFy6R4wwz9OgqKMVoKQ771pH3DbtbdWejWWtzrWnlxcYF8uS4oIYoNIYSQFKDUJEBFEZrrBgflmp+Dcs6rf8onR6UgNqa+Bqt4Y12oI3bV1+iZhnV9jTPT8BVKbJy5azxHQzn1NRATd32NHgGF7MzGWVK8aY6WnNCq0bpw2GRrMI8NJvHT3VDOHDaDh3TRz/SLNRQbQgghyUOpKYWKJjTX/BiSqwcGpdFzc1MSm6SHed/sDPN+5BRZ/2xYbPRClZ84K3Y7hcM6YzPxed0VhRobCIzujlIy' +
                'owOjoxb/EBkNhW2xD/Y12ZrVn18kz84v1DVJn62k2BBCCEkOSk0cKqLQNBsUkisHhOSyH4JycrvZ0iMVsfFYG2r8saUXDhux2fB6eF2oKLFxzV+j56iZ31sP94bgaKFZ0EdnaiIT8415OLycwk+X6QLk/M9Pl69G9o08z0+WU2wIIYQkDqWmBCqy0Fyh4vL+Ibnw26DUfniW9DgyTbE5bJfYTK6hxKZejeiVvJvFio17Yj69gvfgZuFRUWMfC3dHYckE1NDM+STc7YSvWE4B3U/I1BipsWYbntv7Vv08H5kTfp4fLw1RbAghhCQEpcaDbBCaS74PyaX9QnJO76Ac33qmfJyG2MRMzKfERo+IKkVs9Bw2pnjYLHpp1odC1gYT9GHByymvapHRMjP1DS08Zm0oIzV63holR8j+vD1uon6ebdXzfEA9xw8XVW6xCYWKZebsZRmJHTsCzlH9zabNW2T5yg1xY83azc7W5Usi17Y5f6uzNSEkGSg1LrJJaP7dV8W3ITnjs6D8q+UM+fiI5MUGhcNhsakuo7yGettic5VVY4PiYTMqCsO9Mesw1oj6NjwyCqKy9dfb9Jw0ekVvCI4SGS0zGNKN0U8jWkYWvIxIzWdN5Ldv20WEps208Hw+HyyovGKDBi7noJsyEnPmrXCO6m8efKqn5/3bse+Rt5e72BQXF0vNxo95Xo8dTz7fy9mDEJIMlBqLbBSaC78JyXlfh+TU7kE5+o7p8lGKYqOHervFxpWxiVnR+8EGsrbdKXoeG7345Xunh7ujeoUn6UOtjZaboTfqjIyWGCU5+uuIFmGhQZZm0IXhEVC9m+hMzfoPzpCnJqyOCA2eJZ7ju/Mqp9jsVPeMxrCoKCjz5q+Srt0HS9WT2ng2hogDj7lLPvr8V5k1Z5ls21ak98UxTFQGAoGgLFuxXj74ZKiccNojns8JUd7y0HfABM/r+L+jmsvjz30lE6cslLXr8iUYDDl7EEKSgVLjEE9onloUKzSm5sMWGjTCbqG5e3ys0Nw+' +
                'KlZobhwSKzRXD4wVmksgMy6hOa9XSM5RcVLnoBxxc+bFBjU2pnh4wXnh4d5YTkHPY4N1oh5vKOs7nKrrbDa+Hc7aIOMCSdFyg8zNj5fodaP0EgkIyAwyNBCa/k11hgfDuiFFkKPuPw+KEho8x7vUc+wyhzU2YOHiNXLI8fd4NpBDhs9wtiJgxh9LJe+Qmz2f1V+rttDdQeUBhLLh+c94Xkfbdj2drQgh6UCpUfhBaM78IiRNPw9JjVeDcuh/p8uHaXVFRRcPR0ZFNawVmccGE/Qtvf4kPfPwqnvDdTbojtJZGyyrgCLi7o7coN4G0gLBwWzEKCpWoYuD8RreU9tg2/wPT9cjqwZ83THqOUJo8AybjwlK5z8oNqDFA91jGsf9q96psxQkmuMatI15ViZefLOvs1XZ8ouSTa/zI1556wdnK0JIOlR6qfGT0DT9LCSNPg1J1Q4B+ccNmRMbex4bswDmgrNr6yUVUECs62wwSV8bZ3XvDuFaG90lBbnp5oySwtpRXzkZHBOQmc9PjwgNsjTI9kzqdles0PwWfoZYC6vTTCU2xZVbbHp8OSKmcazd5HHnXWJz8tlPxTwrEwdVaylbtmx3tiw7zrnyRc/zI55gDQ0hGaFSS01+cKd0VvLy2soi3wjNqZ+o+DgkRz4ekIOvmS7dD09ebGLmsXEm6DMre8+oX1NmNwqvFYUCYj37MJZVaO5kbVBEjDWjLLmBqOiaG3RNIRvzcbj+Bl/19+p1IzTI9Kx87Wz1DIs8hcY8vzemVW6x+eaH32Max5POfNJ5l9gYqTmiVis5rMZ9Mc+t03uDnC3LhjHj50XO1eDcdlHnRtzd9kNnS0JIOlRaqYHQ/G9+UB5QcvLEjG3y3LIi3whNw49CcnK3oBzcJiAHXT1duqUpNnpJBSU2WFJhghKbyTVr6AJi1Nlg9mHdHXVJHVl2jZKbm+vJqhb1ZXWr8CzEEbl5SckNam6QvXlLRRclMV2dUP/WMtOpkZ7YDyK0/oVTpd2QuSUKzQ3q+V2v' +
                'nt+rUyqv2Hw3YHxM41jvLEqNF8fWf1A/H9S0vNa5f8xzO7JW6zId7n75f9/Q50FW6Ot+42LOf+3tbztbEkLSoVJKjS00GDYMMXlgYqG0X1TkC6Gp3z0k9bqFpM67QTng7oD8/UolNoelKDZYUsFZK2rU4cdHFxDXDXdHYSFMO2uja21ucUZItQ5nbtAthfWj1j0XrruBuGCeGy06KvBvLTPqPUgQ6nPe6d0vrtCYZ/fKxMopNpSaxPn7cXfr53NBs/9JQcE2+duxd8U8u26fDnO2zizTZi6JnOO5176V0b/PjTov4tyrXnK2JoSkQ6WTms0uobFH2LQck+8boTnpg5DUei8kNd4Kyl9uDciBl6UoNs5aUZHVva06m4knhLujpp/sDPtuWkuv8o1aGz30+wYlN7edrDM36JbCEHBkbyA4GAoOycEkfia09CiZQXZn7aOnSN8uL5cqNHh2eG4vTah8YkOpSQyMOqpycHj0k8mIPPvKNzHPDsXEZTGU+sa7uurjY9j2+g0F8sfc5THn5udGSGaoVFITV2iUkNw5JiB3jtrsG6Gp825IanYNyXGvBWWfGwOy/8XT5f0UxMas7m3X2US6o6qFJ+qLZG0a1dRz2mDoN7qkMGFfJHPT/GQ9cZ/ummqjJKdtWHK06CiJ0f9++JTw6+r9X15+JCGhMc/t+d8rl9hQahIDmRnzfDBiDEAu/nL0HVHPDvFFn9H6/Uzx54JVEaHChIBg5aqNMef9Z902+j1CSHpUGqkpTWggJLcrGbllREBuGbrBN0JzYpeQHN85JEe9EJS9rgnJfv+eKe8dmoLYqHDX2US6o451sja1nFobPfQ73CVl5AaZm2XX1tPz2xjBQQYHkoOlF5DJ0aH+jdfQdTW0/f0JC83F/dTz+i4k7cdUHrHJRql5+JnP5ZTzno7EipUbnXfKjqXL10eeD85veKT9F1HPDoHRY5isMFPc9WB42P0e/7hFXwfYvr0o5rz7/fMO/V5pXH9HZ6nR6NGE4u0PfnL2Sox2' +
                'L37teRx3GDEEg36ZKh3fHeQZv0+a72yVGnP/XOl5XHd07rbrPrHPeHXeYSNnSf+fJuv6pU++GiHvfTxEF4Nj6HyHV7+Vp1/6Wp56obeefBEjz/D9869/pyetHDF6tl6qIt2fg42btsiCRWsSinTquXp9Nzbq/xQmeEwVzLDtdX3xorCw7EcOJkOlkJpEhcZ0dVz7c0BuGLReC82DkJkEhAbzp7iF5qZfY4Xm2p9ihebSH2KF5oI+sUJzZs9YoWnwYazQ1HonWmiOe0tFx2I59OmQ5F0ekn0vSENs7O6og6qHh307WRvU2pih3zPqhwuJjdzoYuILldxcVldnbyA46J7C7MSQHHRTRUJ9j4Lj4Y+2SEpoznMk8JlRIQlWArHJRqm595GPo6731bf7O++UHdNnLY2cDw2XARmTvQ+/Lep6EP0GTnS2SA80jHseeqs+5m33ve+8GsbrvJgxujTQ0K5bXyA/DZ0m1U55KOYYV9z0pkyaujChY7lB1xsaNfxcnX/1y1HHhXRBkhYvXafXIjNg7p32//tGGv/7Wcm1tjf7jJ0wz9kyeeYvXK3PCflseslzUcfe54jb5fZW7+ufnw97/ursEZa+C695RRd+29sj8MwhQD17j9Kyg8a/z/fj9PcvdeynPyPcB64b22Nixhvu7CxffTtG8guSX4vr869/k7pnPBFzHXZgZnBcLzJ6qeIeBYm6sVR5o+tAfT1H1b4/6ph2HHrivXLW5S/IJTe8Jpf+53UtgRUJ30tNskIDEcFyBZf0DUizfmt9IzRVVRzxRrEc+LASm0tCsve5M+Wdf6QmNu7uKDtrg1qb8AipaLlBMbGekRjz25wfrrvBBH66sBhdVM2U6FxTNxL4fuS9tyYtNHheZ30VkieH+19ssk1q0NAeXL1l1PXiL/+yXrph1Ng5kfPZf9UDt2QhTj3/mYxcE2YJNsfEkhU2XsPKV63e5LybGJg52t4fxdCZmnhx69YdUuv0XWtUISNTGpi52UicCSzZMWX6YmeL1MHn' +
                'gcyKOS4+03hg+y7df466lgP+1cJ5Nz5YWgSyc9UtHSNdh5AoLGORyuzTi5aslRMbRS/Vsddht+pMUiZodmunqGNDLk1WMFXw/Hr3HRszE/ct975b4Zfw8LXUpCo0NzgCcuYXQbmyzxrfCM1hr6t4tVj2vTckuReFZK+zZkrXVMVGBbqjorI2Tq1NpEvKkhsUE6NbCjU3mJVY190owUEGB5KDLA5ER8vOJeGvQ1s0jwgN1sByCw2emZfQoIuusXpejw/zt9hkm9R8P2hizPUixk3809mibEDjYc71aa+RzqthsNyE1xIKyECkA7IpKAzGsa68+U3n1V24GzmEW3xKAxMG2vujEc4kj3X4Uh8XApao5Jkshx0Q2WTvzQvIAY6HjEsi14Nt7KVEEpUaG3Rl2dkWiKP7ZygR3BNlYoh/JtiwsTBGJBHIPGWCs6+InjCyrP+vZgLfSk1JQmMvLhlPaK5WAgL5qP9+QC7rtcY3QnPgK8Wy3/+KZa/bldhcEJK8M9ITm5iszcFWl1RVD7mpV1NmNHCyN1pwaupRU5AcdFPpOhwlO4iBd7RMSmhMzRGEBs+rYY+QPPyLf8Um26Tmmtve0tdoZzAQ9zz8kbNF2YDuBXMur66lW+99L+p6EJj9Nx2eeblP5FiYeM8Nujns8yFKyz64QTeQvT9GWWUSNN44bjLDzY3U1Gn6eNS1QYywGGs6oO4Ex4IsJgqu3VxDKlIDkP1C15Q5DgI1OImKHoAc2fvb3aDp8O5Hv+jjoZvs8JqtIsdH12Qy11cSDzz5WeSYiHQzQOWBL6UmU0KjG9C+Qan+ekAu/XK1b4Rm/5eKZZ8XQlLlP0pszgvJnumKjQo7axPpknLJDbqlUHODgmJbcGaeEl4w84/TwqOn0FWF+OaO+9MSGvOs2v7sT7HJJqnBX5RIuSONvzl/qy5oNNeMxgYp/7LC7oYY/tsfzqu7wBBrdz0IwktGEgH1F+h2wTHOvOx559VoLr7+1ZjzIZOVDKivsff/792ZlRqzovi/' +
                'r33FeaV0jNRghXS7+wpxdJ37dU1OqkAucJxkpOai63Y951SlBuBZQxzMsRCPPvul827pTJ62KGrfTNWSNbowLMeosTKZNRO/jZvrbJU6KKy3j4k6sYqO76QmGaHByJp4QnNpv3ADekGfoBz1TEAu+Wy1L4Rm3xeLZc8X1NcOIcm7WonNuSHZo6kSm0PSExtkbcyEfV5yY2puUFCM0VKYwM8IDoaEa8mpHxYdxMct26ctNHhO9d4PyQPqc/Cb2GST1GD0Ca7vPy266O+7dh8cdd0oxiwrXnijb+Q8JdV3mCySHZfd+LrzbnKgwTLHKKkWBQJinwuBLopkKGupMd2FqUgNRnihENtdzIy5gFId8ZaK1NjymI7UAEwNYGdDED8OKb3WCLilBrNapwtGeuFYyIKhzsU9/5E9Si1VKDW7mbIQGkgHGs+mnwXlkLYBueDjVb4Qmv97Phx7Pq2k5jIVZ4dkr8YzpUu6YqNCj5BClxTk5m+75AbdUqbmBqOlIoLjZHAgOViCAaKDSf1eeLZXRoTGDG9vrT4LP4lNNkmN6W4ZOHiK/t5kbsx1Y8RFWWH/YkYNjRcTpyyMbGPH1BnJFbki44TRIdgXtRgldQHc92iPmHO9+c5A593EKGup+eHHSfq4qUoNWLJsnZ6Dx75O1BNhlFWy7G6pAV9+MzpyPAQ+a3Ov8SgLqUEXGI710NO7pik47YL2kXNgxf50F2ql1OxGIDQv/5m60KCboyShMY1n/feDcsA9Smy6r/SF0Oz1nBOPh6TKBUpszgpIXqPp6WdsnIjIzV+r7crcoObm0PBoKZO9iQjOsWHJQTcVROeuD2ZmTGjwnKq9HZJ71PH8IjbZIjUYropr+8cJ90aNnLiu+duR60b3D7osygL8xWrOg7lDSsLuqjCBLodkMDUOiHgT+WFOGPs8CLyWDNkgNQCfv3u0FxZehdgmQ0WQGkjqCadFF3ljHpzSyLTU4LP/V70H9LFs8X6/RzgjagL1ZOlAqdlN2EKD4deZEBoz8Z1p' +
                'PJso2WiiGs4TXw/Kfs0Dcv77K30hNHs/q7ZpXyxVHg5K7tkByT1Dic2p06XLwZkRG0RU5saRG4yWMtkbCA4yOFh+QUtO1eNlVPW6ckW/HRkVGjynY94slhZ9i30hNtkiNZjHBNdmZtQ1IGtjX3umRmy4wdII5hz2HCtuRo6ZHXU9CMgW0vyJgEbXNDT4Gm/o6+tdBsScC8PLkyFbpAbMnL1ML+ZpXy+Gzicz/0tFkBpgfp5N4D5KI9NSg7lhcBwUZNtgyDnq1sx5zrv6Zeed1KDU7AbKU2ggGZi995/tg/J/NwXknHdXaqHBsRIRGjTMbqHBEGS30DRSDbRbaOqoRtotNKahtoXmiNdihQYy4xaav3TYJTR57UOyx9Mh2buVEpumSmxOD8geDTMrNgjIjSko1tkbp2sqIjjI4GjJqS69m1xbJkJztBI+PKPbv81+sckGqbH/osQvdhs0+naNQvWGmRmx4cZMJId0fGmccenzkesxccf93Zx34/NZr12jrFAzFA9MGGefA5FsViibpAbg84dY2NeM551oF0lFkRp7gVIExLe0e8i01NzZpps+DuTYjVlrDIFrS6c4m1JTzpQmNHdkSGgaO1kTCA0EA43mIQ8EZK/rA3J21xW+EJp924Vkz6dCkttCiU1jJTaNdkhe/anSNcNio8PIjZO9iRacsOR0vL5DmQnNP9TzOUg9nxv7ZLfYZIPUmOwHRsJ4CQsmNLOvPxMjNtyYkVaYJbU0UPhpXw8CSxygNiQeEAxMJIjtMTcKJq+Lh3sWWESyM8Fmm9QAjChzr7kF6UykLqWiSA2uAz8T5riI0kbKZVJqULcFQcfEgF5F14N/nR51rnSGj1NqypHdKTRoNKt3Dsr+dwRkz6tDcsbby30hNFWeDMleT6ivNxdJ7qk7JLehEpt6U6XLQWUgNk5EsjdKcCIZnAOryUOPfFOmQoPnk6ueyXVfKbEJZafYZIPUmHqWkoawzpm3Iur6MzFiw40ZgQOxKg2IV/1z2kVdE+L+xz91' +
                'tvDG/ixefLOv82rJDB0xM+r4iAbntnPeTYxslBrw66hZUV0kCIw0K21ph4oiNSDZuppMSg1GCuIYJRXXo4sVw+fNuY6t/6D+WUkFSk05sTmQvNBguv1MCE1N1WgerxpN1LL887WQ7P2f8HpKTTst94XQ5D2u/gp5VEUzJTanKLFpsE3y6k4uU7ExYQRn8P7V5ZpuS7XQnNs7VmhQb+QWmpPUc4oRGvV84gkNnkWuuv/r1DGzUWwqutTgL0o0JKUVAdsT0WVixIYbM6tsk4s7OK/ExyuLgka4pBE7ECGTDUKjHq8Y2eBu5BDHnPyg825iZKvUAAx1d8+Ei8LxeHVIFUlqMDmjOS4CBbrxyKTUYM0lHCNeEbAZGWUi1fWZKDXlQKaEBuKRjtAc0yksFQd3UHKgpKbKRSE5veMKXwjNPo+orw8FJPfi7ZJbf5vknqTEpvZk6fr30z1lJNPx7uktykRoDnw5Vmj2fix8v9d9GMw6sanoUoO1Y3BNWIYA2ZKSAo2NfQ/pjtiwgXCYxhONQSJAFryWMcBqzl7Y6X40AomAoeX2sRHJNrrZLDXg2/7jPdcWKimrUJGkBgW45rgIrO4dj0xJDdYHM88MQ+W9/j8h3PPpYPHPVKDUlDEVTWjMKKO/PhqS3AtVnK8E5fXlWS80e2IkFKSmTZHknq3ERklNbp0tkldzsnQpB7G5s/3wchWavdoEZO/WAWn2XiCrxKaiSw1W8HVfXyKRzLT8pYHaFnPcZJYRMEsE2IEskteChmZ9HMhTor/0cRz38RHxMhVusl1qAFayRibPvo+7237oWX9VkaTm9Is6RI6LQJdaPDIlNR3fHRR1nEQDdUyFhclnQCk1ZYiX0GA9pt0tNKY7I6+lkppzVZwdktNeXZb1QlPlwYDk3a++3qfEpvFWLTW5tZTYnFC2GZsvjzl/twhNlXuKJK/FDrmmS/aITUWWmtVrNuu/KLFcAGaWxQKP8eKmlu9E3Uc6IzZsUEhpjpnMkGk0oGbUlh2Yndhm9O9z' +
                'I+8lOkoKQEjcjTkCzyJR3FJjZmvOFFgnC8ctS6kB3T4dFnUfCAz/d4tNRZEaXJd73p3SVu/OlNTg/zf2R3bQ/X/IHe45a5KdsRpQasqIii40EAkIRN6NSmrODOhh0ae9sizrhQaxRyslNaqxz22gpKYGokD2rD6pzDI2j7TosduEZo87dkjeLdulWceirBCbiiw1b73/o76eRBerdBfOPvfat8476WFPHV9S91FJ2BPpmcBcK3bNDwpc8ToEZfbcFc6riWHWh7IDhdOJgsbV3jdTKz8bTEGq1yrjJZGK1IBO78VmINyTEVYUqYFwm2Mi0FVZGpmQmumzlup9E536AJkZe6TZWZe/4LyTOJSaMiBRocEMv5kQGjScqQgNGsy9n1ZScFl4npfc03bIaS8vzX6hua9IN/q5tyixqVMguScUSI6KvGpKbP6WWbH54cC68u8em3er0OTdtF32vH6bNHtlR4UXm4osNWYEUaKLQiLrYI/YQNFsSbUVyYDzm2O+8tYPzquJgYbZ/Rc5Al0AADO5mteuvqWTfi0ZcI/2cRHJLqJpixG6RDIJxBLHvfmed51XSidVqQEYNWbuxYQ9kqyiSE2v78K1YiYS+bnKhNRgAU3s684WxsO9uviCRd7LhJQEpSbDFHoM2y5voUGDmYjQ7PNMSDeauUoScs8OD4fG6KGGLy7RQoPJ+xIRGpzTLTRHq8baLTSmwbaFBo23W2hwXW6h+YuSGbfQ7NU2Vmj2vDcsNFXuLpK97tqhG/vcE5XYVFdRbbPkHTsho2Lz0mXPVgihybtGxdXb5KoXK7bYlIfUYJ4ZZCPizcTrZsYfyf1FaXjqhd5R9+K1onayYJSNOR4W1UwWr5l/j6jVSnbsCOjuHvPauIl/OnskzslnPxV1XMSAnyc77yaGPVkguvvWb0i8+6o0IGo4rpG4REhHasCTz/eK3I8Jc/6KIjXIXJlj4pmjeLc00pUa/P8zxb/JdM26M6CYDTkZKDUZ5uNloZSEBnPG7A6hgTCg4dy7' +
                'VUBPXmdGDp363OKsF5q97ww3/rlXqntSQpNznIpjldhU/V26ZkBsvjmssVzQfWOFEZqcy7dKzqVb5aoO2yus2JS11GBtHmRPSpsd181jHZL/ixKg+8a+l1RHbNjYCxDi38mCFP7fjo3tJsJfzZj8DP9GoXAqoCDafVzMSpwM7kbn4y+GO++kB+4bEoBjljbxoE26UgMJbvPEp1H3hEB9SEWQGqxjZddCtW0XvfRHSaQrNT8Pm6b3S/ZnzZ0BrXpSm6QyoJSaDLIpsFMempEZocFIpEwIjS0TJQmNEYXc25UA1AuPGkKBbUMlNlkvNM13SJXbtkvOv7doocn910YdeUf/Ll0OTE9smj8+tMIJTe6F6j7P2yJXPa3EJljxxKYspQaNC/5SRxdJaZOi2eAvyiNrtdbXkkqxL9bRMfeS6ogNG2RnzPGQtUmFDq+Gu2FKip+GTnO2TI5rbnsr5lioLUkGkxUzgeeXiW67zt1+0sdrmMC6RjbpSg3Az569CCkCImGWltidUgPRNsfDkOpEfz7TlRp0AWK/VIp93dkvZG8SJVNSg98F6f5fTpQKKzXjNxZnrdAYSdiz2XYtNLk1VZxYIA2eXZz9QnOripvVfZ1ZoIUm559KbI7eKHscqcTmgNTE5tXzHwt/Ji6hwXNyCw3qm8pTaHLPUV/PLJSrntxW4cQG83zYv3AQmZIaZGdwvGQzB78Mn6H3SzV7Yc5rIpVf4jamLgSBkUqpgIyVaazdgeedTBebjVm/x45nXu7jvJs47jlTUKSdDvMXro7U6mAEVDJkQmoA5BhD1O37MhmS3SU1/X+aHDnWXofdKsNGxh/GbZOO1BQUbNP3jMC/k8WdAcVcQImSCanBPqixQ5dteVBhpWbchuIoobl7XGaEBsW6mRAaSEM8odnnviLZF3JwgVOHcny4DqVB+8XZLzT/3SZ73KgEoGG+FprcI1UcsVHyjkhebL4+oqmc031zykKD5+MWGiObttCYgudUhCanqYpGBXLVwxVLbMzkdnac' +
                'dGb6UoNRP2hAsKxAMrU0wPxFmeoEeqgJsWeaPfOy5513UsPOhkyautB5NXlMl5o7MEIoVVo91iPmeM1bf+C8mziQEDR45hjoFktWRg3z5q+Smo0f08fBaKpkhc1ITWlrXyUCupuuuqVj5L5M7A6pwSi6g6uHVxlHHU2ysoefPXMdiGSkBmKPfdLpjrUzoPseeXvCq6OnKzX4/YE/cDLVLZoIFVZq/sgvziqhsUcOGaHZs6VqSO9UEnBaoRaaXHTZHLNZ6iuxyXqhUTKQe+1WqVJb3ZMSmtzDN0rOYesl79Cx0uWviYvNzU+O3C1Cg3twC03uxR5C07hAC03OKQVSpUG+XPXg1gojNv/r9H3ULxwERuukmjnAfvYIlGR/cWNuDPzCRKODJRJS5fo7OkfdE+oYUuW4Bm0jx8FEb6mCYtC9D78t6rqwpk4yk+XZ4FmfdkH7qOMh6p7xhLNFcmBpB/ciixj5kkgRK0CXFbp3zBBgNIKJNnwG3JN5RpmqvcBf9xddt0tMEMlIDRYJNfulKjUQkn+ccK8+xl+rttAZ0mSxR+EhXurYz3knPnimjS4MLyNS2gR/8fjgk6FR5+/+2TDnnfigZsjeL5nPFdf+wJOf6SHvqf4/SYUKKzV4IE9O8xaaG4dlRmjQaJal0JhGNPcmJQC187XQ5DhdNic/szirhabKddtkr2bqvq5QIlB9kxaa3ENV/EOJzSFjpGsCYtPh8hezSmhy6qlQEnd92+R+2ZcFaITcs5qawHwsm/O36m3w/yhe4JcN1irq8/24qL+K8YsU7yeD6btPN7vinh8GGY1UcHfPQRjSySC4MyupjKYyeGXZEMiyQA5TATVDmPXYPh6yClinCF1S6ALB8gxYwwqTEs6as0xPfHfDnZ0jWQgElpNIZP0qNxOn7MpGpJPBcoPPDHOsmGMnKjX4+Tf1XWa/ZH6mUUuGeiqTOcRzTKZo2gbLKJjrQCQ6UeIQpzsXn2M6XXpz/1wZdf46TR9PSDTcXYD4mUkEHBuTUWIf' +
                'CHd5UmGlBvy+rjghoTGLSKYrNJCKTAgN5MA0opACNKRVVAOaU82pQTkq3F1T/+nF2S00V6nXrlSvXaxEoOoGLTQ5h6yV3IPWSt5BY6TL/iWLzYsXPZOVQpNTU8WJm6Rrz/TT66mAX8rTZi6RW+99L+qXTaYjmXoBMHDwlMjKyxh6mupf6rg/d1cPusK+6DM6oQYJ26CroEv3n2MaeAQKn9HAYJK7ZAtqUexosiH4yz3ZbBS61tBImS66kgJ1OsgOJJspAcjMoJvCHqGTaKDwFd2GyTT8AI0/sgj2ytWYpBCF7KkKmhvUkpjMVqJS467PQpQ2TQDufcr0xXpBSJPlg6RDQpP9eTHgDwx0C9vXgYxYaXMSQUDtTCPq1VLFjJ6yAyvPx/sZXrp8vf4c7X1qN3lcizCWEfEKdDOhjg3ShO2x0GuyP0/pUqGlBvy4ojjrhQa1GzkQAjT+qEFxumuQ2WjQbnF2C42SgiqXqThficAR67TQ5PxdiY2KvL//psSmse+EBpmpGhfmOz+hZc+osXP0L3J07bi7GMoikLJPBEzkhfWU8AvM3YiaDAHeb/lQ/FmFWz/2iZY0bIu5bezj2IFiQ2xT0orfyDThvF77egWuedGStc7eiWFGv7zc6XvnldJB1gOFpe7zJxL4zBNdXdwGmRiMpEKGw87C2IFrwmeHe0KDmUqjjRqgo2rfL4eeeG+JgQUWS1vFOhHwHCF88aTmvkd76CxIjUaPet4zsi4Y0YVt8DMHwUSmCj+r+NnD84aUI1sFscHoslTpO2CC/r9kZN8d+PnD/SAbYv8c3vVgdz3/kLu7EwE5wvXi2lFLVRLIdqL7EcdGRrckycVnh+5eM4IP3c/Y74qb3tTddV77JBNYzqG8qfBSAwYtLU5YaKLWDUpDaCARmRCavf/rCI3TmFY5ozAiNMhs5B68VuopsYHQ6MY6g0KT4yE0Oa1jhQbX7BYaXLtbaPKu2R4jNCiszbtEfb1oi+Q1VSKATM3flNj8bbXkHLha8g5UYrPf' +
                'LrHxg9DkHKfiXxtl9MTEhzqnA/5ix+Ru5RWr12x2zhwfDNH02t8d4yfNd/bwBt0WXvuVFCV1ISH74rV9vEg2pY9sC/azl0ooDaTi3edNJtJpWA24bsyAjM8C3VAoCC7POodMAbGJ9/M0YfICz2dYWmA/POdEf/YTAdlKr3N5hf3zlOg9xBsijc/Xa5+SwtRezZy9zPP9VAKfU3lnaUBWSA3ov6Q464UGjWmVK5QU1NscERpkNpDVOOnJJVktNHtc4MhBQyUBfw8LTc4BKvZfKXn7j9Ri4yehyam6UXp9n3ofNyGEkMyTNVIDflhYnJTQNMiQ0GCdpEwJje6qQTdUtQ0RoQlnNRbLzT3zs1toIAdnKzmoqxp+R2hy91spOSpOr/26/Ed9Xn4RmpyjKDWEEFLRyCqpAX0XFKcsNGa0UbpCg0ncUhUaiAAa1NxzCyX3iPVhoTlgibR7ZaS+v/t/zHKhgSBgXpfj10eE5l81vtBpyPXbdso138YKDYa3Z5vQ5By5UYaOKp/JpAghhCRG1kkN+O7P4qwWmirnOw1qE9V4HrwsIjSGBwdludAoScg9TUlC1XVy8LEDo2aSXLd1p1ylPrN4QlP1jVih2ffFWKHBZ+IWmpzbw/dS1kJzTMNNu6W/mBBCSMlkpdSAb+YWpyU09l//6QiNLQVJCY2SgL3PK5RvhnrPB9FmYJYLzakFcvrthbJxU+y03hCbK78qH6HJca49SmjOcq7XFpqTExeanMM2yCtvJz9dOSGEkLIla6UGfD2nOKuFpv9v8UfPPDAge4Wm7g2Fsqmg5EwGxObSzyuu0ORUixWa3MM3aKE59+p8qYgLXBJCSGUnq6UGfDWrOG2hyVPikAmhwRwumRIawwP9w9eWTUJT5/pCWbux9Dkv1m7ZKRcqIc0moWl6Wb5sUddNCCGk4pH1UgN6zijWQmPqNNIVGkhCJoTGNKipCo3hwR+KfSc0BojNuR9TaAghhKSPL6QGfDat2JdCY2j9fbEWGlyjW2jQ0LuFRi+m' +
                '6RKaPZUAuIUm94ZYocE9uIUG9+EWmipN0hMawxolCk27U2gIIYSkh2+kBvSYWhwRGnRpZEJobDlIR2j2OTd1oTE80DfkO6ExrCncKQ3fp9CQikswGJSVK1emvAYQIaTs8ZXUgI8mFftSaAytvgv5TmgMq5XYnPgOhYZUHDZv3ixz586VUaNGSb9+/WTAgAHOO7uHUCikr2nTpk3q53KL/p4QsgvfSQ3oNnFnlNDgr/9MCM1eSgh2p9AY2nyjrt1nQmPQYtOJQkN2P8uWLZPvvvsuKkaOjJ5TqrxYu3atjBs3Tr7//vuo68H348ePl1mzZun3Cans+FJqwHvjd5YoNCi6zYTQGBkoT6ExtP465DuhMawuUGLziiU0zn1RaEh5smPHDi0TU6dOjUjEtGnh1YzLC0zwOGPGjMj5IS7Lly+X9evXy+LFi+XXX3+NvPfjjz86exFSefGt1IC3x+3crUIzYHTZCI3h/t7qHnwmNIbV+UpsnitBaK6NFZocMzLLFhp1nRQaki4LFiyIiMOiRYucV8uH2bNnR86N63AD6Zk0aZJ+/5dffnFeJaTy4mupAW+N3RlXaJANyITQ7GFJQHkIjeH+L4O+ExoDxKbm00UZE5rcGh5C808KDYnP5MmTI2KxYcMG59Wyp6CgQPr27avPO3ToUOfVWFBXgyzNsGHDnFcIqbz4XmpAp9/C87z4TWgMrb9Q9+EzoTGs3qzE5jF1b+UgNGdQaIgHw4cPj0gNRkCVFyhQNuf9/fffnVe9+eOPP+S3335zviOk8lIppAa8Naq4VKHJUWKQbUJjuL9nwHdCY4DY1HlA3ReFhpQz6N754YcftFj8/PPPzqvlw5QpUyJS079//3IVKkKylUojNeCt4cVJCQ2EIBuExtD6s4AWmrybYoUGo7TcQqPFwCU0RhCihEZJwu4SGsPqTTulRislaxQaUo5g2LQRi7Fjxzqvlg+o3zHnRiATwyHchMSnUkkNeGtYyJdCY2jdI+A7oTGs3qjE5m51DxQakmEw' +
                '0mnevHm6LmXgwIEyaNAgPbII3T5GKtDFUxLYH++jWBf7o8YFQ63TqcHBMd1DuDFfDl5PFtTnoDYI2SbMtYOvGMm1detWZwtvMPrL3m/w4MF6NBZkz4uioiJZvXq1LnAeM2aMvl4Dsl6YYwdD5fH+hAkT9PPGcHQ3uEdI3ejRo/WzhMytWbNGf4/rWbdunT6ezbZt2+TPP//U3YX4DBD4DBcuXBg3y4XjYBsM1zefHQQS90Gyj0onNeDtIaGkhcaIQEUWGkOrj9R9+UxoDFpsmqt7oNCQDIAGbebMmXpiPQSGTKOxhdTYMoHAUGov0EBjXwgNRigh0DhiH0gJGvJUWbVqVaRY2ASOjdcTATJgxAxCAFGAfOF68RokJRAIOFvvAnICKcE2Q4YM0Y0+7gv3iNcgOMhcofFHETO+nz9/vn7PDoidAWLlfh9hjyjDtUCE7HuGULmzVgjIDTCfoXkd14XvISnmNXTfQdDc4D7Ndrjf6dOn63vB9/g3yT4qpdSAjr+EfCk0htbdA74TGsPqDcVS4xZ1/RQakgZo8CExaMDw1c6A2I26CTTKbpBlwHtoSO1sADI0Zr94I5cSYcmSJZFj2YGam3jdUXgP0oFtITJ2ZgNZKXMczMNjA7GASOA9DBe398NzgSCYfe3ALMcQB1sm5syZ4+wZBsdGlgUyZbaxs1nIttj7IyCYkBwIlZExyCKyTPjMzPbYzi2QmMvHHAe1UYWFhc47YczINvsZIEOD1yByJPuotFIDOv4UTEloIAEVWWgMrT4o8p3QGLTYXK/ug0JDUsRICzIDXus5oQE33T9oTO3GHZj5a9CYesmFEQNEad08pYE1p0wGwQ7cQ0lrUSFLYrZxs3379sgx3JP2mQJlnM8ri2NLBzIi2B5SaK7DzpqUlFEqbUSZW+SMHEFi0MWE9wGyT3jfS1gMdhcisnAGfL7m9aVLlzqvhmUQr0G+SPZRqaUGvDUo6EuhMbR6r8h3QmNYvb5YajYrlNw6SmQoNCQJIAmmQcvPz3de' +
                'jQaNdEnzxKAhNl1MEB782x12F4o7Y5EKEBGTebFj4sSJzha7QNbEvI8G3+v67GOYBtyWHYiKF7YkeImEneEqSebMiLKffvrJeSUaPC9zDK/7A/YyFugCLAlbkGyB27hxY9TryBIByCvuiwuXZieVXmpAxwFBXwqNodU7Smx8JjQGiE2Ny9X1W0KTe0ys0OQeSqEhYdBYmSwKJKEk0JVhGj13w2rPIYMuGnRjxAuveo5UQINrN/gmTObCYMQC2Rav63GHadCRWTHHLKmmBDU2eB9ZLK+GH6KC99FN5QVEx5yjpBFltjh5dfvhOdhi5pVRMkBazXYIiBvAPqY7CwGxYXYm+6HUOHT8IehLoTHc32WH74TGsHpdsZx0ZX5coTmvGYWGhDE1E4h4GRT7L3zUoNhg1A5eR23I7sCWKoTdxYQskskSQbiSwc5gQSzc2KKHbiY3EAXz/ogRI5xXo7HP4TXyCZiCZK9uP2Bnokr7DPA8zLYIdDsZ7JobEyh4JtkLpcaic/+g57BtSMB+FxTKwDHZKTSGF3sWyb7qPryE5uLWW2RjfvY2+oVKWJ7vvF2ObqykxhKaE5tskk7vb1e/2Cg0JAyKZk0Dhi6MkrAXksRwYgMaWfMXPmo6dhfIcpjrQ9bCYHerJNvthXszWSwc086AQA4gKngP0uFVR4SFNs25UWvjhZ1p8hpRFq/bz2DLCGp84oGuJLOt/ZwMkCx38fOKFSucd0m2QalxMWpmSK57brvso6QGQrPfRYVy96vbZdZCf0x6tbFgp3TqVSQ3PbtNbmq/TR7quF1mzvfPhF7FxTtl6qygTJoWlJmzs1tCSdmAYlHTeHktEmkwRagI02UB7AJTdMVkGtSHoEuoNOxMkr3uk50JKUks4oH9TYE0jovh1MhemOwJnktJ3T0YMWTOXdKzNQXMCK+upXjdfgYUC5ttIGHxsGtv7EJhG3SJmW4zBO6VZCeUmhIIhXZKUWCnbiQJIf4Bw3dN4xVPHsxcNahLcWP/ZR+vngMNtFf3' +
                'STzQkKOBLW0/e1g2skoGu4aktOHk6MaxQZYEI4GwH8QGXTu4f1wPnhVqg+Jdl/1sS6pPKa1rCec3x3B3+xnsjBDCawSVwYy0wvlM4TI+M2S0bJDRMQXMCBYKZyeUGkJIpcJuNCEuXlJiN5pe3Rv2KCSvbAIaa2RS0JAmO6uwKZK1u7zc4JpR2Irt3PeAc9uNsz25nQFdR2aiOSMEaNRNETDuyc5OJYo93BsZHxtcF7I3pXUt4brMMUqa1RfCYboAvc5lKGmEFI6L/d2YLJJ7mDvJHig1hJBKBUb62A0i5qlBNwgadzSO9pBkBKQB3Rb4i99gd7MgUGuCBhSZDEgE5ACNN2o/ksWcH+f16p6xJ6jDObzmgrG72BBorLEdrg9FxqgtgdDY2Qq7hgj7Q0DQ+GMfSB62RRbIq5bGgGdpjoEsD2pTkA1CdxG6iYzQIPA88XzsZwSRsruBvIaMG+xiaUiIW8JwbnM+ZJnszIvpurOzSbgvk0VisXD2QqkhhFQ6zMR5XoH1gpCpsF9DVsEeNo2sg12o6w4co6T5b0rDFgPIFwTDLFMAObHneCkpC4RJ6uzJ/9yB49gzKAOvpQhKCgiLV5G111IJCMgF6nvc7+NeIDwQDlyTyT6ZwHPH/SPc0oLPwEwUiECXIMQMxzPPEOfF925MTQ7Oh8wdZBbnwmvIlOHYJDuh1BBCKiX4Sx7ygYYM9SNoVE3NCP6yR6YEjWS8yfkgG2jgTQOKbinITzqNIkZnIQuBUULIANnZDQSyNJCDeLU8ANKCIdPIyGA/CATuMV63FrpozPaJBDI4NrhvXDueHd6HeOGYRkjwPJENwVc8a5M9wfu4tnhhZ1psULeEz8vUOeF54Ryox3GLmwHPBdJnRnMh8LPg1VVHsgtKDSGkUuMlIGhAkxGTdCSmNHBsNPpYGbs0kSmJRK8PggAhQGOP7ipkY9A9hCwRshsQLrtuJt6ij17njFfQmwlS+RywTyr7kYoJpYYQQojODCHL4a4/cQMBMN1EyLgQUpGg' +
                '1BBCSCXHrDaOLpnSshaYp8cUWruHRROyu6HUEEJIJQZZGSMpqIGJl6XBe6YIN9nZigkpDyg1hBBSicFQZnuIO0Z+edXuYPizGaqOzA7rUEhFhFJDCCGVHHsmYIQZDYZCYCyKaeaOwbBn9yzEhFQkKDWEEFLJQdYFi0tiZJOdtcEwcLyG4dGpzrtDSHlCqSGEEBJFvLoaQioylBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQHyDy//O30PvAjFjdAAAAAElFTkSuQmCC',
                alignment: 'right',
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
              [{text: 'Condiciones Generales de Mundial Autos - Condiciones Particulares - ANEXO DE ASISTENCIA VIAL - COBERTURA', alignment: 'justify', margin: [10, 0, 0, 0],border: [true, false, true, false]}]
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
              [{text: 'Autorizo a las Compañías o Instituciones, para suministrar a Mundial Autos , todos los datos que posean antes o después del siniestro,', alignment: 'justify', border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'asimismo autorizo a Mundial Autos ,a rechazar cualquier información relacionada con el riesgo y verificar los datos de este CUADRO', alignment: 'justify', border: [true, false, true, false]}]
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
              [{text: ' ', margin: [0, 20, 0, 0], border:[true, false, false, false]}, {text: [{text: `Por Mundial Autos. Representante\n\nNombre y Apellido: Humberto José Martinez Castillo\n\n`}], margin: [0, 20, 0, 0], border:[false, false, false, false]}, {text: ' ', margin: [0, 20, 0, 0], border:[false, false, true, false]}],
              [{text: ' ', border:[true, false, false, false]}, 
              { //La imagen está en formato base 64, y se dividio de esta forma para evitar errores por la longitud del string, en el futuro se buscará obtener la imagen desde el backend
                width: 140,
                height: 60,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjUAAADXCAYAAADiBqA4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEEdSURBVHhe7Z0HeFRV+ocTYv2vru6qa19WBZUqgigI9rL2gm1dK4qigih2RRHrWkEBG6ioWEBUUIqKgBQp0qsU6b1DElpmJnz/8ztzz3Dmzs1kWkLm5vc+z/eEzNw+IefNd75zTo4QQgghhPgASg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqamkFG/dKtunjpfCX/pJ4Y9fS8GAnlLww0dSOOgT2TK0l2z9ra9snzxEgmuXOnsQQgghFRtKTSWgeMcO2TJliqz7sqcsf/YJWfjfy2XBOXVk8YV1ZMkVdWXZtfVk+c31ZGXzk2Vly/qyunUDWd22gax55BRZ+3hDWffcubL5w/tky09dZceMYRLatMo5MiGEEFJxoNT4mI3DRsicO+6WSbVqy5TaNWT6yTXl' +
                'j1NrybymtWThubVl8SV1ZOlVJ8myG+vJitt3Cc2ah5XMPKFk5ulTZf2zkBr19QUVL54WDvXvDZ0ul63DP5Tiwg3O2QghhJDdC6XGZwTzC2Tpux/L+Ebny+gjj5ffjzlBJlY/UabU2iU1f57hSM2ldWXZNXXDWZo7ldC0qr9LaJ5pGJaX/50mG19tJBvfUF/fVF87OaH+veH101Q0lYK+7SWwbIZzBYQQQsjugVLjE7bMXSB/tHlahh9eV379ezUZcUh1+U1Jzbh/nSATlNRMrqmkpp6H1FxbT1bcoqTmLiU0bRrI2kdPCWdoIDSvOCLzdiPZ1LWxbHrvdNn0/umyuZv6t/qqv1ev431Iz+ZPbpftUwfIzuKQc1WEEEJI+UGpyXJ2hkIy/+WuMnj/E2Xw/x0nQ/Y/Tob9TUnNwdVl1OHHy9h/Hi/jjztBSc2JMq1eDZlldz8ZqbnN6Xp6UEnNEw1lfQcnQ6OEZlOXsMDkf6hkpof6+lkTKei5K/I/aSKbP3ZEB4LTqZHkf9pcgusWOldICCGElA+UmnJgc3CnzN5WLBMKQzK+ICQztxTL+sBO593UKZz9p4xtcpX8vM9xkRiy33Ey9K/VZPhB1WTkYdVl9FFKao49QSadeKJMrVNDZp5SQ+Y0qSkLzgnX1KD7SWdqIDVtG8i6J8M1NLrLCRkaZGaUtGiJ6aXim6ZS+K2Kvk3Cof5d0EfFV0pwlPBAfpDB2dj5TNk2rqfs3Jn+fRJCCCGJQKkpI/JDO+VXJTAdVwWkw/KAPLs0IO2XBKTdYhULA/LUgoA8r6L/2pCsLUqu4YcoLHyzm/xyQI0ooUEM/ouSmv2Pi+mC0nU1tWvIjAY1ZXbjmjL/rFqy6KI6srTZSVFSs7bdKbrrCd1JyLxs7t44nJ3p7UhMfyU0A8+XLYMulC0/XqK/6u8HnCUF/c4ICw4yOMjsvNtI8r+8S0IbljhXTgghhJQdlJoMU6yEY1RhSF5aGZDnVuwSmmcgM5bQPP5nQB6bF5BH5wbkkdlB' +
                '+X51SALFpcvNtsXLZdzZ18XITCTQBbXfcTLswGoyXHdBVY/qgjJ1NfPOrCWLLwiPflp+U7imBt1PyNQYqYGU6CzNV+GMDMRFi8zgZrJ16I2ybdjNsvXX28Jfh9wgW3++Iiw53zvZGyU3kKJN750t2yf1ce6AEEIIKRsoNRlki5KSD9cF5fkkhOZhJTQP/RGUtjOD8sLcoKzdUbLYbF20VEZUb+otM1bobM1fq+lszchDw11QGAUV3QUVrqtZclldWX7DSeHRT63DNTW6+8lITQ8lNeh26ndGODvzy7VhkRnRUrb/1ka2jW6rQ/975L36PWwTkZveSmzUMXCsbaO7O3dCCCGEZB5KTYYoDO2Ud9YGUhaaNjOCcv/0oLRT/16zPVZsEhUaHTHZmuNlXNXjZUI1ZGtqyIz6NWV2o11dULqu5raTZdW94dFPKBRGTY3ufkKmRkkNBAVZGp2hgdCMeVi2j28vOyY+Lzsmvahj+4QOsn3cE1pwtg5vruWmcMA54bobZG26NZbtYyk2hBBCygZKTQbIlNDcPzUoracE5fFpQVltiU1SQuOEXVvjztZMq1tDZjUMj4JadH5tWXKl1QWFYuGnndFPbzfStTG6+wlS89NluqsJ0rLj96ekaPL/pGj621I08x0pmvV++Cu+V6/jfZ29UdtjP521QTGxOt6asd10Nx0hhBCSSSg1aZJpobl3UlDumRiUR9X3q7ftTEloTLhra7yyNQvOdkZBXaukpvnJkS4oXVeDId3vh0c+oUgYmRojNcjKFE3rJEV/dJPAvM+laH5vHYE/v5SiOZ/IjhldwtmbsY/JthEtdB0Oiox1d9THp8u00R9QbAghhGQUSk0alJXQtJyg4vegPDK+SL5v+h9PYUkkzLw1ZiSUmWHY1NZ4ZmtahmcVxozCkS4o1NX0aaq7klAQvH1UK931pKVGCUxg4bcSWjJIgsuGhGPxAAks6COB2R/pbbAt6m10rQ1GSTliM3lsD4oNIYSQjEGpSZGyFpq7xwXljrHq' +
                '3/2Wy1fHnuUpLYmEKRo289ZEjYTCsgmnWbU1mIjvdle2plMjXQtjuqAwwgmZF9TO7Jj6hpaa4KJ+Elo+TIJrxkto3WQJrZ0owZWjwnIz73OdtdH1NkqGIEWQI4jNxh5nyNBF0yg2hBBCMgKlJgXKS2juGB2U5r8F5bbeS+WLqmd4SkupYRUNm1mG7XlrZjaoqSfjMyOhsLjlqhZObc0zDfVSCZFsDSbeG3h+uFh4dFvdvYRaGmRlIDUQmuLN86W4YIkUb5oXlpulg3W3lC02dsZmSa8bpN/GLRQbQgghaUOpSZLyFppbRwbllhFB+W/PxfJZ1dRqa+xuKF00bHVD6aJhZz0oM28NJuNbdU94JJQZ3m1qa/TQbhQMO9kadC8hG6O7n9aMl535C2Xnjo1SXJSv5Qaigy4p1NposTFdUabG5qsmMmJoR+mzKUixIYQQkhaUmiRwC037ZbFC8+T8WKF5eFas0Nw3OVZoWkBmXEJz6/Cg3KzixmFBufrDhfLp0U08xaW0iJq7xt0NhQn5SuiG0pPxvaik5q1GeiI9PbxbyQiyLbq2BgXDGPU0v3c4W7N+muzcskKKQzu02EBydLeUkp6iuZ+Fa2yUDOniYYyK6ttE8ns2lY9mTpTeGyg2hBBCUodSkyC7W2j+M1TFL0G5qPN8+SRFsSlpNNSUWruWT9BrQl1qTciHWYadId5Y3FLPW2OKhofeGB7ebXdDrRihxUZ3QW1bK8WFy6R4wwz9OgqKMVoKQ771pH3DbtbdWejWWtzrWnlxcYF8uS4oIYoNIYSQFKDUJEBFEZrrBgflmp+Dcs6rf8onR6UgNqa+Bqt4Y12oI3bV1+iZhnV9jTPT8BVKbJy5azxHQzn1NRATd32NHgGF7MzGWVK8aY6WnNCq0bpw2GRrMI8NJvHT3VDOHDaDh3TRz/SLNRQbQgghyUOpKYWKJjTX/BiSqwcGpdFzc1MSm6SHed/sDPN+5BRZ/2xYbPRClZ84K3Y7hcM6YzPxed0VhRobCIzujlIy' +
                'owOjoxb/EBkNhW2xD/Y12ZrVn18kz84v1DVJn62k2BBCCEkOSk0cKqLQNBsUkisHhOSyH4JycrvZ0iMVsfFYG2r8saUXDhux2fB6eF2oKLFxzV+j56iZ31sP94bgaKFZ0EdnaiIT8415OLycwk+X6QLk/M9Pl69G9o08z0+WU2wIIYQkDqWmBCqy0Fyh4vL+Ibnw26DUfniW9DgyTbE5bJfYTK6hxKZejeiVvJvFio17Yj69gvfgZuFRUWMfC3dHYckE1NDM+STc7YSvWE4B3U/I1BipsWYbntv7Vv08H5kTfp4fLw1RbAghhCQEpcaDbBCaS74PyaX9QnJO76Ac33qmfJyG2MRMzKfERo+IKkVs9Bw2pnjYLHpp1odC1gYT9GHByymvapHRMjP1DS08Zm0oIzV63holR8j+vD1uon6ebdXzfEA9xw8XVW6xCYWKZebsZRmJHTsCzlH9zabNW2T5yg1xY83azc7W5Usi17Y5f6uzNSEkGSg1LrJJaP7dV8W3ITnjs6D8q+UM+fiI5MUGhcNhsakuo7yGettic5VVY4PiYTMqCsO9Mesw1oj6NjwyCqKy9dfb9Jw0ekVvCI4SGS0zGNKN0U8jWkYWvIxIzWdN5Ldv20WEps208Hw+HyyovGKDBi7noJsyEnPmrXCO6m8efKqn5/3bse+Rt5e72BQXF0vNxo95Xo8dTz7fy9mDEJIMlBqLbBSaC78JyXlfh+TU7kE5+o7p8lGKYqOHervFxpWxiVnR+8EGsrbdKXoeG7345Xunh7ujeoUn6UOtjZaboTfqjIyWGCU5+uuIFmGhQZZm0IXhEVC9m+hMzfoPzpCnJqyOCA2eJZ7ju/Mqp9jsVPeMxrCoKCjz5q+Srt0HS9WT2ng2hogDj7lLPvr8V5k1Z5ls21ak98UxTFQGAoGgLFuxXj74ZKiccNojns8JUd7y0HfABM/r+L+jmsvjz30lE6cslLXr8iUYDDl7EEKSgVLjEE9onloUKzSm5sMWGjTCbqG5e3ys0Nw+' +
                'KlZobhwSKzRXD4wVmksgMy6hOa9XSM5RcVLnoBxxc+bFBjU2pnh4wXnh4d5YTkHPY4N1oh5vKOs7nKrrbDa+Hc7aIOMCSdFyg8zNj5fodaP0EgkIyAwyNBCa/k11hgfDuiFFkKPuPw+KEho8x7vUc+wyhzU2YOHiNXLI8fd4NpBDhs9wtiJgxh9LJe+Qmz2f1V+rttDdQeUBhLLh+c94Xkfbdj2drQgh6UCpUfhBaM78IiRNPw9JjVeDcuh/p8uHaXVFRRcPR0ZFNawVmccGE/Qtvf4kPfPwqnvDdTbojtJZGyyrgCLi7o7coN4G0gLBwWzEKCpWoYuD8RreU9tg2/wPT9cjqwZ83THqOUJo8AybjwlK5z8oNqDFA91jGsf9q96psxQkmuMatI15ViZefLOvs1XZ8ouSTa/zI1556wdnK0JIOlR6qfGT0DT9LCSNPg1J1Q4B+ccNmRMbex4bswDmgrNr6yUVUECs62wwSV8bZ3XvDuFaG90lBbnp5oySwtpRXzkZHBOQmc9PjwgNsjTI9kzqdles0PwWfoZYC6vTTCU2xZVbbHp8OSKmcazd5HHnXWJz8tlPxTwrEwdVaylbtmx3tiw7zrnyRc/zI55gDQ0hGaFSS01+cKd0VvLy2soi3wjNqZ+o+DgkRz4ekIOvmS7dD09ebGLmsXEm6DMre8+oX1NmNwqvFYUCYj37MJZVaO5kbVBEjDWjLLmBqOiaG3RNIRvzcbj+Bl/19+p1IzTI9Kx87Wz1DIs8hcY8vzemVW6x+eaH32Max5POfNJ5l9gYqTmiVis5rMZ9Mc+t03uDnC3LhjHj50XO1eDcdlHnRtzd9kNnS0JIOlRaqYHQ/G9+UB5QcvLEjG3y3LIi3whNw49CcnK3oBzcJiAHXT1duqUpNnpJBSU2WFJhghKbyTVr6AJi1Nlg9mHdHXVJHVl2jZKbm+vJqhb1ZXWr8CzEEbl5SckNam6QvXlLRRclMV2dUP/WMtOpkZ7YDyK0/oVTpd2QuSUKzQ3q+V2v' +
                'nt+rUyqv2Hw3YHxM41jvLEqNF8fWf1A/H9S0vNa5f8xzO7JW6zId7n75f9/Q50FW6Ot+42LOf+3tbztbEkLSoVJKjS00GDYMMXlgYqG0X1TkC6Gp3z0k9bqFpM67QTng7oD8/UolNoelKDZYUsFZK2rU4cdHFxDXDXdHYSFMO2uja21ucUZItQ5nbtAthfWj1j0XrruBuGCeGy06KvBvLTPqPUgQ6nPe6d0vrtCYZ/fKxMopNpSaxPn7cXfr53NBs/9JQcE2+duxd8U8u26fDnO2zizTZi6JnOO5176V0b/PjTov4tyrXnK2JoSkQ6WTms0uobFH2LQck+8boTnpg5DUei8kNd4Kyl9uDciBl6UoNs5aUZHVva06m4knhLujpp/sDPtuWkuv8o1aGz30+wYlN7edrDM36JbCEHBkbyA4GAoOycEkfia09CiZQXZn7aOnSN8uL5cqNHh2eG4vTah8YkOpSQyMOqpycHj0k8mIPPvKNzHPDsXEZTGU+sa7uurjY9j2+g0F8sfc5THn5udGSGaoVFITV2iUkNw5JiB3jtrsG6Gp825IanYNyXGvBWWfGwOy/8XT5f0UxMas7m3X2US6o6qFJ+qLZG0a1dRz2mDoN7qkMGFfJHPT/GQ9cZ/ummqjJKdtWHK06CiJ0f9++JTw6+r9X15+JCGhMc/t+d8rl9hQahIDmRnzfDBiDEAu/nL0HVHPDvFFn9H6/Uzx54JVEaHChIBg5aqNMef9Z902+j1CSHpUGqkpTWggJLcrGbllREBuGbrBN0JzYpeQHN85JEe9EJS9rgnJfv+eKe8dmoLYqHDX2US6o451sja1nFobPfQ73CVl5AaZm2XX1tPz2xjBQQYHkoOlF5DJ0aH+jdfQdTW0/f0JC83F/dTz+i4k7cdUHrHJRql5+JnP5ZTzno7EipUbnXfKjqXL10eeD85veKT9F1HPDoHRY5isMFPc9WB42P0e/7hFXwfYvr0o5rz7/fMO/V5pXH9HZ6nR6NGE4u0PfnL2Sox2' +
                'L37teRx3GDEEg36ZKh3fHeQZv0+a72yVGnP/XOl5XHd07rbrPrHPeHXeYSNnSf+fJuv6pU++GiHvfTxEF4Nj6HyHV7+Vp1/6Wp56obeefBEjz/D9869/pyetHDF6tl6qIt2fg42btsiCRWsSinTquXp9Nzbq/xQmeEwVzLDtdX3xorCw7EcOJkOlkJpEhcZ0dVz7c0BuGLReC82DkJkEhAbzp7iF5qZfY4Xm2p9ihebSH2KF5oI+sUJzZs9YoWnwYazQ1HonWmiOe0tFx2I59OmQ5F0ekn0vSENs7O6og6qHh307WRvU2pih3zPqhwuJjdzoYuILldxcVldnbyA46J7C7MSQHHRTRUJ9j4Lj4Y+2SEpoznMk8JlRIQlWArHJRqm595GPo6731bf7O++UHdNnLY2cDw2XARmTvQ+/Lep6EP0GTnS2SA80jHseeqs+5m33ve+8GsbrvJgxujTQ0K5bXyA/DZ0m1U55KOYYV9z0pkyaujChY7lB1xsaNfxcnX/1y1HHhXRBkhYvXafXIjNg7p32//tGGv/7Wcm1tjf7jJ0wz9kyeeYvXK3PCflseslzUcfe54jb5fZW7+ufnw97/ursEZa+C695RRd+29sj8MwhQD17j9Kyg8a/z/fj9PcvdeynPyPcB64b22Nixhvu7CxffTtG8guSX4vr869/k7pnPBFzHXZgZnBcLzJ6qeIeBYm6sVR5o+tAfT1H1b4/6ph2HHrivXLW5S/IJTe8Jpf+53UtgRUJ30tNskIDEcFyBZf0DUizfmt9IzRVVRzxRrEc+LASm0tCsve5M+Wdf6QmNu7uKDtrg1qb8AipaLlBMbGekRjz25wfrrvBBH66sBhdVM2U6FxTNxL4fuS9tyYtNHheZ30VkieH+19ssk1q0NAeXL1l1PXiL/+yXrph1Ng5kfPZf9UDt2QhTj3/mYxcE2YJNsfEkhU2XsPKV63e5LybGJg52t4fxdCZmnhx69YdUuv0XWtUISNTGpi52UicCSzZMWX6YmeL1MHn' +
                'gcyKOS4+03hg+y7df466lgP+1cJ5Nz5YWgSyc9UtHSNdh5AoLGORyuzTi5aslRMbRS/Vsddht+pMUiZodmunqGNDLk1WMFXw/Hr3HRszE/ct975b4Zfw8LXUpCo0NzgCcuYXQbmyzxrfCM1hr6t4tVj2vTckuReFZK+zZkrXVMVGBbqjorI2Tq1NpEvKkhsUE6NbCjU3mJVY190owUEGB5KDLA5ER8vOJeGvQ1s0jwgN1sByCw2emZfQoIuusXpejw/zt9hkm9R8P2hizPUixk3809mibEDjYc71aa+RzqthsNyE1xIKyECkA7IpKAzGsa68+U3n1V24GzmEW3xKAxMG2vujEc4kj3X4Uh8XApao5Jkshx0Q2WTvzQvIAY6HjEsi14Nt7KVEEpUaG3Rl2dkWiKP7ZygR3BNlYoh/JtiwsTBGJBHIPGWCs6+InjCyrP+vZgLfSk1JQmMvLhlPaK5WAgL5qP9+QC7rtcY3QnPgK8Wy3/+KZa/bldhcEJK8M9ITm5iszcFWl1RVD7mpV1NmNHCyN1pwaupRU5AcdFPpOhwlO4iBd7RMSmhMzRGEBs+rYY+QPPyLf8Um26Tmmtve0tdoZzAQ9zz8kbNF2YDuBXMur66lW+99L+p6EJj9Nx2eeblP5FiYeM8Nujns8yFKyz64QTeQvT9GWWUSNN44bjLDzY3U1Gn6eNS1QYywGGs6oO4Ex4IsJgqu3VxDKlIDkP1C15Q5DgI1OImKHoAc2fvb3aDp8O5Hv+jjoZvs8JqtIsdH12Qy11cSDzz5WeSYiHQzQOWBL6UmU0KjG9C+Qan+ekAu/XK1b4Rm/5eKZZ8XQlLlP0pszgvJnumKjQo7axPpknLJDbqlUHODgmJbcGaeEl4w84/TwqOn0FWF+OaO+9MSGvOs2v7sT7HJJqnBX5RIuSONvzl/qy5oNNeMxgYp/7LC7oYY/tsfzqu7wBBrdz0IwktGEgH1F+h2wTHOvOx559VoLr7+1ZjzIZOVDKivsff/792ZlRqzovi/' +
                'r33FeaV0jNRghXS7+wpxdJ37dU1OqkAucJxkpOai63Y951SlBuBZQxzMsRCPPvul827pTJ62KGrfTNWSNbowLMeosTKZNRO/jZvrbJU6KKy3j4k6sYqO76QmGaHByJp4QnNpv3ADekGfoBz1TEAu+Wy1L4Rm3xeLZc8X1NcOIcm7WonNuSHZo6kSm0PSExtkbcyEfV5yY2puUFCM0VKYwM8IDoaEa8mpHxYdxMct26ctNHhO9d4PyQPqc/Cb2GST1GD0Ca7vPy266O+7dh8cdd0oxiwrXnijb+Q8JdV3mCySHZfd+LrzbnKgwTLHKKkWBQJinwuBLopkKGupMd2FqUgNRnihENtdzIy5gFId8ZaK1NjymI7UAEwNYGdDED8OKb3WCLilBrNapwtGeuFYyIKhzsU9/5E9Si1VKDW7mbIQGkgHGs+mnwXlkLYBueDjVb4Qmv97Phx7Pq2k5jIVZ4dkr8YzpUu6YqNCj5BClxTk5m+75AbdUqbmBqOlIoLjZHAgOViCAaKDSf1eeLZXRoTGDG9vrT4LP4lNNkmN6W4ZOHiK/t5kbsx1Y8RFWWH/YkYNjRcTpyyMbGPH1BnJFbki44TRIdgXtRgldQHc92iPmHO9+c5A593EKGup+eHHSfq4qUoNWLJsnZ6Dx75O1BNhlFWy7G6pAV9+MzpyPAQ+a3Ov8SgLqUEXGI710NO7pik47YL2kXNgxf50F2ql1OxGIDQv/5m60KCboyShMY1n/feDcsA9Smy6r/SF0Oz1nBOPh6TKBUpszgpIXqPp6WdsnIjIzV+r7crcoObm0PBoKZO9iQjOsWHJQTcVROeuD2ZmTGjwnKq9HZJ71PH8IjbZIjUYropr+8cJ90aNnLiu+duR60b3D7osygL8xWrOg7lDSsLuqjCBLodkMDUOiHgT+WFOGPs8CLyWDNkgNQCfv3u0FxZehdgmQ0WQGkjqCadFF3ljHpzSyLTU4LP/V70H9LFs8X6/RzgjagL1ZOlAqdlN2EKD4deZEBoz8Z1p' +
                'PJso2WiiGs4TXw/Kfs0Dcv77K30hNHs/q7ZpXyxVHg5K7tkByT1Dic2p06XLwZkRG0RU5saRG4yWMtkbCA4yOFh+QUtO1eNlVPW6ckW/HRkVGjynY94slhZ9i30hNtkiNZjHBNdmZtQ1IGtjX3umRmy4wdII5hz2HCtuRo6ZHXU9CMgW0vyJgEbXNDT4Gm/o6+tdBsScC8PLkyFbpAbMnL1ML+ZpXy+Gzicz/0tFkBpgfp5N4D5KI9NSg7lhcBwUZNtgyDnq1sx5zrv6Zeed1KDU7AbKU2ggGZi995/tg/J/NwXknHdXaqHBsRIRGjTMbqHBEGS30DRSDbRbaOqoRtotNKahtoXmiNdihQYy4xaav3TYJTR57UOyx9Mh2buVEpumSmxOD8geDTMrNgjIjSko1tkbp2sqIjjI4GjJqS69m1xbJkJztBI+PKPbv81+sckGqbH/osQvdhs0+naNQvWGmRmx4cZMJId0fGmccenzkesxccf93Zx34/NZr12jrFAzFA9MGGefA5FsViibpAbg84dY2NeM551oF0lFkRp7gVIExLe0e8i01NzZpps+DuTYjVlrDIFrS6c4m1JTzpQmNHdkSGgaO1kTCA0EA43mIQ8EZK/rA3J21xW+EJp924Vkz6dCkttCiU1jJTaNdkhe/anSNcNio8PIjZO9iRacsOR0vL5DmQnNP9TzOUg9nxv7ZLfYZIPUmOwHRsJ4CQsmNLOvPxMjNtyYkVaYJbU0UPhpXw8CSxygNiQeEAxMJIjtMTcKJq+Lh3sWWESyM8Fmm9QAjChzr7kF6UykLqWiSA2uAz8T5riI0kbKZVJqULcFQcfEgF5F14N/nR51rnSGj1NqypHdKTRoNKt3Dsr+dwRkz6tDcsbby30hNFWeDMleT6ivNxdJ7qk7JLehEpt6U6XLQWUgNk5EsjdKcCIZnAOryUOPfFOmQoPnk6ueyXVfKbEJZafYZIPUmHqWkoawzpm3Iur6MzFiw40ZgQOxKg2IV/1z2kVdE+L+xz91' +
                'tvDG/ixefLOv82rJDB0xM+r4iAbntnPeTYxslBrw66hZUV0kCIw0K21ph4oiNSDZuppMSg1GCuIYJRXXo4sVw+fNuY6t/6D+WUkFSk05sTmQvNBguv1MCE1N1WgerxpN1LL887WQ7P2f8HpKTTst94XQ5D2u/gp5VEUzJTanKLFpsE3y6k4uU7ExYQRn8P7V5ZpuS7XQnNs7VmhQb+QWmpPUc4oRGvV84gkNnkWuuv/r1DGzUWwqutTgL0o0JKUVAdsT0WVixIYbM6tsk4s7OK/ExyuLgka4pBE7ECGTDUKjHq8Y2eBu5BDHnPyg825iZKvUAAx1d8+Ei8LxeHVIFUlqMDmjOS4CBbrxyKTUYM0lHCNeEbAZGWUi1fWZKDXlQKaEBuKRjtAc0yksFQd3UHKgpKbKRSE5veMKXwjNPo+orw8FJPfi7ZJbf5vknqTEpvZk6fr30z1lJNPx7uktykRoDnw5Vmj2fix8v9d9GMw6sanoUoO1Y3BNWIYA2ZKSAo2NfQ/pjtiwgXCYxhONQSJAFryWMcBqzl7Y6X40AomAoeX2sRHJNrrZLDXg2/7jPdcWKimrUJGkBgW45rgIrO4dj0xJDdYHM88MQ+W9/j8h3PPpYPHPVKDUlDEVTWjMKKO/PhqS3AtVnK8E5fXlWS80e2IkFKSmTZHknq3ERklNbp0tkldzsnQpB7G5s/3wchWavdoEZO/WAWn2XiCrxKaiSw1W8HVfXyKRzLT8pYHaFnPcZJYRMEsE2IEskteChmZ9HMhTor/0cRz38RHxMhVusl1qAFayRibPvo+7237oWX9VkaTm9Is6RI6LQJdaPDIlNR3fHRR1nEQDdUyFhclnQCk1ZYiX0GA9pt0tNKY7I6+lkppzVZwdktNeXZb1QlPlwYDk3a++3qfEpvFWLTW5tZTYnFC2GZsvjzl/twhNlXuKJK/FDrmmS/aITUWWmtVrNuu/KLFcAGaWxQKP8eKmlu9E3Uc6IzZsUEhpjpnMkGk0oGbUlh2Yndhm9O9z' +
                'I+8lOkoKQEjcjTkCzyJR3FJjZmvOFFgnC8ctS6kB3T4dFnUfCAz/d4tNRZEaXJd73p3SVu/OlNTg/zf2R3bQ/X/IHe45a5KdsRpQasqIii40EAkIRN6NSmrODOhh0ae9sizrhQaxRyslNaqxz22gpKYGokD2rD6pzDI2j7TosduEZo87dkjeLdulWceirBCbiiw1b73/o76eRBerdBfOPvfat8476WFPHV9S91FJ2BPpmcBcK3bNDwpc8ToEZfbcFc6riWHWh7IDhdOJgsbV3jdTKz8bTEGq1yrjJZGK1IBO78VmINyTEVYUqYFwm2Mi0FVZGpmQmumzlup9E536AJkZe6TZWZe/4LyTOJSaMiBRocEMv5kQGjScqQgNGsy9n1ZScFl4npfc03bIaS8vzX6hua9IN/q5tyixqVMguScUSI6KvGpKbP6WWbH54cC68u8em3er0OTdtF32vH6bNHtlR4UXm4osNWYEUaKLQiLrYI/YQNFsSbUVyYDzm2O+8tYPzquJgYbZ/Rc5Al0AADO5mteuvqWTfi0ZcI/2cRHJLqJpixG6RDIJxBLHvfmed51XSidVqQEYNWbuxYQ9kqyiSE2v78K1YiYS+bnKhNRgAU3s684WxsO9uviCRd7LhJQEpSbDFHoM2y5voUGDmYjQ7PNMSDeauUoScs8OD4fG6KGGLy7RQoPJ+xIRGpzTLTRHq8baLTSmwbaFBo23W2hwXW6h+YuSGbfQ7NU2Vmj2vDcsNFXuLpK97tqhG/vcE5XYVFdRbbPkHTsho2Lz0mXPVgihybtGxdXb5KoXK7bYlIfUYJ4ZZCPizcTrZsYfyf1FaXjqhd5R9+K1onayYJSNOR4W1UwWr5l/j6jVSnbsCOjuHvPauIl/OnskzslnPxV1XMSAnyc77yaGPVkguvvWb0i8+6o0IGo4rpG4REhHasCTz/eK3I8Jc/6KIjXIXJlj4pmjeLc00pUa/P8zxb/JdM26M6CYDTkZKDUZ5uNloZSEBnPG7A6hgTCg4dy7' +
                'VUBPXmdGDp363OKsF5q97ww3/rlXqntSQpNznIpjldhU/V26ZkBsvjmssVzQfWOFEZqcy7dKzqVb5aoO2yus2JS11GBtHmRPSpsd181jHZL/ixKg+8a+l1RHbNjYCxDi38mCFP7fjo3tJsJfzZj8DP9GoXAqoCDafVzMSpwM7kbn4y+GO++kB+4bEoBjljbxoE26UgMJbvPEp1H3hEB9SEWQGqxjZddCtW0XvfRHSaQrNT8Pm6b3S/ZnzZ0BrXpSm6QyoJSaDLIpsFMempEZocFIpEwIjS0TJQmNEYXc25UA1AuPGkKBbUMlNlkvNM13SJXbtkvOv7doocn910YdeUf/Ll0OTE9smj8+tMIJTe6F6j7P2yJXPa3EJljxxKYspQaNC/5SRxdJaZOi2eAvyiNrtdbXkkqxL9bRMfeS6ogNG2RnzPGQtUmFDq+Gu2FKip+GTnO2TI5rbnsr5lioLUkGkxUzgeeXiW67zt1+0sdrmMC6RjbpSg3Az569CCkCImGWltidUgPRNsfDkOpEfz7TlRp0AWK/VIp93dkvZG8SJVNSg98F6f5fTpQKKzXjNxZnrdAYSdiz2XYtNLk1VZxYIA2eXZz9QnOripvVfZ1ZoIUm559KbI7eKHscqcTmgNTE5tXzHwt/Ji6hwXNyCw3qm8pTaHLPUV/PLJSrntxW4cQG83zYv3AQmZIaZGdwvGQzB78Mn6H3SzV7Yc5rIpVf4jamLgSBkUqpgIyVaazdgeedTBebjVm/x45nXu7jvJs47jlTUKSdDvMXro7U6mAEVDJkQmoA5BhD1O37MhmS3SU1/X+aHDnWXofdKsNGxh/GbZOO1BQUbNP3jMC/k8WdAcVcQImSCanBPqixQ5dteVBhpWbchuIoobl7XGaEBsW6mRAaSEM8odnnviLZF3JwgVOHcny4DqVB+8XZLzT/3SZ73KgEoGG+FprcI1UcsVHyjkhebL4+oqmc031zykKD5+MWGiObttCYgudUhCanqYpGBXLVwxVLbMzkdnac' +
                'dGb6UoNRP2hAsKxAMrU0wPxFmeoEeqgJsWeaPfOy5513UsPOhkyautB5NXlMl5o7MEIoVVo91iPmeM1bf+C8mziQEDR45hjoFktWRg3z5q+Smo0f08fBaKpkhc1ITWlrXyUCupuuuqVj5L5M7A6pwSi6g6uHVxlHHU2ysoefPXMdiGSkBmKPfdLpjrUzoPseeXvCq6OnKzX4/YE/cDLVLZoIFVZq/sgvziqhsUcOGaHZs6VqSO9UEnBaoRaaXHTZHLNZ6iuxyXqhUTKQe+1WqVJb3ZMSmtzDN0rOYesl79Cx0uWviYvNzU+O3C1Cg3twC03uxR5C07hAC03OKQVSpUG+XPXg1gojNv/r9H3ULxwERuukmjnAfvYIlGR/cWNuDPzCRKODJRJS5fo7OkfdE+oYUuW4Bm0jx8FEb6mCYtC9D78t6rqwpk4yk+XZ4FmfdkH7qOMh6p7xhLNFcmBpB/ciixj5kkgRK0CXFbp3zBBgNIKJNnwG3JN5RpmqvcBf9xddt0tMEMlIDRYJNfulKjUQkn+ccK8+xl+rttAZ0mSxR+EhXurYz3knPnimjS4MLyNS2gR/8fjgk6FR5+/+2TDnnfigZsjeL5nPFdf+wJOf6SHvqf4/SYUKKzV4IE9O8xaaG4dlRmjQaJal0JhGNPcmJQC187XQ5DhdNic/szirhabKddtkr2bqvq5QIlB9kxaa3ENV/EOJzSFjpGsCYtPh8hezSmhy6qlQEnd92+R+2ZcFaITcs5qawHwsm/O36m3w/yhe4JcN1irq8/24qL+K8YsU7yeD6btPN7vinh8GGY1UcHfPQRjSySC4MyupjKYyeGXZEMiyQA5TATVDmPXYPh6yClinCF1S6ALB8gxYwwqTEs6as0xPfHfDnZ0jWQgElpNIZP0qNxOn7MpGpJPBcoPPDHOsmGMnKjX4+Tf1XWa/ZH6mUUuGeiqTOcRzTKZo2gbLKJjrQCQ6UeIQpzsXn2M6XXpz/1wZdf46TR9PSDTcXYD4mUkEHBuTUWIf' +
                'CHd5UmGlBvy+rjghoTGLSKYrNJCKTAgN5MA0opACNKRVVAOaU82pQTkq3F1T/+nF2S00V6nXrlSvXaxEoOoGLTQ5h6yV3IPWSt5BY6TL/iWLzYsXPZOVQpNTU8WJm6Rrz/TT66mAX8rTZi6RW+99L+qXTaYjmXoBMHDwlMjKyxh6mupf6rg/d1cPusK+6DM6oQYJ26CroEv3n2MaeAQKn9HAYJK7ZAtqUexosiH4yz3ZbBS61tBImS66kgJ1OsgOJJspAcjMoJvCHqGTaKDwFd2GyTT8AI0/sgj2ytWYpBCF7KkKmhvUkpjMVqJS467PQpQ2TQDufcr0xXpBSJPlg6RDQpP9eTHgDwx0C9vXgYxYaXMSQUDtTCPq1VLFjJ6yAyvPx/sZXrp8vf4c7X1qN3lcizCWEfEKdDOhjg3ShO2x0GuyP0/pUqGlBvy4ojjrhQa1GzkQAjT+qEFxumuQ2WjQbnF2C42SgiqXqThficAR67TQ5PxdiY2KvL//psSmse+EBpmpGhfmOz+hZc+osXP0L3J07bi7GMoikLJPBEzkhfWU8AvM3YiaDAHeb/lQ/FmFWz/2iZY0bIu5bezj2IFiQ2xT0orfyDThvF77egWuedGStc7eiWFGv7zc6XvnldJB1gOFpe7zJxL4zBNdXdwGmRiMpEKGw87C2IFrwmeHe0KDmUqjjRqgo2rfL4eeeG+JgQUWS1vFOhHwHCF88aTmvkd76CxIjUaPet4zsi4Y0YVt8DMHwUSmCj+r+NnD84aUI1sFscHoslTpO2CC/r9kZN8d+PnD/SAbYv8c3vVgdz3/kLu7EwE5wvXi2lFLVRLIdqL7EcdGRrckycVnh+5eM4IP3c/Y74qb3tTddV77JBNYzqG8qfBSAwYtLU5YaKLWDUpDaCARmRCavf/rCI3TmFY5ozAiNMhs5B68VuopsYHQ6MY6g0KT4yE0Oa1jhQbX7BYaXLtbaPKu2R4jNCiszbtEfb1oi+Q1VSKATM3flNj8bbXkHLha8g5UYrPf' +
                'LrHxg9DkHKfiXxtl9MTEhzqnA/5ix+Ru5RWr12x2zhwfDNH02t8d4yfNd/bwBt0WXvuVFCV1ISH74rV9vEg2pY9sC/azl0ooDaTi3edNJtJpWA24bsyAjM8C3VAoCC7POodMAbGJ9/M0YfICz2dYWmA/POdEf/YTAdlKr3N5hf3zlOg9xBsijc/Xa5+SwtRezZy9zPP9VAKfU3lnaUBWSA3ov6Q464UGjWmVK5QU1NscERpkNpDVOOnJJVktNHtc4MhBQyUBfw8LTc4BKvZfKXn7j9Ri4yehyam6UXp9n3ofNyGEkMyTNVIDflhYnJTQNMiQ0GCdpEwJje6qQTdUtQ0RoQlnNRbLzT3zs1toIAdnKzmoqxp+R2hy91spOSpOr/26/Ed9Xn4RmpyjKDWEEFLRyCqpAX0XFKcsNGa0UbpCg0ncUhUaiAAa1NxzCyX3iPVhoTlgibR7ZaS+v/t/zHKhgSBgXpfj10eE5l81vtBpyPXbdso138YKDYa3Z5vQ5By5UYaOKp/JpAghhCRG1kkN+O7P4qwWmirnOw1qE9V4HrwsIjSGBwdludAoScg9TUlC1XVy8LEDo2aSXLd1p1ylPrN4QlP1jVih2ffFWKHBZ+IWmpzbw/dS1kJzTMNNu6W/mBBCSMlkpdSAb+YWpyU09l//6QiNLQVJCY2SgL3PK5RvhnrPB9FmYJYLzakFcvrthbJxU+y03hCbK78qH6HJca49SmjOcq7XFpqTExeanMM2yCtvJz9dOSGEkLIla6UGfD2nOKuFpv9v8UfPPDAge4Wm7g2Fsqmg5EwGxObSzyuu0ORUixWa3MM3aKE59+p8qYgLXBJCSGUnq6UGfDWrOG2hyVPikAmhwRwumRIawwP9w9eWTUJT5/pCWbux9Dkv1m7ZKRcqIc0moWl6Wb5sUddNCCGk4pH1UgN6zijWQmPqNNIVGkhCJoTGNKipCo3hwR+KfSc0BojNuR9TaAghhKSPL6QGfDat2JdCY2j9fbEWGlyjW2jQ0LuFRi+m' +
                '6RKaPZUAuIUm94ZYocE9uIUG9+EWmipN0hMawxolCk27U2gIIYSkh2+kBvSYWhwRGnRpZEJobDlIR2j2OTd1oTE80DfkO6ExrCncKQ3fp9CQikswGJSVK1emvAYQIaTs8ZXUgI8mFftSaAytvgv5TmgMq5XYnPgOhYZUHDZv3ixz586VUaNGSb9+/WTAgAHOO7uHUCikr2nTpk3q53KL/p4QsgvfSQ3oNnFnlNDgr/9MCM1eSgh2p9AY2nyjrt1nQmPQYtOJQkN2P8uWLZPvvvsuKkaOjJ5TqrxYu3atjBs3Tr7//vuo68H348ePl1mzZun3Cans+FJqwHvjd5YoNCi6zYTQGBkoT6ExtP465DuhMawuUGLziiU0zn1RaEh5smPHDi0TU6dOjUjEtGnh1YzLC0zwOGPGjMj5IS7Lly+X9evXy+LFi+XXX3+NvPfjjz86exFSefGt1IC3x+3crUIzYHTZCI3h/t7qHnwmNIbV+UpsnitBaK6NFZocMzLLFhp1nRQaki4LFiyIiMOiRYucV8uH2bNnR86N63AD6Zk0aZJ+/5dffnFeJaTy4mupAW+N3RlXaJANyITQ7GFJQHkIjeH+L4O+ExoDxKbm00UZE5rcGh5C808KDYnP5MmTI2KxYcMG59Wyp6CgQPr27avPO3ToUOfVWFBXgyzNsGHDnFcIqbz4XmpAp9/C87z4TWgMrb9Q9+EzoTGs3qzE5jF1b+UgNGdQaIgHw4cPj0gNRkCVFyhQNuf9/fffnVe9+eOPP+S3335zviOk8lIppAa8Naq4VKHJUWKQbUJjuL9nwHdCY4DY1HlA3ReFhpQz6N754YcftFj8/PPPzqvlw5QpUyJS079//3IVKkKylUojNeCt4cVJCQ2EIBuExtD6s4AWmrybYoUGo7TcQqPFwCU0RhCihEZJwu4SGsPqTTulRislaxQaUo5g2LQRi7Fjxzqvlg+o3zHnRiATwyHchMSnUkkNeGtYyJdCY2jdI+A7oTGs3qjE5m51DxQakmEw' +
                '0mnevHm6LmXgwIEyaNAgPbII3T5GKtDFUxLYH++jWBf7o8YFQ63TqcHBMd1DuDFfDl5PFtTnoDYI2SbMtYOvGMm1detWZwtvMPrL3m/w4MF6NBZkz4uioiJZvXq1LnAeM2aMvl4Dsl6YYwdD5fH+hAkT9PPGcHQ3uEdI3ejRo/WzhMytWbNGf4/rWbdunT6ezbZt2+TPP//U3YX4DBD4DBcuXBg3y4XjYBsM1zefHQQS90Gyj0onNeDtIaGkhcaIQEUWGkOrj9R9+UxoDFpsmqt7oNCQDIAGbebMmXpiPQSGTKOxhdTYMoHAUGov0EBjXwgNRigh0DhiH0gJGvJUWbVqVaRY2ASOjdcTATJgxAxCAFGAfOF68RokJRAIOFvvAnICKcE2Q4YM0Y0+7gv3iNcgOMhcofFHETO+nz9/vn7PDoidAWLlfh9hjyjDtUCE7HuGULmzVgjIDTCfoXkd14XvISnmNXTfQdDc4D7Ndrjf6dOn63vB9/g3yT4qpdSAjr+EfCk0htbdA74TGsPqDcVS4xZ1/RQakgZo8CExaMDw1c6A2I26CTTKbpBlwHtoSO1sADI0Zr94I5cSYcmSJZFj2YGam3jdUXgP0oFtITJ2ZgNZKXMczMNjA7GASOA9DBe398NzgSCYfe3ALMcQB1sm5syZ4+wZBsdGlgUyZbaxs1nIttj7IyCYkBwIlZExyCKyTPjMzPbYzi2QmMvHHAe1UYWFhc47YczINvsZIEOD1yByJPuotFIDOv4UTEloIAEVWWgMrT4o8p3QGLTYXK/ug0JDUsRICzIDXus5oQE33T9oTO3GHZj5a9CYesmFEQNEad08pYE1p0wGwQ7cQ0lrUSFLYrZxs3379sgx3JP2mQJlnM8ri2NLBzIi2B5SaK7DzpqUlFEqbUSZW+SMHEFi0MWE9wGyT3jfS1gMdhcisnAGfL7m9aVLlzqvhmUQr0G+SPZRqaUGvDUo6EuhMbR6r8h3QmNYvb5YajYrlNw6SmQoNCQJIAmmQcvPz3de' +
                'jQaNdEnzxKAhNl1MEB782x12F4o7Y5EKEBGTebFj4sSJzha7QNbEvI8G3+v67GOYBtyWHYiKF7YkeImEneEqSebMiLKffvrJeSUaPC9zDK/7A/YyFugCLAlbkGyB27hxY9TryBIByCvuiwuXZieVXmpAxwFBXwqNodU7Smx8JjQGiE2Ny9X1W0KTe0ys0OQeSqEhYdBYmSwKJKEk0JVhGj13w2rPIYMuGnRjxAuveo5UQINrN/gmTObCYMQC2Rav63GHadCRWTHHLKmmBDU2eB9ZLK+GH6KC99FN5QVEx5yjpBFltjh5dfvhOdhi5pVRMkBazXYIiBvAPqY7CwGxYXYm+6HUOHT8IehLoTHc32WH74TGsHpdsZx0ZX5coTmvGYWGhDE1E4h4GRT7L3zUoNhg1A5eR23I7sCWKoTdxYQskskSQbiSwc5gQSzc2KKHbiY3EAXz/ogRI5xXo7HP4TXyCZiCZK9uP2Bnokr7DPA8zLYIdDsZ7JobEyh4JtkLpcaic/+g57BtSMB+FxTKwDHZKTSGF3sWyb7qPryE5uLWW2RjfvY2+oVKWJ7vvF2ObqykxhKaE5tskk7vb1e/2Cg0JAyKZk0Dhi6MkrAXksRwYgMaWfMXPmo6dhfIcpjrQ9bCYHerJNvthXszWSwc086AQA4gKngP0uFVR4SFNs25UWvjhZ1p8hpRFq/bz2DLCGp84oGuJLOt/ZwMkCx38fOKFSucd0m2QalxMWpmSK57brvso6QGQrPfRYVy96vbZdZCf0x6tbFgp3TqVSQ3PbtNbmq/TR7quF1mzvfPhF7FxTtl6qygTJoWlJmzs1tCSdmAYlHTeHktEmkwRagI02UB7AJTdMVkGtSHoEuoNOxMkr3uk50JKUks4oH9TYE0jovh1MhemOwJnktJ3T0YMWTOXdKzNQXMCK+upXjdfgYUC5ttIGHxsGtv7EJhG3SJmW4zBO6VZCeUmhIIhXZKUWCnbiQJIf4Bw3dN4xVPHsxcNahLcWP/ZR+vngMNtFf3' +
                'STzQkKOBLW0/e1g2skoGu4aktOHk6MaxQZYEI4GwH8QGXTu4f1wPnhVqg+Jdl/1sS6pPKa1rCec3x3B3+xnsjBDCawSVwYy0wvlM4TI+M2S0bJDRMQXMCBYKZyeUGkJIpcJuNCEuXlJiN5pe3Rv2KCSvbAIaa2RS0JAmO6uwKZK1u7zc4JpR2Irt3PeAc9uNsz25nQFdR2aiOSMEaNRNETDuyc5OJYo93BsZHxtcF7I3pXUt4brMMUqa1RfCYboAvc5lKGmEFI6L/d2YLJJ7mDvJHig1hJBKBUb62A0i5qlBNwgadzSO9pBkBKQB3Rb4i99gd7MgUGuCBhSZDEgE5ACNN2o/ksWcH+f16p6xJ6jDObzmgrG72BBorLEdrg9FxqgtgdDY2Qq7hgj7Q0DQ+GMfSB62RRbIq5bGgGdpjoEsD2pTkA1CdxG6iYzQIPA88XzsZwSRsruBvIaMG+xiaUiIW8JwbnM+ZJnszIvpurOzSbgvk0VisXD2QqkhhFQ6zMR5XoH1gpCpsF9DVsEeNo2sg12o6w4co6T5b0rDFgPIFwTDLFMAObHneCkpC4RJ6uzJ/9yB49gzKAOvpQhKCgiLV5G111IJCMgF6nvc7+NeIDwQDlyTyT6ZwHPH/SPc0oLPwEwUiECXIMQMxzPPEOfF925MTQ7Oh8wdZBbnwmvIlOHYJDuh1BBCKiX4Sx7ygYYM9SNoVE3NCP6yR6YEjWS8yfkgG2jgTQOKbinITzqNIkZnIQuBUULIANnZDQSyNJCDeLU8ANKCIdPIyGA/CATuMV63FrpozPaJBDI4NrhvXDueHd6HeOGYRkjwPJENwVc8a5M9wfu4tnhhZ1psULeEz8vUOeF54Ryox3GLmwHPBdJnRnMh8LPg1VVHsgtKDSGkUuMlIGhAkxGTdCSmNHBsNPpYGbs0kSmJRK8PggAhQGOP7ipkY9A9hCwRshsQLrtuJt6ij17njFfQmwlS+RywTyr7kYoJpYYQQojODCHL4a4/cQMBMN1EyLgQUpGg' +
                '1BBCSCXHrDaOLpnSshaYp8cUWruHRROyu6HUEEJIJQZZGSMpqIGJl6XBe6YIN9nZigkpDyg1hBBSicFQZnuIO0Z+edXuYPizGaqOzA7rUEhFhFJDCCGVHHsmYIQZDYZCYCyKaeaOwbBn9yzEhFQkKDWEEFLJQdYFi0tiZJOdtcEwcLyG4dGpzrtDSHlCqSGEEBJFvLoaQioylBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQHyDy//O30PvAjFjdAAAAAElFTkSuQmCC',
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
