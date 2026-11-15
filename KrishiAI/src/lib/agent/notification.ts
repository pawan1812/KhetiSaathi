/**
 * KHETISAATHI — NOTIFICATION DELIVERY LAYER
 * 
 * Isolates message delivery so it can be swapped with real WhatsApp / Gupshup / Twilio / SMS later.
 */

import { FarmActionOutput } from "./validator";

export interface FarmerRecipient {
  uid: string;
  name: string;
  phone: string;
  language?: "mr" | "hi" | "en";
  district?: string;
}

export interface DeliveryLog {
  recipientId: string;
  phone: string;
  urgency: string;
  message: string;
  reason: string;
  channel: "in_app" | "whatsapp" | "sms";
  timestamp: string;
  status: "delivered" | "queued" | "failed";
}

// In-memory record of recent deliveries for inspection & testing
const deliveryLogs: DeliveryLog[] = [];

/**
 * Isolated delivery function.
 * Currently records delivery in-app and can be extended to WhatsApp / SMS gateway.
 */
export async function sendMessage(
  farmer: FarmerRecipient,
  action: FarmActionOutput,
  channel: "in_app" | "whatsapp" | "sms" = "in_app"
): Promise<{ success: boolean; deliveryId: string; channel: string }> {
  const deliveryId = `del-${Date.now()}-${farmer.uid.slice(-4)}`;

  const log: DeliveryLog = {
    recipientId: farmer.uid,
    phone: farmer.phone,
    urgency: action.urgency,
    message: action.message,
    reason: action.reason,
    channel,
    timestamp: new Date().toISOString(),
    status: "delivered"
  };

  deliveryLogs.unshift(log);
  if (deliveryLogs.length > 100) {
    deliveryLogs.pop();
  }

  // Future WhatsApp / SMS API dispatch hook:
  // e.g. if (channel === "whatsapp") await sendViaWhatsAppApi(farmer.phone, action.message);

  return {
    success: true,
    deliveryId,
    channel
  };
}

export function getRecentDeliveries(): DeliveryLog[] {
  return [...deliveryLogs];
}
