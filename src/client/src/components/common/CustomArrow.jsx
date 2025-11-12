const CustomArrow = ({
    type = "next", // "next" hoặc "prev"
    onClick,
    className = "",
    style = {},
    size = 40, // chiều rộng/chiều cao SVG
    color = "#333",
    hoverColor = "#000",
}) => {
    const isPrev = type === "prev";

    return (
        <button
            onClick={onClick}
            className={`${className} custom-slick-arrow`}
            aria-label={isPrev ? "Previous" : "Next"}
            style={{
                ...style,
                '--arrow-color': color,
                '--arrow-hover-color': hoverColor,
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-colors duration-300 ease-in-out"
            >
                {isPrev ? <path d="M15 18L9 12L15 6" /> : <path d="M9 18L15 12L9 6" />}
            </svg>
        </button>
    );
};

export default CustomArrow;
