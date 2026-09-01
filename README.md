# BK Delivery Hub

BK DELIVERY — PROMPT COMPLET POUR V0

1. CONTEXTE DU PROJET

Conçois une application web SaaS moderne, professionnelle et production-ready appelée BK Delivery, destinée à une entreprise de livraison à domicile basée à Lomé, Togo.

BK Delivery gère des livraisons de colis légers pouvant être transportés à moto : repas, gâteaux, colis divers et expéditions.

L'application doit remplacer une organisation actuellement basée sur WhatsApp et Excel par une plateforme centralisée permettant de gérer :

les commandes/courses ;

les livreurs ;

les agences / points relais ;

les partenaires ;

les commerciaux ;

les paiements ;

les dus et commissions ;

les notifications ;

les statistiques ;

la géolocalisation des livreurs ;

le suivi des livraisons en temps réel ;

les itinéraires ;

l'historique et la traçabilité.

L'objectif n'est PAS de créer uniquement une landing page ou un simple dashboard.

Je veux une véritable interface complète de logiciel de gestion de livraison, avec plusieurs pages, navigation, tableaux, cartes, filtres, modales, détails, états, graphiques et interactions cohérentes.

2. TECHNOLOGIES FRONTEND

Utilise :

Next.js

React

TypeScript

Tailwind CSS

shadcn/ui

Lucide Icons

Recharts pour les graphiques

L'interface doit être responsive et fonctionner parfaitement sur :

Desktop

Laptop

Tablette

Le design doit être moderne, professionnel, clair et adapté à un logiciel SaaS de logistique.

Ne crée pas de backend réel pour l'instant.

Utilise des données mockées réalistes afin que toutes les interfaces soient visuellement fonctionnelles.

3. STYLE VISUEL

Créer une identité visuelle professionnelle pour BK Delivery.

Style :

moderne ;

premium ;

minimaliste ;

professionnel ;

orienté logistique ;

beaucoup d'informations mais parfaitement organisé ;

excellent contraste ;

cartes avec bordures légères ;

coins légèrement arrondis ;

ombres très discrètes ;

typographie moderne ;

icônes Lucide.

Éviter :

les designs trop colorés ;

les interfaces enfantines ;

les énormes cartes inutiles ;

les gradients excessifs ;

les interfaces ressemblant à des templates génériques.

Le résultat doit donner l'impression d'un véritable logiciel utilisé quotidiennement par une entreprise de livraison.

4. STRUCTURE GLOBALE

Créer une application avec :

Sidebar gauche

Logo :

BK DELIVERY

Sous le logo, navigation :

Tableau de bord

Courses

Dispatch & Carte

Livreurs

Agences

Partenaires

Commerciaux

Tarification

Paiements

Dus & Commissions

Notifications

Rapports

Commentaires

Historique / Audit

Paramètres

En bas :

Profil utilisateur

Agence actuelle

Statut connecté

Déconnexion

La sidebar doit être collapsible.

5. TOPBAR

Créer une barre supérieure contenant :

bouton menu sur mobile ;

recherche globale ;

sélecteur d'agence ;

indicateur de connexion ;

notifications ;

avatar utilisateur ;

nom et rôle de l'utilisateur.

Exemple :

B&K Delivery — Agence Lomé Centre

Utilisateur :

Admin B&K
Administrateur

6. TABLEAU DE BORD

Créer une page Dashboard extrêmement professionnelle.

Titre :

Tableau de bord

Sous-titre :

Vue globale de l'activité de livraison

En haut, sélecteur :

Aujourd'hui

Cette semaine

Ce mois

Personnalisé

Puis KPI cards :

Courses aujourd'hui

52

+12,5%

En cours

14

Livrées

34

En retard

4

Chiffre d'affaires

485 000 FCFA

Livreurs actifs

9 / 12

Montants dus

126 500 FCFA

Incidents

2

Graphiques

Créer :

Évolution des courses

Graphique ligne :

Lundi

Mardi

Mercredi

Jeudi

Vendredi

Samedi

Dimanche

Comparer :

courses créées

courses livrées

Répartition des courses

Donut chart :

En attente

Assignées

En cours

Livrées

Annulées

Litiges

Performance des livreurs

Tableau :

Livreur | Courses | Livrées | En retard | CA généré | Performance

Activité récente

Timeline :

Course #BK-00125 assignée à Koffi

Course #BK-00124 livrée

Nouveau partenaire ajouté

Paiement reçu

Course #BK-00121 signalée en retard

7. MODULE COURSES

Créer une page :

Courses

En haut :

bouton "+ Nouvelle course"

recherche

filtre statut

filtre agence

filtre livreur

filtre zone

filtre partenaire

filtre date

Créer un tableau professionnel :

ID | Date | Partenaire | Départ | Destination | Livreur | Tarif | Statut | Actions

Exemples :

BK-00125
01/09/2026 14:32
Restaurant Le Palais
Agoè
Tokoin
Koffi A.
1 800 FCFA
En cours

Statuts avec badges :

Brouillon

En attente

Assignée

En cours

Livrée

Annulée

Litige

Chaque ligne possède :

Voir

Modifier

Assigner

Voir sur carte

Plus

8. PAGE DÉTAIL D'UNE COURSE

Créer une page détaillée pour une course.

Header :

Course #BK-00125

Badge :

En cours de livraison

Afficher :

Informations générales

Date

Heure

Partenaire

Client

Téléphone

Quantité

Valeur du colis

Frais de livraison

Moyen de paiement

Départ

Adresse complète

Destination

Adresse complète

Livreur

Photo
Nom
Téléphone
Statut
Distance actuelle

Timeline

Créer une vraie timeline :

Commande créée
↓
Course enregistrée
↓
Livreur assigné
↓
Course prise en charge
↓
En cours de livraison
↓
Livrée

Afficher date et heure pour chaque étape.

9. MODULE CENTRAL : DISPATCH & GÉOLOCALISATION

Cette page est extrêmement importante.

Nom :

Dispatch & Carte

Créer une interface de supervision logistique inspirée des logiciels professionnels de dispatch.

Layout :

Partie gauche

Liste des livreurs.

Chaque livreur possède :

photo ;

nom ;

statut ;

distance ;

course actuelle ;

batterie ;

dernière mise à jour ;

agence.

Statuts :

🟢 Disponible
🔵 En livraison
🟠 En pause
🔴 Incident
⚫ Hors ligne

Partie centrale

Grande carte interactive occupant la majorité de l'écran.

Utiliser un composant de carte réaliste/mock si aucune API cartographique n'est disponible.

La carte doit représenter Lomé, Togo.

Afficher :

agences ;

livreurs ;

points de récupération ;

destinations ;

itinéraires.

Utiliser des marqueurs différents.

Exemple :

🛵 Koffi
🛵 Mensah
🛵 Kodjo

10. SUIVI DES LIVREURS EN TEMPS RÉEL

Lorsqu'un livreur est sélectionné :

Afficher un panneau :

Koffi Amégnran

🟢 En livraison

Course :

#BK-00125

Position actuelle :

Agoè

Destination :

Tokoin

Distance restante :

3,2 km

ETA :

12 min

Vitesse :

28 km/h

Dernière position :

14:42:18

Batterie :

76%

Boutons :

Voir profil

Contacter

Voir course

Recentrer la carte

11. ITINÉRAIRE DE LIVRAISON

Lorsqu'une course est sélectionnée sur la carte :

Afficher l'itinéraire :

Agence / Pickup → Destination

Dessiner visuellement le trajet sur la carte.

Afficher :

distance totale ;

distance parcourue ;

distance restante ;

durée estimée ;

heure estimée d'arrivée ;

point de départ ;

position actuelle du livreur ;

destination.

Exemple :

8,4 km
24 min
3,2 km restants
ETA 14:55

Ajouter un bouton :

Recalculer l'itinéraire

12. SUGGESTION AUTOMATIQUE DE LIVREUR

Créer une interface de dispatch.

Lorsqu'une nouvelle course est créée :

Afficher :

Trouver le meilleur livreur

Liste :

1. Koffi Amégnran

🟢 Disponible
1,2 km
4 min
Score 96%

2. Mensah Kodjo

🟢 Disponible
2,1 km
7 min
Score 89%

3. Komlan A.

🟠 En pause
3,8 km
11 min
Score 72%

Afficher le raisonnement :

Distance

Disponibilité

Charge actuelle

Zone

Temps estimé

Bouton :

Assigner à Koffi

Cette fonctionnalité doit être présentée comme une suggestion intelligente de dispatch.

13. HISTORIQUE GPS

Dans les détails d'un livreur ou d'une course, permettre de consulter :

Historique du trajet

Afficher :

parcours effectué ;

heures ;

arrêts ;

distance ;

durée ;

position de départ ;

position d'arrivée.

Créer une timeline :

14:20 — Course acceptée
14:24 — Arrivée au pickup
14:27 — Colis récupéré
14:35 — En route
14:42 — Position actuelle

14. MODULE LIVREURS

Page :

Livreurs

Créer tableau :

Photo | Nom | Téléphone | Agence | Statut | Courses | Performance | Localisation | Actions

Ajouter bouton :

+ Ajouter un livreur

Profil livreur

Créer une fiche complète :

photo ;

nom ;

téléphone ;

agence ;

date d'inscription ;

statut ;

localisation actuelle ;

courses du jour ;

courses du mois ;

revenus ;

commissions ;

taux de livraison à temps ;

historique.

Onglets :

Informations

Courses

Localisation

Revenus

Historique

15. MODULE AGENCES

Créer :

Agences / Points relais

Cards ou tableau :

nom ;

adresse ;

gestionnaire ;

nombre de livreurs ;

courses du jour ;

CA ;

statut.

Ajouter une carte permettant de visualiser les agences.

16. MODULE PARTENAIRES

Créer :

Partenaires

Tableau :

entreprise ;

contact ;

téléphone ;

commercial ;

nombre de courses ;

CA ;

montant dû ;

statut.

Page détail partenaire :

informations ;

historique courses ;

paiements ;

statistiques ;

commentaires.

17. MODULE COMMERCIAUX

Créer :

Commerciaux

Afficher :

nom ;

partenaires rattachés ;

courses générées ;

CA généré ;

commissions ;

commissions dues.

18. MODULE TARIFICATION

Créer une interface permettant à l'administrateur de configurer les prix.

Deux onglets :

Tarification kilométrique

Table :

Distance | Tarif

1-5 km
5-10 km

10 km

Afficher la formule actuelle :

1 à 5 km : 300 FCFA + km × 100 FCFA

5 à 10 km : 1 000 FCFA

>10 km : 1 000 FCFA + kilomètres supplémentaires × 100 FCFA

Tarification par zone

Table :

Zone | Tarif | Statut | Actions

Ajouter :

+ Nouvelle zone

19. MODULE PAIEMENTS

Créer :

Paiements

Afficher :

paiement client ;

paiement partenaire ;

espèces ;

TMoney ;

Flooz ;

statut ;

référence ;

montant ;

date.

Statuts :

En attente

Payé

Échoué

Remboursé

Créer un résumé :

Total encaissé aujourd'hui
485 000 FCFA

Espèces
180 000 FCFA

TMoney
165 000 FCFA

Flooz
140 000 FCFA

20. MODULE DUS & COMMISSIONS

Créer :

Dus & Commissions

Cards :

Dus livreurs

320 500 FCFA

Dus partenaires

185 000 FCFA

Commissions commerciaux

62 000 FCFA

Créer des onglets :

Livreurs

Partenaires

Commerciaux

Clôture journalière

Ajouter :

Clôturer la journée

Afficher un résumé avant confirmation.

21. CLÔTURE DE JOURNÉE

Créer une page/modal professionnelle :

Clôture du 01 septembre 2026

Courses :
52

Livrées :
47

Annulées :
3

Litiges :
2

CA :
785 500 FCFA

Part agence :
157 100 FCFA

Part livreurs :
628 400 FCFA

Commissions :
...

Boutons :

Annuler

Confirmer la clôture

22. NOTIFICATIONS

Créer une page :

Notifications

Catégories :

Courses

Livreurs

Paiements

Incidents

Système

Exemples :

"Course #BK-00125 assignée à Koffi"

"Le livreur Mensah est en retard de 15 minutes"

"Paiement de 5 000 FCFA reçu"

23. COMMENTAIRES & SUGGESTIONS

Créer une page :

Commentaires & Suggestions

Afficher :

auteur ;

rôle ;

sujet ;

course associée ;

date ;

statut ;

réponse.

Statuts :

Nouveau

En cours

Répondu

Fermé

24. RECHERCHE & HISTORIQUE

Créer une page :

Historique

Recherche multicritère :

agence ;

livreur ;

statut ;

zone ;

période ;

partenaire ;

commercial ;

numéro de course.

Afficher tous les changements avec :

Utilisateur
Action
Date
Heure
Objet
Ancienne valeur
Nouvelle valeur

Exemple :

Admin B&K
a assigné la course BK-00125 à Koffi
01/09/2026 — 14:21

25. RAPPORTS

Créer :

Rapports & Analytics

Filtres :

période ;

agence ;

livreur ;

partenaire.

Créer des graphiques :

évolution des courses ;

CA ;

performance livreurs ;

courses par zone ;

courses par agence ;

taux de livraison à temps ;

revenus.

Boutons :

Exporter PDF

Exporter Excel

26. PARAMÈTRES

Créer une page complète avec sidebar interne :

Général

Utilisateurs

Rôles & permissions

Agences

Tarification

Notifications

Paiements

Cartographie

Sécurité

Audit

27. GESTION DES RÔLES

Prévoir quatre expériences utilisateur principales :

Administrateur

Accès complet.

Gestionnaire

Vue limitée à son agence :

courses ;

livreurs ;

dispatch ;

dus ;

partenaires associés ;

statistiques agence.

Livreur

L'application web peut afficher une vue simplifiée mais l'expérience principale sera mobile.

Partenaire / Commercial

Préparer les interfaces nécessaires mais les portails autonomes peuvent être considérés comme phase 2.

28. RESPONSIVE DESIGN

Sur tablette :

sidebar réduite ;

tableaux scrollables ;

cartes adaptatives.

Sur mobile :

Créer une navigation adaptée.

Pour le module Dispatch mobile :

carte en plein écran ;

liste des livreurs sous forme de bottom sheet ;

détails d'une course dans un panneau inférieur ;

boutons d'action facilement accessibles.

29. DONNÉES MOCKÉES

Utiliser des données fictives mais réalistes pour Lomé.

Exemples de zones :

Agoè

Adidogomé

Tokoin

Bè

Nyékonakpoè

Hedzranawoé

Kodjoviakopé

Amoutivé

Lomé Centre

Aéroport

Utiliser des noms togolais réalistes pour les livreurs et gestionnaires.

Utiliser FCFA comme devise.

Les dates doivent être cohérentes avec septembre 2026.

30. INTERACTIONS

L'application doit sembler réellement fonctionnelle.

Implémenter côté frontend :

ouverture des détails ;

filtres ;

recherche ;

changement de statut ;

assignation ;

sélection d'un livreur ;

sélection d'une course ;

navigation entre pages ;

modales ;

dropdowns ;

notifications ;

graphiques interactifs ;

changement d'agence ;

sélection sur carte ;

panneaux latéraux ;

confirmations d'actions.

Les actions peuvent utiliser des données mockées et un état local.

31. CARTE

Pour la carte, concevoir l'interface de manière à pouvoir intégrer ultérieurement :

Google Maps Platform ou Mapbox

Prévoir clairement les emplacements nécessaires pour :

latitude ;

longitude ;

marqueurs ;

itinéraires ;

distance ;

ETA ;

géocodage ;

suivi GPS.

Ne pas prétendre qu'un véritable tracking GPS fonctionne si aucune API n'est connectée.

Utiliser une carte mock réaliste dans le prototype si nécessaire, mais construire l'architecture UI de manière à permettre le remplacement par une vraie carte.

32. ARCHITECTURE DES COMPOSANTS

Créer des composants réutilisables :

AppSidebar

Topbar

StatCard

StatusBadge

DataTable

SearchBar

FilterBar

CourierCard

CourierStatus

DeliveryCard

DeliveryTimeline

MapView

MapMarker

RoutePanel

DispatchPanel

AssignmentModal

PaymentBadge

NotificationPanel

ActivityTimeline

EmptyState

LoadingState

ConfirmationDialog

33. QUALITÉ UI/UX

Accorder une attention particulière à :

hiérarchie visuelle ;

lisibilité ;

espaces ;

alignements ;

cohérence des badges ;

cohérence des boutons ;

états hover ;

états loading ;

états empty ;

états error ;

confirmations ;

accessibilité ;

responsive design.

Chaque page doit avoir un véritable objectif métier.

Ne pas remplir artificiellement les pages avec des éléments inutiles.

34. PRIORITÉ DE CONCEPTION

L'ordre de priorité du produit est :

Dashboard

Courses

Dispatch & Géolocalisation

Détail course

Livreurs

Agences

Tarification

Paiements

Dus & commissions

Partenaires

Commerciaux

Notifications

Rapports

Commentaires

Historique

Paramètres

35. IMPORTANT — RÉSULTAT ATTENDU

Je veux que tu construises le template complet de l'application BK Delivery, et non une simple page de présentation.

Le résultat doit donner l'impression d'une application SaaS réellement prête à être connectée à une API backend.

Créer suffisamment de pages et de composants pour permettre une démonstration complète du workflow :

Création de course
→ calcul du tarif
→ recherche du livreur disponible
→ assignation
→ suivi GPS
→ itinéraire
→ livraison
→ paiement
→ calcul des dus
→ clôture
→ reporting

Le module Dispatch & Géolocalisation doit être l'un des éléments les plus travaillés visuellement, avec une grande carte, les livreurs en temps réel, les courses actives, les itinéraires et les informations ETA.

Ne crée pas uniquement des écrans statiques : relie les différentes interfaces avec des données mockées et des interactions frontend afin que le prototype soit navigable et cohérent.

Le design final doit être suffisamment professionnel pour être présenté au client comme prototype officiel de BK Delivery.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/943138ba-4b2f-4853-b398-92f43e23b7a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
