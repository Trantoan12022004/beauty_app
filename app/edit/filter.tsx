import React, { useMemo, useRef, useState } from "react";
import { View, TouchableOpacity, Text, Dimensions, Image, Alert, ScrollView, StyleSheet } from "react-native";
import { ArrowLeft, Check } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { LinearGradient } from "expo-linear-gradient";
import ViewShot, { captureRef } from "react-native-view-shot";
import { usePhotoStore } from "@/store/usePhotoStore";
import {
    ColorMatrix,
    concatColorMatrices,
    saturate,
    sepia,
    grayscale,
    tint,
    warm,
    contrast,
    brightness,
} from "react-native-color-matrix-image-filters";

type Preset = {
    id: string;
    label: string;
    matrix?: any | null; // null means no-op
};

const { width, height } = Dimensions.get("window");

// Helper: invert (negative) color matrix
const invertMatrix = () => [
    -1, 0, 0, 0, 1,
    0, -1, 0, 0, 1,
    0, 0, -1, 0, 1,
    0, 0, 0, 1, 0,
];

// small color shift matrix helper (adds offset to channels)
const colorShiftMatrix = (rOff = 0, gOff = 0, bOff = 0) => [
    1, 0, 0, 0, rOff,
    0, 1, 0, 0, gOff,
    0, 0, 1, 0, bOff,
    0, 0, 0, 1, 0,
];

// Load filter definitions from generated auto file if present, otherwise fall back to static filters.json
// Each preset contains an ordered list of ops. Example op: ["brightness", 1.15] or ["saturate", 1.3] or ["colorShift", r, g, b]
// Load static filters.json (Option A: JSON-defined ops)
const filtersData: Array<{ id: string; label: string; ops: any[] }> = require("@/assets/filter/filters.json");

const opToMatrix = (op: any) => {
    const [name, ...params] = op;
    switch (name) {
        case "brightness":
            return brightness(params[0] ?? 1);
        case "contrast":
            return contrast(params[0] ?? 1);
        case "saturate":
            return saturate(params[0] ?? 1);
        case "sepia":
            return sepia();
        case "grayscale":
            return grayscale();
        case "tint":
            return tint();
        case "warm":
            return warm();
        case "colorShift":
            return colorShiftMatrix(params[0] ?? 0, params[1] ?? 0, params[2] ?? 0) as any;
        case "invert":
            return invertMatrix();
        case "posterize":
            return concatColorMatrices(contrast(1.35), saturate(1.05));
        case "sharpen":
            return concatColorMatrices(contrast(1.18), saturate(1.03));
        default:
            // fallback: no-op
            return brightness(1);
    }
};

const presets = (baseBrightness = 1): Preset[] => {
    return filtersData.map((f) => {
        const mats = (f.ops || []).map(opToMatrix);
        const matrix = mats.length === 0 ? brightness(baseBrightness) : concatColorMatrices(...(mats as any));
        return { id: f.id, label: f.label, matrix };
    });
};

export default function FilterScreen() {
    const { photoUri, setPhotoUri } = usePhotoStore();
    const [selected, setSelected] = useState<string>("normal");
    const viewShotRef = useRef<ViewShot | null>(null);

    const presetList = useMemo(() => presets(), []);

    const selectedPreset = presetList.find((p) => p.id === selected) || presetList[0];

    const handleSave = async () => {
        try {
            if (viewShotRef.current) {
                const uri = await captureRef(viewShotRef, {
                    format: "jpg",
                    quality: 0.95,
                });
                setPhotoUri(uri);
                router.back();
            }
        } catch (error) {
            console.error("Save filter failed:", error);
            Alert.alert("Lỗi", "Không thể lưu ảnh đã áp dụng bộ lọc.");
        }
    };

    if (!photoUri) {
        return (
            <SafeAreaView className="flex-1 bg-black items-center justify-center">
                <Text className="text-white">Không có ảnh để chỉnh bộ lọc</Text>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
                <HStack className="justify-between items-center px-4 py-3 bg-black/80">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                    >
                        <ArrowLeft color="#ffffff" size={24} />
                    </TouchableOpacity>

                    <Text className="text-white text-xl font-bold">Bộ lọc</Text>

                    <TouchableOpacity onPress={handleSave} className="w-20 h-12 rounded-md overflow-hidden">
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

            <View className="flex-1 items-center justify-center mt-16 mb-40">
                <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.95 }}>
                    <View style={{ width, height: height - 220 }}>
                        {selectedPreset.matrix ? (
                            <ColorMatrix matrix={selectedPreset.matrix}>
                                <Image
                                    source={{ uri: photoUri }}
                                    resizeMode="contain"
                                    style={{ width, height: height - 220 }}
                                />
                            </ColorMatrix>
                        ) : (
                            <Image
                                source={{ uri: photoUri }}
                                resizeMode="contain"
                                style={{ width, height: height - 220 }}
                            />
                        )}

                        {/* No overlays in Option A — color-matrix only */}
                    </View>
                </ViewShot>
            </View>

            <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0 pb-6">
                <VStack className="bg-black/90 p-4">
                    <Text className="text-white text-center text-base font-medium mb-2">
                        Chọn bộ lọc
                    </Text>

                    <View style={{ height: 110 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 8, alignItems: "center" }}
                        >
                            {presetList.map((p) => (
                                <TouchableOpacity
                                    key={p.id}
                                    onPress={() => setSelected(p.id)}
                                    hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
                                    style={{ marginRight: 12, alignItems: "center" }}
                                >
                                    <View style={{ width: 80, height: 80, borderRadius: 8, overflow: "hidden", backgroundColor: "#111" }}>
                                        {p.matrix ? (
                                            <ColorMatrix matrix={p.matrix}>
                                                <Image
                                                    source={{ uri: photoUri }}
                                                    resizeMode="cover"
                                                    style={{ width: 80, height: 80 }}
                                                />
                                            </ColorMatrix>
                                        ) : (
                                            <Image
                                                source={{ uri: photoUri }}
                                                resizeMode="cover"
                                                style={{ width: 80, height: 80 }}
                                            />
                                        )}

                                        {/* thumbnails use color-matrix only (no overlays) */}
                                    </View>
                                    <Text className="text-white text-xs mt-1">{p.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </VStack>
            </SafeAreaView>
        </View>
    );
}
