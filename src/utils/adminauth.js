export function logoutUser() {
  localStorage.removeItem('dentigo_admin');
  localStorage.removeItem('dentigo_admin_token');
  localStorage.removeItem('dentigo_admin_base_url');
  localStorage.removeItem('theme');
  window.location.href = "/admin";
}
