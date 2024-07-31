import classnames from "classnames";

import styles from "./OfferPopupContent.module.css";

const OfferPopupContent = ({ className, offer }) => {

  return (
    <div className={ classnames(className, styles.OfferPopupContent) }>
      <div className={styles.previewImage}>
        <img src={offer.image} />
      </div>
      <p className={styles.offerValue}>${offer.cash_back} back</p>
      <p className={styles.title}>{offer.name}</p>
      <p className={styles.description}>{offer.details}</p>
    </div>
  )
}

export default OfferPopupContent