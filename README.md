# Progetto_ACP-Docente De Simone
## Salvatore Cangiano N46006792
La repository contiene una breve documentazione e l'implementazione di un sito web, assegnato come progetto universitario per l'esame "Advanced Computer Programming" (Napoli Federico II 2022/2023).
Le web app fa riferimento ad un progetto di ingegneria del software; nello specifico il progetto riguarda lo sviluppo parziale di un sistema di gestione di un centro sportivo. Il progetto iniziale era finalizzato ad operare in un ambiente desktop, mentre la qui presente versione è stata "adattata" ad un ambiente web.

## SPECIFICHE DI PROGETTO

Il progetto prevede l'implementazione di due web page: una vista utente e una vista amministrazione. 
Di seguito sono riportati i casi d'uso sviluppati per ogni vista

Un **cliente** può sottoscrivere un abbonamento al centro sportivo, gli abbonamenti disponibili sono di due tipi: mensili o annuali. L'utente non può possedere più abbonamenti annuali contemporaneamente. Ha la possibilità di osservare lo stato di accettazione del proprio abbonamento, inoltre può, nel caso di sottoscrizione di un abbonamento annuale, sospendere il proprio abbonamento per farlo "ripartire" in seguito. Infine il cliente può visualizzare i giorni in cui il centro sportivo è aperto e gli eventuali orari di apertura e chiusura.

Un **amministratore** può gestire l'accettazione o il rifiuto degli abbonamenti sottoscritti dagli utenti tramite il sito del centro, può controllare la situazione degli abbonamenti per un determinato cliente e può modificare i giorni in cui il centro è aperto/chiuso e gli orari di apertura/chiusura.

## SPECIFICHE TECNICHE

E' stata utilizzata la seguente versione di MONGODB:

> _MONGODB_ : 6.0.5

Sono state utilizzate le seguenti versioni dei pacchetti NODE:

> _express_ : 4.18.2\
> _mongoose_ : 6.10.5

In caso di problemi controllare che il _package.json_ contenga le versioni citate sopra

## GUIDA ALL' AVVIO DELL'APPLICAZIONE

1.Avviare da shell il servizio **mongodb**\
2.Eseguire nella directory del progetto i seguenti comandi:

> **npm run startAdmin** -- Avvia la parte server dell'**amministrazione** sul localhost:4502\
> **npm run startCliente** -- Avvia la parte server del **cliente** sul localhost:4500

3.Cercare su un qualunque browser nella barra degli indirizzi: localhost:**numero di porto**

## TEST DELL'APPLICAZIONE

### CLIENTE
* Sottoscrivere più abbonamenti mensili
* Provare a sottoscrivere un abbonamento mensile già sottoscritto
* Sottoscrivere un abbonamento annuale
* Visualizzare abbonamenti mensili in seguito a sottoscrizioni
* Visualizzare abbonamenti annuali in seguito a sottoscrizioni
* Sospendere un abbonamento annuale accettato
* Provare a sospendere un abbonamento annuale non accettato o già sospeso

### ADMIN
* Accettare un abbonamento mensile
* Rifiutare un abbomento mensile
* Accettare un abbonamento annuale
* Rifiutare un abbonamento annuale
* Visualizzare stato abbonamenti accettati, rifiutati e non ancora gestiti
* Inserire apertura giorno con gli orari di apertura e chiusura
* Modificare gli orari di apertura e chiusura di un giorno già aperto
* Impostare chiusura di un giorno
