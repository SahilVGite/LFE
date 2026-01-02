"use server"

import { createClient } from "@/lib/supabase/server"
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, CREDIT_PACKAGE } from "@/lib/razorpay"
import crypto from "crypto"

export async function createRazorpayOrder() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Create Razorpay order using their API
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: CREDIT_PACKAGE.priceInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_id: user.id,
        credits: CREDIT_PACKAGE.credits.toString(),
      },
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create Razorpay order")
  }

  const order = await response.json()

  // Create payment record
  const { error: paymentError } = await supabase.from("payment_history").insert({
    user_id: user.id,
    razorpay_order_id: order.id,
    amount_inr: CREDIT_PACKAGE.priceInPaise / 100,
    credits_purchased: CREDIT_PACKAGE.credits,
    status: "pending",
  })

  if (paymentError) {
    throw new Error("Failed to create payment record")
  }

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: RAZORPAY_KEY_ID,
  }
}

export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Verify signature
  const body = razorpayOrderId + "|" + razorpayPaymentId
  const expectedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body).digest("hex")

  if (expectedSignature !== razorpaySignature) {
    // Update payment status to failed
    await supabase.from("payment_history").update({ status: "failed" }).eq("razorpay_order_id", razorpayOrderId)

    return { success: false, error: "Invalid payment signature" }
  }

  // Get payment record
  const { data: payment } = await supabase
    .from("payment_history")
    .select("*")
    .eq("razorpay_order_id", razorpayOrderId)
    .single()

  if (!payment || payment.status === "completed") {
    return { success: false, error: "Payment not found or already processed" }
  }

  // Update payment status
  await supabase
    .from("payment_history")
    .update({
      status: "completed",
      razorpay_payment_id: razorpayPaymentId,
    })
    .eq("id", payment.id)

  // Add credits to user
  const { data: profile } = await supabase.from("profiles").select("credits").eq("id", payment.user_id).single()

  if (profile) {
    await supabase
      .from("profiles")
      .update({ credits: profile.credits + payment.credits_purchased })
      .eq("id", payment.user_id)
  }

  return { success: true, credits: payment.credits_purchased }
}
