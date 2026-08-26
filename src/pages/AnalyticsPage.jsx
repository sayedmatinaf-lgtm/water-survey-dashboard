/**
 * Centralized Translation Mapping for Questionnaire Analytics Data
 */

export const WATER_SOURCE_MAP = {
  'Household well': { en: 'Household well', fa: 'چاه خانگی' },
  'Urban water supply network': { en: 'Urban water supply network', fa: 'شبکه آبرسانی شهری' },
  'Shared well with neighbors': { en: 'Shared well with neighbors', fa: 'چاه مشترک با همسایگان' },
  'Tanker / water seller': { en: 'Tanker / water seller', fa: 'تانکر / فروشنده آب' },
  'Spring / Qanat': { en: 'Spring / Qanat', fa: 'چشمه / کاریز' },
  'Neighbor': { en: 'Neighbor', fa: 'همسایه' }
};

export const NETWORK_CONN_MAP = {
  'Connected and active': { en: 'Connected & Active', fa: 'وصل و فعال' },
  'Connected but not working': { en: 'Connected but Not Working', fa: 'وصل ولی غیرفعال' },
  'Not connected': { en: 'Not Connected', fa: 'غیر وصل' }
};

export const WELL_DEPTH_MAP = {
  'No well': { en: 'No Well', fa: 'بدون چاه' },
  'Less than 20 m': { en: '< 20 m', fa: 'کمتر از ۲۰ متر' },
  '20–40 m': { en: '20–40 m', fa: '۲۰ الی ۴۰ متر' },
  '41–70 m': { en: '41–70 m', fa: '۴۱ الی ۷۰ متر' },
  'More than 70 m': { en: '> 70 m', fa: 'بیشتر از ۷۰ متر' }
};

export const WELL_CHANGE_MAP = {
  'No': { en: 'No Change', fa: 'بدون تغییر' },
  'Yes, once': { en: 'Deepened/Dug Once', fa: 'یک بار عمیق‌سازی/حفر' },
  'Yes, two times or more': { en: 'Deepened/Dug 2+ Times', fa: 'دو بار یا بیشتر' }
};

export const SUFFICIENCY_MAP = {
  'Always enough': { en: 'Always Enough', fa: 'همیشه کافی' },
  'Mostly enough': { en: 'Mostly Enough', fa: 'اکثراً کافی' },
  'Sometimes insufficient': { en: 'Sometimes Insufficient', fa: 'بعضاً نامناسب/کافی' },
  'Often insufficient': { en: 'Often Insufficient', fa: 'غالباً ناکافی' }
};

export const AVAILABILITY_HOURS_MAP = {
  '24 hours': { en: '24 Hours', fa: '۲۴ ساعت' },
  '12–23 hours': { en: '12–23 Hours', fa: '۱۲ الی ۲۳ ساعت' },
  '4–11 hours': { en: '4–11 Hours', fa: '۴ الی ۱۱ ساعت' },
  'Less than 4 hours': { en: 'Less than 4 Hours', fa: 'کمتر از ۴ ساعت' }
};

export const INTERRUPTIONS_MAP = {
  'None': { en: 'None', fa: 'هیچ' },
  '1–2 times': { en: '1–2 Times', fa: '۱ الی ۲ بار' },
  '3–5 times': { en: '3–5 Times', fa: '۳ الی ۵ بار' },
  'More than 5 times / always': { en: '5+ Times / Always', fa: 'بیشتر از ۵ بار / همیشگی' }
};

export const DURATION_MAP = {
  'Several hours': { en: 'Several Hours', fa: 'چندین ساعت' },
  'About one day': { en: 'About 1 Day', fa: 'حدود یک روز' },
  'Several days': { en: 'Several Days', fa: 'چندین روز' },
  'More than one week': { en: 'More than 1 Week', fa: 'بیشتر از یک هفته' }
};

export const TASTE_MAP = {
  'Good and normal': { en: 'Good / Normal', fa: 'خوب و نورمال' },
  'Salty': { en: 'Salty', fa: 'شور' },
  'Bitter': { en: 'Bitter', fa: 'تلخ' },
  'Metallic': { en: 'Metallic', fa: 'فلزی' },
  'Unpleasant / bad taste': { en: 'Unpleasant / Bad Taste', fa: 'طعم بد / نامطبوع' }
};

export const COLOR_MAP = {
  'Clear and transparent': { en: 'Clear & Transparent', fa: 'شفاف و زلال' },
  'Cloudy / muddy': { en: 'Cloudy / Muddy', fa: 'کدر / گل‌آلود' },
  'Yellow or brown': { en: 'Yellow / Brown', fa: 'زرد یا نصواری' },
  'Contains sediment / particles': { en: 'Contains Sediment', fa: 'دارای رسوب / ذرات' }
};

export const ODOR_MAP = {
  'Odorless': { en: 'Odorless', fa: 'بدون بو' },
  'Rotten egg / sulfur smell': { en: 'Rotten Egg / Sulfur', fa: 'بوی گوگرد / تخم مرغ گندیده' },
  'Chlorine smell': { en: 'Chlorine Smell', fa: 'بوی کلرین' },
  'Other unpleasant smell': { en: 'Other Unpleasant Smell', fa: 'سایر بوهای نامطبوع' }
};

export const QUALITY_CHANGE_MAP = {
  'Improved': { en: 'Improved', fa: 'بهتر شده' },
  'No change': { en: 'No Change', fa: 'بدون تغییر' },
  'Worse': { en: 'Worse', fa: 'بدتر شده' },
  'Much worse': { en: 'Much Worse', fa: 'بسیار بدتر شده' }
};

export const SAFETY_PERCEPTION_MAP = {
  'Yes, it is safe': { en: 'Safe', fa: 'مصئون' },
  'Partially': { en: 'Partially Safe', fa: 'نسبتاً مصئون' },
  'No, it is unsafe': { en: 'Unsafe', fa: 'غیرمصئون' },
  "Don't know": { en: "Don't Know", fa: 'نامشخص' }
};

export const TREATMENT_METHODS_MAP = {
  'Nothing': { en: 'None (Untreated)', fa: 'هیچ‌کدام (بدون تصفیه)' },
  'Boiling': { en: 'Boiling', fa: 'جوشاندن' },
  'Water filter / treatment device': { en: 'Filter / Treatment Device', fa: 'فیلتر / دستگاه تصفیه' },
  'Buying bottled water': { en: 'Buying Bottled Water', fa: 'خرید آب معدنی / بطلی' },
  'Chlorination / water treatment chemicals': { en: 'Chlorination / Chemicals', fa: 'کلرین‌زدایی / مواد کیمیاوی' }
};

export const SPENDING_MAP = {
  'None': { en: 'None (0 AFN)', fa: 'بدون مصرف (۰ افغانی)' },
  'Less than 500 AFN': { en: '< 500 AFN', fa: 'کمتر از ۵۰۰ افغانی' },
  '500–1500 AFN': { en: '500–1,500 AFN', fa: '۵۰۰ الی ۱۵۰۰ افغانی' },
  '1501–3000 AFN': { en: '1,501–3,000 AFN', fa: '۱۵۰۱ الی ۳۰۰۰ افغانی' },
  'More than 3000 AFN': { en: '> 3,000 AFN', fa: 'بیشتر از ۳۰۰۰ افغانی' }
};

export const ECONOMIC_PRESSURE_MAP = {
  'No pressure': { en: 'No Pressure', fa: 'بدون فشار' },
  'Low pressure': { en: 'Low Pressure', fa: 'فشار کم' },
  'Moderate pressure': { en: 'Moderate Pressure', fa: 'فشار متوسط' },
  'High pressure': { en: 'High Pressure', fa: 'فشار بالا' },
  'Very high pressure': { en: 'Very High Pressure', fa: 'فشار بسیار بالا' }
};

export const HEALTH_PROBLEMS_MAP = {
  'No one': { en: 'No Health Issues', fa: 'بدون مشکل صحی' },
  'Diarrhea / stomach problems': { en: 'Diarrhea / Stomach Problems', fa: 'اسهالات / مشکلات معده' },
  'Kidney stones / kidney diseases': { en: 'Kidney Stones / Disease', fa: 'سنگ گرده / امراض گرده' },
  'Skin diseases': { en: 'Skin Diseases', fa: 'امراض جلدی' },
  'Other diseases': { en: 'Other Diseases', fa: 'سایر امراض' }
};

export const MAIN_PROBLEMS_MAP = {
  'Water shortage / quantity': { en: 'Water Shortage / Quantity', fa: 'کمبود آب / مقدار' },
  'Poor water quality': { en: 'Poor Water Quality', fa: 'کیفیت پایین آب' },
  'High cost': { en: 'High Cost', fa: 'قیمت بالا' },
  'Network interruptions': { en: 'Network Interruptions', fa: 'قطعی شبکه آبرسانی' },
  'Declining groundwater level': { en: 'Declining Groundwater Level', fa: 'افت سطح آب‌های زیرزمینی' }
};

/**
 * Helper to get translated value or fallback gracefully
 */
export function translateDataValue(rawVal, mapping, lang = 'en') {
  if (!rawVal) return '-';
  const trimmed = String(rawVal).trim();
  const langKey = lang.startsWith('fa') ? 'fa' : 'en';
  
  if (mapping && mapping[trimmed]) {
    return mapping[trimmed][langKey];
  }
  return trimmed;
}