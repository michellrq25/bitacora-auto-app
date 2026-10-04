import React from 'react';

interface SolesIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Icono vectorial oficial para Moneda Peruana (Soles S/)
 * Estilizado armónicamente con el set de iconos de Lucide (strokeWidth 2, viewBox 24x24)
 */
export function SolesIcon({
  className = 'h-4 w-4',
  size,
  ...props
}: SolesIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" />
      <text
        x="12"
        y="15.8"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="800"
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fill="currentColor"
        stroke="none"
      >
        S/
      </text>
    </svg>
  );
}
