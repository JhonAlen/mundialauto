import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FleetContractIndividualAccessorysComponent } from '@app/pop-up/fleet-contract-individual-accessorys/fleet-contract-individual-accessorys.component';
// import { initUbii } from '@ubiipagos/boton-ubii-dc';

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
  corredorList: any[] = [];
  planList: any[] = [];
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
  plan: boolean = false

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
                  cversion: [''],
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
                  ivigencia:['']
                });
                // initUbii(
                //   'ubiiboton',
                //   {
                //     amount_ds: "100.00",
                //     amount_bs: "100.00",
                //     concept: "COMPRA",
                //     principal: "ds",
                //     clientId:"f2514eda-610b-11ed-8e56-000c29b62ba1",
                //     orderId: '1'
                //   },
                //   this.callbackFn,
                //   {
                //     text: 'Pagar'
                //   }
                // );
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

  callbackFn(answer) {
    if (answer.error) {
      console.log('a');
      console.log(answer.data);
    }
    console.log(answer);
  }
async initializeDropdownDataRequest(){
    this.getPlanData();
    this.getCorredorData();
    this.getColor();
    this.getCobertura();
    this.getmetodologia();
    this.getState()

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
async getState(){
    let params =  {
      cpais: this.currentUser.data.cpais,  
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
      }
      },);
  } 
async getCity(){
    let params =  {
      cpais: this.currentUser.data.cpais,  
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
    }
  }
async getVersionData(){
    let params = {
      cpais: 58,
      cmarca: this.search_form.get('cmarca').value,
      cmodelo: this.search_form.get('cmodelo').value
    };

    this.http.post(`${environment.apiUrl}/api/version/version`, params).subscribe((response : any) => {
      if(response.data.status){
        this.versionList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.versionList.push({ 
            id: response.data.list[i].cversion,
            value: response.data.list[i].expre1,
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
    let params =  {
      xtipo: this.search_form.get('xtipo').value,  
      cmarca: this.search_form.get('cmarca').value,
      cmodelo: this.search_form.get('cmodelo').value,
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
  changeDivision(form){
    if(form.ifraccionamiento == true){
      this.cuotas = true;
    }else{
      this.cuotas = false;
    }
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
  search(){
    let params =  {
      cmarca: this.search_form.get('cmarca').value,
      cmodelo: this.search_form.get('cmodelo').value,
   
      
    };
 
    this.http.post(`${environment.apiUrl}/api/valrep/search-data-version`, params).subscribe((response: any) => {
      if(response.data.status){
        this.search_form.get('cano').setValue(response.data.cano);
        this.search_form.get('ncapacidad_p').setValue(response.data.npasajero);
      } 
    },);
  }

 functio () {
  if (this.search_form.get('cplan').value == '11'){
    this.plan = true;
  }else{
    this.plan = false;}
 }
  funcion(){
    if(this.search_form.get('xcobertura').value == 'RCV'){
      this.cobertura = false;
    }else{
      this.cobertura = true;
    }
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
  frecuencias(){

    if(this.search_form.get('cmetodologiapago').value == 2){
    this.search_form.get('ncuotas').setValue(4);}
  
    if(this.search_form.get('cmetodologiapago').value == 1){
    this.search_form.get('ncuotas').setValue(12);}
      
    if(this.search_form.get('cmetodologiapago').value == 4)
    this.search_form.get('ncuotas').setValue(2);
      
    if(this.search_form.get('cmetodologiapago').value == 3){
    this.search_form.get('ncuotas').setValue(1);}
      
    if(this.search_form.get('cmetodologiapago').value == 5){
    this.search_form.get('ncuotas').setValue(1);}

  }
  Validation(){
    let params =  {
      xdocidentidad: this.search_form.get('xrif_cliente').value,
      
    };
 
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/validation`, params).subscribe((response: any) => {
      if(response.data.status){
        this.search_form.get('xnombre').setValue(response.data.xnombre);
        this.search_form.get('xapellido').setValue(response.data.xapellido);
        this.search_form.get('xtelefono_emp').setValue(response.data.xtelefonocasa);
        this.search_form.get('xtelefono_prop').setValue(response.data.xtelefonocelular);
        this.search_form.get('email').setValue(response.data.xemail);
        this.search_form.get('xdireccionfiscal').setValue(response.data.xdireccion);
        this.search_form.get('ccorredor').setValue(response.data.ccorredor);

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
        femision: form.femision,
        xtelefono_prop: form.xtelefono_prop,
        xdireccionfiscal: form.xdireccionfiscal,
        xserialmotor: form.xserialmotor,
        xserialcarroceria: form.xserialcarroceria,
        xplaca: form.xplaca,
        xtelefono_emp: form.xtelefono_emp,
        cplan:this.search_form.get('cplan').value,
        ccorredor:  this.search_form.get('ccorredor').value,
        xcedula: form.xrif_cliente,
        xcobertura: this.search_form.get('xcobertura').value,
        xtipo: this.search_form.get('xtipo').value,
        ncapacidad_p: form.ncapacidad_p,
        cmetodologiapago: form.cmetodologiapago,
        msuma_aseg: form.msuma_aseg,
        pcasco: form.pcasco,
        mprima_casco: form.mprima_casco,
        mcatastrofico: form.mcatastrofico,
        mprima_blindaje: form.mprima_blindaje,
        msuma_blindaje: form.msuma_blindaje,
        pdescuento: form.pdescuento,
        ifraccionamiento: form.ifraccionamiento,
        ncuotas: form.ncuotas,
        mprima_bruta: form.mprima_bruta,
        pcatastrofico: form.pcatastrofico,
        pmotin:form.pmotin,
        mmotin:form.mmotin,
        cestado: this.search_form.get('cestado').value,
        cciudad: this.search_form.get('cciudad').value,
        cpais:this.currentUser.data.cpais,
        pblindaje: form.pblindaje,
        icedula: this.search_form.get('icedula').value,
        ivigencia: this.search_form.get('ivigencia').value,
        accessory:{
          create: this.accessoryList
        }
      };
     this.http.post( `${environment.apiUrl}/api/fleet-contract-management/create/individualContract`,params).subscribe((response : any) => {
      if(response.data.status){
        location.reload()
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