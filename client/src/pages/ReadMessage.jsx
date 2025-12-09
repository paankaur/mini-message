import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { et } from "date-fns/locale";
import Button from "../components/Button.jsx";
import { BiSolidMessageError } from "react-icons/bi";
import Icon from "../components/Icon.jsx";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_INBOX_URL = `${API_BASE.replace(/\/$/, "")}/emails/inbox/`;
const API_BASE_URL = `${API_BASE.replace(/\/$/, "")}/emails/`;

const ReadMessage = ({ user }) => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    const fetchEmails = async () => {
      try {
        const response = await fetch(`${API_INBOX_URL}${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to load emails");
        }
        const data = await response.json();
        setEmails(data.emails || []);
      } catch (err) {
        setError("Viga e-mailide laadimisel");
        console.error("Error fetching emails:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [user]);

  const expandEmail = async (email) => {
    // If already expanded, do nothing (prevents collapse via container click)
    if (expandedIds.has(email.id)) return;

    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(email.id);
      return newSet;
    });

    // Mark as read if unread
    if (email.unread) {
      try {
        await fetch(`${API_BASE_URL}${email.id}/read`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });

        // Update local state
        setEmails((prev) =>
          prev.map((e) => (e.id === email.id ? { ...e, unread: false } : e))
        );
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    }
  };

  const collapseEmail = (emailId) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(emailId);
      return newSet;
    });
  };

  const handleDelete = async (emailId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${emailId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete email");
      }

      setDeletedIds((prev) => new Set(prev).add(emailId));
      // After showing "kustutatud" message, remove from list
      setTimeout(() => {
        setEmails((prev) => prev.filter((email) => email.id !== emailId));
        setDeletedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(emailId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Error deleting email:", err);
    }
  };

  if (!user || !user.id) {
    return (
      <div>
        <p>Palun logi sisse, et näha oma kirjasid.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
        <div style={{ marginRight: "auto", width: "fit-content" }}>
            <Icon type="back" onClick={() => navigate("/main")} />
        </div>
      
      <h2 style={{ textAlign: "center" }}>
        {user.name || user.username} kirjakast..
      </h2>

      {loading && <p>Laadin kirju...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && emails.length === 0 && <h3>..on tühi</h3>}

      {!loading && emails.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          {emails.map((email) => {
            const isDeleted = deletedIds.has(email.id);
            const isExpanded = expandedIds.has(email.id);
            const senderName = email.sender?.name || "Unknown";
            const createdAt = formatDistanceToNow(new Date(email.createdAt), {
              addSuffix: true,
              locale: et,
            });

            if (isDeleted) {
              return (
                <div
                  key={email.id}
                  style={{ padding: "10px", marginBottom: "10px" }}
                >
                  <p style={{ color: "gray", fontStyle: "italic" }}>
                    Sõnum kustutatud
                  </p>
                </div>
              );
            }

            return (
              <div
                key={email.id}
                onClick={() => expandEmail(email)}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  backgroundColor: email.unread ? "#b34f4fff" : "#24ad52ff",
                }}
              >
                {/* Collapsed view */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontWeight: email.unread ? "bold" : "normal",
                        marginRight: "10px",
                      }}
                    >
                      {senderName}
                    </span>
                    {email.unread && (
                      <>
                        <BiSolidMessageError
                          color="#10b918ff"
                          size={20}
                          style={{ marginRight: "10px" }}
                        />
                        <span
                          style={{ color: "#10b918ff", fontWeight: "bold" }}
                        >
                          Lugemata
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      color: "#000000ff",
                      fontSize: "0.9em",
                    }}
                  >
                    {createdAt}
                  </div>
                </div>

                {/* Expanded view */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: "15px",
                      borderTop: "1px solid #eee",
                      paddingTop: "15px",
                    }}
                  >
                    <p
                      style={{
                        marginBottom: "15px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {email.message}
                    </p>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                      style={{ backgroundColor: "#3f5040ff", color: "white" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          collapseEmail(email.id);
                        }}
                      >
                        Sulge
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(email.id);
                        }}
                        style={{ backgroundColor: "#ef4444" }}
                      >
                        Kustuta
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReadMessage;
