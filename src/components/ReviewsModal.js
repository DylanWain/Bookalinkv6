import React from "react";

const ReviewsModal = ({
  isOpen,
  onClose,
  reviews,
  averageRating,
  totalReviews,
}) => {
  if (!isOpen) return null;

  const ratingBreakdown = [
    { stars: 5, count: 85, percentage: 67 },
    { stars: 4, count: 30, percentage: 24 },
    { stars: 3, count: 8, percentage: 6 },
    { stars: 2, count: 3, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "2px solid #000000",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "2px solid #000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#000000" }}>
            Reviews
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "28px",
              color: "#666666",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {/* Overall Rating */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "32px",
              padding: "24px",
              background: "#F5F5F5",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#666666",
                marginBottom: "8px",
              }}
            >
              Overall Rating
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 700,
                color: "#000000",
                marginBottom: "4px",
              }}
            >
              ⭐ {averageRating || "4.8"}
            </div>
            <div style={{ fontSize: "14px", color: "#666666" }}>out of 5.0</div>
            <div
              style={{ fontSize: "13px", color: "#666666", marginTop: "4px" }}
            >
              Based on {totalReviews || 127} reviews
            </div>
          </div>

          {/* Rating Breakdown */}
          <div style={{ marginBottom: "32px" }}>
            {ratingBreakdown.map((item) => (
              <div
                key={item.stars}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    minWidth: "60px",
                  }}
                >
                  {"⭐".repeat(item.stars)}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    background: "#F5F5F5",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: "100%",
                      background: "#FFD700",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#666666",
                    minWidth: "80px",
                    textAlign: "right",
                  }}
                >
                  {item.count} ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>

          {/* Individual Reviews */}
          <div>
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    padding: "16px",
                    background: "#F5F5F5",
                    border: "1px solid #DBDBDB",
                    borderRadius: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      color: "#FFD700",
                      fontSize: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    {"⭐".repeat(review.rating)}
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.5,
                      marginBottom: "12px",
                    }}
                  >
                    "{review.comment}"
                  </p>
                  <div style={{ fontSize: "13px", color: "#666666" }}>
                    <strong>Anonymous</strong> ·{" "}
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px",
                  color: "#666666",
                }}
              >
                No reviews yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
