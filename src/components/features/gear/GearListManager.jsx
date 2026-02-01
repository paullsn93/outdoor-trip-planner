import React, { useState, useEffect } from 'react';
import { GEAR_TEMPLATES } from '../../../data/gearTemplates';
import { Package, Plus, Trash, CheckSquare, Save, Loader } from 'lucide-react';
import { tripService } from '../../../services/firestore';
import { toast } from 'react-hot-toast';

export function GearListManager() {
    const [gearList, setGearList] = useState([]);
    const [tripId, setTripId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadTrip() {
            setLoading(true);
            try {
                // Determine which trip to load (logic shared with ItineraryManager for now)
                const trips = await tripService.getAllTrips();
                const sortedTrips = trips.sort((a, b) => {
                    const dateA = a.lastUpdated?.seconds || 0;
                    const dateB = b.lastUpdated?.seconds || 0;
                    return dateB - dateA;
                });

                if (sortedTrips.length > 0) {
                    const latestTrip = sortedTrips[0];
                    setTripId(latestTrip.id);
                    if (latestTrip.gearList) {
                        setGearList(latestTrip.gearList);
                    }
                }
            } catch (error) {
                console.error("Failed to load gear list:", error);
            }
            setLoading(false);
        }
        loadTrip();
    }, []);

    const handleSave = async () => {
        if (!tripId) {
            toast.error('找不到行程紀錄，請先建立行程。');
            return;
        }
        setSaving(true);
        try {
            await tripService.saveTrip(tripId, {
                gearList: gearList,
                lastUpdated: new Date()
            });
            toast.success('裝備清單已儲存！');
        } catch (error) {
            toast.error('儲存失敗：' + error.message);
        }
        setSaving(false);
    };

    const importTemplate = (templateKey) => {
        const template = GEAR_TEMPLATES[templateKey];
        if (!template) return;

        // Check if categories already exist to merge or append
        // For simplicity, we just append non-existing categories
        const newGearList = [...gearList];

        template.categories.forEach(newCat => {
            const existingCat = newGearList.find(c => c.name === newCat.name);
            if (existingCat) {
                // Avoid duplicates by checking item name
                const existingItemNames = new Set(existingCat.items.map(i => i.name));
                const newItemsToAdd = newCat.items.filter(i => !existingItemNames.has(i.name));
                existingCat.items = [...existingCat.items, ...newItemsToAdd];
            } else {
                newGearList.push({ ...newCat, id: Math.random().toString(36).substr(2, 9) });
            }
        });

        setGearList(newGearList);
    };

    const toggleItem = (catIndex, itemIndex) => {
        const newList = [...gearList];
        newList[catIndex].items[itemIndex].checked = !newList[catIndex].items[itemIndex].checked;
        setGearList(newList);
    };

    const calculateProgress = () => {
        let total = 0;
        let checked = 0;
        gearList.forEach(cat => {
            cat.items.forEach(item => {
                total++;
                if (item.checked) checked++;
            });
        });
        return total === 0 ? 0 : Math.round((checked / total) * 100);
    };

    return (
        <div className="gear-manager card">
            <div className="manager-header" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="flex-row items-center gap-2">
                        <Package size={24} className="text-primary" />
                        裝備檢查表
                    </h2>
                    <button className="btn btn-secondary" onClick={handleSave} disabled={saving || !tripId}>
                        {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                        {saving ? '儲存中...' : '儲存清單'}
                    </button>
                </div>

                <div className="progress-bar-container">
                    <div className="progress-text">準備進度: {calculateProgress()}%</div>
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${calculateProgress()}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Import Actions */}
            <div className="import-actions" style={{ marginBottom: '1.5rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="text-muted" style={{ fontSize: '0.9rem', alignSelf: 'center' }}>快速匯入：</span>
                {Object.entries(GEAR_TEMPLATES).map(([key, tpl]) => (
                    <button
                        key={key}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '4px 12px' }}
                        onClick={() => importTemplate(key)}
                    >
                        + {tpl.label}
                    </button>
                ))}
            </div>

            {/* List Content */}
            <div className="gear-categories">
                {gearList.length === 0 ? (
                    <div className="empty-state">
                        <p>尚未加入任何裝備清單，請從上方匯入範本。</p>
                    </div>
                ) : (
                    gearList.map((category, catIndex) => (
                        <div key={category.id} className="gear-category" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="category-title" style={{
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                marginBottom: '0.5rem',
                                borderBottom: '1px solid var(--color-border)',
                                paddingBottom: '4px'
                            }}>
                                {category.name}
                            </h3>
                            <div className="items-grid">
                                {category.items.map((item, itemIndex) => (
                                    <label
                                        key={item.id}
                                        className={`gear-item ${item.checked ? 'checked' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => toggleItem(catIndex, itemIndex)}
                                        />
                                        <span className="item-name">{item.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
        .text-primary { color: hsl(var(--color-p-h), var(--color-p-s), var(--color-p-l)); }
        .text-muted { color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l)); }
        
        .progress-bar-container {
            margin-top: 8px;
        }
        .progress-text {
            font-size: 0.85rem;
            color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
            margin-bottom: 4px;
            text-align: right;
        }
        .progress-track {
            height: 6px;
            background: #e5e7eb;
            border-radius: 99px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: hsl(var(--color-p-h), var(--color-p-s), var(--color-p-l));
            transition: width 0.3s ease;
        }

        .items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 8px;
        }
        .gear-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .gear-item:hover {
            background: rgba(0,0,0,0.03);
        }
        .gear-item.checked .item-name {
            text-decoration: line-through;
            color: #9ca3af;
        }
        .gear-item input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: hsl(var(--color-p-h), var(--color-p-s), var(--color-p-l));
        }
        
        .empty-state {
            padding: 2rem;
            text-align: center;
            color: #9ca3af;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px dashed #d1d5db;
        }
      `}</style>
        </div>
    );
}
