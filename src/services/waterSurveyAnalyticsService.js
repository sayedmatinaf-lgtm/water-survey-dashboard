import { supabase } from '../lib/supabase';

export async function fetchWaterSurveyAnalytics(filters = {}) {
  let query = supabase.from('water_surveys').select('*');

  // ۱. اعمال فیلتر district
  if (filters.district && filters.district !== 'ALL') {
    query = query.eq('district', parseInt(filters.district, 10));
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase Query Error:', error);
    throw error;
  }

  return processAnalyticsData(data || []);
}

// تابع کمکی برای محاسبه فراوانی و درصد
function calculateDistribution(data, columnName) {
  const counts = {};
  let total = 0;

  data.forEach((row) => {
    const val = row[columnName];
    if (val !== null && val !== undefined && val !== '') {
      counts[val] = (counts[val] || 0) + 1;
      total++;
    }
  });

  return Object.entries(counts).map(([key, count]) => ({
    key,
    count,
    percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0
  }));
}

function processAnalyticsData(rows) {
  const totalCount = rows.length;
  if (totalCount === 0) {
    return { totalCount: 0 };
  }

  // --- بخش B: منابع آب و چاه‌ها ---
  const q05Data = calculateDistribution(rows, 'q5_source');
  const q06Data = calculateDistribution(rows, 'q6_network');
  const q07Data = calculateDistribution(rows, 'q7_well_depth');
  const q08Data = calculateDistribution(rows, 'q8_deepened');

  const deepWellCount = rows.filter((r) => 
    r.q7_well_depth && r.q7_well_depth.toLowerCase().includes('deep')
  ).length;

  const wellChangeCount = rows.filter((r) => 
    r.q8_deepened && (r.q8_deepened === 'yes' || r.q8_deepened === 'true' || r.q8_deepened === 'بله')
  ).length;

  const notWorkingNetwork = rows.filter((r) => 
    r.q6_network && (r.q6_network.includes('inactive') || r.q6_network.includes('not_working') || r.q6_network === 'no')
  ).length;

  const topSource = q05Data.sort((a, b) => b.count - a.count)[0] || null;

  // --- بخش C: کمیت و دسترسی روزانه ---
  const q09Data = calculateDistribution(rows, 'q9_sufficiency');
  const q10Data = calculateDistribution(rows, 'q10_hours_avail');
  const q11Data = calculateDistribution(rows, 'q11_interrupt');
  const q12Data = calculateDistribution(rows, 'q12_outage');
  const q13BorrowData = calculateDistribution(rows, 'q13_borrow');

  // --- بخش D: کیفیت آب ---
  const q14Data = calculateDistribution(rows, 'q14_taste');
  const q15Data = calculateDistribution(rows, 'q15_color');
  const q16Data = calculateDistribution(rows, 'q16_odor');
  const q17Data = calculateDistribution(rows, 'q17_trend');
  const q18Data = calculateDistribution(rows, 'q18_safe');

  // --- بخش E: روش‌های تصفیه خانگی و هزینه‌ها ---
  const q19Data = calculateDistribution(rows, 'q19_septic');
  const q21Data = calculateDistribution(rows, 'q21_has_filter');
  const q22Data = calculateDistribution(rows, 'q22_cost');
  const q23Data = calculateDistribution(rows, 'q23_burden');

  // محاسبه چک‌باکس‌های چندگزینه‌ای روش‌های تصفیه (q20a - q20e)
  const q20Practices = [
    { key: 'None', count: rows.filter(r => r.q20a_none).length },
    { key: 'Boil', count: rows.filter(r => r.q20b_boil).length },
    { key: 'Filter', count: rows.filter(r => r.q20c_filter).length },
    { key: 'Bottled', count: rows.filter(r => r.q20d_bottled).length },
    { key: 'Chlorine', count: rows.filter(r => r.q20e_chlor).length }
  ].map(item => ({
    ...item,
    percentage: totalCount > 0 ? parseFloat(((item.count / totalCount) * 100).toFixed(1)) : 0
  }));

  // --- بخش W: سلامتی و بیماری‌ها ---
  const q24Health = [
    { key: 'None', count: rows.filter(r => r.q24a_none).length },
    { key: 'Diarrhea', count: rows.filter(r => r.q24b_diarr).length },
    { key: 'Kidney', count: rows.filter(r => r.q24c_kidney).length },
    { key: 'Skin', count: rows.filter(r => r.q24d_skin).length },
    { key: 'Other', count: rows.filter(r => r.q24e_other).length }
  ].map(item => ({
    ...item,
    percentage: totalCount > 0 ? parseFloat(((item.count / totalCount) * 100).toFixed(1)) : 0
  }));

  const q25Data = calculateDistribution(rows, 'q25_link');

  // --- بخش Z: مشکلات و راهکارها ---
  const q26Data = calculateDistribution(rows, 'q26_problem');
  const openResponses = rows
    .filter((r) => r.q27_solution && r.q27_solution.trim() !== '')
    .map((r) => ({
      id: r.id,
      text: r.q27_solution,
      district: `District ${r.district}`
    }));

  // تحلیل متقاطع Q05 vs Q09
  const crossMatrix = {};
  rows.forEach((r) => {
    const src = r.q5_source || 'Unknown';
    const suff = r.q9_sufficiency || 'Unknown';
    if (!crossMatrix[src]) crossMatrix[src] = {};
    crossMatrix[src][suff] = (crossMatrix[src][suff] || 0) + 1;
  });

  const uniqueDistricts = [...new Set(rows.map((r) => r.district))].filter(Boolean).sort((a, b) => a - b);

  return {
    totalCount,
    filterOptions: {
      district: uniqueDistricts
    },
    sectionB: {
      q05_sources: q05Data,
      q06_network: q06Data,
      q07_well_depth: q07Data,
      q08_deepening: q08Data,
      details: {
        q05: { topCategory: topSource, data: q05Data },
        q06: { 
          notWorking: { 
            count: notWorkingNetwork, 
            percentage: parseFloat(((notWorkingNetwork / totalCount) * 100).toFixed(1)) 
          }, 
          data: q06Data 
        },
        q07: { 
          deepWellCount, 
          deepWellPercentage: parseFloat(((deepWellCount / totalCount) * 100).toFixed(1)), 
          data: q07Data 
        },
        q08: { 
          wellChangeCount, 
          wellChangePercentage: parseFloat(((wellChangeCount / totalCount) * 100).toFixed(1)), 
          data: q08Data 
        }
      }
    },
    sectionC: {
      q09_sufficiency: q09Data,
      q10_availability: q10Data,
      q11_outage_frequency: q11Data,
      q12_restoration_time: q12Data,
      q13_fetch_neighbor: q13BorrowData
    },
    sectionD: {
      q13_taste: q14Data,
      q15_color: q15Data,
      q16_odor: q16Data,
      q16_change: q17Data,
      q17_safety: q18Data
    },
    sectionE: {
      q19_septic: q19Data,
      q19_practices: q20Practices,
      q21_has_filter: q21Data,
      q22_cost: q22Data,
      q22_pressure: q23Data
    },
    sectionW: {
      q23_health: q24Health,
      q24_link: q25Data
    },
    sectionZ: {
      q25_problem: q26Data,
      q26_open_responses: openResponses
    },
    crossAnalysis: {
      q05_vs_q09: crossMatrix
    }
  };
}