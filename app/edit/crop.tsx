import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, Alert } from "react-native";
import {
    ArrowLeft,
    Check,
    Crop,
    CornerUpLeft,
    CornerUpRight,
    FlipHorizontal,
    Square,
    RectangleVertical,
    RectangleHorizontal,
    
} from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { LinearGradient } from "expo-linear-gradient";
import { CropView } from "react-native-image-crop-tools";
import { usePhotoStore } from "@/store/usePhotoStore";
interface AspectRatio {
    id: string;
    label: string;
    ratio: number | null;
    width?: number;
    height?: number;
    icon: React.ComponentType<{ size?: number; color?: string }>;
}

const aspectRatios: AspectRatio[] = [
    { id: "free", label: "Tự do", ratio: null, icon: Crop },
    { id: "square", label: "1:1", ratio: 1, width: 1, height: 1, icon: Square },
    { id: "3_4", label: "3:4", ratio: 3 / 4, width: 3, height: 4, icon: RectangleVertical },
    { id: "4_3", label: "4:3", ratio: 4 / 3, width: 4, height: 3, icon: RectangleHorizontal },
    { id: "3_2", label: "3:2", ratio: 3 / 2, width: 3, height: 2, icon: RectangleHorizontal },
    { id: "2_3", label: "2:3", ratio: 2 / 3, width: 2, height: 3, icon: RectangleVertical },
    { id: "9_16", label: "9:16", ratio: 9 / 16, width: 9, height: 16, icon: RectangleVertical },
    { id: "16_9", label: "16:9", ratio: 16 / 9, width: 16, height: 9, icon: RectangleHorizontal },
];

export default function CropScreen() {
    const { photoUri, setPhotoUri } = usePhotoStore();
    const cropViewRef = useRef<CropView>(null);
    const [selectedRatio, setSelectedRatio] = useState<string>("free");

    const handleCrop = async () => {
        if (cropViewRef.current && photoUri) {
            try {
                // Trigger crop with high quality
                cropViewRef.current.saveImage(true, 100);
            } catch (error) {
                console.error("Crop error:", error);
                Alert.alert("Lỗi", "Không thể cắt ảnh. Vui lòng thử lại.");
            }
        }
    };

    const onImageCrop = (res: any) => {
        if (res && res.uri) {
            // Nếu chưa có tiền tố file:// thì thêm vào
            const finalUri = res.uri.startsWith("file://") ? res.uri : `file://${res.uri}`;
            setPhotoUri(finalUri);
            console.log("Photo crop:", finalUri);
            // ✅ Đóng modal crop
            router.back();
        } else {
            router.back();
        }
    };

    const handleRatioSelect = (ratio: AspectRatio) => {
        setSelectedRatio(ratio.id);
        // CropView will re-render with new aspectRatio prop
    };

    if (!photoUri) {
        return (
            <SafeAreaView className="flex-1 bg-black items-center justify-center">
                <Text className="text-white">Không có ảnh để cắt</Text>
            </SafeAreaView>
        );
    }

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

                    <Text className="text-white text-xl font-bold">Cắt ảnh</Text>

                    <TouchableOpacity
                        onPress={handleCrop}
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

            {/* Crop View */}
            <View className="flex-1 mt-10 mb-40">
                <CropView
                    sourceUrl={photoUri}
                    ref={cropViewRef}
                    onImageCrop={onImageCrop}
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#000",
                    }}
                    // Additional props for react-native-image-crop-tools
                    keepAspectRatio={selectedRatio !== "free"}
                    aspectRatio={
                        selectedRatio !== "free"
                            ? {
                                  width:
                                      aspectRatios.find((r) => r.id === selectedRatio)?.width || 1,
                                  height:
                                      aspectRatios.find((r) => r.id === selectedRatio)?.height || 1,
                              }
                            : undefined
                    }
                />
            </View>

            {/* Aspect Ratio Controls */}
            <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0 pb-8">
                <VStack className="bg-black/90 p-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <HStack className="space-x-3 px-2">
                            {aspectRatios.map((ratio) => {
                                const IconComponent = ratio.icon;
                                return (
                                    <VStack key={ratio.id} className="items-center">
                                        <TouchableOpacity
                                            onPress={() => handleRatioSelect(ratio)}
                                            className={`w-20 h-20 items-center justify-center gap-2 ${
                                                selectedRatio === ratio.id
                                                    ? "border-blue-500 bg-blue-500/20"
                                                    : "border-gray-500 bg-gray-500/10"
                                            }`}
                                        >
                                            <IconComponent
                                                size={24}
                                                color={
                                                    selectedRatio === ratio.id
                                                        ? "#3b82f6"
                                                        : "#ffffff"
                                                }
                                            />
                                            <Text
                                                className={`text-xs font-medium ${
                                                    selectedRatio === ratio.id
                                                        ? "text-blue-300"
                                                        : "text-white"
                                                }`}
                                            >
                                                {ratio.label}
                                            </Text>
                                        </TouchableOpacity>
                                    </VStack>
                                );
                            })}
                        </HStack>
                    </ScrollView>

                    {/* Instructions */}
                    <View className="mt-4 flex-row justify-center gap-8">
                        <TouchableOpacity className="gap-2" onPress={() => cropViewRef.current?.rotateImage(false)}>
                            <CornerUpLeft color="#ffffff" size={32} />
                            <Text className="text-xs font-medium text-white">Trái</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="gap-2" onPress={() => cropViewRef.current?.rotateImage(true)}>
                            <CornerUpRight color="#ffffff" size={32} />
                            <Text className="text-xs font-medium text-white">Phải</Text>
                        </TouchableOpacity>
                    </View>
                </VStack>
            </SafeAreaView>
        </View>
    );
}
