import React from "react";

const ShareableBadge = ({ type, count, username, onClose }) => {
  const badges = {
    orders: {
      1: {
        emoji: "🎉",
        title: "FIRST ORDER",
        color: "#4ECDC4",
        message: "Just got my first order!",
      },
      5: {
        emoji: "🔥",
        title: "5 ORDERS",
        color: "#FF6B6B",
        message: "5 orders and counting!",
      },
      10: {
        emoji: "⭐",
        title: "10 ORDERS",
        color: "#FFD93D",
        message: "Hit 10 orders!",
      },
      25: {
        emoji: "💎",
        title: "25 ORDERS",
        color: "#A8E6CF",
        message: "25 orders milestone!",
      },
      50: {
        emoji: "👑",
        title: "50 ORDERS",
        color: "#C7CEEA",
        message: "50 orders achieved!",
      },
      100: {
        emoji: "🏆",
        title: "100 ORDERS",
        color: "#FFB6B9",
        message: "100 orders! Legend status!",
      },
    },
    visitors: {
      live: {
        emoji: "👀",
        title: "LIVE STATS",
        color: "#667EEA",
        message: `${count} visitors viewing my profile!`,
      },
    },
  };

  const badge =
    type === "visitors"
      ? badges.visitors.live
      : badges.orders[count] || badges.orders[1];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${badge.color} 0%, #667eea 100%)`,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        cursor: "pointer",
      }}
    >
      {/* Tap to Close Hint */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          color: "rgba(255,255,255,0.6)",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        Tap to close
      </div>

      {/* Badge Icon */}
      <div
        style={{
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "72px",
          border: "5px solid rgba(255,255,255,0.3)",
        }}
      >
        {badge.emoji}
      </div>

      {/* Badge Title */}
      <div
        style={{
          fontSize: "48px",
          fontWeight: 700,
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: "16px",
          letterSpacing: "3px",
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {badge.title}
      </div>

      {/* Username */}
      <div
        style={{
          fontSize: "28px",
          color: "rgba(255,255,255,0.95)",
          textAlign: "center",
          marginBottom: "32px",
          fontWeight: 600,
        }}
      >
        @{username}
      </div>

      {/* Message */}
      <div
        style={{
          fontSize: "20px",
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
          marginBottom: "48px",
          maxWidth: "500px",
        }}
      >
        {badge.message}
      </div>

      {/* BookaLink Branding */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: "8px",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          BookaLink
        </div>
        <div
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.9)",
            fontWeight: 500,
          }}
        >
          Turn followers into customers
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.7)",
            marginTop: "8px",
          }}
        >
          bookalink.com/{username}
        </div>
      </div>

      {/* Screenshot Instruction */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          fontSize: "16px",
          color: "rgba(255,255,255,0.8)",
          fontWeight: 600,
        }}
      >
        📸 Screenshot this to share on social media
      </div>
    </div>
  );
};

export default ShareableBadge;
