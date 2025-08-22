import { supabase } from './supabaseClient';

export const profileService = {
  /**
   * Check if an email is on the waitlist and their status
   * @param {string} email - User's email address
   * @returns {Promise<{status: string, isApproved: boolean}>}
   */
  async checkWaitlistStatus(email) {
    try {
      const { data, error } = await supabase
        .rpc('check_waitlist_status', { user_email: email });
      
      if (error) {
        console.error('Error checking waitlist status:', error);
        return { status: 'error', isApproved: false };
      }

      return data?.[0] || { status: 'not_found', isApproved: false };
    } catch (error) {
      console.error('Error in checkWaitlistStatus:', error);
      return { status: 'error', isApproved: false };
    }
  },

  /**
   * Get the current user's profile
   * @returns {Promise<Object|null>}
   */
  async getCurrentUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error);
      return null;
    }
  },

  /**
   * Update the current user's profile
   * @param {Object} updates - Profile fields to update
   * @returns {Promise<Object|null>}
   */
  async updateProfile(updates) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  },

  /**
   * Create or update a profile (admin function)
   * @param {string} email - User's email
   * @param {Object} profileData - Profile data to set
   * @returns {Promise<Object|null>}
   */
  async upsertProfile(email, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          email,
          ...profileData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in upsertProfile:', error);
      throw error;
    }
  },

  /**
   * Link Airtable record to Supabase profile
   * @param {string} email - User's email
   * @param {string} airtableRecordId - Airtable record ID
   * @param {string} customerId - Customer ID from Airtable
   * @returns {Promise<Object|null>}
   */
  async linkAirtableRecord(email, airtableRecordId, customerId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          airtable_record_id: airtableRecordId,
          customer_id: customerId,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('Error linking Airtable record:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in linkAirtableRecord:', error);
      throw error;
    }
  },

  /**
   * Update waitlist status for a user
   * @param {string} email - User's email
   * @param {string} status - New status ('pending', 'approved', 'active', 'rejected')
   * @returns {Promise<Object|null>}
   */
  async updateWaitlistStatus(email, status) {
    try {
      const validStatuses = ['pending', 'approved', 'active', 'rejected'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          waitlist_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('Error updating waitlist status:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateWaitlistStatus:', error);
      throw error;
    }
  },

  /**
   * Get all users on waitlist (admin function)
   * @param {string} statusFilter - Optional status filter
   * @returns {Promise<Array>}
   */
  async getWaitlistUsers(statusFilter = null) {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('waitlist_status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching waitlist users:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getWaitlistUsers:', error);
      throw error;
    }
  }
};

export default profileService;