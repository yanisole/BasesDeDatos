'use strict';

//<< -Módulos- >>
let http = require('http');
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let crud = require('./crud.js');
let common = require('./common.js');
//<< -Fin Módulos- >>

//<< -Variables globales- >>
let port =  process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
//<< -Fín Variables globales- >>

process.on('uncaughtException', (p_err) => {
    console.log('uncaughtException: ' + p_err);
});

//Descr: Archivos del front end
app.use('/', express.static(path.join(__dirname, '../client')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

///Descr: Re dirige a la página index
app.get('/', (p_req, p_res) => {
    p_res.render('index');    
});

///Descr: Válida las credenciales del usuario
app.post('/login', (p_req, p_res) => {
    crud.validateCredentials(p_req.body.user, p_req.body.pass)
    .then((p_validated) => {
        let w_result = (p_validated) ? "Validado" : "No Validado";
        p_res.send(w_result);
    })
    .catch((p_err) => {
        common.printError(p_err);
        p_res.send('Error: ' + p_err);
    });
});

///Descr: Obtiene los eventos del usuario
///Parámetros:
///user => Nombre del usuario
///Resultado:
///Eventos del usuario
app.get('/events/all', (p_req, p_res) => {
    crud.getEvents()
    .then((p_events) => {        
        common.debugLog('Events: ', p_events);
        p_res.send(p_events);
    })
    .catch((p_err) => {
        common.printError(p_err);        
    });
});

///Descr: Crea un evento de usuario
///Parámetros:
///event => evento de usuario
app.post('/events/new', (p_req, p_res) => {
    let w_evt = {
        title: p_req.body.title,
        start: p_req.body.start,
        end: p_req.body.end
    };

    console.log('request:', w_evt);
    crud.insertEvent(w_evt)
    .then(() => {
        p_res.send('Evento Guardado');
    })    
    .catch((p_err) => {
        common.printError(p_err);        
    });
});

app.post('/events/delete/:id', (p_req, p_res) => {
    crud.deleteEvent(p_req.params.id)
    .then(() => { p_res.send('Evento Eliminado'); })
    .catch((p_err) => {
        common.printError(p_err);        
    });
});

app.post('/events/update/:id/:startdate/:enddate', (p_req, p_res) => {
    crud.updateEvent(p_req.params.id, p_req.params.startdate, p_req.params.enddate)
    .then(() => { p_res.send('Evento Actualizado'); })
    .catch((p_err) => {
        common.printError(p_err);
    });
});

///Descr: Inicializo el servidor
server.listen(port, () => { 
    let w_username = 'yantrossero';
    
    common.printInformation('El navegador está ejecutando en el puerto: ' + port);
    //Intento crear el usuario yantrossero   
    crud.existUser(w_username)
    .then((p_exist) => {
        if(!p_exist)
            crud.createUser(w_username, 'nextU');
    })
    .catch((p_err) => common.printError(p_err));
});

//==== Funciones privadas ====//
///Descr: Procesa una excepción
function processException(p_exception, p_response, p_status){
    common.printError(p_exception);
    p_response.sendStatus(p_status).json(p_exception.message);
}
//==== Fin Funciones privadas ====//