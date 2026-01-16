import { Box, Typography } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import type { PhoneNumberInputTypes } from "../../types/components";
import type { AllFormsTypes, FormiksTypes } from "../../types/forms";

const arabicLocalization = {
  af: "أفغانستان",
  al: "ألبانيا",
  dz: "الجزائر",
  as: "ساموا الأمريكية",
  ad: "أندورا",
  ao: "أنغولا",
  ai: "أنغويلا",
  aq: "أنتاركتيكا",
  ag: "أنتيغوا وبربودا",
  ar: "الأرجنتين",
  am: "أرمينيا",
  aw: "أروبا",
  au: "أستراليا",
  at: "النمسا",
  az: "أذربيجان",
  bs: "جزر البهاما",
  bh: "البحرين",
  bd: "بنغلاديش",
  bb: "بربادوس",
  by: "بيلاروس",
  be: "بلجيكا",
  bz: "بليز",
  bj: "بنين",
  bm: "برمودا",
  bt: "بوتان",
  bo: "بوليفيا",
  ba: "البوسنة والهرسك",
  bw: "بوتسوانا",
  br: "البرازيل",
  io: "إقليم المحيط الهندي البريطاني",
  bn: "بروناي",
  bg: "بلغاريا",
  bf: "بوركينا فاسو",
  bi: "بوروندي",
  cv: "الرأس الأخضر",
  kh: "كمبوديا",
  cm: "الكاميرون",
  ca: "كندا",
  ky: "جزر كايمان",
  cf: "جمهورية أفريقيا الوسطى",
  td: "تشاد",
  cl: "تشيلي",
  cn: "الصين",
  co: "كولومبيا",
  km: "جزر القمر",
  cg: "الكونغو",
  cd: "جمهورية الكونغو الديمقراطية",
  ck: "جزر كوك",
  cr: "كوستاريكا",
  ci: "ساحل العاج",
  hr: "كرواتيا",
  cu: "كوبا",
  cy: "قبرص",
  cz: "جمهورية التشيك",
  dk: "الدانمارك",
  dj: "جيبوتي",
  dm: "دومينيكا",
  do: "جمهورية الدومينيكان",
  ec: "الإكوادور",
  eg: "مصر",
  sv: "السلفادور",
  gq: "غينيا الاستوائية",
  er: "إريتريا",
  ee: "إستونيا",
  et: "إثيوبيا",
  fj: "فيجي",
  fi: "فنلندا",
  fr: "فرنسا",
  ga: "الغابون",
  gm: "غامبيا",
  ge: "جورجيا",
  de: "ألمانيا",
  gh: "غانا",
  gr: "اليونان",
  gd: "غرينادا",
  gt: "غواتيمالا",
  gn: "غينيا",
  gw: "غينيا بيساو",
  gy: "غيانا",
  ht: "هايتي",
  hn: "هندوراس",
  hu: "المجر",
  is: "آيسلندا",
  in: "الهند",
  id: "إندونيسيا",
  ir: "إيران",
  iq: "العراق",
  ie: "أيرلندا",
  il: "إسرائيل",
  it: "إيطاليا",
  jm: "جامايكا",
  jp: "اليابان",
  jo: "الأردن",
  kz: "كازاخستان",
  ke: "كينيا",
  ki: "كيريباتي",
  kp: "كوريا الشمالية",
  kr: "كوريا الجنوبية",
  kw: "الكويت",
  kg: "قيرغيزستان",
  la: "لاوس",
  lv: "لاتفيا",
  lb: "لبنان",
  ls: "ليسوتو",
  lr: "ليبيريا",
  ly: "ليبيا",
  li: "ليختنشتاين",
  lt: "ليتوانيا",
  lu: "لوكسمبورغ",
  mk: "مقدونيا",
  mg: "مدغشقر",
  mw: "مالاوي",
  my: "ماليزيا",
  mv: "المالديف",
  ml: "مالي",
  mt: "مالطا",
  mh: "جزر مارشال",
  mr: "موريتانيا",
  mu: "موريشيوس",
  mx: "المكسيك",
  fm: "ميكرونيسيا",
  md: "مولدوفا",
  mc: "موناكو",
  mn: "منغوليا",
  me: "الجبل الأسود",
  ma: "المغرب",
  mz: "موزمبيق",
  mm: "ميانمار",
  na: "ناميبيا",
  nr: "ناورو",
  np: "نيبال",
  nl: "هولندا",
  nz: "نيوزيلندا",
  ni: "نيكاراغوا",
  ne: "النيجر",
  ng: "نيجيريا",
  no: "النرويج",
  om: "عمان",
  pk: "باكستان",
  pw: "بالاو",
  pa: "بنما",
  pg: "بابوا غينيا الجديدة",
  py: "باراغواي",
  pe: "بيرو",
  ph: "الفلبين",
  pl: "بولندا",
  pt: "البرتغال",
  qa: "قطر",
  ro: "رومانيا",
  ru: "روسيا",
  rw: "رواندا",
  kn: "سانت كيتس ونيفيس",
  lc: "سانت لوسيا",
  vc: "سانت فنسنت والغرينادين",
  ws: "ساموا",
  sm: "سان مارينو",
  st: "ساو تومي وبرينسيب",
  sa: "السعودية",
  sn: "السنغال",
  rs: "صربيا",
  sc: "سيشيل",
  sl: "سيراليون",
  sg: "سنغافورة",
  sk: "سلوفاكيا",
  si: "سلوفينيا",
  sb: "جزر سليمان",
  so: "الصومال",
  za: "جنوب أفريقيا",
  es: "إسبانيا",
  lk: "سريلانكا",
  sd: "السودان",
  sr: "سورينام",
  sz: "سوازيلاند",
  se: "السويد",
  ch: "سويسرا",
  sy: "سوريا",
  tw: "تايوان",
  tj: "طاجيكستان",
  tz: "تنزانيا",
  th: "تايلاند",
  tl: "تيمور الشرقية",
  tg: "توغو",
  to: "تونغا",
  tt: "ترينيداد وتوباغو",
  tn: "تونس",
  tr: "تركيا",
  tm: "تركمانستان",
  tv: "توفالو",
  ug: "أوغندا",
  ua: "أوكرانيا",
  ae: "الإمارات العربية المتحدة",
  gb: "المملكة المتحدة",
  us: "الولايات المتحدة",
  uy: "أوروغواي",
  uz: "أوزبكستان",
  vu: "فانواتو",
  ve: "فنزويلا",
  vn: "فيتنام",
  ye: "اليمن",
  zm: "زامبيا",
  zw: "زيمبابوي",
};

const PhoneNumberInput = <T extends AllFormsTypes>({
  value,
  onChange,
  country,
  label,
  name, optional,
  formik
}: PhoneNumberInputTypes & FormiksTypes<T>) => {
  const error =
    formik.touched[name as keyof T] && Boolean(formik.errors[name as keyof T]);
  const helperText = error
    ? (formik.errors[name as keyof T] as string)
    : undefined;

  const handlePhoneChange = (
    value: string,
    data: { dialCode: string; countryCode: string }
  ) => {
    if (value.length >= data.dialCode.length) {
      const val = value.slice(data.dialCode.length);
      const formatted = value.startsWith(`+${data.dialCode}-`)
        ? value
        : `+${data.dialCode}-${val}`;
      if (onChange) {
        onChange(formatted);
      }
      formik.setFieldValue(`${name}`, formatted)
      return;
    }
    if (onChange) {
      onChange(value);
    }
    formik.setFieldValue(`${name}`, value)
  };

  return (
    <Box className="grid justify-stretch w-full items-center gap-1">
      {label && (
        <Box className={`flex justify-start items-center gap-1`}>
          <Typography variant="subtitle1" className="!font-[400]">
            {label}
          </Typography>
          {!optional && <span className={`text-red-500`}>*</span>}
        </Box>
      )}
      <PhoneInput
        country={country || "sa"}
        value={value}
        onChange={handlePhoneChange}
        // onlyCountries={["sa"]}
        inputProps={{ name }}
        countryCodeEditable={false}
        localization={arabicLocalization}
      />
      {error && <Typography className={`!text-[#d32f2f]`} variant="body2">{helperText}</Typography>}
    </Box>
  );
};

export default PhoneNumberInput;
