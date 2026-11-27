package com.Vulkania.ev3.vulkanIA.config;

import org.springframework.stereotype.Component;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class JwtUtil {

    private static final String SECRET = "VulkaniaGasClaveSecretaSuperSegura2026";

    public String generarToken(String email, String rol) {
        String header = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        long exp = (System.currentTimeMillis() / 1000) + 86400; // 24 horas
        String payload = base64Url("{\"sub\":\"" + email + "\",\"rol\":\"" + rol + "\",\"exp\":" + exp + "}");
        String firma = firmar(header + "." + payload);
        return header + "." + payload + "." + firma;
    }

    public String[] validarYExtraer(String token) {
        try {
            String[] partes = token.split("\\.");
            if (partes.length != 3) return null;
            if (!firmar(partes[0] + "." + partes[1]).equals(partes[2])) return null;

            String json = new String(Base64.getUrlDecoder().decode(partes[1]), StandardCharsets.UTF_8);
            String email = extraerCampo(json, "sub");
            String rol = extraerCampo(json, "rol");
            return new String[]{email, rol};
        } catch (Exception e) {
            return null;
        }
    }

    private String firmar(String datos) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(datos.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String base64Url(String str) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(str.getBytes(StandardCharsets.UTF_8));
    }

    private String extraerCampo(String json, String campo) {
        String buscar = "\"" + campo + "\":\"";
        int inicio = json.indexOf(buscar) + buscar.length();
        int fin = json.indexOf("\"", inicio);
        return json.substring(inicio, fin);
    }
}