import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { ParticipantOnly } from '../security/FieldGuard';
import { ItineraryManager } from '../itinerary/ItineraryManager';
import { GearListManager } from '../features/gear/GearListManager';
import { Wallet, ShieldAlert } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useTrip } from '../../context/TripContext';

export function TripEditorPage() {
    const { tripId } = useParams();
    // const navigate = useNavigate(); // Unused for now
    const { currentTrip } = useTrip();

    useEffect(() => {
        // Clear previous trip data when entering or switching trips
    }, [tripId]);

    return (
        <AppLayout>
            <Toaster position="top-center" />
            <div className="trip-content">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {currentTrip?.title || '載入中...'}
                </h1>

                <ParticipantOnly>
                    <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--color-warning)' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldAlert size={20} /> 重要隱私資訊
                        </h2>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Wallet size={16} /> 預算：每人 $3,500 (含保險)
                            </div>
                            <div>保險單號：富邦產險 0500字第1234567號</div>
                            <div>緊急聯絡人：陳小明 0912-345-678</div>
                        </div>
                        <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-danger)' }}>
                            * 此區塊僅對參加者與管理員可見 (Viewer 無法查看)
                        </p>
                    </div>
                </ParticipantOnly>

                {/* Dynamic Itinerary Section */}
                <ItineraryManager />

                {/* Gear List Section */}
                <div style={{ marginTop: '2rem' }}>
                    <GearListManager />
                </div>

            </div>
        </AppLayout>
    );
}
