import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@app/_services/authentication.service';
import { NotificationQuoteServiceOrderComponent } from '@app/pop-up/notification-quote-service-order/notification-quote-service-order.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-notification-quote',
  templateUrl: './notification-quote.component.html',
  styleUrls: ['./notification-quote.component.css']
})
export class NotificationQuoteComponent implements OnInit {

  private quotedReplacementGridApi;
  private acceptedReplacementGridApi;
  private serviceOrderGridApi;
  @Input() public quote;
  currentUser;
  submitted: boolean = false;
  popup_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  editStatus: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  quotedReplacementList: any[] = [];
  acceptedReplacementList: any[] = [];
  serviceOrderList: any[] = [];
  code;
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService: AuthenticationService,
              private formBuilder: UntypedFormBuilder,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      console.log(this.quote + "\nlalala");
      if(this.quote){
        if(this.quote.type == 2){
        
          let arrayPerform = this.quote.replacements;
          arrayPerform = arrayPerform.filter((obj) => !obj.bpagar);
          for(let i = 0; i < arrayPerform.length; i ++){
            arrayPerform[i].cgrid = i;
          }
          if(this.quote.baceptacion == false){
            let arrayPerform = this.quote.replacements;
            this.quotedReplacementList = arrayPerform;
          }
          arrayPerform = this.quote.replacements;
          arrayPerform = arrayPerform.filter((obj) => obj.bpagar);
          for(let i = 0; i < arrayPerform.length; i ++){
            arrayPerform[i].cgrid = i;
          }
          if(this.quote.baceptacion == true){
            arrayPerform = this.quote.replacements;
            this.acceptedReplacementList = arrayPerform;
            console.log('hola')
            console.log(this.quote.mtotalcotizacion)
          }
          this.canSave = false;
        }else if(this.quote.type == 1){
          let arrayPerform = this.quote.replacements.filter((obj) => !obj.bpagar);
          for(let i = 0; i < arrayPerform.length; i ++){
            arrayPerform[i].cgrid = i;
          }
          if(this.quote.baceptacion == false){
            let arrayPerform = this.quote.replacements;
            this.quotedReplacementList = arrayPerform;
          }
          arrayPerform = this.quote.replacements.filter((obj) => obj.bpagar);
          for(let i = 0; i < arrayPerform.length; i ++){
            arrayPerform[i].cgrid = i;
          }
          if(this.quote.baceptacion == true){
            arrayPerform = this.quote.replacements;
            this.acceptedReplacementList = arrayPerform;
          }
          this.canCreate = true;
          this.isEdit = true;
        }
      }
    }
  }

  quotedReplacementRowClicked(event: any){
    if(this.quote.type == 1 && event.data.bdisponible){
      let eventObj = event.data;
      eventObj.bpagar = true;
      this.quotedReplacementList = this.quotedReplacementList.filter((obj) => obj.crepuestocotizacion != eventObj.crepuestocotizacion)
      this.quotedReplacementGridApi.setRowData(this.quotedReplacementList);
      this.acceptedReplacementList.push(eventObj);
      for(let i = 0; i < this.acceptedReplacementList.length; i++){
        this.acceptedReplacementList[i].cgrid = i;
        this.acceptedReplacementList[i].baceptacion = true;
      }
      this.acceptedReplacementGridApi.setRowData(this.acceptedReplacementList);
      this.quote.baceptacion = true;
      this.showEditButton = true;
      this.canEdit = true;
      this.canSave = true;
    }
  }

  acceptedReplacementRowClicked(event: any){
    if(this.quote.type == 1){
      let eventObj = event.data;
      eventObj.bpagar = false;
      this.acceptedReplacementList = this.acceptedReplacementList.filter((obj) => obj.crepuestocotizacion != eventObj.crepuestocotizacion)
      this.acceptedReplacementGridApi.setRowData(this.acceptedReplacementList);
      this.quotedReplacementList.push(eventObj);
      for(let i = 0; i < this.quotedReplacementList.length; i++){
        this.quotedReplacementList[i].cgrid = i;
        this.quotedReplacementList[i].baceptacion = false;
      }
      this.quotedReplacementGridApi.setRowData(this.quotedReplacementList);
      this.quote.baceptacion = false;
      this.canCreate = false;
      this.canEdit = false;
      this.canSave = true;
    }
  }

  onQuotedReplacementsGridReady(event){
    this.quotedReplacementGridApi = event.api;
  }

  onAcceptedReplacementsGridReady(event){
    this.acceptedReplacementGridApi = event.api;
  }

  addServiceOrder(){
    if(this.quote){
      let quote = {ccotizacion: this.quote, cnotificacion: this.quote.cnotificacion, cproveedor: this.quote.cproveedor, xnombre: this.quote.xnombre, repuestos: this.acceptedReplacementList, createServiceOrder: true};
      const modalRef = this.modalService.open(NotificationQuoteServiceOrderComponent, {size: 'xl'});
      modalRef.componentInstance.quote = quote;
      modalRef.result.then((result: any) => { 

        let serviceOrder = {
          cgrid: this.serviceOrderList.length,
          createServiceOrder: true,
          edit: false,
          cnotificacion: result.cnotificacion,
          corden: result.corden,
          xservicio: result.xservicio,
          cservicioadicional: result.cservicioadicional,
          xobservacion: result.xobservacion,
          xfecha: result.xfecha,
          xdanos: result.xdanos,
          fajuste: result.fajuste.substring(0,10),
          xdesde: result.xdesde,
          xhacia: result.xhacia,
          mmonto: result.mmonto,
          cimpuesto: 13,
          cmoneda: result.cmoneda,
          xmoneda: result.xmoneda,
          cproveedor: result.cproveedor,
          xnombre: result.xnombre,
          bactivo: result.bactivo,
          baceptacion: result.baceptacion,
          ccotizacion: this.quote.ccotizacion,
          migtf: this.quote.migtf
        }
        console.log(serviceOrder)
        this.activeModal.close(serviceOrder);
      });
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    if(this.acceptedReplacementList){
      for(let i = 0; i < this.acceptedReplacementList.length; i++){
        this.acceptedReplacementList[i].cgrid = i;
        this.acceptedReplacementList[i].baceptacion = true;
      }
    }else{
      for(let i = 0; i < this.quotedReplacementList.length; i++){
        this.quotedReplacementList[i].cgrid = i;
        this.quotedReplacementList[i].baceptacion = false;
      }
    }
    this.activeModal.close(this.quote);
  }
}
