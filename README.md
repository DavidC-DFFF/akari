# Akari Generator

Generateur de grilles Akari / Light Up en HTML, CSS et JavaScript vanilla.

L'application cree des grilles logiques, verifie leur unicite avec un solveur, permet de jouer directement dans le canvas, puis exporte les grilles et leurs solutions en PNG HD.

## Utilisation

Ouvrir `index.html` dans un navigateur.

Aucune installation n'est necessaire : le projet ne depend d'aucun package externe.

## Fonctionnalites

- Choix limite a deux formats : 4x4 et 6x6.
- Generation de grilles Akari resolubles par logique.
- Score de difficulte de resolution sur 100 apres chaque generation.
- Mode 4x4 calibre sur des grilles compactes : 5 indices numerotes, minimum de 3 a 5 ampoules, unicite et analyse des deductions directes/indirectes.
- Mode 6x6 calibre sur des grilles compactes : 9 a 12 indices visibles, minimum de 6 a 11 ampoules, cases noires muettes possibles, unicite et analyse logique.
- Interaction dans la grille :
  - clic gauche : poser une ampoule ;
  - clic droit : poser une croix ;
  - clic sur une case deja marquee : effacer son contenu.
- Detection des conflits en rouge.
- Message `Well done` et effet cotillons lorsque la grille est resolue.
- Export PNG HD de la grille vierge et de la solution.
- Generation en lot jusqu'a 99 grilles, telechargees dans un seul fichier ZIP.

## Difficultes

```text
4x4
6x6
```

Le score affiche apres generation est normalise sur 100. Il combine les criteres logiques de la grille : minimum d'ampoules, repartition des indices, contraintes indirectes, nombre d'iterations du solveur et densite des deductions.

## Export en lot

Indiquer le nombre de grilles a generer, puis cliquer sur le bouton de generation en lot.

Le ZIP est nomme avec le format :

```text
4x4-12grilles.zip
6x6-24grilles.zip
```

Les fichiers contenus dans le ZIP suivent ce format :

```text
4x4-73-01.png
sol-4x4-73-01.png
4x4-68-02.png
sol-4x4-68-02.png
```

`xx` correspond au score de difficulte de resolution sur 100, et `yy` au numero de la grille dans le lot. Les scores inferieurs a 10 sont prefixes par un zero, par exemple `4x4-08-01.png`. Les solutions sont prefixees par `sol-`.

Pour les exports simples, l'index utilise `00`, par exemple :

```text
6x6-84-00.png
sol-6x6-84-00.png
```

## Structure

```text
index.html   Interface
styles.css   Mise en page
script.js    Generation, solveur, rendu canvas et export
```

## Notes

Les PNG sont exportes en haute definition avec un facteur de rendu x4.

La generation est aleatoire : si une grille ne correspond pas aux criteres du format choisi, elle est rejetee et une nouvelle tentative est lancee.
