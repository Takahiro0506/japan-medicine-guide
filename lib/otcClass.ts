export type OtcClass = "class1" | "designated_class2" | "class2" | "class3";

interface OtcClassInfo {
  en: string;
  ja: string;
  isClass1: boolean;
}

// designated_class2 と class2 は同じ表示に統合する
const OTC_CLASS_INFO: Record<OtcClass, OtcClassInfo> = {
  class1: { en: "Class 1 medicine", ja: "第1類医薬品", isClass1: true },
  designated_class2: { en: "Class 2 medicine", ja: "第2類医薬品", isClass1: false },
  class2: { en: "Class 2 medicine", ja: "第2類医薬品", isClass1: false },
  class3: { en: "Class 3 medicine", ja: "第3類医薬品", isClass1: false },
};

export function getOtcClassInfo(otcClass: OtcClass): OtcClassInfo {
  return OTC_CLASS_INFO[otcClass];
}
