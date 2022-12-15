import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';
//import { closeUbii, initUbii } from '@ubiipagos/boton-ubii-dc';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FleetContractIndividualAccessorysComponent } from '@app/pop-up/fleet-contract-individual-accessorys/fleet-contract-individual-accessorys.component';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { AdministrationPaymentComponent } from '@app/pop-up/administration-payment/administration-payment.component';

 import { closeUbii, initUbii } from '@ubiipagos/boton-ubii-dc';

@Component({
  selector: 'app-fleet-contract-individual-detail',
  templateUrl: './fleet-contract-individual-detail.component.html',
  styleUrls: ['./fleet-contract-individual-detail.component.css']
})
export class FleetContractIndividualDetailComponent implements OnInit {
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  clear: boolean = true;
  alert = { show: false, type: "", message: "" };
  marcaList: any[] = [];
  modeloList: any[] = [];
  coberturaList: any[] = [];
  versionList: any[] = [];
  corredorList: any[] = [];
  planList: any[] = [];
  CountryList: any[] = [];
  StateList: any[] = [];
  CityList:  any[] = [];
  colorList:any[] = [];
  metodologiaList:any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  status: boolean = true;
  cuotas: boolean = false;
  accessoryList: any[] = [];
  descuento: boolean = false;
  cobertura: boolean = false;
  ccontratoflota: number;
  ctipopago : number;
  xreferencia: string;
  mprima_pagada: number;
  fcobro: Date;
  ccarga: number;
  xanexo: string;
  xobservaciones: string;
  xtituloreporte: string;
  xnombrerepresentantelegal: string;
  xdocidentidadrepresentantelegal: string;
  xnombrecliente: string;
  xdocidentidadcliente: string;
  xdireccionfiscalcliente: string;
  xciudadcliente: string;
  xestadocliente: string;
  xtelefonocliente: string;
  xemailcliente: string;
  xrepresentantecliente: string;
  mprimatotal: number;
  mprimaprorratatotal: number;
  xpoliza: string;
  xrecibo: string;
  xsucursalsuscriptora: string;
  xsucursalemision: string;
  fsuscripcion: Date;
  fdesde_pol: Date;
  fhasta_pol: Date;
  fdesde_rec: Date;
  fhasta_rec: Date;
  femision: Date;
  plan: boolean = false
  ano;
  bpago: boolean = false;
  pagos: boolean = false;
  bpagarubii: boolean = false;
  bemitir: boolean = false;
  bpagomanual: boolean = false;
  paymentList: {};
  fnacimientopropietario: string
  fnacimientopropietario2: string;
  ctasa_cambio: number;
  mtasa_cambio: number;
  fingreso_tasa: Date;

  serviceList: any[] = [];
  coverageList: any[] = [];
  realCoverageList: any[] = [];
  annexList: any[] = [];
  accesoriesList: any[] = [];
  ccorredor: number;
  xcorredor: string;
  xnombrepropietario: string;
  xapellidopropietario: string;
  xtipodocidentidadpropietario: string;
  xdocidentidadpropietario: string;
  xtelefonocelularpropietario: string;
  xdireccionpropietario: string;
  xestadopropietario: string;
  xciudadpropietario: string;
  xestadocivilpropietario: string;
  xemailpropietario: string;
  xocupacionpropietario: string;
  cmetodologiapago: number;
  xtelefonopropietario: string;
  cvehiculopropietario: number;
  ctipoplan: number;
  cplan: number;
  ctiporecibo: number;
  xmarca: string;
  xmoneda: string;
  xmodelo: string;
  xversion: string;
  xplaca: string;
  xuso: string;
  xtipovehiculo: string;
  fano: number;
  xserialcarroceria: string;
  xserialmotor: string;
  mpreciovehiculo: number;
  ctipovehiculo: number;
  xtipomodelovehiculo: string;
  ncapacidadcargavehiculo: number;
  ncapacidadpasajerosvehiculo: number;
  xplancoberturas: string;
  xplanservicios: string;
  detail_form: number;
  xnombrecorredor: any;
  xcolor: string;
  modalidad: boolean = true;
  montorcv: boolean = true;
  keyword = 'value';
  
  constructor(private formBuilder: UntypedFormBuilder, 
              private _formBuilder: FormBuilder,
              private authenticationService : AuthenticationService,
              private router: Router,
              private http: HttpClient,
              private modalService : NgbModal,
              private webService: WebServiceConnectionService) { }

async ngOnInit(): Promise<void>{
    this.search_form = this.formBuilder.group({
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      cano: ['', Validators.required],
      xcolor: ['', Validators.required],
      cmarca: ['', Validators.required],
      cmodelo: ['', Validators.required],
      cversion: ['', Validators.required],
      xrif_cliente:['', Validators.required],
      email: ['', Validators.required],
      xtelefono_prop:[''],
      xdireccionfiscal: ['', Validators.required],
      xserialmotor: ['', Validators.required],
      xserialcarroceria: ['', Validators.required],
      xplaca: ['', Validators.required],
      xtelefono_emp: ['', Validators.required],
      cplan: ['', Validators.required],
      ccorredor:['', Validators.required],
      xcobertura: ['', Validators.required],
      xtipo: ['', Validators.required],
      ncapacidad_p: ['', Validators.required],
      cmetodologiapago: [''],
      msuma_aseg:[''],
      pcasco:[''],
      mprima_casco:[''],
      mcatastrofico:[''],
      msuma_blindaje:[''],
      mprima_blindaje:[''],
      pdescuento:[''],
      ifraccionamiento:[false],
      ncuotas:[''],
      mprima_bruta:[''],
      pcatastrofico:[''],
      pmotin:[''],
      mmotin:[''],
      pblindaje:[''],
      tarifas:[''],
      cestado:['', Validators.required],
      cciudad:['', Validators.required],
      icedula:['', Validators.required],
      femision:['', Validators.required],
      ivigencia:[''],
      cpais:['', Validators.required],
      xpago: [''],
      ncobro:[''],
      ccodigo_ubii:[''],
      ctipopago:[''],
      xreferencia:[''],
      fcobro:[''],
      mprima_pagada:[''],
      cbanco: [''],
      xcedula: [''],
      binternacional: ['']
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

      if(this.currentUser.data.crol == 18){
        this.bemitir = true;
      }
      else if(this.currentUser.data.crol == 17){
        this.bemitir = true;
      }else if(this.currentUser.data.crol == 3){
        this.bemitir = true;
      }else{
        this.bemitir = false;
      }

      console.log(this.currentUser.data.crol)
    }
  }


async initializeDropdownDataRequest(){
    this.getPlanData();
    this.getCorredorData();
    this.getColor();
    this.getCobertura();
    this.getmetodologia();
    this.getCountry();
    this.getLastExchangeRate();

    let params = {
      cpais: this.currentUser.data.cpais,
    };
    this.keyword;
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
  }
  async getLastExchangeRate() {
    let params = {};
    this.http.post(`${environment.apiUrl}/api/administration/last-exchange-rate`, params).subscribe((response: any) => {
      if(response.data.status) {
        this.ctasa_cambio = response.data.tasaCambio.ctasa_cambio;
        this.mtasa_cambio = response.data.tasaCambio.mtasa_cambio;
        this.fingreso_tasa = response.data.tasaCambio.fingreso;
      }
    },);
  }
  async getCountry(){
    let params =  {
      cusuario: this.currentUser.data.cusuario
     };
    this.http.post(`${environment.apiUrl}/api/valrep/country`, params).subscribe((response: any) => {
      if(response.data.status){
        this.CountryList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.CountryList.push({ 
            id: response.data.list[i].cpais,
            value: response.data.list[i].xpais,
          });
        }
        this.CountryList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  } 
async getState(){
    let params =  {
      cpais: this.search_form.get('cpais').value 
    };
    this.http.post(`${environment.apiUrl}/api/valrep/state`, params).subscribe((response: any) => {
      if(response.data.status){
        this.StateList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.StateList.push({ 
            id: response.data.list[i].cestado,
            value: response.data.list[i].xestado,
          });
        }
        this.StateList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  } 
async getCity(){
    let params =  {
      cpais: this.search_form.get('cpais').value,  
      cestado: this.search_form.get('cestado').value
    };
    this.http.post(`${environment.apiUrl}/api/valrep/city`, params).subscribe((response: any) => {
      if(response.data.status){
        this.CityList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.CityList.push({ 
            id: response.data.list[i].cciudad,
            value: response.data.list[i].xciudad,
          });
          this.CityList.sort((a, b) => a.value > b.value ? 1 : -1)
        }
      }
      },);
  } 
async getModeloData(event){
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
      this.modeloList = [];
      for(let i = 0; i < request.data.list.length; i++){
         this.modeloList.push({ 
           id: request.data.list[i].cmodelo, 
           value: request.data.list[i].xmodelo,
           control: request.data.list[i].control  });
      }
      this.modeloList.sort((a, b) => a.value > b.value ? 1 : -1)
    }
  }

// async getModeloData(){
//   let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
//     let params = {
//       cpais: this.currentUser.data.cpais,
//       cmarca: marca.id
//     };
//     let request = await this.webService.searchModel(params);
//     if(request.error){
//       this.alert.message = request.message;
//       this.alert.type = 'danger';
//       this.alert.show = true;
//       this.loading = false;
//       return;
//     }
//     if(request.data.status){
//       this.modeloList = [];
//       for(let i = 0; i < request.data.list.length; i++){
//          this.modeloList.push({ 
//            id: request.data.list[i].cmodelo, 
//            value: request.data.list[i].xmodelo,
//            control: request.data.list[i].control  });
//       }
//       this.modeloList.sort((a, b) => a.value > b.value ? 1 : -1)
//     }
//   }

// async getVersionData(){
//     let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
//     let modelo = this.modeloList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
//     let params = {
//       cpais: 58,
//       cmarca: marca.id,
//       cmodelo: modelo.id,
//     };

//     this.http.post(`${environment.apiUrl}/api/valrep/version`, params).subscribe((response : any) => {
//       if(response.data.status){
//         this.versionList = [];
//         for(let i = 0; i < response.data.list.length; i++){
//           this.versionList.push({ 
//             id: response.data.list[i].cversion,
//             value: response.data.list[i].xversion,
//             cano: response.data.list[i].cano, 
//             control: response.data.list[i].control,
//             npasajero: response.data.list[i].npasajero
//           });
//         }
//         this.versionList.sort((a, b) => a.value > b.value ? 1 : -1)
//       }
//       },);
//   }

async getVersionData(event){
      this.keyword;
      this.search_form.get('cmodelo').setValue(event.control)
      let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
      let modelo = this.modeloList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
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
              npasajero: response.data.list[i].npasajero
            });
          }
          this.versionList.sort((a, b) => a.value > b.value ? 1 : -1)
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
        this.corredorList.sort((a, b) => a.value > b.value ? 1 : -1)
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
          control: response.data.list[i].control,
          binternacional: response.data.list[i].binternacional
        });
      }
      this.planList.sort((a, b) => a.value > b.value ? 1 : -1)
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
        this.colorList.sort((a, b) => a.value > b.value ? 1 : -1)
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
        this.coberturaList.sort((a, b) => a.value > b.value ? 1 : -1)
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
            this.metodologiaList.push( { 
              id: response.data.list[i].cmetodologiapago,
              value: response.data.list[i].xmetodologiapago,
            });
          }

          this.metodologiaList.sort((a, b) => a.value > b.value ? 1 : -1)
        }
        },);

  }  
  addAccessory(){
    let accessory;
    const modalRef = this.modalService.open(FleetContractIndividualAccessorysComponent, {size: 'xl'});
    modalRef.componentInstance.accessory = accessory;
    modalRef.result.then((result: any) => { 

      if(result){
        this.accessoryList = result;
      }
    });
  }
  generateTarifa(){
    let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
    let modelo = this.modeloList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
    let params =  {
      xtipo: this.search_form.get('xtipo').value,  
      xmarca: marca.value,
      xmodelo: modelo.value,
      cano: this.search_form.get('cano').value,
      xcobertura: this.search_form.get('xcobertura').value,
      
    };
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/tarifa-casco`, params).subscribe((response: any) => {
      if(response.data.status){
        this.search_form.get('pcasco').setValue(response.data.ptasa_casco);
        this.search_form.get('pcasco').disable();
        this.search_form.get('pmotin').setValue(response.data.ptarifa);
        this.search_form.get('pmotin').disable();
        for(let i = 0; i < response.data.ptarifa.length; i++){
          this.search_form.get('pcatastrofico').setValue(response.data.ptarifa[1].ptarifa)
          this.search_form.get('pcatastrofico').disable();
          this.search_form.get('pmotin').setValue(response.data.ptarifa[0].ptarifa)
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONTYPENOTFOUND"; }
      else if(code == 500){  message = "Los parametros no coinciden con la busqueda"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  calculation(){
    let calculo = this.search_form.get('msuma_aseg').value * this.search_form.get('pcasco').value / 100;
    this.search_form.get('mprima_casco').setValue(calculo);
    this.search_form.get('mprima_bruta').setValue(calculo);

    let catastrofico = this.search_form.get('msuma_aseg').value * this.search_form.get('pcatastrofico').value / 100;
    this.search_form.get('mcatastrofico').setValue(catastrofico);

    let motin = this.search_form.get('msuma_aseg').value * this.search_form.get('pmotin').value / 100;
    this.search_form.get('mmotin').setValue(motin);
  }
  data(){
    let division = this.search_form.get('pdescuento').value / 100
    let multiplicacion = this.search_form.get('mprima_casco').value * division
    let calculo_descuento = this.search_form.get('mprima_casco').value - multiplicacion
    this.search_form.get('mprima_casco').setValue(calculo_descuento);
  }
  searchVersion(event){
    this.search_form.get('cversion').setValue(event.control)
    let version = this.versionList.find(element => element.control === parseInt(this.search_form.get('cversion').value));
    this.search_form.get('cano').setValue(version.cano);
    this.search_form.get('ncapacidad_p').setValue(version.npasajero);
  }
  OperatioValuePlan(){
    let params = {
     cplan: this.search_form.get('cplan').value,
     cmetodologiapago: this.search_form.get('cmetodologiapago').value,
     xtipo: this.search_form.get('xtipo').value,
 
   }
      this.http.post(`${environment.apiUrl}/api/fleet-contract-management/value-plan`, params).subscribe((response: any) => {
       if(response.data.status){
         this.search_form.get('ncobro').setValue(response.data.mprima);
       }
  });
}
 functio(){
  let metodologiaPago = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
  this.search_form.get('binternacional').setValue(metodologiaPago.binternacional);
  this.search_form.get('ncobro').setValue('');

    if (this.search_form.get('binternacional').value == 1){
      this.plan = true;
      let params =  {
        cpais: this.currentUser.data.cpais,  
        ccompania: this.currentUser.data.ccompania,
        binternacional: this.search_form.get('binternacional').value
      };
        this.http.post(`${environment.apiUrl}/api/valrep/metodologia-pago-contract`, params).subscribe((response: any) =>{
          if(response.data.status){
            this.metodologiaList = [];
              for(let i = 0; i < response.data.list.length; i++){
                this.metodologiaList.push( { 
                  id: response.data.list[i].cmetodologiapago,
                  value: response.data.list[i].xmetodologiapago,
                });
              }
          }
        })
    }  
    else{
      this.plan = false;
      let params =  {
        cpais: this.currentUser.data.cpais,  
        ccompania: this.currentUser.data.ccompania,
        binternacional: this.search_form.get('binternacional').value
      };
        this.http.post(`${environment.apiUrl}/api/valrep/metodologia-pago-contract`, params).subscribe((response: any) =>{
          if(response.data.status){
            this.metodologiaList = [];
              for(let i = 0; i < response.data.list.length; i++){
                this.metodologiaList.push( { 
                  id: response.data.list[i].cmetodologiapago,
                  value: response.data.list[i].xmetodologiapago,
                });
              }
          }
        })
    
    }
 }
  funcion(){
    if(this.search_form.get('xcobertura').value == 'RCV'){
      this.cobertura = false;
      this.modalidad = true;
      this.montorcv = true;
      this.bemitir = false;
      if(this.currentUser.data.crol == 18){
        this.bemitir = true;
      }
      else if(this.currentUser.data.crol == 17){
        this.bemitir = true;
      }else if(this.currentUser.data.crol == 3){
        this.bemitir = true;
      }

      console.log(this.currentUser.data.crol)
      
    }else{
      this.cobertura = true;
      this.modalidad = false;
      this.montorcv = false;
      this.bemitir = true;
    }
  }

  resultTypePayment(){
    if(this.search_form.get('xpago').value == 'PASARELA'){
      this.bpagarubii = true;
    }else if(this.search_form.get('xpago').value == 'MANUAL'){
      this.bpagomanual = true;
    }
  }
  
  addPayment(){
    let payment = {mprima: this.search_form.get('ncobro').value };
    const modalRef = this.modalService.open(AdministrationPaymentComponent);
    modalRef.componentInstance.payment = payment;
    modalRef.result.then((result: any) => { 
      if(result){

        this.paymentList = {
          edit: true,
          ctipopago: result.ctipopago,
          xreferencia: result.xreferencia,
          fcobro: result.fcobro,
          cbanco: result.cbanco,
          mprima_pagada: result.mprima_pagada,
          mprima_bs: result.mprima_bs,
          xnota: result.xnota,
          mtasa_cambio: result.mtasa_cambio,
          ftasa_cambio: result.ftasa_cambio,
          cbanco_destino: result.cbanco_destino,
        }

        // if(this.paymentList){
        //   this.bemitir = true
        // }

        this.onSubmit(this.search_form.value)
      }
    });
  }

  OperationUbii(){
    if (this.search_form.get('xcobertura').value == 'RCV'){
      if (!this.validateForm(this.search_form)) {
         this.bpagarubii = false
         this.search_form.get('cmetodologiapago').setValue('');
         window.alert (`Debe completar los campos de la emisión antes de realizar el pago`)
      } else {
        if (this.bpagomanual == false) {
          this.bpagarubii = true
        }
       
      let metodologiaPago = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
      let params = {
       cplan: metodologiaPago.id,
       cmetodologiapago: this.search_form.get('cmetodologiapago').value,
       xtipo: this.search_form.get('xtipo').value,
      }  
        this.http.post(`${environment.apiUrl}/api/fleet-contract-management/value-plan`, params).subscribe((response: any) => {
        if(response.data.status){
          this.search_form.get('ncobro').setValue(response.data.mprima);
        
          this.search_form.get('ccodigo_ubii').setValue(response.data.ccubii);
        }
        let prima = this.search_form.get('ncobro').value.split(" ");
       
        let prima_bs = String( Math.round( ( (parseFloat(prima[0]) * (this.mtasa_cambio) ) + Number.EPSILON ) * 100 ) /100 );
        if (((Number(prima_bs)) % 1) == 0) {
          prima_bs = prima_bs + '.00';
        }
        let orden : string = "UB_" + response.data.ccubii;
       
        initUbii(
          'ubiiboton',
          {
            amount_ds: prima[0],
            amount_bs:  prima_bs,
            concept: "COMPRA",
            principal: "ds",
            clientId:"1c134b42-70e1-11ed-ae36-005056967039",
            orderId: orden
          },
          this.callbackFn.bind(this),
          {
            text: 'Pagar'
          },
        
        );
      },);
    }
    }
  }

   async callbackFn(answer) {

    if(answer.data.R == 0){
      let ctipopago;
      if(answer.data.method == "ZELLE"){
        ctipopago = 4;
      }
      if(answer.data.method == "P2C") {
        ctipopago = 3;
      }
      let datetimeformat = answer.data.date.split(' ');
      let dateformat = datetimeformat[0].split('/');
      let fcobro = dateformat[2] + '-' + dateformat[1] + '-' + dateformat[0] + ' ' + datetimeformat[1];
       
      const response = await fetch(`${environment.apiUrl}/api/fleet-contract-management/ubii/update`, {
        "method": "POST",
        "headers": {
          "CONTENT-TYPE": "Application/json",
          "X-CLIENT-ID": "f2514eda-610b-11ed-8e56-000c29b62ba1",
          "X-CLIENT-CHANNEL": "BTN-API",
          "Authorization": "SKDJK23J4KJ2352304923059"
        },
        "body": JSON.stringify({
          paymentData: {
            orderId: answer.data.orderID,
            ctipopago: ctipopago,
            xreferencia: answer.data.ref,
            fcobro: fcobro,
            mprima_pagada: answer.data.m
          }
        }) });
        this.getFleetContractDetail(this.ccontratoflota);
    }
    if (answer.data.R == 1) {
      window.alert(`No se pudo procesar el pago. Motivo: ${answer.data.M}, intente nuevamente`);
    }
  }

  validateForm(form) {
    if (form.invalid){
      return false;
    }
    return true;
  }

  years(){
  const now = new Date();
  const currentYear = now.getFullYear();
    
  if(this.search_form.get('cano').value < 2007){
    // this.search_form.get('cano').setValue(2007);
   }
   if(this.search_form.get('cano').value > currentYear + 1){
     this.search_form.get('cano').setValue(currentYear);
   }

 }

  Validation(){
    let params =  {
      xdocidentidad: this.search_form.get('xrif_cliente').value,
      
    };
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/validationexistingcustomer`, params).subscribe((response: any) => {
      if(response.data.status){
        this.search_form.get('xnombre').setValue(response.data.xnombre);
        this.search_form.get('xapellido').setValue(response.data.xapellido);
        this.search_form.get('xtelefono_emp').setValue(response.data.xtelefonocasa);
        this.search_form.get('xtelefono_prop').setValue(response.data.xtelefonocelular);
        this.search_form.get('email').setValue(response.data.xemail);
        this.search_form.get('ccorredor').setValue(response.data.ccorredor);
        this.search_form.get('xdireccionfiscal').setValue(response.data.xdireccion);
        this.CountryList.push({ id: response.data.cpais, value: response.data.xpais});
        this.StateList.push({ id: response.data.cestado, value: response.data.xestado});
        this.CityList.push({ id: response.data.cciudad, value: response.data.xciudad});
        this.search_form.get('cpais').setValue(response.data.cpais);
        this.search_form.get('cestado').setValue(response.data.cestado);
        this.search_form.get('cciudad').setValue(response.data.cciudad);

      } 
    },);
  }

  getPaymentMethodology(cmetodologiapago) {
    let xmetodologiapago = this.metodologiaList.find(element => element.id === parseInt(cmetodologiapago));
    return xmetodologiapago.value
  }

  async onSubmit(form){
    this.clear = false;
    this.submitted = true;
    this.search_form.disable();
    this.loading = true;
    if (this.validateForm(this.search_form) == false) {
      closeUbii();
     
    } else {
      if (!this.ccontratoflota) {
        this.submitted = true;
        this.loading = true;

        let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
        let modelo = this.modeloList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
        let version = this.versionList.find(element => element.control === parseInt(this.search_form.get('cversion').value));
        let metodologiaPago = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
        let params = {
            icedula: this.search_form.get('icedula').value,
            xrif_cliente: form.xrif_cliente,
            xnombre: form.xnombre,
            xapellido: form.xapellido,
            xtelefono_emp: form.xtelefono_emp,
            xtelefono_prop: form.xtelefono_prop,
            email: form.email,
            cpais:this.search_form.get('cpais').value,
            cestado: this.search_form.get('cestado').value,
            cciudad: this.search_form.get('cciudad').value,
            xdireccionfiscal: form.xdireccionfiscal,
            xplaca: form.xplaca,
            cmarca: marca.id,
            cmodelo: modelo.id,
            cversion: version.id,
            cano:form.cano,
            ncapacidad_p: form.ncapacidad_p,
            xcolor:this.search_form.get('xcolor').value,    
            xserialcarroceria: form.xserialcarroceria,
            xserialmotor: form.xserialmotor,  
            xcobertura: this.search_form.get('xcobertura').value,
            xtipo: this.search_form.get('xtipo').value,
            msuma_aseg: form.msuma_aseg,
            pcasco: this.search_form.get('pcasco').value,
            mprima_casco: form.mprima_casco,
            mcatastrofico: form.mcatastrofico,
            msuma_blindaje: form.msuma_blindaje,
            mprima_blindaje: form.mprima_blindaje,
            mprima_bruta: form.mprima_bruta,
            pcatastrofico: this.search_form.get('pcatastrofico').value,
            pmotin: this.search_form.get('pmotin').value,
            mmotin: form.mmotin,
            pblindaje: this.search_form.get('pblindaje').value,
            cplan: metodologiaPago.id,
            cmetodologiapago: this.search_form.get('cmetodologiapago').value,
            femision: form.femision,
            ncobro: form.ncobro,
            ccodigo_ubii:form.ccodigo_ubii,
            ccorredor:  this.search_form.get('ccorredor').value,
            xcedula: form.xrif_cliente,
            ctipopago: this.ctipopago,
            xreferencia: this.xreferencia,
            fcobro: this.fcobro,
            mprima_pagada: this.mprima_pagada,
            xpago: this.search_form.get('xpago').value,
            payment: this.paymentList
          };
        this.http.post( `${environment.apiUrl}/api/fleet-contract-management/create/individualContract`,params).subscribe((response : any) => {
          if (response.data.status) {
            this.ccontratoflota = response.data.ccontratoflota;
            this.fdesde_pol = response.data.fdesde_pol;
            this.fhasta_pol = response.data.fhasta_pol;
            this.fdesde_rec = response.data.fdesde_rec;
            this.fhasta_rec = response.data.fhasta_rec;
            this.xrecibo = response.data.xrecibo;
            this.fsuscripcion = response.data.fsuscripcion;
            this.femision = response.data.femision;
            if (this.bpagomanual || this.search_form.get('xcobertura').value != 'RCV') {
              this.getFleetContractDetail(this.ccontratoflota);
            }
          } else {
            closeUbii()
          }
        },
        (err) => {
          closeUbii();
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

  }

  async getFleetContractDetail(ccontratoflota) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params =  {
      cpais: this.currentUser.data.cpais,  
      ccompania: this.currentUser.data.ccompania,
      ccontratoflota: ccontratoflota
    };
    await this.http.post(`${environment.apiUrl}/api/fleet-contract-management/detail`, params, options).subscribe( async (response: any) => {
      if(response.data.status){
        this.ccarga = response.data.ccarga;
        this.xpoliza = response.data.xpoliza;
        this.xtituloreporte = response.data.xtituloreporte;
        this.xanexo = response.data.xanexo;
        this.xobservaciones = response.data.xobservaciones;
        this.xnombrerepresentantelegal = response.data.xnombrerepresentantelegal;
        this.xdocidentidadrepresentantelegal = response.data.xdocidentidadrepresentantelegal;
        this.xnombrecliente = response.data.xnombrecliente;
        this.xdocidentidadcliente = response.data.xdocidentidadcliente;
        this.xdireccionfiscalcliente = response.data.xdireccionfiscalcliente;
        this.xciudadcliente = response.data.xciudadcliente;
        this.xestadocliente = response.data.xestadocliente;
        if (response.data.xtelefonocliente) {
          this.xtelefonocliente = response.data.xtelefonocliente;
        } else {
          this.xtelefonocliente = ' ';
        }
        if (response.data.xemailcliente) {
          this.xemailcliente = response.data.xemailcliente;
        } else {
          this.xemailcliente = ' ';
        }
        if (response.data.xrepresentantecliente) {
          this.xrepresentantecliente = response.data.xrepresentantecliente;
        } else {
          this.xrepresentantecliente = ' ';
        }
        this.xsucursalemision = response.data.xsucursalemision;
        this.xsucursalsuscriptora = response.data.xsucursalsuscriptora;
        this.ccorredor = response.data.ccorredor;
        this.xnombrecorredor = response.data.xcorredor;
        this.xnombrepropietario = response.data.xnombrepropietario;
        this.xapellidopropietario = response.data.xapellidopropietario;
        this.xtipodocidentidadpropietario = response.data.xtipodocidentidadpropietario ;
        this.xdocidentidadpropietario = response.data.xdocidentidadpropietario ;
        this.xdireccionpropietario = response.data.xdireccionpropietario ;
        this.xtelefonocelularpropietario = response.data.xtelefonocelularpropietario;
        this.xestadopropietario = response.data.xestadopropietario;
        this.xciudadpropietario = response.data.xciudadpropietario;
        this.xocupacionpropietario = response.data.xocupacionpropietario;
        this.xestadocivilpropietario = response.data.xestadocivilpropietario;
        this.xemailpropietario = response.data.xemailpropietario;
        this.xtelefonopropietario = response.data.xtelefonopropietario;
        this.cvehiculopropietario = response.data.cvehiculopropietario;
        this.ctipoplan = response.data.ctipoplan;
        this.cplan = response.data.cplan;
        this.cmetodologiapago = response.data.cmetodologiapago;
        this.ctiporecibo = response.data.ctiporecibo;
        this.xmarca = response.data.xmarca;
        this.xmoneda = response.data.xmoneda;
        this.xmodelo = response.data.xmodelo;
        this.xversion = response.data.xversion;
        this.xplaca = response.data.xplaca;
        this.xuso = response.data.xuso;
        this.xtipovehiculo = response.data.xtipovehiculo;
        this.fano = response.data.fano;
        this.xserialcarroceria = response.data.xserialcarroceria;
        this.xserialmotor = response.data.xserialmotor;
        this.xcolor = response.data.xcolor;
        this.mpreciovehiculo = response.data.mpreciovehiculo;
        this.ctipovehiculo = response.data.ctipovehiculo;
        this.xtipomodelovehiculo = response.data.xtipomodelovehiculo;
        this.ncapacidadcargavehiculo = response.data.ncapacidadcargavehiculo;
        this.ncapacidadpasajerosvehiculo = response.data.ncapacidadpasajerosvehiculo;
        this.xplancoberturas = response.data.xplancoberturas;
        this.xplanservicios = response.data.xplanservicios;
        this.mprimatotal = response.data.mprimatotal;
        this.mprimaprorratatotal = response.data.mprimaprorratatotal;
        if(response.data.fnacimientopropietario){
          let dateFormat = new Date(response.data.fnacimientopropietario);
          let dd = dateFormat.getDay();
          let mm = dateFormat.getMonth();
          let yyyy = dateFormat.getFullYear();
          this.fnacimientopropietario = dd + '-' + mm + '-' + yyyy;
        } else {
          this.fnacimientopropietario = ''
        }
        this.serviceList = response.data.services;
        this.coverageList = response.data.realCoverages;
        await window.alert(`Se ha generado exitósamente la póliza n° ${this.xpoliza} del cliente ${this.xnombrecliente} para el vehículo de placa ${this.xplaca}`);
        try {this.createPDF()}
        catch(err) {console.log(err.message)};
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.FLEETCONTRACTSMANAGEMENT.FLEETCONTRACTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  onClearForm() {
    this.search_form.reset();
    this.search_form.enable();
    this.clear = true;
    if (this.ccontratoflota) {
      location.reload()
    }
  }

  changeDateFormat(date) {
    if (date) {
      let dateArray = date.substring(0,10).split("-");
      return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
    }
    else {
      return ' ';
    }
  }

  buildAccesoriesBody() {
    let body = [];
    if (this.accesoriesList.length > 0){
      this.accesoriesList.forEach(function(row) {
        let dataRow = [];
        dataRow.push({text: row.xaccesorio, alignment: 'center', border: [true, false, true, false]});
        dataRow.push({text: row.msuma_accesorio, alignment: 'center', border: [false, false, true, false]})
        dataRow.push({text: row.mprima_accesorio, alignment: 'center', border: [false, false, true, false]})
        body.push(dataRow);
      })
    } else {
      let dataRow = [];
      dataRow.push({text: ' ', border: [true, false, true, false]}, {text: ' ', border: [false, false, true, false]}, {text: ' ', border: [false, false, true, false]});
      body.push(dataRow);
    }
    return body;
  }

  buildAnnexesBody() {
    let body = []
    if (this.annexList.length > 0) {
      this.annexList.forEach(function(row) {
        let dataRow = [];
        dataRow.push({text: row.xanexo, border: [true, false, true, false]});
        body.push(dataRow);
      })
    } else {
      let dataRow = []
        dataRow.push({text: ' ', border: [true, false, true, false]});
        body.push(dataRow);
    }
    return body;
  }

  buildCoverageBody2() {
    let body = [];
    if (this.coverageList.length > 0){
      this.coverageList.forEach(function(row) {
        if (row.ititulo == 'C') {
          let dataRow = [];
          dataRow.push({text: row.xcobertura, margin: [10, 0, 0, 0], border: [true, false, false, true]});
          //Se utiliza el formato DE (alemania) ya que es el que coloca '.' para representar miles, y ',' para los decimales fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
          dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.msumaasegurada)}`, alignment: 'right', border:[true, false, false, true]});
          if (row.mtasa) {
            dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.mtasa)}`, alignment: 'right', border:[true, false, false, true]});
          } else {
            dataRow.push({text: ` `, alignment: 'right', border: [true, false, true, true]});
          }
          if (row.pdescuento) {
            dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pdescuento)} %`, alignment: 'right', border:[true, false, false, true]});
          } else {
            dataRow.push({text: ` `, alignment: 'right', border: [true, false, true, true]});
          }
          if(row.mprima){
            dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.mprima)}`, fillColor: '#f2f2f2', alignment: 'right', border:[true, false, true, true]});
          } else {
            dataRow.push({text: ` `,fillColor: '#f2f2f2', alignment: 'right', border: [true, false, true, true]});
          }
          body.push(dataRow);
        }
        if (row.ititulo == 'T') {
          let dataRow = [];
          dataRow.push({text: row.xcobertura, decoration: 'underline', margin: [2, 0, 0, 0], border: [true, false, false, true]});
          dataRow.push({text: ` `, fillColor: '#d9d9d9', border:[true, false, false, true]});
          dataRow.push({text: ` `, fillColor: '#d9d9d9', border:[true, false, false, true]});
          dataRow.push({text: ` `, fillColor: '#d9d9d9', border:[true, false, false, true]});
          dataRow.push({text: ` `, fillColor: '#f2f2f2', border:[true, false, true, true]});
          body.push(dataRow);
        }
      });
    }
    return body;
  }

  createPDF(){
    try{
    const pdfDefinition: any = {
      info: {
        title: `Póliza - ${this.xnombrecliente}`,
        subject: `Póliza - ${this.xnombrecliente}`
      },
      footer: function(currentPage, pageCount) { 
        return {
          table: {
            widths: ['*'],
            body: [
              [{text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', border: [false, false, false, false]}]
            ]
          }
        }
      },
      content: [
        {
          style: 'data',
          table: {
            widths: [165, 216, 35, '*'],
            body: [
              [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjUAAADXCAYAAADiBqA4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEEdSURBVHhe7Z0HeFRV+ocTYv2vru6qa19WBZUqgigI9rL2gm1dK4qigih2RRHrWkEBG6ioWEBUUIqKgBQp0qsU6b1DElpmJnz/8ztzz3Dmzs1kWkLm5vc+z/eEzNw+IefNd75zTo4QQgghhPgASg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqamkFG/dKtunjpfCX/pJ4Y9fS8GAnlLww0dSOOgT2TK0l2z9ra9snzxEgmuXOnsQQgghFRtKTSWgeMcO2TJliqz7sqcsf/YJWfjfy2XBOXVk8YV1ZMkVdWXZtfVk+c31ZGXzk2Vly/qyunUDWd22gax55BRZ+3hDWffcubL5w/tky09dZceMYRLatMo5MiGEEFJxoNT4mI3DRsicO+6WSbVqy5TaNWT6yTXl' +
              'j1NrybymtWThubVl8SV1ZOlVJ8myG+vJitt3Cc2ah5XMPKFk5ulTZf2zkBr19QUVL54WDvXvDZ0ul63DP5Tiwg3O2QghhJDdC6XGZwTzC2Tpux/L+Ebny+gjj5ffjzlBJlY/UabU2iU1f57hSM2ldWXZNXXDWZo7ldC0qr9LaJ5pGJaX/50mG19tJBvfUF/fVF87OaH+veH101Q0lYK+7SWwbIZzBYQQQsjugVLjE7bMXSB/tHlahh9eV379ezUZcUh1+U1Jzbh/nSATlNRMrqmkpp6H1FxbT1bcoqTmLiU0bRrI2kdPCWdoIDSvOCLzdiPZ1LWxbHrvdNn0/umyuZv6t/qqv1ev431Iz+ZPbpftUwfIzuKQc1WEEEJI+UGpyXJ2hkIy/+WuMnj/E2Xw/x0nQ/Y/Tob9TUnNwdVl1OHHy9h/Hi/jjztBSc2JMq1eDZlldz8ZqbnN6Xp6UEnNEw1lfQcnQ6OEZlOXsMDkf6hkpof6+lkTKei5K/I/aSKbP3ZEB4LTqZHkf9pcgusWOldICCGElA+UmnJgc3CnzN5WLBMKQzK+ICQztxTL+sBO593UKZz9p4xtcpX8vM9xkRiy33Ey9K/VZPhB1WTkYdVl9FFKao49QSadeKJMrVNDZp5SQ+Y0qSkLzgnX1KD7SWdqIDVtG8i6J8M1NLrLCRkaZGaUtGiJ6aXim6ZS+K2Kvk3Cof5d0EfFV0pwlPBAfpDB2dj5TNk2rqfs3Jn+fRJCCCGJQKkpI/JDO+VXJTAdVwWkw/KAPLs0IO2XBKTdYhULA/LUgoA8r6L/2pCsLUqu4YcoLHyzm/xyQI0ooUEM/ouSmv2Pi+mC0nU1tWvIjAY1ZXbjmjL/rFqy6KI6srTZSVFSs7bdKbrrCd1JyLxs7t44nJ3p7UhMfyU0A8+XLYMulC0/XqK/6u8HnCUF/c4ICw4yOMjsvNtI8r+8S0IbljhXTgghhJQdlJoMU6yEY1RhSF5aGZDnVuwSmmcgM5bQPP5nQB6bF5BH5wbkkdlB' +
              '+X51SALFpcvNtsXLZdzZ18XITCTQBbXfcTLswGoyXHdBVY/qgjJ1NfPOrCWLLwiPflp+U7imBt1PyNQYqYGU6CzNV+GMDMRFi8zgZrJ16I2ybdjNsvXX28Jfh9wgW3++Iiw53zvZGyU3kKJN750t2yf1ce6AEEIIKRsoNRlki5KSD9cF5fkkhOZhJTQP/RGUtjOD8sLcoKzdUbLYbF20VEZUb+otM1bobM1fq+lszchDw11QGAUV3QUVrqtZclldWX7DSeHRT63DNTW6+8lITQ8lNeh26ndGODvzy7VhkRnRUrb/1ka2jW6rQ/975L36PWwTkZveSmzUMXCsbaO7O3dCCCGEZB5KTYYoDO2Ud9YGUhaaNjOCcv/0oLRT/16zPVZsEhUaHTHZmuNlXNXjZUI1ZGtqyIz6NWV2o11dULqu5raTZdW94dFPKBRGTY3ufkKmRkkNBAVZGp2hgdCMeVi2j28vOyY+Lzsmvahj+4QOsn3cE1pwtg5vruWmcMA54bobZG26NZbtYyk2hBBCygZKTQbIlNDcPzUoracE5fFpQVltiU1SQuOEXVvjztZMq1tDZjUMj4JadH5tWXKl1QWFYuGnndFPbzfStTG6+wlS89NluqsJ0rLj96ekaPL/pGj621I08x0pmvV++Cu+V6/jfZ29UdtjP521QTGxOt6asd10Nx0hhBCSSSg1aZJpobl3UlDumRiUR9X3q7ftTEloTLhra7yyNQvOdkZBXaukpvnJkS4oXVeDId3vh0c+oUgYmRojNcjKFE3rJEV/dJPAvM+laH5vHYE/v5SiOZ/IjhldwtmbsY/JthEtdB0Oiox1d9THp8u00R9QbAghhGQUSk0alJXQtJyg4vegPDK+SL5v+h9PYUkkzLw1ZiSUmWHY1NZ4ZmtahmcVxozCkS4o1NX0aaq7klAQvH1UK931pKVGCUxg4bcSWjJIgsuGhGPxAAks6COB2R/pbbAt6m10rQ1GSTliM3lsD4oNIYSQjEGpSZGyFpq7xwXljrHq' +
              '3/2Wy1fHnuUpLYmEKRo289ZEjYTCsgmnWbU1mIjvdle2plMjXQtjuqAwwgmZF9TO7Jj6hpaa4KJ+Elo+TIJrxkto3WQJrZ0owZWjwnIz73OdtdH1NkqGIEWQI4jNxh5nyNBF0yg2hBBCMgKlJgXKS2juGB2U5r8F5bbeS+WLqmd4SkupYRUNm1mG7XlrZjaoqSfjMyOhsLjlqhZObc0zDfVSCZFsDSbeG3h+uFh4dFvdvYRaGmRlIDUQmuLN86W4YIkUb5oXlpulg3W3lC02dsZmSa8bpN/GLRQbQgghaUOpSZLyFppbRwbllhFB+W/PxfJZ1dRqa+xuKF00bHVD6aJhZz0oM28NJuNbdU94JJQZ3m1qa/TQbhQMO9kadC8hG6O7n9aMl535C2Xnjo1SXJSv5Qaigy4p1NposTFdUabG5qsmMmJoR+mzKUixIYQQkhaUmiRwC037ZbFC8+T8WKF5eFas0Nw3OVZoWkBmXEJz6/Cg3KzixmFBufrDhfLp0U08xaW0iJq7xt0NhQn5SuiG0pPxvaik5q1GeiI9PbxbyQiyLbq2BgXDGPU0v3c4W7N+muzcskKKQzu02EBydLeUkp6iuZ+Fa2yUDOniYYyK6ttE8ns2lY9mTpTeGyg2hBBCUodSkyC7W2j+M1TFL0G5qPN8+SRFsSlpNNSUWruWT9BrQl1qTciHWYadId5Y3FLPW2OKhofeGB7ebXdDrRihxUZ3QW1bK8WFy6R4wwz9OgqKMVoKQ771pH3DbtbdWejWWtzrWnlxcYF8uS4oIYoNIYSQFKDUJEBFEZrrBgflmp+Dcs6rf8onR6UgNqa+Bqt4Y12oI3bV1+iZhnV9jTPT8BVKbJy5azxHQzn1NRATd32NHgGF7MzGWVK8aY6WnNCq0bpw2GRrMI8NJvHT3VDOHDaDh3TRz/SLNRQbQgghyUOpKYWKJjTX/BiSqwcGpdFzc1MSm6SHed/sDPN+5BRZ/2xYbPRClZ84K3Y7hcM6YzPxed0VhRobCIzujlIy' +
              'owOjoxb/EBkNhW2xD/Y12ZrVn18kz84v1DVJn62k2BBCCEkOSk0cKqLQNBsUkisHhOSyH4JycrvZ0iMVsfFYG2r8saUXDhux2fB6eF2oKLFxzV+j56iZ31sP94bgaKFZ0EdnaiIT8415OLycwk+X6QLk/M9Pl69G9o08z0+WU2wIIYQkDqWmBCqy0Fyh4vL+Ibnw26DUfniW9DgyTbE5bJfYTK6hxKZejeiVvJvFio17Yj69gvfgZuFRUWMfC3dHYckE1NDM+STc7YSvWE4B3U/I1BipsWYbntv7Vv08H5kTfp4fLw1RbAghhCQEpcaDbBCaS74PyaX9QnJO76Ac33qmfJyG2MRMzKfERo+IKkVs9Bw2pnjYLHpp1odC1gYT9GHByymvapHRMjP1DS08Zm0oIzV63holR8j+vD1uon6ebdXzfEA9xw8XVW6xCYWKZebsZRmJHTsCzlH9zabNW2T5yg1xY83azc7W5Usi17Y5f6uzNSEkGSg1LrJJaP7dV8W3ITnjs6D8q+UM+fiI5MUGhcNhsakuo7yGettic5VVY4PiYTMqCsO9Mesw1oj6NjwyCqKy9dfb9Jw0ekVvCI4SGS0zGNKN0U8jWkYWvIxIzWdN5Ldv20WEps208Hw+HyyovGKDBi7noJsyEnPmrXCO6m8efKqn5/3bse+Rt5e72BQXF0vNxo95Xo8dTz7fy9mDEJIMlBqLbBSaC78JyXlfh+TU7kE5+o7p8lGKYqOHervFxpWxiVnR+8EGsrbdKXoeG7345Xunh7ujeoUn6UOtjZaboTfqjIyWGCU5+uuIFmGhQZZm0IXhEVC9m+hMzfoPzpCnJqyOCA2eJZ7ju/Mqp9jsVPeMxrCoKCjz5q+Srt0HS9WT2ng2hogDj7lLPvr8V5k1Z5ls21ak98UxTFQGAoGgLFuxXj74ZKiccNojns8JUd7y0HfABM/r+L+jmsvjz30lE6cslLXr8iUYDDl7EEKSgVLjEE9onloUKzSm5sMWGjTCbqG5e3ys0Nw+' +
              'KlZobhwSKzRXD4wVmksgMy6hOa9XSM5RcVLnoBxxc+bFBjU2pnh4wXnh4d5YTkHPY4N1oh5vKOs7nKrrbDa+Hc7aIOMCSdFyg8zNj5fodaP0EgkIyAwyNBCa/k11hgfDuiFFkKPuPw+KEho8x7vUc+wyhzU2YOHiNXLI8fd4NpBDhs9wtiJgxh9LJe+Qmz2f1V+rttDdQeUBhLLh+c94Xkfbdj2drQgh6UCpUfhBaM78IiRNPw9JjVeDcuh/p8uHaXVFRRcPR0ZFNawVmccGE/Qtvf4kPfPwqnvDdTbojtJZGyyrgCLi7o7coN4G0gLBwWzEKCpWoYuD8RreU9tg2/wPT9cjqwZ83THqOUJo8AybjwlK5z8oNqDFA91jGsf9q96psxQkmuMatI15ViZefLOvs1XZ8ouSTa/zI1556wdnK0JIOlR6qfGT0DT9LCSNPg1J1Q4B+ccNmRMbex4bswDmgrNr6yUVUECs62wwSV8bZ3XvDuFaG90lBbnp5oySwtpRXzkZHBOQmc9PjwgNsjTI9kzqdles0PwWfoZYC6vTTCU2xZVbbHp8OSKmcazd5HHnXWJz8tlPxTwrEwdVaylbtmx3tiw7zrnyRc/zI55gDQ0hGaFSS01+cKd0VvLy2soi3wjNqZ+o+DgkRz4ekIOvmS7dD09ebGLmsXEm6DMre8+oX1NmNwqvFYUCYj37MJZVaO5kbVBEjDWjLLmBqOiaG3RNIRvzcbj+Bl/19+p1IzTI9Kx87Wz1DIs8hcY8vzemVW6x+eaH32Max5POfNJ5l9gYqTmiVis5rMZ9Mc+t03uDnC3LhjHj50XO1eDcdlHnRtzd9kNnS0JIOlRaqYHQ/G9+UB5QcvLEjG3y3LIi3whNw49CcnK3oBzcJiAHXT1duqUpNnpJBSU2WFJhghKbyTVr6AJi1Nlg9mHdHXVJHVl2jZKbm+vJqhb1ZXWr8CzEEbl5SckNam6QvXlLRRclMV2dUP/WMtOpkZ7YDyK0/oVTpd2QuSUKzQ3q+V2v' +
              'nt+rUyqv2Hw3YHxM41jvLEqNF8fWf1A/H9S0vNa5f8xzO7JW6zId7n75f9/Q50FW6Ot+42LOf+3tbztbEkLSoVJKjS00GDYMMXlgYqG0X1TkC6Gp3z0k9bqFpM67QTng7oD8/UolNoelKDZYUsFZK2rU4cdHFxDXDXdHYSFMO2uja21ucUZItQ5nbtAthfWj1j0XrruBuGCeGy06KvBvLTPqPUgQ6nPe6d0vrtCYZ/fKxMopNpSaxPn7cXfr53NBs/9JQcE2+duxd8U8u26fDnO2zizTZi6JnOO5176V0b/PjTov4tyrXnK2JoSkQ6WTms0uobFH2LQck+8boTnpg5DUei8kNd4Kyl9uDciBl6UoNs5aUZHVva06m4knhLujpp/sDPtuWkuv8o1aGz30+wYlN7edrDM36JbCEHBkbyA4GAoOycEkfia09CiZQXZn7aOnSN8uL5cqNHh2eG4vTah8YkOpSQyMOqpycHj0k8mIPPvKNzHPDsXEZTGU+sa7uurjY9j2+g0F8sfc5THn5udGSGaoVFITV2iUkNw5JiB3jtrsG6Gp825IanYNyXGvBWWfGwOy/8XT5f0UxMas7m3X2US6o6qFJ+qLZG0a1dRz2mDoN7qkMGFfJHPT/GQ9cZ/ummqjJKdtWHK06CiJ0f9++JTw6+r9X15+JCGhMc/t+d8rl9hQahIDmRnzfDBiDEAu/nL0HVHPDvFFn9H6/Uzx54JVEaHChIBg5aqNMef9Z902+j1CSHpUGqkpTWggJLcrGbllREBuGbrBN0JzYpeQHN85JEe9EJS9rgnJfv+eKe8dmoLYqHDX2US6o451sja1nFobPfQ73CVl5AaZm2XX1tPz2xjBQQYHkoOlF5DJ0aH+jdfQdTW0/f0JC83F/dTz+i4k7cdUHrHJRql5+JnP5ZTzno7EipUbnXfKjqXL10eeD85veKT9F1HPDoHRY5isMFPc9WB42P0e/7hFXwfYvr0o5rz7/fMO/V5pXH9HZ6nR6NGE4u0PfnL2Sox2' +
              'L37teRx3GDEEg36ZKh3fHeQZv0+a72yVGnP/XOl5XHd07rbrPrHPeHXeYSNnSf+fJuv6pU++GiHvfTxEF4Nj6HyHV7+Vp1/6Wp56obeefBEjz/D9869/pyetHDF6tl6qIt2fg42btsiCRWsSinTquXp9Nzbq/xQmeEwVzLDtdX3xorCw7EcOJkOlkJpEhcZ0dVz7c0BuGLReC82DkJkEhAbzp7iF5qZfY4Xm2p9ihebSH2KF5oI+sUJzZs9YoWnwYazQ1HonWmiOe0tFx2I59OmQ5F0ekn0vSENs7O6og6qHh307WRvU2pih3zPqhwuJjdzoYuILldxcVldnbyA46J7C7MSQHHRTRUJ9j4Lj4Y+2SEpoznMk8JlRIQlWArHJRqm595GPo6731bf7O++UHdNnLY2cDw2XARmTvQ+/Lep6EP0GTnS2SA80jHseeqs+5m33ve+8GsbrvJgxujTQ0K5bXyA/DZ0m1U55KOYYV9z0pkyaujChY7lB1xsaNfxcnX/1y1HHhXRBkhYvXafXIjNg7p32//tGGv/7Wcm1tjf7jJ0wz9kyeeYvXK3PCflseslzUcfe54jb5fZW7+ufnw97/ursEZa+C695RRd+29sj8MwhQD17j9Kyg8a/z/fj9PcvdeynPyPcB64b22Nixhvu7CxffTtG8guSX4vr869/k7pnPBFzHXZgZnBcLzJ6qeIeBYm6sVR5o+tAfT1H1b4/6ph2HHrivXLW5S/IJTe8Jpf+53UtgRUJ30tNskIDEcFyBZf0DUizfmt9IzRVVRzxRrEc+LASm0tCsve5M+Wdf6QmNu7uKDtrg1qb8AipaLlBMbGekRjz25wfrrvBBH66sBhdVM2U6FxTNxL4fuS9tyYtNHheZ30VkieH+19ssk1q0NAeXL1l1PXiL/+yXrph1Ng5kfPZf9UDt2QhTj3/mYxcE2YJNsfEkhU2XsPKV63e5LybGJg52t4fxdCZmnhx69YdUuv0XWtUISNTGpi52UicCSzZMWX6YmeL1MHn' +
              'gcyKOS4+03hg+y7df466lgP+1cJ5Nz5YWgSyc9UtHSNdh5AoLGORyuzTi5aslRMbRS/Vsddht+pMUiZodmunqGNDLk1WMFXw/Hr3HRszE/ct975b4Zfw8LXUpCo0NzgCcuYXQbmyzxrfCM1hr6t4tVj2vTckuReFZK+zZkrXVMVGBbqjorI2Tq1NpEvKkhsUE6NbCjU3mJVY190owUEGB5KDLA5ER8vOJeGvQ1s0jwgN1sByCw2emZfQoIuusXpejw/zt9hkm9R8P2hizPUixk3809mibEDjYc71aa+RzqthsNyE1xIKyECkA7IpKAzGsa68+U3n1V24GzmEW3xKAxMG2vujEc4kj3X4Uh8XApao5Jkshx0Q2WTvzQvIAY6HjEsi14Nt7KVEEpUaG3Rl2dkWiKP7ZygR3BNlYoh/JtiwsTBGJBHIPGWCs6+InjCyrP+vZgLfSk1JQmMvLhlPaK5WAgL5qP9+QC7rtcY3QnPgK8Wy3/+KZa/bldhcEJK8M9ITm5iszcFWl1RVD7mpV1NmNHCyN1pwaupRU5AcdFPpOhwlO4iBd7RMSmhMzRGEBs+rYY+QPPyLf8Um26Tmmtve0tdoZzAQ9zz8kbNF2YDuBXMur66lW+99L+p6EJj9Nx2eeblP5FiYeM8Nujns8yFKyz64QTeQvT9GWWUSNN44bjLDzY3U1Gn6eNS1QYywGGs6oO4Ex4IsJgqu3VxDKlIDkP1C15Q5DgI1OImKHoAc2fvb3aDp8O5Hv+jjoZvs8JqtIsdH12Qy11cSDzz5WeSYiHQzQOWBL6UmU0KjG9C+Qan+ekAu/XK1b4Rm/5eKZZ8XQlLlP0pszgvJnumKjQo7axPpknLJDbqlUHODgmJbcGaeEl4w84/TwqOn0FWF+OaO+9MSGvOs2v7sT7HJJqnBX5RIuSONvzl/qy5oNNeMxgYp/7LC7oYY/tsfzqu7wBBrdz0IwktGEgH1F+h2wTHOvOx559VoLr7+1ZjzIZOVDKivsff/792ZlRqzovi/' +
              'r33FeaV0jNRghXS7+wpxdJ37dU1OqkAucJxkpOai63Y951SlBuBZQxzMsRCPPvul827pTJ62KGrfTNWSNbowLMeosTKZNRO/jZvrbJU6KKy3j4k6sYqO76QmGaHByJp4QnNpv3ADekGfoBz1TEAu+Wy1L4Rm3xeLZc8X1NcOIcm7WonNuSHZo6kSm0PSExtkbcyEfV5yY2puUFCM0VKYwM8IDoaEa8mpHxYdxMct26ctNHhO9d4PyQPqc/Cb2GST1GD0Ca7vPy266O+7dh8cdd0oxiwrXnijb+Q8JdV3mCySHZfd+LrzbnKgwTLHKKkWBQJinwuBLopkKGupMd2FqUgNRnihENtdzIy5gFId8ZaK1NjymI7UAEwNYGdDED8OKb3WCLilBrNapwtGeuFYyIKhzsU9/5E9Si1VKDW7mbIQGkgHGs+mnwXlkLYBueDjVb4Qmv97Phx7Pq2k5jIVZ4dkr8YzpUu6YqNCj5BClxTk5m+75AbdUqbmBqOlIoLjZHAgOViCAaKDSf1eeLZXRoTGDG9vrT4LP4lNNkmN6W4ZOHiK/t5kbsx1Y8RFWWH/YkYNjRcTpyyMbGPH1BnJFbki44TRIdgXtRgldQHc92iPmHO9+c5A593EKGup+eHHSfq4qUoNWLJsnZ6Dx75O1BNhlFWy7G6pAV9+MzpyPAQ+a3Ov8SgLqUEXGI710NO7pik47YL2kXNgxf50F2ql1OxGIDQv/5m60KCboyShMY1n/feDcsA9Smy6r/SF0Oz1nBOPh6TKBUpszgpIXqPp6WdsnIjIzV+r7crcoObm0PBoKZO9iQjOsWHJQTcVROeuD2ZmTGjwnKq9HZJ71PH8IjbZIjUYropr+8cJ90aNnLiu+duR60b3D7osygL8xWrOg7lDSsLuqjCBLodkMDUOiHgT+WFOGPs8CLyWDNkgNQCfv3u0FxZehdgmQ0WQGkjqCadFF3ljHpzSyLTU4LP/V70H9LFs8X6/RzgjagL1ZOlAqdlN2EKD4deZEBoz8Z1p' +
              'PJso2WiiGs4TXw/Kfs0Dcv77K30hNHs/q7ZpXyxVHg5K7tkByT1Dic2p06XLwZkRG0RU5saRG4yWMtkbCA4yOFh+QUtO1eNlVPW6ckW/HRkVGjynY94slhZ9i30hNtkiNZjHBNdmZtQ1IGtjX3umRmy4wdII5hz2HCtuRo6ZHXU9CMgW0vyJgEbXNDT4Gm/o6+tdBsScC8PLkyFbpAbMnL1ML+ZpXy+Gzicz/0tFkBpgfp5N4D5KI9NSg7lhcBwUZNtgyDnq1sx5zrv6Zeed1KDU7AbKU2ggGZi995/tg/J/NwXknHdXaqHBsRIRGjTMbqHBEGS30DRSDbRbaOqoRtotNKahtoXmiNdihQYy4xaav3TYJTR57UOyx9Mh2buVEpumSmxOD8geDTMrNgjIjSko1tkbp2sqIjjI4GjJqS69m1xbJkJztBI+PKPbv81+sckGqbH/osQvdhs0+naNQvWGmRmx4cZMJId0fGmccenzkesxccf93Zx34/NZr12jrFAzFA9MGGefA5FsViibpAbg84dY2NeM551oF0lFkRp7gVIExLe0e8i01NzZpps+DuTYjVlrDIFrS6c4m1JTzpQmNHdkSGgaO1kTCA0EA43mIQ8EZK/rA3J21xW+EJp924Vkz6dCkttCiU1jJTaNdkhe/anSNcNio8PIjZO9iRacsOR0vL5DmQnNP9TzOUg9nxv7ZLfYZIPUmOwHRsJ4CQsmNLOvPxMjNtyYkVaYJbU0UPhpXw8CSxygNiQeEAxMJIjtMTcKJq+Lh3sWWESyM8Fmm9QAjChzr7kF6UykLqWiSA2uAz8T5riI0kbKZVJqULcFQcfEgF5F14N/nR51rnSGj1NqypHdKTRoNKt3Dsr+dwRkz6tDcsbby30hNFWeDMleT6ivNxdJ7qk7JLehEpt6U6XLQWUgNk5EsjdKcCIZnAOryUOPfFOmQoPnk6ueyXVfKbEJZafYZIPUmHqWkoawzpm3Iur6MzFiw40ZgQOxKg2IV/1z2kVdE+L+xz91' +
              'tvDG/ixefLOv82rJDB0xM+r4iAbntnPeTYxslBrw66hZUV0kCIw0K21ph4oiNSDZuppMSg1GCuIYJRXXo4sVw+fNuY6t/6D+WUkFSk05sTmQvNBguv1MCE1N1WgerxpN1LL887WQ7P2f8HpKTTst94XQ5D2u/gp5VEUzJTanKLFpsE3y6k4uU7ExYQRn8P7V5ZpuS7XQnNs7VmhQb+QWmpPUc4oRGvV84gkNnkWuuv/r1DGzUWwqutTgL0o0JKUVAdsT0WVixIYbM6tsk4s7OK/ExyuLgka4pBE7ECGTDUKjHq8Y2eBu5BDHnPyg825iZKvUAAx1d8+Ei8LxeHVIFUlqMDmjOS4CBbrxyKTUYM0lHCNeEbAZGWUi1fWZKDXlQKaEBuKRjtAc0yksFQd3UHKgpKbKRSE5veMKXwjNPo+orw8FJPfi7ZJbf5vknqTEpvZk6fr30z1lJNPx7uktykRoDnw5Vmj2fix8v9d9GMw6sanoUoO1Y3BNWIYA2ZKSAo2NfQ/pjtiwgXCYxhONQSJAFryWMcBqzl7Y6X40AomAoeX2sRHJNrrZLDXg2/7jPdcWKimrUJGkBgW45rgIrO4dj0xJDdYHM88MQ+W9/j8h3PPpYPHPVKDUlDEVTWjMKKO/PhqS3AtVnK8E5fXlWS80e2IkFKSmTZHknq3ERklNbp0tkldzsnQpB7G5s/3wchWavdoEZO/WAWn2XiCrxKaiSw1W8HVfXyKRzLT8pYHaFnPcZJYRMEsE2IEskteChmZ9HMhTor/0cRz38RHxMhVusl1qAFayRibPvo+7237oWX9VkaTm9Is6RI6LQJdaPDIlNR3fHRR1nEQDdUyFhclnQCk1ZYiX0GA9pt0tNKY7I6+lkppzVZwdktNeXZb1QlPlwYDk3a++3qfEpvFWLTW5tZTYnFC2GZsvjzl/twhNlXuKJK/FDrmmS/aITUWWmtVrNuu/KLFcAGaWxQKP8eKmlu9E3Uc6IzZsUEhpjpnMkGk0oGbUlh2Yndhm9O9z' +
              'I+8lOkoKQEjcjTkCzyJR3FJjZmvOFFgnC8ctS6kB3T4dFnUfCAz/d4tNRZEaXJd73p3SVu/OlNTg/zf2R3bQ/X/IHe45a5KdsRpQasqIii40EAkIRN6NSmrODOhh0ae9sizrhQaxRyslNaqxz22gpKYGokD2rD6pzDI2j7TosduEZo87dkjeLdulWceirBCbiiw1b73/o76eRBerdBfOPvfat8476WFPHV9S91FJ2BPpmcBcK3bNDwpc8ToEZfbcFc6riWHWh7IDhdOJgsbV3jdTKz8bTEGq1yrjJZGK1IBO78VmINyTEVYUqYFwm2Mi0FVZGpmQmumzlup9E536AJkZe6TZWZe/4LyTOJSaMiBRocEMv5kQGjScqQgNGsy9n1ZScFl4npfc03bIaS8vzX6hua9IN/q5tyixqVMguScUSI6KvGpKbP6WWbH54cC68u8em3er0OTdtF32vH6bNHtlR4UXm4osNWYEUaKLQiLrYI/YQNFsSbUVyYDzm2O+8tYPzquJgYbZ/Rc5Al0AADO5mteuvqWTfi0ZcI/2cRHJLqJpixG6RDIJxBLHvfmed51XSidVqQEYNWbuxYQ9kqyiSE2v78K1YiYS+bnKhNRgAU3s684WxsO9uviCRd7LhJQEpSbDFHoM2y5voUGDmYjQ7PNMSDeauUoScs8OD4fG6KGGLy7RQoPJ+xIRGpzTLTRHq8baLTSmwbaFBo23W2hwXW6h+YuSGbfQ7NU2Vmj2vDcsNFXuLpK97tqhG/vcE5XYVFdRbbPkHTsho2Lz0mXPVgihybtGxdXb5KoXK7bYlIfUYJ4ZZCPizcTrZsYfyf1FaXjqhd5R9+K1onayYJSNOR4W1UwWr5l/j6jVSnbsCOjuHvPauIl/OnskzslnPxV1XMSAnyc77yaGPVkguvvWb0i8+6o0IGo4rpG4REhHasCTz/eK3I8Jc/6KIjXIXJlj4pmjeLc00pUa/P8zxb/JdM26M6CYDTkZKDUZ5uNloZSEBnPG7A6hgTCg4dy7' +
              'VUBPXmdGDp363OKsF5q97ww3/rlXqntSQpNznIpjldhU/V26ZkBsvjmssVzQfWOFEZqcy7dKzqVb5aoO2yus2JS11GBtHmRPSpsd181jHZL/ixKg+8a+l1RHbNjYCxDi38mCFP7fjo3tJsJfzZj8DP9GoXAqoCDafVzMSpwM7kbn4y+GO++kB+4bEoBjljbxoE26UgMJbvPEp1H3hEB9SEWQGqxjZddCtW0XvfRHSaQrNT8Pm6b3S/ZnzZ0BrXpSm6QyoJSaDLIpsFMempEZocFIpEwIjS0TJQmNEYXc25UA1AuPGkKBbUMlNlkvNM13SJXbtkvOv7doocn910YdeUf/Ll0OTE9smj8+tMIJTe6F6j7P2yJXPa3EJljxxKYspQaNC/5SRxdJaZOi2eAvyiNrtdbXkkqxL9bRMfeS6ogNG2RnzPGQtUmFDq+Gu2FKip+GTnO2TI5rbnsr5lioLUkGkxUzgeeXiW67zt1+0sdrmMC6RjbpSg3Az569CCkCImGWltidUgPRNsfDkOpEfz7TlRp0AWK/VIp93dkvZG8SJVNSg98F6f5fTpQKKzXjNxZnrdAYSdiz2XYtNLk1VZxYIA2eXZz9QnOripvVfZ1ZoIUm559KbI7eKHscqcTmgNTE5tXzHwt/Ji6hwXNyCw3qm8pTaHLPUV/PLJSrntxW4cQG83zYv3AQmZIaZGdwvGQzB78Mn6H3SzV7Yc5rIpVf4jamLgSBkUqpgIyVaazdgeedTBebjVm/x45nXu7jvJs47jlTUKSdDvMXro7U6mAEVDJkQmoA5BhD1O37MhmS3SU1/X+aHDnWXofdKsNGxh/GbZOO1BQUbNP3jMC/k8WdAcVcQImSCanBPqixQ5dteVBhpWbchuIoobl7XGaEBsW6mRAaSEM8odnnviLZF3JwgVOHcny4DqVB+8XZLzT/3SZ73KgEoGG+FprcI1UcsVHyjkhebL4+oqmc031zykKD5+MWGiObttCYgudUhCanqYpGBXLVwxVLbMzkdnac' +
              'dGb6UoNRP2hAsKxAMrU0wPxFmeoEeqgJsWeaPfOy5513UsPOhkyautB5NXlMl5o7MEIoVVo91iPmeM1bf+C8mziQEDR45hjoFktWRg3z5q+Smo0f08fBaKpkhc1ITWlrXyUCupuuuqVj5L5M7A6pwSi6g6uHVxlHHU2ysoefPXMdiGSkBmKPfdLpjrUzoPseeXvCq6OnKzX4/YE/cDLVLZoIFVZq/sgvziqhsUcOGaHZs6VqSO9UEnBaoRaaXHTZHLNZ6iuxyXqhUTKQe+1WqVJb3ZMSmtzDN0rOYesl79Cx0uWviYvNzU+O3C1Cg3twC03uxR5C07hAC03OKQVSpUG+XPXg1gojNv/r9H3ULxwERuukmjnAfvYIlGR/cWNuDPzCRKODJRJS5fo7OkfdE+oYUuW4Bm0jx8FEb6mCYtC9D78t6rqwpk4yk+XZ4FmfdkH7qOMh6p7xhLNFcmBpB/ciixj5kkgRK0CXFbp3zBBgNIKJNnwG3JN5RpmqvcBf9xddt0tMEMlIDRYJNfulKjUQkn+ccK8+xl+rttAZ0mSxR+EhXurYz3knPnimjS4MLyNS2gR/8fjgk6FR5+/+2TDnnfigZsjeL5nPFdf+wJOf6SHvqf4/SYUKKzV4IE9O8xaaG4dlRmjQaJal0JhGNPcmJQC187XQ5DhdNic/szirhabKddtkr2bqvq5QIlB9kxaa3ENV/EOJzSFjpGsCYtPh8hezSmhy6qlQEnd92+R+2ZcFaITcs5qawHwsm/O36m3w/yhe4JcN1irq8/24qL+K8YsU7yeD6btPN7vinh8GGY1UcHfPQRjSySC4MyupjKYyeGXZEMiyQA5TATVDmPXYPh6yClinCF1S6ALB8gxYwwqTEs6as0xPfHfDnZ0jWQgElpNIZP0qNxOn7MpGpJPBcoPPDHOsmGMnKjX4+Tf1XWa/ZH6mUUuGeiqTOcRzTKZo2gbLKJjrQCQ6UeIQpzsXn2M6XXpz/1wZdf46TR9PSDTcXYD4mUkEHBuTUWIf' +
              'CHd5UmGlBvy+rjghoTGLSKYrNJCKTAgN5MA0opACNKRVVAOaU82pQTkq3F1T/+nF2S00V6nXrlSvXaxEoOoGLTQ5h6yV3IPWSt5BY6TL/iWLzYsXPZOVQpNTU8WJm6Rrz/TT66mAX8rTZi6RW+99L+qXTaYjmXoBMHDwlMjKyxh6mupf6rg/d1cPusK+6DM6oQYJ26CroEv3n2MaeAQKn9HAYJK7ZAtqUexosiH4yz3ZbBS61tBImS66kgJ1OsgOJJspAcjMoJvCHqGTaKDwFd2GyTT8AI0/sgj2ytWYpBCF7KkKmhvUkpjMVqJS467PQpQ2TQDufcr0xXpBSJPlg6RDQpP9eTHgDwx0C9vXgYxYaXMSQUDtTCPq1VLFjJ6yAyvPx/sZXrp8vf4c7X1qN3lcizCWEfEKdDOhjg3ShO2x0GuyP0/pUqGlBvy4ojjrhQa1GzkQAjT+qEFxumuQ2WjQbnF2C42SgiqXqThficAR67TQ5PxdiY2KvL//psSmse+EBpmpGhfmOz+hZc+osXP0L3J07bi7GMoikLJPBEzkhfWU8AvM3YiaDAHeb/lQ/FmFWz/2iZY0bIu5bezj2IFiQ2xT0orfyDThvF77egWuedGStc7eiWFGv7zc6XvnldJB1gOFpe7zJxL4zBNdXdwGmRiMpEKGw87C2IFrwmeHe0KDmUqjjRqgo2rfL4eeeG+JgQUWS1vFOhHwHCF88aTmvkd76CxIjUaPet4zsi4Y0YVt8DMHwUSmCj+r+NnD84aUI1sFscHoslTpO2CC/r9kZN8d+PnD/SAbYv8c3vVgdz3/kLu7EwE5wvXi2lFLVRLIdqL7EcdGRrckycVnh+5eM4IP3c/Y74qb3tTddV77JBNYzqG8qfBSAwYtLU5YaKLWDUpDaCARmRCavf/rCI3TmFY5ozAiNMhs5B68VuopsYHQ6MY6g0KT4yE0Oa1jhQbX7BYaXLtbaPKu2R4jNCiszbtEfb1oi+Q1VSKATM3flNj8bbXkHLha8g5UYrPf' +
              'LrHxg9DkHKfiXxtl9MTEhzqnA/5ix+Ru5RWr12x2zhwfDNH02t8d4yfNd/bwBt0WXvuVFCV1ISH74rV9vEg2pY9sC/azl0ooDaTi3edNJtJpWA24bsyAjM8C3VAoCC7POodMAbGJ9/M0YfICz2dYWmA/POdEf/YTAdlKr3N5hf3zlOg9xBsijc/Xa5+SwtRezZy9zPP9VAKfU3lnaUBWSA3ov6Q464UGjWmVK5QU1NscERpkNpDVOOnJJVktNHtc4MhBQyUBfw8LTc4BKvZfKXn7j9Ri4yehyam6UXp9n3ofNyGEkMyTNVIDflhYnJTQNMiQ0GCdpEwJje6qQTdUtQ0RoQlnNRbLzT3zs1toIAdnKzmoqxp+R2hy91spOSpOr/26/Ed9Xn4RmpyjKDWEEFLRyCqpAX0XFKcsNGa0UbpCg0ncUhUaiAAa1NxzCyX3iPVhoTlgibR7ZaS+v/t/zHKhgSBgXpfj10eE5l81vtBpyPXbdso138YKDYa3Z5vQ5By5UYaOKp/JpAghhCRG1kkN+O7P4qwWmirnOw1qE9V4HrwsIjSGBwdludAoScg9TUlC1XVy8LEDo2aSXLd1p1ylPrN4QlP1jVih2ffFWKHBZ+IWmpzbw/dS1kJzTMNNu6W/mBBCSMlkpdSAb+YWpyU09l//6QiNLQVJCY2SgL3PK5RvhnrPB9FmYJYLzakFcvrthbJxU+y03hCbK78qH6HJca49SmjOcq7XFpqTExeanMM2yCtvJz9dOSGEkLIla6UGfD2nOKuFpv9v8UfPPDAge4Wm7g2Fsqmg5EwGxObSzyuu0ORUixWa3MM3aKE59+p8qYgLXBJCSGUnq6UGfDWrOG2hyVPikAmhwRwumRIawwP9w9eWTUJT5/pCWbux9Dkv1m7ZKRcqIc0moWl6Wb5sUddNCCGk4pH1UgN6zijWQmPqNNIVGkhCJoTGNKipCo3hwR+KfSc0BojNuR9TaAghhKSPL6QGfDat2JdCY2j9fbEWGlyjW2jQ0LuFRi+m' +
              '6RKaPZUAuIUm94ZYocE9uIUG9+EWmipN0hMawxolCk27U2gIIYSkh2+kBvSYWhwRGnRpZEJobDlIR2j2OTd1oTE80DfkO6ExrCncKQ3fp9CQikswGJSVK1emvAYQIaTs8ZXUgI8mFftSaAytvgv5TmgMq5XYnPgOhYZUHDZv3ixz586VUaNGSb9+/WTAgAHOO7uHUCikr2nTpk3q53KL/p4QsgvfSQ3oNnFnlNDgr/9MCM1eSgh2p9AY2nyjrt1nQmPQYtOJQkN2P8uWLZPvvvsuKkaOjJ5TqrxYu3atjBs3Tr7//vuo68H348ePl1mzZun3Cans+FJqwHvjd5YoNCi6zYTQGBkoT6ExtP465DuhMawuUGLziiU0zn1RaEh5smPHDi0TU6dOjUjEtGnh1YzLC0zwOGPGjMj5IS7Lly+X9evXy+LFi+XXX3+NvPfjjz86exFSefGt1IC3x+3crUIzYHTZCI3h/t7qHnwmNIbV+UpsnitBaK6NFZocMzLLFhp1nRQaki4LFiyIiMOiRYucV8uH2bNnR86N63AD6Zk0aZJ+/5dffnFeJaTy4mupAW+N3RlXaJANyITQ7GFJQHkIjeH+L4O+ExoDxKbm00UZE5rcGh5C808KDYnP5MmTI2KxYcMG59Wyp6CgQPr27avPO3ToUOfVWFBXgyzNsGHDnFcIqbz4XmpAp9/C87z4TWgMrb9Q9+EzoTGs3qzE5jF1b+UgNGdQaIgHw4cPj0gNRkCVFyhQNuf9/fffnVe9+eOPP+S3335zviOk8lIppAa8Naq4VKHJUWKQbUJjuL9nwHdCY4DY1HlA3ReFhpQz6N754YcftFj8/PPPzqvlw5QpUyJS079//3IVKkKylUojNeCt4cVJCQ2EIBuExtD6s4AWmrybYoUGo7TcQqPFwCU0RhCihEZJwu4SGsPqTTulRislaxQaUo5g2LQRi7Fjxzqvlg+o3zHnRiATwyHchMSnUkkNeGtYyJdCY2jdI+A7oTGs3qjE5m51DxQakmEw' +
              '0mnevHm6LmXgwIEyaNAgPbII3T5GKtDFUxLYH++jWBf7o8YFQ63TqcHBMd1DuDFfDl5PFtTnoDYI2SbMtYOvGMm1detWZwtvMPrL3m/w4MF6NBZkz4uioiJZvXq1LnAeM2aMvl4Dsl6YYwdD5fH+hAkT9PPGcHQ3uEdI3ejRo/WzhMytWbNGf4/rWbdunT6ezbZt2+TPP//U3YX4DBD4DBcuXBg3y4XjYBsM1zefHQQS90Gyj0onNeDtIaGkhcaIQEUWGkOrj9R9+UxoDFpsmqt7oNCQDIAGbebMmXpiPQSGTKOxhdTYMoHAUGov0EBjXwgNRigh0DhiH0gJGvJUWbVqVaRY2ASOjdcTATJgxAxCAFGAfOF68RokJRAIOFvvAnICKcE2Q4YM0Y0+7gv3iNcgOMhcofFHETO+nz9/vn7PDoidAWLlfh9hjyjDtUCE7HuGULmzVgjIDTCfoXkd14XvISnmNXTfQdDc4D7Ndrjf6dOn63vB9/g3yT4qpdSAjr+EfCk0htbdA74TGsPqDcVS4xZ1/RQakgZo8CExaMDw1c6A2I26CTTKbpBlwHtoSO1sADI0Zr94I5cSYcmSJZFj2YGam3jdUXgP0oFtITJ2ZgNZKXMczMNjA7GASOA9DBe398NzgSCYfe3ALMcQB1sm5syZ4+wZBsdGlgUyZbaxs1nIttj7IyCYkBwIlZExyCKyTPjMzPbYzi2QmMvHHAe1UYWFhc47YczINvsZIEOD1yByJPuotFIDOv4UTEloIAEVWWgMrT4o8p3QGLTYXK/ug0JDUsRICzIDXus5oQE33T9oTO3GHZj5a9CYesmFEQNEad08pYE1p0wGwQ7cQ0lrUSFLYrZxs3379sgx3JP2mQJlnM8ri2NLBzIi2B5SaK7DzpqUlFEqbUSZW+SMHEFi0MWE9wGyT3jfS1gMdhcisnAGfL7m9aVLlzqvhmUQr0G+SPZRqaUGvDUo6EuhMbR6r8h3QmNYvb5YajYrlNw6SmQoNCQJIAmmQcvPz3de' +
              'jQaNdEnzxKAhNl1MEB782x12F4o7Y5EKEBGTebFj4sSJzha7QNbEvI8G3+v67GOYBtyWHYiKF7YkeImEneEqSebMiLKffvrJeSUaPC9zDK/7A/YyFugCLAlbkGyB27hxY9TryBIByCvuiwuXZieVXmpAxwFBXwqNodU7Smx8JjQGiE2Ny9X1W0KTe0ys0OQeSqEhYdBYmSwKJKEk0JVhGj13w2rPIYMuGnRjxAuveo5UQINrN/gmTObCYMQC2Rav63GHadCRWTHHLKmmBDU2eB9ZLK+GH6KC99FN5QVEx5yjpBFltjh5dfvhOdhi5pVRMkBazXYIiBvAPqY7CwGxYXYm+6HUOHT8IehLoTHc32WH74TGsHpdsZx0ZX5coTmvGYWGhDE1E4h4GRT7L3zUoNhg1A5eR23I7sCWKoTdxYQskskSQbiSwc5gQSzc2KKHbiY3EAXz/ogRI5xXo7HP4TXyCZiCZK9uP2Bnokr7DPA8zLYIdDsZ7JobEyh4JtkLpcaic/+g57BtSMB+FxTKwDHZKTSGF3sWyb7qPryE5uLWW2RjfvY2+oVKWJ7vvF2ObqykxhKaE5tskk7vb1e/2Cg0JAyKZk0Dhi6MkrAXksRwYgMaWfMXPmo6dhfIcpjrQ9bCYHerJNvthXszWSwc086AQA4gKngP0uFVR4SFNs25UWvjhZ1p8hpRFq/bz2DLCGp84oGuJLOt/ZwMkCx38fOKFSucd0m2QalxMWpmSK57brvso6QGQrPfRYVy96vbZdZCf0x6tbFgp3TqVSQ3PbtNbmq/TR7quF1mzvfPhF7FxTtl6qygTJoWlJmzs1tCSdmAYlHTeHktEmkwRagI02UB7AJTdMVkGtSHoEuoNOxMkr3uk50JKUks4oH9TYE0jovh1MhemOwJnktJ3T0YMWTOXdKzNQXMCK+upXjdfgYUC5ttIGHxsGtv7EJhG3SJmW4zBO6VZCeUmhIIhXZKUWCnbiQJIf4Bw3dN4xVPHsxcNahLcWP/ZR+vngMNtFf3' +
              'STzQkKOBLW0/e1g2skoGu4aktOHk6MaxQZYEI4GwH8QGXTu4f1wPnhVqg+Jdl/1sS6pPKa1rCec3x3B3+xnsjBDCawSVwYy0wvlM4TI+M2S0bJDRMQXMCBYKZyeUGkJIpcJuNCEuXlJiN5pe3Rv2KCSvbAIaa2RS0JAmO6uwKZK1u7zc4JpR2Irt3PeAc9uNsz25nQFdR2aiOSMEaNRNETDuyc5OJYo93BsZHxtcF7I3pXUt4brMMUqa1RfCYboAvc5lKGmEFI6L/d2YLJJ7mDvJHig1hJBKBUb62A0i5qlBNwgadzSO9pBkBKQB3Rb4i99gd7MgUGuCBhSZDEgE5ACNN2o/ksWcH+f16p6xJ6jDObzmgrG72BBorLEdrg9FxqgtgdDY2Qq7hgj7Q0DQ+GMfSB62RRbIq5bGgGdpjoEsD2pTkA1CdxG6iYzQIPA88XzsZwSRsruBvIaMG+xiaUiIW8JwbnM+ZJnszIvpurOzSbgvk0VisXD2QqkhhFQ6zMR5XoH1gpCpsF9DVsEeNo2sg12o6w4co6T5b0rDFgPIFwTDLFMAObHneCkpC4RJ6uzJ/9yB49gzKAOvpQhKCgiLV5G111IJCMgF6nvc7+NeIDwQDlyTyT6ZwHPH/SPc0oLPwEwUiECXIMQMxzPPEOfF925MTQ7Oh8wdZBbnwmvIlOHYJDuh1BBCKiX4Sx7ygYYM9SNoVE3NCP6yR6YEjWS8yfkgG2jgTQOKbinITzqNIkZnIQuBUULIANnZDQSyNJCDeLU8ANKCIdPIyGA/CATuMV63FrpozPaJBDI4NrhvXDueHd6HeOGYRkjwPJENwVc8a5M9wfu4tnhhZ1psULeEz8vUOeF54Ryox3GLmwHPBdJnRnMh8LPg1VVHsgtKDSGkUuMlIGhAkxGTdCSmNHBsNPpYGbs0kSmJRK8PggAhQGOP7ipkY9A9hCwRshsQLrtuJt6ij17njFfQmwlS+RywTyr7kYoJpYYQQojODCHL4a4/cQMBMN1EyLgQUpGg' +
              '1BBCSCXHrDaOLpnSshaYp8cUWruHRROyu6HUEEJIJQZZGSMpqIGJl6XBe6YIN9nZigkpDyg1hBBSicFQZnuIO0Z+edXuYPizGaqOzA7rUEhFhFJDCCGVHHsmYIQZDYZCYCyKaeaOwbBn9yzEhFQkKDWEEFLJQdYFi0tiZJOdtcEwcLyG4dGpzrtDSHlCqSGEEBJFvLoaQioylBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQHyDy//O30PvAjFjdAAAAAElFTkSuQmCC', width: 160, height: 50, border:[true, true, false, false]},
              {text: `\n\n${this.xtituloreporte}`, fontSize: 8.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n${this.xrecibo}\n\n`, border:[false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos de la Póliza', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia de la Póliza:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fdesde_pol)}`, border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fhasta_pol)}`, border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, '*'],
            body: [
              [{text: 'Fecha de Suscripción:', rowSpan: 2, bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.fsuscripcion), rowSpan: 2, alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, false]}, {text: `Sucursal ${this.xsucursalemision}`, border: [false, false, true, false]}],
              [{}, {}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalsuscriptora}`, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: 'Vigencia del Recibo:', bold: true, border: [false, false, false, false]}, {text: 'Desde:', bold: true, border: [false, false, false, false]}, {text: `${this.changeDateFormat(this.fdesde_rec)}`, border: [false, false, false, false]}, {text: 'Hasta:', bold: true, border: [false, false, false, false]}, {text: `${this.changeDateFormat(this.fhasta_rec)}`, border: [false, false, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 50, 80, '*'],
            body: [
              [{text: 'Fecha de Emisión:', rowSpan: 2, bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), rowSpan: 2, alignment: 'center', border: [false, false, true, true]}, {text: 'Tipo de Movimiento:', bold: true, border: [false, false, false, false]}, {text: 'EMISIÓN', border: [false, false, false, false]}, {text: 'Frecuencia de Pago:', bold: true, border: [false, false, false, false]}, {text: this.getPaymentMethodology(this.cmetodologiapago), border: [false, false, true, false]}],
              [{}, {}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.xmoneda, border: [false, false, false, true]}, {text: 'Prima total', bold: true, border: [false, false, false, true]}, {text: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal), border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 150, 70, 60, '*', '*'],
            body: [
              [{text: 'TOMADOR:', bold: true, border: [true, false, false, false]}, {text: this.xnombrecliente, border: [false, false, false, false]}, {text: 'Índole o Profesión:', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadcliente, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, 24, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 40, 20, 30, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, false, true]}, {text: 'E-mail:', bold: true, border: [false, false, false, true]}, {text: this.xemailcliente, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [80, 280, 24, '*'],
            body: [
              [{text: 'DIRECCIÓN DE COBRO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 50, 24, 50, 24, '*', '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Zona Cobro:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, '*', '*'],
            body: [
              [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: `${this.xnombrepropietario} ${this.xapellidopropietario}`, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, 24, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionpropietario, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadopropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 40, 20, 30, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, false]}, {text: this.xciudadpropietario, border: [false, false, false, false]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.xtelefonocelularpropietario, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.xemailpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL INTERMEDIARIO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, '*', 40, 30, 45, 30],
            body: [
              [{text: 'INTERMEDIARIO:', bold: true, border: [true, false, false, false]}, {text: this.xnombrecorredor, border: [false, false, false, false]}, {text: 'Control:', bold: true, border: [false, false, false, false]}, {text: this.ccorredor, border: [false, false, false, false]}, {text: 'Participación:', bold: true, border: [false, false, false, false]}, {text: '100%', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL VEHÍCULO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [30, 100, 30, 100, 35, '*'],
            body: [
              [{text: 'MARCA:', bold: true, border: [true, false, false, true]}, {text: this.xmarca, border: [false, false, false, true]}, {text: 'MODELO:', bold: true, border: [false, false, false, true]}, {text: this.xmodelo, border: [false, false, false, true]}, {text: 'VERSIÓN:', bold: true, border: [false, false, false, true]}, {text: this.xversion, border: [false, false, true, true]} ]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 30, 30, 50, 30, 50, 60, '*'],
            body: [
              [{text: 'N° DE PUESTOS:', bold: true, border: [true, false, false, true]}, {'text': this.ncapacidadpasajerosvehiculo, border: [false, false, false, true]}, {text: 'CLASE:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'PLACA:', bold: true, border: [false, false, false, true]}, {text: this.xplaca, border: [false, false, false, true]}, {text: 'TRANSMISIÓN:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [20, 45, 80, 75, 70, 70, 50, '*'],
            body: [
              [{text: 'USO:', bold: true, border: [true, false, false, true]}, {text: this.xuso, border: [false, false, false, true]}, {text: 'SERIAL CARROCERIA:', bold: true, border: [false, false, false, true]}, {text: this.xserialcarroceria, border: [false, false, false, true]}, {text: 'SERIAL DEL MOTOR:', bold: true, border: [false, false, false, true]}, {text: this.xserialmotor, border: [false, false, false, true]}, {text: 'KILOMETRAJE:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [20, 45, 30, 50, 50, 140, '*'],
            body: [
              [{text: 'TIPO:', bold: true, border: [true, false, false, false]}, {text: this.xtipovehiculo, border: [false, false, false, false]}, {text: 'AÑO:', bold: true, border: [false, false, false, false]}, {text: this.fano, border: [false, false, false, false]}, {text: 'COLOR:', bold: true, border: [false, false, false, false]}, {text: this.xcolor, border: [false, false, false, false]}, {text: ' ', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DESCRIPCIÓN DE LAS COBERTURAS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: [
              [{text: 'COBERTURAS', fillColor: '#d9d9d9', bold: true, border: [true, false, true, true]}, {text: 'SUMA ASEGURADA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'TASAS', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: '% DESC.', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'PRIMA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: this.buildCoverageBody2()
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: [
              [{text: 'Prima total', colSpan: 4, alignment: 'right', bold: true, border: [true, false, true, false]}, {}, {}, {}, {text: `${this.xmoneda} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal)}`, alignment: 'right', bold: true, border: [false, false, true, false]}],
              [{text: 'Prima a Prorrata:', colSpan: 4, alignment: 'right', bold: true, border: [true, true, true, false]}, {}, {}, {}, {text: ' '/*`${this.detail_form.get('xmoneda').value} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimaprorrata)}`*/, alignment: 'right', bold: true, border: [false, true, true, false]}],
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'BENEFICIARIO PREFERENCIAL', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*', 20, '*'],
            body: [
              [{text: this.xnombrecliente, alignment: 'center', bold: true, border: [true, false, false, false]}, {text: 'C.I.', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadcliente, alignment: 'center', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL RECIBO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [50, 50, 160, 100, '*'],
            body: [
              [{text: 'Recibo N°.:', bold: true, border: [true, false, true, true]}, {text: this.xrecibo, alignment: 'center', border: [false, false, true, true]}, {text: `Vigencia del Recibo:  Desde:  ${this.changeDateFormat(this.fdesde_rec)}  Hasta:  ${this.changeDateFormat(this.fhasta_rec)}`, colSpan: 2, border: [false, false, true, true]}, {}, {text: 'Tipo e Movimiento: EMISIÓN', bold: true, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: [
              [{text: 'Total a Cobrar:', colSpan: 4, alignment: 'right', bold: true, border: [true, false, false, false]}, {}, {}, {}, {text: `${this.xmoneda} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal)}`, alignment: 'center', bold: true, border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DECLARACIÓN', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'En mi carácter de tomador de la póliza contratada con la mundial de seguros, c.a bajo fe de juramento certifico que el dinero utilizado para el pago de la prima, \n' +
                      'proviene de una fuente lícita y por lo tanto, no tiene relación alguna con el dinero, capitales, bienes, haberes, valores o títulos producto de las actividades \n' +
                      'o acciones derivadas de operaciones ilícitas previstas en las normas sobre administración de riesgos de legitimación de capitales, financiamiento al terrorismo y \n' +
                      'financiamiento de la proliferación de armas de destrucción masiva en la actividad aseguradora. El tomador y/o asegurado declara(n) recibir en este acto las \n' +
                      'condiciones generales y particulares de la póliza, así como las cláusulas  y anexos arriba mencionados, copia de la solicitud de seguro y demás documentos que \n' +
                      'formen parte del contrato. El Tomador, Asegurado o Beneficiario de la Póliza, que sienta vulneración de sus derechos, y requieran presentar cualquier denuncia, \n' +
                      'queja, reclamo o solicitud de asesoría; surgida con ocasión de este contrato de seguros; puede acudir a la Oficina de la Defensoría del Asegurado de la\n' +
                      'Superintendencia de la Actividad Aseguradora, o comunicarlo a través de la página web: http://www.sudeaseg.gob.ve/.\n', border: [true, false, true, true]}],
            ]
          }
        },
        {
          pageBreak: 'before',
          style: 'data',
          table: {
            widths: [165, 216, 50, '*'],
            body: [
              [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjUAAADXCAYAAADiBqA4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEEdSURBVHhe7Z0HeFRV+ocTYv2vru6qa19WBZUqgigI9rL2gm1dK4qigih2RRHrWkEBG6ioWEBUUIqKgBQp0qsU6b1DElpmJnz/8ztzz3Dmzs1kWkLm5vc+z/eEzNw+IefNd75zTo4QQgghhPgASg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqamkFG/dKtunjpfCX/pJ4Y9fS8GAnlLww0dSOOgT2TK0l2z9ra9snzxEgmuXOnsQQgghFRtKTSWgeMcO2TJliqz7sqcsf/YJWfjfy2XBOXVk8YV1ZMkVdWXZtfVk+c31ZGXzk2Vly/qyunUDWd22gax55BRZ+3hDWffcubL5w/tky09dZceMYRLatMo5MiGEEFJxoNT4mI3DRsicO+6WSbVqy5TaNWT6yTXl' +
              'j1NrybymtWThubVl8SV1ZOlVJ8myG+vJitt3Cc2ah5XMPKFk5ulTZf2zkBr19QUVL54WDvXvDZ0ul63DP5Tiwg3O2QghhJDdC6XGZwTzC2Tpux/L+Ebny+gjj5ffjzlBJlY/UabU2iU1f57hSM2ldWXZNXXDWZo7ldC0qr9LaJ5pGJaX/50mG19tJBvfUF/fVF87OaH+veH101Q0lYK+7SWwbIZzBYQQQsjugVLjE7bMXSB/tHlahh9eV379ezUZcUh1+U1Jzbh/nSATlNRMrqmkpp6H1FxbT1bcoqTmLiU0bRrI2kdPCWdoIDSvOCLzdiPZ1LWxbHrvdNn0/umyuZv6t/qqv1ev431Iz+ZPbpftUwfIzuKQc1WEEEJI+UGpyXJ2hkIy/+WuMnj/E2Xw/x0nQ/Y/Tob9TUnNwdVl1OHHy9h/Hi/jjztBSc2JMq1eDZlldz8ZqbnN6Xp6UEnNEw1lfQcnQ6OEZlOXsMDkf6hkpof6+lkTKei5K/I/aSKbP3ZEB4LTqZHkf9pcgusWOldICCGElA+UmnJgc3CnzN5WLBMKQzK+ICQztxTL+sBO593UKZz9p4xtcpX8vM9xkRiy33Ey9K/VZPhB1WTkYdVl9FFKao49QSadeKJMrVNDZp5SQ+Y0qSkLzgnX1KD7SWdqIDVtG8i6J8M1NLrLCRkaZGaUtGiJ6aXim6ZS+K2Kvk3Cof5d0EfFV0pwlPBAfpDB2dj5TNk2rqfs3Jn+fRJCCCGJQKkpI/JDO+VXJTAdVwWkw/KAPLs0IO2XBKTdYhULA/LUgoA8r6L/2pCsLUqu4YcoLHyzm/xyQI0ooUEM/ouSmv2Pi+mC0nU1tWvIjAY1ZXbjmjL/rFqy6KI6srTZSVFSs7bdKbrrCd1JyLxs7t44nJ3p7UhMfyU0A8+XLYMulC0/XqK/6u8HnCUF/c4ICw4yOMjsvNtI8r+8S0IbljhXTgghhJQdlJoMU6yEY1RhSF5aGZDnVuwSmmcgM5bQPP5nQB6bF5BH5wbkkdlB' +
              '+X51SALFpcvNtsXLZdzZ18XITCTQBbXfcTLswGoyXHdBVY/qgjJ1NfPOrCWLLwiPflp+U7imBt1PyNQYqYGU6CzNV+GMDMRFi8zgZrJ16I2ybdjNsvXX28Jfh9wgW3++Iiw53zvZGyU3kKJN750t2yf1ce6AEEIIKRsoNRlki5KSD9cF5fkkhOZhJTQP/RGUtjOD8sLcoKzdUbLYbF20VEZUb+otM1bobM1fq+lszchDw11QGAUV3QUVrqtZclldWX7DSeHRT63DNTW6+8lITQ8lNeh26ndGODvzy7VhkRnRUrb/1ka2jW6rQ/975L36PWwTkZveSmzUMXCsbaO7O3dCCCGEZB5KTYYoDO2Ud9YGUhaaNjOCcv/0oLRT/16zPVZsEhUaHTHZmuNlXNXjZUI1ZGtqyIz6NWV2o11dULqu5raTZdW94dFPKBRGTY3ufkKmRkkNBAVZGp2hgdCMeVi2j28vOyY+Lzsmvahj+4QOsn3cE1pwtg5vruWmcMA54bobZG26NZbtYyk2hBBCygZKTQbIlNDcPzUoracE5fFpQVltiU1SQuOEXVvjztZMq1tDZjUMj4JadH5tWXKl1QWFYuGnndFPbzfStTG6+wlS89NluqsJ0rLj96ekaPL/pGj621I08x0pmvV++Cu+V6/jfZ29UdtjP521QTGxOt6asd10Nx0hhBCSSSg1aZJpobl3UlDumRiUR9X3q7ftTEloTLhra7yyNQvOdkZBXaukpvnJkS4oXVeDId3vh0c+oUgYmRojNcjKFE3rJEV/dJPAvM+laH5vHYE/v5SiOZ/IjhldwtmbsY/JthEtdB0Oiox1d9THp8u00R9QbAghhGQUSk0alJXQtJyg4vegPDK+SL5v+h9PYUkkzLw1ZiSUmWHY1NZ4ZmtahmcVxozCkS4o1NX0aaq7klAQvH1UK931pKVGCUxg4bcSWjJIgsuGhGPxAAks6COB2R/pbbAt6m10rQ1GSTliM3lsD4oNIYSQjEGpSZGyFpq7xwXljrHq' +
              '3/2Wy1fHnuUpLYmEKRo289ZEjYTCsgmnWbU1mIjvdle2plMjXQtjuqAwwgmZF9TO7Jj6hpaa4KJ+Elo+TIJrxkto3WQJrZ0owZWjwnIz73OdtdH1NkqGIEWQI4jNxh5nyNBF0yg2hBBCMgKlJgXKS2juGB2U5r8F5bbeS+WLqmd4SkupYRUNm1mG7XlrZjaoqSfjMyOhsLjlqhZObc0zDfVSCZFsDSbeG3h+uFh4dFvdvYRaGmRlIDUQmuLN86W4YIkUb5oXlpulg3W3lC02dsZmSa8bpN/GLRQbQgghaUOpSZLyFppbRwbllhFB+W/PxfJZ1dRqa+xuKF00bHVD6aJhZz0oM28NJuNbdU94JJQZ3m1qa/TQbhQMO9kadC8hG6O7n9aMl535C2Xnjo1SXJSv5Qaigy4p1NposTFdUabG5qsmMmJoR+mzKUixIYQQkhaUmiRwC037ZbFC8+T8WKF5eFas0Nw3OVZoWkBmXEJz6/Cg3KzixmFBufrDhfLp0U08xaW0iJq7xt0NhQn5SuiG0pPxvaik5q1GeiI9PbxbyQiyLbq2BgXDGPU0v3c4W7N+muzcskKKQzu02EBydLeUkp6iuZ+Fa2yUDOniYYyK6ttE8ns2lY9mTpTeGyg2hBBCUodSkyC7W2j+M1TFL0G5qPN8+SRFsSlpNNSUWruWT9BrQl1qTciHWYadId5Y3FLPW2OKhofeGB7ebXdDrRihxUZ3QW1bK8WFy6R4wwz9OgqKMVoKQ771pH3DbtbdWejWWtzrWnlxcYF8uS4oIYoNIYSQFKDUJEBFEZrrBgflmp+Dcs6rf8onR6UgNqa+Bqt4Y12oI3bV1+iZhnV9jTPT8BVKbJy5azxHQzn1NRATd32NHgGF7MzGWVK8aY6WnNCq0bpw2GRrMI8NJvHT3VDOHDaDh3TRz/SLNRQbQgghyUOpKYWKJjTX/BiSqwcGpdFzc1MSm6SHed/sDPN+5BRZ/2xYbPRClZ84K3Y7hcM6YzPxed0VhRobCIzujlIy' +
              'owOjoxb/EBkNhW2xD/Y12ZrVn18kz84v1DVJn62k2BBCCEkOSk0cKqLQNBsUkisHhOSyH4JycrvZ0iMVsfFYG2r8saUXDhux2fB6eF2oKLFxzV+j56iZ31sP94bgaKFZ0EdnaiIT8415OLycwk+X6QLk/M9Pl69G9o08z0+WU2wIIYQkDqWmBCqy0Fyh4vL+Ibnw26DUfniW9DgyTbE5bJfYTK6hxKZejeiVvJvFio17Yj69gvfgZuFRUWMfC3dHYckE1NDM+STc7YSvWE4B3U/I1BipsWYbntv7Vv08H5kTfp4fLw1RbAghhCQEpcaDbBCaS74PyaX9QnJO76Ac33qmfJyG2MRMzKfERo+IKkVs9Bw2pnjYLHpp1odC1gYT9GHByymvapHRMjP1DS08Zm0oIzV63holR8j+vD1uon6ebdXzfEA9xw8XVW6xCYWKZebsZRmJHTsCzlH9zabNW2T5yg1xY83azc7W5Usi17Y5f6uzNSEkGSg1LrJJaP7dV8W3ITnjs6D8q+UM+fiI5MUGhcNhsakuo7yGettic5VVY4PiYTMqCsO9Mesw1oj6NjwyCqKy9dfb9Jw0ekVvCI4SGS0zGNKN0U8jWkYWvIxIzWdN5Ldv20WEps208Hw+HyyovGKDBi7noJsyEnPmrXCO6m8efKqn5/3bse+Rt5e72BQXF0vNxo95Xo8dTz7fy9mDEJIMlBqLbBSaC78JyXlfh+TU7kE5+o7p8lGKYqOHervFxpWxiVnR+8EGsrbdKXoeG7345Xunh7ujeoUn6UOtjZaboTfqjIyWGCU5+uuIFmGhQZZm0IXhEVC9m+hMzfoPzpCnJqyOCA2eJZ7ju/Mqp9jsVPeMxrCoKCjz5q+Srt0HS9WT2ng2hogDj7lLPvr8V5k1Z5ls21ak98UxTFQGAoGgLFuxXj74ZKiccNojns8JUd7y0HfABM/r+L+jmsvjz30lE6cslLXr8iUYDDl7EEKSgVLjEE9onloUKzSm5sMWGjTCbqG5e3ys0Nw+' +
              'KlZobhwSKzRXD4wVmksgMy6hOa9XSM5RcVLnoBxxc+bFBjU2pnh4wXnh4d5YTkHPY4N1oh5vKOs7nKrrbDa+Hc7aIOMCSdFyg8zNj5fodaP0EgkIyAwyNBCa/k11hgfDuiFFkKPuPw+KEho8x7vUc+wyhzU2YOHiNXLI8fd4NpBDhs9wtiJgxh9LJe+Qmz2f1V+rttDdQeUBhLLh+c94Xkfbdj2drQgh6UCpUfhBaM78IiRNPw9JjVeDcuh/p8uHaXVFRRcPR0ZFNawVmccGE/Qtvf4kPfPwqnvDdTbojtJZGyyrgCLi7o7coN4G0gLBwWzEKCpWoYuD8RreU9tg2/wPT9cjqwZ83THqOUJo8AybjwlK5z8oNqDFA91jGsf9q96psxQkmuMatI15ViZefLOvs1XZ8ouSTa/zI1556wdnK0JIOlR6qfGT0DT9LCSNPg1J1Q4B+ccNmRMbex4bswDmgrNr6yUVUECs62wwSV8bZ3XvDuFaG90lBbnp5oySwtpRXzkZHBOQmc9PjwgNsjTI9kzqdles0PwWfoZYC6vTTCU2xZVbbHp8OSKmcazd5HHnXWJz8tlPxTwrEwdVaylbtmx3tiw7zrnyRc/zI55gDQ0hGaFSS01+cKd0VvLy2soi3wjNqZ+o+DgkRz4ekIOvmS7dD09ebGLmsXEm6DMre8+oX1NmNwqvFYUCYj37MJZVaO5kbVBEjDWjLLmBqOiaG3RNIRvzcbj+Bl/19+p1IzTI9Kx87Wz1DIs8hcY8vzemVW6x+eaH32Max5POfNJ5l9gYqTmiVis5rMZ9Mc+t03uDnC3LhjHj50XO1eDcdlHnRtzd9kNnS0JIOlRaqYHQ/G9+UB5QcvLEjG3y3LIi3whNw49CcnK3oBzcJiAHXT1duqUpNnpJBSU2WFJhghKbyTVr6AJi1Nlg9mHdHXVJHVl2jZKbm+vJqhb1ZXWr8CzEEbl5SckNam6QvXlLRRclMV2dUP/WMtOpkZ7YDyK0/oVTpd2QuSUKzQ3q+V2v' +
              'nt+rUyqv2Hw3YHxM41jvLEqNF8fWf1A/H9S0vNa5f8xzO7JW6zId7n75f9/Q50FW6Ot+42LOf+3tbztbEkLSoVJKjS00GDYMMXlgYqG0X1TkC6Gp3z0k9bqFpM67QTng7oD8/UolNoelKDZYUsFZK2rU4cdHFxDXDXdHYSFMO2uja21ucUZItQ5nbtAthfWj1j0XrruBuGCeGy06KvBvLTPqPUgQ6nPe6d0vrtCYZ/fKxMopNpSaxPn7cXfr53NBs/9JQcE2+duxd8U8u26fDnO2zizTZi6JnOO5176V0b/PjTov4tyrXnK2JoSkQ6WTms0uobFH2LQck+8boTnpg5DUei8kNd4Kyl9uDciBl6UoNs5aUZHVva06m4knhLujpp/sDPtuWkuv8o1aGz30+wYlN7edrDM36JbCEHBkbyA4GAoOycEkfia09CiZQXZn7aOnSN8uL5cqNHh2eG4vTah8YkOpSQyMOqpycHj0k8mIPPvKNzHPDsXEZTGU+sa7uurjY9j2+g0F8sfc5THn5udGSGaoVFITV2iUkNw5JiB3jtrsG6Gp825IanYNyXGvBWWfGwOy/8XT5f0UxMas7m3X2US6o6qFJ+qLZG0a1dRz2mDoN7qkMGFfJHPT/GQ9cZ/ummqjJKdtWHK06CiJ0f9++JTw6+r9X15+JCGhMc/t+d8rl9hQahIDmRnzfDBiDEAu/nL0HVHPDvFFn9H6/Uzx54JVEaHChIBg5aqNMef9Z902+j1CSHpUGqkpTWggJLcrGbllREBuGbrBN0JzYpeQHN85JEe9EJS9rgnJfv+eKe8dmoLYqHDX2US6o451sja1nFobPfQ73CVl5AaZm2XX1tPz2xjBQQYHkoOlF5DJ0aH+jdfQdTW0/f0JC83F/dTz+i4k7cdUHrHJRql5+JnP5ZTzno7EipUbnXfKjqXL10eeD85veKT9F1HPDoHRY5isMFPc9WB42P0e/7hFXwfYvr0o5rz7/fMO/V5pXH9HZ6nR6NGE4u0PfnL2Sox2' +
              'L37teRx3GDEEg36ZKh3fHeQZv0+a72yVGnP/XOl5XHd07rbrPrHPeHXeYSNnSf+fJuv6pU++GiHvfTxEF4Nj6HyHV7+Vp1/6Wp56obeefBEjz/D9869/pyetHDF6tl6qIt2fg42btsiCRWsSinTquXp9Nzbq/xQmeEwVzLDtdX3xorCw7EcOJkOlkJpEhcZ0dVz7c0BuGLReC82DkJkEhAbzp7iF5qZfY4Xm2p9ihebSH2KF5oI+sUJzZs9YoWnwYazQ1HonWmiOe0tFx2I59OmQ5F0ekn0vSENs7O6og6qHh307WRvU2pih3zPqhwuJjdzoYuILldxcVldnbyA46J7C7MSQHHRTRUJ9j4Lj4Y+2SEpoznMk8JlRIQlWArHJRqm595GPo6731bf7O++UHdNnLY2cDw2XARmTvQ+/Lep6EP0GTnS2SA80jHseeqs+5m33ve+8GsbrvJgxujTQ0K5bXyA/DZ0m1U55KOYYV9z0pkyaujChY7lB1xsaNfxcnX/1y1HHhXRBkhYvXafXIjNg7p32//tGGv/7Wcm1tjf7jJ0wz9kyeeYvXK3PCflseslzUcfe54jb5fZW7+ufnw97/ursEZa+C695RRd+29sj8MwhQD17j9Kyg8a/z/fj9PcvdeynPyPcB64b22Nixhvu7CxffTtG8guSX4vr869/k7pnPBFzHXZgZnBcLzJ6qeIeBYm6sVR5o+tAfT1H1b4/6ph2HHrivXLW5S/IJTe8Jpf+53UtgRUJ30tNskIDEcFyBZf0DUizfmt9IzRVVRzxRrEc+LASm0tCsve5M+Wdf6QmNu7uKDtrg1qb8AipaLlBMbGekRjz25wfrrvBBH66sBhdVM2U6FxTNxL4fuS9tyYtNHheZ30VkieH+19ssk1q0NAeXL1l1PXiL/+yXrph1Ng5kfPZf9UDt2QhTj3/mYxcE2YJNsfEkhU2XsPKV63e5LybGJg52t4fxdCZmnhx69YdUuv0XWtUISNTGpi52UicCSzZMWX6YmeL1MHn' +
              'gcyKOS4+03hg+y7df466lgP+1cJ5Nz5YWgSyc9UtHSNdh5AoLGORyuzTi5aslRMbRS/Vsddht+pMUiZodmunqGNDLk1WMFXw/Hr3HRszE/ct975b4Zfw8LXUpCo0NzgCcuYXQbmyzxrfCM1hr6t4tVj2vTckuReFZK+zZkrXVMVGBbqjorI2Tq1NpEvKkhsUE6NbCjU3mJVY190owUEGB5KDLA5ER8vOJeGvQ1s0jwgN1sByCw2emZfQoIuusXpejw/zt9hkm9R8P2hizPUixk3809mibEDjYc71aa+RzqthsNyE1xIKyECkA7IpKAzGsa68+U3n1V24GzmEW3xKAxMG2vujEc4kj3X4Uh8XApao5Jkshx0Q2WTvzQvIAY6HjEsi14Nt7KVEEpUaG3Rl2dkWiKP7ZygR3BNlYoh/JtiwsTBGJBHIPGWCs6+InjCyrP+vZgLfSk1JQmMvLhlPaK5WAgL5qP9+QC7rtcY3QnPgK8Wy3/+KZa/bldhcEJK8M9ITm5iszcFWl1RVD7mpV1NmNHCyN1pwaupRU5AcdFPpOhwlO4iBd7RMSmhMzRGEBs+rYY+QPPyLf8Um26Tmmtve0tdoZzAQ9zz8kbNF2YDuBXMur66lW+99L+p6EJj9Nx2eeblP5FiYeM8Nujns8yFKyz64QTeQvT9GWWUSNN44bjLDzY3U1Gn6eNS1QYywGGs6oO4Ex4IsJgqu3VxDKlIDkP1C15Q5DgI1OImKHoAc2fvb3aDp8O5Hv+jjoZvs8JqtIsdH12Qy11cSDzz5WeSYiHQzQOWBL6UmU0KjG9C+Qan+ekAu/XK1b4Rm/5eKZZ8XQlLlP0pszgvJnumKjQo7axPpknLJDbqlUHODgmJbcGaeEl4w84/TwqOn0FWF+OaO+9MSGvOs2v7sT7HJJqnBX5RIuSONvzl/qy5oNNeMxgYp/7LC7oYY/tsfzqu7wBBrdz0IwktGEgH1F+h2wTHOvOx559VoLr7+1ZjzIZOVDKivsff/792ZlRqzovi/' +
              'r33FeaV0jNRghXS7+wpxdJ37dU1OqkAucJxkpOai63Y951SlBuBZQxzMsRCPPvul827pTJ62KGrfTNWSNbowLMeosTKZNRO/jZvrbJU6KKy3j4k6sYqO76QmGaHByJp4QnNpv3ADekGfoBz1TEAu+Wy1L4Rm3xeLZc8X1NcOIcm7WonNuSHZo6kSm0PSExtkbcyEfV5yY2puUFCM0VKYwM8IDoaEa8mpHxYdxMct26ctNHhO9d4PyQPqc/Cb2GST1GD0Ca7vPy266O+7dh8cdd0oxiwrXnijb+Q8JdV3mCySHZfd+LrzbnKgwTLHKKkWBQJinwuBLopkKGupMd2FqUgNRnihENtdzIy5gFId8ZaK1NjymI7UAEwNYGdDED8OKb3WCLilBrNapwtGeuFYyIKhzsU9/5E9Si1VKDW7mbIQGkgHGs+mnwXlkLYBueDjVb4Qmv97Phx7Pq2k5jIVZ4dkr8YzpUu6YqNCj5BClxTk5m+75AbdUqbmBqOlIoLjZHAgOViCAaKDSf1eeLZXRoTGDG9vrT4LP4lNNkmN6W4ZOHiK/t5kbsx1Y8RFWWH/YkYNjRcTpyyMbGPH1BnJFbki44TRIdgXtRgldQHc92iPmHO9+c5A593EKGup+eHHSfq4qUoNWLJsnZ6Dx75O1BNhlFWy7G6pAV9+MzpyPAQ+a3Ov8SgLqUEXGI710NO7pik47YL2kXNgxf50F2ql1OxGIDQv/5m60KCboyShMY1n/feDcsA9Smy6r/SF0Oz1nBOPh6TKBUpszgpIXqPp6WdsnIjIzV+r7crcoObm0PBoKZO9iQjOsWHJQTcVROeuD2ZmTGjwnKq9HZJ71PH8IjbZIjUYropr+8cJ90aNnLiu+duR60b3D7osygL8xWrOg7lDSsLuqjCBLodkMDUOiHgT+WFOGPs8CLyWDNkgNQCfv3u0FxZehdgmQ0WQGkjqCadFF3ljHpzSyLTU4LP/V70H9LFs8X6/RzgjagL1ZOlAqdlN2EKD4deZEBoz8Z1p' +
              'PJso2WiiGs4TXw/Kfs0Dcv77K30hNHs/q7ZpXyxVHg5K7tkByT1Dic2p06XLwZkRG0RU5saRG4yWMtkbCA4yOFh+QUtO1eNlVPW6ckW/HRkVGjynY94slhZ9i30hNtkiNZjHBNdmZtQ1IGtjX3umRmy4wdII5hz2HCtuRo6ZHXU9CMgW0vyJgEbXNDT4Gm/o6+tdBsScC8PLkyFbpAbMnL1ML+ZpXy+Gzicz/0tFkBpgfp5N4D5KI9NSg7lhcBwUZNtgyDnq1sx5zrv6Zeed1KDU7AbKU2ggGZi995/tg/J/NwXknHdXaqHBsRIRGjTMbqHBEGS30DRSDbRbaOqoRtotNKahtoXmiNdihQYy4xaav3TYJTR57UOyx9Mh2buVEpumSmxOD8geDTMrNgjIjSko1tkbp2sqIjjI4GjJqS69m1xbJkJztBI+PKPbv81+sckGqbH/osQvdhs0+naNQvWGmRmx4cZMJId0fGmccenzkesxccf93Zx34/NZr12jrFAzFA9MGGefA5FsViibpAbg84dY2NeM551oF0lFkRp7gVIExLe0e8i01NzZpps+DuTYjVlrDIFrS6c4m1JTzpQmNHdkSGgaO1kTCA0EA43mIQ8EZK/rA3J21xW+EJp924Vkz6dCkttCiU1jJTaNdkhe/anSNcNio8PIjZO9iRacsOR0vL5DmQnNP9TzOUg9nxv7ZLfYZIPUmOwHRsJ4CQsmNLOvPxMjNtyYkVaYJbU0UPhpXw8CSxygNiQeEAxMJIjtMTcKJq+Lh3sWWESyM8Fmm9QAjChzr7kF6UykLqWiSA2uAz8T5riI0kbKZVJqULcFQcfEgF5F14N/nR51rnSGj1NqypHdKTRoNKt3Dsr+dwRkz6tDcsbby30hNFWeDMleT6ivNxdJ7qk7JLehEpt6U6XLQWUgNk5EsjdKcCIZnAOryUOPfFOmQoPnk6ueyXVfKbEJZafYZIPUmHqWkoawzpm3Iur6MzFiw40ZgQOxKg2IV/1z2kVdE+L+xz91' +
              'tvDG/ixefLOv82rJDB0xM+r4iAbntnPeTYxslBrw66hZUV0kCIw0K21ph4oiNSDZuppMSg1GCuIYJRXXo4sVw+fNuY6t/6D+WUkFSk05sTmQvNBguv1MCE1N1WgerxpN1LL887WQ7P2f8HpKTTst94XQ5D2u/gp5VEUzJTanKLFpsE3y6k4uU7ExYQRn8P7V5ZpuS7XQnNs7VmhQb+QWmpPUc4oRGvV84gkNnkWuuv/r1DGzUWwqutTgL0o0JKUVAdsT0WVixIYbM6tsk4s7OK/ExyuLgka4pBE7ECGTDUKjHq8Y2eBu5BDHnPyg825iZKvUAAx1d8+Ei8LxeHVIFUlqMDmjOS4CBbrxyKTUYM0lHCNeEbAZGWUi1fWZKDXlQKaEBuKRjtAc0yksFQd3UHKgpKbKRSE5veMKXwjNPo+orw8FJPfi7ZJbf5vknqTEpvZk6fr30z1lJNPx7uktykRoDnw5Vmj2fix8v9d9GMw6sanoUoO1Y3BNWIYA2ZKSAo2NfQ/pjtiwgXCYxhONQSJAFryWMcBqzl7Y6X40AomAoeX2sRHJNrrZLDXg2/7jPdcWKimrUJGkBgW45rgIrO4dj0xJDdYHM88MQ+W9/j8h3PPpYPHPVKDUlDEVTWjMKKO/PhqS3AtVnK8E5fXlWS80e2IkFKSmTZHknq3ERklNbp0tkldzsnQpB7G5s/3wchWavdoEZO/WAWn2XiCrxKaiSw1W8HVfXyKRzLT8pYHaFnPcZJYRMEsE2IEskteChmZ9HMhTor/0cRz38RHxMhVusl1qAFayRibPvo+7237oWX9VkaTm9Is6RI6LQJdaPDIlNR3fHRR1nEQDdUyFhclnQCk1ZYiX0GA9pt0tNKY7I6+lkppzVZwdktNeXZb1QlPlwYDk3a++3qfEpvFWLTW5tZTYnFC2GZsvjzl/twhNlXuKJK/FDrmmS/aITUWWmtVrNuu/KLFcAGaWxQKP8eKmlu9E3Uc6IzZsUEhpjpnMkGk0oGbUlh2Yndhm9O9z' +
              'I+8lOkoKQEjcjTkCzyJR3FJjZmvOFFgnC8ctS6kB3T4dFnUfCAz/d4tNRZEaXJd73p3SVu/OlNTg/zf2R3bQ/X/IHe45a5KdsRpQasqIii40EAkIRN6NSmrODOhh0ae9sizrhQaxRyslNaqxz22gpKYGokD2rD6pzDI2j7TosduEZo87dkjeLdulWceirBCbiiw1b73/o76eRBerdBfOPvfat8476WFPHV9S91FJ2BPpmcBcK3bNDwpc8ToEZfbcFc6riWHWh7IDhdOJgsbV3jdTKz8bTEGq1yrjJZGK1IBO78VmINyTEVYUqYFwm2Mi0FVZGpmQmumzlup9E536AJkZe6TZWZe/4LyTOJSaMiBRocEMv5kQGjScqQgNGsy9n1ZScFl4npfc03bIaS8vzX6hua9IN/q5tyixqVMguScUSI6KvGpKbP6WWbH54cC68u8em3er0OTdtF32vH6bNHtlR4UXm4osNWYEUaKLQiLrYI/YQNFsSbUVyYDzm2O+8tYPzquJgYbZ/Rc5Al0AADO5mteuvqWTfi0ZcI/2cRHJLqJpixG6RDIJxBLHvfmed51XSidVqQEYNWbuxYQ9kqyiSE2v78K1YiYS+bnKhNRgAU3s684WxsO9uviCRd7LhJQEpSbDFHoM2y5voUGDmYjQ7PNMSDeauUoScs8OD4fG6KGGLy7RQoPJ+xIRGpzTLTRHq8baLTSmwbaFBo23W2hwXW6h+YuSGbfQ7NU2Vmj2vDcsNFXuLpK97tqhG/vcE5XYVFdRbbPkHTsho2Lz0mXPVgihybtGxdXb5KoXK7bYlIfUYJ4ZZCPizcTrZsYfyf1FaXjqhd5R9+K1onayYJSNOR4W1UwWr5l/j6jVSnbsCOjuHvPauIl/OnskzslnPxV1XMSAnyc77yaGPVkguvvWb0i8+6o0IGo4rpG4REhHasCTz/eK3I8Jc/6KIjXIXJlj4pmjeLc00pUa/P8zxb/JdM26M6CYDTkZKDUZ5uNloZSEBnPG7A6hgTCg4dy7' +
              'VUBPXmdGDp363OKsF5q97ww3/rlXqntSQpNznIpjldhU/V26ZkBsvjmssVzQfWOFEZqcy7dKzqVb5aoO2yus2JS11GBtHmRPSpsd181jHZL/ixKg+8a+l1RHbNjYCxDi38mCFP7fjo3tJsJfzZj8DP9GoXAqoCDafVzMSpwM7kbn4y+GO++kB+4bEoBjljbxoE26UgMJbvPEp1H3hEB9SEWQGqxjZddCtW0XvfRHSaQrNT8Pm6b3S/ZnzZ0BrXpSm6QyoJSaDLIpsFMempEZocFIpEwIjS0TJQmNEYXc25UA1AuPGkKBbUMlNlkvNM13SJXbtkvOv7doocn910YdeUf/Ll0OTE9smj8+tMIJTe6F6j7P2yJXPa3EJljxxKYspQaNC/5SRxdJaZOi2eAvyiNrtdbXkkqxL9bRMfeS6ogNG2RnzPGQtUmFDq+Gu2FKip+GTnO2TI5rbnsr5lioLUkGkxUzgeeXiW67zt1+0sdrmMC6RjbpSg3Az569CCkCImGWltidUgPRNsfDkOpEfz7TlRp0AWK/VIp93dkvZG8SJVNSg98F6f5fTpQKKzXjNxZnrdAYSdiz2XYtNLk1VZxYIA2eXZz9QnOripvVfZ1ZoIUm559KbI7eKHscqcTmgNTE5tXzHwt/Ji6hwXNyCw3qm8pTaHLPUV/PLJSrntxW4cQG83zYv3AQmZIaZGdwvGQzB78Mn6H3SzV7Yc5rIpVf4jamLgSBkUqpgIyVaazdgeedTBebjVm/x45nXu7jvJs47jlTUKSdDvMXro7U6mAEVDJkQmoA5BhD1O37MhmS3SU1/X+aHDnWXofdKsNGxh/GbZOO1BQUbNP3jMC/k8WdAcVcQImSCanBPqixQ5dteVBhpWbchuIoobl7XGaEBsW6mRAaSEM8odnnviLZF3JwgVOHcny4DqVB+8XZLzT/3SZ73KgEoGG+FprcI1UcsVHyjkhebL4+oqmc031zykKD5+MWGiObttCYgudUhCanqYpGBXLVwxVLbMzkdnac' +
              'dGb6UoNRP2hAsKxAMrU0wPxFmeoEeqgJsWeaPfOy5513UsPOhkyautB5NXlMl5o7MEIoVVo91iPmeM1bf+C8mziQEDR45hjoFktWRg3z5q+Smo0f08fBaKpkhc1ITWlrXyUCupuuuqVj5L5M7A6pwSi6g6uHVxlHHU2ysoefPXMdiGSkBmKPfdLpjrUzoPseeXvCq6OnKzX4/YE/cDLVLZoIFVZq/sgvziqhsUcOGaHZs6VqSO9UEnBaoRaaXHTZHLNZ6iuxyXqhUTKQe+1WqVJb3ZMSmtzDN0rOYesl79Cx0uWviYvNzU+O3C1Cg3twC03uxR5C07hAC03OKQVSpUG+XPXg1gojNv/r9H3ULxwERuukmjnAfvYIlGR/cWNuDPzCRKODJRJS5fo7OkfdE+oYUuW4Bm0jx8FEb6mCYtC9D78t6rqwpk4yk+XZ4FmfdkH7qOMh6p7xhLNFcmBpB/ciixj5kkgRK0CXFbp3zBBgNIKJNnwG3JN5RpmqvcBf9xddt0tMEMlIDRYJNfulKjUQkn+ccK8+xl+rttAZ0mSxR+EhXurYz3knPnimjS4MLyNS2gR/8fjgk6FR5+/+2TDnnfigZsjeL5nPFdf+wJOf6SHvqf4/SYUKKzV4IE9O8xaaG4dlRmjQaJal0JhGNPcmJQC187XQ5DhdNic/szirhabKddtkr2bqvq5QIlB9kxaa3ENV/EOJzSFjpGsCYtPh8hezSmhy6qlQEnd92+R+2ZcFaITcs5qawHwsm/O36m3w/yhe4JcN1irq8/24qL+K8YsU7yeD6btPN7vinh8GGY1UcHfPQRjSySC4MyupjKYyeGXZEMiyQA5TATVDmPXYPh6yClinCF1S6ALB8gxYwwqTEs6as0xPfHfDnZ0jWQgElpNIZP0qNxOn7MpGpJPBcoPPDHOsmGMnKjX4+Tf1XWa/ZH6mUUuGeiqTOcRzTKZo2gbLKJjrQCQ6UeIQpzsXn2M6XXpz/1wZdf46TR9PSDTcXYD4mUkEHBuTUWIf' +
              'CHd5UmGlBvy+rjghoTGLSKYrNJCKTAgN5MA0opACNKRVVAOaU82pQTkq3F1T/+nF2S00V6nXrlSvXaxEoOoGLTQ5h6yV3IPWSt5BY6TL/iWLzYsXPZOVQpNTU8WJm6Rrz/TT66mAX8rTZi6RW+99L+qXTaYjmXoBMHDwlMjKyxh6mupf6rg/d1cPusK+6DM6oQYJ26CroEv3n2MaeAQKn9HAYJK7ZAtqUexosiH4yz3ZbBS61tBImS66kgJ1OsgOJJspAcjMoJvCHqGTaKDwFd2GyTT8AI0/sgj2ytWYpBCF7KkKmhvUkpjMVqJS467PQpQ2TQDufcr0xXpBSJPlg6RDQpP9eTHgDwx0C9vXgYxYaXMSQUDtTCPq1VLFjJ6yAyvPx/sZXrp8vf4c7X1qN3lcizCWEfEKdDOhjg3ShO2x0GuyP0/pUqGlBvy4ojjrhQa1GzkQAjT+qEFxumuQ2WjQbnF2C42SgiqXqThficAR67TQ5PxdiY2KvL//psSmse+EBpmpGhfmOz+hZc+osXP0L3J07bi7GMoikLJPBEzkhfWU8AvM3YiaDAHeb/lQ/FmFWz/2iZY0bIu5bezj2IFiQ2xT0orfyDThvF77egWuedGStc7eiWFGv7zc6XvnldJB1gOFpe7zJxL4zBNdXdwGmRiMpEKGw87C2IFrwmeHe0KDmUqjjRqgo2rfL4eeeG+JgQUWS1vFOhHwHCF88aTmvkd76CxIjUaPet4zsi4Y0YVt8DMHwUSmCj+r+NnD84aUI1sFscHoslTpO2CC/r9kZN8d+PnD/SAbYv8c3vVgdz3/kLu7EwE5wvXi2lFLVRLIdqL7EcdGRrckycVnh+5eM4IP3c/Y74qb3tTddV77JBNYzqG8qfBSAwYtLU5YaKLWDUpDaCARmRCavf/rCI3TmFY5ozAiNMhs5B68VuopsYHQ6MY6g0KT4yE0Oa1jhQbX7BYaXLtbaPKu2R4jNCiszbtEfb1oi+Q1VSKATM3flNj8bbXkHLha8g5UYrPf' +
              'LrHxg9DkHKfiXxtl9MTEhzqnA/5ix+Ru5RWr12x2zhwfDNH02t8d4yfNd/bwBt0WXvuVFCV1ISH74rV9vEg2pY9sC/azl0ooDaTi3edNJtJpWA24bsyAjM8C3VAoCC7POodMAbGJ9/M0YfICz2dYWmA/POdEf/YTAdlKr3N5hf3zlOg9xBsijc/Xa5+SwtRezZy9zPP9VAKfU3lnaUBWSA3ov6Q464UGjWmVK5QU1NscERpkNpDVOOnJJVktNHtc4MhBQyUBfw8LTc4BKvZfKXn7j9Ri4yehyam6UXp9n3ofNyGEkMyTNVIDflhYnJTQNMiQ0GCdpEwJje6qQTdUtQ0RoQlnNRbLzT3zs1toIAdnKzmoqxp+R2hy91spOSpOr/26/Ed9Xn4RmpyjKDWEEFLRyCqpAX0XFKcsNGa0UbpCg0ncUhUaiAAa1NxzCyX3iPVhoTlgibR7ZaS+v/t/zHKhgSBgXpfj10eE5l81vtBpyPXbdso138YKDYa3Z5vQ5By5UYaOKp/JpAghhCRG1kkN+O7P4qwWmirnOw1qE9V4HrwsIjSGBwdludAoScg9TUlC1XVy8LEDo2aSXLd1p1ylPrN4QlP1jVih2ffFWKHBZ+IWmpzbw/dS1kJzTMNNu6W/mBBCSMlkpdSAb+YWpyU09l//6QiNLQVJCY2SgL3PK5RvhnrPB9FmYJYLzakFcvrthbJxU+y03hCbK78qH6HJca49SmjOcq7XFpqTExeanMM2yCtvJz9dOSGEkLIla6UGfD2nOKuFpv9v8UfPPDAge4Wm7g2Fsqmg5EwGxObSzyuu0ORUixWa3MM3aKE59+p8qYgLXBJCSGUnq6UGfDWrOG2hyVPikAmhwRwumRIawwP9w9eWTUJT5/pCWbux9Dkv1m7ZKRcqIc0moWl6Wb5sUddNCCGk4pH1UgN6zijWQmPqNNIVGkhCJoTGNKipCo3hwR+KfSc0BojNuR9TaAghhKSPL6QGfDat2JdCY2j9fbEWGlyjW2jQ0LuFRi+m' +
              '6RKaPZUAuIUm94ZYocE9uIUG9+EWmipN0hMawxolCk27U2gIIYSkh2+kBvSYWhwRGnRpZEJobDlIR2j2OTd1oTE80DfkO6ExrCncKQ3fp9CQikswGJSVK1emvAYQIaTs8ZXUgI8mFftSaAytvgv5TmgMq5XYnPgOhYZUHDZv3ixz586VUaNGSb9+/WTAgAHOO7uHUCikr2nTpk3q53KL/p4QsgvfSQ3oNnFnlNDgr/9MCM1eSgh2p9AY2nyjrt1nQmPQYtOJQkN2P8uWLZPvvvsuKkaOjJ5TqrxYu3atjBs3Tr7//vuo68H348ePl1mzZun3Cans+FJqwHvjd5YoNCi6zYTQGBkoT6ExtP465DuhMawuUGLziiU0zn1RaEh5smPHDi0TU6dOjUjEtGnh1YzLC0zwOGPGjMj5IS7Lly+X9evXy+LFi+XXX3+NvPfjjz86exFSefGt1IC3x+3crUIzYHTZCI3h/t7qHnwmNIbV+UpsnitBaK6NFZocMzLLFhp1nRQaki4LFiyIiMOiRYucV8uH2bNnR86N63AD6Zk0aZJ+/5dffnFeJaTy4mupAW+N3RlXaJANyITQ7GFJQHkIjeH+L4O+ExoDxKbm00UZE5rcGh5C808KDYnP5MmTI2KxYcMG59Wyp6CgQPr27avPO3ToUOfVWFBXgyzNsGHDnFcIqbz4XmpAp9/C87z4TWgMrb9Q9+EzoTGs3qzE5jF1b+UgNGdQaIgHw4cPj0gNRkCVFyhQNuf9/fffnVe9+eOPP+S3335zviOk8lIppAa8Naq4VKHJUWKQbUJjuL9nwHdCY4DY1HlA3ReFhpQz6N754YcftFj8/PPPzqvlw5QpUyJS079//3IVKkKylUojNeCt4cVJCQ2EIBuExtD6s4AWmrybYoUGo7TcQqPFwCU0RhCihEZJwu4SGsPqTTulRislaxQaUo5g2LQRi7Fjxzqvlg+o3zHnRiATwyHchMSnUkkNeGtYyJdCY2jdI+A7oTGs3qjE5m51DxQakmEw' +
              '0mnevHm6LmXgwIEyaNAgPbII3T5GKtDFUxLYH++jWBf7o8YFQ63TqcHBMd1DuDFfDl5PFtTnoDYI2SbMtYOvGMm1detWZwtvMPrL3m/w4MF6NBZkz4uioiJZvXq1LnAeM2aMvl4Dsl6YYwdD5fH+hAkT9PPGcHQ3uEdI3ejRo/WzhMytWbNGf4/rWbdunT6ezbZt2+TPP//U3YX4DBD4DBcuXBg3y4XjYBsM1zefHQQS90Gyj0onNeDtIaGkhcaIQEUWGkOrj9R9+UxoDFpsmqt7oNCQDIAGbebMmXpiPQSGTKOxhdTYMoHAUGov0EBjXwgNRigh0DhiH0gJGvJUWbVqVaRY2ASOjdcTATJgxAxCAFGAfOF68RokJRAIOFvvAnICKcE2Q4YM0Y0+7gv3iNcgOMhcofFHETO+nz9/vn7PDoidAWLlfh9hjyjDtUCE7HuGULmzVgjIDTCfoXkd14XvISnmNXTfQdDc4D7Ndrjf6dOn63vB9/g3yT4qpdSAjr+EfCk0htbdA74TGsPqDcVS4xZ1/RQakgZo8CExaMDw1c6A2I26CTTKbpBlwHtoSO1sADI0Zr94I5cSYcmSJZFj2YGam3jdUXgP0oFtITJ2ZgNZKXMczMNjA7GASOA9DBe398NzgSCYfe3ALMcQB1sm5syZ4+wZBsdGlgUyZbaxs1nIttj7IyCYkBwIlZExyCKyTPjMzPbYzi2QmMvHHAe1UYWFhc47YczINvsZIEOD1yByJPuotFIDOv4UTEloIAEVWWgMrT4o8p3QGLTYXK/ug0JDUsRICzIDXus5oQE33T9oTO3GHZj5a9CYesmFEQNEad08pYE1p0wGwQ7cQ0lrUSFLYrZxs3379sgx3JP2mQJlnM8ri2NLBzIi2B5SaK7DzpqUlFEqbUSZW+SMHEFi0MWE9wGyT3jfS1gMdhcisnAGfL7m9aVLlzqvhmUQr0G+SPZRqaUGvDUo6EuhMbR6r8h3QmNYvb5YajYrlNw6SmQoNCQJIAmmQcvPz3de' +
              'jQaNdEnzxKAhNl1MEB782x12F4o7Y5EKEBGTebFj4sSJzha7QNbEvI8G3+v67GOYBtyWHYiKF7YkeImEneEqSebMiLKffvrJeSUaPC9zDK/7A/YyFugCLAlbkGyB27hxY9TryBIByCvuiwuXZieVXmpAxwFBXwqNodU7Smx8JjQGiE2Ny9X1W0KTe0ys0OQeSqEhYdBYmSwKJKEk0JVhGj13w2rPIYMuGnRjxAuveo5UQINrN/gmTObCYMQC2Rav63GHadCRWTHHLKmmBDU2eB9ZLK+GH6KC99FN5QVEx5yjpBFltjh5dfvhOdhi5pVRMkBazXYIiBvAPqY7CwGxYXYm+6HUOHT8IehLoTHc32WH74TGsHpdsZx0ZX5coTmvGYWGhDE1E4h4GRT7L3zUoNhg1A5eR23I7sCWKoTdxYQskskSQbiSwc5gQSzc2KKHbiY3EAXz/ogRI5xXo7HP4TXyCZiCZK9uP2Bnokr7DPA8zLYIdDsZ7JobEyh4JtkLpcaic/+g57BtSMB+FxTKwDHZKTSGF3sWyb7qPryE5uLWW2RjfvY2+oVKWJ7vvF2ObqykxhKaE5tskk7vb1e/2Cg0JAyKZk0Dhi6MkrAXksRwYgMaWfMXPmo6dhfIcpjrQ9bCYHerJNvthXszWSwc086AQA4gKngP0uFVR4SFNs25UWvjhZ1p8hpRFq/bz2DLCGp84oGuJLOt/ZwMkCx38fOKFSucd0m2QalxMWpmSK57brvso6QGQrPfRYVy96vbZdZCf0x6tbFgp3TqVSQ3PbtNbmq/TR7quF1mzvfPhF7FxTtl6qygTJoWlJmzs1tCSdmAYlHTeHktEmkwRagI02UB7AJTdMVkGtSHoEuoNOxMkr3uk50JKUks4oH9TYE0jovh1MhemOwJnktJ3T0YMWTOXdKzNQXMCK+upXjdfgYUC5ttIGHxsGtv7EJhG3SJmW4zBO6VZCeUmhIIhXZKUWCnbiQJIf4Bw3dN4xVPHsxcNahLcWP/ZR+vngMNtFf3' +
              'STzQkKOBLW0/e1g2skoGu4aktOHk6MaxQZYEI4GwH8QGXTu4f1wPnhVqg+Jdl/1sS6pPKa1rCec3x3B3+xnsjBDCawSVwYy0wvlM4TI+M2S0bJDRMQXMCBYKZyeUGkJIpcJuNCEuXlJiN5pe3Rv2KCSvbAIaa2RS0JAmO6uwKZK1u7zc4JpR2Irt3PeAc9uNsz25nQFdR2aiOSMEaNRNETDuyc5OJYo93BsZHxtcF7I3pXUt4brMMUqa1RfCYboAvc5lKGmEFI6L/d2YLJJ7mDvJHig1hJBKBUb62A0i5qlBNwgadzSO9pBkBKQB3Rb4i99gd7MgUGuCBhSZDEgE5ACNN2o/ksWcH+f16p6xJ6jDObzmgrG72BBorLEdrg9FxqgtgdDY2Qq7hgj7Q0DQ+GMfSB62RRbIq5bGgGdpjoEsD2pTkA1CdxG6iYzQIPA88XzsZwSRsruBvIaMG+xiaUiIW8JwbnM+ZJnszIvpurOzSbgvk0VisXD2QqkhhFQ6zMR5XoH1gpCpsF9DVsEeNo2sg12o6w4co6T5b0rDFgPIFwTDLFMAObHneCkpC4RJ6uzJ/9yB49gzKAOvpQhKCgiLV5G111IJCMgF6nvc7+NeIDwQDlyTyT6ZwHPH/SPc0oLPwEwUiECXIMQMxzPPEOfF925MTQ7Oh8wdZBbnwmvIlOHYJDuh1BBCKiX4Sx7ygYYM9SNoVE3NCP6yR6YEjWS8yfkgG2jgTQOKbinITzqNIkZnIQuBUULIANnZDQSyNJCDeLU8ANKCIdPIyGA/CATuMV63FrpozPaJBDI4NrhvXDueHd6HeOGYRkjwPJENwVc8a5M9wfu4tnhhZ1psULeEz8vUOeF54Ryox3GLmwHPBdJnRnMh8LPg1VVHsgtKDSGkUuMlIGhAkxGTdCSmNHBsNPpYGbs0kSmJRK8PggAhQGOP7ipkY9A9hCwRshsQLrtuJt6ij17njFfQmwlS+RywTyr7kYoJpYYQQojODCHL4a4/cQMBMN1EyLgQUpGg' +
              '1BBCSCXHrDaOLpnSshaYp8cUWruHRROyu6HUEEJIJQZZGSMpqIGJl6XBe6YIN9nZigkpDyg1hBBSicFQZnuIO0Z+edXuYPizGaqOzA7rUEhFhFJDCCGVHHsmYIQZDYZCYCyKaeaOwbBn9yzEhFQkKDWEEFLJQdYFi0tiZJOdtcEwcLyG4dGpzrtDSHlCqSGEEBJFvLoaQioylBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQHyDy//O30PvAjFjdAAAAAElFTkSuQmCC', width: 160, height: 50, border:[true, true, false, false]},
              {text: `\n\n${this.xtituloreporte}`, fontSize: 9.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n${this.xrecibo}\n\n`, border:[false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos de la Póliza', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia de la Póliza:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fdesde_pol)}`, border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fhasta_pol)}`, border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, '*'],
            body: [
              [{text: 'Fecha de Suscripción:', rowSpan: 2, bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.fsuscripcion), rowSpan: 2, alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, false]}, {text: `Sucursal ${this.xsucursalemision}`, border: [false, false, true, false]}],
              [{}, {}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalsuscriptora}`, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: 'Vigencia del Recibo:', bold: true, border: [false, false, false, false]}, {text: 'Desde:', bold: true, border: [false, false, false, false]}, {text: `${this.changeDateFormat(this.fdesde_rec)}`, border: [false, false, false, false]}, {text: 'Hasta:', bold: true, border: [false, false, false, false]}, {text: `${this.changeDateFormat(this.fhasta_rec)}`, border: [false, false, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 50, 80, '*'],
            body: [
              [{text: 'Fecha de Emisión:', rowSpan: 2, bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), rowSpan: 2, alignment: 'center', border: [false, false, true, true]}, {text: 'Tipo de Movimiento:', bold: true, border: [false, false, false, false]}, {text: 'EMISIÓN', border: [false, false, false, false]}, {text: 'Frecuencia de Pago:', bold: true, border: [false, false, false, false]}, {text: this.getPaymentMethodology(this.cmetodologiapago), border: [false, false, true, false]}],
              [{}, {}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.xmoneda, border: [false, false, false, true]}, {text: 'Prima', bold: true, border: [false, false, false, true]}, {text: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal), border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, '*', '*'],
            body: [
              [{text: 'TOMADOR:', bold: true, border: [true, false, false, false]}, {text: this.xnombrecliente, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', rowSpan: 2, bold: true, border: [false, false, false, true]}, {text: this.xdocidentidadcliente, rowSpan: 2, border: [false, false, true, true]}],
              [{text: 'Índole o Profesión:', bold: true, border: [true, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {}, {}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, 24, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 40, 20, 30, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, false, true]}, {text: 'E-mail:', bold: true, border: [false, false, false, true]}, {text: this.xemailcliente, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [80, 280, 24, '*'],
            body: [
              [{text: 'DIRECCIÓN DE COBRO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 50, 24, 50, 24, '*', '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Zona Cobro:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, 24, '*'],
            body: [
              [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: `${this.xnombrepropietario} ${this.xapellidopropietario}`, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, 24, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionpropietario, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadopropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 134, 40, 20, 30, 50, 24, '*'],
            body: [
              [ {text: 'Ciudad:', bold: true, border: [true, false, false, false]}, {text: this.xciudadpropietario, border: [false, false, false, false]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.xtelefonocelularpropietario, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.xemailpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL INTERMEDIARIO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, '*', 40, 30, 45, 30],
            body: [
              [{text: 'INTERMEDIARIO:', bold: true, border: [true, false, false, false]}, {text: this.xnombrecorredor, border: [false, false, false, false]}, {text: 'Control:', bold: true, border: [false, false, false, false]}, {text: this.ccorredor, border: [false, false, false, false]}, {text: 'Participación:', bold: true, border: [false, false, false, false]}, {text: '100%', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'CONDICIONADOS Y ANEXOS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: this.buildAnnexesBody()
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'ANEXOS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: this.xanexo, border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'OBSERVACIONES', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: this.xobservaciones, border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'ACCESORIOS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*', '*', '*'],
            body: [
              [{text: 'ACCESORIO', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [true, false, true, true]}, {text: 'SUMA ASEGURADA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'PRIMA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*', '*', '*'],
            body: this.buildAccesoriesBody()
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'EL TOMADOR Y/O ASEGURADO DECLARA(N) RECIBIR EN ESTE ACTO LAS CONDICIONES GENERALES Y PARTICULARES DE LA PÓLIZA, ASÍ COMO LOS ANEXOS', bold: true, alignment: 'center'}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [180, '*', 180],
            body: [
              [{text: 'Para constancia se firma:\nLugar y fecha', colSpan: 3, border: [true, false, true, false]}, {}, {}],
              [{text: ' ', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABNAIgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD97t386UjcKXGKD0rnNDM8WeHI/GHhbU9HnaSOHVLSWzd0O1kEiFMg9iM5B7Guc/Z1n1BvgN4LGq3zanqSaLaR3l2ybGuZkiVHcjnDFlJI9c12bDa+6uX+Fy/YbHVtNZlM2lazexsB91FllN3Eo9hDcxDHbFV0A6mWVYYmdm2qoJJPYVxeieNNaHxFk0vWLHTbWw1SCS90VreZ3uPJiEAkW5BAVZN82QEyoUAZY5I7Ryr/ACnoe3rXl/xl8aaV4F+Mvge/1a9hsLcWWrR75MlpSwtMRooBaR2bbhFBY44BwaI66AeoI24dK4fxN8W5r7W7jw/4OtIte8QwsY7qWVmj0vRD1LXUyg/OOiwRBpWYqGESF5o6cdh4o+MUT/bPt3gnwxM2FtIZzFrmoxdCZZIz/oSvjhYmafYVJeCQtHH23hrw1p/hDQrXTNIsbPTNNs12QWtrEsUMS9eFXgUaLcCv4F0HUPDPhe0stU1q68RahGHa41C4higedmdm4SNVVVXcEUYJCqu5mbLHYzzQaQHNSAvejOce9NU4P16UFgR9KAHYpCMnPNLmigCNl2mgrgU5zgU1vlH0oAO/86KCf8+tFIBydKcTg01OBSnqKYDDz9fSua8Nxrp3xE8V28YIW5NnqTsR1d4Tbnn/AHbRPzrV8XeL9J8A6DNqmuajZ6Xp1uVElzdSiOMFiFVcnqzMQAoyWJAAJOK8k8TxeIvjV4p1aGGPUvCvh3UvD8qRoAYdX1xEdgvGN1nG3mDHP2gq/IgYcXGNwNv4iftN6P4d8VTeFtFuNP1DxNA1sly11M0Gm6Obi4FtCbq4APzvMyxpBGGleR0DCNC0yUdJ+HnkftO6LqOranda94g03w9fTm5mTy7ezSee2jEdrACUhH7l8tzI+cM7AKF4rX/AXh/S9V8F6XY6fa2fh++8PaTZ2Wm6db+XD5yavaXA2hFwoGGc56qkjHhWNe0+B/AV7ovirVtY1TVP7Vv9Qt7axjZYfJSKCDzCpK5P7x3ldnK4U4QADHNyiorQrY6TTNRh1BrgQyrIbaUwSgZ+SRQCV/DI6etWDweB9aUMT/npS5rEkbj/AAp3UUgP60tADQMn8aTnBp/Wo8YfqfegB3VfpThQKDzQA3GT/PNNK5/rQcg/0pAKAFooxkUVOgDgPTuea5H4nfGC1+Hr2+m2dnc+IfFWpJnTtDsmX7TcjODLIzfLBbrg7ppCFGNq75GSNs3xn8SdY8S+IJPDPgWG3m1SElNS1y7iMmmaDjHyEAg3F02flhQhUALSunyJLtfDT4TaX8Mba8ktjPf6xq8guNW1i9Ikv9Xm/wCekzgAYHRI0CxRJhI0RFVRpa24HO+C/gbd6l4wtfGHj68tfEXimyydMtoEK6V4aDAhvskbctMVJVrqT96wJC+UjGOt/wASXjWfxc8Lr0S5stRi3erj7NIo/JXP4V1L1xfxRkaHxn8O5x8sa+IZYZn6ALJpd+qqfrL5I+uKE7sZpeC/hlpvgXUNQubH7R5mpeWmJXBW2gj3+VbxKAAsSGWUqOSPMIyVCgdEibRTYuRnmnn7tS33EKDxXmn7T3xg1T4SeDtH/sSCzk1jxNrcGg2Ut037m1mmSV0kdcEuuYgpA5Actzt2n0uvm3/gotDNf3PwEt4N8kjfF3RpXiSQRtJEkN2zjnAIHHBIBzjvg1HcDj/ip4z/AGpvgt4auPEHibx1+zPofh+xEUU97qrX9lCsjEICXMZALMRtXk5OMmvIIf8Agp98Urf4zW/gD/hZH7MuteJnk2+TpEPiG9icCNpn/wBIgsJLddkKs7kyYRUYtgA4+Bf+CnP7efxE/bK/aSvtD8R6ZqnhjSPCerNp+meEDEVuNOnyq7pwDmS8c8ArwquFjyGLv83eHtY8TfDn4kWi6P8A29ovizR9UENqtoJLfULO+WTyljRVw6zB/l2j5snbis5VknaxSp3V2fvg3iH9t2WzhurDTf2Y9WtZ41lilg1nVCs6lQVZSbdQVbPBz/SqVh8Vf207y2mksfB/7OOtm2leCcWviK8HkyofmjY4++ARlTjHevjX/gjd/wAFedc+H3xG074P/FG81DVtC16/ay0PUZbd5r3RdQllI+yyqo3tbvKXAypMDEA4iBMf6H6H4E+JHhj4c+OvDek6JbaFqPirxFrF5aa9banbltMi1DURsu1iwC80NtLLMykjMkCIGfzC6aQakrk2seczfHL9tC31RbL/AIVP8Fbi68kz+TF4mdZWQHG4I0oON3y56Z7+sMP7R37Z01r51v8AAn4aalHgrm38XQgM4faygm4x8pDA88MpHNdLN4Z8eeN/i/4FvLW40+z+IngPwzZab4ljOpxSF4dRleG7DbSWLBbYX8RwC7WQjynmuRgfs/eEPEt58CtF0DwmusXOn6bpml6Y95pHjKJ4NNutOvpri6jleG6XdLeW8kQWSNW80zL55RRxfISRx/tPftmW3E37Mfhm7YBSWg8a2Eat0yBuuSe55I7e/FqH9qn9r0L837KOlMVODt+IOmAN2yP3p47888963pfhn8ZbN9Pjvh441ae20yWCHUtM8RwW5luhZr9luby2e5SFZElZo5EiWaGV4BKUxKUTaudJ+N2k2Vn5f9sXLR6nqqatGJ7F2vYLiO5itJrVmlBjSCZLWYKdjCKVxsZxsC5Q8v8AM4E/8FFvjD8NPGPhG0+Kn7Ok3gLQ/FniKy8OQ6qPGNrqB+0XcqxxokUCvucZeQh3RfLhkw+/y0cqP9vu81DUfhd+zDa6xaapZ6q3xe8LW9yuo+W1xJMm9ZHYxsy8ncd2eeo4IJKmMVswPsq3iWFdqKqLkthRgZJJJ+pJJPqTTxxSZJbj86UHJH0qShGG76VxPx+dofAdnPHtU2viHQ5ix/gQaraeYf8Av2XH0Nds52iuM/aCsJNT+Bni2KHmb+y55YyByropdWHuCoP1FOO4Lc7KMY4z90kUp5Peo7O6jvYhNEwaOYCRGH8StyD+RqTOWpAOFeL/ALZXw3vviBB8MptOktY7jw38QdG1iVZnVTLbR3CrOqE87hG5k4/hibNe0Csfx14C0n4keHbjStZsxeWdwrKwEjwyR7lKlo5EKyRvtYjejKwycGqjZPUDybXP2cvgV4z/AGmNN+L19p3gu++I2j2/2O21Y38bMCuFSRo9/lvPGuUSVlMiKxVSBxSr+xl8FdS/aph+Na6D4dm+Isdt9nTUkuVKGTGwXJiDeW115f7sTkGTy/lzjFcvf/8ABIj4CapFIs/hbxQyyYDBfHviFNwGcdL4ep+vHoKop/wRr/Z7iVtvhXxV5jujtK3j3XnkITGFy14fl2gLj0A9AQaBr3O+8G/8E/8A4U+C/wBqvW/jZpHhe1h8ea/D5c92kha3ilIKzXUMP3IriZNqySLgttJ4aSVpPY2jaD5mVgsfzE7ScAc18n61/wAETvgDrKTKujeMbXzRLtMfjHU3MJkQqSnmTN0J3KDkAgcY4rnLz/gg/wDBlgwtNY+Jmmq3QQa7FIUGCMBpYHbjJwSSeevAwf1/WganKfATT/h3ZfE7WPH0ei/tILdeHbjVdblGvaLamNbyWO5i2RBIwxuGWWZ4ix83dcKrODI6N418b7b4f2OuDR9Mt/jA0Ph3VWj1GHVvC27TLqyW9nuriKyt4p4WhW5uJYkeMBGUru2wvbM0H0xD/wAER/AEEQW3+JXxttmVAitFrtkGQDv/AMefJ7c5q1p3/BGnwzpFr5dr8Zf2gIQiGOPd4hsZFjHP8LWeOvPqeeeTVc39f0g2/r/gHz9pN98Dba2mjm8V/HbUZmuVggbUPDaEw20ISAWaRpEgWNlsrNo2cfu3FrI5/d3AX7m/YivtFb4NX2l6BqWua7aeHvEer2E+qanb+W+o3BvZbiWSNtzGWENOUSVmZ3EeWZ2yzeUQ/wDBKA2V55lr+0J+0RbqxzIo8QW4MnGOWW3Bzy3PuB2qJv8Aglhr1s7Na/tLftAR/Mx2P4jlEeGLE5WJ4/m5zuGCSMnPORtNB/X9aD/+Cps27x1+y/bKyr53xk0V+VyWCMW2g9umf+A0Ungf/glVNpPxW8J+JPFXxm+JXj618H6tFrVlp2uahcXsf2mE7onBuJ5RGQ4Ulo1Viu9N212BKIySJkfXKjPsKUHcaTG0fjR/FjtWZQY4qh4i0j/hIfDmoaeG2m+tZbYN/dLoy/1rQI4/SmRnaVbrzmgDn/g9qS6z8KfDN0v3ZtKtiM/9clH9K6Lv0+70rL8FeF08EeENM0aOVp49NtktlkK7S4UYBxWpjcxpvcBQeKXPzUCkxg5pAB+7RtBOf1pR0oHFADVHXmk8v/Cn0E8igBoXDZp3SjPNGaAEzhaQvQ/AprjZ09KAAcjG3n+dFC/NRQB//9k=', width: 136, height: 77, border: [false, false, true, false]}],
              [{text: '_________________________________', bold: true, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: '_________________________________', bold: true, alignment: 'center', border: [false, false, true, false]}],
              [{text: 'FIRMA DEL TOMADOR', alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Por La Mundial Seguros, C.A', alignment: 'center', border: [false, false, true, false]}],
              [{text: `Nombre y Apellido: ${this.xnombrecliente}`, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: `Nombre y Apellido: ${this.xnombrerepresentantelegal}`, alignment: 'center', border: [false, false, true, false]}],
              [{text: `C.I: ${this.xdocidentidadcliente}`, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: `C.I: ${this.xdocidentidadrepresentantelegal}`, alignment: 'center', border: [false, false, true, false]},]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'Aprobado por la Superintendencia de la Actividad Aseguradora mediante Providencia Nº             de fecha ', fillColor: '#FFC000', alignment: 'center', border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: '\nLa Mundial  de Seguros, C.A, inscrita en la Superintendencia de la Actividad Aseguradora bajo el No. 73' + 
                      '\nDIRECCIÓN: AV. FRANCISCO DE MIRANDA, EDIFICIO CAVENDES, PISO 11, OFICINA 1101- CARACAS', alignment: 'center', border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [true, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'En caso de SINIESTRO o SOLICITUD DE SERVICIO dar aviso a la brevedad posible al número telefónico: 0500-2797288 Atención 24/7', alignment: 'center', bold: true, border: [true, false, true, true]}]
            ]
          }
        },
        {
          pageBreak: 'before',
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'AFILIACIÓN AL CLUB DE MIEMBROS DE ARYSAUTOS\n', alignment: 'center', bold: true, border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, false]}],
              [{text: ' ', border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [100, '*'],
            body: [
              [{text: 'Datos del afiliado', bold: true, border: [true, true, false, true]}, {text: ' ', border: [false, true, true, true]}],
              [{text: 'Nombres y Apellidos', border: [true, false, true, true]}, {text: this.xnombrecliente, border: [false, false, true, true]}],
              [{text: 'Tipo y número de documento de identidad', border: [true, false, true, true]}, {text: this.xdocidentidadcliente, border: [false, false, true, true]}],
              [{text: 'Dirección', border: [true, false, true, true]}, [{text: this.xdireccionfiscalcliente, border: [false, false, true, true]}]],
              [{text: 'Número de Teléfono', border: [true, false, true, true]}, [{text: this.xtelefonocliente, border: [false, false, true, true]}]],
              [{text: 'Datos del vehículo', bold: true, border: [true, false, false, true]}, {text: ' ', border: [false, false, true, true]}],
              [{text: 'Placa', border: [true, false, true, true]}, [{text: this.xplaca, border: [false, false, true, true]}]],
              [{text: 'Marca - Modelo - Versión', border: [true, false, true, true]}, {text: `${this.xmarca} - ${this.xmodelo} - ${this.xversion}`}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, false]}],
              [{text: ' ', border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'Con la compra de la póliza RCV, adquiere una membresía por el vehículo asegurado suscrita por ARYSAUTOS, C.A. sociedad mercantil domiciliada en Valencia,\n' + 
                      'Estado Carabobo e inscrita en el Registro Mercantil Segundo de la circunscripción judicial del Estado Carabobo bajo el número 73 tomo 7-A, por lo que está\n' +
                      'AFILIADO al club de miembros de en el cual tendrá acceso a los siguientes SERVICIOS con disponibilidad a nivel nacional las 24/7, los 365 días del año de\n' +
                      'manera rápida y segura para responder a todas tus requerimientos e inquietudes.', border:[false, false, false, false]
              }]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: '\nLOS SERVICIOS\n', bold: true, border: [false, false, false, false]}],
              [{text: 'Los costos de los servicios serán asumidos o no por el afiliado de acuerdo al plan contratado', border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, false]}],
              [{text: ' ', border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [100, '*', 100],
            body: [
              [{text: ' ', border: [false, false, false, false]}, {text: 'Servicios del Club', fillColor: '#D4D3D3', bold: true}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Mecánica Ligera', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Taller', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Grúa sin cobertura', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia legal telefónica', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Mantenimiento correctivo', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Mantenimiento preventivo', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Casa de repuesto', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Mecánica general', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Centro de atención 24/7', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Red de proveedores certificados', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Acompañamiento', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia en siniestros', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia vial telefónica', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
              [{text: ' ', border: [false, false, false, false]}, {text: 'Búsqueda y ubicación de repuestos', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, false]}],
              [{text: ' ', border: [false, false, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          ul: [
            'Debe llamar Venezuela al: 0500-2797288 / 0414-4128237 / 0241-8200184. Si se encuentra en Colombia al celular 3188339485\n',
            'Dar aviso a la brevedad posible, plazo máximo de acuerdo a las condiciones de la Póliza.',
            'Una vez contactado con la central del Call Center se le tomarán los detalles del siniestro (es importante que el mismo conductor realice la llamada) y de acuerdo\n' +
            'al tipo de siniestro o daño se le indicaran los pasos a seguir.',
            'Permanezca en el lugar del accidente y comuníquese inmediatamente con las autoridades de tránsito.',
            'Si intervino una autoridad competente (Tránsito Terrestre, Guardia Nacional Bolivariana, Policía Nacional Bolivariana),es necesario que solicite las experticias y\n' + 
            'a su vez las Actuaciones de Tránsito con el respectivo croquis, verifíquelas antes de firmarlas, ya que se requiere disponer de todos los detalles del accidente,\n' + 
            'los datos de los vehículos y personas involucradas. Sin estos datos, no se podrá culminar la Notificación',
            'No suministre información que puede afectarlo.'
          ]
        }
      ], 
      styles: {
        title: {
          fontSize: 9.5,
          bold: true,
          alignment: 'center'
        },
        header: {
          fontSize: 7.5,
          color: 'gray'
        },
        data: {
          fontSize: 7
        }
      }
    }
    let pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download(`Póliza - ${this.xnombrecliente}`);
    pdf.open();
    this.search_form.disable()
  }
    catch(err){console.log(err.message)}
  }

}