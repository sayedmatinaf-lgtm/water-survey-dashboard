import React from 'react';
import { X, MapPin, Home, Droplet, Clock, ShieldCheck, Activity, Filter, DollarSign, HeartPulse, AlertTriangle } from 'lucide-react';

export default function SurveyDetailsModal({ record, onClose }) {
  if (!record) return null;

  // Helper for boolean/flag display
  const renderFlag = (val) => {
    if (val === true || val === 1 || val === '1' || val === 'Yes' || val === 'بله') {
      return <span className="badge badge-success">Yes</span>;
    }
    return <span className="badge badge-neutral">No</span>;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Water Survey Record Details</h2>
            <p className="modal-subtitle">Point ID: {record.point_id || 'N/A'}</p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body with 10 Logical Sections */}
        <div className="modal-body">
          {/* Section 1: Survey Information */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <MapPin size={14} /> Section 1: Survey Information
            </h3>
            <div className="modal-grid">
              <div><span className="modal-label">Point ID</span><p className="modal-value">{record.point_id || '-'}</p></div>
              <div><span className="modal-label">Original ID</span><p className="modal-value">{record.orig_id || '-'}</p></div>
              <div><span className="modal-label">Survey Date</span><p className="modal-value">{record.survey_date || '-'}</p></div>
              <div><span className="modal-label">District</span><p className="modal-value">{record.district || '-'}</p></div>
              <div><span className="modal-label">Locality / Village</span><p className="modal-value">{record.locality || record.village || '-'}</p></div>
              <div><span className="modal-label">Interviewer</span><p className="modal-value">{record.interviewer || record.enumerator || '-'}</p></div>
              <div><span className="modal-label">Coordinates (Lat, Long)</span><p className="modal-value font-mono">{record.y_latitude || record.latitude || '-'}, {record.x_longitude || record.longitude || '-'}</p></div>
              <div><span className="modal-label">Coord Status</span><p className="modal-value">{record.coord_status || '-'}</p></div>
            </div>
          </div>

          {/* Section 2: Household Profile */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Home size={14} /> Section 2: Household Profile
            </h3>
            <div className="modal-grid">
              <div><span className="modal-label">Respondent Age (Q1)</span><p className="modal-value">{record.q1_age ?? '-'}</p></div>
              <div><span className="modal-label">Household Size (Q2)</span><p className="modal-value">{record.q2_hhsize ?? '-'}</p></div>
              <div><span className="modal-label">Residence Duration (Q3)</span><p className="modal-value">{record.q3_residence || '-'}</p></div>
              <div><span className="modal-label">Housing Tenure (Q4)</span><p className="modal-value">{record.q4_tenure || '-'}</p></div>
            </div>
          </div>

          {/* Section 3: Water Source */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Droplet size={14} /> Section 3: Water Source
            </h3>
            <div className="modal-grid">
              <div><span className="modal-label">Primary Source (Q5)</span><p className="modal-value">{record.q5_source || record.water_source || '-'}</p></div>
              <div><span className="modal-label">Network Status (Q6)</span><p className="modal-value">{record.q6_network || record.network_connection || '-'}</p></div>
              <div><span className="modal-label">Well Depth (Q7)</span><p className="modal-value">{record.q7_well_depth ?? '-'}</p></div>
              <div><span className="modal-label">Well Deepened (Q8)</span><p className="modal-value">{record.q8_deepened || '-'}</p></div>
            </div>
          </div>

          {/* Section 4: Water Availability */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Clock size={14} /> Section 4: Water Availability
            </h3>
            <div className="modal-grid">
              <div><span className="modal-label">Sufficiency (Q9)</span><p className="modal-value">{record.q9_sufficiency || record.water_sufficiency || '-'}</p></div>
              <div><span className="modal-label">Hours Available / Day (Q10)</span><p className="modal-value">{record.q10_hours_avail ?? '-'}</p></div>
              <div><span className="modal-label">Interruptions (Q11)</span><p className="modal-value">{record.q11_interrupt || '-'}</p></div>
              <div><span className="modal-label">Outage Duration (Q12)</span><p className="modal-value">{record.q12_outage || '-'}</p></div>
              <div><span className="modal-label">Borrowing Water (Q13)</span><p className="modal-value">{record.q13_borrow || '-'}</p></div>
            </div>
          </div>

          {/* Section 5: Water Quality */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <ShieldCheck size={14} /> Section 5: Water Quality Perception
            </h3>
            <div className="modal-grid">
              <div><span className="modal-label">Taste (Q14)</span><p className="modal-value">{record.q14_taste || record.taste || '-'}</p></div>
              <div><span className="modal-label">Color (Q15)</span><p className="modal-value">{record.q15_color || record.color || '-'}</p></div>
              <div><span className="modal-label">Odor (Q16)</span><p className="modal-value">{record.q16_odor || record.odor || '-'}</p></div>
              <div><span className="modal-label">Quality Trend (Q17)</span><p className="modal-value">{record.q17_trend || record.quality_trend || '-'}</p></div>
              <div><span className="modal-label">Perceived Safety (Q18)</span><p className="modal-value">{record.q18_safe || record.perceived_safety || '-'}</p></div>
            </div>
          </div>

          {/* Section 6: Sanitation */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Activity size={14} /> Section 6: Sanitation
            </h3>
            <div className="modal-grid">
              <div><span className="modal-label">Septic System (Q19)</span><p className="modal-value">{record.q19_septic || record.septic || '-'}</p></div>
            </div>
          </div>

          {/* Section 7: Water Treatment Practices */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Filter size={14} /> Section 7: Water Treatment Practices
            </h3>
            <div className="modal-grid">
              <div><span className="modal-label">No Treatment (Q20a)</span><p className="modal-value">{renderFlag(record.q20a_none ?? record.treatment_none)}</p></div>
              <div><span className="modal-label">Boiling (Q20b)</span><p className="modal-value">{renderFlag(record.q20b_boil ?? record.treatment_boil)}</p></div>
              <div><span className="modal-label">Filter (Q20c)</span><p className="modal-value">{renderFlag(record.q20c_filter ?? record.treatment_filter)}</p></div>
              <div><span className="modal-label">Bottled Water (Q20d)</span><p className="modal-value">{renderFlag(record.q20d_bottled ?? record.treatment_bottled)}</p></div>
              <div><span className="modal-label">Chlorination (Q20e)</span><p className="modal-value">{renderFlag(record.q20e_chlor ?? record.treatment_chlorine)}</p></div>
            </div>
          </div>

          {/* Section 8: Household Water Management */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <DollarSign size={14} /> Section 8: Household Water Management
            </h3>
            <div className="modal-grid">
              <div><span className="modal-label">Has Household Filter (Q21)</span><p className="modal-value">{record.q21_has_filter || record.filter_status || '-'}</p></div>
              <div><span className="modal-label">Monthly Water Cost (Q22)</span><p className="modal-value">{record.q22_cost || record.water_cost || '-'}</p></div>
              <div><span className="modal-label">Financial Burden (Q23)</span><p className="modal-value">{record.q23_burden || record.water_burden || '-'}</p></div>
            </div>
          </div>

          {/* Section 9: Health Indicators */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <HeartPulse size={14} /> Section 9: Reported Health Conditions
            </h3>
            <div className="modal-grid">
              <div><span className="modal-label">No Health Problems (Q24a)</span><p className="modal-value">{renderFlag(record.q24a_none ?? record.health_none)}</p></div>
              <div><span className="modal-label">Diarrhea Cases (Q24b)</span><p className="modal-value">{renderFlag(record.q24b_diarr ?? record.health_diarrhea)}</p></div>
              <div><span className="modal-label">Kidney Problems (Q24c)</span><p className="modal-value">{renderFlag(record.q24c_kidney ?? record.health_kidney)}</p></div>
              <div><span className="modal-label">Skin Problems (Q24d)</span><p className="modal-value">{renderFlag(record.q24d_skin ?? record.health_skin)}</p></div>
              <div><span className="modal-label">Other Conditions (Q24e)</span><p className="modal-value">{record.q24e_other || record.health_other || 'None'}</p></div>
            </div>
          </div>

          {/* Section 10: Problems & Solutions */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <AlertTriangle size={14} /> Section 10: Problems & Proposed Solutions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span className="modal-label">Perceived Water & Health Link (Q25)</span>
                <p className="modal-value">{record.q25_link || record.water_health_link || '-'}</p>
              </div>
              <div>
                <span className="modal-label">Main Water Problem (Q26)</span>
                <p className="field-notes">{record.q26_problem || record.main_problem || 'No problem specified'}</p>
              </div>
              <div>
                <span className="modal-label">Proposed Community Solution (Q27)</span>
                <p className="field-notes">{record.q27_solution || record.proposed_solution || 'No solution specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}