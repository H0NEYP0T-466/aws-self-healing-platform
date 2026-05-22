import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff, Star } from 'lucide-react';
import { CATEGORIES } from '../types';
import { getPostById, createPost, updatePost } from '../data/store';

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [author, setAuthor] = useState('Cloud Architect');
  const [featured, setFeatured] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (id) {
      const post = getPostById(id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt);
        setCategory(post.category);
        setTags(post.tags.join(', '));
        setCoverImage(post.coverImage);
        setAuthor(post.author);
        setFeatured(post.featured);
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      title,
      content,
      excerpt: excerpt || content.slice(0, 150) + '...',
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      coverImage: coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      author,
      featured,
    };

    if (isEditing && id) {
      updatePost(id, postData);
    } else {
      createPost(postData);
    }
    navigate('/');
  };

  // Simple preview renderer
  const renderPreview = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
      if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>;
      if (line.match(/^\d+\. /)) return <li key={i}>{line.replace(/^\d+\. /, '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i}>{line}</p>;
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-xl">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex gap-sm">
          <button
            type="button"
            className={`btn ${showPreview ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <div className="page-header">
        <h1>{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
        <p>Write about AWS, cloud computing, DevOps, and more.</p>
      </div>

      {showPreview ? (
        <div className="glass-card">
          <div className="post-card-category mb-sm">{category}</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>{title || 'Untitled'}</h1>
          <div className="post-content">
            {renderPreview(content)}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="glass-card mb-xl">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                style={{ fontSize: '1.25rem', fontWeight: 600 }}
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-input"
                style={{ minHeight: 350, fontFamily: 'var(--font-mono)', fontSize: '0.875rem', lineHeight: 1.7 }}
                placeholder="Write your post content using markdown...\n\n## Heading\n\nParagraph text with **bold** and `code`.\n\n- List item 1\n- List item 2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Excerpt</label>
              <textarea
                className="form-input"
                style={{ minHeight: 80 }}
                placeholder="Brief summary (auto-generated if left empty)"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className="grid grid-2" style={{ gap: 'var(--space-lg)' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  className="form-input"
                  placeholder="AWS, EC2, CloudWatch..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: 'var(--space-lg)' }}>
              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  className="form-input"
                  placeholder="Your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                <Star size={14} style={{ color: featured ? 'var(--color-aws-orange)' : 'var(--color-text-muted)' }} />
                <span className="text-sm">Featured Post</span>
              </label>
            </div>
          </div>

          <div className="flex gap-md">
            <button type="submit" className="btn btn-primary btn-lg">
              <Save size={16} /> {isEditing ? 'Update Post' : 'Publish Post'}
            </button>
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
