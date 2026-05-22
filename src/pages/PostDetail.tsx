import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Edit3,
  Trash2,
  MessageCircle,
  Send,
  Tag,
} from 'lucide-react';
import type { BlogPost, Comment } from '../types';
import { getPostById, deletePost, getCommentsByPost, addComment, deleteComment } from '../data/store';
import { format, formatDistanceToNow } from 'date-fns';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    if (id) {
      const p = getPostById(id);
      if (p) {
        setPost(p);
        setComments(getCommentsByPost(id));
      }
    }
  }, [id]);

  if (!post) {
    return (
      <div className="empty-state" style={{ minHeight: '50vh' }}>
        <h3>Post not found</h3>
        <p>This post doesn't exist or has been deleted.</p>
        <button className="btn btn-primary mt-lg" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Blog
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
      navigate('/');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentContent.trim()) return;
    addComment(post.id, commentAuthor.trim(), commentContent.trim());
    setComments(getCommentsByPost(post.id));
    setCommentAuthor('');
    setCommentContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);
    setComments(getCommentsByPost(post.id));
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i}>{renderInline(line.slice(2))}</li>;
      if (line.match(/^\d+\. /)) return <li key={i}>{renderInline(line.replace(/^\d+\. /, ''))}</li>;
      if (line.startsWith('```')) return null; // Skip code fences
      if (line.trim() === '') return <br key={i} />;
      return <p key={i}>{renderInline(line)}</p>;
    });
  };

  const renderInline = (text: string) => {
    // Bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // Inline code
      const codeParts = part.split(/(`[^`]+`)/g);
      return codeParts.map((cp, j) => {
        if (cp.startsWith('`') && cp.endsWith('`')) {
          return <code key={`${i}-${j}`}>{cp.slice(1, -1)}</code>;
        }
        return cp;
      });
    });
  };

  return (
    <div className="animate-fadeIn">
      {/* Back button + actions */}
      <div className="flex items-center justify-between mb-xl">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Blog
        </button>
        <div className="flex gap-sm">
          <button className="btn btn-ghost" onClick={() => navigate(`/editor/${post.id}`)}>
            <Edit3 size={14} /> Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Post Header */}
      <div className="glass-card mb-xl" style={{ padding: 0, overflow: 'hidden' }}>
        <img
          src={post.coverImage}
          alt={post.title}
          style={{ width: '100%', height: 300, objectFit: 'cover' }}
        />
        <div style={{ padding: 'var(--space-2xl)' }}>
          <div className="post-card-category mb-sm">{post.category}</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--space-md)', lineHeight: 1.3 }}>
            {post.title}
          </h1>
          <div className="flex items-center gap-lg text-sm text-secondary" style={{ flexWrap: 'wrap' }}>
            <span className="flex items-center gap-xs"><User size={14} /> {post.author}</span>
            <span className="flex items-center gap-xs"><Calendar size={14} /> {format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
            <span className="flex items-center gap-xs"><Clock size={14} /> {post.readingTime} min read</span>
            <span className="flex items-center gap-xs"><MessageCircle size={14} /> {comments.length} comments</span>
          </div>
          <div className="tag-group" style={{ marginTop: 'var(--space-md)' }}>
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="glass-card mb-xl">
        <div className="post-content">
          {renderContent(post.content)}
        </div>
      </div>

      {/* Comments Section */}
      <div className="glass-card">
        <div className="chart-header mb-lg">
          <div className="chart-title">
            <MessageCircle size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
            Comments ({comments.length})
          </div>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-xl">
          <div className="grid grid-2 mb-md" style={{ gap: 'var(--space-md)' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Name</label>
              <input
                className="form-input"
                placeholder="Your name"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Comment</label>
            <textarea
              className="form-input"
              placeholder="Write your comment..."
              rows={3}
              style={{ minHeight: 80 }}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Send size={14} /> Post Comment
          </button>
        </form>

        {/* Comment List */}
        {comments.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
            <MessageCircle size={32} />
            <h3>No comments yet</h3>
            <p>Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="flex items-center justify-between">
                <div>
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time" style={{ marginLeft: 12 }}>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <button
                  className="btn-icon"
                  style={{ width: 28, height: 28, border: 'none' }}
                  onClick={() => handleDeleteComment(comment.id)}
                  title="Delete comment"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="comment-body">{comment.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
