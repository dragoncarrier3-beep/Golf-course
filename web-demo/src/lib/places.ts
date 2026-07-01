const PLACES_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

export interface PlaceResult {
  placeId: string;
  name: string;
  city: string;
  state: string;
  formattedAddress: string;
}

export async function searchGolfCourses(query: string): Promise<PlaceResult[]> {
  if (!query.trim()) return [];

  if (!PLACES_KEY) {
    return getOfflineFallbackCourses(query);
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    url.searchParams.set('query', `${query} golf course`);
    url.searchParams.set('key', PLACES_KEY);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Places API unavailable');
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return getOfflineFallbackCourses(query);
    }

    return (data.results ?? []).slice(0, 8).map((r: Record<string, unknown>) => {
      const components = (r.address_components as Array<{ long_name: string; short_name?: string; types: string[] }>) ?? [];
      const city =
        components.find((c) => c.types.includes('locality'))?.long_name ??
        components.find((c) => c.types.includes('administrative_area_level_2'))?.long_name ??
        '';
      const state =
        components.find((c) => c.types.includes('administrative_area_level_1'))?.short_name ?? '';
      return {
        placeId: r.place_id as string,
        name: r.name as string,
        city,
        state,
        formattedAddress: (r.formatted_address as string) ?? '',
      };
    });
  } catch {
    return getOfflineFallbackCourses(query);
  }
}

function getOfflineFallbackCourses(query: string): PlaceResult[] {
  const courses = [
    { name: 'Pebble Beach Golf Links', city: 'Pebble Beach', state: 'CA' },
    { name: 'Augusta National Golf Club', city: 'Augusta', state: 'GA' },
    { name: 'St Andrews Old Course', city: 'St Andrews', state: 'Scotland' },
    { name: 'TPC Sawgrass', city: 'Ponte Vedra Beach', state: 'FL' },
    { name: 'Bethpage Black', city: 'Farmingdale', state: 'NY' },
    { name: 'Torrey Pines South', city: 'La Jolla', state: 'CA' },
  ];
  const q = query.toLowerCase();
  return courses
    .filter((c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q))
    .map((c, i) => ({
      placeId: `offline-${i}`,
      name: c.name,
      city: c.city,
      state: c.state,
      formattedAddress: `${c.city}, ${c.state}`,
    }));
}
