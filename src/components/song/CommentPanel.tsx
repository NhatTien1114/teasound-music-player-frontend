"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { TCommentResponse } from "@/types";
import { CommentService } from "@/services/CommentService";
import useUser from "@/hooks/useUser";
import { X, Send, MessageCircle, Reply, Trash2, ChevronDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CommentPanelProps {
    songId: number;
    isOpen: boolean;
    onClose: () => void;
    inline?: boolean;
}

// Helper: format relative time
function timeAgo(dateStr: string): string {
    const now = new Date();
    // Handle array format [year, month, day, hour, minute, second]
    let date: Date;
    if (Array.isArray(dateStr)) {
        const arr = dateStr as unknown as number[];
        date = new Date(arr[0], arr[1] - 1, arr[2], arr[3] || 0, arr[4] || 0, arr[5] || 0);
    } else {
        date = new Date(dateStr);
    }

    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffSec < 60) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay < 7) return `${diffDay} ngày trước`;
    if (diffWeek < 4) return `${diffWeek} tuần trước`;
    return `${diffMonth} tháng trước`;
}

// Organize flat comments into a tree
interface CommentNode extends TCommentResponse {
    replies: CommentNode[];
}

function buildCommentTree(comments: TCommentResponse[]): CommentNode[] {
    const map = new Map<number, CommentNode>();
    const roots: CommentNode[] = [];

    // Initialize all nodes
    for (const c of comments) {
        map.set(c.id, { ...c, replies: [] });
    }

    // Build tree
    for (const c of comments) {
        const node = map.get(c.id)!;
        if (c.parentCommentId && map.has(c.parentCommentId)) {
            map.get(c.parentCommentId)!.replies.push(node);
        } else {
            roots.push(node);
        }
    }

    // Sort by newest first for root comments, oldest first for replies
    roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    for (const node of map.values()) {
        node.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return roots;
}

// Single Comment Item
function CommentItem({
    comment,
    depth = 0,
    onReply,
    onDelete,
    currentUserId,
}: {
    comment: CommentNode;
    depth?: number;
    onReply: (commentId: number, userName: string) => void;
    onDelete: (commentId: number) => void;
    currentUserId?: number;
}) {
    const [showReplies, setShowReplies] = useState(true);
    const hasReplies = comment.replies.length > 0;
    const isOwner = currentUserId === comment.userId;

    return (
        <div className={cn("group", depth > 0 && "ml-8 sm:ml-10")}>
            <div className="flex gap-3 py-3">
                {/* Avatar */}
                <div className="shrink-0">
                    {comment.userAvatarUrl ? (
                        <Image
                            src={comment.userAvatarUrl}
                            alt={comment.userName}
                            width={depth > 0 ? 28 : 36}
                            height={depth > 0 ? 28 : 36}
                            className={cn(
                                "rounded-full object-cover ring-2 ring-white/5",
                                depth > 0 ? "w-7 h-7" : "w-9 h-9"
                            )}
                        />
                    ) : (
                        <div
                            className={cn(
                                "rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold ring-2 ring-white/5",
                                depth > 0 ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm"
                            )}
                        >
                            {comment.userName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white/90 truncate">
                            {comment.userName || "Ẩn danh"}
                        </span>
                        <span className="text-xs text-white/30 shrink-0">
                            {timeAgo(comment.createdAt)}
                        </span>
                    </div>

                    <p className="text-sm text-white/70 leading-relaxed break-words">
                        {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-1.5">
                        <button
                            onClick={() => onReply(comment.id, comment.userName)}
                            className="flex items-center gap-1 text-xs text-white/30 hover:text-secondary transition-colors duration-200"
                        >
                            <Reply className="w-3.5 h-3.5" />
                            Trả lời
                        </button>
                        {isOwner && (
                            <button
                                onClick={() => onDelete(comment.id)}
                                className="flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Xóa
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Replies toggle */}
            {hasReplies && (
                <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="flex items-center gap-1 ml-12 mb-1 text-xs text-white/80 hover:text-white transition-colors duration-200"
                >
                    <ChevronDown
                        className={cn(
                            "w-3.5 h-3.5 transition-transform duration-200",
                            !showReplies && "-rotate-90"
                        )}
                    />
                    {showReplies ? "Ẩn" : "Hiện"} {comment.replies.length} phản hồi
                </button>
            )}

            {/* Replies */}
            {showReplies && hasReplies && (
                <div className="relative">
                    {/* Thread line */}
                    <div className="absolute left-[17px] top-0 bottom-3 w-px bg-white/8" />
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            onReply={onReply}
                            onDelete={onDelete}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CommentPanel({ songId, isOpen, onClose, inline = false }: CommentPanelProps) {
    const [comments, setComments] = useState<TCommentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<{ id: number; userName: string } | null>(null);
    const [sending, setSending] = useState(false);

    const { user, isLoggedIn } = useUser();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Fetch comments
    const fetchComments = useCallback(async () => {
        if (!songId) return;
        setLoading(true);
        try {
            const data = await CommentService.getCommentsBySongId(songId);
            setComments(data);
        } catch (error) {
            console.error("Error loading comments:", error);
        } finally {
            setLoading(false);
        }
    }, [songId]);

    useEffect(() => {
        if (isOpen && songId) {
            fetchComments();
        }
    }, [isOpen, songId, fetchComments]);

    // Focus input when replying
    useEffect(() => {
        if (replyTo && inputRef.current) {
            inputRef.current.focus();
        }
    }, [replyTo]);

    const commentTree = buildCommentTree(comments);

    const handleSubmit = async () => {
        if (!newComment.trim() || sending) return;

        if (!isLoggedIn) {
            toast.error("Vui lòng đăng nhập để bình luận");
            return;
        }

        setSending(true);
        try {
            const result = await CommentService.createComment(songId, {
                content: newComment.trim(),
                parentId: replyTo?.id || null,
            });

            if (result) {
                setNewComment("");
                setReplyTo(null);
                await fetchComments();
            } else {
                toast.error("Không thể gửi bình luận");
            }
        } catch {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (commentId: number) => {
        const ok = await CommentService.deleteComment(commentId);
        if (ok) {
            toast.success("Đã xóa bình luận");
            await fetchComments();
        } else {
            toast.error("Không thể xóa bình luận");
        }
    };

    const handleReply = (commentId: number, userName: string) => {
        if (!isLoggedIn) {
            toast.error("Vui lòng đăng nhập để trả lời");
            return;
        }
        setReplyTo({ id: commentId, userName });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Inline comment input area (shared between both modes)
    const renderInputArea = () => (
        <div className={cn("shrink-0 border-t border-white/8 py-4", inline ? "px-0" : "px-5")}>
            {/* Reply indicator */}
            {replyTo && (
                <div className="flex items-center justify-between mb-2.5 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
                    <div className="flex items-center gap-2 min-w-0">
                        <Reply className="w-3.5 h-3.5 text-secondary shrink-0" />
                        <span className="text-xs text-secondary truncate">
                            Trả lời <strong>{replyTo.userName}</strong>
                        </span>
                    </div>
                    <button
                        onClick={() => setReplyTo(null)}
                        className="text-white/40 hover:text-white/60 transition-colors shrink-0 ml-2"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {isLoggedIn ? (
                <div className="flex items-end gap-3">
                    {/* User avatar */}
                    <div className="shrink-0 mb-0.5">
                        {user?.avatarUrl ? (
                            <Image
                                src={user.avatarUrl}
                                alt="Avatar"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/5"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white/5">
                                {user?.name?.charAt(0)?.toUpperCase() || "T"}
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={replyTo ? `Trả lời ${replyTo.userName}...` : "Viết bình luận..."}
                            rows={1}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-white/25
                                focus:outline-none focus:border-secondary/40 focus:bg-white/8
                                resize-none overflow-hidden transition-all duration-200
                                min-h-[40px] max-h-[120px]"
                            style={{ fieldSizing: "content" } as React.CSSProperties}
                        />
                    </div>

                    {/* Send button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!newComment.trim() || sending}
                        className={cn(
                            "shrink-0 w-9 h-9 rounded-full flex items-center justify-center mb-0.5 transition-all duration-300",
                            newComment.trim()
                                ? "bg-secondary text-white hover:bg-secondary/90 hover:scale-105 active:scale-95 shadow-lg shadow-secondary/25"
                                : "bg-white/5 text-white/20 cursor-not-allowed"
                        )}
                    >
                        {sending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>
            ) : (
                <div className="text-center py-2">
                    <p className="text-sm text-white/40">
                        <a href="/sign-in" className="text-secondary hover:text-secondary/80 font-medium transition-colors">
                            Đăng nhập
                        </a>
                        {" "}để bình luận
                    </p>
                </div>
            )}
        </div>
    );

    // Inline comment list (shared between both modes)
    const renderCommentList = () => (
        <>
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-white/10 border-t-secondary rounded-full animate-spin" />
                    <p className="text-xs text-white/30 mt-3">Đang tải bình luận...</p>
                </div>
            ) : commentTree.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        <MessageCircle className="w-6 h-6 text-white/15" />
                    </div>
                    <p className="text-sm text-white/40 font-medium mb-1">
                        Chưa có bình luận nào
                    </p>
                    <p className="text-xs text-white/25">
                        Hãy là người đầu tiên bình luận!
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-white/5">
                    {commentTree.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={handleReply}
                            onDelete={handleDelete}
                            currentUserId={user?.id}
                        />
                    ))}
                </div>
            )}
        </>
    );

    // ===== INLINE MODE =====
    if (inline) {
        if (!isOpen) return null;
        return (
            <div className="w-full mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Inline Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center">
                        <MessageCircle className="w-3 h-3 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-white/80">Bình luận</h3>
                    <span className="text-xs text-white/30">{comments.length}</span>
                </div>

                {/* Input first */}
                {renderInputArea()}

                {/* Comments */}
                {renderCommentList()}
            </div>
        );
    }

    // ===== SLIDE-IN PANEL MODE =====
    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className={cn(
                    "fixed right-0 top-0 bottom-0 z-[70] w-full sm:w-[420px] flex flex-col",
                    "bg-[#0e0e12]/95 backdrop-blur-xl border-l border-white/8",
                    "shadow-[-20px_0_60px_rgba(0,0,0,0.5)]",
                    "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Bình luận</h3>
                            <p className="text-xs text-white/40">
                                {comments.length} bình luận
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-200"
                    >
                        <X className="w-4 h-4 text-white/60" />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto px-5 py-2 min-h-0">
                    {renderCommentList()}
                </div>

                {/* Input Area */}
                {renderInputArea()}
            </div>
        </>
    );
}
