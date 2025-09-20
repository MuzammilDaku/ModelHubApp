import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


interface User {
    email: string
    name?: string
    avatar?: string
}
interface profileStoreState {
    user: User | null
}

interface profileStoreActions {
    setUser: (user: profileStoreState['user']) => void
}
interface ProfileStore extends profileStoreState, profileStoreActions { }

const initialState: profileStoreState = {
    user: null,
}

export const useProfileStore = create<ProfileStore>()(
    persist(
        (set, get) => ({
            ...initialState,
            setUser: (user) => set({ user }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
)
