var main=function(){

    //variabile contenuto della pagina
    var $cont;

    //Trasformo i tabs in un array che scorro con un for each
    $(".tabs a span").toArray().forEach((element)=>{

        //Per ogni tab, setto un handler del click
        $(element).on("click",()=>{
        
            //ogni volta che clicco un tab riassegno la classe active
            $(".tabs a span").removeClass("active"); //prima la rimuovo da tutti i tab 
            $(element).addClass("active"); //assegno active al tab cliccato
            $("main .content").empty(); //Pulisco il content

            //--------------------TAB GESTISCI STATO ABBONAMENTI-------------------------------
            if($(element).parent().is(":nth-child(1)")){ //permette di accettare o rifiutare la sottoscrizione degli abbonamenti
            
                $cont = $("<div>");
                $contRemovable=$("<ul id='removable'>");

                //bottoni per la scelta del tipo di abbonamento
                var $btnMensile=$("<button>").text("Abbonamenti Mensili");
                var $btnAnnuale=$("<button>").text("Abbonamento Annuale");

                //listener bottone per ABB MENSILE
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
                    $.getJSON("/getAbbonamentiMensili/atteso",(abbonamenti)=>{
                    
                        abbonamenti.forEach((abbonamento)=>{
                        
                            //creo elementi per la visualizzazione e gestione richieste
                            var $labelStatoAbbonamento=$("<li class='"+abbonamento.statoAccettazione+"'>").text("Abbonamento: "+abbonamento.IDAbbMensile+"-- Mese: "+abbonamento.meseSottoscrizione+" -- Stato: "+abbonamento.statoAccettazione);
                            var $btnAccetta=$("<button name='accetta' class='"+abbonamento.IDAbbMensile+"'>").text("Accetta"); //passo sui bottoni il relativo id dell'abbonamento
                            var $btnRifiuta=$("<button name='rifiuta' class='"+abbonamento.IDAbbMensile+"'>").text("Rifiuta"); //molto utile per passaggio veloce alla successiva PUT per cambiare lo stato della sottoscrizione

                            //Appendo al mio $content gli elementi html
                            $contRemovable.append($labelStatoAbbonamento).append($btnAccetta).append($btnRifiuta);

                        })

                    }).then(()=>{

                        //gestisco gli handler di tutti i bottoni
                        document.querySelectorAll("button").forEach((button)=>{
                        
                            button.addEventListener("click",(elem)=>{
                                
                                if(elem.target.getAttribute("name")=="accetta"){
                                
                                    //creo oggetto per passare id abb, devo solo cambiare lo stato non devo creare un nuovo abb
                                    var idDaPassare={"idAbbMensile":elem.target.getAttribute("class")};

                                    //faccio una put ajax
                                    $.ajax({
                                        url:"/accettaSottoscrizioneMensile",
                                        type:"PUT",
                                        dataType:"json",
                                        data:idDaPassare
                                    }).done(()=>{   //In caso di successo refresho
                                        $(".tabs a:nth-child(1) span").trigger("click");
                                        $(".notify").text("Sottoscrizione accettata correttamente!").hide().fadeIn(1000).fadeOut(2000);
                                    }).fail(()=>{
                                        $(".notify").text("Errore nella gestione della sottoscrizione").hide().fadeIn(1000).fadeOut(2000);
                                    })
                                
                                }else if(elem.target.getAttribute("name")=="rifiuta"){
                                
                                    //creo oggetto per passare id abb, devo solo cambiare lo stato non devo creare un nuovo abb
                                    var idDaPassare={"idAbbMensile":elem.target.getAttribute("class")};

                                    //faccio una put ajax
                                    $.ajax({
                                        url:"/rifiutaSottoscrizioneMensile",
                                        type:"PUT",
                                        dataType:"json",
                                        data:idDaPassare
                                    }).done(()=>{   //In caso di successo refresho
                                        $(".tabs a:nth-child(1) span").trigger("click");
                                        $(".notify").text("Sottoscrizione rifiutata correttamente!").hide().fadeIn(1000).fadeOut(2000);
                                    }).fail(()=>{
                                        $(".notify").text("Errore nella gestione della sottoscrizione").hide().fadeIn(1000).fadeOut(2000);
                                    })

                                }

                            })

                        })
                    
                    
                    }).fail((jqXHR)=>{
                        $(".notify").text("Non ci sono abbonamenti da gestire!").hide().fadeIn(1000).fadeOut(2000);
                    })

                })

                //listener bottone per ABB ANNUALE
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
                     $.getJSON("/getAbbonamentiAnnuali/atteso",(abbonamenti)=>{
                    
                        abbonamenti.forEach((abbonamento)=>{
                        
                            //creo elementi per la visualizzazione
                            var $labelStatoAbbonamento=$("<li class='"+abbonamento.statoAccettazione+"'>").text("Abbonamento: "+abbonamento.IDAbbAnnuale+" -- Data Sottoscrizione: "+abbonamento.dataSottoscrizione+" -- Data Scadenza: "+abbonamento.dataScadenza+" -- Stato: "+abbonamento.statoAccettazione+" -- Attivo/Sospeso: "+abbonamento.statoAttivo);
                            var $btnAccetta=$("<button name='accetta' class='"+abbonamento.IDAbbAnnuale+"'>").text("Accetta"); //passo sui bottoni il relativo id dell'abbonamento
                            var $btnRifiuta=$("<button name='rifiuta' class='"+abbonamento.IDAbbAnnuale+"'>").text("Rifiuta"); //molto utile per passaggio veloce alla successiva PUT per cambiare lo stato della sottoscrizione

                            //Appendo al mio $content gli elementi html
                            $contRemovable.append($labelStatoAbbonamento).append($btnAccetta).append($btnRifiuta);

                        })

                    }).then(()=>{

                        //gestisco gli handler di tutti i bottoni
                        document.querySelectorAll("button").forEach((button)=>{
                        
                            button.addEventListener("click",(elem)=>{
                                
                                if(elem.target.getAttribute("name")=="accetta"){
                                
                                    //creo oggetto per passare id abb, devo solo cambiare lo stato non devo creare un nuovo abb
                                    var idDaPassare={"idAbbAnnuale":elem.target.getAttribute("class")};

                                    //faccio una put ajax
                                    $.ajax({
                                        url:"/accettaSottoscrizioneAnnuale",
                                        type:"PUT",
                                        dataType:"json",
                                        data:idDaPassare
                                    }).done(()=>{   //In caso di successo refresho
                                        $(".tabs a:nth-child(1) span").trigger("click");
                                        $(".notify").text("Sottoscrizione accettata correttamente!").hide().fadeIn(1000).fadeOut(2000);
                                    }).fail(()=>{
                                        $(".notify").text("Errore nella gestione della sottoscrizione").hide().fadeIn(1000).fadeOut(2000);
                                    })
                                
                                }else if(elem.target.getAttribute("name")=="rifiuta"){
                                
                                    //creo oggetto per passare id abb, devo solo cambiare lo stato non devo creare un nuovo abb
                                    var idDaPassare={"idAbbAnnuale":elem.target.getAttribute("class")};

                                    //faccio una put ajax
                                    $.ajax({
                                        url:"/rifiutaSottoscrizioneAnnuale",
                                        type:"PUT",
                                        dataType:"json",
                                        data:idDaPassare
                                    }).done(()=>{   //In caso di successo refresho
                                        $(".tabs a:nth-child(1) span").trigger("click");
                                        $(".notify").text("Sottoscrizione rifiutata correttamente!").hide().fadeIn(1000).fadeOut(2000);
                                    }).fail(()=>{
                                        $(".notify").text("Errore nella gestione della sottoscrizione").hide().fadeIn(1000).fadeOut(2000);
                                    })

                                }

                            })

                        })
                    
                    
                    }).fail((jqXHR)=>{ 
                        $(".notify").text("Non ci sono abbonamenti da gestire!").hide().fadeIn(1000).fadeOut(2000);
                    })

                })

                $cont.append($btnMensile).append($btnAnnuale).append($contRemovable);
                $("main .content").append($cont);               

            //-----------------------TAB VISUALIZZA STATO ABBONAMENTI (EVENTUALMENTE ELIMANARLI)-----------------
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
                            var $labelStatoAbbonamento=$("<li class='"+abbonamento.statoAccettazione+"'>").text("Abbonamento: "+abbonamento.IDAbbMensile+"-- Mese: "+abbonamento.meseSottoscrizione+" -- Stato: "+abbonamento.statoAccettazione);

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
                        
                            //creo elementi per la visualizzazione
                            var $labelStatoAbbonamento=$("<li class='"+abbonamento.statoAccettazione+"'>").text("Abbonamento: "+abbonamento.IDAbbAnnuale+" -- Data Sottoscrizione: "+abbonamento.dataSottoscrizione+" -- Data Scadenza: "+abbonamento.dataScadenza+" -- Stato: "+abbonamento.statoAccettazione+" -- Attivo/Sospeso: "+abbonamento.statoAttivo);

                             //Appendo al mio $content gli elementi html
                            $contRemovable.append($labelStatoAbbonamento);

                        })

                    })

                })

                $cont.append($btnMensile).append($btnAnnuale).append($contRemovable);
                $("main .content").append($cont);
            
            

            //------------------------TAB MODIFICA ORARI APERTURA E CHIUSURA GIORNI--------------------------
            }else if($(element).parent().is(":nth-child(3)")){
                
                $cont=$("<ul>");

                //inizialmente faccio apparire tutti i giorni disponibili come nel client
                $.getJSON("/getGiorni",(giorni)=>{
                
                    giorni.forEach((giorno)=>{
                    
                        var $divisionePerGiorno=$("<div id='"+giorno.nomeGiorno+"'>");
                        var $labelGiorno; //cambia in base ad apertura centro
                        var $inputAperto=$("<input type='checkbox' id='"+giorno.nomeGiorno+"Aperto' value='aperto'>");
                        var $labelAperto=$("<label for='aperto'>").text("Centro aperto");
                        var $inputChiuso=$("<input type='checkbox' id='"+giorno.nomeGiorno+"Chiuso' value='chiuso'>");
                        var $labelChiuso=$("<label for='chiuso'>").text("Centro chiuso");
                        var $btnConferma=$("<button class='"+giorno.nomeGiorno+"'>").text("Conferma");

                        if(giorno.statoCentro=="APERTO"){
                            //creo elementi per la visualizzazione
                            $labelGiorno=$("<li class='"+giorno.nomeGiorno+"'>").text(giorno.nomeGiorno+" il centro è aperto dalle ore "+giorno.orarioApertura+" alle ore "+giorno.orarioChiusura);
                        }else if(giorno.statoCentro=="CHIUSO"){
                            $labelGiorno=$("<li class='"+giorno.nomeGiorno+"'>").text(giorno.nomeGiorno+" il centro è chiuso");
                        }

                        //Appendo al mio $content gli elementi html
                       
                        $divisionePerGiorno.append($labelGiorno)
                                                .append($inputAperto)
                                                .append($labelAperto)
                                                .append($inputChiuso)
                                                .append($labelChiuso)
                                                .append($btnConferma);
                        $cont.append($divisionePerGiorno);
                        
                    })

                }).then(()=>{

                    document.querySelectorAll("button").forEach((button)=>{
                    
                        //quando confermo, controllo se sono checkati i checkbox
                        button.addEventListener("click",(elem)=>{
                        
                            var $idInput=button.getAttribute("class");
                            var $checkAperto=document.querySelector("#"+$idInput+"Aperto");
                            var $checkChiuso=document.querySelector("#"+$idInput+"Chiuso");

                            //nel caso di giorno aperto devo anche modificare gli orari
                            var $labelInputApertura=$("<p>").text("Inserire orario apertura: ");
                            var $inputApertura=$("<input type='time' class='"+$idInput+"'>");
                            var $labelInputChiusura=$("<p>").text("Inserire orario chiusura: ");
                            var $inputChiusura=$("<input type='time' class='"+$idInput+"'>");
                            var $btnConfermaOrari=$("<button class='"+$idInput+"'>").text("Conferma orari");

                            //se è checkato aperto e non chiuso (non ho capito perchè la condizione è settata al contrario dal browser)
                            if($checkAperto && !$checkChiuso.checked){

                                console.log($checkChiuso.checked);
                                console.log($checkAperto.checked);

                               

                                $btnConfermaOrari.on("click",()=>{
                                    
                                    if($inputApertura.val()!="" && $inputChiusura.val()!=""){

                                        var giornoDaPassare={"giorno":$idInput,"oraApertura":$inputApertura.val(),"oraChiusura":$inputChiusura.val()};
                                        
                                        //se sono stati inseriti degli orari validi, faccio una put con tutti i cambi
                                        $.ajax({
                                            url:"/apriGiorno",
                                            type:"PUT",
                                            dataType:"json",
                                            data:giornoDaPassare
                                        }).done(()=>{   //In caso di successo refresho
                                            $(".tabs a:nth-child(3) span").trigger("click");
                                            $(".notify").text("Giorno aggiornato correttamente!").hide().fadeIn(1000).fadeOut(2000);
                                        }).fail(()=>{
                                            $(".notify").text("Errore nella gestione della modifica del giorno").hide().fadeIn(1000).fadeOut(2000);
                                        })

                                    }

                                })

                                var ap=document.querySelector("#"+$idInput);

                                $cont.append($labelInputApertura).append($inputApertura).append($labelInputChiusura).append($inputChiusura).append($btnConfermaOrari);
                                
                            //il contrario 
                            }else if($checkChiuso && !$checkAperto.checked){
                                
                                //creo oggetto da passare
                                var giornoDaPassare={"giorno":$idInput};

                                //faccio una put ajax e setto il giorno chiuso
                                $.ajax({
                                    url:"/chiudiGiorno",
                                    type:"PUT",
                                    dataType:"json",
                                    data:giornoDaPassare
                                }).done(()=>{   //In caso di successo refresho
                                    $(".tabs a:nth-child(3) span").trigger("click");
                                    $(".notify").text("Giorno aggiornato correttamente!").hide().fadeIn(1000).fadeOut(2000);
                                }).fail(()=>{
                                    $(".notify").text("Errore nella gestione della modifica del giorno").hide().fadeIn(1000).fadeOut(2000);
                                })

                            }
                            
                        })

                    })
                
                }).fail((jqXHR)=>{
                
                })

                $("main .content").append($cont); 
            
            
            }

            return false; //Utilizzato per impedire la ripropagazione del click sui tabs

        }) 

    });

    //Trigger per attivare il tab di default (Sottoscrivi Abbonamento) quando viene aperta la pagina
    $(".tabs a:first-child span").trigger("click"); 

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
