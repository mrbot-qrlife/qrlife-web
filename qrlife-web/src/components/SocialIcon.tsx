import type { SocialKind } from '@/lib/storage';
import { Globe, Link2 } from 'lucide-react';
import {
  SiFacebook,
  SiInstagram,
  SiYoutube,
  SiTiktok,
  SiX,
  SiLinkedin,
} from 'react-icons/si';

export function SocialIcon({ kind, size = 18, title }: { kind: SocialKind; size?: number; title?: string }) {
  const props = { size, title: title ?? kind };

  switch (kind) {
    case 'facebook':
      return <SiFacebook {...props} />;
    case 'instagram':
      return <SiInstagram {...props} />;
    case 'youtube':
      return <SiYoutube {...props} />;
    case 'tiktok':
      return <SiTiktok {...props} />;
    case 'x':
      return <SiX {...props} />;
    case 'linkedin':
      return <SiLinkedin {...props} />;
    case 'website':
      return <Globe size={size} aria-label={title ?? kind} />;
    case 'custom':
    default:
      return <Link2 size={size} aria-label={title ?? kind} />;
  }
}
