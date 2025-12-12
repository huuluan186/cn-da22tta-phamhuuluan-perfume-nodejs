import * as service from '../services/payment.js';

export const zaloPayCallbackController = async (req, res) => {
    try {
        let body = req.body;
        if (typeof body === "string") {
            body = Object.fromEntries(new URLSearchParams(body));
        }
        const result = await service.handleZaloPayCallbackService(body);
        return res.json({ return_code: result.err ? -1 : 1, return_message: result.msg });
    } catch (err) {
        console.error("ZaloPay callback error:", err);
        return res.json({ return_code: -1, return_message: "Internal error" });
    }
};
