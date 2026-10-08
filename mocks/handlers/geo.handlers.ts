import { http, HttpResponse } from 'msw';

export const geoHandlers = [
  http.get('*/api/v1/geo/suggest', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || '';
    return HttpResponse.json({
      status: 'ok',
      data: [
        { placeId: 'sf-1', displayName: 'Mission District, San Francisco, CA', lat: 37.7599, lng: -122.4148, city: 'San Francisco' },
        { placeId: 'sf-2', displayName: 'Golden Gate Park, San Francisco, CA', lat: 37.7694, lng: -122.4862, city: 'San Francisco' },
        { placeId: 'sf-3', displayName: 'Ocean Beach, San Francisco, CA', lat: 37.7719, lng: -122.5113, city: 'San Francisco' },
      ],
    });
  }),

  http.get('*/api/v1/geo/reverse', () => {
    return HttpResponse.json({
      status: 'ok',
      data: {
        placeId: 'sf-1',
        displayName: 'San Francisco, CA',
        lat: 37.7749,
        lng: -122.4194,
        city: 'San Francisco',
      },
    });
  }),
];

