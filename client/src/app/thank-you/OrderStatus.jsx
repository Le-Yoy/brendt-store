import styles from './OrderStatus.module.css';

const OrderStatus = ({ order }) => {
  if (!order) return null;
  
  // Determine current status
  const isPaid = order.isPaid || order.paymentStatus === 'paid';
  const isProcessing = isPaid && !order.isShipped;
  const isShipped = order.isShipped && !order.isDelivered;
  const isDelivered = order.isDelivered;
  
  // Get formatted dates if available
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  const paidDate = formatDate(order.paidAt);
  const shippedDate = formatDate(order.shippedAt);
  const deliveredDate = formatDate(order.deliveredAt);
  
  return (
    <div className={styles.orderStatus}>
      <h2>Statut de votre commande</h2>
      
      <div className={styles.statusTimeline}>
        <div className={`${styles.statusStep} ${styles.active}`}>
          <div className={styles.statusIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"></path>
              <path d="M2 10h20"></path>
            </svg>
          </div>
          <div className={styles.statusContent}>
            <h3>Commande confirmée</h3>
            <p>Votre commande a été reçue et confirmée</p>
            <p className={styles.statusDate}>{formatDate(order.createdAt) || 'Aujourd\'hui'}</p>
          </div>
        </div>
        
        <div className={`${styles.statusStep} ${isPaid ? styles.active : styles.inactive}`}>
          <div className={styles.statusIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <div className={styles.statusContent}>
            <h3>Paiement {isPaid ? 'accepté' : 'en attente'}</h3>
            <p>{isPaid ? 'Votre paiement a été traité avec succès' : 'Nous attendons la confirmation de votre paiement'}</p>
            {paidDate && <p className={styles.statusDate}>{paidDate}</p>}
          </div>
        </div>
        
        <div className={`${styles.statusStep} ${isProcessing || isShipped || isDelivered ? styles.active : styles.inactive}`}>
          <div className={styles.statusIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
          <div className={styles.statusContent}>
            <h3>En préparation</h3>
            <p>{isProcessing || isShipped || isDelivered ? 'Votre commande est en cours de préparation' : 'Votre commande sera bientôt préparée'}</p>
          </div>
        </div>
        
        <div className={`${styles.statusStep} ${isShipped || isDelivered ? styles.active : styles.inactive}`}>
          <div className={styles.statusIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <div className={styles.statusContent}>
            <h3>Expédié</h3>
            <p>{isShipped || isDelivered ? 'Votre commande a été expédiée' : 'Votre commande sera bientôt expédiée'}</p>
            {shippedDate && <p className={styles.statusDate}>{shippedDate}</p>}
          </div>
        </div>
        
        <div className={`${styles.statusStep} ${isDelivered ? styles.active : styles.inactive}`}>
          <div className={styles.statusIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className={styles.statusContent}>
            <h3>Livré</h3>
            <p>{isDelivered ? 'Votre commande a été livrée avec succès' : 'Votre commande sera bientôt livrée'}</p>
            {deliveredDate && <p className={styles.statusDate}>{deliveredDate}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;