import React from 'react';
import { X, MapPin, Home, Droplet, Clock, ShieldCheck, Activity, Filter, DollarSign, HeartPulse, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '../utils/numberFormatter';

export default function SurveyDetailsModal({ record, onClose }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const isFa = currentLang === 'fa';

  if (!record) return null;

  // Helper for boolean/flag display
  const renderFlag = (val) => {
    const isTrue = val === true || val === 1 || val === '1' || val === 'Yes' || val === 'بله';
    if (isTrue) {
      return <span className="badge badge-success">{isFa ? 'بله' : 'Yes'}</span>;
    }
    return <span className="badge badge-neutral">{isFa ? 'خیر' : 'No'}</span>;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} dir={isFa ? 'rtl' : 'ltr'}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isFa ? 'جزئیات ریکورد سروی آب' : 'Water Survey Record Details'}
            </h2>
            <p className="modal-subtitle">
              {isFa ? 'آیدی نقطه:' : 'Point ID:'} {formatNumber(record.point_id, currentLang) || (isFa ? 'نامشخص' : 'N/A')}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label={isFa ? 'بستن' : 'Close modal'}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body with 10 Logical Sections */}
        <div className="modal-body">
          {/* Section 1: Survey Information */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <MapPin size={14} /> {isFa ? 'بخش ۱: اطلاعات سروی' : 'Section 1: Survey Information'}
            </h3>
            <div className="modal-grid">
              <div>
                <span className="modal-label">{isFa ? 'آیدی نقطه' : 'Point ID'}</span>
                <p className="modal-value">{formatNumber(record.point_id, currentLang) || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'آیدی اصلی' : 'Original ID'}</span>
                <p className="modal-value">{formatNumber(record.orig_id, currentLang) || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'تاریخ سروی' : 'Survey Date'}</span>
                <p className="modal-value">{formatNumber(record.survey_date, currentLang) || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'ولسوالی / ناحیه' : 'District'}</span>
                <p className="modal-value">{record.district || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'محل / قریه' : 'Locality / Village'}</span>
                <p className="modal-value">{record.locality || record.village || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'مصاحبه‌کننده' : 'Interviewer'}</span>
                <p className="modal-value">{record.interviewer || record.enumerator || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'موقعیت جغرافیایی (عرض، طول)' : 'Coordinates (Lat, Long)'}</span>
                <p className="modal-value font-mono">
                  {record.y_latitude || record.latitude ? `${formatNumber(record.y_latitude || record.latitude, currentLang)}, ${formatNumber(record.x_longitude || record.longitude, currentLang)}` : '-'}
                </p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'وضعیت موقعیت' : 'Coord Status'}</span>
                <p className="modal-value">{record.coord_status || '-'}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Household Profile */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Home size={14} /> {isFa ? 'بخش ۲: مشخصات خانوار' : 'Section 2: Household Profile'}
            </h3>
            <div className="modal-grid">
              <div>
                <span className="modal-label">{isFa ? 'سن پاسخ‌دهنده (سوال ۱)' : 'Respondent Age (Q1)'}</span>
                <p className="modal-value">{formatNumber(record.q1_age, currentLang) ?? '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'تعداد اعضای خانوار (سوال ۲)' : 'Household Size (Q2)'}</span>
                <p className="modal-value">{formatNumber(record.q2_hhsize, currentLang) ?? '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'مدت سکونت (سوال ۳)' : 'Residence Duration (Q3)'}</span>
                <p className="modal-value">{formatNumber(record.q3_residence, currentLang) || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'نوع مالکیت مسکن (سوال ۴)' : 'Housing Tenure (Q4)'}</span>
                <p className="modal-value">{record.q4_tenure || '-'}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Water Source */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Droplet size={14} /> {isFa ? 'بخش ۳: منبع آب' : 'Section 3: Water Source'}
            </h3>
            <div className="modal-grid">
              <div>
                <span className="modal-label">{isFa ? 'منبع اصلی (سوال ۵)' : 'Primary Source (Q5)'}</span>
                <p className="modal-value">{record.q5_source || record.water_source || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'وضعیت شبکه (سوال ۶)' : 'Network Status (Q6)'}</span>
                <p className="modal-value">{record.q6_network || record.network_connection || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'عمق چاه (سوال ۷)' : 'Well Depth (Q7)'}</span>
                <p className="modal-value">{formatNumber(record.q7_well_depth, currentLang) ?? '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'تعمیق چاه (سوال ۸)' : 'Well Deepened (Q8)'}</span>
                <p className="modal-value">{record.q8_deepened || '-'}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Water Availability */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Clock size={14} /> {isFa ? 'بخش ۴: دسترسی به آب' : 'Section 4: Water Availability'}
            </h3>
            <div className="modal-grid">
              <div>
                <span className="modal-label">{isFa ? 'کفایت آب (سوال ۹)' : 'Sufficiency (Q9)'}</span>
                <p className="modal-value">{record.q9_sufficiency || record.water_sufficiency || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'ساعات دسترسی در روز (سوال ۱۰)' : 'Hours Available / Day (Q10)'}</span>
                <p className="modal-value">{formatNumber(record.q10_hours_avail, currentLang) ?? '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'قطعی آب (سوال ۱۱)' : 'Interruptions (Q11)'}</span>
                <p className="modal-value">{record.q11_interrupt || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'مدت زمان قطعی (سوال ۱۲)' : 'Outage Duration (Q12)'}</span>
                <p className="modal-value">{record.q12_outage || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'امانت گرفتن آب (سوال ۱۳)' : 'Borrowing Water (Q13)'}</span>
                <p className="modal-value">{record.q13_borrow || '-'}</p>
              </div>
            </div>
          </div>

          {/* Section 5: Water Quality */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <ShieldCheck size={14} /> {isFa ? 'بخش ۵: ارزیابی کیفیت آب' : 'Section 5: Water Quality Perception'}
            </h3>
            <div className="modal-grid">
              <div>
                <span className="modal-label">{isFa ? 'طعم (سوال ۱۴)' : 'Taste (Q14)'}</span>
                <p className="modal-value">{record.q14_taste || record.taste || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'رنگ (سوال ۱۵)' : 'Color (Q15)'}</span>
                <p className="modal-value">{record.q15_color || record.color || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'بو (سوال ۱۶)' : 'Odor (Q16)'}</span>
                <p className="modal-value">{record.q16_odor || record.odor || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'روند تغییر کیفیت (سوال ۱۷)' : 'Quality Trend (Q17)'}</span>
                <p className="modal-value">{record.q17_trend || record.quality_trend || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'امنیت بهداشتی درک‌شده (سوال ۱۸)' : 'Perceived Safety (Q18)'}</span>
                <p className="modal-value">{record.q18_safe || record.perceived_safety || '-'}</p>
              </div>
            </div>
          </div>

          {/* Section 6: Sanitation */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Activity size={14} /> {isFa ? 'بخش ۶: بهداشت و فاضلاب' : 'Section 6: Sanitation'}
            </h3>
            <div className="modal-grid">
              <div>
                <span className="modal-label">{isFa ? 'سیستم چاه جذبی / سبتیک (سوال ۱۹)' : 'Septic System (Q19)'}</span>
                <p className="modal-value">{record.q19_septic || record.septic || '-'}</p>
              </div>
            </div>
          </div>

          {/* Section 7: Water Treatment Practices */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Filter size={14} /> {isFa ? 'بخش ۷: روش‌های تصفیه آب' : 'Section 7: Water Treatment Practices'}
            </h3>
            <div className="modal-grid">
              <div>
                <span className="modal-label">{isFa ? 'بدون تصفیه (سوال ۲۰-الف)' : 'No Treatment (Q20a)'}</span>
                <p className="modal-value">{renderFlag(record.q20a_none ?? record.treatment_none)}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'جوشاندن (سوال ۲۰-ب)' : 'Boiling (Q20b)'}</span>
                <p className="modal-value">{renderFlag(record.q20b_boil ?? record.treatment_boil)}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'فیلتر کردن (سوال ۲۰-ج)' : 'Filter (Q20c)'}</span>
                <p className="modal-value">{renderFlag(record.q20c_filter ?? record.treatment_filter)}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'آب معدنی / معدنی (سوال ۲۰-د)' : 'Bottled Water (Q20d)'}</span>
                <p className="modal-value">{renderFlag(record.q20d_bottled ?? record.treatment_bottled)}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'کلرزنی (سوال ۲۰-هـ)' : 'Chlorination (Q20e)'}</span>
                <p className="modal-value">{renderFlag(record.q20e_chlor ?? record.treatment_chlorine)}</p>
              </div>
            </div>
          </div>

          {/* Section 8: Household Water Management */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <DollarSign size={14} /> {isFa ? 'بخش ۸: مدیریت خانوار و هزینه آب' : 'Section 8: Household Water Management'}
            </h3>
            <div className="modal-grid">
              <div>
                <span className="modal-label">{isFa ? 'داشتن فیلتر خانگی (سوال ۲۱)' : 'Has Household Filter (Q21)'}</span>
                <p className="modal-value">{record.q21_has_filter || record.filter_status || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'هزینه ماهانه آب (سوال ۲۲)' : 'Monthly Water Cost (Q22)'}</span>
                <p className="modal-value">{formatNumber(record.q22_cost || record.water_cost, currentLang) || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'بار مالی (سوال ۲۳)' : 'Financial Burden (Q23)'}</span>
                <p className="modal-value">{record.q23_burden || record.water_burden || '-'}</p>
              </div>
            </div>
          </div>

          {/* Section 9: Health Indicators */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <HeartPulse size={14} /> {isFa ? 'بخش ۹: مشکلات صحی گزارش‌شده' : 'Section 9: Reported Health Conditions'}
            </h3>
            <div className="modal-grid">
              <div>
                <span className="modal-label">{isFa ? 'بدون مشکل صحی (سوال ۲۴-الف)' : 'No Health Problems (Q24a)'}</span>
                <p className="modal-value">{renderFlag(record.q24a_none ?? record.health_none)}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'موارد اسهال (سوال ۲۴-ب)' : 'Diarrhea Cases (Q24b)'}</span>
                <p className="modal-value">{renderFlag(record.q24b_diarr ?? record.health_diarrhea)}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'مشکلات کلیوی (سوال ۲۴-ج)' : 'Kidney Problems (Q24c)'}</span>
                <p className="modal-value">{renderFlag(record.q24c_kidney ?? record.health_kidney)}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'مشکلات جلدی (سوال ۲۴-د)' : 'Skin Problems (Q24d)'}</span>
                <p className="modal-value">{renderFlag(record.q24d_skin ?? record.health_skin)}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'سایر بیماری‌ها (سوال ۲۴-هـ)' : 'Other Conditions (Q24e)'}</span>
                <p className="modal-value">{record.q24e_other || record.health_other || (isFa ? 'هیچکدام' : 'None')}</p>
              </div>
            </div>
          </div>

          {/* Section 10: Problems & Solutions */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <AlertTriangle size={14} /> {isFa ? 'بخش ۱۰: مشکلات و راه‌حل‌های پیشنهادی' : 'Section 10: Problems & Proposed Solutions'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span className="modal-label">{isFa ? 'ارتباط درک‌شده بین آب و صحت (سوال ۲۵)' : 'Perceived Water & Health Link (Q25)'}</span>
                <p className="modal-value">{record.q25_link || record.water_health_link || '-'}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'مشکل اصلی آب (سوال ۲۶)' : 'Main Water Problem (Q26)'}</span>
                <p className="field-notes">{record.q26_problem || record.main_problem || (isFa ? 'مشکلی مشخص نشده است' : 'No problem specified')}</p>
              </div>
              <div>
                <span className="modal-label">{isFa ? 'راه‌حل پیشنهادی جامعه (سوال ۲۷)' : 'Proposed Community Solution (Q27)'}</span>
                <p className="field-notes">{record.q27_solution || record.proposed_solution || (isFa ? 'راه‌حلی مشخص نشده است' : 'No solution specified')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            {isFa ? 'بستن ریکورد' : 'Close Record'}
          </button>
        </div>
      </div>
    </div>
  );
}