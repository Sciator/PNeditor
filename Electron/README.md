# RW-PNet EDITOR

### Priority

**FUNKCIONALITA > VZHLED > OPTIMALIZACE**
  - Pou��v�n� a aktualizace pozn�mek
  - Z�kladn� funkcionalita
  - P�e�ten� kn�ky
  - Pr�b�n� dokumentace
  - Text obhajoba

## TODO

  - Odebrat vygenerovan� *.JS soubory jednotliv� z gitu
  - Taby pro jednotliv� s�t�
  - Vytvo�it stavov� JSON kter� bude ur�ovat p�echody mezi m�dy a jejich chov�n�(pro my� kl�vesnici atd.)
bude ulo�en� p��mo v editoru jako default settings (definice enum� kter� budou d�le�it� pro fungov�n� budou zvl᚝ v ts nebo d.ts souboru)
  - Blackbox
    - Univerzal IN/OUT/SCAN(scan = p�e�ten� jestli hodnota spl�uje po�et bez odebr�n�) (pro s�t� kter� budou m�t jen tyto transformace a ��dn� dal�� speci�ln� se bude d�t pou��t zobrazen� podobn� transformaci pokud bude m�t speci�ln�(pojmenovan�) pak budou vazna�en� labely nebo zna�kami)
    - Pravidla pro vytv��en� subs�t�, co mus� subs�t� spl�ovat
    - Pravidla pro vstupy a v�stupy(nemus� b�t v�bec sub-s� pouze m� definovan� chovan�)
  - Distributed run
  - R�zn� mo�nosti ukl�d�n�
    - Pouze pomoc� transitions
    - Se subs�t�mi ve stejn�m souboru/v r�zn�ch souborech
  - Mo�nost editov�n� textov� (stromu/JSON/vlastn� form�t ...) b�hem zobrazovan� zm�n do editoru

##### Generov�n� s�t�

  - Pr�ce se sekvencemi(streamy)
  - Definuj� se r�zn� sekvence vstup� a v�stup� p�i zadan�ch vstupech a automaticky se vygeneruje s� co spl�uje tyto parametry
  - Implementace a simulace turingova stroje pomoc� Petri net

### Algoritmy

**v�echny algoritmy(anal�zy/�pravy/generov�n�) budou funcion�ln�** (p�ed� se jim kopie s�t� nebo ��sti a vr�t� hodnotu se kterou se pak d�l pracuje)
Pou��t javascript-workery/[node child process](https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a)
  - v�echny algoritmy budou spou�t� hlavn� univerz�ln� algoritmus kter� bude m�t p��stup ke v�em mo�nostem �prav a anal�z s�t� kter� n�sledn� vybere podle definice algoritmu kter� data se maj� p�edat algoritmu a jak se pak pracuje s v�sledkem
  - Jednoduch� propojov�n� v�ce algoritm� dohromady(nap� vytvo�en� postup� )
  - Rozd�len� algoritm�:
    - Pouze Analitick�(ne-edituj�c�)
    - Edituj�c�
  - Mo�nost v�po�tu CPU-synchron�/CPU-paralleln�/GPU-na GPU.js
    - V�b�r GPU/CPU pu�t�n�m benchmarku
  - Mo�nost vykreslen� v�stupu algoritmu pomoc� [Dot lang](https://en.wikipedia.org/wiki/DOT_(graph_description_language))
  - Determinizace s�t� - vynucen� priority operac�(u�ivatelsk� zad�n� priority jednotliv�ch transition)
  - Determinizace s�t� - (anal�za jetli je to mo�n�) vytvo�en� deterministick� s�t� kter� simuluje nedeterministickou (vyhled�v�n� n�jak�ho c�lov�ho parametru / ohodnocen�)
  - Speci�ln� reachibility (rozd�len� s�t� na ��sti, ozna�en� stavu invariatn�ch ��st�, p�id�n� prom�nn�ch kter� umo�n� redukci n�kter�ch nekone�n�ch graf�)
  - Koncepty s�e pou��vaj�c� logick� a synchroniza�n� primitiva(flip-flop,And,or ... Simulace logick�ch obvod�?)
  - Invalidace anal�z p�i zm�n� s�t� (op�tovn� p�epo��t�n� invariant)
  - mo�nost pracovat s rekurzivn�m algoritmem - vyhled�v�n� idempotentn� operace = konec rekurze

#### V�stupy

 - Tisk (png/html/svg/pdf ...) - r�zn� nastaven� (zobrazit v�sledky anal�z / zv�raznit povolen� transitions)
 - Do [Dot lang](http://thegarywilson.com/blog/2011/drawing-petri-nets/)
 - Do LateXu

#### Uk�zky

  - [Oriented graph creator](https://bl.ocks.org/cjrd/6863459)
  - [Force graph](http://jsfiddle.net/689Qj/)

### Optimalizace

  - NATIVE (C++ dodatek pro javascript pou��v� se p�es import)
  - Komunikace s jin�m programem p�es stdin/stdout/stderr -> [node child process](https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a)
  - [SVG animace pomoc� rAF](http://bl.ocks.org/pjanik/5169968)
  - -trace-opt -trace-deopt

### Vzhled

  - Zobrazov�n� pohybu s�t� animace
  - Featury pro GUI
    - Stromov� zobrazov�n� subs�t�

### V�ci nav�c

  - Propojov�n� s I/O (kl�vesnice, displej pro vykreslov�n� pixel�)
  - Generov�n� k�du ze s�t� - Vlastnosti s�t� kter� se mus� splnit aby �lo ze s�t� generovat k�d

### Pozn�mky k obhajob�

  - Nepsat zad�n�, ps�t pouze obsah hotov�ho, p�edst�rat �e zad�n� nen�
  - Zn�me technologie zm�nit ale nep�ib�r� detailn�
  - Nakonec zhodnocen� co aplikace um�, co bych do budoucna dod�lal
  - Srovn�n� s existuj�c�mi programy (co m�j program um� l�pe, co p�in�� nov�ho)

[JS variable validator](https://mothereff.in/js-variables)
New Features at [Keep](https://keep.google.com/).