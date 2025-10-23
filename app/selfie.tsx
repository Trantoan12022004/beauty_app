import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import Slider from "@react-native-community/slider";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { FlipHorizontal, X, ZapOff, ZoomIn } from "lucide-react-native";
import { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SelfieScreen = () => {
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;
    const h = height * 0.6;
    const router = useRouter();
    const cameraRef = useRef<CameraView>(null);
    const [facing, setFacing] = useState<CameraType>("back");
    const [flash, setFlash] = useState(false);
    const [zoom, setZoom] = useState(0);
    const [showZoomSlider, setShowZoomSlider] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

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

    const toggleFlash = () => {
        setFlash((current) => !current);
    };

    const toggleZoom = () => {
        setShowZoomSlider((current) => !current);
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
            });
            console.log("Photo taken:", photo);
            router.push({
                pathname: "/preview",
                params: {
                    photoUri: photo.uri,

                },
            });
        }
    };

    return (
        <View className="flex-1 bg-background-950">
            {/* Camera View */}
            <CameraView
                ref={cameraRef}
                style={[styles.camera, { height: height * 0.7 }]}
                facing={facing}
                enableTorch={flash}
                zoom={zoom}
            />

            {/* Header - Nút đóng và các điều khiển */}
            <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
                <HStack className="justify-between items-center px-4 py-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                    >
                        <X color="#ffffff" size={24} />
                    </TouchableOpacity>

                    <HStack className="gap-2">
                        <TouchableOpacity
                            onPress={toggleZoom}
                            className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                        >
                            <ZoomIn color="#ffffff" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={toggleFlash}
                            className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
                        >
                            <ZapOff color="#ffffff" size={24} />
                        </TouchableOpacity>
                    </HStack>
                </HStack>
            </SafeAreaView>

            {/* Footer - Nút chụp và đổi camera */}
            <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0 z-10">
                <VStack className="items-center pb-8 gap-4">
                    {showZoomSlider && (
                        <Center className="w-[300px] h-[80px] bg-background-950/50 rounded-xl px-4">
                            <VStack className="w-full gap-2">
                                <HStack className="justify-between items-center">
                                    <Text className="text-typography-0 text-sm font-medium">
                                        Zoom: {(1 + zoom * 9).toFixed(1)}x
                                    </Text>
                                    <ZoomIn color="#ffffff" size={16} />
                                </HStack>
                                <Slider
                                    style={{ width: "100%", height: 40 }}
                                    minimumValue={0}
                                    maximumValue={1}
                                    value={zoom}
                                    onValueChange={(value) => setZoom(value)}
                                    minimumTrackTintColor="#ffffff"
                                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                                    thumbTintColor="#ffffff"
                                />
                            </VStack>
                        </Center>
                    )}

                    <HStack className="items-center justify-center gap-12 px-4">
                        {/* Placeholder cho cân đối */}
                        <View className="w-16 h-16" />

                        {/* Nút chụp */}
                        <TouchableOpacity
                            onPress={takePicture}
                            className="w-20 h-20 items-center justify-center"
                        >
                            <View className="w-20 h-20 rounded-full border-4 border-background-0 items-center justify-center">
                                <View className="w-16 h-16 rounded-full bg-background-0" />
                            </View>
                        </TouchableOpacity>

                        {/* Nút đổi camera */}
                        <TouchableOpacity
                            onPress={toggleCameraFacing}
                            className="w-16 h-16 items-center justify-center bg-background-950/50 rounded-full"
                        >
                            <FlipHorizontal color="#ffffff" size={28} />
                        </TouchableOpacity>
                    </HStack>
                </VStack>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    camera: {
        position: "absolute",
        top: 100,
        left: 0,
        right: 0,
    },
});

export default SelfieScreen;
