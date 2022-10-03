import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-fleet-contract-individual-detail',
  templateUrl: './fleet-contract-individual-detail.component.html',
  styleUrls: ['./fleet-contract-individual-detail.component.css']
})
export class FleetContractIndividualDetailComponent implements OnInit {

  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  marcaList: any[] = [];
  modeloList: any[] = [];
  versionList: any[] = [];
  corredorList: any[] = [];
  planList: any[] = [];
  coinList:any[] = [];
  usoList:any[] = [];
  colorList:any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  status: boolean = true;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private router: Router,
              private http: HttpClient,
              private translate: TranslateService,
              private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void>{
    this.search_form = this.formBuilder.group({
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      cano: ['', Validators.required],
      xcolor: [''],
      cmarca: [''],
      cmodelo: [''],
      xrif_cliente:[''],
      fnac:[''],
      xdireccionfiscal: ['', Validators.required],
      cversion: ['', Validators.required],
      xserialmotor: ['', Validators.required],
      cplan: ['', Validators.required],
      xtelefono_prop: ['', Validators.required],
      email: [''],
      xuso: ['', Validators.required],
      xplaca: ['', Validators.required],
      xserialcarroceria: ['', Validators.required],
      cmoneda:['', Validators.required],
      femision: [''],
      ccorredor:[''],
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 107
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDropdownDataRequest();
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

    this.getPlanData();
    this.getCorredorData();
    this.getMoneda();
    this.getUso();
    this.getColor();

    let params = {
      cpais: this.currentUser.data.cpais,
    };

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
            id: request.data.list[i].cmarca, value: request.data.list[i].xmarca });
        }
      }
  }

async getModeloData(){
    let params = {
      cpais: 58,
      cmarca: this.search_form.get('cmarca').value
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
      this.modeloList = [];
      for(let i = 0; i < request.data.list.length; i++){
         this.modeloList.push({ 
           cmodelo: request.data.list[i].cmodelo, xmodelo: request.data.list[i].xmodelo });
      }
    }
  }
async getVersionData(){
    let params = {
      cpais: 58,
      cmarca: this.search_form.get('cmarca').value,
      cmodelo: this.search_form.get('cmodelo').value
    };

    this.http.post(`${environment.apiUrl}/api/valrep/version`, params).subscribe((response : any) => {
      if(response.data.status){
        this.versionList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.versionList.push({ 
            cversion: response.data.list[i].cversion,
            xversion: response.data.list[i].xversion,
          });
        }
      }
      },);
  }
async getCorredorData() {
   let params={
    cpais: this.currentUser.data.cpais,
    ccompania: this.currentUser.data.ccompania,
    };
    this.http.post(`${environment.apiUrl}/api/valrep/broker`, params).subscribe((response : any) => {
      if(response.data.status){
        this.corredorList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.corredorList.push({ 
            id: response.data.list[i].ccorredor,
            value: response.data.list[i].xcorredor,

          });
        }
      }
    }, );
  
  }
async getPlanData(){
  let params =  {
    cpais: this.currentUser.data.cpais,
    ccompania: this.currentUser.data.ccompania,
    ctipoplan: 1,

    
  };

  this.http.post(`${environment.apiUrl}/api/valrep/plan`, params).subscribe((response: any) => {
    if(response.data.status){
      this.planList = [];
      for(let i = 0; i < response.data.list.length; i++){
        this.planList.push({ 
          id: response.data.list[i].cplan,
          value: response.data.list[i].xplan,
        });
      }
    }
    },);
  }
async getMoneda(){
  let params =  {
    cpais: this.currentUser.data.cpais,
    ccompania: this.currentUser.data.ccompania,

  };

  this.http.post(`${environment.apiUrl}/api/valrep/coin`, params).subscribe((response: any) => {
    if(response.data.status){
      this.coinList = [];
      for(let i = 0; i < response.data.list.length; i++){
        this.coinList.push({ 
          id: response.data.list[i].cmoneda,
          value: response.data.list[i].xmoneda,
        });
      }
    }
    },);
  }
async getUso(){
    let params =  {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
  
    };
  
    this.http.post(`${environment.apiUrl}/api/valrep/utility`, params).subscribe((response: any) => {
      if(response.data.status){
        this.usoList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.usoList.push({ 
            id: response.data.list[i].cuso,
            value: response.data.list[i].xuso,
          });
        }
      }
      },);
  }
async getColor(){
    let params =  {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
  
    };
  
    this.http.post(`${environment.apiUrl}/api/valrep/color`, params).subscribe((response: any) => {
      if(response.data.status){
        this.colorList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.colorList.push({ 
            id: response.data.list[i].ccolor,
            value: response.data.list[i].xcolor,
          });
        }
      }
      },);
  }

   onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    let params = {
        xnombre: form.xnombre,
        xapellido: form.xapellido,
        cano:form.cano,
        xcolor:this.search_form.get('xcolor').value,      
        cmarca: this.search_form.get('cmarca').value,
        cmodelo: this.search_form.get('cmodelo').value,
        cversion: this.search_form.get('cversion').value,
        xrif_cliente: form.xrif_cliente,
        email: form.email,
        fnac: form.fnac,
        xdireccionfiscal: form.xdireccionfiscal,
        xserialmotor: form.xserialmotor,
        xserialcarroceria: form.xserialcarroceria,
        xplaca: form.xplaca,
        xuso: this.search_form.get('xuso').value,
        cmoneda: this.search_form.get('cmoneda').value,
        xtelefono_prop: form.xtelefono_prop,
        cplan:this.search_form.get('cplan').value,
        ccorredor:  this.search_form.get('ccorredor').value,
        xcedula: form.xrif_cliente,
      };
     this.http.post( `${environment.apiUrl}/api/fleet-contract-management/create/individualContract`,params).subscribe((response : any) => {
      if(response.data.status){
        this.router.navigate([`subscription/fleet-contract-management-index`]);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    })
  }
}