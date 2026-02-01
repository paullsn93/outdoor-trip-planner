// eslint-disable-next-line no-unused-vars
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
import { useParams } from 'react-router-dom';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function ItineraryManager() {
    const { tripId: routeTripId } = useParams();
    const { setCurrentTrip } = useTrip();
    const [days, setDays] = useState([]);
    const [tripMetadata, setTripMetadata] = useState(null); // Store full trip data
    const [tripId, setTripId] = useState(routeTripId);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (!routeTripId) return;

        async function loadTrip() {
            setLoading(true);
            setErrorMsg(null);
            try {
                const trip = await tripService.getTripById(routeTripId);

                if (trip) {
                    console.log("Loaded Trip:", trip);
                    setTripId(trip.id);
                    setTripMetadata(trip);
                    setCurrentTrip(trip);

                    if (trip.itinerary && trip.itinerary.length > 0) {
                        setDays(trip.itinerary);
                    } else if (trip.days && trip.days.length > 0) {
                        setDays(trip.days);
                    } else {
                        setDays([]);
                    }
                } else {
                    setErrorMsg("找不到此行程 (ID: " + routeTripId + ")");
                }
            } catch (err) {
                console.error(err);
                setErrorMsg("讀取行程失敗: " + err.message);
            }
            setLoading(false);
        }
        loadTrip();
    }, [routeTripId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const tripData = {
                itinerary: days,
                lastUpdated: new Date()
            };

            let dataToSave = tripData;
            if (!tripId && tripMetadata) {
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

    if (loading) {
        return <div className="p-4 text-center"><Loader className="animate-spin inline-block mr-2" /> 載入行程中...</div>;
    }

    if (errorMsg) {
        return <div className="p-4 text-center text-red-500 bg-red-50 rounded m-4">{errorMsg}</div>;
    }

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
