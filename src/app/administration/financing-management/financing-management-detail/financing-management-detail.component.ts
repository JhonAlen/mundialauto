import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdministrationPaymentComponent } from '@app/pop-up/administration-payment/administration-payment.component';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-financing-management-detail',
  templateUrl: './financing-management-detail.component.html',
  styleUrls: ['./financing-management-detail.component.css']
})
export class FinancingManagementDetailComponent implements OnInit {

  @ViewChild('paymentModal') paymentModal: any;
  showSaveButton: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  sub;
  currentUser;
  detail_form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  beneficiario : string
  cedula : string
  telefono : string
  correo : string
  tipo : string
  vehiculo : string
  placa : string
  providerList: any[] = [];
  cuoteList: any[] = [];
  showError: boolean = false; 
  showSuccess: boolean = false; 
  alertMessage: string = '';

  constructor(private formBuilder: FormBuilder, 
              private authenticationService : AuthenticationService,
              public http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({

    })
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 123
      };
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.initializeDetailModule();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){ 
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let params = {
          cfinanciamiento: this.code
        }
        this.http.post(`${environment.apiUrl}/api/financing/detail`, params, options).subscribe((response: any) => {
          if (response.data.status) {
            this.beneficiario = response.data.beneficiario;
            this.cedula = response.data.cedula;
            this.telefono = response.data.telefono;
            this.correo = response.data.correo;
            this.tipo = response.data.tipo;
            this.vehiculo = response.data.vehiculo;
            this.placa = response.data.placa;

            for(let i = 0; i < response.data.list.length; i++){
              this.cuoteList.push({
                ncuotas: response.data.list[i].ncuotas,
                cuotas: response.data.list[i].cuotas,
                fvencimiento: response.data.list[i].fvencimiento,
                mmonto_cuota: response.data.list[i].mmonto_cuota,
              })
            }
          }
        })

        this.http.post(`${environment.apiUrl}/api/financing/detail-provider`, params, options).subscribe((response: any) => {
          if (response.data.status) {
            for(let i = 0; i < response.data.list.length; i++){
              this.providerList.push({
                xproveedor: response.data.list[i].xproveedor,
                xestado: response.data.list[i].xestado,
                mprecio: response.data.list[i].mprecio,
                xservicio: response.data.list[i].xservicio,
                xrepuesto: response.data.list[i].xrepuesto,
                ncantidad: response.data.list[i].ncantidad,
                cuotas: response.data.list[i].cuotas,
              })
            }
          }
        })
      }
    });
  }

  cobrarCuota(item: any) {
    this.openModal(item);
  }

  openModal(item){
    const modalRef = this.modalService.open(this.paymentModal, { centered: true });

    modalRef.result.then((result) => {
      this.onSubmit(item.ncuotas)
    }).catch((reason) => {

    });
  }

  onSubmit(ncuotas){
    console.log(ncuotas)
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cfinanciamiento: this.code,
      ncuota: ncuotas
    };
    this.http.post(`${environment.apiUrl}/api/financing/coutes`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.alert.show = true;
        this.alertMessage = `La cuota ha sido cobrada éxitosamente`;
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
          this.router.navigate([`administration/financing-management-index`]);
        }, 3000);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 401){ 
        let condition = err.error.data.condition;
        if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
      }else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    console.log(ncuotas)
  }

}
