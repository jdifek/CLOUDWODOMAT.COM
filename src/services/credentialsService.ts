interface HappyCredentials {
  appid: string;
  saler: string;
}

class CredentialsService {
  private cache: HappyCredentials | null = null;
  private readonly STORAGE_KEY = 'happy_credentials';

  set(credentials: HappyCredentials) {
    this.cache = credentials;
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(credentials));
  }

  get(): HappyCredentials | null {
    if (this.cache) return this.cache;

    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.cache = JSON.parse(stored);
      return this.cache;
    }

    return null;
  }

  clear() {
    this.cache = null;
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  isReady(): boolean {
    return this.get() !== null;
  }
}

export const credentialsService = new CredentialsService();