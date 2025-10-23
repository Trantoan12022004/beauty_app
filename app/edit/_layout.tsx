import { Stack } from "expo-router";

export default function EditLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: "Chỉnh sửa ảnh",
                }}
            />
            <Stack.Screen
                name="crop"
                options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "none",
                    title: "Cắt ảnh",
                }}
            />
        </Stack>
    );
}
