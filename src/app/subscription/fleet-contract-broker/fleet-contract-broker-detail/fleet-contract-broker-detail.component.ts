import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environments/environment';
import { initUbii } from '@ubiipagos/boton-ubii-dc';
import { AdministrationPaymentComponent } from '@app/pop-up/administration-payment/administration-payment.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-fleet-contract-broker-detail',
  templateUrl: './fleet-contract-broker-detail.component.html',
  styleUrls: ['./fleet-contract-broker-detail.component.css']
})

export class FleetContractBrokerDetailComponent implements OnInit {
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  marcaList: any[] = [];
  modeloList: any[] = [];
  coberturaList: any[] = [];
  versionList: any[] = [];
  planList: any[] = [];
  CountryList: any[] = [];
  StateList: any[] = [];
  CityList:  any[] = [];
  colorList:any[] = [];
  metodologiaList:any[] = [];
  status: boolean = true;
  plan: boolean = false;
  closeResult = '';
  ctipopago : number;
  xreferencia: string;
  mprima_pagada: number;
  fcobro: Date;
  guardado: boolean = false;
  bpago: boolean = false;
  pagos: boolean = false;
  bpagarubii: boolean = false;
  bemitir: boolean = false;
  bpagomanual: boolean = false;
  paymentList: {};

  constructor(private formBuilder: UntypedFormBuilder, 
              private _formBuilder: FormBuilder,
              private authenticationService : AuthenticationService,
              private router: Router,
              private http: HttpClient,
              private webService: WebServiceConnectionService,
              private modalService : NgbModal) { 

              }
              async ngOnInit() {           
this.search_form = this.formBuilder.group({
  icedula:['', Validators.required],
  xrif_cliente:['', Validators.required],
  xnombre: ['', Validators.required],                  
  xapellido: ['', Validators.required],
  xtelefono_emp: ['', Validators.required],
  xtelefono_prop:[''],
  email: ['', Validators.required],
  cpais:['', Validators.required],
  cestado:['', Validators.required],
  cciudad:['', Validators.required],
  xdireccionfiscal: ['', Validators.required],
  xplaca: ['', Validators.required],
  cmarca: ['', Validators.required],                  
  cmodelo: ['', Validators.required],
  cversion: ['', Validators.required],
  cano: ['', Validators.required],
  ncapacidad_p: ['', Validators.required],
  ccolor: ['', Validators.required],
  xserialcarroceria: ['', Validators.required],
  xserialmotor: ['', Validators.required],
  xcobertura: ['', Validators.required],
  xtipo: ['', Validators.required],
  cplan: ['', Validators.required],
  cmetodologiapago: [''],
  femision:['', Validators.required],
  ncobro:[''],
  ccodigo_ubii:[''],
  ctipopago:[''],
  xreferencia:[''],
  fcobro:[''],
  mprima_pagada:[''],
  xpago: [''],
  xcolor: [''],
  binternacional: ['']
})

 ;
;
  this.currentUser = this.authenticationService.currentUserValue;
  if(this.currentUser){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cusuario: this.currentUser.data.cusuario,
      cmodulo: 112
    }
    this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
      if(response.data.status){
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

  if(this.currentUser.data.crol == 16){
    this.bemitir = true;
  }else{
    this.bemitir = false;
  }
}
async initializeDropdownDataRequest(){
    this.getPlanData();
    this.getColor();
    this.getCobertura();
    this.getCountry();


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
        this.marcaList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
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
        }
        this.CityList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  } 
async getModeloData(){
    let params = {
      cpais: this.currentUser.data.cpais,
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
           id: request.data.list[i].cmodelo, 
           value: request.data.list[i].xmodelo });
      }
      this.modeloList.sort((a, b) => a.value > b.value ? 1 : -1)
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
        for(let i = 6; i < response.data.list.length; i++){
          this.metodologiaList.push({ 
            id: response.data.list[i].cmetodologiapago,
            value: response.data.list[i].xmetodologiapago,
          });
        }
        this.metodologiaList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  }  
  searchVersion(){
    let version = this.versionList.find(element => element.control === parseInt(this.search_form.get('cversion').value));
    this.search_form.get('cano').setValue(version.cano);
    this.search_form.get('ncapacidad_p').setValue(version.npasajero);
  }
  ValidationPlan(){

    let metodologiaPago = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
    this.search_form.get('binternacional').setValue(metodologiaPago.binternacional);

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
  OperationUbii(){
    let metodologiaPago = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
   let params = {
    cplan: metodologiaPago.id,
    cmetodologiapago: this.search_form.get('cmetodologiapago').value,
    xtipo: this.search_form.get('xtipo').value,

  }
     this.http.post(`${environment.apiUrl}/api/fleet-contract-management/value-plan`, params).subscribe((response: any) => {
      if(response.data.status){
        this.search_form.get('ncobro').setValue(response.data.mprima);
        this.search_form.get('ccodigo_ubii').setValue(response.data.ccubii)
      }
     let prima =  this.search_form.get('ncobro').value.split(" ");
     let orden : string = "UB_" + response.data.ccubii

     initUbii(
       'ubiiboton',
       {
         amount_ds: prima[0],
         amount_bs:  "0.00",
         concept: "COMPRA",
         principal: "ds",
         clientId:"f2514eda-610b-11ed-8e56-000c29b62ba1",
         orderId: orden
       },
       this.callbackFn,
       {
         text: 'Pagar'
       },


     );
      },);
  }
  validatecarstopyear(){
  const now = new Date();
  const currentYear = now.getFullYear();
    
   if(this.search_form.get('cano').value > currentYear + 1){
     this.search_form.get('cano').setValue(currentYear);
   }

  }
  femisio(){
  const date = new Date();
  const currentDayOfMonth = date.getDate();
 
  if(this.search_form.get('femision').value > (currentDayOfMonth + 5)){
    this.search_form.get('femision').setValue(currentDayOfMonth + 4);
  }
  if(this.search_form.get('femision').value < (currentDayOfMonth + 5)){
    this.search_form.get('femision').setValue(currentDayOfMonth - 4);
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
        this.search_form.get('xdireccionfiscal').setValue(response.data.xdireccion);
        this.search_form.get('ccorredor').setValue(response.data.ccorredor);
        this.search_form.get('cestado').setValue(response.data.cestado);
        this.search_form.get('cciudad').setValue(response.data.cciudad);

      } 
    },);
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
          mprima_pagada: result.mprima_pagada
        }
        if(this.paymentList){
          this.bemitir = true
        }

        this.onSubmit(this.search_form.value)
      }
    });
  }

  async callbackFn(answer) {

    if(answer.data.R == 0){
      window.alert(`Se ha procesado exitosamente el pago de la póliza Presione guardar para registrar el pago en la plataforma.`) 
    
      const response = await fetch(`${environment.apiUrl}/api/`, {
        "method": "POST",
        "headers": {
          "CONTENT-TYPE": "Application/json",
          "X-CLIENT-ID": "f2514eda-610b-11ed-8e56-000c29b62ba1",
          "X-CLIENT-CHANNEL": "BTN-API",
          "Authorization": "SKDJK23J4KJ2352304923059"
        },
        "body": JSON.stringify({
          paymentData: {
            crecibo: answer.data.orderID,
            ctipopago: answer.data.method,
            xreferencia: answer.data.ref,
            fcobro: answer.data.date,
            mprima_pagada: answer.data.m
          }
        }) });
      
    }
    if (answer.data.R == 1) {
      window.alert(`No se pudo procesar el pago ${answer.data.M}, intente nuevamente`)
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
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
        cmarca: this.search_form.get('cmarca').value,
        cmodelo: this.search_form.get('cmodelo').value,
        cversion: version.id,
        cano:form.cano,
        ncapacidad_p: form.ncapacidad_p,
        ccolor:this.search_form.get('ccolor').value,    
        xserialcarroceria: form.xserialcarroceria,
        xserialmotor: form.xserialmotor,  
        xcobertura: this.search_form.get('xcobertura').value,
        xtipo: this.search_form.get('xtipo').value,
        cplan: metodologiaPago.id,
        cmetodologiapago: this.search_form.get('cmetodologiapago').value,
        femision: form.femision,
        ncobro: form.ncobro,
        ccodigo_ubii:form.ccodigo_ubii,
        ccorredor:  this.currentUser.data.ccorredor,
        xcedula: form.xrif_cliente,
        ctipopago: this.ctipopago,
        xreferencia: this.xreferencia,
        fcobro: this.fcobro,
        mprima_pagada: this.mprima_pagada,
        xpago: this.search_form.get('xpago').value,
        payment: this.paymentList
      };
 
     this.http.post( `${environment.apiUrl}/api/fleet-contract-management/create/Contract-Broker`,params).subscribe((response : any) => {
      if(response.data.status){
        window.alert('¡Se ha registrado exitosamente!')
        location.reload();
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


