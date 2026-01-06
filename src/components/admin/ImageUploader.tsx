import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/canvasUtils';
// Slider removed
import { X, Check, RotateCw, ZoomIn, Image as ImageIcon, Crop } from 'lucide-react';
import { AdminButton } from '../AdminComponents';

interface ImageUploaderProps {
    label?: string;
    name?: string;
    defaultValue?: string;
    onImageChange: (base64: string) => void;
    aspectRatio?: number; // e.g., 16/9 or 1
}

export const ImageUploader = ({ label = "Image", name = "image", defaultValue = "", onImageChange, aspectRatio = 16 / 9 }: ImageUploaderProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(defaultValue);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const readFile = (file: File) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file) as string;
            setImageSrc(imageDataUrl);
            setIsEditorOpen(true);
        }
    };

    const showCroppedImage = useCallback(async () => {
        try {
            if (!imageSrc || !croppedAreaPixels) return;
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            );

            // Upload to Cloudinary via Backend
            try {
                // Convert result to Blob (handles both Base64 and Blob URL)
                const response = await fetch(croppedImage);
                const blob = await response.blob();

                const formData = new FormData();
                formData.append('file', blob, 'upload.jpg');

                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const uploadRes = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    setPreviewUrl(data.url);
                    onImageChange(data.url);
                } else {
                    console.error('Upload failed, falling back to local data');
                    setPreviewUrl(croppedImage);
                    onImageChange(croppedImage);
                }
            } catch (uploadError) {
                console.error('Upload error:', uploadError);
                setPreviewUrl(croppedImage);
                onImageChange(croppedImage);
            }

            setIsEditorOpen(false);
            setZoom(1);
            setRotation(0);
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc, croppedAreaPixels, rotation, onImageChange]);

    const handleRemove = () => {
        setPreviewUrl('');
        onImageChange('');
        setImageSrc(null);
    };

    return (
        <div className="mb-6">
            {label && <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>}

            {!isEditorOpen ? (
                <div className="space-y-4">
                    {previewUrl ? (
                        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => { setImageSrc(previewUrl); setIsEditorOpen(true); }}
                                    className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
                                    type="button"
                                >
                                    <Crop size={18} />
                                </button>
                                <button
                                    onClick={handleRemove}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    type="button"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <div className="p-3 bg-gray-100 rounded-full">
                                    <ImageIcon size={24} />
                                </div>
                                <span className="text-sm font-medium">Click to upload or drag and drop</span>
                                <span className="text-xs">SVG, PNG, JPG or GIF (max. 5MB)</span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="fixed inset-0 z-[110] bg-black/90 flex flex-col animate-in fade-in duration-200">
                    <div className="flex justify-between items-center p-4 border-b border-white/10">
                        <h3 className="text-white font-bold text-lg">Edit Image</h3>
                        <button onClick={() => setIsEditorOpen(false)} className="text-white/60 hover:text-white"><X size={24} /></button>
                    </div>

                    <div className="relative flex-1 bg-[#1a1a1a] overflow-hidden">
                        <Cropper
                            image={imageSrc || ''}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            onRotationChange={setRotation}
                        />
                    </div>

                    <div className="bg-[#2d2d2d] p-6 space-y-6">
                        <div className="max-w-xl mx-auto space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-white/60 w-20 text-xs font-bold uppercase">Zoom</span>
                                <ZoomIn size={16} className="text-white/60" />
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 accent-[#500000] h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-white/60 w-20 text-xs font-bold uppercase">Rotate</span>
                                <RotateCw size={16} className="text-white/60" />
                                <input
                                    type="range"
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={rotation}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="flex-1 accent-[#500000] h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <AdminButton variant="secondary" onClick={() => setIsEditorOpen(false)}>
                                    Cancel
                                </AdminButton>
                                <AdminButton onClick={showCroppedImage}>
                                    <Check size={18} /> Apply Changes
                                </AdminButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Input to store value for form submission */}
            <input type="hidden" name={name} value={previewUrl} />
        </div>
    );
};
