import React, { useRef, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import LottieView, { AnimationObject } from "lottie-react-native";

interface LottieProps {
  source: string | AnimationObject | { uri: string };
  style?: StyleProp<ViewStyle>;
  speed?: number;
  autoPlay?: boolean;
  loop?: boolean;
}

export default function Lottie({
  source,
  style,
  autoPlay,
  loop,
  speed,
}: LottieProps) {
  const animation = useRef<LottieView>(null);
  useEffect(() => {
    if (animation) animation.current?.play();
    return () => {
      if (animation) {
        animation.current?.pause();
        animation.current?.reset();
      }
    };
  }, [animation]);

  return (
    <LottieView
      autoPlay={autoPlay}
      ref={animation}
      style={style}
      source={source}
      loop={loop}
      speed={speed}
    />
  );
}
