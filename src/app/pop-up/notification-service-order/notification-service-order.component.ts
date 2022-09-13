import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { color } from 'html2canvas/dist/types/css/types/color';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-notification-service-order',
  templateUrl: './notification-service-order.component.html',
  styleUrls: ['./notification-service-order.component.css']
})
export class NotificationServiceOrderComponent implements OnInit {

  private replacementGridApi;
  private emailGridApi;
  @Input() public notificacion;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  providerList: any[] = [];
  replacementList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canEditServiceOrder: boolean = false;
  canDelete: boolean = false;
  corden: number;
  variablex: number;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  showEditButtonServiceOrder: boolean = false;
  serviceOrder: any[] = [];
  notificationList: any[] = [];
  serviceList: any[] = [];
  orderList: any[] = [];
  taxList: any[] = [];
  aditionalServiceList: any[] = [];
  changeServiceList: any[] = [];
  purchaseOrder;
  coinList: any[] = [];
  code;
  danos;
  emailList: any[] = [];
  statusList: any[] = [];
  cancellationList: any[] = [];
  alert = { show : false, type : "", message : "" }
  replacementDeletedRowList

    constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cnotificacion: [''],
      corden: [''],
      cservicio: [''],
      cservicioadicional: [''],
      cproveedor: [''],
      xproveedor: [''],
      ccontratoflota: [''],
      xtiposervicio: [''],
      xservicio: [''],
      xservicioadicional: [''],
      xnombre: [''],
      xapellido: [''],
      xnombrealternativo: [''],
      xapellidoalternativo: [''],
      xobservacion: ['', Validators.required],
      fcreacion: [''],
      xdescripcion: [''],
      xdanos: ['', Validators.required],
      xfecha: ['', Validators.required],
      xnombrepropietario: [''],
      xapellidopropietario: [''],
      xdocidentidad: [''],
      xtelefonocelular: [''],
      xplaca:[''],
      xcolor: [''],
      xmodelo: [''],
      xmarca: [''],
      fajuste: ['', Validators.required],
      xcliente: [''],
      fano: [''],
      xdireccionproveedor: [''],
      xnombreproveedor: [''],
      xdocumentocliente: [''],
      xdireccionfiscal: [''],
      xtelefono: [''],
      xtelefonoproveedor:[''],
      xdocumentoproveedor: [''],
      xdesde: [''],
      xhacia: [''],
      mmonto: [''],
      cimpuesto: [''],
      pimpuesto:[''],
      mmontototal: [''],
      mmontototaliva: [''],
      cmoneda: [''],
      xmoneda: [''],
      bactivo: [true],
      xactivo: [''],
      ccotizacion: [''],
      crepuesto: [''],
      xrepuesto: [''],
      ncantidad: [''],
      mtotalcotizacion: [''],
      munitariorepuesto: [''],
      mmontoiva: [''],
      mtotal: [''],
      repuestos: [' '],
      cestatusgeneral: [''],
      xestatusgeneral: [''],
      ccausaanulacion: [''],
      xcausaanulacion: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 95
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
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    if(this.notificacion.edit){
      this.canSave = true;
      this.editServiceOrder();
      this.repuestos();
      this.getStatus();
    }

    if(!this.notificacion.edit && !this.notificacion.createServiceOrder ){
      this.editServiceOrder();
      this.repuestos();
      this.getStatus();
      if(this.notificacion.cnotificacion){
        this.searchQuote();
      }
    }

    if(this.notificacion.createServiceOrder){
      this.canSave = true;
      this.createServiceOrder();
      this.repuestos();
      this.getStatus();
      this.popup_form.get('cestatusgeneral').setValue(52);
      this.popup_form.get('cestatusgeneral').disable();
      this.popup_form.get('ccausaanulacion').setValue('');
      this.popup_form.get('ccausaanulacion').disable();
      if(this.notificacion.cnotificacion){
        this.searchQuote();
      }
    }
  }

  createServiceOrder(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion,
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais
    };
    this.http.post(`${environment.apiUrl}/api/service-order/notification-order`, params, options).subscribe((response : any) => {
      this.serviceList = [];
      this.aditionalServiceList = [];
      if(this.notificacion.cnotificacion){
        //let cnotificacion = this.code;
          if (this.notificacion.cnotificacion == response.data.list[0].cnotificacion){
            this.popup_form.get('cnotificacion').setValue(response.data.list[0].cnotificacion);
            this.popup_form.get('cnotificacion').disable();
            this.popup_form.get('ccontratoflota').setValue(response.data.list[0].ccontratoflota);
            this.popup_form.get('ccontratoflota').disable();
            this.popup_form.get('xnombre').setValue(response.data.list[0].xnombre);
            this.popup_form.get('xnombre').disable();
            this.popup_form.get('xapellido').setValue(response.data.list[0].xapellido);
            this.popup_form.get('xapellido').disable();
            this.popup_form.get('xnombrealternativo').setValue(response.data.list[0].xnombrealternativo);
            this.popup_form.get('xnombrealternativo').disable();
            this.popup_form.get('xapellidoalternativo').setValue(response.data.list[0].xapellidoalternativo);
            this.popup_form.get('xapellidoalternativo').disable();
            this.popup_form.get('xcliente').setValue(response.data.list[0].xcliente);
            this.popup_form.get('xcliente').disable();
            this.popup_form.get('xdocumentocliente').setValue(response.data.list[0].xdocumentocliente);
            this.popup_form.get('xdocumentocliente').disable();
            this.popup_form.get('xdireccionfiscal').setValue(response.data.list[0].xdireccionfiscal);
            this.popup_form.get('xdireccionfiscal').disable();
            this.popup_form.get('xtelefono').setValue(response.data.list[0].xtelefono);
            this.popup_form.get('xtelefono').disable();
            this.popup_form.get('xdesde').disable();
            this.popup_form.get('xhacia').disable();
            this.popup_form.get('mmonto').disable();
            this.popup_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
            this.popup_form.get('xdescripcion').disable();
            this.popup_form.get('xnombrepropietario').setValue(response.data.list[0].xnombrepropietario);
            this.popup_form.get('xnombrepropietario').disable();
            this.popup_form.get('mmontototal').disable();
            this.popup_form.get('pimpuesto').disable();
            this.popup_form.get('xapellidopropietario').setValue(response.data.list[0].xapellidopropietario);
            this.popup_form.get('xapellidopropietario').disable();
            this.popup_form.get('xdocidentidad').setValue(response.data.list[0].xdocidentidad);
            this.popup_form.get('xdocidentidad').disable();
            this.popup_form.get('xtelefonocelular').setValue(response.data.list[0].xtelefonocelular);
            this.popup_form.get('xtelefonocelular').disable();
            this.popup_form.get('cservicio').setValue(response.data.list[0].cservicio);
            this.popup_form.get('cservicio').enable();
            this.popup_form.get('xplaca').setValue(response.data.list[0].xplaca);
            this.popup_form.get('xplaca').disable();
            this.popup_form.get('xcolor').setValue(response.data.list[0].xcolor);
            this.popup_form.get('xcolor').disable();
            this.popup_form.get('xmoneda').disable();
            this.popup_form.get('cmoneda').disable();
            this.popup_form.get('xmodelo').setValue(response.data.list[0].xmodelo);
            this.popup_form.get('xmodelo').disable();
            this.popup_form.get('xmarca').setValue(response.data.list[0].xmarca);
            this.popup_form.get('xmarca').disable();
            this.popup_form.get('fano').setValue(response.data.list[0].fano);
            this.popup_form.get('fano').disable();
            this.popup_form.get('fcreacion').setValue(response.data.list[0].fcreacion);
            this.popup_form.get('fcreacion').disable();
            this.popup_form.get('bactivo').setValue(response.data.list[0].bactivo);
            this.popup_form.get('bactivo').disable();
            this.popup_form.get('xactivo').disable();
          }
          this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion });
      }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.popup_form.get('cnotificacion').value,
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais
    }
    this.http.post(`${environment.apiUrl}/api/valrep/notification-services`, params, options).subscribe((response: any) => {
      this.serviceList = [];
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.serviceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio, ccontratoflota: response.data.list[i].ccontratoflota, ccarga: response.data.list[i].ccarga});
        }
        //this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
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
    this.http.post(`${environment.apiUrl}/api/valrep/aditional-service`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.aditionalServiceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio});
        }
        this.aditionalServiceList.sort((a,b) => a.value > b.value ? 1 : -1);
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

    this.http.post(`${environment.apiUrl}/api/valrep/service-order-providers`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ proveedor: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor, xdireccionproveedor: response.data.list[i].xdireccionproveedor, telefono: response.data.list[i].xtelefonoproveedor});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    this.searchCoin();

    if(this.notificacion.cnotificacion){
      if(!this.canDetail){
        this.router.navigate([`/permission-error`]);
        return;
      }
      if(this.canEdit){ this.showEditButton = true; }
    }else{
      if(!this.canCreate){
        this.router.navigate([`/permission-error`]);
        return;
      }
      this.notificacion.createServiceOrder = true;
    }
  },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONNOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

  }


  searchQuote(){
    //Buscar cotizacion para obtener el código y elaborar el reporte

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion,
    }
    this.http.post(`${environment.apiUrl}/api/quote-request/search-quote`, params, options).subscribe((response: any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.popup_form.get('ccotizacion').setValue(response.data.list[i].ccotizacion);
          this.popup_form.get('ccotizacion').disable();
        }
      }
      if(this.popup_form.get('ccotizacion').value) {
        this.listRepairOrder();
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron Daños"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
    });
  }

  editServiceOrder(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion,
      corden: this.notificacion.corden,
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais
    };
    if(this.notificacion.edit){
    this.http.post(`${environment.apiUrl}/api/service-order/notification-service-order`, params, options).subscribe((response : any) => {
      this.serviceList = [];
      this.aditionalServiceList = [];
      if(this.notificacion.cnotificacion){
        //let cnotificacion = this.code;
          if (this.notificacion.cnotificacion == response.data.list[0].cnotificacion){
            this.popup_form.get('corden').setValue(response.data.list[0].corden);
            this.popup_form.get('corden').disable();
            this.popup_form.get('cnotificacion').setValue(response.data.list[0].cnotificacion);
            this.popup_form.get('cnotificacion').disable();
            this.popup_form.get('ccontratoflota').setValue(response.data.list[0].ccontratoflota);
            this.popup_form.get('ccontratoflota').disable();
            this.popup_form.get('xnombre').setValue(response.data.list[0].xnombre);
            this.popup_form.get('xnombre').disable();
            this.popup_form.get('xtelefonoproveedor').setValue(response.data.list[0].xtelefonoproveedor);
            this.popup_form.get('xtelefonoproveedor').disable();
            this.popup_form.get('xapellido').setValue(response.data.list[0].xapellido);
            this.popup_form.get('xapellido').disable();
            this.popup_form.get('xnombrealternativo').setValue(response.data.list[0].xnombrealternativo);
            this.popup_form.get('xnombrealternativo').disable();
            this.popup_form.get('xapellidoalternativo').setValue(response.data.list[0].xapellidoalternativo);
            this.popup_form.get('xapellidoalternativo').disable();
            this.popup_form.get('xcliente').setValue(response.data.list[0].xcliente);
            this.popup_form.get('xcliente').disable();
            this.popup_form.get('xdesde').setValue(response.data.list[0].xdesde);
            this.popup_form.get('xdesde').disable();
            this.popup_form.get('xhacia').setValue(response.data.list[0].xhacia);
            this.popup_form.get('xhacia').disable();
            this.popup_form.get('mmonto').setValue(response.data.list[0].mmonto);
            this.popup_form.get('mmonto').disable();
            this.popup_form.get('xdocumentocliente').setValue(response.data.list[0].xdocumentocliente);
            this.popup_form.get('xdocumentocliente').disable();
            this.popup_form.get('xdireccionfiscal').setValue(response.data.list[0].xdireccionfiscal);
            this.popup_form.get('xdireccionfiscal').disable();
            this.popup_form.get('xtelefono').setValue(response.data.list[0].xtelefono);
            this.popup_form.get('xtelefono').disable();
            this.popup_form.get('mmontototal').setValue(response.data.list[0].mmontototal);
            this.popup_form.get('mmontototal').disable();
            this.popup_form.get('mmontototaliva').setValue(response.data.list[0].mmontototaliva);
            this.popup_form.get('mmontototaliva').disable();
            this.popup_form.get('pimpuesto').setValue(response.data.list[0].pimpuesto);
            this.popup_form.get('pimpuesto').disable();
            this.popup_form.get('xobservacion').setValue(response.data.list[0].xobservacion);
            this.popup_form.get('xobservacion').disable();
            this.popup_form.get('xdanos').setValue(response.data.list[0].xdanos);
            this.popup_form.get('xdanos').disable();
            this.popup_form.get('cmoneda').setValue(response.data.list[0].cmoneda);
            this.popup_form.get('cmoneda').disable();
            this.popup_form.get('xmoneda').setValue(response.data.list[0].xmoneda);
            this.popup_form.get('xmoneda').disable();
            this.popup_form.get('bactivo').setValue(response.data.list[0].bactivo);
            this.popup_form.get('bactivo').disable();
            this.popup_form.get('xactivo').disable();
            this.popup_form.get('xfecha').setValue(response.data.list[0].xfecha);
            this.popup_form.get('xfecha').disable();
            if(response.data.list[0].fajuste){
              let dateFormat = new Date(response.data.list[0].fajuste).toISOString().substring(0, 10);
              this.popup_form.get('fajuste').setValue(dateFormat);
              this.popup_form.get('fajuste').disable();
            }
            this.popup_form.get('cservicio').setValue(response.data.list[0].cservicio);
            this.popup_form.get('cservicio').disable();
            if(response.data.list[0].cservicio){
              this.popup_form.get('cservicio').setValue(response.data.list[0].cservicio);
              this.popup_form.get('cservicio').disable();
              this.popup_form.get('xservicio').setValue(response.data.list[0].xservicio);
              this.popup_form.get('xservicio').disable();
            } else { this.popup_form.get('cservicio').disable(); }
            if(response.data.list[0].cservicio == 228){
              this.popup_form.get('xdesde').setValue(response.data.list[0].xdesde);
              this.popup_form.get('xdesde').enable();
              this.popup_form.get('xhacia').setValue(response.data.list[0].xhacia);
              this.popup_form.get('xhacia').enable();
              this.popup_form.get('mmonto').setValue(response.data.list[0].mmonto);
              this.popup_form.get('mmonto').enable();
            }else{
              this.popup_form.get('xdesde').setValue(response.data.list[0].xdesde);
              this.popup_form.get('xdesde').disable();
              this.popup_form.get('xhacia').setValue(response.data.list[0].xhacia);
              this.popup_form.get('xhacia').disable();
              this.popup_form.get('mmonto').setValue(response.data.list[0].mmonto);
              this.popup_form.get('mmonto').disable();
            }
            if(response.data.list[0].cservicioadicional) {
              this.popup_form.get('cservicioadicional').setValue(response.data.list[0].cservicioadicional);
              this.popup_form.get('cservicioadicional').disable();
              this.popup_form.get('xservicioadicional').setValue(response.data.list[0].xservicioadicional);
              this.popup_form.get('xservicioadicional').disable();
            } else { this.popup_form.get('cservicioadicional').disable(); }
            if(response.data.list[0].cservicioadicional == 228){
              this.popup_form.get('cservicioadicional').setValue(response.data.list[0].cservicioadicional);
              this.popup_form.get('cservicioadicional').disable();
              this.popup_form.get('xservicioadicional').setValue(response.data.list[0].xservicioadicional);
              this.popup_form.get('xservicioadicional').disable();
            }
            this.popup_form.get('cproveedor').setValue(response.data.list[0].cproveedor);
            this.popup_form.get('cproveedor').disable();
            this.popup_form.get('xproveedor').setValue(response.data.list[0].xproveedor);
            this.popup_form.get('xproveedor').disable();
            this.popup_form.get('xdireccionproveedor').setValue(response.data.list[0].xdireccionproveedor);
            this.popup_form.get('xdireccionproveedor').disable();
            this.popup_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
            this.popup_form.get('xdescripcion').disable();
            this.popup_form.get('xnombrepropietario').setValue(response.data.list[0].xnombrepropietario);
            this.popup_form.get('xnombrepropietario').disable();
            this.popup_form.get('xapellidopropietario').setValue(response.data.list[0].xapellidopropietario);
            this.popup_form.get('xapellidopropietario').disable();
            this.popup_form.get('xdocidentidad').setValue(response.data.list[0].xdocidentidad);
            this.popup_form.get('xdocidentidad').disable();
            this.popup_form.get('xtelefonocelular').setValue(response.data.list[0].xtelefonocelular);
            this.popup_form.get('xtelefonocelular').disable();
            this.popup_form.get('xplaca').setValue(response.data.list[0].xplaca);
            this.popup_form.get('xplaca').disable();
            this.popup_form.get('xcolor').setValue(response.data.list[0].xcolor);
            this.popup_form.get('xcolor').disable();
            this.popup_form.get('xdocumentoproveedor').setValue(response.data.list[0].xdocumentoproveedor);
            this.popup_form.get('xdocumentoproveedor').disable();
            this.popup_form.get('xmodelo').setValue(response.data.list[0].xmodelo);
            this.popup_form.get('xmodelo').disable();
            this.popup_form.get('xmarca').setValue(response.data.list[0].xmarca);
            this.popup_form.get('xmarca').disable();
            this.popup_form.get('fano').setValue(response.data.list[0].fano);
            this.popup_form.get('fano').disable();
            this.popup_form.get('fcreacion').setValue(response.data.list[0].fcreacion);
            this.popup_form.get('fcreacion').disable(); 
            this.popup_form.get('cestatusgeneral').setValue(response.data.list[0].cestatusgeneral);
            this.popup_form.get('xestatusgeneral').setValue(response.data.list[0].xestatusgeneral);
            this.changeCancellationCause();
            //this.cancellationList.push({ id: response.data.list[0].ccausaanulacion, value: response.data.list[0].xcausaanulacion})
            this.popup_form.get('ccausaanulacion').setValue(response.data.list[0].ccausaanulacion);
            this.popup_form.get('xcausaanulacion').setValue(response.data.list[0].xcausaanulacion);
          }
          this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion, cservicio: response.data.list[0].cservicio, corden: response.data.list[0].corden, cproveedor: response.data.list[0].cproveedor, xdireccionproveedor: response.data.list[0].xdireccionproveedor, cservicioadicional: response.data.list[0].cservicioadicional, xservicioadicional: response.data.list[0].xservicioadicional });
      }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.popup_form.get('cnotificacion').value,
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/notification-services`, params, options).subscribe((response: any) => {
      this.serviceList = [];
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.serviceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio, ccontratoflota: response.data.list[i].ccontratoflota, ccarga: response.data.list[i].ccarga});
        }
        //this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
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
    this.http.post(`${environment.apiUrl}/api/valrep/aditional-service`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.aditionalServiceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio});
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

    this.http.post(`${environment.apiUrl}/api/valrep/service-order-providers`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ proveedor: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor, xdireccionproveedor: response.data.list[i].xdireccionproveedor, telefono: response.data.list[i].xtelefonoproveedor});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    this.searchCoin();
    this.showEditButtonServiceOrder = true;
    this.canEditServiceOrder = true
    if(this.notificacion.cnotificacion){
      if(!this.canDetail){
        this.router.navigate([`/permission-error`]);
        return;
      }
      this.editar();
      // this.sendEmail();
      if(this.notificacion.edit){ this.notificacion.edit = true; }
    }else{
      if(!this.canCreate){
        this.router.navigate([`/permission-error`]);
        return;
      }
      this.showEditButtonServiceOrder = true;
      this.showSaveButton = true;
      this.canEditServiceOrder = true
    }
  },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONNOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }else{
    this.http.post(`${environment.apiUrl}/api/service-order/notification-service-order`, params, options).subscribe((response : any) => {
      this.serviceList = [];
      this.aditionalServiceList = [];
      if(this.notificacion.cnotificacion){
        //let cnotificacion = this.code;
          if (this.notificacion.cnotificacion == response.data.list[0].cnotificacion){
            this.popup_form.get('corden').setValue(response.data.list[0].corden);
            this.popup_form.get('corden').disable();
            this.popup_form.get('cnotificacion').setValue(response.data.list[0].cnotificacion);
            this.popup_form.get('cnotificacion').disable();
            this.popup_form.get('ccontratoflota').setValue(response.data.list[0].ccontratoflota);
            this.popup_form.get('ccontratoflota').disable();
            this.popup_form.get('xnombre').setValue(response.data.list[0].xnombre);
            this.popup_form.get('xnombre').disable();
            this.popup_form.get('xapellido').setValue(response.data.list[0].xapellido);
            this.popup_form.get('xapellido').disable();
            this.popup_form.get('xnombrealternativo').setValue(response.data.list[0].xnombrealternativo);
            this.popup_form.get('xnombrealternativo').disable();
            this.popup_form.get('xapellidoalternativo').setValue(response.data.list[0].xapellidoalternativo);
            this.popup_form.get('xapellidoalternativo').disable();
            this.popup_form.get('xcliente').setValue(response.data.list[0].xcliente);
            this.popup_form.get('xcliente').disable();
            this.popup_form.get('xdesde').setValue(response.data.list[0].xdesde);
            this.popup_form.get('xdesde').disable();
            this.popup_form.get('xhacia').setValue(response.data.list[0].xhacia);
            this.popup_form.get('xhacia').disable();
            this.popup_form.get('mmonto').setValue(response.data.list[0].mmonto);
            this.popup_form.get('mmonto').disable();
            this.popup_form.get('xdocumentocliente').setValue(response.data.list[0].xdocumentocliente);
            this.popup_form.get('xdocumentocliente').disable();
            this.popup_form.get('xdireccionfiscal').setValue(response.data.list[0].xdireccionfiscal);
            this.popup_form.get('xdireccionfiscal').disable();
            this.popup_form.get('xtelefono').setValue(response.data.list[0].xtelefono);
            this.popup_form.get('xtelefono').disable();
            this.popup_form.get('xdocumentoproveedor').setValue(response.data.list[0].xdocumentoproveedor);
            this.popup_form.get('xdocumentoproveedor').disable();
            this.popup_form.get('xobservacion').setValue(response.data.list[0].xobservacion);
            this.popup_form.get('xobservacion').disable();
            this.popup_form.get('xdanos').setValue(response.data.list[0].xdanos);
            this.popup_form.get('xdanos').disable();
            this.popup_form.get('mmontototal').setValue(response.data.list[0].mmontototal);
            this.popup_form.get('mmontototal').disable();
            this.popup_form.get('mmontototaliva').setValue(response.data.list[0].mmontototaliva);
            this.popup_form.get('mmontototaliva').disable();
            this.popup_form.get('cmoneda').setValue(response.data.list[0].cmoneda);
            this.popup_form.get('cmoneda').disable();
            this.popup_form.get('xmoneda').setValue(response.data.list[0].xmoneda);
            this.popup_form.get('xmoneda').disable();
            this.popup_form.get('pimpuesto').setValue(response.data.list[0].pimpuesto);
            this.popup_form.get('pimpuesto').disable();
            this.popup_form.get('bactivo').setValue(response.data.list[0].bactivo);
            this.popup_form.get('bactivo').disable();
            this.popup_form.get('xactivo').disable();
            this.popup_form.get('xfecha').setValue(response.data.list[0].xfecha);
            this.popup_form.get('xfecha').disable();
            if(response.data.list[0].fajuste){
              let dateFormat = new Date(response.data.list[0].fajuste).toISOString().substring(0, 10);
              this.popup_form.get('fajuste').setValue(dateFormat);
              this.popup_form.get('fajuste').disable();
            }
            this.popup_form.get('cservicio').setValue(response.data.list[0].cservicio);
            this.popup_form.get('cservicio').disable();
            this.popup_form.get('xservicio').setValue(response.data.list[0].xservicio);
            this.popup_form.get('xservicio').disable();
            this.popup_form.get('cservicioadicional').setValue(response.data.list[0].cservicioadicional);
            this.popup_form.get('cservicioadicional').disable();
            this.popup_form.get('xservicioadicional').setValue(response.data.list[0].xservicioadicional);
            this.popup_form.get('xservicioadicional').disable();
            if(response.data.list[0].cservicioadicional == 224){
              this.popup_form.get('cservicioadicional').setValue(response.data.list[0].cservicioadicional);
              this.popup_form.get('cservicioadicional').disable();
              this.popup_form.get('xservicioadicional').setValue(response.data.list[0].xservicioadicional);
              this.popup_form.get('xservicioadicional').disable();
            }
            this.popup_form.get('cproveedor').setValue(response.data.list[0].cproveedor);
            this.popup_form.get('cproveedor').disable();
            this.popup_form.get('xtelefonoproveedor').setValue(response.data.list[0].xtelefonoproveedor);
            this.popup_form.get('xtelefonoproveedor').disable();
            this.popup_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
            this.popup_form.get('xdescripcion').disable();
            this.popup_form.get('xnombrepropietario').setValue(response.data.list[0].xnombrepropietario);
            this.popup_form.get('xnombrepropietario').disable();
            this.popup_form.get('xapellidopropietario').setValue(response.data.list[0].xapellidopropietario);
            this.popup_form.get('xapellidopropietario').disable();
            this.popup_form.get('xdocidentidad').setValue(response.data.list[0].xdocidentidad);
            this.popup_form.get('xdocidentidad').disable();
            this.popup_form.get('xtelefonocelular').setValue(response.data.list[0].xtelefonocelular);
            this.popup_form.get('xtelefonocelular').disable();
            this.popup_form.get('xplaca').setValue(response.data.list[0].xplaca);
            this.popup_form.get('xplaca').disable();
            this.popup_form.get('xcolor').setValue(response.data.list[0].xcolor);
            this.popup_form.get('xcolor').disable();
            this.popup_form.get('xmodelo').setValue(response.data.list[0].xmodelo);
            this.popup_form.get('xmodelo').disable();
            this.popup_form.get('xmarca').setValue(response.data.list[0].xmarca);
            this.popup_form.get('xmarca').disable();
            this.popup_form.get('fano').setValue(response.data.list[0].fano);
            this.popup_form.get('fano').disable();
            if (response.data.list[0].fcreacion) {
              let dateFormat = new Date(response.data.list[0].fcreacion);
              let dd = dateFormat.getDay();
              let mm = dateFormat.getMonth();
              let yyyy = dateFormat.getFullYear();
              response.data.list[0].fcreacion = dd + '-' + mm + '-' + yyyy;
              this.popup_form.get('fcreacion').setValue(response.data.list[0].fcreacion);
              this.popup_form.get('fcreacion').disable();
            } else {
              this.popup_form.get('fcreacion').setValue('');
              this.popup_form.get('fcreacion').disable();
            }
            this.popup_form.get('xdireccionproveedor').setValue(response.data.list[0].xdireccionproveedor);
            this.popup_form.get('xdireccionproveedor').disable();
            this.popup_form.get('xnombreproveedor').setValue(response.data.list[0].xnombreproveedor);
            this.popup_form.get('xnombreproveedor').disable();
            this.popup_form.get('cestatusgeneral').setValue(response.data.list[0].cestatusgeneral);
            this.popup_form.get('cestatusgeneral').disable()
            this.popup_form.get('xestatusgeneral').setValue(response.data.list[0].xestatusgeneral);
            this.popup_form.get('xestatusgeneral').disable()
            this.cancellationList.push({ id: response.data.list[0].ccausaanulacion, value: response.data.list[0].xcausaanulacion})
            this.popup_form.get('ccausaanulacion').setValue(response.data.list[0].ccausaanulacion);
            this.popup_form.get('ccausaanulacion').disable()
            this.popup_form.get('xcausaanulacion').setValue(response.data.list[0].xcausaanulacion);
            this.popup_form.get('xcausaanulacion').disable()
          }
          this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion, cservicio: response.data.list[0].cservicio, corden: response.data.list[0].corden, cproveedor: response.data.list[0].cproveedor, xdireccionproveedor: response.data.list[0].xdireccionproveedor, xnombreproveedor: response.data.list[0].xnombreproveedor, cservicioadicional: response.data.list[0].cservicioadicional, xservicioadicional: response.data.list[0].xservicioadicional });
      }
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cnotificacion: this.popup_form.get('cnotificacion').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/notification-services`, params, options).subscribe((response: any) => {
        this.serviceList = [];
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.serviceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio, ccontratoflota: response.data.list[i].ccontratoflota, ccarga: response.data.list[i].ccarga});
          }
          //this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
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
      this.http.post(`${environment.apiUrl}/api/valrep/aditional-service`, params, options).subscribe((response: any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.aditionalServiceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio});
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
  
      this.http.post(`${environment.apiUrl}/api/valrep/service-order-providers`, params, options).subscribe((response: any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.providerList.push({ proveedor: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor, xdireccionproveedor: response.data.list[i].xdireccionproveedor, telefono: response.data.list[i].xtelefonoproveedor});
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
        //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });

      this.searchCoin();
      this.showEditButtonServiceOrder = true;
      this.canEditServiceOrder = true
      if(this.notificacion.cnotificacion){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        if(this.canEditServiceOrder){ this.showEditButtonServiceOrder = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.showEditButtonServiceOrder = true;
        this.canEditServiceOrder = true
      }
    },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONNOTFOUND"; }
        //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
  }
  }

  searchCoin(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais
    };
    this.http.post(`${environment.apiUrl}/api/valrep/coin`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.coinList.push({ id: response.data.list[i].cmoneda, value: response.data.list[i].xmoneda });
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.COINNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editar(){
    this.popup_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }

    let notificacionFilter = this.notificationList.filter((option) => { return option.id == this.popup_form.get('cnotificacion').value; });
    let serviceFilter = this.serviceList.filter((option) => { return option.servicio == this.popup_form.get('cservicio').value ; });
    let aditionalServiceFilter = this.aditionalServiceList.filter((option) => { return option.servicio == this.popup_form.get('cservicioadicional').value; });
    let providerFilter = this.providerList.filter((option) => { return option.proveedor == this.popup_form.get('cproveedor').value; });
    let coinFilter = this.coinList.filter((option) => { return option.id == this.popup_form.get('cmoneda').value; });
    let statusFilter = this.statusList.filter((option) => { return option.id == this.popup_form.get('cestatusgeneral').value; });
    let cancellationFilter = this.cancellationList.filter((option) => { return option.id == this.popup_form.get('ccausaanulacion').value; });

    if(this.popup_form.get('cservicio').value){
      this.notificacion.cservicio = this.popup_form.get('cservicio').value ? this.popup_form.get('cservicio').value: undefined;
      this.notificacion.xservicio = serviceFilter[0].value ? serviceFilter[0].value: undefined;
    }else{
      this.notificacion.cservicioadicional = this.popup_form.get('cservicioadicional').value;
      this.notificacion.xservicio = aditionalServiceFilter[0].value ? aditionalServiceFilter[0].value: undefined;
    }
    
    if(this.notificacion.cmoneda){
      this.notificacion.cmoneda = this.popup_form.get('cmoneda').value;
      this.notificacion.xmoneda = this.popup_form.get('xmoneda').value;
    }else{
      this.notificacion.cmoneda = 0;
      this.notificacion.xmoneda = 'Sin Moneda';
    }

    this.notificacion.xdesde = this.popup_form.get('xdesde').value;
    this.notificacion.xhacia = this.popup_form.get('xhacia').value;
    this.notificacion.mmonto = this.popup_form.get('mmonto').value;
    this.notificacion.xobservacion = this.popup_form.get('xobservacion').value;
    this.notificacion.xfecha = this.popup_form.get('xfecha').value;
    this.notificacion.xdanos = this.danos;
    this.notificacion.fajuste = this.popup_form.get('fajuste').value.substring(0, 10);
    this.notificacion.cproveedor = this.popup_form.get('cproveedor').value;
    this.notificacion.bactivo = this.popup_form.get('bactivo').value;
    this.notificacion.cestatusgeneral = this.popup_form.get('cestatusgeneral').value;

    if(this.popup_form.get('ccausaanulacion').value){
      this.notificacion.ccausaanulacion = this.popup_form.get('ccausaanulacion').value;
    }else{
      this.notificacion.ccausaanulacion = 0;
    }

    this.activeModal.close(this.notificacion);
  }

  changeAditionalService(){

    if(this.popup_form.get('cservicioadicional').value != 224){
      this.popup_form.get('xdesde').disable();
      this.popup_form.get('xhacia').disable();
      this.popup_form.get('mmonto').disable();
      this.popup_form.get('cmoneda').disable();
      this.popup_form.get('xmoneda').disable();
    }else{
      this.popup_form.get('xdesde').enable();
      this.popup_form.get('xhacia').enable();
      this.popup_form.get('mmonto').enable();
      this.popup_form.get('cmoneda').enable();
      this.popup_form.get('xmoneda').disable();
    }
    if(this.popup_form.get('cservicioadicional').value){
      this.popup_form.get('xservicio').value == this.popup_form.get('xservicioadicional').value;
    }
    this.popup_form.get('cservicio').setValue('');
    this.providerList = [];
    this.popup_form.get('cproveedor').setValue('');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cservicio: this.popup_form.get('cservicioadicional').value
    }
    this.http.post(`${environment.apiUrl}/api/valrep/service-providers`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ proveedor: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor, direccion: response.data.list[i].xdireccionproveedor, telefono: response.data.list[i].xtelefonoproveedor});
        }
        //this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
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

  changeService(){
    if(this.popup_form.get('cservicio').value != 228){
      this.popup_form.get('xdesde').disable();
      this.popup_form.get('xhacia').disable();
      this.popup_form.get('mmonto').disable();
      this.popup_form.get('cmoneda').disable();
      this.popup_form.get('xmoneda').disable();
    }else{
      this.popup_form.get('xdesde').enable();
      this.popup_form.get('xhacia').enable();
      this.popup_form.get('mmonto').enable();
      this.popup_form.get('cmoneda').enable();
      this.popup_form.get('xmoneda').disable();
    }
    if(this.popup_form.get('cservicioadicional').value){
      this.popup_form.get('xservicio').value == this.popup_form.get('xservicioadicional').value;
    }
    this.popup_form.get('cservicioadicional').setValue('');
    this.providerList = [];
    this.popup_form.get('cproveedor').setValue('');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cservicio: this.popup_form.get('cservicio').value
    }
    this.http.post(`${environment.apiUrl}/api/valrep/service-providers`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ proveedor: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor, direccion: response.data.list[i].xdireccionproveedor, telefono: response.data.list[i].xtelefonoproveedor});
        }
        //this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
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

  getServiceOrderService(){
    if (this.popup_form.get('cservicio').value){
      return this.popup_form.get('xservicio').value;
    }
    if(this.popup_form.get('cservicioadicional').value){
      return this.popup_form.get('xservicioadicional').value;
    }
  }

  listPurchaseOrder(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion,
      baceptacion: 1,
      ccotizacion: this.popup_form.get('ccotizacion').value
    };
    this.http.post(`${environment.apiUrl}/api/quote-request/detail-list`, params, options).subscribe((response : any) => {
      this.purchaseOrder = {}
      if(response.data.status){
        let replacementsList = [];
          for(let i = 0; i < response.data.replacements.length; i++){
            let replacement = {};
            replacement = {
              crepuesto: response.data.replacements[i].crepuesto,
              xrepuesto: response.data.replacements[i].xrepuesto,
              ncantidad: response.data.replacements[i].ncantidad,
              munitariorepuesto: response.data.replacements[i].munitariorepuesto,
              cmoneda: response.data.replacements[i].cmoneda,
              xmoneda: response.data.replacements[i].xmoneda
            }
            replacementsList.push(replacement);
          }
          this.purchaseOrder = {
            ccotizacion: response.data.ccotizacion,
            xobservacion: response.data.xobservacion,
            mtotalcotizacion: response.data.mtotalcotizacion,
            mmontoiva: response.data.mmontoiva,
            mtotal: response.data.mtotal,
            cmoneda: response.data.cmoneda,
            xmoneda: response.data.xmoneda,
            replacements: replacementsList
          }
          this.popup_form.get('mmontoiva').setValue(response.data.mmontoiva);
          this.popup_form.get('mtotal').setValue(response.data.mtotal);
          this.popup_form.get('xmoneda').setValue(response.data.xmoneda);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.COINNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  buildPurchaseOrderBody(){
    let body = [];
    this.purchaseOrder.replacements.forEach(function(row) {
      let dataRow = [];
      dataRow.push({text: row.ncantidad, border:[false, false, false, false]});
      dataRow.push({text: row.xrepuesto, border:[false, false, false, false]});
      dataRow.push({text: row.munitariorepuesto, border:[false, false, false, false]});
      body.push(dataRow);
    });
    return body;
  }

  listRepairOrder(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion,
      baceptacion: 1,
      ccotizacion: this.popup_form.get('ccotizacion').value
    };
    this.http.post(`${environment.apiUrl}/api/quote-request/detail-list`, params, options).subscribe((response : any) => {
      this.purchaseOrder = {}
      if(response.data.status){
        let replacementsList = [];
          for(let i = 0; i < response.data.replacements.length; i++){
            let replacement = {};
            replacement = {
              crepuesto: response.data.replacements[i].crepuesto,
              xrepuesto: response.data.replacements[i].xrepuesto,
              ncantidad: response.data.replacements[i].ncantidad,
              munitariorepuesto: response.data.replacements[i].munitariorepuesto,
              cmoneda: response.data.replacements[i].cmoneda,
              xmoneda: response.data.replacements[i].xmoneda
            }
            console.log(replacement)
            replacementsList.push(replacement);
          }
          this.purchaseOrder = {
            ccotizacion: response.data.ccotizacion,
            xobservacion: response.data.xobservacion,
            mtotalcotizacion: response.data.mtotalcotizacion,
            mmontoiva: response.data.mmontoiva,
            mtotal: response.data.mtotal,
            cmoneda: response.data.cmoneda,
            xmoneda: response.data.xmoneda,
            replacements: replacementsList
          }
          this.popup_form.get('mmontoiva').setValue(response.data.mmontoiva);
          this.popup_form.get('mtotal').setValue(response.data.mtotal);
          this.popup_form.get('xmoneda').setValue(response.data.xmoneda);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.COINNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  buildRepairOrderBody(){
    let body = [];
    this.purchaseOrder.replacements.forEach(function(row) {
      let dataRow = [];
      dataRow.push({text: row.ncantidad, border:[false, false, false, false]});
      dataRow.push({text: row.xrepuesto, border:[false, false, false, false]});
      dataRow.push({text:    `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.munitariorepuesto)} ${row.xmoneda} `, border:[false, false, false, false]});
      body.push(dataRow);
    });
    return body;
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

  repuestos(){
    let repuestos = [];
    if(this.notificacion.repuestos){
      for(let i = 0; i < this.notificacion.repuestos.length; i++){
        let repuesto = this.notificacion.repuestos[i].xrepuesto;

        repuestos.push(repuesto);
      }
      this.popup_form.get('xrepuesto').setValue(repuestos);
      this.popup_form.get('xrepuesto').disable();
    }
    this.danos = this.popup_form.get('xrepuesto').value;
    this.popup_form.get('xdanos').setValue(`${this.danos}`);
    this.popup_form.get('xdanos').disable();
  }

  changeDateFormat(date) {
    let dateArray = date.split("-");
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
  }

  getStatus(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/general-status/service-order`, params, options).subscribe((response: any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.statusList.push({ id: response.data.list[i].cestatusgeneral, value: response.data.list[i].xestatusgeneral})
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron Daños"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
    });
  }
  // sendEmail(){
  //   let orden = { corden: this.notificacion.corden };
  //   const modalRef = this.modalService.open(NotificationEmailComponent);
  //   modalRef.componentInstance.orden = orden;
  //   modalRef.result.then((result: any) => { 
  //     if(result){
  //       this.emailList.push({
  //         cgrid: this.emailList.length,
  //         create: true,
  //         corden: result.corden,
  //         xmensaje: result.xmensaje,
  //         xrutaarchivo: result.xrutaarchivo
  //       });
  //     }
  //   });
  // }

  changeCancellationCause(){  
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/cancellation-cause/service-order`, params, options).subscribe((response: any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          if(this.popup_form.get('cestatusgeneral').value == 42){
            this.cancellationList.push({ id: response.data.list[i].ccausaanulacion, value: response.data.list[i].xcausaanulacion})
            this.popup_form.get('ccausaanulacion').enable()
            this.popup_form.get('xcausaanulacion').enable()
          }else if(this.popup_form.get('cestatusgeneral').value != 42){
            this.popup_form.get('ccausaanulacion').setValue('')
            this.popup_form.get('ccausaanulacion').disable()
            this.popup_form.get('xcausaanulacion').setValue('')
            this.popup_form.get('xcausaanulacion').disable()
          }
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron Daños"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
    });
  }

  buildStatus(){
    if(this.popup_form.get('cestatusgeneral').value == 52){
      this.popup_form.get('xestatusgeneral').value
      return "color1"
    }else{
      this.popup_form.get('xestatusgeneral').value
      return "color2"
    }
  }

  createPDF(){
    if(this.popup_form.get('cservicioadicional').value == 228 || this.popup_form.get('cservicio').value == 228){
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
              {
                fontSize: 15,
                alignment: 'right',
                style: this.buildStatus(),
                text: [
                  {text: `${this.popup_form.get('xestatusgeneral').value}`, bold: true}
                ]
              },
            ]
          },
          {
            alignment: 'center',
            style: 'title',
            text: [
              {text: '\nSolicitud de Grúa #', bold: true}, {text: `${this.popup_form.get('corden').value}`, bold: true}
            ]
          },
          {
            style: 'title',
            text: ' '
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'FACTURAR A NOMBRE DE: ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentocliente').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'DIRECCIÓN FISCAL: ', bold: true}, {text: `${this.popup_form.get('xdireccionfiscal').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'TELÉFONO: ', bold: true}, {text: `${this.popup_form.get('xtelefono').value}`}
              ]
            },
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
                table: {
                  alignment: 'right',
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
                  {text: 'ATENCION: ', bold: true}, {text: `${this.popup_form.get('xnombreproveedor').value}`},

                ]
              },
              {
                alignment: 'right',
                text: [
                  {text: 'NOTIFICACION: ', bold: true}, {text: this.popup_form.get('cnotificacion').value}
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
                {text: 'DIRECCIÓN: ', bold: true}, {text: `${this.popup_form.get('xdireccionproveedor').value}`}
              ]
            },
          ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentoproveedor').value}`}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonoproveedor').value}`}
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
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'Sirva la presente para solicitarle la prestación del servicio de '}, {text: this.getServiceOrderService()}, {text: ' para nuestro afiliado:'}
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
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'CLIENTE:   ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'NOMBRE:   ', bold: true}, {text: `${this.popup_form.get('xnombrepropietario').value}`}, {text: ', Documento de identificación: ', bold: true}, {text: `${this.popup_form.get('xdocidentidad').value}`}, {text: ', TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonocelular').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'VEHÍCULO: ', bold: true}, {text: `${this.popup_form.get('xmarca').value} ${this.popup_form.get('xmodelo').value}`}, {text: ', Año ', bold: true}, {text: this.popup_form.get('fano').value}, {text: ', Color ', bold: true}, {text: `${this.popup_form.get('xcolor').value}`}, {text: ', Placa nro.: ', bold: true}, {text: `${this.popup_form.get('xplaca').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'FECHA:    ', bold: true}, {text: this.popup_form.get('xfecha').value}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'DESDE:    ', bold: true}, {text: this.popup_form.get('xdesde').value}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'HACIA:    ', bold: true}, {text: this.popup_form.get('xhacia').value}
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
                width: 50,
                style: 'data',
                text: [
                  {text: 'Cant.', bold: true}
                ]
              },
              {
                alignment: 'left',
                width: 350,
                style: 'data',
                text: [
                  {text: 'Servicio    ', bold: true}
                ]
              },
              {
                alignment: 'right',
                width: 50,
                style: 'data',
                text: [
                  {text: 'Precio    ', bold: true}
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
                alignment: 'left',
                width: 50,
                style: 'data',
                text: [
                  {text: '1'}
                ]
              },
              {
                alignment: 'left',
                width: 350,
                style: 'data',
                text: [
                  {text: 'Servicio de '}, {text: this.getServiceOrderService()}
                ]
              },
              {
                alignment: 'right',
                width: 70,
                style: 'data',
                text: [
                  {text: ''}, `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmonto').value)} ${this.popup_form.get('xmoneda').value}`
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
                alignment: 'right',
                width: 470,
                style: 'data',
                text: [
                  {text: 'Subtotal: ', bold: true}, {text: ' '}, `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmonto').value)} ${this.popup_form.get('xmoneda').value}`
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 450,
                style: 'data',
                text: [
                  {text: 'IVA:         ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmontototaliva').value)}`
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 470,
                style: 'data',
                text: [
                  {text: 'Total:        ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmontototal').value)} ${this.popup_form.get('xmoneda').value}`
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 470,
                style: 'data',
                text: [
                  {text: 'Cubierto:       ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmontototal').value)} ${this.popup_form.get('xmoneda').value}`
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 470,
                style: 'data',
                text: [
                  {text: 'No Cubierto:       ', bold: true}, {text: '0,00'}
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
                style: 'data',
                text: [
                  {text: 'OBSERVACIONES:\n'}, {text: this.popup_form.get('xobservacion').value}
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
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          }
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
      pdfMake.createPdf(pdfDefinition).download(`Orden de Servicio para ${this.getServiceOrderService()} #${this.popup_form.get('corden').value}.pdf`, function() { alert('El PDF se está Generando'); });
  } else if(this.popup_form.get('cservicioadicional').value == 282 || this.popup_form.get('cservicio').value == 282){
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
            {
              fontSize: 15,
              alignment: 'right',
              style: this.buildStatus(),
              text: [
                {text: `${this.popup_form.get('xestatusgeneral').value}`, bold: true}
              ]
            },
          ]
        },
        {
          alignment: 'center',
          style: 'title',
          text: [
            {text: '\nOrden de Compra #', bold: true}, {text: `${this.popup_form.get('corden').value}`, bold: true}
          ]
        },
        {
          style: 'title',
          text: ' '
        },
        {
        style: 'data',
        columns: [
          {
            alignment: 'left',
            text: [
              {text: 'FACTURAR A NOMBRE DE: ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
            ]
          },
        ]
        },
        {
        style: 'data',
        columns: [
          {
            alignment: 'left',
            text: [
              {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentocliente').value}`}
            ]
          },
        ]
        },
        {
        style: 'data',
        columns: [
          {
            alignment: 'left',
            text: [
              {text: 'DIRECCIÓN FISCAL: ', bold: true}, {text: `${this.popup_form.get('xdireccionfiscal').value}`}
            ]
          },
        ]
        },
        {
        style: 'data',
        columns: [
          {
            alignment: 'left',
            text: [
              {text: 'TELÉFONO: ', bold: true}, {text: `${this.popup_form.get('xtelefono').value}`}
            ]
          },
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
                {text: 'CLIENTE:   ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
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
                {text: 'ATENCION: ', bold: true}, {text: `${this.popup_form.get('xnombreproveedor').value}`},

              ]
            },
            {
              alignment: 'right',
              text: [
                {text: 'NOTIFICACION: ', bold: true}, {text: this.popup_form.get('cnotificacion').value}
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
              {text: 'DIRECCIÓN: ', bold: true}, {text: `${this.popup_form.get('xdireccionproveedor').value}`}
            ]
          },
        ]
        },
        {
          style: 'data',
          columns: [
            {
              text: [
                {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentoproveedor').value}`}
              ]
            }
          ]
        },
        {
          style: 'data',
          columns: [
            {
              text: [
                {text: 'TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonoproveedor').value}`}
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
                {text: 'Sirva la presente para solicitarle la prestación del servicio de '}, {text: this.getServiceOrderService()}, {text: ' para nuestro afiliado:'}
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
              style: 'data',
              text: [
                {text: 'NOMBRE:   ', bold: true}, {text: `${this.popup_form.get('xnombrepropietario').value}`}, {text: ', Documento de identificación: ', bold: true}, {text: `${this.popup_form.get('xdocidentidad').value}`}, {text: ', TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonocelular').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              text: [
                {text: 'VEHÍCULO: ', bold: true}, {text: `${this.popup_form.get('xmarca').value} ${this.popup_form.get('xmodelo').value}`}, {text: ', Año ', bold: true}, {text: this.popup_form.get('fano').value}, {text: ', Color ', bold: true}, {text: `${this.popup_form.get('xcolor').value}`}, {text: ', Placa nro.: ', bold: true}, {text: `${this.popup_form.get('xplaca').value}`}
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
              alignment: 'left',
              style: 'data',
              text: [
                {text: 'REPUESTOS A COMPRAR', bold: true}
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
              width: 50,
              style: 'data',
              text: [
                {text: 'Cant.', bold: true}
              ]
            },
            {
              alignment: 'left',
              width: 350,
              style: 'data',
              text: [
                {text: 'Descripción de la Compra    ', bold: true}
              ]
            },
            {
              alignment: 'right',
              width: 50,
              style: 'data',
              text: [
                {text: 'Precio    ', bold: true}
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
          style: 'data',
          table: {
            widths: [50, 350, 70],
            body: this.buildRepairOrderBody()
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
              alignment: 'right',
              width: 475,
              style: 'data',
              text: [
                {text: 'Subtotal:                 ', bold: true}, `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.purchaseOrder.mtotalcotizacion)} `, {text: `${this.popup_form.get('xmoneda').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              alignment: 'right',
              width: 475,
              style: 'data',
              text: [
                {text: 'Depreciación:             ', bold: true}, {text: '0,00 '}, {text: `${this.popup_form.get('xmoneda').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              alignment: 'right',
              width: 475,
              style: 'data',
              text: [
                {text: 'Penalización:              ', bold: true}, {text: '0,00 '}, {text: `${this.popup_form.get('xmoneda').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              alignment: 'right',
              width: 475,
              style: 'data',
              text: [
                {text: 'IVA:                            ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmontoiva').value)} `, {text: `${this.popup_form.get('xmoneda').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              alignment: 'right',
              width: 475,
              style: 'data',
              text: [
                {text: 'Total:                        ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mtotal').value)} `, {text: `${this.popup_form.get('xmoneda').value}`}
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
          fontSize: 6,
          table: {
            widths: ['*'],
            body: [
              [{text: 'Yo____________, CI ____________hago constar que el taller____________________ha sustituido el_______________producto de daños sufridos a mi vehiculo marca____________, modelo____________, placas____________. Daños reportados en notificación escrita a ArysAutos del día____________.'
              + 'Importante: usted cuenta con 15 días a partir de esta fecha para comenzar la reparación de su vehículo en el taller asignado, de no hacerlo cualquier aumento en los precios será de su estricta responsabilidad'
              + 'Cualquier cambio en los montos de la mano de repuestos debe ser notificado a ARYSAUTOS, C.A. para su autorización. SOLO SE RECIBEN LAS FACTURAS CON FECHA DEL MES EN CURSO HASTA LOS 23 DE CADA MES, AGRADECEMOS SE SIRVAN DISCULPARNOS, PERO SI LAS ENVIAN FUERA DE ESTA FECHA LAS MISMAS LAMENTABLEMENTE SERAN DEVUELTAS.'
              , alignment: 'justify', border:[false, false, false, false]}]
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
              style: 'data',
              text: [
                {text: 'Sin más a que hacer referencia, me despido'}
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
                {text: ''}
              ]
            }
          ]
        },
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
    pdfMake.createPdf(pdfDefinition).download(`${this.getServiceOrderService()} #${this.popup_form.get('corden').value}.pdf`, function() { alert('El PDF se está Generando'); });
    } else if(this.popup_form.get('cservicioadicional').value == 283 || this.popup_form.get('cservicio').value == 283){
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
              {
                fontSize: 15,
                alignment: 'right',
                style: this.buildStatus(),
                text: [
                  {text: `${this.popup_form.get('xestatusgeneral').value}`, bold: true}
                ]
              },
            ]
          },
          {
            alignment: 'center',
            style: 'title',
            text: [
              {text: '\nOrden de Reparación #', bold: true}, {text: `${this.popup_form.get('corden').value}`, bold: true}
            ]
          },
          {
            style: 'title',
            text: ' '
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'FACTURAR A NOMBRE DE: ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentocliente').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'DIRECCIÓN FISCAL: ', bold: true}, {text: `${this.popup_form.get('xdireccionfiscal').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'TELÉFONO: ', bold: true}, {text: `${this.popup_form.get('xtelefono').value}`}
              ]
            },
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
                  {text: 'CLIENTE:   ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
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
                  {text: 'ATENCION: ', bold: true}, {text: `${this.popup_form.get('xnombreproveedor').value}`},

                ]
              },
              {
                alignment: 'right',
                text: [
                  {text: 'NOTIFICACION: ', bold: true}, {text: this.popup_form.get('cnotificacion').value}
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
                {text: 'DIRECCIÓN: ', bold: true}, {text: `${this.popup_form.get('xdireccionproveedor').value}`}
              ]
            },
          ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentoproveedor').value}`}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonoproveedor').value}`}
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
                  {text: 'Sirva la presente para solicitarle la prestación del servicio de '}, {text: this.getServiceOrderService()}, {text: ' para nuestro afiliado:'}
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
                style: 'data',
                text: [
                  {text: 'NOMBRE:   ', bold: true}, {text: `${this.popup_form.get('xnombrepropietario').value}`}, {text: ', Documento de identificación: ', bold: true}, {text: `${this.popup_form.get('xdocidentidad').value}`}, {text: ', TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonocelular').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'VEHÍCULO: ', bold: true}, {text: `${this.popup_form.get('xmarca').value} ${this.popup_form.get('xmodelo').value}`}, {text: ', Año ', bold: true}, {text: this.popup_form.get('fano').value}, {text: ', Color ', bold: true}, {text: `${this.popup_form.get('xcolor').value}`}, {text: ', Placa nro.: ', bold: true}, {text: `${this.popup_form.get('xplaca').value}`}
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
                alignment: 'left',
                style: 'data',
                text: [
                  {text: 'REPUESTOS A REPARAR', bold: true}
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
                width: 50,
                style: 'data',
                text: [
                  {text: 'Cant.', bold: true}
                ]
              },
              {
                alignment: 'left',
                width: 350,
                style: 'data',
                text: [
                  {text: 'Descripción de Reparación    ', bold: true}
                ]
              },
              {
                alignment: 'right',
                width: 50,
                style: 'data',
                text: [
                  {text: 'Precio    ', bold: true}
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
            style: 'data',
            table: {
              widths: [50, 350, 70],
              body: this.buildRepairOrderBody()
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
                alignment: 'right',
                width: 475,
                style: 'data',
                text: [
                  {text: 'Subtotal:                 ', bold: true}, `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.purchaseOrder.mtotalcotizacion)} `, {text: `${this.popup_form.get('xmoneda').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 475,
                style: 'data',
                text: [
                  {text: 'Depreciación:             ', bold: true}, {text: '0,00 '}, {text: `${this.popup_form.get('xmoneda').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 475,
                style: 'data',
                text: [
                  {text: 'Penalización:              ', bold: true}, {text: '0,00 '}, {text: `${this.popup_form.get('xmoneda').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 475,
                style: 'data',
                text: [
                  {text: 'IVA:                            ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmontoiva').value)} `, {text: `${this.popup_form.get('xmoneda').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 475,
                style: 'data',
                text: [
                  {text: 'Total:                        ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mtotal').value)} `, {text: `${this.popup_form.get('xmoneda').value}`}
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
            fontSize: 6,
            table: {
              widths: ['*'],
              body: [
                [{text: 'Yo____________, CI ____________hago constar que el taller____________________ha sustituido el_______________producto de daños sufridos a mi vehiculo marca____________, modelo____________, placas____________. Daños reportados en notificación escrita a ArysAutos del día____________.'
                + 'Importante: usted cuenta con 15 días a partir de esta fecha para comenzar la reparación de su vehículo en el taller asignado, de no hacerlo cualquier aumento en los precios será de su estricta responsabilidad'
                + 'Cualquier cambio en los montos de la mano de repuestos debe ser notificado a ARYSAUTOS, C.A. para su autorización. SOLO SE RECIBEN LAS FACTURAS CON FECHA DEL MES EN CURSO HASTA LOS 23 DE CADA MES, AGRADECEMOS SE SIRVAN DISCULPARNOS, PERO SI LAS ENVIAN FUERA DE ESTA FECHA LAS MISMAS LAMENTABLEMENTE SERAN DEVUELTAS.'
                , alignment: 'justify', border:[false, false, false, false]}]
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
                style: 'data',
                text: [
                  {text: 'Sin más a que hacer referencia, me despido'}
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
      pdfMake.createPdf(pdfDefinition).download(`${this.getServiceOrderService()} #${this.popup_form.get('corden').value}.pdf`, function() { alert('El PDF se está Generando'); });
      }else{
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
              {
                fontSize: 15,
                alignment: 'right',
                style: this.buildStatus(),
                text: [
                  {text: `${this.popup_form.get('xestatusgeneral').value}`, bold: true}
                ]
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
            alignment: 'center',
            style: 'title',
            text: [
              {text: '\nORDEN DE '}, {text: this.getServiceOrderService(), bold: true}, {text: ' #'}, {text: `${this.popup_form.get('corden').value}`, bold: true}
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
                  {text: 'CLIENTE:   ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
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
                  alignment: 'right',
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
                  {text: 'ATENCION: '}, {text: `${this.popup_form.get('xnombreproveedor').value}\n${this.popup_form.get('xdireccionproveedor').value}`, bold: true},

                ]
              },
              {
                alignment: 'right',
                text: [
                  {text: 'NOTIFICACION: '}, {text: this.popup_form.get('cnotificacion').value, bold: true}
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
                  {text: 'TLF.: '}, {text: '02122503211', bold: true}
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
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'Sirva la presente para solicitarle la prestación del servicio de '}, {text: this.getServiceOrderService(), bold: true}, {text: ' para nuestro afiliado:'}
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
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'NOMBRE:   '}, {text: `${this.popup_form.get('xnombrepropietario').value} ${this.popup_form.get('xapellidopropietario').value}`, bold: true}, {text: ', Documento de identificación: '}, {text: `${this.popup_form.get('xdocidentidad').value}`, bold: true}, {text: ', TLF.: '}, {text: `${this.popup_form.get('xtelefonocelular').value}`, bold: true}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'VEHÍCULO: '}, {text: `${this.popup_form.get('xmarca').value} ${this.popup_form.get('xmodelo').value}`, bold: true}, {text: ', Año '}, {text: this.popup_form.get('fano').value, bold: true}, {text: ', Color '}, {text: `${this.popup_form.get('xcolor').value}`, bold: true}, {text: ', Placa nro.: '}, {text: `${this.popup_form.get('xplaca').value}`, bold: true}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'FECHA:    '}, {text: this.popup_form.get('xfecha').value}
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
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'ACCIDENTE:  '}, {text: this.popup_form.get('xdescripcion').value}
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
                style: 'data',
                text: [
                  {text: 'DAÑOS:  '}, {text: this.popup_form.get('xdanos').value}
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
                style: 'data',
                text: [
                  {text: 'ENTREGAR EL AJUSTE ANTES DE: '}, {text: [{text: this.changeDateFormat(this.popup_form.get('fajuste').value)}], border:[false, false, true, true]}
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
                style: 'data',
                text: [
                  {text: 'OBSERVACIONES:  '}, {text: this.popup_form.get('xobservacion').value}
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
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'Sin más a que hacer referencia, me despido'}
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
              widths: [200],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'NOMBRE APELLIDO:      '}, {text: this.popup_form.get('xnombrepropietario').value}
                ]
              }
            ]
          }
        ],
        styles: {
          data: {
            fontSize: 10
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
      pdfMake.createPdf(pdfDefinition).download(`ORDEN DE SERVICIO PARA ${this.getServiceOrderService()} #${this.popup_form.get('corden').value}.pdf`, function() { alert('El PDF se está Generando'); });
    }
  }
}
