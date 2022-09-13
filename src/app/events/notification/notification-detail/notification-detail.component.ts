import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationVehicleComponent } from '@app/pop-up/notification-vehicle/notification-vehicle.component';
import { NotificationNoteComponent } from '@app/pop-up/notification-note/notification-note.component';
import { NotificationSearchReplacementComponent } from '@app/pop-up/notification-search-replacement/notification-search-replacement.component';
import { NotificationReplacementComponent } from '@app/pop-up/notification-replacement/notification-replacement.component';
import { NotificationThirdpartyComponent } from '@app/pop-up/notification-thirdparty/notification-thirdparty.component';
import { NotificationMaterialDamageComponent } from '@app/pop-up/notification-material-damage/notification-material-damage.component';
import { NotificationThirdpartyVehicleComponent } from '@app/pop-up/notification-thirdparty-vehicle/notification-thirdparty-vehicle.component';
import { NotificationTracingComponent } from '@app/pop-up/notification-tracing/notification-tracing.component';
import { NotificationSearchProviderComponent } from '@app/pop-up/notification-search-provider/notification-search-provider.component';
import { NotificationProviderComponent } from '@app/pop-up/notification-provider/notification-provider.component';
import { NotificationQuoteComponent } from '@app/pop-up/notification-quote/notification-quote.component';
import { NotificationServiceOrderComponent } from '@app/pop-up/notification-service-order/notification-service-order.component';
import { NotificationSettlementComponent } from '@app/pop-up/notification-settlement/notification-settlement.component';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ignoreElements } from 'rxjs/operators';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {

  private noteGridApi;
  private replacementGridApi;
  private thirdpartyGridApi;
  private materialDamageGridApi;
  private thirdpartyVehicleGridApi;
  private providerGridApi;
  private tracingGridApi;
  private quoteGridApi;
  private serviceOrderGridApi;
  private settlementGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  upload_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  stateList: any[] = [];
  cityList: any[] = [];
  notificationTypeList: any[] = [];
  claimCauseList: any[] = [];
  noteList: any[] = [];
  replacementList: any[] = [];
  thirdpartyList: any[] = [];
  materialDamageList: any[] = [];
  thirdpartyVehicleList: any[] = [];
  providerList: any[] = [];
  quoteList: any[] = [];
  tracingList: any[] = [];
  thirdPartyTracingList: any[] = [];
  fleetNotificationThirdpartyTracingList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  editBlock: boolean = false;
  noteDeletedRowList: any[] = [];
  replacementDeletedRowList: any[] = [];
  thirdpartyDeletedRowList: any[] = [];
  materialDamageDeletedRowList: any[] = [];
  thirdpartyVehicleDeletedRowList: any[] = [];
  serviceOrderList: any[] = [];
  serviceList: any[] = [];
  notificationList: any[] = [];
  aditionalServiceList: any[] = [];
  notificationsData: any[] = [];
  documentationList: any[] = [];
  collectionsList: any [] = [];
  fcreacion;
  settlementList: any[] = [];
  settlement: {};

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      cnotificacion: [{ value: '', disabled: true }],
      ccontratoflota: ['', Validators.required],
      xcliente: [{ value: '', disabled: true }],
      fdesde_pol: [{ value: '', disabled: true }],
      fhasta_pol: [{ value: '', disabled: true }],
      xmarca: [{ value: '', disabled: true }],
      xmodelo: [{ value: '', disabled: true }],
      xtipo: [{ value: '', disabled: true }],
      xplaca: [{ value: '', disabled: true }],
      fano: [{ value: '', disabled: true }],
      xcolor: [{ value: '', disabled: true }],
      xserialcarroceria: [{ value: '', disabled: true }],
      xserialmotor: [{ value: '', disabled: true }],
      xnombrepropietario: [{ value: '', disabled: true }],
      xapellidopropietario: [{ value: '', disabled: true }],
      xtipodocidentidadpropietario: [{ value: '', disabled: true }],
      xdocidentidadpropietario: [{ value: '', disabled: true }],
      xdireccionpropietario: [{ value: '', disabled: true }],
      xtelefonocelularpropietario: [{ value: '', disabled: true }],
      xemailpropietario: [{ value: '', disabled: true }],
      ctiponotificacion: ['', Validators.required],
      ccausasiniestro: ['', Validators.required],
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      xtelefono: ['', Validators.required],
      xnombrealternativo: [''],
      xapellidoalternativo: [''],
      xtelefonoalternativo: [''],
      bdano: [false, Validators.required],
      btransitar: [false, Validators.required],
      bdanootro: [false, Validators.required],
      blesionado: [false, Validators.required],
      bpropietario: [false, Validators.required],
      fdia: ['', Validators.required],
      fhora: ['', Validators.required],
      cestado: ['', Validators.required],
      cciudad: ['', Validators.required],
      xdireccion: ['', Validators.required],
      xdescripcion: ['', Validators.required],
      btransito: [false, Validators.required],
      bcarga: [false, Validators.required],
      bpasajero: [false, Validators.required],
      npasajero: [''],
      xobservacion: ['', Validators.required],
      xtiponotificacion: [''],
      crecaudo: [''],
      xrecaudos: [''],
      cdocumento: [''],
      xdocumentos: [''],
      ncantidad: [''],
      cestatusgeneral: [''],
      ccausaanulacion: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 76
      };
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
        }else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
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
    this.notificationTypeList = [];
    this.http.post(`${environment.apiUrl}/api/valrep/notification-type`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.notificationTypeList.push({ id: response.data.list[i].ctiponotificacion, value: response.data.list[i].xtiponotificacion });
        }
        //this.notificationTypeList.sort((a, b) => a.value > b.value ? 1 : -1);
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
    this.http.post(`${environment.apiUrl}/api/valrep/claim-cause`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.claimCauseList.push({ id: response.data.list[i].ccausasiniestro, value: response.data.list[i].xcausasiniestro });
        }
        //this.claimCauseList.sort((a, b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CLAIMCAUSENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.stateList.push({ id: response.data.list[i].cestado, value: response.data.list[i].xestado });
        }
        this.stateList.sort((a, b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CLAIMCAUSENOTFOUND"; }
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
        this.getNotificationData();
        this.searchOwner();
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

  getNotificationData(){ 
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cnotificacion: this.code
    };
    this.http.post(`${environment.apiUrl}/api/notification/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('cnotificacion').setValue(response.data.cnotificacion);
        this.detail_form.get('ccontratoflota').setValue(response.data.ccontratoflota);
        this.detail_form.get('ccontratoflota').disable();
        this.detail_form.get('xcliente').setValue(response.data.xcliente);
        if(response.data.fdesde_pol) {
          let dateFormat = new Date(response.data.fdesde_pol).toISOString().substring(0, 10);
          this.detail_form.get('fdesde_pol').setValue(dateFormat);
        }
        if(response.data.fhasta_pol) {
          let dateFormat = new Date(response.data.fhasta_pol).toISOString().substring(0, 10);
          this.detail_form.get('fhasta_pol').setValue(dateFormat);
        }
        this.detail_form.get('xmarca').setValue(response.data.xmarca);
        this.detail_form.get('xmodelo').setValue(response.data.xmodelo);
        this.detail_form.get('xtipo').setValue(response.data.xtipo);
        this.detail_form.get('xplaca').setValue(response.data.xplaca);
        this.detail_form.get('fano').setValue(response.data.fano);
        this.detail_form.get('xcolor').setValue(response.data.xcolor);
        this.detail_form.get('xserialcarroceria').setValue(response.data.xserialcarroceria);
        this.detail_form.get('xserialmotor').setValue(response.data.xserialmotor);
        this.detail_form.get('xnombrepropietario').setValue(response.data.xnombrepropietario);
        this.detail_form.get('xapellidopropietario').setValue(response.data.xapellidopropietario);
        this.detail_form.get('xdocidentidadpropietario').setValue(response.data.xdocidentidadpropietario);
        this.detail_form.get('xdireccionpropietario').setValue(response.data.xdireccionpropietario);
        this.detail_form.get('xtelefonocelularpropietario').setValue(response.data.xtelefonocelularpropietario);
        this.detail_form.get('xemailpropietario').setValue(response.data.xemailpropietario);
        this.detail_form.get('ctiponotificacion').setValue(response.data.ctiponotificacion);
        this.detail_form.get('ctiponotificacion').disable();
        if(this.detail_form.get('ctiponotificacion').value){
          this.searchCollections();
        }
        this.detail_form.get('crecaudo').setValue(response.data.crecaudo);
        this.detail_form.get('crecaudo').disable();
        if(this.detail_form.get('crecaudo').value){
          this.searchDocumentation();
        }
        this.detail_form.get('ccausasiniestro').setValue(response.data.ccausasiniestro);
        this.detail_form.get('ccausasiniestro').disable();
        this.detail_form.get('xnombre').setValue(response.data.xnombre);
        this.detail_form.get('xnombre').disable();
        this.detail_form.get('xapellido').setValue(response.data.xapellido);
        this.detail_form.get('xapellido').disable();
        this.detail_form.get('xtelefono').setValue(response.data.xtelefono);
        this.detail_form.get('xtelefono').disable();
        this.detail_form.get('xnombrealternativo').setValue(response.data.xnombrealternativo);
        this.detail_form.get('xnombrealternativo').disable();
        this.detail_form.get('xapellidoalternativo').setValue(response.data.xapellidoalternativo);
        this.detail_form.get('xapellidoalternativo').disable();
        this.detail_form.get('xtelefonoalternativo').setValue(response.data.xtelefonoalternativo);
        this.detail_form.get('xtelefonoalternativo').disable();
        this.detail_form.get('bdano').setValue(response.data.bdano);
        this.detail_form.get('bdano').disable();
        this.detail_form.get('btransitar').setValue(response.data.btransitar);
        this.detail_form.get('btransitar').disable();
        this.detail_form.get('bdanootro').setValue(response.data.bdanootro);
        this.detail_form.get('bdanootro').disable();
        this.detail_form.get('blesionado').setValue(response.data.blesionado);
        this.detail_form.get('blesionado').disable();
        this.detail_form.get('bpropietario').setValue(response.data.bpropietario);
        this.detail_form.get('bpropietario').disable();
        if(response.data.fevento){
          let dayFormat = new Date(response.data.fevento).toISOString().substring(0, 10);
          let timeFormat = new Date(response.data.fevento).toISOString().substring(11, 16);
          this.detail_form.get('fdia').setValue(dayFormat);
          this.detail_form.get('fdia').disable();
          this.detail_form.get('fhora').setValue(timeFormat);
          this.detail_form.get('fhora').disable();
        }
        this.detail_form.get('cestado').setValue(response.data.cestado);
        this.detail_form.get('cestado').disable();
        this.cityDropdownDataRequest();
        this.detail_form.get('cciudad').setValue(response.data.cciudad);
        this.detail_form.get('cciudad').disable();
        this.detail_form.get('xdireccion').setValue(response.data.xdireccion);
        this.detail_form.get('xdireccion').disable();
        this.detail_form.get('xdescripcion').setValue(response.data.xdescripcion);
        this.detail_form.get('xdescripcion').disable();
        this.detail_form.get('btransito').setValue(response.data.btransito);
        this.detail_form.get('btransito').disable();
        this.detail_form.get('bcarga').setValue(response.data.bcarga);
        this.detail_form.get('bcarga').disable();
        this.detail_form.get('bpasajero').setValue(response.data.bpasajero);
        this.detail_form.get('bpasajero').disable();
        this.detail_form.get('npasajero').setValue(response.data.npasajero);
        this.detail_form.get('npasajero').disable();
        this.detail_form.get('xobservacion').setValue(response.data.xobservacion);
        this.detail_form.get('xobservacion').disable();
        this.noteList = [];
        if(response.data.notes){
          for(let i = 0; i < response.data.notes.length; i++){
            this.noteList.push({
              cgrid: i,
              create: false,
              cnotanotificacion: response.data.notes[i].cnotanotificacion,
              xnotanotificacion: response.data.notes[i].xnotanotificacion,
              xrutaarchivo: response.data.notes[i].xrutaarchivo,
              cfiniquito: response.data.notes[i].cfiniquito
            });
          }
        }
        this.replacementList = [];
        if(response.data.replacements){
          for(let i = 0; i < response.data.replacements.length; i++){
            this.replacementList.push({
              cgrid: i,
              create: false,
              crepuesto: response.data.replacements[i].crepuesto,
              xrepuesto: response.data.replacements[i].xrepuesto,
              ctiporepuesto: response.data.replacements[i].ctiporepuesto,
              ncantidad: response.data.replacements[i].ncantidad,
              cniveldano: response.data.replacements[i].cniveldano
            });
          }
        }
        this.materialDamageList = [];
        if(response.data.materialDamages){
          for(let i = 0; i < response.data.materialDamages.length; i++){
            this.materialDamageList.push({
              cgrid: i,
              create: false,
              cdanomaterialnotificacion: response.data.materialDamages[i].cdanomaterialnotificacion,
              cdanomaterial: response.data.materialDamages[i].cdanomaterial,
              xdanomaterial: response.data.materialDamages[i].xdanomaterial,
              cniveldano: response.data.materialDamages[i].cniveldano,
              xniveldano: response.data.materialDamages[i].xniveldano,
              xobservacion: response.data.materialDamages[i].xobservacion,
              ctipodocidentidad: response.data.materialDamages[i].ctipodocidentidad,
              xdocidentidad: response.data.materialDamages[i].xdocidentidad,
              xnombre: response.data.materialDamages[i].xnombre,
              xapellido: response.data.materialDamages[i].xapellido,
              cestado: response.data.materialDamages[i].cestado,
              cciudad: response.data.materialDamages[i].cciudad,
              xdireccion: response.data.materialDamages[i].xdireccion,
              xtelefonocelular: response.data.materialDamages[i].xtelefonocelular,
              xtelefonocasa: response.data.materialDamages[i].xtelefonocasa,
              xemail: response.data.materialDamages[i].xemail
            });
          }
        }
        this.thirdPartyTracingList = [];
        this.thirdpartyList = [];
        if(response.data.thirdparties){
          for(let i = 0; i < response.data.thirdparties.length; i++){
            let tracings = [];
            for(let j = 0; j < response.data.thirdparties[i].tracings.length; j++){
              let dayFormat = new Date(response.data.thirdparties[i].tracings[j].fseguimientotercero).toISOString().substring(0, 10);
              let timeFormat = new Date(response.data.thirdparties[i].tracings[j].fseguimientotercero).toISOString().substring(11, 16);
              let dateFormat = `${dayFormat}T${timeFormat}Z`
              tracings.push({
                create: false,
                cseguimientotercero: response.data.thirdparties[i].tracings[j].cseguimientotercero,
                ctiposeguimiento: response.data.thirdparties[i].tracings[j].ctiposeguimiento,
                xtiposeguimiento: response.data.thirdparties[i].tracings[j].xtiposeguimiento,
                cmotivoseguimiento: response.data.thirdparties[i].tracings[j].cmotivoseguimiento,
                xmotivoseguimiento: response.data.thirdparties[i].tracings[j].xmotivoseguimiento,
                fdia: dayFormat,
                fhora: timeFormat,
                fseguimientotercero: dateFormat,
                bcerrado: response.data.thirdparties[i].tracings[j].bcerrado,
                xcerrado: response.data.thirdparties[i].tracings[j].bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
                xobservacion: response.data.thirdparties[i].tracings[j].xobservacion
              });
            }
            this.thirdPartyTracingList = tracings;
            this.thirdpartyList.push({
              cgrid: i,
              create: false,
              cterceronotificacion: response.data.thirdparties[i].cterceronotificacion,
              ctipodocidentidad: response.data.thirdparties[i].ctipodocidentidad,
              xdocidentidad: response.data.thirdparties[i].xdocidentidad,
              xnombre: response.data.thirdparties[i].xnombre,
              xapellido: response.data.thirdparties[i].xapellido,
              xtelefonocelular: response.data.thirdparties[i].xtelefonocelular,
              xtelefonocasa: response.data.thirdparties[i].xtelefonocasa,
              xemail: response.data.thirdparties[i].xemail,
              xobservacion: response.data.thirdparties[i].xobservacion,
              tracings: tracings
            });
          }
        }
        this.thirdpartyVehicleList = [];
        if(response.data.thirdpartyVehicles){
          for(let i = 0; i < response.data.thirdpartyVehicles.length; i++){
            let replacements = [];
            for(let j = 0; j < response.data.thirdpartyVehicles[i].replacements.length; j++){
              replacements.push({
                create: false,
                crepuesto: response.data.thirdpartyVehicles[i].replacements[j].crepuesto,
                xrepuesto: response.data.thirdpartyVehicles[i].replacements[j].xrepuesto,
                ctiporepuesto: response.data.thirdpartyVehicles[i].replacements[j].ctiporepuesto,
                ncantidad: response.data.thirdpartyVehicles[i].replacements[j].ncantidad,
                cniveldano: response.data.thirdpartyVehicles[i].replacements[j].cniveldano
              });
            }
            this.thirdpartyVehicleList.push({
              cgrid: i,
              create: false,
              cvehiculoterceronotificacion: response.data.thirdpartyVehicles[i].cvehiculoterceronotificacion,
              ctipodocidentidadconductor: response.data.thirdpartyVehicles[i].ctipodocidentidadconductor,
              xdocidentidadconductor: response.data.thirdpartyVehicles[i].xdocidentidadconductor,
              xnombreconductor: response.data.thirdpartyVehicles[i].xnombreconductor,
              xapellidoconductor: response.data.thirdpartyVehicles[i].xapellidoconductor,
              xtelefonocelularconductor: response.data.thirdpartyVehicles[i].xtelefonocelularconductor,
              xtelefonocasaconductor: response.data.thirdpartyVehicles[i].xtelefonocasaconductor,
              xemailconductor: response.data.thirdpartyVehicles[i].xemailconductor,
              xobservacionconductor: response.data.thirdpartyVehicles[i].xobservacionconductor,
              xplaca: response.data.thirdpartyVehicles[i].xplaca,
              cmarca: response.data.thirdpartyVehicles[i].cmarca,
              xmarca: response.data.thirdpartyVehicles[i].xmarca,
              cmodelo: response.data.thirdpartyVehicles[i].cmodelo,
              xmodelo: response.data.thirdpartyVehicles[i].xmodelo,
              cversion: response.data.thirdpartyVehicles[i].cversion,
              xversion: response.data.thirdpartyVehicles[i].xversion,
              fano: response.data.thirdpartyVehicles[i].fano,
              ccolor: response.data.thirdpartyVehicles[i].ccolor,
              xobservacionvehiculo: response.data.thirdpartyVehicles[i].xobservacionvehiculo,
              ctipodocidentidadpropietario: response.data.thirdpartyVehicles[i].ctipodocidentidadpropietario,
              xdocidentidadpropietario: response.data.thirdpartyVehicles[i].xdocidentidadpropietario,
              xnombrepropietario: response.data.thirdpartyVehicles[i].xnombrepropietario,
              xapellidopropietario: response.data.thirdpartyVehicles[i].xapellidopropietario,
              cestado: response.data.thirdpartyVehicles[i].cestado,
              cciudad: response.data.thirdpartyVehicles[i].cciudad,
              xdireccion: response.data.thirdpartyVehicles[i].xdireccion,
              xtelefonocelularpropietario: response.data.thirdpartyVehicles[i].xtelefonocelularpropietario,
              xtelefonocasapropietario: response.data.thirdpartyVehicles[i].xtelefonocasapropietario,
              xemailpropietario: response.data.thirdpartyVehicles[i].xemailpropietario,
              xobservacionpropietario: response.data.thirdpartyVehicles[i].xobservacionpropietario,
              replacements: replacements
            });
          }
        }
        this.providerList = [];
        if(response.data.providers){
          for(let i = 0; i < response.data.providers.length; i++){
            let replacements = [];
            for(let j = 0; j < response.data.providers[i].replacements.length; j++){
              replacements.push({
                create: false,
                crepuesto: response.data.providers[i].replacements[j].crepuesto,
                xrepuesto: response.data.providers[i].replacements[j].xrepuesto,
                ctiporepuesto: response.data.providers[i].replacements[j].ctiporepuesto,
                xtiporepuesto: response.data.providers[i].replacements[j].xtiporepuesto,
                ncantidad: response.data.providers[i].replacements[j].ncantidad,
                cniveldano: response.data.providers[i].replacements[j].cniveldano,
                xniveldano: response.data.providers[i].replacements[j].xniveldano
              });
            }
            this.providerList.push({
              cgrid: i,
              create: false,
              ccotizacion: response.data.providers[i].ccotizacion,
              cproveedor: response.data.providers[i].cproveedor,
              xnombre: response.data.providers[i].xnombre,
              xobservacion: response.data.providers[i].xobservacion,
              replacements: replacements
            });
          }
        }
        this.quoteList = [];
        if(response.data.quotes){
          for(let i = 0; i < response.data.quotes.length; i++){
            let replacements = [];
            for(let j = 0; j < response.data.quotes[i].replacements.length; j++){
              replacements.push({
                create: false,
                crepuestocotizacion: response.data.quotes[i].replacements[j].crepuestocotizacion,
                crepuesto: response.data.quotes[i].replacements[j].crepuesto,
                xrepuesto: response.data.quotes[i].replacements[j].xrepuesto,
                ctiporepuesto: response.data.quotes[i].replacements[j].ctiporepuesto,
                ncantidad: response.data.quotes[i].replacements[j].ncantidad,
                cniveldano: response.data.quotes[i].replacements[j].cniveldano,
                bdisponible: response.data.quotes[i].replacements[j].bdisponible,
                xdisponible: response.data.quotes[i].replacements[j].bdisponible ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
                munitariorepuesto: response.data.quotes[i].replacements[j].munitariorepuesto,
                bdescuento: response.data.quotes[i].replacements[j].bdescuento,
                mtotalrepuesto: response.data.quotes[i].replacements[j].mtotalrepuesto,
                cmoneda: response.data.quotes[i].replacements[j].cmoneda,
                xmoneda: response.data.quotes[i].replacements[j].xmoneda,
                cnotificacion: this.code,
              });
            }
            this.quoteList.push({
              cgrid: i,
              create: false,
              ccotizacion: response.data.quotes[i].ccotizacion,
              cproveedor: response.data.quotes[i].cproveedor,
              xnombre: response.data.quotes[i].xnombre,
              xobservacion: response.data.quotes[i].xobservacion,
              mtotalcotizacion: response.data.quotes[i].mtotalcotizacion,
              bcerrada: response.data.quotes[i].bcerrada,
              replacements: replacements,
              cnotificacion: this.code,
              mmontoiva: response.data.quotes[i].mmontoiva,
              mtotal: response.data.quotes[i].mtotal,
              cimpuesto: response.data.quotes[i].cimpuesto,
              pimpuesto: response.data.quotes[i].pimpuesto,
              baceptacion: response.data.quotes[i].baceptacion,
              cmoneda: response.data.quotes[i].cmoneda,
              xmoneda: response.data.quotes[i].xmoneda
            });
          }
        }
        this.tracingList = [];
        if(response.data.tracings){
          for(let i = 0; i < response.data.tracings.length; i++){
            let dayFormat = new Date(response.data.tracings[i].fseguimientonotificacion).toISOString().substring(0, 10);
            let timeFormat = new Date(response.data.tracings[i].fseguimientonotificacion).toISOString().substring(11, 16);
            let dateFormat = `${dayFormat}T${timeFormat}Z`
            this.tracingList.push({
              cgrid: i,
              create: false,
              cseguimientonotificacion: response.data.tracings[i].cseguimientonotificacion,
              ctiposeguimiento: response.data.tracings[i].ctiposeguimiento,
              xtiposeguimiento: response.data.tracings[i].xtiposeguimiento,
              cmotivoseguimiento: response.data.tracings[i].cmotivoseguimiento,
              xmotivoseguimiento: response.data.tracings[i].xmotivoseguimiento,
              fdia: dayFormat,
              fhora: timeFormat,
              fseguimientonotificacion: dateFormat,
              bcerrado: response.data.tracings[i].bcerrado,
              xcerrado: response.data.tracings[i].bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
              xobservacion: response.data.tracings[i].xobservacion
            });
          }
        }
        this.serviceOrderList = [];
        let xservicio;
        if(response.data.serviceOrder){
          for(let i = 0; i < response.data.serviceOrder.length; i++){
            if(response.data.serviceOrder[i].xservicio){
              xservicio = response.data.serviceOrder[i].xservicio
            }else{
              xservicio = response.data.serviceOrder[i].xservicioadicional
            }
            this.serviceOrderList.push({
              cgrid: i,
              createServiceOrder: false,
              cnotificacion: response.data.serviceOrder[i].cnotificacion,
              corden: response.data.serviceOrder[i].corden,
              cservicio: response.data.serviceOrder[i].cservicio,
              cservicioadicional: response.data.serviceOrder[i].cservicioadicional,
              xservicio: xservicio,
              xobservacion: response.data.serviceOrder[i].xobservacion,
              xfecha: response.data.serviceOrder[i].xfecha,
              xdanos: response.data.serviceOrder[i].xdanos,
              fajuste: response.data.serviceOrder[i].fajuste.substring(0,10),
              xdesde: response.data.serviceOrder[i].xdesde,
              xhacia: response.data.serviceOrder[i].xhacia,
              mmonto: response.data.serviceOrder[i].mmonto,
              cmoneda: response.data.serviceOrder[i].cmoneda,
              xmoneda: response.data.serviceOrder[i].xmoneda,
              cproveedor: response.data.serviceOrder[i].cproveedor,
              bactivo: response.data.serviceOrder[i].bactivo
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
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  
  }

  cityDropdownDataRequest(){
    if(this.detail_form.get('cestado').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cestado: this.detail_form.get('cestado').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/city`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.cityList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.cityList.push({ id: response.data.list[i].cciudad, value: response.data.list[i].xciudad });
          }
          this.cityList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CITYNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  searchVehicle(){
    let vehicle = {};
    const modalRef = this.modalService.open(NotificationVehicleComponent, { size: 'xl' });
    modalRef.componentInstance.vehicle = vehicle;
    modalRef.result.then((result: any) => {
      if(result){
        this.detail_form.get('ccontratoflota').setValue(result.ccontratoflota);
        if(result.fdesde_pol) {
          let dateFormat = new Date(result.fdesde_pol).toISOString().substring(0, 10);
          this.detail_form.get('fdesde_pol').setValue(dateFormat);
        }
        if(result.fhasta_pol) {
          let dateFormat = new Date(result.fhasta_pol).toISOString().substring(0, 10);
          this.detail_form.get('fhasta_pol').setValue(dateFormat);
        }
        this.detail_form.get('xcliente').setValue(result.xcliente);
        this.detail_form.get('xmarca').setValue(result.xmarca);
        this.detail_form.get('xmodelo').setValue(result.xmodelo);
        this.detail_form.get('xtipo').setValue(result.xtipo);
        this.detail_form.get('xplaca').setValue(result.xplaca);
        this.detail_form.get('fano').setValue(result.fano);
        this.detail_form.get('xcolor').setValue(result.xcolor);
        this.detail_form.get('xserialcarroceria').setValue(result.xserialcarroceria);
        this.detail_form.get('xserialmotor').setValue(result.xserialmotor);
        this.detail_form.get('xnombrepropietario').setValue(result.xnombrepropietario);
        this.detail_form.get('xapellidopropietario').setValue(result.xapellidopropietario);
        this.detail_form.get('xdocidentidadpropietario').setValue(result.xdocidentidadpropietario);
        this.detail_form.get('xdireccionpropietario').setValue(result.xdireccionpropietario);
        this.detail_form.get('xtelefonocelularpropietario').setValue(result.xtelefonocelularpropietario);
        this.detail_form.get('xemailpropietario').setValue(result.xemailpropietario);
      }
    });
  }

  editNotification(){
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
    this.editBlock = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.editStatus = false;
      this.showEditButton = true;
      this.getNotificationData();
    }else{
      this.router.navigate([`/events/notification-index`]);
    }
  }

  addNote(){
    let note = { type: 3, cfiniquito: this.noteList, ccompania: this.currentUser.data.ccompania };
    const modalRef = this.modalService.open(NotificationNoteComponent);
    modalRef.componentInstance.note = note;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.noteList.push({
            cgrid: this.noteList.length,
            create: true,
            xnotanotificacion: result.xnotanotificacion,
            xrutaarchivo: result.xrutaarchivo
          });
          this.noteGridApi.setRowData(this.noteList);
        }
      }
    });
  }

  addReplacement(){
    let replacement = { from: 1 }
    const modalRef = this.modalService.open(NotificationSearchReplacementComponent, { size: 'xl' });
    modalRef.componentInstance.replacement = replacement;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 3){
          this.replacementList.push({
            cgrid:  this.replacementList.length,
            create: true,
            crepuesto: result.crepuesto,
            xrepuesto: result.xrepuesto,
            ctiporepuesto: result.ctiporepuesto,
            ncantidad: result.ncantidad,
            cniveldano: result.cniveldano
          });
          this.replacementGridApi.setRowData(this.replacementList);
        }
      }
    });
  }

  addThirdparty(){
    let thirdparty = { type: 3 };
    const modalRef = this.modalService.open(NotificationThirdpartyComponent, { size: 'xl' });
    modalRef.componentInstance.thirdparty = thirdparty;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.thirdpartyList.push({
            cgrid: this.thirdpartyList.length,
            create: true,
            ctipodocidentidad: result.ctipodocidentidad,
            xdocidentidad: result.xdocidentidad,
            xnombre: result.xnombre,
            xapellido: result.xapellido,
            xtelefonocelular: result.xtelefonocelular,
            xtelefonocasa: result.xtelefonocasa,
            xemail: result.xemail,
            xobservacion: result.xobservacion,
            tracings: result.tracings
          });
          this.thirdpartyGridApi.setRowData(this.thirdpartyList);
        }
      }
    });
  }

  addMaterialDamage(){
    let materialDamage = { type: 3 };
    const modalRef = this.modalService.open(NotificationMaterialDamageComponent, { size: 'xl' });
    modalRef.componentInstance.materialDamage = materialDamage;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.materialDamageList.push({
            cgrid: this.materialDamageList.length,
            create: true,
            cdanomaterial: result.cdanomaterial,
            xdanomaterial: result.xdanomaterial,
            cniveldano: result.cniveldano,
            xniveldano: result.xniveldano,
            xobservacion: result.xobservacion,
            ctipodocidentidad: result.ctipodocidentidad,
            xdocidentidad: result.xdocidentidad,
            xnombre: result.xnombre,
            xapellido: result.xapellido,
            cestado: result.cestado,
            cciudad: result.cciudad,
            xdireccion: result.xdireccion,
            xtelefonocelular: result.xtelefonocelular,
            xtelefonocasa: result.xtelefonocasa,
            xemail: result.xemail
          });
          this.materialDamageGridApi.setRowData(this.materialDamageList);
        }
      }
    });
  }

  addThirdpartyVehicle(){
    let thirdpartyVehicle = { type: 3 };
    const modalRef = this.modalService.open(NotificationThirdpartyVehicleComponent, {size: 'xl'});
    modalRef.componentInstance.thirdpartyVehicle = thirdpartyVehicle;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.thirdpartyVehicleList.push({
            cgrid: this.thirdpartyVehicleList.length,
            create: true,
            ctipodocidentidadconductor: result.ctipodocidentidadconductor,
            xdocidentidadconductor: result.xdocidentidadconductor,
            xnombreconductor: result.xnombreconductor,
            xapellidoconductor: result.xapellidoconductor,
            xtelefonocelularconductor: result.xtelefonocelularconductor,
            xtelefonocasaconductor: result.xtelefonocasaconductor,
            xemailconductor: result.xemailconductor,
            xobservacionconductor: result.xobservacionconductor,
            xplaca: result.xplaca,
            cmarca: result.cmarca,
            xmarca: result.xmarca,
            cmodelo: result.cmodelo,
            xmodelo: result.xmodelo,
            cversion: result.cversion,
            xversion: result.xversion,
            fano: result.fano,
            ccolor: result.ccolor,
            xobservacionvehiculo: result.xobservacionvehiculo,
            ctipodocidentidadpropietario: result.ctipodocidentidadpropietario,
            xdocidentidadpropietario: result.xdocidentidadpropietario,
            xnombrepropietario: result.xnombrepropietario,
            xapellidopropietario: result.xapellidopropietario,
            cestado: result.cestado,
            cciudad: result.cciudad,
            xdireccion: result.xdireccion,
            xtelefonocelularpropietario: result.xtelefonocelularpropietario,
            xtelefonocasapropietario: result.xtelefonocasapropietario,
            xemailpropietario: result.xemailpropietario,
            xobservacionpropietario: result.xobservacionpropietario,
            replacements: result.replacements
          });
          this.thirdpartyVehicleGridApi.setRowData(this.thirdpartyVehicleList);
        }
      }
    });
  }

  addProvider(){
    if(this.code){
      let provider = { 
        ctiponotificacion: this.detail_form.get('ctiponotificacion').value,
        cnotificacion: this.code
       };
      const modalRef = this.modalService.open(NotificationSearchProviderComponent, {size: 'xl'});
      modalRef.componentInstance.provider = provider;
      modalRef.result.then((result: any) => { 
        if(result){
          if(result.type == 3){
            this.providerList.push({
              cgrid: this.providerList.length,
              create: true,
              editable: true,
              cproveedor: result.cproveedor,
              xnombre: result.xnombre,
              xobservacion: result.xobservacion,
              replacements: result.replacements
            });
            this.providerGridApi.setRowData(this.providerList);
          }
        }
      });
    }
  }

  addTracing(){
    let tracing = { type: 3 };
    const modalRef = this.modalService.open(NotificationTracingComponent);
    modalRef.componentInstance.tracing = tracing;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.tracingList.push({
            cgrid: this.tracingList.length,
            create: true,
            ctiposeguimiento: result.ctiposeguimiento,
            xtiposeguimiento: result.xtiposeguimiento,
            cmotivoseguimiento: result.cmotivoseguimiento,
            xmotivoseguimiento: result.xmotivoseguimiento,
            fdia: result.fdia,
            fhora: result.fhora,
            fseguimientonotificacion: result.fseguimientonotificacion,
            bcerrado: result.bcerrado,
            xcerrado: result.bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
            xobservacion: result.xobservacion
          });
          this.tracingGridApi.setRowData(this.tracingList);
        }
      }
    });
  }

  noteRowClicked(event: any){
    let note = {};
    if(this.editStatus){ 
      note = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cnotanotificacion: event.data.cnotanotificacion,
        xnotanotificacion: event.data.xnotanotificacion,
        xrutaarchivo: event.data.xrutaarchivo,
        cfiniquito: event.data.cfiniquito,
        ccompania: this.currentUser.data.ccompania,
        delete: false
      };
    }else{ 
      note = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cnotanotificacion: event.data.cnotanotificacion,
        xnotanotificacion: event.data.xnotanotificacion,
        xrutaarchivo: event.data.xrutaarchivo,
        cfiniquito: event.data.cfiniquito,
        ccompania: this.currentUser.data.ccompania,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationNoteComponent);
    modalRef.componentInstance.note = note;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.noteList.length; i++){
            if(this.noteList[i].cgrid == result.cgrid){
              this.noteList[i].xnotanotificacion = result.xnotanotificacion;
              this.noteList[i].xrutaarchivo = result.xrutaarchivo;
              this.noteGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.noteDeletedRowList.push({ cnotanotificacion: result.cnotanotificacion });
          }
          this.noteList = this.noteList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.noteList.length; i++){
            this.noteList[i].cgrid = i;
          }
          this.noteGridApi.setRowData(this.noteList);
        }
      }
    });
  }

  replacementRowClicked(event: any){
    let replacement = {};
    if(this.editStatus){ 
      replacement = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        crepuesto: event.data.crepuesto,
        ctiporepuesto: event.data.ctiporepuesto,
        ncantidad: event.data.ncantidad,
        cniveldano: event.data.cniveldano,
        delete: false
      };
    }else{ 
      replacement = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        crepuesto: event.data.crepuesto,
        ctiporepuesto: event.data.ctiporepuesto,
        ncantidad: event.data.ncantidad,
        cniveldano: event.data.cniveldano,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationReplacementComponent);
    modalRef.componentInstance.replacement = replacement;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i <  this.replacementList.length; i++){
            if( this.replacementList[i].cgrid == result.cgrid){
              this.replacementList[i].crepuesto = result.crepuesto;
              this.replacementList[i].xrepuesto = result.xrepuesto;
              this.replacementList[i].ctiporepuesto = result.ctiporepuesto;
              this.replacementList[i].ncantidad = result.ncantidad;
              this.replacementList[i].cniveldano = result.cniveldano;
              this.replacementGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.replacementDeletedRowList.push({ crepuesto: result.crepuesto });
          }
          this.replacementList = this.replacementList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.replacementList.length; i++){
            this.replacementList[i].cgrid = i;
          }
          this.replacementGridApi.setRowData(this.replacementList);
        }
      }
    });
  }

  thirdpartyRowClicked(event: any){
    let thirdparty = {};
    if(this.editStatus){ 
      thirdparty = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cterceronotificacion: event.data.cterceronotificacion,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        xtelefonocelular: event.data.xtelefonocelular,
        xtelefonocasa: event.data.xtelefonocasa,
        xemail: event.data.xemail,
        xobservacion: event.data.xobservacion,
        tracings: event.data.tracings,
        delete: false
      };
    }else{ 
      thirdparty = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cterceronotificacion: event.data.cterceronotificacion,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        xtelefonocelular: event.data.xtelefonocelular,
        xtelefonocasa: event.data.xtelefonocasa,
        xemail: event.data.xemail,
        xobservacion: event.data.xobservacion,
        tracings: event.data.tracings,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationThirdpartyComponent, { size: 'xl' });
    modalRef.componentInstance.thirdparty = thirdparty;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.thirdpartyList.length; i++){
            if(this.thirdpartyList[i].cgrid == result.cgrid){
              this.thirdpartyList[i].ctipodocidentidad = result.ctipodocidentidad;
              this.thirdpartyList[i].xdocidentidad = result.xdocidentidad;
              this.thirdpartyList[i].xnombre = result.xnombre;
              this.thirdpartyList[i].xapellido = result.xapellido;
              this.thirdpartyList[i].xtelefonocelular = result.xtelefonocelular;
              this.thirdpartyList[i].xtelefonocasa = result.xtelefonocasa;
              this.thirdpartyList[i].xemail = result.xemail;
              this.thirdpartyList[i].xobservacion = result.xobservacion;
              this.thirdpartyList[i].tracings = result.tracings;
              this.thirdpartyList[i].tracingsResult = result.tracingsResult;
              this.thirdpartyGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.thirdpartyDeletedRowList.push({ cterceronotificacion: result.cterceronotificacion });
          }
          this.thirdpartyList = this.thirdpartyList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.thirdpartyList.length; i++){
            this.thirdpartyList[i].cgrid = i;
          }
          this.thirdpartyGridApi.setRowData(this.thirdpartyList);
        }
      }
    });
  }

  materialDamageRowClicked(event: any){
    let materialDamage = {};
    if(this.editStatus && !this.editBlock){ 
      materialDamage = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cdanomaterialnotificacion: event.data.cdanomaterialnotificacion,
        cdanomaterial: event.data.cdanomaterial,
        cniveldano: event.data.cniveldano,
        xobservacion: event.data.xobservacion,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        cestado: event.data.cestado,
        cciudad: event.data.cciudad,
        xdireccion: event.data.xdireccion,
        xtelefonocelular: event.data.xtelefonocelular,
        xtelefonocasa: event.data.xtelefonocasa,
        xemail: event.data.xemail,
        delete: false
      };
    }else{ 
      materialDamage = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cdanomaterialnotificacion: event.data.cdanomaterialnotificacion,
        cdanomaterial: event.data.cdanomaterial,
        cniveldano: event.data.cniveldano,
        xobservacion: event.data.xobservacion,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        cestado: event.data.cestado,
        cciudad: event.data.cciudad,
        xdireccion: event.data.xdireccion,
        xtelefonocelular: event.data.xtelefonocelular,
        xtelefonocasa: event.data.xtelefonocasa,
        xemail: event.data.xemail,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationMaterialDamageComponent, { size: 'xl' });
    modalRef.componentInstance.materialDamage = materialDamage;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.materialDamageList.length; i++){
            if(this.materialDamageList[i].cgrid == result.cgrid){
              this.materialDamageList[i].cdanomaterial = result.cdanomaterial;
              this.materialDamageList[i].xdanomaterial = result.xdanomaterial;
              this.materialDamageList[i].cniveldano = result.cniveldano;
              this.materialDamageList[i].xniveldano = result.xniveldano;
              this.materialDamageList[i].xobservacion = result.xobservacion;
              this.materialDamageList[i].ctipodocidentidad = result.ctipodocidentidad;
              this.materialDamageList[i].xdocidentidad = result.xdocidentidad;
              this.materialDamageList[i].xnombre = result.xnombre;
              this.materialDamageList[i].xapellido = result.xapellido;
              this.materialDamageList[i].cestado = result.cestado;
              this.materialDamageList[i].cciudad = result.cciudad;
              this.materialDamageList[i].xdireccion = result.xdireccion;
              this.materialDamageList[i].xtelefonocelular = result.xtelefonocelular;
              this.materialDamageList[i].xtelefonocasa = result.xtelefonocasa;
              this.materialDamageList[i].xemail = result.xemail;
              this.materialDamageGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.materialDamageDeletedRowList.push({ cdanomaterialnotificacion: result.cdanomaterialnotificacion });
          }
          this.materialDamageList = this.materialDamageList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.materialDamageList.length; i++){
            this.materialDamageList[i].cgrid = i;
          }
          this.materialDamageGridApi.setRowData(this.materialDamageList);
        }
      }
    });
  }

  thirdpartyVehicleRowClicked(event: any){
    let thirdpartyVehicle = {};
    if(this.editStatus && !this.editBlock){ 
      thirdpartyVehicle = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cvehiculoterceronotificacion: event.data.cvehiculoterceronotificacion,
        ctipodocidentidadconductor: event.data.ctipodocidentidadconductor,
        xdocidentidadconductor: event.data.xdocidentidadconductor,
        xnombreconductor: event.data.xnombreconductor,
        xapellidoconductor: event.data.xapellidoconductor,
        xtelefonocelularconductor: event.data.xtelefonocelularconductor,
        xtelefonocasaconductor: event.data.xtelefonocasaconductor,
        xemailconductor: event.data.xemailconductor,
        xobservacionconductor: event.data.xobservacionconductor,
        xplaca: event.data.xplaca,
        cmarca: event.data.cmarca,
        cmodelo: event.data.cmodelo,
        cversion: event.data.cversion,
        fano: event.data.fano,
        ccolor: event.data.ccolor,
        xobservacionvehiculo: event.data.xobservacionvehiculo,
        ctipodocidentidadpropietario: event.data.ctipodocidentidadpropietario,
        xdocidentidadpropietario: event.data.xdocidentidadpropietario,
        xnombrepropietario: event.data.xnombrepropietario,
        xapellidopropietario: event.data.xapellidopropietario,
        cestado: event.data.cestado,
        cciudad: event.data.cciudad,
        xdireccion: event.data.xdireccion,
        xtelefonocelularpropietario: event.data.xtelefonocelularpropietario,
        xtelefonocasapropietario: event.data.xtelefonocasapropietario,
        xemailpropietario: event.data.xemailpropietario,
        xobservacionpropietario: event.data.xobservacionpropietario,
        replacements: event.data.replacements,
        delete: false
      };
    }else{ 
      thirdpartyVehicle = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cvehiculoterceronotificacion: event.data.cvehiculoterceronotificacion,
        ctipodocidentidadconductor: event.data.ctipodocidentidadconductor,
        xdocidentidadconductor: event.data.xdocidentidadconductor,
        xnombreconductor: event.data.xnombreconductor,
        xapellidoconductor: event.data.xapellidoconductor,
        xtelefonocelularconductor: event.data.xtelefonocelularconductor,
        xtelefonocasaconductor: event.data.xtelefonocasaconductor,
        xemailconductor: event.data.xemailconductor,
        xobservacionconductor: event.data.xobservacionconductor,
        xplaca: event.data.xplaca,
        cmarca: event.data.cmarca,
        cmodelo: event.data.cmodelo,
        cversion: event.data.cversion,
        fano: event.data.fano,
        ccolor: event.data.ccolor,
        xobservacionvehiculo: event.data.xobservacionvehiculo,
        ctipodocidentidadpropietario: event.data.ctipodocidentidadpropietario,
        xdocidentidadpropietario: event.data.xdocidentidadpropietario,
        xnombrepropietario: event.data.xnombrepropietario,
        xapellidopropietario: event.data.xapellidopropietario,
        cestado: event.data.cestado,
        cciudad: event.data.cciudad,
        xdireccion: event.data.xdireccion,
        xtelefonocelularpropietario: event.data.xtelefonocelularpropietario,
        xtelefonocasapropietario: event.data.xtelefonocasapropietario,
        xemailpropietario: event.data.xemailpropietario,
        xobservacionpropietario: event.data.xobservacionpropietario,
        replacements: event.data.replacements,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationThirdpartyVehicleComponent, {size: 'xl'});
    modalRef.componentInstance.thirdpartyVehicle = thirdpartyVehicle;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.thirdpartyVehicleList.length; i++){
            if(this.thirdpartyVehicleList[i].cgrid == result.cgrid){
              this.thirdpartyVehicleList[i].ctipodocidentidadconductor = result.ctipodocidentidadconductor;
              this.thirdpartyVehicleList[i].xdocidentidadconductor = result.xdocidentidadconductor;
              this.thirdpartyVehicleList[i].xnombreconductor = result.xnombreconductor;
              this.thirdpartyVehicleList[i].xapellidoconductor = result.xapellidoconductor;
              this.thirdpartyVehicleList[i].xtelefonocelularconductor = result.xtelefonocelularconductor;
              this.thirdpartyVehicleList[i].xtelefonocasaconductor = result.xtelefonocasaconductor;
              this.thirdpartyVehicleList[i].xemailconductor = result.xemailconductor;
              this.thirdpartyVehicleList[i].xobservacionconductor = result.xobservacionconductor;
              this.thirdpartyVehicleList[i].xplaca = result.xplaca;
              this.thirdpartyVehicleList[i].cmarca = result.cmarca;
              this.thirdpartyVehicleList[i].xmarca = result.xmarca;
              this.thirdpartyVehicleList[i].cmodelo = result.cmodelo;
              this.thirdpartyVehicleList[i].xmodelo = result.xmodelo;
              this.thirdpartyVehicleList[i].cversion = result.cversion;
              this.thirdpartyVehicleList[i].xversion = result.xversion;
              this.thirdpartyVehicleList[i].fano = result.fano;
              this.thirdpartyVehicleList[i].ccolor = result.ccolor;
              this.thirdpartyVehicleList[i].xobservacionvehiculo = result.xobservacionvehiculo;
              this.thirdpartyVehicleList[i].ctipodocidentidadpropietario = result.ctipodocidentidadpropietario;
              this.thirdpartyVehicleList[i].xdocidentidadpropietario = result.xdocidentidadpropietario;
              this.thirdpartyVehicleList[i].xnombrepropietario = result.xnombrepropietario;
              this.thirdpartyVehicleList[i].xapellidopropietario = result.xapellidopropietario;
              this.thirdpartyVehicleList[i].cestado = result.cestado;
              this.thirdpartyVehicleList[i].cciudad = result.cciudad;
              this.thirdpartyVehicleList[i].xdireccion = result.xdireccion;
              this.thirdpartyVehicleList[i].xtelefonocelularpropietario = result.xtelefonocelularpropietario;
              this.thirdpartyVehicleList[i].xtelefonocasapropietario = result.xtelefonocasapropietario;
              this.thirdpartyVehicleList[i].xemailpropietario = result.xemailpropietario;
              this.thirdpartyVehicleList[i].xobservacionpropietario = result.xobservacionpropietario;
              this.thirdpartyVehicleList[i].replacements = result.replacements;
              this.thirdpartyVehicleList[i].replacementsResult = result.replacementsResult;
              this.thirdpartyGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.thirdpartyVehicleDeletedRowList.push({ cvehiculoterceronotificacion: result.cvehiculoterceronotificacion});
          }
          this.thirdpartyVehicleList = this.thirdpartyVehicleList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.thirdpartyVehicleList.length; i++){
            this.thirdpartyVehicleList[i].cgrid = i;
          }
          this.thirdpartyVehicleGridApi.setRowData(this.thirdpartyVehicleList);
        }
      }
    });
  }

  providerRowClicked(event: any){
    let provider = {};
    if(this.editStatus && event.data.create){ 
      provider = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccotizacion: event.data.ccotizacion,
        cproveedor: event.data.cproveedor,
        xobservacion: event.data.xobservacion,
        replacements: event.data.replacements,
        delete: false
      };
    }else{ 
      provider = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ccotizacion: event.data.ccotizacion,
        cproveedor: event.data.cproveedor,
        xobservacion: event.data.xobservacion,
        replacements: event.data.replacements,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationProviderComponent, {size: 'xl'});
    modalRef.componentInstance.provider = provider;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.providerList.length; i++){
            if(this.providerList[i].cgrid == result.cgrid){
              this.providerList[i].cproveedor = result.cproveedor;
              this.providerList[i].xproveedor = result.xproveedor;
              this.providerList[i].xobservacion = result.xobservacion;
              this.providerList[i].replacements = result.replacements;
              this.providerList[i].replacementsResult = result.replacementsResult;
              this.providerGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          this.providerList = this.providerList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.providerList.length; i++){
            this.providerList[i].cgrid = i;
          }
          this.providerGridApi.setRowData(this.providerList);
        }
      }
    });
  }

  quoteRowClicked(event: any){
    let quote = {};
    let notificacion = this.code;
    if(this.editStatus){ 
      quote = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccotizacion: event.data.ccotizacion,
        cproveedor: event.data.cproveedor,
        xnombre: event.data.xnombre,
        replacements: event.data.replacements,
        cnotificacion: notificacion,
        baceptacion: event.data.baceptacion,
        mtotalcotizacion: event.data.mtotalcotizacion,
        cimpuesto: 13,
        delete: false
      };
      console.log(quote)
    }else{ 
      quote = { 
        type: 2,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccotizacion: event.data.ccotizacion,
        cproveedor: event.data.cproveedor,
        xnombre: event.data.xnombre,
        replacements: event.data.replacements,
        cnotificacion: notificacion,
        baceptacion: event.data.baceptacion,
        mtotalcotizacion: event.data.mtotalcotizacion,
        cimpuesto: 13,
        delete: false
      }; 
      console.log(quote)
    }
 
    const modalRef = this.modalService.open(NotificationQuoteComponent, {size: 'xl'});
    modalRef.componentInstance.quote = quote;
    modalRef.result.then((result: any) => {
      if(result){
        this.serviceOrderList.push(result);
        this.serviceOrderGridApi.setRowData(this.serviceOrderList);
          for(let i = 0; i < this.quoteList.length; i++){
            if(this.quoteList[i].cgrid == result.cgrid){
              this.quoteList[i].replacements = result.replacements;
              this.quoteList[i].baceptacion = result.baceptacion;
              //this.quoteList[i].mtotalcotizacion = result.mtotalcotizacion;
              this.quoteList[i].cimpuesto = 13;
              //console.log(this.quoteList[i].mtotalcotizacion)
              this.quoteGridApi.refreshCells();
              return;
            }
          }
      }
    });
  }

  tracingRowClicked(event: any){
    let tracing = {};
    if(this.editStatus){ 
      tracing = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cseguimientonotificacion: event.data.cseguimientonotificacion,
        ctiposeguimiento: event.data.ctiposeguimiento,
        cmotivoseguimiento: event.data.cmotivoseguimiento,
        fdia: event.data.fdia,
        fhora: event.data.fhora,
        fseguimientonotificacion: event.data.fseguimientonotificacion,
        bcerrado: event.data.bcerrado,
        xobservacion: event.data.xobservacion,
        delete: false
      };
    }else{ 
      tracing = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cseguimientonotificacion: event.data.cseguimientonotificacion,
        ctiposeguimiento: event.data.ctiposeguimiento,
        cmotivoseguimiento: event.data.cmotivoseguimiento,
        fdia: event.data.fdia,
        fhora: event.data.fhora,
        fseguimientonotificacion: event.data.fseguimientonotificacion,
        bcerrado: event.data.bcerrado,
        xobservacion: event.data.xobservacion,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationTracingComponent);
    modalRef.componentInstance.tracing = tracing;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.tracingList.length; i++){
            if(this.tracingList[i].cgrid == result.cgrid){
              this.tracingList[i].ctiposeguimiento = result.ctiposeguimiento;
              this.tracingList[i].xtiposeguimiento = result.xtiposeguimiento;
              this.tracingList[i].cmotivoseguimiento = result.cmotivoseguimiento;
              this.tracingList[i].xmotivoseguimiento = result.xmotivoseguimiento;
              this.tracingList[i].fdia = result.fdia;
              this.tracingList[i].fhora = result.fhora;
              this.tracingList[i].fseguimientonotificacion = result.fseguimientonotificacion;
              this.tracingList[i].bcerrado = result.bcerrado;
              this.tracingList[i].xcerrado = result.bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
              this.tracingList[i].xobservacion = result.xobservacion;
              this.tracingGridApi.refreshCells();
              return;
            }
          }
        }
      }
    });
  }

  addServiceOrder(){
    if(this.code){
      let notificacion = {cnotificacion: this.code, repuestos: this.replacementList, createServiceOrder: true};
      const modalRef = this.modalService.open(NotificationServiceOrderComponent, {size: 'xl'});
      modalRef.componentInstance.notificacion = notificacion;
      modalRef.result.then((result: any) => { 

        this.serviceOrderList.push({
        cgrid: this.serviceOrderList.length,
        createServiceOrder: true,
        edit: false,
        cnotificacion: result.cnotificacion,
        corden: result.corden,
        cservicio: result.cservicio,
        xservicio: result.xservicio,
        cservicioadicional: result.cservicioadicional,
        xobservacion: result.xobservacion,
        xfecha: result.xfecha,
        xdanos: result.xdanos,
        fajuste: result.fajuste.substring(0,10),
        xdesde: result.xdesde,
        xhacia: result.xhacia,
        mmonto: result.mmonto,
        cimpuesto: 13,
        cmoneda: result.cmoneda,
        xmoneda: result.xmoneda,
        cproveedor: result.cproveedor,
        bactivo: result.bactivo,
        ccotizacion: result.ccotizacion,
        cestatusgeneral: result.cestatusgeneral,
        ccausaanulacion: result.ccausaanulacion
       });
       this.serviceOrderGridApi.setRowData(this.serviceOrderList);
      });
    }
  }

  addSettlement(){
    if(this.code){
      let notificacion = {cnotificacion: this.code, repuestos: this.replacementList, createSettlement: true};
      const modalRef = this.modalService.open(NotificationSettlementComponent, {size: 'xl'});
      modalRef.componentInstance.notificacion = notificacion;
      modalRef.result.then((result: any) => { 


        this.settlement = {
          //cgrid: this.settlementList.length,
          createSettlement: true,
          edit: false,
          cnotificacion: result.cnotificacion,
          xobservacion: result.xobservacion,
          crepuesto: result.crepuesto,
          xdanos: result.xdanos,
          corden: result.corden
        }
      });
    }
  }

  onNotesGridReady(event){
    this.noteGridApi = event.api;
  }

  onReplacementsGridReady(event){
    this.replacementGridApi = event.api;
  }

  onThirdpartiesGridReady(event){
    this.thirdpartyGridApi = event.api;
  }

  onMaterialDamagesGridReady(event){
    this.materialDamageGridApi = event.api;
  }

  onThirdpartiesVehiclesGridReady(event){
    this.thirdpartyVehicleGridApi = event.api;
  }

  onProvidersGridReady(event){
    this.providerGridApi = event.api;
  }

  onQuotesGridReady(event){
    this.quoteGridApi = event.api;
  }

  onTracingsGridReady(event){
    this.tracingGridApi = event.api;
  }

  onServiceOrderGridReady(event){
    this.serviceOrderGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      if(!this.detail_form.get('ccontratoflota').value){
        this.alert.message = "EVENTS.NOTIFICATIONS.REQUIREDCONTRACT";
        this.alert.type = 'danger';
        this.alert.show = true;
      }
      this.loading = false;
      return;
    }
    let fevento = `${form.fdia}T${form.fhora}Z`;
    let params;
    let url;
    if(this.code){
      let updateNoteList = this.noteList.filter((row) => { return !row.create; });
      let createNoteList = this.noteList.filter((row) => { return row.create; });
      let updateReplacementList = this.replacementList.filter((row) => { return !row.create; });
      let createReplacementList = this.replacementList.filter((row) => { return row.create; });
      let updateThirdpartyList = this.thirdpartyList.filter((row) => { return !row.create; });
      let updateProviderList = this.providerList.filter((row) => { return !row.create; });
      let createProviderList = this.providerList.filter((row) => { return row.create; });
      let updateTracingList = this.tracingList.filter((row) => { return !row.create; });
      let createTracingList = this.tracingList.filter((row) => { return row.create; });
      let updateQuoteList = this.quoteList.filter((row) => { return !row.create; });

      let updateServiceOrderList = []
      for(let i = 0; i < this.serviceOrderList.length; i++){
        if(this.serviceOrderList[i].edit){
          updateServiceOrderList.push({
            orden: this.serviceOrderList[i]
          })
        }
        console.log(updateServiceOrderList)
      }
      //let updateServiceOrderList = this.serviceOrderList.filter((row) => { return row.edit; });
      let createServiceOrderList = this.serviceOrderList.filter((row) => { return row.createServiceOrder; });
      params = {
        cnotificacion: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario,
        notes: {
          create: createNoteList,
          update: updateNoteList,
          delete: this.noteDeletedRowList
        },
        replacements: {
          create: createReplacementList,
          update: updateReplacementList,
          delete: this.replacementDeletedRowList
        },
        thirdparties: {
          update: updateThirdpartyList
        },
        providers: {
          create: createProviderList,
          update: updateProviderList
        },
        tracings: {
          create: createTracingList,
          update: updateTracingList
        },
        serviceOrder: {
          create: createServiceOrderList,
          update: updateServiceOrderList
        },
        quotes: {
          update: updateQuoteList
        },
        settlement: {
          create: this.settlement
        }
      };
      url = `${environment.apiUrl}/api/notification/update`;
      this.sendFormData(params, url);
    }else{
      let tracing = { type: 3 }; 
      console.log(this.detail_form.get('crecaudo').value)
      const modalRef = this.modalService.open(NotificationTracingComponent);
      modalRef.componentInstance.tracing = tracing;
      modalRef.result.then((result: any) => { 
        if(result){
          if(result.type == 3){
            params = {
              cpais: this.currentUser.data.cpais,
              ccompania: this.currentUser.data.ccompania,
              ccontratoflota: form.ccontratoflota,
              ctiponotificacion: form.ctiponotificacion,
              crecaudo: this.detail_form.get('crecaudo').value,
              ccausasiniestro: form.ccausasiniestro,
              xnombre: form.xnombre,
              xapellido: form.xapellido,
              xtelefono: form.xtelefono,
              xnombrealternativo: form.xnombrealternativo ? form.xnombrealternativo : undefined,
              xapellidoalternativo: form.xapellidoalternativo ? form.xapellidoalternativo : undefined,
              xtelefonoalternativo: form.xtelefonoalternativo ? form.xtelefonoalternativo : undefined,
              bdano: form.bdano,
              btransitar: form.btransitar,
              bdanootro: form.bdanootro,
              blesionado: form.blesionado,
              bpropietario: form.bpropietario,
              fevento: fevento,
              cestado: form.cestado,
              cciudad: form.cciudad,
              xdireccion: form.xdireccion,
              xdescripcion: form.xdescripcion,
              btransito: form.btransito,
              bcarga: form.bcarga,
              bpasajero: form.bpasajero,
              npasajero: form.npasajero ? form.npasajero : undefined,
              xobservacion: form.xobservacion,
              ctiposeguimiento: result.ctiposeguimiento,
              cmotivoseguimiento: result.cmotivoseguimiento,
              fseguimientonotificacion: result.fseguimientonotificacion,
              xobservacionseguimiento: result.xobservacion,
              cusuariocreacion: this.currentUser.data.cusuario,
              notes: this.noteList,
              replacements: this.replacementList,
              thirdparties: this.thirdpartyList,
              materialDamages: this.materialDamageList,
              thirdpartyVehicles: this.thirdpartyVehicleList,
              serviceOrder: this.serviceOrderList
            };
            url = `${environment.apiUrl}/api/notification/create`;
            this.sendFormData(params, url);
          }
        }else{
          this.loading = false;
          return;
        }
      });
    }
  }

  sendFormData(params, url){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/events/notification-detail/${response.data.cnotificacion}`]);
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  serviceOrderRowClicked(event: any){
    let notificacion = {};
    if(this.editStatus){ 
      notificacion = { 
        edit: true,
        createServiceOrder: false,
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cnotificacion: event.data.cnotificacion,
        corden: event.data.corden,
        cservicioadicional: event.data.cservicioadicional,
        xservicio: event.data.xservicio,
        xservicioadicional: event.data.xservicioadicional,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        xdanos: event.data.xdanos,
        xobservacion: event.data.xobservacion,
        xfecha: event.data.xfecha,
        fajuste: event.data.fajuste.substring(0, 10),
        xdesde: event.data.xdesde,
        xhacia: event.data.xhacia,
        mmonto: event.data.mmonto,
        cimpuesto: 13,
        cmoneda: event.data.cmoneda,
        xmoneda: event.data.xmoneda,
        cestatusgeneral: event.data.cestatusgeneral,
        ccausaanulacion: event.data.ccausaanulacion,
        bactivo: event.data.bactivo,
        delete: false
      };
    }else{
      notificacion = { 
        edit: this.editStatus,
        createServiceOrder: false,
        type: 2,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cnotificacion: event.data.cnotificacion,
        corden: event.data.corden,
        cservicioadicional: event.data.cservicioadicional,
        xservicio: event.data.xservicio,
        xservicioadicional: event.data.xservicioadicional,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        xdanos: event.data.xdanos,
        xobservacion: event.data.xobservacion,
        xfecha: event.data.xfecha,
        fajuste: event.data.fajuste.substring(0, 10),
        xdesde: event.data.xdesde,
        xhacia: event.data.xhacia,
        mmonto: event.data.mmonto,
        cimpuesto: 13,
        cmoneda: event.data.cmoneda,
        xmoneda: event.data.xmoneda,
        cestatusgeneral: event.data.cestatusgeneral,
        ccausaanulacion: event.data.ccausaanulacion,
        bactivo: event.data.bactivo,
        delete: false
      }
    }
    if(this.editStatus){
    const modalRef = this.modalService.open(NotificationServiceOrderComponent, {size: 'xl'});
    modalRef.componentInstance.notificacion = notificacion;
    modalRef.result.then((result: any) => {

      let index = this.serviceOrderList.findIndex(el=> el.corden == result.corden);
      this.serviceOrderList[index].cnotificacion = result.cnotificacion;
      this.serviceOrderList[index].corden = result.corden;
      this.serviceOrderList[index].cservicio = result.cservicio;
      this.serviceOrderList[index].cservicioadicional = result.cservicioadicional;
      this.serviceOrderList[index].xservicioadicional = result.xservicioadicional;
      this.serviceOrderList[index].cproveedor = result.cproveedor;
      this.serviceOrderList[index].xobservacion = result.xobservacion;
      this.serviceOrderList[index].xdanos = result.xdanos;
      this.serviceOrderList[index].xfecha = result.xfecha;
      this.serviceOrderList[index].fajuste = result.fajuste.substring(0, 10);
      this.serviceOrderList[index].xdesde = result.xdesde;
      this.serviceOrderList[index].xhacia = result.xhacia;
      this.serviceOrderList[index].mmonto = result.mmonto;
      this.serviceOrderList[index].cimpuesto = 13;
      this.serviceOrderList[index].cmoneda = result.cmoneda;
      this.serviceOrderList[index].cestatusgeneral = result.cestatusgeneral;
      this.serviceOrderList[index].ccausaanulacion = result.ccausaanulacion;
      this.serviceOrderList[index].bactivo = result.bactivo;
      this.serviceOrderList[index].edit = this.editStatus;
      this.serviceOrderGridApi.refreshCells();
      return;
    });
  }else{
    const modalRef = this.modalService.open(NotificationServiceOrderComponent, {size: 'xl'});
    modalRef.componentInstance.notificacion = notificacion;
  }
  }

  searchOwner(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.code
    };
    this.http.post(`${environment.apiUrl}/api/notification/notification-owner`, params, options).subscribe((response : any) => {
      if(this.code){
         this.detail_form.get('cnotificacion').setValue(response.data.list[0].cnotificacion);
         this.detail_form.get('cnotificacion').disable();
         this.detail_form.get('ccontratoflota').setValue(response.data.list[0].ccontratoflota);
         this.detail_form.get('ccontratoflota').disable();
         this.detail_form.get('xnombre').setValue(response.data.list[0].xnombre);
         this.detail_form.get('xnombre').disable();
         this.detail_form.get('xapellido').setValue(response.data.list[0].xapellido);
         this.detail_form.get('xapellido').disable();
         this.detail_form.get('xnombrealternativo').setValue(response.data.list[0].xnombrealternativo);
         this.detail_form.get('xnombrealternativo').disable();
         this.detail_form.get('xapellidoalternativo').setValue(response.data.list[0].xapellidoalternativo);
         this.detail_form.get('xapellidoalternativo').disable();
         this.detail_form.get('xcliente').setValue(response.data.list[0].xcliente);
         this.detail_form.get('xcliente').disable();
         this.detail_form.get('xtelefono').setValue(response.data.list[0].xtelefono);
         this.detail_form.get('xtelefono').disable();
         this.detail_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
         this.detail_form.get('xdescripcion').disable();
         this.detail_form.get('xnombrepropietario').setValue(response.data.list[0].xnombrepropietario);
         this.detail_form.get('xnombrepropietario').disable();
         this.detail_form.get('xapellidopropietario').setValue(response.data.list[0].xapellidopropietario);
         this.detail_form.get('xapellidopropietario').disable();
         this.detail_form.get('xplaca').setValue(response.data.list[0].xplaca);
         this.detail_form.get('xplaca').disable();
         this.detail_form.get('xcolor').setValue(response.data.list[0].xcolor);
         this.detail_form.get('xcolor').disable();
         if(response.data.list[0].fcreacion){
          let dateFormat = new Date(response.data.list[0].fcreacion);
          let dd = dateFormat.getDay();
          let mm = dateFormat.getMonth();
          let yyyy = dateFormat.getFullYear();
          this.fcreacion = dd + '-' + mm + '-' + yyyy;
          let fcreacion = this.fcreacion;
         }
         this.detail_form.get('xmodelo').setValue(response.data.list[0].xmodelo);
         this.detail_form.get('xmodelo').disable();
         this.detail_form.get('xmarca').setValue(response.data.list[0].xmarca);
         this.detail_form.get('xmarca').disable();
         this.detail_form.get('fano').setValue(response.data.list[0].fano);
         this.detail_form.get('fano').disable();
         this.detail_form.get('xcliente').setValue(response.data.list[0].xcliente);
         this.detail_form.get('xcliente').disable();
         this.detail_form.get('ctiponotificacion').setValue(response.data.list[0].ctiponotificacion);
         this.detail_form.get('ctiponotificacion').disable();
         this.detail_form.get('xtiponotificacion').setValue(response.data.list[0].xtiponotificacion);
         this.detail_form.get('xtiponotificacion').disable();
         this.detail_form.get('xserialcarroceria').setValue(response.data.list[0].xserialcarroceria);
         this.detail_form.get('xserialcarroceria').disable();
          
        this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion, xtiponotificacion: response.data.list[0].xtiponotificacion});
      }
    },  
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
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

  changeDateFormat(date) {
    let dateArray = date.split("-");
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
  }

  searchCollections(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ctiponotificacion: this.detail_form.get('ctiponotificacion').value
    };
    this.http.post(`${environment.apiUrl}/api/notification/notification-collections`, params, options).subscribe((response : any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.collectionsList.push({ crecaudo: response.data.list[i].crecaudo, xrecaudo: response.data.list[i].xrecaudo});
        }
      }
    },  
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  changeTypeNotification(){
    this.collectionsList = [];
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ctiponotificacion: this.detail_form.get('ctiponotificacion').value
    }
    this.http.post(`${environment.apiUrl}/api/notification/notification-collections`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.collectionsList.push({ crecaudo: response.data.list[i].crecaudo, xrecaudo: response.data.list[i].xrecaudo});
        }
      }
      this.searchDocumentation();
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  searchDocumentation(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      crecaudo: this.detail_form.get('crecaudo').value
    };
    this.documentationList = [];
    this.http.post(`${environment.apiUrl}/api/notification/notification-documentation`, params, options).subscribe((response : any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
         this.documentationList.push({cdocumento: response.data.list[i].cdocumento, xdocumentos: response.data.list[i].xdocumentos, ncantidad: response.data.list[i].ncantidad});
        }
      }
    },  
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  buildCollectionsBody(){
    let body = [];
    this.documentationList.forEach(function(row) {
      let dataRow = [];
      dataRow.push({text: row.ncantidad, border:[false, false, false, false]});
      dataRow.push({text: row.xdocumentos, border:[false, false, false, false]});
      body.push(dataRow);
    });
    return body;
  }

  collectionsPdf(){
    const pdfDefinition: any = {
      content: [
        {
          columns: [
            {
              style: 'header',
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
            },
          ]
        },
        {
          alignment: 'center',
          style: 'title',
          text: [
            {text: '\nSolicitud de Recaudos', bold: true}
          ]
        },
        {
          style: 'title',
          text: ' '
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, true, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              style: 'data',
              text: [
                {text: 'NOTIFICACION:   ', bold: true}, {text: `${this.code}`}
              ]
            },
            {
              alignment: 'center',
              text: [
                {text: ''}
              ]
            },
            {
              table: {
                widths: [170, '*', 190],
                body: [
                  [{text: [{text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [false, false, false, false]} ]
                ]
              },
            },
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
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'ATENCION: ', bold: true}, {text: `${this.detail_form.get('xcliente').value}`},

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
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          style: 'data',
          columns: [
            {
              text: [
                {text: 'Sirva la presente para solicitarle la entrega hasta la fecha tope indicada de los siguientes recaudos, con el objeto de tramitar su notificación concerniente a: '}, {text: `${this.detail_form.get('xtiponotificacion').value}`, bold: true}
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
              style: 'data',
              text: [
                {text: 'VEHÍCULO: ', bold: true}, {text: `${this.detail_form.get('xmarca').value} ${this.detail_form.get('xmodelo').value}`}, {text: ',  Año ', bold: true}, {text: this.detail_form.get('fano').value}, {text: ',  Placa nro.: ', bold: true}, {text: `${this.detail_form.get('xplaca').value}`}, {text: ',  Serial Carr.: ', bold: true}, {text: `${this.detail_form.get('xserialcarroceria').value}`}
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
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, true]}]
            ]
          }
        },
        {
          columns: [
            {
              alignment: 'left',
              width: 60,
              style: 'data',
              text: [
                {text: 'CANTIDAD     ', bold: true}
              ]
            },
            {
              alignment: 'left',
              width: 350,
              style: 'data',
              text: [
                {text: 'RECAUDOS    ', bold: true}
              ]
            },
            {
              alignment: 'right',
              width: 50,
              style: 'data',
              text: [
                {text: '     ', bold: true}
              ]
            }
          ]
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, true, false, false]}]
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
          style: 'data',
          table: {
            widths: [50, 350, 70],
            body: this.buildCollectionsBody()
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
              style: 'data',
              text: [
                {text: 'Sin más a que hacer referencia, me despido'}
              ]
            }
          ]
        },
       /* {
          columns: [
            {
              style: 'data',
              text: [
                {text: 'ENTREGAR EL AJUSTE ANTES DE: '}, {text: [{text: this.changeDateFormat(this.detail_form.get('fajuste').value)}], border:[false, false, true, true]}
              ]
            }
          ]
        },*/
      ],
      styles: {
        data: {
          fontSize: 10
        },
        title: {
          fontSize: 15,
          bold: true,
          alignment: 'center'
        },
        color1: {
          color: '#1D4C01'
        },
        color2: {
          color: '#7F0303'
        },
      }
    }
    pdfMake.createPdf(pdfDefinition).open();

    //pdfMake.createPdf(pdfDefinition).download('file.pdf', function() { alert('your pdf is done'); });
  }
}
