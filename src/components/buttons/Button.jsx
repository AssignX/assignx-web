import React from "react"


export default function Button({
    text = "button",
    color = "gray", // red | 
    textSize = "text-sm",
    Icon,
    onClick,
}){
    // 색상 매핑
    const colors = {
        red: {
            bg: "bg-[var(--color-red)]",
            text: "text-[var(--color-white)]",
            hover: "hover:opacity-90",
        },
        lightgray: {
            bg: "bg-[var(--color-light-gray)]",
            text: "text-black",
            hover: "hover:opacity-90",
        },
        gold: {
            bg: "bg-[var(--color-gold)]",
            text: "text-[var(--color-white)]",
            hover: "hover:opacity-90",
        }
    };

    const selected = colors[color] || colors.red;

    return(
        <button
            type="button"
            onClick={onClick}
            style={{ cursor: 'pointer' }}
            className={`
                flex items-center justify-center gap-1
                ${selected.bg} ${selected.text} ${selected.hover}
                w-auto h-[30px] ${textSize}
                ${Icon ? "px-[10px]" : "px-4"}
                focus:ring-0 focus:ouline-none font-normal rounded-none
                transition duration-200`}
        >
            {Icon && <Icon className="w-4 h-4 relative top-[1px]" aria-hidden="true" />}
            {text}
        </button>
    );
}