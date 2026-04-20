import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "https://raadi-jdun.onrender.com/api/v1";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: "Pending",   dot: "#F59E0B", bg: "#FFFBEB", text: "#92400E", ring: "#FDE68A" },
  confirmed: { label: "Confirmed", dot: "#3B82F6", bg: "#EFF6FF", text: "#1E40AF", ring: "#BFDBFE" },
  shipped:   { label: "Shipped",   dot: "#8B5CF6", bg: "#F5F3FF", text: "#5B21B6", ring: "#DDD6FE" },
  delivered: { label: "Delivered", dot: "#10B981", bg: "#ECFDF5", text: "#065F46", ring: "#A7F3D0" },
  cancelled: { label: "Cancelled", dot: "#EF4444", bg: "#FEF2F2", text: "#991B1B", ring: "#FECACA" },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 20,
      background: cfg.bg, color: cfg.text,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
      border: `1px solid ${cfg.ring}`,
      textTransform: "uppercase",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, accent }) => (
  <div style={{
    background: "#fff", borderRadius: 14, padding: "20px 24px",
    border: "1px solid #F0F0F0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    borderLeft: `4px solid ${accent}`,
    minWidth: 0,
  }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 800, color: "#111", fontVariantNumeric: "tabular-nums" }}>{value}</div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminOrders() {
  const [orders, setOrders]               = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [page, setPage]                   = useState(1);
  const [pages, setPages]                 = useState(1);
  const [total, setTotal]                 = useState(0);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("");
  const [loading, setLoading]             = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/order/all`, {
        params: { page, limit: 10, search: search || undefined, status: statusFilter || undefined },
      });
      setOrders(res.data.orders || []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Orders Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      await axios.patch(`${API}/order/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const downloadInvoice = (orderId) => {
    window.open(`${API}/order/invoice/${orderId}`, "_blank");
  };

  // Derive stats from current page orders
  const stats = {
    total: total,
    revenue: orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
    pending: orders.filter(o => o.orderStatus === "pending").length,
    delivered: orders.filter(o => o.orderStatus === "delivered").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F8FA", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Top bar ── */}
      <div style={{
        background: "#0F172A", color: "#fff",
        padding: "0 40px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #1E293B",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff",
          }}>RAADI</span>
          <span style={{ width: 1, height: 18, background: "#334155" }} />
          <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>Admin Console</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          
          
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px" }}>

        {/* ── Page title ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", margin: 0 }}>
            Order Management
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>
            Manage, track and update all customer orders
          </p>
        </div>

        
        {/* ── Filters ── */}
        <div style={{
          background: "#fff", borderRadius: 14, padding: "16px 20px",
          display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
          border: "1px solid #F0F0F0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          marginBottom: 24,
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 280px" }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, phone, order ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
              style={{
                width: "100%", padding: "9px 12px 9px 36px",
                border: "1px solid #E5E7EB", borderRadius: 10,
                fontSize: 13, outline: "none", background: "#FAFAFA",
                color: "#111", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{
              padding: "9px 14px", border: "1px solid #E5E7EB", borderRadius: 10,
              fontSize: 13, background: "#FAFAFA", color: "#374151", cursor: "pointer", outline: "none",
            }}
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          {/* Search button */}
          <button
            onClick={() => { setPage(1); fetchOrders(); }}
            style={{
              padding: "9px 20px", background: "#0F172A", color: "#fff",
              border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#1E293B"}
            onMouseLeave={e => e.currentTarget.style.background = "#0F172A"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Search
          </button>
        </div>

        {/* ── Orders list ── */}
        {loading ? (
          <div style={{
            textAlign: "center", padding: "80px 0", color: "#9CA3AF",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 36, height: 36, border: "3px solid #E5E7EB",
              borderTop: "3px solid #6366F1", borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <span style={{ fontSize: 14 }}>Loading orders…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9CA3AF" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No orders found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {orders.map((order, index) => {
              const isExpanded = expandedOrder === order._id;
              const isUpdating = updatingStatus === order._id;
              const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;

              return (
                <div key={order._id} style={{
                  background: "#fff", borderRadius: 14,
                  border: "1px solid #F0F0F0",
                  boxShadow: isExpanded ? "0 4px 24px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s",
                  animation: `fadeIn 0.25s ease both`,
                  animationDelay: `${index * 40}ms`,
                }}>

                  {/* ── Order row ── */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    style={{
                      padding: "18px 24px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto auto auto",
                      alignItems: "center",
                      gap: 20,
                      cursor: "pointer",
                      background: isExpanded ? "#FAFBFF" : "#fff",
                      transition: "background 0.15s",
                      borderLeft: isExpanded ? `3px solid ${cfg.dot}` : "3px solid transparent",
                    }}
                    onMouseEnter={e => !isExpanded && (e.currentTarget.style.background = "#FAFAFA")}
                    onMouseLeave={e => !isExpanded && (e.currentTarget.style.background = "#fff")}
                  >
                    {/* Customer info */}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 3 }}>
                        {order.customerDetails?.name || "—"}
                      </div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "monospace", letterSpacing: "0.02em" }}>
                        #{order._id.slice(-10).toUpperCase()}
                      </div>
                    </div>

                    {/* Items count */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2, fontWeight: 500 }}>ITEMS</div>
                      <div style={{ fontWeight: 700, color: "#374151", fontSize: 14 }}>{order.items?.length || 0}</div>
                    </div>

                    {/* Amount */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2, fontWeight: 500 }}>AMOUNT</div>
                      <div style={{ fontWeight: 800, color: "#111", fontSize: 15 }}>
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </div>
                    </div>

                    {/* Status badge */}
                    <StatusBadge status={order.orderStatus} />

                    {/* Date + chevron */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                        <div style={{ fontSize: 11, color: "#CBD5E1" }}>
                          {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"
                        style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>

                  {/* ── Expanded panel ── */}
                  {isExpanded && (
                    <div style={{ borderTop: "1px solid #F3F4F6", background: "#FAFAFA" }}>

                      {/* Update status bar */}
                      <div style={{
                        padding: "14px 24px",
                        borderBottom: "1px solid #F3F4F6",
                        display: "flex", alignItems: "center", gap: 12,
                        background: "#fff",
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          Update Status
                        </span>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                            <button
                              key={key}
                              disabled={isUpdating || order.orderStatus === key}
                              onClick={(e) => { e.stopPropagation(); updateStatus(order._id, key); }}
                              style={{
                                padding: "5px 14px",
                                borderRadius: 20,
                                border: `1.5px solid ${order.orderStatus === key ? val.dot : "#E5E7EB"}`,
                                background: order.orderStatus === key ? val.bg : "#fff",
                                color: order.orderStatus === key ? val.text : "#6B7280",
                                fontSize: 11, fontWeight: 700,
                                cursor: isUpdating || order.orderStatus === key ? "not-allowed" : "pointer",
                                letterSpacing: "0.05em",
                                opacity: isUpdating ? 0.5 : 1,
                                transition: "all 0.15s",
                              }}
                            >
                              {isUpdating && order.orderStatus === key ? "Updating…" : val.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                        {/* Customer details */}
                        <InfoCard title="Customer Details" icon="👤">
                          <InfoRow label="Name"  value={order.customerDetails?.name} />
                          <InfoRow label="Email" value={order.customerDetails?.email} />
                          <InfoRow label="Phone" value={order.customerDetails?.phone} />
                        </InfoCard>

                        {/* Shipping address */}
                        <InfoCard title="Shipping Address" icon="📍">
                          <InfoRow label="Name"     value={order.shippingAddress?.fullName} />
                          <InfoRow label="Phone"    value={order.shippingAddress?.phone} />
                          <InfoRow label="Landmark" value={order.shippingAddress?.landmark} />
                          <InfoRow label="City"     value={`${order.shippingAddress?.city}, ${order.shippingAddress?.state}`} />
                          <InfoRow label="Pincode"  value={order.shippingAddress?.pincode} />
                        </InfoCard>

                        {/* Payment info */}
                        <InfoCard title="Payment Info" icon="💳">
                          <InfoRow label="Status" value={
                            <StatusBadge status={order.paymentInfo?.status === "paid" ? "delivered" : "pending"} />
                          } />
                          <InfoRow label="Method" value={order.paymentInfo?.status === "paid" ? "Online" : "Cash on Delivery"} />
                          <InfoRow label="Transaction ID" value={order.paymentInfo?.transactionId || "N/A"} mono />
                          {order.deliveredAt && (
                            <InfoRow label="Delivered At" value={new Date(order.deliveredAt).toLocaleString("en-IN")} />
                          )}
                        </InfoCard>

                        {/* Actions */}
                        <InfoCard title="Actions" icon="⚡">
                          <button
                            onClick={() => downloadInvoice(order._id)}
                            style={{
                              width: "100%", padding: "11px 0",
                              background: "#0F172A", color: "#fff",
                              border: "none", borderRadius: 10,
                              fontSize: 13, fontWeight: 700, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                              marginBottom: 10,
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#1E293B"}
                            onMouseLeave={e => e.currentTarget.style.background = "#0F172A"}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download Invoice
                          </button>
                          <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
                            PDF invoice will open in a new tab
                          </div>
                        </InfoCard>

                      </div>

                      {/* ── Items table ── */}
                      <div style={{ padding: "0 24px 24px" }}>
                        <div style={{
                          background: "#fff", borderRadius: 12,
                          border: "1px solid #F3F4F6", overflow: "hidden",
                        }}>
                          <div style={{
                            padding: "14px 18px", borderBottom: "1px solid #F3F4F6",
                            display: "flex", alignItems: "center", gap: 8,
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Ordered Items</span>
                            <span style={{
                              background: "#F3F4F6", color: "#6B7280",
                              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                            }}>{order.items?.length}</span>
                          </div>

                          {/* Table header */}
                          <div style={{
                            display: "grid", gridTemplateColumns: "1fr 80px 100px 100px",
                            padding: "8px 18px", background: "#F9FAFB",
                            borderBottom: "1px solid #F3F4F6",
                          }}>
                            {["Product", "Qty", "Unit Price", "Total"].map(h => (
                              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase",
                                textAlign: h === "Product" ? "left" : "right" }}>
                                {h}
                              </div>
                            ))}
                          </div>

                          {order.items.map((item, idx) => (
                            <div key={idx} style={{
                              display: "grid", gridTemplateColumns: "1fr 80px 100px 100px",
                              padding: "12px 18px", alignItems: "center",
                              borderBottom: idx < order.items.length - 1 ? "1px solid #F9FAFB" : "none",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <img
                                  src={item.product?.images?.[0]}
                                  alt={item.product?.name}
                                  style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", background: "#F3F4F6", flexShrink: 0 }}
                                  onError={e => { e.currentTarget.style.display = "none"; }}
                                />
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
                                    {item.product?.name || "Deleted Product"}
                                  </div>
                                  {item.product?.sku && (
                                    <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace" }}>
                                      SKU: {item.product.sku}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", textAlign: "right" }}>
                                {item.quantity}
                              </div>
                              <div style={{ fontSize: 13, color: "#6B7280", textAlign: "right" }}>
                                ₹{Number(item.price).toLocaleString("en-IN")}
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#111", textAlign: "right" }}>
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                              </div>
                            </div>
                          ))}

                          {/* Total row */}
                          <div style={{
                            display: "grid", gridTemplateColumns: "1fr 80px 100px 100px",
                            padding: "12px 18px", background: "#0F172A",
                          }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em", gridColumn: "1/4" }}>
                              GRAND TOTAL
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", textAlign: "right" }}>
                              ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && pages > 1 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 32,
          }}>
            <PaginationBtn onClick={() => setPage(1)} disabled={page <= 1} label="«" />
            <PaginationBtn onClick={() => setPage(p => p - 1)} disabled={page <= 1} label="‹ Prev" />

            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2 + i, pages - 4 + i));
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: page === p ? "none" : "1px solid #E5E7EB",
                    background: page === p ? "#0F172A" : "#fff",
                    color: page === p ? "#fff" : "#374151",
                    fontSize: 13, fontWeight: page === p ? 700 : 400,
                    cursor: "pointer",
                  }}
                >{p}</button>
              );
            })}

            <PaginationBtn onClick={() => setPage(p => p + 1)} disabled={page >= pages} label="Next ›" />
            <PaginationBtn onClick={() => setPage(pages)} disabled={page >= pages} label="»" />

            <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 8 }}>
              Page {page} of {pages}
            </span>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Small reusable bits ──────────────────────────────────────────────────────

const InfoCard = ({ title, icon, children }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #F3F4F6", overflow: "hidden" }}>
    <div style={{
      padding: "12px 16px", borderBottom: "1px solid #F3F4F6",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: "0.04em" }}>{title}</span>
    </div>
    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value, mono }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, flexShrink: 0 }}>{label}</span>
    <span style={{
      fontSize: 12, color: "#374151", fontWeight: 600, textAlign: "right",
      fontFamily: mono ? "monospace" : "inherit",
      maxWidth: "60%", wordBreak: "break-all",
    }}>{value || "—"}</span>
  </div>
);

const PaginationBtn = ({ onClick, disabled, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "8px 14px", borderRadius: 8,
      border: "1px solid #E5E7EB", background: disabled ? "#F9FAFB" : "#fff",
      color: disabled ? "#D1D5DB" : "#374151",
      fontSize: 13, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
    }}
  >{label}</button>
);