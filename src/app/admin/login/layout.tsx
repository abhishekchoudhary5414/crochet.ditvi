export const runtime = 'edge';

import styles from './layout.module.css';

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  // Minimal layout for admin login: no sidebar, centered content
  return (
    <div className={styles.center}>
      {children}
    </div>
  );
}
