import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


interface User {
    email: string
    name?: string
    avatar?: string
    id:string;
}
interface profileStoreState {
    user: User | null;
    appLoading:boolean;
}

interface profileStoreActions {
    setUser: (user: profileStoreState['user']) => void
    setAppLoading:(loading:boolean) => void;
}
interface ProfileStore extends profileStoreState, profileStoreActions { }

const initialState: profileStoreState = {
    user: null,
    appLoading:true
}

export const useProfileStore = create<ProfileStore>()(
    persist(
        (set, get) => ({
            ...initialState,
            setUser: (user) => set({ user }),
            setAppLoading(loading) {
                set({appLoading:loading})
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
)
