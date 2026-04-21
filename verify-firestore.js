const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

async function verify() {
    try {
        // Find service account
        const serviceAccountPaths = [
            path.join(__dirname, 'tracking-visibility-firebase-adminsdk-fbsvc-dce07ec99d.json'),
            path.join(process.env.HOME, 'Downloads', 'tracking-visibility-firebase-adminsdk-fbsvc-dce07ec99d.json')
        ];

        let serviceAccount = null;
        for (const filePath of serviceAccountPaths) {
            if (fs.existsSync(filePath)) {
                serviceAccount = require(filePath);
                console.log('✅ Found service account');
                break;
            }
        }

        if (!serviceAccount) {
            console.error('❌ Service account not found');
            process.exit(1);
        }

        // Initialize
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: 'tracking-visibility'
        });

        const db = admin.firestore();
        console.log('✅ Firestore initialized');

        // Check shipments
        console.log('\n📊 Checking shipments collection...');
        const snapshot = await db.collection('shipments').get();
        
        console.log('Collection exists:', !snapshot.empty);
        console.log('Number of documents:', snapshot.size);
        
        if (!snapshot.empty) {
            console.log('\n✅ Shipments found:');
            snapshot.forEach(doc => {
                console.log('  -', doc.id, ':', doc.data().status, doc.data().cost);
            });
        }

        await admin.app().delete();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

verify();
