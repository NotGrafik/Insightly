# 🗳️ Système de Sondage - Application Fullstack avec Node.js, Vue.js & MongoDB

## 📌 Description

Cette application est un système de sondage complet permettant aux utilisateurs de :

- Créer, modifier et supprimer des sondages
- Ajouter des questions (ouvertes ou à choix multiples)
- Répondre à des sondages
- Consulter les sondages disponibles

Le backend est développé en **Node.js (Express)**, la base de données est gérée via **MongoDB**, et le frontend est réalisé en **Vue 3** avec **Vite** et **ShadCN/Vue** pour l’interface utilisateur.

---

## 📁 Fonctionnalités

### Pour les créateurs :
- Création de sondages avec des questions dynamiques
- Modification et suppression des sondages
- Interface sécurisée avec authentification

### Pour les utilisateurs :
- Réponse aux sondages
- Consultation de la liste des sondages disponibles

---

## 🛠️ Stack Technique

| Composant       | Technologie                      |
|----------------|----------------------------------|
| Backend         | Node.js, Express, MongoDB        |
| Frontend        | Vue 3, Vite, ShadCN/Vue          |
| Authentification| JSON Web Token (JWT)              |
| Base de données | MongoDB, Mongoose                 |

---

## 🗃️ Structure de la Base de Données

### Collection `sondages`

```json
{
  "_id": ObjectId,
  "nom": "Sondage Préférences Alimentaires",
  "createur": ObjectId,
  "questions": [
    {
      "_id": ObjectId,
      "intitule": "Quel est votre plat préféré ?",
      "type": "ouverte"
    },
    {
      "_id": ObjectId,
      "intitule": "Quels types de cuisine préférez-vous ?",
      "type": "qcm",
      "reponses": ["Italienne", "Chinoise", "Mexicaine", "Indienne"]
    }
  ]
}
