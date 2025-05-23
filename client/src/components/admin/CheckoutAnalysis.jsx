'use client';

import React, { useState, useEffect } from 'react';
import styles from './CheckoutAnalysis.module.css';
import adminService from '@/services/adminService';
import { useNotification } from '@/contexts/NotificationContext';

const CheckoutAnalysis = () => {
  const [analysisData, setAnalysisData] = useState({
    conversionRate: 0,
    averageCompletionTime: 0,
    abandonmentPoints: [],
    paymentMethodDistribution: [],
    deviceBreakdown: []
  });
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        const response = await adminService.getCheckoutAnalytics(timeframe);
        setAnalysisData(response.data || {});
      } catch (error) {
        console.error('Error fetching checkout analytics:', error);
        showError('Erreur lors du chargement des données d\'analyse de checkout', {
          title: 'Erreur de données'
        });
        
        // Set mock data for development
        setAnalysisData({
          conversionRate: 42.8,
          conversionRateTrend: 3.2,
          averageCompletionTime: 165,
          completionTimeTrend: -12,
          abandonmentPoints: [
            { step: 'personal_info', count: 35, label: 'Informations personnelles' },
            { step: 'shipping_address', count: 56, label: 'Adresse de livraison' },
            { step: 'payment_method', count: 128, label: 'Méthode de paiement' },
            { step: 'review_order', count: 23, label: 'Récapitulatif' }
          ],
          paymentMethodDistribution: [
            { method: 'card', count: 238, label: 'Carte bancaire' },
            { method: 'cash', count: 107, label: 'Paiement à la livraison' },
            { method: 'transfer', count: 42, label: 'Virement bancaire' }
          ],
          deviceBreakdown: [
            { device: 'mobile', count: 284, label: 'Mobile' },
            { device: 'desktop', count: 103, label: 'Desktop' },
            { device: 'tablet', count: 41, label: 'Tablette' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [timeframe, showError]);

  // Format time in seconds to minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // Bar chart component for visualization
  const BarChart = ({ data, maxHeight = 200 }) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(item => item.count));
    
    return (
      <div className={styles.barChart}>
        {data.map((item, index) => (
          <div key={index} className={styles.barItem}>
            <div className={styles.barLabel}>{item.label}</div>
            <div className={styles.barContainer}>
              <div 
                className={styles.bar}
                style={{ 
                  height: `${(item.count / maxValue) * maxHeight}px` 
                }}
              />
              <div className={styles.barValue}>{item.count}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Pie chart component for visualization
  const PieChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let cumulativePercentage = 0;
    
    return (
      <div className={styles.pieChartContainer}>
        <div className={styles.pieChart}>
          {data.map((item, index) => {
            const percentage = (item.count / total) * 100;
            const startPercentage = cumulativePercentage;
            cumulativePercentage += percentage;
            
            return (
              <div
                key={index}
                className={styles.pieSegment}
                style={{
                  backgroundColor: getColorForIndex(index),
                  clipPath: `polygon(50% 50%, ${getCoordinatesForPercent(startPercentage)}, ${getCoordinatesForPercent(cumulativePercentage)}, 50% 50%)`
                }}
              />
            );
          })}
        </div>
        
        <div className={styles.pieLegend}>
          {data.map((item, index) => (
            <div key={index} className={styles.legendItem}>
              <div 
                className={styles.legendColor} 
                style={{ backgroundColor: getColorForIndex(index) }}
              />
              <div className={styles.legendLabel}>{item.label}</div>
              <div className={styles.legendValue}>
                {Math.round((item.count / total) * 100)}% ({item.count})
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to get pie chart segment coordinates
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * (percent / 100)) * 50 + 50;
    const y = Math.sin(2 * Math.PI * (percent / 100)) * 50 + 50;
    return `${x}% ${y}%`;
  };

  // Helper function to get color for chart segments
  const getColorForIndex = (index) => {
    const colors = [
      '#60a5fa', // Blue
      '#f87171', // Red
      '#34d399', // Green
      '#fbbf24', // Yellow
      '#a78bfa', // Purple
      '#f472b6'  // Pink
    ];
    
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.analysisContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Analyse du processus de commande</h2>
        
        <div className={styles.timeframeSelector}>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className={styles.select}
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>
        </div>
      </div>

      {/* Key metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricTitle}>Taux de conversion</h3>
            {analysisData.conversionRateTrend && (
              <div className={`${styles.trend} ${analysisData.conversionRateTrend > 0 ? styles.positive : styles.negative}`}>
                {analysisData.conversionRateTrend > 0 ? '+' : ''}{analysisData.conversionRateTrend.toFixed(1)}%
              </div>
            )}
          </div>
          <div className={styles.metricValue}>{analysisData.conversionRate?.toFixed(1)}%</div>
          <div className={styles.metricDescription}>
            Pourcentage de visiteurs qui finalisent leur commande
          </div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricTitle}>Temps moyen</h3>
            {analysisData.completionTimeTrend && (
              <div className={`${styles.trend} ${analysisData.completionTimeTrend < 0 ? styles.positive : styles.negative}`}>
                {analysisData.completionTimeTrend > 0 ? '+' : ''}{analysisData.completionTimeTrend}s
              </div>
            )}
          </div>
          <div className={styles.metricValue}>{formatTime(analysisData.averageCompletionTime)}</div>
          <div className={styles.metricDescription}>
            Durée moyenne pour compléter une commande
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className={styles.chartsGrid}>
        {/* Abandonment points */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Points d'abandon</h3>
          <div className={styles.chartDescription}>
            Étapes où les clients abandonnent le processus de commande
          </div>
          <div className={styles.chartContainer}>
            <BarChart data={analysisData.abandonmentPoints} />
          </div>
        </div>
        
        {/* Payment methods */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Méthodes de paiement</h3>
          <div className={styles.chartDescription}>
            Distribution des méthodes de paiement utilisées
          </div>
          <div className={styles.chartContainer}>
            <PieChart data={analysisData.paymentMethodDistribution} />
          </div>
        </div>
        
        {/* Device breakdown */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Appareils utilisés</h3>
          <div className={styles.chartDescription}>
            Répartition des commandes par type d'appareil
          </div>
          <div className={styles.chartContainer}>
            <PieChart data={analysisData.deviceBreakdown} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutAnalysis;