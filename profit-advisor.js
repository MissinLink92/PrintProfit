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

  const batchViewForSnapshot=!!document.getElementById('batchResultView')&&!document.getElementById('batchResultView').hidden;
  const resultNode=document.getElementById(batchViewForSnapshot?'batchProfit':'singleProfit');
  const rawResult=Number(resultNode?.dataset?.rawValue);
  const syncedProfit=Number.isFinite(rawResult)?rawResult:profit;

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

  return {qty,disc,hours,materialCost,materialPack:pack,materialPackCost:packPrice,materialUsed:used,elec,depreciation,labour,labourHours:num('labourHours'),labourRate:num('labourRate'),packagingOther,delivery,deliveryCharge,base,sell,feeRate,fixedFee:num('fixedFee'),fees,profit:syncedProfit,margin:sell?syncedProfit/sell:0,breakEven,target30,batchProfit,batchBreakEven,batchTarget30};
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
    platformSelect:'costs',platform:'costs',pay:'costs',fixedFee:'costs',deliveryCharge:'costs',pack:'costs',
    sell:'costs',electricityRate:'costs',electricityProvider:'costs',printHours:'details'
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
    /* Step 4 layout: keep the normal Results and Profit Advisor together. */
    .result#about.pp-advisor-results-split{display:grid!important;grid-template-columns:minmax(300px,.92fr) minmax(420px,1.08fr)!important;gap:12px!important;align-items:start!important;}
    .result#about.pp-advisor-results-split>.head,.result#about.pp-advisor-results-split>.tabs{grid-column:1 / -1!important;}
    .result#about.pp-advisor-results-split>.resultView{grid-column:1!important;min-width:0!important;}
    .result#about.pp-advisor-results-split>#ppProfitAdvisor{grid-column:2!important;grid-row:3 / span 2!important;margin-top:0!important;min-width:0!important;}
    .result#about.pp-advisor-results-split>#ppProfitAdvisor .pp-advisor-main{grid-template-columns:1fr!important;}
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
    .pp-advisor-why{display:block;margin-top:5px;color:#b5c3cb;font-size:7.8px;line-height:1.35;padding-top:4px;border-top:1px solid rgba(127,160,175,.10);}
    .pp-advisor-why b{color:#ff9a42;font-weight:900;}
    #ppAdvisorApplyToast{position:fixed;right:22px;bottom:84px;z-index:99999;max-width:min(440px,calc(100vw - 44px));padding:11px 13px;border:1px solid rgba(54,229,139,.55);border-radius:11px;background:linear-gradient(180deg,#0d241b,#091820);color:#ecfff5;box-shadow:0 16px 34px #0009;opacity:0;transform:translateY(8px);transition:opacity .18s ease,transform .18s ease;font:800 10px/1.4 Inter,Segoe UI,system-ui,sans-serif;}
    #ppAdvisorApplyToast.show{opacity:1;transform:translateY(0);}
    #ppAdvisorApplyToast.neutral{border-color:#ff780066;color:#fff2e5;background:linear-gradient(180deg,#271b10,#101820);}
    @media(max-width:650px){#ppAdvisorApplyToast{left:12px;right:12px;bottom:70px;max-width:none;}}

    .pp-advisor-pill{display:inline-flex;align-items:center;padding:3px 5px;border-radius:99px;border:1px solid rgba(54,229,139,.45);color:#4be79a;background:rgba(54,229,139,.06);font-size:7px;font-weight:900;white-space:nowrap;}
    .pp-advisor-pill.med{border-color:rgba(255,193,7,.45);color:#ffd15d;background:rgba(255,193,7,.06);}
    .pp-advisor-control{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(54px,.68fr);gap:5px;align-items:stretch;margin-top:7px;}
    .pp-advisor-control .mini{min-width:0;border:1px solid #294957;border-radius:6px;padding:5px 6px;background:#091821;overflow:hidden;}
    .pp-advisor-control .mini span{display:block;color:#7f95a1;font-size:6.5px;white-space:nowrap;}
    .pp-advisor-control .mini strong{display:block;margin-top:2px;font-size:8.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .pp-advisor-change{min-width:0;font-size:8px;font-weight:900;text-align:right;white-space:nowrap;align-self:center;}
    .pp-advisor-suggestion-apply{grid-column:1 / -1;width:100%;margin-top:5px;border:1px solid #ff7800;border-radius:7px;padding:7px 9px;background:linear-gradient(135deg,#ff9a3d,#ff7800);color:#fff;font:900 8px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;box-shadow:0 5px 14px #ff780018;}
    .pp-advisor-suggestion-apply:hover{filter:brightness(1.06);transform:translateY(-1px);}
    .pp-advisor-suggestion-apply:active{transform:translateY(0);}
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
    @media(max-width:1100px){
      .result#about.pp-advisor-results-split{grid-template-columns:1fr!important;}
      .result#about.pp-advisor-results-split>.resultView{grid-column:1!important;}
      .result#about.pp-advisor-results-split>#ppProfitAdvisor{grid-column:1!important;grid-row:auto!important;}
    }
    @media(max-width:980px){
      .pp-advisor-header{flex-direction:column;}
      .pp-advisor-alert{width:100%;max-width:none;}
      .pp-advisor-stat-grid{grid-template-columns:1fr 1fr;}
      .pp-advisor-main{grid-template-columns:1fr;}
      .pp-advisor-control{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;}
    }
    @media(max-width:650px){
      .pp-profit-advisor{padding:10px;}
      .pp-advisor-stat-grid{grid-template-columns:1fr 1fr;}
      .pp-advisor-control{grid-template-columns:1fr 1fr;gap:5px;}
      .pp-advisor-control output,.pp-advisor-change{text-align:left;}
    }
    body[data-pp-theme="light"] .pp-profit-advisor{background:linear-gradient(180deg,#fff,#edf3f6)!important;border-color:#b8c9d1!important;color:#17232b!important;}
    body[data-pp-theme="light"] .pp-advisor-alert{background:rgba(220,65,65,.06);border-color:#e0a4a4!important;}
    body[data-pp-theme="light"] .pp-advisor-stat,body[data-pp-theme="light"] .pp-advisor-panel,body[data-pp-theme="light"] .pp-advisor-suggestion,body[data-pp-theme="light"] .pp-advisor-stat .mini,body[data-pp-theme="light"] .pp-advisor-live-profit,body[data-pp-theme="light"] .pp-advisor-help,body[data-pp-theme="light"] .pp-advisor-copy{background:#f6f9fa!important;border-color:#c5d2d8!important;}
    body[data-pp-theme="light"] .pp-advisor-heading p,body[data-pp-theme="light"] .pp-advisor-alert span,body[data-pp-theme="light"] .pp-advisor-stat span,body[data-pp-theme="light"] .pp-advisor-suggestion-title small,body[data-pp-theme="light"] .pp-advisor-control .mini span,body[data-pp-theme="light"] .pp-advisor-live-profit span,body[data-pp-theme="light"] .pp-advisor-live-profit p,body[data-pp-theme="light"] .pp-advisor-summary-row span:first-child,body[data-pp-theme="light"] .pp-advisor-help{color:#5d707b!important;}
  `;
  s.textContent += `
    /* Full-width Step 4 experiment: complete Results above complete Profit Advisor. */
    .pp-results-advisor-layout{
      display:flex!important;
      flex-direction:column!important;
      gap:14px!important;
      width:100%!important;
      min-width:0!important;
    }
    .pp-results-advisor-layout>.result{
      order:1!important;
      width:100%!important;
      min-width:0!important;
      position:static!important;
      margin:0!important;
    }
    .pp-results-advisor-layout>#ppProfitAdvisor{
      order:2!important;
      width:100%!important;
      min-width:0!important;
      margin:0!important;
    }
    .pp-results-advisor-layout>.result>.head,
    .pp-results-advisor-layout>.result>.tabs,
    .pp-results-advisor-layout>.result>.resultView{
      width:100%!important;
      min-width:0!important;
    }
    .pp-profit-advisor{
      width:100%!important;
      box-sizing:border-box!important;
      margin:0!important;
    }
    .pp-advisor-main{
      display:block!important;
      width:100%!important;
    }
    .pp-advisor-panel{
      width:100%!important;
      box-sizing:border-box!important;
    }
    .pp-advisor-suggestions-grid{
      display:grid!important;
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
      gap:8px!important;
      width:100%!important;
    }
    .pp-advisor-suggestion{
      margin-top:0!important;
      height:100%!important;
      box-sizing:border-box!important;
    }
    .pp-advisor-live{
      margin-top:10px!important;
      width:100%!important;
      box-sizing:border-box!important;
    }
    .pp-advisor-live-profit-row{
      grid-template-columns:repeat(4,minmax(0,1fr))!important;
    }
    @media(max-width:1050px){
      .pp-advisor-suggestions-grid{
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
      }
    }
    @media(max-width:650px){
      .pp-advisor-suggestions-grid{
        grid-template-columns:1fr!important;
      }
      .pp-advisor-live-profit-row{
        grid-template-columns:1fr 1fr!important;
      }
    }
  `;
  s.textContent += `
    /* Final Step 4 override: force Results and Profit Advisor into a vertical full-width stack. */
    .result#about.pp-advisor-results-split{
      display:block!important;
      width:100%!important;
      min-width:0!important;
      position:static!important;
      top:auto!important;
      margin:0!important;
    }
    .result#about.pp-advisor-results-split>.head,
    .result#about.pp-advisor-results-split>.tabs,
    .result#about.pp-advisor-results-split>.resultView{
      width:100%!important;
      min-width:0!important;
      box-sizing:border-box!important;
    }
    .result#about.pp-advisor-results-split>.pp-results-left-column,
    .result#about.pp-advisor-results-split>.pp-advisor-right-column{
      display:block!important;
      width:100%!important;
      min-width:0!important;
      box-sizing:border-box!important;
      float:none!important;
      grid-column:auto!important;
      grid-row:auto!important;
    }
    .result#about.pp-advisor-results-split>.pp-results-left-column{
      margin:0 0 14px!important;
    }
    .result#about.pp-advisor-results-split>.pp-advisor-right-column{
      margin:0!important;
    }
    .result#about.pp-advisor-results-split>.pp-advisor-right-column>#ppProfitAdvisor{
      width:100%!important;
      min-width:0!important;
      margin:0!important;
    }
    .pp-results-advisor-layout{
      display:flex!important;
      flex-direction:column!important;
      width:100%!important;
      min-width:0!important;
      gap:14px!important;
    }
    .pp-results-advisor-layout>.result,
    .pp-results-advisor-layout>#ppProfitAdvisor{
      width:100%!important;
      min-width:0!important;
      margin:0!important;
      position:static!important;
      grid-column:auto!important;
      grid-row:auto!important;
    }
  `;
  s.textContent += `
    .result#about.pp-advisor-results-split{
      display:grid!important;
      grid-template-columns:minmax(0,1fr) minmax(430px,1fr)!important;
      gap:12px!important;
      align-items:start!important;
      width:100%!important;
      position:static!important;
      top:auto!important;
    }
    .result#about.pp-advisor-results-split>.pp-results-left-column,
    .result#about.pp-advisor-results-split>.pp-advisor-right-column{
      min-width:0!important;width:100%!important;
    }
    .result#about.pp-advisor-results-split>.pp-results-left-column{
      grid-column:1!important;grid-row:1!important;
    }
    .result#about.pp-advisor-results-split>.pp-advisor-right-column{
      grid-column:2!important;grid-row:1!important;
    }
    .pp-results-left-column>.head{margin-bottom:8px!important}
    .pp-results-left-column>.tabs{margin:10px 0!important}
    .pp-results-left-column>.resultView{margin:0!important;width:100%!important}
    .pp-advisor-right-column>#ppProfitAdvisor{margin:0!important;width:100%!important}
    .pp-advisor-right-column .pp-profit-advisor{margin:0!important}
    @media(max-width:1100px){
      .result#about.pp-advisor-results-split{grid-template-columns:1fr!important}
      .result#about.pp-advisor-results-split>.pp-results-left-column,
      .result#about.pp-advisor-results-split>.pp-advisor-right-column{
        grid-column:1!important;grid-row:auto!important
      }
    }
    /* Explicit Step 4 structure: complete Results above complete Advisor. */
    .pp-results-advisor-layout{
      display:flex!important;
      flex-direction:column!important;
      gap:14px!important;
      align-items:stretch!important;
      width:100%!important;
      min-width:0!important;
    }
    .pp-results-advisor-layout>.result,
    .pp-results-advisor-layout>#ppProfitAdvisor{
      display:block!important;
      width:100%!important;
      min-width:0!important;
      margin:0!important;
      position:static!important;
      top:auto!important;
      grid-column:auto!important;
      grid-row:auto!important;
      float:none!important;
      box-sizing:border-box!important;
    }
    .pp-results-advisor-layout>.result>.head,
    .pp-results-advisor-layout>.result>.tabs,
    .pp-results-advisor-layout>.result>.resultView{
      width:100%!important;
      min-width:0!important;
      box-sizing:border-box!important;
    }
    /* Clearer and reversible Advisor UI */
    .pp-advisor-how{display:flex;flex-direction:column;gap:4px;margin:10px 0 12px;padding:10px 12px;border:1px solid #35515f;border-radius:10px;background:linear-gradient(180deg,#0b1d27,#091720);color:#cdd9de;font-size:9px;line-height:1.45}
    .pp-advisor-how strong{font-size:10px;color:#fff}
    .pp-advisor-section-heading{display:flex;justify-content:space-between;align-items:end;margin-bottom:8px}
    .pp-advisor-section-heading h4{margin:2px 0 0;font-size:15px}
    .pp-advisor-section-label{display:block;font-size:8px;font-weight:900;letter-spacing:.18em;color:#ff9a42}
    .pp-advisor-suggestions-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;width:100%!important}
    .pp-advisor-suggestion{display:flex!important;flex-direction:column!important;height:100%!important;margin:0!important;padding:12px!important;border:1px solid #294957!important;border-radius:12px!important;background:linear-gradient(180deg,#0b1e29,#08161f)!important;box-sizing:border-box!important}
    .pp-advisor-suggestion-head{display:flex!important;align-items:center!important;gap:8px!important;min-height:30px!important}
    .pp-advisor-suggestion-title{flex:1!important;min-width:0!important}
    .pp-advisor-suggestion-title strong{font-size:11px!important}
    .pp-advisor-suggestion-title small{display:block!important;margin-top:3px!important;color:#8ea4af!important;font-size:7px!important;text-transform:uppercase!important;letter-spacing:.08em!important}
    .pp-advisor-why-box{margin-top:10px;padding:9px;border:1px solid rgba(255,120,0,.18);border-left:3px solid #ff7800;border-radius:8px;background:rgba(255,120,0,.035)}
    .pp-advisor-why-box p{margin:4px 0 0;color:#b8c7cf;font-size:8.5px;line-height:1.45}
    .pp-advisor-applied-badge{display:inline-flex;align-items:center;padding:4px 6px;border-radius:99px;border:1px solid rgba(54,229,139,.45);background:rgba(54,229,139,.08);color:#4be79a;font-size:7px;font-weight:900}
    .pp-advisor-applied-note{margin-top:10px;padding:9px;border:1px solid rgba(54,229,139,.34);border-radius:8px;background:rgba(54,229,139,.055)}
    .pp-advisor-applied-note b{display:block;color:#55eaa0;font-size:9px}
    .pp-advisor-applied-note span{display:block;margin-top:3px;color:#9eb2bc;font-size:8px;line-height:1.4}
    .pp-advisor-change-box{margin-top:9px;padding:9px;border:1px solid #294957;border-radius:8px;background:#091821}
    .pp-advisor-change-box>strong{display:block;margin-top:4px;color:#e7eef2;font-size:8.5px;line-height:1.35}
    .pp-advisor-value-row{display:grid;grid-template-columns:1fr 18px 1fr;gap:6px;align-items:center;margin-top:8px}
    .pp-advisor-value-row>div{min-width:0;padding:6px;border:1px solid #294957;border-radius:6px;background:#08151d}
    .pp-advisor-value-row small{display:block;color:#7f95a1;font-size:7px}
    .pp-advisor-value-row b{display:block;margin-top:3px;color:#fff;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pp-advisor-arrow{text-align:center!important;color:#ff9a42!important;font-size:13px!important;padding:0!important;border:0!important;background:none!important}
    .pp-advisor-impact-row{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px}
    .pp-advisor-impact-row>div{padding:7px 8px;border:1px solid #294957;border-radius:7px;background:#091821}
    .pp-advisor-impact-row span{display:block;color:#7f95a1;font-size:7px;font-weight:900;letter-spacing:.06em}
    .pp-advisor-impact-row strong{display:block;margin-top:3px;font-size:14px}
    .pp-advisor-impact{text-align:right}
    .pp-advisor-impact.up strong{color:#36e58b}
    .pp-advisor-impact.down strong{color:#ff6b6b}
    .pp-advisor-suggestion-apply{margin-top:auto!important;width:100%!important;padding:8px 10px!important;border:1px solid #ff7800!important;border-radius:8px!important;background:linear-gradient(135deg,#ff9a3d,#ff7800)!important;color:#fff!important;font:900 9px Inter,Segoe UI,system-ui,sans-serif!important;cursor:pointer!important}
    .pp-advisor-suggestion-apply.undo{border-color:#5a7380!important;background:#12232c!important;color:#e0ebef!important}
    .pp-advisor-suggestion-apply:disabled{opacity:.5!important;cursor:not-allowed!important}
    .pp-advisor-suggestion-apply:hover:not(:disabled){filter:brightness(1.06)}
    .pp-advisor-footer-note{margin-top:10px;padding:9px;border-top:1px solid rgba(127,160,175,.12);color:#7f95a1;font-size:8px;line-height:1.45}
    #ppAdvisorApplyToast{position:fixed;right:22px;bottom:84px;z-index:99999;max-width:min(460px,calc(100vw - 44px));padding:11px 13px;border:1px solid rgba(54,229,139,.55);border-radius:11px;background:linear-gradient(180deg,#0d241b,#091820);color:#ecfff5;box-shadow:0 16px 34px #0009;opacity:0;transform:translateY(8px);transition:opacity .18s ease,transform .18s ease;font:800 10px/1.4 Inter,Segoe UI,system-ui,sans-serif}
    #ppAdvisorApplyToast.show{opacity:1;transform:translateY(0)}
    #ppAdvisorApplyToast.neutral{border-color:#ff780066;color:#fff2e5;background:linear-gradient(180deg,#271b10,#101820)}
    @media(max-width:1050px){.pp-advisor-suggestions-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
    @media(max-width:650px){.pp-advisor-suggestions-grid{grid-template-columns:1fr!important}.pp-advisor-value-row{grid-template-columns:1fr}.pp-advisor-arrow{display:none!important}.pp-advisor-impact-row{grid-template-columns:1fr}}

    .pp-advisor-why-box{margin-top:10px;padding:9px;border:1px solid rgba(255,120,0,.18);border-left:3px solid #ff7800;border-radius:8px;background:rgba(255,120,0,.035)}
    .pp-advisor-why-box p{margin:4px 0 0;color:#b8c7cf;font-size:8.5px;line-height:1.45}
    .pp-advisor-applied-note{margin-top:9px;padding:9px;border:1px solid rgba(54,229,139,.34);border-radius:8px;background:rgba(54,229,139,.055)}
    .pp-advisor-applied-note b{display:block;color:#55eaa0;font-size:9px}.pp-advisor-applied-note span{display:block;margin-top:3px;color:#9eb2bc;font-size:8px;line-height:1.4}
    .pp-advisor-applied-badge{display:inline-flex;align-items:center;padding:4px 6px;border-radius:99px;border:1px solid rgba(54,229,139,.45);background:rgba(54,229,139,.08);color:#4be79a;font-size:7px;font-weight:900;white-space:nowrap}

    .pp-advisor-suggestion-apply[data-advisor-review],.pp-advisor-suggestion-apply[data-advisor-batch]{background:#12242d!important;border-color:#3a5967!important;color:#e7eff3!important}
    .pp-advisor-suggestion-apply[data-advisor-review]:hover,.pp-advisor-suggestion-apply[data-advisor-batch]:hover{border-color:#ff7800!important;color:#fff!important}


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


let advisorAppliedSnapshots={};
let advisorInternalChange=false;

function advisorConfigs(s){
  const candidates=[];
  const add=(cfg)=>{
    if(cfg&&cfg.relevant&&cfg.score>0)candidates.push(cfg);
  };
  const cheapest=cheapestDelivery();
  const lowestFee=lowestSellingFee(s.sell);
  const productionCost=Math.max(0,s.base-s.delivery);
  const costTotal=Math.max(0,s.base);
  const margin=s.margin;
  const feeShare=s.sell>0?s.fees/s.sell:0;
  const packaging=s.packagingOther;
  const deliveryAbsorbed=Math.max(0,s.delivery-s.deliveryCharge);

  /* Pricing — show when price itself is a clear problem. */
  if(s.sell>0&&s.breakEven!==null&&s.sell<s.breakEven){
    const suggested=Math.max(s.breakEven*1.05,s.target30||s.breakEven*1.05);
    add({
      key:'sellingPrice',group:'price',kind:'apply',score:100+(s.breakEven-s.sell),
      icon:'◇',title:'Raise the selling price',impactLabel:'Highest priority',
      canApply:true,suggested,currentText:()=>money(s.sell),suggestedText:v=>money(v),
      scenario:()=>({materialUsage:0,labourMinutes:0,deliveryCost:s.delivery,sellingPrice:suggested,materialCost:s.materialCost}),
      why:()=> 'Your price is '+money(s.sell)+' but break-even is '+money(s.breakEven)+'. You are '+money(s.breakEven-s.sell)+' below the point where the calculated costs and fees are covered.',
      changeText:()=> 'Move the selling price above break-even so each sale covers the current costs and fees.',
      targetKey:'sell'
    });
  }else if(s.sell>0&&margin<.30){
    const suggested=Math.max(s.sell*1.15,s.target30||s.sell*1.15);
    add({
      key:'sellingPrice',group:'price',kind:'apply',score:75,
      icon:'◇',title:'Improve the selling price',impactLabel:'High impact',
      canApply:true,suggested,currentText:()=>money(s.sell),suggestedText:v=>money(v),
      scenario:()=>({materialUsage:0,labourMinutes:0,deliveryCost:s.delivery,sellingPrice:suggested,materialCost:s.materialCost}),
      why:()=> 'Your current margin is '+(margin*100).toFixed(1)+'%. PrintProfit suggests testing a higher price because price is one of the few changes that can improve profit without changing the print.',
      changeText:()=> 'Test a price increase while keeping the current fee assumptions.',
      targetKey:'sell'
    });
  }

  /* Material — only show the stronger of the two material suggestions. */
  const materialShare=productionCost>0?s.materialCost/productionCost:0;
  if(s.materialUsed>0&&s.materialCost>0&&materialShare>=.25){
    add({
      key:'materialUsage',group:'material',kind:'apply',score:78+materialShare*10,
      icon:'⬡',title:'Use less material',impactLabel:'High impact',
      canApply:true,suggested:s.materialUsed*.85,suggestedText:v=>v.toFixed(2)+' g',currentText:()=>s.materialUsed.toFixed(2)+' g',
      scenario:()=>({materialUsage:15,labourMinutes:0,deliveryCost:s.delivery,sellingPrice:s.sell,materialCost:s.materialCost}),
      why:()=> 'Material is '+money(s.materialCost)+' of the production cost and is currently the largest cost driver. A 15% usage reduction would save about '+money(s.materialCost*.15)+' per print before other effects.',
      changeText:()=> 'Try around 15% less material through infill, walls or supports where the model allows it.',
      targetKey:'materialUsed'
    });
  }else if(s.materialCost>0&&s.materialPackCost>0){
    add({
      key:'materialCost',group:'material',kind:'apply',score:58,
      icon:'◈',title:'Use cheaper material',impactLabel:'Medium impact',
      canApply:true,suggested:s.materialPackCost*.85,suggestedText:v=>money(v)+' / pack',currentText:()=>money(s.materialPackCost)+' / pack',
      scenario:()=>({materialUsage:0,labourMinutes:0,deliveryCost:s.delivery,sellingPrice:s.sell,materialCost:s.materialCost*.85}),
      why:()=> 'Material costs '+money(s.materialCost)+' per print. A suitable spool or bottle that costs less would reduce a recurring production cost without changing the print itself.',
      changeText:()=> 'Test a material pack price about 15% lower.',
      targetKey:'materialPackCost'
    });
  }

  /* Delivery — choose either cheaper postage OR recovering undercharged delivery. */
  if(deliveryAbsorbed>.05){
    add({
      key:'deliveryCharge',group:'delivery',kind:'review',score:82+deliveryAbsorbed*5,
      icon:'⇩',title:'You are absorbing part of the delivery cost',impactLabel:'Worth fixing',
      relevant:true,currentText:()=>money(deliveryAbsorbed)+' absorbed',
      why:()=> 'Delivery costs you '+money(s.delivery)+' but you are only charging the customer '+money(s.deliveryCharge)+'. That leaves you absorbing '+money(deliveryAbsorbed)+' on every sale.',
      changeText:()=> 'Review the customer delivery charge so you are not automatically paying the difference.',
      metricLabel:'Potential improvement',metricText:()=>'+ '+money(deliveryAbsorbed)+' per sale',
      reviewTarget:'deliveryCharge'
    });
  }else if(cheapest&&s.delivery>0&&cheapest.price<s.delivery){
    const save=s.delivery-cheapest.price;
    add({
      key:'deliveryCost',group:'delivery',kind:'apply',score:65+save*6,
      icon:'▱',title:'Lower the delivery cost',impactLabel:'Medium impact',
      canApply:true,suggested:cheapest.price,suggestedText:v=>money(v),currentText:()=>money(s.delivery),
      scenario:()=>({materialUsage:0,labourMinutes:0,deliveryCost:cheapest.price,sellingPrice:s.sell,materialCost:s.materialCost}),
      why:()=> 'You currently pay '+money(s.delivery)+' for delivery. The lowest tracked reference is '+money(cheapest.price)+' ('+cheapest.label+'), so there may be '+money(save)+' to save per print.',
      changeText:()=> 'Test the lower tracked delivery rate.',
      targetKey:'delivery'
    });
  }

  /* Labour — only when it actually matters. */
  if(s.labour>0&&s.labourHours>0){
    const labourShare=productionCost>0?s.labour/productionCost:0;
    if(s.labour>=.25||labourShare>=.10){
      add({
        key:'labourMinutes',group:'labour',kind:'apply',score:55+labourShare*50,
        icon:'◷',title:'Reduce labour time',impactLabel:'Medium impact',
        canApply:true,suggested:Math.max(0,s.labourHours-5/60),suggestedText:v=>v.toFixed(2)+' h',currentText:()=>s.labourHours.toFixed(2)+' h',
        scenario:()=>({materialUsage:0,labourMinutes:Math.min(5,s.labourHours*60),deliveryCost:s.delivery,sellingPrice:s.sell,materialCost:s.materialCost}),
        why:()=> 'Labour is costing '+money(s.labour)+' per print. At your current rate, five minutes less hands-on time would save about '+money(s.labourRate*(5/60))+'.',
        changeText:()=> 'Look for roughly five minutes of setup, cleanup or other hands-on work that can be removed.',
        targetKey:'labourHours'
      });
    }
  }

  /* Selling fees — useful when they are taking a meaningful slice of the sale. */
  if(s.fees>0&&s.sell>0&&(feeShare>=.08||s.fees>=.75)){
    const potential=lowestFee&&lowestFee.fee<s.fees?s.fees-lowestFee.fee:0;
    add({
      key:'platformFees',group:'fees',kind:'review',score:60+feeShare*70,
      icon:'%',title:'Check your selling fees',impactLabel:'Worth checking',
      relevant:true,currentText:()=>money(s.fees)+' per sale',
      why:()=> potential>0
        ?'Your current platform/payment fees are '+money(s.fees)+'. A tracked lower-fee setup is '+money(lowestFee.fee)+', although the cheapest option may not offer the same features or terms.'
        :'Selling fees are '+money(s.fees)+' on the current sale, which is a meaningful part of the price.',
      changeText:()=> 'Compare your current platform and payment fees with the alternatives available in PrintProfit.',
      metricLabel:'Possible saving',metricText:()=>potential>0?'+ '+money(potential)+' per sale':'Compare fees',
      reviewTarget:'platformSelect'
    });
  }

  /* Electricity — recommend a review only when it is a meaningful cost. */
  if(s.elec>0&&costTotal>0&&(s.elec>=.25||s.elec/costTotal>=.08)){
    const saving=s.elec*.20;
    add({
      key:'electricity',group:'electricity',kind:'review',score:52+(s.elec/costTotal)*60,
      icon:'⚡',title:'Reduce electricity cost',impactLabel:'Worth checking',
      relevant:true,currentText:()=>money(s.elec)+' per print',
      why:()=> 'This print is using '+money(s.elec)+' of electricity. That is '+((s.elec/costTotal)*100).toFixed(0)+'% of the current production cost.',
      changeText:()=> 'Review print time and machine power settings. A 20% electricity reduction would save roughly '+money(saving)+' per print.',
      metricLabel:'Example saving',metricText:()=>'+ '+money(saving)+' per print',
      reviewTarget:'printHours'
    });
  }

  /* Printer depreciation — only when machine cost is genuinely significant. */
  if(s.depreciation>0&&costTotal>0&&(s.depreciation>=.25||s.depreciation/costTotal>=.10)){
    add({
      key:'depreciation',group:'machine',kind:'review',score:48+(s.depreciation/costTotal)*50,
      icon:'🖨',title:'Review printer cost',impactLabel:'Worth checking',
      relevant:true,currentText:()=>money(s.depreciation)+' per print',
      why:()=> 'Printer depreciation is '+money(s.depreciation)+' per print, which is '+((s.depreciation/costTotal)*100).toFixed(0)+'% of your production cost.',
      changeText:()=> 'Check that the printer purchase price and expected life are realistic. Better machine utilisation can also spread the cost across more prints.',
      metricLabel:'Current cost',metricText:()=>money(s.depreciation)+' per print',
      reviewTarget:'printer'
    });
  }

  /* Packaging / other — only when it is worth noticing. */
  if(packaging>=.25|| (productionCost>0&&packaging/productionCost>=.10)){
    add({
      key:'packaging',group:'packaging',kind:'review',score:45+(packaging/Math.max(0.01,productionCost))*35,
      icon:'□',title:'Reduce packaging & other costs',impactLabel:'Worth checking',
      relevant:true,currentText:()=>money(packaging)+' per print',
      why:()=> 'Packaging and other costs add up to '+money(packaging)+' per print. That is a recurring cost on every item you make.',
      changeText:()=> 'Check whether bulk-buying packaging or using a simpler package would lower this cost.',
      metricLabel:'Current cost',metricText:()=>money(packaging)+' per print',
      reviewTarget:'pack'
    });
  }

  /* Batch — useful only when there is something to spread across a run. */
  if(s.qty===1&&(s.delivery>0||s.fixedFee>0)){
    const spread=s.delivery+s.fixedFee;
    add({
      key:'batch',group:'batch',kind:'batch',score:40+Math.min(25,spread*6),
      icon:'▦',title:'Try batch pricing',impactLabel:'Could help',
      relevant:true,currentText:()=> '1 item',
      why:()=> 'You have '+money(s.delivery)+' delivery cost'+(s.fixedFee>0?' and '+money(s.fixedFee)+' of fixed selling fees':'')+' that can be spread across a larger order.',
      changeText:()=> 'Try the Batch Pricing view before quoting multiple items at once.',
      metricLabel:'What to do',metricText:()=> 'Test a larger quantity',
      reviewTarget:null
    });
  }

  /* Prevent duplicate groups when multiple rules are eligible. */
  const chosen=[];
  const groups=new Set();
  candidates.sort((x,y)=>y.score-x.score).forEach(cfg=>{
    if(cfg.group&&groups.has(cfg.group))return;
    chosen.push(cfg);
    if(cfg.group)groups.add(cfg.group);
  });
  return chosen.slice(0,4);
}

function currentProfitFor(s,batchView){return batchView?s.batchProfit:s.profit;}


function currentProfitFor(s,batchView){return batchView?s.batchProfit:s.profit;}

function suggestionRow(cfg,s,batchView){
  const row=document.createElement('article');
  row.className='pp-advisor-suggestion';
  row.dataset.advisorKey=cfg.key;

  const currentProfit=currentProfitFor(s,batchView);
  const applied=cfg.kind==='apply'&&advisorAppliedSnapshots[cfg.key];
  let projected=currentProfit;
  let change=0;
  if(cfg.kind==='apply'&&!applied){
    projected=calculateAdvisorScenario(s,cfg.scenario(),batchView).profit;
    change=projected-currentProfit;
  }else if(applied){
    projected=Number.isFinite(applied.afterProfit)?applied.afterProfit:currentProfit;
    change=Number.isFinite(applied.beforeProfit)?projected-applied.beforeProfit:0;
  }else if(typeof cfg.metricValue==='number'){
    change=cfg.metricValue;
    projected=currentProfit+change;
  }

  if(applied){
    row.innerHTML=
      '<div class="pp-advisor-suggestion-head"><div class="pp-advisor-suggestion-icon">'+cfg.icon+'</div><div class="pp-advisor-suggestion-title"><strong>'+cfg.title+'</strong><small>'+cfg.impactLabel+'</small></div><span class="pp-advisor-applied-badge">✓ Applied</span></div>'+
      '<div class="pp-advisor-applied-note"><b>Applied successfully</b><span>The calculator is using this change now. Undo restores the value from immediately before you applied it.</span></div>'+
      '<div class="pp-advisor-why-box"><span class="pp-advisor-section-label">WHY WE SUGGESTED IT</span><p>'+cfg.why(s)+'</p></div>'+
      '<div class="pp-advisor-impact-row"><div><span>RESULT AFTER APPLYING</span><strong class="'+advisorProfitState(projected)+'">'+money(projected)+'</strong></div><div class="pp-advisor-impact '+(change>=0?'up':'down')+'"><span>ACTUAL CHANGE</span><strong>'+(change>=0?'↑ ':'↓ ')+money(Math.abs(change))+'</strong></div></div>'+
      '<button type="button" class="pp-advisor-suggestion-apply undo" data-advisor-apply="'+cfg.key+'">Undo suggestion ↩</button>';
    return row;
  }

  if(cfg.kind==='apply'){
    const buttonLabel=cfg.canApply?'Apply suggestion →':'Add a value first';
    row.innerHTML=
      '<div class="pp-advisor-suggestion-head"><div class="pp-advisor-suggestion-icon">'+cfg.icon+'</div><div class="pp-advisor-suggestion-title"><strong>'+cfg.title+'</strong><small>'+cfg.impactLabel+'</small></div></div>'+
      '<div class="pp-advisor-why-box"><span class="pp-advisor-section-label">WHY WE SUGGESTED THIS</span><p>'+cfg.why(s)+'</p></div>'+
      '<div class="pp-advisor-change-box"><span class="pp-advisor-section-label">TRY THIS</span><strong>'+cfg.changeText(s)+'</strong><div class="pp-advisor-value-row"><div><small>Current</small><b>'+cfg.currentText()+'</b></div><div class="pp-advisor-arrow">→</div><div><small>Suggested</small><b>'+cfg.suggestedText(cfg.suggested)+'</b></div></div></div>'+
      '<div class="pp-advisor-impact-row"><div><span>PROJECTED PROFIT</span><strong class="'+advisorProfitState(projected)+'">'+money(projected)+'</strong></div><div class="pp-advisor-impact '+(change>=0?'up':'down')+'"><span>ESTIMATED CHANGE</span><strong>'+(change>=0?'↑ ':'↓ ')+money(Math.abs(change))+'</strong></div></div>'+
      '<button type="button" class="pp-advisor-suggestion-apply" data-advisor-apply="'+cfg.key+'" '+(cfg.canApply?'':'disabled')+'>'+buttonLabel+'</button>';
    return row;
  }

  const actionAttr=cfg.kind==='review'?'data-advisor-review="'+(cfg.reviewTarget||'')+'"':'data-advisor-batch="1"';
  row.innerHTML=
    '<div class="pp-advisor-suggestion-head"><div class="pp-advisor-suggestion-icon">'+cfg.icon+'</div><div class="pp-advisor-suggestion-title"><strong>'+cfg.title+'</strong><small>'+cfg.impactLabel+'</small></div></div>'+
    '<div class="pp-advisor-why-box"><span class="pp-advisor-section-label">WHY WE SUGGESTED THIS</span><p>'+cfg.why(s)+'</p></div>'+
    '<div class="pp-advisor-change-box"><span class="pp-advisor-section-label">WHAT TO DO</span><strong>'+cfg.changeText(s)+'</strong></div>'+
    '<div class="pp-advisor-impact-row"><div><span>'+cfg.metricLabel+'</span><strong>'+cfg.metricText()+'</strong></div><div class="pp-advisor-impact up"><span>THE NEXT STEP</span><strong>Review</strong></div></div>'+
    '<button type="button" class="pp-advisor-suggestion-apply" '+actionAttr+'>'+(cfg.kind==='batch'?'Try batch pricing →':'Review setting →')+'</button>';
  return row;
}

function ensureResultColumns(result,box){
  const panel=result.parentElement;
  if(!panel)return false;
  let wrap=document.getElementById('ppResultsAdvisorLayout');
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id='ppResultsAdvisorLayout';
    wrap.className='pp-results-advisor-layout';
    panel.insertBefore(wrap,result);
  }
  if(box.parentElement===result)box.remove();
  if(result.parentElement!==wrap)wrap.appendChild(result);
  if(box.parentElement!==wrap)wrap.appendChild(box);
  return true;
}

function render(){
  const result=document.querySelector('.result');
  if(!result)return false;
  result.id='about';
  addStyles();

  let box=$('ppProfitAdvisor');
  if(!box){
    box=document.createElement('section');
    box.id='ppProfitAdvisor';
    box.className='pp-profit-advisor';
  }
  ensureResultColumns(result,box);

  const s=snapshot();
  const batchView=$('batchResultView')&&!$('batchResultView').hidden;
  const shownProfit=currentProfitFor(s,batchView);
  const hasData=(s.base>0||s.sell>0||s.deliveryCharge>0);
  box.innerHTML='';

  const title=shownProfit<0?'Currently at a loss':shownProfit>0?'Currently profitable':'At break-even';
  const text=shownProfit<0
    ?'You\'re losing '+money(Math.abs(shownProfit))+' per '+(batchView?'batch item':'print')+'. The suggestions below target the costs or price affecting that result.'
    :shownProfit>0
      ?'You\'re making '+money(shownProfit)+' per '+(batchView?'batch item':'print')+'. The suggestions below show ways to improve it further.'
      :'Your current calculation is at break-even. The suggestions below show areas that can move it into profit.';

  const header=document.createElement('div');
  header.className='pp-advisor-header';
  header.innerHTML='<div class="pp-advisor-heading"><div class="pp-profit-icon">💡</div><div><h3>'+t('title')+'</h3><p>'+text+'</p></div></div><div class="pp-advisor-alert '+(shownProfit>0?'good':'')+'"><strong>'+title+'</strong><span>Current profit: '+money(shownProfit)+' per '+(batchView?'batch item':'print')+'.</span></div>';
  box.appendChild(header);

  if(!hasData)return true;

  const be=batchView?s.batchBreakEven:s.breakEven;
  const t30=batchView?s.batchTarget30:s.target30;
  const stats=document.createElement('div');
  stats.className='pp-advisor-stat-grid';
  stats.innerHTML='<div class="pp-advisor-stat"><span>Current profit</span><strong class="'+advisorProfitState(shownProfit)+'">'+money(shownProfit)+'</strong><span style="margin-top:3px">Actual calculator result</span></div><div class="pp-advisor-stat"><span>'+t('breakEven')+'</span><strong class="neutral">'+(be===null?'—':money(be))+'</strong><span style="margin-top:3px">Minimum price to cover costs</span></div><div class="pp-advisor-stat"><span>'+t('target')+'</span><strong class="neutral">'+(t30===null?'—':money(t30))+'</strong><span style="margin-top:3px">Using current fee assumptions</span></div><div class="pp-advisor-stat"><span>Sales price</span><strong class="neutral">'+money(s.sell)+'</strong><span style="margin-top:3px">Current calculator price</span></div>';
  box.appendChild(stats);

  const how=document.createElement('div');
  how.className='pp-advisor-how';
  how.innerHTML='<strong>How the suggestions work</strong><span>Read why it was suggested → see what would change → apply it → check the new profit. Every applied suggestion has an Undo button.</span>';
  box.appendChild(how);

  const section=document.createElement('div');
  section.className='pp-advisor-suggestions-section';
  const picked=advisorConfigs(s);
  section.innerHTML='<div class="pp-advisor-section-heading"><div><span class="pp-advisor-section-label">SUGGESTED IMPROVEMENTS</span><h4>What matters most for this print</h4></div></div>';
  const grid=document.createElement('div');
  grid.className='pp-advisor-suggestions-grid';
  picked.forEach(cfg=>grid.appendChild(suggestionRow(cfg,s,batchView)));
  section.appendChild(grid);
  box.appendChild(section);

  const note=document.createElement('div');
  note.className='pp-advisor-footer-note';
  note.textContent='Suggestions are estimates based on your current figures. Applying a suggestion changes the calculator; Undo restores the value from before that suggestion was applied.';
  box.appendChild(note);
  return true;
}

function showAdvisorApplyToast(message,kind='good'){
  let toast=$('ppAdvisorApplyToast');
  if(!toast){
    toast=document.createElement('div');
    toast.id='ppAdvisorApplyToast';
    document.body.appendChild(toast);
  }
  toast.className='pp-advisor-apply-toast '+kind;
  toast.textContent=message;
  requestAnimationFrame(()=>toast.classList.add('show'));
  clearTimeout(window.__ppAdvisorApplyToastTimer);
  window.__ppAdvisorApplyToastTimer=setTimeout(()=>{
    toast.classList.remove('show');
    setTimeout(()=>toast.remove(),220);
  },3200);
}

function showAdvisorApplyToast(message,kind='good'){
  let toast=document.getElementById('ppAdvisorApplyToast');
  if(!toast){toast=document.createElement('div');toast.id='ppAdvisorApplyToast';document.body.appendChild(toast);}
  toast.className='pp-advisor-apply-toast '+kind;
  toast.textContent=message;
  requestAnimationFrame(()=>toast.classList.add('show'));
  clearTimeout(window.__ppAdvisorApplyToastTimer);
  window.__ppAdvisorApplyToastTimer=setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(),220);},3200);
}


function applySingleAdvisorSuggestion(key){
  const s=snapshot();
  if(!s)return;
  const batchView=!!document.getElementById('batchResultView')&&!document.getElementById('batchResultView').hidden;
  const cfg=advisorConfigs(s).find(x=>x.key===key);
  if(!cfg)return;

  const idsByKey={
    materialUsage:['materialUsed'],
    labourMinutes:['labourHours'],
    deliveryCost:['delivery'],
    sellingPrice:['sell'],
    materialCost:['materialPackCost']
  };
  const ids=idsByKey[key]||[];

  if(!advisorAppliedSnapshots[key]){
    if(!cfg.canApply)return;
    const before={};
    ids.forEach(id=>{const el=$(id);if(el)before[id]=el.value;});
    const setValue=(id,value)=>{
      const el=$(id);if(!el)return;
      el.value=String(value);
      el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
    };

    advisorInternalChange=true;
    try{
      if(key==='materialUsage')setValue('materialUsed',(s.materialUsed*.85).toFixed(2));
      else if(key==='labourMinutes')setValue('labourHours',Math.max(0,s.labourHours-5/60).toFixed(2));
      else if(key==='deliveryCost')setValue('delivery',cfg.suggested.toFixed(2));
      else if(key==='sellingPrice')setValue('sell',cfg.suggested.toFixed(2));
      else if(key==='materialCost'){
        const targetPerPrint=s.materialCost*.85;
        const ratio=s.materialCost>0?targetPerPrint/s.materialCost:1;
        setValue('materialPackCost',(s.materialPackCost*ratio).toFixed(2));
      }
    }finally{advisorInternalChange=false;}

    const after={};
    ids.forEach(id=>{const el=$(id);if(el)after[id]=el.value;});
    advisorAppliedSnapshots[key]={
      before,
      after,
      beforeProfit:currentProfitFor(s,batchView),
      reason:cfg.why(s)
    };

    setTimeout(()=>{
      $('calc')?.click();
      setTimeout(()=>{
        const result=snapshot();
        const afterProfit=currentProfitFor(result,batchView);
        advisorAppliedSnapshots[key].afterProfit=afterProfit;
        const delta=afterProfit-currentProfitFor(s,batchView);
        const outcome=afterProfit>0?' — Now profitable!':afterProfit===0?' — At break-even.':' — Still showing a loss.';
        showAdvisorApplyToast('✓ '+cfg.title+' applied successfully. Profit: '+money(afterProfit)+(Math.abs(delta)>0.004?' ('+(delta>=0?'↑ ':'↓ ')+money(Math.abs(delta))+')':'')+outcome,delta>=0?'good':'neutral');
        render();
      },120);
    },40);
    return;
  }

  const saved=advisorAppliedSnapshots[key];
  advisorInternalChange=true;
  try{
    Object.entries(saved.before).forEach(([id,value])=>{
      const el=$(id);if(!el)return;
      el.value=value;
      el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
    });
  }finally{advisorInternalChange=false;}
  delete advisorAppliedSnapshots[key];

  setTimeout(()=>{
    $('calc')?.click();
    setTimeout(()=>{
      showAdvisorApplyToast('↩ '+cfg.title+' undone. The previous calculator value has been restored.','neutral');
      render();
    },120);
  },40);
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
    applySingleAdvisorSuggestion(key);
    return;
  }
  const review=e.target&&e.target.closest?e.target.closest('#ppProfitAdvisor [data-advisor-review]'):null;
  if(review){
    e.preventDefault();
    e.stopPropagation();
    goToReviewTarget(review.getAttribute('data-advisor-review'));
    return;
  }
  const batch=e.target&&e.target.closest?e.target.closest('#ppProfitAdvisor [data-advisor-batch]'):null;
  if(batch){
    e.preventDefault();
    e.stopPropagation();
    document.querySelector('#resultTabs .tab[data-result-tab="batch"]')?.click();
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
  if(e.target&&e.target.matches('input,select,textarea')){
    if(advisorInternalChange)return;
    advisorAppliedSnapshots={};
    advisorScenario=null;
    setTimeout(()=>render(),20);
  }
});
document.addEventListener('change',e=>{
  if(e.target&&e.target.closest?.('#ppProfitAdvisor'))return;
  if(e.target&&e.target.matches('input,select,textarea')){
    if(advisorInternalChange)return;
    advisorAppliedSnapshots={};
    advisorScenario=null;
    setTimeout(()=>render(),20);
  }
});
document.querySelectorAll('#resultTabs .tab').forEach(b=>b.addEventListener('click',()=>setTimeout(render,20)));
window.addEventListener('storage',()=>setTimeout(render,20));
document.addEventListener('printprofit-settings-changed',()=>{setTimeout(render,30);});
boot();

})();