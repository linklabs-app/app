function deg_to_rad(deg: number) {
  return deg * Math.PI / 180
}

export function sin(deg: number) {
  return Math.sin(deg_to_rad(deg))
}

export function distance_on_sphere(r: number, lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLat = deg_to_rad(lat2 - lat1);
  const dLon = deg_to_rad(lon2 - lon1);

  const rLat1 = deg_to_rad(lat1);
  const rLat2 = deg_to_rad(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return r * c;
}
