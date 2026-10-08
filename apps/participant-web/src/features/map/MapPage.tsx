import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { activitiesApi, ActivityFormat, type Activity } from '@gathergrid/shared';
import { Card, Button, CategoryChip, Slider, Input } from '@gathergrid/ui';
import { Compass, Search } from 'lucide-react';

export const MapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [query, setQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(25);

  useEffect(() => {
    activitiesApi.list({ format: ActivityFormat.IN_PERSON }).then((res) => {
      setActivities(res.data || []);
    });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on San Francisco
    const map = L.map(mapContainerRef.current).setView([37.7749, -122.4194], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when activities or filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const markersLayer = L.layerGroup().addTo(map);

    filtered.forEach((act) => {
      if (!act.lat || !act.lng) return;

      const marker = L.circleMarker([act.lat, act.lng], {
        radius: 10,
        fillColor: 'var(--gg-color-primary, #2563eb)',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(markersLayer);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px;">
          <strong>${act.title}</strong><br/>
          <span style="color: #6b7280;">${act.locationName}</span><br/>
          <span>${act.registeredCount} / ${act.capacity || '∞'} spots</span>
        </div>
      `);

      marker.on('click', () => {
        setSelectedActivity(act);
      });
    });

    return () => {
      map.removeLayer(markersLayer);
    };
  }, [activities]);

  const filtered = activities.filter((a) =>
    query ? a.title.toLowerCase().includes(query.toLowerCase()) : true
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
      {/* Top Floating Controls */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          maxWidth: '540px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities on map..."
            leftAddon={<Search size={16} />}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'var(--gg-color-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Compass size={14} /> Radius: <strong>{radiusKm} km</strong>
          </span>
          <div style={{ width: '140px' }}>
            <Slider value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} min={1} max={100} />
          </div>
        </div>
      </div>

      {/* Leaflet Map DOM Node */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Selected Activity Floating Card */}
      {selectedActivity && (
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '90%',
            maxWidth: '420px',
          }}
        >
          <Card variant="flat" padding="md">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <CategoryChip slug={selectedActivity.categorySlug} label={selectedActivity.categoryLabel} />
                <h4 style={{ margin: '0.5rem 0 0.25rem' }}>{selectedActivity.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--gg-color-muted)', margin: 0 }}>
                  {selectedActivity.locationName}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedActivity(null)}>
                ✕
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>
                {selectedActivity.registeredCount} / {selectedActivity.capacity || '∞'} spots filled
              </span>
              <Button size="sm" variant="primary" onClick={() => navigate(`/activities/${selectedActivity.id}`)}>
                View Details
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
