/* eslint-disable react/prop-types */
import React from 'react';
import { MapPin, Clock, Trash2 } from 'lucide-react';

export function EventItem({ event, onUpdate, onDelete }) {
    const handleLocationChange = (e) => {
        const val = e.target.value;
        const newLoc = { ...event.location, name: val };

        // Simple coordinate parsing: 24.5,121.5
        // Matches numbers with potential decimals, separated by comma or chinese comma
        const match = val.match(/(-?\d+\.?\d*)\s*[,，]\s*(-?\d+\.?\d*)/);
        if (match) {
            newLoc.lat = parseFloat(match[1]);
            newLoc.lng = parseFloat(match[2]);
        }

        onUpdate('location', newLoc);
    };

    return (
        <div className="event-item">
            <div className="event-time">
                <Clock size={14} className="text-muted" />
                <input
                    type="time"
                    value={event.time}
                    onChange={(e) => onUpdate('time', e.target.value)}
                    className="time-input"
                />
            </div>

            <div className="event-details">
                <div className="event-header">
                    <input
                        type="text"
                        value={event.title}
                        onChange={(e) => onUpdate('title', e.target.value)}
                        placeholder="事件標題..."
                        className="title-input"
                    />
                    <button className="delete-btn" onClick={onDelete} title="刪除事件">
                        <Trash2 size={14} />
                    </button>
                </div>

                <div className="event-location">
                    <MapPin size={14} className="text-muted" />
                    <input
                        type="text"
                        value={event.location?.name || ''}
                        onChange={handleLocationChange}
                        placeholder="地點名稱 (或輸入 'lat,lng')"
                        className="location-input"
                        title="輸入 '24.5, 121.5' 將會自動建立座標"
                    />
                </div>
            </div>

            <style>{`
                .event-item {
                    display: flex;
                    gap: 12px;
                    padding: 8px;
                    margin-bottom: 8px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 6px;
                    border: 1px solid var(--color-border);
                    align-items: flex-start;
                }
                .event-time {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    min-width: 60px;
                }
                .time-input {
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                    padding: 2px;
                    font-size: 0.85rem;
                    width: 100%;
                    text-align: center;
                }
                .event-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .event-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .title-input {
                    border: none;
                    background: transparent;
                    font-weight: 500;
                    width: 100%;
                    font-size: 0.95rem;
                }
                .title-input:focus {
                    outline: none;
                    border-bottom: 1px dashed var(--color-primary);
                }
                .event-location {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .location-input {
                    border: none;
                    background: transparent;
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    width: 100%;
                }
                .location-input:focus {
                    outline: none;
                    color: var(--color-text-main);
                }
                .delete-btn {
                    background: none;
                    border: none;
                    color: #ef4444;
                    cursor: pointer;
                    opacity: 0.5;
                    padding: 2px;
                }
                .delete-btn:hover {
                    opacity: 1;
                    background: #fee2e2;
                    border-radius: 4px;
                }
                .text-muted { color: var(--color-text-muted); }
            `}</style>
        </div>
    );
}
