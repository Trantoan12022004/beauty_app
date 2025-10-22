import React, { useState } from "react";
import { View, Image, Button, StyleSheet } from "react-native";
import ImagePicker from "react-native-image-crop-picker";

export default function ImageCropExample() {
    const [image, setImage] = useState<string | null>(null);

    const openCamera = async () => {
        const photo = await ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
            compressImageQuality: 0.8,
        });
        setImage(photo.path);
    };
    return (
        <View style={styles.container}>
            <Button title="Chụp ảnh" onPress={openCamera} />

            {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
    image: { width: 300, height: 300, borderRadius: 12, marginTop: 20 },
});
