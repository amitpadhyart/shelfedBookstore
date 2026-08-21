/**
 * Builds a `upi://pay` deep link per the NPCI UPI linking spec.
 * Any UPI app (GPay, PhonePe, Paytm, BHIM...) can resolve this URI
 * and prefill the payee, amount, and a reference note.
 */
export function buildUpiLink(params: {
  payeeVpa: string;
  payeeName: string;
  amount: number;
  orderNumber: string;
}) {
  const { payeeVpa, payeeName, amount, orderNumber } = params;
  const query = new URLSearchParams({
    pa: payeeVpa, // payee address (UPI ID)
    pn: payeeName, // payee name
    am: amount.toFixed(2), // amount
    cu: "INR",
    tn: `Shelfed order ${orderNumber}`, // transaction note
    tr: orderNumber, // transaction reference
  });
  return `upi://pay?${query.toString()}`;
}
