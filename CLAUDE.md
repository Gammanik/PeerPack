# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PeerPack is a P2P courier delivery platform built as a Telegram Mini App. Users can find couriers traveling between cities to deliver packages, or offer their own trips as couriers. The app uses React + Vite with a complete mock API layer ready for backend integration.

## Development Commands

```bash
# Development
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npm run deploy       # Deploy to GitHub Pages
```

## Architecture Overview

### Core Structure
- **Monolithic Main Component**: `src/SearchCouriers.jsx` (993 lines) - serves as the main app container with all routing logic and 40+ useState hooks
- **API Service Layer**: Complete HTTP simulation with realistic delays in `src/services/api.js`
- **Custom Hooks**: Business logic abstracted into reusable hooks in `src/hooks/useApi.js`
- **Mock Data**: Full API specification and test data in `src/data/api-mock-data.json`
- **Utility Functions**: Courier sorting and rating utilities in `src/utils/courierUtils.js`

### State Management Pattern
The app uses React hooks with a custom API layer pattern:
- `useUserData()` - manages user packages and trips
- `useCourierSearch()` - handles courier search and filtering
- `usePackageActions()` - creates packages/trips and sends requests
- `useTripRequests()` - manages package requests for specific trips

### API Service Architecture
- **Mock HTTP Layer**: `ApiService` class simulates real HTTP calls with delays (300-1000ms)
- **Dynamic Data Generation**: Courier dates/times generated relatively to current time to avoid stale data
- **Complete Endpoint Coverage**: All endpoints documented in `api-mock-data.json` with request/response schemas

### Component Architecture
- **Monolithic Pattern**: Single `SearchCouriers.jsx` handles all routing/state
- **UI Components**: 13 components in `/components` for specific UI elements
- **Modal System**: Layered modals for courier details, forms, and profile screens
- **Telegram Theme Integration**: CSS variables for dark/light theme adaptation

## Key Development Patterns

### API Property Naming
Mock data uses snake_case (backend convention) while some components expect camelCase. Always check property names:
- API data: `trips_count`, `reviews_count`, `trip_comment`, `past_trips`
- Component props: Ensure proper mapping between data structures

### Dynamic Date Generation
Courier data uses relative time generation in `ApiService.generateDynamicCourierDates()` to ensure search results always show future departures. This prevents stale data issues common in static mock setups.

### Theme Integration
Uses Telegram Mini App CSS variables:
```css
var(--tg-theme-bg-color, #17212b)
var(--tg-theme-text-color, #ffffff) 
var(--tg-theme-button-color, #5288c1)
var(--tg-theme-hint-color, #708499)
```

### Animation System
Centralized animations in `src/styles/CourierAnimations.js` with CSS injection pattern. All animations use Telegram-friendly easing and respect motion preferences.

## Critical Architecture Notes

### Monolithic Structure
The main `SearchCouriers.jsx` component handles:
- All routing logic (search, profile, about pages)
- Global state management
- Modal state coordination
- API hook orchestration

This creates high coupling but allows rapid development. For production, consider extracting page-level components.

### Mock API Readiness
The mock API layer is production-ready for backend integration:
- Complete HTTP simulation with proper async/await patterns
- Realistic error handling and loading states
- Full CRUD operations for packages, trips, and courier interactions
- WebSocket-ready structure for real-time updates

### Data Flow Pattern
1. **API Hooks** fetch data and manage loading/error states
2. **SearchCouriers** coordinates multiple hooks and passes data down
3. **Components** receive data via props and trigger actions via callbacks
4. **Actions** flow back up to hooks which update API service

## Common Development Tasks

### Adding New API Endpoints
1. Add endpoint specification to `src/data/api-mock-data.json`
2. Implement mock response in `src/services/api.js` `getMockResponse()`
3. Add service method in `ApiService` class
4. Create or update hook in `src/hooks/useApi.js`
5. Integrate hook in component

### Property Name Mismatches
When data doesn't display, check for snake_case vs camelCase mismatches:
- API data uses: `trip_comment`, `trips_count`, `reviews_count`
- Some components expect: `tripComment`, `tripsCount`, `reviewsCount`
- Always verify property names in mock data vs component usage

### Telegram Mini App Integration
Current integration is theme-only. For full integration:
- Add Telegram WebApp script to `index.html`
- Use `window.Telegram.WebApp` API for buttons, haptic feedback
- Implement cloud storage for user preferences
- Add proper viewport meta tags for mobile optimization

## Testing Strategy

No formal testing framework is configured. For testing:
- Use browser dev tools to verify API calls via console logs
- Test responsive design with device emulation
- Verify Telegram theme variables in different modes
- Check dynamic date generation produces future timestamps

## Deployment Notes

- Built with Vite for fast development and optimized production builds
- Configured for GitHub Pages deployment via `gh-pages` package
- Static hosting ready (no server-side requirements)
- Environment variables not used (all configuration is hardcoded for demo)

## Performance Considerations

- **Large Bundle Size**: Monolithic structure loads all components upfront
- **No Memoization**: Components re-render frequently due to large state objects
- **No Virtualization**: Long courier lists could impact performance
- **Network Simulation**: Mock delays simulate real network conditions for UX testing