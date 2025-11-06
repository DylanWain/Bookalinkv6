import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import BookingModal from "../components/BookingModal";

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [sellers, setSellers] = useState([]);
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    setLoading(true);
    try {
      const { data: sellersData } = await supabase
        .from("sellers")
        .select("*")
        .not("username", "is", null);

      setSellers(sellersData || []);

      const { data: servicesData } = await supabase
        .from("services")
        .select(
          "*, seller:sellers(id, username, name, business_name, profile_image)"
        )
        .order("created_at", { ascending: false });

      setServices(servicesData || []);

      const { data: itemsData } = await supabase
        .from("items")
        .select(
          "*, seller:sellers(id, username, name, business_name, profile_image)"
        )
        .order("created_at", { ascending: false });

      setItems(itemsData || []);
    } catch (error) {
      console.error("Error loading marketplace:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.seller?.business_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === "all" || filterType === "services";

    return matchesSearch && matchesFilter;
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller?.business_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === "all" || filterType === "products";

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-page)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "clamp(48px, 12vw, 64px)",
              marginBottom: "16px",
            }}
          >
            🛍️
          </div>
          <div style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 600 }}>
            Loading marketplace...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        paddingBottom: "40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--bg-card)",
          borderBottom: "3px solid #000000",
          padding: "clamp(12px, 3vw, 20px)",
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
            padding: "0 clamp(12px, 3vw, 16px)",
          }}
        >
          <h1 style={{ fontSize: "clamp(18px, 5vw, 24px)", fontWeight: 700 }}>
            🛍️ BookaLink Marketplace
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
              onClick={() => navigate("/")}
              className="hubspot-button"
              style={{
                marginBottom: 0,
                width: "auto",
                padding: "8px 16px",
                fontSize: "clamp(12px, 3vw, 14px)",
              }}
            >
              🏠
            </button>
            {currentUser ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="hubspot-button"
                style={{
                  marginBottom: 0,
                  width: "auto",
                  padding: "8px 16px",
                  fontSize: "clamp(12px, 3vw, 14px)",
                  whiteSpace: "nowrap",
                }}
              >
                📊 Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="hubspot-button"
                  style={{
                    marginBottom: 0,
                    width: "auto",
                    padding: "8px 16px",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    whiteSpace: "nowrap",
                  }}
                >
                  🔑 Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="hubspot-button"
                  style={{
                    marginBottom: 0,
                    width: "auto",
                    padding: "8px 16px",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    background: "var(--primary-color)",
                    color: "#FFFFFF",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✨ Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(16px, 4vw, 20px)",
        }}
      >
        {/* Search & Filter */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "3px solid #000000",
            borderRadius: "12px",
            padding: "clamp(16px, 4vw, 20px)",
            marginBottom: "24px",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <input
            type="text"
            placeholder="🔍 Search services, products, or sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          />

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["all", "services", "products"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  flex: "1 1 auto",
                  minWidth: "100px",
                  padding: "10px 16px",
                  background:
                    filterType === type ? "var(--primary-color)" : "#F5F5F5",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  fontSize: "clamp(12px, 3vw, 14px)",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: filterType === type ? "#FFFFFF" : "#000000",
                  transition: "all 0.2s",
                }}
              >
                {type === "all" && "📦 All"}
                {type === "services" && "💼 Services"}
                {type === "products" && "🛍️ Products"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "3px solid #000000",
              borderRadius: "12px",
              padding: "clamp(12px, 3vw, 16px)",
              textAlign: "center",
              boxShadow: "3px 3px 0px #000000",
            }}
          >
            <div
              style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 700 }}
            >
              {sellers.length}
            </div>
            <div
              style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#666666" }}
            >
              Sellers
            </div>
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              border: "3px solid #000000",
              borderRadius: "12px",
              padding: "clamp(12px, 3vw, 16px)",
              textAlign: "center",
              boxShadow: "3px 3px 0px #000000",
            }}
          >
            <div
              style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 700 }}
            >
              {services.length}
            </div>
            <div
              style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#666666" }}
            >
              Services
            </div>
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              border: "3px solid #000000",
              borderRadius: "12px",
              padding: "clamp(12px, 3vw, 16px)",
              textAlign: "center",
              boxShadow: "3px 3px 0px #000000",
            }}
          >
            <div
              style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 700 }}
            >
              {items.length}
            </div>
            <div
              style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#666666" }}
            >
              Products
            </div>
          </div>
        </div>

        {/* Services Section - WITH NAVIGATION */}
        {(filterType === "all" || filterType === "services") &&
          filteredServices.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontSize: "clamp(18px, 4vw, 20px)",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}
              >
                💼 Services ({filteredServices.length})
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}
              >
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    style={{
                      background: "var(--bg-card)",
                      border: "3px solid #000000",
                      borderRadius: "12px",
                      padding: "clamp(16px, 4vw, 20px)",
                      boxShadow: "4px 4px 0px #000000",
                      transition: "transform 0.2s",
                    }}
                  >
                    {/* Seller Info - CLICKABLE TO PROFILE */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (service.seller?.username) {
                          navigate(`/${service.seller.username}`);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "16px",
                        paddingBottom: "12px",
                        borderBottom: "2px solid rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        padding: "4px",
                        margin: "-4px -4px 12px -4px",
                        borderRadius: "8px",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {service.seller?.profile_image ? (
                        <img
                          src={service.seller.profile_image}
                          alt={service.seller.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #000000",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "var(--primary-color)",
                            border: "2px solid #000000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                          }}
                        >
                          {service.seller?.name?.charAt(0) || "?"}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "clamp(12px, 3vw, 14px)",
                            fontWeight: 600,
                            color: "#666666",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {service.seller?.business_name ||
                            service.seller?.name}
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(11px, 2.5vw, 12px)",
                            color: "#999999",
                          }}
                        >
                          @{service.seller?.username}
                        </div>
                      </div>
                    </div>

                    {/* Service Details - CLICKABLE TO BOOKING */}
                    <div
                      onClick={() => setSelectedService(service)}
                      style={{
                        cursor: "pointer",
                        padding: "4px",
                        margin: "-4px",
                        borderRadius: "8px",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.8";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
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
                          marginBottom: "12px",
                          lineHeight: "1.4",
                        }}
                      >
                        {service.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "clamp(12px, 3vw, 14px)",
                            fontWeight: 600,
                          }}
                        >
                          ⏱️ {service.duration} min
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(14px, 3.5vw, 16px)",
                            fontWeight: 700,
                            color: "var(--primary-color)",
                          }}
                        >
                          {service.price
                            ? `$${service.price}`
                            : "I'm Interested"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Products Section - WITH NAVIGATION */}
        {(filterType === "all" || filterType === "products") &&
          filteredItems.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: "clamp(18px, 4vw, 20px)",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}
              >
                🛍️ Products ({filteredItems.length})
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "var(--bg-card)",
                      border: "3px solid #000000",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "4px 4px 0px #000000",
                      transition: "transform 0.2s",
                    }}
                  >
                    {/* Image - CLICKABLE TO BOOKING */}
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        onClick={() => setSelectedItem(item)}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderBottom: "3px solid #000000",
                          cursor: "pointer",
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                      />
                    )}
                    <div style={{ padding: "clamp(12px, 3vw, 16px)" }}>
                      {/* Seller Info - CLICKABLE TO PROFILE */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.seller?.username) {
                            navigate(`/${item.seller.username}`);
                          }
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "12px",
                          cursor: "pointer",
                          padding: "4px",
                          margin: "-4px -4px 12px -4px",
                          borderRadius: "4px",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {item.seller?.profile_image ? (
                          <img
                            src={item.seller.profile_image}
                            alt={item.seller.name}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #000000",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              background: "var(--primary-color)",
                              border: "2px solid #000000",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#FFFFFF",
                            }}
                          >
                            {item.seller?.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: "clamp(11px, 2.5vw, 12px)",
                            color: "#666666",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.seller?.business_name || item.seller?.name}
                        </div>
                      </div>

                      {/* Product Details - CLICKABLE TO BOOKING */}
                      <div
                        onClick={() => setSelectedItem(item)}
                        style={{
                          cursor: "pointer",
                          padding: "4px",
                          margin: "-4px",
                          borderRadius: "8px",
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = "0.8";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                      >
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
                            marginBottom: "12px",
                            lineHeight: "1.4",
                          }}
                        >
                          {item.description}
                        </p>
                        <div
                          style={{
                            fontSize: "clamp(16px, 4vw, 18px)",
                            fontWeight: 700,
                            color: "var(--primary-color)",
                          }}
                        >
                          ${item.price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* No Results */}
        {filteredServices.length === 0 && filteredItems.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "clamp(40px, 10vw, 60px) 20px",
              background: "var(--bg-card)",
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
              🔍
            </div>
            <div
              style={{
                fontSize: "clamp(16px, 4vw, 18px)",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              No results found
            </div>
            <div
              style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#666666" }}
            >
              Try adjusting your search or filter
            </div>
          </div>
        )}
      </div>

      {/* Booking Modals */}
      {selectedService && (
        <BookingModal
          type="service"
          item={selectedService}
          seller={selectedService.seller}
          onClose={() => setSelectedService(null)}
        />
      )}

      {selectedItem && (
        <BookingModal
          type="product"
          item={selectedItem}
          seller={selectedItem.seller}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default MarketplacePage;
