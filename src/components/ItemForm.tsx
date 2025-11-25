'use client';

import { useState, useEffect } from 'react';

interface ItemFormProps {
  item?: {
    id?: number;
    name: string;
    category: string;
    pricePerDay: number;
    sizes: string[];
    color: string;
    style?: string;
    description: string;
    images: string[];
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CATEGORIES = [
  { value: 'dress', label: 'Vestidos' },
  { value: 'shoes', label: 'Zapatos' },
  { value: 'bag', label: 'Bolsos' },
  { value: 'jacket', label: 'Chaquetas' }
];

const AVAILABLE_SIZES = {
  dress: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  shoes: ['35', '36', '37', '38', '39', '40', '41', '42'],
  bag: ['Mini', 'Pequeño', 'Mediano', 'Grande'],
  jacket: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
};

export default function ItemForm({ item, onSubmit, onCancel, loading = false }: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || 'dress',
    pricePerDay: item?.pricePerDay || 0,
    sizes: item?.sizes || [],
    color: item?.color || '',
    style: item?.style || '',
    description: item?.description || '',
    images: item?.images || ['/images/placeholder.jpg']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/filters/colors');
        if (res.ok) {
          const j = await res.json();
          if (mounted) setAvailableColors(j.colors || []);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario edita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sizes: checked 
        ? [...prev.sizes, size]
        : prev.sizes.filter(s => s !== size)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (formData.pricePerDay <= 0) newErrors.pricePerDay = 'El precio debe ser mayor a 0';
    if (formData.sizes.length === 0) newErrors.sizes = 'Debe seleccionar al menos una talla';
    if (!formData.color.trim()) newErrors.color = 'El color es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const availableSizes = AVAILABLE_SIZES[formData.category as keyof typeof AVAILABLE_SIZES] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nombre del Item *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400"
          placeholder="Ej: Vestido de noche elegante"
          disabled={loading}
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Categoría *
        </label>
        <select
          value={formData.category}
          onChange={(e) => {
            handleChange('category', e.target.value);
            // Reset sizes when category changes
            handleChange('sizes', []);
          }}
          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
          disabled={loading}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
      </div>

      {/* Precio */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Precio por día ($) *
        </label>
        <input
          type="number"
          min="1"
          value={formData.pricePerDay}
          onChange={(e) => handleChange('pricePerDay', Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
          disabled={loading}
        />
        {errors.pricePerDay && <p className="text-red-400 text-sm mt-1">{errors.pricePerDay}</p>}
      </div>

      {/* Tallas */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tallas disponibles *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map(size => (
            <label key={size} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.sizes.includes(size)}
                onChange={(e) => handleSizeChange(size, e.target.checked)}
                className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800"
                disabled={loading}
              />
              <span className="text-sm text-gray-300">{size}</span>
            </label>
          ))}
        </div>
        {errors.sizes && <p className="text-red-400 text-sm mt-1">{errors.sizes}</p>}
      </div>

      {/* Color (select from catalog) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Color *
        </label>
        <select
          value={formData.color}
          onChange={(e) => handleChange('color', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
          disabled={loading}
          data-testid="item-color-select"
        >
          <option value="">Seleccionar color</option>
          {availableColors.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.color && <p className="text-red-400 text-sm mt-1">{errors.color}</p>}
      </div>

      {/* Estilo (opcional) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Estilo
        </label>
        <input
          type="text"
          value={formData.style}
          onChange={(e) => handleChange('style', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400"
          placeholder="Ej: Cocktail, Casual, Formal"
          disabled={loading}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Descripción *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400"
          placeholder="Describe el item, sus características y ocasiones de uso"
          disabled={loading}
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="item-submit-btn"
        >
          {loading ? 'Guardando...' : (item ? 'Actualizar' : 'Crear')}
        </button>
      </div>
    </form>
  );
}