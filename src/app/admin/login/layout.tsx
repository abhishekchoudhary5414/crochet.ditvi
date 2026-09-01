export const runtime = 'edge';

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  // Minimal layout for admin login: no sidebar, centered content
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {children}
    </div>
  );
}
