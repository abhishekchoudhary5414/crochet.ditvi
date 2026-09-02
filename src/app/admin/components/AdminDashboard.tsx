"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminDashboard.module.css';

const DashboardSkeleton = () => (
  <div className={styles.dashboard}>
    <header className={styles.header}>
      <div>
        <span className={styles.kicker}>Overview</span>
        <h2>Store insights</h2>
      </div>
      <div className={styles.headerMeta}>Live performance snapshot</div>
    </header>

    <div className={styles.cardsGrid}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={`${styles.metricCard} ${styles.cardSkeleton}`}>
          <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonValue}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonMedium}`} />
        </div>
      ))}
    </div>

    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={`${styles.skeletonLine} ${styles.skeletonSmall}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonTag}`} />
      </div>

      <div className={styles.chartWrap}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={styles.barGroup}>
            <div className={`${styles.skeletonLine} ${styles.skeletonBarLabel}`} />
            <div className={styles.skeletonBar}>
              <div className={`${styles.skeletonBarFill} ${styles[`skeletonColor${index + 1}`]}`} />
            </div>
            <div className={`${styles.skeletonLine} ${styles.skeletonTiny}`} />
          </div>
        ))}
      </div>
    </div>

    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, index) => (
            <tr key={index} className={styles.row}>
              <td className={styles.cell}><div className={`${styles.skeletonLine} ${styles.skeletonRowLabel}`} /></td>
              <td className={styles.cell}><div className={`${styles.skeletonLine} ${styles.skeletonRowValue}`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ orders: number; users: number; revenue: number; successfulPayments: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch('/api/admin/stats', { credentials: 'same-origin' });
        if (res.status === 401 || res.status === 403) {
          router.push('/admin/login');
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          const msg = data?.error || 'Failed to load stats';
          console.error('load stats', msg);
          if (mounted) setError(String(msg));
          return;
        }

        if (mounted) {
          setStats({
            orders: Number(data.orders ?? 0),
            users: Number(data.users ?? 0),
            revenue: Number(data.revenue ?? 0),
            successfulPayments: Number(data.successfulPayments ?? 0),
          });
        }
      } catch (e) {
        console.error('load stats', e);
        if (mounted) setError(String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) return <DashboardSkeleton />;

  const chartData = [
    { label: 'Orders', value: stats?.orders ?? 0, color: '#f7b3c8' },
    { label: 'Users', value: stats?.users ?? 0, color: '#ffd4a2' },
    { label: 'Paid', value: stats?.successfulPayments ?? 0, color: '#9fe7b5' },
  ];
  const chartMax = Math.max(1, ...chartData.map((item) => item.value));

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>Overview</span>
          <h2>Store insights</h2>
        </div>
        <div className={styles.headerMeta}>Live performance snapshot</div>
      </header>

      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <div className={styles.cardsGrid}>
            <div className={`${styles.metricCard} ${styles.cardPink}`}>
              <div className={styles.metricLabel}>Orders</div>
              <div className={styles.metricValue}>{String(stats?.orders ?? 0)}</div>
              <div className={styles.metricFoot}>Total order count</div>
            </div>

            <div className={`${styles.metricCard} ${styles.cardPeach}`}>
              <div className={styles.metricLabel}>Users</div>
              <div className={styles.metricValue}>{String(stats?.users ?? 0)}</div>
              <div className={styles.metricFoot}>Registered customers</div>
            </div>

            <div className={`${styles.metricCard} ${styles.cardMint}`}>
              <div className={styles.metricLabel}>Revenue</div>
              <div className={styles.metricValue}>₹{(stats?.revenue ?? 0).toFixed(2)}</div>
              <div className={styles.metricFoot}>Gross earnings</div>
            </div>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Performance</h3>
              <span>Current totals</span>
            </div>

            <div className={styles.chartWrap}>
              {chartData.map((item) => (
                <div key={item.label} className={styles.barGroup}>
                  <div className={styles.barLabel}>{item.label}</div>
                  <div className={styles.barStack} aria-label={`${item.label}: ${item.value}`}>
                    <div
                      className={styles.barFill}
                      style={{
                        height: `${Math.max((item.value / chartMax) * 100, item.value > 0 ? 12 : 0)}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                  <div className={styles.barValue}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.row}>
                  <td className={styles.cell}>Orders</td>
                  <td className={styles.cell}>{String(stats?.orders ?? 0)}</td>
                </tr>
                <tr className={styles.row}>
                  <td className={styles.cell}>Users</td>
                  <td className={styles.cell}>{String(stats?.users ?? 0)}</td>
                </tr>
                <tr className={styles.row}>
                  <td className={styles.cell}>Successful paid</td>
                  <td className={styles.cell}>{String(stats?.successfulPayments ?? 0)}</td>
                </tr>
                <tr className={styles.row}>
                  <td className={styles.cell}>Revenue</td>
                  <td className={styles.cell}>₹{(stats?.revenue ?? 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
