'use strict';

//<< -Módulos- >>
let common = require('./common.js');
let mongoClient = require('mongodb').MongoClient;
//<< -Fin Módulos- >>

//<< -Constantes globales- >>
//const _url = 'mongodb://localhost/nextUDb';
const _url = 'mongodb://localhost/';
const _database = 'nextUDb';
const _usersCollection = 'users';
const _eventCollection = 'events';
//<< -Fín Constantes globales- >>

module.exports = {
    createUser: createUser,
    searchUser: searchUser,
    existUser: existUser,
    validateCredentials: validateCredentials,
    getEvents: getEvents,
    insertEvent: insertEvent,
    deleteEvent: deleteEvent,
    updateEvent: updateEvent
}

//<< -Métodos Públicos- >>
///Descr: Crea un nuevo usuario
///Parámetros:
///p_username => Nombre de usuario
///p_password => Contraseña de usuario
function createUser(p_username, p_password){
    return new Promise((p_resolve, p_reject) => {
        mongoClient.connect(_url, (p_error, p_db) => {
            let w_collection = null, w_json = null;
            let w_username = '', w_pwd = '';

            try{
                if(!assertDatabase(p_error))
                    return;

                w_username = p_username.trim();
                w_pwd = p_password.trim();
                if(!assertUser(w_username, w_pwd, p_reject))
                    return;

                w_collection = p_db.db(_database).collection(_usersCollection);
                w_json = createUserJson(w_username, w_pwd);
                w_collection.insert(w_json);
                common.printInformation('Usuario creado: ' + w_username);

                p_db.close();
                p_resolve();

            }catch(p_err){
                p_db.close();
                p_reject(p_err);
            } 
        });
    });
}

///Busca un usuario
///Parámetros:
///p_username => Nombre de usuario
///Resultado:
///Usuario => si existe
function searchUser(p_username){   
    return new Promise((p_resolve, p_reject) => {
        mongoClient.connect(_url, (p_error, p_db) => {
            let w_user = null, w_collection = null;
            let w_username = '';

            try{
                if(!assertDatabase(p_error))
                    return;

                w_username = p_username.trim();
                if(!assertUsername(w_username, p_reject))
                    return;

                w_collection = p_db.db(_database).collection(_usersCollection);
                w_user = w_collection.findOne({ usename: w_username });              
                  
                p_db.close();
                p_resolve(w_user);  
            }catch(p_err){
                p_db.close();
                p_reject(p_err);
            }   
        });
    });    
}

///Dice si un usuario existe
///Parámetros:
///p_username => Nombre de usuario
///Resultado:
///Verdadero o falso
function existUser(p_username){
    return new Promise((p_resolve, p_reject) => {
        searchUser(p_username)
        .then(function(p_user){
            if(p_user) p_resolve(true); 
            else p_resolve(false);
        })
        .catch((p_err) => p_reject(p_err));
    });    
}

///Dice si los datos del usuario son válidos
///Parámetros:
///p_username => Nombre de usuario
///p_password => Contraseña de usuario
///Resultado:
///Verdadero o falso
function validateCredentials(p_username, p_password){
    return new Promise((p_resolve, p_reject) => {
        mongoClient.connect(_url, (p_error, p_db) => {
            let w_username = '', w_pwd = '';
            let w_collection = null, w_user = null, w_json = null;

            if(!assertDatabase(p_error))
                return;

            w_username = p_username.trim();
            w_pwd = p_password.trim();
            if(!assertUser(w_username, w_pwd, p_reject))
                return;

            
            w_collection = p_db.db(_database).collection(_usersCollection);
            common.debugLog(w_collection);
            w_json = createUserJson(w_username, w_pwd);
            w_user = w_collection.findOne(w_json);

            p_db.close();

            if(!w_user)
                p_resolve(false);
            else
                p_resolve(true);
        });
    });
}

///Obtiene los eventos del usuario
///Parámetros:
///p_username => Nombre de usuario
///Resultado:
///Eventos del usuario
function getEvents(){
    return new Promise((p_resolve, p_reject) => {
        mongoClient.connect(_url, (p_error, p_db) => {
            let w_collection = null; 
            let w_events = [];

            try{
                if(!assertDatabase(p_error))
                    return;
                
                w_collection = p_db.db(_database).collection(_eventCollection);
                w_collection.find({}).toArray(function(p_err, p_events) {
                    if (p_err) throw p_err;
                                        
                    p_db.close();

                    p_events.forEach((item) => w_events.push(createEventJson(item.title, item.start, item.end)));
                    p_resolve(w_events);
                  });
            }catch(p_err){
                p_db.close();
                p_reject(p_err);
            }
        });
    });
}

///Inserta un evento
///Parámetros:
///p_event => Evento
function insertEvent(p_event){
    return new Promise((p_resolve, p_reject) => {
        mongoClient.connect(_url, (p_error, p_db) => {
            let w_collection = null; 

            try{
                if(!assertDatabase(p_error))
                    return;
                
                w_collection = p_db.db(_database).collection(_eventCollection);
                w_collection.insert(p_event);

                p_db.close();
                p_resolve();

            }catch(p_err){
                p_db.close();
                p_reject(p_err);
            }
        });
    });
}

function deleteEvent(p_eventName){
    return new Promise((p_resolve, p_reject) => {
        mongoClient.connect(_url, (p_error, p_db) => {
            let w_collection = null;

            try{
                if(!assertDatabase(p_error))
                    return;
                
                w_collection = p_db.db(_database).collection(_eventCollection);
                w_collection.remove({ title: p_eventName });

                p_db.close();
                p_resolve();

            }catch(p_err){
                p_db.close();
                p_reject(p_err);
            }
        });
    });
}

function updateEvent(p_eventName, p_startDate, p_endDate){
    return new Promise((p_resolve, p_reject) => {
        mongoClient.connect(_url, (p_error, p_db) => {
            let w_collection = null;

            try{
                if(!assertDatabase(p_error))
                    return;
                
                w_collection = p_db.db(_database).collection(_eventCollection);
                w_collection.findOneAndUpdate(
                    { title: p_eventName },
                    { title: p_eventName, start: p_startDate, end: p_endDate});

                p_db.close();
                p_resolve();

            }catch(p_err){
                p_db.close();
                p_reject(p_err);
            }
        });
    });
}

//<< -Fín Métodos Públicos- >>

//<< -Métodos Privados- >>
///Dice si los datos del usuario son válidos
///Parámetros:
///p_username => Nombre de usuario
///p_password => Contraseña de usuario
///Resultado:
///Verdadero o falso
function assertUser(p_username, p_password, p_cbk){
    if(p_username === '' || p_password === ''){
        p_cbk('El usuario y la contraseña no pueden ser cadenas vacías');
        return false;
    }

    return true;
}

///Dice si los datos del usuario son válidos
///Parámetros:
///p_username => Nombre de usuario
///p_password => Contraseña de usuario
///Resultado:
///Verdadero o falso
function assertUsername(p_username, p_cbk){
    if(p_username === ''){
        p_cbk('El usuario no puede ser la cadena vacía');
        return false;
    }

    return true;
}

///Dice si ocurrio error al conectar a la base
///Parámetros:
///p_err => Decuelto por mongoClient.connect
///Resultado:
///Verdadero o falso
function assertDatabase(p_err, p_cbk){
    if(p_err){
        p_cbk('[Database Connect] - ' + p_err);
        return false;
    }

    return true;
}

///Crea el json correspondiente a un registro de usuario
///Parámetros:
///p_username => Nombre de usuario
///p_password => Contraseña de usuario
///Resultado:
///Json
function createUserJson(p_username, p_password){
    return { username: p_username, password: p_password };
}

///Crea el json correspondiente a un registro de evento
///Parámetros:
///p_eventName => Nombre de evento
///p_startDate => Fecha inicio del evento
///p_endDate => Fecha fín del evento
///p_startTime => Hora inicio del evento
///p_endTime => Hora fín del evento
///p_username => Usuario al que pertenece el evento
///Resultado:
///Json
function createEventJson(p_eventName, p_startDate, p_endDate){
    return {
        title: p_eventName,
        start: p_startDate,
        end: p_endDate
    };
}
//<< -Fín Métodos Privados- >>