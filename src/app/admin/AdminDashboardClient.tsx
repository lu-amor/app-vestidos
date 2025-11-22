'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/CsrfSessionManagement';
import Modal from '../../components/Modal';
import ItemForm from '../../components/ItemForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faShirt, faCircleCheck, faClock, faCalendar, faPlus, faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons";

type Item = {
  id: number;
  name: string;
  category: string;
  sizes: string[];
  pricePerDay: number;
  color: string;
  style?: string;
  description: string;
  images: string[];
  alt: string;
};

type Rental = {
  id: string;
  itemId: number;
  start: string;
  end: string;
  customer: { name: string; email: string; phone: string };
  createdAt: string;
  status: "active" | "canceled";
};

type ItemWithRentals = Item & {
  activeRentals: number;
  upcomingRentals: number;
  isCurrentlyRented: boolean;
};

// Mock data for immediate display
const mockItems: ItemWithRentals[] = [
  {
    id: 1,
    name: "Silk Evening Gown",
    category: "dress",
    pricePerDay: 79,
    sizes: ["XS", "S", "M", "L"],
    color: "champagne",
    style: "evening",
    description: "Luxurious silk gown with flattering silhouette.",
    images: ["/images/dresses/silk-evening-gown.jpg"],
    alt: "Model wearing a champagne silk evening gown",
    activeRentals: 0,
    upcomingRentals: 1,
    isCurrentlyRented: false
  },
  {
    id: 2,
    name: "Black Tie Dress",
    category: "dress",
    pricePerDay: 99,
    sizes: ["S", "M", "L", "XL"],
    color: "black",
    style: "black-tie",
    description: "Elegant black-tie dress for formal events.",
    images: ["/images/dresses/black-tie-dress.jpg"],
    alt: "Elegant black tie dress",
    activeRentals: 1,
    upcomingRentals: 0,
    isCurrentlyRented: true
  },
  {
    id: 3,
    name: "Floral Midi Dress",
    category: "dress",
    pricePerDay: 49,
    sizes: ["XS", "S", "M"],
    color: "floral",
    style: "daytime",
    description: "Bright floral midi for daytime events.",
    images: ["/images/dresses/floral-midi-dress.jpg"],
    alt: "Floral midi dress perfect for daytime events",
    activeRentals: 0,
    upcomingRentals: 0,
    isCurrentlyRented: false
  },
  {
    id: 4,
    name: "Velvet Cocktail Dress",
    category: "dress",
    pricePerDay: 59,
    sizes: ["S", "M", "L"],
    color: "burgundy",
    style: "cocktail",
    description: "Rich velvet cocktail dress in deep tones.",
    images: ["/images/dresses/velvet-cocktail-dress.jpg"],
    alt: "Velvet cocktail dress in deep tones",
    activeRentals: 0,
    upcomingRentals: 0,
    isCurrentlyRented: false
  }
];

export default function AdminDashboardClient() {
  const router = useRouter();
  const { addToast } = useToast();
  const [items, setItems] = useState<ItemWithRentals[]>(mockItems);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Modal states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Double-check authentication on client side
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/rentals');
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
        return;
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsResponse, rentalsResponse] = await Promise.all([
          fetch('/api/items'),
          fetch('/api/admin/rentals')
        ]);

        if (rentalsResponse.status === 401) {
          router.push('/admin/login');
          return;
        }

        if (itemsResponse.ok && rentalsResponse.ok) {
          const itemsData = await itemsResponse.json();
          const rentalsData = await rentalsResponse.json();
          
          console.log('API Response - Items:', itemsData);
          console.log('API Response - Rentals:', rentalsData);
          
          // Extract arrays from API response objects
          const itemsArray = itemsData.items || itemsData || [];
          const rentalsArray = rentalsData.rentals || rentalsData || [];
          
          // Enrich items with rental information
          const today = new Date().toISOString().split('T')[0];
          const enrichedItems = itemsArray.map((item: any) => {
            const itemRentals = rentalsArray.filter((r: Rental) => r.itemId === item.id && r.status === 'active');
            const activeRentals = itemRentals.filter((r: Rental) => r.start <= today && r.end >= today).length;
            const upcomingRentals = itemRentals.filter((r: Rental) => r.start > today).length;
            
            return {
              id: item.id,
              name: item.name,
              category: item.category,
              sizes: item.sizes || [],
              pricePerDay: item.pricePerDay,
              color: item.color,
              style: item.style,
              description: item.description || `${item.name} - ${item.color}`,
              images: item.image ? [item.image] : [item.images?.[0] || '/images/placeholder.jpg'],
              alt: item.alt || item.name,
              activeRentals,
              upcomingRentals,
              isCurrentlyRented: activeRentals > 0
            };
          });
          
          if (enrichedItems.length > 0) {
            setItems(enrichedItems);
          }
          if (rentalsArray.length >= 0) {
            setRentals(rentalsArray);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCancelRental = async (rentalId: string) => {
    try {
      const response = await fetch(`/api/admin/rentals/${rentalId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setRentals(prev => prev.map(r => 
          r.id === rentalId ? { ...r, status: 'canceled' as const } : r
        ));
        // Refresh items to update rental counts
        window.location.reload();
      }
    } catch (error) {
      console.error('Error cancelling rental:', error);
    }
  };

  // Item CRUD functions
  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: ItemWithRentals) => {
    setEditingItem({
      id: item.id,
      name: item.name,
      category: item.category,
      sizes: item.sizes,
      pricePerDay: item.pricePerDay,
      color: item.color,
      style: item.style,
      description: item.description,
      images: item.images,
      alt: item.alt
    });
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (itemId: number) => {
    setItemToDelete(itemId);
    setIsConfirmDialogOpen(true);
  };

  const handleItemSubmit = async (formData: any) => {
    setOperationLoading(true);
    try {
      if (editingItem) {
        // Update existing item
        const response = await fetch(`/api/items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const payload = await response.json().catch(() => ({}));
        if (response.ok) {
          // Re-fetch authoritative items list to keep client state in sync with the server
          const itemsResp = await fetch('/api/items');
          if (itemsResp.ok) {
            const itemsData = await itemsResp.json();
            const itemsArray = itemsData.items || itemsData || [];
            // Map into the shape used by this component
            const enriched = itemsArray.map((item: any) => ({
              id: item.id,
              name: item.name,
              category: item.category,
              sizes: item.sizes || [],
              pricePerDay: item.pricePerDay,
              color: item.color,
              style: item.style,
              description: item.description || `${item.name} - ${item.color}`,
              images: item.image ? [item.image] : [item.images?.[0] || '/images/placeholder.jpg'],
              alt: item.alt || item.name,
              activeRentals: 0,
              upcomingRentals: 0,
              isCurrentlyRented: false
            }));
            setItems(enriched);
          }

          addToast({ type: 'success', message: 'Artículo actualizado exitosamente' });
        } else {
          const msg = payload?.error || 'Error al actualizar el artículo';
          throw new Error(msg);
        }
      } else {
        // Create new item
        const response = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const payload = await response.json().catch(() => ({}));
        if (response.ok) {
          // Re-fetch authoritative items list so client sees server-assigned IDs
          const itemsResp = await fetch('/api/items');
          if (itemsResp.ok) {
            const itemsData = await itemsResp.json();
            const itemsArray = itemsData.items || itemsData || [];
            const enriched = itemsArray.map((item: any) => ({
              id: item.id,
              name: item.name,
              category: item.category,
              sizes: item.sizes || [],
              pricePerDay: item.pricePerDay,
              color: item.color,
              style: item.style,
              description: item.description || `${item.name} - ${item.color}`,
              images: item.image ? [item.image] : [item.images?.[0] || '/images/placeholder.jpg'],
              alt: item.alt || item.name,
              activeRentals: 0,
              upcomingRentals: 0,
              isCurrentlyRented: false
            }));
            setItems(enriched);
          }

          addToast({ type: 'success', message: 'Artículo creado exitosamente' });
        } else {
          const msg = payload?.error || 'Error al crear el artículo';
          throw new Error(msg);
        }
      }
      setIsItemModalOpen(false);
    } catch (error) {
      console.error('Error saving item:', error);
      addToast({
        type: 'error',
        message: 'Error al guardar el artículo'
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;

    setOperationLoading(true);
    try {
      const response = await fetch(`/api/items/${itemToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== itemToDelete));
        addToast({
          type: 'success',
          message: 'Artículo eliminado exitosamente'
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server delete error payload:', errorData);
        // Attempt to re-sync client state with server in case of stale IDs
        try {
          const itemsResp = await fetch('/api/items');
          if (itemsResp.ok) {
            const itemsData = await itemsResp.json();
            const itemsArray = itemsData.items || itemsData || [];
            const enriched = itemsArray.map((item: any) => ({
              id: item.id,
              name: item.name,
              category: item.category,
              sizes: item.sizes || [],
              pricePerDay: item.pricePerDay,
              color: item.color,
              style: item.style,
              description: item.description || `${item.name} - ${item.color}`,
              images: item.image ? [item.image] : [item.images?.[0] || '/images/placeholder.jpg'],
              alt: item.alt || item.name,
              activeRentals: 0,
              upcomingRentals: 0,
              isCurrentlyRented: false
            }));
            setItems(enriched);
          }
        } catch (e) {
          console.error('Failed to re-sync items after delete failure', e);
        }

        throw new Error(errorData.error || 'Error al eliminar el artículo');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al eliminar el artículo'
      });
    } finally {
      setOperationLoading(false);
      setIsConfirmDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.style?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'available' && !item.isCurrentlyRented) ||
                         (statusFilter === 'rented' && item.isCurrentlyRented);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeRentals = rentals.filter(r => r.status === 'active');
  const todayDate = new Date().toISOString().split('T')[0];
  const currentRentals = activeRentals.filter(r => r.start <= todayDate && r.end >= todayDate);
  const upcomingRentals = activeRentals.filter(r => r.start > todayDate);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-300">Verificando acceso...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will handle this)
  if (!isAuthenticated) {
    return null;
  }
              console.log('Rendering item:', items)


  if (loading && items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-300">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-gray-900 dark:text-white min-h-screen transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your inventory and rentals</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-[#463f3a] hover:bg-[#3a352f] text-white font-semibold px-6 py-2 rounded-full transition-colors"
        >
          Log Out
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-[#e0afa0]/50 rounded-4xl shadow-sm p-6">
          <div className="flex items-start">
            <div className="p-3 bg-[#8a817c] rounded-lg">
                <FontAwesomeIcon icon={faShirt} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-400">Total Items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#e0afa0]/50 rounded-4xl shadow-sm p-6">
          <div className="flex items-start">
            <div className="p-3 bg-[#8a817c] rounded-lg">
                <FontAwesomeIcon icon={faCircleCheck} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-400">Available Items</p>
              <p className="text-2xl font-bold text">{items.filter(i => !i.isCurrentlyRented).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#e0afa0]/50 rounded-4xl shadow-sm p-6">
          <div className="flex items-start">
            <div className="p-3 bg-[#8a817c] rounded-lg">
                <FontAwesomeIcon icon={faClock} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-400">Active Rentals</p>
              <p className="text-2xl font-bold">{currentRentals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#e0afa0]/50 rounded-4xl shadow-sm p-6">
        <div className="flex items-start">
            <div className="p-3 bg-[#8a817c] rounded-lg">
                <FontAwesomeIcon icon={faCalendar} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-400">Upcoming Rentals</p>
              <p className="text-2xl font-bold">{upcomingRentals.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#bcb8b1]/50 rounded-full shadow-sm p-5 mt-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, color, or style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[#8a817c] rounded-full bg-800"
            />
          </div>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-[#8a817c] rounded-full bg-800"
            style={{WebkitAppearance: "none"}}
          >
            <option value="all">All categories</option> 
            <option value="dress">Dresses</option>
            <option value="shoes">Shoes</option>
            <option value="bag">Bags</option>
            <option value="jacket">Jackets</option>
          </select>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#8a817c] rounded-full bg-800"
            style={{WebkitAppearance: "none"}}
          >
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-900">Inventory</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-300">
              {filteredItems.length} of {items.length} items
            </span>
            <button
              onClick={handleAddItem}
              className="bg-[#463f3a] hover:bg-[#3a342f] text-white px-4 py-2 rounded-full transition-colors font-medium flex items-center gap-2"
            >
            <FontAwesomeIcon icon={faPlus} />
              Add Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="relative h-150 flex-shrink-0">
                <img
                  src={item.images[0]}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                  }}
                />
                <div className="absolute top-3 right-3">
                  {item.isCurrentlyRented ? (
                    <span className="bg-[#463f3a] text-[#e0afa0] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      Rented
                    </span>
                  ) : (
                    <span className="bg-[#e0afa0] text-[#463f3a] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      Available
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-300 line-clamp-2">{item.description}</p>
                </div>
                
                <div className="space-y-1 mb-2 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-400 font-medium">Category:</span>
                    <span className="text-sm font-semibold capitalize">{item.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-400 font-medium">Color:</span>
                    <span className="text-sm font-semibold capitalize">{item.color}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-400 font-medium">Sizes:</span>
                    <span className="text-sm font-semibold">{item.sizes.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span className="text-sm text-400 font-medium">Price/Day:</span>
                    <span className="text-xl font-bold">${item.pricePerDay}</span>
                  </div>
                </div>

                {/* Rental status indicators */}
                <div className="flex flex-wrap gap-2 mt-auto mb-2">
                  {item.activeRentals > 0 && (
                    <span className="bg-[#463f3a] text-[#f4f3ee] text-xs font-semibold px-2 py-1 rounded-full">
                      {item.activeRentals} active
                    </span>
                  )}
                  {item.upcomingRentals > 0 && (
                    <span className="bg-[#e0afa0] text-[#463f3a] text-xs font-semibold px-2 py-1 rounded-full">
                      {item.upcomingRentals} upcoming
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-[#463f3a] text-[#f4f3ee]"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="text-[#f4f3ee]"/>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={item.isCurrentlyRented}
                    className="flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-[#e0afa0] text-[#463f3a] disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-[#463f3a]"/>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rentals Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rental information</h2>
        
        <div className="border border-[#8a817c]/50 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#8a817c]/50">
              <thead className="bg-[#bcb8b1]/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Rental ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8a817c]/50">
                {rentals.map((rental) => {
                  const item = items.find(i => i.id === rental.itemId);
                  const isActive = rental.start <= todayDate && rental.end >= todayDate && rental.status === 'active';
                  const isFuture = rental.start > todayDate;
                  
                  return (
                    <tr key={rental.id} className="hover:bg-[#8a817c]/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {rental.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div className="flex items-center">
                          {item && (
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              <img
                                src={item.images[0]}
                                alt={item.alt}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-600"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/images/placeholder.jpg';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>
                            <div>
                                {(() => {
                                    const fmt = (s: string) => {
                                        const d = new Date(s);
                                        if (isNaN(d.getTime())) return s;
                                        const day = String(d.getDate()).padStart(2, '0');
                                        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                        const mon = months[d.getMonth()];
                                        const year = String(d.getFullYear());
                                        return `${day} ${mon} ${year}`;
                                    };
                                    return `${fmt(rental.start)} → ${fmt(rental.end)}`;
                                })()}
                            </div>
                          <div className="text-xs">
                            {isActive && <span className="text-[#463f3a] font-semibold">● Active</span>}
                            {isFuture && <span className="text-[#ad7a6a] font-semibold">● Upcoming</span>}
                            {!isActive && !isFuture && rental.status === 'active' && <span className="text-gray-400">● Terminado</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>
                          <div className="font-medium">{rental.customer.name}</div>
                          <div className="text-xs text-gray-400">
                            {rental.customer.email} • {rental.customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                          rental.status === 'active' 
                            ? 'bg-[#463f3a] text-[#e0afa0] border border-green-700' 
                            : 'bg-[#bcb8b1] text-[#463f3a]'
                        }`}>
                          {rental.status === 'active' ? 'Active' : 'Cancelled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {rental.status === "active" ? (
                          <button
                            onClick={() => handleCancelRental(rental.id)}
                            className="bg-[#e0afa0] text-[#463f3a] px-3 py-1 rounded-full text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {rentals.length === 0 && (
                  <tr>
                    <td className="px-6 py-8 text-center text-gray-400" colSpan={6}>
                      No rentals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Item Modal */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => !operationLoading && setIsItemModalOpen(false)}
        title={editingItem ? 'Update Item' : 'Add New Item'}
        maxWidth="lg"
      >
        <ItemForm
          item={editingItem || undefined}
          onSubmit={handleItemSubmit}
          onCancel={() => setIsItemModalOpen(false)}
          loading={operationLoading}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => !operationLoading && setIsConfirmDialogOpen(false)}
        onConfirm={confirmDeleteItem}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonColor="red"
        loading={operationLoading}
      />
    </div>
  );
}