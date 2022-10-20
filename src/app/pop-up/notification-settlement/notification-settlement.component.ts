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
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-notification-settlement',
  templateUrl: './notification-settlement.component.html',
  styleUrls: ['./notification-settlement.component.css']
})
export class NotificationSettlementComponent implements OnInit {

  private replacementGridApi;
  @Input() public notificacion;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  replacementList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  corden: number;
  variablex: number;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  notificationList: any[] = [];
  purchaseOrder;
  coinList: any[] = []
  code;
  danos;
  serviceOrderList: any[] = [];
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
      ccontratoflota: [''],
      xnombre: [''],
      xapellido: [''],
      xnombrealternativo: [''],
      xapellidoalternativo: [''],
      xobservacion: ['', Validators.required],
      fcreacion: [''],
      xdanos: ['', Validators.required],
      xnombrepropietario: [''],
      xapellidopropietario: [''],
      xdocidentidad: [''],
      xtelefonocelular: [''],
      xplaca:[''],
      xcolor: [''],
      xmodelo: [''],
      xmarca: [''],
      bactivo: [true],
      xactivo: [''],
      ccotizacion: [''],
      crepuesto: [''],
      xrepuesto: [''],
      repuestos: [''],
      xdescripcion: [''],
      xnombres: [''],
      xauto: [''],
      xnombrespropietario: [''],
      xnombresalternativos: ['']
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
    if(this.notificacion.createSettlement){
      this.canSave = true;
      this.createSettlement();
      this.repuestos();
      //this.searchServiceOrder();
    }
  }

  createSettlement(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion
    };
    this.http.post(`${environment.apiUrl}/api/service-order/notification-order`, params, options).subscribe((response : any) => {
      if(this.notificacion.cnotificacion){
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
            this.popup_form.get('bactivo').setValue(response.data.list[0].bactivo);
            this.popup_form.get('bactivo').disable();
            this.popup_form.get('xactivo').disable();
            this.popup_form.get('xauto').setValue(response.data.list[0].xauto);
            this.popup_form.get('xauto').disable(); 
            this.popup_form.get('xnombres').setValue(response.data.list[0].xnombres);
            this.popup_form.get('xnombres').disable(); 
            this.popup_form.get('xnombrespropietario').setValue(response.data.list[0].xnombrespropietario);
            this.popup_form.get('xnombrespropietario').disable(); 
            this.popup_form.get('xnombresalternativos').setValue(response.data.list[0].xnombresalternativos);
            this.popup_form.get('xnombresalternativos').disable(); 
          }
          this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion });
      }

    if(this.notificacion.createSettlement){
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
      this.notificacion.createSettlement = true;
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

  repuestos(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion
    };
    this.http.post(`${environment.apiUrl}/api/valrep/settlement/replacement`, params, options).subscribe((response : any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.replacementList.push({ id: response.data.list[i].crepuesto, value: response.data.list[i].xrepuesto});
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
  }

  onSubmit(form){
     this.submitted = true;
     this.loading = true;

    let notificacionFilter = this.notificationList.filter((option) => { return option.id == this.popup_form.get('cnotificacion').value; });
    let replacementFilter = this.replacementList.filter((option) => { return option.crepuesto == this.popup_form.get('crepuesto').value; });

    this.notificacion.xobservacion = form.xobservacion;
    this.notificacion.xdanos = this.popup_form.get('xrepuesto').value;

    this.activeModal.close(this.notificacion);
  }
}
