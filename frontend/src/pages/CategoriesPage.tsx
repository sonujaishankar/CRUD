import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { categoriesApi, Category, CreateCategoryData } from '../api/categories';

const emptyForm: CreateCategoryData = { name: '', description: '' };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateCategoryData>(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      setCategories(await categoriesApi.getAll());
    } catch {
      toast.error('Failed to load categories');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (c: Category) => {
    setForm({ name: c.name, description: c.description || '' });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await categoriesApi.update(editId, form);
        toast.success('Category updated!');
      } else {
        await categoriesApi.create(form);
        toast.success('Category created!');
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving category');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? Products in this category will be uncategorized.`)) return;
    try {
      await categoriesApi.delete(id);
      toast.success('Deleted!');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Categories</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>{categories.length} categories total</p>
        </div>
        <button onClick={openCreate} style={btnStyle('#3b82f6')}>+ Add Category</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {categories.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#9ca3af' }}>
              No categories yet. Create one to get started!
            </div>
          ) : categories.map(c => (
            <div key={c.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{c.description || 'No description'}</div>
                </div>
                <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                  {c.products?.length ?? 0} items
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
                <button onClick={() => openEdit(c)} style={{ ...btnStyle('#6366f1', true), flex: 1 }}>Edit</button>
                <button onClick={() => handleDelete(c.id, c.name)} style={{ ...btnStyle('#ef4444', true), flex: 1 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700 }}>
              {editId ? 'Edit Category' : 'New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Category Name *</label>
                <input required style={inputStyle} value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Electronics" />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description..." />
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

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit' };
const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalBox: React.CSSProperties = { background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };

function btnStyle(color: string, small = false): React.CSSProperties {
  return {
    background: color, color: '#fff', border: 'none', borderRadius: 8,
    padding: small ? '6px 14px' : '10px 20px', fontSize: small ? 13 : 14,
    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  };
}
