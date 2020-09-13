# RW-PNet EDITOR

## Priority

  - každý objekt vlasní soubor
  - každá záložka bude mít vlastní stav 
  - (nìkteré stavy budou reagovat na pøechod na jinou záložku nìkteré ne)
  - dokumentovat hotové vìci

**FUNKCIONALITA > VZHLED > OPTIMALIZACE**
  - Používání a aktualizace poznámek -> Pøed každým commitem úpravy
  - Základní funkcionalita
  - Pøeètení knížky
  - Prùbìžná dokumentace
  - Text obhajoba
  - Buildování pomocí "build" v cmd

## TODO


  - [ ] cílová architktura editoru
    - Model
      - obsahuje data
      - stará se o serializaci
      - modely na sebe mùžou navzájem odkazovat a mìnit se podle Action
      - model obsahuje VŠECHNY data(vè. vybraných objektù)
    - Actions 
      - obslužná tøída pro modely
      - umožòuje spouštìní analýz a všechny editace modelù
    - DRAW
      - vykresluje model v svg
    - Compound
      - zpracovává uživatelský vstup -> propojuje pomocí callbackù draw->actions
    - Service
      - obsluhuje Taby
      - ukládá/naèítá modely
      - zpracovává vzájemné referencování modelù

  - [ ] analýza rozdìlení kódu do souborù
  - [ ] show hitboxes
  - [ ] Vykreslování abstrakce
    - [ ] [Definice API](#vykreslovani-modelu)
    - [ ] Implementace
  - [ ] Historie zmìn
    - [x] Undo/Redo
    - [ ] Výpis všech zmìn
      - [ ] Diference (zmìny v síti)
      - [ ] PNet umožòuje serializaci a deserializaci diferencí
      - [ ] Speciální výpis -> vyfiltruje postup tak že bude pouze pøidávání a názvy
    - [ ] Koleèko grupování
    - [ ] Tlaèítka + Zkratky(controlbar-main)
    - [ ] Možnost uložit sí� s historií zmìn
  - [ ] Property bar
  - [ ] [Context menu](#Context-menu)
    - [ ] Analýza
    - [ ] Round menu
  - [ ] Grid
    - [ ] Combobox (velikosti gridu/zapínání vypínání)
  - [ ] Labeled places (zobrazování písmen v places místo poètu a vedle zobrazení markings)
  - [ ] 
  - [x] Drag
    - [x] Posouvání jednolivých objektù
    - [x] Závislost dragování na mousemode
    - [x] Selekce v svg více objektù
    - [x] Posouvání více vybraných objektù
  - [ ] [Multiple selection](#Selections)
    - [ ] Integrace v property bar
    - [ ] Kopírování výbìru
    - [ ] Vložit výbìr jako (normálnì/subsí�/vložit bez vybraných vlastností/všechny markings jiné ....)? 
  - [ ] Taby pro jednotlivé sítì
    - [x] Implementace
    - [ ] Zavøení posledního tabu
    - [ ] Modal s upozornìním na uložení zmìn
    - [ ] Zkratky (ctrl+tab/ctrl+shift+tab/ctrl+n/ctrl+w...)
    - [ ] Scroll/zobrazení listu dolù tlaèítkem (pøi zaplnìní obrazovky)
    - [ ] Prohazování tabù tažením(drag)
    - [x] Køížek pro zavøení
      - [ ] možnost skrytí všech køížkù
    - [ ] Delší najetí zobrazí property sítì
    - [ ] Vložení sítì z tabu do aktuálnì otevøeného tabu jako subsí�
  - [ ] Tranformace featury
    - [ ] Tlaèítko(foreign) pro otoèení arc
    - [ ] Obojsmìrné transformace (GUI tlaèítko umožnující zobrazit druhý textbox)
    - [ ] Scan arcs
  - [ ] Barevné schémata
    - [ ] vybrat tøi rùzné barevné schémata
    - [ ] nastavitelné barvy
  - [ ] [Analýza + soupis stavù](#nastaveni-stavy)(vhodnì pro budoucí vytvoøení dokumentace)
    - [ ] Implementace
      - [X] Nejdøíve pouze checkboxy
      - [ ] Toggles [speciální](https://proto.io/freebies/onoff/) (toggle button/switch CSS)
      - [ ] Pøidání možnosti uživatelského nastavení 
(skopírování defaultního nastavení - tím vytvoøení souboru pro uživatelskou editaci)
      - [ ] Možnost uživatelského nastavení kde jsou 
        uložené pouze diference s defaultním nastavením
  - [ ] hitboxy pro elementy sítì (stejnì jako jsou pro arc), 
každý element sítì tvoøený pomocí g - uniformní pøístup(v kaŸdém g bude tvar který bude hitbox vždy bude navrchu a prùhledný ale klikatelný)
  - [ ] Blackbox
    - [ ] [Pravidla](#subsite-pravidla) pro vytváøení subsítí, co musí subsítí splòovat
    - [ ] základní Implementace subsítí [IN/OUT/SCAN](#IOC) (funguje jako transformace - jeden vstup, jeden výstup, jeden scan (scan = pøeètení jestli hodnota splòuje poèet bez odebrání)) 
    - [ ] pokroèílé sítì - "pojmenované IOS+Combined transformace" pak budou vaznaèené labely nebo znaèkami(obojí?)
    - [ ] Pravidla pro vstupy a výstupy(nemusí být vùbec sub-sí� pouze má definované chovaní)
  - [ ] Scoping (promìnné pro transition... - rùzné režimy jedné sítì)
    - [ ] Analýza
  - [ ] Distributed run
  - [ ] Ovládání pouze klávesnicí
    - [ ] Analýza
    - [ ] Implementace zkratek / focus / add / move ...(rozepsat)
  - Rùzné možnosti ukládání
    - Pouze pomocí transitions
    - Se subsítìmi ve stejném souboru/v rùzných souborech
  - [ ] Možnost editování textovì (stromu/JSON/vlastní formát ...)
bìhem zobrazovaní zmìn do editoru(**vyžaduje [Automatické pozice](#autopos)**)
  - [ ] Spojování places/Transitions dragem
  - [ ] snížit citlivost dragu
  - [ ] multiwindow editor ?
  - [ ] Projektové soubory



### Algoritmy

**všechny algoritmy(analýzy/úpravy/generování) budou funcionální** (pøedá se jim kopie sítì nebo èásti a vrátí hodnotu se kterou se pak dál pracuje)
Použít javascript-workery/[node child process](https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a)
  
  - [ ] Zobrazovaní invariantu vybarvováním obvodu (place/transition/arc)
  - [ ] Automatické pøepoèítávání algoritmù
  
  - [ ] Koncepty sí�e používající logická a synchronizaèní primitiva(flip-flop,And,or ... Simulace logických obvodù?)
    
  - [ ] v pøípadì dlouhého výpoètu algoritmu bude výpoèet lazy
    - [ ] Invalidace analýz pøi zmìnì sítì (opìtovné pøepoèítání invariant)
  - [ ] Algoritmy 
    - [ ] Reachability graf (lazy vykreslování pro nekoneèné)
    - [ ] 1-bounded net
    - [ ] pokud sí� 1-bounded -> umožnit reachability aby byl formou zápisu názvù places
    - [ ] scenario-based

  - [ ] Možnost vykreslení výstupu algoritmu pomocí [Dot lang](https://en.wikipedia.org/wiki/DOT_(graph_description_language))

#### Generování sítí

  - Práce se sekvencemi(streamy)
  - Definují se rùzné sekvence vstupù a výstupù pøi zadaných vstupech a automaticky se vygeneruje sí� co splòuje tyto parametry
  - Implementace a simulace turingova stroje pomocí Petri net

### Výstupy

 - [ ] Tisk (png/html/svg/pdf ...) - rùzné nastavení (zobrazit výsledky analýz / zvýraznit povolené transitions)
 - [ ] Do [Dot lang](http://thegarywilson.com/blog/2011/drawing-petri-nets/)
 - [ ] Do LateXu

### Ukázky

  - [Oriented graph creator](https://bl.ocks.org/cjrd/6863459)
  - [Force graph](http://jsfiddle.net/689Qj/)

### Optimalizace

  - [ ] dotahování sítí asynchronì (i subsítí?)
  - NATIVE (C++ dodatek pro javascript používá se pøes import)
  - Komunikace s jiným programem pøes stdin/stdout/stderr -> [node child process](https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a)
  - [x] [SVG animace pomocí rAF](http://bl.ocks.org/pjanik/5169968)
  - -trace-opt -trace-deopt

### Vzhled

  - [ ] [](#){#autopos} Automatické pozice elementù tak aby se nepøekrívali
  - [ ] pøi vkládání možnost zapnout force která odtlaèí pøekrývající se elementy od sebe
  - [ ] Opravit køížení arc(algoritmus rozplétání)
  - [ ] Zobrazování pohybu sítì animace
  - Featury pro GUI
    - [ ] Stromové zobrazování subsítí
  - [ ] Context menu circle selector

### Vìci navíc

  - [ ] Propojování s I/O (klávesnice, displej pro vykreslování pixelù)
  - [ ] Generování kódu ze sítì - Vlastnosti sítí které se musí splnit aby šlo ze sítì generovat kód
  
### Ostatní

  - [x] Odebrat vygenerované *.JS soubory jednotlivì z gitu

### Poznámky k obhajobì

  - Nepsat zadání, psát pouze obsah hotového, pøedstírat že zadání není
  - Známe technologie zmínit ale nepøibírá detailnì
  - Nakonec zhodnocení co aplikace umí, co bych do budoucna dodìlal
  - Srovnání s existujícími programy (co mùj program umí lépe, co pøináší nového)

[JS variable validator](https://mothereff.in/js-variables)
New Features at [Keep](https://keep.google.com/).



# Dokumentace
[Architektura editoru](https://codepen.io/TheRW/pen/GzxxYV) (až bude kompletní tak zkopírovat sem jako obrázek)

## Ovládání

### Výbìry (Selections){#Selections}
Elementy modelu mohou být vybrané buï v režimu single/multiple(/all)


## Definice - PNet

### Transformace{#IOC}

 - IN Transformace - Transformace která má externí vstup(mùže být implementovaný jako scan vstup)
 - OUT Transformace - Transformace která má externí výstup 

### Arc

 - IN - z place do Transformace (záporné èíslo)
 - OUT - z Transformace do place (záporné èíslo)
 - Combined - kombinace IN i OUT arc (obì mezi jednou transformací a jendím place)
   - Scan - speciální combined která vrací stejnì kolik bere (výsledek neovlivní place)


## Nastavení
tor se nachází vždy v nìjaké množinì stavù která je složena minímalnì z hlavního stavu.
Množina stavù mùže obsahovat navíc pøepínací stavy. 
Mezi stavy se pøechází událostmi nebo zmìnou pøepínaèù. 

  - Hlavní stav
    - Minimálnì default, možnost pøecházení mezi stavy akcemi
  - [Výbìr - Selections](#Selections)
  - Pøepínací stavy (øízené pøepínacími tlaèítky - pøepnutí tlaèítka taky bráno jako událost)
    - Toggle 

### Události
Události jsou vnìjší vlivy(uživatelský vstup...) pùsobící na editor.
Zpùsobují pøechody mezi stavy

  - Click, RightClick, DoubleClick
  - Drag
  - Scroll
  - Keyboard, KeyPressed, klávesové zkratky
  - (Dropdown soubor/vložení ze schránky)

### Akce
Definují co se dìje pøi pøechody mezi stavy.
Mùže se jednat o akce aplikované na jeden nebo výbìr elementù.
Možnost jednotlivých akcí omezena podle podle událostí? 
(akce nemùže být pøiøazena událestem pro které nedává smysl)

  - souvysející s elementy modelu
    - Pøidání
    - Odebrání
    - Úprava
      - Vyžaduje definovat editovací okno s množinou možných vstupù
    - Pøesun
      - Implementován pomocí spleci
    - Akce na elementu

## Subsítì

### Pravidla{#subsite-pravidla}


## Vykreslování{#vykreslovani-modelu}
obsahuje definice jak se budou vykreslovat elementy daného modelu. pøedávání nastavení-režimù?
sada funkcí do kterých se pøedávají callbacky a element modelu a vrátí vykreslený element(?)
Definice tlaèítek v context menu v daném stavu(mode, selection...)

## Context menu

  - Delete