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
    singleNote:'Based on the current single-print result.'
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
    singleNote:'Na podstawie bieżącego wyniku pojedynczego wydruku.'
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
    singleNote:'Basierend auf dem aktuellen Einzel-Druck-Ergebnis.'
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
    singleNote:'Basé sur le résultat actuel d’une impression.'
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
    singleNote:'Basado en el resultado actual de una impresión.'
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
    singleNote:'Basato sul risultato attuale di una singola stampa.'
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
    singleNote:'Gebaseerd op het huidige resultaat van één print.'
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
    singleNote:'Com base no resultado atual de uma impressão.'
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
    singleNote:'Na základě aktuálního výsledku jednoho tisku.'
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
    singleNote:'Baserat på det aktuella resultatet för en utskrift.'
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
    singleNote:'Baseret på det aktuelle resultat for ét print.'
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

  return {qty,disc,hours,materialCost,elec,depreciation,labour,packagingOther,delivery,deliveryCharge,base,sell,fees,profit,margin,breakEven,target30,batchProfit,batchBreakEven,batchTarget30};
}

function focusField(id){
  const el=$(id);
  if(!el)return false;
  try{
    const top=el.getBoundingClientRect().top+window.scrollY-110;
    window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
  }catch(e){
    try{el.scrollIntoView({behavior:'smooth',block:'center'});}catch(_){}
  }
  setTimeout(()=>{
    try{
      el.focus({preventScroll:true});
      el.style.outline='2px solid var(--accent,#ff7800)';
      el.style.outlineOffset='2px';
      setTimeout(()=>{el.style.outline='';el.style.outlineOffset='';},1400);
    }catch(e){try{el.focus();}catch(_){}}
  },350);
  return true;
}

function addStyles(){
  if($('ppProfitAdvisorStyles'))return;
  const s=document.createElement('style');
  s.id='ppProfitAdvisorStyles';
  s.textContent=`
    .pp-profit-advisor{margin-top:12px;border:1px solid var(--line,#24404e);border-radius:12px;padding:12px;background:linear-gradient(180deg,var(--panel2,#0e202b),var(--panel,#0b1821));}
    .pp-profit-head{display:flex;align-items:flex-start;gap:9px;}
    .pp-profit-icon{width:32px;height:32px;flex:0 0 32px;border-radius:9px;background:var(--accent,#ff7800);display:grid;place-items:center;color:#fff;font-weight:900;font-size:16px;}
    .pp-profit-head h3{margin:0;font-size:14px;}
    .pp-profit-head p{margin:3px 0 0;color:var(--muted,#aebdca);font-size:10.5px;line-height:1.4;}
    .pp-profit-stats{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:10px 0 8px;}
    .pp-profit-stat{border:1px solid var(--line,#24404e);border-radius:9px;padding:8px;background:rgba(255,255,255,.02);}
    .pp-profit-stat span{display:block;color:var(--muted,#aebdca);font-size:9px;}
    .pp-profit-stat strong{display:block;margin-top:3px;font-size:14px;}
    .pp-profit-section-title{margin:10px 0 6px;color:var(--accent,#ff7800);font-size:9px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;}
    .pp-profit-item{display:flex;gap:8px;padding:8px 0;border-top:1px solid rgba(127,160,175,.12);}
    .pp-profit-item:first-of-type{border-top:0;}
    .pp-profit-item-icon{width:25px;height:25px;flex:0 0 25px;border-radius:7px;border:1px solid var(--line,#24404e);display:grid;place-items:center;font-size:12px;}
    .pp-profit-item-main{min-width:0;flex:1;}
    .pp-profit-item-main strong{display:block;font-size:10.5px;}
    .pp-profit-item-main p{margin:3px 0 0;color:var(--muted,#aebdca);font-size:9.5px;line-height:1.42;}
    .pp-profit-review{margin-top:6px;border:1px solid var(--line,#24404e);background:var(--panel2,#0e202b);color:var(--text,#f5f8fb);border-radius:7px;padding:5px 7px;font:800 9px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;}
    .pp-profit-review:hover{border-color:var(--accent,#ff7800);color:var(--accent,#ff7800);}
    .pp-profit-note{margin-top:8px;padding-top:8px;border-top:1px solid rgba(127,160,175,.12);color:var(--muted,#aebdca);font-size:9px;line-height:1.4;}
    @media(max-width:650px){.pp-profit-stats{grid-template-columns:1fr}.pp-profit-advisor{padding:10px;}}
    body[data-pp-theme="light"] .pp-profit-advisor{background:linear-gradient(180deg,#fff,#edf3f6)!important;border-color:#b8c9d1!important;color:#17232b!important;}
    body[data-pp-theme="light"] .pp-profit-stat,body[data-pp-theme="light"] .pp-profit-item-icon{border-color:#c5d2d8!important;background:#f6f9fa!important;}
    body[data-pp-theme="light"] .pp-profit-head p,body[data-pp-theme="light"] .pp-profit-item-main p,body[data-pp-theme="light"] .pp-profit-note,body[data-pp-theme="light"] .pp-profit-stat span{color:#5d707b!important;}
    body[data-pp-theme="light"] .pp-profit-review{background:#fff!important;color:#17232b!important;border-color:#c5d2d8!important;}
  `;
  document.head.appendChild(s);
}

function buildItem(icon,titleKey,body,actionId){
  const item=document.createElement('div');
  item.className='pp-profit-item';
  item.innerHTML='<div class="pp-profit-item-icon">'+icon+'</div><div class="pp-profit-item-main"><strong>'+titleKey+'</strong><p>'+body+'</p>'+(actionId?'<button type="button" class="pp-profit-review" data-pp-review-target="'+actionId+'">'+t('review')+'</button>':'')+'</div>';
  return item;
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

  const lead=shownProfit<0
    ? t('negativeLead',{amount:money(Math.abs(shownProfit))})
    : shownProfit>0
      ? t('positiveLead')
      : t('noData');

  box.innerHTML='';
  const head=document.createElement('div');
  head.className='pp-profit-head';
  head.innerHTML='<div class="pp-profit-icon">💡</div><div><h3>'+t('title')+'</h3><p>'+lead+'</p></div>';
  box.appendChild(head);

  if(!hasData)return true;

  const stats=document.createElement('div');
  stats.className='pp-profit-stats';
  const be=batchView?s.batchBreakEven:s.breakEven;
  const t30=batchView?s.batchTarget30:s.target30;
  stats.innerHTML='<div class="pp-profit-stat"><span>'+t('breakEven')+'</span><strong>'+ (be===null?'—':money(be)) +'</strong></div><div class="pp-profit-stat"><span>'+t('target')+'</span><strong>'+ (t30===null?'—':money(t30)) +'</strong></div>';
  box.appendChild(stats);

  const title=document.createElement('div');
  title.className='pp-profit-section-title';
  title.textContent=t('opportunities');
  box.appendChild(title);

  const items=[];
  if(s.materialCost>0)items.push({score:s.materialCost,key:'material',icon:'🧵',body:t('materialBody',{amount:money(s.materialCost)}),target:'materialPackCost'});
  if(s.labour>0){
    const fiveMin=Math.max(0,num('labourRate')*5/60);
    items.push({score:s.labour,key:'labour',icon:'👷',body:t('labourBody',{amount:money(s.labour),saving:money(fiveMin)}),target:'labourRate'});
  }
  if(s.packagingOther>0)items.push({score:s.packagingOther,key:'packaging',icon:'📦',body:t('packagingBody',{amount:money(s.packagingOther)}),target:'pack'});
  if(s.delivery>0)items.push({score:s.delivery,key:'delivery',icon:'🚚',body:t('deliveryBody',{amount:money(s.delivery)}),target:'deliveryCourier'});
  if(s.fees>0)items.push({score:s.fees,key:'fees',icon:'🛒',body:t('feesBody',{amount:money(s.fees)}),target:'platformSelect'});
  if(s.elec>0)items.push({score:s.elec,key:'electricity',icon:'⚡',body:t('electricityBody',{amount:money(s.elec)}),target:'electricityRate'});
  if(s.depreciation>0)items.push({score:s.depreciation,key:'machine',icon:'🖨',body:t('machineBody',{amount:money(s.depreciation)}),target:'printer'});
  if(s.sell>0 || shownProfit<0)items.push({score:shownProfit<0?Math.max(1,Math.abs(shownProfit)):0,key:'price',icon:'💷',body:t('priceBody',{amount:money(s.sell),breakEven:be===null?'—':money(be)}),target:'sell'});
  items.push({score:-1,key:'printSettings',icon:'🧱',body:t('printSettingsBody'),target:null});

  const printTip=items.find(i=>i.key==='printSettings');
  const topItems=items.filter(i=>i.key!=='printSettings').sort((a,b)=>b.score-a.score).slice(0,4);
  if(printTip)topItems.push(printTip);
  topItems.forEach(item=>{
    const el=buildItem(item.icon,t(item.key),item.body,item.target);
    box.appendChild(el);
  });

  const note=document.createElement('div');
  note.className='pp-profit-note';
  note.textContent=batchView?t('batchNote'):t('singleNote');
  box.appendChild(note);
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
  focusField(button.getAttribute('data-pp-review-target'));
});
document.addEventListener('input',e=>{
  if(e.target&&e.target.matches('input,select,textarea'))setTimeout(render,20);
});
document.addEventListener('change',e=>{
  if(e.target&&e.target.matches('input,select,textarea'))setTimeout(render,20);
});
document.querySelectorAll('#resultTabs .tab').forEach(b=>b.addEventListener('click',()=>setTimeout(render,20)));
window.addEventListener('storage',()=>setTimeout(render,20));
document.addEventListener('printprofit-settings-changed',()=>{setTimeout(render,30);});
boot();

})();