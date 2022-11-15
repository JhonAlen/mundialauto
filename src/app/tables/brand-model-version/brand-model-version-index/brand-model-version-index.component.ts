import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-brand-model-version-index',
  templateUrl: './brand-model-version-index.component.html',
  styleUrls: ['./brand-model-version-index.component.css']
})
export class BrandModelVersionIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  vehicleList: any[] = [];
  brandList: any[] = [];
  versionList: any[] = [];
  modelList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      cmarca: [''],
      cmodelo: [''],
      cversion: [''],
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
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    //Buscar marca
    this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.brandList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.brandList.push({ id: response.data.list[i].cmarca, value: response.data.list[i].xmarca });
        }
      }
      this.loading = false;
    },(err) => {
      let code = err.error.data.code;
      console.log(err.error.data.code)
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron contratos pendientes"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });

    //Buscar modelo
    this.http.post(`${environment.apiUrl}/api/valrep/model`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.modelList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.modelList.push({ id: response.data.list[i].cmodelo, value: response.data.list[i].xmodelo });
        }
      }
      this.loading = false;
    },(err) => {
      let code = err.error.data.code;
      console.log(err.error.data.code)
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron contratos pendientes"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });
    
    //Buscar version
    this.http.post(`${environment.apiUrl}/api/valrep/version`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.versionList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.versionList.push({ id: response.data.list[i].cversion, value: response.data.list[i].xversion });
        }
      }
      this.loading = false;
    },(err) => {
      let code = err.error.data.code;
      console.log(err.error.data.code)
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
      }
      this.loading = false;
    },(err) => {
      let code = err.error.data.code;
      console.log(err.error.data.code)
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

  goToDetail(){
    this.router.navigate([`tables/brand-model-version-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`tables/brand-model-version-detail`]);
  }
}
