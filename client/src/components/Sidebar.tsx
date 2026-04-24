"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus, PanelLeftClose, PanelLeft, ArrowRight, LogOut, User as UserIcon, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

export default function Sidebar() {
  const { user, isInitialized, fetchMe, login, logout } = useAuthStore();
  const { chats, fetchChats, setActiveChat, activeChatId, deleteChat } = useChatStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch initial auth state
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // Fetch chats once user is loaded
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteChat(id);
    }
  };

  return (
    <>
      <div 
        style={{ 
          width: isCollapsed ? "0px" : "260px", 
          minWidth: isCollapsed ? "0px" : "260px", 
          height: "100%", 
          borderRight: isCollapsed ? "none" : "1px solid var(--border)", 
          background: "var(--bg-primary)", 
          transition: "all 0.3s ease",
          overflow: "hidden",
          position: "relative",
          zIndex: 40
        }}
      >
        <div style={{ width: "260px", height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button 
              onClick={(e) => { e.preventDefault(); setActiveChat(null); window.location.href = "/app"; }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: "var(--green)", color: "#000", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "14px", cursor: "pointer", flex: 1, justifyContent: "center" }}
            >
              <Plus size={16} /> New Chat
            </button>
            <button 
              onClick={() => setIsCollapsed(true)} 
              style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "8px", borderRadius: "8px", marginLeft: "8px" }} 
            >
              <PanelLeftClose size={20} />
            </button>
          </div>

          {/* Chat History Component */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
            {isInitialized && !user && (
               <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                Login to save history.
               </div>
            )}
            
            {user && chats.length === 0 && (
               <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                No recent chats.
               </div>
            )}

            {user && chats.map((c) => (
               <button 
                 key={c.id} 
                 onClick={() => setActiveChat(c.id)}
                 className="group hover:bg-[rgba(255,255,255,0.04)]"
                 style={{ 
                   display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px", 
                   borderRadius: "8px", border: "none", 
                   background: activeChatId === c.id ? "rgba(255,255,255,0.1)" : "transparent",
                   color: activeChatId === c.id ? "var(--text-primary)" : "var(--text-secondary)", 
                   textAlign: "left", cursor: "pointer", marginBottom: "4px",
                   position: "relative",
                   transition: "all 0.2s"
                 }}
               >
                 <span style={{ 
                   fontSize: "13px", 
                   whiteSpace: "nowrap", 
                   overflow: "hidden", 
                   textOverflow: "ellipsis",
                   marginRight: "24px",
                   flex: 1
                 }}>
                    {c.title || c.promptText || (c.mode === "prompt" ? "Text Chat" : "Image Chat")}
                 </span>
                 <div 
                   className="opacity-0 group-hover:opacity-100 transition-opacity"
                   style={{ 
                     position: "absolute", 
                     right: "8px", 
                     top: "50%", 
                     transform: "translateY(-50%)",
                     display: "flex",
                     alignItems: "center"
                   }}
                 >
                    <Trash2 
                      size={20} 
                      onClick={(e) => handleDelete(e, c.id)}
                      className="hover:text-red-500 hover:bg-[rgba(255,255,255,0.05)] transition-all"
                      style={{ 
                        padding: "6px", 
                        color: "var(--text-muted)",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    />

                 </div>
               </button>
            ))}

          </div>

          {/* Footer Profile or Login */}
          <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
            {isInitialized && user ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" style={{ width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                       <UserIcon size={16} />
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name || "User"}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</span>
                  </div>
                </div>
                <button onClick={() => logout()} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "6px" }} title="Logout">
                   <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                 onClick={login}
                 style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-primary)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
              >
                 Login with Google <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Expand Button */}
      {isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(false)} 
          style={{ position: "fixed", top: "12px", left: "16px", zIndex: 100, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", padding: "8px", borderRadius: "8px", backdropFilter: "blur(8px)" }} 
          title="Expand sidebar"
        >
          <PanelLeft size={20} />
        </button>
      )}
    </>
  );
}
