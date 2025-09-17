// This file is located at 'app/(tabs)/_layout.tsx'
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'white',
            tabBarStyle: {
                backgroundColor: '#1c1c1c',
                borderTopColor: '#333',
            }
        }}>
            <Tabs.Screen
                name="index" // This now points to 'app/(tabs)/index.tsx'
                options={{
                    title: 'Platform', // You can name the tab whatever you like
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cube" color={color} />,
                }}
            />
            <Tabs.Screen
                name="bookshelf" // This still points to 'app/(tabs)/bookshelf.tsx'
                options={{
                    title: 'Bookshelf',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
                }}
            />
        </Tabs>
    );
}
