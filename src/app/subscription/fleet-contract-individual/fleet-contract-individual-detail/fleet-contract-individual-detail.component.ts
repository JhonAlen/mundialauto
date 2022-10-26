import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
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
  coberturaList: any[] = [];
  tipoList: any[] = [];
  versionList: any[] = [];
  corredorList: any[] = [];
  planList: any[] = [];
  usoList:any[] = [];
  colorList:any[] = [];
  metodologiaList:any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  status: boolean = true;

  constructor(private formBuilder: UntypedFormBuilder, 
              private _formBuilder: FormBuilder,
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
      xcolor: ['', Validators.required],
      xmarca: ['', Validators.required],
      xmodelo: ['', Validators.required],
      xrif_cliente:['', Validators.required],
      xtelefono_prop:[''],
      xdireccionfiscal: ['', Validators.required],
      xversion: ['', Validators.required],
      xserialmotor: ['', Validators.required],
      xcobertura: ['', Validators.required],
      xtipo: ['', Validators.required],
      cplan: ['', Validators.required],
      xtelefono_emp: ['', Validators.required],
      email: [''],
      xuso: [''],
      xplaca: ['', Validators.required],
      xserialcarroceria: ['', Validators.required],
      femision: ['', Validators.required],
      ccorredor:['', Validators.required],
      ncapacidad_p: ['', Validators.required],
      cmetodologiapago: ['', Validators.required],
      fdesde_pol: ['', Validators.required],
      fhasta_pol: ['', Validators.required],
      fdesde_rec: ['', Validators.required],
      fhasta_rec: ['', Validators.required],
      msuma_aseg:[''],
      mtarifa:[''],
      mprima_casco:[''],
      mcatastrofico:['']
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
    this.getUso();
    this.getColor();
    this.getCobertura();
    this.getTipo();
    this.getmetodologia();

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
            id: request.data.list[i].cmarca, 
            value: request.data.list[i].xmarca });
        }
      }
  }

async getModeloData(){
    let params = {
      cpais: this.currentUser.data.cpais,
      xmarca: this.search_form.get('xmarca').value
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
           id: request.data.list[i].cmodelo, 
           value: request.data.list[i].xmodelo });
      }
    }
  }
async getVersionData(){
    let params = {
      cpais: 58,
      xmodelo: this.search_form.get('xmodelo').value
    };

    this.http.post(`${environment.apiUrl}/api/valrep/version`, params).subscribe((response : any) => {
      if(response.data.status){
        this.versionList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.versionList.push({ 
            id: response.data.list[i].cversion,
            value: response.data.list[i].xversion,
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
    ctipoplan: 1
 
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
async getCobertura(){
    let params =  {
      cpais: this.currentUser.data.cpais,  
      ccompania: this.currentUser.data.ccompania,

    };
    this.http.post(`${environment.apiUrl}/api/valrep/coverage`, params).subscribe((response: any) => {
      if(response.data.status){
        this.coberturaList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.coberturaList.push({ 
            id: response.data.list[i].ccobertura,
            value: response.data.list[i].xcobertura,
          });
        }
      }
      },);
  }
async getTipo(){
    let params =  {
      cpais: this.currentUser.data.cpais,  
      ccompania: this.currentUser.data.ccompania,

    };
    this.http.post(`${environment.apiUrl}/api/valrep/type-vehicle`, params).subscribe((response: any) => {
      if(response.data.status){
        this.tipoList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.tipoList.push({ 
            value: response.data.list[i].xtipo,
          });
        }
      }
      },);
  }
async getmetodologia(){
    let params =  {
      cpais: this.currentUser.data.cpais,  
      ccompania: this.currentUser.data.ccompania,

    };
    this.http.post(`${environment.apiUrl}/api/valrep/metodologia-pago`, params).subscribe((response: any) => {
      if(response.data.status){
        this.metodologiaList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.metodologiaList.push({ 
            id: response.data.list[i].cmetodologiapago,
            value: response.data.list[i].xmetodologiapago,
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
        xmarca: this.search_form.get('xmarca').value,
        xmodelo: this.search_form.get('xmodelo').value,
        xversion: this.search_form.get('xversion').value,
        xrif_cliente: form.xrif_cliente,
        email: form.email,
        xtelefono_prop: form.xtelefono_prop,
        xdireccionfiscal: form.xdireccionfiscal,
        xserialmotor: form.xserialmotor,
        xserialcarroceria: form.xserialcarroceria,
        xplaca: form.xplaca,
        xuso: this.search_form.get('xuso').value,
        xtelefono_emp: form.xtelefono_emp,
        cplan:this.search_form.get('cplan').value,
        ccorredor:  this.search_form.get('ccorredor').value,
        xcedula: form.xrif_cliente,
        xtipo: this.search_form.get('xtipo').value,
        xcobertura: this.search_form.get('xcobertura').value,
        ncapacidad_p: form.ncapacidad_p,
        cmetodologiapago: form.cmetodologiapago,
        femision: form.femision,
        fdesde_pol: form.fdesde_pol,
        fhasta_pol: form.fhasta_pol,
        fdesde_rec: form.fdesde_rec,
        fhasta_rec: form.fhasta_rec,
        msuma_aseg: form.msuma_aseg,
        mtarifa: form.mtarifa,
        mprima_casco: form.mprima_casco,
        mcatastrofico: form.mcatastrofico



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