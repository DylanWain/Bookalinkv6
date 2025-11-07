import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ShareableBadge from "../components/ShareableBadge";
import ImageUploader from "../components/ImageUploader";
import {
  applyTheme,
  themes,
  getThemeKeyFromColor,
  getStoredTheme,
} from "../styles/themes";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, supabase, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [showBadge, setShowBadge] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    profileViews: 0,
    linkClicks: 0,
    todayViews: 0,
    weekViews: 0,
    monthViews: 0,
  });
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([]);
  const [links, setLinks] = useState([]);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [orders, setOrders] = useState([]);

  // FIXED: First useEffect
  useEffect(() => {
    if (currentUser) {
      loadAllData();
      loadStats();
    } else {
      navigate("/login");
    }
  }, [currentUser, loadAllData, loadStats, navigate]);

  // FIXED: Second useEffect - Added opening bracket
  useEffect(() => {
    const interval = setInterval(() => {
      loadStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadStats]);

  const loadStats = async () => {
    if (!currentUser?.id) return;

    try {
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", currentUser.id);

      const { data: analytics } = await supabase
        .from("analytics")
        .select("*")
        .eq("seller_id", currentUser.id);

      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const profileViews =
        analytics?.filter((a) => a.event_type === "profile_view").length || 0;
      const linkClicks =
        analytics?.filter((a) => a.event_type === "link_click").length || 0;

      const todayViews =
        analytics?.filter(
          (a) =>
            a.event_type === "profile_view" &&
            new Date(a.timestamp) >= todayStart
        ).length || 0;

      const weekViews =
        analytics?.filter(
          (a) =>
            a.event_type === "profile_view" &&
            new Date(a.timestamp) >= weekStart
        ).length || 0;

      const monthViews =
        analytics?.filter(
          (a) =>
            a.event_type === "profile_view" &&
            new Date(a.timestamp) >= monthStart
        ).length || 0;

      setStats({
        totalOrders: orders?.length || 0,
        totalRevenue:
          orders?.reduce((sum, o) => sum + parseFloat(o.item_price || 0), 0) ||
          0,
        profileViews,
        linkClicks,
        todayViews,
        weekViews,
        monthViews,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadAllData = async () => {
    if (!currentUser?.id) return;

    try {
      await loadStats();

      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("seller_id", currentUser.id);
      setServices(servicesData || []);

      const { data: itemsData } = await supabase
        .from("items")
        .select("*")
        .eq("seller_id", currentUser.id);
      setItems(itemsData || []);

      const { data: linksData } = await supabase
        .from("links")
        .select("*")
        .eq("seller_id", currentUser.id)
        .order("position");
      setLinks(linksData || []);

      setPortfolioImages(currentUser.portfolio || []);

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", currentUser.id)
        .order("created_at", { ascending: false });
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  if (!currentUser) return null;

  const tabs = [
    { id: "overview", emoji: "📊", label: "Overview" },
    { id: "orders", emoji: "📦", label: "Orders" },
    { id: "theme", emoji: "🎨", label: "Theme" },
    { id: "profile", emoji: "👤", label: "Profile" },
    { id: "services", emoji: "💼", label: "Services" },
    { id: "shop", emoji: "🛍️", label: "Shop" },
    { id: "links", emoji: "🔗", label: "Links" },
    { id: "social", emoji: "📱", label: "Social" },
    { id: "portfolio", emoji: "📸", label: "Portfolio" },
    { id: "payments", emoji: "💳", label: "Payments" },
    { id: "badges", emoji: "🏆", label: "Badges" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        paddingBottom: "40px",
      }}
    >
      {/* Header - MOBILE OPTIMIZED */}
      <div
        style={{
          background: "var(--bg-card)",
          borderBottom: "3px solid #000000",
          padding: "16px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h1 style={{ fontSize: "clamp(18px, 5vw, 24px)", fontWeight: 700 }}>
            Dashboard
          </h1>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => navigate("/marketplace")}
              className="hubspot-button"
              style={{
                marginBottom: 0,
                width: "auto",
                padding: "8px 12px",
                fontSize: "clamp(12px, 3vw, 14px)",
                whiteSpace: "nowrap",
              }}
            >
              🛍️ Marketplace
            </button>
            <button
              onClick={() => {
                if (currentUser?.username) {
                  navigate(`/${currentUser.username}`);
                } else {
                  alert("Please set a username in your profile first!");
                }
              }}
              className="hubspot-button"
              style={{
                marginBottom: 0,
                width: "auto",
                padding: "8px 12px",
                fontSize: "clamp(12px, 3vw, 14px)",
                whiteSpace: "nowrap",
              }}
            >
              👁️ Profile
            </button>
            <button
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="hubspot-button"
              style={{
                marginBottom: 0,
                width: "auto",
                padding: "8px 12px",
                fontSize: "clamp(12px, 3vw, 14px)",
              }}
            >
              🚪
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            marginBottom: "24px",
            paddingBottom: "8px",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 20px",
                background: activeTab === tab.id ? "#FFFFFF" : "transparent",
                border: "2px solid #000000",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
                boxShadow:
                  activeTab === tab.id ? "3px 3px 0px #000000" : "none",
              }}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            currentUser={currentUser}
            onShowBadge={setShowBadge}
          />
        )}
        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            currentUser={currentUser}
            onReload={loadAllData}
          />
        )}
        {activeTab === "theme" && (
          <ThemeTab
            currentUser={currentUser}
            supabase={supabase}
            onReload={loadAllData}
          />
        )}
        {activeTab === "profile" && (
          <ProfileTab
            currentUser={currentUser}
            supabase={supabase}
            onReload={loadAllData}
          />
        )}
        {activeTab === "services" && (
          <ServicesTab
            services={services}
            currentUser={currentUser}
            supabase={supabase}
            onReload={loadAllData}
          />
        )}
        {activeTab === "shop" && (
          <ShopTab
            items={items}
            currentUser={currentUser}
            supabase={supabase}
            onReload={loadAllData}
          />
        )}
        {activeTab === "links" && (
          <LinksTab
            links={links}
            currentUser={currentUser}
            supabase={supabase}
            onReload={loadAllData}
          />
        )}
        {activeTab === "social" && (
          <SocialTab
            currentUser={currentUser}
            supabase={supabase}
            onReload={loadAllData}
          />
        )}
        {activeTab === "portfolio" && (
          <PortfolioTab
            portfolioImages={portfolioImages}
            currentUser={currentUser}
            supabase={supabase}
            onReload={loadAllData}
          />
        )}
        {activeTab === "payments" && (
          <PaymentsTab
            currentUser={currentUser}
            supabase={supabase}
            onReload={loadAllData}
          />
        )}
        {activeTab === "badges" && (
          <BadgesTab
            stats={stats}
            currentUser={currentUser}
            onShowBadge={setShowBadge}
          />
        )}
      </div>

      {/* Badge Modal */}
      {showBadge && (
        <ShareableBadge
          type={showBadge.type}
          count={showBadge.count}
          username={currentUser.username}
          onClose={() => setShowBadge(null)}
        />
      )}
    </div>
  );
};

// ========================================
// OVERVIEW TAB - MOBILE OPTIMIZED
// ========================================
const OverviewTab = ({ stats, currentUser, onShowBadge }) => {
  const [copied, setCopied] = useState(false);

  const profileUrl = currentUser?.username
    ? `${window.location.origin}/${currentUser.username}`
    : "Please set a username first";

  const copyToClipboard = () => {
    if (currentUser?.username) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert("Please set a username in your profile first!");
    }
  };

  return (
    <div>
      {/* Profile Link Section - MOBILE OPTIMIZED */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "3px solid #000000",
          borderRadius: "12px",
          padding: "clamp(16px, 4vw, 24px)",
          marginBottom: "24px",
          boxShadow: "6px 6px 0px #000000",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            fontSize: "clamp(14px, 3.5vw, 16px)",
            fontWeight: 600,
            marginBottom: "12px",
            opacity: 0.9,
          }}
        >
          🔗 Your BookaLink Profile
        </div>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "12px",
            wordBreak: "break-all",
            fontSize: "clamp(12px, 3vw, 16px)",
            fontWeight: 600,
            overflowWrap: "break-word",
          }}
        >
          {profileUrl}
        </div>
        <button
          onClick={copyToClipboard}
          style={{
            width: "100%",
            padding: "12px",
            background: copied ? "#4ECDC4" : "#FFFFFF",
            color: copied ? "#FFFFFF" : "#000000",
            border: "2px solid #000000",
            borderRadius: "8px",
            fontSize: "clamp(12px, 3.5vw, 14px)",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            minHeight: "44px",
          }}
        >
          {copied ? "✓ Copied!" : "📋 Copy Link"}
        </button>
      </div>

      <h2
        style={{
          fontSize: "clamp(18px, 4vw, 20px)",
          fontWeight: 700,
          marginBottom: "20px",
        }}
      >
        Quick Stats
      </h2>

      {/* Live Visitor Badge */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "3px solid #000000",
          borderRadius: "12px",
          padding: "clamp(20px, 5vw, 32px)",
          marginBottom: "24px",
          boxShadow: "6px 6px 0px #000000",
          color: "#FFFFFF",
          textAlign: "center",
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
        onClick={() =>
          onShowBadge({ type: "visitors", count: stats.profileViews })
        }
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-2px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        <div
          style={{
            fontSize: "clamp(48px, 12vw, 64px)",
            marginBottom: "16px",
          }}
        >
          👀
        </div>
        <div
          style={{
            fontSize: "clamp(36px, 10vw, 52px)",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          {stats.profileViews}
        </div>
        <div
          style={{
            fontSize: "clamp(16px, 4vw, 20px)",
            fontWeight: 600,
            marginBottom: "24px",
            letterSpacing: "1px",
          }}
        >
          TOTAL PROFILE VISITORS
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(16px, 5vw, 32px)",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "clamp(20px, 5vw, 28px)",
                fontWeight: 700,
              }}
            >
              {stats.todayViews}
            </div>
            <div style={{ fontSize: "clamp(12px, 3vw, 14px)", opacity: 0.9 }}>
              Today
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "clamp(20px, 5vw, 28px)",
                fontWeight: 700,
              }}
            >
              {stats.weekViews}
            </div>
            <div style={{ fontSize: "clamp(12px, 3vw, 14px)", opacity: 0.9 }}>
              This Week
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "clamp(20px, 5vw, 28px)",
                fontWeight: 700,
              }}
            >
              {stats.monthViews}
            </div>
            <div style={{ fontSize: "clamp(12px, 3vw, 14px)", opacity: 0.9 }}>
              This Month
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "20px",
            fontSize: "clamp(13px, 3vw, 15px)",
            opacity: 0.95,
            fontStyle: "italic",
          }}
        >
          📸 Click to share your visitor count on social media!
        </div>
      </div>

      {/* Other Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Total Orders",
            value: stats.totalOrders,
            emoji: "📦",
            color: "#4ECDC4",
          },
          {
            label: "Revenue",
            value: `$${stats.totalRevenue.toFixed(0)}`,
            emoji: "💰",
            color: "#FFD93D",
          },
          {
            label: "Link Clicks",
            value: stats.linkClicks,
            emoji: "🔗",
            color: "#A8E6CF",
          },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background: "#FFFFFF",
              border: "3px solid #000000",
              borderRadius: "12px",
              padding: "clamp(16px, 4vw, 24px)",
              boxShadow: "4px 4px 0px #000000",
            }}
          >
            <div
              style={{
                fontSize: "clamp(28px, 7vw, 36px)",
                marginBottom: "8px",
              }}
            >
              {stat.emoji}
            </div>
            <div
              style={{
                fontSize: "clamp(24px, 6vw, 32px)",
                fontWeight: 700,
                marginBottom: "4px",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#666666" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========================================
// ORDERS TAB - MOBILE OPTIMIZED
// ========================================
const OrdersTab = ({ orders, currentUser, onReload }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFD93D";
      case "payment_initiated":
        return "#4ECDC4";
      case "completed":
        return "#A8E6CF";
      case "cancelled":
        return "#FF6B6B";
      default:
        return "#F5F5F5";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "⏳ Pending";
      case "payment_initiated":
        return "💳 Payment Started";
      case "completed":
        return "✅ Completed";
      case "cancelled":
        return "❌ Cancelled";
      default:
        return status;
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", fontWeight: 700 }}>
          Orders & Inquiries ({orders.length})
        </h2>
      </div>

      {orders.length > 0 ? (
        <div style={{ display: "grid", gap: "16px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "#FFFFFF",
                border: "3px solid #000000",
                borderRadius: "12px",
                padding: "clamp(16px, 4vw, 20px)",
                boxShadow: "4px 4px 0px #000000",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "clamp(16px, 4vw, 18px)",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    {order.item_name}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(12px, 3vw, 14px)",
                      color: "#666666",
                    }}
                  >
                    {order.item_type === "service"
                      ? "💼 Service"
                      : "🛍️ Product"}
                    {order.item_price && ` • $${order.item_price}`}
                  </div>
                </div>
                <div
                  style={{
                    background: getStatusColor(order.status),
                    border: "2px solid #000000",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontSize: "clamp(11px, 2.5vw, 12px)",
                    fontWeight: 600,
                  }}
                >
                  {getStatusLabel(order.status)}
                </div>
              </div>

              <div
                style={{
                  background: "#F5F5F5",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(12px, 3vw, 14px)",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  👤 Customer Information
                </div>
                <div
                  style={{
                    fontSize: "clamp(12px, 3vw, 14px)",
                    marginBottom: "4px",
                  }}
                >
                  <strong>Name:</strong> {order.buyer_name}
                </div>
                <div
                  style={{
                    fontSize: "clamp(12px, 3vw, 14px)",
                    marginBottom: "4px",
                  }}
                >
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${order.buyer_email}`}
                    style={{ color: "#4ECDC4", textDecoration: "none" }}
                  >
                    {order.buyer_email}
                  </a>
                </div>
                {order.buyer_phone && (
                  <div
                    style={{
                      fontSize: "clamp(12px, 3vw, 14px)",
                      marginBottom: "4px",
                    }}
                  >
                    <strong>Phone:</strong>{" "}
                    <a
                      href={`tel:${order.buyer_phone}`}
                      style={{ color: "#4ECDC4", textDecoration: "none" }}
                    >
                      {order.buyer_phone}
                    </a>
                  </div>
                )}
                {order.notes && (
                  <div
                    style={{
                      fontSize: "clamp(12px, 3vw, 14px)",
                      marginTop: "8px",
                    }}
                  >
                    <strong>Message:</strong>
                    <div
                      style={{
                        marginTop: "4px",
                        padding: "8px",
                        background: "#FFFFFF",
                        borderRadius: "4px",
                        border: "1px solid #E0E0E0",
                      }}
                    >
                      {order.notes}
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  fontSize: "clamp(11px, 2.5vw, 12px)",
                  color: "#666666",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <span>
                  📅 {new Date(order.created_at).toLocaleDateString()} at{" "}
                  {new Date(order.created_at).toLocaleTimeString()}
                </span>
                {order.payment_method && <span>💳 {order.payment_method}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "clamp(40px, 10vw, 60px) 20px",
            background: "#FFFFFF",
            border: "3px solid #000000",
            borderRadius: "12px",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <div
            style={{
              fontSize: "clamp(48px, 12vw, 64px)",
              marginBottom: "16px",
            }}
          >
            📦
          </div>
          <div
            style={{
              fontSize: "clamp(16px, 4vw, 18px)",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            No orders yet
          </div>
          <div style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#666666" }}>
            When customers book your services or buy your products, they'll
            appear here.
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// THEME TAB - MOBILE OPTIMIZED
// ========================================
const ThemeTab = ({ currentUser, supabase, onReload }) => {
  const [saving, setSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return getThemeKeyFromColor(currentUser.theme_color) || getStoredTheme();
  });

  const handleThemeSelect = (themeKey) => {
    setSelectedTheme(themeKey);
    applyTheme(themeKey);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const theme = themes[selectedTheme];
      const { error } = await supabase
        .from("sellers")
        .update({
          theme_color: theme.colors["--primary-color"],
        })
        .eq("id", currentUser.id);

      if (error) throw error;

      alert("Theme updated! Your profile will now use the new theme.");
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update theme");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2
        style={{
          fontSize: "clamp(18px, 4vw, 20px)",
          fontWeight: 700,
          marginBottom: "12px",
        }}
      >
        🎨 Choose Your Theme
      </h2>
      <p
        style={{
          fontSize: "clamp(12px, 3vw, 14px)",
          color: "#666666",
          marginBottom: "24px",
        }}
      >
        Select a theme that represents your brand. This will change the look of
        your public profile and dashboard.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {Object.entries(themes).map(([key, theme]) => (
          <div
            key={key}
            onClick={() => handleThemeSelect(key)}
            style={{
              background: theme.colors["--bg-page"],
              border:
                selectedTheme === key
                  ? "4px solid #000000"
                  : "3px solid #000000",
              borderRadius: "12px",
              padding: "clamp(16px, 4vw, 24px) clamp(12px, 3vw, 20px)",
              textAlign: "center",
              cursor: "pointer",
              boxShadow:
                selectedTheme === key
                  ? "6px 6px 0px #000000"
                  : "4px 4px 0px #000000",
              transform: selectedTheme === key ? "scale(1.05)" : "scale(1)",
              transition: "all 0.2s",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (selectedTheme !== key) {
                e.currentTarget.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTheme !== key) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {selectedTheme === key && (
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "#000000",
                  color: "#FFFFFF",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
            )}
            <div
              style={{
                fontSize: "clamp(36px, 8vw, 48px)",
                marginBottom: "8px",
              }}
            >
              {theme.emoji}
            </div>
            <div
              style={{
                fontSize: "clamp(12px, 3vw, 14px)",
                fontWeight: 700,
                color: theme.colors["--text-on-bg"],
                textShadow:
                  theme.colors["--text-on-bg"] === "#FFFFFF"
                    ? "2px 2px 4px rgba(0,0,0,0.4)"
                    : "none",
                lineHeight: "1.2",
              }}
            >
              {theme.name}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="hubspot-button"
        style={{ marginBottom: 0 }}
      >
        {saving ? "Saving..." : "💾 Save Theme"}
      </button>
    </div>
  );
};
// ========================================
// PROFILE TAB - FIXED BIO SAVING
// ========================================
const ProfileTab = ({ currentUser, supabase, onReload }) => {
  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    businessName: currentUser.business_name || "",
    bio: currentUser.bio || "",
    profileImage: currentUser.profile_image || currentUser.profile_photo || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!currentUser?.id) {
      alert("Error: No user ID found");
      return;
    }

    setSaving(true);
    try {
      // Update sellers table
      const { error: sellerError } = await supabase
        .from("sellers")
        .update({
          name: formData.name,
          business_name: formData.businessName,
          bio: formData.bio,
          profile_image: formData.profileImage,
        })
        .eq("id", currentUser.id);

      if (sellerError) {
        console.error("Seller update error:", sellerError);
        throw sellerError;
      }

      // Update auth metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          business_name: formData.businessName,
          bio: formData.bio,
          profile_image: formData.profileImage,
        },
      });

      if (metadataError) {
        console.warn("Metadata update warning:", metadataError);
      }

      alert("Profile updated successfully!");
      
      // Reload data without refreshing page
      await onReload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "3px solid #000000",
        borderRadius: "12px",
        padding: "clamp(16px, 4vw, 24px)",
        boxShadow: "4px 4px 0px #000000",
      }}
    >
      <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", fontWeight: 700, marginBottom: "20px" }}>
        Edit Profile
      </h2>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "clamp(13px, 3vw, 14px)" }}
        >
          Profile Photo
        </label>
        <ImageUploader
          currentImage={formData.profileImage}
          buttonText="📷 Upload Profile Photo"
          onUploadComplete={(url) =>
            setFormData({ ...formData, profileImage: url })
          }
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "clamp(13px, 3vw, 14px)" }}
        >
          Full Name
        </label>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #000000",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "clamp(13px, 3vw, 14px)" }}
        >
          Business Name
        </label>
        <input
          value={formData.businessName}
          onChange={(e) =>
            setFormData({ ...formData, businessName: e.target.value })
          }
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #000000",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "clamp(13px, 3vw, 14px)" }}
        >
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows="4"
          placeholder="Tell people about yourself..."
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #000000",
            borderRadius: "8px",
            fontSize: "16px",
            resize: "vertical",
          }}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="hubspot-button"
        style={{ marginBottom: 0 }}
      >
        {saving ? "Saving..." : "💾 Save Changes"}
      </button>
    </div>
  );
};
// ========================================
// SERVICES TAB - MOBILE OPTIMIZED
// ========================================
const ServicesTab = ({ services, currentUser, supabase, onReload }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    priceType: "interested",
    price: "",
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!formData.name || !formData.duration) {
      alert("Please fill in service name and duration");
      return;
    }

    if (formData.priceType === "fixed" && !formData.price) {
      alert("Please enter a price");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("services").insert([
        {
          seller_id: currentUser.id,
          name: formData.name,
          description: formData.description,
          price:
            formData.priceType === "fixed" ? parseFloat(formData.price) : null,
          duration: parseInt(formData.duration),
        },
      ]);

      if (error) throw error;

      setFormData({
        name: "",
        description: "",
        duration: "",
        priceType: "interested",
        price: "",
      });
      setShowAddForm(false);
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete service");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", fontWeight: 700 }}>
          Services ({services.length})
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="hubspot-button"
          style={{
            width: "auto",
            marginBottom: 0,
            padding: "8px 16px",
            fontSize: "clamp(12px, 3vw, 14px)",
          }}
        >
          {showAddForm ? "❌ Cancel" : "➕ Add Service"}
        </button>
      </div>

      {showAddForm && (
        <div
          style={{
            background: "#FFFFFF",
            border: "3px solid #000000",
            borderRadius: "12px",
            padding: "clamp(16px, 4vw, 24px)",
            marginBottom: "20px",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(15px, 3.5vw, 16px)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Add New Service
          </h3>

          <input
            placeholder="Service Name (e.g., Wedding Photography)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="3"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "16px",
              marginBottom: "12px",
              resize: "vertical",
            }}
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "16px",
              marginBottom: "16px",
            }}
          />

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                fontSize: "clamp(13px, 3vw, 14px)",
              }}
            >
              Booking Type
            </label>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, priceType: "interested" })
                }
                style={{
                  flex: 1,
                  minWidth: "140px",
                  padding: "12px",
                  background:
                    formData.priceType === "interested" ? "#4ECDC4" : "#F5F5F5",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  fontSize: "clamp(12px, 3vw, 14px)",
                  fontWeight: 600,
                  cursor: "pointer",
                  color:
                    formData.priceType === "interested" ? "#FFFFFF" : "#000000",
                }}
              >
                💬 "I'm Interested"
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, priceType: "fixed" })}
                style={{
                  flex: 1,
                  minWidth: "140px",
                  padding: "12px",
                  background:
                    formData.priceType === "fixed" ? "#4ECDC4" : "#F5F5F5",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  fontSize: "clamp(12px, 3vw, 14px)",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: formData.priceType === "fixed" ? "#FFFFFF" : "#000000",
                }}
              >
                💰 Fixed Price
              </button>
            </div>
            <div
              style={{
                fontSize: "clamp(11px, 2.5vw, 12px)",
                color: "#666666",
                marginTop: "8px",
              }}
            >
              {formData.priceType === "interested"
                ? "Clients will click 'I'm Interested' to contact you for pricing"
                : "Show a fixed price that clients can book immediately"}
            </div>
          </div>

          {formData.priceType === "fixed" && (
            <input
              type="number"
              placeholder="Price ($)"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #000000",
                borderRadius: "8px",
                fontSize: "16px",
                marginBottom: "12px",
              }}
            />
          )}

          <button
            onClick={handleAdd}
            disabled={saving}
            className="hubspot-button"
            style={{ marginBottom: 0 }}
          >
            {saving ? "Adding..." : "✅ Add Service"}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {services.map((service) => (
          <div
            key={service.id}
            style={{
              background: "#FFFFFF",
              border: "3px solid #000000",
              borderRadius: "12px",
              padding: "clamp(16px, 4vw, 20px)",
              boxShadow: "4px 4px 0px #000000",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ flex: "1 1 200px" }}>
              <h3
                style={{
                  fontSize: "clamp(16px, 4vw, 18px)",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                {service.name}
              </h3>
              <p
                style={{
                  fontSize: "clamp(12px, 3vw, 14px)",
                  color: "#666666",
                  marginBottom: "8px",
                }}
              >
                {service.description}
              </p>
              <div
                style={{ fontSize: "clamp(12px, 3vw, 14px)", fontWeight: 600 }}
              >
                {service.price ? (
                  <span>
                    💰 ${service.price} · {service.duration} min
                  </span>
                ) : (
                  <span>💬 I'm Interested · {service.duration} min</span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(service.id)}
              style={{
                background: "#FF6B6B",
                border: "2px solid #000000",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "clamp(12px, 3vw, 14px)",
                fontWeight: 600,
                cursor: "pointer",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              🗑️ Delete
            </button>
          </div>
        ))}

        {services.length === 0 && !showAddForm && (
          <div
            style={{
              textAlign: "center",
              padding: "clamp(30px, 8vw, 40px)",
              color: "#666666",
            }}
          >
            No services yet. Click "Add Service" to get started!
          </div>
        )}
      </div>
    </div>
  );
};

// ========================================
// SHOP TAB - MOBILE OPTIMIZED
// ========================================
const ShopTab = ({ items, currentUser, supabase, onReload }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill in required fields");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("items").insert([
        {
          seller_id: currentUser.id,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image_url: formData.imageUrl || null,
        },
      ]);

      if (error) throw error;

      setFormData({ name: "", description: "", price: "", imageUrl: "" });
      setShowAddForm(false);
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete item");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", fontWeight: 700 }}>
          Shop Items ({items.length})
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="hubspot-button"
          style={{
            width: "auto",
            marginBottom: 0,
            padding: "8px 16px",
            fontSize: "clamp(12px, 3vw, 14px)",
          }}
        >
          {showAddForm ? "❌ Cancel" : "➕ Add Item"}
        </button>
      </div>

      {showAddForm && (
        <div
          style={{
            background: "#FFFFFF",
            border: "3px solid #000000",
            borderRadius: "12px",
            padding: "clamp(16px, 4vw, 24px)",
            marginBottom: "20px",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(15px, 3.5vw, 16px)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Add New Item
          </h3>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                fontSize: "clamp(13px, 3vw, 14px)",
              }}
            >
              Product Image
            </label>
            <ImageUploader
              currentImage={formData.imageUrl}
              buttonText="📸 Upload Image"
              onUploadComplete={(url) =>
                setFormData({ ...formData, imageUrl: url })
              }
            />
          </div>

          <input
            placeholder="Item Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="3"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "16px",
              marginBottom: "12px",
              resize: "vertical",
            }}
          />

          <input
            type="number"
            placeholder="Price ($)"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          />

          <button
            onClick={handleAdd}
            disabled={saving}
            className="hubspot-button"
            style={{ marginBottom: 0 }}
          >
            {saving ? "Adding..." : "✅ Add Item"}
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#FFFFFF",
              border: "3px solid #000000",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "4px 4px 0px #000000",
            }}
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderBottom: "3px solid #000000",
                }}
              />
            )}
            <div style={{ padding: "16px" }}>
              <h3
                style={{
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                {item.name}
              </h3>
              <p
                style={{
                  fontSize: "clamp(12px, 3vw, 14px)",
                  color: "#666666",
                  marginBottom: "8px",
                }}
              >
                {item.description}
              </p>
              <div
                style={{
                  fontSize: "clamp(16px, 4vw, 18px)",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                ${item.price}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  width: "100%",
                  background: "#FF6B6B",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "clamp(12px, 3vw, 14px)",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#FFFFFF",
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && !showAddForm && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "clamp(30px, 8vw, 40px)",
              color: "#666666",
            }}
          >
            No items yet. Click "Add Item" to get started!
          </div>
        )}
      </div>
    </div>
  );
};

// ========================================
// LINKS TAB - MOBILE OPTIMIZED
// ========================================
const LinksTab = ({ links, currentUser, supabase, onReload }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    url: "",
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!formData.label || !formData.url) {
      alert("Please fill in all fields");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("links").insert([
        {
          seller_id: currentUser.id,
          type: "custom",
          label: formData.label,
          url: formData.url,
          position: links.length,
        },
      ]);

      if (error) throw error;

      setFormData({ label: "", url: "" });
      setShowAddForm(false);
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add link");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link?")) return;

    try {
      const { error } = await supabase.from("links").delete().eq("id", id);
      if (error) throw error;
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete link");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", fontWeight: 700 }}>
          Custom Links ({links.length})
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="hubspot-button"
          style={{
            width: "auto",
            marginBottom: 0,
            padding: "8px 16px",
            fontSize: "clamp(12px, 3vw, 14px)",
          }}
        >
          {showAddForm ? "❌ Cancel" : "➕ Add Link"}
        </button>
      </div>

      {showAddForm && (
        <div
          style={{
            background: "#FFFFFF",
            border: "3px solid #000000",
            borderRadius: "12px",
            padding: "clamp(16px, 4vw, 24px)",
            marginBottom: "20px",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(15px, 3.5vw, 16px)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Add New Link
          </h3>

          <input
            placeholder="Label (e.g., 📝 My Blog)"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          />

          <input
            placeholder="URL (e.g., https://myblog.com)"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          />

          <button
            onClick={handleAdd}
            disabled={saving}
            className="hubspot-button"
            style={{ marginBottom: 0 }}
          >
            {saving ? "Adding..." : "✅ Add Link"}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gap: "12px" }}>
        {links.map((link) => (
          <div
            key={link.id}
            style={{
              background: "#FFFFFF",
              border: "3px solid #000000",
              borderRadius: "12px",
              padding: "clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)",
              boxShadow: "4px 4px 0px #000000",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ flex: "1 1 200px" }}>
              <div
                style={{
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                {link.label}
              </div>
              <div
                style={{
                  fontSize: "clamp(12px, 3vw, 14px)",
                  color: "#666666",
                  wordBreak: "break-all",
                }}
              >
                {link.url}
              </div>
            </div>
            <button
              onClick={() => handleDelete(link.id)}
              style={{
                background: "#FF6B6B",
                border: "2px solid #000000",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "clamp(12px, 3vw, 14px)",
                fontWeight: 600,
                cursor: "pointer",
                color: "#FFFFFF",
              }}
            >
              🗑️
            </button>
          </div>
        ))}

        {links.length === 0 && !showAddForm && (
          <div
            style={{
              textAlign: "center",
              padding: "clamp(30px, 8vw, 40px)",
              color: "#666666",
            }}
          >
            No links yet. Click "Add Link" to get started!
          </div>
        )}
      </div>
    </div>
  );
};

// ========================================
// SOCIAL TAB - MOBILE OPTIMIZED
// ========================================
const SocialTab = ({ currentUser, supabase, onReload }) => {
  const [formData, setFormData] = useState({
    instagram: currentUser.instagram_handle || "",
    tiktok: currentUser.tiktok_handle || "",
    youtube: currentUser.youtube_handle || "",
    twitter: currentUser.twitter_handle || "",
    facebook: currentUser.facebook_url || "",
    linkedin: currentUser.linkedin_url || "",
    pinterest: currentUser.pinterest_handle || "",
    snapchat: currentUser.snapchat_handle || "",
    twitch: currentUser.twitch_handle || "",
    spotify: currentUser.spotify_url || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("sellers")
        .update({
          instagram_handle: formData.instagram,
          tiktok_handle: formData.tiktok,
          youtube_handle: formData.youtube,
          twitter_handle: formData.twitter,
          facebook_url: formData.facebook,
          linkedin_url: formData.linkedin,
          pinterest_handle: formData.pinterest,
          snapchat_handle: formData.snapchat,
          twitch_handle: formData.twitch,
          spotify_url: formData.spotify,
        })
        .eq("id", currentUser.id);

      if (error) throw error;
      alert("Social links updated!");
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update social links");
    } finally {
      setSaving(false);
    }
  };

  const socialPlatforms = [
    {
      name: "Instagram",
      emoji: "📷",
      key: "instagram",
      placeholder: "@yourhandle",
      helper: "Enter your Instagram username (without @)",
    },
    {
      name: "TikTok",
      emoji: "🎵",
      key: "tiktok",
      placeholder: "@yourhandle",
      helper: "Enter your TikTok username (without @)",
    },
    {
      name: "YouTube",
      emoji: "▶️",
      key: "youtube",
      placeholder: "@yourchannel or youtube.com/c/yourchannel",
      helper: "Enter your YouTube channel username or full URL",
    },
    {
      name: "Twitter / X",
      emoji: "🐦",
      key: "twitter",
      placeholder: "@yourhandle",
      helper: "Enter your Twitter/X username (without @)",
    },
    {
      name: "Facebook",
      emoji: "👥",
      key: "facebook",
      placeholder: "facebook.com/yourpage",
      helper: "Enter your full Facebook page URL",
    },
    {
      name: "LinkedIn",
      emoji: "💼",
      key: "linkedin",
      placeholder: "linkedin.com/in/yourprofile",
      helper: "Enter your full LinkedIn profile URL",
    },
    {
      name: "Pinterest",
      emoji: "📌",
      key: "pinterest",
      placeholder: "@yourhandle",
      helper: "Enter your Pinterest username (without @)",
    },
    {
      name: "Snapchat",
      emoji: "👻",
      key: "snapchat",
      placeholder: "yourhandle",
      helper: "Enter your Snapchat username",
    },
    {
      name: "Twitch",
      emoji: "🎮",
      key: "twitch",
      placeholder: "yourhandle",
      helper: "Enter your Twitch username",
    },
    {
      name: "Spotify",
      emoji: "🎧",
      key: "spotify",
      placeholder: "open.spotify.com/artist/...",
      helper: "Enter your full Spotify artist/playlist URL",
    },
  ];

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "3px solid #000000",
        borderRadius: "12px",
        padding: "clamp(16px, 4vw, 24px)",
        boxShadow: "4px 4px 0px #000000",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(18px, 4vw, 20px)",
          fontWeight: 700,
          marginBottom: "12px",
        }}
      >
        Social Media Links
      </h2>
      <p
        style={{
          fontSize: "clamp(12px, 3vw, 14px)",
          color: "#666666",
          marginBottom: "24px",
        }}
      >
        Add your social media profiles to display on your public page
      </p>

      <div style={{ display: "grid", gap: "20px" }}>
        {socialPlatforms.map((platform) => (
          <div key={platform.key} style={{ marginBottom: "8px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                fontWeight: 600,
                fontSize: "clamp(13px, 3vw, 15px)",
              }}
            >
              <span style={{ fontSize: "clamp(18px, 4vw, 20px)" }}>
                {platform.emoji}
              </span>
              <span>{platform.name}</span>
            </label>
            <input
              placeholder={platform.placeholder}
              value={formData[platform.key]}
              onChange={(e) =>
                setFormData({ ...formData, [platform.key]: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #000000",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
            <div
              style={{
                fontSize: "clamp(11px, 2.5vw, 12px)",
                color: "#666666",
                marginTop: "4px",
                marginLeft: "4px",
              }}
            >
              {platform.helper}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="hubspot-button"
        style={{ marginBottom: 0, marginTop: "24px" }}
      >
        {saving ? "Saving..." : "💾 Save Social Links"}
      </button>
    </div>
  );
};

// ========================================
// PORTFOLIO TAB - MOBILE OPTIMIZED
// ========================================
const PortfolioTab = ({ portfolioImages, currentUser, supabase, onReload }) => {


  const handleImageUpload = async (url) => {
    setUploading(true);
    try {
      const updatedPortfolio = [...(portfolioImages || []), url];

      const { error } = await supabase
        .from("sellers")
        .update({ portfolio: updatedPortfolio })
        .eq("id", currentUser.id);

      if (error) throw error;

      alert("Image added to portfolio!");
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this image from your portfolio?")) return;

    try {
      const updatedPortfolio = (portfolioImages || []).filter(
        (_, i) => i !== index
      );

      const { error } = await supabase
        .from("sellers")
        .update({ portfolio: updatedPortfolio })
        .eq("id", currentUser.id);

      if (error) throw error;

      alert("Image deleted!");
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete image");
    }
  };

  return (
    <div>
      <h2
        style={{
          fontSize: "clamp(18px, 4vw, 20px)",
          fontWeight: 700,
          marginBottom: "20px",
        }}
      >
        Portfolio ({(portfolioImages || []).length} images)
      </h2>

      <div
        style={{
          background: "#FFFFFF",
          border: "3px solid #000000",
          borderRadius: "12px",
          padding: "clamp(16px, 4vw, 20px)",
          marginBottom: "20px",
          boxShadow: "4px 4px 0px #000000",
        }}
      >
        <h3
          style={{
            fontSize: "clamp(15px, 3.5vw, 16px)",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          Add Image to Portfolio
        </h3>
        <ImageUploader
          buttonText="📸 Upload Portfolio Image"
          onUploadComplete={handleImageUpload}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {(portfolioImages || []).map((imageUrl, index) => (
          <div
            key={index}
            style={{
              background: "#FFFFFF",
              border: "3px solid #000000",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "4px 4px 0px #000000",
              position: "relative",
            }}
          >
            <img
              src={imageUrl}
              alt={`Portfolio ${index + 1}`}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
            <button
              onClick={() => handleDelete(index)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "#FF6B6B",
                border: "2px solid #000000",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "clamp(12px, 3vw, 14px)",
                fontWeight: 600,
                cursor: "pointer",
                color: "#FFFFFF",
                boxShadow: "2px 2px 0px #000000",
              }}
            >
              🗑️ Delete
            </button>
          </div>
        ))}

        {(!portfolioImages || portfolioImages.length === 0) && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "clamp(30px, 8vw, 40px)",
              color: "#666666",
            }}
          >
            No portfolio images yet. Upload your first image above!
          </div>
        )}
      </div>
    </div>
  );
};

// ========================================
// PAYMENTS TAB - MOBILE OPTIMIZED
// ========================================
const PaymentsTab = ({ currentUser, supabase, onReload }) => {
  const [formData, setFormData] = useState({
    venmo: currentUser.venmo_username || "",
    cashapp: currentUser.cashapp_username || "",
    paypal: currentUser.paypal_email || "",
    zelle: currentUser.zelle_email || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("sellers")
        .update({
          venmo_username: formData.venmo,
          cashapp_username: formData.cashapp,
          paypal_email: formData.paypal,
          zelle_email: formData.zelle,
        })
        .eq("id", currentUser.id);

      if (error) throw error;
      alert("Payment options updated!");
      onReload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update payment options");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "3px solid #000000",
        borderRadius: "12px",
        padding: "clamp(16px, 4vw, 24px)",
        boxShadow: "4px 4px 0px #000000",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(18px, 4vw, 20px)",
          fontWeight: 700,
          marginBottom: "20px",
        }}
      >
        Payment Options
      </h2>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
            fontSize: "clamp(13px, 3vw, 14px)",
          }}
        >
          💚 Venmo Username
        </label>
        <input
          placeholder="@yourvenmo"
          value={formData.venmo}
          onChange={(e) => setFormData({ ...formData, venmo: e.target.value })}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #000000",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
            fontSize: "clamp(13px, 3vw, 14px)",
          }}
        >
          💵 Cash App Username
        </label>
        <input
          placeholder="$yourcashapp"
          value={formData.cashapp}
          onChange={(e) =>
            setFormData({ ...formData, cashapp: e.target.value })
          }
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #000000",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
            fontSize: "clamp(13px, 3vw, 14px)",
          }}
        >
          💙 PayPal Email
        </label>
        <input
          placeholder="your@paypal.com"
          value={formData.paypal}
          onChange={(e) => setFormData({ ...formData, paypal: e.target.value })}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #000000",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
            fontSize: "clamp(13px, 3vw, 14px)",
          }}
        >
          🏦 Zelle Email
        </label>
        <input
          placeholder="your@zelle.com"
          value={formData.zelle}
          onChange={(e) => setFormData({ ...formData, zelle: e.target.value })}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #000000",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="hubspot-button"
        style={{ marginBottom: 0 }}
      >
        {saving ? "Saving..." : "💾 Save Payment Options"}
      </button>
    </div>
  );
};

// ========================================
// BADGES TAB - MOBILE OPTIMIZED
// ========================================
const BadgesTab = ({ stats, currentUser, onShowBadge }) => {
  const milestones = [1, 5, 10, 25, 50, 100];

  return (
    <div>
      <h2
        style={{
          fontSize: "clamp(18px, 4vw, 20px)",
          fontWeight: 700,
          marginBottom: "20px",
        }}
      >
        Achievement Badges
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "16px",
        }}
      >
        {milestones.map((milestone) => {
          const unlocked = stats.totalOrders >= milestone;
          return (
            <div
              key={milestone}
              onClick={() =>
                unlocked && onShowBadge({ type: "orders", count: milestone })
              }
              style={{
                background: unlocked ? "#FFFFFF" : "#F5F5F5",
                border: "3px solid #000000",
                borderRadius: "12px",
                padding: "clamp(16px, 4vw, 20px)",
                textAlign: "center",
                cursor: unlocked ? "pointer" : "default",
                opacity: unlocked ? 1 : 0.5,
                boxShadow: unlocked ? "4px 4px 0px #000000" : "none",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => {
                if (unlocked) {
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (unlocked) {
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              <div
                style={{
                  fontSize: "clamp(40px, 10vw, 48px)",
                  marginBottom: "12px",
                }}
              >
                {unlocked ? "🏆" : "🔒"}
              </div>
              <div
                style={{
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                {milestone} Orders
              </div>
              <div
                style={{
                  fontSize: "clamp(11px, 2.5vw, 12px)",
                  color: "#666666",
                }}
              >
                {unlocked
                  ? "Click to share!"
                  : `${milestone - stats.totalOrders} to go!`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
