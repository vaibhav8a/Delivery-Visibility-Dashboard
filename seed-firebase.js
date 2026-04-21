#!/usr/bin/env node

/**
 * Firebase Data Seeding Script
 * This script uses the Firebase Admin SDK to seed the Realtime Database
 * with shipment data for the Delivery Visibility Dashboard
 * 
 * Usage: node seed-firebase.js
 * 
 * Make sure you have:
 * 1. Node.js installed
 * 2. Firebase Admin SDK installed (npm install firebase-admin)
 * 3. Service account key file in this directory
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// ==================== SAMPLE DATA ====================
const sampleShipments = [
    {
        id: 'SHP001',
        origin: 'North America',
        destination: 'Europe',
        eta: '2026-04-10',
        actual: '2026-04-10',
        delayMinutes: 0,
        cost: 1200,
        status: 'On-Time',
        date: new Date(2026, 3, 10).toISOString(),
        distance: 450,
        traffic: 'low',
        weather: 'clear'
    },
    {
        id: 'SHP002',
        origin: 'Europe',
        destination: 'Asia Pacific',
        eta: '2026-04-08',
        actual: '2026-04-12',
        delayMinutes: 5760,
        cost: 1500,
        status: 'Delayed',
        date: new Date(2026, 3, 8).toISOString(),
        distance: 650,
        traffic: 'high',
        weather: 'stormy'
    },
    {
        id: 'SHP003',
        origin: 'Asia Pacific',
        destination: 'North America',
        eta: '2026-04-12',
        actual: null,
        delayMinutes: 0,
        cost: 1800,
        status: 'In-Transit',
        date: new Date(2026, 3, 3).toISOString(),
        distance: 750,
        traffic: 'high',
        weather: 'rainy'
    },
    {
        id: 'SHP004',
        origin: 'Latin America',
        destination: 'North America',
        eta: '2026-04-09',
        actual: '2026-04-09',
        delayMinutes: 0,
        cost: 950,
        status: 'On-Time',
        date: new Date(2026, 3, 6).toISOString(),
        distance: 300,
        traffic: 'low',
        weather: 'clear'
    },
    {
        id: 'SHP005',
        origin: 'Middle East',
        destination: 'Europe',
        eta: '2026-04-11',
        actual: '2026-04-14',
        delayMinutes: 4320,
        cost: 1350,
        status: 'Delayed',
        date: new Date(2026, 3, 5).toISOString(),
        distance: 580,
        traffic: 'high',
        weather: 'hot'
    },
    {
        id: 'SHP006',
        origin: 'North America',
        destination: 'Latin America',
        eta: '2026-04-07',
        actual: '2026-04-07',
        delayMinutes: 0,
        cost: 800,
        status: 'On-Time',
        date: new Date(2026, 3, 7).toISOString(),
        distance: 280,
        traffic: 'low',
        weather: 'clear'
    },
    {
        id: 'SHP007',
        origin: 'Europe',
        destination: 'Middle East',
        eta: '2026-04-13',
        actual: null,
        delayMinutes: 0,
        cost: 1100,
        status: 'In-Transit',
        date: new Date(2026, 3, 9).toISOString(),
        distance: 520,
        traffic: 'medium',
        weather: 'cloudy'
    },
    {
        id: 'SHP008',
        origin: 'Asia Pacific',
        destination: 'Latin America',
        eta: '2026-04-06',
        actual: '2026-04-11',
        delayMinutes: 7200,
        cost: 2000,
        status: 'Delayed',
        date: new Date(2026, 3, 2).toISOString(),
        distance: 820,
        traffic: 'high',
        weather: 'stormy'
    },
    {
        id: 'SHP009',
        origin: 'Latin America',
        destination: 'Europe',
        eta: '2026-04-12',
        actual: '2026-04-12',
        delayMinutes: 0,
        cost: 1400,
        status: 'On-Time',
        date: new Date(2026, 3, 11).toISOString(),
        distance: 400,
        traffic: 'low',
        weather: 'clear'
    },
    {
        id: 'SHP010',
        origin: 'North America',
        destination: 'Asia Pacific',
        eta: '2026-04-08',
        actual: '2026-04-13',
        delayMinutes: 7200,
        cost: 2200,
        status: 'Delayed',
        date: new Date(2026, 3, 4).toISOString(),
        distance: 900,
        traffic: 'high',
        weather: 'rainy'
    },
    {
        id: 'SHP011',
        origin: 'Middle East',
        destination: 'Asia Pacific',
        eta: '2026-04-14',
        actual: null,
        delayMinutes: 0,
        cost: 1600,
        status: 'In-Transit',
        date: new Date(2026, 3, 12).toISOString(),
        distance: 600,
        traffic: 'high',
        weather: 'hot'
    },
    {
        id: 'SHP012',
        origin: 'Europe',
        destination: 'North America',
        eta: '2026-04-10',
        actual: '2026-04-10',
        delayMinutes: 0,
        cost: 1300,
        status: 'On-Time',
        date: new Date(2026, 3, 8).toISOString(),
        distance: 350,
        traffic: 'low',
        weather: 'clear'
    },
    {
        id: 'SHP013',
        origin: 'Asia Pacific',
        destination: 'Middle East',
        eta: '2026-04-11',
        actual: '2026-04-15',
        delayMinutes: 5760,
        cost: 1700,
        status: 'Delayed',
        date: new Date(2026, 3, 1).toISOString(),
        distance: 670,
        traffic: 'high',
        weather: 'stormy'
    },
    {
        id: 'SHP014',
        origin: 'Latin America',
        destination: 'Middle East',
        eta: '2026-04-13',
        actual: null,
        delayMinutes: 0,
        cost: 1050,
        status: 'In-Transit',
        date: new Date(2026, 3, 10).toISOString(),
        distance: 550,
        traffic: 'medium',
        weather: 'cloudy'
    },
    {
        id: 'SHP015',
        origin: 'North America',
        destination: 'Europe',
        eta: '2026-04-09',
        actual: '2026-04-09',
        delayMinutes: 0,
        cost: 1250,
        status: 'On-Time',
        date: new Date(2026, 3, 6).toISOString(),
        distance: 480,
        traffic: 'low',
        weather: 'clear'
    }
];

// ==================== INITIALIZATION ====================
async function initializeFirebase() {
    try {
        // Try to find service account key file
        const serviceAccountPaths = [
            path.join(__dirname, 'tracking-visibility-firebase-adminsdk-fbsvc-dce07ec99d.json'),
            path.join(__dirname, 'serviceAccountKey.json'),
            path.join(process.env.HOME, 'Downloads', 'tracking-visibility-firebase-adminsdk-fbsvc-dce07ec99d.json')
        ];

        let serviceAccount = null;
        let foundPath = null;

        for (const filePath of serviceAccountPaths) {
            if (fs.existsSync(filePath)) {
                serviceAccount = require(filePath);
                foundPath = filePath;
                console.log(`✅ Found service account at: ${filePath}`);
                break;
            }
        }

        if (!serviceAccount) {
            console.error('❌ Service account key file not found!');
            console.error('Expected one of:');
            serviceAccountPaths.forEach(p => console.error(`   - ${p}`));
            process.exit(1);
        }

        // Initialize Firebase Admin SDK
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://tracking-visibility.firebaseio.com/'
        });

        console.log('✅ Firebase Admin SDK initialized successfully');
        console.log(`📍 Database URL: https://tracking-visibility.firebaseio.com/\n`);
        return admin.database();
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error.message);
        process.exit(1);
    }
}

// ==================== DATA SEEDING ====================
async function seedDatabase(database) {
    try {
        console.log('\n📊 Starting database seeding...');
        console.log('⏳ Connecting to database (this may take a moment)...\n');

        // Create shipments object
        const shipmentsObject = {};
        sampleShipments.forEach(shipment => {
            shipmentsObject[shipment.id] = shipment;
        });

        // Write to database with timeout
        const writePromise = database.ref('shipments').set(shipmentsObject);

        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database write timeout')), 30000)
        );

        await Promise.race([writePromise, timeoutPromise]);

        console.log('✅ Successfully seeded database!\n');
        console.log('📈 Seeding Summary:');
        console.log(`   • Total shipments: ${sampleShipments.length}`);
        console.log(`   • On-Time: ${sampleShipments.filter(s => s.status === 'On-Time').length}`);
        console.log(`   • Delayed: ${sampleShipments.filter(s => s.status === 'Delayed').length}`);
        console.log(`   • In-Transit: ${sampleShipments.filter(s => s.status === 'In-Transit').length}`);
        console.log(`   • Total value: $${sampleShipments.reduce((sum, s) => sum + s.cost, 0).toLocaleString()}`);
        console.log('\n✨ Your dashboard is now ready with data!');
        console.log('🌐 Open index.html in your browser to see the results.\n');

        return true;
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        return false;
    }
}

// ==================== VERIFICATION ====================
async function verifyData(database) {
    try {
        console.log('🔍 Verifying seeded data...\n');

        const snapshot = await database.ref('shipments').once('value');
        const data = snapshot.val();

        if (!data) {
            console.error('❌ No data found in database');
            return false;
        }

        const shipments = Object.values(data);
        console.log('✅ Verification Results:');
        console.log(`   • Records count: ${shipments.length}`);

        const regions = new Set(shipments.map(s => s.origin));
        console.log(`   • Unique regions: ${regions.size}`);
        console.log(`   • Sample regions: ${Array.from(regions).join(', ')}`);

        const statuses = {};
        shipments.forEach(s => {
            statuses[s.status] = (statuses[s.status] || 0) + 1;
        });
        console.log(`   • Status breakdown:`);
        Object.entries(statuses).forEach(([status, count]) => {
            console.log(`     - ${status}: ${count}`);
        });

        console.log('\n✅ All data verified successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error verifying data:', error.message);
        return false;
    }
}

// ==================== MAIN EXECUTION ====================
async function main() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║    🚚 Firebase Delivery Dashboard Data Seeding Tool    ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
        // Initialize Firebase
        const database = await initializeFirebase();

        // Seed the database
        const seedSuccess = await seedDatabase(database);

        if (seedSuccess) {
            // Verify the data
            await verifyData(database);
        }

        // Close the app
        await admin.app().delete();
        console.log('✅ Application closed gracefully.\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the script
main();