'use client';

import { useState } from 'react';

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
  bag: ['Mini', 'Small', 'Medium', 'Large'],
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

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.pricePerDay <= 0) newErrors.pricePerDay = 'Price must be greater than 0';
    if (formData.sizes.length === 0) newErrors.sizes = 'At least one size must be selected';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

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
      <div>
        <label className="block text-sm font-semibold text-[#463f3a] mb-1">
          Item Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 rounded-full bg-[#8a817c] text-white placeholder-white focus:outline-[#463f3a] focus:ring-2 focus:ring-[#463f3a]"
          placeholder="Ej: Vestido de noche elegante"
          disabled={loading}
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-semibold text-[#463f3a] mb-1">
          Category *
        </label>
        <select
          value={formData.category}
          onChange={(e) => {
            handleChange('category', e.target.value);
            // Reset sizes when category changes
            handleChange('sizes', []);
          }}
          className="w-full px-3 py-2 rounded-full bg-[#8a817c] text-white placeholder-white focus:outline-[#463f3a] focus:ring-2 focus:ring-[#463f3a]"
          disabled={loading}
          style={{WebkitAppearance: 'none'}}
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
        <label className="block text-sm font-semibold text-[#463f3a] mb-1">
          Price per day ($) *
        </label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData.pricePerDay}
          onChange={(e) => {
            const sanitized = e.target.value.replace(/[^\d.]/g, '');
            handleChange('pricePerDay', sanitized === '' ? 0 : Number(sanitized));
          }}
          className="w-full px-3 py-2 rounded-full bg-[#8a817c] text-white placeholder-white focus:outline-[#463f3a] focus:ring-2 focus:ring-[#463f3a]"
          disabled={loading}
          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
        />
        {errors.pricePerDay && <p className="text-red-400 text-sm mt-1">{errors.pricePerDay}</p>}
      </div>

      {/* Tallas */}
      <div>
        <label className="block text-sm font-semibold text-[#463f3a] mb-1">
          Available Sizes *
        </label>
        <div className={`grid gap-1 ${formData.category === 'bag' ? 'grid-cols-5' : 'grid-cols-10'}`}>
            {availableSizes.map(size => (
                <label key={size} className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={formData.sizes.includes(size)}
                        onChange={(e) => handleSizeChange(size, e.target.checked)}
                        className="rounded border-gray-600 bg-gray-800 focus:ring-2"
                        style={{ width: 20, height: 20, accentColor: '#e0afa0'}}
                        disabled={loading}
                    />
                    <span className="text-sm font-bold text-[#e0afa0]">{size}</span>
                </label>
            ))}
        </div>
        {errors.sizes && <p className="text-red-400 text-sm mt-1">{errors.sizes}</p>}
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-semibold text-[#463f3a] mb-1">
          Color *
        </label>
        <input
          type="text"
          value={formData.color}
          onChange={(e) => handleChange('color', e.target.value)}
          className="w-full px-3 py-2 rounded-full bg-[#8a817c] text-white placeholder-white focus:outline-[#463f3a] focus:ring-2 focus:ring-[#463f3a]"
          placeholder="Ej: Negro, Azul marino, Floral"
          disabled={loading}
        />
        {errors.color && <p className="text-red-400 text-sm mt-1">{errors.color}</p>}
      </div>

      {/* Estilo (opcional) */}
      <div>
        <label className="block text-sm font-semibold text-[#463f3a] mb-1">
          Style
        </label>
        <input
          type="text"
          value={formData.style}
          onChange={(e) => handleChange('style', e.target.value)}
          className="w-full px-3 py-2 rounded-full bg-[#8a817c] text-white placeholder-white focus:outline-[#463f3a] focus:ring-2 focus:ring-[#463f3a]"
          placeholder="Ej: Cocktail, Casual, Formal"
          disabled={loading}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-[#463f3a] mb-1">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-2xl bg-[#8a817c] text-white placeholder-white focus:outline-[#463f3a] focus:ring-2 focus:ring-[#463f3a]"
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
          className="px-4 py-2 text-[#463f3a] rounded-full bg-[#bcb8b1] font-semibold hover:bg-[#8a817c] transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-[#463f3a] rounded-full bg-[#e0afa0] font-semibold hover:bg-[#463f3a] hover:text-[#f4f3ee] transition-colors"
        >
          {loading ? 'Saving...' : (item ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}