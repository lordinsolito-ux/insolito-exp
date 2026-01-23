/**
 * Script per creare i prodotti Tier su Stripe
 * 
 * PREREQUISITI:
 * 1. Installa Stripe SDK: npm install stripe
 * 
 * ESECUZIONE:
 * node setup-stripe-products.js YOUR_STRIPE_SECRET_KEY
 * 
 * Oppure usa la variabile d'ambiente:
 * set STRIPE_SECRET_KEY=sk_test_xxx && node setup-stripe-products.js
 */

import Stripe from 'stripe';
import fs from 'fs';

// Leggi la chiave dagli argomenti o dalle variabili d'ambiente
const stripeKey = process.argv[2] || process.env.STRIPE_SECRET_KEY;

if (!stripeKey || stripeKey === 'YOUR_STRIPE_SECRET_KEY') {
    console.error('❌ ERRORE: Chiave Stripe mancante!');
    console.log('\n📖 Utilizzo:');
    console.log('   node setup-stripe-products.js sk_test_xxxxx');
    console.log('\nOppure:');
    console.log('   set STRIPE_SECRET_KEY=sk_test_xxxxx && node setup-stripe-products.js');
    process.exit(1);
}

const stripe = new Stripe(stripeKey);

async function createStripeProducts() {
    console.log('🚀 Creazione prodotti Stripe per Insolito Privé...\n');

    try {
        // 1️⃣ TIER ESSENTIALS
        console.log('📦 Creando Tier Essentials...');
        const essentialsProduct = await stripe.products.create({
            name: 'Insolito Privé - Essentials',
            description: 'Coordinamento logistico premium con presidio attivo. Servizio di assistenza alla persona (ATECO 96.99.99). Minimo 3 ore consecutive.',
            metadata: {
                tier: 'essentials',
                min_hours: '3',
                hourly_rate: '180',
                category: 'lifestyle_management'
            }
        });

        const essentialsPrice = await stripe.prices.create({
            product: essentialsProduct.id,
            unit_amount: 18000, // €180 in centesimi
            currency: 'eur',
            billing_scheme: 'per_unit',
            metadata: {
                tier: 'essentials',
                hourly_rate: '180'
            }
        });

        console.log(`✅ Essentials creato!`);
        console.log(`   Product ID: ${essentialsProduct.id}`);
        console.log(`   Price ID: ${essentialsPrice.id}\n`);

        // 2️⃣ TIER SIGNATURE
        console.log('💎 Creando Tier Signature...');
        const signatureProduct = await stripe.products.create({
            name: 'Insolito Privé - Signature',
            description: 'Lifestyle management completo con protocollo backup automatico e guardian notturno. Servizio di assistenza d\'élite. Minimo 4 ore.',
            metadata: {
                tier: 'signature',
                min_hours: '4',
                hourly_rate: '280',
                category: 'lifestyle_management',
                popular: 'true'
            }
        });

        const signaturePrice = await stripe.prices.create({
            product: signatureProduct.id,
            unit_amount: 28000, // €280 in centesimi
            currency: 'eur',
            billing_scheme: 'per_unit',
            metadata: {
                tier: 'signature',
                hourly_rate: '280'
            }
        });

        console.log(`✅ Signature creato!`);
        console.log(`   Product ID: ${signatureProduct.id}`);
        console.log(`   Price ID: ${signaturePrice.id}\n`);

        // 3️⃣ TIER ELITE RETAINER
        console.log('👑 Creando Tier Elite Retainer...');
        const eliteProduct = await stripe.products.create({
            name: 'Insolito Privé - Elite Retainer',
            description: 'Assistenza H24 illimitata con linea diretta prioritaria e team dedicato. Subscription mensile per clienti esclusivi.',
            metadata: {
                tier: 'elite',
                unlimited: 'true',
                monthly_fee: '6000',
                category: 'lifestyle_management',
                invitation_only: 'true'
            }
        });

        const elitePrice = await stripe.prices.create({
            product: eliteProduct.id,
            unit_amount: 600000, // €6000 in centesimi
            currency: 'eur',
            recurring: {
                interval: 'month'
            },
            metadata: {
                tier: 'elite',
                monthly_fee: '6000'
            }
        });

        console.log(`✅ Elite Retainer creato!`);
        console.log(`   Product ID: ${eliteProduct.id}`);
        console.log(`   Price ID: ${elitePrice.id}\n`);

        // 📋 SUMMARY
        console.log('═══════════════════════════════════════════════════');
        console.log('🎉 TUTTI I PRODOTTI CREATI CON SUCCESSO!\n');
        console.log('📝 Copia questi Price ID nel tuo constants.ts:\n');
        console.log('export const STRIPE_PRICE_IDS = {');
        console.log(`  essentials: '${essentialsPrice.id}',`);
        console.log(`  signature: '${signaturePrice.id}',`);
        console.log(`  elite: '${elitePrice.id}'`);
        console.log('};\n');
        console.log('═══════════════════════════════════════════════════\n');

        // Salva in un file JSON per riferimento
        const config = {
            products: {
                essentials: {
                    product_id: essentialsProduct.id,
                    price_id: essentialsPrice.id,
                    hourly_rate: 180,
                    min_hours: 3
                },
                signature: {
                    product_id: signatureProduct.id,
                    price_id: signaturePrice.id,
                    hourly_rate: 280,
                    min_hours: 4
                },
                elite: {
                    product_id: eliteProduct.id,
                    price_id: elitePrice.id,
                    monthly_fee: 6000
                }
            }
        };

        fs.writeFileSync(
            './stripe-products-config.json',
            JSON.stringify(config, null, 2)
        );

        console.log('💾 Configurazione salvata in stripe-products-config.json');

    } catch (error) {
        console.error('❌ Errore durante la creazione dei prodotti:', error.message);
        process.exit(1);
    }
}

// Esegui lo script
createStripeProducts();

