(()=>{ 
'use strict';
if(window.__printProfitPreferencesV3)return;
window.__printProfitPreferencesV3=true;

const KEY='printprofit.preferences.v3';
const defaults={dark:true,language:'en',units:'metric',currency:'GBP',rate:1};

const currencies={
 GBP:{symbol:'£',locale:'en-GB',rate:1},
 EUR:{symbol:'€',locale:'de-DE',rate:1.1663},
 USD:{symbol:'$',locale:'en-US',rate:1.3370},
 PLN:{symbol:'zł',locale:'pl-PL',rate:5.0892},
 CAD:{symbol:'CA$',locale:'en-CA',rate:1.84},
 AUD:{symbol:'A$',locale:'en-AU',rate:2.00},
 CHF:{symbol:'CHF',locale:'de-CH',rate:0.96},
 SEK:{symbol:'kr',locale:'sv-SE',rate:14.75},
 NOK:{symbol:'kr',locale:'nb-NO',rate:14.70},
 DKK:{symbol:'kr',locale:'da-DK',rate:8.69},
 CZK:{symbol:'Kč',locale:'cs-CZ',rate:28.30},
 JPY:{symbol:'¥',locale:'ja-JP',rate:179.00},
 CNY:{symbol:'¥',locale:'zh-CN',rate:9.65},
 INR:{symbol:'₹',locale:'en-IN',rate:123.50},
 NZD:{symbol:'NZ$',locale:'en-NZ',rate:2.16},
 SGD:{symbol:'S$',locale:'en-SG',rate:1.71},
 BRL:{symbol:'R$',locale:'pt-BR',rate:7.18},
 MXN:{symbol:'MX$',locale:'es-MX',rate:23.0696},
 ZAR:{symbol:'ZAR',locale:'en-ZA',rate:21.8000}
};

const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];

const tx={
 'Settings':'Ustawienia',
 'Manage the calculator display and preferences.':'Zarządzaj wyglądem kalkulatora i preferencjami.',
 'Appearance':'Wygląd',
 'Dark mode':'Tryb ciemny',
 'Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
 'Language':'Język',
 'Language & region':'Język i region',
 'Choose the language used across the page.':'Wybierz język używany na całej stronie.',
 'Units':'Jednostki',
 'Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
 'Currency':'Waluta',
 'Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
 'Exchange rate':'Kurs wymiany',
 'Update the conversion used when displaying non-GBP currencies.':'Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.',
 'Calculator reset':'Reset kalkulatora',
 'Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
 'Reset Calculator':'Resetuj kalkulator',
 'Apply Changes':'Zastosuj zmiany',
 'Preferences are saved automatically on this device.':'Preferencje są zapisywane automatycznie na tym urządzeniu.',
 'English':'English','Polski':'Polski','Metric (g / ml)':'Metryczne (g / ml)','Imperial (oz / fl oz)':'Imperialne (oz / fl oz)'
};
const extraTx={
 'Home':'Strona główna','Guides':'Przewodnik','About':'O nas','Support':'Wsparcie',
 'Dark Mode':'Tryb ciemny','Start Calculating':'Rozpocznij kalkulację','My Projects':'Moje projekty',
 'Calculate':'Kalkuluj','Costs':'Koszty','Price':'Cena','Prints':'Wydruki','Profit':'Zysk','Built':'Stworzone',
 'For Makers':'Dla twórców','Printer Profiles':'Profile drukarek','Materials & Filaments':'Materiały i filamenty',
 'Delivery & Fees':'Dostawa i opłaty','Calculate • Price • Profit':'Kalkuluj • Cena • Zysk',
 'Your Printing Cost Journey':'Twoja droga do kosztu wydruku',
 'Printer Profile':'Profil drukarki','Select your printer to get started':'Wybierz drukarkę, aby rozpocząć',
 'Filament & Material':'Filament i materiał','Set your material costs':'Ustaw koszty materiału',
 'Costs & Fees':'Koszty i opłaty','Add your business costs':'Dodaj koszty swojej działalności',
 'Your Model':'Twój model','Print Information':'Informacje o wydruku',
 'Everything PrintProfit currently knows about this model.':'Wszystko, co PrintProfit obecnie wie o tym modelu.',
 'Drag & drop your G-code file here':'Przeciągnij i upuść tutaj plik G-code','or':'lub','Choose File':'Wybierz plik','Clear':'Wyczyść','No G-code selected':'Nie wybrano pliku G-code',
 'Not sure about a field?':'Nie wiesz, co wpisać?','Leave it blank.':'Zostaw puste.',
 'Blank fields are treated as £0 for a basic estimate.':'Puste pola są traktowane jako £0 dla podstawowego oszacowania.',
 'Tip:':'Wskazówka:','Upload a G-code file for the most accurate results.':'Wgraj plik G-code, aby uzyskać najdokładniejsze wyniki.',
 'File':'Plik','Print time':'Czas druku','Material used':'Zużyty materiał',
 'Material':'Materiał','2. Print Setup':'2. Ustawienia druku',
 'Choose the printer and material used for this print.':'Wybierz drukarkę i materiał użyty do tego wydruku.',
 'Printer':'Drukarka','Select your printer or use a custom profile.':'Wybierz drukarkę lub użyj własnego profilu.',
 'Select a printer...':'Wybierz drukarkę...','Custom printer':'Własna drukarka',
 'Material type':'Rodzaj materiału','Filament (FDM)':'Filament (FDM)','Resin (SLA / MSLA / DLP)':'Żywica (SLA / MSLA / DLP)',
 'Choose your filament or resin, package size and cost.':'Wybierz filament lub żywicę, rozmiar opakowania i koszt.',
 'Spool weight (g)':'Waga szpuli (g)','Spool / bottle cost (£)':'Koszt szpuli / butelki (£)',
 'Used per print (g)':'Zużycie na wydruk (g)','Calculated material cost (£)':'Obliczony koszt materiału (£)',
 '4. Operating Costs':'4. Koszty operacyjne','Additional Costs':'Dodatkowe koszty','Electricity':'Prąd',
 'Electricity provider / tariff':'Dostawca prądu / taryfa','Estimated printer power':'Szacowana moc drukarki',
 'Estimated electricity cost':'Szacowany koszt prądu','5. Selling & Fulfilment':'5. Sprzedaż i realizacja',
 'Platform':'Platforma','Delivery':'Dostawa','6. Quantity / Batch Pricing':'6. Ilość / wycena zbiorcza',
 'Quantity':'Ilość','Batch discount (%)':'Rabat ilościowy (%)','Selling price per item (£)':'Cena sprzedaży za sztukę (£)',
 'Calculate Costs & Price':'Oblicz koszty i cenę','Results':'Wyniki','Single Print':'Pojedynczy wydruk','Batch Pricing':'Wycena zbiorcza',
 'Total Cost to Make':'Łączny koszt wykonania','Selling Price':'Cena sprzedaży',
 'Quick Price Buttons (target margin)':'Szybkie przyciski ceny (docelowa marża)',
 'Custom target margin (%)':'Własna docelowa marża (%)','Batch Cost to Make':'Koszt wykonania partii',
 'Batch Sales':'Sprzedaż partii','Batch Profit':'Zysk z partii',
 'Know what it costs.':'Wiesz, ile to kosztuje.','Know what to charge.':'Wiesz, ile naliczyć.',
 'Accurate 3D printing cost and pricing calculations to help you price with confidence and maximise your profit.':'Dokładne kalkulacje kosztów i cen druku 3D, które pomagają ustalać ceny i zwiększać zysk.',
 'Print Smarter.':'Drukuj mądrzej.','Price Better.':'Ustalaj lepsze ceny.','Profit More.':'Zarabiaj więcej.'
};
Object.assign(tx,extraTx);
const uiKeys=[
'Settings','Manage the calculator display and preferences.','Appearance','Dark mode','Use the dark PrintProfit interface.','Language','Language & region','Choose the language used across the page.','Units','Choose metric or imperial measurements.','Currency','Choose the currency used for costs and prices.','Exchange rate','Update the conversion used when displaying non-GBP currencies.','Calculator reset','Clear the current calculator inputs and return pricing to £0.','Reset Calculator','Apply Changes','Preferences are saved automatically on this device.','Home','Guides','About','Support','Calculate','Price','Profit','Costs','Prints','Built','For Makers','Printer Profiles','Materials & Filaments','Delivery & Fees','Calculate • Price • Profit','Your Printing Cost Journey','Printer Profile','Select your printer to get started','Filament & Material','Set your material costs','Costs & Fees','Add your business costs','Your Model','Print Information','Everything PrintProfit currently knows about this model.','Drag & drop your G-code file here','or','Choose File','Clear','No G-code selected','Not sure about a field?','Leave it blank.','Blank fields are treated as £0 for a basic estimate.','Tip:','Upload a G-code file for the most accurate results.','File','Print time','Material used','Material','2. Print Setup','Choose the printer and material used for this print.','Printer','Select your printer or use a custom profile.','Select a printer...','Custom printer','Material type','Filament (FDM)','Resin (SLA / MSLA / DLP)','Choose your filament or resin, package size and cost.','Spool weight (g)','Spool / bottle cost (£)','Used per print (g)','Calculated material cost (£)','Print time (hours)','4. Operating Costs','Additional Costs','Electricity','Electricity provider / tariff','Estimated printer power','Estimated electricity cost','5. Selling & Fulfilment','Platform','Delivery','6. Quantity / Batch Pricing','Quantity','Batch discount (%)','Selling price per item (£)','Calculate Costs & Price','Results','Single Print','Batch Pricing','Total Cost to Make','Selling Price','Quick Price Buttons (target margin)','Custom target margin (%)','Batch Cost to Make','Batch Sales','Batch Profit','Know what it costs.','Know what to charge.','Accurate 3D printing cost and pricing calculations to help you price with confidence and maximise your profit.','Print Smarter.','Price Better.','Profit More.','Start Calculating','My Projects','Guide & Help','Calculate','Price','Profit','Built','For Makers','Your Model','Upload your print & view its data','Print Setup','Choose your printer and material','Costs & Fees','Add your business costs','Platform Fees','Choose where you sell and preload the current UK fee structure.','Delivery','Choose a courier and service rate, then override the cost when needed.','Courier / delivery firm','Service / rate','Automatic rate','Cost to you (£)','Charged to customer (£)','Marketplace fees, payment costs and delivery charges.','Labour, materials, packaging and electricity used to make each print.','Optional costs per print, excluding electricity.','Uses your selected printer power and print time from the model.','Labour hours (per print)','Labour cost (£/hour)','Packaging (£)','Other (£)','Unit rate (£/kWh)','Estimated power used (kWh)','Waiting for a print file, or enter usage manually.','Select a printer in Print Setup to estimate power draw.','Select a platform to load its default fee assumptions.','Select a courier...','Choose a courier first...','My Materials','Keep your regular filament and resin in one place.','No materials saved yet','Add your regular filament and resin so you can select them in the calculator.','Add Material','Use','Edit','Delete','Material name','Type','Brand','Colour','Select a brand...','Other / Custom','Enter brand name','Optional','Package cost (£)','Cancel','Save Material','Save Current Material','Edit Material','Bottle amount (ml)','MATERIAL LIBRARY','3D PRINTING PRICING, MADE SIMPLE','Your Prints','Maximise','Settings','Results','View one-print economics or price a full batch.','Margin:'
];

const L={
de:['Einstellungen','Verwalten Sie die Anzeige und Einstellungen des Rechners.','Darstellung','Dunkelmodus','Die dunkle PrintProfit-Oberfläche verwenden.','Sprache','Sprache & Region','Wählen Sie die Sprache für die gesamte Seite.','Einheiten','Metrische oder imperiale Maßeinheiten wählen.','Währung','Wählen Sie die Währung für Kosten und Preise.','Wechselkurs','Aktualisieren Sie die Umrechnung für Nicht-GBP-Währungen.','Rechner zurücksetzen','Aktuelle Rechnereingaben löschen und Preise auf 0 £ zurücksetzen.','Rechner zurücksetzen','Änderungen anwenden','Einstellungen werden automatisch auf diesem Gerät gespeichert.','Startseite','Anleitungen','Über uns','Support','Berechnen','Preis','Gewinn','Kosten','Drucke','Erstellt','Für Maker','Druckerprofile','Materialien & Filamente','Lieferung & Gebühren','Berechnen • Preis • Gewinn','Dein Weg zu den Druckkosten','Druckerprofil','Wählen Sie einen Drucker, um zu beginnen','Filament & Material','Materialkosten festlegen','Kosten & Gebühren','Geschäftskosten hinzufügen','Dein Modell','Druckinformationen','Alles, was PrintProfit derzeit über dieses Modell weiß.','G-Code-Datei hierher ziehen','oder','Datei auswählen','Löschen','Keine G-Code-Datei ausgewählt','Unsicher bei einem Feld?','Lassen Sie es leer.','Leere Felder werden für eine einfache Schätzung als 0 £ behandelt.','Tipp:','Laden Sie eine G-Code-Datei für genauere Ergebnisse hoch.','Datei','Druckzeit','Verbrauchtes Material','Material','2. Druckeinrichtung','Wählen Sie den Drucker und das Material für diesen Druck.','Drucker','Drucker auswählen oder eigenes Profil verwenden.','Drucker auswählen...','Eigener Drucker','Materialtyp','Filament (FDM)','Harz (SLA / MSLA / DLP)','Filament oder Harz, Packungsgröße und Kosten wählen.','Spulengewicht (g)','Spulen-/Flaschenkosten (£)','Verbrauch pro Druck (g)','Berechnete Materialkosten (£)','Druckzeit (Stunden)','4. Betriebskosten','Zusätzliche Kosten','Strom','Stromanbieter / Tarif','Geschätzte Druckerleistung','Geschätzte Stromkosten','5. Verkauf & Abwicklung','Plattform','Lieferung','6. Mengen-/Chargenpreis','Menge','Mengenrabatt (%)','Verkaufspreis pro Stück (£)','Kosten & Preis berechnen','Ergebnisse','Einzeldruck','Chargenpreis','Gesamte Herstellungskosten','Verkaufspreis','Schnellpreise (Zielmarge)','Eigene Zielmarge (%)','Herstellungskosten der Charge','Umsatz der Charge','Gewinn der Charge','Kenne deine Kosten.','Wisse, was du verlangen kannst.','Genaue 3D-Druck-Kosten- und Preisberechnungen für sichere Preise und mehr Gewinn.','Intelligenter drucken.','Besser kalkulieren.','Mehr verdienen.','Kalkulation starten','Meine Projekte','Anleitung & Hilfe','Berechnen','Preis','Gewinn','Erstellt','Für Maker','Dein Modell','Druck hochladen & Daten anzeigen','Druckeinrichtung','Drucker & Material wählen','Kosten & Gebühren','Geschäftskosten hinzufügen','Plattformgebühren','Verkaufsort wählen und aktuelle britische Gebühren laden.','Lieferung','Kurier und Tarif wählen; Kosten bei Bedarf überschreiben.','Kurier / Lieferdienst','Service / Tarif','Automatischer Tarif','Kosten für dich (£)','Dem Kunden berechnet (£)','Marktplatz-, Zahlungs- und Liefergebühren.','Arbeitszeit, Material, Verpackung und Strom für jeden Druck.','Optionale Kosten pro Druck ohne Strom.','Verwendet die Druckerleistung und Druckzeit des Modells.','Arbeitsstunden (pro Druck)','Arbeitskosten (£/Stunde)','Verpackung (£)','Sonstiges (£)','Arbeitspreis (£/kWh)','Geschätzter Verbrauch (kWh)','Warten auf eine Druckdatei oder Verbrauch manuell eingeben.','Drucker in der Druckeinrichtung wählen, um den Stromverbrauch zu schätzen.','Plattform wählen, um Standardgebühren zu laden.','Kurier auswählen...','Zuerst einen Kurier auswählen...','Meine Materialien','Reguläres Filament und Harz an einem Ort verwalten.','Noch keine Materialien gespeichert','Filament und Harz hinzufügen, damit sie im Rechner auswählbar sind.','Material hinzufügen','Verwenden','Bearbeiten','Löschen','Materialname','Typ','Marke','Farbe','Marke auswählen...','Andere / Eigene','Markennamen eingeben','Optional','Verpackungskosten (£)','Abbrechen','Material speichern','Aktuelles Material speichern','Material bearbeiten','Flaschenvolumen (ml)','MATERIALBIBLIOTHEK','3D-DRUCKPREISE EINFACH GEMACHT','Deine Drucke','Maximieren','Einstellungen','Ergebnisse','Einzeldruck oder ganze Charge kalkulieren.','Marge:'],
fr:['Paramètres','Gérer l’affichage et les préférences du calculateur.','Apparence','Mode sombre','Utiliser l’interface sombre de PrintProfit.','Langue','Langue et région','Choisissez la langue utilisée sur toute la page.','Unités','Choisissez les unités métriques ou impériales.','Devise','Choisissez la devise utilisée pour les coûts et les prix.','Taux de change','Mettez à jour la conversion des devises autres que GBP.','Réinitialisation du calculateur','Effacer les saisies et remettre les prix à 0 £.','Réinitialiser le calculateur','Appliquer les modifications','Les préférences sont enregistrées automatiquement sur cet appareil.','Accueil','Guides','À propos','Assistance','Calculer','Prix','Bénéfice','Coûts','Impressions','Créé','Pour les makers','Profils d’imprimantes','Matériaux et filaments','Livraison et frais','Calculer • Prix • Bénéfice','Votre parcours de coût d’impression','Profil d’imprimante','Sélectionnez votre imprimante pour commencer','Filament et matériau','Définissez vos coûts de matériau','Coûts et frais','Ajoutez vos coûts professionnels','Votre modèle','Informations d’impression','Tout ce que PrintProfit sait actuellement sur ce modèle.','Glissez-déposez votre fichier G-code ici','ou','Choisir un fichier','Effacer','Aucun fichier G-code sélectionné','Un champ vous pose problème ?','Laissez-le vide.','Les champs vides sont traités comme 0 £ pour une estimation simple.','Astuce :','Importez un fichier G-code pour des résultats plus précis.','Fichier','Temps d’impression','Matériau utilisé','Matériau','2. Configuration d’impression','Choisissez l’imprimante et le matériau utilisés.','Imprimante','Choisissez votre imprimante ou utilisez un profil personnalisé.','Sélectionner une imprimante...','Imprimante personnalisée','Type de matériau','Filament (FDM)','Résine (SLA / MSLA / DLP)','Choisissez votre filament ou résine, la taille et le coût du conditionnement.','Poids de la bobine (g)','Coût bobine / bouteille (£)','Utilisé par impression (g)','Coût du matériau calculé (£)','Temps d’impression (heures)','4. Coûts de fonctionnement','Coûts supplémentaires','Électricité','Fournisseur / tarif d’électricité','Puissance estimée de l’imprimante','Coût d’électricité estimé','5. Vente et exécution','Plateforme','Livraison','6. Tarification par quantité / lot','Quantité','Remise par lot (%)','Prix de vente par article (£)','Calculer les coûts et le prix','Résultats','Impression unique','Tarification par lot','Coût total de fabrication','Prix de vente','Boutons de prix rapides (marge cible)','Marge cible personnalisée (%)','Coût de fabrication du lot','Ventes du lot','Bénéfice du lot','Connaissez vos coûts.','Sachez quoi facturer.','Calculs précis des coûts et prix d’impression 3D pour fixer vos prix en toute confiance et augmenter vos bénéfices.','Imprimez plus intelligemment.','Fixez de meilleurs prix.','Gagnez davantage.','Commencer le calcul','Mes projets','Guide et aide','Calculer','Prix','Bénéfice','Créé','Pour les makers','Votre modèle','Importez votre impression et consultez ses données','Configuration d’impression','Choisissez votre imprimante et votre matériau','Coûts et frais','Ajoutez vos coûts professionnels','Frais de plateforme','Choisissez où vous vendez et chargez la structure de frais UK actuelle.','Livraison','Choisissez un transporteur et un tarif, puis modifiez le coût si nécessaire.','Transporteur / société de livraison','Service / tarif','Tarif automatique','Coût pour vous (£)','Facturé au client (£)','Frais de marketplace, de paiement et de livraison.','Main-d’œuvre, matériaux, emballage et électricité pour chaque impression.','Coûts optionnels par impression, hors électricité.','Utilise la puissance et le temps d’impression du modèle.','Heures de main-d’œuvre (par impression)','Coût de main-d’œuvre (£/h)','Emballage (£)','Autre (£)','Tarif unitaire (£/kWh)','Énergie estimée utilisée (kWh)','En attente d’un fichier d’impression ou saisissez la consommation manuellement.','Sélectionnez une imprimante dans la configuration pour estimer la puissance.','Sélectionnez une plateforme pour charger ses frais par défaut.','Sélectionner un transporteur...','Choisissez d’abord un transporteur...','Mes matériaux','Gardez vos filaments et résines habituels au même endroit.','Aucun matériau enregistré','Ajoutez vos filaments et résines habituels pour les sélectionner dans le calculateur.','Ajouter un matériau','Utiliser','Modifier','Supprimer','Nom du matériau','Type','Marque','Couleur','Sélectionner une marque...','Autre / personnalisé','Saisir le nom de la marque','Facultatif','Coût du conditionnement (£)','Annuler','Enregistrer le matériau','Enregistrer le matériau actuel','Modifier le matériau','Volume de bouteille (ml)','BIBLIOTHÈQUE DE MATÉRIAUX','LE PRIX DE L’IMPRESSION 3D, EN TOUTE SIMPLICITÉ','Vos impressions','Maximiser','Paramètres','Résultats','Voir les coûts d’une impression ou tarifer un lot complet.','Marge :'],
es:['Ajustes','Gestiona la pantalla y las preferencias de la calculadora.','Apariencia','Modo oscuro','Usar la interfaz oscura de PrintProfit.','Idioma','Idioma y región','Elige el idioma utilizado en toda la página.','Unidades','Elige unidades métricas o imperiales.','Moneda','Elige la moneda usada para costes y precios.','Tipo de cambio','Actualiza la conversión para monedas distintas de GBP.','Restablecer calculadora','Borra las entradas y devuelve los precios a 0 £.','Restablecer calculadora','Aplicar cambios','Las preferencias se guardan automáticamente en este dispositivo.','Inicio','Guías','Acerca de','Soporte','Calcular','Precio','Beneficio','Costes','Impresiones','Creado','Para makers','Perfiles de impresora','Materiales y filamentos','Entrega y tarifas','Calcular • Precio • Beneficio','Tu recorrido de costes de impresión','Perfil de impresora','Selecciona tu impresora para empezar','Filamento y material','Configura los costes del material','Costes y tarifas','Añade los costes de tu negocio','Tu modelo','Información de impresión','Todo lo que PrintProfit sabe actualmente sobre este modelo.','Arrastra y suelta tu archivo G-code aquí','o','Elegir archivo','Borrar','No se ha seleccionado ningún G-code','¿No estás seguro de algún campo?','Déjalo vacío.','Los campos vacíos se tratan como 0 £ para una estimación básica.','Consejo:','Sube un archivo G-code para obtener resultados más precisos.','Archivo','Tiempo de impresión','Material utilizado','Material','2. Configuración de impresión','Elige la impresora y el material utilizados.','Impresora','Selecciona tu impresora o usa un perfil personalizado.','Seleccionar impresora...','Impresora personalizada','Tipo de material','Filamento (FDM)','Resina (SLA / MSLA / DLP)','Elige filamento o resina, tamaño del envase y coste.','Peso de bobina (g)','Coste de bobina / botella (£)','Usado por impresión (g)','Coste de material calculado (£)','Tiempo de impresión (horas)','4. Costes operativos','Costes adicionales','Electricidad','Proveedor / tarifa eléctrica','Potencia estimada de la impresora','Coste estimado de electricidad','5. Venta y preparación','Plataforma','Entrega','6. Precio por cantidad / lote','Cantidad','Descuento por lote (%)','Precio de venta por unidad (£)','Calcular costes y precio','Resultados','Impresión individual','Precio por lote','Coste total de fabricación','Precio de venta','Botones de precio rápido (margen objetivo)','Margen objetivo personalizado (%)','Coste de fabricación del lote','Ventas del lote','Beneficio del lote','Conoce tus costes.','Sabe qué cobrar.','Cálculos precisos de costes y precios de impresión 3D para ayudarte a fijar precios con confianza y aumentar tus beneficios.','Imprime de forma más inteligente.','Pon mejores precios.','Gana más.','Empezar a calcular','Mis proyectos','Guía y ayuda','Calcular','Precio','Beneficio','Creado','Para makers','Tu modelo','Sube tu impresión y consulta sus datos','Configuración de impresión','Elige tu impresora y material','Costes y tarifas','Añade los costes de tu negocio','Tarifas de plataforma','Elige dónde vendes y carga la estructura de tarifas actual del Reino Unido.','Entrega','Elige un transportista y una tarifa, y modifica el coste si es necesario.','Transportista / empresa de entrega','Servicio / tarifa','Tarifa automática','Coste para ti (£)','Cobrado al cliente (£)','Tarifas del marketplace, pagos y entrega.','Mano de obra, materiales, embalaje y electricidad usados en cada impresión.','Costes opcionales por impresión, sin electricidad.','Usa la potencia de la impresora y el tiempo de impresión del modelo.','Horas de trabajo (por impresión)','Coste laboral (£/hora)','Embalaje (£)','Otros (£)','Tarifa unitaria (£/kWh)','Energía estimada utilizada (kWh)','Esperando un archivo de impresión o introduce el consumo manualmente.','Selecciona una impresora en Configuración para estimar el consumo.','Selecciona una plataforma para cargar sus tarifas predeterminadas.','Seleccionar transportista...','Elige primero un transportista...','Mis materiales','Guarda tus filamentos y resinas habituales en un solo lugar.','Aún no hay materiales guardados','Añade tus filamentos y resinas habituales para seleccionarlos en la calculadora.','Añadir material','Usar','Editar','Eliminar','Nombre del material','Tipo','Marca','Color','Seleccionar marca...','Otro / personalizado','Introduce el nombre de la marca','Opcional','Coste del envase (£)','Cancelar','Guardar material','Guardar material actual','Editar material','Volumen de botella (ml)','BIBLIOTECA DE MATERIALES','PRECIOS DE IMPRESIÓN 3D, MÁS SENCILLOS','Tus impresiones','Maximizar','Ajustes','Resultados','Consulta los costes de una impresión o fija el precio de un lote completo.','Margen:'],
it:['Impostazioni','Gestisci la visualizzazione e le preferenze del calcolatore.','Aspetto','Modalità scura','Usa l’interfaccia scura di PrintProfit.','Lingua','Lingua e area geografica','Scegli la lingua usata in tutta la pagina.','Unità','Scegli unità metriche o imperiali.','Valuta','Scegli la valuta usata per costi e prezzi.','Tasso di cambio','Aggiorna la conversione per le valute diverse da GBP.','Ripristino calcolatore','Cancella gli input e riporta i prezzi a £0.','Ripristina calcolatore','Applica modifiche','Le preferenze vengono salvate automaticamente su questo dispositivo.','Home','Guide','Informazioni','Supporto','Calcola','Prezzo','Profitto','Costi','Stampe','Creato','Per maker','Profili stampanti','Materiali e filamenti','Consegna e commissioni','Calcola • Prezzo • Profitto','Il tuo percorso dei costi di stampa','Profilo stampante','Seleziona la stampante per iniziare','Filamento e materiale','Imposta i costi del materiale','Costi e commissioni','Aggiungi i costi della tua attività','Il tuo modello','Informazioni di stampa','Tutto ciò che PrintProfit sa attualmente su questo modello.','Trascina qui il file G-code','oppure','Scegli file','Cancella','Nessun file G-code selezionato','Non sai cosa inserire?','Lascia vuoto.','I campi vuoti vengono trattati come 0 £ per una stima di base.','Suggerimento:','Carica un file G-code per risultati più accurati.','File','Tempo di stampa','Materiale utilizzato','Materiale','2. Configurazione di stampa','Scegli la stampante e il materiale usati per questa stampa.','Stampante','Seleziona la stampante o usa un profilo personalizzato.','Seleziona una stampante...','Stampante personalizzata','Tipo di materiale','Filamento (FDM)','Resina (SLA / MSLA / DLP)','Scegli filamento o resina, formato della confezione e costo.','Peso bobina (g)','Costo bobina / flacone (£)','Usato per stampa (g)','Costo materiale calcolato (£)','Tempo di stampa (ore)','4. Costi operativi','Costi aggiuntivi','Elettricità','Fornitore / tariffa elettrica','Potenza stimata stampante','Costo elettricità stimato','5. Vendita e gestione','Piattaforma','Consegna','6. Prezzi per quantità / lotto','Quantità','Sconto lotto (%)','Prezzo di vendita per articolo (£)','Calcola costi e prezzo','Risultati','Stampa singola','Prezzo lotto','Costo totale di produzione','Prezzo di vendita','Pulsanti prezzo rapido (margine obiettivo)','Margine obiettivo personalizzato (%)','Costo produzione lotto','Vendite lotto','Profitto lotto','Conosci i tuoi costi.','Sai cosa far pagare.','Calcoli accurati di costi e prezzi per la stampa 3D, per fissare i prezzi con sicurezza e aumentare il profitto.','Stampa in modo più intelligente.','Prezzi migliori.','Più profitto.','Inizia a calcolare','I miei progetti','Guida e aiuto','Calcola','Prezzo','Profitto','Creato','Per maker','Il tuo modello','Carica la stampa e visualizzane i dati','Configurazione di stampa','Scegli stampante e materiale','Costi e commissioni','Aggiungi i costi della tua attività','Commissioni piattaforma','Scegli dove vendi e carica la struttura delle commissioni UK attuale.','Consegna','Scegli corriere e tariffa, poi modifica il costo se necessario.','Corriere / azienda di consegna','Servizio / tariffa','Tariffa automatica','Costo per te (£)','Addebitato al cliente (£)','Commissioni marketplace, pagamento e consegna.','Manodopera, materiali, imballaggio ed elettricità usati per ogni stampa.','Costi opzionali per stampa, esclusa elettricità.','Usa la potenza della stampante e il tempo di stampa del modello.','Ore di lavoro (per stampa)','Costo manodopera (£/ora)','Imballaggio (£)','Altro (£)','Tariffa unitaria (£/kWh)','Energia stimata utilizzata (kWh)','In attesa del file di stampa oppure inserisci il consumo manualmente.','Seleziona una stampante nella configurazione per stimare l’assorbimento.','Seleziona una piattaforma per caricare le commissioni predefinite.','Seleziona un corriere...','Scegli prima un corriere...','I miei materiali','Tieni filamenti e resine abituali in un unico posto.','Nessun materiale salvato','Aggiungi filamenti e resine abituali per selezionarli nel calcolatore.','Aggiungi materiale','Usa','Modifica','Elimina','Nome materiale','Tipo','Marca','Colore','Seleziona una marca...','Altro / personalizzato','Inserisci il nome della marca','Facoltativo','Costo confezione (£)','Annulla','Salva materiale','Salva materiale corrente','Modifica materiale','Volume flacone (ml)','LIBRERIA MATERIALI','PREZZI DELLA STAMPA 3D, SEMPLIFICATI','Le tue stampe','Massimizza','Impostazioni','Risultati','Visualizza i costi di una stampa o assegna il prezzo a un lotto completo.','Margine:']
};
const langMaps={};
for(const [lang,vals] of Object.entries(L)){langMaps[lang]={};uiKeys.forEach((k,i)=>{if(vals[i]!==undefined)langMaps[lang][k]=vals[i];});}
const sharedExtra={
 'Manage the calculator display and preferences.':{nl:'Beheer de weergave en voorkeuren van de calculator.',pt:'Gerir o aspeto e as preferências da calculadora.',cs:'Spravujte zobrazení a předvolby kalkulačky.',sv:'Hantera kalkylatorns visning och inställningar.',da:'Administrer lommeregnerens visning og præferencer.'},
 'Use the dark PrintProfit interface.':{nl:'Gebruik de donkere PrintProfit-interface.',pt:'Usar a interface escura do PrintProfit.',cs:'Použít tmavé rozhraní PrintProfit.',sv:'Använd PrintProfits mörka gränssnitt.',da:'Brug PrintProfits mørke brugerflade.'},
 'Choose the language used across the page.':{nl:'Kies de taal die op de hele pagina wordt gebruikt.',pt:'Escolha o idioma usado em toda a página.',cs:'Zvolte jazyk používaný na celé stránce.',sv:'Välj språket som används på hela sidan.',da:'Vælg sproget, der bruges på hele siden.'},
 'Choose metric or imperial measurements.':{nl:'Kies metrische of imperiale eenheden.',pt:'Escolha unidades métricas ou imperiais.',cs:'Zvolte metrické nebo imperiální jednotky.',sv:'Välj metriska eller brittiska enheter.',da:'Vælg metriske eller imperiale enheder.'},
 'Choose the currency used for costs and prices.':{nl:'Kies de valuta voor kosten en prijzen.',pt:'Escolha a moeda usada para custos e preços.',cs:'Zvolte měnu pro náklady a ceny.',sv:'Välj valuta för kostnader och priser.',da:'Vælg valuta til omkostninger og priser.'},
 'Update the conversion used when displaying non-GBP currencies.':{nl:'Werk de conversie voor niet-GBP-valuta bij.',pt:'Atualize a conversão usada para moedas diferentes de GBP.',cs:'Aktualizujte převod pro měny jiné než GBP.',sv:'Uppdatera omvandlingen för andra valutor än GBP.',da:'Opdater omregningen for andre valutaer end GBP.'},
 'Choose the printer and material used for this print.':{nl:'Kies de printer en het materiaal voor deze print.',pt:'Escolha a impressora e o material usados nesta impressão.',cs:'Vyberte tiskárnu a materiál pro tento tisk.',sv:'Välj skrivare och material för utskriften.',da:'Vælg printer og materiale til dette print.'},
 'Choose your printer or use a custom profile.':{nl:'Kies je printer of gebruik een aangepast profiel.',pt:'Escolha a impressora ou use um perfil personalizado.',cs:'Vyberte tiskárnu nebo použijte vlastní profil.',sv:'Välj skrivare eller använd en egen profil.',da:'Vælg printer eller brug en brugerdefineret profil.'},
 'Choose your filament or resin, package size and cost.':{nl:'Kies filament of hars, verpakking en kosten.',pt:'Escolha filamento ou resina, tamanho e custo da embalagem.',cs:'Vyberte filament nebo pryskyřici, velikost balení a cenu.',sv:'Välj filament eller harts, förpackningsstorlek och kostnad.',da:'Vælg filament eller harpiks, pakkestørrelse og pris.'},
 'Upload a G-code file for the most accurate results.':{nl:'Upload een G-codebestand voor nauwkeurigere resultaten.',pt:'Carregue um ficheiro G-code para obter resultados mais precisos.',cs:'Nahrajte G-code pro přesnější výsledky.',sv:'Ladda upp en G-code-fil för mer exakta resultat.',da:'Upload en G-code-fil for mere præcise resultater.'},
 'Accurate 3D printing cost and pricing calculations to help you price with confidence and maximise your profit.':{nl:'Nauwkeurige 3D-printkosten en prijsberekeningen om met vertrouwen te prijzen en je winst te verhogen.',pt:'Cálculos precisos de custos e preços de impressão 3D para definir preços com confiança e aumentar o lucro.',cs:'Přesné výpočty nákladů a cen 3D tisku pro jisté stanovení cen a vyšší zisk.',sv:'Exakta kostnads- och prisberäkningar för 3D-utskrift så att du kan prissätta tryggt och öka vinsten.',da:'Præcise 3D-printberegninger hjælper dig med at prissætte sikkert og øge din fortjeneste.'},
 'View one-print economics or price a full batch.':{nl:'Bekijk de kosten van één print of prijs een volledige batch.',pt:'Veja os custos de uma impressão ou defina o preço de um lote completo.',cs:'Zobrazte náklady jednoho tisku nebo oceňte celou dávku.',sv:'Visa kostnaden för en utskrift eller prissätt en hel batch.',da:'Se omkostningen for ét print eller prissæt en hel batch.'}
};
const phraseMaps={
 nl:{'Settings':'Instellingen','Appearance':'Weergave','Dark mode':'Donkere modus','Language':'Taal','Language & region':'Taal en regio','Units':'Eenheden','Currency':'Valuta','Exchange rate':'Wisselkoers','Reset Calculator':'Calculator resetten','Apply Changes':'Wijzigingen toepassen','Calculate':'Berekenen','Price':'Prijs','Profit':'Winst','Costs':'Kosten','Start Calculating':'Start met berekenen','My Projects':'Mijn projecten','Guide & Help':'Handleiding & hulp','Your Model':'Jouw model','Print Setup':'Printinstellingen','Costs & Fees':'Kosten en toeslagen','Print Information':'Printinformatie','Printer':'Printer','Material':'Materiaal','Results':'Resultaten','Single Print':'Enkele print','Batch Pricing':'Batchprijs','Selling Price':'Verkoopprijs','Quantity':'Aantal','Delivery':'Levering','Electricity':'Elektriciteit','Additional Costs':'Extra kosten','Platform Fees':'Platformkosten','My Materials':'Mijn materialen','Add Material':'Materiaal toevoegen','Use':'Gebruiken','Edit':'Bewerken','Delete':'Verwijderen','Cancel':'Annuleren','Save Material':'Materiaal opslaan','Clear':'Wissen','Choose File':'Bestand kiezen','File':'Bestand','Print time':'Printtijd','Material used':'Gebruikt materiaal','Calculate Costs & Price':'Kosten en prijs berekenen','Total Cost to Make':'Totale productiekosten','Batch Cost to Make':'Productiekosten batch','Batch Sales':'Batchverkopen','Batch Profit':'Batchwinst','Selling Price':'Verkoopprijs','Margin:':'Marge:','Settings':'Instellingen','Resin':'Hars','Filament':'Filament'},
 pt:{'Settings':'Definições','Appearance':'Aspeto','Dark mode':'Modo escuro','Language':'Idioma','Language & region':'Idioma e região','Units':'Unidades','Currency':'Moeda','Exchange rate':'Taxa de câmbio','Reset Calculator':'Repor calculadora','Apply Changes':'Aplicar alterações','Calculate':'Calcular','Price':'Preço','Profit':'Lucro','Costs':'Custos','Start Calculating':'Começar a calcular','My Projects':'Os meus projetos','Guide & Help':'Guia e ajuda','Your Model':'O seu modelo','Print Setup':'Configuração de impressão','Costs & Fees':'Custos e taxas','Print Information':'Informações da impressão','Printer':'Impressora','Material':'Material','Results':'Resultados','Single Print':'Impressão única','Batch Pricing':'Preço por lote','Selling Price':'Preço de venda','Quantity':'Quantidade','Delivery':'Entrega','Electricity':'Eletricidade','Additional Costs':'Custos adicionais','Platform Fees':'Taxas da plataforma','My Materials':'Os meus materiais','Add Material':'Adicionar material','Use':'Usar','Edit':'Editar','Delete':'Eliminar','Cancel':'Cancelar','Save Material':'Guardar material','Clear':'Limpar','Choose File':'Escolher ficheiro','File':'Ficheiro','Print time':'Tempo de impressão','Material used':'Material usado','Calculate Costs & Price':'Calcular custos e preço','Total Cost to Make':'Custo total de produção','Batch Cost to Make':'Custo de produção do lote','Batch Sales':'Vendas do lote','Batch Profit':'Lucro do lote','Margin:':'Margem:','Resin':'Resina','Filament':'Filamento'},
 cs:{'Settings':'Nastavení','Appearance':'Vzhled','Dark mode':'Tmavý režim','Language':'Jazyk','Language & region':'Jazyk a oblast','Units':'Jednotky','Currency':'Měna','Exchange rate':'Směnný kurz','Reset Calculator':'Resetovat kalkulačku','Apply Changes':'Použít změny','Calculate':'Spočítat','Price':'Cena','Profit':'Zisk','Costs':'Náklady','Start Calculating':'Začít počítat','My Projects':'Moje projekty','Guide & Help':'Průvodce a nápověda','Your Model':'Váš model','Print Setup':'Nastavení tisku','Costs & Fees':'Náklady a poplatky','Print Information':'Informace o tisku','Printer':'Tiskárna','Material':'Materiál','Results':'Výsledky','Single Print':'Jeden tisk','Batch Pricing':'Cena dávky','Selling Price':'Prodejní cena','Quantity':'Množství','Delivery':'Doručení','Electricity':'Elektřina','Additional Costs':'Další náklady','Platform Fees':'Poplatky platformy','My Materials':'Moje materiály','Add Material':'Přidat materiál','Use':'Použít','Edit':'Upravit','Delete':'Smazat','Cancel':'Zrušit','Save Material':'Uložit materiál','Clear':'Vymazat','Choose File':'Vybrat soubor','File':'Soubor','Print time':'Doba tisku','Material used':'Spotřebovaný materiál','Calculate Costs & Price':'Spočítat náklady a cenu','Total Cost to Make':'Celkové náklady na výrobu','Batch Cost to Make':'Náklady na výrobu dávky','Batch Sales':'Prodej dávky','Batch Profit':'Zisk dávky','Margin:':'Marže:','Resin':'Pryskyřice','Filament':'Filament'},
 sv:{'Settings':'Inställningar','Appearance':'Utseende','Dark mode':'Mörkt läge','Language':'Språk','Language & region':'Språk och region','Units':'Enheter','Currency':'Valuta','Exchange rate':'Växelkurs','Reset Calculator':'Återställ kalkylator','Apply Changes':'Tillämpa ändringar','Calculate':'Beräkna','Price':'Pris','Profit':'Vinst','Costs':'Kostnader','Start Calculating':'Börja beräkna','My Projects':'Mina projekt','Guide & Help':'Guide och hjälp','Your Model':'Din modell','Print Setup':'Utskriftsinställning','Costs & Fees':'Kostnader och avgifter','Print Information':'Utskriftsinformation','Printer':'Skrivare','Material':'Material','Results':'Resultat','Single Print':'Enkel utskrift','Batch Pricing':'Batchpris','Selling Price':'Försäljningspris','Quantity':'Antal','Delivery':'Leverans','Electricity':'El','Additional Costs':'Övriga kostnader','Platform Fees':'Plattformsavgifter','My Materials':'Mina material','Add Material':'Lägg till material','Use':'Använd','Edit':'Redigera','Delete':'Ta bort','Cancel':'Avbryt','Save Material':'Spara material','Clear':'Rensa','Choose File':'Välj fil','File':'Fil','Print time':'Utskriftstid','Material used':'Använt material','Calculate Costs & Price':'Beräkna kostnader och pris','Total Cost to Make':'Total tillverkningskostnad','Batch Cost to Make':'Tillverkningskostnad för batch','Batch Sales':'Batchförsäljning','Batch Profit':'Batchvinst','Margin:':'Marginal:','Resin':'Harts','Filament':'Filament'},
 da:{'Settings':'Indstillinger','Appearance':'Udseende','Dark mode':'Mørk tilstand','Language':'Sprog','Language & region':'Sprog og område','Units':'Enheder','Currency':'Valuta','Exchange rate':'Valutakurs','Reset Calculator':'Nulstil lommeregner','Apply Changes':'Anvend ændringer','Calculate':'Beregn','Price':'Pris','Profit':'Fortjeneste','Costs':'Omkostninger','Start Calculating':'Start beregning','My Projects':'Mine projekter','Guide & Help':'Guide og hjælp','Your Model':'Din model','Print Setup':'Printopsætning','Costs & Fees':'Omkostninger og gebyrer','Print Information':'Printinformation','Printer':'Printer','Material':'Materiale','Results':'Resultater','Single Print':'Enkelt print','Batch Pricing':'Batchpris','Selling Price':'Salgspris','Quantity':'Antal','Delivery':'Levering','Electricity':'Elektricitet','Additional Costs':'Ekstra omkostninger','Platform Fees':'Platformgebyrer','My Materials':'Mine materialer','Add Material':'Tilføj materiale','Use':'Brug','Edit':'Rediger','Delete':'Slet','Cancel':'Annuller','Save Material':'Gem materiale','Clear':'Ryd','Choose File':'Vælg fil','File':'Fil','Print time':'Printtid','Material used':'Brugt materiale','Calculate Costs & Price':'Beregn omkostninger og pris','Total Cost to Make':'Samlede produktionsomkostninger','Batch Cost to Make':'Produktionsomkostning for batch','Batch Sales':'Batchsalg','Batch Profit':'Batchfortjeneste','Margin:':'Margin:','Resin':'Harpiks','Filament':'Filament'}
};
for(const [lang,map] of Object.entries(langMaps||{})){Object.assign(map,phraseMaps[lang]||{});} 
for(const [key,vals] of Object.entries(sharedExtra)){for(const [lang,val] of Object.entries(vals)){(langMaps[lang]||(langMaps[lang]={}))[key]=val;}}
for(const [lang,map] of Object.entries(phraseMaps)){Object.assign(langMaps[lang]||(langMaps[lang]={}),map);}
langMaps.pl=Object.assign({},tx,phraseMaps.pl||{});

function load(){
 try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}
 catch(e){return Object.assign({},defaults);}
}
let pref=load();
let draft=Object.assign({},pref);

function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function tr(v){if(pref.language==='en')return v;const map=langMaps[pref.language]||{};return map[v]||v;}

const originalText=new WeakMap();
const baseMoneyText=new WeakMap();
const baseMoneyInput=new WeakMap();
const baseLabel=new WeakMap();

function translatePage(){
 document.documentElement.lang=pref.language==='pl'?'pl':'en';
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let n;
 while(n=w.nextNode()){
  if(!n.parentElement||n.parentElement.closest('script,style'))continue;
  const raw=n.nodeValue.trim();
  if(!raw)continue;
  if(!originalText.has(n))originalText.set(n,raw);
  const target=tr(originalText.get(n));
  if(n.nodeValue!==target)n.nodeValue=n.nodeValue.replace(raw,target);
 }
}

let translationObserver=null;
let translationTimer=null;
function watchTranslations(){
 if(translationObserver||!window.MutationObserver)return;
 translationObserver=new MutationObserver(()=>{
  clearTimeout(translationTimer);
  translationTimer=setTimeout(()=>translatePage(),40);
 });
 translationObserver.observe(document.body,{childList:true,subtree:true});
}

function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 let s=document.getElementById('ppPreferenceTheme');
 if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent=
 'body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}'+
 'body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important}'+
 'body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}'+
 'body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}'+
 'body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}'+
 'body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}';
}

function labelFor(id){
 return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');
}

function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament';
 const imp=pref.units==='imperial';
 unitFields.forEach(id=>{
  const src=document.getElementById(id);
  if(!src)return;
  let p=document.getElementById('ppUnit_'+id);
  if(imp){
   if(!p){
    p=document.createElement('input');
    p.id='ppUnit_'+id;p.type='number';p.min='0';
    p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';
    src.insertAdjacentElement('afterend',p);src.style.display='none';
    p.addEventListener('input',()=>{
     const v=Number(p.value)||0;
     src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);
     src.dispatchEvent(new Event('input',{bubbles:true}));
    });
   }
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{
   if(p){p.remove();src.style.display='';}
  }
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}

function currency(){
 const meta=currencies[pref.currency]||currencies.GBP;
 const rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{
  const src=document.getElementById(id);if(!src)return;
  let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){
   if(p){p.remove();src.style.display='';}
  }else{
   if(!p){
    p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';
    p.step=src.step||'0.01';p.className='ppPreferenceInput';
    src.insertAdjacentElement('afterend',p);src.style.display='none';
    p.addEventListener('input',()=>{
     src.value=String((Number(p.value)||0)/rate);
     src.dispatchEvent(new Event('input',{bubbles:true}));
    });
   }
   p.value=(Number(src.value||0)*rate).toFixed(2);
  }
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let n;
 while(n=w.nextNode()){
  if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue;
  let s=n.nodeValue;
  const m=s.match(/[£€$zł]\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);
  if(m&&m[0].startsWith('£'))baseMoneyText.set(n,Number(m[1].replace(/,/g,'')));
  const base=baseMoneyText.get(n);
  if(base===undefined)continue;
  if(/[£€$zł]/.test(s)){
   n.nodeValue=s.replace(/[£€$zł]\s*-?[0-9][0-9,]*(?:\.[0-9]+)?/,
    new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(base*rate));
  }
 }
 document.querySelectorAll('input[readonly]').forEach(el=>{
  const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);
  if(m)baseMoneyInput.set(el,Number(m[1].replace(/,/g,'')));
  const b=baseMoneyInput.get(el);
  if(b!==undefined)el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(b*rate);
 });
 document.querySelectorAll('label').forEach(el=>{
  if(!baseLabel.has(el))baseLabel.set(el,el.textContent);
  const b=baseLabel.get(el);
  if(/[£€$zł]/.test(b))el.textContent=tr(b.replace(/[£€$zł]/g,'£')).replace(/£/g,meta.symbol);
 });
}

function ensureApplyButton(){
 const body=document.querySelector('#ppSettingsPanel .pp-settings-body');
 if(!body)return null;
 let btn=document.getElementById('ppSettingsApply');
 if(btn){
  // clean-top.js owns the actual click event. This helper only makes sure
  // a button exists; having two click handlers here caused settings to be
  // applied twice and made the modal behaviour unreliable.
  btn.textContent=tr('Apply Changes');
  return btn;
 }
 const reset=document.getElementById('ppSettingsReset');
 btn=document.createElement('button');
 btn.type='button';btn.id='ppSettingsApply';btn.className='pp-settings-apply';
 btn.textContent=tr('Apply Changes');
 btn.style.cssText='display:block;width:100%;margin:8px 0 4px;padding:12px 16px;border:1px solid #ff7800;border-radius:10px;background:#ff7800;color:#fff;font:800 12px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 24px #ff780022;';
 if(reset&&reset.parentElement)reset.parentElement.insertAdjacentElement('afterend',btn);else body.appendChild(btn);
 btn.addEventListener('click',(event)=>{
  event.preventDefault();
  event.stopPropagation();
  window.__applyPrintProfitSettings?.();
 });
 return btn;
}

function refreshDraftControls(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark)dark.checked=!!draft.dark;
 if(lang)lang.value=draft.language;
 if(units)units.value=draft.units;
 if(cur)cur.value=draft.currency;
 if(rate)rate.value=String(draft.rate);
}

function applyDraft(){
 const dark=document.getElementById('ppSettingsDark');
 const lang=document.getElementById('ppSettingsLanguage');
 const units=document.getElementById('ppSettingsUnits');
 const cur=document.getElementById('ppSettingsCurrency');
 const rate=document.getElementById('ppSettingsRate');

 // Read ALL controls at the moment Apply is pressed. Nothing is committed
 // while the user is merely changing a dropdown/switch.
 draft={
  dark:!!dark?.checked,
  language:lang?.value||'en',
  units:units?.value||'metric',
  currency:cur?.value||'GBP',
  rate:1
 };
 const entered=Number(rate?.value);
 draft.rate=entered>0?entered:(currencies[draft.currency]?.rate||1);

 // Commit the complete settings object first so every other calculator
 // script sees the same preferences.
 pref=Object.assign({},defaults,draft);
 save();

 // Apply the four visible behaviours immediately.
 setTheme();
 translatePage();
 applyUnits();
 currency();

 // The calculator is the source of truth for result values. Trigger its
 // normal Calculate action after localStorage has been updated so currency,
 // exchange rate and all dependent totals are recalculated together.
 const calcButton=document.getElementById('calc');
 if(calcButton) calcButton.click();

 // Re-apply presentation settings after Calculate because the core
 // calculator writes English labels/£-formatted output.
 setTheme();
 translatePage();
 applyUnits();
 currency();
 document.dispatchEvent(new CustomEvent('printprofit-settings-changed'));

 const b=document.getElementById('ppSettingsApply');
 if(b){b.textContent=tr('Apply Changes');b.style.transform='scale(.98)';setTimeout(()=>b.style.transform='',120);}
}
window.__applyPrintProfitSettings=applyDraft;
document.addEventListener('printprofit-settings-apply',applyDraft);

function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(!dark||!lang||!units||!cur||!rate)return;
 ensureApplyButton();

 if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{draft.dark=dark.checked;});}
 if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{draft.language=lang.value;});}
 if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{draft.units=units.value;});}
 if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{draft.currency=cur.value;draft.rate=currencies[draft.currency]?.rate||1;if(rate)rate.value=String(draft.rate);});}
 if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0)draft.rate=v;});}
}

function boot(){
  // Settings are deliberately event-driven. Older versions used a MutationObserver
  // plus a one-second rebinding loop, which created competing DOM/event work.
  bind();
  setTheme();
  translatePage();
  watchTranslations();
  applyUnits();
  currency();

  document.addEventListener('printprofit-settings-open',()=>{
    draft=Object.assign({},pref);
    refreshDraftControls();
    bind();
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();})();