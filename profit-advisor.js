(()=> {
'use strict';

if(window.__printProfitAdvisorV1)return;
window.__printProfitAdvisorV1=true;

const $=id=>document.getElementById(id);
const num=id=>{
  const el=$(id);
  return Number.parseFloat(el?.value||'0')||0;
};

const getLang=()=>{
  try{
    const p=JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}');
    return p.language||'en';
  }catch(e){return 'en';}
};

const M={
  en:{
    title:'Profit Advisor',
    negativeLead:'This print is currently losing {amount} per print.',
    positiveLead:'This print is profitable. Here are the biggest places you could improve your margin.',
    breakEven:'Break-even price',
    target:'Target price · 30% margin',
    opportunities:'Biggest opportunities',
    printSettings:'Print settings',
    printSettingsBody:'Where the model allows it, consider reducing infill, wall count, supports or layer height while keeping the strength and quality you need.',
    material:'Material',
    materialBody:'Your material cost is {amount} per print. Check bulk-buy pricing or a lower-cost suitable material in My Materials.',
    labour:'Labour',
    labourBody:'Your labour cost is {amount} per print. Every 5 minutes removed would save about {saving} at your current labour rate.',
    packaging:'Packaging & other',
    packagingBody:'You are spending {amount} per print here. Bulk-buy packaging and avoid oversized packaging where practical.',
    delivery:'Delivery',
    deliveryBody:'You are paying {amount} to deliver this order. Compare courier rates, business/account rates, or charge delivery separately.',
    fees:'Selling fees',
    feesBody:'Platform and payment fees are costing {amount} on the current sale. Compare selling channels and check that the selected fee profile matches your real fees.',
    price:'Selling price',
    priceBody:'The current selling price is {amount}. A break-even price is {breakEven}; the existing target-price buttons can take you higher.',
    electricity:'Electricity',
    electricityBody:'Electricity is {amount} per print. For long jobs, reducing print time or unnecessary heated time can lower this cost.',
    machine:'Printer cost',
    machineBody:'Printer depreciation is {amount} per print. Reducing print time or producing more parts per run can spread machine cost over more output.',
    review:'Review',
    healthy:'Healthy margin. You can still use the suggestions below to improve it further.',
    noData:'Add some costs or upload a print file and the advisor will become more specific.',
    batchNote:'Based on the current batch result.',
    singleNote:'Based on the current single-print result.',
    lowestDelivery:'Lowest listed reference rate: {option} — {price}. This may not fit every parcel size or service requirement.',
    lowestFee:'Lowest configured selling fee: {platform} — {fee} on this sale. Check the platform terms and any optional fees before choosing where to sell.',
    saveAmount:'That is {amount} less than your current cost.'
  },
  pl:{
    title:'Doradca zysku',
    negativeLead:'Ten wydruk obecnie generuje stratę {amount} na sztuce.',
    positiveLead:'Ten wydruk jest opłacalny. Oto obszary, w których możesz jeszcze poprawić marżę.',
    breakEven:'Cena progu rentowności',
    target:'Cena docelowa · marża 30%',
    opportunities:'Największe możliwości',
    printSettings:'Ustawienia druku',
    printSettingsBody:'Jeśli model na to pozwala, rozważ zmniejszenie wypełnienia, liczby ścian, podpór lub wysokości warstwy, zachowując wymaganą wytrzymałość i jakość.',
    material:'Materiał',
    materialBody:'Koszt materiału to {amount} na wydruk. Sprawdź ceny przy zakupie hurtowym lub tańszy odpowiedni materiał w Moich materiałach.',
    labour:'Robocizna',
    labourBody:'Koszt robocizny to {amount} na wydruk. Każde 5 minut mniej oszczędza około {saving} przy obecnej stawce.',
    packaging:'Opakowanie i inne',
    packagingBody:'Wydajesz tutaj {amount} na wydruk. Kupuj opakowania hurtowo i unikaj zbyt dużych opakowań, gdy jest to możliwe.',
    delivery:'Dostawa',
    deliveryBody:'Za dostawę płacisz {amount}. Porównaj stawki kurierów i kont firmowych lub nalicz dostawę osobno.',
    fees:'Opłaty za sprzedaż',
    feesBody:'Opłaty platformy i płatności kosztują obecnie {amount}. Porównaj kanały sprzedaży i sprawdź wybrane stawki.',
    price:'Cena sprzedaży',
    priceBody:'Obecna cena sprzedaży to {amount}. Cena progu rentowności to {breakEven}; istniejące przyciski ceny docelowej pozwalają ustawić więcej.',
    electricity:'Prąd',
    electricityBody:'Prąd kosztuje {amount} na wydruk. Przy długich zadaniach skrócenie czasu druku może obniżyć ten koszt.',
    machine:'Koszt drukarki',
    machineBody:'Amortyzacja drukarki to {amount} na wydruk. Krótszy czas druku lub więcej części na przebieg może lepiej rozłożyć koszt.',
    review:'Sprawdź',
    healthy:'Dobra marża. Poniższe sugestie mogą pomóc poprawić ją jeszcze bardziej.',
    noData:'Dodaj koszty lub prześlij plik druku, aby doradca mógł podać więcej szczegółów.',
    batchNote:'Na podstawie bieżącego wyniku partii.',
    singleNote:'Na podstawie bieżącego wyniku pojedynczego wydruku.',
    lowestDelivery:'Najniższa podana stawka referencyjna: {option} — {price}. Może nie pasować do każdego rozmiaru paczki lub usługi.',
    lowestFee:'Najniższa skonfigurowana opłata sprzedażowa: {platform} — {fee} przy tej sprzedaży. Sprawdź warunki platformy i ewentualne opłaty dodatkowe.',
    saveAmount:'To {amount} mniej niż obecny koszt.'
  },
  de:{
    title:'Gewinnberater',
    negativeLead:'Dieser Druck macht derzeit {amount} Verlust pro Stück.',
    positiveLead:'Dieser Druck ist profitabel. Hier sind die wichtigsten Bereiche, in denen du die Marge weiter verbessern kannst.',
    breakEven:'Break-even-Preis',
    target:'Zielpreis · 30 % Marge',
    opportunities:'Größte Möglichkeiten',
    printSettings:'Druckeinstellungen',
    printSettingsBody:'Wenn es das Modell erlaubt, kannst du Füllung, Wandanzahl, Stützen oder Schichthöhe reduzieren und dabei die benötigte Festigkeit und Qualität beibehalten.',
    material:'Material',
    materialBody:'Deine Materialkosten betragen {amount} pro Druck. Prüfe Mengenpreise oder ein günstigeres geeignetes Material in Meine Materialien.',
    labour:'Arbeitszeit',
    labourBody:'Deine Arbeitskosten betragen {amount} pro Druck. Jede eingesparte Minute senkt die Kosten; 5 Minuten entsprechen bei deinem aktuellen Satz etwa {saving}.',
    packaging:'Verpackung & Sonstiges',
    packagingBody:'Hier fallen {amount} pro Druck an. Verpackungen in größeren Mengen kaufen und unnötig große Verpackungen vermeiden.',
    delivery:'Versand',
    deliveryBody:'Du zahlst {amount} für den Versand. Vergleiche Versanddienste, Geschäftskonditionen oder berechne den Versand separat.',
    fees:'Verkaufsgebühren',
    feesBody:'Plattform- und Zahlungsgebühren kosten aktuell {amount}. Vergleiche Verkaufskanäle und prüfe das gewählte Gebührenprofil.',
    price:'Verkaufspreis',
    priceBody:'Der aktuelle Verkaufspreis beträgt {amount}. Der Break-even liegt bei {breakEven}; die vorhandenen Zielpreis-Schaltflächen können einen höheren Preis setzen.',
    electricity:'Strom',
    electricityBody:'Strom kostet {amount} pro Druck. Bei langen Aufträgen kann eine kürzere Druckzeit die Kosten senken.',
    machine:'Druckerkosten',
    machineBody:'Die Druckerabschreibung beträgt {amount} pro Druck. Kürzere Druckzeiten oder mehr Teile pro Lauf können die Maschinenkosten besser verteilen.',
    review:'Prüfen',
    healthy:'Gute Marge. Die folgenden Vorschläge können sie noch weiter verbessern.',
    noData:'Füge Kosten hinzu oder lade eine Druckdatei hoch, damit der Berater genauer werden kann.',
    batchNote:'Basierend auf dem aktuellen Batch-Ergebnis.',
    singleNote:'Basierend auf dem aktuellen Einzel-Druck-Ergebnis.',
    lowestDelivery:'Niedrigster gelisteter Referenztarif: {option} — {price}. Er ist möglicherweise nicht für jedes Paket oder jede Versandart geeignet.',
    lowestFee:'Niedrigste konfigurierte Verkaufsgebühr: {platform} — {fee} für diesen Verkauf. Prüfe die Plattformbedingungen und optionale Gebühren.',
    saveAmount:'Das sind {amount} weniger als deine aktuellen Kosten.'
  },
  fr:{
    title:'Conseiller de rentabilité',
    negativeLead:'Cette impression perd actuellement {amount} par pièce.',
    positiveLead:'Cette impression est rentable. Voici les principaux leviers pour améliorer encore votre marge.',
    breakEven:'Prix d’équilibre',
    target:'Prix cible · marge de 30 %',
    opportunities:'Plus grandes possibilités',
    printSettings:'Paramètres d’impression',
    printSettingsBody:'Lorsque le modèle le permet, réduisez le remplissage, le nombre de parois, les supports ou la hauteur de couche tout en conservant la solidité et la qualité nécessaires.',
    material:'Matériau',
    materialBody:'Votre coût matière est de {amount} par impression. Vérifiez les tarifs en achat groupé ou un matériau adapté moins cher dans Mes matériaux.',
    labour:'Main-d’œuvre',
    labourBody:'Votre coût de main-d’œuvre est de {amount} par impression. Réduire 5 minutes économiserait environ {saving} au tarif actuel.',
    packaging:'Emballage & autres',
    packagingBody:'Vous dépensez {amount} par impression ici. Achetez les emballages en volume et évitez les formats surdimensionnés lorsque possible.',
    delivery:'Livraison',
    deliveryBody:'Vous payez {amount} pour la livraison. Comparez les tarifs des transporteurs ou facturez la livraison séparément.',
    fees:'Frais de vente',
    feesBody:'Les frais de plateforme et de paiement représentent {amount}. Comparez les canaux de vente et vérifiez que le profil choisi correspond à vos frais réels.',
    price:'Prix de vente',
    priceBody:'Le prix de vente actuel est de {amount}. Le prix d’équilibre est {breakEven}; les boutons de prix cible peuvent aller plus haut.',
    electricity:'Électricité',
    electricityBody:'L’électricité coûte {amount} par impression. Pour les longues impressions, réduire le temps d’impression peut diminuer ce coût.',
    machine:'Coût de l’imprimante',
    machineBody:'L’amortissement de l’imprimante est de {amount} par impression. Réduire le temps d’impression ou produire plus de pièces par lancement peut mieux répartir ce coût.',
    review:'Vérifier',
    healthy:'Marge saine. Les suggestions ci-dessous peuvent encore l’améliorer.',
    noData:'Ajoutez des coûts ou téléversez un fichier d’impression pour obtenir des conseils plus précis.',
    batchNote:'Basé sur le résultat actuel du lot.',
    singleNote:'Basé sur le résultat actuel d’une impression.',
    lowestDelivery:'Tarif de référence le plus bas listé : {option} — {price}. Il peut ne pas convenir à tous les colis ou services.',
    lowestFee:'Frais de vente configurés les plus bas : {platform} — {fee} sur cette vente. Vérifiez les conditions et les frais optionnels.',
    saveAmount:'Soit {amount} de moins que votre coût actuel.'
  },
  es:{
    title:'Asesor de beneficios',
    negativeLead:'Esta impresión actualmente pierde {amount} por unidad.',
    positiveLead:'Esta impresión es rentable. Estas son las áreas principales en las que puedes mejorar aún más el margen.',
    breakEven:'Precio de equilibrio',
    target:'Precio objetivo · margen del 30 %',
    opportunities:'Mayores oportunidades',
    printSettings:'Ajustes de impresión',
    printSettingsBody:'Cuando el modelo lo permita, considera reducir el relleno, el número de paredes, los soportes o la altura de capa manteniendo la resistencia y calidad necesarias.',
    material:'Material',
    materialBody:'El material cuesta {amount} por impresión. Comprueba precios por volumen o un material adecuado más barato en Mis materiales.',
    labour:'Mano de obra',
    labourBody:'La mano de obra cuesta {amount} por impresión. Reducir 5 minutos ahorraría aproximadamente {saving} con tu tarifa actual.',
    packaging:'Embalaje y otros',
    packagingBody:'Gastas {amount} por impresión aquí. Compra embalajes en volumen y evita tamaños excesivos cuando sea posible.',
    delivery:'Entrega',
    deliveryBody:'Pagas {amount} por el envío. Compara tarifas de mensajería o cobra el envío por separado.',
    fees:'Comisiones de venta',
    feesBody:'Las comisiones de plataforma y pago cuestan {amount}. Compara canales de venta y comprueba que el perfil de comisiones coincida con tus tarifas reales.',
    price:'Precio de venta',
    priceBody:'El precio actual es {amount}. El precio de equilibrio es {breakEven}; los botones de precio objetivo existentes permiten establecer uno superior.',
    electricity:'Electricidad',
    electricityBody:'La electricidad cuesta {amount} por impresión. En trabajos largos, reducir el tiempo de impresión puede bajar este coste.',
    machine:'Coste de impresora',
    machineBody:'La depreciación de la impresora es de {amount} por impresión. Reducir el tiempo o producir más piezas por ejecución puede repartir mejor el coste.',
    review:'Revisar',
    healthy:'Margen saludable. Las sugerencias de abajo pueden mejorarlo aún más.',
    noData:'Añade costes o sube un archivo de impresión para obtener sugerencias más específicas.',
    batchNote:'Basado en el resultado actual del lote.',
    singleNote:'Basado en el resultado actual de una impresión.',
    lowestDelivery:'Tarifa de referencia más baja indicada: {option} — {price}. Puede no ser adecuada para todos los tamaños de paquete o servicios.',
    lowestFee:'Comisión de venta configurada más baja: {platform} — {fee} en esta venta. Comprueba las condiciones y posibles cargos opcionales.',
    saveAmount:'Son {amount} menos que tu coste actual.'
  },
  it:{
    title:'Consulente del profitto',
    negativeLead:'Questa stampa sta attualmente perdendo {amount} per pezzo.',
    positiveLead:'Questa stampa è redditizia. Ecco le aree principali in cui puoi migliorare ulteriormente il margine.',
    breakEven:'Prezzo di pareggio',
    target:'Prezzo obiettivo · margine 30%',
    opportunities:'Maggiori opportunità',
    printSettings:'Impostazioni di stampa',
    printSettingsBody:'Quando il modello lo consente, valuta di ridurre riempimento, numero di pareti, supporti o altezza del layer mantenendo la resistenza e la qualità necessarie.',
    material:'Materiale',
    materialBody:'Il costo del materiale è {amount} per stampa. Controlla prezzi all’ingrosso o un materiale adatto più economico in I miei materiali.',
    labour:'Manodopera',
    labourBody:'Il costo della manodopera è {amount} per stampa. Ridurre 5 minuti farebbe risparmiare circa {saving} alla tariffa attuale.',
    packaging:'Imballaggio e altro',
    packagingBody:'Spendi {amount} per stampa in questa voce. Acquista gli imballaggi in quantità e limita le confezioni sovradimensionate quando possibile.',
    delivery:'Consegna',
    deliveryBody:'Paghi {amount} per la consegna. Confronta le tariffe dei corrieri o addebita la consegna separatamente.',
    fees:'Commissioni di vendita',
    feesBody:'Le commissioni di piattaforma e pagamento costano {amount}. Confronta i canali di vendita e verifica che il profilo corrisponda alle commissioni reali.',
    price:'Prezzo di vendita',
    priceBody:'Il prezzo attuale è {amount}. Il prezzo di pareggio è {breakEven}; i pulsanti del prezzo obiettivo possono impostare un valore maggiore.',
    electricity:'Elettricità',
    electricityBody:'L’elettricità costa {amount} per stampa. Per lavori lunghi, ridurre il tempo di stampa può abbassare questo costo.',
    machine:'Costo stampante',
    machineBody:'L’ammortamento della stampante è {amount} per stampa. Ridurre il tempo o produrre più pezzi per ciclo può distribuire meglio il costo.',
    review:'Controlla',
    healthy:'Margine buono. I suggerimenti qui sotto possono migliorarlo ancora.',
    noData:'Aggiungi alcuni costi o carica un file di stampa per ricevere consigli più specifici.',
    batchNote:'Basato sul risultato attuale del lotto.',
    singleNote:'Basato sul risultato attuale di una singola stampa.',
    lowestDelivery:'Tariffa di riferimento più bassa indicata: {option} — {price}. Potrebbe non essere adatta a ogni dimensione di pacco o servizio.',
    lowestFee:'Commissione di vendita configurata più bassa: {platform} — {fee} su questa vendita. Controlla condizioni ed eventuali costi opzionali.',
    saveAmount:'Sono {amount} in meno rispetto al costo attuale.'
  },
  nl:{
    title:'Winstadviseur',
    negativeLead:'Deze print maakt momenteel {amount} verlies per stuk.',
    positiveLead:'Deze print is winstgevend. Dit zijn de belangrijkste punten waarop je de marge verder kunt verbeteren.',
    breakEven:'Break-evenprijs',
    target:'Doelprijs · 30% marge',
    opportunities:'Grootste kansen',
    printSettings:'Printinstellingen',
    printSettingsBody:'Waar het model het toelaat, kun je infill, wandenaantal, supports of laaghoogte verlagen terwijl de benodigde sterkte en kwaliteit behouden blijven.',
    material:'Materiaal',
    materialBody:'Je materiaalkosten zijn {amount} per print. Controleer bulkprijzen of een goedkoper geschikt materiaal bij Mijn materialen.',
    labour:'Arbeid',
    labourBody:'Je arbeidskosten zijn {amount} per print. 5 minuten minder zou bij je huidige tarief ongeveer {saving} besparen.',
    packaging:'Verpakking & overig',
    packagingBody:'Hier geef je {amount} per print uit. Koop verpakkingen in bulk en vermijd te grote verpakkingen waar dat kan.',
    delivery:'Levering',
    deliveryBody:'Je betaalt {amount} voor verzending. Vergelijk koeriersprijzen, zakelijke tarieven of reken de verzending apart door.',
    fees:'Verkoopkosten',
    feesBody:'Platform- en betalingskosten bedragen momenteel {amount}. Vergelijk verkoopkanalen en controleer het gekozen kostenprofiel.',
    price:'Verkoopprijs',
    priceBody:'De huidige verkoopprijs is {amount}. De break-evenprijs is {breakEven}; de bestaande doelprijs-knoppen kunnen hoger gaan.',
    electricity:'Elektriciteit',
    electricityBody:'Elektriciteit kost {amount} per print. Bij lange prints kan een kortere printtijd deze kosten verlagen.',
    machine:'Printerkosten',
    machineBody:'Printerafschrijving is {amount} per print. Kortere printtijd of meer onderdelen per run kan deze kosten beter verdelen.',
    review:'Bekijken',
    healthy:'Gezonde marge. Met de suggesties hieronder kun je die verder verbeteren.',
    noData:'Voeg kosten toe of upload een printbestand voor specifiekere adviezen.',
    batchNote:'Gebaseerd op het huidige batchresultaat.',
    singleNote:'Gebaseerd op het huidige resultaat van één print.',
    lowestDelivery:'Laagste vermelde referentietarief: {option} — {price}. Dit past mogelijk niet bij elk pakketformaat of elke dienst.',
    lowestFee:'Laagste geconfigureerde verkoopkosten: {platform} — {fee} bij deze verkoop. Controleer voorwaarden en eventuele extra kosten.',
    saveAmount:'Dat is {amount} minder dan je huidige kosten.'
  },
  pt:{
    title:'Consultor de lucro',
    negativeLead:'Esta impressão está atualmente a perder {amount} por unidade.',
    positiveLead:'Esta impressão é rentável. Aqui estão as principais áreas onde pode melhorar ainda mais a margem.',
    breakEven:'Preço de equilíbrio',
    target:'Preço alvo · margem de 30%',
    opportunities:'Maiores oportunidades',
    printSettings:'Definições de impressão',
    printSettingsBody:'Quando o modelo permitir, considere reduzir o preenchimento, o número de paredes, os suportes ou a altura da camada, mantendo a resistência e qualidade necessárias.',
    material:'Material',
    materialBody:'O custo do material é {amount} por impressão. Verifique preços de compra em quantidade ou um material adequado mais barato em Os meus materiais.',
    labour:'Mão de obra',
    labourBody:'O custo de mão de obra é {amount} por impressão. Reduzir 5 minutos pouparia cerca de {saving} à taxa atual.',
    packaging:'Embalagem e outros',
    packagingBody:'Gasta {amount} por impressão nesta área. Compre embalagens em quantidade e evite tamanhos excessivos quando possível.',
    delivery:'Entrega',
    deliveryBody:'Paga {amount} pela entrega. Compare transportadoras, tarifas empresariais ou cobre a entrega separadamente.',
    fees:'Taxas de venda',
    feesBody:'As taxas da plataforma e do pagamento custam {amount}. Compare canais de venda e confirme o perfil de taxas.',
    price:'Preço de venda',
    priceBody:'O preço atual é {amount}. O preço de equilíbrio é {breakEven}; os botões de preço alvo existentes podem definir um valor superior.',
    electricity:'Eletricidade',
    electricityBody:'A eletricidade custa {amount} por impressão. Em trabalhos longos, reduzir o tempo de impressão pode baixar este custo.',
    machine:'Custo da impressora',
    machineBody:'A depreciação da impressora é {amount} por impressão. Reduzir o tempo ou produzir mais peças por execução pode distribuir melhor o custo.',
    review:'Rever',
    healthy:'Margem saudável. As sugestões abaixo podem melhorá-la ainda mais.',
    noData:'Adicione custos ou carregue um ficheiro de impressão para obter sugestões mais específicas.',
    batchNote:'Com base no resultado atual do lote.',
    singleNote:'Com base no resultado atual de uma impressão.',
    lowestDelivery:'Tarifa de referência mais baixa indicada: {option} — {price}. Pode não ser adequada a todos os tamanhos de encomenda ou serviços.',
    lowestFee:'Taxa de venda configurada mais baixa: {platform} — {fee} nesta venda. Verifique os termos e eventuais taxas opcionais.',
    saveAmount:'São {amount} menos do que o seu custo atual.'
  },
  cs:{
    title:'Poradce zisku',
    negativeLead:'Tento tisk nyní vytváří ztrátu {amount} na kus.',
    positiveLead:'Tento tisk je ziskový. Zde jsou hlavní oblasti, kde můžete marži ještě zlepšit.',
    breakEven:'Bod zvratu',
    target:'Cílová cena · marže 30 %',
    opportunities:'Největší příležitosti',
    printSettings:'Nastavení tisku',
    printSettingsBody:'Pokud to model dovoluje, zvažte snížení výplně, počtu stěn, podpor nebo výšky vrstvy při zachování potřebné pevnosti a kvality.',
    material:'Materiál',
    materialBody:'Náklady na materiál jsou {amount} na tisk. Zkontrolujte velkoobchodní ceny nebo levnější vhodný materiál v Moje materiály.',
    labour:'Práce',
    labourBody:'Náklady na práci jsou {amount} na tisk. Každých 5 minut méně by při současné sazbě ušetřilo přibližně {saving}.',
    packaging:'Balení a ostatní',
    packagingBody:'Zde utratíte {amount} na tisk. Nakupujte obaly ve větším množství a vyhněte se zbytečně velkým balením.',
    delivery:'Doručení',
    deliveryBody:'Za doručení platíte {amount}. Porovnejte ceny dopravců, firemní sazby nebo účtujte dopravu zvlášť.',
    fees:'Prodejní poplatky',
    feesBody:'Poplatky platformy a platby nyní stojí {amount}. Porovnejte prodejní kanály a ověřte zvolený profil poplatků.',
    price:'Prodejní cena',
    priceBody:'Aktuální prodejní cena je {amount}. Bod zvratu je {breakEven}; stávající tlačítka cílové ceny mohou nastavit vyšší cenu.',
    electricity:'Elektřina',
    electricityBody:'Elektřina stojí {amount} na tisk. U dlouhých tisků může kratší doba tisku tyto náklady snížit.',
    machine:'Náklady tiskárny',
    machineBody:'Odpis tiskárny činí {amount} na tisk. Kratší tisk nebo více kusů na jednu dávku může náklad lépe rozložit.',
    review:'Zkontrolovat',
    healthy:'Zdravá marže. Níže uvedené tipy ji mohou dále zlepšit.',
    noData:'Přidejte náklady nebo nahrajte soubor tisku, aby byl poradce konkrétnější.',
    batchNote:'Na základě aktuálního výsledku dávky.',
    singleNote:'Na základě aktuálního výsledku jednoho tisku.',
    lowestDelivery:'Nejnižší uvedená referenční sazba: {option} — {price}. Nemusí vyhovovat každé velikosti zásilky nebo službě.',
    lowestFee:'Nejnižší nakonfigurovaný prodejní poplatek: {platform} — {fee} při tomto prodeji. Ověřte podmínky platformy a volitelné poplatky.',
    saveAmount:'To je o {amount} méně než váš současný náklad.'
  },
  sv:{
    title:'Vinstguide',
    negativeLead:'Den här utskriften går just nu {amount} back per styck.',
    positiveLead:'Den här utskriften är lönsam. Här är de viktigaste områdena där du kan förbättra marginalen ytterligare.',
    breakEven:'Nollpunktspris',
    target:'Målpris · 30 % marginal',
    opportunities:'Största möjligheterna',
    printSettings:'Utskriftsinställningar',
    printSettingsBody:'När modellen tillåter det kan du minska infill, antal väggar, stöd eller lagerhöjd och ändå behålla den styrka och kvalitet du behöver.',
    material:'Material',
    materialBody:'Materialkostnaden är {amount} per utskrift. Kontrollera mängdpriser eller ett billigare lämpligt material i Mina material.',
    labour:'Arbete',
    labourBody:'Arbetskostnaden är {amount} per utskrift. 5 minuter mindre skulle spara cirka {saving} med din nuvarande timkostnad.',
    packaging:'Förpackning & övrigt',
    packagingBody:'Du spenderar {amount} per utskrift här. Köp förpackningar i större mängder och undvik överdimensionerade emballage när det går.',
    delivery:'Leverans',
    deliveryBody:'Du betalar {amount} för leveransen. Jämför transportörspriser, företagspriser eller ta betalt för frakten separat.',
    fees:'Försäljningsavgifter',
    feesBody:'Plattforms- och betalningsavgifter kostar {amount}. Jämför försäljningskanaler och kontrollera avgiftsprofilen.',
    price:'Försäljningspris',
    priceBody:'Nuvarande försäljningspris är {amount}. Nollpunkten är {breakEven}; de befintliga målprisknapparna kan sätta ett högre pris.',
    electricity:'El',
    electricityBody:'El kostar {amount} per utskrift. Vid långa jobb kan kortare utskriftstid sänka kostnaden.',
    machine:'Skrivarkostnad',
    machineBody:'Skrivarens avskrivning är {amount} per utskrift. Kortare utskriftstid eller fler delar per körning kan fördela kostnaden bättre.',
    review:'Granska',
    healthy:'Bra marginal. Förslagen nedan kan förbättra den ytterligare.',
    noData:'Lägg till kostnader eller ladda upp en utskriftsfil för mer specifika råd.',
    batchNote:'Baserat på det aktuella batchresultatet.',
    singleNote:'Baserat på det aktuella resultatet för en utskrift.',
    lowestDelivery:'Lägsta angivna referenspris: {option} — {price}. Det kanske inte passar alla paketstorlekar eller tjänster.',
    lowestFee:'Lägsta konfigurerade försäljningsavgift: {platform} — {fee} på denna försäljning. Kontrollera villkoren och eventuella tillvalskostnader.',
    saveAmount:'Det är {amount} mindre än din nuvarande kostnad.'
  },
  da:{
    title:'Fortjenesteassistent',
    negativeLead:'Dette print giver i øjeblikket et tab på {amount} pr. stk.',
    positiveLead:'Dette print er rentabelt. Her er de vigtigste områder, hvor du stadig kan forbedre din margen.',
    breakEven:'Break-even-pris',
    target:'Målpris · 30 % margen',
    opportunities:'Største muligheder',
    printSettings:'Printindstillinger',
    printSettingsBody:'Når modellen tillader det, kan du overveje at reducere infill, antal vægge, supports eller laghøjde, mens den nødvendige styrke og kvalitet bevares.',
    material:'Materiale',
    materialBody:'Materialeomkostningen er {amount} pr. print. Tjek bulkpriser eller et billigere egnet materiale i Mine materialer.',
    labour:'Arbejde',
    labourBody:'Arbejdsomkostningen er {amount} pr. print. 5 minutter mindre ville spare cirka {saving} ved din nuværende sats.',
    packaging:'Emballage & andet',
    packagingBody:'Du bruger {amount} pr. print her. Køb emballage i større mængder og undgå overdimensioneret emballage, når det er muligt.',
    delivery:'Levering',
    deliveryBody:'Du betaler {amount} for levering. Sammenlign fragtpriser, erhvervspriser eller opkræv levering separat.',
    fees:'Salgsgebyrer',
    feesBody:'Platform- og betalingsgebyrer koster {amount}. Sammenlign salgskanaler og kontroller den valgte gebyrprofil.',
    price:'Salgspris',
    priceBody:'Den aktuelle salgspris er {amount}. Break-even er {breakEven}; de eksisterende målpris-knapper kan sætte en højere pris.',
    electricity:'Elektricitet',
    electricityBody:'Elektricitet koster {amount} pr. print. Ved lange jobs kan kortere printtid reducere omkostningen.',
    machine:'Printeromkostning',
    machineBody:'Printerafskrivning er {amount} pr. print. Kortere printtid eller flere dele pr. kørsel kan fordele maskinomkostningen bedre.',
    review:'Se',
    healthy:'God margen. Forslagene nedenfor kan forbedre den yderligere.',
    noData:'Tilføj omkostninger eller upload en printfil for mere specifikke råd.',
    batchNote:'Baseret på det aktuelle batchresultat.',
    singleNote:'Baseret på det aktuelle resultat for ét print.',
    lowestDelivery:'Laveste angivne referencesats: {option} — {price}. Den passer muligvis ikke til alle pakkestørrelser eller tjenester.',
    lowestFee:'Laveste konfigurerede salgsgebyr: {platform} — {fee} på dette salg. Tjek vilkår og eventuelle ekstra gebyrer.',
    saveAmount:'Det er {amount} mindre end din nuværende omkostning.'
  }
};

function t(key,vars={}){
  const pack=M[getLang()]||M.en;
  let s=pack[key]||M.en[key]||key;
  Object.entries(vars).forEach(([k,v])=>{s=s.replaceAll('{'+k+'}',String(v));});
  return s;
}

function printerData(){
  const el=$('printer');
  if(!el||!el.value||el.value==='custom')return{watts:0,price:0,lifetime:0};
  const p=el.value.split(/[|,]/);
  return{watts:Number(p[0])||0,price:Number(p[1])||0,lifetime:Number(p[2])||0};
}

function money(v){
  const value=Number(v)||0;
  try{
    const p=JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}');
    const rates={GBP:1,EUR:1.1663,USD:1.3370,PLN:5.0892,CAD:1.84,AUD:2,CHF:.96,SEK:14.75,NOK:14.70,DKK:8.69,CZK:28.30,JPY:179,CNY:9.65,INR:123.50,NZD:2.16,SGD:1.71,BRL:7.18,MXN:23.0696,ZAR:21.80};
    const code=p.currency||'GBP';
    const rate=Number(p.rate)>0?Number(p.rate):(rates[code]||1);
    const locales={EUR:'de-DE',USD:'en-US',PLN:'pl-PL',CAD:'en-CA',AUD:'en-AU',CHF:'de-CH',SEK:'sv-SE',NOK:'nb-NO',DKK:'da-DK',CZK:'cs-CZ',JPY:'ja-JP',CNY:'zh-CN',INR:'en-IN',NZD:'en-NZ',SGD:'en-SG',BRL:'pt-BR',MXN:'es-MX',ZAR:'en-ZA'};
    if(code!=='GBP')return new Intl.NumberFormat(locales[code]||'en-GB',{style:'currency',currency:code,minimumFractionDigits:2,maximumFractionDigits:2}).format(value*rate);
  }catch(e){}
  return '£'+value.toFixed(2);
}

function snapshot(){
  const p=printerData();
  const qty=Math.max(1,Math.floor(num('qty')));
  const disc=Math.min(100,num('discount'))/100;
  const hiddenHours=num('printHours');
  const h=$('ppPrintTimeHours'),m=$('ppPrintTimeMinutes');
  const hours=(h&&m)?Math.max(0,Math.floor(Number(h.value)||0)+Math.max(0,Math.min(59,Math.floor(Number(m.value)||0)))/60):hiddenHours;
  const pack=num('materialPack'), packPrice=num('materialPackCost'), used=num('materialUsed');
  const materialCost=pack>0&&used>0?packPrice*(used/pack):0;
  const powerUsed=p.watts>0&&hours>0?p.watts/1000*hours:0;
  const elec=powerUsed*num('electricityRate');
  const depreciation=p.lifetime&&hours?p.price/p.lifetime*hours:0;
  const labour=num('labourRate')*num('labourHours');
  const packagingOther=num('pack')+num('other');
  const delivery=num('delivery');
  const deliveryCharge=num('deliveryCharge');
  const base=materialCost+elec+depreciation+labour+packagingOther+delivery;
  const sell=num('sell');
  const feeRate=(num('platform')+num('pay'))/100;
  const fees=sell*feeRate+num('fixedFee');
  const profit=sell+deliveryCharge-base-fees;
  const margin=sell?profit/sell:0;
  const den=1-feeRate;
  const breakEven=den>0?Math.max(0,base+num('fixedFee')-deliveryCharge)/den:null;
  const target30Den=1-feeRate-.30;
  const target30=target30Den>0?Math.max(0,base+num('fixedFee')-deliveryCharge)/target30Den:null;

  const listSales=sell*qty;
  const discountSaved=listSales*disc;
  const itemSales=listSales-discountSaved;
  const batchProductionBase=Math.max(0,base-delivery);
  const productionSubtotal=batchProductionBase*qty;
  const batchCost=productionSubtotal+delivery;
  const batchFees=itemSales*feeRate+num('fixedFee');
  const batchProfit=itemSales+deliveryCharge-batchCost-batchFees;
  const batchBreakEvenDen=1-feeRate;
  const batchBreakEven=batchBreakEvenDen>0&&qty*(1-disc)>0
    ?Math.max(0,(batchProductionBase*qty+delivery+num('fixedFee')-deliveryCharge)/batchBreakEvenDen)/(qty*(1-disc))
    :null;
  const batchTarget30Den=1-feeRate-.30;
  const batchTarget30=batchTarget30Den>0&&qty*(1-disc)>0
    ?Math.max(0,(batchProductionBase*qty+delivery+num('fixedFee')-deliveryCharge)/batchTarget30Den)/(qty*(1-disc))
    :null;

  return {qty,disc,hours,materialCost,materialPack:pack,materialPackCost:packPrice,materialUsed:used,elec,depreciation,labour,labourHours:num('labourHours'),labourRate:num('labourRate'),packagingOther,delivery,deliveryCharge,base,sell,fees,profit,margin,breakEven,target30,batchProfit,batchBreakEven,batchTarget30};
}

function profileName(selectId,key){
  const el=$(selectId);
  const opt=el?.querySelector('option[value="'+String(key).replace(/"/g,'&quot;')+'"]');
  return opt?.textContent?.trim()||key;
}

function cheapestDelivery(){
  try{
    const data=window.__ppProfitAdvisorData?.();
    const profiles=data?.deliveryProfiles;
    if(!profiles)return null;
    let best=null;
    Object.entries(profiles).forEach(([key,p])=>{
      (p?.rates||[]).forEach(r=>{
        const price=Number(r?.price);
        if(!(price>0))return;
        if(!best||price<best.price)best={courier:key,label:r.label,price};
      });
    });
    return best;
  }catch(e){return null;}
}

function lowestSellingFee(sell){
  try{
    const data=window.__ppProfitAdvisorData?.();
    const profiles=data?.platformProfiles;
    if(!profiles)return null;
    let best=null;
    Object.entries(profiles).forEach(([key,p])=>{
      if(key==='custom')return;
      const pct=(Number(p?.platform)||0)+(Number(p?.pay)||0);
      const fixed=Number(p?.fixed)||0;
      const fee=Math.max(0,sell||0)*pct/100+fixed;
      if(!best||fee<best.fee)best={platform:key,fee,pct,fixed};
    });
    return best;
  }catch(e){return null;}
}

function goToReviewTarget(target){
  const stageMap={
    printer:'machine',materialPackCost:'machine',materialUsed:'machine',
    labourRate:'costs',labourHours:'costs',pack:'costs',other:'costs',
    delivery:'costs',deliveryCourier:'costs',deliveryRate:'costs',
    platformSelect:'costs',platform:'costs',pay:'costs',fixedFee:'costs',
    sell:'costs',electricityRate:'costs',electricityProvider:'costs'
  };
  const stage=stageMap[target]||'costs';
  const step=document.querySelector('.pp-step[data-tab="'+stage+'"]');

  const locate=()=>{
    const field=$(target);
    if(!field)return;
    const box=field.closest('.merge-block,.panel')||field;
    try{
      const frame=window.frameElement;
      const parentWindow=window.parent&&window.parent!==window?window.parent:window;
      if(frame&&parentWindow&&typeof parentWindow.scrollTo==='function'){
        const frameRect=frame.getBoundingClientRect();
        const boxRect=box.getBoundingClientRect();
        const pageTop=(parentWindow.scrollY||0)+frameRect.top+boxRect.top-85;
        parentWindow.scrollTo({top:Math.max(0,pageTop),behavior:'smooth'});
      }else{
        box.scrollIntoView({behavior:'smooth',block:'start'});
      }
      box.style.outline='2px solid var(--accent,#ff7800)';
      box.style.outlineOffset='2px';
      setTimeout(()=>{box.style.outline='';box.style.outlineOffset='';},1600);
    }catch(e){
      try{box.scrollIntoView({behavior:'smooth',block:'start'});}catch(_){}
    }
  };

  if(step){
    step.click();
    setTimeout(locate,140);
    setTimeout(locate,420);
    setTimeout(locate,800);
  }else{
    locate();
  }
  return true;
}

function addStyles(){
  if($('ppProfitAdvisorStyles'))return;
  const s=document.createElement('style');
  s.id='ppProfitAdvisorStyles';
  s.textContent=`
    .pp-profit-advisor{margin-top:14px;border:1px solid #315261;border-radius:16px;padding:14px;background:linear-gradient(180deg,#091a24,#07131b);box-shadow:0 14px 34px #0005;}
    .pp-advisor-header{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;}
    .pp-advisor-heading{display:flex;gap:10px;min-width:0;}
    .pp-profit-icon{width:34px;height:34px;flex:0 0 34px;border-radius:9px;background:linear-gradient(145deg,#ff9a3d,#ff7800);display:grid;place-items:center;color:#fff;font-weight:900;font-size:16px;box-shadow:0 8px 20px #ff780022;}
    .pp-advisor-heading h3{margin:0;font-size:16px;line-height:1.05;}
    .pp-advisor-heading p{margin:4px 0 0;color:#aebdca;font-size:10px;line-height:1.45;}
    .pp-advisor-alert{min-width:240px;max-width:330px;border:1px solid rgba(255,107,107,.55);border-radius:10px;padding:9px 11px;background:rgba(255,107,107,.08);}
    .pp-advisor-alert.good{border-color:rgba(54,229,139,.45);background:rgba(54,229,139,.07);}
    .pp-advisor-alert strong{display:block;font-size:11px;color:#ff8d8d;}
    .pp-advisor-alert.good strong{color:#64efaa;}
    .pp-advisor-alert span{display:block;margin-top:2px;color:#d6e0e5;font-size:9px;line-height:1.35;}
    .pp-advisor-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:11px 0;}
    .pp-advisor-stat{border:1px solid #294957;border-radius:9px;padding:8px;background:linear-gradient(180deg,#0b1e29,#091821);}
    .pp-advisor-stat span{display:block;color:#90a6b2;font-size:8.5px;}
    .pp-advisor-stat strong{display:block;margin-top:3px;font-size:15px;line-height:1.05;}
    .pp-advisor-stat strong.loss{color:#ff6b6b;}
    .pp-advisor-stat strong.profit{color:#36e58b;}
    .pp-advisor-stat strong.neutral{color:#f5f8fb;}
    .pp-advisor-main{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(250px,.8fr);gap:9px;align-items:start;}
    .pp-advisor-panel{border:1px solid #294957;border-radius:11px;background:linear-gradient(180deg,#0b1d28,#081620);padding:10px;}
    .pp-advisor-panel-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px;}
    .pp-advisor-panel-head h4{margin:0;font-size:12px;}
    .pp-advisor-reset{border:1px solid #3a5562;background:#0a1820;color:#d8e2e7;border-radius:7px;padding:5px 7px;font:800 8px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;}
    .pp-advisor-reset:hover{border-color:#ff7800;color:#ff9a42;}
    .pp-advisor-suggestion{border:1px solid #294957;border-radius:9px;padding:8px;margin-top:7px;background:rgba(255,255,255,.018);}
    .pp-advisor-suggestion:first-of-type{margin-top:0;}
    .pp-advisor-suggestion-head{display:flex;gap:8px;align-items:flex-start;}
    .pp-advisor-suggestion-icon{width:26px;height:26px;flex:0 0 26px;border:1px solid #3a5562;border-radius:7px;display:grid;place-items:center;font-size:12px;}
    .pp-advisor-suggestion-title{min-width:0;flex:1;}
    .pp-advisor-suggestion-title strong{display:block;font-size:10px;}
    .pp-advisor-suggestion-title small{display:block;margin-top:2px;color:#8ea4af;font-size:8px;line-height:1.35;}
    .pp-advisor-pill{display:inline-flex;align-items:center;padding:3px 5px;border-radius:99px;border:1px solid rgba(54,229,139,.45);color:#4be79a;background:rgba(54,229,139,.06);font-size:7px;font-weight:900;white-space:nowrap;}
    .pp-advisor-pill.med{border-color:rgba(255,193,7,.45);color:#ffd15d;background:rgba(255,193,7,.06);}
    .pp-advisor-control{display:grid;grid-template-columns:85px minmax(0,1fr) 85px 90px 70px;gap:6px;align-items:center;margin-top:8px;}
    .pp-advisor-control .mini{border:1px solid #294957;border-radius:7px;padding:6px 7px;background:#091821;}
    .pp-advisor-control .mini span{display:block;color:#7f95a1;font-size:7px;}
    .pp-advisor-control .mini strong{display:block;margin-top:2px;font-size:10px;}
    .pp-advisor-control output{font-size:10px;font-weight:900;text-align:right;}
    .pp-advisor-range{width:100%;accent-color:#ff7800;}
    .pp-advisor-change{font-size:9px;font-weight:900;text-align:right;}
    .pp-advisor-change.up{color:#36e58b;}
    .pp-advisor-change.down{color:#ff6b6b;}
    .pp-advisor-live{display:flex;flex-direction:column;min-height:100%;gap:7px;}
    .pp-advisor-live-top{display:flex;align-items:center;gap:8px;margin-bottom:1px;}
    .pp-advisor-live-top h4{margin:0;font-size:12px;}
    .pp-advisor-live-icon{color:#45d6ff;font-size:15px;}
    .pp-advisor-live-profit{border:1px solid #294957;border-radius:9px;padding:10px;background:linear-gradient(180deg,#0a1c26,#08161e);}
    .pp-advisor-live-profit span{display:block;color:#90a6b2;font-size:8px;}
    .pp-advisor-live-profit strong{display:block;margin-top:4px;font-size:27px;line-height:1;}
    .pp-advisor-live-profit strong.loss{color:#ff6b6b;}
    .pp-advisor-live-profit strong.profit{color:#36e58b;}
    .pp-advisor-live-profit strong.neutral{color:#f5f8fb;}
    .pp-advisor-live-profit p{margin:5px 0 0;color:#aebdca;font-size:9px;line-height:1.35;}
    .pp-advisor-live-box{border:1px solid rgba(54,229,139,.45);border-radius:9px;padding:9px;background:rgba(54,229,139,.06);}
    .pp-advisor-live-box.loss{border-color:rgba(255,107,107,.45);background:rgba(255,107,107,.05);}
    .pp-advisor-live-box strong{display:block;font-size:10px;color:#45e99a;}
    .pp-advisor-live-box.loss strong{color:#ff8d8d;}
    .pp-advisor-summary{border-top:1px solid rgba(127,160,175,.12);padding-top:7px;margin-top:2px;}
    .pp-advisor-summary-row{display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid rgba(127,160,175,.08);font-size:8.5px;}
    .pp-advisor-summary-row:last-child{border-bottom:0;}
    .pp-advisor-summary-row span:first-child{color:#91a6b1;}
    .pp-advisor-summary-row strong{font-size:8.8px;}
    .pp-advisor-apply{width:100%;border:1px solid #ff7800;border-radius:9px;padding:9px 10px;background:linear-gradient(135deg,#ff9a3d,#ff7800);color:#fff;font:900 10px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 22px #ff780022;margin-top:auto;}
    .pp-advisor-apply:hover{filter:brightness(1.06);}
    .pp-advisor-copy{width:100%;border:1px solid #294957;border-radius:9px;padding:8px 10px;background:#0a1820;color:#dce6eb;font:800 9px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;}
    .pp-advisor-copy:hover{border-color:#ff7800;color:#ff9a42;}
    .pp-advisor-help{border:1px solid #294957;border-radius:9px;padding:8px 9px;color:#91a6b1;font-size:8px;line-height:1.4;}
    .pp-advisor-help a{color:#dce6eb;text-decoration:none;font-weight:800;}
    .pp-advisor-tip{margin-top:8px;border:1px solid #3b2b68;border-radius:9px;padding:8px 10px;background:rgba(106,76,180,.07);color:#b8afd4;font-size:8.5px;line-height:1.4;}
    .pp-advisor-tip b{color:#d7c9ff;}
    @media(max-width:980px){
      .pp-advisor-header{flex-direction:column;}
      .pp-advisor-alert{width:100%;max-width:none;}
      .pp-advisor-stat-grid{grid-template-columns:1fr 1fr;}
      .pp-advisor-main{grid-template-columns:1fr;}
      .pp-advisor-control{grid-template-columns:72px minmax(0,1fr) 72px 78px 62px;}
    }
    @media(max-width:650px){
      .pp-profit-advisor{padding:10px;}
      .pp-advisor-stat-grid{grid-template-columns:1fr 1fr;}
      .pp-advisor-control{grid-template-columns:1fr 1fr;gap:6px;}
      .pp-advisor-control .pp-advisor-range-wrap{grid-column:1 / -1;}
      .pp-advisor-control output,.pp-advisor-change{text-align:left;}
    }
    body[data-pp-theme="light"] .pp-profit-advisor{background:linear-gradient(180deg,#fff,#edf3f6)!important;border-color:#b8c9d1!important;color:#17232b!important;}
    body[data-pp-theme="light"] .pp-advisor-alert{background:rgba(220,65,65,.06);border-color:#e0a4a4!important;}
    body[data-pp-theme="light"] .pp-advisor-stat,body[data-pp-theme="light"] .pp-advisor-panel,body[data-pp-theme="light"] .pp-advisor-suggestion,body[data-pp-theme="light"] .pp-advisor-stat .mini,body[data-pp-theme="light"] .pp-advisor-live-profit,body[data-pp-theme="light"] .pp-advisor-help,body[data-pp-theme="light"] .pp-advisor-copy{background:#f6f9fa!important;border-color:#c5d2d8!important;}
    body[data-pp-theme="light"] .pp-advisor-heading p,body[data-pp-theme="light"] .pp-advisor-alert span,body[data-pp-theme="light"] .pp-advisor-stat span,body[data-pp-theme="light"] .pp-advisor-suggestion-title small,body[data-pp-theme="light"] .pp-advisor-control .mini span,body[data-pp-theme="light"] .pp-advisor-live-profit span,body[data-pp-theme="light"] .pp-advisor-live-profit p,body[data-pp-theme="light"] .pp-advisor-summary-row span:first-child,body[data-pp-theme="light"] .pp-advisor-help{color:#5d707b!important;}
  `;
  document.head.appendChild(s);
}

function buildItem(icon,titleKey,body,actionId){
  const item=document.createElement('div');
  item.className='pp-profit-item';
  item.innerHTML='<div class="pp-profit-item-icon">'+icon+'</div><div class="pp-profit-item-main"><strong>'+titleKey+'</strong><p>'+body+'</p>'+(actionId?'<button type="button" class="pp-profit-review" data-pp-review-target="'+actionId+'">'+t('review')+'</button>':'')+'</div>';
  return item;
}

let advisorScenario=null;

function advisorProfitState(v){
  return v>0?'profit':v<0?'loss':'neutral';
}

function advisorDefaults(s,batchView){
  const cheapest=cheapestDelivery();
  const deliveryTarget=(s.delivery>0&&cheapest&&cheapest.price<s.delivery)?cheapest.price:s.delivery;
  const sell=s.sell;
  const target=s.target30??sell;
  const suggestedSell=sell>0
    ?Math.max(sell,Math.min(target>sell?target:sell*1.25,sell*1.25))
    :Math.max(0,target||0);
  return {
    materialUsage: s.materialCost>0?15:0,
    labourMinutes: s.labour>0?Math.min(5,Math.max(0,num('labourHours')*60)):0,
    deliveryCost: deliveryTarget,
    sellingPrice: suggestedSell,
    materialCost: s.materialCost>0?s.materialCost*0.85:0
  };
}

function advisorScenarioValues(s){
  if(!advisorScenario)advisorScenario=advisorDefaults(s);
  const maxLabour=Math.max(0,num('labourHours')*60);
  advisorScenario.materialUsage=Math.min(80,Math.max(0,Number(advisorScenario.materialUsage)||0));
  advisorScenario.labourMinutes=Math.min(maxLabour,Math.max(0,Number(advisorScenario.labourMinutes)||0));
  advisorScenario.deliveryCost=Math.min(s.delivery,Math.max(0,Number.isFinite(Number(advisorScenario.deliveryCost))?Number(advisorScenario.deliveryCost):s.delivery));
  const maxSell=Math.max(s.sell*2,s.target30||0,1);
  advisorScenario.sellingPrice=Math.min(maxSell,Math.max(0,Number(advisorScenario.sellingPrice)||0));
  advisorScenario.materialCost=Math.min(s.materialCost,Math.max(0,Number.isFinite(Number(advisorScenario.materialCost))?Number(advisorScenario.materialCost):s.materialCost));
  return advisorScenario;
}

function calculateAdvisorScenario(s,sc,batchView){
  const materialUsageFactor=1-Math.min(80,Math.max(0,sc.materialUsage))/100;
  const baseMaterial=s.materialCost*materialUsageFactor;
  const cheaperFactor=s.materialCost>0?sc.materialCost/s.materialCost:1;
  const material=baseMaterial*cheaperFactor;
  const labourRate=num('labourRate');
  const labour=Math.max(0,s.labour-labourRate*(sc.labourMinutes/60));
  const delivery=Math.max(0,Math.min(s.delivery,sc.deliveryCost));
  const base=s.elec+s.depreciation+labour+s.packagingOther+delivery+material;
  const feeRate=s.feeRate;
  const fixed=num('fixedFee');
  const sell=Math.max(0,sc.sellingPrice);
  const feesSingle=sell*feeRate+fixed;
  const singleProfit=sell+s.deliveryCharge-base-feesSingle;
  const qty=s.qty;
  const itemSales=sell*qty*(1-s.disc);
  const batchCost=(base-delivery)*qty+delivery;
  const batchFees=itemSales*feeRate+fixed;
  const batchProfit=itemSales+s.deliveryCharge-batchCost-batchFees;
  const profit=batchView?batchProfit:singleProfit;
  const currentProfit=batchView?s.batchProfit:s.profit;
  return {material,labour,delivery,base,sell,feesSingle,singleProfit,batchProfit,profit,currentProfit,delta:profit-currentProfit,batchView};
}

function formatChange(v){
  const sign=v>0?'+ ':v<0?'- ':'';
  return sign+money(Math.abs(v));
}

function applyAdvisorScenario(s,sc){
  const usage=$('materialUsed');
  const packCost=$('materialPackCost');
  const labourHours=$('labourHours');
  const delivery=$('delivery');
  const sell=$('sell');
  const changed=[];
  if(usage&&s.materialUsed>0&&s.materialPack>0){
    const factor=1-Math.min(80,Math.max(0,sc.materialUsage))/100;
    usage.value=(s.materialUsed*factor).toFixed(2);
    changed.push(usage);
  }
  if(packCost&&s.materialCost>0&&s.materialPackCost>0){
    const usageFactor=1-Math.min(80,Math.max(0,sc.materialUsage))/100;
    const effectiveFactor=(sc.materialCost/s.materialCost);
    const totalFactor=Math.max(0,Math.min(1,usageFactor*effectiveFactor));
    packCost.value=(s.materialPackCost*totalFactor).toFixed(2);
    changed.push(packCost);
  }
  if(labourHours){
    const hours=Math.max(0,num('labourHours')-Math.min(num('labourHours'),Math.max(0,sc.labourMinutes)/60));
    labourHours.value=hours.toFixed(2);
    changed.push(labourHours);
  }
  if(delivery){
    delivery.value=Math.max(0,Math.min(s.delivery,sc.deliveryCost)).toFixed(2);
    changed.push(delivery);
  }
  if(sell){
    sell.value=Math.max(0,sc.sellingPrice).toFixed(2);
    changed.push(sell);
  }
  changed.forEach(el=>{
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  });
  setTimeout(()=>{try{$('calc')?.click();}catch(e){}},20);
}

function copyAdvisorSummary(s,sc,scenario){
  const textLines=[
    'PrintProfit Profit Advisor',
    'Current profit: '+money(scenario.currentProfit),
    'Projected profit: '+money(scenario.profit),
    'Profit change: '+formatChange(scenario.delta),
    'Material usage reduction: '+sc.materialUsage.toFixed(0)+'%',
    'Labour minutes saved: '+sc.labourMinutes.toFixed(0)+' min',
    'Delivery cost: '+money(scenario.delivery)+'',
    'Selling price: '+money(scenario.sell),
    'Material cost: '+money(scenario.material)
  ];
  const value=textLines.join('\\n');
  const done=()=>{
    const btn=$('ppAdvisorCopy');
    if(btn){const old=btn.textContent;btn.textContent='Copied ✓';setTimeout(()=>btn.textContent=old,1100);}
  };
  try{
    if(navigator.clipboard?.writeText){navigator.clipboard.writeText(value).then(done).catch(()=>fallback());return;}
  }catch(e){}
  fallback();
  function fallback(){
    const ta=document.createElement('textarea');ta.value=value;document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');}catch(e){}
    ta.remove();done();
  }
}

function neutralAdvisorScenario(s){
  return {
    materialUsage:0,
    labourMinutes:0,
    deliveryCost:s.delivery,
    sellingPrice:s.sell,
    materialCost:s.materialCost
  };
}

function rowScenarioFor(s,sc,key){
  const base=neutralAdvisorScenario(s);
  base[key]=sc[key];
  return base;
}

const ADVISOR_KEYS=[
  'materialUsage','labourMinutes','deliveryCost','sellingPrice','materialCost'
];

function suggestionRow(cfg,s,sc,batchView){
  const row=document.createElement('article');
  row.className='pp-advisor-suggestion';
  row.dataset.advisorKey=cfg.key;
  const value=cfg.get();
  const max=cfg.max();
  const projected=calculateAdvisorScenario(s,rowScenarioFor(s,sc,cfg.key),batchView).profit;
  const change=projected-(batchView?s.batchProfit:s.profit);
  const badgeClass=cfg.impact==='med'?'pp-advisor-pill med':'pp-advisor-pill';
  row.innerHTML=
    '<div class="pp-advisor-suggestion-head">'+
      '<div class="pp-advisor-suggestion-icon">'+cfg.icon+'</div>'+
      '<div class="pp-advisor-suggestion-title"><strong>'+cfg.title+'</strong><small>'+cfg.description+'</small></div>'+
      '<span class="'+badgeClass+'">'+cfg.impactLabel+'</span>'+
    '</div>'+
    '<div class="pp-advisor-control">'+
      '<div class="mini"><span>Current</span><strong>'+cfg.currentText(s)+'</strong></div>'+
      '<div class="pp-advisor-range-wrap"><input class="pp-advisor-range" id="'+cfg.id+'" type="range" min="'+cfg.min()+'" max="'+max+'" step="'+cfg.step+'" value="'+value+'"></div>'+
      '<div class="mini"><span>Suggested</span><strong id="'+cfg.suggestedId+'">'+cfg.suggestedText(value,s)+'</strong></div>'+
      '<div class="mini"><span>New profit</span><strong class="'+advisorProfitState(projected)+'" id="'+cfg.profitId+'">'+money(projected)+'</strong></div>'+
      '<div class="pp-advisor-change '+(change>=0?'up':'down')+'" id="'+cfg.changeId+'">'+(change>=0?'↑ ':'↓ ')+money(Math.abs(change))+'</div>'+
    '</div>';
  return row;
}

function refreshAdvisorScenario(s,batchView){
  const sc=advisorScenarioValues(s);
  const live=calculateAdvisorScenario(s,sc,batchView);
  const shownProfit=batchView?s.batchProfit:s.profit;
  const set=(id,text)=>{const el=$(id);if(el)el.textContent=text;};
  const setProfit=(id,value)=>{
    const el=$(id);if(!el)return;
    el.className=advisorProfitState(value);
    el.textContent=money(value);
  };
  setProfit('ppAdvisorLiveProfit',live.profit);
  set('ppAdvisorLiveText',(live.delta>=0?money(live.delta)+' improvement':'Change of '+money(Math.abs(live.delta))+' from current')+' from your current setup.');
  const status=$('ppAdvisorLiveStatus');
  if(status)status.textContent=live.profit>0?'✓ Profitable!':live.profit<0?'⚠ Still losing money':'• Break-even';
  const detail=$('ppAdvisorLiveDetail');
  if(detail)detail.textContent=live.profit>0?'With these changes the estimate moves into profit.':'Keep adjusting the suggestions to see where the loss closes.';
  const liveBox=document.querySelector('#ppProfitAdvisor .pp-advisor-live-box');
  if(liveBox)liveBox.classList.toggle('loss',live.profit<0);

  const summary={
    materialUsage:'No change',
    labourMinutes:sc.labourMinutes.toFixed(0)+' min',
    deliveryCost:money(live.delivery),
    sellingPrice:money(live.sell),
    materialCost:money(live.material)
  };
  document.querySelectorAll('#ppProfitAdvisor .pp-advisor-summary-row').forEach(row=>{
    const key=row.dataset.summaryKey;
    const valueEl=row.querySelector('strong');
    if(valueEl&&summary[key]!==undefined)valueEl.textContent=summary[key];
  });
  const usageSummary=document.querySelector('#ppProfitAdvisor .pp-advisor-summary-row[data-summary-key="materialUsage"] strong');
  if(usageSummary)usageSummary.textContent=sc.materialUsage>0?'-'+sc.materialUsage.toFixed(0)+'%':'No change';

  const configs={
    materialUsage:{key:'materialUsage',id:'ppAdvisorMaterialUsage',suggestedId:'ppAdvisorMaterialUsageSuggested',profitId:'ppAdvisorMaterialUsageProfit',changeId:'ppAdvisorMaterialUsageChange'},
    labourMinutes:{key:'labourMinutes',id:'ppAdvisorLabour',suggestedId:'ppAdvisorLabourSuggested',profitId:'ppAdvisorLabourProfit',changeId:'ppAdvisorLabourChange'},
    deliveryCost:{key:'deliveryCost',id:'ppAdvisorDelivery',suggestedId:'ppAdvisorDeliverySuggested',profitId:'ppAdvisorDeliveryProfit',changeId:'ppAdvisorDeliveryChange'},
    sellingPrice:{key:'sellingPrice',id:'ppAdvisorSell',suggestedId:'ppAdvisorSellSuggested',profitId:'ppAdvisorSellProfit',changeId:'ppAdvisorSellChange'},
    materialCost:{key:'materialCost',id:'ppAdvisorMaterialCost',suggestedId:'ppAdvisorMaterialCostSuggested',profitId:'ppAdvisorMaterialCostProfit',changeId:'ppAdvisorMaterialCostChange'}
  };
  Object.entries(configs).forEach(([key,ids])=>{
    const input=$(ids.id); if(!input)return;
    const v=Number(input.value)||0;
    const projected=calculateAdvisorScenario(s,{...neutralAdvisorScenario(s),[key]:v},batchView).profit;
    const change=projected-shownProfit;
    set(ids.suggestedId,
      key==='materialUsage'?v.toFixed(0)+'%':
      key==='labourMinutes'?v.toFixed(0)+' min':
      key==='deliveryCost'||key==='sellingPrice'||key==='materialCost'?money(v):String(v)
    );
    setProfit(ids.profitId,projected);
    const ch=$(ids.changeId);
    if(ch){
      ch.className='pp-advisor-change '+(change>=0?'up':'down');
      ch.textContent=(change>=0?'↑ ':'↓ ')+money(Math.abs(change));
    }
  });
  return live;
}

function render(){
  const result=document.querySelector('.result');
  if(!result)return false;
  addStyles();

  let box=$('ppProfitAdvisor');
  if(!box){
    box=document.createElement('section');
    box.id='ppProfitAdvisor';
    box.className='pp-profit-advisor';
    result.appendChild(box);
  }

  const s=snapshot();
  const batchView=$('batchResultView')&&!$('batchResultView').hidden;
  const shownProfit=batchView?s.batchProfit:s.profit;
  const hasData=(s.base>0||s.sell>0||s.deliveryCharge>0);
  const sc=advisorScenarioValues(s);
  const scenario=calculateAdvisorScenario(s,sc,batchView);

  const lead=shownProfit<0
    ? t('negativeLead',{amount:money(Math.abs(shownProfit))})
    : shownProfit>0
      ? t('positiveLead')
      : t('noData');

  box.innerHTML='';
  const header=document.createElement('div');
  header.className='pp-advisor-header';
  const alertClass=shownProfit>0?'good':'';
  const alertTitle=shownProfit<0?'Currently at a loss':shownProfit>0?'Currently profitable':'Add your print costs';
  const alertText=shownProfit<0?'You\'re losing '+money(Math.abs(shownProfit))+' per '+(batchView?'batch item':'print')+'.':'Use the sliders below to test changes in real time before applying them.';
  header.innerHTML=
    '<div class="pp-advisor-heading"><div class="pp-profit-icon">💡</div><div><h3>'+t('title')+'</h3><p>'+lead+'</p></div></div>'+
    '<div class="pp-advisor-alert '+alertClass+'"><strong>'+alertTitle+'</strong><span>'+alertText+'</span></div>';
  box.appendChild(header);

  if(!hasData)return true;

  const be=batchView?s.batchBreakEven:s.breakEven;
  const t30=batchView?s.batchTarget30:s.target30;
  const statGrid=document.createElement('div');
  statGrid.className='pp-advisor-stat-grid';
  statGrid.innerHTML=
    '<div class="pp-advisor-stat"><span>Current profit</span><strong class="'+advisorProfitState(shownProfit)+'">'+money(shownProfit)+'</strong><span style="margin-top:3px">Per '+(batchView?'batch':'print')+'</span></div>'+
    '<div class="pp-advisor-stat"><span>'+t('breakEven')+'</span><strong class="neutral">'+(be===null?'—':money(be))+'</strong><span style="margin-top:3px">Minimum price to not lose money</span></div>'+
    '<div class="pp-advisor-stat"><span>'+t('target')+'</span><strong class="neutral">'+(t30===null?'—':money(t30))+'</strong><span style="margin-top:3px">Using current fee assumptions</span></div>'+
    '<div class="pp-advisor-stat"><span>Sales price</span><strong class="neutral">'+money(s.sell)+'</strong><span style="margin-top:3px">Change below to test it</span></div>';
  box.appendChild(statGrid);

  const main=document.createElement('div');
  main.className='pp-advisor-main';

  const left=document.createElement('div');
  left.className='pp-advisor-panel';
  const leftHead=document.createElement('div');
  leftHead.className='pp-advisor-panel-head';
  leftHead.innerHTML='<h4>Suggested Improvements</h4><button type="button" class="pp-advisor-reset" id="ppAdvisorReset">↻ Reset all suggestions</button>';
  left.appendChild(leftHead);

  const maxLabour=Math.max(0,num('labourHours')*60);
  const maxSell=Math.max(s.sell*2,s.target30||0,1);
  const cheapest=cheapestDelivery();
  const deliverySuggested=cheapest&&cheapest.price<s.delivery?cheapest.price:s.delivery;
  const configs=[
    {key:'materialUsage',id:'ppAdvisorMaterialUsage',suggestedId:'ppAdvisorMaterialUsageSuggested',profitId:'ppAdvisorMaterialUsageProfit',changeId:'ppAdvisorMaterialUsageChange',icon:'⬡',title:'Reduce material usage',description:'Lowering infill, wall count or supports can reduce material usage. Test the effect here first.',impact:'high',impactLabel:'High impact',min:()=>0,max:()=>50,step:1,get:()=>sc.materialUsage,currentText:()=>s.materialCost>0?money(s.materialCost):'—',suggestedText:v=>v.toFixed(0)+'%',materialUsage:true},
    {key:'labourMinutes',id:'ppAdvisorLabour',suggestedId:'ppAdvisorLabourSuggested',profitId:'ppAdvisorLabourProfit',changeId:'ppAdvisorLabourChange',icon:'◷',title:'Reduce labour time',description:'Test removing setup, cleanup or other hands-on time from each print.',impact:'med',impactLabel:'Medium impact',min:()=>0,max:()=>Math.max(0,maxLabour),step:1,get:()=>sc.labourMinutes,currentText:()=>maxLabour.toFixed(0)+' min',suggestedText:v=>v.toFixed(0)+' min'},
    {key:'deliveryCost',id:'ppAdvisorDelivery',suggestedId:'ppAdvisorDeliverySuggested',profitId:'ppAdvisorDeliveryProfit',changeId:'ppAdvisorDeliveryChange',icon:'▱',title:'Lower delivery cost',description:deliverySuggested<s.delivery?'Compare the lower reference rate below with what you currently pay.':'Your current delivery is already at or below the lowest tracked reference.',impact:'med',impactLabel:'Medium impact',min:()=>0,max:()=>Math.max(0,s.delivery),step:.01,get:()=>sc.deliveryCost,currentText:()=>money(s.delivery),suggestedText:v=>money(v)},
    {key:'sellingPrice',id:'ppAdvisorSell',suggestedId:'ppAdvisorSellSuggested',profitId:'ppAdvisorSellProfit',changeId:'ppAdvisorSellChange',icon:'◇',title:'Adjust selling price',description:'A small price change can make a big difference once fees are included.',impact:'high',impactLabel:'High impact',min:()=>Math.max(0,s.sell),max:()=>maxSell,step:.01,get:()=>sc.sellingPrice,currentText:()=>money(s.sell),suggestedText:v=>money(v)},
    {key:'materialCost',id:'ppAdvisorMaterialCost',suggestedId:'ppAdvisorMaterialCostSuggested',profitId:'ppAdvisorMaterialCostProfit',changeId:'ppAdvisorMaterialCostChange',icon:'◈',title:'Use cheaper material',description:s.materialCost>0?'Test a lower material cost per print while keeping the same print settings.':'Add a material cost first and this option will become active.',impact:'med',impactLabel:'Lower impact',min:()=>0,max:()=>Math.max(0,s.materialCost),step:.01,get:()=>sc.materialCost,currentText:()=>money(s.materialCost),suggestedText:v=>money(v)}
  ];

  configs.forEach(cfg=>{
    const row=suggestionRow(cfg,s,sc,batchView);
    left.appendChild(row);
  });

  const right=document.createElement('div');
  right.className='pp-advisor-panel pp-advisor-live';
  right.innerHTML=
    '<div class="pp-advisor-live-top"><span class="pp-advisor-live-icon">▥</span><h4>Live Result</h4></div>'+
    '<div class="pp-advisor-live-profit"><span>Estimated '+(batchView?'batch':'profit')+'</span><strong class="'+advisorProfitState(scenario.profit)+'" id="ppAdvisorLiveProfit">'+money(scenario.profit)+'</strong><p id="ppAdvisorLiveText">'+(scenario.delta>=0?money(scenario.delta)+' improvement':'Change of '+money(Math.abs(scenario.delta))+' from current')+' from your current setup.</p></div>'+
    '<div class="pp-advisor-live-box '+(scenario.profit<0?'loss':'')+'"><strong id="ppAdvisorLiveStatus">'+(scenario.profit>0?'✓ Profitable!':scenario.profit<0?'⚠ Still losing money':'• Break-even')+'</strong><span id="ppAdvisorLiveDetail" style="display:block;margin-top:3px;color:#b8c8cf;font-size:8px">'+(scenario.profit>0?'With these changes the estimate moves into profit.':'Keep adjusting the suggestions to see where the loss closes.')+'</span></div>'+
    '<div class="pp-advisor-summary"><div class="pp-advisor-summary-row" data-summary-key="materialUsage"><span>Material usage</span><strong>'+(sc.materialUsage>0?'-'+sc.materialUsage.toFixed(0)+'%':'No change')+'</strong></div><div class="pp-advisor-summary-row" data-summary-key="labourMinutes"><span>Labour saved</span><strong>'+sc.labourMinutes.toFixed(0)+' min</strong></div><div class="pp-advisor-summary-row" data-summary-key="deliveryCost"><span>Delivery</span><strong>'+money(scenario.delivery)+'</strong></div><div class="pp-advisor-summary-row" data-summary-key="sellingPrice"><span>Selling price</span><strong>'+money(scenario.sell)+'</strong></div><div class="pp-advisor-summary-row" data-summary-key="materialCost"><span>Material cost</span><strong>'+money(scenario.material)+'</strong></div></div>'+
    '<button type="button" class="pp-advisor-apply" id="ppAdvisorApply">✓ Apply these changes to calculator</button>'+
    '<button type="button" class="pp-advisor-copy" id="ppAdvisorCopy">▣ Copy summary</button>'+
    '<div class="pp-advisor-help">Still not profitable? <a href="./guide.html" target="_top">See the full 3D Printing Profit Guide ↗</a></div>';
  main.appendChild(left);
  main.appendChild(right);
  box.appendChild(main);

  const tip=document.createElement('div');
  tip.className='pp-advisor-tip';
  tip.innerHTML='<b>Tip:</b> These suggestions are estimates based on your current settings. Adjust any value and the result updates in real time. The best balance depends on the quality and strength your model needs.';
  box.appendChild(tip);

  const bindScenarioInput=(id,key)=>{
    const el=$(id);
    if(!el)return;
    const refresh=()=>{
      advisorScenario[key]=Number(el.value)||0;
      refreshAdvisorScenario(snapshot(),batchView);
    };
    el.addEventListener('input',refresh);
    el.addEventListener('change',refresh);
  };
  bindScenarioInput('ppAdvisorMaterialUsage','materialUsage');
  bindScenarioInput('ppAdvisorLabour','labourMinutes');
  bindScenarioInput('ppAdvisorDelivery','deliveryCost');
  bindScenarioInput('ppAdvisorSell','sellingPrice');
  bindScenarioInput('ppAdvisorMaterialCost','materialCost');

  $('ppAdvisorReset')?.addEventListener('click',()=>{
    advisorScenario=advisorDefaults(s,batchView);
    ['ppAdvisorMaterialUsage','ppAdvisorLabour','ppAdvisorDelivery','ppAdvisorSell','ppAdvisorMaterialCost'].forEach(id=>{const el=$(id);if(el)el.value=advisorScenario[{ppAdvisorMaterialUsage:'materialUsage',ppAdvisorLabour:'labourMinutes',ppAdvisorDelivery:'deliveryCost',ppAdvisorSell:'sellingPrice',ppAdvisorMaterialCost:'materialCost'}[id]]??0;});
    refreshAdvisorScenario(s,batchView);
  });
  $('ppAdvisorApply')?.addEventListener('click',()=>{
    applyAdvisorScenario(s,advisorScenario);
  });
  $('ppAdvisorCopy')?.addEventListener('click',()=>{
    copyAdvisorSummary(s,advisorScenario,calculateAdvisorScenario(s,advisorScenario,batchView));
  });
  return true;
}

function boot(){
  const start=Date.now();
  const timer=setInterval(()=>{
    if(render()||Date.now()-start>10000)clearInterval(timer);
  },120);
  if(document.readyState!=='loading')render(); else document.addEventListener('DOMContentLoaded',render,{once:true});
}

document.addEventListener('click',e=>{
  const button=e.target&&e.target.closest?e.target.closest('.pp-profit-review[data-pp-review-target]'):null;
  if(!button)return;
  e.preventDefault();
  e.stopPropagation();
  goToReviewTarget(button.getAttribute('data-pp-review-target'));
});
let renderTimer=null;
function scheduleRender(delay=120,resetScenario=false){
  clearTimeout(renderTimer);
  renderTimer=setTimeout(()=>{
    renderTimer=null;
    if(resetScenario)advisorScenario=null;
    render();
  },delay);
}
const handleCalculatorEdit=e=>{
  if(e.target&&e.target.closest?.('#ppProfitAdvisor'))return;
  if(e.target&&e.target.matches('input,select,textarea'))scheduleRender(120,true);
};
document.addEventListener('input',handleCalculatorEdit);
document.addEventListener('change',handleCalculatorEdit);
document.querySelectorAll('#resultTabs .tab').forEach(b=>b.addEventListener('click',()=>scheduleRender(20)));
window.addEventListener('storage',()=>scheduleRender(20));
document.addEventListener('printprofit-settings-changed',()=>scheduleRender(30));
boot();

})();