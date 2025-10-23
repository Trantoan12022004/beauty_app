import React from "react";
import Gradient from "@/assets/icons/Gradient";
import Logo from "@/assets/icons/Logo";
import { Box } from "@/components/ui/box";
import { Dimensions, ImageBackground, ScrollView } from "react-native";
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
import { Bolt, BookImage, Camera, ChevronRight, PencilOff } from "lucide-react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import ImagePicker from "react-native-image-crop-picker";
export default function Home() {
    const router = useRouter();
    const width = Dimensions.get("window").width;

    const data = [
        {
            title: "Chỉnh sửa",
            desc: "Chỉnh sửa cơ thể & hơn thế nữa",
            image: require("@/assets/images/img_home_banner_1.webp"),
        },
        {
            title: "Trang điểm",
            desc: "Hiệu ứng tự nhiên & sắc nét",
            image: require("@/assets/images/img_home_banner_2.webp"),
        },
        {
            title: "Trang điểm",
            desc: "Hiệu ứng tự nhiên & sắc nét",
            image: require("@/assets/images/img_home_banner_3.webp"),
        },
    ];

    const makeupList = [
        {
            title: "Filter",
            desc: "Chỉnh sửa cơ thể & hơn thế nữa",
            image: require("@/assets/images/img_makeup_home_1.webp"),
        },
        {
            title: "Filter",
            desc: "Chỉnh sửa cơ thể & hơn thế nữa",
            image: require("@/assets/images/img_makeup_home_2.webp"),
        },
        {
            title: "Filter",
            desc: "Chỉnh sửa cơ thể & hơn thế nữa",
            image: require("@/assets/images/img_makeup_home_3.webp"),
        },
        {
            title: "Filter",
            desc: "Chỉnh sửa cơ thể & hơn thế nữa",
            image: require("@/assets/images/img_makeup_home_4.webp"),
        },
    ];
    return (
        <Box className="flex-1 bg-background-0 h-[100vh]">
            <SafeAreaView>
                <ScrollView>
                    <VStack>
                        <LinearGradient
                            colors={["#3b82f6", "#1e40af"]} // tương đương từ blue-500 đến blue-900
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="w-full h-24"
                        >
                            <HStack space="xl" className="justify-between mt-12 mb-4 px-4">
                                <Text size="xl" className="text-white">Camera Sweet Makeup App</Text>
                                <Pressable onPress={() => console.log("Hello")} className="">
                                    <Bolt size={24} color="white" />
                                </Pressable>
                            </HStack>
                        </LinearGradient>

                        <Carousel
                            width={width}
                            height={180}
                            autoPlay
                            data={data}
                            scrollAnimationDuration={1500}
                            renderItem={({ item }) => (
                                <ImageBackground
                                    source={item.image}
                                    style={{ width, height: 180 }}
                                    // imageStyle={{ borderRadius: 16 }}
                                >
                                    <VStack className="flex-1 justify-center px-6 bg-black/20">
                                        <Text className="text-white text-3xl font-bold">
                                            {item.title}
                                        </Text>
                                        <Text className="text-white text-lg mt-2">{item.desc}</Text>
                                    </VStack>
                                </ImageBackground>
                            )}
                        />

                        <HStack className="my-4 mx-10 justify-between">
                            <Card size="sm" variant="ghost" className="">
                                <Pressable
                                    onPress={() => router.push("/selfie")}
                                    className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-2"
                                >
                                    <Camera size={28} color="white" />
                                </Pressable>
                                <Text size="sm" bold>
                                    Tự sướng
                                </Text>
                            </Card>
                            <Card size="sm" variant="ghost" className="">
                                <Pressable
                                    onPress={() => console.log("click")}
                                    className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center mb-2"
                                >
                                    <PencilOff size={28} color="white" />
                                </Pressable>
                                <Text size="sm" bold>
                                    Chỉnh sửa
                                </Text>
                            </Card>

                            <Card size="sm" variant="ghost" className="">
                                <Pressable
                                    onPress={() => console.log("click")}
                                    className="w-16 h-16 bg-pink-500 rounded-full items-center justify-center mb-2"
                                >
                                    <BookImage size={28} color="white" />
                                </Pressable>
                                <Text size="sm" bold>
                                    Bộ sưu tập
                                </Text>
                            </Card>
                        </HStack>

                        <Box className="bg-primary-500 p-5 w-full h-32">
                            <Text className="text-typography-0">Quảng cáo ở đây</Text>
                        </Box>

                        <Card size="sm" variant="ghost">
                            <HStack space="xl" className="justify-between">
                                <Heading size="sm" className="text-black ">
                                    Trang điểm
                                </Heading>
                                <Pressable
                                    onPress={() => console.log("Hello")}
                                    className="d-flex flex-row items-center"
                                >
                                    <Text size="sm" className="text-blue-700 ">
                                        Thêm
                                    </Text>

                                    <ChevronRight size={16} color="blue" />
                                </Pressable>
                            </HStack>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <HStack className="mt-4">
                                    {makeupList.map((item, index) => (
                                        <Pressable key={index} className="mr-2">
                                            <Image
                                                source={item.image}
                                                alt={item.title}
                                                className="w-28 h-40 rounded-xl"
                                                resizeMode="cover"
                                            />
                                        </Pressable>
                                    ))}
                                </HStack>
                            </ScrollView>
                        </Card>

                        <Card size="sm" variant="ghost">
                            <HStack space="xl" className="justify-between">
                                <Heading size="sm" className="text-black ">
                                    Trang điểm
                                </Heading>
                                <Pressable
                                    onPress={() => console.log("Hello")}
                                    className="d-flex flex-row items-center"
                                >
                                    <Text size="sm" className="text-blue-700 ">
                                        Thêm
                                    </Text>

                                    <ChevronRight size={16} color="blue" />
                                </Pressable>
                            </HStack>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <HStack className="mt-4">
                                    {makeupList.map((item, index) => (
                                        <Pressable key={index} className="mr-2">
                                            <Image
                                                source={item.image}
                                                alt={item.title}
                                                className="w-28 h-40 rounded-xl"
                                                resizeMode="cover"
                                            />
                                        </Pressable>
                                    ))}
                                </HStack>
                            </ScrollView>
                        </Card>
                    </VStack>
                </ScrollView>
            </SafeAreaView>
        </Box>
    );
}
