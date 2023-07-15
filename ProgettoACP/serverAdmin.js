//Dichiarazione variabili per l'utilizzo dei moduli node richiesti per creare un server
var http = require("http")
var express = require("express") //express è il framework più utilizzato dell'ambiente node, permette ad esempio di creare handler per le richieste http
var mongoose = require("mongoose") //mongoose è una libreria di node che permette di creare degli schemi per il db MongoDB
const exp = require("constants")
const { ok } = require("assert")
const { error } = require("console")
var app = express() //Crea un' "applicazione" basata sul framework express

//Configurazione middleware
app.use(express.urlencoded({extended: true})); //Permette di ricevere i JSON come array o stringhe
app.use(express.static(__dirname+"/rootAdmin")) //Setta la root di base alla directory specificata

const MaratonaCenterDB = mongoose.createConnection("mongodb://127.0.0.1:27017/MaradonaCenter"); 

//Definizione schema per gli abbonamenti mensili
var abbMensileSchema=mongoose.Schema({ //un abbonamento mensile ha un id, data di sottoscrizione, data di scadenza, stato gestito dall'operatore

    IDAbbMensile:Number,
    meseSottoscrizione:String,
    statoAccettazione:{
        type:[String],
        enum:["ACCETTATO","RIFIUTATO","ATTESO"],
        default:"ATTESO"
    }

})

var abbAnnualeSchema=mongoose.Schema({

    IDAbbAnnuale:Number,
    dataSottoscrizione:String,
    dataScadenza:String,
    dataRipresa:String,
    statoAccettazione:{
        type:[String],
        enum:["ACCETTATO","RIFIUTATO","ATTESO"],
        default:"ATTESO"
    },// eventuale aggiunta per freezare l'abbonamento annuale
    statoAttivo:{
        type:[String],
        enum:["ATTIVO","SOSPESO"],
        default:"ATTIVO"
    }

})

//gestione dei gioni settimanale, assunzione fatta anche nel progetto originale
var giornoSchema=mongoose.Schema({

    nomeGiorno:String,
    orarioApertura:{ type: String, default: '08:00' },
    orarioChiusura:{ type: String, default: '20:00' },
    statoCentro:{
        type:[String],
        enum:["APERTO","CHIUSO"],
        default:"APERTO"
    }

})

//creazione modelli 
var abbMensile=MaratonaCenterDB.model("AbbonamentoMensile",abbMensileSchema);
var abbAnnuale=MaratonaCenterDB.model("AbbonamentoAnnuale",abbAnnualeSchema);
var giorno=MaratonaCenterDB.model("giorno",giornoSchema); //i giorni sono inseriti manualmente nel db, admin potra solo gestirli

//contatori locali per id di abbonamenti
var idAbbMensile=0;
var idAbbAnnuale=0;

//Find per tenere conto dell'id più grande degli abbonamenti 
abbMensile.find({},(error,result)=>{

    var max=-1; //nel caso non ci siano abbonamenti

    //scorro i risultati e mi trovo l'id più grande
    result.forEach((element)=>{
        
        if(element.IDAbbMensile > max){
            //riassegnazione una volta trovato uno più grande
            max=element.IDAbbMensile;
        }

    });

    idAbbMensile=max;
    console.log("ID massimo Abbonamento mensile: "+idAbbMensile);

})

//Find analoga per abbonamento annuale
abbAnnuale.find({},(error,result)=>{

    var max=-1; //nel caso non ci siano abbonamenti

    //scorro i risultati e mi trovo l'id più grande
    result.forEach((element)=>{
        
        if(element.IDAbbAnnuale > max){
            //riassegnazione una volta trovato uno più grande
            max=element.IDAbbAnnuale;
        }

    });

    idAbbAnnuale=max;
    console.log("ID massimo Abbonamento annuale: "+idAbbAnnuale);

})

//-----------CREAZIONE CONNESSIONE AL SERVER-------------------
http.createServer(app).listen(4502) //gli passo l'app e lo metto in ascolto sul porto 4502

//------------METODI HTTP-----------------------------------------

//GET-fa visualizzare gli abbonamenti mensili
app.get("/getAbbonamentiMensili",(req,res)=>{

    abbMensile.find({},function(err,abbonamenti){
        
        if(!abbonamenti.lenght){
            //se ci sono abbonamenti
            res.status(200).json(abbonamenti); 
        }else{
            //se non ci sono mando errore
            res.status(404).json(abbonamenti);
        }

    })

})

//GET-fa visualizzare gli abbonamenti annuali
app.get("/getAbbonamentiAnnuali",(req,res)=>{

    abbAnnuale.find({},function(err,abbonamenti){
    
        if(!abbonamenti.lenght){
           //se ci sono abbonamenti
           res.status(200).json(abbonamenti);  
        }else{
            //se ci sono abbonamenti
            res.status(404).json(abbonamenti); 
        }
    
    })

})

//GET-fa visualizzare gli abbonamenti mensili
app.get("/getAbbonamentiMensili/:status",(req,res)=>{

    abbMensile.find({"statoAccettazione":req.params.status.toString().toUpperCase()},function(err,abbonamenti){
        
        if(!abbonamenti.lenght){
            //se ci sono abbonamenti
            res.status(200).json(abbonamenti); 
        }else{
            //se non ci sono mando errore
            res.status(404).json(abbonamenti);
        }

    })

})

//GET-fa visualizzare gli abbonamenti annuali
app.get("/getAbbonamentiAnnuali/:status",(req,res)=>{

    abbAnnuale.find({"statoAccettazione":req.params.status.toString().toUpperCase()},function(err,abbonamenti){
    
        if(!abbonamenti.lenght){
           //se ci sono abbonamenti
           res.status(200).json(abbonamenti);  
        }else{
            //se ci sono abbonamenti
            res.status(404).json(abbonamenti); 
        }
    
    })

})

//PUT-accetta una sottoscrizione mensile
app.put("/accettaSottoscrizioneMensile",(req,res)=>{

    //cerco nel db con l'id passato dal client admin e cambio lo stato
    abbMensile.findOneAndUpdate({"IDAbbMensile":req.body.idAbbMensile},{"statoAccettazione":"ACCETTATO"},(ok)=>{
        res.status(200).json(req.body);
    })

})

//PUT-rifiuta una sottoscrizione mensile
app.put("/rifiutaSottoscrizioneMensile",(req,res)=>{

    abbMensile.findOneAndUpdate({"IDAbbMensile":req.body.idAbbMensile},{"statoAccettazione":"RIFIUTATO"},(ok)=>{
        res.status(200).json(req.body);
    })

})

//PUT-accetta una sottoscrizione annuale
app.put("/accettaSottoscrizioneAnnuale",(req,res)=>{

    abbAnnuale.findOneAndUpdate({"IDAbbMensile":req.body.idAbbAnnuale},{"statoAccettazione":"ACCETTATO"},(ok)=>{
        res.status(200).json(req.body);
    })

})

//PUT-accetta una sottoscrizione mensile
app.put("/accettaSottoscrizioneAnnuale",(req,res)=>{

    abbAnnuale.findOneAndUpdate({"IDAbbMensile":req.body.idAbbAnnuale},{"statoAccettazione":"RIFIUTATO"},(ok)=>{
        res.status(200).json(req.body);
    })

})

//GET-fa visualizzare i giorni in cui il centro è aperto o chiuso
app.get("/getGiorni",(req,res)=>{

    giorno.find({},function(err,giorni){
    
        if(!giorni.lenght){
            //se ci sono abbonamenti
            res.status(200).json(giorni);  
         }else{
             //se ci sono abbonamenti
             res.status(404).json(giorni); 
         }

    })

})

//PUT-chiude il centro nel giorno scelto
app.put("/chiudiGiorno",(req,res)=>{

    giorno.findOneAndUpdate({"nomeGiorno":req.body.giorno},{"statoCentro":"CHIUSO"},(ok)=>{
        res.status(200).json(req.body);
    })

})

//PUT-chiude il centro nel giorno scelto
app.put("/apriGiorno",(req,res)=>{

    giorno.findOneAndUpdate({"nomeGiorno":req.body.giorno},{"orarioApertura":req.body.oraApertura,"orarioChiusura":req.body.oraChiusura,"statoCentro":"APERTO"},(ok)=>{
        res.status(200).json(req.body);
    })

})
