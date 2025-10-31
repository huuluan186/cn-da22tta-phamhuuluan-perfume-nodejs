import {memo} from "react";

const Button = ({ 
    type = "button",
    text, 
    textSize = 'text-base', 
    textColor = 'text-white', 
    bgColor = 'bg-primary', 
    hoverText = "hover:text-primary",
    hoverBg = "hover:bg-white",
    IcAfter, 
    IcBefore, 
    onClick, 
    width = 'w-full', 
    height = 'h-full',
    rounded='',
    outline, 
}) => {
    return (
        <div className='relative flex justify-center items-center'>
                <button 
                    type = { type } 
                    className={
                        `py-2 px-4 
                        ${textSize}
                        ${textColor} 
                        ${bgColor} 
                        ${width} 
                        ${height}
                        ${hoverBg}
                        ${hoverText}
                        ${outline}  
                        ${rounded} 
                        flex font-medium items-center justify-center gap-2 `
                    } 
                    onClick={onClick}
                >
                    {IcBefore && <span className="text-2xl"> <IcBefore/> </span>}
                    <span className = {`${textSize ? textSize : ''}`}> {text} </span>
                    {IcAfter && <span className="text-2xl ml-[-8px]"> <IcAfter/> </span>}
                </button>
        </div>
    );
};

export default memo(Button);