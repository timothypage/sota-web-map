import { useSelector, useDispatch } from 'react-redux'
import { useMap } from '/src/providers/MapProvider.jsx'
import { useDirections } from '/src/providers/DirectionsProvider.jsx'
import {
  updateHomeLocation,
  selectHomeLocation
} from '/src/reducers/navigationReducer.js'

import styles from './MapPopupContent.module.css'
import { AiFillHome } from 'react-icons/ai'

const MapPopupContent = ({
  features,
  popupEvent,
  popup
}) => {
  const home = useSelector(selectHomeLocation)
  const dispatch = useDispatch()
  const map = useMap()
  const directions = useDirections()

  const featureNames = getLayerNames(features)

  return (
    <div>
      <p>
        {popupEvent.lngLat.lng} {popupEvent.lngLat.lat}
      </p>
      <h3>Layers</h3>
      <ul>
        {featureNames.map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <div className={styles.navButtons}>
        <button
          className={styles.navButton}
          onClick={() => {
            directions.setWaypoints([
              home,
              [popupEvent.lngLat.lng, popupEvent.lngLat.lat]
            ])
          }}
        >
          Navigate
        </button>
        <button
          className={styles.homeButton}
          onClick={() => {
            dispatch(
              updateHomeLocation({
                location: [popupEvent.lngLat.lng, popupEvent.lngLat.lat]
              })
            )

            popup.remove()
          }}
        >
          <AiFillHome />
        </button>
      </div>
    </div>
  )
}

const getLayerNames = features =>
  features
    .map(feature => {
      if (feature?.source === 'BLM_CO_Surface_Management_Agency') {
        return `Managed By ${feature?.properties?.adm_manage || '<unknown>'}`
      }

      if (feature?.source === 'padus_co_wilderness_areas') {
        return feature?.properties?.Loc_Nm
      }

      if (feature?.source === 'usfs_national_forests') {
        return feature?.properties?.FORESTNAME
      }

      if (feature?.source === 'cpw_public_access_properties') {
        return feature?.properties?.PropName
      }

      if (feature?.source === 'denver_mountain_parks') {
        return `Denver Mountain Park: ${feature?.properties?.FORMAL_NAME}`
      }
    })
    .filter(Boolean)

export default MapPopupContent
