// src/components/account/UserStats/UserStats.jsx
import React, { useEffect, useState } from 'react';
import { userService } from '../../../services';
import styles from './UserStats.module.css';

const UserStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const userStats = await userService.getUserStats();
        setStats(userStats.data);
      } catch (err) {
        setError('Failed to load user statistics');
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) return <div className={styles.loading}>Loading stats...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.userStats}>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statTitle}>Total Orders</h3>
          <p className={styles.statValue}>{stats.totalOrders}</p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statTitle}>Total Spent</h3>
          <p className={styles.statValue}>${stats.totalSpent.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statTitle}>Average Order</h3>
          <p className={styles.statValue}>${stats.averageOrderValue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default UserStats;