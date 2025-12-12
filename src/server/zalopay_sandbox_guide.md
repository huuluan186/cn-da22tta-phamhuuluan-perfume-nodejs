# ZaloPay Sandbox Integration Guide

## 1. Sandbox Credentials (Provided by ZaloPay)

-   **AppID:** `2554`
-   **Key1:** `sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn`
-   **Key2:** `trMrHtvjo6myautxDUiAcYsVtaeQ8nhf`

Use these for testing API requests and verifying callbacks.

------------------------------------------------------------------------

## 2. Setup ZaloPay Sandbox Wallet

### Step 1: Download Sandbox App

Access:
https://docs.zalopay.vn/vi/docs/developer-tools/test-instructions/test-wallets\
Choose: - Android: Download APK\
- iOS: TestFlight link

### Step 2: Register Sandbox Account

-   Use any phone number\
-   OTP is always: **111111**

### Step 3: Setup Payment Password

Create a simple 6-digit password.

### Step 4: Identity Verification

Upload CCCD (real CCCD is allowed; sandbox only).

### Step 5: Add Test Balance

At the bottom of the same page → "Nạp tiền vào môi trường test".

------------------------------------------------------------------------

## 3. Backend Configuration (Node.js Example)

``` js
export const zalopayConfig = {
  app_id: 2554,
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
```

------------------------------------------------------------------------

## 4. API Create Order Example

``` js
const crypto = require("crypto");
const moment = require("moment");

const payload = {
  app_id: config.app_id,
  app_trans_id: `${moment().format('YYMMDD')}_${Date.now()}`,
  app_user: "user123",
  amount: 100000,
  app_time: Date.now(),
  embed_data: "{}",
  item: "[]",
  callback_url: "https://your-domain/api/zalopay/callback"
};

const dataStr =
  config.app_id +
  '|' +
  payload.app_trans_id +
  '|' +
  payload.app_user +
  '|' +
  payload.amount +
  '|' +
  payload.app_time +
  '|' +
  payload.embed_data +
  '|' +
  payload.item;

payload.mac = crypto
  .createHmac("sha256", config.key1)
  .update(dataStr)
  .digest("hex");
```

------------------------------------------------------------------------

## 5. Callback Verification

When ZaloPay calls your callback URL, verify using **key2**:

``` js
const mac = crypto
  .createHmac("sha256", config.key2)
  .update(req.body.data)
  .digest("hex");
```

Compare with `req.body.mac`.

------------------------------------------------------------------------

## 6. Query Order Status

Use endpoint:\
`https://sb-openapi.zalopay.vn/v2/query`

MAC generation:

``` js
msg = `${app_id}|${app_trans_id}|${key1}`;
```

------------------------------------------------------------------------

## 7. Important Notes from ZaloPay Email

-   Sandbox is **demo only**.
-   Technical support is limited unless you become an official partner.
-   Keys must be kept confidential.
-   Always verify MAC on callback.
-   Always query order status after callback.

------------------------------------------------------------------------

## 8. Useful Links

-   Sandbox test instructions:
    https://docs.zalopay.vn/vi/docs/developer-tools/test-instructions/test-wallets
-   Integration intro:
    https://docs.zalopay.vn/vi/docs/guides/integration-guide/intro
-   API Create Order: https://docs.zalopay.vn/docs/specs/order-create/
-   API Query Order: https://docs.zalopay.vn/docs/specs/order-query/
-   Callback docs:
    https://docs.zalopay.vn/docs/developer-tools/knowledge-base/callback/
