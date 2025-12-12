import axios from "axios";
import CryptoJS from "crypto-js";

const ZALO_APP_ID = process.env.ZALO_APP_ID;
const ZALO_KEY1 = process.env.ZALO_KEY1;
const ZALO_KEY2 = process.env.ZALO_KEY2;
const ZALO_REDIRECT_URL = process.env.ZALO_REDIRECT_URL;
const ZALO_API_ENDPOINT = process.env.ZALO_API_ENDPOINT;

// Hàm tạo đơn hàng ZaloPay
export const createZaloPayOrder = async ({ orderId, app_trans_id, amount, description }) => {
    const embed_data = JSON.stringify({
        redirecturl: ZALO_REDIRECT_URL,
        orderId
    });

    const items = JSON.stringify([]);

    const order = {
        app_id: ZALO_APP_ID,
        app_trans_id,
        app_time: Date.now(),
        item: items,
        embed_data,
        amount,
        description,
        bank_code: "",
        app_user: "user123" // giống mẫu Zalopay
    };

    // 🔥 Chuỗi MAC chuẩn ZaloPay:
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
        order.app_id +
        "|" +
        order.app_trans_id +
        "|" +
        order.app_user +
        "|" +
        order.amount +
        "|" +
        order.app_time +
        "|" +
        order.embed_data +
        "|" +
        order.item;

    order.mac = CryptoJS.HmacSHA256(data, ZALO_KEY1).toString();

    console.log("============== ZALOPAY CREATE ORDER ==============");
    console.log("📌 Params gửi:", order);
    console.log("📌 MAC Data:", data);
    console.log("📌 MAC:", order.mac);
    console.log("===================================================");

    try {
        const response = await axios.post(ZALO_API_ENDPOINT, null, {
            params: order
        });

        console.log("ZaloPay Create Response:", response.data);
        return response.data;
    } catch (error) {
        console.log("❌ ZaloPay ERROR:", error.response?.data || error);
        throw new Error(error.response?.data?.return_message || error.message);
    }
};

// Hàm verify callback từ ZaloPay
export const verifyZaloPayCallback = (data, mac) => {
    const calculatedMac = CryptoJS.HmacSHA256(data, ZALO_KEY2).toString();

    console.log("============== ZALOPAY CALLBACK VERIFY ==============");
    console.log("📌 data:", data);
    console.log("📌 mac from Zalo:", mac);
    console.log("📌 mac calc:", calculatedMac);
    console.log("======================================================");
    
    return calculatedMac === mac;
};

export const zaloRedirectHandler = (req, res) => {
    const data = req.query;

    const checksumData =
        data.appid +
        "|" +
        data.apptransid +
        "|" +
        data.pmcid +
        "|" +
        data.bankcode +
        "|" +
        data.amount +
        "|" +
        data.discountamount +
        "|" +
        data.status;

    const checksum = CryptoJS.HmacSHA256(checksumData, ZALO_KEY2).toString();

    console.log("Redirect checksum:", checksum, "| Provided:", data.checksum);

    if (checksum !== data.checksum) {
        return res.status(400).send("Invalid redirect checksum");
    }

    // Nếu ok → redirect FE
    return res.redirect(process.env.ZALO_REDIRECT_URL);
};