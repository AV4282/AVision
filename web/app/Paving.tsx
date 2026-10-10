import styles from "./paving.module.css";

/**
 * The AVision backdrop: tactile paving (the bumps at the foot of a curb ramp)
 * rolling toward you, seen through a camera frame that keeps refocusing.
 * Fills whatever positioned box it is placed in. The page behind it must be
 * the asphalt colour, because the far edge fades into it.
 */
export function Paving() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.dots} />
      <div className={styles.fade} />
      <div className={styles.viewfinder}>
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
