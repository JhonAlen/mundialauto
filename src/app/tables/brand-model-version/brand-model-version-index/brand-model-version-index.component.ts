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

@Component({
  selector: 'app-brand-model-version-index',
  templateUrl: './brand-model-version-index.component.html',
  styleUrls: ['./brand-model-version-index.component.css']
})
export class BrandModelVersionIndexComponent implements OnInit {

  currentUser;
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
      npasajeros: [''],
      xtrasnmision:[''],
      cano:[''],
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
          control: request.data.list[i].control });
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
    this.search_form.get('cmarca').setValue(event.control)
    let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
      let params = {
        cpais: this.currentUser.data.cpais,
        cmarca: marca.id
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

  async getVersionData(event){
    this.keyword;
    this.search_form.get('cmodelo').setValue(event.control)
    let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
    let modelo = this.modelList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
    let params = {
      cpais: 58,
      cmarca: marca.id,
      cmodelo: modelo.id,
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
            xtrasnmision: response.data.list[i].xtrasnmision
          });
        }
        this.versionList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  }
  searchVersion(event){
    this.search_form.get('cversion').setValue(event.control)
    let version = this.versionList.find(element => element.control === parseInt(this.search_form.get('cversion').value));
    this.search_form.get('cano').setValue(version.cano);
    this.search_form.get('ncapacidad_p').setValue(version.npasajero);
  }


  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      cmarca: this.search_form.get('cmarca').value,
      cmodelo: this.search_form.get('cmodelo').value,
      cversion: this.search_form.get('cversion').value,
    }
    this.http.post(`${environment.apiUrl}/api/brand/search`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.vehicleList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.vehicleList.push({ 
            cmarca: response.data.list[i].cmarca,
            xmarca: response.data.list[i].xmarca,
            cmodelo: response.data.list[i].cmodelo,
            xmodelo: response.data.list[i].xmodelo,
            cversion: response.data.list[i].cversion,
            xversion: response.data.list[i].xversion,
            cano: response.data.list[i].cano,
          });
        }
        this.vehicleList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      this.loading = false;
    },(err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron contratos pendientes"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });
  }

  goToDetail(event){
    let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
    let modelo = this.modelList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
    let version = this.modelList.find(element => element.control === parseInt(this.search_form.get('cversion').value));

    console.log(marca,modelo,version)
  if(marca > 0){
    this.canEdit = true;
    this.detail = true;
    this.search_form.get('cmarca').setValue(marca.value)

   }
  else if(version > 0){
    this.canEdit = true;
          this.search_form.get('cmarca').setValue(marca.value)
          this.search_form.get('cmodelo').setValue(modelo.value)
          this.search_form.get('cversion').setValue(version.value)

  }
  else if(modelo > 0){
    this.canEdit = true;
          this.search_form.get('cmarca').setValue(marca.value)
          this.search_form.get('cmodelo').setValue(modelo.value)

  } 


  }

}

