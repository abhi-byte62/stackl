package com.stacklens.security;

import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;

@Component
public class SsrfProtectionValidator {

    public static class ValidationResult {
        private final boolean valid;
        private final String message;
        private final URI sanitizedUri;

        public ValidationResult(boolean valid, String message, URI sanitizedUri) {
            this.valid = valid;
            this.message = message;
            this.sanitizedUri = sanitizedUri;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }

        public URI getSanitizedUri() {
            return sanitizedUri;
        }
    }

    public ValidationResult validate(String rawUrl) {
        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            return new ValidationResult(false, "URL cannot be empty", null);
        }

        String input = rawUrl.trim();
        if (!input.startsWith("http://") && !input.startsWith("https://")) {
            input = "https://" + input;
        }

        try {
            URI uri = new URI(input).normalize();

            String scheme = uri.getScheme();
            if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                return new ValidationResult(false, "Invalid protocol. Only HTTP and HTTPS are allowed.", null);
            }

            String host = uri.getHost();
            if (host == null || host.trim().isEmpty()) {
                return new ValidationResult(false, "Invalid hostname provided in URL.", null);
            }

            host = host.toLowerCase();

            // Block reserved internal domain suffixes
            if (host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".lan") || host.endsWith(".corp")
                    || host.equals("localhost") || host.equals("metadata.google.internal")) {
                return new ValidationResult(false, "Target host resolves to a private internal network name (SSRF Blocked).", null);
            }

            // Resolve IP addresses to verify no private / loopback routing
            InetAddress[] addresses;
            try {
                addresses = InetAddress.getAllByName(host);
            } catch (UnknownHostException e) {
                return new ValidationResult(false, "Target host could not be resolved via DNS.", null);
            }

            for (InetAddress addr : addresses) {
                if (isPrivateOrReservedIp(addr)) {
                    return new ValidationResult(false,
                            "Security Policy Blocked: Target host resolves to private/reserved IP: " + addr.getHostAddress(), null);
                }
            }

            return new ValidationResult(true, "URL is safe for scanning", uri);

        } catch (Exception e) {
            return new ValidationResult(false, "Malformed URL: " + e.getMessage(), null);
        }
    }

    public boolean isPrivateOrReservedIp(InetAddress address) {
        if (address.isAnyLocalAddress() || address.isLoopbackAddress() || address.isLinkLocalAddress()
                || address.isSiteLocalAddress() || address.isMulticastAddress()) {
            return true;
        }

        byte[] bytes = address.getAddress();

        // Check IPv4 ranges
        if (bytes.length == 4) {
            int b0 = bytes[0] & 0xFF;
            int b1 = bytes[1] & 0xFF;

            // 10.0.0.0/8
            if (b0 == 10) return true;

            // 172.16.0.0/12 (172.16.0.0 to 172.31.255.255)
            if (b0 == 172 && b1 >= 16 && b1 <= 31) return true;

            // 192.168.0.0/16
            if (b0 == 192 && b1 == 168) return true;

            // 169.254.0.0/16 (Link-local / AWS Metadata 169.254.169.254)
            if (b0 == 169 && b1 == 254) return true;

            // 127.0.0.0/8 (Loopback)
            if (b0 == 127) return true;

            // 0.0.0.0/8
            if (b0 == 0) return true;

            // 100.64.0.0/10 (Carrier-grade NAT)
            if (b0 == 100 && b1 >= 64 && b1 <= 127) return true;
        }

        return false;
    }
}
