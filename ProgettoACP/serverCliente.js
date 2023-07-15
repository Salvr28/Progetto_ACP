//Dichiarazione variabili per l'utilizzo dei moduli node richiesti per creare un server
var http = require("http")
var express = require("express") //express è il framework più utilizzato dell'ambiente node, permette ad esempio di creare handler per le richieste http
var mongoose = require("mongoose") //mongoose è una libreria di node che permette di creare degli schemi per il db MongoDB
const exp = require("constants")
//const { ok } = require("assert")
//const { error } = require("console")
var app = express() //Crea un' "applicazione" basata sul framework express

//Configurazione middleware
app.use(express.urlencoded({extended: true})); //Permette di ricevere i JSON come array o stringhe
app.use(express.static(__dirname+"/rootCliente")) //Setta la root di base alla directory specificata

//Creazione connessione al db del centro sportivo, se non esiste lo crea
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
var giorno=MaratonaCenterDB.model("giorno",giornoSchema);

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
http.createServer(app).listen(4500) //gli passo l'app e lo metto in ascolto sul porto 4500

//----------CREAZIONE RICHIESTE HTTP-------------------------

//POST-crea un abbonamento mensile
app.post("/sottoscriviAbbonamentoMensile",(req,res)=>{

    //check su abbonamento già esistente
    abbMensile.findOne({meseSottoscrizione:req.body.meseSottoscrizione},function(err,abbonamentoTrovato){

        if(abbonamentoTrovato!=null){
            //se già c'è restituisco errore
            res.status(404).json(abbonamentoTrovato);
        }else{
            //se non c'è creo l'abb
            var abbonamento=new abbMensile({IDAbbMensile:Number(++idAbbMensile),meseSottoscrizione:req.body.meseSottoscrizione,stato:"ATTESO"});
            console.log("Nuovo abbonamento mensile: "+abbonamento);

            //restituisco successo se va a buon fine il salvataggio
            abbonamento.save().then(()=>{
                //ack di conferma
                res.status(200).json(abbonamento);
            })
        }
    
    })

});

//POST-crea un abbonamento annuale
app.post("/sottoscriviAbbonamentoAnnuale",(req,res)=>{

    //check su abbonamento già esistente
    abbAnnuale.findOne({},function(err,abbonamentoTrovato){
    
        if(abbonamentoTrovato!=null){
             //se già c'è restituisco errore
             res.status(404).json(abbonamentoTrovato);
        }else{
            //se non c'è creo l'abb
            var abbonamento=new abbAnnuale({IDAbbAnnuale:Number(++idAbbAnnuale),dataSottoscrizione:req.body.dataSottoscrizione,dataScadenza:req.body.dataScadenza,stato:"ATTESO"});
            console.log("Nuovo abbonamento annuale: "+abbonamento);

            //restituisco successo se va a buon fine il salvataggio
            abbonamento.save().then(()=>{
                //ack di conferma
                res.status(200).json(abbonamento);
            })
        }
    
    })

})

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

app.put("/sospendiAbbonamentoAnnuale",(req,res)=>{

    console.log(req.body.dataRipresa);
    console.log(req.body.dataScadenza);

    abbAnnuale.findOne({"IDAbbAnnuale":req.body.abbonamento,"statoAccettazione":"ACCETTATO","statoAttivo":"ATTIVO"},function(err,abb){
        
        if(abb!=null){
            //se trovo l'abbonamento lo modifico
            abbAnnuale.findOneAndUpdate({"IDAbbAnnuale":req.body.abbonamento,"statoAccettazione":"ACCETTATO","statoAttivo":"ATTIVO"},{"statoAttivo":"SOSPESO","dataRipresa":req.body.dataRipresa,"dataScadenza":req.body.dataScadenza},(ok)=>{
                    res.status(200).json(req.body);
            })

        }else{
            res.status(404).json(req.body);
        }

    })

})
