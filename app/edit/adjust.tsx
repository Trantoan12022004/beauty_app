import React, { useMemo, useState, useRef } from "react";
import { View, TouchableOpacity, Text, ScrollView, Dimensions, Image, Alert } from "react-native";
import {
    ArrowLeft,
    Check,
    Sun,
    Contrast,
    Blend,
    Palette,
    Sunrise,
    Circle,
    Zap,
    SunDim,
    Thermometer,
    Droplets,
    Crop,
} from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/components/ui/hstack";
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@/components/ui/slider";
import { VStack } from "@/components/ui/vstack";
import { LinearGradient } from "expo-linear-gradient";
import { usePhotoStore } from "@/store/usePhotoStore";
import ViewShot, { captureRef } from "react-native-view-shot";
import { VignetteOverlay } from "@/components/VignetteOverlay";
import {
    ColorMatrix,
    concatColorMatrices,
    brightness,
    contrast,
    saturate,
    hueRotate,
    sepia,
    grayscale,
    tint,
    warm,
    cool,
    vintage,
} from "react-native-color-matrix-image-filters";

interface FilterType {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; color?: string }>;
    min: number;
    max: number;
    defaultValue: number;
    step?: number;
}

const filterTypes: FilterType[] = [
    {
        id: "brightness",
        label: "Brightness",
        icon: Sun,
        min: 0,
        max: 2,
        defaultValue: 1,
        step: 0.01,
    },
    {
        id: "contrast",
        label: "Contrast",
        icon: Contrast,
        min: 0,
        max: 2,
        defaultValue: 1,
        step: 0.01,
    },
    {
        id: "saturation",
        label: "Saturation",
        icon: Blend,
        min: 0,
        max: 2,
        defaultValue: 1,
        step: 0.01,
    },
    {
        id: "highlight",
        label: "Highlight",
        icon: Sun,
        min: 0.5,
        max: 1.5,
        defaultValue: 1,
        step: 0.01,
    },
    {
        id: "shadow",
        label: "Shadow",
        icon: Circle,
        min: 0.5,
        max: 1.5,
        defaultValue: 1,
        step: 0.01,
    },
    {
        id: "warmth",
        label: "Warmth",
        icon: Thermometer,
        min: -1,
        max: 1,
        defaultValue: 0,
        step: 0.01,
    },
    { id: "vignette", label: "Vignette", icon: Crop, min: 0, max: 1, defaultValue: 0, step: 0.01 },
    { id: "hue", label: "Hue", icon: Palette, min: 0, max: 360, defaultValue: 0, step: 1 },
    { id: "sharpen", label: "Sharpen", icon: Zap, min: 0, max: 2, defaultValue: 1, step: 0.01 },
    { id: "grain", label: "Grain", icon: Circle, min: 0, max: 1, defaultValue: 0, step: 0.01 },
    { id: "tint", label: "Tint", icon: Droplets, min: -1, max: 1, defaultValue: 0, step: 0.01 },
    { id: "fade", label: "Fade", icon: SunDim, min: 0, max: 1, defaultValue: 0, step: 0.01 },
];

export default function AdjustScreen() {
    const { photoUri, setPhotoUri } = usePhotoStore();
    const [selectedFilter, setSelectedFilter] = useState<string>("brightness");
    const viewShotRef = useRef(null);
    // ✅ Thêm đầy đủ tất cả filterValues để slider hoạt động
    const [filterValues, setFilterValues] = useState({
        brightness: 1,
        contrast: 1,
        saturation: 1,
        highlight: 1,
        shadow: 1,
        warmth: 0,
        vignette: 0,
        hue: 0,
        sharpen: 1,
        grain: 0,
        tint: 0,
        fade: 0,
    });

    const { width, height } = Dimensions.get("window");

    const handleFilterValueChange = (filterId: string, value: number) => {
        console.log(`🎛️ Changing ${filterId} to ${value}`); // Debug log
        setFilterValues((prev) => ({
            ...prev,
            [filterId]: value,
        }));
    };

    const handleSave = async () => {
        try {
            if (viewShotRef.current) {
                const uri = await captureRef(viewShotRef, {
                    format: "jpg",
                    quality: 1,
                });

                console.log("Photo adjust:", uri);

                // Cập nhật store
                setPhotoUri(uri);

                // Điều hướng sang màn edit
                router.back();
            }
        } catch (error) {
            console.error("Lỗi khi lưu ảnh:", error);
            Alert.alert("Lỗi", "Không thể lưu ảnh đã chỉnh sửa.");
        }
    };

    if (!photoUri) {
        return (
            <SafeAreaView className="flex-1 bg-black items-center justify-center">
                <Text className="text-white">Không có ảnh để chỉnh sửa</Text>
            </SafeAreaView>
        );
    }

    // ✅ Cải thiện filter matrix với logic đúng
    const filterMatrix = useMemo(() => {
        try {
            // Tính highlight matrix
            const highlightMatrix = concatColorMatrices(
                brightness(1 + (filterValues.highlight - 1) * 0.5),
                contrast(1 + (filterValues.highlight - 1) * 0.3),
                saturate(1 + (filterValues.highlight - 1) * 0.2)
            );

            // Tính shadow matrix
            const shadowMatrix = concatColorMatrices(
                brightness(1 - (1 - filterValues.shadow) * 0.4),
                contrast(1 - (1 - filterValues.shadow) * 0.3),
                saturate(1 - (1 - filterValues.shadow) * 0.2)
            );
            // ✅ Sharpen effect sử dụng contrast và brightness
            const sharpenMatrix = concatColorMatrices(
                contrast(1 + (filterValues.sharpen - 1) * 0.8), // Tăng contrast
                brightness(1 + (filterValues.sharpen - 1) * 0.1), // Tăng nhẹ brightness
                saturate(1 + (filterValues.sharpen - 1) * 0.2) // Tăng nhẹ saturation
            );
            const matrices = [
                brightness(filterValues.brightness),
                contrast(filterValues.contrast),
                saturate(filterValues.saturation),
                // highlight
                highlightMatrix,
                // shadow
                shadowMatrix,

                filterValues.warmth > 0 ? warm() : filterValues.warmth < 0 ? cool() : brightness(1), // Identity khi warmth = 0
                // vignette
                hueRotate(filterValues.hue),
                // sharpen
                sharpenMatrix,
                // grain
                tint(filterValues.tint),
                // fade
            ];

            return concatColorMatrices(...matrices) as any;
        } catch (error) {
            console.warn("Filter matrix error:", error);
            return [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
        }
    }, [filterValues]);

    const currentFilter = filterTypes.find((f) => f.id === selectedFilter);
    const currentValue = filterValues[selectedFilter as keyof typeof filterValues];

    return (
        <View className="flex-1 bg-black">
            {/* Header */}
            <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
                <HStack className="justify-between items-center px-4 py-3 bg-black/80">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                    >
                        <ArrowLeft color="#ffffff" size={24} />
                    </TouchableOpacity>

                    <Text className="text-white text-xl font-bold">Điều chỉnh</Text>

                    <TouchableOpacity
                        onPress={handleSave}
                        className="w-20 h-12 rounded-md overflow-hidden"
                    >
                        <LinearGradient
                            colors={["#3b82f6", "#1e40af"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="flex-1 justify-center items-center"
                        >
                            <Check color="#ffffff" size={20} />
                        </LinearGradient>
                    </TouchableOpacity>
                </HStack>
            </SafeAreaView>

            {/* Ảnh preview - ✅ Kích thước đúng tỷ lệ */}
            <View className="flex-1 items-center justify-center mt-16 mb-40">
                <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1 }}>
                    <View style={{ width, height }}>
                        <ColorMatrix matrix={filterMatrix}>
                            <Image
                                source={{ uri: photoUri }}
                                resizeMode="contain"
                                style={{
                                    width: width,
                                    height: height,
                                    borderRadius: 12,
                                }}
                            />
                        </ColorMatrix>

                        {/* ✅ Thêm lớp Vignette overlay */}
                        <VignetteOverlay
                            intensity={filterValues.vignette}
                            width={width}
                            height={height}
                        />
                    </View>
                </ViewShot>
            </View>

            {/* Bộ điều chỉnh */}
            <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0 pb-8">
                <VStack className="bg-black/90 p-4">
                    <Text className="text-white text-center text-base font-medium mb-2">
                        {currentFilter?.label} ({Math.round(currentValue * 100) / 100})
                    </Text>

                    {/* ✅ Slider với key để force re-render khi đổi filter */}
                    <View className="mb-4 mt-2 px-8">
                        <Slider
                            key={selectedFilter} // Force re-render khi đổi filter
                            minValue={currentFilter?.min || 0}
                            maxValue={currentFilter?.max || 1}
                            value={currentValue}
                            onChange={(v) => handleFilterValueChange(selectedFilter, v)}
                            step={currentFilter?.step || 0.01}
                        >
                            <SliderTrack>
                                <SliderFilledTrack style={{ backgroundColor: "#3b82f6" }} />
                            </SliderTrack>
                            <SliderThumb style={{ backgroundColor: "#fff" }} />
                        </Slider>
                    </View>

                    {/* Filter lựa chọn */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                        <HStack className="space-x-3 px-2">
                            {filterTypes.map((filter) => {
                                const IconComponent = filter.icon;
                                const isActive = selectedFilter === filter.id;
                                return (
                                    <VStack key={filter.id} className="items-center">
                                        <TouchableOpacity
                                            onPress={() => setSelectedFilter(filter.id)}
                                            className={`w-20 h-20 items-center justify-center gap-2 ${
                                                isActive
                                                    ? "border-blue-500 bg-blue-500/20"
                                                    : "border-gray-500 bg-gray-500/10"
                                            }`}
                                        >
                                            <IconComponent
                                                size={24}
                                                color={isActive ? "#3b82f6" : "#ffffff"}
                                            />
                                            <Text
                                                className={`text-xs font-medium ${
                                                    isActive ? "text-blue-300" : "text-white"
                                                }`}
                                            >
                                                {filter.label}
                                            </Text>
                                        </TouchableOpacity>
                                    </VStack>
                                );
                            })}
                        </HStack>
                    </ScrollView>
                </VStack>
            </SafeAreaView>
        </View>
    );
}
