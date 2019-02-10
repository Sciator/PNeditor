# RW-PNet EDITOR

## Priority

**FUNKCIONALITA > VZHLED > OPTIMALIZACE**
  - Pou��v�n� a aktualizace pozn�mek -> P�ed ka�d�m commitem �pravy
  - Z�kladn� funkcionalita
  - P�e�ten� kn�ky
  - Pr�b�n� dokumentace
  - Text obhajoba

## TODO

  - [ ] Property bar
  - [ ] [Context menu](#Context-menu)
  - [ ] Drag
    - [x] Posouv�n� jednoliv�ch objekt�
    - [ ] Selekce v svg v�ce objekt�
    - [ ] Posouv�n� v�ce vybran�ch objekt�
  - [ ] Multiple selection
    - [ ] Integrace v property bar
  - [ ] Taby pro jednotliv� s�t�
  - [ ] Tranformace featury
    - [ ] Tla��tko(foreign) pro oto�en� arc
    - [ ] Obojsm�rn� transformace (GUI tla��tko umo�nuj�c� zobrazit druh� textbox)
    - [ ] Scan arcs
  - [ ] Vytvo�it stavov� JSON kter� bude ur�ovat p�echody mezi m�dy 
a jejich chov�n�(pro my� kl�vesnici atd.)
bude ulo�en� p��mo v editoru jako default settings 
(definice enum� kter� budou d�le�it� pro fungov�n� budou 
zvl᚝ v ts nebo d.ts souboru)
      - [ ] [Anal�za + soupis stav�](#nastaveni-stavy)(vhodn� pro budouc� vytvo�en� dokumentace)
      - [ ] Implementace
      - [ ] P�id�n� mo�nosti u�ivatelsk�ho nastaven� 
(skop�rov�n� defaultn�ho nastaven� - t�m vytvo�en� souboru pro u�ivatelskou editaci)
      - [ ] mo�nost u�ivatelsk�ho nastaven� kde jsou 
        ulo�en� pouze diference s defaultn�m nastaven�m
  - [ ] hitboxy pro elementy s�t� (stejn� jako jsou pro arc), 
ka�d� element s�t� tvo�en� pomoc� g - uniformn� p��stup(v ka�d�m g bude tvar kter� bude hitbox v�dy bude navrchu a pr�hledn� ale klikateln�)
  - [ ] Blackbox
    - [ ] [Pravidla](#subsite-pravidla) pro vytv��en� subs�t�, co mus� subs�t� spl�ovat
    - [ ] z�kladn� Implementace subs�t� [IN/OUT/SCAN](#IOC) (funguje jako transformace - jeden vstup, jeden v�stup, jeden scan (scan = p�e�ten� jestli hodnota spl�uje po�et bez odebr�n�)) 
    - [ ] pokro��l� s�t� - "pojmenovan� IOS+Combined transformace" pak budou vazna�en� labely nebo zna�kami(oboj�?)
    - [ ] Pravidla pro vstupy a v�stupy(nemus� b�t v�bec sub-s� pouze m� definovan� chovan�)
  - [ ] Distributed run
  - R�zn� mo�nosti ukl�d�n�
    - Pouze pomoc� transitions
    - Se subs�t�mi ve stejn�m souboru/v r�zn�ch souborech
  - [ ] Mo�nost editov�n� textov� (stromu/JSON/vlastn� form�t ...) b�hem zobrazovan� zm�n do editoru



### Algoritmy

**v�echny algoritmy(anal�zy/�pravy/generov�n�) budou funcion�ln�** (p�ed� se jim kopie s�t� nebo ��sti a vr�t� hodnotu se kterou se pak d�l pracuje)
Pou��t javascript-workery/[node child process](https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a)
  - [ ] v�echny algoritmy budou spou�t� hlavn� univerz�ln� algoritmus kter� bude m�t p��stup ke v�em mo�nostem �prav a anal�z s�t� kter� n�sledn� vybere podle definice algoritmu kter� data se maj� p�edat algoritmu a jak se pak pracuje s v�sledkem
  - [ ] Jednoduch� propojov�n� v�ce algoritm� dohromady(nap� vytvo�en� postup� )
  - [ ] Rozd�len� algoritm�:
    - Pouze Analitick�(ne-edituj�c�)
    - Edituj�c�
  - [ ] Mo�nost v�po�tu CPU-synchron�/CPU-paralleln�/GPU-na GPU.js
    - V�b�r GPU/CPU pu�t�n�m benchmarku
  - [ ] Mo�nost vykreslen� v�stupu algoritmu pomoc� [Dot lang](https://en.wikipedia.org/wiki/DOT_(graph_description_language))
  - [ ] Determinizace s�t� - vynucen� priority operac�(u�ivatelsk� zad�n� priority jednotliv�ch transition)
  - [ ] Determinizace s�t� - (anal�za jetli je to mo�n�) vytvo�en� deterministick� s�t� kter� simuluje nedeterministickou (vyhled�v�n� n�jak�ho c�lov�ho parametru / ohodnocen�)
  - [ ] Speci�ln� reachibility (rozd�len� s�t� na ��sti, ozna�en� stavu invariatn�ch ��st�, p�id�n� prom�nn�ch kter� umo�n� redukci n�kter�ch nekone�n�ch graf�)
  - [ ] Koncepty s�e pou��vaj�c� logick� a synchroniza�n� primitiva(flip-flop,And,or ... Simulace logick�ch obvod�?)
  - [ ] Invalidace anal�z p�i zm�n� s�t� (op�tovn� p�epo��t�n� invariant)
  - [ ] mo�nost pracovat s rekurzivn�m algoritmem - vyhled�v�n� idempotentn� operace = konec rekurze

#### Generov�n� s�t�

  - Pr�ce se sekvencemi(streamy)
  - Definuj� se r�zn� sekvence vstup� a v�stup� p�i zadan�ch vstupech a automaticky se vygeneruje s� co spl�uje tyto parametry
  - Implementace a simulace turingova stroje pomoc� Petri net

### V�stupy

 - [ ] Tisk (png/html/svg/pdf ...) - r�zn� nastaven� (zobrazit v�sledky anal�z / zv�raznit povolen� transitions)
 - [ ] Do [Dot lang](http://thegarywilson.com/blog/2011/drawing-petri-nets/)
 - [ ] Do LateXu

### Uk�zky

  - [Oriented graph creator](https://bl.ocks.org/cjrd/6863459)
  - [Force graph](http://jsfiddle.net/689Qj/)

### Optimalizace

  - NATIVE (C++ dodatek pro javascript pou��v� se p�es import)
  - Komunikace s jin�m programem p�es stdin/stdout/stderr -> [node child process](https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a)
  - [SVG animace pomoc� rAF](http://bl.ocks.org/pjanik/5169968)
  - -trace-opt -trace-deopt

### Vzhled

  - [ ] Zobrazov�n� pohybu s�t� animace
  - Featury pro GUI
    - [ ] Stromov� zobrazov�n� subs�t�
  - [ ] Context menu circle selector

### V�ci nav�c

  - [ ] Propojov�n� s I/O (kl�vesnice, displej pro vykreslov�n� pixel�)
  - [ ] Generov�n� k�du ze s�t� - Vlastnosti s�t� kter� se mus� splnit aby �lo ze s�t� generovat k�d
  
### Ostatn�

  - [x] Odebrat vygenerovan� *.JS soubory jednotliv� z gitu

### Pozn�mky k obhajob�

  - Nepsat zad�n�, ps�t pouze obsah hotov�ho, p�edst�rat �e zad�n� nen�
  - Zn�me technologie zm�nit ale nep�ib�r� detailn�
  - Nakonec zhodnocen� co aplikace um�, co bych do budoucna dod�lal
  - Srovn�n� s existuj�c�mi programy (co m�j program um� l�pe, co p�in�� nov�ho)

[JS variable validator](https://mothereff.in/js-variables)
New Features at [Keep](https://keep.google.com/).



# Dokumentace

## Definice

### Transformace{#IOC}

 - IN Transformace - Transformace kter� m� extern� vstup(m��e b�t implementovan� jako scan vstup)
 - OUT Transformace - Transformace kter� m� extern� v�stup 

### Arc

 - IN - z place do Transformace (z�porn� ��slo)
 - OUT - z Transformace do place (z�porn� ��slo)
 - Combined - kombinace IN i OUT arc (ob� mezi jednou transformac� a jend�m place)
   - Scan - speci�ln� combined kter� vrac� stejn� kolik bere (v�sledek neovlivn� place)


## Nastaven�

### Stavy{#nastaveni-stavy}


## Subs�t�

### Pravidla{#subsite-pravidla}


## Context menu

  - Delete