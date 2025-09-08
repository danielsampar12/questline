# Quest App - React Native Location-Based Game

A React Native quest/geocaching app built with Expo that challenges users to solve riddles and find specific locations using GPS coordinates.

## Features

- 🎯 **Location-based quests** with riddles and hints
- 📍 **High-accuracy GPS** location detection
- 🏆 **Progress tracking** with points and streaks
- 🎨 **Modern UI** with React Native Paper
- ⚡ **Performance optimized** with custom hooks
- 🔄 **Quest progression** system

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Native Paper** for UI components
- **Expo Location** for GPS functionality
- **Custom hooks** for state management

## Architecture

### Core Components

- `QuestScreen` - Main game interface
- `useLocation` - Location management hook
- `useQuest` - Quest logic and progression
- `locationUtils` - Distance calculations and utilities

### Quest System

- **Quest Data Structure**: Each quest has a riddle, target location, difficulty, and points
- **Location Accuracy**: Configurable accuracy radius for each quest
- **Progress Tracking**: Points, streaks, and completion status
- **Direction Hints**: Compass directions to help guide users

### Location Features

- **Haversine Formula**: Accurate distance calculations between GPS coordinates
- **High Accuracy GPS**: Uses `Location.Accuracy.High` for precise positioning
- **Error Handling**: Comprehensive error handling for location services
- **Permission Management**: Graceful permission request flow

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm start
   ```

3. **Run on device/simulator**:
   ```bash
   npm run ios    # iOS
   npm run android # Android
   ```

## Usage

1. **Grant Location Permission**: The app will request location access
2. **Start a Quest**: Tap "Start Quest" to begin your first adventure
3. **Follow the Riddle**: Read the riddle and hint to find the target location
4. **Check Location**: Tap "Check Location" when you think you're in the right place
5. **Complete Quests**: Successfully find locations to earn points and unlock new quests

## Quest Configuration

Quests are defined in `src/data/quests.ts`. Each quest includes:

```typescript
{
  id: 'quest-1',
  title: 'The Hidden Treasure',
  riddle: 'Where the old oak tree once stood...',
  hint: 'Look for a building with a clock tower',
  targetLocation: {
    latitude: -26.9020959,
    longitude: -49.0811795,
    accuracy: 50 // 50 meter radius
  },
  completed: false,
  difficulty: 'easy',
  points: 100
}
```

## Location Accuracy

The app uses multiple methods for accurate location detection:

1. **Haversine Formula**: Calculates great-circle distances between coordinates
2. **High Accuracy GPS**: Uses the most precise location settings
3. **Error Handling**: Graceful fallbacks for location failures
4. **Direction Hints**: Provides compass directions to guide users

## Performance Optimizations

- **Custom Hooks**: Separated concerns for better reusability
- **Memoized Calculations**: Optimized distance calculations
- **Error Boundaries**: Graceful error handling
- **Loading States**: Better user experience during location requests

## Development Best Practices

- **TypeScript**: Full type safety throughout the app
- **Custom Hooks**: Reusable logic separation
- **Error Handling**: Comprehensive error management
- **User Experience**: Loading states and clear feedback
- **Code Organization**: Clean folder structure and separation of concerns

## Troubleshooting

### Location Issues

- Ensure location services are enabled on the device
- Check that the app has location permissions
- Try moving to an open area for better GPS signal
- Restart the app if location requests fail

### Quest Issues

- Verify quest coordinates are correct
- Check that the accuracy radius is appropriate for the location
- Ensure the riddle and hint are clear and helpful

## Future Enhancements

- [ ] Offline quest support
- [ ] Social features and leaderboards
- [ ] Custom quest creation
- [ ] Augmented reality integration
- [ ] Push notifications for nearby quests
- [ ] Quest categories and themes
