import type { ComponentType } from "react";

// products.form の実際の値（10種類、2026-08-30 時点で確認済み）を
// 8種のアイコン・英語ラベルに対応付ける。DB のスキーマは変更しない。
export type ProductForm =
  | "tablet"
  | "pill"
  | "capsule"
  | "granule"
  | "powder"
  | "liquid"
  | "patch"
  | "cream"
  | "ointment"
  | "eye_drops";

interface IconProps {
  size?: number;
  strokeWidth?: number;
}

// 錠剤：円＋横線（1本の割線）
function TabletIcon({ size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M6.5 12h11" />
    </svg>
  );
}

// 丸薬（正露丸）：小さな円を3つ並べる。錠剤との違いを形で示す
function PillIcon({ size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6.5" cy="12" r="2.4" />
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="17.5" cy="12" r="2.4" />
    </svg>
  );
}

// カプセル：中央に仕切り線のある錠剤形
function CapsuleIcon({ size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="8.5" width="18" height="7" rx="3.5" />
      <line x1="12" y1="8.5" x2="12" y2="15.5" />
    </svg>
  );
}

// 顆粒・散剤：粒をまいたような点の集まり
function GranuleIcon({ size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="7.5" cy="8.5" r="1" />
      <circle cx="13" cy="6.5" r="1" />
      <circle cx="17" cy="10" r="1" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="14.5" r="1" />
      <circle cx="10.5" cy="17.5" r="1" />
      <circle cx="16.5" cy="17" r="1" />
    </svg>
  );
}

// 液剤：中身の線が入った小瓶
function LiquidIcon({ size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 3h4v3.5l2.5 3V19a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V9.5l2.5-3V3z" />
      <line x1="7.5" y1="14" x2="16.5" y2="14" />
    </svg>
  );
}

// 貼付剤：湿布のマーク（カテゴリアイコンの筋肉痛・関節痛と同じ実物を指すため同形にする）
function PatchFormIcon({ size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <line x1="7" y1="10" x2="17" y2="10" />
      <line x1="7" y1="13" x2="17" y2="13" />
      <line x1="7" y1="16" x2="14" y2="16" />
    </svg>
  );
}

// 軟膏・クリーム：チューブ
function OintmentIcon({ size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 3h6l0.8 3.5H8.2L9 3z" />
      <path d="M8.2 6.5h7.6l-1 12.5a2 2 0 0 1-2 1.8h-1.6a2 2 0 0 1-2-1.8l-1-12.5z" />
    </svg>
  );
}

// 点眼：先の細いドロッパー容器
function EyeDropsIcon({ size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.5 3h3v4l2 2.5V18a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3V9.5l2-2.5V3z" />
      <circle cx="12" cy="14" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

interface ProductFormInfo {
  label: string;
  Icon: ComponentType<IconProps>;
}

// granule/powder、cream/ointment は実物の見分けが難しいため同じ表示に統合する。
// spray に該当する商品が無いため、対応するアイコンは用意していない
const PRODUCT_FORM_INFO: Record<ProductForm, ProductFormInfo> = {
  tablet: { label: "Tablets", Icon: TabletIcon },
  pill: { label: "Pills", Icon: PillIcon },
  capsule: { label: "Capsules", Icon: CapsuleIcon },
  granule: { label: "Granules", Icon: GranuleIcon },
  powder: { label: "Granules", Icon: GranuleIcon },
  liquid: { label: "Liquid", Icon: LiquidIcon },
  patch: { label: "Patch", Icon: PatchFormIcon },
  cream: { label: "Ointment", Icon: OintmentIcon },
  ointment: { label: "Ointment", Icon: OintmentIcon },
  eye_drops: { label: "Eye drops", Icon: EyeDropsIcon },
};

export function getProductFormInfo(form: string): ProductFormInfo | undefined {
  return PRODUCT_FORM_INFO[form as ProductForm];
}
