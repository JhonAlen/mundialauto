import { Component, OnInit } from '@angular/core';
import {  FormBuilder,  FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

  Tarifas: FormGroup;
  currentUser : any
  alert = { show: false, type: "", message: "" };
  submitted = false
  costos : any[]
  edit = false


  constructor(
    private formBuilder: FormBuilder,
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private modalService : NgbModal,
    private webService: WebServiceConnectionService
  ) { }

  ngOnInit(): void {
    this.Tarifas = this.formBuilder.group({
      Rates :  this.formBuilder.array([]),
    });
    this.GetDataRates()
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 121
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


  }

  get Rates() : FormArray {
    return this.Tarifas.get("Rates") as FormArray
  }

  GetDataRates(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cusuario: this.currentUser.data.cusuario,
      cmodulo: 121
    }
    this.http.post(`${environment.apiUrl}/api/rates/Search`, options).subscribe((response : any) => {

      this.costos = []
      for(let i = 0; i < response.data.list.length; i++){
       
        this.costos.push({
          ctarifa_exceso :response.data.list[i].ctarifa_exceso ,
          mgrua :response.data.list[i].mgrua,
          ptasa_exceso :response.data.list[i].ptasa_exceso,
          xclase :response.data.list[i].xclase,
          xgrupo :response.data.list[i].xgrupo
        });

        this.Rates.push(
          this.formBuilder.group({
          ctarifa_exceso :response.data.list[i].ctarifa_exceso ,
          mgrua :response.data.list[i].mgrua,
          ptasa_exceso :response.data.list[i].ptasa_exceso,
          xclase :response.data.list[i].xclase,
          xgrupo :response.data.list[i].xgrupo
          })
        )

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

  newService(): FormGroup {
    return this.formBuilder.group({
      ctratamiento: '',
      cgrupo: '',
      mprecio_min: '',
      nsesiones: '',
      nclientes : ''
    })
  }
  
  addServiceEdit() {
    this.Rates.push(this.newService());
    const creds = this.Tarifas.controls.Rates as FormArray;
    //busqueda de la posicion del campo en el array
  }

  Edit(){
    this.edit = true
    const creds = this.Tarifas.controls.Rates as FormArray;

    //lista de los tratamientos segun el tipo de paquete
    this.costos= []
    for(let i = 0; i < creds.length; i++){
      this.costos.push({
        ctarifa_exceso :creds.value[i].ctarifa_exceso ,
        mgrua :creds.value[i].mgrua,
        ptasa_exceso :creds.value[i].ptasa_exceso,
        xclase :creds.value[i].xclase,
        xgrupo :creds.value[i].xgrupo      
      })
    }
  }

  onSubmit(form){
    console.log(this.Tarifas.value)
  }
  
}
