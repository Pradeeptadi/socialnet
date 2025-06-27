import whois
import dns.resolver
import socket
import ssl
import requests
from ipwhois import IPWhois

# WHOIS Info
def get_whois_info(domain):
    try:
        w = whois.whois(domain)
        return {
            "registrar": w.registrar,
            "creation_date": str(w.creation_date),
            "expiration_date": str(w.expiration_date),
            "name_servers": w.name_servers,
            "emails": w.emails,
        }
    except Exception as e:
        return {"error": f"WHOIS lookup failed: {str(e)}"}

# DNS Records
def get_dns_records(domain):
    records = {}
    try:
        for rtype in ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME']:
            try:
                answers = dns.resolver.resolve(domain, rtype)
                records[rtype] = [r.to_text() for r in answers]
            except:
                records[rtype] = []
    except Exception as e:
        records['error'] = f"DNS lookup failed: {str(e)}"
    return records

# IP Geolocation
def get_domain_ip_info(domain):
    try:
        ip = socket.gethostbyname(domain)
        obj = IPWhois(ip)
        result = obj.lookup_rdap()
        return {
            "ip": ip,
            "asn": result.get("asn"),
            "country": result.get("network", {}).get("country"),
            "org": result.get("network", {}).get("name"),
        }
    except Exception as e:
        return {"error": f"IP lookup failed: {str(e)}"}

# SSL Certificate
def get_ssl_info(domain):
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=domain) as s:
            s.settimeout(5)
            s.connect((domain, 443))
            cert = s.getpeercert()
            return {
                "issuer": dict(x[0] for x in cert.get("issuer", [])),
                "subject": dict(x[0] for x in cert.get("subject", [])),
                "valid_from": cert.get("notBefore"),
                "valid_to": cert.get("notAfter"),
            }
    except Exception as e:
        return {"error": f"SSL fetch failed: {str(e)}"}

# Subdomain Enumeration using crt.sh
def get_subdomains(domain):
    try:
        url = f"https://crt.sh/?q=%25.{domain}&output=json"
        r = requests.get(url, timeout=10)
        data = r.json()
        subdomains = set()
        for item in data:
            name = item.get("name_value")
            if name:
                for sub in name.split("\n"):
                    sub = sub.strip()
                    if domain in sub:
                        subdomains.add(sub)
        return sorted(list(subdomains))
    except Exception as e:
        return {"error": f"Subdomain lookup failed: {str(e)}"}

# Domain Reputation
def get_blacklist_status(domain):
    try:
        # Example placeholder logic (can be expanded using VirusTotal or others)
        google_safe_url = f"https://transparencyreport.google.com/safe-browsing/search?url={domain}"
        return {
            "google_safe_browsing": google_safe_url,
            "status": "not checked automatically"  # Upgrade: integrate Google/VirusTotal API
        }
    except Exception as e:
        return {"error": f"Blacklist check failed: {str(e)}"}

# Technology Fingerprinting - Placeholder
def get_technologies(domain):
    try:
        return {
            "tech_stack": "N/A - Use Wappalyzer API or BuiltWith"
        }
    except Exception as e:
        return {"error": f"Tech detection failed: {str(e)}"}
