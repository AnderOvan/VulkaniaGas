package com.Vulkania.ev3.vulkanIA.dto;

/** Datos que el panel admin envía al crear/editar usuarios. rol: CLIENTE|ADMIN. estado: ACTIVO|INACTIVO. */
public class UsuarioAdminDTO {
    private String nombre;
    private String rut;
    private String email;
    private String password;
    private String rol;
    private String estado;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getRut() { return rut; }
    public void setRut(String rut) { this.rut = rut; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
