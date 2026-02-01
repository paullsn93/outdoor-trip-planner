import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableDayCard } from './SortableDayCard';
import { Plus, Save, Loader } from 'lucide-react';
import { tripService, createInitialTripData } from '../../services/firestore';
import { toast } from 'react-hot-toast';
import { useTrip } from '../../context/TripContext';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function ItineraryManager() {
    const { updateTripData, setCurrentTrip } = useTrip();
    const [days, setDays] = useState([]);
    const [tripMetadata, setTripMetadata] = useState(null); // Store full trip data
    const [tripId, setTripId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        async function loadTrip() {
            setLoading(true);
            setErrorMsg(null);
            try {
                const trips = await tripService.getAllTrips();
                // Sort by lastUpdated desc to get the latest work
                const sortedTrips = trips.sort((a, b) => {
                    const dateA = a.lastUpdated?.seconds || 0;
                    const dateB = b.lastUpdated?.seconds || 0;
                    return dateB - dateA;
                });

                if (sortedTrips.length > 0) {
                    const latestTrip = sortedTrips[0];
                    console.log("Loaded Trip:", latestTrip);
                    setTripId(latestTrip.id);
                    setTripMetadata(latestTrip);
                    setCurrentTrip(latestTrip);

                    if (latestTrip.itinerary && latestTrip.itinerary.length > 0) {
                        setDays(latestTrip.itinerary);
                    } else if (latestTrip.days && latestTrip.days.length > 0) {
                        setDays(latestTrip.days);
                    }
                } else {
                    // Initialize with schema-compliant data
                    const initialData = createInitialTripData({
                        title: '太平山翠峰湖三日遊',
                        itinerary: [
                            { id: '1', title: 'Day 1: 出發', content: '08:00 台北出發', status: 'done' },
                            { id: '2', title: 'Day 2: 登山', content: '05:00 起床', status: 'active' },
                        ]
                    });
                    setTripMetadata(initialData);
                    setDays(initialData.itinerary);
                }
            } catch (err) {
                console.error(err);
                setErrorMsg("讀取行程失敗: " + err.message);
                // Fallback to offline mode
                const initialData = createInitialTripData({
                    title: '太平山翠峰湖三日遊 (離線/錯誤)',
                    itinerary: [
                        { id: '1', title: 'Day 1: 出發', content: '08:00 台北出發', status: 'done' },
                        { id: '2', title: 'Day 2: 登山', content: '05:00 起床', status: 'active' },
                    ]
                });
                setTripMetadata(initialData);
                setDays(initialData.itinerary);
            }
            setLoading(false);
        }
        loadTrip();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Only update fields managed by this component to avoid overwriting GearList
            const tripData = {
                itinerary: days,
                lastUpdated: new Date()
            };

            // If we have title/status in metadata, distinctively we shouldn't overwrite them 
            // unless we have UI to edit them here. 
            // Currently ItineraryManager doesn't edit title/status of the TRIP, only days.
            // So this is safe. 
            // Wait, if it's a new trip (tripId null), we DO need full metadata.

            let dataToSave = tripData;

            if (!tripId && tripMetadata) {
                // New trip: need full data
                dataToSave = { ...tripMetadata, ...tripData };
            }

            const id = await tripService.saveTrip(tripId, dataToSave);
            setTripId(id);
            setCurrentTrip({ ...dataToSave, id }); // Sync context
            toast.success('行程已儲存至雲端！');
        } catch (error) {
            toast.error('儲存失敗：' + error.message);
        }
        setSaving(false);
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setDays((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const addDay = () => {
        setDays([...days, { id: generateId(), title: '', content: '', status: 'todo' }]);
    };

    const removeDay = (id) => {
        if (confirm('確定要刪除此天行程嗎？')) {
            setDays(days.filter(d => d.id !== id));
        }
    };

    const duplicateDay = (id) => {
        const original = days.find(d => d.id === id);
        if (original) {
            const newDay = { ...original, id: generateId(), title: `${original.title} (複製)`, status: 'todo' };
            const index = days.findIndex(d => d.id === id);
            const newDays = [...days];
            newDays.splice(index + 1, 0, newDay);
            setDays(newDays);
        }
    };

    const handleStatusChange = (id, status) => {
        setDays(days.map(d => d.id === id ? { ...d, status } : d));
    };

    const handleUpdateDay = (id, field, value) => {
        setDays(days.map(d => d.id === id ? { ...d, [field]: value } : d));
    };

    return (
        <div className="itinerary-manager">
            <div className="manager-header flex-col" style={{ marginBottom: '1rem' }}>
                <div className="flex-row justify-between items-center">
                    <h2>行程規劃 ({days.length} 天)</h2>
                    <div className="flex-row gap-2">
                        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                            {saving ? '儲存中...' : '儲存行程'}
                        </button>
                        <button className="btn btn-primary" onClick={addDay}>
                            <Plus size={18} /> 新增天數
                        </button>
                    </div>
                </div>
                {errorMsg && (
                    <div style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                    }}>
                        ⚠️ {errorMsg}
                    </div>
                )}
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={days.map(d => d.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {days.map((day, index) => (
                        <SortableDayCard
                            key={day.id}
                            day={day}
                            index={index}
                            onDelete={removeDay}
                            onDuplicate={duplicateDay}
                            onStatusChange={handleStatusChange}
                            onUpdate={handleUpdateDay}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}
