import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface VignetteOverlayProps {
    intensity: number; // 0 đến 1
    width: number;
    height: number;
}

export const VignetteOverlay: React.FC<VignetteOverlayProps> = ({ intensity, width, height }) => {
    if (intensity === 0) return null;

    const opacity = intensity * 0.8; // Tối đa 80% opacity

    return (
        <View
            style={[
                StyleSheet.absoluteFill,
                {
                    width,
                    height,
                },
            ]}
            pointerEvents="none"
        >
            {/* Gradient từ trên xuống */}
            <LinearGradient
                colors={[`rgba(0,0,0,${opacity})`, "transparent"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.3 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Gradient từ dưới lên */}
            <LinearGradient
                colors={["transparent", `rgba(0,0,0,${opacity})`]}
                start={{ x: 0.5, y: 0.7 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Gradient từ trái sang */}
            <LinearGradient
                colors={[`rgba(0,0,0,${opacity})`, "transparent"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0.3, y: 0.5 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Gradient từ phải sang */}
            <LinearGradient
                colors={["transparent", `rgba(0,0,0,${opacity})`]}
                start={{ x: 0.7, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
};
