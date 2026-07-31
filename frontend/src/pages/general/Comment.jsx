import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../../styles/comment.css";

const Comment = ({ foodId, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const inputRef = useRef(null);
  const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${apiBaseUrl}/api/comment/${foodId}`,
          { withCredentials: true }
        );
        setComments(res.data.comments || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [foodId]);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 180);
    return () => window.clearTimeout(timer);
  }, [foodId]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/auth/me`, { withCredentials: true });
        const userId = res?.data?.user?._id || "";
        setCurrentUserId(userId);
        if (userId) {
          localStorage.setItem("userId", userId);
        }
      } catch {
        setCurrentUserId("");
      }
    };

    loadCurrentUser();
  }, [apiBaseUrl]);

  const isOwnComment = (comment) => {
    const commentUserId = comment?.user?._id || comment?.userId || "";

    if (currentUserId && commentUserId) {
      return String(commentUserId) === String(currentUserId);
    }

    return false;
  };

  const addComment = async () => {
    const trimmedText = text.trim();
    if (!trimmedText || !foodId) return;

    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/comment/`,
        { foodId, text: trimmedText },
        { withCredentials: true }
      );

      if (res.data?.comment) {
        const newComment = {
          ...res.data.comment,
          user: {
            ...(res.data.comment.user || {}),
            _id: res.data.comment.user?._id || currentUserId || localStorage.getItem("userId") || ""
          }
        };
        setComments((prev) => [newComment, ...prev]);
        setText("");
        onCommentAdded?.(foodId, newComment);
      }
    } catch (err) {
      console.error("Failed to post comment", err);
      const message = err?.response?.data?.message || "Could not post comment. Please try again.";
      alert(message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      addComment();
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text || "");
    setActiveMenuId(null);
  };

  const saveEdit = async (commentId) => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    try {
      const res = await axios.put(
        `${apiBaseUrl}/api/comment/${commentId}`,
        { text: trimmed },
        { withCredentials: true }
      );

      if (res.data?.comment) {
        setComments((prev) => prev.map((comment) => comment._id === commentId ? res.data.comment : comment));
      }
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("Failed to edit comment", err);
      alert("Could not edit comment. Please try again.");
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await axios.delete(`${apiBaseUrl}/api/comment/${commentId}`, { withCredentials: true });
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      setActiveMenuId(null);
    } catch (err) {
      console.error("Failed to delete comment", err);
      alert("Could not delete comment. Please try again.");
    }
  };

  return (
    <div className="comment-overlay" onClick={onClose}>
      <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comment-handle" aria-hidden="true" />
        <div className="comment-header">
          <div>
            <h3>Comments</h3>
            <p>{comments.length} {comments.length === 1 ? "comment" : "comments"}</p>
          </div>
          <button className="comment-close-btn" onClick={onClose} aria-label="Close comments">
            ✕
          </button>
        </div>

        <div className="comment-list">
          {loading ? (
            <div className="comment-empty">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="comment-empty">Be the first to comment on this reel.</div>
          ) : (
            comments.map((comment) => {
              const ownComment = isOwnComment(comment);
              const showMenu = ownComment;

              return (
                <div className="comment-item" key={comment._id}>
                  <div className="comment-avatar">
                    {((comment.user?.fullName || comment.userName || comment.user?.name || "U").split(" ")[0] || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-body">
                    <div className="comment-meta-row">
                      <strong>{(comment.user?.fullName || comment.userName || comment.user?.name || "User").split(" ")[0]}</strong>
                      {showMenu && (
                        <div className="comment-menu-wrap">
                          <button
                            className="comment-menu-btn"
                            onClick={() => setActiveMenuId(activeMenuId === comment._id ? null : comment._id)}
                            aria-label="Comment actions"
                          >
                            ⋯
                          </button>
                          {activeMenuId === comment._id && (
                            <div className="comment-menu">
                              <button onClick={() => startEdit(comment)}>Edit</button>
                              <button onClick={() => deleteComment(comment._id)}>Delete</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {editingCommentId === comment._id ? (
                      <div className="comment-edit-box">
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(comment._id)
                            if (e.key === "Escape") {
                              setEditingCommentId(null)
                              setEditText("")
                            }
                          }}
                        />
                        <div className="comment-edit-actions">
                          <button onClick={() => saveEdit(comment._id)}>Save</button>
                          <button onClick={() => {
                            setEditingCommentId(null)
                            setEditText("")
                          }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p>{comment.text}</p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="comment-input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
    onClick={() => {
        console.log("Post clicked", text);
        addComment();
    }}
>
    Post
</button>
        </div>
      </div>
    </div>
  );
};

export default Comment;