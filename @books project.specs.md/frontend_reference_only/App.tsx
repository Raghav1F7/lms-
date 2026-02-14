import React, { useState, useEffect, useCallback } from 'react';
import { BookSummary, BookDetail, CreateBookRequest } from './types';
import { MockServer } from './services/mockServer';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Flash } from './components/Flash';
import { 
  Book as BookIcon, 
  Plus, 
  Search, 
  Library, 
  Settings, 
  ArrowLeft
} from 'lucide-react';

// --- Sub-components for structure ---

// 1. Left Rail
const Sidebar = () => (
  <nav className="w-16 flex-shrink-0 flex flex-col items-center py-6 border-r border-gray-200 bg-white z-20">
    <div className="flex flex-col gap-6">
      <div className="p-2 bg-gray-100 rounded-lg text-gray-900">
        <BookIcon size={20} />
      </div>
      <div className="p-2 text-gray-400 hover:text-gray-600 cursor-not-allowed">
        <Library size={20} />
      </div>
      <div className="p-2 text-gray-400 hover:text-gray-600 cursor-not-allowed">
        <Settings size={20} />
      </div>
    </div>
  </nav>
);

// 2. Middle Panel (Book List)
interface BookListPanelProps {
  books: BookSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  loading: boolean;
  highlightedId: string | null;
}

const BookListPanel: React.FC<BookListPanelProps> = ({ 
  books, selectedId, onSelect, onNew, searchQuery, onSearchChange, loading, highlightedId
}) => {
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.isbn.includes(searchQuery)
  );

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h2 className="font-semibold text-gray-900">Books</h2>
        <button 
          onClick={onNew}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          title="New Book"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Filter books..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-colors"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
           <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No books found.</div>
        ) : (
          filteredBooks.map(book => {
            const isSelected = selectedId === book.id;
            const isHighlighted = highlightedId === book.id;
            
            return (
              <div 
                key={book.id}
                onClick={() => onSelect(book.id)}
                className={`
                  px-6 py-4 border-b border-gray-100 cursor-pointer transition-all duration-300
                  ${isSelected ? 'bg-gray-50 border-l-4 border-l-gray-900' : 'border-l-4 border-l-transparent hover:bg-gray-50'}
                  ${isHighlighted ? 'bg-yellow-50' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {book.title}
                  </h3>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">{book.author}</p>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    {new Date(book.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Footer count */}
      <div className="h-10 border-t border-gray-200 flex items-center justify-center text-xs text-gray-400 bg-gray-50">
        {filteredBooks.length} Books
      </div>
    </div>
  );
};

// 3. Right Panel (Detail View)
interface DetailPanelProps {
  bookDetail: BookDetail | null;
  loading: boolean;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ bookDetail, loading }) => {
  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Loading details...</div>;
  }

  if (!bookDetail) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
        <BookIcon size={48} className="mb-4 opacity-20" />
        <p>Select a book to view details.</p>
      </div>
    );
  }

  const { book, accessions } = bookDetail;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Content Container - Restricted Width */}
      <div className="w-full max-w-xl mx-auto flex flex-col h-full">
        
        {/* Detail Header */}
        <div className="px-8 pt-10 pb-6 bg-white">
          <div className="flex justify-between items-start">
            <div>
               <h1 className="text-2xl font-semibold text-gray-900 mb-2">{book.title}</h1>
               <p className="text-gray-500 text-base">{book.author}</p>
            </div>
          </div>
        </div>

        {/* Accessions List */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Accessions ({accessions.length})</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Accession #</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accessions.map(acc => (
                  <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{acc.accession_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                        {acc.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {accessions.length === 0 && (
                  <tr>
                     <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500">No physical copies found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Create Form (Now fits in the narrow middle panel)
interface CreateFormProps {
  onSubmit: (data: CreateBookRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
}

const CreateForm: React.FC<CreateFormProps> = ({ onSubmit, onCancel, isSubmitting, error }) => {
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    author: '',
    isbn: '',
    accession_number: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Form Header matching List Header style */}
      <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-gray-50">
        <div className="flex items-center gap-2">
           <button onClick={onCancel} className="text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={18} />
           </button>
           <h2 className="font-semibold text-gray-900">New Entry</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-100 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="Title" 
            required 
            className="text-sm"
          />
          <Input 
            label="Author" 
            name="author" 
            value={formData.author} 
            onChange={handleChange} 
            placeholder="Author" 
            required 
            className="text-sm"
          />
          <div className="grid grid-cols-2 gap-4">
             <Input 
               label="ISBN" 
               name="isbn" 
               value={formData.isbn} 
               onChange={handleChange} 
               placeholder="ISBN" 
               required 
               className="text-sm"
             />
             <Input 
               label="Accession #" 
               name="accession_number" 
               value={formData.accession_number} 
               onChange={handleChange} 
               placeholder="Copy ID" 
               required 
               className="text-sm"
             />
          </div>

          <div className="pt-6">
            <Button type="submit" isLoading={isSubmitting} className="w-full justify-center">
              Add Book
            </Button>
            <p className="mt-4 text-[10px] text-gray-400 text-center leading-tight px-2">
              Duplicate ISBNs will automatically append a new accession number.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  // State
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  
  const [viewState, setViewState] = useState<{
    mode: 'index' | 'detail' | 'new';
    selectedId: string | null;
  }>({ mode: 'index', selectedId: null });

  const [detailData, setDetailData] = useState<BookDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Feedback state
  const [flash, setFlash] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load List
  const fetchBooks = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await MockServer.getBooks();
      setBooks(data);
    } catch (e) {
      console.error(e);
      setFlash({ message: "Failed to load books", type: 'error' });
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Handle Selection
  const handleSelectBook = async (id: string) => {
    setViewState({ mode: 'detail', selectedId: id });
    setLoadingDetail(true);
    try {
      const data = await MockServer.getBook(id);
      setDetailData(data);
    } catch (e) {
      console.error(e);
      setFlash({ message: "Failed to load details", type: 'error' });
      setViewState({ mode: 'index', selectedId: null });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleNewBook = () => {
    // Switch to new mode but KEEP selectedId and detailData to preserve context on the right
    setViewState(prev => ({ ...prev, mode: 'new' }));
    // Do NOT clear detailData here
  };

  const handleCancelNew = () => {
    // Return to index mode, preserving previous selection if possible
    setViewState(prev => ({ ...prev, mode: 'index' }));
  };

  const handleCreateSubmit = async (data: CreateBookRequest) => {
    setSubmitting(true);
    setFormError(null);
    try {
      const result = await MockServer.createBook(data);
      
      // Refresh list
      const updatedBooks = await MockServer.getBooks();
      setBooks(updatedBooks);

      setFlash({ message: result.message, type: 'success' });
      
      // Return to index mode
      setViewState({ mode: 'index', selectedId: null });
      
      // Now clear detail data as we are done with the previous context and want to show list state
      setDetailData(null);

      // Trigger the "fade away" highlight effect
      setHighlightedId(result.bookId);

      // Remove highlight after 3s
      setTimeout(() => setHighlightedId(null), 3000);

    } catch (e: any) {
      setFormError(e.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white">
      <Sidebar />
      
      {/* Middle Column - Toggles between List and Form */}
      <div className="w-96 flex-shrink-0 border-r border-gray-200 bg-white z-10 flex flex-col">
        {viewState.mode === 'new' ? (
           <CreateForm 
             onSubmit={handleCreateSubmit}
             onCancel={handleCancelNew}
             isSubmitting={submitting}
             error={formError}
           />
        ) : (
          <BookListPanel 
            books={books}
            loading={loadingList}
            onNew={handleNewBook}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            selectedId={viewState.selectedId}
            onSelect={handleSelectBook}
            highlightedId={highlightedId}
          />
        )}
      </div>

      {/* Right Column - Detail View (Always Detail or Empty) */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <DetailPanel 
          bookDetail={detailData}
          loading={loadingDetail}
        />
      </div>

      {flash && (
        <Flash 
          message={flash.message} 
          type={flash.type} 
          onClear={() => setFlash(null)} 
        />
      )}
    </div>
  );
}