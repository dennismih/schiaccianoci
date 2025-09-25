import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Maximize2, Play, Pause, Volume2, VolumeX, Trash2, Camera } from 'lucide-react';
import { supabase } from './lib/supabase';

interface MediaItem {
  id: string;
  file_name: string;
  file_type: string;
  file_data: string; // base64
  uploader_id: string;
  created_at: string;
  aspect_ratio: number;
}

function App() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userId] = useState(() => {
    let id = localStorage.getItem('nutcracker-user-id');
    if (!id) {
      id = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('nutcracker-user-id', id);
    }
    return id;
  });
  const [dragOver, setDragOver] = useState(false);
  const [videoStates, setVideoStates] = useState<{[key: string]: {playing: boolean, muted: boolean}}>({});
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<{[key: string]: HTMLVideoElement}>({});

  // Load media from Supabase on component mount
  useEffect(() => {
    loadMediaFromDatabase();
    
    // Set up real-time subscription for new uploads
    const subscription = supabase
      .channel('media_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'media_items' },
        () => {
          loadMediaFromDatabase();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadMediaFromDatabase = async () => {
    try {
      setConnectionStatus('connecting');
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading media:', error);
        setConnectionStatus('offline');
        // Fallback to localStorage
        loadMediaFromLocalStorage();
        return;
      }

      setMediaItems(data || []);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Database connection error:', error);
      setConnectionStatus('offline');
      loadMediaFromLocalStorage();
    }
  };

  const loadMediaFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('nutcracker-media-backup');
      if (stored) {
        const mediaData = JSON.parse(stored);
        setMediaItems(mediaData);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const saveToLocalStorageBackup = (items: MediaItem[]) => {
    try {
      localStorage.setItem('nutcracker-media-backup', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving to localStorage backup:', error);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setIsUploading(true);
    const newItems: MediaItem[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        continue;
      }

      // Convert file to base64
      const base64 = await fileToBase64(file);
      let aspectRatio = 1;

      if (file.type.startsWith('image/')) {
        aspectRatio = await getImageAspectRatio(base64);
      } else if (file.type.startsWith('video/')) {
        aspectRatio = await getVideoAspectRatio(base64);
      }

      const mediaItem: MediaItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file_name: file.name,
        file_type: file.type,
        file_data: base64,
        uploader_id: userId,
        created_at: new Date().toISOString(),
        aspect_ratio: aspectRatio
      };

      newItems.push(mediaItem);
    }

    // Try to save to database first
    if (connectionStatus === 'connected') {
      try {
        const { error } = await supabase
          .from('media_items')
          .insert(newItems);

        if (error) {
          console.error('Error saving to database:', error);
          // Fallback to localStorage
          const updatedItems = [...mediaItems, ...newItems];
          setMediaItems(updatedItems);
          saveToLocalStorageBackup(updatedItems);
        }
      } catch (error) {
        console.error('Database save error:', error);
        // Fallback to localStorage
        const updatedItems = [...mediaItems, ...newItems];
        setMediaItems(updatedItems);
        saveToLocalStorageBackup(updatedItems);
      }
    } else {
      // Save to localStorage if offline
      const updatedItems = [...mediaItems, ...newItems];
      setMediaItems(updatedItems);
      saveToLocalStorageBackup(updatedItems);
    }

    setIsUploading(false);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const getImageAspectRatio = (base64: string): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.height / img.width);
      };
      img.onerror = () => resolve(1);
      img.src = base64;
    });
  };

  const getVideoAspectRatio = (base64: string): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve(video.videoHeight / video.videoWidth);
      };
      video.onerror = () => resolve(1);
      video.src = base64;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const deleteMedia = async (mediaId: string) => {
    const mediaToDelete = mediaItems.find(m => m.id === mediaId);
    if (!mediaToDelete || (mediaToDelete.uploader_id !== userId && userId !== 'admin')) {
      return;
    }

    // Try to delete from database first
    if (connectionStatus === 'connected') {
      try {
        const { error } = await supabase
          .from('media_items')
          .delete()
          .eq('id', mediaId);

        if (error) {
          console.error('Error deleting from database:', error);
        }
      } catch (error) {
        console.error('Database delete error:', error);
      }
    }

    // Update local state regardless
    const updatedItems = mediaItems.filter(m => m.id !== mediaId);
    setMediaItems(updatedItems);
    saveToLocalStorageBackup(updatedItems);
    
    if (selectedMedia?.id === mediaId) {
      setSelectedMedia(null);
    }
  };

  const toggleVideoPlay = (mediaId: string) => {
    const video = videoRefs.current[mediaId];
    if (!video) return;

    const currentState = videoStates[mediaId] || { playing: false, muted: true };
    
    if (currentState.playing) {
      video.pause();
    } else {
      video.play();
    }

    setVideoStates(prev => ({
      ...prev,
      [mediaId]: { ...currentState, playing: !currentState.playing }
    }));
  };

  const toggleVideoMute = (mediaId: string) => {
    const video = videoRefs.current[mediaId];
    if (!video) return;

    const currentState = videoStates[mediaId] || { playing: false, muted: true };
    video.muted = !currentState.muted;

    setVideoStates(prev => ({
      ...prev,
      [mediaId]: { ...currentState, muted: !currentState.muted }
    }));
  };

  const MediaGrid = ({ items }: { items: MediaItem[] }) => (
    <div className="masonry-grid">
      {items.map((item) => (
        <div
          key={item.id}
          className="masonry-item group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          style={{ height: `${250 * item.aspect_ratio}px` }}
        >
          {item.file_type.startsWith('image/') ? (
            <img
              src={item.file_data}
              alt="Selfie con schiaccianoci"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            />
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={(el) => { if (el) videoRefs.current[item.id] = el; }}
                src={item.file_data}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedMedia(item)}
                muted={videoStates[item.id]?.muted ?? true}
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleVideoPlay(item.id); }}
                    className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    {videoStates[item.id]?.playing ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleVideoMute(item.id); }}
                    className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    {videoStates[item.id]?.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedMedia(item); }}
                className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
              >
                <Maximize2 size={16} />
              </button>
              {(item.uploader_id === userId || userId === 'admin') && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteMedia(item.id); }}
                  className="bg-red-500 bg-opacity-90 text-white p-2 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="absolute bottom-3 left-3 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded-full">
            {new Date(item.created_at).toLocaleDateString('it-IT')}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-red-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-lg border-b-4 border-gradient-to-r from-red-500 to-green-500">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎄</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                Galleria Schiaccianoci
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                Condividi i tuoi selfie natalizi!
                <span className={`inline-block w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
                <span className="text-xs">
                  {connectionStatus === 'connected' ? 'Online' : 
                   connectionStatus === 'connecting' ? 'Connessione...' : 'Offline'}
                </span>
              </p>
            </div>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
          >
            {isUploading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Camera size={20} />
            )}
            {isUploading ? 'Caricamento...' : 'Carica Selfie'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 p-8 rounded-3xl border-2 border-dashed transition-all duration-300 ${
            dragOver
              ? 'border-red-400 bg-red-50 scale-[1.02]'
              : 'border-gray-300 bg-white/50'
          }`}
        >
          <div className="text-center">
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Trascina qui le tue foto o video
            </p>
            <p className="text-gray-500 mb-4">
              oppure clicca il pulsante "Carica Selfie" in alto
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span>📸 Foto</span>
              <span>•</span>
              <span>🎥 Video</span>
              <span>•</span>
              <span>📱 Condivisi con tutti</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 bg-white/70 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-wrap gap-8 justify-center text-center">
            <div>
              <div className="text-3xl font-bold text-red-600">{mediaItems.length}</div>
              <div className="text-gray-600">Selfie Totali</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{mediaItems.filter(m => m.file_type.startsWith('image/')).length}</div>
              <div className="text-gray-600">Foto</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">{mediaItems.filter(m => m.file_type.startsWith('video/')).length}</div>
              <div className="text-gray-600">Video</div>
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        {mediaItems.length > 0 ? (
          <MediaGrid items={mediaItems} />
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-4">🥜</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Ancora nessun selfie!
            </h2>
            <p className="text-gray-500 mb-6">
              Sii il primo a condividere un selfie con il nostro schiaccianoci gigante!
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              Carica il primo selfie 🎄
            </button>
          </div>
        )}
      </main>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Modal for full-screen view */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors z-10"
            >
              <X size={32} />
            </button>
            
            {selectedMedia.file_type.startsWith('image/') ? (
              <img
                src={selectedMedia.file_data}
                alt="Selfie con schiaccianoci"
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            ) : (
              <video
                src={selectedMedia.file_data}
                controls
                autoPlay
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            )}
            
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full">
              {new Date(selectedMedia.created_at).toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;