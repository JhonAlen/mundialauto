import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-bill-loading-service-order',
  templateUrl: './bill-loading-service-order.component.html',
  styleUrls: ['./bill-loading-service-order.component.css']
})
export class BillLoadingServiceOrderComponent implements OnInit {

  @Input() public orden;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  serviceOrderList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  serviceOrder: any[] = [];
  taxList: any[] = [];
  code;
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
      cnotificacion: [''],
      corden: [''],
      cservicio: [''],
      cservicioadicional: [''],
      cproveedor: [''],
      xproveedor: [''],
      ccontratoflota: [''],
      xtiposervicio: [''],
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 111
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
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

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
      cproveedor: this.orden.cproveedor,
      ccliente: this.orden.ccliente
    }
    this.http.post(`${environment.apiUrl}/api/administration/service-order`, params, options).subscribe((response: any) => {
      this.serviceOrderList = [];
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          let xservicio;
          if(response.data.list[i].xservicio){
            xservicio = response.data.list[i].xservicio
          }else{
            xservicio = response.data.list[i].xservicioadicional
          }
          this.serviceOrderList.push({ 
            corden: response.data.list[i].corden, 
            xservicio: xservicio,
            xcliente: response.data.list[i].xcliente,
            xnombre: response.data.list[i].xnombre,
            mtotal: response.data.list[i].mtotal,
            mmontototal: response.data.list[i].mmontototal
          });
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  rowClicked(event: any){
    this.orden.corden = event.data.corden;
    this.orden.xservicio = event.data.xservicio;
    this.orden.mmontototal = event.data.mmontototal;
    this.orden.mtotal = event.data.mtotal;
    this.activeModal.close(this.orden);
  }

}
