import { StackMemoryCache } from "../cache/stack-cache.js";
import Config from "../configs/supabase.js";

let cache: StackMemoryCache = new StackMemoryCache(2048)

const supabase = Config.getInstance().getSupabaseClient()

let vaultSecretOffset: number | null = null;

export interface VaultCredentials {
  username: string;
  password: string;
}

async function getSigningCredentials(): Promise<VaultCredentials> {
  if (vaultSecretOffset !== null) {
    const cached = cache.peekAt(vaultSecretOffset);
    return cached.value as VaultCredentials;
  }

  const { data, error } = await supabase.rpc('get_vault_credentials', {
    secret_name: 'service_credentials',
  });

  if (error || !data) {
    throw new Error(`Vault error: ${error?.message || 'Secret not found'}`);
  }

  vaultSecretOffset = cache.push(data, 'json');

  return data as VaultCredentials;
}

function clearVaultCache(): void {
  cache.clear();
  vaultSecretOffset = null;
}
export {
  getSigningCredentials,
  clearVaultCache,
};
