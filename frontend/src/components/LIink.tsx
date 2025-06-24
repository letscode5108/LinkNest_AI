import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search,Plus, Trash2,ExternalLink, Calendar, Globe, Tag,  BookmarkPlus,Eye, X,ChevronLeft,ChevronRight,Loader2,LogOut,} from 'lucide-react';


interface User { id: string; name: string; email: string; }
interface Link { id: string; url: string; title: string; description?: string; domain: string; image?: string; tags?: string[]; createdAt: string; summary?: string; }
interface Pagination { currentPage: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; totalLinks: number; }
interface ApiResponse { links: Link[]; pagination: Pagination; }
interface LinkDetailsResponse { link: Link; }


const colors = {
  federal_blue: '#03045e',
  marian_blue: '#023e8a', 
  honolulu_blue: '#0077b6',
  blue_green: '#0096c7',
  pacific_cyan: '#00b4d8',
  vivid_sky_blue: '#48cae4',
  non_photo_blue: '#90e0ef',
  light_cyan: '#caf0f8'
};


const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/links`;


const api = {
  saveLink: async (url: string): Promise<Link> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save link');
    }
    
    return response.json();
  },
  
  getLinks: async (page = 1, limit = 10): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch links');
    }
    
    return response.json();
  },
  
  getLinkDetails: async (id: string): Promise<LinkDetailsResponse> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch link details');
    }
    
    return response.json();
  },
  
  deleteLink: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete link');
    }
    
    return response.json();
  },
  
  searchLinks: async (query: string, tags: string, page = 1): Promise<ApiResponse> => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (tags) params.append('tags', tags);
    params.append('page', page.toString());
    
    const response = await fetch(`${API_BASE_URL}/search?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to search links');
    }
    
    return response.json();
  }
};

const LinkCard: React.FC<{ link: Link; onDelete: (id: string) => void; onView: (link: Link) => void; }> = ({ link, onDelete, onView }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
       onClick={() => onView(link)}>
    
    <div className="relative h-48 bg-gray-100">
      {link.image ? (
        <img 
          src={link.image} 
          alt={link.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <Globe size={48} className="text-gray-400" />
        </div>
      )}
      
    
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(link);
          }}
          className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200 shadow-sm"
          title="View details"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(link.id);
          }}
          className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-red-600 hover:bg-white rounded-lg transition-all duration-200 shadow-sm"
          title="Delete link"
        >
          <Trash2 size={16} />
        </button>
      </div>

     
      <div className="absolute bottom-3 left-3">
        <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
          {link.domain}
        </span>
      </div>
    </div>


    <div className="p-6 h-48 flex flex-col">
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {link.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
          {link.description || 'No description available'}
        </p>
      </div>
    
    
      {link.tags && link.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {link.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium rounded-full"
              style={{ 
                backgroundColor: colors.light_cyan,
                color: colors.federal_blue 
              }}
            >
              {tag}
            </span>
          ))}
          {link.tags.length > 3 && (
            <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
              +{link.tags.length - 3}
            </span>
          )}
        </div>
      )}

     
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={12} />
          <span>{new Date(link.createdAt).toLocaleDateString()}</span>
        </div>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs font-medium hover:underline transition-colors"
          style={{ color: colors.honolulu_blue }}
        >
          Visit
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  </div>
);

const AddLinkModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: () => void; }> = ({ isOpen, onClose, onAdd }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      await api.saveLink(url);
      onAdd();
      setUrl('');
      onClose();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Link</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-70">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.honolulu_blue }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Link'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LinkDetailsModal: React.FC<{ link: Link | null; isOpen: boolean; onClose: () => void; }> = ({ link, isOpen, onClose }) => {
  const [details, setDetails] = useState<Link | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && link) {
      setIsLoading(true);
      setError('');
      setDetails(null);
      
      api.getLinkDetails(link.id)
        .then(response => {
          setDetails(response.link);
        })
        .catch(err => {
          setError((err as Error).message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, link]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-cyan-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Link Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 font-medium mb-4">Failed to load details</p>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : details ? (
            <div className="space-y-8">
          
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  
                  <div className="flex-shrink-0">
                    {details.image ? (
                      <img 
                        src={details.image} 
                        alt={details.title}
                        className="w-full md:w-48 h-48 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-full md:w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Globe size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                 
                 
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-2xl text-gray-900 mb-3 leading-tight">
                      {details.title}
                    </h3>
                    
                    {details.description && (
                      <p className="text-gray-700 text-base leading-relaxed mb-4">
                        {details.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Globe size={16} />
                        <span className="font-medium">{details.domain}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Saved {new Date(details.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>

                    <a
                      href={details.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: colors.honolulu_blue }}
                    >
                      Visit Original Link
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

           
              {details.tags && details.tags.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={20} className="text-gray-600" />
                    <h4 className="font-semibold text-lg text-gray-900">AI-Generated Tags</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {details.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 text-sm font-medium rounded-full border"
                        style={{ 
                          backgroundColor: colors.light_cyan,
                          color: colors.federal_blue,
                          borderColor: colors.vivid_sky_blue
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

           
              {details.summary && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    AI-Generated Summary
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
                    <p className="text-gray-800 leading-relaxed text-base">
                      {details.summary}
                    </p>
                  </div>
                </div>
              )}

           
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <a
                  href={details.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: colors.honolulu_blue }}
                >
                  Open Link
                  <ExternalLink size={18} />
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const Pagination: React.FC<{ pagination: Pagination; onPageChange: (page: number) => void; }> = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  return (
    <div className="flex items-center justify-between mt-8">
      <div className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const Llink: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  //const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [links, setLinks] = useState<Link[]>([]);
  const [pagination, setPagination] = useState<Pagination>({} as Pagination);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

  
  const TAG_CATEGORIES = [
    'Image',
    'Video', 
    'News',
    'Blog',
    'Music',
    'Social Media Post'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const fetchLinks = async (page = 1, query = '', tag = '') => {
    setIsLoading(true);
    setError('');
    
    try {
      let response: ApiResponse;
      if (query || tag) {
        response = await api.searchLinks(query, tag, page);
      } else {
        response = await api.getLinks(page);
      }
      
      setLinks(response.links);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (error) {
      setError((error as Error).message);
      setLinks([]);
      setPagination({} as Pagination);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLinks(1, searchQuery, selectedTag);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedTag('');
    setCurrentPage(1);
    fetchLinks(1);
  };

  const handleAddLink = () => {
    fetchLinks(currentPage, searchQuery, selectedTag);
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    try {
      await api.deleteLink(id);
      fetchLinks(currentPage, searchQuery, selectedTag);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handlePageChange = (page: number) => {
    fetchLinks(page, searchQuery, selectedTag);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Save, organize, and manage your favorite links with AI-powered insights</h1>
              <h2 className="text-lg font-semibold text-gray-800">Hi, {user?.name}!</h2>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">All Tags</option>
                {TAG_CATEGORIES.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              
              <button
                onClick={handleSearch}
                className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.honolulu_blue }}
              >
                Search
              </button>
              
              {(searchQuery || selectedTag) && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
              
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: colors.pacific_cyan }}
              >                                    
                <Plus size={20} />
                Add Link
              </button>
            </div>
          </div>
        </div>

    
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your links...</p>
            </div>
          </div>
        ) : (
          <>
            {/*  Grid */}
            {links.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {links.map(link => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onDelete={handleDeleteLink}
                    onView={setSelectedLink}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookmarkPlus size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchQuery || selectedTag ? 'No links found' : 'No links saved yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedTag 
                    ? 'Try adjusting your search criteria'
                    : 'Start by adding your first link with AI-powered insights'
                  }
                                  </p>
                {!searchQuery && !selectedTag && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: colors.pacific_cyan }}
                  >
                    <Plus size={20} />
                    Add Your First Link
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination 
                pagination={pagination} 
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Modals */}
        <AddLinkModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddLink}
        />

        <LinkDetailsModal
          link={selectedLink}
          isOpen={!!selectedLink}
          onClose={() => setSelectedLink(null)}
        />
      </div>
    </div>
  );
};

export default Llink;