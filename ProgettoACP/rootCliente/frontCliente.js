var main= function(){

    //"use strict"; //Permette di non utilizzare body empty e variabili non inizializzate

    //Dichiaro una variabile $cont che mi servirà per l'append del content in base alla tab selezionata
    var $cont; 

    //Trasformo i tabs in un array che scorro con un for each
    $(".tabs a span").toArray().forEach((element)=>{
    
        //Per ogni tab, setto un handler del click
        $(element).on("click", ()=>{
        
            //ogni volta che clicco un tab riassegno la classe active
            $(".tabs a span").removeClass("active"); //prima la rimuovo da tutti i tab 
            $(element).addClass("active"); //assegno active al tab cliccato
            $("main .content").empty(); //Pulisco il content

            //Per selezionare l'anchor associato al tab uso il metodo .parent() con nth-child  
            //In base al tab clickato, ho vari comportamenti

            //--------------------TAB SOTTOSCRIVI ABBONAMENTI-----------------------------------------------------------
            if($(element).parent().is(":nth-child(1)")){ //Sottoscrivi Abbonamento: permette al cliente di sottoscrivere un abbonamento mensile o annuale
            
                $cont = $("<div>");
                $contRemovable=$("<div id='removable'>");

                //bottoni per la scelta del tipo di abbonamento
                var $btnMensile=$("<button class='MENSILE'>").text("Abbonamento Mensile");
                var $btnAnnuale=$("<button class='ANNUALE' >").text("Abbonamento Annuale");

                //handler bottone Mensile
                $btnMensile.on("click",()=>{

                    //pulisco il contenuto
                    rem=document.getElementById("removable"); 
                    if(rem.hasChildNodes()){
                        //li rimuovo tutti
                        while (rem.firstChild) {
                            rem.removeChild(rem.firstChild);
                        }
                    }
                
                    //creo gli elementi adatti alla sottoscrizione
                    var $inputMeseSottoscrizione= $("<input class='calendar' type='month'>");
                    var $labelMeseSottoscrizione= $("<p class = 'labeltext'>").text(" Mese Sottoscrizione");
                    var $btnConfermaMensile= $("<button>").text("Conferma");
                
                    //handler della conferma sottoscrizione
                    $btnConfermaMensile.on("click",()=>{

                        //COMPLETARE HANDLER CONFERMA
                        if($inputMeseSottoscrizione.val()!=""){
                        
                            //crezione oggetto json da passare
                            var elemento={meseSottoscrizione:$inputMeseSottoscrizione.val()};

                            //POST ajax per passare json
                            $.ajax({
                                
                                url:"/sottoscriviAbbonamentoMensile",
                                type:"POST",
                                datatype:"json",
                                data:elemento
                            
                            }).done(()=>{ //in caso di conferma avviso il cliente

                                $("p.notify").text("Sottoscrizione avvenuta con successo").hide().fadeIn(1000).fadeOut(2000);
                                $inputMeseSottoscrizione.val("");
                            
                            }).fail((jqXHR)=>{ //in caso di fail faccio apparire errore a schermo
                                $("p.notify").text("Ops...c'è stato un errore nella sottoscrizione").hide().fadeIn(1000).fadeOut(2000);
                            })

                        }
                    
                    })

                    $contRemovable.append($labelMeseSottoscrizione)
                        .append($inputMeseSottoscrizione)
                        .append($btnConfermaMensile);


                })

                //handler bottone Annuale
                $btnAnnuale.on("click",()=>{

                    //pulisco il contenuto
                    rem=document.getElementById("removable"); 
                    if(rem.hasChildNodes()){
                        //li rimuovo tutti
                        while (rem.firstChild) {
                            rem.removeChild(rem.firstChild);
                        }
                    }

                    //creo gli elementi adatti alla sottoscrizione
                    var $inputDataSottoscrizione= $("<input class='calendar' type='date'>");
                    var $labelDataSottoscrizione= $("<p class = 'labeltext'>").text(" Data Sottoscrizione");
                    var $btnConfermaAnnuale= $("<button>").text("Conferma");

                    //handler della conferma sottoscrizione
                    $btnConfermaAnnuale.on("click",()=>{
                        
                        //COMPLETARE HANDLER CONFERMA
                        if($inputDataSottoscrizione.val()!=""){
                        
                            //estrazione dell'anno e calcolo data scadenza
                            var arrayInputDataSottoscrizione=$inputDataSottoscrizione.val().split("-");
                            var annoStr=arrayInputDataSottoscrizione[0];
                            var annoNum=Number(annoStr);
                            var annoNumScadenza=annoNum+1;

                            //creazione data scadenza
                            var dataScadenza=String(annoNumScadenza)+"-"+arrayInputDataSottoscrizione[1]+"-"+arrayInputDataSottoscrizione[2];
                            console.log(dataScadenza);

                            //creazione oggetto json da passare con tutti gli input
                            var elemento={dataSottoscrizione:$inputDataSottoscrizione.val(),dataScadenza:dataScadenza};

                            //ajax
                            $.ajax({
                                
                                url:"/sottoscriviAbbonamentoAnnuale",
                                type:"POST",
                                datatype:"json",
                                data:elemento
                            
                            }).done(()=>{ //in caso di conferma avviso il cliente

                                $("p.notify").text("Sottoscrizione avvenuta con successo").hide().fadeIn(1000).fadeOut(2000);
                                $inputDataSottoscrizione.val("");
                            
                            }).fail((jqXHR)=>{ //in caso di fail faccio apparire errore a schermo
                                $("p.notify").text("Ops...c'è stato un errore nella sottoscrizione").hide().fadeIn(1000).fadeOut(2000);
                            })

                        }

                    })

                    $contRemovable.append($labelDataSottoscrizione)
                        .append($inputDataSottoscrizione)
                        .append($btnConfermaAnnuale);

                })

                $cont.append($btnMensile).append($btnAnnuale).append($contRemovable);
                $("main .content").append($cont);

            //--------------------TAB VISUALIZZA ABBONAMENTI--------------------------------------------------------------
            }else if($(element).parent().is(":nth-child(2)")){
                
                $cont = $("<div>");
                $contRemovable=$("<ul id='removable'>");

                //bottoni per la scelta del tipo di abbonamento
                var $btnMensile=$("<button class='MENSILE'>").text("Abbonamenti Mensili");
                var $btnAnnuale=$("<button class='ANNUALE'>").text("Abbonamento Annuale");

                $btnMensile.on("click",()=>{
                    
                    //pulisco il contenuto
                    rem=document.getElementById("removable"); 
                    if(rem.hasChildNodes()){
                        //li rimuovo tutti
                        while (rem.firstChild) {
                            rem.removeChild(rem.firstChild);
                        }
                    }

                    //faccio una getJson per abbonameti mensili
                    $.getJSON("/getAbbonamentiMensili",(abbonamenti)=>{
                    
                        abbonamenti.forEach((abbonamento)=>{
                        
                            //creo elementi per la visualizzazione
                            var $labelStatoAbbonamento=$("<li class='"+abbonamento.statoAccettazione+"'>").text("Abbonamento: "+abbonamento.IDAbbMensile+" -- Mese: "+abbonamento.meseSottoscrizione+" -- Stato: "+abbonamento.statoAccettazione);

                             //Appendo al mio $content gli elementi html
                            $contRemovable.append($labelStatoAbbonamento);

                        })

                    })

                })

                $btnAnnuale.on("click",()=>{
                    
                    //pulisco il contenuto
                    rem=document.getElementById("removable"); 
                    if(rem.hasChildNodes()){
                        //li rimuovo tutti
                        while (rem.firstChild) {
                            rem.removeChild(rem.firstChild);
                        }
                    }

                    //faccio una getJson per abbonamenti annuali
                    $.getJSON("/getAbbonamentiAnnuali",(abbonamenti)=>{
                    
                        abbonamenti.forEach((abbonamento)=>{

                            //creo bottone per sospendere abbonamento annuale
                            var $btnSospensione=$("<button>").text("Sospendi abbonamento");
                        
                            //creo elementi per la visualizzazione
                            var $labelStatoAbbonamento=$("<li class='"+abbonamento.statoAccettazione+"'>").text("Abbonamento: "+abbonamento.IDAbbAnnuale+" -- Data Sottoscrizione: "+abbonamento.dataSottoscrizione+" -- Data Scadenza: "+abbonamento.dataScadenza+" -- Stato: "+abbonamento.statoAccettazione+" -- Attivo/Sospeso: "+abbonamento.statoAttivo);

                            $btnSospensione.on("click",()=>{
                            
                                $labelRipresa=$("<p>").text("Inserire data ripresa:");
                                $inputRipresa=$("<input class='calendar' type='date'>");
                                $btnConfermaRipresa=$("<button>").text("Conferma");

                                $contRemovable.append($labelRipresa).append($inputRipresa).append($btnConfermaRipresa);
                               
                                $btnConfermaRipresa.on("click",()=>{
                                    
                                    if($inputRipresa.val()!=""){
                                    
                                        console.log($inputRipresa.val());

                                        //prendo data odierna
                                        var dataSospensione=new Date();
                                        var dataRipresa=new Date($inputRipresa.val().split("-")[0],$inputRipresa.val().split("-")[1]-1,$inputRipresa.val().split("-")[2]);
                                        var meseSospensione=dataSospensione.getMonth()+1;
                                        var meseScadenza=abbonamento.dataScadenza.split("-")[1];

                                        console.log(meseSospensione);
                                        console.log(meseScadenza);

                                        var diff=meseScadenza-meseSospensione;
                                        var mesiDaAggiungere;

                                        if(diff<0){
                                            var absDiff=Math.abs(diff);
                                            mesiDaAggiungere=12-absDiff;
                                        }else if(diff>0){
                                            mesiDaAggiungere=diff;
                                        }else if(diff==0){
                                            mesiDaAggiungere=12;
                                        }

                                        console.log(mesiDaAggiungere);
                                        //la funzione per aggiunger i mesi modifica anche la data che inseriamo come parametro quindi creo una copia
                                        var dataRipresaCopy=new Date($inputRipresa.val().split("-")[0],$inputRipresa.val().split("-")[1]-1,$inputRipresa.val().split("-")[2]);
                                        var nuovaDataScadenza=aggiungiMesi(dataRipresaCopy,mesiDaAggiungere);
                                        console.log(nuovaDataScadenza);

                                        var dataRipresaStr=dataRipresa.getFullYear()+"-"+(dataRipresa.getMonth()+1)+"-"+dataRipresa.getDate();
                                        var nuovaDataScadenzaStr=nuovaDataScadenza.getFullYear()+"-"+(nuovaDataScadenza.getMonth()+1)+"-"+nuovaDataScadenza.getDate();
                                        console.log(dataRipresaStr);
                                        console.log(nuovaDataScadenzaStr);
                                        
                                        console.log(abbonamento.IDAbbAnnuale);

                                        //costruisco ogg json
                                        var abbonamentoDaPassare={"abbonamento":abbonamento.IDAbbAnnuale,"dataRipresa":dataRipresaStr,"dataScadenza":nuovaDataScadenzaStr};

                                        //faccio una put per modificare l'abbonamento
                                        $.ajax({
                                            url:"/sospendiAbbonamentoAnnuale",
                                            type:"PUT",
                                            dataType:"json",
                                            data:abbonamentoDaPassare
                                        }).done(()=>{   //In caso di successo refresho
                                            $(".tabs a:nth-child(2) span").trigger("click");
                                            $(".notify").text("Abbonamento sospeso correttamente!").hide().fadeIn(1000).fadeOut(2000);
                                        }).fail(()=>{
                                            $(".notify").text("Errore nella gestione della modifica dell'abbonamento").hide().fadeIn(1000).fadeOut(2000);
                                        })

                                    }

                                })

                            })

                            //Appendo al mio $content gli elementi html
                            $contRemovable.append($labelStatoAbbonamento).append($btnSospensione);

                        })

                    })

                })

                $cont.append($btnMensile).append($btnAnnuale).append($contRemovable);
                $("main .content").append($cont);               

            //-----------------TAB VISUALIZZA GIORNI APERTURA CENTRO-------------------------------------
            }else if($(element).parent().is(":nth-child(3)")){
            
                $cont=$("<ul>");

                //devo solo retrivare i giorni della settimana e mostrarli al cliente, con una get
                $.getJSON("/getGiorni",(giorni)=>{
                
                    giorni.forEach((giorno)=>{
                    
                        var $labelGiorno; //cambia in base ad apertura centro

                        if(giorno.statoCentro=="APERTO"){
                            //creo elementi per la visualizzazione
                            $labelGiorno=$("<li class='"+giorno.nomeGiorno+"'>").text(giorno.nomeGiorno+" il centro è aperto dalle ore "+giorno.orarioApertura+" alle ore "+giorno.orarioChiusura);
                        }else if(giorno.statoCentro=="CHIUSO"){
                            $labelGiorno=$("<li class='"+giorno.nomeGiorno+"'>").text(giorno.nomeGiorno+" il centro è chiuso");
                        }

                        //Appendo al mio $content gli elementi html
                       $cont.append($labelGiorno);
                    
                    })

                })

                $("main .content").append($cont); 
            
            }
        
            return false; //Utilizzato per impedire la ripropagazione del click sui tabs
        })
    
    });

    //Trigger per attivare il tab di default (Sottoscrivi Abbonamento) quando viene aperta la pagina
    $(".tabs a:first-child span").trigger("click"); 

}

var aggiungiMesi=function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}

//Avvio del main e della funzione di notifica (passo alla prima call true)
$(document).ready(()=>{
    main(/*check(true)*/);
});

//Poi setto il check periodico passando false
/*
setInterval(()=>{
    check(false)
},1000)
*/
