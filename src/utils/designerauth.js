export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("dentigo_designer_token");
  localStorage.removeItem('theme');
  localStorage.removeItem('dentigo_designer_base_url');
  // redirect to login
  window.location.href = "/designer/login";
}
