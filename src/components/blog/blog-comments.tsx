"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import type { Comment } from "@/lib/modules/comments";
import { blog } from "@/lib/config/site";
import { useWhatsApp } from "@/components/whatsapp-provider";

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
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const { openWhatsApp } = useWhatsApp();

  const handleSubmit = () => {
    if (!commentName || !commentText) return;
    const mensaje = `Quiero comentar el artículo "${postSlug}": ${commentName} - ${commentText}`;
    const title = blog.comments.whatsappTitle;
    openWhatsApp({ message: mensaje, title });
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">
        {blog.comments.title(initialComments.length)}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {initialComments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      <div className="border rounded-lg p-4 space-y-4 mt-6">
        <h3 className="font-medium">{blog.comments.writeTitle}</h3>

        <Input
          placeholder={blog.comments.namePlaceholder}
          value={commentName}
          onChange={(e) => setCommentName(e.target.value)}
          className="w-full sm:max-w-xs"
          aria-label={blog.comments.namePlaceholder}
        />

        <Textarea
          placeholder={blog.comments.commentPlaceholder}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          aria-label={blog.comments.commentPlaceholder}
        />

        <Button
          onClick={handleSubmit}
          disabled={!commentName || !commentText}
        >
          <IconBrandWhatsapp className="size-4 mr-2" />
          {blog.comments.submit}
        </Button>
      </div>
    </div>
  );
}
