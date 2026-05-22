import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, Tag } from 'lucide-react';
import { CATEGORIES, type BlogPost } from '../types';
import { getAllPosts, searchPosts } from '../data/store';
import { format } from 'date-fns';

export default function BlogHome() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setPosts(getAllPosts());
  };

  const filteredPosts = (() => {
    let result = posts;
    if (searchQuery) {
      result = searchPosts(searchQuery);
    }
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    return result;
  })();

  const featuredPosts = posts.filter((p) => p.featured);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <div className="blog-hero">
        <h1>Cloud Computing Blog</h1>
        <p>Explore AWS architecture, self-healing infrastructure, monitoring best practices, and cloud-native development.</p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)', position: 'relative', zIndex: 1 }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/editor')}>
            Write a Post
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/dashboard')}>
            View Dashboard
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center justify-between mb-xl" style={{ flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div className="search-bar" style={{ maxWidth: 350 }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Posts */}
      {!searchQuery && selectedCategory === 'All' && featuredPosts.length > 0 && (
        <div className="mb-xl">
          <div className="flex items-center gap-sm mb-lg">
            <Tag size={16} style={{ color: 'var(--color-aws-orange)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Featured Posts</h2>
          </div>
          <div className="grid grid-2" style={{ gap: 'var(--space-lg)' }}>
            {featuredPosts.slice(0, 2).map((post) => (
              <div key={post.id} className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
                <img src={post.coverImage} alt={post.title} className="post-card-image" />
                <div className="post-card-body">
                  <div className="post-card-category">{post.category}</div>
                  <div className="post-card-title">{post.title}</div>
                  <div className="post-card-excerpt">{post.excerpt}</div>
                  <div className="post-card-meta">
                    <span className="flex items-center gap-xs"><Calendar size={12} /> {format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                    <span className="flex items-center gap-xs"><Clock size={12} /> {post.readingTime} min read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      <div>
        <div className="flex items-center justify-between mb-lg">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            {searchQuery ? `Search Results (${filteredPosts.length})` : selectedCategory !== 'All' ? selectedCategory : 'All Posts'}
          </h2>
          <span className="text-sm text-muted">{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="empty-state glass-card">
            <Search size={40} />
            <h3>No posts found</h3>
            <p>{searchQuery ? 'Try a different search term.' : 'No posts in this category yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredPosts.map((post) => (
              <div key={post.id} className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
                <img src={post.coverImage} alt={post.title} className="post-card-image" />
                <div className="post-card-body">
                  <div className="post-card-category">{post.category}</div>
                  <div className="post-card-title">{post.title}</div>
                  <div className="post-card-excerpt">{post.excerpt}</div>
                  <div className="post-card-meta">
                    <span className="flex items-center gap-xs"><Calendar size={12} /> {format(new Date(post.createdAt), 'MMM dd')}</span>
                    <span className="flex items-center gap-xs"><Clock size={12} /> {post.readingTime} min</span>
                    <span>{post.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
