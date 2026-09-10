/**
 * Register Tiendanube webhooks for AERYX
 *
 * Usage:
 *   npx tsx scripts/register-webhooks.ts
 *
 * Requires .env.local with:
 *   TIENDANUBE_STORE_ID
 *   TIENDANUBE_ACCESS_TOKEN
 *   NEXT_PUBLIC_APP_URL
 */

import "dotenv/config";

const STORE_ID = process.env.TIENDANUBE_STORE_ID;
const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

if (!STORE_ID || !ACCESS_TOKEN || !APP_URL) {
  console.error("❌ Missing required environment variables:");
  if (!STORE_ID) console.error("   - TIENDANUBE_STORE_ID");
  if (!ACCESS_TOKEN) console.error("   - TIENDANUBE_ACCESS_TOKEN");
  if (!APP_URL) console.error("   - NEXT_PUBLIC_APP_URL");
  process.exit(1);
}

const BASE_URL = `https://api.tiendanube.com/v1/${STORE_ID}`;
const WEBHOOK_URL = `${APP_URL}/api/webhooks/tiendanube`;

const EVENTS = [
  "order/created",
  "order/paid",
  "order/updated",
  "order/cancelled",
  "product/created",
  "product/updated",
  "product/deleted",
  "category/created",
  "category/updated",
  "category/deleted",
];

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  "Content-Type": "application/json",
  "User-Agent": "AERYX (info@aeryx.com.ar)",
};

async function listExistingWebhooks() {
  const res = await fetch(`${BASE_URL}/webhooks`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to list webhooks: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as { id: number; event: string; url: string }[];
}

async function deleteWebhook(id: number) {
  const res = await fetch(`${BASE_URL}/webhooks/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok && res.status !== 404) {
    console.warn(`⚠️  Failed to delete webhook ${id}: ${res.status}`);
  }
}

async function registerWebhook(event: string) {
  const res = await fetch(`${BASE_URL}/webhooks`, {
    method: "POST",
    headers,
    body: JSON.stringify({ event, url: WEBHOOK_URL }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to register ${event}: ${res.status} ${body}`);
  }

  return (await res.json()) as { id: number; event: string; url: string };
}

async function main() {
  console.log("🔗 Tiendanube Webhook Registration");
  console.log(`   Store ID: ${STORE_ID}`);
  console.log(`   Webhook URL: ${WEBHOOK_URL}`);
  console.log("");

  // List existing webhooks
  console.log("📋 Listing existing webhooks...");
  const existing = await listExistingWebhooks();

  if (existing.length > 0) {
    console.log(`   Found ${existing.length} existing webhook(s)`);
    for (const wh of existing) {
      if (wh.url === WEBHOOK_URL) {
        console.log(`   🗑️  Removing old webhook: ${wh.event} (ID: ${wh.id})`);
        await deleteWebhook(wh.id);
      }
    }
  }

  // Register new webhooks
  console.log("");
  console.log("📝 Registering webhooks...");

  for (const event of EVENTS) {
    try {
      const webhook = await registerWebhook(event);
      console.log(`   ✅ ${event} → ID: ${webhook.id}`);
    } catch (error) {
      console.error(
        `   ❌ ${event}: ${error instanceof Error ? error.message : error}`,
      );
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log("");
  console.log("✨ Done!");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
