import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-financing',
  templateUrl: './financing.component.html',
  styleUrls: ['./financing.component.css']
})
export class FinancingComponent implements OnInit {

  @ViewChild('bankModal') bankModal: any;
  currentUser;
  financing_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  propietaryList: any[] = [];
  vehiclePropietaryList: any[] = [];
  serviceList: any[] = [];
  replacementList: any[] = [];
  providerList = [];
  stateList: any[] = [];
  financingList: any[] = [];
  keyword = 'value';

  documento : string
  telefono : number
  correo : string
  detallecarro: string
  auth : boolean = true;
  replacement: boolean = false;
  activeProviders: boolean = false;
  activateLoaderUp: boolean = false;
  activateLoader: boolean = false;
  activateError: boolean = false;
  isModalActive: boolean = false; 
  activateFirst: boolean = false; 
  activateSecond: boolean = false; 
  activateThree: boolean = false; 
  activateFour: boolean = false; 
  dataEnable: boolean = true; 
  modalBan: boolean = true; 
  providerSelected: boolean = false; 
  activateCoin: boolean = false; 
  showError: boolean = false; 
  check: boolean = false; 
  errorMessage: string;
  messageModal: string;
  messageModal2: string;
  messageSuccess: string;
  propietary: string;
  mountsSubTotal: 0;
  mountsFlat: 0;
  alertMessage: string = '';
  half: number;

  Mountfinancing : number
  MountfinancingDisable : number
  Mounts = []
  currentPage = 1;
  itemsPerPage = 5;
  sumofamounts: any;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.financing_form = this.formBuilder.group({
      cpropietario: [''],
      cvehiculopropietario: [''],
      cservicio: [''],
      crepuesto: [''],
      mprecio: [''],
      cestado: [''],
      proveedores_seleccionados :  this.formBuilder.array([]),
      proveedores :  this.formBuilder.array([]),
      xvehiculo: [''],
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

  get proveedores_seleccionados() : FormArray {
    return this.financing_form.get("proveedores_seleccionados") as FormArray
  }

  get proveedores() : FormArray {
    return this.financing_form.get("proveedores") as FormArray
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

     //Buscar Estados
     this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.stateList.push({ 
            id: response.data.list[i].cestado, 
            value: response.data.list[i].xestado
          });
        }
        this.stateList.sort((a, b) => a.value > b.value ? 1 : -1);
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
    this.propietary = event.value;
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

    this.http.post(`${environment.apiUrl}/api/financing/wallet`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.Mountfinancing = response.data.mmonto_cartera;
      }
    });

    this.messageModal = `¿${this.propietary} Posee cuenta en Bangente?`;
    this.messageModal2 = `Le agradecemos por su interés en nuestros servicios financieros. Para continuar con el proceso de solicitud de crédito, le solicitamos que verifique si ya dispone de una cuenta en Bangente.`;
    this.openBankModal();
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
    
    this.getProviderFromService()

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

  getProviderFromService(){

    this.activeProviders = true;

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cservicio: this.financing_form.get('cservicio').value,
      cestado: this.financing_form.get('cestado').value.id
    };
    this.activateLoader = true;
    this.activateError = false;
    this.providerList = [];
    this.http.post(`${environment.apiUrl}/api/financing/provider-financing`, params, options).subscribe((response: any) => {
      if(response.data.status){

        const creds = this.financing_form.controls.proveedores as FormArray;

        while (creds.length !== 0) {
          creds.removeAt(0)
        }

        for(let i = 0; i < response.data.list.length; i++){
          this.proveedores.push(
            this.formBuilder.group({
            cproveedor :response.data.list[i].cproveedor,
            xproveedor :response.data.list[i].xproveedor,
            xtelefono :response.data.list[i].xtelefono,
            xrepuesto :'',
            crepuesto :'',
            monto:'',
            cantidad:'',

            })
          )
        }

        this.providerList = response.data.list
        this.activateLoader = false;
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ 
        this.alert.show = true;
        this.alertMessage = `No se encontro información con los parámetros seleccionados`;
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
        this.activateLoader = false;
        this.activeProviders = false;
      }
      else if(code == 500){ 
        this.activateLoader = false;
        this.activateError = true;
        this.errorMessage = "Ha ocurrido un error interno en el servidor. Pedimos disculpas por los inconvenientes."
       }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  get pagedProviderList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.providerList.slice(startIndex, endIndex);
  }

  addpprovider(i : any){
    this.providerSelected = true;
    const creds = this.financing_form.controls.proveedores as FormArray;

    this.proveedores_seleccionados.push(
      this.formBuilder.group({
      cproveedor : creds.at(i).get('cproveedor').value,
      xproveedor : creds.at(i).get('xproveedor').value,
      xrepuesto : creds.at(i).get('xrepuesto').value,
      crepuesto : creds.at(i).get('crepuesto').value.id,
      monto : creds.at(i).get('monto').value,
      cantidad : creds.at(i).get('cantidad').value,
      cservicio : this.financing_form.get('cservicio').value
      })
    )

    this.Mounts.push(creds.at(i).get('monto').value)

    this.sumofamounts = this.Mounts.reduce((a, b) => a + b, 0);

    let mitad_monto_cartera = this.Mountfinancing * 0.5;

    this.half = this.sumofamounts * 0.5

    if(this.proveedores_seleccionados){
      if(this.sumofamounts > mitad_monto_cartera){
        this.alert.show = true;
        this.alertMessage = `El sub-total ha superado el monto de financiamiento de ${mitad_monto_cartera}$`;
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
          this.removeprovider(i)
        }, 3000);
      }else{
        let compra = 0;
        let inicial = 0;
        let financiamiento = 0;
        let financiamiento_Red;
        let financing = 0;

        compra = this.sumofamounts;
        inicial = compra * 0.5;
        financiamiento = (compra - inicial) / (1 - 0.10);
        financiamiento_Red = financiamiento.toFixed(2);
        financing = parseFloat(financiamiento_Red);

        this.MountfinancingDisable = this.Mountfinancing - this.sumofamounts;

        this.MountfinancingDisable.toFixed(2);

        this.financingList = [];

        const today = new Date();
        
        const nextFifteenth = new Date(today);
        nextFifteenth.setDate(15);
        
        if (today.getDate() > 15) {
          nextFifteenth.setMonth(nextFifteenth.getMonth() + 1);
        }
        
        for (let i = 1; i <= 3; i++) {
          const xtitulo = `Cuota n° ${i}`;
          const xmonto = financing / 3;
          const xmonto_financiado = xmonto.toFixed(2);
        
          const formattedDate = `${(nextFifteenth.getDate()+ (i - 1)).toString().padStart(2, '0')}/${(nextFifteenth.getMonth() + 1).toString().padStart(2, '0')}/${nextFifteenth.getFullYear()}`;
        
          this.financingList.push({ xtitulo, fechaCuota: formattedDate, xmonto_financiado, ncuotas: i });
        
          nextFifteenth.setDate(nextFifteenth.getDate() + 15);
        }

      }
    }
  }

  removeprovider(i : any){
    this.proveedores_seleccionados.removeAt(i);
    this.Mounts.splice(i, 1)
    this.sumofamounts = this.Mounts.reduce((a, b) => a + b, 0);
    this.financingList = [];
  }

  openBankModal() {
    this.isModalActive = true;
    this.activateFirst = true;
    const modalRef = this.modalService.open(this.bankModal, { centered: true });

    modalRef.result.then((result) => {
      this.logOut()
    }).catch((reason) => {

    });
  }

  showAlternativeMessage(){
    this.activateFirst = false;
    this.activateSecond = true;
    this.messageModal = `¿Desea aperturar una cuenta corriente en Bangente?`;
    this.messageModal2 = `Si aún no cuenta con una cuenta en nuestra institución, le invitamos a abrir una cuenta para poder iniciar el proceso de solicitud de crédito.`;
  }

  showAlternativeMessageLogout(){
    this.activateFirst = false;
    this.activateSecond = false;
    this.activateThree = true;
    this.messageModal = `El proceso ha concluido`;
    this.messageModal2 = ` Para continuar con la solicitud de financiamiento, es necesario disponer de una cuenta activa en Bangente.`;
  }

  closeModal() {
    this.isModalActive = false;
  }

  generateExcel(){
    this.loading = true;
    this.modalBan = false;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpropietario: this.financing_form.get('cpropietario').value
    };
    this.http.post(`${environment.apiUrl}/api/financing/propietary-bangente`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.loading = false;
        this.modalBan = true;
        this.activateFirst = false;
        this.activateSecond = false;
        this.activateThree = false;
        this.activateFour = true;
        this.messageModal = `Solicitud enviada exitosamente.`;
        this.messageModal2 = `Estamos trabajando diligentemente en su solicitud y nos pondremos en contacto con el afiliado pronto para dar seguimiento a su proceso.`;
      }
    })
  }

  mountQuotes(){
    if(this.financing_form.get('xvehiculo').value == 'Vehiculo'){
      if(!this.Mountfinancing){
        this.Mountfinancing = 300
      }
      this.activateCoin = true;
    }else{
      if(!this.Mountfinancing){
        this.Mountfinancing = 150
      }
      this.activateCoin = true;
    }
  }

  onSubmit(){
    console.log(this.Mountfinancing)
    this.activateLoaderUp = true;
    this.providerSelected = false;
    this.activeProviders = false;
    this.dataEnable = false;
    let params = {
      cpropietario: this.financing_form.get('cpropietario').value,
      xvehiculo: this.financing_form.get('xvehiculo').value,
      cvehiculopropietario: this.financing_form.get('cvehiculopropietario').value,
      cestado: this.financing_form.get('cestado').value,
      cservicio: this.financing_form.get('cservicio').value,
      mmonto_cartera: this.MountfinancingDisable,
      cusuario: this.currentUser.data.cusuario,
      minicial: this.Mountfinancing,
      proveedores: this.proveedores_seleccionados.value,
      financiamiento: this.financingList
    };
    this.http.post(`${environment.apiUrl}/api/financing/create-financing`, params).subscribe((response: any) => {
      if(response.data.status){
        this.activateLoaderUp = false;
        this.check = true;
        this.messageSuccess = response.data.message;
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
    })
  }

  close(){
    location.reload();
  }

  logOut(){
    this.authenticationService.logout();
  }

}
