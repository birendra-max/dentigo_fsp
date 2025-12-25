export function logoutUser() {
  localStorage.removeItem('dentigo_user');
  localStorage.removeItem('dentigo_user_token');
  localStorage.removeItem('dentigo_user_base_url');
  localStorage.removeItem('theme');
  window.location.href = "/user";
}
