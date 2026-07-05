const WHATSAPP_PHONE = "972542134716";

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
