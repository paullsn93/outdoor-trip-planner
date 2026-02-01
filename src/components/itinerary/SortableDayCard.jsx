/* eslint-disable react/prop-types */
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { storageService } from '../../services/storage';
import { GripVertical, Trash2, Copy, Image as ImageIcon, Loader, X, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { EventItem } from './EventItem';

export function SortableDayCard({ day, onDelete, onDuplicate, onStatusChange, onUpdate, index }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: day.id });

    const [uploading, setUploading] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '1rem',
        position: 'relative'
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await storageService.uploadImage(file);
            onUpdate(day.id, 'image', result.url);
        } catch (error) {
            toast.error('上傳失敗: ' + error.message);
        }
        setUploading(false);
    };

    const handleRemoveImage = () => {
        if (confirm('確定要移除這張圖片嗎？')) {
            onUpdate(day.id, 'image', null);
        }
    };

    const handleAddEvent = () => {
        const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            time: '09:00',
            title: '',
            location: { name: '', lat: null, lng: null },
            type: 'activity' // activity, transport, meal, lodging
        };
        const currentEvents = day.events || [];
        onUpdate(day.id, 'events', [...currentEvents, newEvent]);
    };

    const handleUpdateEvent = (eventId, field, value) => {
        const currentEvents = day.events || [];
        const updatedEvents = currentEvents.map(ev =>
            ev.id === eventId ? { ...ev, [field]: value } : ev
        );
        onUpdate(day.id, 'events', updatedEvents);
    };

    const handleDeleteEvent = (eventId) => {
        if (confirm('確定要刪除此事件嗎？')) {
            const currentEvents = day.events || [];
            onUpdate(day.id, 'events', currentEvents.filter(ev => ev.id !== eventId));
        }
    };

    // Sort events by time
    const sortedEvents = (day.events || []).sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div ref={setNodeRef} style={style} className={`card day-card ${day.status || 'todo'}`}>
            <div className="day-header">
                <div className="drag-handle" {...attributes} {...listeners}>
                    <GripVertical size={20} className="text-muted" />
                </div>

                <select
                    className="status-select"
                    value={day.status || 'todo'}
                    onChange={(e) => onStatusChange(day.id, e.target.value)}
                >
                    <option value="todo">未完成</option>
                    <option value="active">進行中</option>
                    <option value="done">已完成</option>
                </select>

                <input
                    type="text"
                    value={day.title || ''}
                    onChange={(e) => onUpdate(day.id, 'title', e.target.value)}
                    className="day-title-input"
                    placeholder={`Day ${index + 1} 標題...`}
                />

                <div className="card-actions">
                    <label className="icon-btn" title="上傳圖片" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
                        {uploading ? <Loader size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            disabled={uploading}
                        />
                    </label>
                    <button className="icon-btn" onClick={() => onDuplicate(day.id)} title="複製行程">
                        <Copy size={18} />
                    </button>
                    <button className="icon-btn danger" onClick={() => onDelete(day.id)} title="刪除行程">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="day-content">
                {/* Event List Section */}
                <div className="events-list" style={{ marginBottom: '1rem' }}>
                    {sortedEvents.map(event => (
                        <EventItem
                            key={event.id}
                            event={event}
                            onUpdate={(field, value) => handleUpdateEvent(event.id, field, value)}
                            onDelete={() => handleDeleteEvent(event.id)}
                        />
                    ))}

                    <button
                        className="btn btn-secondary"
                        style={{ width: '100%', fontSize: '0.85rem', padding: '6px', marginTop: '4px' }}
                        onClick={handleAddEvent}
                    >
                        <Plus size={16} /> 新增活動事件
                    </button>
                </div>

                <textarea
                    className="content-editor"
                    value={day.content || ''}
                    onChange={(e) => onUpdate(day.id, 'content', e.target.value)}
                    placeholder="備註..."
                    rows={2}
                    style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}
                />

                {day.image && (
                    <div className="day-image-preview">
                        <img src={day.image} alt="Trip memory" />
                        <button className="remove-image-btn" onClick={handleRemoveImage} title="移除圖片">
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        .day-card {
          border-left: 4px solid hsl(var(--color-p-h), var(--color-p-s), var(--color-p-l));
          background: hsl(var(--color-surface-h), var(--color-surface-s), var(--color-surface-l));
        }
        .day-card.active { border-left-color: var(--color-warning); }
        .day-card.done { border-left-color: var(--color-text-muted-l); opacity: 0.8; }
        
        .day-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
          padding-bottom: var(--space-2);
          border-bottom: 1px dashed hsl(var(--color-border-h), var(--color-border-s), var(--color-border-l));
        }
        .status-select {
          padding: 4px;
          border-radius: 4px;
          border: 1px solid hsl(var(--color-border-h), var(--color-border-s), var(--color-border-l));
          font-size: 0.8rem;
          background: transparent;
          color: hsl(var(--color-text-main-h), var(--color-text-main-s), var(--color-text-main-l));
        }
        .drag-handle {
          cursor: grab;
          padding: 4px;
        }
        .drag-handle:active {
          cursor: grabbing;
        }
        .day-title-input {
          flex: 1;
          border: none;
          font-size: 1.1rem;
          font-weight: 600;
          padding: 4px;
          border-radius: 4px;
          background: transparent;
          color: hsl(var(--color-text-main-h), var(--color-text-main-s), var(--color-text-main-l));
        }
        .day-title-input:focus {
          background: hsl(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l));
          outline: none;
        }
        .card-actions {
          display: flex;
          gap: 4px;
        }
        .icon-btn {
          background: none;
          border: none;
          padding: 6px;
          cursor: pointer;
          color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .icon-btn:hover {
          background: rgba(0,0,0,0.05);
          color: hsl(var(--color-text-main-h), var(--color-text-main-s), var(--color-text-main-l));
        }
        .icon-btn.danger:hover {
          background: #fee2e2;
          color: #ef4444;
        }
        .content-editor {
          width: 100%;
          border: 1px solid transparent;
          padding: var(--space-2);
          border-radius: var(--radius-md);
          resize: vertical;
          font-family: inherit;
          background: transparent;
          color: hsl(var(--color-text-main-h), var(--color-text-main-s), var(--color-text-main-l));
        }
        .content-editor:focus {
          border-color: hsl(var(--color-p-h), var(--color-p-s), var(--color-p-l));
          outline: none;
        }
        
        .day-image-preview {
            margin-top: var(--space-2);
            position: relative;
            border-radius: var(--radius-md);
            overflow: hidden;
            max-width: 100%;
            display: inline-block;
        }
        .day-image-preview img {
            max-height: 200px;
            border-radius: var(--radius-md);
            border: 1px solid hsl(var(--color-border-h), var(--color-border-s), var(--color-border-l));
            object-fit: cover;
        }
        .remove-image-btn {
            position: absolute;
            top: 4px;
            right: 4px;
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            backdrop-filter: blur(4px);
        }
        .remove-image-btn:hover {
            background: rgba(220, 38, 38, 0.8);
        }
      `}</style>
        </div>
    );
}
