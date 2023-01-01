import { VULNERABLE_DOMAINS } from '../constants';

export type IsVulnerableDomainFunction = (url: string) => boolean;

export const isVulnerableDomain: IsVulnerableDomainFunction = (href) => {
  try {
    const url = new URL(href);

    const hostWithoutWordWideWebPrefix: string = url?.host.replace(/(?<replacer>^www.)/g, '');
 
    return VULNERABLE_DOMAINS.includes(hostWithoutWordWideWebPrefix);
  } catch (error: any) { return true } // prettier-ignore
};
