import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { productsApi, Product, CreateProductData } from '../api/products';
import { categoriesApi, Category } from '../api/categories';

const emptyForm: CreateProductData = {
  name: '', description: '', price: 0, quantity: 0, sku: '', categoryId: undefined,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateProductData>(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const [p, s, c] = await Promise.all([
        productsApi.getAll(search || undefined),
        productsApi.getStats(),
        categoriesApi.getAll(),
      ]);
      setProducts(p);
      setStats(s);
      setCategories(c);
    } catch {
      toast.error('Failed to load data');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [search]);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, description: p.description || '', price: parseFloat(p.price),
      quantity: p.quantity, sku: p.sku || '', categoryId: p.categoryId || undefined,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await productsApi.update(editId, form);
        toast.success('Product updated!');
      } else {
        await productsApi.create(form);
        toast.success('Product created!');
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await productsApi.delete(id);
      toast.success('Deleted!');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      {/* Stats Bar */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Products', value: stats.totalProducts, color: '#3b82f6' },
            { label: 'Total Value', value: `₹${Number(stats.totalValue).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, color: '#10b981' },
            { label: 'Low Stock', value: stats.lowStock, color: '#f59e0b' },
            { label: 'Out of Stock', value: stats.outOfStock, color: '#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginTop: 4 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <input
          placeholder="Search products or SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, width: 280 }}
        />
        <button onClick={openCreate} style={btnStyle('#3b82f6')}>+ Add Product</button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Name', 'SKU', 'Category', 'Price', 'Qty', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No products found</td></tr>
            ) : products.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
                  {p.description && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{p.description.slice(0, 40)}{p.description.length > 40 ? '...' : ''}</div>}
                </td>
                <td style={tdStyle}><span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}>{p.sku || '—'}</span></td>
                <td style={tdStyle}>{p.category?.name || <span style={{ color: '#d1d5db' }}>—</span>}</td>
                <td style={tdStyle}><strong>₹{parseFloat(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
                <td style={tdStyle}>{p.quantity}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: p.quantity === 0 ? '#fee2e2' : p.quantity <= 5 ? '#fef3c7' : '#d1fae5',
                    color: p.quantity === 0 ? '#dc2626' : p.quantity <= 5 ? '#d97706' : '#065f46',
                  }}>
                    {p.quantity === 0 ? 'Out of Stock' : p.quantity <= 5 ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={btnStyle('#6366f1', true)}>Edit</button>
                    <button onClick={() => handleDelete(p.id, p.name)} style={btnStyle('#ef4444', true)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700 }}>
              {editId ? 'Edit Product' : 'New Product'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Product Name *</label>
                  <input required style={inputStyle} value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input required type="number" min="0" step="0.01" style={inputStyle} value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <label style={labelStyle}>Quantity *</label>
                  <input required type="number" min="0" style={inputStyle} value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) }))} />
                </div>
                <div>
                  <label style={labelStyle}>SKU</label>
                  <input style={inputStyle} value={form.sku}
                    onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.categoryId || ''}
                    onChange={e => setForm(f => ({ ...f, categoryId: e.target.value ? parseInt(e.target.value) : undefined }))}>
                    <option value="">— None —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} style={btnStyle('#6b7280')}>Cancel</button>
                <button type="submit" style={btnStyle('#3b82f6')}>{editId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 14, color: '#374151' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit' };
const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalBox: React.CSSProperties = { background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 560, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };

function btnStyle(color: string, small = false): React.CSSProperties {
  return {
    background: color, color: '#fff', border: 'none', borderRadius: 8,
    padding: small ? '6px 14px' : '10px 20px', fontSize: small ? 13 : 14,
    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  };
}
