export type QrType = 'personal' | 'business' | 'influencer' | 'event_campaign' | 'wifi' | 'url_forward';

export type WifiInput = {
  ssid: string;
  password?: string;
  encryption: 'WPA2' | 'WPA' | 'WEP' | 'NONE';
  hidden?: boolean;
};

export type UrlForwardInput = {
  destinationUrl: string;
};

export function isValidAbsoluteHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateQrCreateInput(input: {
  qrType: QrType;
  name?: string;
  wifi?: WifiInput;
  urlForward?: UrlForwardInput;
}) {
  const qrType = input.qrType;

  if (qrType === 'wifi') {
    const wifi = input.wifi;
    if (!wifi) throw new Error('Wi-Fi settings are required');
    if (!wifi.ssid?.trim()) throw new Error('Wi-Fi SSID is required');
    if (!['WPA2', 'WPA', 'WEP', 'NONE'].includes(wifi.encryption)) {
      throw new Error('Wi-Fi encryption must be WPA2, WPA, WEP, or NONE');
    }
    if (wifi.encryption !== 'NONE' && !wifi.password?.trim()) {
      throw new Error('Wi-Fi password is required unless encryption is NONE');
    }
    return;
  }

  if (qrType === 'url_forward') {
    const destination = input.urlForward?.destinationUrl?.trim() ?? '';
    if (!destination) throw new Error('Destination URL is required');
    if (!isValidAbsoluteHttpUrl(destination)) {
      throw new Error('Destination URL must be a valid absolute http/https URL');
    }
    return;
  }

  if (!input.name?.trim()) {
    throw new Error('Name is required');
  }
}

export function buildWifiPayload(wifi: WifiInput) {
  const esc = (v: string) => v.replace(/([\\;,:\"])/g, '\\$1');
  const pieces = [`T:${wifi.encryption}`, `S:${esc(wifi.ssid)}`];
  if (wifi.encryption !== 'NONE') pieces.push(`P:${esc(wifi.password ?? '')}`);
  if (wifi.hidden) pieces.push('H:true');
  return `WIFI:${pieces.join(';')};;`;
}
