import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService, createInitialTripData } from '../../services/firestore';
import { useAuth, ROLES } from '../security/AuthContext';
import { Plus, Trash2, Calendar, MapPin, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function TripDashboard() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const { role } = useAuth();
    const navigate = useNavigate();
    // ... (omitted lines)
    const handleCreateTrip = async () => {
        const title = prompt("請輸入新行程名稱：", "宜蘭三天兩夜遊");
        if (!title) return;

        try {
            const newTrip = createInitialTripData({ title });
            const id = await tripService.saveTrip(null, newTrip);
            toast.success("行程建立成功");
            navigate(`/trip/${id}`);
        } catch (error) {
            toast.error("建立行程失敗：" + error.message);
        }
    };

    const handleDeleteTrip = async (e, id) => {
        e.stopPropagation(); // Prevent clicking card
        if (!confirm("確定要刪除此行程嗎？此動作無法復原。")) return;

        try {
            await tripService.deleteTrip(id);
            setTrips(trips.filter(t => t.id !== id));
            toast.success("行程已刪除");
        } catch (error) {
            toast.error("刪除失敗：" + error.message);
        }
    };

    const isAdmin = role === ROLES.ADMIN;

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem' }}>
                <Loader className="animate-spin text-primary" size={40} />
                <p className="text-muted">載入行程中...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>我的行程</h1>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={handleCreateTrip}>
                        <Plus size={20} /> 新增行程
                    </button>
                )}
            </div>

            <div className="trips-grid">
                {trips.length === 0 ? (
                    <div className="empty-state">
                        <p>目前沒有任何行程。</p>
                        {isAdmin && <button className="btn btn-secondary" onClick={handleCreateTrip}>立即建立第一個行程</button>}
                    </div>
                ) : (
                    trips.map(trip => (
                        <div
                            key={trip.id}
                            className="trip-card glass-panel"
                            onClick={() => navigate(`/trip/${trip.id}`)}
                        >
                            <div className="card-image">
                                <div className="placeholder-art">
                                    <MapPin size={48} color="white" opacity={0.5} />
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>{trip.title}</h3>
                                <div className="card-meta">
                                    <span><Calendar size={14} /> {new Date(trip.startDate?.seconds * 1000).toLocaleDateString()}</span>
                                    {trip.status === 'done' && <span className="badge done">已結束</span>}
                                    {trip.status === 'planning' && <span className="badge planning">規劃中</span>}
                                </div>
                            </div>

                            {isAdmin && (
                                <button
                                    className="delete-btn"
                                    onClick={(e) => handleDeleteTrip(e, trip.id)}
                                    title="刪除行程"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .dashboard-container {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .dashboard-header h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .trips-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                .trip-card {
                    cursor: pointer;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                    padding: 0; /* Override default glass-panel padding if needed, but we used inner divs */
                    border-radius: var(--radius-lg);
                }
                .trip-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-xl);
                }
                .card-image {
                    height: 140px;
                    background: linear-gradient(135deg, #64748b, #475569);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card-content {
                    padding: 1.5rem;
                }
                .card-content h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.25rem;
                }
                .card-meta {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    align-items: center;
                }
                .badge {
                    padding: 2px 8px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: bold;
                }
                .badge.planning { background: #e0f2fe; color: #0284c7; }
                .badge.done { background: #f1f5f9; color: #64748b; }

                .delete-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    cursor: pointer;
                    backdrop-filter: blur(4px);
                    opacity: 0;
                    transition: opacity 0.2s, background 0.2s;
                }
                .trip-card:hover .delete-btn {
                    opacity: 1;
                }
                .delete-btn:hover {
                    background: #ef4444;
                }

                .empty-state {
                    grid-column: 1 / -1;
                    padding: 4rem;
                    text-align: center;
                    background: rgba(255,255,255,0.5);
                    border-radius: var(--radius-xl);
                    color: var(--color-text-muted);
                }
                .flex-center {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
}
