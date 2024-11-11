interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  usuario?: Usuario; // opcional, si quieres incluir información adicional del usuario
}

interface Usuario {
  id: number;
  nombre?: string;
  // Agrega otros campos según sea necesario
}
