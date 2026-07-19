export const contact = {
  phone: "0816 576 3385",
  phoneTel: "+2348165763385",
  whatsappNumber: "2348165763385",
  email: "freshhub94@gmail.com",
};

export const externalOrderLinks = {
  glovo: "https://glovoapp.com",
  chowdeck: "https://chowdeck.com",
};

export const business = {
  name: "FreshHub",
  tagline: "Fresh food, made to order.",
  address: "City Mart Close, Abuja, Federal Capital Territory",
  hours: "Open 24 hours",
  addressPending: false,
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
