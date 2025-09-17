// This file is located at 'app/_layout.tsx'
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false, // Hides the title bar at the top
            tabBarActiveTintColor: 'white',
            tabBarStyle: {
                backgroundColor: '#1c1c1c',
                borderTopColor: '#333',
            }
        }}>
            <Tabs.Screen
                name="platform" // This corresponds to 'app/platform.tsx'
                options={{
                    title: 'Platform',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cube" color={color} />,
                }}
            />
            <Tabs.Screen
                name="bookshelf" // This corresponds to 'app/bookshelf.tsx'
                options={{
                    title: 'Bookshelf',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
                }}
            />
        </Tabs>
    );
}
