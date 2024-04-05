import { useState } from "react";

type OnTap = (event: React.TouchEvent<HTMLDivElement>) => void;

const useTappable = (onTap: OnTap) => {
    const [isSwipe, setIsSwipe] = useState(false);

    const onTouchStart = () => setIsSwipe(false)

    const onTouchMove = () => {
        if (!isSwipe) { // Avoid uneccessary constant state updates
            setIsSwipe(true)
        }
    }

    const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!isSwipe) {
            onTap(event)
        }
    }
    
    return { onTouchStart, onTouchEnd, onTouchMove }
};

export default useTappable;