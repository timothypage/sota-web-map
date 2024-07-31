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
      <span className={styles.selectedOffer}><svg viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="pando-icon pando-icon__checkmark"><path d="M2.987 7.505L0 10.735 7.956 18 21 2.852 17.646 0 7.576 11.695l-4.589-4.19z" fill="var(--p-white)"></path></svg></span>
    </div>
  )
}

export default OfferPopupContent