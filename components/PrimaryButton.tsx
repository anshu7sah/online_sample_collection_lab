import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle; // extra style for button container
  textStyle?: TextStyle; // extra style for text
};

export default function PrimaryButton({
  label,
  onPress,
  disabled,
  style,
  textStyle,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        disabled && styles.disabled,
        style, // apply extra container style
      ]}
    >
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#008080",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
