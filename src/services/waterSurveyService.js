import { supabase, isSupabaseConfigured } from "../lib/supabase";

/**
 * Maps raw database schema fields to clean application object properties.
 */
export function normalizeRecord(record) {
  if (!record) return null;

  return {
    id: record.id,
    point_id: record.point_id,
    orig_id: record.orig_id,

    district: record.district,
    locality: record.locality,
    interviewer: record.interviewer,

    survey_date: record.survey_date,

    latitude: record.y_latitude !== null && record.y_latitude !== undefined ? Number(record.y_latitude) : null,
    longitude: record.x_longitude !== null && record.x_longitude !== undefined ? Number(record.x_longitude) : null,
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

/**
 * Maps application object properties back to raw database schema fields for inserts/updates.
 */
export function denormalizeRecord(payload) {
  if (!payload) return {};

  const record = {};

  if (payload.point_id !== undefined) record.point_id = payload.point_id;
  if (payload.orig_id !== undefined) record.orig_id = payload.orig_id;
  if (payload.district !== undefined) record.district = payload.district;
  if (payload.locality !== undefined) record.locality = payload.locality;
  if (payload.interviewer !== undefined) record.interviewer = payload.interviewer;
  if (payload.survey_date !== undefined) record.survey_date = payload.survey_date;

  if (payload.latitude !== undefined) record.y_latitude = payload.latitude;
  if (payload.longitude !== undefined) record.x_longitude = payload.longitude;
  if (payload.coord_status !== undefined) record.coord_status = payload.coord_status;

  // Demographics
  if (payload.age !== undefined) record.q1_age = payload.age;
  if (payload.household_size !== undefined) record.q2_hhsize = payload.household_size;
  if (payload.residence_duration !== undefined) record.q3_residence = payload.residence_duration;
  if (payload.tenure !== undefined) record.q4_tenure = payload.tenure;

  // Water source
  if (payload.water_source !== undefined) record.q5_source = payload.water_source;
  if (payload.network_connection !== undefined) record.q6_network = payload.network_connection;
  if (payload.well_depth !== undefined) record.q7_well_depth = payload.well_depth;
  if (payload.well_deepened !== undefined) record.q8_deepened = payload.well_deepened;

  // Water availability
  if (payload.water_sufficiency !== undefined) record.q9_sufficiency = payload.water_sufficiency;
  if (payload.hours_available !== undefined) record.q10_hours_avail = payload.hours_available;
  if (payload.interruptions !== undefined) record.q11_interrupt = payload.interruptions;
  if (payload.outage_duration !== undefined) record.q12_outage = payload.outage_duration;
  if (payload.borrowing !== undefined) record.q13_borrow = payload.borrowing;

  // Water quality
  if (payload.taste !== undefined) record.q14_taste = payload.taste;
  if (payload.color !== undefined) record.q15_color = payload.color;
  if (payload.odor !== undefined) record.q16_odor = payload.odor;
  if (payload.quality_trend !== undefined) record.q17_trend = payload.quality_trend;
  if (payload.perceived_safety !== undefined) record.q18_safe = payload.perceived_safety;

  // Sanitation
  if (payload.septic !== undefined) record.q19_septic = payload.septic;

  // Treatment methods
  if (payload.treatment_none !== undefined) record.q20a_none = payload.treatment_none;
  if (payload.treatment_boil !== undefined) record.q20b_boil = payload.treatment_boil;
  if (payload.treatment_filter !== undefined) record.q20c_filter = payload.treatment_filter;
  if (payload.treatment_bottled !== undefined) record.q20d_bottled = payload.treatment_bottled;
  if (payload.treatment_chlorine !== undefined) record.q20e_chlor = payload.treatment_chlorine;

  // Filter & Costs
  if (payload.filter_status !== undefined) record.q21_has_filter = payload.filter_status;
  if (payload.water_cost !== undefined) record.q22_cost = payload.water_cost;
  if (payload.water_burden !== undefined) record.q23_burden = payload.water_burden;

  // Health
  if (payload.health_none !== undefined) record.q24a_none = payload.health_none;
  if (payload.health_diarrhea !== undefined) record.q24b_diarr = payload.health_diarrhea;
  if (payload.health_kidney !== undefined) record.q24c_kidney = payload.health_kidney;
  if (payload.health_skin !== undefined) record.q24d_skin = payload.health_skin;
  if (payload.health_other !== undefined) record.q24e_other = payload.health_other;

  // Problems / solutions
  if (payload.water_health_link !== undefined) record.q25_link = payload.water_health_link;
  if (payload.main_problem !== undefined) record.q26_problem = payload.main_problem;
  if (payload.proposed_solution !== undefined) record.q27_solution = payload.proposed_solution;

  return record;
}

export const waterSurveyService = {
  /**
   * Fetches filtered survey records from Supabase.
   */
  async fetchSurveys(filters = {}) {
    console.log("🔵 Fetching water surveys...");

    if (typeof isSupabaseConfigured === "function" && !isSupabaseConfigured()) {
      console.warn("⚠️ Supabase is not configured properly.");
      return { data: [], isConnected: false, error: new Error("Supabase is not configured") };
    }

    try {
      let query = supabase
        .from("water_surveys")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(filters.limit || 1000);

      if (filters.district) {
        query = query.eq("district", filters.district);
      }

      if (filters.waterSource) {
        query = query.eq("q5_source", filters.waterSource);
      }

      if (filters.perceivedSafety) {
        query = query.eq("q18_safe", filters.perceivedSafety);
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

      console.log(`✅ ${data?.length || 0} surveys loaded`);

      return {
        data: (data || []).map(normalizeRecord),
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
  },

  /**
   * Fetches a single survey record by ID.
   */
  async fetchSurveyById(id) {
    console.log(`🔵 Fetching survey ID: ${id}`);

    try {
      const { data, error } = await supabase
        .from("water_surveys")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        data: normalizeRecord(data),
        success: true
      };
    } catch (error) {
      console.error(`❌ Failed to fetch survey ID ${id}:`, error);
      return { data: null, success: false, error };
    }
  },

  /**
   * Inserts a new survey record into Supabase.
   */
  async createSurvey(surveyPayload) {
    console.log("🔵 Creating new survey record...");

    try {
      const dbRecord = denormalizeRecord(surveyPayload);

      const { data, error } = await supabase
        .from("water_surveys")
        .insert([dbRecord])
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Survey created successfully");
      return { data: normalizeRecord(data), success: true };
    } catch (error) {
      console.error("❌ Failed to create survey record:", error);
      return { data: null, success: false, error };
    }
  },

  /**
   * Updates an existing survey record by ID.
   */
  async updateSurvey(id, surveyPayload) {
    console.log(`🔵 Updating survey ID: ${id}`);

    try {
      const dbRecord = denormalizeRecord(surveyPayload);

      const { data, error } = await supabase
        .from("water_surveys")
        .update(dbRecord)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Survey updated successfully");
      return { data: normalizeRecord(data), success: true };
    } catch (error) {
      console.error(`❌ Failed to update survey ID ${id}:`, error);
      return { data: null, success: false, error };
    }
  },

  /**
   * Deletes a survey record by ID.
   */
  async deleteSurvey(id) {
    console.log(`🔵 Deleting survey ID: ${id}`);

    try {
      const { error } = await supabase
        .from("water_surveys")
        .delete()
        .eq("id", id);

      if (error) throw error;

      console.log("✅ Survey deleted successfully");
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to delete survey ID ${id}:`, error);
      return { success: false, error };
    }
  }
};