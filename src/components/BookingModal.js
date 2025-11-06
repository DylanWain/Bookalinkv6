import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const BookingModal = ({ isOpen, onClose, item, seller, type }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [step, setStep] = useState(1); // 1 = contact info, 2 = payment options
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Please fill in your name and email");
      return;
    }

    setSubmitting(true);

    try {
      const price = getItemPrice();

      // Save order to database
      const orderData = {
        seller_id: seller.id,
        item_id: item.id,
        item_type: type,
        item_name: item.name,
        buyer_name: formData.name,
        buyer_email: formData.email,
        buyer_phone: formData.phone || null,
        notes: formData.message || null,
        status: "pending",
      };

      // Only add item_price if it exists (not null)
      if (price !== null && price !== undefined) {
        orderData.item_price = price;
      }

      const { error } = await supabase.from("orders").insert([orderData]);

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      // If there's a price, go to payment step
      if (price) {
        setStep(2);
      } else {
        // If no price (inquiry only), show success message
        alert(
          `Thank you! ${
            seller.business_name || seller.name
          } will contact you soon at ${formData.email}`
        );
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getItemPrice = () => {
    if (type === "service" && item.price) return item.price;
    if (type === "item") return item.price;
    return null;
  };

  const getItemName = () => {
    return item.name;
  };

  const handlePayment = (paymentMethod) => {
    const price = getItemPrice();
    const amount = price ? price.toFixed(2) : "";

    let paymentUrl = "";

    switch (paymentMethod) {
      case "venmo":
        if (seller.venmo_username) {
          const venmoHandle = seller.venmo_username.replace("@", "");
          const note = encodeURIComponent(
            `${getItemName()} - ${seller.business_name || seller.name}`
          );
          paymentUrl = `https://venmo.com/${venmoHandle}?txn=pay&amount=${amount}&note=${note}`;
        }
        break;

      case "cashapp":
        if (seller.cashapp_username) {
          const cashappHandle = seller.cashapp_username.replace("$", "");
          paymentUrl = `https://cash.app/$${cashappHandle}/${amount}`;
        }
        break;

      case "paypal":
        if (seller.paypal_email) {
          // Extract username from email or use full email
          const paypalUsername = seller.paypal_email.split("@")[0];
          paymentUrl = `https://paypal.me/${paypalUsername}/${amount}`;
        }
        break;

      case "zelle":
        alert(
          `Please send $${amount} to ${
            seller.zelle_email
          } via Zelle\n\nNote: ${getItemName()}`
        );
        return;

      default:
        break;
    }

    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
      // Update order status to show payment initiated
      updateOrderPaymentMethod(paymentMethod);
    } else {
      alert("Payment method not available");
    }
  };

  const updateOrderPaymentMethod = async (method) => {
    try {
      // Update the most recent order with this payment method
      const { error } = await supabase
        .from("orders")
        .update({ payment_method: method, status: "payment_initiated" })
        .eq("buyer_email", formData.email)
        .eq("item_id", item.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) console.error("Error updating payment method:", error);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const availablePaymentMethods = [
    {
      name: "Venmo",
      emoji: "💚",
      key: "venmo",
      available: seller.venmo_username,
      color: "#008CFF",
    },
    {
      name: "Cash App",
      emoji: "💵",
      key: "cashapp",
      available: seller.cashapp_username,
      color: "#00D632",
    },
    {
      name: "PayPal",
      emoji: "💙",
      key: "paypal",
      available: seller.paypal_email,
      color: "#0070BA",
    },
    {
      name: "Zelle",
      emoji: "🏦",
      key: "zelle",
      available: seller.zelle_email,
      color: "#6D1ED4",
    },
  ].filter((method) => method.available);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          border: "3px solid #000000",
          boxShadow: "8px 8px 0px #000000",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "3px solid #000000",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
            {step === 1 ? "📝 Your Information" : "💳 Choose Payment"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "28px",
              cursor: "pointer",
              padding: "0",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          {step === 1 ? (
            // Step 1: Contact Information
            <form onSubmit={handleSubmit}>
              {/* Item/Service Summary */}
              <div
                style={{
                  background: "var(--bg-page)",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  {getItemName()}
                </div>
                {type === "service" && (
                  <div style={{ fontSize: "14px", color: "#666666" }}>
                    {item.duration} min session
                  </div>
                )}
                {item.description && (
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#666666",
                      marginTop: "8px",
                    }}
                  >
                    {item.description}
                  </div>
                )}
                {getItemPrice() && (
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      marginTop: "8px",
                    }}
                  >
                    ${getItemPrice()}
                  </div>
                )}
                {!getItemPrice() && type === "service" && (
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#666666",
                      fontStyle: "italic",
                      marginTop: "8px",
                    }}
                  >
                    Price available upon inquiry
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #000000",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #000000",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #000000",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  Message / Special Requests
                </label>
                <textarea
                  placeholder="Any additional details..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #000000",
                    borderRadius: "8px",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="hubspot-button"
                style={{ marginBottom: 0, width: "100%" }}
              >
                {submitting
                  ? "Processing..."
                  : getItemPrice()
                  ? "Continue to Payment →"
                  : "Submit Inquiry"}
              </button>
            </form>
          ) : (
            // Step 2: Payment Options
            <div>
              <div
                style={{
                  background: "#F5F5F5",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666666",
                    marginBottom: "4px",
                  }}
                >
                  Total Amount
                </div>
                <div style={{ fontSize: "36px", fontWeight: 700 }}>
                  ${getItemPrice()}
                </div>
              </div>

              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}
              >
                Select Payment Method
              </h3>

              {availablePaymentMethods.length > 0 ? (
                <div style={{ display: "grid", gap: "12px" }}>
                  {availablePaymentMethods.map((method) => (
                    <button
                      key={method.key}
                      onClick={() => handlePayment(method.key)}
                      style={{
                        width: "100%",
                        padding: "16px",
                        background: "#FFFFFF",
                        border: "3px solid #000000",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        boxShadow: "3px 3px 0px #000000",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "5px 5px 0px #000000";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "3px 3px 0px #000000";
                      }}
                    >
                      <span style={{ fontSize: "32px" }}>{method.emoji}</span>
                      <span style={{ flex: 1, textAlign: "left" }}>
                        {method.name}
                      </span>
                      <span style={{ fontSize: "20px" }}>→</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#666666",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    💳
                  </div>
                  <div>No payment methods available yet.</div>
                  <div style={{ fontSize: "14px", marginTop: "8px" }}>
                    The seller will contact you with payment details.
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(1)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#F5F5F5",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "16px",
                }}
              >
                ← Back to Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
