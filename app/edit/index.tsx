import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import {
    ArrowLeft,
    Save,
    Palette,
    Sliders,
    Crop,
    Sparkles,
    Edit3,
    Type,
    Sticker,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, ImageBackground, ScrollView, Alert } from "react-native";
import { usePhotoStore } from "@/store/usePhotoStore";
export default function EditScreen() {
    const { width } = Dimensions.get("window");
    const { height } = Dimensions.get("window");
    const { photoUri } = usePhotoStore();

    console.log("Photo Edit:", photoUri);

    const handleSave = () => {
        // TODO: Lưu ảnh đã chỉnh sửa
        console.log("Saving edited photo");
        router.back();
    };
    const nextCrop = () => {
        router.push({
            pathname: "/edit/crop",
        });
    };
    const nextAdjust = () => {
        router.push({
            pathname: "/edit/adjust",
        });
    };
    const nextFilter = () => {
        router.push({
            pathname: "/edit/filter",
        });
    };
    const backToPreview = () => {
        Alert.alert(
            "Xác nhận quay lại",
            "Ảnh đã chỉnh sửa sẽ không được lưu. Bạn có chắc chắn muốn quay lại không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Có",
                    style: "destructive",
                    onPress: () => {
                        router.back(); // hoặc router.replace("/preview") nếu muốn chắc chắn quay lại đúng màn
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-black">
            {/* Header */}
            <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
                <HStack className="justify-between items-center px-4 py-3 bg-black/50">
                    <TouchableOpacity
                        onPress={backToPreview}
                        className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                    >
                        <ArrowLeft color="#ffffff" size={24} />
                    </TouchableOpacity>

                    <Text className="text-white text-xl font-bold">Chỉnh sửa</Text>

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
                            <Text className="text-white font-medium">Lưu</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </HStack>
            </SafeAreaView>

            {/* Image Preview */}
            <View className="flex-1 justify-center items-center">
                {photoUri ? (
                    <Image
                        source={{ uri: photoUri }}
                        resizeMode="contain"
                        style={{
                            width: width,
                            height: height,
                        }}
                    />
                ) : (
                    <Text className="text-white">Không có ảnh để chỉnh sửa</Text>
                )}
            </View>

            {/* Edit Tools - Bottom */}
            <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space="xs" className="px-2 mb-4">
                        <VStack className="items-center">
                            <TouchableOpacity
                                onPress={nextCrop}
                                className="w-20 h-20 items-center justify-center rounded-lg"
                            >
                                <Crop size={22} color="#ffff" />
                            </TouchableOpacity>
                            <Text className="text-white text-xs mt-1">Cắt</Text>
                        </VStack>

                        <VStack className="items-center">
                            <TouchableOpacity
                                onPress={nextAdjust}
                                className="w-20 h-20 items-center justify-center rounded-lg"
                            >
                                <Sliders size={22} color="#ffff" />
                            </TouchableOpacity>
                            <Text className="text-white text-xs mt-1">Điều chỉnh</Text>
                        </VStack>

                        <VStack className="items-center">
                            <TouchableOpacity className="w-20 h-20 items-center justify-center rounded-lg">
                                <Sparkles size={22} color="#ffff" />
                            </TouchableOpacity>
                            <Text className="text-white text-xs mt-1">Trang điểm</Text>
                        </VStack>

                        <VStack className="items-center">
                            <TouchableOpacity className="w-20 h-20 items-center justify-center rounded-lg">
                                <Edit3 size={22} color="#ffff" />
                            </TouchableOpacity>
                            <Text className="text-white text-xs mt-1">Chỉnh sửa</Text>
                        </VStack>

                        <VStack className="items-center">
                            <TouchableOpacity 
                            onPress={nextFilter}
                            className="w-20 h-20 items-center justify-center  rounded-lg">
                                <Palette size={22} color="#ffff" />
                            </TouchableOpacity>
                            <Text className="text-white text-xs mt-1">Bộ lọc</Text>
                        </VStack>

                        <VStack className="items-center">
                            <TouchableOpacity className="w-20 h-20 items-center justify-center  rounded-lg">
                                <Type size={22} color="#ffff" />
                            </TouchableOpacity>
                            <Text className="text-white text-xs mt-1">Văn bản</Text>
                        </VStack>

                        <VStack className="items-center">
                            <TouchableOpacity className="w-20 h-20 items-center justify-center  rounded-lg">
                                <Sticker size={22} color="#ffff" />
                            </TouchableOpacity>
                            <Text className="text-white text-xs mt-1">Nhãn dán</Text>
                        </VStack>
                    </HStack>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
