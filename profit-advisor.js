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
    /* Step 4: normal Results and the full Profit Advisor live side-by-side. */
    .result#about.pp-advisor-results-split{
      width:100%!important;
      display:grid!important;
      grid-template-columns:minmax(0,1fr) minmax(470px,1fr)!important;
      gap:12px!important;
      align-items:start!important;
    }
    .result#about.pp-advisor-results-split>.head,
    .result#about.pp-advisor-results-split>.tabs{
      grid-column:1 / -1!important;
    }
    .result#about.pp-advisor-results-split>.resultView{
      grid-column:1!important;
      grid-row:3!important;
      min-width:0!important;
      margin:0!important;
    }
    .result#about.pp-advisor-results-split>#ppProfitAdvisor{
      grid-column:2!important;
      grid-row:3!important;
      min-width:0!important;
      margin:0!important;
    }
    .pp-profit-advisor{
      border:1px solid #315261;
      border-radius:14px;
      padding:12px;
      background:linear-gradient(180deg,#091a24,#07131b);
      box-shadow:0 12px 28px #0005;
    }
    .pp-advisor-header{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:10px;
      margin-bottom:9px;
    }
    .pp-advisor-heading{
      display:flex;
      gap:8px;
      align-items:flex-start;
      min-width:0;
    }
    .pp-profit-icon{
      width:34px;height:34px;flex:0 0 34px;border-radius:9px;
      background:linear-gradient(145deg,#ff9a3d,#ff7800);
      display:grid;place-items:center;color:#fff;font-weight:900;font-size:16px;
    }
    .pp-advisor-heading h3{margin:0;font-size:16px;line-height:1.05}
    .pp-advisor-heading p{margin:4px 0 0;color:#aebdca;font-size:9px;line-height:1.4}
    .pp-advisor-alert{
      min-width:170px;max-width:230px;
      border:1px solid rgba(255,107,107,.55);
      border-radius:9px;padding:7px 9px;
      background:rgba(255,107,107,.07);
    }
    .pp-advisor-alert.good{border-color:rgba(54,229,139,.45);background:rgba(54,229,139,.06)}
    .pp-advisor-alert strong{display:block;font-size:9px;color:#ff8d8d}
    .pp-advisor-alert.good strong{color:#64efaa}
    .pp-advisor-alert span{display:block;margin-top:2px;color:#d6e0e5;font-size:7.5px;line-height:1.35}
    .pp-advisor-stat-grid{
      display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:9px 0
    }
    .pp-advisor-stat{
      border:1px solid #294957;border-radius:8px;padding:7px;background:#091821;min-width:0
    }
    .pp-advisor-stat span{display:block;color:#90a6b2;font-size:7px}
    .pp-advisor-stat strong{display:block;margin-top:3px;font-size:13px;line-height:1.05}
    .pp-advisor-stat strong.loss{color:#ff6b6b}
    .pp-advisor-stat strong.profit{color:#36e58b}
    .pp-advisor-stat strong.neutral{color:#f5f8fb}
    .pp-advisor-stat span:last-child{font-size:6.5px!important}
    .pp-advisor-main{display:block}
    .pp-advisor-panel{
      border:1px solid #294957;border-radius:10px;
      background:linear-gradient(180deg,#0b1d28,#081620);padding:9px
    }
    .pp-advisor-panel-head{
      display:flex;align-items:center;justify-content:space-between;
      gap:8px;margin-bottom:7px
    }
    .pp-advisor-panel-head h4{margin:0;font-size:11px}
    .pp-advisor-reset{
      border:1px solid #3a5562;background:#0a1820;color:#d8e2e7;
      border-radius:7px;padding:5px 7px;font:800 7px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer
    }
    .pp-advisor-reset:hover{border-color:#ff7800;color:#ff9a42}
    .pp-advisor-suggestions-grid{
      display:grid;grid-template-columns:1fr 1fr;gap:7px
    }
    .pp-advisor-suggestion{
      border:1px solid #294957;border-radius:9px;padding:8px;background:rgba(255,255,255,.018);
      display:flex;flex-direction:column;min-width:0
    }
    .pp-advisor-suggestion-head{display:flex;gap:7px;align-items:flex-start}
    .pp-advisor-suggestion-icon{
      width:26px;height:26px;flex:0 0 26px;border:1px solid #3a5562;border-radius:7px;
      display:grid;place-items:center;font-size:12px
    }
    .pp-advisor-suggestion-title{min-width:0;flex:1}
    .pp-advisor-suggestion-title strong{display:block;font-size:9px}
    .pp-advisor-suggestion-title small{display:block;margin-top:2px;color:#8ea4af;font-size:7px;line-height:1.35}
    .pp-advisor-pill{
      display:inline-flex;align-items:center;padding:3px 5px;border-radius:99px;
      border:1px solid rgba(54,229,139,.45);color:#4be79a;background:rgba(54,229,139,.05);
      font-size:6.5px;font-weight:900;white-space:nowrap
    }
    .pp-advisor-pill.med{border-color:rgba(255,193,7,.45);color:#ffd15d;background:rgba(255,193,7,.05)}
    .pp-advisor-control{
      display:grid;grid-template-columns:1fr 1fr;gap:5px;align-items:stretch;margin-top:7px
    }
    .pp-advisor-control .mini{
      border:1px solid #294957;border-radius:7px;padding:5px 6px;background:#091821
    }
    .pp-advisor-control .mini span{display:block;color:#7f95a1;font-size:6.5px}
    .pp-advisor-control .mini strong{display:block;margin-top:2px;font-size:8.5px}
    .pp-advisor-change{font-size:7.5px;font-weight:900;text-align:right;align-self:center}
    .pp-advisor-change.up{color:#36e58b}
    .pp-advisor-change.down{color:#ff6b6b}
    .pp-advisor-suggestion-apply{
      grid-column:1 / -1;width:100%;margin-top:5px;
      border:1px solid #ff7800;border-radius:8px;padding:7px 8px;
      background:linear-gradient(135deg,#ff9a3d,#ff7800);color:#fff;
      font:900 7.5px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer
    }
    .pp-advisor-suggestion-apply:hover{filter:brightness(1.06);transform:translateY(-1px)}
    .pp-advisor-suggestion-apply:disabled{opacity:.45;cursor:not-allowed;transform:none}
    .pp-advisor-live{
      margin-top:8px;
      border:1px solid #294957;border-radius:10px;
      background:linear-gradient(180deg,#0b1d28,#081620);padding:9px
    }
    .pp-advisor-live-top{display:flex;justify-content:space-between;align-items:center;gap:8px}
    .pp-advisor-live-top h4{margin:0;font-size:10px}
    .pp-advisor-live-top span{color:#45d6ff;font-size:12px}
    .pp-advisor-live-profit-row{
      display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:7px
    }
    .pp-advisor-live-stat{
      border:1px solid #294957;border-radius:7px;padding:6px;background:#091821;min-width:0
    }
    .pp-advisor-live-stat span{display:block;color:#7f95a1;font-size:6.5px}
    .pp-advisor-live-stat strong{display:block;margin-top:2px;font-size:10px}
    .pp-advisor-live-stat .loss{color:#ff6b6b}.pp-advisor-live-stat .profit{color:#36e58b}
    .pp-advisor-project{
      margin-top:7px;border:1px solid rgba(54,229,139,.42);
      border-radius:8px;padding:7px;background:rgba(54,229,139,.05)
    }
    .pp-advisor-project.loss{border-color:rgba(255,107,107,.42);background:rgba(255,107,107,.05)}
    .pp-advisor-project strong{font-size:8.5px;color:#64efaa}
    .pp-advisor-project.loss strong{color:#ff8d8d}
    .pp-advisor-project small{display:block;margin-top:2px;color:#aebdc5;font-size:6.8px}
    .pp-advisor-selected{
      margin-top:7px;border-top:1px solid #294957;padding-top:7px
    }
    .pp-advisor-selected-title{font-size:6.5px;color:#718c99;font-weight:900;letter-spacing:.14em;margin-bottom:4px}
    .pp-advisor-selected-row{
      display:grid;grid-template-columns:minmax(0,1fr) auto 12px auto;
      gap:4px;align-items:center;padding:4px 0;border-bottom:1px solid #29495733;font-size:7px
    }
    .pp-advisor-selected-row:last-child{border-bottom:0}
    .pp-advisor-selected-row span{color:#91a6b1}
    .pp-advisor-selected-row b{font-size:7.5px}
    .pp-advisor-selected-row i{font-style:normal;color:#55bfff}
    .pp-advisor-selected-row .after{color:#64efaa}
    .pp-advisor-empty{color:#748b96;font-size:7px;line-height:1.4}
    .pp-advisor-apply{
      width:100%;border:1px solid #36e58b;border-radius:8px;padding:8px 9px;
      background:linear-gradient(135deg,#23ce7a,#36e58b);color:#062016;
      font:900 8px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;margin-top:7px
    }
    .pp-advisor-apply:disabled{opacity:.45;cursor:not-allowed}
    .pp-advisor-tip{
      margin-top:7px;border:1px solid #3b2b68;border-radius:8px;padding:7px 8px;
      background:rgba(106,76,180,.06);color:#b8afd4;font-size:7px;line-height:1.4
    }
    .pp-advisor-tip b{color:#d7c9ff}
    .pp-advisor-suggestion.selected{border-color:#36e58b66;background:#36e58b08}
    @media(max-width:1100px){
      .result#about.pp-advisor-results-split{grid-template-columns:1fr!important}
      .result#about.pp-advisor-results-split>.resultView,
      .result#about.pp-advisor-results-split>#ppProfitAdvisor{grid-column:1!important;grid-row:auto!important}
    }
    @media(max-width:650px){
      .pp-advisor-stat-grid{grid-template-columns:1fr 1fr}
      .pp-advisor-suggestions-grid{grid-template-columns:1fr}
      .pp-advisor-live-profit-row{grid-template-columns:1fr 1fr}
      .pp-advisor-header{flex-direction:column}
      .pp-advisor-alert{width:100%;max-width:none}
    }
    body[data-pp-theme="light"] .pp-profit-advisor{background:linear-gradient(180deg,#fff,#edf3f6)!important;border-color:#b8c9d1!important}
    body[data-pp-theme="light"] .pp-advisor-panel,
    body[data-pp-theme="light"] .pp-advisor-live,
    body[data-pp-theme="light"] .pp-advisor-stat,
    body[data-pp-theme="light"] .pp-advisor-live-stat,
    body[data-pp-theme="light"] .pp-advisor-suggestion,
    body[data-pp-theme="light"] .pp-advisor-control .mini{background:#f6f9fa!important;border-color:#c5d2d8!important}
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
  const projected=calculateAdvisorScenario(s,rowScenarioFor(s,sc,cfg.key),batchView).profit;
  const change=projected-(batchView?s.batchProfit:s.profit);
  const badgeClass=cfg.impact==='med'?'pp-advisor-pill med':'pp-advisor-pill';
  const canApply=(()=>{
    if(cfg.key==='materialUsage')return s.used>0;
    if(cfg.key==='printTime')return s.hours>0;
    if(cfg.key==='materialCost')return s.materialCost>0;
    if(cfg.key==='deliveryCost')return s.delivery>0;
    if(cfg.key==='labourMinutes')return s.labourHours>0;
    if(cfg.key==='sellingPrice')return s.sell>0;
    return false;
  })();
  row.innerHTML=
    '<div class="pp-advisor-suggestion-head">'+
      '<div class="pp-advisor-suggestion-icon">'+cfg.icon+'</div>'+
      '<div class="pp-advisor-suggestion-title"><strong>'+cfg.title+'</strong><small>'+cfg.description+'</small></div>'+
      '<span class="'+badgeClass+'">'+cfg.impactLabel+'</span>'+
    '</div>'+
    '<div class="pp-advisor-control">'+
      '<div class="mini"><span>Current</span><strong>'+cfg.currentText(s)+'</strong></div>'+
      '<div class="mini"><span>Suggested</span><strong>'+cfg.suggestedText(cfg.get(),s)+'</strong></div>'+
      '<div class="mini"><span>New profit</span><strong class="'+advisorProfitState(projected)+'">'+money(projected)+'</strong></div>'+
      '<div class="pp-advisor-change '+(change>=0?'up':'down')+'">'+(change>=0?'↑ ':'↓ ')+money(Math.abs(change))+'</div>'+
      '<button type="button" class="pp-advisor-suggestion-apply" data-advisor-apply="'+cfg.key+'" '+(canApply?'':'disabled')+'>'+
        (canApply?'Apply suggestion →':'Add a value first')+
      '</button>'+
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

let selectedAdvisorSuggestions=new Set();

function advisorScenarioForKeys(s,keys){
  const sc={materialUsage:0,labourMinutes:0,deliveryCost:s.delivery,sellingPrice:s.sell,materialCost:s.materialCost};
  const set=new Set(keys);
  if(set.has('materialUsage'))sc.materialUsage=15;
  if(set.has('printTime'))sc.printTime=10;
  if(set.has('materialCost'))sc.materialCost=s.materialCost*.85;
  if(set.has('deliveryCost'))sc.deliveryCost=Math.max(0,s.delivery-.95);
  if(set.has('labourMinutes'))sc.labourMinutes=Math.max(0,s.labourHours*60-5);
  if(set.has('sellingPrice'))sc.sellingPrice=Math.max(s.sell*1.15,s.sell+2.5);
  return sc;
}

function advisorSuggestionDefinitions(s,batchView){
  const defs=[
    {key:'materialUsage',icon:'⬡',title:'Reduce material usage',desc:'Use less material where the model allows without compromising the strength or quality you need.',impact:'High impact',impactClass:'',can:s.used>0,current:()=>s.used.toFixed(0)+' g',suggested:()=>s.used>0?(s.used*.85).toFixed(0)+' g':'—'},
    {key:'printTime',icon:'◷',title:'Reduce print time',desc:'A shorter print can lower electricity and printer depreciation on longer jobs.',impact:'Medium impact',impactClass:'med',can:s.hours>0,current:()=>formatHours(s.hours),suggested:()=>formatHours(s.hours*.9)},
    {key:'materialCost',icon:'◈',title:'Use cheaper material',desc:'Test a lower suitable material cost while keeping the same print settings.',impact:'Lower impact',impactClass:'med',can:s.materialCost>0,current:()=>money(s.materialCost),suggested:()=>money(s.materialCost*.85)},
    {key:'deliveryCost',icon:'▱',title:'Lower delivery cost',desc:'Compare courier rates or reduce the delivery cost you absorb on the order.',impact:'Medium impact',impactClass:'med',can:s.delivery>0,current:()=>money(s.delivery),suggested:()=>money(Math.max(0,s.delivery-.95))},
    {key:'labourMinutes',icon:'◴',title:'Reduce labour time',desc:'Streamline setup, cleanup and other hands-on work where practical.',impact:'Medium impact',impactClass:'med',can:s.labourHours>0,current:()=>formatMinutes(s.labourHours*60),suggested:()=>formatMinutes(Math.max(0,s.labourHours*60-5))},
    {key:'sellingPrice',icon:'◇',title:'Adjust selling price',desc:'Test a higher selling price to see how much it changes profit after fees.',impact:'High impact',impactClass:'',can:s.sell>0,current:()=>money(s.sell),suggested:()=>money(Math.max(s.sell*1.15,s.sell+2.5))}
  ];
  return defs.map(d=>{
    const proposed=advisorScenarioForKeys(s,[d.key]);
    const result=calculateAdvisorScenario(s,proposed,batchView);
    const currentProfit=batchView?s.batchProfit:s.profit;
    return {...d,newProfit:result.profit,delta:result.profit-currentProfit};
  });
}

function commitAdvisorSuggestions(s,keys){
  if(!keys.length)return;
  const set=new Set(keys);
  const apply=(id,v)=>{
    const el=$(id);
    if(!el)return;
    el.value=String(v);
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  };
  if(set.has('materialUsage')&&s.used>0)apply('materialUsed',(s.used*.85).toFixed(2));
  if(set.has('printTime')&&s.hours>0){
    const h=s.hours*.9,whole=Math.floor(h),mins=Math.round((h-whole)*60);
    if($('ppPrintTimeHours')&&$('ppPrintTimeMinutes')){apply('ppPrintTimeHours',whole);apply('ppPrintTimeMinutes',mins);}
    else apply('printHours',h.toFixed(2));
  }
  if(set.has('materialCost')&&s.materialCost>0&&s.packPrice>0)apply('materialPackCost',(s.packPrice*.85).toFixed(2));
  if(set.has('deliveryCost')&&s.delivery>0)apply('delivery',Math.max(0,s.delivery-.95).toFixed(2));
  if(set.has('labourMinutes')&&s.labourHours>0)apply('labourHours',Math.max(0,s.labourHours-5/60).toFixed(2));
  if(set.has('sellingPrice')&&s.sell>0)apply('sell',Math.max(s.sell*1.15,s.sell+2.5).toFixed(2));
  selectedAdvisorSuggestions.clear();
  setTimeout(()=>{$('calc')?.click();},30);
}

function render(){
  const result=document.querySelector('.result');
  if(!result)return false;
  result.id='about';
  result.classList.add('pp-advisor-results-split');
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
  if(!hasData){
    selectedAdvisorSuggestions.clear();
    box.innerHTML='<div class="pp-advisor-heading"><div class="pp-profit-icon">💡</div><div><h3>Profit Advisor</h3><p>Add your print costs first and the Advisor will suggest practical ways to improve your result.</p></div></div>';
    return true;
  }

  const defs=advisorSuggestionDefinitions(s,batchView);
  selectedAdvisorSuggestions=new Set([...selectedAdvisorSuggestions].filter(k=>defs.some(d=>d.key===k&&d.can)));

  const keys=[...selectedAdvisorSuggestions];
  const sc=advisorScenarioForKeys(s,keys);
  const projected=calculateAdvisorScenario(s,sc,batchView);
  const delta=projected.profit-shownProfit;
  const currentMargin=batchView?s.batchMargin:s.margin;
  const projectedMargin=projected.profit && projected.sell ? projected.profit/projected.sell : 0;

  box.className='pp-profit-advisor';
  box.innerHTML=`
    <div class="pp-advisor-header">
      <div class="pp-advisor-heading">
        <div class="pp-profit-icon">💡</div>
        <div>
          <h3>Profit Advisor</h3>
          <p>Practical suggestions based on your current print, costs and selling price.</p>
        </div>
      </div>
      <div class="pp-advisor-alert ${shownProfit>0?'good':''}">
        <strong>${shownProfit<0?'Currently at a loss':shownProfit>0?'Currently profitable':'At break-even'}</strong>
        <span>${shownProfit<0?'You\'re losing '+money(Math.abs(shownProfit))+' per '+(batchView?'batch':'print')+'.':shownProfit>0?'Your current settings are profitable. Look for further improvements below.':'You\'re currently at break-even.'}</span>
      </div>
    </div>

    <div class="pp-advisor-stat-grid">
      <div class="pp-advisor-stat"><span>Current profit</span><strong class="${advisorProfitState(shownProfit)}">${money(shownProfit)}</strong><span style="margin-top:3px">Per ${batchView?'batch':'print'}</span></div>
      <div class="pp-advisor-stat"><span>Break-even price</span><strong class="neutral">${(batchView?s.batchBreakEven:s.breakEven)===null?'—':money(batchView?s.batchBreakEven:s.breakEven)}</strong><span style="margin-top:3px">Minimum selling price</span></div>
      <div class="pp-advisor-stat"><span>Target price · 30% margin</span><strong class="neutral">${(batchView?s.batchTarget30:s.target30)===null?'—':money(batchView?s.batchTarget30:s.target30)}</strong><span style="margin-top:3px">Current fee assumptions</span></div>
      <div class="pp-advisor-stat"><span>Selling price</span><strong class="neutral">${money(s.sell)}</strong><span style="margin-top:3px">Current price</span></div>
    </div>

    <div class="pp-advisor-main">
      <div class="pp-advisor-panel">
        <div class="pp-advisor-panel-head">
          <h4>Suggested Improvements</h4>
          <button type="button" class="pp-advisor-reset" id="ppAdvisorReset" ${keys.length?'':'disabled'}>↻ Reset all suggestions</button>
        </div>
        <div class="pp-advisor-suggestions-grid">
          ${defs.map(d=>`
            <article class="pp-advisor-suggestion ${selectedAdvisorSuggestions.has(d.key)?'selected':''}">
              <div class="pp-advisor-suggestion-head">
                <div class="pp-advisor-suggestion-icon">${d.icon}</div>
                <div class="pp-advisor-suggestion-title">
                  <strong>${d.title}</strong>
                  <small>${d.desc}</small>
                </div>
                <span class="pp-advisor-pill ${d.impactClass}">${d.impact}</span>
              </div>
              <div class="pp-advisor-control">
                <div class="mini"><span>Current</span><strong>${d.current()}</strong></div>
                <div class="mini"><span>Suggested</span><strong>${d.suggested()}</strong></div>
                <div class="mini"><span>Potential profit</span><strong class="${advisorProfitState(d.newProfit)}">${money(d.newProfit)}</strong></div>
                <div class="pp-advisor-change ${d.delta>=0?'up':'down'}">${d.delta>=0?'↑':'↓'} ${money(Math.abs(d.delta))}</div>
                <button type="button" class="pp-advisor-suggestion-apply" data-advisor-apply="${d.key}" ${d.can?'':'disabled'}>${d.can?(selectedAdvisorSuggestions.has(d.key)?'✓ Selected for preview':'Apply suggestion →'):'Add a value first'}</button>
              </div>
            </article>
          `).join('')}
        </div>
      </div>

      <div class="pp-advisor-live">
        <div class="pp-advisor-live-top"><h4>Projected Results</h4><span>▥</span></div>
        <div class="pp-advisor-live-profit-row">
          <div class="pp-advisor-live-stat"><span>Current profit</span><strong class="${advisorProfitState(shownProfit)}">${money(shownProfit)}</strong></div>
          <div class="pp-advisor-live-stat"><span>New profit</span><strong class="${advisorProfitState(projected.profit)}">${money(projected.profit)}</strong></div>
          <div class="pp-advisor-live-stat"><span>New margin</span><strong class="${projectedMargin>0?'profit':projectedMargin<0?'loss':''}">${(projectedMargin*100).toFixed(1)}%</strong></div>
          <div class="pp-advisor-live-stat"><span>Cost to make</span><strong>${money(projected.base)}</strong></div>
        </div>
        <div class="pp-advisor-project ${projected.profit<0?'loss':''}">
          <strong>${delta>0?'+'+money(delta)+' potential improvement':delta<0?'Change of '+money(Math.abs(delta)):'No change'}${keys.length?' with '+keys.length+' suggestion'+(keys.length===1?'':'s')+' selected.':''}</strong>
          <small>Your calculator values stay unchanged until you apply the selected suggestions.</small>
        </div>
        <div class="pp-advisor-selected">
          <div class="pp-advisor-selected-title">CHANGES BEING TESTED</div>
          ${keys.length?keys.map(key=>{
            const d=defs.find(x=>x.key===key);
            return `<div class="pp-advisor-selected-row"><span>${d.title}</span><b>${d.current()}</b><i>→</i><b class="after">${d.suggested()}</b></div>`;
          }).join(''):'<div class="pp-advisor-empty">Select one or more suggestions above to see exactly what would change and the combined profit effect.</div>'}
        </div>
        <button type="button" class="pp-advisor-apply" id="ppAdvisorApplySelected" ${keys.length?'':'disabled'}>✓ Apply All Selected Suggestions to Calculator</button>
      </div>
    </div>

    <div class="pp-advisor-tip"><b>Tip:</b> These are estimates based on your current settings. Test a practical change, compare the projected result, then apply the changes you are happy with.</div>
  `;

  return true;
}

function applySingleAdvisorSuggestion(key){
  const s=snapshot();
  if(!s)return;
  const apply=(id,v)=>{
    const el=$(id);
    if(!el)return;
    el.value=String(v);
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  };
  if(key==='materialUsage'&&s.used>0)apply('materialUsed',(s.used*.85).toFixed(2));
  else if(key==='printTime'&&s.hours>0){
    const h=s.hours*.9,whole=Math.floor(h),m=Math.round((h-whole)*60);
    if($('ppPrintTimeHours')&&$('ppPrintTimeMinutes')){apply('ppPrintTimeHours',whole);apply('ppPrintTimeMinutes',m);}
    else apply('printHours',h.toFixed(2));
  } else if(key==='materialCost'&&s.packPrice>0)apply('materialPackCost',(s.packPrice*.85).toFixed(2));
  else if(key==='deliveryCost'&&s.delivery>0)apply('delivery',Math.max(0,s.delivery-.95).toFixed(2));
  else if(key==='labourMinutes'&&s.labourHours>0)apply('labourHours',Math.max(0,s.labourHours-5/60).toFixed(2));
  else if(key==='sellingPrice'&&s.sell>0)apply('sell',Math.max(s.sell*1.15,s.sell+2.5).toFixed(2));
  setTimeout(()=>{$('calc')?.click();},30);
}

function boot(){
  const start=Date.now();
  const timer=setInterval(()=>{
    if(render()||Date.now()-start>10000)clearInterval(timer);
  },120);
  if(document.readyState!=='loading')render(); else document.addEventListener('DOMContentLoaded',render,{once:true});
}

document.addEventListener('click',e=>{
  const apply=e.target&&e.target.closest?e.target.closest('#ppProfitAdvisor [data-advisor-apply]'):null;
  if(apply){
    e.preventDefault();
    e.stopPropagation();
    const key=apply.getAttribute('data-advisor-apply');
    if(selectedAdvisorSuggestions.has(key))selectedAdvisorSuggestions.delete(key);
    else selectedAdvisorSuggestions.add(key);
    render();
    return;
  }
  const reset=e.target&&e.target.closest?e.target.closest('#ppAdvisorReset'):null;
  if(reset){
    e.preventDefault();
    e.stopPropagation();
    selectedAdvisorSuggestions.clear();
    render();
    return;
  }
  const commit=e.target&&e.target.closest?e.target.closest('#ppAdvisorApplySelected'):null;
  if(commit){
    e.preventDefault();
    e.stopPropagation();
    const s=snapshot();
    commitAdvisorSuggestions(s,[...selectedAdvisorSuggestions]);
    setTimeout(render,80);
    return;
  }
  const button=e.target&&e.target.closest?e.target.closest('.pp-profit-review[data-pp-review-target]'):null;
  if(!button)return;
  e.preventDefault();
  e.stopPropagation();
  goToReviewTarget(button.getAttribute('data-pp-review-target'));
});

document.addEventListener('input',e=>{
  if(e.target&&e.target.closest?.('#ppProfitAdvisor'))return;
  if(e.target&&e.target.matches('input,select,textarea'))setTimeout(()=>{advisorScenario=null;render();},20);
});
document.addEventListener('change',e=>{
  if(e.target&&e.target.closest?.('#ppProfitAdvisor'))return;
  if(e.target&&e.target.matches('input,select,textarea'))setTimeout(()=>{advisorScenario=null;render();},20);
});
document.querySelectorAll('#resultTabs .tab').forEach(b=>b.addEventListener('click',()=>setTimeout(render,20)));
window.addEventListener('storage',()=>setTimeout(render,20));
document.addEventListener('printprofit-settings-changed',()=>{setTimeout(render,30);});
boot();

})();