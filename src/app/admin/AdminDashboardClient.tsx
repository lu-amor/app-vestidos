'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/CsrfSessionManagement';
import Modal from '../../components/Modal';
import ItemForm from '../../components/ItemForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';

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

const mockRentals: Rental[] = [
  {
    id: "12345678-1234-1234-1234-123456789012",
    itemId: 2,
    start: "2025-11-10",
    end: "2025-11-15",
    customer: { name: "Ana García", email: "ana@email.com", phone: "+34 123 456 789" },
    createdAt: "2025-11-09T10:00:00Z",
    status: "active"
  },
  {
    id: "87654321-4321-4321-4321-210987654321",
    itemId: 1,
    start: "2025-11-20",
    end: "2025-11-25",
    customer: { name: "María López", email: "maria@email.com", phone: "+34 987 654 321" },
    createdAt: "2025-11-08T15:30:00Z",
    status: "active"
  }
];

export default function AdminDashboardClient() {
  const router = useRouter();
  const { addToast } = useToast();
  const [items, setItems] = useState<ItemWithRentals[]>(mockItems);
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
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
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-800"
            data-testid="admin-color-select"
          >
            <option value="all">Todos los colores</option>
            {availableColors.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
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
    // fetch available colors for admin catalog management
    (async () => {
      try {
        const r = await fetch('/api/filters/colors');
        if (r.ok) {
          const d = await r.json();
          setAvailableColors(d.colors || []);
        }
      } catch (e) {
        console.error('Failed to fetch colors', e);
      }
    })();
    
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
        // Keep using mock data on error
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
        // Re-fetch rentals from server to ensure state is consistent and persisted
        try {
          const r = await fetch('/api/admin/rentals');
          if (r.ok) {
            const body = await r.json().catch(() => ({}));
            const rentalsArray = body.rentals || body || [];
            setRentals(rentalsArray);
            // Also update items' rental flags based on fresh rentals
            setItems(prevItems => {
              const today = new Date().toISOString().split('T')[0];
              return prevItems.map(it => {
                const itemRentals = rentalsArray.filter((rr: Rental) => rr.itemId === it.id && rr.status === 'active');
                const activeRentals = itemRentals.filter((r2: Rental) => r2.start <= today && r2.end >= today).length;
                const upcomingRentals = itemRentals.filter((r2: Rental) => r2.start > today).length;
                return { ...it, activeRentals, upcomingRentals, isCurrentlyRented: activeRentals > 0 };
              });
            });
          }
        } catch (e) {
          console.error('Failed to refresh rentals after cancel:', e);
        }
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

        if (response.ok) {
          const updatedItem = await response.json();
          setItems(prev => prev.map(item => 
            item.id === editingItem.id 
              ? { ...item, ...updatedItem.item }
              : item
          ));
          addToast({
            type: 'success',
            message: 'Artículo actualizado exitosamente'
          });
        } else {
          throw new Error('Error al actualizar el artículo');
        }
      } else {
        // Create new item
        const response = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          const newItem = {
            ...result.item,
            activeRentals: 0,
            upcomingRentals: 0,
            isCurrentlyRented: false
          };
          setItems(prev => [...prev, newItem]);
          addToast({
            type: 'success',
            message: 'Artículo creado exitosamente'
          });
        } else {
          throw new Error('Error al crear el artículo');
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
        const errorData = await response.json();
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
      const matchesColor = colorFilter === 'all' || (item.color || '').toLowerCase() === colorFilter.toLowerCase();
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'available' && !item.isCurrentlyRented) ||
                         (statusFilter === 'rented' && item.isCurrentlyRented);
    
      return matchesSearch && matchesCategory && matchesStatus && matchesColor;
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard de Administración</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Gestiona tu inventario y alquileres</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Filter Catalog Management (Admin) */}
      <div className="border border-gray-700 rounded-lg shadow-sm p-6 mt-6">
        <h3 className="text-lg font-semibold mb-3">Catálogo de colores</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label className="block text-sm text-400 mb-1">Colores disponibles</label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((c) => (
                <div key={c} className="relative inline-flex items-center">
                  <span data-testid={`color-chip-${c}`} className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm capitalize">{c}</span>
                  <button
                    aria-label={`Eliminar ${c}`}
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/filters/colors', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ color: c }) });
                        if (res.ok) {
                          setAvailableColors(prev => prev.filter(x => x.toLowerCase() !== c.toLowerCase()));
                          addToast({ type: 'success', message: `Color ${c} eliminado` });
                        } else {
                          const err = await res.json().catch(() => ({}));
                          addToast({ type: 'error', message: err.error || 'Error eliminando color' });
                        }
                      } catch (e) {
                        addToast({ type: 'error', message: 'Error eliminando color' });
                      }
                    }}
                    className="-ml-2 -mr-2 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs"
                    title={`Eliminar ${c}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Nuevo color"
              className="px-3 py-2 border border-gray-600 rounded-lg bg-800"
              data-testid="admin-new-color-input"
            />
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/filters/colors', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ color: newColor }) });
                  if (res.ok) {
                    const d = await res.json();
                    setAvailableColors(prev => [...prev, d.color]);
                    setNewColor('');
                    addToast({ type: 'success', message: 'Color agregado' });
                  } else {
                    const err = await res.json();
                    addToast({ type: 'error', message: err.error || 'Error' });
                  }
                } catch (e) {
                  addToast({ type: 'error', message: 'Error al guardar color' });
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              data-testid="admin-add-color-btn"
            >Agregar</button>
            <button
              onClick={async () => {
                try {
                  const r = await fetch('/api/filters/colors');
                  if (r.ok) {
                    const d = await r.json();
                    setAvailableColors(d.colors || []);
                    addToast({ type: 'success', message: 'Colores actualizados' });
                  } else {
                    addToast({ type: 'error', message: 'No se pudieron actualizar los colores' });
                  }
                } catch (e) {
                  addToast({ type: 'error', message: 'Error al obtener colores' });
                }
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              data-testid="admin-refresh-colors-btn"
            >Actualizar</button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="border border-gray-700 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-400">Total Items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-700 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-400">Disponibles</p>
              <p className="text-2xl font-bold text">{items.filter(i => !i.isCurrentlyRented).length}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-700 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-400">Alquileres Activos</p>
              <p className="text-2xl font-bold">{currentRentals.length}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-700 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-400">Próximos Alquileres</p>
              <p className="text-2xl font-bold">{upcomingRentals.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="border border-gray-700 rounded-lg shadow-sm p-6 mt-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, color o estilo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-800 placeholder-gray-400"
              data-testid="admin-search-input"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-800"
            data-testid="admin-category-select"
          >
            <option value="all">Todas las categorías</option>
            <option value="dress">Vestidos</option>
            <option value="shoes">Zapatos</option>
            <option value="bag">Bolsos</option>
            <option value="jacket">Chaquetas</option>
          </select>

          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-800"
            data-testid="admin-color-select"
          >
            <option value="all">Todos los colores</option>
            {availableColors.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-800"
            data-testid="admin-status-select"
          >
            <option value="all">Todos los estados</option>
            <option value="available">Disponible</option>
            <option value="rented">Alquilado</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-900">Inventario</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-300">
              {filteredItems.length} de {items.length} artículos
            </span>
            <button
              onClick={handleAddItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Artículo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="border border-gray-700 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="relative h-64 flex-shrink-0">
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
                    <span className="bg-red-900 text-red-100 text-xs font-semibold px-3 py-1 rounded-full border border-red-700 shadow-sm">
                      Alquilado
                    </span>
                  ) : (
                    <span className="bg-green-900 text-green-100 text-xs font-semibold px-3 py-1 rounded-full border border-green-700 shadow-sm">
                      Disponible
                    </span>
                  )}
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded shadow-sm">
                    ID: {item.id}
                  </span>
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text mb-2 line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-300 line-clamp-2">{item.description}</p>
                </div>
                
                <div className="space-y-2 mb-4 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-400 font-medium">Categoría:</span>
                    <span className="text-sm font-semibold text-white capitalize">{item.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-400 font-medium">Color:</span>
                    <span className="text-sm font-semibold text-white capitalize">{item.color}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-400 font-medium">Tallas:</span>
                    <span className="text-sm font-semibold text-white">{item.sizes.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span className="text-sm text-400 font-medium">Precio/día:</span>
                    <span className="text-xl font-bold text-blue-400">${item.pricePerDay}</span>
                  </div>
                </div>

                {/* Rental status indicators */}
                <div className="flex flex-wrap gap-2 mt-auto mb-3">
                  {item.activeRentals > 0 && (
                    <span className="bg-orange-900 text-orange-100 text-xs font-semibold px-2 py-1 rounded-full border border-orange-700">
                      {item.activeRentals} activo{item.activeRentals > 1 ? 's' : ''}
                    </span>
                  )}
                  {item.upcomingRentals > 0 && (
                    <span className="bg-blue-900 text-blue-100 text-xs font-semibold px-2 py-1 rounded-full border border-blue-700">
                      {item.upcomingRentals} próximo{item.upcomingRentals > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={item.isCurrentlyRented}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    title={item.isCurrentlyRented ? "No se puede eliminar: artículo actualmente alquilado" : "Eliminar artículo"}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rentals Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Alquileres Programados</h2>
        
        <div className="border border-gray-700 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    ID del Alquiler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Artículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rentals.map((rental) => {
                  const item = items.find(i => i.id === rental.itemId);
                  const isActive = rental.start <= todayDate && rental.end >= todayDate && rental.status === 'active';
                  const isFuture = rental.start > todayDate;
                  
                  return (
                    <tr key={rental.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
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
                          <div>
                            <div className="font-medium text-white">{item?.name || `Item ${rental.itemId}`}</div>
                            <div className="text-xs text-gray-400">ID: {rental.itemId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div>
                          <div className="font-medium">{rental.start} → {rental.end}</div>
                          <div className="text-xs">
                            {isActive && <span className="text-orange-400 font-semibold">● En curso</span>}
                            {isFuture && <span className="text-blue-400 font-semibold">● Próximo</span>}
                            {!isActive && !isFuture && rental.status === 'active' && <span className="text-gray-400">● Terminado</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div>
                          <div className="font-medium text-white">{rental.customer.name}</div>
                          <div className="text-xs text-gray-400">
                            {rental.customer.email} • {rental.customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          rental.status === 'active' 
                            ? 'bg-green-900 text-green-100 border border-green-700' 
                            : 'bg-red-900 text-red-100 border border-red-700'
                        }`}>
                          {rental.status === 'active' ? 'Activo' : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {rental.status === "active" ? (
                          <button
                            onClick={() => handleCancelRental(rental.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            Cancelar
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
                      No hay alquileres programados todavía.
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
        title={editingItem ? 'Editar Artículo' : 'Agregar Nuevo Artículo'}
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