const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

async function checkRules() {
    try {
        const serviceAccountPaths = [
            path.join(__dirname, 'tracking-visibility-firebase-adminsdk-fbsvc-dce07ec99d.json'),
            path.join(process.env.HOME, 'Downloads', 'tracking-visibility-firebase-adminsdk-fbsvc-dce07ec99d.json')
        ];

        let serviceAccount = null;
        for (const filePath of serviceAccountPaths) {
            if (fs.existsSync(filePath)) {
                serviceAccount = require(filePath);
                break;
            }
        }

        if (!serviceAccount) {
            console.error('❌ Service account not found');
            process.exit(1);
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: 'tracking-visibility'
        });

        const db = admin.firestore();

        // Check rules using the securityRules API
        console.log('📋 Checking Firestore configuration...\n');

        // Try to get the security rules
        try {
            const rules = await admin.securityRules().getFirestoreRuleset('projects/tracking-visibility/databases/(default)');
            console.log('✅ Current Firestore Rules:');
            console.log(rules.source.files[0].content);
        } catch (err) {
            console.log('⚠️ Could not fetch rules via API:', err.message);
            console.log('But data should still be readable if rules allow public access');
        }

        // List all documents
        console.log('\n📊 Checking documents...');
        const snapshot = await db.collection('shipments').get();
        console.log(`✅ Documents in collection: ${snapshot.size}`);

        if (snapshot.size > 0) {
            console.log('\n✅ Sample documents:');
            snapshot.docs.slice(0, 3).forEach(doc => {
                console.log(`   - ${doc.id}: ${doc.data().status}`);
            });
        }

        await admin.app().delete();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkRules();
