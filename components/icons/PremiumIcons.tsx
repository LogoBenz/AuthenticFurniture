import React from 'react';

interface IconProps {
    className?: string;
}

// Premium Icon Set - 1.5px stroke for elegance, detailed geometry

export const SofaIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
        <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M4 18v2" />
        <path d="M20 18v2" />
        <path d="M12 4v5" />
        <path d="M2 13h20" />
    </svg>
);

export const BedIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4v16" />
        <path d="M2 8h18a2 2 0 0 1 2 2v10" />
        <path d="M2 17h20" />
        <path d="M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
        <path d="M10 12v.01" />
        <path d="M14 12v.01" />
    </svg>
);

export const ChairIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
        <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0v5Z" />
        <path d="M5 18v3" />
        <path d="M19 18v3" />
        <path d="M5 11h14" />
    </svg>
);

export const TableIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9h18v2H3z" />
        <path d="M4 11v8" />
        <path d="M20 11v8" />
        <path d="M9 11v5" />
        <path d="M15 11v5" />
        <path d="M5 9V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
    </svg>
);

export const DeskIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18v3H3z" />
        <path d="M4 9v10" />
        <path d="M20 9v10" />
        <path d="M8 9v6" />
        <path d="M16 9v6" />
        <path d="M8 15h8" />
        <path d="M10 9v2" />
        <path d="M14 9v2" />
    </svg>
);

export const CabinetIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M4 9h16" />
        <path d="M4 15h16" />
        <path d="M10 6h4" />
        <path d="M10 12h4" />
        <path d="M10 18h4" />
    </svg>
);

export const LampIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8l4 10H4L8 2Z" />
        <path d="M12 12v8" />
        <path d="M8 22h8" />
        <path d="M12 12a3 3 0 0 0 0 6" />
    </svg>
);

export const ShelfIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5h18" />
        <path d="M3 12h18" />
        <path d="M3 19h18" />
        <path d="M6 5v14" />
        <path d="M18 5v14" />
        <path d="M9 5v14" />
        <path d="M15 5v14" />
    </svg>
);

export const HomeIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
        <path d="M12 2v3" />
    </svg>
);

export const OfficeIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M12 12v.01" />
        <path d="M12 17v.01" />
    </svg>
);

export const HotelIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2h4" />
        <path d="M12 2v4" />
        <path d="M4 18a8 8 0 0 1 16 0" />
        <path d="M2 18h20" />
        <path d="M22 22H2" />
    </svg>
);

export const RestaurantIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        <path d="M12 21h9" />
    </svg>
);

export const OutdoorIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M6.34 17.66l-1.41 1.41" />
        <path d="M19.07 4.93l-1.41 1.41" />
    </svg>
);

export const WarehouseIcon = ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13" />
        <path d="M12 10v11" />
        <path d="M3 14h18" />
        <path d="M12 3l9 6" />
        <path d="M3 9 12 3" />
    </svg>
);

export const StrongIcon = ({ className }: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        className={className}
        fill="currentColor"
    >
        <path d="M47.208 13.072c-.908.092-2.261.193-3.728.193c-1.54 0-2.891-.113-4.016-.341c-3.035-.612-5.988-2.577-7.467-3.683c-1.477 1.105-4.426 3.068-7.463 3.683c-1.126.228-2.477.341-4.017.341c-1.463 0-2.819-.104-3.723-.193c-1 2.52-3.39 9.775-1.947 18.683C16.692 43.158 28.734 52.495 32 54.839c3.267-2.344 15.309-11.681 17.152-23.084c1.44-8.907-.944-16.161-1.944-18.683m-17.873-.066a26.697 26.697 0 0 0 2.664-1.592a26.699 26.699 0 0 0 2.669 1.592v11.279h-5.333V13.006m5.333 37.465A57.213 57.213 0 0 1 32 52.637a59.734 59.734 0 0 1-2.665-2.164V31.344h5.333v19.127m12.872-20.01H16.461a34.072 34.072 0 0 1-.276-5.294h31.629a34.19 34.19 0 0 1-.274 5.294" />
        <path d="M52.445 8.325a3.373 3.373 0 0 0-3.037-1.883c-.162 0-.325.011-.486.034c-.02.004-2.164.305-4.539.305c-1.328 0-2.453-.092-3.343-.271c-3.226-.65-6.795-3.664-6.831-3.694a3.401 3.401 0 0 0-4.416-.001c-.035.029-3.609 3.044-6.831 3.694c-.891.18-2.016.271-3.344.271c-2.383 0-4.519-.301-4.54-.305a3.601 3.601 0 0 0-.481-.033a3.381 3.381 0 0 0-3.039 1.877c-.539 1.108-5.127 11.043-2.998 24.22c2.651 16.37 20.813 28.404 21.585 28.908a3.392 3.392 0 0 0 3.712-.002c.771-.503 18.938-12.539 21.585-28.905c2.195-13.567-2.784-23.787-2.997-24.215m1.243 23.935c-2.526 15.612-20.063 27.226-20.81 27.713a1.606 1.606 0 0 1-1.755 0c-.747-.487-18.279-12.101-20.808-27.713c-2.1-12.997 2.636-22.746 2.834-23.155a1.618 1.618 0 0 1 1.672-.881c.022.003 2.275.322 4.796.322c1.449 0 2.693-.104 3.698-.307c3.71-.748 7.599-4.054 7.638-4.087a1.616 1.616 0 0 1 2.097 0c.038.033 3.921 3.339 7.636 4.087c1.005.203 2.246.307 3.697.307c2.521 0 4.771-.319 4.795-.322a1.616 1.616 0 0 1 1.672.881c.204.409 4.939 10.158 2.838 23.155" />
        <ellipse cx="32.001" cy="6.523" rx="1.228" ry="1.236" />
        <ellipse cx="48.771" cy="10.852" rx="1.229" ry="1.237" />
        <ellipse cx="51.838" cy="22.487" rx="1.228" ry="1.237" />
        <ellipse cx="50.032" cy="36.987" rx="1.228" ry="1.237" />
        <ellipse cx="42.647" cy="48.316" rx="1.229" ry="1.237" />
        <circle cx="32" cy="57.353" r="1.234" />
        <ellipse cx="21.354" cy="48.316" rx="1.227" ry="1.237" />
        <ellipse cx="13.966" cy="36.988" rx="1.229" ry="1.236" />
        <ellipse cx="12.162" cy="22.487" rx="1.228" ry="1.237" />
        <ellipse cx="15.177" cy="10.852" rx="1.228" ry="1.237" />
    </svg>
);

export const DesignedIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className={className}
        fill="currentColor"
    >
        <path d="M28.95 24.38V3.05H7.62V0H3.05v3.05H0v4.57h3.05v21.33h21.33V32h4.57v-3.05H32v-4.57Zm1.53 3.05h-3.05v3.05h-1.52v-3.05H4.57V6.1H1.53V4.57h3.04V1.52H6.1v3.05h21.33v21.34h3.05Z" />
        <path d="M6.1 6.1v19.81h19.81V6.1Zm18.28 9.14h-4.57v1.52h4.57v7.62h-4.57v-1.52h-1.52v1.52H7.62v-1.52h1.53v-1.53H7.62V7.62h16.76Z" />
        <path d="M18.29 16.76h1.52v1.53h-1.52Z" />
        <path d="M16.76 18.29h1.53v1.52h-1.53Zm0 3.04h1.53v1.53h-1.53Zm-1.52-1.52h1.52v1.52h-1.52Zm-4.57-4.57h3.05v-1.53h1.52v-3.04h-1.52V9.14h-3.05v1.53H9.15v3.04h1.52zm0 3.05h4.57v1.52h-4.57Zm-1.52 1.52h1.52v1.52H9.15Z" />
    </svg>
);

export const PricingIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
    >
        <path d="M7 18V7.052a1.05 1.05 0 0 1 1.968-.51l6.064 10.916a1.05 1.05 0 0 0 1.968-.51V6M5 10h14M5 14h14" />
    </svg>
);

export const DeliveryIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
    >
        <path d="M7 20q-1.25 0-2.125-.875T4 17H1.5l.45-2h2.825q.425-.475 1-.737T7 14t1.225.263t1 .737H13.4l2.1-9H4.55l.1-.425q.15-.7.687-1.137T6.6 4H18l-.925 4H20l3 4l-1 5h-2q0 1.25-.875 2.125T17 20t-2.125-.875T14 17h-4q0 1.25-.875 2.125T7 20m8.925-7h4.825l.1-.525L19 10h-2.375zm-.475-6.825L15.5 6l-2.1 9l.05-.175l.85-3.65zM.5 13.325l.5-2h5.5l-.5 2zm2-3.65l.5-2h6.5l-.5 2zM7 18q.425 0 .713-.288T8 17t-.288-.712T7 16t-.712.288T6 17t.288.713T7 18m10 0q.425 0 .713-.288T18 17t-.288-.712T17 16t-.712.288T16 17t.288.713T17 18" />
    </svg>
);

export const SupportIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className={className}
        fill="currentColor"
    >
        <path fillRule="evenodd" d="M22.033 3.847C22.697 1.924 24.51.5 26.688.5h2.03c2.725 0 4.855 2.248 4.855 4.922c0 1.93-1.116 3.707-2.893 4.503l-4.35 1.947a.98.98 0 0 0-.532.628h5.775a2 2 0 0 1 0 4h-7.816a2 2 0 0 1-2-2v-1.705c0-1.96 1.134-3.765 2.939-4.573l4.35-1.948a.93.93 0 0 0 .527-.852c0-.553-.426-.922-.855-.922h-2.03a.94.94 0 0 0-.874.653a2 2 0 1 1-3.78-1.306M40.6 1.435a2.669 2.669 0 0 1 4.698 1.734V9.5a2 2 0 0 1 0 3.999v1a2 2 0 0 1-4 0v-1h-5.086a2.73 2.73 0 0 1-2.075-4.505zm.698 8.065V6.775L38.968 9.5zm-28.222-8c2.044 0 3.847 1.273 4.584 3.158l2.41 6.165a6.07 6.07 0 0 1-1.298 6.44l-2.986 3.056c1.704 5.662 6.054 10.115 11.536 11.869l2.951-3.02a5.84 5.84 0 0 1 6.403-1.34l6.024 2.467c1.884.771 3.084 2.62 3.084 4.636v.569c0 6.583-5.226 12-11.77 12h-.488C15.74 47.5 1.332 33.048.767 15.095a2 2 0 0 1-.017-.263V13.5c0-6.583 5.226-12 11.77-12zm.859 4.614a.93.93 0 0 0-.86-.614h-.555c-4.248 0-7.77 3.538-7.77 8v1.146q.01.08.01.16C5.178 30.766 17.939 43.5 33.527 43.5h.488c4.248 0 7.77-3.538 7.77-8v-.569a1 1 0 0 0-.6-.934l-6.023-2.466a1.84 1.84 0 0 0-2.027.432l-3.006 3.076c-.954.977-2.42 1.458-3.859 1.01c-6.871-2.135-12.263-7.67-14.338-14.66c-.419-1.413.023-2.871.974-3.845l3.006-3.077a2.07 2.07 0 0 0 .433-2.188z" clipRule="evenodd" />
    </svg>
);

export const PeaceIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
    >
        <g fill="none" stroke="currentColor" strokeWidth="4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M26 36H6C4.89543 36 4 35.1046 4 34V8C4 6.89543 4.89543 6 6 6H42C43.1046 6 44 6.89543 44 8V34C44 35.1046 43.1046 36 42 36H34" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14H36" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21H18" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 28H16" />
            <path fill="currentColor" d="M30 33C33.3137 33 36 30.3137 36 27C36 23.6863 33.3137 21 30 21C26.6863 21 24 23.6863 24 27C24 30.3137 26.6863 33 30 33Z" />
            <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M30 40L34 42V31.4722C34 31.4722 32.8594 33 30 33C27.1406 33 26 31.5 26 31.5V42L30 40Z" />
        </g>
    </svg>
);
