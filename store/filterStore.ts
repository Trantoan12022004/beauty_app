import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    concatColorMatrices,
    brightness,
    contrast,
    saturate,
    sepia,
    grayscale,
    warm,
    cool,
    vintage,
    invert,
    hueRotate,
    Matrix,
} from "react-native-color-matrix-image-filters";

interface FilterPreset {
    id: string;
    name: string;
    imageSource: any; // Kiểu any để hỗ trợ require() import
    colorMatrix: Matrix; // Ma trận màu cho hiệu ứng
    description: string;
}

interface FilterStore {
    // State - Trạng thái ứng dụng
    selectedPreset: string | null;
    intensity: number; // 0-100

    // Actions - Các hành động
    selectPreset: (presetId: string) => void;
    setIntensity: (value: number) => void;
    resetFilter: () => void;

    // Getters - Các phương thức lấy dữ liệu
    getPresets: () => FilterPreset[];
    getCurrentMatrix: () => Matrix;
    hasActiveFilter: () => boolean;
}

// Ma trận đồng nhất (không có hiệu ứng)
const identityMatrix: Matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];

// Hàm helper để đảm bảo ma trận có đúng 20 phần tử
const ensureMatrix = (matrix: number[]): Matrix => {
    if (matrix.length === 20) {
        return matrix as Matrix;
    }
    console.warn(`Ma trận không hợp lệ (${matrix.length} phần tử), sử dụng ma trận mặc định`);
    return identityMatrix;
};

// Ma trận tùy chỉnh cho các hiệu ứng đặc biệt
const customMatrices = {
    // Hiệu ứng tự động sửa ảnh - tăng nhẹ độ sáng và tương phản
    autoFix: ensureMatrix(concatColorMatrices(
        brightness(0.1), 
        contrast(1.1), 
        saturate(1.05)
    )),

    // Hiệu ứng đen trắng với tương phản cao
    blackWhite: ensureMatrix(concatColorMatrices(
        grayscale(1), 
        contrast(1.2)
    )),

    // Hiệu ứng tăng độ sáng
    brightnessBoost: ensureMatrix(concatColorMatrices(
        brightness(0.3), 
        saturate(1.1)
    )),

    // Hiệu ứng tương phản cao
    highContrast: ensureMatrix(concatColorMatrices(
        contrast(1.4), 
        saturate(1.1)
    )),

    // Hiệu ứng cross process (màu sắc nghịch đảo một phần)
    crossProcess: ensureMatrix(concatColorMatrices(
        hueRotate(30), 
        contrast(1.3), 
        saturate(1.4)
    )),

    // Hiệu ứng phim tài liệu (desaturated, contrast cao)
    documentary: ensureMatrix(concatColorMatrices(
        saturate(0.7), 
        contrast(1.25), 
        brightness(0.05)
    )),

    // Hiệu ứng duo tone (2 màu chủ đạo)
    duoTone: ensureMatrix(concatColorMatrices(
        sepia(0.3), 
        hueRotate(200), 
        saturate(1.2)
    )),

    // Hiệu ứng fill light (ánh sáng đầy)
    fillLight: ensureMatrix(concatColorMatrices(
        brightness(0.2), 
        contrast(0.9), 
        saturate(1.15)
    )),

    // Hiệu ứng grain (hạt film)
    grain: ensureMatrix(concatColorMatrices(
        contrast(1.1), 
        saturate(0.95), 
        brightness(0.05)
    )),

    // Hiệu ứng vignette (viền tối)
    vignetteEffect: ensureMatrix(concatColorMatrices(
        contrast(1.2), 
        saturate(1.1), 
        brightness(-0.05)
    )),

    // Hiệu ứng lomish (phong cách lomo)
    lomish: ensureMatrix(concatColorMatrices(
        saturate(1.3), 
        contrast(1.15), 
        hueRotate(10)
    )),

    // Hiệu ứng negative (âm bản)
    negative: ensureMatrix(invert()),

    // Hiệu ứng posterize (giảm số màu)
    posterize: ensureMatrix(concatColorMatrices(
        contrast(1.5), 
        saturate(1.3)
    )),

    // Hiệu ứng bão hòa cao
    saturated: ensureMatrix(concatColorMatrices(
        saturate(1.6), 
        contrast(1.1)
    )),

    // Hiệu ứng sepia truyền thống
    sepiaClassic: ensureMatrix(sepia(0.8)),

    // Hiệu ứng sharpen (làm sắc nét) - dùng contrast cao
    sharpen: ensureMatrix(concatColorMatrices(
        contrast(1.3), 
        saturate(1.05)
    )),

    // Hiệu ứng nhiệt độ ấm
    temperature: ensureMatrix(concatColorMatrices(
        warm(), 
        brightness(0.1)
    )),

    // Hiệu ứng tint màu xanh lá
    tint: ensureMatrix(concatColorMatrices(
        hueRotate(120), 
        saturate(1.2), 
        contrast(1.1)
    )),
};

// Danh sách các preset filter với hiệu ứng tương ứng hình ảnh
const filterPresets: FilterPreset[] = [
    {
        id: 'auto_fix',
        name: 'Tự động',
        imageSource: require("@/assets/images/img_filter_auto_fix.webp"),
        colorMatrix: customMatrices.autoFix,
        description: 'Tự động cải thiện ảnh'
    },
    {
        id: 'black_white',
        name: 'Đen trắng',
        imageSource: require("@/assets/images/img_filter_black_white.webp"),
        colorMatrix: customMatrices.blackWhite,
        description: 'Ảnh đen trắng với tương phản cao'
    },
    {
        id: 'brightness',
        name: 'Sáng bóng',
        imageSource: require("@/assets/images/img_filter_brightness.webp"),
        colorMatrix: customMatrices.brightnessBoost,
        description: 'Tăng độ sáng tự nhiên'
    },
    {
        id: 'contrast',
        name: 'Tương phản',
        imageSource: require("@/assets/images/img_filter_contrast.webp"),
        colorMatrix: customMatrices.highContrast,
        description: 'Tăng độ tương phản'
    },
    {
        id: 'cross_process',
        name: 'Xử lý chéo',
        imageSource: require("@/assets/images/img_filter_cross_process.webp"),
        colorMatrix: customMatrices.crossProcess,
        description: 'Hiệu ứng màu sắc độc đáo'
    },
    {
        id: 'documentary',
        name: 'Phim tài liệu',
        imageSource: require("@/assets/images/img_filter_documentary.webp"),
        colorMatrix: customMatrices.documentary,
        description: 'Phong cách phim tài liệu'
    },
    {
        id: 'duo_tone',
        name: 'Hai màu',
        imageSource: require("@/assets/images/img_filter_due_tone.webp"),
        colorMatrix: customMatrices.duoTone,
        description: 'Hiệu ứng hai màu chủ đạo'
    },
    {
        id: 'fill_light',
        name: 'Ánh sáng đầy',
        imageSource: require("@/assets/images/img_filter_fill_light.webp"),
        colorMatrix: customMatrices.fillLight,
        description: 'Làm sáng vùng tối'
    },
    {
        id: 'grain',
        name: 'Hạt phim',
        imageSource: require("@/assets/images/img_filter_grain.webp"),
        colorMatrix: customMatrices.grain,
        description: 'Hiệu ứng hạt film cổ điển'
    },
    {
        id: 'vignette',
        name: 'Viền tối',
        imageSource: require("@/assets/images/img_filter_vignette.webp"),
        colorMatrix: customMatrices.vignetteEffect,
        description: 'Hiệu ứng viền tối xung quanh'
    },
    {
        id: 'lomish',
        name: 'Lomo',
        imageSource: require("@/assets/images/img_filter_lomish.webp"),
        colorMatrix: customMatrices.lomish,
        description: 'Phong cách lomo retro'
    },
    {
        id: 'negative',
        name: 'Âm bản',
        imageSource: require("@/assets/images/img_filter_negative.webp"),
        colorMatrix: customMatrices.negative,
        description: 'Hiệu ứng âm bản'
    },
    {
        id: 'none',
        name: 'Gốc',
        imageSource: require("@/assets/images/img_filter_none.webp"),
        colorMatrix: identityMatrix,
        description: 'Không áp dụng filter'
    },
    {
        id: 'posterize',
        name: 'Poster hóa',
        imageSource: require("@/assets/images/img_filter_posterize.webp"),
        colorMatrix: customMatrices.posterize,
        description: 'Giảm số màu như poster'
    },
    {
        id: 'saturate',
        name: 'Bão hòa',
        imageSource: require("@/assets/images/img_filter_saturate.webp"),
        colorMatrix: customMatrices.saturated,
        description: 'Tăng độ bão hòa màu sắc'
    },
    {
        id: 'sepia',
        name: 'Sepia',
        imageSource: require("@/assets/images/img_filter_sepia.webp"),
        colorMatrix: customMatrices.sepiaClassic,
        description: 'Tông màu nâu cổ điển'
    },
    {
        id: 'sharpen',
        name: 'Làm sắc',
        imageSource: require("@/assets/images/img_filter_sharpen.webp"),
        colorMatrix: customMatrices.sharpen,
        description: 'Tăng độ sắc nét'
    },
    {
        id: 'temperature',
        name: 'Nhiệt độ',
        imageSource: require("@/assets/images/img_filter_temperature.webp"),
        colorMatrix: customMatrices.temperature,
        description: 'Điều chỉnh nhiệt độ màu'
    },
    {
        id: 'tint',
        name: 'Màu sắc',
        imageSource: require("@/assets/images/img_filter_tint.webp"),
        colorMatrix: customMatrices.tint,
        description: 'Thêm màu sắc tint'
    },
];

export const useFilterStore = create<FilterStore>()(
    persist(
        (set, get) => ({
            selectedPreset: null,
            intensity: 100,

            selectPreset: (presetId) => {
                set({ 
                    selectedPreset: presetId === 'none' ? null : presetId,
                    intensity: presetId === 'none' ? 0 : 100
                });
            },

            setIntensity: (value) => {
                set({ intensity: Math.max(0, Math.min(100, value)) });
            },

            resetFilter: () => {
                set({ selectedPreset: null, intensity: 0 });
            },

            getPresets: () => filterPresets,

            getCurrentMatrix: (): Matrix => {
                const { selectedPreset, intensity } = get();
                
                if (!selectedPreset || intensity === 0) {
                    return identityMatrix;
                }

                const preset = filterPresets.find(p => p.id === selectedPreset);
                if (!preset) return identityMatrix;

                // Nếu cường độ = 100% thì dùng ma trận gốc
                if (intensity === 100) {
                    return preset.colorMatrix;
                }

                // Nội suy giữa ma trận đồng nhất và ma trận filter
                const factor = intensity / 100;
                const resultMatrix: number[] = [];
                
                for (let i = 0; i < 20; i++) {
                    const identityValue = identityMatrix[i];
                    const filterValue = preset.colorMatrix[i];
                    resultMatrix[i] = identityValue + (filterValue - identityValue) * factor;
                }

                return ensureMatrix(resultMatrix);
            },

            hasActiveFilter: (): boolean => {
                const { selectedPreset, intensity } = get();
                return selectedPreset !== null && intensity > 0;
            },
        }),
        {
            name: 'filter-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);