"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { IconSend, IconLoader2 } from "@tabler/icons-react";
import { createComment, type Comment } from "@/lib/modules/comments";
import { getWhatsappNumber, isDev } from "@/lib/env";
import notificationService from "@/lib/modules/notification";
import { blog } from "@/lib/config/site";

function CommentCard({ comment }: { comment: Comment }) {
  const date = new Date(comment.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{comment.name}</span>
        {comment.status === "pending" && (
          <Badge variant="outline" className="text-xs">{blog.comments.pending}</Badge>
        )}
      </div>
      <p className="text-muted-foreground text-sm">{comment.comment}</p>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
  );
}

interface BlogCommentsProps {
  postSlug: string;
  initialComments: Comment[];
}

export function BlogComments({ postSlug, initialComments }: BlogCommentsProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState({ name: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.name || !newComment.comment) {
      notificationService.warning(blog.comments.validation);
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await createComment(postSlug, newComment);
      setComments((prev) => [...prev, saved]);
      setNewComment({ name: "", comment: "" });
      notificationService.success(blog.comments.success);
      const mensaje = blog.comments.whatsappTemplate(
        saved.name,
        saved.comment,
        postSlug,
        typeof window !== "undefined" ? window.location.origin : "",
      );
      const urlWhatsapp = `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(mensaje)}`;
      window.open(urlWhatsapp, "_blank");
    } catch (error) {
      if (isDev) console.error("Error submitting comment:", error);
      notificationService.error(blog.comments.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">
        {blog.comments.title(comments.length)}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      <div className="border rounded-lg p-4 space-y-4 mt-6">
        <h3 className="font-medium">{blog.comments.writeTitle}</h3>

        <Input
          placeholder={blog.comments.namePlaceholder}
          value={newComment.name}
          onChange={(e) =>
            setNewComment({ ...newComment, name: e.target.value })
          }
          className="w-full sm:max-w-xs"
          aria-label={blog.comments.namePlaceholder}
        />

        <Textarea
          placeholder={blog.comments.commentPlaceholder}
          value={newComment.comment}
          onChange={(e) =>
            setNewComment({ ...newComment, comment: e.target.value })
          }
          rows={3}
          aria-label={blog.comments.commentPlaceholder}
        />

        <Button
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !newComment.name ||
            !newComment.comment
          }
        >
          {isSubmitting ? (
            <IconLoader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <IconSend className="size-4 mr-2" />
          )}
          {isSubmitting ? blog.comments.submitting : blog.comments.submit}
        </Button>
      </div>
    </div>
  );
}
