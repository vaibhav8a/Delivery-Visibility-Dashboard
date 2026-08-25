# Delivery Visibility Dashboard

A single-page delivery-tracking dashboard backed by Cloud Firestore, with
scripts to seed sample data and to check that the security rules behave.

## Layout

| File | Role |
|---|---|
| `index.html` | The dashboard itself |
| `seed-firestore.js` | Seeds Firestore with sample deliveries (`npm run seed`) |
| `seed-firebase.js` | Earlier seeding path, kept as `npm run seed:old` |
| `seed-firebase-rest.sh` | Same seeding over the REST API, no Node required |
| `firebase_sample_data.json` | The sample dataset the seeders load |
| `check-rules.js` | Exercises the Firestore security rules |
| `verify-firestore.js` | Confirms the collection is readable as expected |
| `test-firestore.html`, `firestore-debug.html` | Browser-side connection checks |

Having both a rules check and a read verification matters: rules that are too
open and rules that are too closed both leave the dashboard looking "connected"
until something actually tries to read.

## Running it

```bash
npm install
npm run seed        # populate Firestore from firebase_sample_data.json
```

Then open `index.html` in a browser.

`npm run seed:clear` empties the collection again.

The seeders need Firebase Admin credentials. Supply them through a service
account key kept **outside** the repository — `.gitignore` excludes
`serviceAccountKey.json` and any `*-firebase-adminsdk-*.json` for that reason.
