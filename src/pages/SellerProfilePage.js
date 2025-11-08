
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import ReviewsModal from "../components/ReviewsModal";
import BookingModal from "../components/BookingModal";
import { applySellerTheme } from "../styles/themes";

const SellerProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [seller, setSeller] = useState(null);
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([]);
  const [links, setLinks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    item: null,
    type: null,
  });

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      const { data: sellerData, error: sellerError } = await supabase
        .from("sellers")
        .select("*")
        .eq("username", username)
        .single();

      if (sellerError) throw sellerError;
      setSeller(sellerData);

      applySellerTheme(sellerData.theme_color);

      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("seller_id", sellerData.id);
      setServices(servicesData || []);

      const { data: itemsData } = await supabase
        .from("items")
        .select("*")
        .eq("seller_id", sellerData.id);
      setItems(itemsData || []);

      const { data: linksData } = await supabase
        .from("links")
        .select("*")
        .eq("seller_id", sellerData.id)
        .order("position");
      setLinks(linksData || []);

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("seller_id", sellerData.id)
        .order("created_at", { ascending: false });
      setReviews(reviewsData || []);

      if (sellerData.id) {
        await supabase.from("analytics").insert([
          {
            seller_id: sellerData.id,
            event_type: "profile_view",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "18px" }}>Loading...</div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "18px" }}>Profile not found</div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : seller.rating || 4.8;

  const portfolioImages = seller.portfolio || [];

  const socialLinks = [
    {
      icon: "📷",
      url: seller.instagram_handle
        ? `https://instagram.com/${seller.instagram_handle.replace("@", "")}`
        : null,
      name: "Instagram",
    },
    {
      icon: "🎵",
      url: seller.tiktok_handle
        ? `https://tiktok.com/@${seller.tiktok_handle.replace("@", "")}`
        : null,
      name: "TikTok",
    },
    {
      icon: "▶️",
      url: seller.youtube_handle
        ? seller.youtube_handle.startsWith("http")
          ? seller.youtube_handle
          : `https://youtube.com/${seller.youtube_handle.replace("@", "")}`
        : null,
      name: "YouTube",
    },
    {
      icon: "🐦",
      url: seller.twitter_handle
        ? `https://twitter.com/${seller.twitter_handle.replace("@", "")}`
        : null,
      name: "Twitter",
    },
    {
      icon: "👥",
      url: seller.facebook_url
        ? seller.facebook_url.startsWith("http")
          ? seller.facebook_url
          : `https://facebook.com/${seller.facebook_url}`
        : null,
      name: "Facebook",
    },
    {
      icon: "💼",
      url: seller.linkedin_url
        ? seller.linkedin_url.startsWith("http")
          ? seller.linkedin_url
          : `https://linkedin.com/in/${seller.linkedin_url}`
        : null,
      name: "LinkedIn",
    },
    {
      icon: "📌",
      url: seller.pinterest_handle
        ? `https://pinterest.com/${seller.pinterest_handle.replace("@", "")}`
        : null,
      name: "Pinterest",
    },
    {
      icon: "👻",
      url: seller.snapchat_handle
        ? `https://snapchat.com/add/${seller.snapchat_handle}`
        : null,
      name: "Snapchat",
    },
    {
      icon: "🎮",
      url: seller.twitch_handle
        ? `https://twitch.tv/${seller.twitch_handle}`
        : null,
      name: "Twitch",
    },
    {
      icon: "🎧",
      url: seller.spotify_url
        ? seller.spotify_url.startsWith("http")
          ? seller.spotify_url
          : `https://open.spotify.com/artist/${seller.spotify_url}`
        : null,
      name: "Spotify",
    },
  ].filter((link) => link.url);

  const isOwnProfile = currentUser && currentUser.id === seller.id;

  return (
    <div className="profile-page">
      {/* Top Navigation Bar - UPDATED WITH MARKETPLACE */}
      <div className="top-bar">
        <button
          onClick={() => navigate("/")}
          className="top-bar-button"
          style={{ fontSize: "clamp(12px, 3vw, 14px)" }}
        >
          🏠 Home
        </button>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/marketplace")}
            className="top-bar-button"
            style={{ fontSize: "clamp(12px, 3vw, 14px)" }}
          >
            🛍️ Marketplace
          </button>
          {isOwnProfile && (
            <button
              onClick={() => navigate("/dashboard")}
              className="top-bar-button"
              style={{ fontSize: "clamp(12px, 3vw, 14px)" }}
            >
              ⚙️ Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={
            seller.profile_image ||
            seller.profile_photo ||
            "https://via.placeholder.com/120"
          }
          alt={seller.name}
          className="profile-picture"
        />
        <h1 className="profile-username">@{seller.username}</h1>
        <h2 className="profile-title">
          {seller.business_name || seller.display_name || seller.name}
        </h2>

        {/* Full Bio Display */}
        {seller.bio && (
          <p
            className="profile-tagline"
            style={{
              whiteSpace: "pre-wrap",
              maxWidth: "600px",
              margin: "12px auto",
              lineHeight: "1.5",
            }}
          >
            {seller.bio}
          </p>
        )}

        {/* Social Icons */}
        {socialLinks.length > 0 && (
          <div className="social-icons-row">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}

        {/* Marketplace Button - PROMINENT PLACEMENT */}
        <div
          style={{
            marginBottom: "20px",
            maxWidth: "400px",
            margin: "16px auto 20px",
          }}
        >
          <button
            onClick={() => navigate("/marketplace")}
            className="hubspot-button"
            style={{
              marginBottom: 0,
              fontSize: "clamp(14px, 3.5vw, 16px)",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#FFFFFF",
              border: "3px solid #000000",
            }}
          >
            🛍️ Browse Marketplace
          </button>
        </div>

        {/* Rating Button */}
        <button
          className="rating-button"
          onClick={() => setShowReviewsModal(true)}
        >
          ⭐ {averageRating} · {reviews.length || seller.reviews_count || 0}{" "}
          reviews
        </button>
      </div>

      {/* Links Section */}
      {links.length > 0 && (
        <div className="content-section">
          <div className="section-label">
            <span>🔗</span> Links
          </div>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hubspot-button"
            >
              <span style={{ fontSize: "24px" }}>
                {link.label.match(/[\p{Emoji}]/u)?.[0] || "🔗"}
              </span>
              <span>{link.label.replace(/[\p{Emoji}]/gu, "").trim()}</span>
            </a>
          ))}
        </div>
      )}

      {/* Services Section - WITH BOOKING */}
      {services.length > 0 && (
        <div className="content-section">
          <div className="section-label">
            <span>💼</span> Services
          </div>
          {services.map((service) => (
            <div key={service.id} className="service-card">
              {service.image && (
                <img
                  src={service.image}
                  alt={service.name}
                  className="service-image"
                />
              )}
              <div className="service-info">
                <div className="service-name">{service.name}</div>
                {service.description && (
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#666666",
                      marginBottom: "8px",
                    }}
                  >
                    {service.description}
                  </div>
                )}
                <div className="service-details">
                  {service.price
                    ? `$${service.price} · ${service.duration} min`
                    : `${service.duration} min session`}
                </div>
                {service.price ? (
                  <button
                    onClick={() =>
                      setBookingModal({
                        isOpen: true,
                        item: service,
                        type: "service",
                      })
                    }
                    className="hubspot-button"
                    style={{
                      marginTop: "12px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      marginBottom: 0,
                      width: "100%",
                    }}
                  >
                    📅 Book Now - ${service.price}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setBookingModal({
                        isOpen: true,
                        item: service,
                        type: "service",
                      })
                    }
                    className="hubspot-button"
                    style={{
                      marginTop: "12px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      marginBottom: 0,
                      width: "100%",
                      background: "#FFD93D",
                    }}
                  >
                    💬 I'm Interested
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shop Section - WITH BOOKING */}
      {items.length > 0 && (
        <div className="content-section">
          <div className="section-label">
            <span>🛍️</span> Shop
          </div>
          <div className="shop-grid">
            {items.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="product-card"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.image_url || "https://via.placeholder.com/200"}
                  alt={item.name}
                  className="product-image"
                />
                <div className="product-info">
                  <div className="product-name">{item.name}</div>
                  {item.description && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666666",
                        marginBottom: "4px",
                      }}
                    >
                      {item.description.substring(0, 60)}
                      {item.description.length > 60 ? "..." : ""}
                    </div>
                  )}
                  <div className="product-price">${item.price}</div>
                  <button
                    className="hubspot-button"
                    style={{
                      width: "100%",
                      padding: "8px",
                      fontSize: "14px",
                      marginTop: "8px",
                      marginBottom: 0,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookingModal({
                        isOpen: true,
                        item: item,
                        type: "item",
                      });
                    }}
                  >
                    🛒 Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          {items.length > 6 && (
            <button className="view-all-button">View All Products →</button>
          )}
        </div>
      )}

      {/* Portfolio Section */}
      {portfolioImages.length > 0 && (
        <div className="content-section">
          <div className="section-label">
            <span>📸</span> Portfolio
          </div>
          <div className="portfolio-grid">
            {portfolioImages.slice(0, 9).map((imageUrl, index) => (
              <div key={index} className="portfolio-item">
                <img src={imageUrl} alt={`Portfolio ${index + 1}`} />
              </div>
            ))}
          </div>
          {portfolioImages.length > 9 && (
            <button className="view-all-button">
              View All {portfolioImages.length} Images →
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="profile-footer">
        <div>Powered by BookaLink</div>
        <div>bookalink.com/@{seller.username}</div>
      </div>

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        reviews={reviews}
        averageRating={averageRating}
        totalReviews={reviews.length || seller.reviews_count || 0}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() =>
          setBookingModal({ isOpen: false, item: null, type: null })
        }
        item={bookingModal.item}
        seller={seller}
        type={bookingModal.type}
      />
    </div>
  );
};

export default SellerProfilePage;
