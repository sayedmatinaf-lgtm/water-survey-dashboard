import { supabase, isSupabaseConfigured } from "../lib/supabase";

function normalizeRecord(record) {
  return {
    id: record.id,
    point_id: record.point_id,
    orig_id: record.orig_id,

    district: record.district,
    locality: record.locality,
    interviewer: record.interviewer,

    survey_date: record.survey_date,

    latitude: Number(record.y_latitude),
    longitude: Number(record.x_longitude),
    coord_status: record.coord_status,

    // Demographics
    age: record.q1_age,
    household_size: record.q2_hhsize,
    residence_duration: record.q3_residence,
    tenure: record.q4_tenure,

    // Water source
    water_source: record.q5_source,
    network_connection: record.q6_network,
    well_depth: record.q7_well_depth,
    well_deepened: record.q8_deepened,

    // Water availability
    water_sufficiency: record.q9_sufficiency,
    hours_available: record.q10_hours_avail,
    interruptions: record.q11_interrupt,
    outage_duration: record.q12_outage,
    borrowing: record.q13_borrow,

    // Water quality
    taste: record.q14_taste,
    color: record.q15_color,
    odor: record.q16_odor,
    quality_trend: record.q17_trend,
    perceived_safety: record.q18_safe,

    // Sanitation
    septic: record.q19_septic,

    // Treatment methods
    treatment_none: record.q20a_none,
    treatment_boil: record.q20b_boil,
    treatment_filter: record.q20c_filter,
    treatment_bottled: record.q20d_bottled,
    treatment_chlorine: record.q20e_chlor,

    // Filter
    filter_status: record.q21_has_filter,
    water_cost: record.q22_cost,
    water_burden: record.q23_burden,

    // Health
    health_none: record.q24a_none,
    health_diarrhea: record.q24b_diarr,
    health_kidney: record.q24c_kidney,
    health_skin: record.q24d_skin,
    health_other: record.q24e_other,

    // Problems / solutions
    water_health_link: record.q25_link,
    main_problem: record.q26_problem,
    proposed_solution: record.q27_solution,

    created_at: record.created_at
  };
}

export const waterSurveyService = {
  async fetchSurveys(filters = {}) {
    console.log("🔵 Fetching water surveys...");

    try {
      let query = supabase
        .from("water_surveys")
        .select("*")
        .limit(1000);

      if (filters.district) {
        query = query.eq("district", filters.district);
      }

      if (filters.waterSource) {
        query = query.eq("q5_source", filters.waterSource);
      }

      if (filters.startDate) {
        query = query.gte("survey_date", filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte("survey_date", filters.endDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error("❌ Supabase error:", error);
        throw error;
      }

      console.log(`✅ ${data.length} surveys loaded`);

      return {
        data: data.map(normalizeRecord),
        isConnected: true
      };

    } catch (error) {
      console.error("❌ Failed to fetch surveys:", error);

      return {
        data: [],
        isConnected: false,
        error
      };
    }
  }
};