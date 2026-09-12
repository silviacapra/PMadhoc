function Svg({ size = 20, color = "currentColor", strokeWidth = 2, children, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {children}
    </svg>
  );
}

export function LogoIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  );
}

export function TriDotIcon({ size = 20, color = "#4CAF88", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <circle cx="12" cy="5" r="3.4" fill={color} />
      <circle cx="5.5" cy="18" r="3.4" fill={color} />
      <circle cx="18.5" cy="18" r="3.4" fill={color} />
    </svg>
  );
}

export function DashboardIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </Svg>
  );
}

export function RoadmapIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </Svg>
  );
}

export function TemplatesIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </Svg>
  );
}

export function StatusReportIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 17v-6M13 17V9M17 17v-3" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </Svg>
  );
}

export function KnowledgeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
      <path d="M18 4v16" />
    </Svg>
  );
}

export function WarningIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l10 18H2L12 3z" />
      <path d="M12 10v4" />
      <path d="M12 17.5v.01" />
    </Svg>
  );
}

export function LightbulbIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.7 10.7c.6.5 1 1.3 1.1 2.1v.2h5.2v-.2c.1-.8.5-1.6 1.1-2.1A6 6 0 0 0 12 3z" />
    </Svg>
  );
}

export function BuildingIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="3" width="10" height="18" rx="1" />
      <path d="M14 21v-4h6v4" />
      <path d="M14 8h6v13" />
      <path d="M7 7h1M10 7h1M7 11h1M10 11h1M7 15h1M10 15h1" />
    </Svg>
  );
}

export function StakeholdersIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2" />
      <circle cx="17" cy="8.5" r="2.5" />
      <path d="M15.8 13.9c2.9.3 5.2 2.7 5.2 6.1" />
    </Svg>
  );
}

export function ChatbotIcon(props) {
  return (
    <Svg {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-.9L3 21l1.9-5.5a8.38 8.38 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
    </Svg>
  );
}

export function LogoutIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </Svg>
  );
}

export function PlusIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function CheckIcon(props) {
  return (
    <Svg strokeWidth={3} {...props}>
      <path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <Svg strokeWidth={2.5} {...props}>
      <path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

export function ExternalLinkIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </Svg>
  );
}

export function PencilIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </Svg>
  );
}

export function TrashIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </Svg>
  );
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </Svg>
  );
}

export function LockIcon(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Svg>
  );
}

export function DownloadIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
    </Svg>
  );
}

export function SendIcon(props) {
  return (
    <Svg {...props}>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </Svg>
  );
}

export const NAV_ICON_MAP = {
  dashboard: DashboardIcon,
  empresa: BuildingIcon,
  roadmap: RoadmapIcon,
  templates: TemplatesIcon,
  riesgos: WarningIcon,
  lecciones: LightbulbIcon,
  statusreport: StatusReportIcon,
  stakeholders: StakeholdersIcon,
  knowledge: KnowledgeIcon,
  chatbot: ChatbotIcon,
};
