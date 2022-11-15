import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BillLoadingServiceOrderComponent } from '@app/pop-up/bill-loading-service-order/bill-loading-service-order.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-bill-loading',
  templateUrl: './bill-loading.component.html',
  styleUrls: ['./bill-loading.component.css']
})
export class BillLoadingComponent implements OnInit {

  sub;
  currentUser;
  bill_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  providerList: any[] = [];
  paymasterList: any[] = [];
  serviceOrderList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  cfiniquito;
  corden;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal){}

  ngOnInit(): void {
    this.bill_form = this.formBuilder.group({
      xrazonsocial: [''],
      xtipopagador: [''],
      ffactura: [''],
      frecepcion: [''],
      fvencimiento: [''],
      nlimite: [''],
      nfactura: [''],
      ncontrol: [''],
      mmontofactura: [''],
      xobservacion: [''],
      cproveedor: [''],
      cpagador: ['']
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
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
    }
    this.http.post(`${environment.apiUrl}/api/valrep/provider-bill`, params, options).subscribe((response: any) => {
      this.providerList = [];
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ id: response.data.list[i].cproveedor, value: response.data.list[i].xnombre});
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

  changeInfo(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cproveedor: this.bill_form.get('cproveedor').value
    }
    this.http.post(`${environment.apiUrl}/api/administration/change-provider`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.bill_form.get('xrazonsocial').setValue(response.data.xrazonsocial);
        this.bill_form.get('xrazonsocial').disable();
        this.bill_form.get('nlimite').setValue(response.data.nlimite);
        this.bill_form.get('nlimite').disable();
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
    })
  }

  changePaymaster(){
    if(this.bill_form.get('xtipopagador').value == "cliente"){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        ccompania: this.currentUser.data.ccompania,
        cpais: this.currentUser.data.cpais,
      }
      this.http.post(`${environment.apiUrl}/api/valrep/client`, params, options).subscribe((response: any) => {
        this.paymasterList = [];
        if(response.data.list){
          for(let i = 0; i < response.data.list.length; i++){
            this.paymasterList.push({ id: response.data.list[i].ccliente, value: response.data.list[i].xcliente});
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
    }else{
      this.paymasterList = [];
      this.paymasterList.push({ id: 0, value: "ArysAutos C.A"});
    }
  }

  addServiceOrder(){
    let orden = { cproveedor: this.bill_form.get('cproveedor').value, ccliente: this.bill_form.get('cpagador').value };
    const modalRef = this.modalService.open(BillLoadingServiceOrderComponent, { size: 'xl' });
    modalRef.componentInstance.orden = orden;
    modalRef.result.then((result: any) => { 
      this.serviceOrderList = [];
      if(result){
        this.serviceOrderList.push(result)
        console.log(this.serviceOrderList)
        // for(let i = 0; i < this.serviceOrderList.length; i++){

        //   this.serviceOrderList.push({
        //     cgrid: this.serviceOrderList.length,
        //     edit: true,
        //     corden: result.corden,
        //     xservicio: result.xservicio,
        //     mtotal: result.mtotal,
        //     mmontototal: result.mmontototal
        //   });
        // }
      }
    });
  }

  onServiceOrderGridReady(event){

  }

  serviceOrderRowClicked(event){
    
  }

}
