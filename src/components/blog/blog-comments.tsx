"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import type { Comment } from "@/lib/modules/comments";
import { useLang } from "@/hooks/use-lang";
import { getConfig, getDateLocale } from "@/lib/locale/config";
import { useWhatsApp } from "@/hooks/use-whatsapp";

function CommentCard({ comment }: { comment: Comment }) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const dateLocale = getDateLocale(lang);
  const date = new Date(comment.createdAt).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{comment.name}</span>
        {comment.status === "pending" && (
          <Badge variant="outline" className="text-xs">
            {cfg.blog.comments.pending}
          </Badge>
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
  const lang = useLang();
  const cfg = getConfig(lang);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const { openWhatsApp } = useWhatsApp();

  const handleSubmit = () => {
    if (!commentName || !commentText) return;
    const mensaje = cfg.blog.comments.submitWhatsappTemplate(
      commentName,
      commentText,
      postSlug,
    );
    const title = cfg.blog.comments.whatsappTitle;
    openWhatsApp({ message: mensaje, title });
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">
        {cfg.blog.comments.title(initialComments.length)}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {initialComments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      <div className="border rounded-lg p-4 space-y-4 mt-6">
        <h3 className="font-medium">{cfg.blog.comments.writeTitle}</h3>

        <Input name="comment-name"
          placeholder={cfg.blog.comments.namePlaceholder}
          value={commentName}
          onChange={(e) => setCommentName(e.target.value)}
          className="w-full sm:max-w-xs"
          aria-label={cfg.blog.comments.namePlaceholder}
        />

        <Textarea name="comment-text"
          placeholder={cfg.blog.comments.commentPlaceholder}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          aria-label={cfg.blog.comments.commentPlaceholder}
        />

        <Button onClick={handleSubmit} disabled={!commentName || !commentText}>
          <IconBrandWhatsapp className="size-4 mr-2" />
          {cfg.blog.comments.submit}
        </Button>
      </div>
    </div>
  );
}
