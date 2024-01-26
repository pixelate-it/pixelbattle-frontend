
interface IconProps {
    className?: string;
    icon: string;
    size?: number;
    viewBoxSize?: number;
}

export function Icon({ className, icon, size = 15, viewBoxSize = 17 }: IconProps) {

    return (<svg className={className} width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} >
        <use href={`/images/icons/minify/${icon}-min.svg#icon`}></use>
    </svg>)
}