# Recommendation e apprendimento

`recommend()` è una black box deterministica: riceve il profilo e il dataset della categoria, restituisce ranking, Match Score, motivazioni e scarti. Budget, OS e disponibilità sono filtri hard; dimensioni, colore/design e priorità sono segnali soft.

L'apprendimento dai click non modifica mai i vincoli hard. Un job giornaliero crea cluster anonimi dal vettore delle preferenze (es. budget normalizzato, OS, priorità 1–10), calcola il click-through rate con smoothing bayesiano e salva un `affinity_boost` limitato a ±5 punti in `product_affinities`. L'API applica quel boost solo se esiste un campione minimo; il motivo editoriale del punteggio resta invariato e l'algoritmo viene versionato.

Questo evita feedback loop e rende possibile l'A/B test senza affidarsi a un modello opaco dal primo giorno.
