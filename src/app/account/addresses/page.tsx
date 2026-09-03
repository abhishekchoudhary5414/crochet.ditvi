"use client";

import React, { useCallback, useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import Button from '@/components/Button/Button';
import { useApp } from '@/context/AppContext';
import AddIcon from '@mui/icons-material/Add';
import styles from './addresses.module.css';

const indianStates = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

type AddressForm = {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

type AddressRecord = AddressForm & { id?: string };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [form, setForm] = useState<AddressForm>({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AddressForm | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<{ id: string; label: string } | null>(null);
  const { addToast } = useApp();

  const fetchAddresses = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAddresses();
  }, [fetchAddresses]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const s = await supabase.auth.getSession();
    const token = s?.data?.session?.access_token;
    if (!token) return addToast('Not authenticated', 'error');

    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add address');

      setAddresses((prev) => [...prev, data.address]);
      setForm({
        full_name: '',
        phone: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
      });
      setIsAdding(false);
      addToast('Address added successfully', 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add address';
      addToast(message, 'error');
    }
  };

  const startEdit = (address: AddressRecord) => {
    if (!address.id) return;

    setEditingId(address.id);
    setEditForm({
      full_name: address.full_name ?? '',
      phone: address.phone ?? '',
      address_line_1: address.address_line_1 ?? '',
      address_line_2: address.address_line_2 ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      pincode: address.pincode ?? '',
      country: address.country ?? 'India',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const s = await supabase.auth.getSession();
    const token = s?.data?.session?.access_token;
    if (!token) return addToast('Not authenticated', 'error');
    if (!editingId || !editForm) return;

    try {
      const res = await fetch(`/api/account/addresses/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update address');
      setAddresses((prev) => prev.map((a) => (a.id === data.address.id ? data.address : a)));
      setEditingId(null);
      setEditForm(null);
      addToast('Address updated', 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update address';
      addToast(message, 'error');
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete address';
      addToast(message, 'error');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div className={styles.skeletonHeader} />
        </div>

        <div className={styles.content}>
          <div className={styles.skeletonButton} />

          {[1, 2, 3].map((item) => (
            <div key={item} className={styles.skeletonCard}>
              <div className={styles.skeletonCardRow}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonChip} />
                  </div>
                  <div className={styles.skeletonLongLine} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <div className={styles.skeletonLine} style={{ width: 44 }} />
                  <div className={styles.skeletonLine} style={{ width: 52 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Manage Addresses</h2>
      </div>

      <div className={styles.content}>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className={styles.addButton}
          >
            <AddIcon fontSize="small" /> ADD A NEW ADDRESS
          </button>
        )}

        {isAdding && (
          <div className={styles.formCard}>
            <h3 className={styles.sectionTitle}>Add a new address</h3>
            <form onSubmit={handleAdd} className={styles.formGrid}>
              <input
                type="text"
                placeholder="Name"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className={styles.field}
              />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={styles.field}
              />
                 <input
                type="text"
                placeholder="Flat No. / Building Name"
                value={form.address_line_2 || ''}
                onChange={(e) => setForm({ ...form, address_line_2: e.target.value })}
                className={styles.field}
              />
              <input
                type="text"
                placeholder="City"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={styles.field}
              />
        
              <input
                type="text"
                placeholder="Address (Area and Street)"
                required
                value={form.address_line_1}
                onChange={(e) => setForm({ ...form, address_line_1: e.target.value })}
                className={`${styles.field} ${styles.fieldWide}`}
              />
              <select
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className={styles.selectField}
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

                 <input
                type="text"
                placeholder="Pincode"
                required
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className={styles.field}
              />

              <div className={styles.formActions}>
                <Button type="submit" variant="primary" className={styles.primaryButton}>SAVE</Button>
                <Button type="button" variant="text" className={styles.textButton} onClick={() => setIsAdding(false)}>CANCEL</Button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.addressList}>
          {addresses.map((a, idx) => (
            <div key={a.id || idx} className={styles.addressCard}>
              {editingId === a.id && editForm ? (
                <form onSubmit={saveEdit} className={styles.editForm}>
                  <input
                    value={editForm.full_name}
                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, full_name: e.target.value } : prev))}
                    className={styles.field}
                    required
                  />
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, phone: e.target.value } : prev))}
                    className={styles.field}
                    required
                  />
                  <input
                    value={editForm.pincode}
                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, pincode: e.target.value } : prev))}
                    className={styles.field}
                    required
                  />
                  <input
                    value={editForm.city}
                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, city: e.target.value } : prev))}
                    className={styles.field}
                    required
                  />
                  <input
                    value={editForm.address_line_2 || ''}
                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, address_line_2: e.target.value } : prev))}
                    className={styles.field}
                  />
                  <input
                    value={editForm.address_line_1}
                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, address_line_1: e.target.value } : prev))}
                    className={`${styles.field} ${styles.fieldWide}`}
                    required
                  />
                  <select
                    value={editForm.state || ''}
                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, state: e.target.value } : prev))}
                    className={styles.selectField}
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <div className={styles.editActions}>
                    <Button type="submit" variant="primary">SAVE</Button>
                    <Button type="button" variant="text" onClick={cancelEdit}>CANCEL</Button>
                  </div>
                </form>
              ) : (
                <div className={styles.addressRow}>
                  <div className={styles.addressDetails}>
                    <div className={styles.addressHeader}>
                      <span className={styles.addressName}>{a.full_name}</span>
                      <span className={styles.addressPhone}>{a.phone}</span>
                    </div>
                    <div className={styles.addressText}>
                      {a.address_line_1}, {a.city}, {a.state} - <strong>{a.pincode}</strong>
                    </div>
                  </div>

                  <div className={styles.rowActions}>
                    <button type="button" onClick={() => startEdit(a)} className={`${styles.actionLink} ${styles.editAction}`}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!a.id) return;
                        setAddressToDelete({ id: a.id, label: `${a.full_name} • ${a.city}, ${a.state}` });
                      }}
                      className={`${styles.actionLink} ${styles.deleteAction}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {addressToDelete && (
        <div className={styles.deleteModalOverlay} onClick={() => setAddressToDelete(null)}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteModalTitle}>Delete address?</div>
            <p className={styles.deleteModalText}>
              This will remove {addressToDelete.label} from your saved addresses.
            </p>
            <div className={styles.deleteModalActions}>
              <button type="button" onClick={() => setAddressToDelete(null)} className={styles.cancelButton}>Cancel</button>
              <button type="button" onClick={() => handleDelete(addressToDelete.id)} className={styles.confirmDeleteButton}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
