import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { ParticipantOnly } from '../security/FieldGuard';
import { ItineraryManager } from '../itinerary/ItineraryManager';
import { GearListManager } from '../features/gear/GearListManager';
import { Wallet, ShieldAlert, ChevronLeft, Loader } from 'lucide-react';
import { tripService } from '../../services/firestore';

import { toast } from 'react-hot-toast';

export function TripDetailPage() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [tripMetadata, setTripMetadata] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMeta() {
            if (!tripId) return;
            try {
                const data = await tripService.getTripById(tripId);
                if (data) {
                    setTripMetadata(data);
                } else {
                    toast.error("找不到此行程");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error loading trip meta:", error);
            }
            setLoading(false);
        }
        loadMeta();
    }, [tripId, navigate]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <AppLayout>
            <div className="trip-content">
                <div className="page-header" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)' }}
                    >
                        <ChevronLeft size={20} /> 返回列表
                    </button>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {tripMetadata?.title || '未命名行程'}
                    </h1>
                </div>

                <ParticipantOnly>
                    <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--color-warning)' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldAlert size={20} /> 重要隱私資訊
                        </h2>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Wallet size={16} /> 預算：請參閱群組公告
                            </div>
                            <div>此區塊可於未來擴充為動態欄位。</div>
                        </div>
                        <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-danger)' }}>
                            * 此區塊僅對參加者與管理員可見 (Viewer 無法查看)
                        </p>
                    </div>
                </ParticipantOnly>

                {/* Dynamic Itinerary Section */}
                {/* Pass tripId to managers so they fetch/save correctly */}
                <ItineraryManager tripId={tripId} initialData={tripMetadata} />

                {/* Gear List Section */}
                <div style={{ marginTop: '2rem' }}>
                    <GearListManager tripId={tripId} />
                </div>

            </div>
        </AppLayout>
    );
}
