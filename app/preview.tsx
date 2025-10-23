import { ArrowLeft } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/components/ui/hstack";
import { LinearGradient } from "expo-linear-gradient";

export default function PreviewScreen() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams<{ photoUri?: string }>();

  console.log("Original photoUri:", photoUri);

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <SafeAreaView edges={["top"]} className="absolute top-5 left-0 right-0 z-10">
        <HStack className="justify-between items-center px-4 py-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 items-center justify-center bg-background-950/50 rounded-full"
          >
            <ArrowLeft color="#ffffff" size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="w-32 h-12 rounded-md overflow-hidden"
          >
            <LinearGradient
              colors={["#3b82f6", "#1e40af"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-1 justify-center items-center"
            >
              <Text className="text-white text-center font-medium text-lg">
                Tiếp tục
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </HStack>
      </SafeAreaView>

      {/* Ảnh Preview */}
      <View className="flex-1 justify-center items-center">
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            resizeMode="contain" // ✅ Giữ tỉ lệ, không cắt ảnh
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <Text className="text-white">Không có ảnh để hiển thị</Text>
        )}
      </View>
    </View>
  );
}
