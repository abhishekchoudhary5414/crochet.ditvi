"use client";

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import Button from '@/components/Button/Button';
import { useApp } from '@/context/AppContext';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { addToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function load() {
      const s = await supabase.auth.getSession();
      const user = s?.data?.session?.user;
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (data) setProfile(data);
      else setProfile({ email: user.email });
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = await supabase.auth.getSession();
    const user = s?.data?.session?.user;
    if (!user) return;

    try {
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      const { error } = await supabase.from('profiles').upsert({
        user_id: user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: fullName || profile.full_name,
        phone: profile.phone,
        email: profile.email
      });
      if (error) throw error;
      
      addToast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (err: any) {
      addToast(err.message || 'Error updating profile', 'error');
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading profile...</div>;

  return (
    <div>
      <div style={{ padding: 24, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0, color: 'var(--dark-text)' }}>Personal Information</h2>
        {!isEditing && <Button variant="text" onClick={() => setIsEditing(true)}>Edit</Button>}
      </div>

      <div style={{ padding: 32, maxWidth: 600 }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, color: '#878787', marginBottom: 8, fontWeight: 500 }}>First Name</label>
              <input 
                type="text" 
                value={profile.first_name || ''} 
                onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                disabled={!isEditing}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 4, border: '1px solid #e0e0e0', backgroundColor: isEditing ? '#fff' : '#fafafa', outline: 'none', color: isEditing ? '#212121' : '#878787' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, color: '#878787', marginBottom: 8, fontWeight: 500 }}>Last Name</label>
              <input 
                type="text" 
                value={profile.last_name || ''} 
                onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                disabled={!isEditing}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 4, border: '1px solid #e0e0e0', backgroundColor: isEditing ? '#fff' : '#fafafa', outline: 'none', color: isEditing ? '#212121' : '#878787' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#878787', marginBottom: 8, fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              value={profile.email || ''} 
              disabled={true} 
              style={{ width: '100%', padding: '12px 14px', borderRadius: 4, border: '1px solid #e0e0e0', backgroundColor: '#fafafa', outline: 'none', color: '#878787' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#878787', marginBottom: 8, fontWeight: 500 }}>Mobile Number</label>
            <input 
              type="tel" 
              value={profile.phone || ''} 
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              disabled={!isEditing}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 4, border: '1px solid #e0e0e0', backgroundColor: isEditing ? '#fff' : '#fafafa', outline: 'none', color: isEditing ? '#212121' : '#878787' }}
            />
          </div>

          {isEditing && (
            <div style={{ marginTop: 16 }}>
              <Button type="submit" variant="primary" style={{ padding: '12px 40px', fontSize: 14 }}>SAVE</Button>
              <Button type="button" variant="text" onClick={() => setIsEditing(false)} style={{ marginLeft: 16 }}>CANCEL</Button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
