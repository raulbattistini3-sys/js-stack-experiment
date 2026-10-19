import "dotenv/config"
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type VaultCredentials = {
  url: string | null;
  key: string | null;
};

class Config {
  private supabaseConfig: { supabaseCredentials: VaultCredentials };
  private static instance: Config;

  constructor() {
    this.supabaseConfig = { supabaseCredentials: this.loadSupabaseConfig() };
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private loadSupabaseConfig(): VaultCredentials {
    return {
      url: String(process.env.SUPABASE_URL),
      key: String(process.env.SUPABASE_PUBLISHABLE_KEY),
    };
  }

  public getSupabaseClient(): SupabaseClient {
    return createClient(String(this.supabaseConfig.supabaseCredentials.url), String(this.supabaseConfig.supabaseCredentials.key));
  }

}
export default Config;

