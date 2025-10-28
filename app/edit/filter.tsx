import React, { useMemo, useState, useRef } from "react";
import { View, TouchableOpacity, ScrollView, Dimensions, Image, Alert } from "react-native";
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
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
// ✅ Import FilterStore
import { useFilterStore } from "@/store/filterStore";

export default function FilterScreen() {
    const { photoUri, setPhotoUri } = usePhotoStore();
    // ✅ Sử dụng FilterStore thay vì state local
    const { 
        selectedPreset, 
        intensity, 
        selectPreset, 
        setIntensity, 
        getPresets, 
        getCurrentMatrix 
    } = useFilterStore();
    
    const viewShotRef = useRef(null);

    // ✅ Lấy danh sách preset từ store
    const filterPresets = getPresets();

    const { width, height } = Dimensions.get("window");

    // ✅ Xử lý thay đổi cường độ filter
    const handleIntensityChange = (value: number) => {
        setIntensity(value);
    };

    // ✅ Xử lý chọn preset filter
    const handlePresetSelect = (presetId: string) => {
        selectPreset(presetId);
    };

    const handleSave = async () => {
        try {
            if (viewShotRef.current) {
                const uri = await captureRef(viewShotRef, {
                    format: "jpg",
                    quality: 1,
                });

                console.log("Ảnh đã áp dụng filter:", uri);

                // Cập nhật store
                setPhotoUri(uri);

                // Điều hướng về màn edit chính
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

    // ✅ Lấy ma trận filter hiện tại từ store
    const filterMatrix = getCurrentMatrix();

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

                    <Text className="text-white text-xl font-bold">Bộ lọc</Text>

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

            {/* Ảnh preview với filter áp dụng */}
            <View className="flex-1 items-center justify-center mt-16 mb-48">
                <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1 }}>
                    <View style={{ width, height: height * 0.6 }}>
                        <ColorMatrix matrix={filterMatrix}>
                            <Image
                                source={{ uri: photoUri }}
                                resizeMode="contain"
                                style={{
                                    width: width,
                                    height: height * 0.6,
                                    borderRadius: 12,
                                }}
                            />
                        </ColorMatrix>
                    </View>
                </ViewShot>
            </View>

            {/* Bộ điều chỉnh cường độ filter */}
            <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0 pb-8">
                <VStack className="bg-black/90 p-4">
                    {/* Hiển thị tên filter và cường độ hiện tại */}
                    <Text className="text-white text-center text-base font-medium mb-2">
                        {selectedPreset ? 
                            `${filterPresets.find(p => p.id === selectedPreset)?.name} (${intensity}%)` : 
                            'Chọn bộ lọc'
                        }
                    </Text>

                    {/* Slider điều chỉnh cường độ */}
                    {selectedPreset && (
                        <View className="mb-4 mt-2 px-8">
                            <Slider
                                minValue={0}
                                maxValue={100}
                                value={intensity}
                                onChange={handleIntensityChange}
                                step={1}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack style={{ backgroundColor: "#3b82f6" }} />
                                </SliderTrack>
                                <SliderThumb style={{ backgroundColor: "#fff" }} />
                            </Slider>
                        </View>
                    )}

                    {/* Danh sách preset filter với ảnh minh họa */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                        <HStack className="space-x-3 px-2">
                            {filterPresets.map((preset) => (
                                <TouchableOpacity
                                    key={preset.id}
                                    onPress={() => handlePresetSelect(preset.id)}
                                    className={`w-20 h-24 rounded-lg overflow-hidden border-2 ${
                                        selectedPreset === preset.id ? 'border-primary-500' : 'border-transparent'
                                    }`}
                                >
                                    <View className="w-full h-full bg-background-800 overflow-hidden">
                                        {/* ✅ Hiển thị ảnh minh họa từ store */}
                                        <Image
                                            source={preset.imageSource}
                                            resizeMode="cover"
                                            className="w-full h-full"
                                        />
                                    </View>
                                    <Text className="absolute bottom-0 w-full text-center text-white text-xs mt-1 bg-black/70 py-1">
                                        {preset.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </HStack>
                    </ScrollView>
                </VStack>
            </SafeAreaView>
        </View>
    );
}