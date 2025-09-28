import React from "react";
import Button from "./Button";

export default function ButtonGroup({
    buttons=[],
    direction = "row", // "row" || "col"
    gap = "gap-[5px]",
}) {
    return (
        <div className={`flex ${direction === "col" ?  "flex-col" : "flex-row"} ${gap}`}>
            {buttons.map((btn, index) => (
                <Button
                    key={index}
                    text={btn.text}
                    color={btn.color}
                    Icon={btn.Icon}
                    onClick={btn.onClick}
                    />
            ))}
        </div>
    );
}