"use client";

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import Button from '@/components/Button/Button';
import { useApp } from '@/context/AppContext';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const indianStates = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const selectFieldStyle = {
  padding: '12px 14px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  outline: 'none',
  background: '#fff',
  color: '#212121',
  fontSize: '14px',
  lineHeight: 1.4,
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ full_name: '', phone: '', address_line_1: '', city: '', state: '', pincode: '', country: 'India' });
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [addressToDelete, setAddressToDelete] = useState<{ id: string; label: string } | null>(null);
  const { addToast } = useApp();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    const s = await supabase.auth.getSession();
    const token = s?.data?.session?.access_token;
    if (!token) {
      setLoading(false);
      return;
    }
    
    const res = await fetch('/api/account/addresses', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setAddresses(data.addresses || []);
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = await supabase.auth.getSession();
    const token = s?.data?.session?.access_token;
    if (!token) return addToast('Not authenticated', 'error');

    try {
      const res = await fetch('/api/account/addresses', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
        body: JSON.stringify(form) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add address');
      
      setAddresses((prev) => [...prev, data.address]);
      setForm({ full_name: '', phone: '', address_line_1: '', city: '', state: '', pincode: '', country: 'India' });
      setIsAdding(false);
      addToast('Address added successfully', 'success');
    } catch(err: any) {
      addToast(err.message, 'error');
    }
  };

  const startEdit = (address: any) => {
    setEditingId(address.id);
    setEditForm({ ...address });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = await supabase.auth.getSession();
    const token = s?.data?.session?.access_token;
    if (!token) return addToast('Not authenticated', 'error');
    try {
      const res = await fetch(`/api/account/addresses/${editingId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(editForm) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update address');
      setAddresses((prev) => prev.map((a) => (a.id === data.address.id ? data.address : a)));
      setEditingId(null);
      setEditForm(null);
      addToast('Address updated', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const s = await supabase.auth.getSession();
    const token = s?.data?.session?.access_token;
    if (!token) return addToast('Not authenticated', 'error');
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete');
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      setAddressToDelete(null);
      addToast('Address deleted', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div>
        <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ width: 180, height: 22, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease infinite' }} />
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ height: 56, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease infinite', marginBottom: 24 }} />

          {[1, 2, 3].map((item) => (
            <div key={item} style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '18px 16px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 120, height: 16, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease infinite' }} />
                    <div style={{ width: 100, height: 16, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease infinite' }} />
                  </div>
                  <div style={{ width: '70%', height: 16, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease infinite' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <div style={{ width: 44, height: 16, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease infinite' }} />
                  <div style={{ width: 52, height: 16, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease infinite' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0, color: 'var(--dark-text)' }}>Manage Addresses</h2>
      </div>

      <div style={{ padding: '24px' }}>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', width: '100%', background: '#fff', color: 'var(--accent)', fontWeight: 500, cursor: 'pointer', marginBottom: '24px', transition: 'all 0.2s' }}
          >
            <AddIcon fontSize="small" /> ADD A NEW ADDRESS
          </button>
        )}

        {isAdding && (
          <div style={{ backgroundColor: '#f9f9f9', padding: '24px', border: '1px solid #e0e0e0', borderRadius: '4px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--accent)', marginBottom: '16px', marginTop: 0 }}>ADD A NEW ADDRESS</h3>
            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input 
                type="text" placeholder="Name" required 
                value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
                style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '4px', outline: 'none' }}
              />
              <input 
                type="tel" placeholder="10-digit mobile number" required 
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '4px', outline: 'none' }}
              />
              <input 
                type="text" placeholder="Pincode" required 
                value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})}
                style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '4px', outline: 'none' }}
              />
              <input 
                type="text" placeholder="Locality / Town" required 
                value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '4px', outline: 'none' }}
              />
              <input 
                type="text" placeholder="Address (Area and Street)" required 
                value={form.address_line_1} onChange={e => setForm({...form, address_line_1: e.target.value})}
                style={{ gridColumn: '1 / -1', padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '4px', outline: 'none' }}
              />
              <input 
                type="text" placeholder="City/District/Town" required 
                value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '4px', outline: 'none' }}
              />
              <select
                required
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                style={selectFieldStyle}
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '8px' }}>
                <Button type="submit" variant="primary" style={{ padding: '12px 32px' }}>SAVE</Button>
                <Button type="button" variant="text" onClick={() => setIsAdding(false)}>CANCEL</Button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {addresses.map((a, idx) => (
            <div key={a.id || idx} style={{ border: '1px solid #e0e0e0', borderRadius: '4px', padding: '16px' }}>
              {editingId === a.id ? (
                <form onSubmit={saveEdit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} style={{ padding: '10px', borderRadius: 4, border: '1px solid #e0e0e0' }} required />
                  <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} style={{ padding: '10px', borderRadius: 4, border: '1px solid #e0e0e0' }} required />
                  <input value={editForm.pincode} onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })} style={{ padding: '10px', borderRadius: 4, border: '1px solid #e0e0e0' }} required />
                  <input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} style={{ padding: '10px', borderRadius: 4, border: '1px solid #e0e0e0' }} required />
                  <input value={editForm.address_line_1} onChange={(e) => setEditForm({ ...editForm, address_line_1: e.target.value })} style={{ gridColumn: '1 / -1', padding: '10px', borderRadius: 4, border: '1px solid #e0e0e0' }} required />
                  <select
                    value={editForm.state || ''}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    style={{ ...selectFieldStyle, padding: '10px 12px' }}
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
                    <Button type="submit" variant="primary">SAVE</Button>
                    <Button type="button" variant="text" onClick={cancelEdit}>CANCEL</Button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 500, fontSize: '14px', color: 'var(--dark-text)' }}>{a.full_name}</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#878787' }}>{a.phone}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#212121', lineHeight: '1.5' }}>
                      {a.address_line_1}, {a.city}, {a.state} - <span style={{ fontWeight: 500 }}>{a.pincode}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <button onClick={() => startEdit(a)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => setAddressToDelete({ id: a.id, label: `${a.full_name} • ${a.city}, ${a.state}` })} style={{ background: 'transparent', border: 'none', color: '#fb641b', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {addressToDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }} onClick={() => setAddressToDelete(null)}>
          <div style={{ width: 'min(420px, calc(100vw - 32px))', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 16px 40px rgba(0,0,0,0.18)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#212121', marginBottom: 10 }}>Delete address?</div>
            <div style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              This will remove {addressToDelete.label} from your saved addresses.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" onClick={() => setAddressToDelete(null)} style={{ background: 'transparent', border: '1px solid #e0e0e0', color: '#212121', borderRadius: 6, padding: '10px 16px', cursor: 'pointer' }}>Cancel</button>
              <button type="button" onClick={() => handleDelete(addressToDelete.id)} style={{ background: '#fb641b', border: 'none', color: '#fff', borderRadius: 6, padding: '10px 16px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
