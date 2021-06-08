import styles from './SwipeReveal.module.scss';

export const SwipeReveal = () => (
  <div className={styles.swipeReveal}>
    <button className={styles.swipeReveal__editButton}>Edit</button>

    <button className={styles.swipeReveal__deleteButton}>Delete</button>
  </div>
);
