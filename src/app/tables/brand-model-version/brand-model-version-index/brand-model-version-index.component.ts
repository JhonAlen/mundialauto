import { Component, OnInit } from '@angular/core';
import {  UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { Console } from 'console';
import { ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'app-brand-model-version-index',
  templateUrl: './brand-model-version-index.component.html',
  styleUrls: ['./brand-model-version-index.component.css']
})
export class BrandModelVersionIndexComponent implements OnInit {

  currentUser;
  code;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  submitted: boolean = false;
  detail : boolean = false;
  alert = { show: false, type: "", message: "" };
  vehicleList: any[] = [];
  brandList: any[] = [];
  versionList: any[] = [];
  transmissionTypeList: any[] = [];
  modelList: any[] = [];
  vehicleInfo: any;
  keyword: 'value';
  marcaList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private modalService : NgbModal,
              private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      cmarca: [''],
      cmodelo: [''],
      cversion: [''],
      xmarca: [''],
      xmodelo: [''],
      xversion: [''],
      npasajero: [''],
      xtransmision:[''],
      cano:[''],
      xaccion:[''],
      bactivo: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 113
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.search_form.get('cano').disable();
          this.search_form.get('xversion').disable();
          this.search_form.get('xmarca').disable();
          this.search_form.get('xmodelo').disable();
          this.search_form.get('npasajero').disable();
          this.search_form.get('xtransmision').disable();
          this.search_form.get('bactivo').disable();
          this.initializeDropdownDataRequest();
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
          }else{

          }
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

  async initializeDropdownDataRequest(){

  let params = {
    cpais: this.currentUser.data.cpais,
  };
  this.keyword = 'value';
  let request = await this.webService.searchBrand(params);
  if(request.error){
    this.alert.message = request.message;
    this.alert.type = 'danger';
    this.alert.show = true;
    this.loading = false;
    return;
  }

    if(request.data.list){
      for(let i = 0; i < request.data.list.length; i++){
        this.marcaList.push({ 
          id: request.data.list[i].cmarca, 
          value: request.data.list[i].xmarca,
          control: request.data.list[i].control,
          bactivo : request.data.list[i].bactivo });
      }
      this.marcaList.sort((a, b) => a.value > b.value ? 1 : -1)
    }
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  let options = { headers: headers };

  this.http.post(`${environment.apiUrl}/api/valrep/transmission-type`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.transmissionTypeList.push({ id: response.data.list[i].xtransmision, value: response.data.list[i].xtipotransmision });
        }
        this.transmissionTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.TRANSMISSIONTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  async getModeloData(event){
    this.canEdit=true
    this.keyword;
    this.search_form.get('bactivo').setValue(event.bactivo);
      let params = {
        cpais: this.currentUser.data.cpais,
        cmarca: event.id
      };
      let request = await this.webService.searchModel(params);
      if(request.error){
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
        return;
      }
      if(request.data.status){

          this.modelList = [];
        for(let i = 0; i < request.data.list.length; i++){
           this.modelList.push({ 
             id: request.data.list[i].cmodelo, 
             value: request.data.list[i].xmodelo,
             control: request.data.list[i].control  });
        }
        this.modelList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
  }

  async getVersionData(event, form){
      this.keyword;       
      let params = {
      cpais: this.currentUser.data.cpais,
      cmarca: form.cmarca.id,
      cmodelo: event.id,
    };

    this.http.post(`${environment.apiUrl}/api/valrep/version`, params).subscribe((response : any) => {
      if(response.data.status){
     
        this.versionList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.versionList.push({ 
            id: response.data.list[i].cversion,
            value: response.data.list[i].xversion,
            cano: response.data.list[i].cano, 
            control: response.data.list[i].control,
            npasajero: response.data.list[i].npasajero,
            xtransmision: response.data.list[i].xtransmision
          });
        }
        this.versionList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  }

  goToDetail(form){
    this.canCreate = true
    this.submitted = true
    this.keyword;
    this.search_form.get('xaccion').setValue("detail");

      if(form.cmarca == "")
      {
      this.search_form.get('bactivo').enable();
      this.search_form.get('xmarca').enable();
      this.search_form.get('xmarca').setValue(form.cmarca.value);
      }
      else if(form.cmodelo == "")
      {
      this.search_form.get('xmarca').enable();
      this.search_form.get('xmarca').setValue(form.cmarca.value);
      this.search_form.get('xmodelo').enable();
      this.search_form.get('xmodelo').setValue(form.cmodelo.value);

      } 
      else if(form.cversion == "")
      {
      this.search_form.get('xmarca').enable();
      this.search_form.get('xmarca').setValue(form.cmarca.value);
      this.search_form.get('xmodelo').enable();
      this.search_form.get('xmodelo').setValue(form.cmodelo.value);
      this.search_form.get('xversion').setValue(form.cversion.value);
      this.search_form.get('xversion').enable();
      this.search_form.get('npasajero').setValue(form.cversion.npasajero);
      this.search_form.get('npasajero').enable();
      this.search_form.get('cano').setValue(form.cversion.cano);
      this.search_form.get('cano').enable();
      this.search_form.get('xtransmision').setValue(form.cversion.xtransmision);
      this.search_form.get('xtransmision').enable();
      this.transmissionTypeList.push({ id: form.cversion.xtransmision, value: form.cversion.xtransmision });    
      }
      else{
        this.search_form.get('xmarca').enable();
        this.search_form.get('xmarca').setValue(form.cmarca.value);
        this.search_form.get('xmodelo').enable();
        this.search_form.get('xmodelo').setValue(form.cmodelo.value);
        this.search_form.get('xversion').setValue(form.cversion.value);
        this.search_form.get('xversion').enable();
        this.search_form.get('npasajero').setValue(form.cversion.npasajero);
        this.search_form.get('npasajero').enable();
        this.search_form.get('cano').setValue(form.cversion.cano);
        this.search_form.get('cano').enable();
        this.search_form.get('xtransmision').setValue(form.cversion.xtransmision);
        this.search_form.get('xtransmision').enable();
        this.transmissionTypeList.push({ id: form.cversion.xtransmision, value: form.cversion.xtransmision });   
      }
  }

  goToCreate(form){
    this.search_form.get('xaccion').setValue("create");
    this.canCreate = false
    this.submitted = true
    this.keyword;

    if(form.cmarca == "")
    {

      this.search_form.get('xmarca').enable()
      this.search_form.get('xmodelo').disable()
      this.search_form.get('xversion').disable()
      this.search_form.get('npasajero').disable()
      this.search_form.get('xtransmision').disable()
      this.search_form.get('cano').disable()
      this.search_form.get('bactivo').setValue(1)
    }
    else if(form.cmodelo == "")
    {
        this.search_form.get('xmarca').setValue(form.cmarca.value)
        this.search_form.get('xmarca').disable()
        this.search_form.get('xmodelo').enable()
        this.search_form.get('xversion').disable()
        this.search_form.get('npasajero').disable()
        this.search_form.get('xtransmision').disable()
        this.search_form.get('cano').disable()
        this.search_form.get('bactivo').setValue(1) 

    } 
    else if(form.cversion == "")
    {
      this.search_form.get('xmarca').setValue(form.cmarca.value)
      this.search_form.get('xmarca').disable()
      this.search_form.get('xmodelo').setValue(form.cmodelo.value)
      this.search_form.get('xmodelo').disable()
      this.search_form.get('xversion').enable()
      this.search_form.get('npasajero').enable()
      this.search_form.get('xtransmision').enable()
      this.search_form.get('cano').enable()
      this.search_form.get('bactivo').setValue(1)   
    }

  } 

  onSubmit(form){
  //modificaciones
    if(this.search_form.get('xaccion').value == "detail"){

      if(form.cmarca.value !== this.search_form.get('xmarca').value){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let request;
        let url;
        let params ={
          cmarca : form.cmarca.id,
          xmarca : form.xmarca,
          bactivo: form.bactivo,
          cusuariomodificacion: this.currentUser.data.cusuario,
          cpais: this.currentUser.data.cpais
        }
        url = `${environment.apiUrl}/api/brand/update`
        this.http.post(url, params, options).subscribe((response : any) => {
          if(response.data.status){
            location.reload();
              
          }else{
            let condition = response.data.condition;
            if(condition == "brand-name-already-exist"){
              this.alert.message = "TABLES.BRAND.NAMEALREADYEXIST";
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
          else if(code == 404){ message = "HTTP.ERROR.BRAND.BRANDNOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
        });
      }
      if(form.cmodelo.value !== this.search_form.get('xmodelo').value){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let request;
        let url;
        let params ={
          cmarca : form.cmarca.id,
          cmodelo : form.cmodelo.id,
          xmodelo : form.xmodelo,
          bactivo: form.bactivo,
          cusuariomodificacion: this.currentUser.data.cusuario,
          cpais: this.currentUser.data.cpais
        }
        url = `${environment.apiUrl}/api/model/update`
        this.http.post(url, params, options).subscribe((response : any) => {
          if(response.data.status){
            location.reload();
              
          }else{
            let condition = response.data.condition;
            if(condition == "brand-name-already-exist"){
              this.alert.message = "TABLES.MODEL.NAMEALREADYEXIST";
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
          else if(code == 404){ message = "HTTP.ERROR.MODEL.BRANDNOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
        });
      }
      if(form.cversion.value !== this.search_form.get('xversion').value){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let request;
        let url;
        let params ={
          cmarca : form.cmarca.id,
          cmodelo : form.cmodelo.id,
          xmodelo : form.xmodelo,
          cversion : form.cversion.id,
          xversion : form.xversion,
          xtransmision : form.xtransmision,
          npasajero : form.npasajero,
          cano : form.cano,
          bactivo: form.bactivo,
          cusuariomodificacion: this.currentUser.data.cusuario,
          cpais: this.currentUser.data.cpais
        }
        url = `${environment.apiUrl}/api/version/update`
        this.http.post(url, params, options).subscribe((response : any) => {
          if(response.data.status){
            location.reload();
              
          }else{
            let condition = response.data.condition;
            if(condition == "version-name-already-exist"){
              this.alert.message = "TABLES.VERSIONS.NAMEALREADYEXIST";
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
          else if(code == 404){ message = "HTTP.ERROR.VERSIONS.VERSIONNOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
      });
      }
      if(form.cversion.xtransmision !== this.search_form.get('xtransmision').value){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let request;
        let url;
        let params ={
          cmarca : form.cmarca.id,
          cmodelo : form.cmodelo.id,
          xmodelo : form.xmodelo,
          cversion : form.cversion.id,
          xversion : form.xversion,
          xtransmision : form.xtransmision,
          npasajero : form.npasajero,
          cano : form.cano,
          bactivo: form.bactivo,
          cusuariomodificacion: this.currentUser.data.cusuario,
          cpais: this.currentUser.data.cpais
        }
        url = `${environment.apiUrl}/api/version/update`
        this.http.post(url, params, options).subscribe((response : any) => {
          if(response.data.status){
            location.reload();
              
          }else{
            let condition = response.data.condition;
            if(condition == "version-name-already-exist"){
              this.alert.message = "TABLES.VERSIONS.NAMEALREADYEXIST";
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
          else if(code == 404){ message = "HTTP.ERROR.VERSIONS.VERSIONNOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
      });
      }
      if(form.cversion.npasajero !== this.search_form.get('npasajero').value){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let request;
        let url;
        let params ={
          cmarca : form.cmarca.id,
          cmodelo : form.cmodelo.id,
          xmodelo : form.xmodelo,
          cversion : form.cversion.id,
          xversion : form.xversion,
          xtransmision : form.xtransmision,
          npasajero : form.npasajero,
          cano : form.cano,
          bactivo: form.bactivo,
          cusuariomodificacion: this.currentUser.data.cusuario,
          cpais: this.currentUser.data.cpais
        }
        url = `${environment.apiUrl}/api/version/update`
        this.http.post(url, params, options).subscribe((response : any) => {
          if(response.data.status){
            location.reload();
              
          }else{
            let condition = response.data.condition;
            if(condition == "version-name-already-exist"){
              this.alert.message = "TABLES.VERSIONS.NAMEALREADYEXIST";
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
          else if(code == 404){ message = "HTTP.ERROR.VERSIONS.VERSIONNOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
      });
      }
      if(form.cversion.cano !== this.search_form.get('cano').value){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let request;
        let url;
        let params ={
          cmarca : form.cmarca.id,
          cmodelo : form.cmodelo.id,
          xmodelo : form.xmodelo,
          cversion : form.cversion.id,
          xversion : form.xversion,
          xtransmision : form.xtransmision,
          npasajero : form.npasajero,
          cano : form.cano,
          bactivo: form.bactivo,
          cusuariomodificacion: this.currentUser.data.cusuario,
          cpais: this.currentUser.data.cpais
        }
        url = `${environment.apiUrl}/api/version/update`
        this.http.post(url, params, options).subscribe((response : any) => {
          if(response.data.status){
            location.reload();
              
          }else{
            let condition = response.data.condition;
            if(condition == "version-name-already-exist"){
              this.alert.message = "TABLES.VERSIONS.NAMEALREADYEXIST";
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
          else if(code == 404){ message = "HTTP.ERROR.VERSIONS.VERSIONNOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
      });
      }
      // else if(){

      //   if(form.cmarca.value == this.search_form.get('xmarca').value){
      //     if(form.cmodelo.value == this.search_form.get('xmodelo').value ){
      //      if(form.cversion.value == this.search_form.get('xversion').value ){}
      //    }
      //    window.alert('No hay modificaciones que realizar')  
      //  }
      // }
      window.alert('Los datos han sido registrados con éxito')  
      

    }     
  //creaciones
    if(this.search_form.get('xaccion').value !== "detail"){  
      if(form.cmarca == ""){   
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let request;
      let url;
      let params ={
        cmarca : this.code,
        xmarca : this.search_form.get('xmarca').value,
        bactivo: this.search_form.get('bactivo').value,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais
      }
      url = `${environment.apiUrl}/api/brand/create`
      this.http.post(url, params, options).subscribe((response : any) => {
        if(response.data.status){
          window.alert('Los datos han sido registrados con éxito')  
          location.reload();
            
        }else{
          let condition = response.data.condition;
          if(condition == "brand-name-already-exist"){
            this.alert.message = "TABLES.BRAND.NAMEALREADYEXIST";
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
        else if(code == 404){ message = "HTTP.ERROR.BRAND.BRANDNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
      });

      }         
      else if(form.cmodelo == ""){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let request;
        let url;
        let params ={
          cmarca : form.cmarca.id,
          cmodelo : this.code,
          xmodelo : form.xmodelo,
          bactivo: form.bactivo,
          cusuariomodificacion: this.currentUser.data.cusuario,
          cpais: this.currentUser.data.cpais
        }
        url = `${environment.apiUrl}/api/model/create`
        this.http.post(url, params, options).subscribe((response : any) => {
          if(response.data.status){
            window.alert('Los datos han sido registrados con éxito')  
            location.reload();
              
          }else{
            let condition = response.data.condition;
            if(condition == "brand-name-already-exist"){
              this.alert.message = "TABLES.MODEL.NAMEALREADYEXIST";
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
          else if(code == 404){ message = "HTTP.ERROR.MODEL.BRANDNOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
        });
      }                 
      else if(form.cversion == ""){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let request;
        let url;
        let params ={
          cmarca : form.cmarca.id,
          cmodelo : form.cmodelo.id,
          xmodelo : form.xmodelo,
          cversion : this.code,
          xversion : form.xversion,
          xtransmision : form.xtransmision,
          npasajero : form.npasajero,
          cano : form.cano,
          bactivo: form.bactivo,
          cusuariomodificacion: this.currentUser.data.cusuario,
          cpais: this.currentUser.data.cpais
        }
        url = `${environment.apiUrl}/api/version/create`
        this.http.post(url, params, options).subscribe((response : any) => {
          if(response.data.status){
            window.alert('Los datos han sido registrados con éxito')  
            location.reload();
              
          }else{
            let condition = response.data.condition;
            if(condition == "version-name-already-exist"){
              this.alert.message = "TABLES.VERSIONS.NAMEALREADYEXIST";
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
          else if(code == 404){ message = "HTTP.ERROR.VERSIONS.VERSIONNOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
      });
      }
    }
  }

}



