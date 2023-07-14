# Objetivos:
- Permitir que podamos realizar la selección de los recaudos a través de una lista desplegable

# Cambios en Front:
**- 13/07/2023**

*HTML*
- Modificación en Eventos - Notificacion - Create ->
  - Dropdown tipo de recaudo -> Select Multiple
  - (Falta: mejorar diseño front al elegir las opciones)

*TS*
- Agregar variable typecollections al post: api/notification/create
  - Este contiene una lista de los recaudos elegidos en el Dropdown del html

# Cambios en Back:
**- 13/07/2023**

*notification.js*
- Agregar en variable NotificationData ->
  - ``typecollections: requestBody.typecollections``

*bd.js*
- En createNotificationQuery - después de Insert Into EVNOTIFICATION->
    
        if(notificationData.typecollections){
            for(let i = 0; i < notificationData.typecollections.length; i++){
                let insert = await pool.request()
                .input('cnotificacion', sql.Int, result.recordset[0].CNOTIFICACION)
                .input('ctiporecaudo', sql.Int, notificationData.typecollections[i])
                .input('cusuariocreacion', sql.Int, notificationData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into EVTIPORECAUDONOTIFICACION (CNOTIFICACION, CTIPORECAUDO, CUSUARIOCREACION, FCREACION) values (@cnotificacion, @ctiporecaudo, @cusuariocreacion, @fcreacion)')
            }
        }



# Cambios Realizados en Base de Datos QA:
**- 13/07/2023**

- Crear Tabla EVTIPORECAUDONOTIFICACION:

        --- Columns ---
        CNOTIFICACION:  INT - PK - No Null
        CTIPORECAUDONOTIFICACION: INT - PK - AI - No Null
        CTIPORECAUDO: INT - No Null
        FCREACION: DATETIME - No Null
        CUSUARIOCREACION: INT - No Null
        FMODIFICACION: DATETIME - Allow Null
        CUSUARIOMODIFICACION: INT - Allow Null

# Próximo:
- Permitir la recepción de estos datos en forma de lista a través de la consulta api/notification/detail