package com.Vulkania.ev3.vulkanIA.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Component
public class JwtUtil {

    private final String secret;
    private final long expiracionSegundos;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration-seconds}") long expiracionSegundos) {
        this.secret = secret;
        this.expiracionSegundos = expiracionSegundos;
    }

    public String generarToken(String email, String rol) {
        String header = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        long exp = (System.currentTimeMillis() / 1000) + expiracionSegundos;
        String payload = base64Url("{\"sub\":\"" + escapar(email) + "\",\"rol\":\"" + escapar(rol) + "\",\"exp\":" + exp + "}");
        return header + "." + payload + "." + firmar(header + "." + payload);
    }

    /** Devuelve {email, rol} si la firma es válida y el token no ha expirado; null en caso contrario. */
    public String[] validarYExtraer(String token) {
        try {
            String[] partes = token.split("\\.");
            if (partes.length != 3) return null;

            byte[] esperada = firmar(partes[0] + "." + partes[1]).getBytes(StandardCharsets.UTF_8);
            byte[] recibida = partes[2].getBytes(StandardCharsets.UTF_8);
            if (!MessageDigest.isEqual(esperada, recibida)) return null;

            String json = new String(Base64.getUrlDecoder().decode(partes[1]), StandardCharsets.UTF_8);
            long exp = Long.parseLong(extraerNumero(json, "exp"));
            if (exp < System.currentTimeMillis() / 1000) return null; // token vencido

            return new String[]{extraerCampo(json, "sub"), extraerCampo(json, "rol")};
        } catch (Exception e) {
            return null;
        }
    }

    private String firmar(String datos) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(datos.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String base64Url(String str) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(str.getBytes(StandardCharsets.UTF_8));
    }

    private String escapar(String texto) {
        return texto.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String extraerCampo(String json, String campo) {
        String buscar = "\"" + campo + "\":\"";
        int inicio = json.indexOf(buscar) + buscar.length();
        int fin = json.indexOf("\"", inicio);
        return json.substring(inicio, fin);
    }

    private String extraerNumero(String json, String campo) {
        String buscar = "\"" + campo + "\":";
        int inicio = json.indexOf(buscar) + buscar.length();
        int fin = inicio;
        while (fin < json.length() && Character.isDigit(json.charAt(fin))) fin++;
        return json.substring(inicio, fin);
    }
}
