import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PreviewScreen() {
    const router = useRouter();
    const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();

    const uri =
        typeof imageUri === "string" && imageUri.startsWith("file:/")
            ? imageUri.replace("file:/", "file:///")
            : imageUri;

    console.log("Preview image URI:", uri);

    return (
        <View className="flex-1 bg-background-950">
            {/* Image Preview */}
            {uri ? (
                <Image
                    source={{ uri }}
                    style={styles.image}
                    onError={(e) => console.log("❌ Image load error:", e.nativeEvent.error)}
                />
            ) : (
                <VStack className="flex-1 items-center justify-center">
                    <Text className="text-typography-0 text-center">Không có ảnh để hiển thị</Text>
                </VStack>
            )}

            {/* Header - Close button */}
            <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
                <HStack className="justify-between items-center px-4 py-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                    >
                        <X color="#ffffff" size={24} />
                    </TouchableOpacity>
                </HStack>
            </SafeAreaView>

            {/* Footer - Action buttons */}
            <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0 z-10">
                <HStack className="items-center justify-center gap-4 px-4 pb-8">
                    <Button onPress={() => router.back()} className="flex-1 bg-background-800">
                        <ButtonText>Chụp lại</ButtonText>
                    </Button>
                    <Button
                        onPress={() => {
                            // TODO: Xử lý lưu ảnh hoặc chuyển sang màn hình chỉnh sửa
                            console.log("Lưu ảnh:", uri);
                        }}
                        className="flex-1 bg-primary-500"
                    >
                        <ButtonText>Lưu ảnh</ButtonText>
                    </Button>
                </HStack>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: "contain",
    },
});
