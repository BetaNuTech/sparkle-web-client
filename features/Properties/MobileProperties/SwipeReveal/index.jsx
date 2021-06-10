import styles from './SwipeReveal.module.scss';

export const SwipeReveal = (props) => (
  <div className={styles.swipeReveal}>
    <button className={styles.swipeReveal__editButton}>Edit</button>

    <button className={styles.swipeReveal__deleteButton} onClick={props.onDelete}>Delete</button>
  </div>
);
