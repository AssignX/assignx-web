import React from "react";
import PropTypes from "prop-types";
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


ButtonGroup.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      color: PropTypes.oneOf(["red", "lightgray", "gold"]),
      Icon: PropTypes.elementType,
      onClick: PropTypes.func,
    })
  ), // 버튼 리스트
  direction: PropTypes.oneOf(["row", "col"]), // row 또는 col
  gap: PropTypes.string, // tailwind gap 클래스
};