import React, { useState, useRef, useCallback } from 'react';
import { getUIAvatar } from '../src/utils/uiHelpers';

interface User {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AvatarProps {
  user: User;
  size?: number;
  className?: string;
  editable?: boolean;
  onAvatarChange?: (avatarUrl: string) => void;
}

const Avatar: React.FC<AvatarProps> = ({
  user,
  size = 64,
  className = '',
  editable = false,
  onAvatarChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Sila pilih fail gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Saiz gambar mesti kurang dari 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewUrl(result);
      setUploading(true);

      setTimeout(() => {
        if (onAvatarChange) {
          onAvatarChange(result);
        }
        setUploading(false);
        setIsEditing(false);
        setPreviewUrl(null);
      }, 500);
    };
    reader.readAsDataURL(file);
  }, [onAvatarChange]);

  const handleRemoveAvatar = useCallback(() => {
    if (onAvatarChange) {
      onAvatarChange('');
    }
    setIsEditing(false);
  }, [onAvatarChange]);

  const avatarUrl = previewUrl || user.avatar || getUIAvatar(name, size * 2);
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const getInitialsColor = (n: string) => {
    const colors = [
      '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B',
      '#6366F1', '#EF4444', '#8B5CF6', '#14B8A6', '#F97316'
    ];
    const charCodeSum = n.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const bgColor = getInitialsColor(name);

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-white font-bold shadow-lg"
        style={{
          background: user.avatar || previewUrl ? undefined : `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
          fontSize: size * 0.4
        }}
      >
        {user.avatar || previewUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
            style={{ width: size, height: size }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {editable && (
        <>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-purple-700 transition-colors active:scale-90"
            style={{ transform: isEditing ? 'rotate(45deg)' : 'none' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {isEditing && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl p-3 z-50 min-w-[160px] animate-in fade-in zoom-in-95 duration-200">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-purple-50 cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    <span>Memuatkan...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Tukar Gambar</span>
                  </>
                )}
              </label>

              {(user.avatar || previewUrl) && (
                <button
                  onClick={handleRemoveAvatar}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Buang Gambar</span>
                </button>
              )}

              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors mt-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Batal</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Avatar;
