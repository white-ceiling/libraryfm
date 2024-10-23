import React from "react";

type StrictButtonProps = {
    strictMode: boolean,
    setStrict: React.Dispatch<React.SetStateAction<boolean>>
}
export default function StrictButton (props: StrictButtonProps) {    
    const onClickHandler = () => {
        props.setStrict(!props.strictMode);
    }

    return (
        <button type="button" className={(props.strictMode ? "bg-red-500 hover:bg-red-700" : "bg-emerald-500 hover:bg-emerald-700") + " px-1"} onClick={onClickHandler}>
            {(props.strictMode ? "strict" : "soft")}
        </button>
    );
}
