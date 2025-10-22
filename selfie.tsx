import React from "react";
import Gradient from "@/assets/icons/Gradient";
import Logo from "@/assets/icons/Logo";
import { Box } from "@/components/ui/box";
import { Dimensions, ImageBackground, ScrollView, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";

import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Icon } from "@/components/ui/icon";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";
import { LinearGradient } from "expo-linear-gradient";
import { FlipHorizontal, X, ZapOff, ZoomIn, SwitchCamera } from "lucide-react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Grid, GridItem } from "@/components/ui/grid";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
export default function Home() {
    const router = useRouter();
    const [facing, setFacing] = useState<CameraType>("front");
    const [permission, requestPermission] = useCameraPermissions();
    const width = Dimensions.get("window").width;
    if (!permission) {
        return (
            <SafeAreaView className="flex-1 bg-background-0">
                <VStack className="flex-1 items-center justify-center p-4">
                    <Text className="text-typography-900">Đang tải...</Text>
                </VStack>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView className="flex-1 bg-background-0">
                <VStack className="flex-1 items-center justify-center p-4 gap-4">
                    <Text className="text-typography-900 text-center">
                        Cần quyền truy cập camera để chụp ảnh selfie
                    </Text>
                    <Button onPress={requestPermission} className="bg-primary-500">
                        <ButtonText>Cấp quyền</ButtonText>
                    </Button>
                </VStack>
            </SafeAreaView>
        );
    }
    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    return (
        <Box className="flex-1 bg-background-dark h-[100vh]">
            <SafeAreaView>
                <Grid className="gap-4" _extra={{ className: "grid-cols-10" }}>
                    <HStack className="w-full justify-between px-2">
                        <Pressable
                            onPress={() => router.back()}
                            className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                        >
                            <X color="#ffffff" size={24} />
                        </Pressable>
                        <HStack className="gap-2">
                            <Pressable
                                // onPress={toggleZoom}
                                className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                            >
                                <ZoomIn color="#ffffff" size={24} />
                            </Pressable>
                            <Pressable
                                // onPress={toggleFlash}
                                className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                            >
                                <ZapOff color="#ffffff" size={24} />
                            </Pressable>
                            <Pressable
                                // onPress={toggleFlash}
                                className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                            >
                                <SwitchCamera color="#ffffff" size={24} />
                            </Pressable>
                        </HStack>
                    </HStack>

                    <CameraView
                        // ref={cameraRef}
                        style={styles.camera}
                        facing={facing}
                        // enableTorch={flash}
                        // zoom={zoom}
                    />
                </Grid>
            </SafeAreaView>
        </Box>
    );
}

const styles = StyleSheet.create({
    camera: {
        position: "absolute",
        top: 120,
        left: 0,
        right: 0,
        height: 500,
    },
});
