import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-financing',
  templateUrl: './financing.component.html',
  styleUrls: ['./financing.component.css']
})
export class FinancingComponent implements OnInit {

  currentUser;
  financing_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  propietaryList: any[] = [];
  vehiclePropietaryList: any[] = [];
  serviceList: any[] = [];
  replacementList: any[] = [];
  keyword = 'value';

  documento : string
  telefono : number
  correo : string
  detallecarro: string
  auth : boolean = true;
  replacement: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.financing_form = this.formBuilder.group({
      cpropietario: [''],
      cvehiculopropietario: [''],
      cservicio: [''],
      crepuesto: [''],
      xemail: [''],
      // xplaca: [''],
      // xcausasiniestro: [''],
      // xvehiculo: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 122
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
          }else{
            this.initializeDropdownDataRequest();
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

  initializeDropdownDataRequest(){
    //Propietarios
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    this.keyword;
    this.propietaryList = [];
    this.serviceList = [];
    this.http.post(`${environment.apiUrl}/api/valrep/propietary`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.propietaryList.push({ 
            id: response.data.list[i].cpropietario, 
            value: response.data.list[i].xpropietario
          });
        }
        this.propietaryList.sort((a, b) => a.value > b.value ? 1 : -1);
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

    //Buscar Servicios
    this.http.post(`${environment.apiUrl}/api/valrep/service-financing`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.serviceList.push({ 
            id: response.data.list[i].cservicio, 
            value: response.data.list[i].xservicio
          });
        }
        this.serviceList.sort((a, b) => a.value > b.value ? 1 : -1);
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
  }

  async getSearchVehicle(event){
    this.financing_form.get('cpropietario').setValue(event.id)
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpropietario: this.financing_form.get('cpropietario').value
    };
    this.keyword;
    this.vehiclePropietaryList = [];
    this.http.post(`${environment.apiUrl}/api/valrep/vehicle`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.vehiclePropietaryList.push({ 
            id: response.data.list[i].cvehiculopropietario, 
            value: response.data.list[i].xvehiculo
          });
        }
        this.vehiclePropietaryList.sort((a, b) => a.value > b.value ? 1 : -1);
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
  }

  async getSearchInfoPropietary(event){
    this.financing_form.get('cvehiculopropietario').setValue(event.id)
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpropietario: this.financing_form.get('cpropietario').value,
      cvehiculopropietario: this.financing_form.get('cvehiculopropietario').value
    };
    this.http.post(`${environment.apiUrl}/api/financing/info-propietary`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.documento = response.data.xdocidentidad
        this.telefono = response.data.xtelefono
        this.correo = response.data.xemail
        this.detallecarro = response.data.xmodelo
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
  }

  async getReplacement(event){
    this.financing_form.get('cservicio').setValue(event.id)
    
    if(this.financing_form.get('cservicio').value == 253){
      this.replacement = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
      };
      this.replacementList = [];
      this.http.post(`${environment.apiUrl}/api/valrep/replacement-financing`, params, options).subscribe((response: any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementList.push({ 
              id: response.data.list[i].crepuesto, 
              value: response.data.list[i].xrepuesto
            });
          }
          this.replacementList.sort((a, b) => a.value > b.value ? 1 : -1);
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
    }else{
      this.replacement = false;
    }
  }

  async dataReplacement(event){
    this.financing_form.get('crepuesto').setValue(event.id)
  }

  logOut(){ this.authenticationService.logout();}

}
