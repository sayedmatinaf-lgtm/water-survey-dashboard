import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '../utils/numberFormatter';

// Fix Leaflet marker icon issues
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


// --------------------------------------------------
// Component to automatically move map when data loads
// --------------------------------------------------

function MapUpdater({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const validPoints = data.filter(
      (point) =>
        Number.isFinite(Number(point.latitude)) &&
        Number.isFinite(Number(point.longitude))
    );

    if (validPoints.length === 0) return;

    const bounds = validPoints.map((point) => [
      Number(point.latitude),
      Number(point.longitude)
    ]);

    map.fitBounds(bounds, {
      padding: [30, 30],
      maxZoom: 13
    });

  }, [data, map]);

  return null;
}


// --------------------------------------------------
// Main Map
// --------------------------------------------------

export default function SurveyMap({
  data = [],
  onSelectRecord
}) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const isFa = currentLang === 'fa';

  // Herat
  const defaultCenter = [34.345, 62.205];

  // Make sure only valid geographic points are used
  const validData = data.filter(
    (point) =>
      Number.isFinite(Number(point.latitude)) &&
      Number.isFinite(Number(point.longitude))
  );

  return (
    <div className="card">

      {/* Header */}
      <div className="card-header">
        <div>
          <h3 className="card-title">
            {isFa ? 'توزیع جغرافیایی سروی' : 'Geographic Survey Distribution'}
          </h3>
          <p className="card-subtitle">
            {isFa ? 'نقشه‌برداری فضایی نقاط آب ارزیابی‌شده' : 'Spatial mapping of assessed water points'}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <MapContainer
          center={defaultCenter}
          zoom={11}
          scrollWheelZoom={false}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 'var(--radius-md)'
          }}
        >

          {/* OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Automatically move to survey points */}
          <MapUpdater data={validData} />

          {/* Survey Points */}
          {validData.map((point) => (
            <Marker
              key={point.id || point.point_id}
              position={[
                Number(point.latitude),
                Number(point.longitude)
              ]}
            >
              <Popup>
                <div className="map-popup-content" dir={isFa ? 'rtl' : 'ltr'}>
                  <p className="map-popup-id">
                    {formatNumber(point.point_id, currentLang)}
                  </p>

                  <p className="map-popup-text">
                    <strong>{isFa ? 'ولسوالی / ناحیه:' : 'District:'}</strong>{' '}
                    {point.district || '-'}
                  </p>

                  <p className="map-popup-text">
                    <strong>{isFa ? 'محل / قریه:' : 'Locality:'}</strong>{' '}
                    {point.locality || '-'}
                  </p>

                  <p className="map-popup-text">
                    <strong>{isFa ? 'منبع آب:' : 'Water Source:'}</strong>{' '}
                    {point.water_source || '-'}
                  </p>

                  <p className="map-popup-text">
                    <strong>{isFa ? 'امنیت بهداشتی:' : 'Safety:'}</strong>{' '}
                    {point.perceived_safety || (isFa ? 'نامشخص' : 'N/A')}
                  </p>

                  <button
                    onClick={() =>
                      onSelectRecord &&
                      onSelectRecord(point)
                    }
                    className="btn btn-primary map-popup-btn"
                  >
                    {isFa ? 'مشاهده جزئیات' : 'View Details'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>

    </div>
  );
}