import "server-only"

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!

export const CREDIT_PACKAGE = {
    id: "credit-package-100",
    name: "100 Credits Package",
    description: "Purchase 100 credits for Legal Case AI searches",
    priceInPaise: 50000, // ₹500 in paise
    credits: 100,
}
