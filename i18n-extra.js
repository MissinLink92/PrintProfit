(()=>{'use strict';
const EXTRA={
pl:{
'Settings':'Ustawienia','Guide & Help':'Przewodnik i pomoc','Price Finder':'Wyszukiwarka cen','Calculator':'Kalkulator',
'Suggested Improvements':'Sugerowane usprawnienia','Reset all suggestions':'Resetuj wszystkie sugestie','Reduce material usage':'Zmniejsz zużycie materiału',
'Lowering infill, wall count or supports can reduce material usage. Test the effect here first.':'Zmniejszenie wypełnienia, liczby ścian lub podpór może ograniczyć zużycie materiału. Najpierw sprawdź efekt tutaj.',
'High impact':'Duży wpływ','Medium impact':'Średni wpływ','Lower impact':'Mniejszy wpływ','Current':'Obecnie','Suggested':'Sugerowane','New profit':'Nowy zysk','Live Result':'Wynik na żywo',
'Reduce labour time':'Skróć czas pracy','Test removing setup, cleanup or other hands-on time from each print.':'Sprawdź, co się stanie po skróceniu czasu przygotowania, sprzątania lub innych czynności przy każdym wydruku.',
'Lower delivery cost':'Obniż koszt dostawy','Compare the lower reference rate below with what you currently pay.':'Porównaj niższą stawkę referencyjną z tym, co obecnie płacisz.',
'Adjust selling price':'Dostosuj cenę sprzedaży','A small price change can make a big difference once fees are included.':'Niewielka zmiana ceny może mieć duży wpływ po uwzględnieniu opłat.',
'Use cheaper material':'Użyj tańszego materiału','Test a lower material cost per print while keeping the same print settings.':'Sprawdź niższy koszt materiału na wydruk przy zachowaniu tych samych ustawień.',
'Current profit':'Bieżący zysk','Break-even Price':'Cena progu rentowności','Target price · 30% margin':'Cena docelowa · marża 30%','Sales price':'Cena sprzedaży',
'Per batch':'Na partię','Per print':'Na wydruk','Minimum price to not lose money':'Minimalna cena bez straty','Using current fee assumptions':'Przy obecnych założeniach opłat','Change below to test it':'Zmień poniżej, aby sprawdzić',
'Material usage':'Zużycie materiału','Labour saved':'Oszczędzony czas pracy','Delivery':'Dostawa','Selling price':'Cena sprzedaży','Material cost':'Koszt materiału',
'Apply these changes to calculator':'Zastosuj te zmiany w kalkulatorze','Copy summary':'Kopiuj podsumowanie','Still not profitable?':'Nadal bez zysku?',
'See the full 3D Printing Profit Guide ↗':'Zobacz pełny przewodnik po zyskownym druku 3D ↗','Tip:':'Wskazówka:','These suggestions are estimates based on your current settings. Adjust any value and the result updates in real time.':'Te sugestie są szacunkami na podstawie bieżących ustawień. Zmień dowolną wartość, a wynik zaktualizuje się w czasie rzeczywistym.',
'Currently at a loss':'Obecnie strata','Currently profitable':'Obecnie zysk','Add your print costs':'Dodaj koszty wydruku','Use the sliders below to test changes in real time before applying them.':'Użyj suwaków poniżej, aby na bieżąco testować zmiany przed ich zastosowaniem.',
'You\'re losing ':'Tracisz ',' per batch item.':' na sztuce w partii.','With these changes the estimate moves into profit.':'Po tych zmianach szacunek przechodzi na zysk.','Keep adjusting the suggestions to see where the loss closes.':'Dostosowuj sugestie, aby zobaczyć, gdzie strata znika.',
'Profit Toolkit':'Narzędzia zysku','See where your money goes, test changes safely and price your print with the current fee assumptions.':'Zobacz, gdzie idą pieniądze, bezpiecznie testuj zmiany i wyceniaj wydruk przy obecnych założeniach opłat.',
'What If? — test changes before you make them':'Co jeśli? — testuj zmiany przed ich wprowadzeniem','Cost Breakdown — see what is eating the margin':'Podział kosztów — zobacz, co zabiera marżę','Price Ladder — see the price needed for different margins':'Drabina cen — zobacz ceny potrzebne dla różnych marż','Bulk Buy — check savings on material and packaging':'Zakup hurtowy — sprawdź oszczędności materiału i opakowań','Sell Where? — test a different selling channel':'Gdzie sprzedawać? — przetestuj inny kanał sprzedaży',
'Production cost per print':'Koszt produkcji na wydruk','Production subtotal':'Suma produkcji','Batch production cost':'Koszt produkcji partii','List sales':'Sprzedaż wg ceny bazowej','Batch discount':'Rabat partii','Sales after discount':'Sprzedaż po rabacie','Platform/payment fees':'Opłaty platformy/płatności','Delivery charged':'Opłata pobrana za dostawę','Batch profit':'Zysk z partii'
},
de:{
'Settings':'Einstellungen','Guide & Help':'Anleitung & Hilfe','Price Finder':'Preissuche','Calculator':'Kalkulator',
'Suggested Improvements':'Verbesserungsvorschläge','Reset all suggestions':'Alle Vorschläge zurücksetzen','Reduce material usage':'Materialverbrauch reduzieren',
'Lowering infill, wall count or supports can reduce material usage. Test the effect here first.':'Weniger Infill, Wände oder Stützen können den Materialverbrauch senken. Teste den Effekt zuerst hier.',
'High impact':'Hoher Einfluss','Medium impact':'Mittlerer Einfluss','Lower impact':'Geringerer Einfluss','Current':'Aktuell','Suggested':'Vorschlag','New profit':'Neuer Gewinn','Live Result':'Live-Ergebnis',
'Reduce labour time':'Arbeitszeit reduzieren','Test removing setup, cleanup or other hands-on time from each print.':'Teste weniger Einrichtungs-, Reinigungs- oder sonstige Handarbeit pro Druck.',
'Lower delivery cost':'Versandkosten senken','Compare the lower reference rate below with what you currently pay.':'Vergleiche den günstigeren Referenztarif mit deinen aktuellen Kosten.',
'Adjust selling price':'Verkaufspreis anpassen','A small price change can make a big difference once fees are included.':'Eine kleine Preisänderung kann nach Gebühren einen großen Unterschied machen.',
'Use cheaper material':'Günstigeres Material verwenden','Test a lower material cost per print while keeping the same print settings.':'Teste niedrigere Materialkosten pro Druck bei gleichen Druckeinstellungen.',
'Current profit':'Aktueller Gewinn','Break-even Price':'Break-even-Preis','Target price · 30% margin':'Zielpreis · 30 % Marge','Sales price':'Verkaufspreis',
'Per batch':'Pro Charge','Per print':'Pro Druck','Minimum price to not lose money':'Mindestpreis ohne Verlust','Using current fee assumptions':'Mit aktuellen Gebührenannahmen','Change below to test it':'Unten ändern, um zu testen',
'Material usage':'Materialverbrauch','Labour saved':'Gesparte Arbeitszeit','Delivery':'Versand','Selling price':'Verkaufspreis','Material cost':'Materialkosten',
'Apply these changes to calculator':'Diese Änderungen auf den Rechner anwenden','Copy summary':'Zusammenfassung kopieren','Still not profitable?':'Noch nicht profitabel?',
'See the full 3D Printing Profit Guide ↗':'Vollständige Anleitung für profitablen 3D-Druck ↗','Tip:':'Tipp:','These suggestions are estimates based on your current settings. Adjust any value and the result updates in real time.':'Diese Vorschläge sind Schätzungen auf Basis deiner aktuellen Einstellungen. Jede Änderung aktualisiert das Ergebnis in Echtzeit.',
'Currently at a loss':'Derzeit Verlust','Currently profitable':'Derzeit profitabel','Add your print costs':'Druckkosten hinzufügen','Use the sliders below to test changes in real time before applying them.':'Teste mit den Reglern Änderungen in Echtzeit, bevor du sie anwendest.',
'You\'re losing ':'Du verlierst ',' per batch item.':' pro Chargenstück.','With these changes the estimate moves into profit.':'Mit diesen Änderungen wird die Schätzung profitabel.','Keep adjusting the suggestions to see where the loss closes.':'Passe die Vorschläge weiter an, bis der Verlust verschwindet.',
'Profit Toolkit':'Gewinn-Werkzeugkasten','See where your money goes, test changes safely and price your print with the current fee assumptions.':'Sieh, wohin dein Geld geht, teste Änderungen sicher und kalkuliere mit den aktuellen Gebührenannahmen.',
'What If? — test changes before you make them':'Was wäre wenn? — Änderungen vorab testen','Cost Breakdown — see what is eating the margin':'Kostenaufteilung — was schmälert die Marge?','Price Ladder — Preise für verschiedene Margen','Bulk Buy — check savings on material and packaging':'Großeinkauf — Material- und Verpackungsersparnis prüfen','Sell Where? — test a different selling channel':'Wo verkaufen? — anderen Verkaufskanal testen',
'Production cost per print':'Produktionskosten pro Druck','Production subtotal':'Produktionssumme','Batch production cost':'Produktionskosten der Charge','List sales':'Listenumsatz','Batch discount':'Chargenrabatt','Sales after discount':'Umsatz nach Rabatt','Platform/payment fees':'Plattform-/Zahlungsgebühren','Delivery charged':'Berechneter Versand','Batch profit':'Chargengewinn'
},
fr:{
'Settings':'Paramètres','Guide & Help':'Guide et aide','Price Finder':'Recherche de prix','Calculator':'Calculateur',
'Suggested Improvements':'Améliorations suggérées','Reset all suggestions':'Réinitialiser les suggestions','Reduce material usage':'Réduire la consommation de matériau',
'Lowering infill, wall count or supports can reduce material usage. Test the effect here first.':'Réduire le remplissage, les parois ou les supports peut diminuer le matériau utilisé. Testez l’effet ici.',
'High impact':'Fort impact','Medium impact':'Impact moyen','Lower impact':'Impact moindre','Current':'Actuel','Suggested':'Suggéré','New profit':'Nouveau bénéfice','Live Result':'Résultat en direct',
'Reduce labour time':'Réduire le temps de travail','Test removing setup, cleanup or other hands-on time from each print.':'Testez une réduction du temps de préparation, de nettoyage ou d’autres tâches manuelles.',
'Lower delivery cost':'Réduire le coût de livraison','Compare the lower reference rate below with what you currently pay.':'Comparez le tarif de référence inférieur à ce que vous payez actuellement.',
'Adjust selling price':'Ajuster le prix de vente','A small price change can make a big difference once fees are included.':'Une petite variation de prix peut faire une grande différence après les frais.',
'Use cheaper material':'Utiliser un matériau moins cher','Test a lower material cost per print while keeping the same print settings.':'Testez un coût de matériau inférieur par impression avec les mêmes paramètres.',
'Current profit':'Bénéfice actuel','Break-even Price':'Prix d’équilibre','Target price · 30% margin':'Prix cible · marge de 30 %','Sales price':'Prix de vente',
'Per batch':'Par lot','Per print':'Par impression','Minimum price to not lose money':'Prix minimum sans perte','Using current fee assumptions':'Avec les frais actuels','Change below to test it':'Modifiez ci-dessous pour tester',
'Material usage':'Consommation de matériau','Labour saved':'Temps de travail économisé','Delivery':'Livraison','Selling price':'Prix de vente','Material cost':'Coût du matériau',
'Apply these changes to calculator':'Appliquer ces changements au calculateur','Copy summary':'Copier le résumé','Still not profitable?':'Toujours pas rentable ?',
'See the full 3D Printing Profit Guide ↗':'Voir le guide complet sur la rentabilité en impression 3D ↗','Tip:':'Astuce :','These suggestions are estimates based on your current settings. Adjust any value and the result updates in real time.':'Ces suggestions sont des estimations basées sur vos réglages actuels. Modifiez une valeur et le résultat se met à jour en temps réel.',
'Currently at a loss':'Actuellement en perte','Currently profitable':'Actuellement rentable','Add your print costs':'Ajoutez vos coûts d’impression','Use the sliders below to test changes in real time before applying them.':'Utilisez les curseurs pour tester les changements en temps réel avant de les appliquer.',
'You\'re losing ':'Vous perdez ',' per batch item.':' par article du lot.','With these changes the estimate moves into profit.':'Avec ces changements, l’estimation devient rentable.','Keep adjusting the suggestions to see where the loss closes.':'Continuez à ajuster les suggestions jusqu’à supprimer la perte.',
'Profit Toolkit':'Boîte à outils rentabilité','See where your money goes, test changes safely and price your print with the current fee assumptions.':'Voyez où va votre argent, testez des changements en toute sécurité et fixez le prix avec les frais actuels.',
'What If? — test changes before you make them':'Et si ? — testez les changements avant de les appliquer','Cost Breakdown — see what is eating the margin':'Répartition des coûts — ce qui réduit la marge','Price Ladder — see the price needed for different margins':'Échelle de prix — prix nécessaires pour différentes marges','Bulk Buy — check savings on material and packaging':'Achat en volume — vérifiez les économies de matériau et d’emballage','Sell Where? — test a different selling channel':'Où vendre ? — testez un autre canal de vente',
'Production cost per print':'Coût de production par impression','Production subtotal':'Sous-total de production','Batch production cost':'Coût de production du lot','List sales':'Ventes au prix catalogue','Batch discount':'Remise du lot','Sales after discount':'Ventes après remise','Platform/payment fees':'Frais de plateforme/paiement','Delivery charged':'Livraison facturée','Batch profit':'Bénéfice du lot'
},
es:{
'Settings':'Ajustes','Guide & Help':'Guía y ayuda','Price Finder':'Buscador de precios','Calculator':'Calculadora',
'Suggested Improvements':'Mejoras sugeridas','Reset all suggestions':'Restablecer sugerencias','Reduce material usage':'Reducir el uso de material',
'Lowering infill, wall count or supports can reduce material usage. Test the effect here first.':'Reducir el relleno, las paredes o los soportes puede reducir el material usado. Prueba el efecto aquí.',
'High impact':'Alto impacto','Medium impact':'Impacto medio','Lower impact':'Menor impacto','Current':'Actual','Suggested':'Sugerido','New profit':'Nuevo beneficio','Live Result':'Resultado en directo',
'Reduce labour time':'Reducir tiempo de trabajo','Test removing setup, cleanup or other hands-on time from each print.':'Prueba a reducir el tiempo de preparación, limpieza u otras tareas manuales.',
'Lower delivery cost':'Reducir coste de entrega','Compare the lower reference rate below with what you currently pay.':'Compara la tarifa de referencia más baja con lo que pagas actualmente.',
'Adjust selling price':'Ajustar precio de venta','A small price change can make a big difference once fees are included.':'Un pequeño cambio de precio puede marcar una gran diferencia tras incluir las comisiones.',
'Use cheaper material':'Usar material más barato','Test a lower material cost per print while keeping the same print settings.':'Prueba un coste de material menor por impresión manteniendo los mismos ajustes.',
'Current profit':'Beneficio actual','Break-even Price':'Precio de equilibrio','Target price · 30% margin':'Precio objetivo · margen del 30 %','Sales price':'Precio de venta',
'Per batch':'Por lote','Per print':'Por impresión','Minimum price to not lose money':'Precio mínimo sin pérdidas','Using current fee assumptions':'Con las comisiones actuales','Change below to test it':'Cámbialo abajo para probar',
'Material usage':'Uso de material','Labour saved':'Tiempo de trabajo ahorrado','Delivery':'Entrega','Selling price':'Precio de venta','Material cost':'Coste de material',
'Apply these changes to calculator':'Aplicar estos cambios a la calculadora','Copy summary':'Copiar resumen','Still not profitable?':'¿Aún no es rentable?',
'See the full 3D Printing Profit Guide ↗':'Ver la guía completa de rentabilidad de impresión 3D ↗','Tip:':'Consejo:','These suggestions are estimates based on your current settings. Adjust any value and the result updates in real time.':'Estas sugerencias son estimaciones basadas en tus ajustes actuales. Cambia cualquier valor y el resultado se actualiza en tiempo real.',
'Currently at a loss':'Actualmente en pérdidas','Currently profitable':'Actualmente rentable','Add your print costs':'Añade tus costes de impresión','Use the sliders below to test changes in real time before applying them.':'Usa los controles de abajo para probar cambios en tiempo real antes de aplicarlos.',
'You\'re losing ':'Estás perdiendo ',' per batch item.':' por unidad del lote.','With these changes the estimate moves into profit.':'Con estos cambios, la estimación pasa a ser rentable.','Keep adjusting the suggestions to see where the loss closes.':'Sigue ajustando las sugerencias para ver dónde desaparece la pérdida.',
'Profit Toolkit':'Herramientas de beneficio','See where your money goes, test changes safely and price your print with the current fee assumptions.':'Consulta a dónde va tu dinero, prueba cambios con seguridad y calcula el precio con las comisiones actuales.',
'What If? — test changes before you make them':'¿Qué pasaría? — prueba cambios antes de aplicarlos','Cost Breakdown — see what is eating the margin':'Desglose de costes — descubre qué reduce el margen','Price Ladder — see the price necesario para diferentes márgenes':'Escala de precios — ve el precio necesario para distintos márgenes','Bulk Buy — check savings on material and packaging':'Compra al por mayor — comprueba el ahorro en material y embalaje','Sell Where? — test a different selling channel':'¿Dónde vender? — prueba otro canal de venta',
'Production cost per print':'Coste de producción por impresión','Production subtotal':'Subtotal de producción','Batch production cost':'Coste de producción del lote','List sales':'Ventas sin descuento','Batch discount':'Descuento del lote','Sales after discount':'Ventas tras descuento','Platform/payment fees':'Comisiones de plataforma/pago','Delivery charged':'Entrega cobrada','Batch profit':'Beneficio del lote'
},
it:{
'Settings':'Impostazioni','Guide & Help':'Guida e aiuto','Price Finder':'Ricerca prezzi','Calculator':'Calcolatore',
'Suggested Improvements':'Miglioramenti suggeriti','Reset all suggestions':'Reimposta suggerimenti','Reduce material usage':'Riduci uso del materiale',
'High impact':'Alto impatto','Medium impact':'Impatto medio','Lower impact':'Impatto ridotto','Current':'Attuale','Suggested':'Suggerito','New profit':'Nuovo profitto','Live Result':'Risultato in tempo reale',
'Reduce labour time':'Riduci il tempo di lavoro','Lower delivery cost':'Riduci il costo di consegna','Adjust selling price':'Modifica il prezzo di vendita','Use cheaper material':'Usa un materiale più economico',
'Current profit':'Profitto attuale','Break-even Price':'Prezzo di pareggio','Target price · 30% margin':'Prezzo obiettivo · margine 30%','Sales price':'Prezzo di vendita',
'Per batch':'Per lotto','Per print':'Per stampa','Minimum price to not lose money':'Prezzo minimo senza perdita','Using current fee assumptions':'Con le commissioni attuali','Change below to test it':'Modifica sotto per provare',
'Material usage':'Uso del materiale','Labour saved':'Lavoro risparmiato','Delivery':'Consegna','Selling price':'Prezzo di vendita','Material cost':'Costo del materiale',
'Apply these changes to calculator':'Applica queste modifiche al calcolatore','Copy summary':'Copia riepilogo','Still not profitable?':'Non è ancora redditizio?',
'See the full 3D Printing Profit Guide ↗':'Vedi la guida completa alla redditività della stampa 3D ↗','Tip:':'Suggerimento:','Currently at a loss':'Attualmente in perdita','Currently profitable':'Attualmente redditizio','Add your print costs':'Aggiungi i costi di stampa',
'You\'re losing ':'Stai perdendo ',' per batch item.':' per pezzo del lotto.','With these changes the estimate moves into profit.':'Con queste modifiche la stima passa in profitto.','Keep adjusting the suggestions to see where the loss closes.':'Continua a modificare i suggerimenti finché la perdita non scompare.',
'Profit Toolkit':'Strumenti di profitto','What If? — test changes before you make them':'E se? — prova le modifiche prima di applicarle','Cost Breakdown — see what is eating the margin':'Analisi dei costi — cosa riduce il margine','Price Ladder — see the price needed for different margins':'Scala prezzi — prezzo necessario per diversi margini','Bulk Buy — check savings on material and packaging':'Acquisto in volume — controlla il risparmio','Sell Where? — test a different selling channel':'Dove vendere? — prova un altro canale',
'Production cost per print':'Costo di produzione per stampa','Production subtotal':'Subtotale produzione','Batch production cost':'Costo di produzione del lotto','List sales':'Vendite senza sconto','Batch discount':'Sconto lotto','Sales after discount':'Vendite dopo lo sconto','Platform/payment fees':'Commissioni piattaforma/pagamento','Delivery charged':'Consegna addebitata','Batch profit':'Profitto del lotto'
},
nl:{
'Settings':'Instellingen','Guide & Help':'Handleiding & hulp','Price Finder':'Prijszoeker','Calculator':'Calculator',
'Suggested Improvements':'Voorgestelde verbeteringen','Reset all suggestions':'Alle suggesties resetten','Reduce material usage':'Materiaalverbruik verlagen',
'High impact':'Grote impact','Medium impact':'Gemiddelde impact','Lower impact':'Lagere impact','Current':'Huidig','Suggested':'Suggestie','New profit':'Nieuwe winst','Live Result':'Live resultaat',
'Reduce labour time':'Arbeidstijd verlagen','Lower delivery cost':'Bezorgkosten verlagen','Adjust selling price':'Verkoopprijs aanpassen','Use cheaper material':'Goedkoper materiaal gebruiken',
'Current profit':'Huidige winst','Break-even Price':'Break-evenprijs','Target price · 30% margin':'Doelprijs · 30% marge','Sales price':'Verkoopprijs',
'Per batch':'Per batch','Per print':'Per print','Minimum price to not lose money':'Minimumprijs zonder verlies','Using current fee assumptions':'Met huidige kosten','Change below to test it':'Pas hieronder aan om te testen',
'Material usage':'Materiaalverbruik','Labour saved':'Bespaarde arbeidstijd','Delivery':'Levering','Selling price':'Verkoopprijs','Material cost':'Materiaalkosten',
'Apply these changes to calculator':'Deze wijzigingen toepassen op calculator','Copy summary':'Samenvatting kopiëren','Still not profitable?':'Nog steeds niet winstgevend?',
'See the full 3D Printing Profit Guide ↗':'Volledige gids voor winstgevende 3D-printing ↗','Tip:':'Tip:','Currently at a loss':'Momenteel verlies','Currently profitable':'Momenteel winstgevend','Add your print costs':'Voeg printkosten toe',
'You\'re losing ':'Je verliest ',' per batch item.':' per batch-item.','With these changes the estimate moves into profit.':'Met deze wijzigingen wordt de schatting winstgevend.','Keep adjusting the suggestions to see where the loss closes.':'Blijf de suggesties aanpassen tot het verlies verdwijnt.',
'Profit Toolkit':'Winsttools','What If? — test changes before you make them':'Wat als? — test wijzigingen vooraf','Cost Breakdown — see what is eating the margin':'Kostenverdeling — wat drukt de marge?','Price Ladder — benodigde prijs voor marges':'Prijsladder — benodigde prijs voor verschillende marges','Bulk Buy — check savings on material and packaging':'Bulkinkoop — besparing op materiaal en verpakking','Sell Where? — test a different selling channel':'Waar verkopen? — test een ander verkoopkanaal',
'Production cost per print':'Productiekosten per print','Production subtotal':'Productiesubtotaal','Batch production cost':'Productiekosten batch','List sales':'Verkoop zonder korting','Batch discount':'Batchkorting','Sales after discount':'Verkoop na korting','Platform/payment fees':'Platform-/betaalkosten','Delivery charged':'Doorberekende levering','Batch profit':'Batchwinst'
},
pt:{
'Settings':'Definições','Guide & Help':'Guia e ajuda','Price Finder':'Pesquisa de preços','Calculator':'Calculadora',
'Suggested Improvements':'Melhorias sugeridas','Reset all suggestions':'Repor sugestões','Reduce material usage':'Reduzir consumo de material',
'High impact':'Alto impacto','Medium impact':'Impacto médio','Lower impact':'Menor impacto','Current':'Atual','Suggested':'Sugerido','New profit':'Novo lucro','Live Result':'Resultado em tempo real',
'Reduce labour time':'Reduzir tempo de trabalho','Lower delivery cost':'Reduzir custo de entrega','Adjust selling price':'Ajustar preço de venda','Use cheaper material':'Usar material mais barato',
'Current profit':'Lucro atual','Break-even Price':'Preço de equilíbrio','Target price · 30% margin':'Preço alvo · margem de 30%','Sales price':'Preço de venda',
'Per batch':'Por lote','Per print':'Por impressão','Minimum price to not lose money':'Preço mínimo sem perda','Using current fee assumptions':'Com as taxas atuais','Change below to test it':'Altere abaixo para testar',
'Material usage':'Consumo de material','Labour saved':'Tempo de trabalho poupado','Delivery':'Entrega','Selling price':'Preço de venda','Material cost':'Custo do material',
'Apply these changes to calculator':'Aplicar estas alterações à calculadora','Copy summary':'Copiar resumo','Still not profitable?':'Ainda não é rentável?',
'See the full 3D Printing Profit Guide ↗':'Ver o guia completo de rentabilidade da impressão 3D ↗','Tip:':'Sugestão:','Currently at a loss':'Atualmente em prejuízo','Currently profitable':'Atualmente rentável','Add your print costs':'Adicione os custos de impressão',
'You\'re losing ':'Está a perder ',' per batch item.':' por unidade do lote.','With these changes the estimate moves into profit.':'Com estas alterações a estimativa passa a lucro.','Keep adjusting the suggestions to see where the loss closes.':'Continue a ajustar as sugestões até eliminar o prejuízo.',
'Profit Toolkit':'Ferramentas de lucro','What If? — test changes before you make them':'E se? — teste alterações antes de as aplicar','Cost Breakdown — veja o que está a consumir a margem':'Análise de custos — veja o que reduz a margem','Price Ladder — veja o preço necessário para diferentes margens':'Escada de preços — preços para diferentes margens','Bulk Buy — check savings on material and packaging':'Compra em volume — verifique as poupanças','Sell Where? — test a different selling channel':'Onde vender? — teste outro canal',
'Production cost per print':'Custo de produção por impressão','Production subtotal':'Subtotal de produção','Batch production cost':'Custo de produção do lote','List sales':'Vendas sem desconto','Batch discount':'Desconto do lote','Sales after discount':'Vendas após desconto','Platform/payment fees':'Taxas de plataforma/pagamento','Delivery charged':'Entrega cobrada','Batch profit':'Lucro do lote'
},
cs:{
'Settings':'Nastavení','Guide & Help':'Průvodce a nápověda','Price Finder':'Vyhledávač cen','Calculator':'Kalkulačka',
'Suggested Improvements':'Navržená zlepšení','Reset all suggestions':'Resetovat všechny návrhy','Reduce material usage':'Snížit spotřebu materiálu',
'High impact':'Velký dopad','Medium impact':'Střední dopad','Lower impact':'Menší dopad','Current':'Aktuální','Suggested':'Návrh','New profit':'Nový zisk','Live Result':'Výsledek v reálném čase',
'Reduce labour time':'Snížit pracovní čas','Lower delivery cost':'Snížit cenu doručení','Adjust selling price':'Upravit prodejní cenu','Use cheaper material':'Použít levnější materiál',
'Current profit':'Aktuální zisk','Break-even Price':'Cena bodu zvratu','Target price · 30% margin':'Cílová cena · marže 30 %','Sales price':'Prodejní cena',
'Per batch':'Na dávku','Per print':'Na tisk','Minimum price to not lose money':'Minimální cena bez ztráty','Using current fee assumptions':'Při současných poplatcích','Change below to test it':'Upravte níže pro test',
'Material usage':'Spotřeba materiálu','Labour saved':'Ušetřený pracovní čas','Delivery':'Doručení','Selling price':'Prodejní cena','Material cost':'Cena materiálu',
'Apply these changes to calculator':'Použít tyto změny v kalkulačce','Copy summary':'Kopírovat shrnutí','Still not profitable?':'Stále není zisk?',
'See the full 3D Printing Profit Guide ↗':'Zobrazit úplného průvodce ziskovým 3D tiskem ↗','Tip:':'Tip:','Currently at a loss':'Nyní ve ztrátě','Currently profitable':'Nyní ziskové','Add your print costs':'Přidejte náklady tisku',
'You\'re losing ':'Ztrácíte ',' per batch item.':' na kus dávky.','With these changes the estimate moves into profit.':'Po těchto změnách se odhad dostává do zisku.','Keep adjusting the suggestions to see where the loss closes.':'Upravujte návrhy, dokud ztráta nezmizí.',
'Profit Toolkit':'Nástroje zisku','What If? — test changes before you make them':'Co kdyby? — otestujte změny před použitím','Cost Breakdown — see what is eating the margin':'Rozpis nákladů — co snižuje marži?','Price Ladder — see the cenu needed for different margins':'Cenový žebřík — ceny pro různé marže','Bulk Buy — check savings on material and packaging':'Velkoobchod — zkontrolujte úspory','Sell Where? — test a different selling channel':'Kde prodávat? — otestujte jiný kanál',
'Production cost per print':'Výrobní náklad na tisk','Production subtotal':'Mezisoučet výroby','Batch production cost':'Výrobní náklad dávky','List sales':'Prodej bez slevy','Batch discount':'Sleva dávky','Sales after discount':'Prodej po slevě','Platform/payment fees':'Poplatky platformy/platby','Delivery charged':'Účtované doručení','Batch profit':'Zisk dávky'
},
sv:{
'Settings':'Inställningar','Guide & Help':'Guide och hjälp','Price Finder':'Prissökning','Calculator':'Kalkylator',
'Suggested Improvements':'Föreslagna förbättringar','Reset all suggestions':'Återställ alla förslag','Reduce material usage':'Minska materialåtgång',
'High impact':'Hög påverkan','Medium impact':'Medelhög påverkan','Lower impact':'Lägre påverkan','Current':'Aktuell','Suggested':'Föreslagen','New profit':'Ny vinst','Live Result':'Live-resultat',
'Reduce labour time':'Minska arbetstid','Lower delivery cost':'Sänk leveranskostnad','Adjust selling price':'Justera försäljningspris','Use cheaper material':'Använd billigare material',
'Current profit':'Aktuell vinst','Break-even Price':'Nollpunktspris','Target price · 30% margin':'Målpris · 30 % marginal','Sales price':'Försäljningspris',
'Per batch':'Per batch','Per print':'Per utskrift','Minimum price to not lose money':'Minimipris utan förlust','Using current fee assumptions':'Med aktuella avgifter','Change below to test it':'Ändra nedan för att testa',
'Material usage':'Materialåtgång','Labour saved':'Sparad arbetstid','Delivery':'Leverans','Selling price':'Försäljningspris','Material cost':'Materialkostnad',
'Apply these changes to calculator':'Tillämpa ändringarna i kalkylatorn','Copy summary':'Kopiera sammanfattning','Still not profitable?':'Fortfarande inte lönsamt?',
'See the full 3D Printing Profit Guide ↗':'Se hela guiden för lönsam 3D-utskrift ↗','Tip:':'Tips:','Currently at a loss':'Förlust just nu','Currently profitable':'Lönsam just nu','Add your print costs':'Lägg till utskriftskostnader',
'You\'re losing ':'Du förlorar ',' per batch item.':' per batchartikel.','With these changes the estimate moves into profit.':'Med dessa ändringar blir uppskattningen lönsam.','Keep adjusting the suggestions to see where the loss closes.':'Justera förslagen tills förlusten försvinner.',
'Profit Toolkit':'Vinstverktyg','What If? — test changes before you make them':'Tänk om? — testa ändringar innan du använder dem','Cost Breakdown — see what is eating the margin':'Kostnadsfördelning — vad äter upp marginalen?','Price Ladder — see the price needed for different margins':'Prissteg — pris för olika marginaler','Bulk Buy — check savings on material and packaging':'Storköp — kontrollera besparingar','Sell Where? — test a different selling channel':'Var sälja? — testa en annan kanal',
'Production cost per print':'Produktionskostnad per utskrift','Production subtotal':'Produktionssumma','Batch production cost':'Produktionskostnad för batch','List sales':'Försäljning före rabatt','Batch discount':'Batchrabatt','Sales after discount':'Försäljning efter rabatt','Platform/payment fees':'Plattforms-/betalavgifter','Delivery charged':'Debiterad leverans','Batch profit':'Batchvinst'
},
da:{
'Settings':'Indstillinger','Guide & Help':'Guide og hjælp','Price Finder':'Prissøgning','Calculator':'Lommeregner',
'Suggested Improvements':'Foreslåede forbedringer','Reset all suggestions':'Nulstil alle forslag','Reduce material usage':'Reducer materialeforbrug',
'High impact':'Stor effekt','Medium impact':'Mellem effekt','Lower impact':'Lavere effekt','Current':'Aktuel','Suggested':'Forslag','New profit':'Nyt overskud','Live Result':'Resultat i realtid',
'Reduce labour time':'Reducer arbejdstid','Lower delivery cost':'Reducer leveringsomkostning','Adjust selling price':'Juster salgspris','Use cheaper material':'Brug billigere materiale',
'Current profit':'Aktuelt overskud','Break-even Price':'Break-even-pris','Target price · 30% margin':'Målpris · 30 % margen','Sales price':'Salgspris',
'Per batch':'Pr. batch','Per print':'Pr. print','Minimum price to not lose money':'Minimumspris uden tab','Using current fee assumptions':'Med aktuelle gebyrer','Change below to test it':'Rediger nedenfor for at teste',
'Material usage':'Materialeforbrug','Labour saved':'Sparet arbejdstid','Delivery':'Levering','Selling price':'Salgspris','Material cost':'Materialeomkostning',
'Apply these changes to calculator':'Anvend ændringer på lommeregneren','Copy summary':'Kopiér oversigt','Still not profitable?':'Stadig ikke rentabel?',
'See the full 3D Printing Profit Guide ↗':'Se den fulde guide til rentabel 3D-print ↗','Tip:':'Tip:','Currently at a loss':'I underskud nu','Currently profitable':'Rentabel nu','Add your print costs':'Tilføj printomkostninger',
'You\'re losing ':'Du taber ',' per batch item.':' pr. enhed i batchen.','With these changes the estimate moves into profit.':'Med disse ændringer bliver estimatet rentabelt.','Keep adjusting the suggestions to see where the loss closes.':'Juster forslagene, indtil underskuddet forsvinder.',
'Profit Toolkit':'Profitværktøjer','What If? — test changes before you make them':'Hvad hvis? — test ændringer først','Cost Breakdown — see what is eating the margin':'Omkostningsfordeling — hvad spiser marginen?','Price Ladder — se prisen der kræves for forskellige marginer':'Pristrin — pris for forskellige marginer','Bulk Buy — check savings on material and packaging':'Storkøb — se besparelser','Sell Where? — test a different selling channel':'Hvor skal du sælge? — test en anden kanal',
'Production cost per print':'Produktionsomkostning pr. print','Production subtotal':'Produktionssubtotal','Batch production cost':'Produktionsomkostning for batch','List sales':'Salg før rabat','Batch discount':'Batchrabat','Sales after discount':'Salg efter rabat','Platform/payment fees':'Platform-/betalingsgebyrer','Delivery charged':'Opkrævet levering','Batch profit':'Batchfortjeneste'
}
};
window.__ppExtraI18n=EXTRA;
window.__ppTranslateText=(value,lang)=>{
 const map=EXTRA[lang]||{};
 if(!value)return value;
 if(map[value])return map[value];
 let out=value;
 const keys=Object.keys(map).filter(k=>k.length>=8).sort((a,b)=>b.length-a.length);
 for(const k of keys){if(out.includes(k))out=out.split(k).join(map[k]);}
 return out;
};
window.__ppApplyStandaloneI18n=()=>{
 const lang=(()=>{try{return JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}').language||'en';}catch(e){return 'en';}})();
 if(lang==='en')return;
 const trans=window.__ppTranslateText;
 const walk=()=>{
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){
   if(!n.parentElement||n.parentElement.closest('script,style'))continue;
   const raw=n.nodeValue;if(!raw.trim())continue;
   const next=trans(raw.trim(),lang);
   if(next!==raw.trim())n.nodeValue=n.nodeValue.replace(raw.trim(),next);
  }
  document.documentElement.lang=lang;
 };
 walk();
 if(window.MutationObserver){
  let timer;
  new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(walk,30);}).observe(document.body,{childList:true,subtree:true});
 }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>window.__ppApplyStandaloneI18n?.(),{once:true});else window.__ppApplyStandaloneI18n?.();
})();