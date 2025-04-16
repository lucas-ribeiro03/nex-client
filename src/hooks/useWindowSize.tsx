import { useEffect, useState } from "react";

export function useWindowSize(ignoreKeyboard = true, keyboardThreshold = 150) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isKeyboardOpen: false,
  });

  useEffect(() => {
    const initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDiff = Math.abs(currentHeight - initialHeight);
      const isKeyboard = ignoreKeyboard && heightDiff > keyboardThreshold;

      setWindowSize({
        width: window.innerWidth,
        height: currentHeight,
        isKeyboardOpen: isKeyboard,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ignoreKeyboard, keyboardThreshold]);

  return windowSize;
}
